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
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "universal-cookie";
import {
  faPhone,
  faHome,
  faBriefcase,
  faEnvelope,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const Rentals = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id, admin } = useParams();
  let navigate = useNavigate();

  const [propertyData, setPropertyData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [loading, setIsLoading] = useState(true);


  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  useEffect(() => {
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
      values["admin_id"] = accessType.admin_id;

      if (id === undefined) {
        const res = await axios.post(
          `${baseUrl}/rental_owner/rental_owner`,
          values
        );
        handleResponse(res);
      } else {
        const editUrl = `${baseUrl}/rental_owner/rental_owner/${id}`;
        const res = await axios.put(editUrl, values);
        handleResponse(res);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  }

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/rentals/rentals/${accessType.admin_id}`
        );

        setPropertyData(response.data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, []);

  function handleResponse(response) {
    if (response.data.statusCode === 200) {
      navigate(`/${admin}/RentalownerTable`);

      // Show success toast
      toast.success(
        id
          ? "Rental Owner Updated Successfully"
          : "Rental Owner Added Successfully",
        {
          position: "top-center",
          autoClose: 1000,
        }
      );
    } else {
      // Show an error toast
      toast.error(response.data.message, {
        position: "top-center",
        autoClose: 1000,
      });
    }
  }

  function handleResponse(response) {
    const successMessage = id
      ? "Rental Owner Updated Successfully"
      : "Rental Owner Added Successfully";
    const errorMessage = response.data.message;

    if (response.data.statusCode === 200) {
      // Show success toast
      toast.success(successMessage, {
        position: "top-center",
        autoClose: 1000,
        onClose: () => navigate(`/${admin}/RentalownerTable`),
      });
    } else {
      // Show an error toast
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 1000,
      });
    }
  }
  let rentalsFormik = useFormik({
    initialValues: {
      rentalOwner_firstName: "",
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
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      rentalOwner_comments: "",
      text_identityType: "",
      text_identityType: "",
      texpayer_id: "",
      rentalOwner_properties: [],
    },
    validationSchema: yup.object({
      rentalOwner_firstName: yup.string().required("Required"),
      rentalOwner_lastName: yup.string().required("Required"),
      rentalOwner_primaryEmail: yup.string().required("Required"),
      rentalOwner_phoneNumber: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  // const filterRentalsBySearch = () => {
  //   if (!searchQuery) {
  //     return propertyData;
  //   }

  //   return propertyData.filter((property) => {
  //     return property.rental_adress
  //       .toLowerCase()
  //       .includes(searchQuery.toLowerCase());
  //   });
  // };

  // const handlePropertyCheckboxChange = (rental_id) => {
  //   setSelectedProperties((prevSelectedProperties) => {
  //     if (prevSelectedProperties.includes(rental_id)) {
  //       return prevSelectedProperties.filter((id) => id !== rental_id);
  //     } else {
  //       return [...prevSelectedProperties, rental_id];
  //     }
  //   });
  // };

  // const handleSelectAllChange = () => {
  //   if (!selectAllChecked) {
  //     setSelectedProperties(propertyData.map((property) => property.rental_id));
  //   } else {
  //     setSelectedProperties([]);
  //   }
  //   setSelectAllChecked(!selectAllChecked);
  // };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  const [rentalOwnerData, setRentalOwnerData] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`${baseUrl}/rental_owner/rentalowner_details/${id}`)
        .then((response) => {
          const rentalOwnerdata = response.data.data[0];
          setRentalOwnerData(rentalOwnerData);
          setIsLoading(false);
          setSelectedState(rentalOwnerdata.country || "Select");

          rentalsFormik.setValues({
            rentalOwner_firstName: rentalOwnerdata.rentalOwner_firstName || "",
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
            street_address: rentalOwnerdata.street_address || "",
            city: rentalOwnerdata.city || "",
            state: rentalOwnerdata.state || "",
            postal_code: rentalOwnerdata.postal_code || "",
            country: rentalOwnerdata.country || "",
            rentalOwner_comments: rentalOwnerdata.rentalOwner_comments || "",
            text_identityType: rentalOwnerdata.text_identityType || "",
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
                  <h6 className="heading-small text-muted mb-1"></h6>
                  <div className="pl-lg-4">

                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-property"
                      >
                        Personal Information
                      </label>
                      <br></br>
                      <br></br>


                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-property"
                            >
                              First Name
                            </label>
                            <Input
                              type="text"
                              id="rentalOwner_firstName"
                              placeholder="First Name"
                              onBlur={rentalsFormik.handleBlur}
                              onChange={rentalsFormik.handleChange}
                              value={
                                rentalsFormik.values.rentalOwner_firstName
                              }
                            />
                            {rentalsFormik.touched.rentalOwner_firstName &&
                              rentalsFormik.errors.rentalOwner_firstName ? (
                              <div style={{ color: "red" }}>
                                {rentalsFormik.errors.rentalOwner_firstName}
                              </div>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-property"
                            >
                              Last Name
                            </label>
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
                      <br />
                      <Row>
                        <Col lg={4}>
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
                      <br />
                      <Row>
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
                              Date Of Birth*
                            </label>
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

                          <Col lg="2">
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

                          <Col lg="2">
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

                      <hr></hr>

                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Contact information
                        </label>
                        <br></br>

                      </FormGroup>

                      <Row>
                        <Col lg="4">
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
                                id="rentalOwner_primaryEmail"
                                placeholder="Enter Email"
                                onBlur={rentalsFormik.handleBlur}
                                onChange={rentalsFormik.handleChange}
                                value={
                                  rentalsFormik.values
                                    .rentalOwner_primaryEmail
                                }
                              />
                            </div>
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
                          </FormGroup>
                        </Col>
                        <Col lg="4">

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
                      <Row>
                        <Col lg="3">
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
                          </div>
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
                        </Col>
                        {/* <br /> */}
                        <Col lg="3">
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
                        </Col>
                        {/* <br /> */}
                        <Col lg="3">
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
                        </Col>
                        {/* <br /> */}
                      </Row>
                    </FormGroup>

                    <FormGroup className="mb-0">
                      <label
                        className="form-control-label"
                        htmlFor="input-property"
                      >
                        Street Address
                      </label>
                    </FormGroup>
                    <Row>
                      <Col lg="4">
                        <Input
                          type="textarea"
                          id="street_address"
                          placeholder="Address"
                          onBlur={rentalsFormik.handleBlur}
                          onChange={rentalsFormik.handleChange}
                          value={rentalsFormik.values.street_address}
                        />
                        {rentalsFormik.touched.street_address &&
                          rentalsFormik.errors.street_address ? (
                          <div
                            style={{
                              color: "red",
                            }}
                          >
                            {rentalsFormik.errors.street_address}
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
                            id="city"
                            placeholder="City"
                            onChange={rentalsFormik.handleChange}
                            value={rentalsFormik.values.city}
                          />
                          {rentalsFormik.touched.city &&
                            rentalsFormik.errors.city ? (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {rentalsFormik.errors.city}
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
                            id="state"
                            placeholder="State"
                            onChange={rentalsFormik.handleChange}
                            value={rentalsFormik.values.state}
                          />
                          {rentalsFormik.touched.state &&
                            rentalsFormik.errors.state ? (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {rentalsFormik.errors.state}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Country
                          </label>

                          <Input
                            type="text"
                            id="country"
                            placeholder="country"
                            onChange={rentalsFormik.handleChange}
                            value={rentalsFormik.values.country}
                          />
                          {rentalsFormik.touched.country &&
                            rentalsFormik.errors.country ? (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {rentalsFormik.errors.country}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-zip"
                          >
                            Postal Code
                          </label>
                          <Input
                            type="text"
                            id="postal_code"
                            placeholder="Postal code"
                            onChange={rentalsFormik.handleChange}
                            value={rentalsFormik.values.postal_code}
                            onInput={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(
                                /\D/g,
                                ""
                              );
                              e.target.value = numericValue;
                            }}
                          // style={{ width: "235px" }}
                          />
                          {rentalsFormik.touched.postal_code &&
                            rentalsFormik.errors.postal_code ? (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {rentalsFormik.errors.postal_code}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>

                    </Row>


                    <hr></hr>

                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-address"
                      >
                        Tax Payer Information
                      </label>
                      <br></br>

                    </FormGroup>

                    <FormGroup>
                      <Row>
                        <Col lg="2">
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
                        <Col lg="2">
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
                  </div>
                  <br />
                  {/* <FormGroup>
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
                  </FormGroup> */}
                  {/* <hr />
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
                  </Row> */}

                  <Col>
                    <Row>
                      <div className="pl-lg-4">
                        <Button
                          style={{
                            background: "green",
                            color: "white",
                            cursor: "pointer",
                          }}
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            rentalsFormik.handleSubmit();
                          }}
                          disabled={!rentalsFormik.isValid}
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
                      <div className="pl-lg-4">
                      {!rentalsFormik.isValid && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      Please fill in all fields correctly.
                    </div>
                  )}</div>
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
