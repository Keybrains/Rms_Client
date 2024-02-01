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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';import { useNavigate, useParams } from "react-router-dom";
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
//
//   };
// };

const Rentals = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id, admin } = useParams();
  let navigate = useNavigate();

  const [statedropdownOpen, setstateDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyData, setPropertyData] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState([]);

  const toggle1 = () => setstateDropdownOpen((prevState) => !prevState);

  const handleCountrySelection = (value) => {
    setSelectedState(value);
    setstateDropdownOpen(true);
    rentalsFormik.setFieldValue("rentalOwner_country", value);
  };

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleCloseButtonClick = () => {
    navigate("/" + admin + "/RentalownerTable");
  };

  async function handleSubmit(values) {
    try {
      const selectedPropertyData = propertyData.filter((property) =>
        selectedProperties.includes(property.rental_id)
      );

      const selectedPropertyIds = selectedPropertyData.map(
        (property) => property.rental_id
      );

      values["rentalOwner_properties"] = selectedPropertyIds;
      console.log(selectedPropertyIds, selectedPropertyData);

      // if (id === undefined) {
      //   const res = await axios.post(
      //     `${baseUrl}/rentalowner/rentalowner`,
      //     values
      //   );
      //   handleResponse(res);
      // } else {
      //   const editUrl = `${baseUrl}/rentalowner/rentalowner/${id}`;
      //   const res = await axios.put(editUrl, values);
      //   handleResponse(res);
      // }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  }

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        const sortedCountries = response.data.sort((a, b) => {
          const nameA = a.name.common.toUpperCase();
          const nameB = b.name.common.toUpperCase();
          return nameA.localeCompare(nameB);
        });

        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/rentals/rentals/${accessType.admin_id}`
        );

        setPropertyData(response.data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchPropertyData();
  }, []);

  
  function handleResponse(response) {
    if (response.data.statusCode === 200) {
      navigate(`/${admin}/RentalownerTable`);

      // Show success toast
      toast.success(id ? "Rental Owner  updated successfully" : "Rental Owner  added successfully", {
        position: 'top-center',
        autoClose: 1000,
      });
    } else {
      // Show an error toast
      toast.error(response.data.message, {
        position: 'top-center',
        autoClose: 1000,
      });
    }
  }
  function handleResponse(response) {
    const successMessage = id ? "Property  updated successfully" : "Property  added successfully";
    const errorMessage = response.data.message;
  
    if (response.data.statusCode === 200) {
      // Show success toast
      toast.success(successMessage, {
        position: 'top-center',
        autoClose: 1000,
        onClose: () => navigate(`/${admin}/RentalownerTable`),
      });
    } else {
      // Show an error toast
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 1000,
      });
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
      rentalOwner_email: "",
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
      texpayer_id: "",
      rentalOwner_properties: [],
    },
    validationSchema: yup.object({
      rentalowner_firstName: yup.string().required("Required"),
      rentalOwner_lastName: yup.string().required("Required"),
      rentalOwner_email: yup.string().required("Required"),
      rentalOwner_phoneNumber: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
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

  const handlePropertyCheckboxChange = (rental_id) => {
    setSelectedProperties((prevSelectedProperties) => {
      if (prevSelectedProperties.includes(rental_id)) {
        return prevSelectedProperties.filter((id) => id !== rental_id);
      } else {
        return [...prevSelectedProperties, rental_id];
      }
    });
  };

  const handleSelectAllChange = () => {
    if (!selectAllChecked) {
      setSelectedProperties(propertyData.map((property) => property.rental_id));
    } else {
      setSelectedProperties([]);
    }
    setSelectAllChecked(!selectAllChecked);
  };

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
          setIsLoading(false);
          setSelectedState(rentalOwnerdata.rentalOwner_country || "Select");

          rentalsFormik.setValues({
            rentalowner_firstName: rentalOwnerdata.rentalowner_firstName || "",
            rentalOwner_lastName: rentalOwnerdata.rentalOwner_lastName || "",
            rentalOwner_companyName:
              rentalOwnerdata.rentalOwner_companyName || "",
            birth_date: formatDate(rentalOwnerdata.birth_date),
            start_date: formatDate(rentalOwnerdata.start_date),
            end_date: formatDate(rentalOwnerdata.end_date),
            rentalOwner_email: rentalOwnerdata.rentalOwner_email || "",
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
            rentalOwner_companyName:
              rentalOwnerdata.rentalOwner_companyName || "",
            texpayer_id: rentalOwnerdata.texpayer_id || "",
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
                            <Col lg="6">
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
                            <Col lg="6">
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
                            <Col lg={12}>
                              <FormGroup className="mb-0">
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
                                <br />
                                <Input
                                  id="birth_date"
                                  placeholder="Date Of Birth"
                                  type="date"
                                  onBlur={rentalsFormik.handleBlur}
                                  onChange={rentalsFormik.handleChange}
                                  value={rentalsFormik.values.birth_date}
                                />
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
                              <Row className="mx-1">
                                <Col lg="12">
                                  <FormGroup>
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-unitadd"
                                    >
                                      Start Date *
                                    </label>
                                    <br />

                                    <Input
                                      id="start_date"
                                      placeholder="Start Date"
                                      type="date"
                                      onBlur={rentalsFormik.handleBlur}
                                      onChange={rentalsFormik.handleChange}
                                      value={rentalsFormik.values.start_date}
                                    />
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
                                  <Col lg="12">
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-unitadd"
                                    >
                                      End Date *
                                    </label>
                                    <br />
                                    <Input
                                      id="end_date"
                                      placeholder="End Date"
                                      type="date"
                                      onBlur={rentalsFormik.handleBlur}
                                      onChange={rentalsFormik.handleChange}
                                      value={rentalsFormik.values.end_date}
                                    />
                                    {rentalsFormik.touched.end_date &&
                                    rentalsFormik.errors.end_date ? (
                                      <div style={{ color: "red" }}>
                                        {rentalsFormik.errors.end_date}
                                      </div>
                                    ) : null}
                                  </Col>
                                </Row>
                              </FormGroup>
                            </Row>
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
                              <FormGroup className="mb-0">
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
                                    id="rentalOwner_email"
                                    placeholder="Enter Email"
                                    onBlur={rentalsFormik.handleBlur}
                                    onChange={rentalsFormik.handleChange}
                                    value={
                                      rentalsFormik.values.rentalOwner_email
                                    }
                                  />
                                  {rentalsFormik.touched.rentalOwner_email &&
                                  rentalsFormik.errors.rentalOwner_email ? (
                                    <div style={{ color: "red" }}>
                                      {rentalsFormik.errors.rentalOwner_email}
                                    </div>
                                  ) : null}
                                </div>
                              </FormGroup>
                              <FormGroup className="mb-0">
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Alternative E-mail
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
                          <FormGroup className="mb-0">
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
                          {console.log(rentalsFormik.values, "yash")}
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
                                );
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

                        <FormGroup className="mb-0">
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
                      <Col lg="3">
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
                      <Col lg="3">
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
                    </Row>
                  </div>

                  <FormGroup>
                    <Row>
                      <Col className="d-flex">
                        <Col lg="3">
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Country
                          </label>
                          <br />
                          <Row>
                            <div
                              style={{ display: "flex" }}
                              className="pl-lg-2"
                            >
                              <Dropdown
                                className="col-9"
                                isOpen={statedropdownOpen}
                                toggle={toggle1}
                              >
                                <DropdownToggle caret>
                                  {selectedState ? selectedState : "Select"}
                                </DropdownToggle>
                                <DropdownMenu
                                  style={{
                                    width: "200px",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                  }}
                                >
                                  {countries.map((country, index) => (
                                    <DropdownItem
                                      key={index}
                                      onClick={() =>
                                        handleCountrySelection(
                                          country.name.common
                                        )
                                      }
                                    >
                                      {country.name.common}
                                    </DropdownItem>
                                  ))}
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          </Row>
                        </Col>

                        <Col lg="3">
                          <FormGroup className="mx-2">
                            <label
                              className="form-control-label"
                              htmlFor="input-zip"
                            >
                              Postal Code
                            </label>
                            <Input
                              type="text"
                              id="rentalOwner_zip"
                              placeholder="Postal code"
                              onChange={rentalsFormik.handleChange}
                              value={rentalsFormik.values.rentalOwner_zip}
                              onInput={(e) => {
                                const inputValue = e.target.value;
                                const numericValue = inputValue.replace(
                                  /\D/g,
                                  ""
                                );
                                e.target.value = numericValue;
                              }}
                              style={{ width: "235px" }}
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
                          id="texpayer_id"
                          placeholder="Enter SSN or EIN....."
                          onChange={rentalsFormik.handleChange}
                          value={rentalsFormik.values.texpayer_id}
                        />
                        {rentalsFormik.touched.texpayer_id &&
                        rentalsFormik.errors.texpayer_id ? (
                          <div
                            style={{
                              color: "red",
                            }}
                          >
                            {rentalsFormik.errors.texpayer_id}
                          </div>
                        ) : null}
                      </Col>
                    </Row>
                  </FormGroup>
                  <hr />
                  <Col>
                    <FormGroup>
                      <div className="pl-lg-2">
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
                      <div className="pl-lg-2">
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
                      <div className="pl-lg-2">
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
                      <div className="pl-lg-2">
                        <FormGroup>
                          {filterRentalsBySearch().length > 0 ? (
                            filterRentalsBySearch().map((property) => (
                              <div key={property.rental_id}>
                                <label>
                                  <input
                                    type="checkbox"
                                    style={{
                                      transform: "scale(1.5)",
                                      marginRight: "10px",
                                    }}
                                    value={property.rental_id}
                                    checked={selectedProperties.includes(
                                      property.rental_id
                                    )}
                                    onChange={() =>
                                      handlePropertyCheckboxChange(
                                        property.rental_id
                                      )
                                    }
                                    onBlur={rentalsFormik.handleBlur}
                                  />
                                  {property.rental_adress}{" "}
                                  {property?.property_type_data?.property_type
                                    ? `(${property?.property_type_data?.property_type})`
                                    : ""}
                                </label>
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
                              (property) =>
                                property.rental_id === selectedPropertyId
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
        <ToastContainer />

      </Container>
    </>
  );
};

export default Rentals;
