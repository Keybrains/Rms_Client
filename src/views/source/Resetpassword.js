// reactstrap components
import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Typography, colors } from "@mui/material";
import swal from "sweetalert";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ResetPassword = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let navigate = useNavigate();
  let cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true); // Set loading state to true

      // Admin login
      const adminRes = await axios.post(`${baseUrl}/admin/login`, values);

      console.log("Admin ID:", adminRes.data);
      if (adminRes.data.statusCode === 200) {
        // Admin login successful
        swal("Success!", "Admin Login Successful!", "success").then((value) => {
          if (value) {
            localStorage.setItem("token", adminRes.data.token);
            const jwt = jwtDecode(localStorage.getItem("token"));
            navigate(`/${jwt.company_name}/index`);
          }
        });
      } else {
        // Admin login failed, try tenant login
        const tenantRes = await axios.post(`${baseUrl}/tenant/login`, {
          tenant_email: values.email,
          tenant_password: values.password,
        });

        if (tenantRes.data.statusCode === 200) {
          // Tenant login successful
          const tenantData = tenantRes.data.data; // Assuming the API response structure

          // Check if tenantData contains _id
          if (tenantData && tenantData._id) {
            //console.log("Tenant ID:", tenantData._id);
            swal("Success!", "Tenant Login Successful!", "success").then(
              (value) => {
                if (value) {
                  localStorage.setItem("token", tenantRes.data.token);
                  localStorage.setItem("Tenant ID", tenantData._id);
                  localStorage.setItem("ID", tenantData._id);
                  navigate("/tenant/tenantdashboard");
                }
              }
            );
          } else {
            // Tenant login succeeded, but no _id found
            swal("Error!", "Invalid tenant data", "error");
          }
        } else {
          // Admin and tenant login failed, try agent login
          const agentRes = await axios.post(`${baseUrl}/addagent/login`, {
            agent_email: values.email,
            agent_password: values.password,
          });

          if (agentRes.data.statusCode === 200) {
            // Agent login successful
            const agentData = agentRes.data.data; // Assuming the API response structure
            //console.log("Agent ID:", agentData._id);

            // Check if agentData contains _id
            if (agentData && agentData._id) {
              //console.log("Agent ID:", agentData._id);
              swal("Success!", "Agent Login Successful!", "success").then(
                (value) => {
                  if (value) {
                    localStorage.setItem("token", agentRes.data.token);
                    localStorage.setItem("Agent ID", agentData._id);
                    localStorage.setItem("ID", agentData._id);
                    navigate("/agent/AgentdashBoard");
                  }
                }
              );
            } else {
              // Agent login succeeded, but no _id found
              swal("Error!", "Invalid agent data", "error");
            }
          } else {
            // All login attempts failed, try staff login
            const staffRes = await axios.post(
              `${baseUrl}/addstaffmember/login`,
              {
                staffmember_email: values.email,
                staffmember_password: values.password,
              }
            );

            if (staffRes.data.statusCode === 200) {
              // Staff login successful
              const staffData = staffRes.data.data; // Assuming the API response structure
              //console.log("Staff ID:", staffData._id);

              // Check if staffData contains _id
              if (staffData && staffData._id) {
                //console.log("Staff ID:", staffData._id);
                swal("Success!", "Staff Login Successful!", "success").then(
                  (value) => {
                    if (value) {
                      localStorage.setItem("token", staffRes.data.token);
                      localStorage.setItem("Staff ID", staffData._id);
                      localStorage.setItem("ID", staffData._id);
                      navigate("/staff/staffdashboard");
                    }
                  }
                );
              } else {
                // Staff login succeeded, but no _id found
                swal("Error!", "Invalid staff data", "error");
              }
            } else {
              // All login attempts failed, try vendor login
              const vendorRes = await axios.post(`${baseUrl}/vendor/login`, {
                vendor_email: values.email,
                vendor_password: values.password,
              });

              if (vendorRes.data.statusCode === 200) {
                // Vendor login successful
                const vendorData = vendorRes.data.data; // Assuming the API response structure
                //console.log("Vendor ID:", vendorData._id);

                // Check if vendorData contains _id
                if (vendorData && vendorData._id) {
                  //console.log("Vendor ID:", vendorData._id);
                  swal("Success!", "Vendor Login Successful!", "success").then(
                    (value) => {
                      if (value) {
                        localStorage.setItem("token", vendorRes.data.token);
                        localStorage.setItem("Vendor ID", vendorData._id);
                        localStorage.setItem("ID", vendorData._id);
                        navigate("/vendor/vendordashboard");
                      }
                    }
                  );
                } else {
                  // Vendor login succeeded, but no _id found
                  swal("Error!", "Invalid vendor data", "error");
                }
              } else {
                // All login attempts failed
                swal("Error!", "Invalid credentials", "error");
              }
            }
          }
        }
      }
    } catch (error) {
      //console.log(error);
    } finally {
      setIsLoading(false); // Set loading state to false after API call completes
    }
  };

  let loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Required"),
      password: yup
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
    },
  });

  return (
    <>
      <Col lg="5" md="7">
        <Card
          className="bg-secondary shadow border-0"
          onSubmit={loginFormik.handleSubmit}
        >
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Change password</small>
            </div>
            <Form role="form">
              <FormGroup>
                <label className="form-control-label" htmlFor="New Password">
                  New password
                </label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="standard-adornment-password"
                    autoComplete="new-password"
                    name="password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    onBlur={loginFormik.handleBlur}
                    onChange={loginFormik.handleChange}
                    value={loginFormik.values.password}
                  />

                  <IconButton
                    type="button"
                    style={{ padding: "7px" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {<VisibilityIcon />}
                  </IconButton>
                </InputGroup>
                {loginFormik.touched.password && loginFormik.errors.password ? (
                  <Typography variant="caption" style={{ color: "red" }}>
                    {loginFormik.errors.password}
                  </Typography>
                ) : null}
              </FormGroup>
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="Confirm new password"
                >
                  Confirm new password
                </label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="standard-adornment-password"
                    autoComplete="new-password"
                    name="password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    onBlur={loginFormik.handleBlur}
                    onChange={loginFormik.handleChange}
                    value={loginFormik.values.password}
                  />

                  <IconButton
                    type="button"
                    style={{ padding: "7px" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {<VisibilityIcon />}
                  </IconButton>
                </InputGroup>
                {loginFormik.touched.password && loginFormik.errors.password ? (
                  <Typography variant="caption" style={{ color: "red" }}>
                    {loginFormik.errors.password}
                  </Typography>
                ) : null}
              </FormGroup>

              <div className="text-center">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  color="primary"
                >
                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Change password"
                  )}
                </Button>
              </div>
              <br />
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default ResetPassword;