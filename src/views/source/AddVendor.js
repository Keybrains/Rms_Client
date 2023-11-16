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
import swal from "sweetalert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import AddVendorHeader from "components/Headers/AddVendorHeader";
import Cookies from 'universal-cookie';

const AddVendor = () => {
  // Initialize variables and state
  const navigate = useNavigate();
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);
 
  // Define validation schema for form fields
  const validationSchema = yup.object({
    vendor_name: yup.string().required("Vendor Name is required"),
    vendor_phoneNumber: yup.string(),
    vendor_email: yup.string().email("Invalid email format").required("Email is required"),
    vendor_password: yup
      .string()
      .min(8, "Password is too short")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password must contain at least one uppercase, one lowercase, one number, and one special character"
      )
      .required("Password is required"),
  });

  // Initialize formik form
  const VendorFormik = useFormik({
    initialValues: {
      vendor_name: vendorData?.vendor_name || "",
      vendor_phoneNumber: vendorData?.vendor_phoneNumber || "",
      vendor_email: vendorData?.vendor_email || "",
      vendor_password: vendorData?.vendor_password || "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  // State to hold vendor data fetched from the API
  const [vendorData, setVendorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  let cookies = new Cookies();
  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let  authConfig = {
        headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
        token: cookies.get("token"),
      },
    };
    // auth post method
    let res = await axios.post(
      "http://localhost:4000/api/register/auth",
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


  // Fetch vendor data if editing an existing vendor
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:4000/api/vendor/vendor_summary/${id}`)
        .then((response) => {
          const vendorData = response.data.data;
          setVendorData(vendorData);
          setIsLoading(false);
  
          // Initialize the form with fetched data
          VendorFormik.setValues({
            vendor_name: vendorData.vendor_name || "",
            vendor_phoneNumber: vendorData.vendor_phoneNumber || "",
            vendor_email: vendorData.vendor_email || "",
            vendor_password: vendorData?.vendor_password || "",
          });
  
          console.log(vendorData);
        })
        .catch((error) => {
          console.error("Error fetching vendor data:", error);
          setIsLoading(false);
        });
    }
  }, [id]);
  

  // Handle form submission
  async function handleSubmit(values) {
    try {
      if (id === undefined) {
        const res = await axios.post(
          "http://localhost:4000/api/vendor/vendor",
          values
        );
        handleResponse(res);
      } else {
        const editUrl = `http://localhost:4000/api/vendor/vendor/${id}`;
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

  // Handle API response and navigation
  function handleResponse(response) {
    if (response.status === 200) {
      navigate("/admin/vendor");
      swal(
        "Success!",
        id ? "Vendor updated successfully" : "Vendor added successfully!",
        "success"
      );
    } else {
      alert(response.data.message);
    }
  }

  // Handle cancel button click
  const handleCloseButtonClick = () => {
    navigate("../Vendor");
  };

  return (
    <>
      <AddVendorHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {id ? "Edit Vendor" : "New Vendor"}
                    </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={VendorFormik.handleSubmit}>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-staffmember-name"
                          >
                            Vendor Name *
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-staffmember-name"
                            placeholder="Add Name"
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

                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="staffmember_phoneNumber"
                          >
                            Phone Number
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="staffmember_phoneNumber"
                            placeholder="Phone Number"
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
                              ); // Remove non-numeric characters
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

                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="staffmember_email"
                          >
                            Email *
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="staffmember_email"
                            placeholder="Email"
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

                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="staffmember_password"
                          >
                            Password *
                          </label>
                          <div style={{ display: "flex" }}>
                            <Input
                              className="form-control-alternative"
                              id="staffmember_password"
                              placeholder="Password"
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
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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

                  <button
                    type="submit"
                    className="btn btn-primary ml-4"
                    style={{ background: "green" }}
                  >
                    {id ? "Update Vendor" : "Add Vendor"}
                  </button>

                  <button
                    color="primary"
                    href="#rms"
                    className="btn btn-primary"
                    onClick={handleCloseButtonClick}
                    size="sm"
                    style={{ background: "white", color: "black" }}
                  >
                    Cancel
                  </button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddVendor;
