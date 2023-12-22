import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
} from "reactstrap";
import { jwtDecode } from "jwt-decode";

import { useState, useEffect } from "react";
//import RentalHeader from "components/Headers/RentalHeader.js";
import RentalownerHeder from "components/Headers/RentalownerHeder.js";
import swal from "sweetalert";

import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { AddBox, InboxOutlined, Numbers } from "@mui/icons-material";
import { faLeftLong, faRightLeft } from "@fortawesome/free-solid-svg-icons";
import { Hidden } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "universal-cookie";
import {
  faPhone,
  faHome,
  faBriefcase,
  faEnvelope,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// const Rental = () => {
//   const handleFormSubmit = () => {
//     swal("Success!", "Rental owner added successfully", "success");
//   };
// };

const Rentals = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [statedropdownOpen, setstateDropdownOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [filteredRentalsData, setFilteredRentalsData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  // const [laesingdata, setlaesingdata] = useState([]);
  // const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedState, setSelectedState] = useState("United State");
  const [selectedProp, setSelectedProp] = useState([]);
  const [loading, setIsLoading] = useState(true);

  const toggle1 = () => setstateDropdownOpen((prevState) => !prevState);

  // const [open, setOpen] = React.useState(false);

  const handleStateSelection = (value) => {
    setSelectedState(value);
    setstateDropdownOpen(true);
  };

  const handlePropSelection = (value) => {
    setSelectedProp(value);
  };

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false); // Close the form by setting the 'open' state to false
  // };
 let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
  const handleCloseButtonClick = () => {
    // Use history.push to navigate to the PropertiesTable page
    navigate("../RentalownerTable");
  };
  // const handelcreateowner = () => {
  //   navigate("../RentalownerTable");
  // };

  // const handleChange = (e) => {
  //   // setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  // };

  // const [selectedPropertyType, setSelectedPropertyType] = useState("");
  // const handlePropertyTypeSelect = (propertyType) => {
  //   setSelectedPropertyType(propertyType);
  //   localStorage.setItem("propertyType", propertyType);
  // };

  // const [selectedOperatingAccount, setSelectedOperatingAccount] = useState("");
  // const handleOperatingAccount = (operatingAccount) => {
  //   setSelectedOperatingAccount(operatingAccount);
  //   localStorage.setItem("operatingAccount", operatingAccount);
  // };

  let navigate = useNavigate();
  // const handleSubmit = async (values) => {
  //   values["rentalOwner_country"] = selectedState;

  //   //console.log(values, "values");
  //   try {
  //     // values["property_type"] = localStorage.getItem("propertyType");
  //     const res = await axios.post(
  //       "https://propertymanager.cloudpress.host/api/rentalowner/rentalowner",
  //       values
  //     );
  //     if (res.data.statusCode === 200) {
  //       swal("", res.data.message, "success");
  //       navigate("/admin/RentalownerTable");
  //     } else {
  //       swal("", res.data.message, "error");
  //     }
  //   } catch (error) {
  //     //console.log(error);
  //   }
  // };
  async function handleSubmit(values) {
    try {
      values["rentalOwner_country"] = selectedState;

      // Fetch the complete property objects for the selected property IDs
      const selectedPropertyData = propertyData.filter((property) =>
        selectedProperties.includes(property._id)
      );

      // Assign the selected property data to the "rentalOwner_properties" field
      values["rentalOwner_properties"] = selectedPropertyData;

      if (id === undefined) {
        const res = await axios.post(
          `${baseUrl}/rentalowner/rentalowner`,
          values
        );
        handleResponse(res);
      } else {
        const editUrl = `${baseUrl}/rentalowner/rentalowner/${id}`;
        const res = await axios.put(editUrl, values);
        handleResponse(res);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
      // Handle the error and display an error message to the user if necessary.
    }
  }

  function handleResponse(response) {
    if (response.status === 200) {
      navigate("/admin/RentalownerTable");
      swal(
        "Success!",
        id ? "property updated successfully" : "property added successfully!",
        "success"
      );
    } else {
      alert(response.data.message);
    }
  }
  let rentalsFormik = useFormik({
    initialValues: {
      rentalowner_firstName: "",
      rentalOwner_lastName: "",
      rentalOwner_companyName: "",
      birth_date: "",
      start_date: "",
      end_date: "",
      rentalOwner_primaryEmail: "",
      rentalOwner_alternateEmail: "",
      rentalOwner_phoneNumber: "",
      rentalOwner_homeNumber: "",
      rentalOwner_businessNumber: "",
      rentalOwner_telephoneNumber: "",
      rentalOwner_streetAdress: "",
      rentalOwner_city: "",
      rentalOwner_state: "",
      rentalOwner_zip: "",
      rentalOwner_country: "",
      rentalOwner_comments: "",
      text_identityType: "",
      textpayer_id: "",
      rentalOwner_properties: [],
    },
    validationSchema: yup.object({
      // property_type: yup.string().required("Required"),
      // lease_type: yup.string().required("Required"),
      // tenant_firstName: yup.string().required("Required"),
      // tenant_lastName: yup.string().required("Required"),
      // tenant_mobileNumber: yup.string().required("Required"),
      // tenant_email: yup.string().required("Required"),
      tenant_password: yup
        .string()
        // .required("No Password Provided")
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
        ),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      //console.log(values, "values");
    },
  });
  const filterRentalsBySearch = () => {
    if (!searchQuery) {
      return propertyData;
    }

    return propertyData.filter((property) => {
      return property.rental_adress
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
  };

  const handlePropertyCheckboxChange = (propertyId) => {
    setSelectedProperties((prevSelectedProperties) => {
      if (prevSelectedProperties.includes(propertyId)) {
        return prevSelectedProperties.filter((id) => id !== propertyId);
      } else {
        return [...prevSelectedProperties, propertyId];
      }
    });
  };

  // Function to handle "Select All" checkbox change
  const handleSelectAllChange = () => {
    if (!selectAllChecked) {
      // If "Select All" is checked, select all properties
      setSelectedProperties(propertyData.map((property) => property._id));
    } else {
      // If "Select All" is unchecked, clear the selection
      setSelectedProperties([]);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  React.useEffect(() => {
    // Fetch data from your API
    fetch(`${baseUrl}/rentals/property_onrent`)
      .then((response) => response.json())
      .then((data) => {
        //console.log("Data from API:", data); // Log the response data
        if (data.statusCode === 200) {
          setPropertyData(data.data);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  }, []);
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  const [rentalOwnerData, setRentalOwnerData] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`${baseUrl}/rentalowner/rentalowner/${id}`)
        .then((response) => {
          const rentalOwnerdata = response.data.data;
          setRentalOwnerData(rentalOwnerData);
          //console.log(rentalOwnerdata);
          setIsLoading(false);
          setSelectedState(rentalOwnerdata.rentalOwner_country || "Select");

          // const formattedStartDate = rentalsFormik.start_date
          //   ? new Date(rentalOwnerdata.start_date).toISOString().split("T")[0]
          //   : "";
          // const formattedEndDate = rentalsFormik.end_date
          //   ? new Date(rentalOwnerdata.end_date).toISOString().split("T")[0]
          //   : "";
          // const formattedBirthDate = rentalsFormik.birth_date
          //   ? new Date(rentalOwnerdata.birth_date).toISOString().split("T")[0]
          //   : "";
          //   //console.log("Formatted Start Date:", formattedStartDate);
          //   //console.log("Formatted End Date:", formattedEndDate);
          //   //console.log("Formatted Birth Date:", formattedBirthDate);
          // // Initialize the form with fetched data
          rentalsFormik.setValues({
            rentalowner_firstName: rentalOwnerdata.rentalowner_firstName || "",
            rentalOwner_lastName: rentalOwnerdata.rentalOwner_lastName || "",
            rentalOwner_companyName:
              rentalOwnerdata.rentalOwner_companyName || "",
            birth_date: formatDate(rentalOwnerdata.birth_date),
            start_date: formatDate(rentalOwnerdata.start_date),
            end_date: formatDate(rentalOwnerdata.end_date),
            rentalOwner_primaryEmail:
              rentalOwnerdata.rentalOwner_primaryEmail || "",
            rentalOwner_alternateEmail:
              rentalOwnerdata.rentalOwner_alternateEmail || "",
            rentalOwner_phoneNumber:
              rentalOwnerdata.rentalOwner_phoneNumber || "",
            rentalOwner_homeNumber:
              rentalOwnerdata.rentalOwner_homeNumber || "",
            rentalOwner_businessNumber:
              rentalOwnerdata.rentalOwner_businessNumber || "",
            rentalOwner_telephoneNumber:
              rentalOwnerdata.rentalOwner_telephoneNumber || "",
            rentalOwner_streetAdress:
              rentalOwnerdata.rentalOwner_streetAdress || "",
            rentalOwner_city: rentalOwnerdata.rentalOwner_city || "",
            rentalOwner_state: rentalOwnerdata.rentalOwner_state || "",
            rentalOwner_zip: rentalOwnerdata.rentalOwner_zip || "",
            rentalOwner_country: rentalOwnerdata.rentalOwner_country || "",
            rentalOwner_comments: rentalOwnerdata.rentalOwner_comments || "",
            text_identityType: rentalOwnerdata.text_identityType || "",
            rentalOwner_companyName:
              rentalOwnerdata.rentalOwner_companyName || "",
            textpayer_id: rentalOwnerdata.textpayer_id || "",
            rentalOwner_properties:
              rentalOwnerdata.rentalOwner_properties || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching rental owner data:", error);
          setIsLoading(false);
        });
    }
  }, [id]);
  return (
    <>
      <style>
        {`
    .custom-date-picker {
      background-color: white;
    }
  `}
      </style>
      <RentalownerHeder />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {id ? "Edit Reantal Owner" : "New Reantal Owner"}
                    </h3>
                  </Col>
                  <Col className="text-right" xs="4"></Col>
                </Row>
              </CardHeader>

              <CardBody>
                <Form role="form">
                  <h6 className="heading-small text-muted mb-4"></h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Name
                          </label>

                          <Row>
                            <Col lg="4">
                              <FormGroup>
                                <Input
                                  type="text"
                                  id="rentalowner_firstName"
                                  placeholder="First Name"
                                  onBlur={rentalsFormik.handleBlur}
                                  onChange={rentalsFormik.handleChange}
                                  value={
                                    rentalsFormik.values.rentalowner_firstName
                                  }
                                />
                                {rentalsFormik.touched.rentalowner_firstName &&
                                rentalsFormik.errors.rentalowner_firstName ? (
                                  <div style={{ color: "red" }}>
                                    {rentalsFormik.errors.rentalowner_firstName}
                                  </div>
                                ) : null}
                              </FormGroup>
                            </Col>
                            <Col lg="4">
                              <FormGroup>
                                <Input
                                  type="text"
                                  id="rentalOwner_lastName"
                                  placeholder="Last Name"
                                  onBlur={rentalsFormik.handleBlur}
                                  onChange={rentalsFormik.handleChange}
                                  value={
                                    rentalsFormik.values.rentalOwner_lastName
                                  }
                                />
                                {rentalsFormik.touched.rentalOwner_lastName &&
                                rentalsFormik.errors.rentalOwner_lastName ? (
                                  <div style={{ color: "red" }}>
                                    {rentalsFormik.errors.rentalOwner_lastName}
                                  </div>
                                ) : null}
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col>
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  Company Name
                                </label>

                                <Input
                                  type="text"
                                  id="rentalOwner_companyName"
                                  placeholder="Company Name"
                                  onBlur={rentalsFormik.handleBlur}
                                  onChange={rentalsFormik.handleChange}
                                  value={
                                    rentalsFormik.values.rentalOwner_companyName
                                  }
                                />
                                {rentalsFormik.touched
                                  .rentalOwner_companyName &&
                                rentalsFormik.errors.rentalOwner_companyName ? (
                                  <div style={{ color: "red" }}>
                                    {
                                      rentalsFormik.errors
                                        .rentalOwner_companyName
                                    }
                                  </div>
                                ) : null}
                              </FormGroup>
                            </Col>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </Row>

                          <Row>
                            <Col lg="4">
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
                                  Date Of Birth*
                                </label>
                                <br/>
                                <Input
                                  id="birth_date"
                                  placeholder="Date Of Birth"
                                  type="date"
                                  onBlur={rentalsFormik.handleBlur}
                                  onChange={rentalsFormik.handleChange}
                                  value={rentalsFormik.values.birth_date}
                                  
                                />
                                {/* <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                  style={{ backgroundColor: "white" }}
                                >
                                  <DatePicker
                                    className="form-control-alternative custom-date-picker"
                                    name="birth_date"
                                    slotProps={{ textField: { size: "small" } }}
                                    id="birth_date"
                                    views={["year", "month", "day"]}
                                    placeholder="3000"
                                    dateFormat="MM-dd-yyyy"
                                    onBlur={rentalsFormik.handleBlur}
                                    selected={rentalsFormik.values.birth_date}
                                    onChange={(date) => {
                                      rentalsFormik.setFieldValue(
                                        "birth_date",
                                        date
                                      );
                                    }}
                                  />
                                </LocalizationProvider> */}
                                {rentalsFormik.touched.birth_date &&
                                rentalsFormik.errors.birth_date ? (
                                  <div style={{ color: "red" }}>
                                    {rentalsFormik.errors.birth_date}
                                  </div>
                                ) : null}
                              </FormGroup>
                            </Col>
                          </Row>

                          <hr />

                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Managment agreement
                            </label>
                            <br></br>
                            <br></br>
                            <Row>
                              <Col lg="4">
                                <FormGroup
                                  // style={{
                                  //   display: "flex",
                                  //   flexDirection: "column",
                                  // }}
                                >
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-unitadd"
                                  >
                                    Start Date *
                                  </label>
                                  <br/>

                                  <Input
                                    id="start_date"
                                    placeholder="Start Date"
                                    type="date"
                                    onBlur={rentalsFormik.handleBlur}
                                    onChange={rentalsFormik.handleChange}
                                    value={rentalsFormik.values.start_date}
                                  />
                                  {/* <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      className="form-control-alternative custom-date-picker"
                                      name="start_date"
                                      slotProps={{
                                        textField: { size: "small" },
                                      }}
                                      id="start_date"
                                      placeholder="3000"
                                      views={["year", "month", "day"]}
                                      dateFormat="MM-dd-yyyy"
                                      onBlur={rentalsFormik.handleBlur}
                                      selected={rentalsFormik.values.start_date} // Use 'selected' prop instead of 'value'
                                      onChange={(date) => {
                                        rentalsFormik.setFieldValue(
                                          "start_date",
                                          date
                                        ); // Update the Formik field value
                                      }}
                                    />
                                  </LocalizationProvider> */}
                                  {rentalsFormik.touched.start_date &&
                                  rentalsFormik.errors.start_date ? (
                                    <div style={{ color: "red" }}>
                                      {rentalsFormik.errors.start_date}
                                    </div>
                                  ) : null}
                                </FormGroup>
                              </Col>
                            </Row>
                            &nbsp; &nbsp; &nbsp;
                            <FormGroup>
                              <Row>
                                <Col lg="4"
                                  // style={{
                                  //   display: "flex",
                                  //   flexDirection: "column",
                                  // }}
                                >
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-unitadd"
                                  >
                                    End Date *
                                  </label>
                                  <br/>
                                  <Input
                                    id="end_date"
                                    placeholder="End Date"
                                    type="date"
                                    onBlur={rentalsFormik.handleBlur}
                                    onChange={rentalsFormik.handleChange}
                                    value={rentalsFormik.values.end_date}
                                  />
                                  {/* <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      className="form-control-alternative custom-date-picker"
                                      name="end_date"
                                      slotProps={{
                                        textField: { size: "small" },
                                      }}
                                      id="end_date"
                                      placeholder="3000"
                                      views={["year", "month", "day"]}
                                      dateFormat="MM-dd-yyyy"
                                      onBlur={rentalsFormik.handleBlur}
                                      selected={rentalsFormik.values.end_date} // Use 'selected' prop instead of 'value'
                                      onChange={(date) => {
                                        rentalsFormik.setFieldValue(
                                          "end_date",
                                          date
                                        ); // Update the Formik field value
                                      }}
                                    />
                                  </LocalizationProvider> */}
                                  {rentalsFormik.touched.end_date &&
                                  rentalsFormik.errors.end_date ? (
                                    <div style={{ color: "red" }}>
                                      {rentalsFormik.errors.end_date}
                                    </div>
                                  ) : null}
                                </Col>
                              </Row>
                            </FormGroup>
                          </FormGroup>

                          <hr></hr>

                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Contact information
                            </label>
                          </FormGroup>

                          <Row>
                            <Col>
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Primary E-mail
                                </label>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              </FormGroup>

                              <FormGroup>
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">
                                      <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                  </div>
                                  <Input
                                    type="text"
                                    id="rentalOwner_primaryEmail"
                                    placeholder="Enter Email"
                                    onBlur={rentalsFormik.handleBlur}
                                    onChange={rentalsFormik.handleChange}
                                    value={
                                      rentalsFormik.values
                                        .rentalOwner_primaryEmail
                                    }
                                  />
                                  {rentalsFormik.touched
                                    .rentalOwner_primaryEmail &&
                                  rentalsFormik.errors
                                    .rentalOwner_primaryEmail ? (
                                    <div style={{ color: "red" }}>
                                      {
                                        rentalsFormik.errors
                                          .rentalOwner_primaryEmail
                                      }
                                    </div>
                                  ) : null}
                                </div>
                              </FormGroup>
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Alternative E-mail
                                  {/* <EmailIcon/> */}
                                </label>
                                &nbsp;
                              </FormGroup>

                              <FormGroup>
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">
                                      <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                  </div>
                                  <Input
                                    type="text"
                                    id="rentalOwner_alternateEmail"
                                    placeholder="Enter_Email"
                                    onBlur={rentalsFormik.handleBlur}
                                    onChange={rentalsFormik.handleChange}
                                    value={
                                      rentalsFormik.values
                                        .rentalOwner_alternateEmail
                                    }
                                  />
                                  {rentalsFormik.touched
                                    .rentalOwner_alternateEmail &&
                                  rentalsFormik.errors
                                    .rentalOwner_alternateEmail ? (
                                    <div style={{ color: "red" }}>
                                      {
                                        rentalsFormik.errors
                                          .rentalOwner_alternateEmail
                                      }
                                    </div>
                                  ) : null}
                                </div>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Col></Col>
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-property"
                            >
                              Phone Numbers
                            </label>
                          </FormGroup>

                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <FontAwesomeIcon icon={faPhone} />
                              </span>
                            </div>
                            <Input
                              type="text"
                              id="rentalOwner_phoneNumber"
                              placeholder="Phone Number"
                              onBlur={rentalsFormik.handleBlur}
                              onChange={rentalsFormik.handleChange}
                              value={
                                rentalsFormik.values.rentalOwner_phoneNumber
                              }
                              onInput={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(
                                /\D/g,
                                ""
                              ); // Remove non-numeric characters
                              e.target.value = numericValue;
                            }}
                            />
                            {rentalsFormik.touched.rentalOwner_phoneNumber &&
                            rentalsFormik.errors.rentalOwner_phoneNumber ? (
                              <div
                                style={{
                                  color: "red",
                                }}
                              >
                                {rentalsFormik.errors.rentalOwner_phoneNumber}
                              </div>
                            ) : null}
                          </div>
                          <br />

                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <FontAwesomeIcon icon={faHome} />
                              </span>
                            </div>
                            <Input
                              type="text"
                              id="rentalOwner_homeNumber"
                              placeholder="Home Number"
                              onBlur={rentalsFormik.handleBlur}
                              onChange={rentalsFormik.handleChange}
                              value={
                                rentalsFormik.values.rentalOwner_homeNumber
                              }
                              onInput={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(
                                /\D/g,
                                ""
                              ); // Remove non-numeric characters
                              e.target.value = numericValue;
                            }}
                            />
                            {rentalsFormik.touched.rentalOwner_homeNumber &&
                            rentalsFormik.errors.rentalOwner_homeNumber ? (
                              <div
                                style={{
                                  color: "red",
                                }}
                              >
                                {rentalsFormik.errors.rentalOwner_homeNumber}
                              </div>
                            ) : null}
                          </div>

                          <br />

                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <FontAwesomeIcon icon={faBriefcase} />
                              </span>
                            </div>
                            <Input
                              type="text"
                              id="rentalOwner_businessNumber"
                              placeholder="Office Number"
                              onBlur={rentalsFormik.handleBlur}
                              onChange={rentalsFormik.handleChange}
                              value={
                                rentalsFormik.values.rentalOwner_businessNumber
                              }
                              onInput={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(
                                /\D/g,
                                ""
                              ); // Remove non-numeric characters
                              e.target.value = numericValue;
                            }}
                            />
                            {rentalsFormik.touched.rentalOwner_businessNumber &&
                            rentalsFormik.errors.rentalOwner_businessNumber ? (
                              <div
                                style={{
                                  color: "red",
                                }}
                              >
                                {
                                  rentalsFormik.errors
                                    .rentalOwner_businessNumber
                                }
                              </div>
                            ) : null}
                          </div>
                          <br />

                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <FontAwesomeIcon icon={faPhone} />
                              </span>
                            </div>
                            <Input
                              type="text"
                              id="rentalOwner_telephoneNumber"
                              placeholder="Telephone Number"
                              onBlur={rentalsFormik.handleBlur}
                              onChange={rentalsFormik.handleChange}
                              value={
                                rentalsFormik.values.rentalOwner_telephoneNumber
                              }
                              onInput={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(
                                /\D/g,
                                ""
                              ); // Remove non-numeric characters
                              e.target.value = numericValue;
                            }}
                            />
                            {rentalsFormik.touched
                              .rentalOwner_telephoneNumber &&
                            rentalsFormik.errors.rentalOwner_telephoneNumber ? (
                              <div
                                style={{
                                  color: "red",
                                }}
                              >
                                {
                                  rentalsFormik.errors
                                    .rentalOwner_telephoneNumber
                                }
                              </div>
                            ) : null}
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Street Address
                          </label>
                        </FormGroup>
                        <Input
                          type="text"
                          id="rentalOwner_streetAdress"
                          placeholder="Address"
                          onBlur={rentalsFormik.handleBlur}
                          onChange={rentalsFormik.handleChange}
                          value={rentalsFormik.values.rentalOwner_streetAdress}
                        />
                        {rentalsFormik.touched.rentalOwner_streetAdress &&
                        rentalsFormik.errors.rentalOwner_streetAdress ? (
                          <div
                            style={{
                              color: "red",
                            }}
                          >
                            {rentalsFormik.errors.rentalOwner_streetAdress}
                          </div>
                        ) : null}
                      </Col>
                    </Row>
                    <br></br>

                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            City
                          </label>
                          <Input
                            type="text"
                            id="rentalOwner_city"
                            placeholder="City"
                            onChange={rentalsFormik.handleChange}
                            value={rentalsFormik.values.rentalOwner_city}
                          />
                          {rentalsFormik.touched.rentalOwner_city &&
                          rentalsFormik.errors.rentalOwner_city ? (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {rentalsFormik.errors.rentalOwner_city}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-state"
                          >
                            State
                          </label>

                          <Input
                            type="text"
                            id="rentalOwner_state"
                            placeholder="State"
                            onChange={rentalsFormik.handleChange}
                            value={rentalsFormik.values.rentalOwner_state}
                          />
                          {rentalsFormik.touched.rentalOwner_state &&
                          rentalsFormik.errors.rentalOwner_state ? (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {rentalsFormik.errors.rentalOwner_state}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-zip"
                          >
                            Zip
                          </label>
                          <Input
                            type="text"
                            id="rentalOwner_zip"
                            placeholder="zip code"
                            onChange={rentalsFormik.handleChange}
                            value={rentalsFormik.values.rentalOwner_zip}
                            onInput={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(
                                /\D/g,
                                ""
                              ); // Remove non-numeric characters
                              e.target.value = numericValue;
                            }}
                          />
                          {rentalsFormik.touched.rentalOwner_zip &&
                          rentalsFormik.errors.rentalOwner_zip ? (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {rentalsFormik.errors.rentalOwner_zip}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <FormGroup>
                    <Row>
                      <Col>
                        <Col lg="4">
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            <div className="pl-lg-4">Country</div>
                          </label>

                          <br />
                          <Row>
                            <div
                              style={{ display: "flex" }}
                              className="pl-lg-4"
                            >
                              <Dropdown
                                isOpen={statedropdownOpen}
                                toggle={toggle1}
                              >
                                <DropdownToggle caret style={{ width: "200%" }}>
                                  {/* {selectedState} &nbsp;&nbsp; */}
                                  {selectedState ? selectedState : "Select"}
                                </DropdownToggle>
                                <DropdownMenu
                                  style={{
                                    width: "200px",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                  }}
                                  onBlur={rentalsFormik.handleBlur}
                                  onChange={rentalsFormik.handleChange}
                                  value={
                                    rentalsFormik.values.rentalOwner_country
                                  }
                                >
                                  {rentalsFormik.touched.rentalOwner_country &&
                                  rentalsFormik.errors.rentalOwner_country ? (
                                    <div style={{ color: "red" }}>
                                      {rentalsFormik.errors.rentalOwner_country}
                                    </div>
                                  ) : null}
                                  <DropdownItem
                                    onClick={() =>
                                      handleStateSelection("Afghanistan ")
                                    }
                                  >
                                    Afghanistan{" "}
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStateSelection("Burundi ")
                                    }
                                  >
                                    Burundi
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStateSelection("Cameroon ")
                                    }
                                  >
                                    Cameroon
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStateSelection("Canada")
                                    }
                                  >
                                    Canada
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStateSelection("Burma")
                                    }
                                  >
                                    Burm
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => handleStateSelection("chad")}
                                  >
                                    cha
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStateSelection("United States ")
                                    }
                                  >
                                    United States
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStateSelection("Afghanistan ")
                                    }
                                  >
                                    Afghanistan{" "}
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStateSelection("Burundi ")
                                    }
                                  >
                                    Burundi
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStateSelection("Cameroon ")
                                    }
                                  >
                                    Cameroon
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStateSelection("Canada")
                                    }
                                  >
                                    Canada
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStateSelection("Burma")
                                    }
                                  >
                                    Burm
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStateSelection("Brazil")
                                    }
                                  >
                                    Brazil
                                  </DropdownItem>

                                  {/* Add more city names here */}
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          </Row>
                        </Col>
                      </Col>
                    </Row>
                  </FormGroup>

                  <Col>
                    <Row>
                      <FormGroup>
                        <div className="pl-lg-4">
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Comments
                            <br></br>
                            <Input
                              type="text" // Use type "tel" for mobile numbers
                              id="rentalOwner_comments"
                              placeholder="Enter Comment"
                              onChange={rentalsFormik.handleChange}
                              value={rentalsFormik.values.rentalOwner_comments}
                            />
                            {rentalsFormik.touched.rentalOwner_comments &&
                            rentalsFormik.errors.rentalOwner_comments ? (
                              <div
                                style={{
                                  color: "red",
                                }}
                              >
                                {rentalsFormik.errors.rentalOwner_comments}
                              </div>
                            ) : null}
                            <br></br>
                            1099-NEC tax filing information
                          </label>
                        </div>
                      </FormGroup>
                    </Row>
                  </Col>

                  <FormGroup>
                    <Row>
                      <Col lg="4" className="ml-lg-4">
                        <label
                          className="form-control-label"
                          htmlFor="input-tax"
                        >
                          Tax Identity Type
                        </label>

                        <Input
                          type="text"
                          id="text_identityType"
                          placeholder="Tax Identity Type"
                          onChange={rentalsFormik.handleChange}
                          value={rentalsFormik.values.text_identityType}
                        />
                        {rentalsFormik.touched.text_identityType &&
                        rentalsFormik.errors.text_identityType ? (
                          <div
                            style={{
                              color: "red",
                            }}
                          >
                            {rentalsFormik.errors.text_identityType}
                          </div>
                        ) : null}
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup>
                    <Row>
                      <Col lg="4" className="ml-lg-4">
                        <label
                          className="form-control-label"
                          htmlFor="input-taxpayer_id"
                        >
                          Taxpayer Id
                        </label>

                        <Input
                          type="text"
                          id="textpayer_id"
                          placeholder="Enter SSN or EIN....."
                          onChange={rentalsFormik.handleChange}
                          value={rentalsFormik.values.textpayer_id}
                        />
                        {rentalsFormik.touched.textpayer_id &&
                        rentalsFormik.errors.textpayer_id ? (
                          <div
                            style={{
                              color: "red",
                            }}
                          >
                            {rentalsFormik.errors.textpayer_id}
                          </div>
                        ) : null}
                      </Col>
                    </Row>
                  </FormGroup>
                  <hr />
                  {/* <FormGroup>

                    <Checkbox></Checkbox>
                    <label
                      className="form-control-label"
                      htmlFor="input-diffrent name"
                    >
                      Use a different name
                    </label>

                  </FormGroup>
                  <FormGroup>

                    <Checkbox></Checkbox>
                    <label
                      className="form-control-label"
                      htmlFor="input-diffrent address"
                    >
                      Use a different address
                    </label>

                  </FormGroup> */}
                  <Col>
                    <FormGroup>
                      <div className="pl-lg-4">
                        <label
                          className="form-control-label"
                          htmlFor="input-rental properties"
                        >
                          Rental properties owned
                        </label>
                        <br />
                        Select the Propertits owned by this rental owner:
                      </div>
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <div className="pl-lg-4">
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          <div className="input-group">
                            <span className="input-group-text">
                              <FontAwesomeIcon icon={faSearch} />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder=" Search"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </label>
                      </div>
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <div className="pl-lg-3">
                        <input
                          type="checkbox"
                          style={{
                            transform: "scale(1.5)",
                            marginRight: "10px",
                          }}
                          checked={selectAllChecked}
                          onChange={handleSelectAllChange}
                        />
                        <label
                          className="form-control-label ml-2"
                          htmlFor="input-select"
                        >
                          Select All
                        </label>
                      </div>
                    </FormGroup>
                  </Col>

                  <Row>
                    <Col lg="4" className="ml-lg-4">
                      <div className="pl-lg-4">
                        <FormGroup>
                          {filterRentalsBySearch().length > 0 ? (
                            filterRentalsBySearch().map((property) => (
                              <div key={property._id}>
                                <label>
                                  <input
                                    type="checkbox"
                                    style={{
                                      transform: "scale(1.5)",
                                      marginRight: "10px",
                                    }}
                                    value={property._id}
                                    checked={selectedProperties.includes(
                                      property._id
                                    )}
                                    onChange={() =>
                                      handlePropertyCheckboxChange(property._id)
                                    }
                                    onBlur={rentalsFormik.handleBlur}
                                    // onChange={rentalsFormik.handleChange}
                                    // value={
                                    //   rentalsFormik.values.rentalOwner_properties
                                    // }
                                  />
                                  {property.rental_adress}
                                  {/* Updated property name here */}
                                </label>
                                {rentalsFormik.touched.rentalOwner_properties &&
                                rentalsFormik.errors.rentalOwner_properties ? (
                                  <div style={{ color: "red" }}>
                                    {
                                      rentalsFormik.errors
                                        .rentalOwner_properties
                                    }
                                  </div>
                                ) : null}
                              </div>
                            ))
                          ) : (
                            <p>Loading...</p>
                          )}
                        </FormGroup>
                      </div>
                    </Col>

                    <Col lg="4" className="ml-lg-4">
                      <div className="selected-properties">
                        {selectedProperties.length > 0 ? (
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Selected Properties:
                          </label>
                        ) : null}
                        <ul>
                          {selectedProperties.map((selectedPropertyId) => {
                            const selectedProperty = propertyData.find(
                              (property) => property._id === selectedPropertyId
                            );
                            return (
                              <li key={selectedPropertyId}>
                                {selectedProperty?.rental_adress}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Col>
                    <Row>
                      <div className="pl-lg-4">
                        <Button
                          style={{
                            background: "green",
                            color: "white",
                            cursor: "pointer",
                          }}
                          href="#pablo"
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            rentalsFormik.handleSubmit();
                          }}
                        >
                          {id ? "Update Rental Owner" : "Add Rental Owner"}
                        </Button>
                      </div>

                      <div className="pl-lg-4">
                        <button
                          color="primary"
                          href="#pablo"
                          className="btn btn-primary"
                          onClick={() => {
                            handleCloseButtonClick();
                          }}
                          size="sm"
                          style={{ background: "white", color: "black" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </Row>
                  </Col>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Rentals;
