import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import AddVendorHeader from "components/Headers/AddVendorHeader";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const AddVendor = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  // Initialize variables and state
  const navigate = useNavigate();
  const { vendor_id, admin } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [vendorData, setVendorData] = useState(null);

  // Define validation schema for form fields
  const validationSchema = yup.object({
    vendor_password: yup
      .string()
      .min(8, "Password is too short")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password must contain at least one uppercase, one lowercase, one number, and one special character"
      )
      .required("Password is required"),

    vendor_email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Initialize formik form
  const VendorFormik = useFormik({
    initialValues: {
      admin_id: "",
      vendor_name: vendorData?.vendor_name || "",
      vendor_phoneNumber: vendorData?.vendor_phoneNumber || "",
      vendor_email: vendorData?.vendor_email || "",
      vendor_password: vendorData?.vendor_password || "",
    },
    validationSchema: yup.object({
      vendor_name: yup.string().required("Requied"),
      vendor_phoneNumber: yup.number().required("Requied"),
      vendor_email: yup.string().required("Requied").email("Invalid email address")
        .required("Email is required"),
      vendor_password: yup
        .string()
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number, and one special case Character"
        )
        .required("Required"),
    }),
    onSubmit: handleSubmit,
  });

  // State to hold vendor data fetched from the API
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading1, setIsLoading1] = useState(false);


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

  // Fetch vendor data if editing an existing vendor
  useEffect(() => {
    if (vendor_id) {
      axios
        .get(`${baseUrl}/vendor/get_vendor/${vendor_id}`)
        .then((response) => {
          const vendorData = response.data.data;
          setVendorData(vendorData);
          setIsLoading(false);

          // Initialize the form with fetched data
          VendorFormik.setValues({
            vendor_name: vendorData?.vendor_name || "",
            vendor_phoneNumber: vendorData?.vendor_phoneNumber || "",
            vendor_email: vendorData?.vendor_email || "",
            vendor_password: vendorData?.vendor_password || "",
          });

          //console.log(vendorData);
        })
        .catch((error) => {
          console.error("Error fetching vendor data:", error);
          setIsLoading(false);
        });
    }
  }, [vendor_id]);

  // Handle form submission
  async function handleSubmit(values) {
    setSubmitLoader(true);
    values.admin_id = accessType?.admin_id;
    try {
      if (vendor_id === undefined) {
        const res = await axios.post(`${baseUrl}/vendor/vendor`, values);
        handleResponse(res);
      } else {
        const editUrl = `${baseUrl}/vendor/update_vendor/${vendor_id}`;
        const res = await axios.put(editUrl, values);
        handleResponse(res);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
    finally {
      setSubmitLoader(false);
    }
  }

  // Handle API response and navigation
  // function handleResponse(response) {
  //   if (response.status === 200) {
  //     navigate("/"+admin+"/vendor");
  //
  //   } else {
  //     alert(response.data.message);
  //   }
  // }

  function handleResponse(response) {
    const successMessage = vendor_id
      ? "Vendor updated successfully"
      : "Vendor added successfully";
    const errorMessage = response.data.message;

    if (response.data.statusCode === 200) {
      // Show success toast
      toast.success(successMessage, {
        position: "top-center",
        autoClose: 1000,
        onClose: () => navigate(`/${admin}/vendor`),
      });
    } else {
      // Show an error toast
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 1000,
      });
    }
  }

  // Handle cancel button click
  const handleCloseButtonClick = () => {
    navigate("../Vendor");
  };

  return (
    <>
      {/* <AddVendorHeader /> */}
      {/* Page content */}
      <Container className="" fluid style={{ marginTop: "4rem", height: "100vh" }}>

        <Col xs="12" lg="12" sm="6">
          {/* <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Type</h1>
            </FormGroup> */}
          <CardHeader
            className=" mt-3 mx-2"
            style={{
              backgroundColor: "#152B51",
              borderRadius: "10px",
              boxShadow: " 0px 4px 4px 0px #00000040 ",
            }}
          >
            <h2
              className=""
              style={{
                color: "#ffffff",
                fontFamily: "Poppins",
                fontWeight: "500",
                fontSize: "26px",
              }}
            >
              {vendor_id ? "Edit Vendor" : "Add Vendor"}


            </h2>
          </CardHeader>
        </Col>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-white shadow mt-3 mx-4" style={{ boxShadow: "0px 4px 4px 0px #00000040", border: "1px solid #324567" }}>

              <CardBody>
                <Form onSubmit={VendorFormik.handleSubmit}>
                  <div className="">
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-staffmember-name"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Vendor Name *
                          </label>
                          <Input
                           style={{
                            boxShadow: " 0px 4px 4px 0px #00000040 ",
                            borderRadius: "6px",
                            width: "60%",
                          }}
                            className="form-control-alternative"
                            id="input-staffmember-name"
                            placeholder="Enter vendor name here..."
                            type="text"
                            name="vendor_name"
                            onBlur={VendorFormik.handleBlur}
                            onChange={VendorFormik.handleChange}
                            value={VendorFormik.values.vendor_name}
                          />
                          {VendorFormik.touched.vendor_name &&
                            VendorFormik.errors.vendor_name ? (
                            <div style={{ color: "red" }}>
                              {VendorFormik.errors.vendor_name}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <div className="">
                    <Row className="mt-2">
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="staffmember_phoneNumber"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Phone Number *
                          </label>
                          <Input
                           style={{
                            boxShadow: " 0px 4px 4px 0px #00000040 ",
                            borderRadius: "6px",
                            width: "60%",
                          }}
                            className="form-control-alternative"
                            id="staffmember_phoneNumber"
                            placeholder="Enter phone number here..."
                            type="text"
                            name="vendor_phoneNumber"
                            onBlur={VendorFormik.handleBlur}
                            onChange={VendorFormik.handleChange}
                            value={VendorFormik.values.vendor_phoneNumber}
                            onInput={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(
                                /\D/g,
                                ""
                              );
                              e.target.value = numericValue;
                            }}
                          />
                          {VendorFormik.touched.vendor_phoneNumber &&
                            VendorFormik.errors.vendor_phoneNumber ? (
                            <div style={{ color: "red" }}>
                              {VendorFormik.errors.vendor_phoneNumber}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <div className="">
                    <Row className="mt-2"> 
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="staffmember_email"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Email *
                          </label>
                          <Input
                           style={{
                            boxShadow: " 0px 4px 4px 0px #00000040 ",
                            borderRadius: "6px",
                            width: "60%",
                          }}
                            className="form-control-alternative"
                            id="staffmember_email"
                            placeholder="Enter email here..."
                            type="text"
                            name="vendor_email"
                            onBlur={VendorFormik.handleBlur}
                            onChange={VendorFormik.handleChange}
                            value={VendorFormik.values.vendor_email}
                          />
                          {VendorFormik.touched.vendor_email &&
                            VendorFormik.errors.vendor_email ? (
                            <div style={{ color: "red" }}>
                              {VendorFormik.errors.vendor_email}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <div className="">
                    <Row className="mt-2 mb-3">
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="staffmember_password"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Password *
                          </label>
                          <div style={{ display: "flex", boxShadow: " 0px 4px 4px 0px #00000040 ",
                              borderRadius: "6px",
                              width: "60%", }}>
                            <Input
                              className="form-control-alternative"
                              id="staffmember_password"
                              placeholder="Enter password here..."
                              name="vendor_password"
                              type={showPassword ? "text" : "password"}
                              onBlur={VendorFormik.handleBlur}
                              onChange={VendorFormik.handleChange}
                              value={VendorFormik.values.vendor_password}
                            />
                            <Button
                              type="button"
                              style={{ padding: "7px" }}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </Button>
                          </div>
                          {VendorFormik.touched.vendor_password &&
                            VendorFormik.errors.vendor_password ? (
                            <div style={{ color: "red" }}>
                              {VendorFormik.errors.vendor_password}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <Row>
                    {submitLoader ? (
                      <Button
                        type="submit"
                        className="btn ml-3"
                        style={{ background: "#152B51", color: "white" }}

                        disabled
                      >
                        Loading...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="btn ml-3"
                        style={{ background: "#152B51", color: "white", fontFamily: "Poppins", fontWeight: "400", fontSize: "14px", cursor: "pointer" }}

                        disabled={!VendorFormik.isValid}
                        onClick={() => {
                          VendorFormik.handleSubmit();
                        }}
                      >
                        {vendor_id ? "Update Vendor" : "Add Vendor"}
                      </Button>)}

                    <Button
                      // color="primary"
                      className="btn"
                      onClick={handleCloseButtonClick}
                      size="small"
                      style={{ background: "white", color: "#152B51" }}

                    >
                      Cancel
                    </Button>
                    {/* Conditional message */}
                    {!VendorFormik.isValid && (
                      <div style={{ color: 'red', marginTop: '10px' }}>
                        Please fill in all fields correctly.
                      </div>
                    )}
                  </Row>
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

export default AddVendor;
