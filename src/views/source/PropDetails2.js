import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogTitle,
  FormGroup,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Header from "components/Headers/Header";
import React, { useEffect, useState } from "react";
import {
  Form,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
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
} from "reactstrap";
import Tab from "@mui/material/Tab";
import fone from "../../assets/img/icons/common/property_bg.png";
import { Grid, RotatingLines } from "react-loader-spinner";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { OpenImageDialog } from "components/OpenImageDialog";
import { useFormik } from "formik";
//financial
import {
  financialTypeArray,
  todayDate,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetIncome,
} from "./Functions/Financial";

//units
import {
  formatDateWithoutTime,
  handleListingEdit,
  handleDeleteUnit,
  roomsArray,
  bathArray,
  handleSubmit,
  getUnitProperty,
  UnitEdite,
} from "./Functions/Units";
import axios from "axios";

const PropDetails2 = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_URL;

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");
  const { rentla_id } = useParams();

  const [value, setValue] = React.useState("summary");
  const [rentalData, setRentalData] = useState();
  const [rentalOwnerData, setRentalOwnerData] = useState("");
  const [propertyTypeData, setPropertyTypeData] = useState("");
  const [propertyUnitData, setpropertyUnitData] = useState("");
  const [staffMemberData, setStaffMemberData] = useState("");
  const [GeneralLedgerData, setGeneralLedgerData] = useState([]);
  const [clickedUnitObject, setClickedUnitObject] = useState([]);
  const [propImageLoader, setPropImageLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [unitImageLoader, setUnitImageLoader] = useState(false);
  const [financialType, setFinancialType] = useState("");
  const [monthWiseData, setMonthWiseData] = useState("");
  const [open, setOpen] = React.useState(false);
  const [threeMonths, setThreeMonths] = useState([]);
  const [propId, setPropId] = useState("");
  const [allMonthData, setAllMonthData] = useState("");
  const [financialDropdown, setFinancialDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [propSummary, setPropSummary] = useState(false);
  const [month, setMonth] = useState([]);
  const [editListingData, setEditListingData] = useState(false);
  const [setAddAppliances, addAppliances] = useState(false);
  const [unitImage, setUnitImage] = useState([]);
  const [isPhotoresDialogOpen, setPhotoresDialogOpen] = useState(false);
  const [multiUnit, setMultiUnit] = useState(null);
  const [roomDropdown, setRoomDropdown] = useState(false);
  const [bathDropdown, setBathDropdown] = useState(false);
  const [addUnitDialogOpen, setAddUnitDialogOpen] = useState(false);
  const [propType, setPropType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [openEdite, setOpenEdite] = useState("");

  const fetchRentalData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `${baseUrl}/rentals/rental_summary/${rentla_id}`
      );
      setRentalData(response.data.data[0]);
      setPropertyTypeData(response.data.data[0].property_type_data);
      setRentalOwnerData(response.data.data[0].rental_owner_data);
      setStaffMemberData(response.data.data[0].staffmember_data);
      console.log(response.data.data, "yash1");
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setLoading(false);
    }
  };

  const fetchUnitsData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `${baseUrl}/rentals/rental_unit/${rentla_id}`
      );
      setpropertyUnitData(response.data.data);
      console.log(response.data.data, "yash");
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentalData();
    fetchUnitsData();
  }, [rentla_id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggle1 = () => setRoomDropdown((prevState) => !prevState);
  const toggle2 = () => setBathDropdown((prevState) => !prevState);
  const toggle3 = () => setFinancialDropdown((prevState) => !prevState);

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

    onSubmit: (values) => {
      console.log(values);
    },
  });

  const closeModal = () => {
    setOpenEdite(false);
  };

  const openEditeTab = async (event, unit) => {
    event.stopPropagation();
    setOpenEdite(true);
    setPropId(unit.unit_id);

    // Use await to wait for the promise to resolve
    await getUnitProperty(unit.unit_id);

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

  const fileData = (e, type) => {
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
              onClick={() => navigate("/admin/propertiesTable")}
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
                        label={`Units (0)`}
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
                                  htmlFor="prop_image"
                                  style={{
                                    width: "260px",
                                    height: "180px",
                                  }}
                                >
                                  <img
                                    src={
                                      rentalData?.prop_image
                                        ? rentalData?.prop_image
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
                                  id="prop_image"
                                  name="prop_image"
                                  type="file"
                                  inputProps={{
                                    accept: "image/*",
                                    multiple: false,
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
                        ) : "error" ? (
                          <tbody>
                            <tr>
                              <td>Error: error.message</td>
                            </tr>
                          </tbody>
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
                        <Dropdown isOpen={financialDropdown} toggle={toggle3}>
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
                    {addUnitDialogOpen ? (
                      <>
                        <Form onSubmit={handleSubmit}>
                          <h4 style={{ marginBottom: "20px" }}>
                            What is the unit information?
                          </h4>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  Unit Number *
                                </label>
                                <Input
                                  required
                                  className="form-control-alternative"
                                  id="unit_number"
                                  placeholder="Unit Number"
                                  type="text"
                                  name="unit_number"
                                  value={addUnitFormik.values.unit_number}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  Market Rent *
                                </label>
                                <Input
                                  required
                                  className="form-control-alternative"
                                  id="market_rent"
                                  placeholder="Market Rent"
                                  type="text"
                                  name="market_rent"
                                  value={addUnitFormik.values.market_rent}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  Size (Optional)
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="size"
                                  placeholder="Sq. Ft."
                                  type="text"
                                  name="size"
                                  value={addUnitFormik.values.size}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="10">
                              <hr />
                            </Col>
                          </Row>
                          <h4 style={{ marginBottom: "20px" }}>
                            What is the street address?
                          </h4>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  Address *
                                </label>
                                <Input
                                  required
                                  className="form-control-alternative"
                                  id="address1"
                                  placeholder="Address"
                                  type="text"
                                  name="address1"
                                  value={addUnitFormik.values.address1}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                  style={{ marginBottom: "10px" }}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="2">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  City *
                                </label>
                                <Input
                                  required
                                  className="form-control-alternative"
                                  id="city"
                                  placeholder="City"
                                  type="text"
                                  name="city"
                                  value={addUnitFormik.values.city}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="2">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-country"
                                >
                                  State *
                                </label>
                                <Input
                                  required
                                  className="form-control-alternative"
                                  id="state"
                                  placeholder="State"
                                  type="text"
                                  name="state"
                                  value={addUnitFormik.values.state}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="2">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-country"
                                >
                                  Zip *
                                </label>
                                <Input
                                  required
                                  className="form-control-alternative"
                                  id="zip"
                                  placeholder="Zip"
                                  type="text"
                                  name="zip"
                                  value={addUnitFormik.values.zip}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-country"
                                >
                                  Country *
                                </label>
                                <Input
                                  requi
                                  className="form-control-alternative"
                                  id="country"
                                  placeholder="Country"
                                  type="text"
                                  name="country"
                                  value={addUnitFormik.values.country}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="10">
                              <hr />
                            </Col>
                          </Row>
                          <h4 style={{ marginBottom: "20px" }}>
                            What is the listing information?
                          </h4>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                            style={
                              propType !== "Residential"
                                ? { display: "none" }
                                : { display: "block" }
                            }
                          >
                            Rooms (optional)
                          </label>
                          <Row
                            style={
                              propType !== "Residential"
                                ? { display: "none", marginTop: "10px" }
                                : { marginTop: "10px" }
                            }
                          >
                            <Col lg="2">
                              <FormGroup>
                                <Dropdown
                                  isOpen={roomDropdown}
                                  toggle={toggle1}
                                >
                                  <DropdownToggle caret>
                                    {addUnitFormik.values.rooms
                                      ? addUnitFormik.values.rooms
                                      : "Beds..."}
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    {roomsArray.map((subtype, index) => (
                                      <DropdownItem
                                        key={index}
                                        onClick={() => {
                                          addUnitFormik.setFieldValue(
                                            "rooms",
                                            subtype
                                          );
                                        }}
                                        onChange={addUnitFormik.handleChange}
                                        onBlur={addUnitFormik.handleBlur}
                                      >
                                        {subtype}
                                      </DropdownItem>
                                    ))}
                                  </DropdownMenu>
                                </Dropdown>
                              </FormGroup>
                            </Col>
                            <Col lg="2">
                              <FormGroup>
                                <Dropdown
                                  isOpen={bathDropdown}
                                  toggle={toggle2}
                                >
                                  <DropdownToggle caret>
                                    {addUnitFormik.values.baths
                                      ? addUnitFormik.values.baths
                                      : "Baths..."}
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    {bathArray.map((subtype, index) => (
                                      <DropdownItem
                                        key={index}
                                        onClick={() => {
                                          addUnitFormik.setFieldValue(
                                            "bath",
                                            subtype
                                          );
                                        }}
                                        onChange={addUnitFormik.handleChange}
                                        onBlur={addUnitFormik.handleBlur}
                                      >
                                        {subtype}
                                      </DropdownItem>
                                    ))}
                                  </DropdownMenu>
                                </Dropdown>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  Description (optional)
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="description"
                                  placeholder="Description"
                                  type="textarea"
                                  name="description"
                                  value={addUnitFormik.values.description}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="2">
                              <FormGroup
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <label
                                  className="form-control-label"
                                  htmlFor="input-unitadd"
                                >
                                  Photo
                                </label>
                                <span
                                  onClick={togglePhotoresDialog}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontFamily: "monospace",
                                    color: "blue",
                                  }}
                                >
                                  <br />
                                  <input
                                    type="file"
                                    className="form-control-file d-none"
                                    accept="image/*"
                                    multiple
                                    id={`unit_img`}
                                    name={`unit_img`}
                                    onChange={(e) => fileData(e)}
                                  />
                                  <label htmlFor={`unit_img`}>
                                    <b style={{ fontSize: "20px" }}>+</b> Add
                                  </label>
                                </span>
                              </FormGroup>
                              <FormGroup
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  paddingLeft: "10px",
                                }}
                              >
                                <div className="d-flex">
                                  {unitImage &&
                                    unitImage.length > 0 &&
                                    unitImage.map((unitImg, index) => (
                                      <div
                                        key={index}
                                        style={{
                                          position: "relative",
                                          width: "100px",
                                          height: "100px",
                                          margin: "10px",
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <img
                                          src={unitImg}
                                          alt=""
                                          style={{
                                            width: "100px",
                                            height: "100px",
                                            maxHeight: "100%",
                                            maxWidth: "100%",
                                            borderRadius: "10px",
                                          }}
                                          onClick={() => {
                                            setSelectedImage(unitImg);
                                            setOpen(true);
                                          }}
                                        />
                                        <ClearIcon
                                          style={{
                                            cursor: "pointer",
                                            alignSelf: "flex-start",
                                            position: "absolute",
                                            top: "-12px",
                                            right: "-12px",
                                          }}
                                          onClick={() =>
                                            clearSelectedPhoto(
                                              index,
                                              "propertyres_image"
                                            )
                                          }
                                        />
                                      </div>
                                    ))}
                                  <OpenImageDialog
                                    open={open}
                                    setOpen={setOpen}
                                    selectedImage={selectedImage}
                                  />
                                </div>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "10px" }}>
                            <Button
                              className="btn-icon btn-2"
                              color="success"
                              type="submit"
                            >
                              Create Unit
                            </Button>
                            <Button onClick={() => setAddUnitDialogOpen(false)}>
                              Cancel
                            </Button>
                          </Row>
                        </Form>
                      </>
                    ) : !propSummary ? (
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
                              addUnitFormik.setValues({
                                rental_unit: clickedUnitObject?.rental_unit,
                                rental_unit_adress:
                                  clickedUnitObject?.rental_unit_adress,
                                rental_sqft: clickedUnitObject?.rental_sqft,
                                rental_bath: clickedUnitObject?.rental_bath,
                                rental_bed: clickedUnitObject?.rental_bed,
                                rental_images: clickedUnitObject?.rental_images,
                              });
                              setAddUnitDialogOpen(true);
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
                                    setPropId(unit._id);
                                    setClickedUnitObject(unit);
                                  }}
                                  style={{ cursor: "pointer" }}
                                  className="w-100"
                                >
                                  <td>{unit.rental_unit || "N/A"}</td>
                                  <td>{unit.rental_unit_adress || "N/A"}</td>
                                  <td>
                                    {unit.tenant_firstName == null
                                      ? "-"
                                      : unit.tenant_firstName +
                                        " " +
                                        unit.tenant_lastName}
                                  </td>
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
                              <div className="col-md-4 mt-2">
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
                                {clickedUnitObject?.rental_units ? (
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
                                        {clickedUnitObject?.rental_units}
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
                                  ADDRESS
                                  <br />
                                  {clickedUnitObject?.rental_units
                                    ? clickedUnitObject?.rental_units + ", "
                                    : ""}
                                  {clickedUnitObject?.rental_adress
                                    ? clickedUnitObject?.rental_adress + ", "
                                    : ""}
                                  <br />
                                  {clickedUnitObject?.rental_city
                                    ? clickedUnitObject?.rental_city + ", "
                                    : ""}
                                  {clickedUnitObject?.rental_state
                                    ? clickedUnitObject?.rental_state + ", "
                                    : ""}
                                  <br />
                                  {clickedUnitObject?.rental_country
                                    ? clickedUnitObject?.rental_country + ", "
                                    : ""}
                                  {clickedUnitObject?.rental_postcode
                                    ? clickedUnitObject?.rental_postcode
                                    : ""}
                                </span>
                              </Grid>
                            </div>

                            <Grid item xs="12" style={{ marginTop: "20px" }}>
                              <>
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
                                    Listing Information{" "}
                                    <Button
                                      size="sm"
                                      style={{
                                        background: "white",
                                        color: "blue",
                                        marginBottom: "5px",
                                      }}
                                      onClick={() => {
                                        console.log(
                                          clickedUnitObject,
                                          "clickedUnitObject"
                                        );
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
                              </>
                              {editListingData ? (
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
                              ) : null}

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
                                    {console.log(
                                      "clickedUnitObject",
                                      clickedUnitObject
                                    )}
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
                                      <Row>
                                        <Col>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                          >
                                            You don't have any leases for this
                                            unit right now.
                                          </Typography>
                                        </Col>
                                      </Row>
                                    )}
                                  </tbody>
                                </Table>
                              </Row>
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
                                  Appliances{" "}
                                  <Button
                                    size="sm"
                                    style={{
                                      background: "white",
                                      color: "blue",
                                      marginBottom: "5px",
                                    }}
                                    onClick={() => {
                                      setAddAppliances(!addAppliances);
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
                                          }}
                                        />
                                        <CardBody>
                                          <form
                                            onSubmit={
                                              addUnitFormik.handleSubmit
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
                                                />
                                              </div>
                                            </div>
                                            <div style={{ marginTop: "10px" }}>
                                              <Button
                                                color="success"
                                                type="submit"
                                                onClick={() => {
                                                  setAddAppliances(
                                                    !addAppliances
                                                  );
                                                }}
                                              >
                                                Save
                                              </Button>
                                              <Button
                                                onClick={() => {
                                                  setAddAppliances(
                                                    !addAppliances
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
                                </>
                              ) : (
                                <>
                                  {clickedUnitObject?.appliances ? (
                                    <>
                                      {clickedUnitObject?.appliances.map(
                                        (appliance, index) => {
                                          <Row key={index}>
                                            <Col>{appliance}</Col>
                                          </Row>;
                                        }
                                      )}
                                    </>
                                  ) : (
                                    <Row>
                                      <Col>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                          component="p"
                                        >
                                          You don't have any appliances for this
                                          unit right now.
                                        </Typography>
                                      </Col>
                                    </Row>
                                  )}
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

      <Dialog
        open={openEdite}
        onClose={closeModal}
        style={{ overflowY: "hidden", maxWidth: "600" }}
      >
        <DialogTitle>Edit Unit Details</DialogTitle>
        <CloseIcon
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
          }}
          onClick={() => {
            setOpenEdite(!openEdite);
          }}
        />
        <UnitEdite
          openEdite={openEdite}
          closeModal={closeModal}
          setOpenEdite={setOpenEdite}
          clickedObject={clickedUnitObject}
          addUnitFormik={addUnitFormik}
        />
      </Dialog>
      {console.log(addUnitFormik, "yashu")}
    </>
  );
};

export default PropDetails2;
