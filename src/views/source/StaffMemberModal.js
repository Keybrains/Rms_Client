import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useFormik } from "formik";
import Checkbox from "@mui/material/Checkbox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
function CreditCardForm(props) {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { tenantId, closeModal, getCreditCard } = props;
  const { id, admin } = useParams();
  const [isMultiUnit, setIsMultiUnit] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState("");

  const paymentSchema = yup.object({
    card_number: yup
      .number()
      .required("Required")
      .typeError("Must be a number")
      .test(
        "is-size-16",
        "Card Number must be 16 digits",
        (val) => val?.toString().length === 16
      ),
    exp_date: yup
      .string()
      .matches(/^(0[1-9]|1[0-2])\/[0-9]{4}$/, "Invalid date format (MM/YYYY)")
      .required("Required"),
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`${baseUrl}/propertytype/property/type/${id}`)
        .then((response) => {
          const propertyData = response.data.data[0];
          setpropertyType(propertyType);
          setIsMultiUnit(propertyData.is_multiunit);

          setSelectedProperty(propertyData.property_type || "Select");

          propertyFormik.setValues({
            property_type: propertyData.property_type || "",
            propertysub_type: propertyData.propertysub_type || "",
            isMultiUnit: propertyData.is_multiunit,
          });
        })
        .catch((error) => {
          console.error("Error fetching property type data:", error);
        });
    }
  }, [id]);

  const propertyFormik = useFormik({
    initialValues: {
      property_type: "",
      propertysub_type: "",
      isMultiUnit: false,
    },
    validationSchema: yup.object({
      property_type: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const handlePropertySelection = (value) => {
    setSelectedProperty(value);
    localStorage.setItem("property", value);
  };
  const toggle = () => setproDropdownOpen((prevState) => !prevState);
  const [prodropdownOpen, setproDropdownOpen] = useState(false);

  const handleChangecheck = (e) => {
    setIsMultiUnit(e.target.checked);
  };

  const [propertyType, setpropertyType] = useState(null);
  // const handleCloseButtonClick = () => {
  //   navigate("../rentals");
  // };
  const navigate = useNavigate();

  async function handleSubmit(values) {
    try {
      const object = {
        admin_id: accessType.admin_id,
        property_type: propertyFormik.values.property_type,
        propertysub_type: propertyFormik.values.propertysub_type,
        is_multiunit: isMultiUnit,
      };

      if (id === undefined) {
        const res = await axios.post(
          `${baseUrl}/propertytype/property_type`,
          object
        );
        if (res.data.statusCode === 200) {
          handleResponse(res);
        } else if (res.data.statusCode === 201) {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      } else {
        const editUrl = `${baseUrl}/propertytype/property_type/${id}`;
        const res = await axios.put(editUrl, object);
        if (res.data.statusCode === 200) {
          handleResponse(res);
        } else if (res.data.statusCode === 400) {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  }
  const [accessType, setAccessType] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
  function handleResponse(response) {
    const successMessage = id
      ? "Property Type updated successfully"
      : "Property Type added successfully";
    const errorMessage = response.data.message;

    if (response.data.statusCode === 200) {
      // Show success toast
      toast.success(successMessage, {
        position: "top-center",
        autoClose: 1000,
        // onClose: () => navigate(`/${admin}/PropertyType`),
      });
    } else {
      // Show an error toast
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 1000,
      });
    }
  }
  useEffect(() => {
    if (id) {
      axios
        .get(`${baseUrl}/propertytype/property/type/${id}`)
        .then((response) => {
          const propertyData = response.data.data[0];
          setpropertyType(propertyType);
          setIsMultiUnit(propertyData.is_multiunit);

          setSelectedProperty(propertyData.property_type || "Select");

          propertyFormik.setValues({
            property_type: propertyData.property_type || "",
            propertysub_type: propertyData.propertysub_type || "",
            isMultiUnit: propertyData.is_multiunit,
          });
        })
        .catch((error) => {
          console.error("Error fetching property type data:", error);
        });
    }
  }, [id]);

  // kp--------------======================================
  const StaffMemberFormik = useFormik({
    initialValues: {
      staffmember_name: "",
      staffmember_designation: "",
      staffmember_phoneNumber: "",
      staffmember_email: "",
      staffmember_password: "",
    },
    validationSchema: yup.object({
      staffmember_name: yup.string().required("Name is Required"),
      staffmember_designation: yup.string().required("Designation Required"),
      staffmember_email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      staffmember_phoneNumber: yup.number().required("Number is Required"),
      staffmember_password: yup
        .string()
        .required("No Password Provided")
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
        ),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      console.log(values, "values");
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(values) {
    const object = {
      admin_id: accessType.admin_id,
      staffmember_name: values.staffmember_name,
      staffmember_designation: values.staffmember_designation,
      staffmember_phoneNumber: values.staffmember_phoneNumber,
      staffmember_email: values.staffmember_email,
      staffmember_password: values.staffmember_password,
    };
    try {
      if (id === undefined) {
        const res = await axios.post(
          `${baseUrl}/staffmember/staff_member`,
          object
        );
        if (res.data.statusCode === 200) {
          handleResponse(res);
        } else if (res.data.statusCode === 201) {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      } else {
        const editUrl = `${baseUrl}/staffmember/staff_member/${id}`;
        const res = await axios.put(editUrl, object);
        if (res.data.statusCode === 200) {
          handleResponse(res);
        } else if (res.data.statusCode === 400) {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
      // Handle the error and display an error message to the user if necessary.
    }
  }

  // kp--------------======================================

  return (
    <div>
      <Formik
        initialValues={{ card_number: "", exp_date: "" }}
        validationSchema={paymentSchema}
        onSubmit={(values, { resetForm }) => {
          if (paymentSchema.isValid) {
            handleSubmit(values);
            resetForm();
          }
        }}
      >
        <Form onSubmit={StaffMemberFormik.handleSubmit}>
          <div className="pl-lg-4">
            <Row>
              <Col lg="12">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-member">
                    Staff Member Name *
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-staffmember-name"
                    placeholder="John William"
                    type="text"
                    name="staffmember_name"
                    //name="nput-staffmember-name"
                    onBlur={StaffMemberFormik.handleBlur}
                    onChange={(e) => {
                      // Update the state or Formik values with the new input value
                      StaffMemberFormik.handleChange(e);
                    }}
                    value={StaffMemberFormik.values.staffmember_name.trim()}
                    //required
                  />
                  {StaffMemberFormik.touched.staffmember_name &&
                  StaffMemberFormik.errors.staffmember_name ? (
                    <div style={{ color: "red" }}>
                      {StaffMemberFormik.errors.staffmember_name}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
          </div>
          <hr className="my-2" />
          <div className="pl-lg-4">
            <Row>
              <Col lg="6">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-desg">
                    Designation
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-staffmember-desg"
                    placeholder="Manager"
                    type="text"
                    name="staffmember_designation"
                    onBlur={StaffMemberFormik.handleBlur}
                    onChange={StaffMemberFormik.handleChange}
                    value={StaffMemberFormik.values.staffmember_designation.trim()}
                  />
                  {StaffMemberFormik.touched.staffmember_designation &&
                  StaffMemberFormik.errors.staffmember_designation ? (
                    <div style={{ color: "red" }}>
                      {StaffMemberFormik.errors.staffmember_designation}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-desg">
                    Phone Number *
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="staffmember_phoneNumber"
                    placeholder="Phone Number"
                    type="text"
                    name="staffmember_phoneNumber"
                    onBlur={StaffMemberFormik.handleBlur}
                    onChange={StaffMemberFormik.handleChange}
                    value={StaffMemberFormik.values.staffmember_phoneNumber}
                    //required
                    onInput={(e) => {
                      const inputValue = e.target.value;
                      const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                      e.target.value = numericValue;
                    }}
                  />
                  {StaffMemberFormik.touched.staffmember_phoneNumber &&
                  StaffMemberFormik.errors.staffmember_phoneNumber ? (
                    <div style={{ color: "red" }}>
                      {StaffMemberFormik.errors.staffmember_phoneNumber}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
          </div>
          <hr className="my-2" />
          <div className="pl-lg-4">
            <Row>
              <Col lg="6">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-desg">
                    Email *
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="staffmember_email"
                    placeholder="Email"
                    type="email"
                    name="staffmember_email"
                    onBlur={StaffMemberFormik.handleBlur}
                    onChange={StaffMemberFormik.handleChange}
                    value={StaffMemberFormik.values.staffmember_email.toLowerCase()}
                    //required
                  />
                  {StaffMemberFormik.touched.staffmember_email &&
                  StaffMemberFormik.errors.staffmember_email ? (
                    <div style={{ color: "red" }}>
                      {StaffMemberFormik.errors.staffmember_email}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-desg">
                    Password *
                  </label>
                  <div style={{ display: "flex" }}>
                    <Input
                      className="form-control-alternative"
                      id="staffmember_password"
                      placeholder="Password"
                      name="staffmember_password"
                      type={showPassword ? "text" : "password"}
                      onBlur={StaffMemberFormik.handleBlur}
                      onChange={StaffMemberFormik.handleChange}
                      value={StaffMemberFormik.values.staffmember_password}
                      //required
                    />
                    <Button
                      type="button"
                      style={{ padding: "7px" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {<VisibilityIcon />}
                    </Button>
                  </div>
                  {StaffMemberFormik.touched.staffmember_password &&
                  StaffMemberFormik.errors.staffmember_password ? (
                    <div style={{ color: "red" }}>
                      {StaffMemberFormik.errors.staffmember_password}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
          </div>
          <hr className="my-2" />
          <Row>
            <button
              type="submit"
              className="btn btn-primary ml-4"
              style={{ background: "green" }}
            >
              {id ? "Update Staff Member" : "Add Staff Member"}
            </button>
            <button
              color="primary"
              //  href="#rms"
              className="btn btn-primary"
              onClick={closeModal}
              size="sm"
              style={{ background: "white", color: "black" }}
            >
              Cancel
            </button>
          </Row>
          {/* <Row>
            <Button
              type="submit"
              className="btn btn-primary ml-4"
              style={{ background: "green", color: "white" }}
            >
              {id ? "Update Property Type" : "Add Property Type"}
            </Button>
          </Row> */}
        </Form>
      </Formik>
      <ToastContainer />
    </div>
  );
}

export default CreditCardForm;
