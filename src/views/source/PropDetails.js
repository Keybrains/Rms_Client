import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogTitle,
  FormGroup,
  Paper,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import Header from "components/Headers/Header";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
  Table,
  Form,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
} from "reactstrap";
import Tab from "@mui/material/Tab";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import MailIcon from "@mui/icons-material/Mail";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import DoneIcon from "@mui/icons-material/Done";
import fone from "../../assets/img/icons/common/property_bg.png";
import { RotatingLines } from "react-loader-spinner";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import { OpenImageDialog } from "components/OpenImageDialog";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

//financial
import {
  financialTypeArray,
  todayDate,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetIncome,
  handleImageChange,
} from "./Functions/Financial";

//units
import {
  formatDateWithoutTime,
  handleListingEdit,
  handleDeleteUnit,
  roomsArray,
  bathArray,
  handleSubmit,
  UnitEdite,
  handleUnitDetailsEdit,
  addAppliancesSubmit,
  editeAppliancesSubmit,
  deleteAppliance,
} from "./Functions/Units";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "./propdetail.css";

const PropDetails = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_URL;

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const { rental_id, admin } = useParams();

  const [value, setValue] = React.useState("summary");
  const [rentalData, setRentalData] = useState();
  const [rentalOwnerData, setRentalOwnerData] = useState("");
  const [propertyTypeData, setPropertyTypeData] = useState("");
  const [propertyUnitData, setpropertyUnitData] = useState("");
  const [tenantsData, setTenantsData] = useState([]);
  const [tenantsCount, setTenantsCount] = useState(0);
  const [workOrderData, setWorkOrderData] = useState("");
  const [staffMemberData, setStaffMemberData] = useState("");
  const [GeneralLedgerData, setGeneralLedgerData] = useState([]);
  const [clickedUnitObject, setClickedUnitObject] = useState([]);
  const [applianceData, setApplianceData] = useState([]);
  const [propImageLoader, setPropImageLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [unitImageLoader, setUnitImageLoader] = useState(false);
  const [financialType, setFinancialType] = useState("");
  const [open, setOpen] = useState(false);
  const [monthWiseData, setMonthWiseData] = useState("");
  const [threeMonths, setThreeMonths] = useState([]);
  const [allMonthData, setAllMonthData] = useState("");
  const [financialDropdown, setFinancialDropdown] = useState(false);
  const [propSummary, setPropSummary] = useState(false);
  const [month, setMonth] = useState([]);
  const [addAppliances, setAddAppliances] = useState(false);
  const [unitLeases, setunitLeases] = useState([]);
  const [isPhotoresDialogOpen, setPhotoresDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [openEdite, setOpenEdite] = useState("");
  const [accessType, setAccessType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const fetchRentalData = async () => {
    setLoader(true);
    try {
      const url = `${baseUrl}/rentals/rental_summary/${rental_id}`;
      const response = await axios.get(url);
      setRentalData(response.data.data[0]);
      setPropertyTypeData(response.data.data[0].property_type_data);
      setRentalOwnerData(response.data.data[0].rental_owner_data);
      setStaffMemberData(response.data.data[0].staffmember_data);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
    setLoading(false);
    setPropImageLoader(false);
  };

  const fetchUnitsData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `${baseUrl}/unit/rental_unit/${rental_id}`
      );
      setpropertyUnitData(response.data.data);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
    setLoading(false);
  };

  const fetchTenantData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `${baseUrl}/tenants/rental_tenant/${rental_id}`
      );
      setTenantsData(response.data.data);
      setTenantsCount(response.data.count);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
    setLoading(false);
  };

  const fetchWorkOrderData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `${baseUrl}/work-order/rental_workorder/${rental_id}`
      );
      setWorkOrderData(response.data.data);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
    setLoading(false);
  };

  const fatchunit = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `${baseUrl}/leases/unit_leases/${clickedUnitObject?.unit_id}`
      );
      setunitLeases(response.data.data);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
    setLoading(false);
  };
  console.log(unitLeases, "dd");
  useEffect(() => {
    fatchunit();
  }, [clickedUnitObject]);

  console.log("clickedUnitObject?.unit_id", clickedUnitObject?.unit_id);

  const getStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today >= start && today <= end) {
      return "Active";
    } else if (today < start) {
      return "Inactive";
    } else if (today > end) {
      return "Inactive";
    } else {
      return "-";
    }
  };

  useEffect(() => {
    fetchRentalData();
    fetchUnitsData();
    fetchTenantData();
    fetchWorkOrderData();
  }, [rental_id]);

  const fetchApplianceData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/appliance/appliance/${clickedUnitObject.unit_id}`
      );
      setApplianceData(response.data.data);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
  };

  useEffect(() => {
    fetchApplianceData();
  }, [clickedUnitObject]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggle = () => setFinancialDropdown((prevState) => !prevState);

  const totals = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  };

  const totals2 = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  };

  const totalIncome = monthWiseData[month]?.reduce(
    (total, data) => total + parseFloat(data.amount || 0),
    0
  );

  const totalExpenses = allMonthData[month]?.reduce(
    (total, data) => total + parseFloat(data.amount || 0),
    0
  );

  const netIncome = totalIncome - totalExpenses || 0;

  const handleFinancialSelection = (value) => {
    setFinancialType(value);
    setMonth(todayDate());
  };

  const addUnitFormik = useFormik({
    initialValues: {
      rental_unit: "",
      rental_unit_adress: "",
      rental_sqft: "",
      rental_bath: "",
      rental_bed: "",
      rental_images: [],
    },

    onSubmit: async (values) => {
      try {
        let res;

        if (clickedUnitObject.unit_id) {
          res = await handleUnitDetailsEdit(
            clickedUnitObject?.unit_id,
            values,
            selectedFiles
          );
        } else {
          res = await handleSubmit(
            rentalData?.rental_id,
            accessType.admin_id,
            values,
            selectedFiles
          );
        }

        if (res === false) {
          setOpenEdite(false);
          addUnitFormik.resetForm();
          fetchUnitsData();
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    },
  });

  const addAppliancesFormin = useFormik({
    initialValues: {
      appliance_name: "",
      appliance_description: "",
      installed_date: "",
      appliance_id: "",
    },
    validationSchema: yup.object({
      appliance_name: yup.string().required("Appliance Name Required"),
      appliance_description: yup.string().required("Descriprion Required"),
      installed_date: yup.date().required("Installed Date Required"),
    }),
    onSubmit: async (values) => {
      try {
        let res;
        if (values.appliance_id === "") {
          res = await addAppliancesSubmit(
            clickedUnitObject.unit_id,
            accessType.admin_id,
            values
          );
        } else {
          res = await editeAppliancesSubmit(values);
        }

        if (res === false) {
          setAddAppliances(!addAppliances);
          addAppliancesFormin.resetForm();
          fetchApplianceData();
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    },
  });

  const closeModal = () => {
    setOpenEdite(false);
    addUnitFormik.resetForm();
    setClickedUnitObject([]);
  };

  const openEditeTab = async (event, unit) => {
    event.stopPropagation();
    setOpenEdite(true);
    setClickedUnitObject(unit);
    setSelectedFiles(unit?.rental_images);
    addUnitFormik.setValues({
      rental_unit: unit?.rental_unit,
      rental_unit_adress: unit?.rental_unit_adress,
      rental_sqft: unit?.rental_sqft,
      rental_bath: unit?.rental_bath,
      rental_bed: unit?.rental_bed,
      rental_images: unit?.rental_images,
    });
  };

  const clearSelectedPhoto = (index, name) => {
    if (name === "rental_images") {
      const filteredImage2 = selectedFiles.filter((item, i) => i !== index);
      setSelectedFiles(filteredImage2);
    }
  };

  const fileData = (e) => {
    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...e.target.files,
    ]);
  };

  const togglePhotoresDialog = () => {
    setPhotoresDialogOpen((prevState) => !prevState);
  };

  const countTenantsByUnit = () => {
    for (const tenant of tenantsData) {
      for (const unit of propertyUnitData) {
        if (tenant.unit_id === unit.unit_id) {
        }
      }
    }
  };

  useEffect(() => {
    countTenantsByUnit();
  }, [tenantsData, propertyUnitData]);

  // =====================================================================

  const [showModal, setShowModal] = useState(false);
  const [clickedObject, setClickedObject] = useState({});
  const handleMoveOutClick = (tenant) => {
    console.log("Move out button clicked");
    setClickedObject(tenant);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  // ============================================================================

  const [moveOutDate, setMoveOutDate] = useState("");
  const [noticeGivenDate, setNoticeGivenDate] = useState("");

  useEffect(() => {
    // Set noticeGivenDate to the current date when the component mounts
    const currentDate = new Date().toISOString().split("T")[0];
    setNoticeGivenDate(currentDate);
  }, []);
  const handleMoveout = (lease_id) => {
    if (moveOutDate && noticeGivenDate) {
      const updatedApplicant = {
        moveout_date: moveOutDate,
        moveout_notice_given_date: noticeGivenDate,
      };

      axios
        .put(`${baseUrl}/leases/lease_moveout/${lease_id}`, updatedApplicant)
        .then((res) => {
          console.log(res, "res");
          if (res.data.statusCode === 200) {
            toast.success("Move-out Successfully", {
              position: "top-center",
              autoClose: 500,
            });
            // Close the modal if the status code is 200
            handleModalClose();
            tenantsData();
          }
        })
        .catch((err) => {
          toast.error("An error occurred while Move-out", {
            position: "top-center",
            autoClose: 500,
          });
          console.error(err);
        });
    } else {
      toast.error("NOTICE GIVEN DATE && MOVE-OUT DATE must be required", {
        position: "top-center",
        autoClose: 500,
      });
    }
  };

  return (
    <>
      <Header />
      <Modal isOpen={showModal}>
        <ModalHeader className="bg-secondary text-white">
          <strong style={{ fontSize: 18 }}>Move out tenants</strong>
        </ModalHeader>
        <ModalBody>
          <div>
            Select tenants to move out. If everyone is moving, the lease will
            end on the last move-out date. If some tenants are staying, you’ll
            need to renew the lease. Note: Renters insurance policies will be
            permanently deleted upon move-out.
          </div>
          <hr />
          {/* {rentaldata?.map((country) => ( */}
          <React.Fragment>
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>Address / Unit</th>
                  <th>LEASE TYPE</th>
                  <th>START - END</th>
                </tr>
              </thead>
              <tbody>
                {/* Example rows */}
                <tr>
                  <td>
                    {clickedObject.rental_adress}
                    {clickedObject.rental_unit !== "" &&
                      clickedObject.rental_unit !== undefined
                      ? `- ${clickedObject.rental_unit}`
                      : null}
                  </td>
                  <td>Fixed</td>
                  <td>
                    {clickedObject.start_date} {clickedObject.end_date}
                  </td>
                </tr>
                {/* Add more rows dynamically based on your data */}
              </tbody>
            </Table>
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>TENANT</th>
                  <th>NOTICE GIVEN DATE</th>
                  <th>MOVE-OUT DATE</th>
                </tr>
              </thead>
              <tbody>
                {/* Example rows */}
                <tr>
                  <td>
                    {clickedObject.tenant_firstName}{" "}
                    {clickedObject.tenant_lastName}
                  </td>
                  <td>
                    <div className="col">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Notice Given Date"
                        value={noticeGivenDate}
                        onChange={(e) => setNoticeGivenDate(e.target.value)}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="col">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Move-out Date"
                        value={moveOutDate}
                        onChange={(e) => setMoveOutDate(e.target.value)}
                      />
                    </div>
                  </td>
                </tr>
                {/* Add more rows dynamically based on your data */}
              </tbody>
            </Table>
          </React.Fragment>
        </ModalBody>
        <ModalFooter>
          <Button
            style={{ backgroundColor: "#008000" }}
            onClick={() => handleMoveout(clickedObject.lease_id)}
          >
            Move out
          </Button>
          <Button
            style={{ backgroundColor: "#ffffff" }}
            onClick={handleModalClose}
          >
            Close
          </Button>
          {/* You can add additional buttons or actions as needed */}
        </ModalFooter>
      </Modal>
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <h1 style={{ color: "white" }}>{rentalData?.rental_adress}</h1>
            <h4 style={{ color: "white" }}>
              {propertyTypeData?.property_type}
            </h4>
          </Col>
          <Col className="text-right">
            <Button
              color="primary"
              onClick={() => {
                navigate("/" + admin + "/propertiesTable");
                setClickedUnitObject([]);
              }}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0"></CardHeader>
              <Col>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab
                        label="Summary"
                        style={{ textTransform: "none" }}
                        value="summary"
                      />
                      {/* <Tab
                        label="Financial"
                        style={{ textTransform: "none" }}
                        value="financial"
                      /> */}
                      <Tab
                        label={`Units (${propertyUnitData?.length || 0})`}
                        style={{ textTransform: "none" }}
                        value="units"
                      />

                      {/* <Tab
                        label="Task"
                        style={{ textTransform: "none" }}
                        value="Task"
                      /> */}
                      <Tab
                        label={`Tenant (${tenantsCount})`}
                        style={{ textTransform: "none" }}
                        value="Tenant"
                      />
                    </TabList>
                  </Box>

                  <TabPanel value="summary">
                    <div className="main d-flex justify-content-start mainnnnn col-lg-8 col-md-10 col-sm-12" style={{ border: "1px solid rgb(210 205 205) ", borderRadius: "10px" }} >
                      {!propImageLoader ? (
                        <>
                          <div className="col-md-4 mt-2">
                            <label
                              htmlFor="rental_image"
                              style={{
                                width: "260px",
                                height: "180px",
                              }}
                            >
                              <img
                                src={
                                  rentalData?.rental_image
                                    ? rentalData?.rental_image
                                    : fone
                                }
                                className="img-fluid rounded-start m-image card-image"
                                alt={"..."}
                                style={{
                                  width: "260px",
                                  aspectRatio: "3/2",
                                  overflow: 'hidden',
                                  objectFit: "contain",
                                }}
                              />
                            </label>
                            <TextField
                              id="rental_image"
                              name="rental_image"
                              type="file"
                              inputProps={{
                                accept: "image/*",
                                multiple: false,
                              }}
                              onChange={async (e) => {
                                setPropImageLoader(true);
                                const res = await handleImageChange(
                                  e,
                                  rentalData.rental_id
                                );
                                if (res === true) {
                                  fetchRentalData();
                                } else {
                                  console.error("Image upload failed");
                                  setPropImageLoader(false);
                                }
                              }}
                              style={{ display: "none" }}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="col-md-3 mt-2 d-flex justify-content-center">
                          <RotatingLines
                            strokeColor="grey"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="50"
                            visible={propImageLoader}
                          />
                        </div>
                      )}

                      <div className="col-md-4 col-sm-12 propertydetail mx-3" >
                        <div
                          className="card-body mt-1"
                          style={{ padding: "0" }}
                        >
                          <h5 className="">Property details</h5>
                          <div className="h6" style={{ color: "#767676" }}>
                            ADDRESS
                          </div>
                          <span
                            className="address"
                            style={{ fontSize: "14px" }}
                          >
                            {propertyTypeData?.property_type
                              ? propertyTypeData?.property_type + ","
                              : ""}
                          </span>
                          <br />
                          <span
                            className="address"
                            style={{ fontSize: "14px" }}
                          >
                            {" "}
                            {rentalData?.rental_adress
                              ? rentalData?.rental_adress + ","
                              : ""}
                          </span>
                          <br />
                          <span
                            className="address"
                            style={{ fontSize: "14px" }}
                          >
                            {" "}
                            {rentalData?.rental_city
                              ? rentalData?.rental_city + ","
                              : ""}
                          </span>
                          <span
                            className="address"
                            style={{ fontSize: "14px" }}
                          >
                            {" "}
                            {rentalData?.rental_state
                              ? rentalData?.rental_state + ","
                              : ""}
                          </span>
                          <br />
                          <span
                            className="address"
                            style={{ fontSize: "14px" }}
                          >
                            {" "}
                            {rentalData?.rental_country
                              ? rentalData?.rental_country + ","
                              : ""}
                          </span>
                          <span
                            className="address"
                            style={{ fontSize: "14px" }}
                          >
                            {" "}
                            {rentalData?.rental_postcode
                              ? rentalData?.rental_postcode
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>


                    <div className="table-responsive d-flex">
                      <Table
                        className="align-items-center table-flush"
                        responsive
                        style={{ width: "100%" }}
                      >
                        {loading ? (
                          <tbody>
                            <tr>
                              <td>Loading Property details...</td>
                            </tr>
                          </tbody>
                        ) : rentalOwnerData ? (
                          <>
                            <div className="table-responsive">
                              <div className="row m-3">
                                <div className="col-12">
                                  <div
                                    className="align-items-center table-flush"
                                    responsive
                                    style={{ width: "100%" }}
                                  >
                                    {loading ? (
                                      <tbody>
                                        <tr>
                                          <td>Loading tenant details...</td>
                                        </tr>
                                      </tbody>
                                    ) : (
                                      <div className="w-100">
                                        <Row
                                          className="w-100 my-3 "
                                          style={{
                                            fontSize: "18px",
                                            textTransform: "capitalize",
                                            color: "#000",
                                            fontWeight: "600",
                                            borderBottom: "1px solid #ddd",
                                          }}
                                        >
                                          <Col>Rental owners</Col>
                                        </Row>
                                        <Row
                                          className="mb-1 m-0 p-0"
                                          style={{
                                            fontSize: "12px",
                                            color: "#000",
                                          }}
                                        >
                                          <Table>
                                            <tbody
                                              className="tbbody p-0 m-0"
                                              style={{
                                                borderTopRightRadius: "5px",
                                                borderTopLeftRadius: "5px",
                                                borderBottomLeftRadius: "5px",
                                                borderBottomRightRadius: "5px",
                                              }}
                                            >
                                              <tr className="header">
                                                <th>Name</th>
                                                <th>Company Name</th>
                                                <th>E-Mail</th>
                                                <th>Phone Number</th>
                                                <th>Home Number</th>
                                                <th>Business Numberr</th>
                                              </tr>
                                              {rentalOwnerData ? (
                                                <>
                                                  <>
                                                    <tr className="body">
                                                      <td>
                                                        {`${rentalOwnerData.rentalOwner_firstName ||
                                                          "N/A"
                                                          } ${rentalOwnerData.rentalOwner_lastName ||
                                                          "N/A"
                                                          }`}
                                                      </td>
                                                      <td>
                                                        {rentalOwnerData.rentalOwner_companyName ||
                                                          "N/A"}
                                                      </td>{" "}
                                                      <td>
                                                        {rentalOwnerData.rentalOwner_primaryEmail ||
                                                          "N/A"}
                                                      </td>
                                                      <td>
                                                        {rentalOwnerData.rentalOwner_phoneNumber ||
                                                          "N/A"}
                                                      </td>
                                                      <td>
                                                        {rentalOwnerData.rentalOwner_homeNumber ||
                                                          "N/A"}
                                                      </td>
                                                      <td>
                                                        {rentalOwnerData.rentalOwner_businessNumber ||
                                                          "N/A"}
                                                      </td>
                                                    </tr>
                                                  </>
                                                </>
                                              ) : null}
                                            </tbody>
                                          </Table>
                                        </Row>

                                        <Row
                                          className="w-100 my-3 "
                                          style={{
                                            fontSize: "18px",
                                            textTransform: "capitalize",
                                            color: "#000",
                                            fontWeight: "600",
                                            borderBottom: "1px solid #ddd",
                                          }}
                                        >
                                          <Col>Staff Details</Col>
                                        </Row>
                                        <Row
                                          className="mb-1 m-0 p-0"
                                          style={{
                                            fontSize: "12px",
                                            color: "#000",
                                          }}
                                        >
                                          <Table>
                                            <tbody
                                              className="tbbody p-0 m-0"
                                              style={{
                                                borderTopRightRadius: "5px",
                                                borderTopLeftRadius: "5px",
                                                borderBottomLeftRadius: "5px",
                                                borderBottomRightRadius: "5px",
                                              }}
                                            >
                                              <tr className="header">
                                                <th>Staff Member</th>
                                              </tr>
                                              {staffMemberData ? (
                                                <>
                                                  <>
                                                    <tr className="body">
                                                      <td>
                                                        {`${staffMemberData?.staffmember_name ||
                                                          "No staff member assigned"
                                                          }`}
                                                      </td>
                                                    </tr>
                                                  </>
                                                </>
                                              ) : null}
                                            </tbody>
                                          </Table>
                                        </Row>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <tbody>
                            <tr>
                              <td>No details found.</td>
                            </tr>
                          </tbody>
                        )}
                      </Table>
                    </div>
                  </TabPanel>

                  <TabPanel value="financial">
                    <Col
                      lg="6"
                      className="text-primary text-lg font-weight-bold"
                    >
                      <FormGroup>
                        <Dropdown isOpen={financialDropdown} toggle={toggle}>
                          <DropdownToggle
                            caret
                            color="primary"
                            style={{
                              background: "white",
                              color: "blue",
                            }}
                          >
                            {financialType
                              ? financialType
                              : "Month to date" &&
                              setFinancialType("Month to date")}
                          </DropdownToggle>
                          <DropdownMenu>
                            {financialTypeArray.map((subtype, index) => (
                              <DropdownItem
                                key={index}
                                onClick={() =>
                                  handleFinancialSelection(subtype)
                                }
                              >
                                {subtype}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>

                    {loader ? (
                      <div>Loading...</div>
                    ) : (
                      <>
                        {financialType === "All" && (
                          <Table responsive>
                            <thead>
                              <th>Property account</th>
                              <th>Amount</th>
                              <th>Date</th>
                            </thead>
                            <tbody>
                              <React.Fragment>
                                <tr>
                                  <th
                                    style={{
                                      color: "blue",
                                      fontWeight: "bold",
                                      backgroundColor: "#f0f0f0",
                                    }}
                                    colSpan="3"
                                  >
                                    Income
                                  </th>
                                </tr>
                                {GeneralLedgerData.map((property, index) => (
                                  <React.Fragment key={index}>
                                    {property.unit.map((unit, unitIndex) => (
                                      <React.Fragment key={unitIndex}>
                                        {unit.paymentAndCharges &&
                                          unit.paymentAndCharges
                                            .sort(
                                              (a, b) =>
                                                new Date(b.date) -
                                                new Date(a.date)
                                            )
                                            .map((charge, chargeIndex) => (
                                              <React.Fragment key={chargeIndex}>
                                                <tr>
                                                  <th>{charge.account}</th>
                                                  <td>
                                                    ${charge.amount || "0.00"}
                                                  </td>
                                                  <td>{charge.date}</td>
                                                </tr>
                                              </React.Fragment>
                                            ))}
                                      </React.Fragment>
                                    ))}
                                    <tr>
                                      <th
                                        style={{
                                          color: "black",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Total income
                                      </th>
                                      <td
                                        style={{
                                          color: "black",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        ${calculateTotalIncome(property)}
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                ))}
                                <tr>
                                  <th
                                    style={{
                                      color: "blue",
                                      fontWeight: "bold",
                                      backgroundColor: "#f0f0f0",
                                    }}
                                    colSpan="3"
                                  >
                                    Expenses
                                  </th>
                                  <td></td>
                                </tr>
                                {GeneralLedgerData.map((property, index) => (
                                  <React.Fragment key={index}>
                                    {property.unit.map((unit, unitIndex) => (
                                      <React.Fragment key={unitIndex}>
                                        {unit.property_expense &&
                                          unit.property_expense
                                            .sort(
                                              (a, b) =>
                                                new Date(b.date) -
                                                new Date(a.date)
                                            )
                                            .map((expense, expenseIndex) => (
                                              <React.Fragment
                                                key={expenseIndex}
                                              >
                                                <tr>
                                                  <th>{expense.account}</th>
                                                  <td>
                                                    ${expense.amount || "0.00"}
                                                  </td>
                                                  <td>{expense.date}</td>
                                                </tr>
                                              </React.Fragment>
                                            ))}
                                      </React.Fragment>
                                    ))}
                                    <tr>
                                      <th
                                        style={{
                                          color: "black",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Total expenses
                                      </th>
                                      <td
                                        style={{
                                          color: "black",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        ${calculateTotalExpenses(property)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th
                                        style={{
                                          color: "black",
                                          fontWeight: "bold",
                                          backgroundColor: "#f0f0f0",
                                        }}
                                      //colSpan="2"
                                      >
                                        Net income
                                      </th>
                                      <td
                                        style={{
                                          color: "black",
                                          fontWeight: "bold",
                                          backgroundColor: "#f0f0f0",
                                        }}
                                        colSpan="2"
                                      >
                                        ${calculateNetIncome(property)}
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            </tbody>
                          </Table>
                        )}
                        {financialType === "Month to date" && (
                          <Table responsive>
                            <thead>
                              <th>Property account</th>
                              <th>{month} 1 to date</th>
                            </thead>
                            <tbody>
                              <React.Fragment>
                                <tr>
                                  <th
                                    style={{
                                      color: "blue",
                                      fontWeight: "bold",
                                      backgroundColor: "#f0f0f0",
                                    }}
                                    colSpan="2"
                                  >
                                    Income
                                  </th>
                                </tr>
                                {monthWiseData[month] &&
                                  monthWiseData[month].map((data, index) => (
                                    <React.Fragment key={index}>
                                      <tr>
                                        <th>{data.account}</th>
                                        <td>${data.amount || "0.00"}</td>
                                      </tr>
                                    </React.Fragment>
                                  ))}
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total income
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    ${(totalIncome || 0).toFixed(2)}
                                  </th>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "blue",
                                      fontWeight: "bold",
                                      backgroundColor: "#f0f0f0",
                                    }}
                                    colSpan="2"
                                  >
                                    Expenses
                                  </th>
                                  <td></td>
                                </tr>
                                {allMonthData[month] &&
                                  allMonthData[month].map((data, index) => (
                                    <React.Fragment key={index}>
                                      <tr>
                                        <th>{data.account}</th>
                                        <td>${data.amount || "0.00"}</td>
                                      </tr>
                                    </React.Fragment>
                                  ))}
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total expenses
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    ${(totalExpenses || 0).toFixed(2)}
                                  </th>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                      backgroundColor: "#f0f0f0",
                                    }}
                                  //colSpan="2"
                                  >
                                    Net income
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                      backgroundColor: "#f0f0f0",
                                    }}
                                  //colSpan="2"
                                  >
                                    {netIncome >= 0
                                      ? `$${netIncome.toFixed(2)}`
                                      : `$(${Math.abs(netIncome || 0).toFixed(
                                        2
                                      )})`}
                                  </th>
                                </tr>
                              </React.Fragment>
                            </tbody>
                          </Table>
                        )}

                        {financialType === "Three months to date" && (
                          <Table responsive>
                            <thead>
                              <th>Property account</th>
                              {threeMonths.map((month, index) => (
                                <th key={index}>
                                  {month} {moment().format("YYYY")}
                                </th>
                              ))}
                              <th>{month} 1 to date</th>
                            </thead>
                            <tbody>
                              <tr>
                                <th
                                  style={{
                                    color: "blue",
                                    fontWeight: "bold",
                                    backgroundColor: "#f0f0f0",
                                  }}
                                  colSpan={4}
                                >
                                  Income
                                </th>
                              </tr>
                              {threeMonths.map((months, index) => (
                                <tr key={index}>
                                  {monthWiseData[months] &&
                                    monthWiseData[months].map((data) => (
                                      <>
                                        <th>{data.account}</th>
                                        <td>
                                          {index === 0 ? data.amount : "-"}
                                        </td>
                                        <td>
                                          {index === 1 ? data.amount : "-"}
                                        </td>
                                        <td>
                                          {index === 2 ? data.amount : "-"}
                                        </td>
                                      </>
                                    ))}
                                </tr>
                              ))}
                              {monthWiseData[month] &&
                                monthWiseData[month].map((data, index) => (
                                  <tr key={index}>
                                    <th>{data.account}</th>
                                    <td>{"-"}</td>
                                    <td>{"-"}</td>
                                    <td>{data.amount || "-"}</td>
                                  </tr>
                                ))}
                              <tr>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Total income
                                </th>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ${totals[0].toFixed(2)}
                                </th>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ${totals[1].toFixed(2)}
                                </th>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ${totals[2].toFixed(2)}
                                </th>
                              </tr>
                              <tr>
                                <th
                                  style={{
                                    color: "blue",
                                    fontWeight: "bold",
                                    backgroundColor: "#f0f0f0",
                                  }}
                                  colSpan={4}
                                >
                                  Expenses
                                </th>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                              {threeMonths.map((months, index) => (
                                <tr key={index}>
                                  {allMonthData[months] &&
                                    allMonthData[months].map((data) => (
                                      <>
                                        <th>{data.account}</th>
                                        <td>
                                          {index === 0 ? data.amount : "-"}
                                        </td>
                                        <td>
                                          {index === 1 ? data.amount : "-"}
                                        </td>
                                        <td>
                                          {index === 2 ? data.amount : "-"}
                                        </td>
                                      </>
                                    ))}
                                </tr>
                              ))}
                              {allMonthData[month] &&
                                allMonthData[month].map((data, index) => (
                                  <tr key={index}>
                                    <th>{data.account}</th>
                                    <td>{"-"}</td>
                                    <td>{"-"}</td>
                                    <td>{data.amount || "-"}</td>
                                  </tr>
                                ))}
                              <tr>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Total expenses
                                </th>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ${totals2[0].toFixed(2)}
                                </th>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ${totals2[1].toFixed(2)}
                                </th>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ${totals2[2].toFixed(2)}
                                </th>
                              </tr>
                              <tr>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                    backgroundColor: "#f0f0f0",
                                  }}
                                >
                                  Net income
                                </th>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                    backgroundColor: "#f0f0f0",
                                  }}
                                >
                                  $
                                  {totals[0] - totals2[0] >= 0
                                    ? (totals[0] - totals2[0]).toFixed(2)
                                    : `(${-1 * (totals[0] - totals2[0]).toFixed(2)
                                    })`}
                                </th>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                    backgroundColor: "#f0f0f0",
                                  }}
                                >
                                  $
                                  {totals[1] - totals2[1] >= 0
                                    ? (totals[1] - totals2[1]).toFixed(2)
                                    : `(${-1 * (totals[1] - totals2[1]).toFixed(2)
                                    })`}
                                </th>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                    backgroundColor: "#f0f0f0",
                                  }}
                                >
                                  $
                                  {totals[2] - totals2[2] >= 0
                                    ? (totals[2] - totals2[2]).toFixed(2)
                                    : `(${-1 * (totals[2] - totals2[2]).toFixed(2)
                                    })`}
                                </th>
                              </tr>
                            </tbody>
                          </Table>
                        )}
                      </>
                    )}
                  </TabPanel>

                  <TabPanel value="units">
                    {!propSummary ? (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginBottom: "10px",
                          }}
                        >
                          <Button
                            className="btn-icon btn-2"
                            color="primary"
                            style={{
                              background: "white",
                              color: "blue",
                              display: propertyTypeData.is_multiunit
                                ? "block"
                                : "none",
                            }}
                            size="l"
                            onClick={() => {
                              setOpenEdite(true);
                            }}
                          >
                            <span className="btn-inner--text">Add Unit</span>
                          </Button>
                        </div>
                        <Table
                          className="align-items-center table-flush"
                          responsive
                        >
                          <thead className="thead-light">
                            <tr>
                              {propertyTypeData.is_multiunit ? (
                                <th scope="col">Unit</th>
                              ) : (
                                ""
                              )}
                              {propertyTypeData.is_multiunit ? (
                                <th scope="col">Address</th>
                              ) : (
                                ""
                              )}
                              <th
                                scope="col"
                                className={
                                  propertyTypeData.is_multiunit
                                    ? ""
                                    : "text-center"
                                }
                              >
                                Tenants
                              </th>
                              <th
                                scope="col"
                                className={
                                  propertyTypeData.is_multiunit
                                    ? ""
                                    : "text-center"
                                }
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {propertyUnitData &&
                              propertyUnitData.length > 0 &&
                              propertyUnitData.map((unit, index) => (
                                <tr
                                  key={index}
                                  onClick={() => {
                                    setPropSummary(true);
                                    setClickedUnitObject(unit);
                                  }}
                                  style={{ cursor: "pointer" }}
                                  className="w-100"
                                >
                                  {propertyTypeData.is_multiunit ? (
                                    <td>{unit.rental_unit || "N/A"}</td>
                                  ) : (
                                    ""
                                  )}
                                  {propertyTypeData.is_multiunit ? (
                                    <td>{unit.rental_unit_adress || "N/A"}</td>
                                  ) : (
                                    ""
                                  )}
                                  <td
                                    className={
                                      propertyTypeData.is_multiunit
                                        ? ""
                                        : "text-center"
                                    }
                                  >
                                    {unit.tenantCount ? unit.tenantCount : "-"}
                                  </td>
                                  <td
                                    className={
                                      propertyTypeData.is_multiunit
                                        ? ""
                                        : "text-center"
                                    }
                                    onClick={(e) => openEditeTab(e, unit)}
                                  >
                                    <EditIcon />
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                        <></>
                      </div>
                    ) : (
                      <>
                        <Button
                          className="btn-icon btn-2"
                          style={{
                            background: "white",
                            color: "blue",
                          }}
                          size="sm"
                          onClick={() => setPropSummary(false)}
                        >
                          <span className="btn-inner--text">Back</span>
                        </Button>
                        <Button
                          className="btn-icon btn-2"
                          style={{
                            background: "white",
                            color: "blue",
                          }}
                          size="sm"
                          onClick={() => {
                            handleDeleteUnit(clickedUnitObject?.unit_id);
                          }}
                        >
                          Delete unit
                        </Button>
                        <Grid container>
                          <Grid container md={9} style={{ display: "flex" }}>
                            <div className="din d-flex justify-content-between">
                              <div className="col-md-4 mt-2 mb-2">
                                <label htmlFor="unit_image">
                                  {unitImageLoader ? (
                                    <>
                                      <RotatingLines
                                        strokeColor="grey"
                                        strokeWidth="5"
                                        animationDuration="0.75"
                                        width="50"
                                        visible={true}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={
                                          clickedUnitObject.rental_images
                                            ? clickedUnitObject.rental_images[0]
                                            : fone
                                        }
                                        className="img-fluid rounded-start card-image"
                                        alt="..."
                                        width="400px"
                                        height="400px"
                                      />
                                    </>
                                  )}
                                </label>
                              </div>
                              <Grid
                                item
                                md={8}
                                style={{
                                  width: "100%",
                                  marginLeft: "20px",
                                }}
                              >
                                {clickedUnitObject?.rental_unit ? (
                                  <div className="d-flex align-self-end">
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        fontSize: "18px",
                                        textTransform: "capitalize",
                                        color: "#5E72E4",
                                        fontWeight: "600",
                                      }}
                                    >
                                      <div>
                                        {clickedUnitObject?.rental_unit}
                                      </div>
                                      <hr
                                        style={{
                                          marginTop: "10px",
                                          width: "calc(100% - 100px)",
                                        }}
                                      />
                                    </Typography>
                                  </div>
                                ) : (
                                  ""
                                )}
                                <span style={{ marginTop: "0px" }}>
                                  <b>ADDRESS</b>
                                  <br />
                                  {clickedUnitObject?.rental_unit
                                    ? clickedUnitObject?.rental_unit + ", "
                                    : ""}
                                  {rentalData?.rental_adress
                                    ? rentalData?.rental_adress + ", "
                                    : ""}
                                  <br />
                                  {rentalData?.rental_city
                                    ? rentalData?.rental_city + ", "
                                    : ""}
                                  {rentalData?.rental_state
                                    ? rentalData?.rental_state + ", "
                                    : ""}
                                  <br />
                                  {rentalData?.rental_country
                                    ? rentalData?.rental_country + ", "
                                    : ""}
                                  {rentalData?.rental_postcode
                                    ? rentalData?.rental_postcode
                                    : ""}
                                </span>
                              </Grid>
                            </div>

                            <Grid item xs="12" style={{ marginTop: "20px" }}>
                              {/* //listing */}
                              {/* <>
                                <Row
                                  className="w-100 my-3 "
                                  style={{
                                    fontSize: "18px",
                                    textTransform: "capitalize",
                                    color: "#5e72e4",
                                    fontWeight: "600",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  <Col>
                                    Listing Information
                                    <Button
                                      size="sm"
                                      style={{
                                        background: "white",
                                        color: "blue",
                                        marginBottom: "5px",
                                      }}
                                      onClick={() => {
                                        addUnitFormik.setValues({
                                          market_rent:
                                            clickedUnitObject?.market_rent,
                                          size: clickedUnitObject?.rental_sqft,
                                          description:
                                            clickedUnitObject?.description,
                                        });
                                        setEditListingData(!editListingData);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  </Col>
                                </Row>
                                <Row
                                  className="w-100 mb-1 "
                                  style={{
                                    fontSize: "10px",
                                    textTransform: "uppercase",
                                    color: "#aaa",
                                  }}
                                >
                                  <Col>Market Rent</Col>
                                  <Col>Size</Col>
                                  <Col>Description</Col>
                                  <Col></Col>
                                </Row>
                                <Row
                                  className="w-100 mt-1  mb-5"
                                  style={{
                                    fontSize: "12px",
                                    textTransform: "capitalize",
                                    color: "#000",
                                  }}
                                >
                                  <Col>
                                    {clickedUnitObject?.market_rent || "N/A"}
                                  </Col>
                                  <Col>
                                    {clickedUnitObject?.rental_sqft || "N/A"}
                                  </Col>
                                  <Col style={{ textTransform: "lowercase" }}>
                                    {clickedUnitObject?.description || "N/A"}
                                  </Col>
                                  <Col></Col>
                                </Row>
                              </> */}
                              {/* {editListingData ? (
                                <Row>
                                  <Col>
                                    <Card style={{ position: "relative" }}>
                                      <CloseIcon
                                        onClick={() => {
                                          setEditListingData(!editListingData);
                                        }}
                                        style={{
                                          position: "absolute",
                                          top: "10px",
                                          right: "10px",
                                          cursor: "pointer",
                                        }}
                                      />
                                      <CardBody>
                                        <form
                                          onSubmit={addUnitFormik.handleSubmit}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              width: "50%",
                                            }}
                                          >
                                            <div>
                                              <h5>Market Rent</h5>
                                            </div>

                                            <TextField
                                              type="number"
                                              size="small"
                                              id="market_rent"
                                              name="market_rent"
                                              value={
                                                addUnitFormik.values
                                                  ?.market_rent
                                              }
                                              onChange={
                                                addUnitFormik.handleChange
                                              }
                                              onBlur={addUnitFormik.handleBlur}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              width: "50%",
                                              marginTop: "10px",
                                            }}
                                          >
                                            <div>
                                              <h5>Size</h5>
                                            </div>

                                            <TextField
                                              type="number"
                                              size="small"
                                              id="size"
                                              name="size"
                                              value={addUnitFormik.values.size}
                                              onChange={
                                                addUnitFormik.handleChange
                                              }
                                              onBlur={addUnitFormik.handleBlur}
                                            />
                                          </div>

                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                              marginTop: "10px",
                                            }}
                                          >
                                            <div>
                                              <div>
                                                <h5>Description</h5>
                                              </div>
                                              <Input
                                                type="textarea"
                                                id="description"
                                                name="description"
                                                value={
                                                  addUnitFormik.values
                                                    .description
                                                }
                                                onChange={
                                                  addUnitFormik.handleChange
                                                }
                                                onBlur={
                                                  addUnitFormik.handleBlur
                                                }
                                              />
                                            </div>
                                          </div>

                                          <div style={{ marginTop: "10px" }}>
                                            <Button
                                              color="success"
                                              type="submit"
                                              onClick={() => {
                                                handleListingEdit(
                                                  clickedUnitObject?._id,
                                                  clickedUnitObject?.rentalId
                                                );

                                                setEditListingData(
                                                  !editListingData
                                                );
                                              }}
                                            >
                                              Save
                                            </Button>
                                            <Button
                                              onClick={() => {
                                                setEditListingData(
                                                  !editListingData
                                                );
                                              }}
                                            >
                                              Cancel
                                            </Button>
                                          </div>
                                        </form>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                </Row>
                              ) : null} */}

                              {/* leases */}
                              <Row
                                className="w-100 my-3 "
                                style={{
                                  fontSize: "18px",
                                  textTransform: "capitalize",
                                  color: "#5e72e4",
                                  fontWeight: "600",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                <Col>Leases</Col>
                              </Row>
                              <Row
                                className="mb-1 m-0 p-0"
                                style={{ fontSize: "12px", color: "#000" }}
                              >
                                <Table responsive>
                                  <tbody
                                    className="tbbody p-0 m-0"
                                    style={{
                                      borderTopRightRadius: "5px",
                                      borderTopLeftRadius: "5px",
                                      borderBottomLeftRadius: "5px",
                                      borderBottomRightRadius: "5px",
                                    }}
                                  >
                                    <tr className="header">
                                      <th>Status</th>
                                      <th>Start - End</th>
                                      <th>Tenant</th>
                                      <th>Type</th>
                                      <th>Rent</th>
                                    </tr>
                                    {unitLeases ? (
                                      unitLeases.map((lease) => (
                                        <>
                                          <tr className="body">
                                            <td>
                                              {getStatus(
                                                lease?.start_date,
                                                lease?.end_date
                                              )}
                                            </td>
                                            <td>
                                              {lease?.start_date &&
                                                lease?.end_date ? (
                                                <>
                                                  <Link
                                                    to={`/admin/tenantdetail/${lease?.tenant_id}`}
                                                    onClick={(e) => { }}
                                                  >
                                                    {formatDateWithoutTime(
                                                      lease?.start_date
                                                    ) +
                                                      "-" +
                                                      formatDateWithoutTime(
                                                        lease?.end_date
                                                      )}
                                                  </Link>
                                                </>
                                              ) : (
                                                "N/A"
                                              )}
                                            </td>
                                            <td>
                                              {lease?.tenant_firstName &&
                                                lease?.tenant_lastName
                                                ? lease?.tenant_firstName +
                                                " " +
                                                lease?.tenant_lastName
                                                : "N/A"}
                                            </td>
                                            <td>
                                              {lease?.lease_type || "N/A"}
                                            </td>
                                            <td>{lease?.amount || "N/A"}</td>
                                          </tr>
                                        </>
                                      ))
                                    ) : (
                                      <>Leases not assigned</>
                                    )}
                                  </tbody>
                                </Table>
                              </Row>

                              {/* Appliances */}
                              <Row
                                className="w-100 mt-5 mb-3"
                                style={{
                                  fontSize: "18px",
                                  textTransform: "capitalize",
                                  color: "#5e72e4",
                                  fontWeight: "600",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                <Col xs={6}>
                                  <span>Appliances</span>
                                  <Button
                                    size="sm"
                                    style={{
                                      background: "white",
                                      color: "blue",
                                      marginBottom: "5px",
                                      marginLeft: "5px",
                                    }}
                                    onClick={() => {
                                      setAddAppliances(!addAppliances);
                                      addAppliancesFormin.resetForm();
                                    }}
                                  >
                                    Add
                                  </Button>
                                </Col>
                              </Row>
                              {addAppliances ? (
                                <>
                                  <Row>
                                    <Col md={11}>
                                      <Card style={{ position: "relative" }}>
                                        <CloseIcon
                                          style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "10px",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            setAddAppliances(!addAppliances);
                                            addAppliancesFormin.resetForm();
                                          }}
                                        />
                                        <CardBody>
                                          <form
                                            onSubmit={
                                              addAppliancesFormin.handleSubmit
                                            }
                                          >
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                              }}
                                            >
                                              <div>
                                                <h5>Name</h5>
                                              </div>
                                              <TextField
                                                type="text"
                                                size="small"
                                                id="appliance_name"
                                                name="appliance_name"
                                                value={
                                                  addAppliancesFormin.values
                                                    .appliance_name
                                                }
                                                onChange={
                                                  addAppliancesFormin.handleChange
                                                }
                                              />
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                marginTop: "10px",
                                              }}
                                            >
                                              <div>
                                                <h5>Description</h5>
                                              </div>
                                              <TextField
                                                type="textarea"
                                                size="small"
                                                id="appliance_description"
                                                name="appliance_description"
                                                value={
                                                  addAppliancesFormin.values
                                                    .appliance_description
                                                }
                                                onChange={
                                                  addAppliancesFormin.handleChange
                                                }
                                              />
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                marginTop: "10px",
                                              }}
                                            >
                                              <div>
                                                <div>
                                                  <h5>Installed Date</h5>
                                                </div>
                                                <TextField
                                                  type="date"
                                                  size="small"
                                                  id="installed_date"
                                                  name="installed_date"
                                                  value={
                                                    addAppliancesFormin.values
                                                      .installed_date
                                                  }
                                                  onChange={
                                                    addAppliancesFormin.handleChange
                                                  }
                                                />
                                              </div>
                                            </div>
                                            <div style={{ marginTop: "10px" }}>
                                              <Button
                                                color="success"
                                                type="submit"
                                              >
                                                Save
                                              </Button>
                                              <Button
                                                onClick={() => {
                                                  setAddAppliances(
                                                    !addAppliances
                                                  );
                                                  addAppliancesFormin.resetForm();
                                                }}
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </form>
                                        </CardBody>
                                      </Card>
                                    </Col>
                                  </Row>
                                </>
                              ) : (
                                <>
                                  <Row
                                    className="mb-1 m-0 p-0"
                                    style={{ fontSize: "12px", color: "#000" }}
                                  >
                                    <Table responsive>
                                      <tbody
                                        className="tbbody p-0 m-0"
                                        style={{
                                          borderTopRightRadius: "5px",
                                          borderTopLeftRadius: "5px",
                                          borderBottomLeftRadius: "5px",
                                          borderBottomRightRadius: "5px",
                                        }}
                                      >
                                        <tr className="header">
                                          <th>Name</th>
                                          <th>Descriprion</th>
                                          <th>Installed Date</th>
                                          <th>Action</th>
                                        </tr>
                                        {applianceData?.length > 0 ? (
                                          applianceData.map(
                                            (appliance, index) => (
                                              <tr className="body" key={index}>
                                                <td>
                                                  {appliance.appliance_name}
                                                </td>
                                                <td>
                                                  {
                                                    appliance.appliance_description
                                                  }
                                                </td>
                                                <td>
                                                  {appliance.installed_date}
                                                </td>
                                                <td>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      gap: "5px",
                                                    }}
                                                  >
                                                    <div
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={async () => {
                                                        try {
                                                          const res =
                                                            await deleteAppliance(
                                                              appliance.appliance_id
                                                            );
                                                          if (res === 200) {
                                                            fetchApplianceData();
                                                          }
                                                        } catch (error) {
                                                          console.error(
                                                            "Error occurred while deleting appliance:",
                                                            error
                                                          );
                                                        }
                                                      }}
                                                    >
                                                      <DeleteIcon />
                                                    </div>
                                                    <div
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() => {
                                                        setAddAppliances(true);
                                                        addAppliancesFormin.setValues(
                                                          {
                                                            appliance_description:
                                                              appliance.appliance_description,
                                                            appliance_name:
                                                              appliance.appliance_name,
                                                            installed_date:
                                                              appliance.installed_date,
                                                            appliance_id:
                                                              appliance.appliance_id,
                                                          }
                                                        );
                                                      }}
                                                    >
                                                      <EditIcon />
                                                    </div>
                                                  </div>
                                                </td>
                                              </tr>
                                            )
                                          )
                                        ) : (
                                          <tr>
                                            <td>
                                              You don't have any appliance for
                                              this unit right now
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </Table>
                                  </Row>
                                </>
                              )}
                            </Grid>
                          </Grid>
                          <Grid container md={3}>
                            <Grid item md={12}>
                              <Paper elevation={2}>
                                <Card
                                  style={{
                                    backgroundColor: "lightgrey",
                                  }}
                                >
                                  <CardBody
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      padding: "20px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        marginTop: "15px",
                                      }}
                                    >
                                      Lease
                                    </span>
                                    <Button
                                      className="btn"
                                      style={{
                                        marginTop: "5px",
                                      }}
                                      onClick={() => {
                                        navigate(`/${admin}/RentRollLeaseing`);
                                      }}
                                    >
                                      Add Lease
                                    </Button>
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        marginTop: "15px",
                                      }}
                                    >
                                      Rental Applications
                                    </span>
                                    <Button
                                      size="small"
                                      style={{
                                        marginTop: "5px",
                                      }}
                                      onClick={() => {
                                        navigate(`/${admin}/Applicants`);
                                      }}
                                    >
                                      Create Applicant
                                    </Button>
                                  </CardBody>
                                </Card>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </TabPanel>

                  <TabPanel value="task"></TabPanel>

                  <TabPanel value="Tenant">
                    <CardHeader className="border-0"></CardHeader>
                    <Row>
                      <Col>
                        {tenantsData.length > 0 ? (
                          <Grid container spacing={2}>
                            {tenantsData.map((tenant, index) => (
                              // <Grid item xs={12} sm={6} >
                              <Box
                                border="1px solid #ccc"
                                borderRadius="8px"
                                padding="16px"
                                // maxWidth="400px"
                                margin="10px"
                                key={index}
                              >
                                <Row>
                                  <Col lg="2">
                                    <Box
                                      width="40px"
                                      height="40px"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                      backgroundColor="grey"
                                      borderRadius="8px"
                                      color="white"
                                      fontSize="24px"
                                    >
                                      <AssignmentIndIcon />
                                    </Box>
                                  </Col>
                                  <Col lg="7">
                                    <div
                                      style={{
                                        color: "blue",
                                        height: "40px",
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "start",
                                      }}
                                    >
                                      {tenant.tenant_firstName}{" "}
                                      {tenant.tenant_lastName}
                                    </div>
                                    <div
                                      style={{
                                        color: "blue",
                                        height: "40px",
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "start",
                                      }}
                                    >
                                      {tenant.rental_adress} {""}
                                      {tenant.rental_unit !== "" &&
                                        tenant.rental_unit !== undefined
                                        ? `- ${tenant.rental_unit}`
                                        : null}
                                    </div>
                                    <div
                                      style={{
                                        // display: "flex",
                                        // alignItems: "center",
                                        justifyContent: "start",
                                      }}
                                    >
                                      {tenant.start_date} to {tenant.end_date}
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        paddingTop: "3px",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Typography
                                        style={{
                                          paddingRight: "3px",
                                          fontSize: "2px",
                                          color: "black",
                                        }}
                                      >
                                        <PhoneAndroidIcon />
                                      </Typography>
                                      {tenant.tenant_phoneNumber}
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Typography
                                        style={{
                                          paddingRight: "3px",
                                          fontSize: "7px",
                                          color: "black",
                                        }}
                                      >
                                        <MailIcon />
                                      </Typography>
                                      {tenant.tenant_email}
                                    </div>
                                  </Col>
                                  <Col lg="3">
                                    <div
                                      className="d-flex justify-content(-end h5"
                                      onClick={() => handleMoveOutClick(tenant)}
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "12px",
                                      }}
                                    >
                                      <LogoutIcon fontSize="small" /> Move out
                                    </div>
                                  </Col>
                                </Row>
                              </Box>
                              // </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <div>Tenant not assiged for this property.</div>
                        )}
                      </Col>
                    </Row>
                  </TabPanel>
                </TabContext>
              </Col>
            </Card>
          </div>
        </Row>
      </Container>

      <Dialog open={openEdite} onClose={closeModal}>
        <DialogTitle>Edit Unit Details</DialogTitle>
        <CloseIcon
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
          }}
          onClick={closeModal}
        />
        <UnitEdite
          openEdite={openEdite}
          closeModal={closeModal}
          setOpenEdite={setOpenEdite}
          clickedObject={clickedUnitObject}
          addUnitFormik={addUnitFormik}
          selectedFiles={selectedFiles}
          setOpen={setOpen}
          open={open}
          clearSelectedPhoto={clearSelectedPhoto}
          setSelectedFiles={setSelectedFiles}
          fileData={fileData}
          togglePhotoresDialog={togglePhotoresDialog}
          addUnitDialogOpen={propertyTypeData.property_type}
          is_multiunit={propertyTypeData.is_multiunit}
        />
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default PropDetails;
