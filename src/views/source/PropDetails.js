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
} from "reactstrap";
import Tab from "@mui/material/Tab";
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
  const [tenantsData, setTenantsData] = useState("");
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
  const [selectedImage, setSelectedImage] = useState("");
  const [propSummary, setPropSummary] = useState(false);
  const [month, setMonth] = useState([]);
  const [addAppliances, setAddAppliances] = useState(false);
  const [unitImage, setUnitImage] = useState([]);
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
      rental_images: "",
    },

    onSubmit: async (values) => {
      try {
        let res;

        if (clickedUnitObject.unit_id) {
          res = await handleUnitDetailsEdit(clickedUnitObject?.unit_id, values);
        } else {
          res = await handleSubmit(
            rentalData?.rental_id,
            accessType.admin_id,
            values
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
    if (name === "propertyres_image") {
      const filteredImage = unitImage.filter((item, i) => i !== index);

      const filteredImage2 = selectedFiles.filter((item, i) => i !== index);
      setSelectedFiles(filteredImage2);
      setUnitImage(filteredImage);
    }
  };

  const fileData = (e) => {
    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...e.target.files,
    ]);

    const newFiles = [
      ...unitImage,
      ...Array.from(e.target.files).map((file) => URL.createObjectURL(file)),
    ];

    setUnitImage(newFiles);
  };

  const togglePhotoresDialog = () => {
    setPhotoresDialogOpen((prevState) => !prevState);
  };

  const countTenantsByUnit = () => {
    for (const tenant of tenantsData) {
      for (const unit of propertyUnitData) {
        if (tenant.unit_id === unit.unit_id) {
          console.log("object yashu");
        }
        console.log("object yashu2");
      }
    }
  };

  useEffect(() => {
    countTenantsByUnit();
  }, [tenantsData, propertyUnitData]);

  return (
    <>
      <Header />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <h1 style={{ color: "white" }}>{rentalData?.rental_adress}</h1>
            <h4 style={{ color: "white" }}>
              {propertyTypeData?.property_type}
            </h4>
          </Col>
          <Col className="text-right" xs="12" sm="6">
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
                      <Tab
                        label="Financial"
                        style={{ textTransform: "none" }}
                        value="financial"
                      />
                      <Tab
                        label={`Units (${propertyUnitData?.length || 0})`}
                        style={{ textTransform: "none" }}
                        value="units"
                      />
                      <Tab
                        label="Task"
                        style={{ textTransform: "none" }}
                        value="task"
                      />
                      <Tab
                        label={`Tenant (0)`}
                        style={{ textTransform: "none" }}
                        value="tenant"
                      />
                    </TabList>
                  </Box>

                  <TabPanel value="summary">
                    <div className="main d-flex justify-content-between">
                      <div className="card mb-3 col-8">
                        <div className="row g-0 border-none">
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
                                    className="img-fluid rounded-start card-image"
                                    alt={"..."}
                                    style={{
                                      width: "260px",
                                      aspectRatio: "3/2",
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
                            <div className="col-md-4 mt-2 d-flex justify-content-center">
                              <RotatingLines
                                strokeColor="grey"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="50"
                                visible={propImageLoader}
                              />
                            </div>
                          )}

                          <div className="col-md-8">
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
                                                        {`${
                                                          rentalOwnerData.rentalOwner_firstName ||
                                                          "N/A"
                                                        } ${
                                                          rentalOwnerData.rentalOwner_lastName ||
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
                                                        {`${
                                                          staffMemberData?.staffmember_name ||
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
                                    : `(${
                                        -1 * (totals[0] - totals2[0]).toFixed(2)
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
                                    : `(${
                                        -1 * (totals[1] - totals2[1]).toFixed(2)
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
                                    : `(${
                                        -1 * (totals[2] - totals2[2]).toFixed(2)
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
                              <th scope="col">Unit</th>
                              <th scope="col">Address</th>
                              <th scope="col">Tenants</th>
                              <th scope="col">Actions</th>
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
                                  <td>{unit.rental_unit || "N/A"}</td>
                                  <td>{unit.rental_unit_adress || "N/A"}</td>
                                  <td>{unit?.counts ? unit?.counts : 0}</td>
                                  <td onClick={(e) => openEditeTab(e, unit)}>
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
                            handleDeleteUnit(clickedUnitObject?._id);
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
                                        src={fone}
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
                                    {clickedUnitObject &&
                                    clickedUnitObject?.tenant_firstName &&
                                    clickedUnitObject?.tenant_lastName ? (
                                      <>
                                        <tr className="body">
                                          <td>
                                            {clickedUnitObject?.start_date
                                              ? "Active"
                                              : "Inactive"}
                                          </td>
                                          <td>
                                            {clickedUnitObject?.start_date &&
                                            clickedUnitObject?.end_date ? (
                                              <>
                                                <Link
                                                  to={`/admin/tenantdetail/${clickedUnitObject?._id}`}
                                                  onClick={(e) => {}}
                                                >
                                                  {formatDateWithoutTime(
                                                    clickedUnitObject?.start_date
                                                  ) +
                                                    "-" +
                                                    formatDateWithoutTime(
                                                      clickedUnitObject?.end_date
                                                    )}
                                                </Link>
                                              </>
                                            ) : (
                                              "N/A"
                                            )}
                                          </td>
                                          <td>
                                            {clickedUnitObject?.tenant_firstName &&
                                            clickedUnitObject?.tenant_lastName
                                              ? clickedUnitObject?.tenant_firstName +
                                                " " +
                                                clickedUnitObject?.tenant_lastName
                                              : "N/A"}
                                          </td>
                                          <td>
                                            {clickedUnitObject?.lease_type ||
                                              "N/A"}
                                          </td>
                                          <td>
                                            {clickedUnitObject?.amount || "N/A"}
                                          </td>
                                        </tr>
                                      </>
                                    ) : (
                                      <tr>
                                        <td>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                          >
                                            You don't have any leases for this
                                            unit right now.
                                          </Typography>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </Row>

                              {/* Appliances */}
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
                                <Col xs={6}>Appliances</Col>
                                <Col xs={6} className="text-right">
                                  <Button
                                    size="sm"
                                    style={{
                                      background: "white",
                                      color: "blue",
                                      marginBottom: "5px",
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
                                  <Row>
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
                                                        const res =
                                                          await deleteAppliance(
                                                            appliance.appliance_id
                                                          );
                                                        if (res === 200) {
                                                          fetchApplianceData();
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
                                        navigate(`/admin/Leaseing`);
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
                                        navigate(`/admin/Applicants`);
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

                  <TabPanel value="tenant"></TabPanel>
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
          selectedImage={selectedImage}
          setOpen={setOpen}
          open={open}
          clearSelectedPhoto={clearSelectedPhoto}
          setSelectedImage={setSelectedImage}
          unitImage={unitImage}
          fileData={fileData}
          togglePhotoresDialog={togglePhotoresDialog}
          addUnitDialogOpen={propertyTypeData.property_type}
        />
      </Dialog>
    </>
  );
};

export default PropDetails;
