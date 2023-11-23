import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "components/Headers/Header";
import {
  Card,
  CardHeader,
  FormGroup,
  Container,
  Row,
  Col,
  Table,
  Button,
  Input,
  Form,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import ClearIcon from "@mui/icons-material/Clear";
// import * as React from 'react';
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Cookies from "universal-cookie";
// import { Grid, Modal } from "@mui/material";
import { BedSharp, Clear, Image } from "@mui/icons-material";
import { OpenImageDialog } from "components/OpenImageDialog";
import { useFormik } from "formik";
import moment from "moment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const PropDetails = () => {
  const { id, entryIndex } = useParams();
  console.log(id);
  const [propertyDetails, setpropertyDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let navigate = useNavigate();
  const [matchedProperty, setMatchedProperty] = useState({});
  const getRentalsData = async () => {
    try {
      const response = await axios.get(
        `https://propertymanager.cloudpress.host/api/rentals/rentals_summary/${id}`
      );
      setpropertyDetails(response.data.data);
      console.log(response.data.data, "response frirn simmary");
      const matchedProperty = response.data.data.entries.find(
        (property) => property.entryIndex === entryIndex
      );
      setMatchedProperty(matchedProperty);
      console.log(matchedProperty, `matched property`);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getRentalsData();
    console.log(id);
  }, [id]);

  let cookies = new Cookies();
  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let authConfig = {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
          token: cookies.get("token"),
        },
      };
      // auth post method
      let res = await axios.post(
        "https://propertymanager.cloudpress.host/api/register/auth",
        { purpose: "validate access" },
        authConfig
      );
      if (res.data.statusCode !== 200) {
        // cookies.remove("token");
        navigate("/auth/login");
      }
    } else {
      navigate("/auth/login");
    }
  };

  React.useEffect(() => {
    chackAuth();
  }, [cookies.get("token")]);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [roomDropdown, setRoomDropdown] = useState(false);
  const [bathDropdown, setBathDropdown] = useState(false);
  const [financialDropdown, setFinancialDropdown] = useState(false);

  const toggle1 = () => setRoomDropdown((prevState) => !prevState);
  const toggle2 = () => setBathDropdown((prevState) => !prevState);
  const toggle3 = () => setFinancialDropdown((prevState) => !prevState);
  const roomsArray = [
    "1 Bed",
    "2 Bed",
    "3 Bed",
    "4 Bed",
    "5 Bed",
    "6 Bed",
    "7 Bed",
    "8 Bed",
    "9 Bed",
    "9+ Bed",
  ];

  const bathArray = [
    "1 Bath",
    "1.5 Bath",
    "2 Bath",
    "2.5 Bath",
    "3 Bath",
    "3.5 Bath",
    "4 Bath",
    "4.5 Bath",
    "5 Bath",
    "5+ Bath",
  ];

  const financialTypeArray = [
    // "Next month",
    "Month to date",
    "Three months to date",
    // "Quarter to date",
    // "Year to date",
    // "Last month",
    // "Last quarter",
    // "Last year",
  ];
  // const openModal = (imageUrl) => {
  //   setSelectedImage(imageUrl);
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("summary");
  const [addUnitDialogOpen, setAddUnitDialogOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  // function ImageModal({ imageUrl, closeModal }) {
  //   return (
  //     <div className="image-modal" onClick={closeModal}>
  //       <img src={imageUrl} alt="Opened Image" />
  //     </div>
  //   );
  // }
  const addUnitFormik = useFormik({
    initialValues: {
      unit_number: "",
      market_rent: "",
      size: "",
      address1: "",
      address2: "",
      address3: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      bed: "",
      baths: "",
      description: "",
      aminities: [],
    },

    onSubmit: (values) => {
      console.log(values);
    },
  });
  const [financialType, setFinancialType] = React.useState("");
  const [month, setMonth] = useState([]);
  const [threeMonths, setThreeMonths] = useState([]);

  const handleFinancialSelection = (value) => {
    // console.log(value);
    setFinancialType(value);
    todayDate();
    // addUnitFormik.setFieldValue("date", date);
    // addUnitFormik.setFieldValue("date", date);
  };

  useEffect(() => {
    todayDate();
    lastThreeMonths();
  }, []);

  const todayDate = () => {
    //how can i get last three months name from today's date
    // Print the names of the last three months

    const todayDate = moment().format("YYYY-MM-DD");
    console.log(todayDate, "todayDate");
    const monthNumber = todayDate.substring(5, 7);
    const month = new Date(0, monthNumber - 1).toLocaleString("en-US", {
      month: "long",
    });
    setMonth(month);
  };

  const lastThreeMonths = () => {
    const today = moment();
    const lastThreeMonths = [];
    for (let i = 0; i < 2; i++) {
      const month = today.subtract(1, "month").format("MMMM");
      lastThreeMonths.unshift(month);
    }
    // lastThreeMonths.push(month);
    setThreeMonths(lastThreeMonths);
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col xs="12" sm="6">
            <h1 style={{ color: "white" }}>Property Details</h1>
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
        {/* Table */}
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
                        label="Units"
                        style={{ textTransform: "none" }}
                        value="units"
                      />
                    </TabList>
                  </Box>
                  <TabPanel value="summary">
                    <div className="table-responsive">
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
                        ) : error ? (
                          <tbody>
                            <tr>
                              <td>Error: {error.message}</td>
                            </tr>
                          </tbody>
                        ) : propertyDetails._id ? (
                          <>
                            <tbody>
                              <tr>
                                <th
                                  colSpan="2"
                                  className="text-primary text-lg"
                                >
                                  Property Details
                                </th>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Image
                                </td>
                                <td>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    {matchedProperty.propertyres_image &&
                                      matchedProperty.propertyres_image.length >
                                        0 && (
                                        <div
                                          style={{
                                            width: "100%", // Expands to full width by default
                                          }}
                                        >
                                          Residential:
                                          {matchedProperty.propertyres_image.map(
                                            (propertyres_image, index) => (
                                              <img
                                                key={index}
                                                src={propertyres_image}
                                                alt="Property Details"
                                                onClick={() => {
                                                  setSelectedImage(
                                                    propertyres_image
                                                  );
                                                  setOpen(true);
                                                }}
                                                style={{
                                                  width: "100px",
                                                  height: "100px",
                                                  // objectFit: "cover",
                                                  margin: "10px",
                                                  borderRadius: "10px",
                                                  "@media (max-width: 768px)": {
                                                    width: "100%", // Full-width on smaller screens
                                                  },
                                                }}
                                              />
                                            )
                                          )}
                                          {/* <Modal
                                      open={open}
                                      onClose={handleClose}
                                      aria-labelledby="modal-modal-title"
                                      aria-describedby="modal-modal-description"
                                    >
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "50%",
                                          transform: "translate(-50%, -50%)",
                                          backgroundColor: "white",
                                          border: "2px solid #000",
                                          padding: "2rem",
                                        }}
                                      >
                                        <img
                                          style={style}
                                          src={selectedImage}
                                          alt="Image"
                                        />
                                        <ClearIcon
                                          style={{
                                            cursor: "pointer",
                                            position: "absolute",
                                            top: "-99px",
                                            right: "-171px",
                                          }}
                                          onClick={handleClose}
                                        />
                                      </div>
                                    </Modal> */}
                                          <OpenImageDialog
                                            open={open}
                                            setOpen={setOpen}
                                            selectedImage={selectedImage}
                                          />
                                        </div>
                                      )}
                                    {matchedProperty.property_image &&
                                      matchedProperty.property_image.length >
                                        0 && (
                                        <div
                                          style={{
                                            width: "100%", // Expands to full width by default
                                          }}
                                        >
                                          Commercial:
                                          {matchedProperty.property_image.map(
                                            (property_image, index) => (
                                              <img
                                                key={index}
                                                src={property_image}
                                                alt="Property Details"
                                                style={{
                                                  width: "100px",
                                                  height: "100px",
                                                  // objectFit: "cover",
                                                  margin: "10px",
                                                  borderRadius: "10px",
                                                  "@media (max-width: 768px)": {
                                                    width: "100%", // Full-width on smaller screens
                                                  },
                                                }}
                                              />
                                            )
                                          )}
                                        </div>
                                      )}
                                  </div>
                                </td>
                              </tr>

                              <tr>
                                <td className="font-weight-bold text-md">
                                  Property Type
                                </td>
                                <td>
                                  {matchedProperty.property_type || "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Address
                                </td>
                                <td>
                                  {matchedProperty.rental_adress || "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  City
                                </td>
                                <td>{matchedProperty.rental_city || "N/A"}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Country
                                </td>
                                <td>
                                  {matchedProperty.rental_country || "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Postcode
                                </td>
                                <td>
                                  {matchedProperty.rental_postcode || "N/A"}
                                </td>
                              </tr>
                            </tbody>

                            <tbody>
                              <tr>
                                <th
                                  colSpan="2"
                                  className="text-primary text-lg"
                                >
                                  Rental Owner Details
                                </th>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  First Name
                                </td>
                                <td>
                                  {propertyDetails.rentalOwner_firstName ||
                                    "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Last Name
                                </td>
                                <td>
                                  {propertyDetails.rentalOwner_lastName ||
                                    "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Company Name
                                </td>
                                <td>
                                  {propertyDetails.rentalOwner_companyName ||
                                    "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  E-Mail
                                </td>
                                <td>
                                  {propertyDetails.rentalOwner_primaryEmail ||
                                    "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Phone Number
                                </td>
                                <td>
                                  {propertyDetails.rentalOwner_phoneNumber ||
                                    "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Home Number
                                </td>
                                <td>
                                  {propertyDetails.rentalOwner_homeNumber ||
                                    "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Business Number
                                </td>
                                <td>
                                  {propertyDetails.rentalOwner_businessNumber ||
                                    "N/A"}
                                </td>
                              </tr>
                            </tbody>

                            {/* <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Account Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Operating Account
                          </td>
                          <td>
                            {propertyDetails.rentalOwner_operatingAccount ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Property Reserve
                          </td>
                          <td>
                            {propertyDetails.rentalOwner_propertyReserve ||
                              "N/A"}
                          </td>
                        </tr>
                      </tbody> */}

                            <tbody>
                              <tr>
                                <th
                                  colSpan="2"
                                  className="text-primary text-lg"
                                >
                                  Staff Details
                                </th>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Staff Member
                                </td>
                                <td>{matchedProperty.staffMember || "N/A"}</td>
                              </tr>
                            </tbody>

                            <tbody>
                              <tr>
                                <th
                                  colSpan="2"
                                  className="text-primary text-lg"
                                >
                                  Unit Details
                                </th>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Unit
                                </td>
                                <td>
                                  {matchedProperty.rental_units ||
                                    matchedProperty.rentalcom_units ||
                                    "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Unit Address
                                </td>
                                <td>
                                  {matchedProperty.rental_unitsAdress ||
                                    matchedProperty.rentalcom_unitsAdress ||
                                    "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Bed
                                </td>
                                <td>{matchedProperty.rental_bed || "N/A"}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  Bath
                                </td>
                                <td>{matchedProperty.rental_bath || "N/A"}</td>
                              </tr>
                              <tr>
                                <td className="font-weight-bold text-md">
                                  SQFT
                                </td>
                                <td>
                                  {matchedProperty.rental_soft ||
                                    matchedProperty.rentalcom_soft ||
                                    "N/A"}
                                </td>
                              </tr>
                            </tbody>
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
                    <>
                      <Col
                        lg="6"
                        className="text-primary text-lg font-weight-bold"
                      >
                        <FormGroup>
                          <Dropdown isOpen={financialDropdown} toggle={toggle3}>
                            <DropdownToggle caret color="primary"
                                  style={{
                                    background: "white",
                                    color: "blue",
                                    // marginRight: "10px",
                                  }}>
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
                                  
                                  // onClick={() =>
                                  //   handlePropSelection(
                                  //     subtype.propertysub_type
                                  //   )
                                  // }
                                >
                                  {subtype}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </FormGroup>
                      </Col>

                      {false ? (
                        <div>Loading...</div>
                      ) : (
                        <>
                          {financialType === "Month to date" && (
                            <Table responsive>
                              <thead>
                                <th>Property account</th>
                                <th>{month} 1 to date</th>
                              </thead>
                              <tbody>
                                <tr>
                                  <th className="font-weight-bold text-md">
                                    Property account
                                  </th>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Income
                                  </th>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th>Application fee income</th>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th>Rent income</th>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total income
                                  </th>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Expenses
                                  </th>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total expenses
                                  </th>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Net operating income
                                  </th>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Net income
                                  </th>
                                  <td>N/A</td>
                                </tr>
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
                                <th>
                                  Total as of {moment().format("YYYY/MM/DD")}
                                </th>
                              </thead>
                              <tbody>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Income
                                  </th>
                                </tr>
                                <tr>
                                  <th>Application fee income</th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th>Rent income</th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total income
                                  </th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Expenses
                                  </th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th>Landscaping</th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th>Repairs</th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th>Supplies</th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th>Utilities</th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total expenses
                                  </th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Net operating income
                                  </th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Net income
                                  </th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                              </tbody>
                            </Table>
                          )}
                        </>
                      )}
                    </>
                  </TabPanel>
                  <TabPanel value="units">
                    {addUnitDialogOpen ? (
                      <>
                        <Form onSubmit={addUnitFormik.handleSubmit}>
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
                                  Unit Number
                                </label>
                                <Input
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
                                  Market Rent
                                </label>
                                <Input
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
                                  placeholder="Size"
                                  type="number"
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
                                  Address
                                </label>
                                <Input
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
                                <Input
                                  className="form-control-alternative"
                                  id="address2"
                                  placeholder="Address"
                                  type="text"
                                  name="address2"
                                  value={addUnitFormik.values.address2}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                  style={{ marginBottom: "10px" }}
                                />
                                <Input
                                  className="form-control-alternative"
                                  id="address3"
                                  placeholder="Address"
                                  type="text"
                                  name="address3"
                                  value={addUnitFormik.values.address3}
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
                                  City
                                </label>
                                <Input
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
                                  State
                                </label>
                                <Input
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
                                  Zip
                                </label>
                                <Input
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
                                  Country
                                </label>
                                <Input
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
                          >
                            Rooms (optional)
                          </label>
                          <Row style={{ marginTop: "10px" }}>
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
                                        // onClick={() =>
                                        //   handlePropSelection(
                                        //     subtype.propertysub_type
                                        //   )
                                        // }
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
                                            "baths",
                                            subtype
                                          );
                                        }}
                                        onChange={addUnitFormik.handleChange}
                                        onBlur={addUnitFormik.handleBlur}
                                        // onClick={() =>
                                        //   handlePropSelection(
                                        //     subtype.propertysub_type
                                        //   )
                                        // }
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
                                  htmlFor="input-add"
                                >
                                  Amenities (optional)
                                </label>
                                <Button
                                  className="btn-icon btn-2"
                                  name="input-add"
                                >
                                  Add
                                </Button>
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
                    ) : (
                      <div>
                        {/* 3 buttons in right side of table */}
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
                            // style={{ marginRight: "10px" }}
                            style={{
                              background: "white",
                              color: "blue",
                              // marginRight: "10px",
                            }}
                            size="l"
                            onClick={() => setAddUnitDialogOpen(true)}
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
                              <th scope="col">Most Recent Events</th>
                            </tr>
                          </thead>
                        </Table>
                        <></>
                      </div>
                    )}
                  </TabPanel>
                </TabContext>
                {/* <h3 className="mb-0">Summary</h3> */}
              </Col>
            </Card>
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default PropDetails;
