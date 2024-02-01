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
import { AdminPanelSettingsRounded } from "@mui/icons-material";

const Login = () => {
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
      setIsLoading(true);
      const adminRes = await axios.post(`${baseUrl}/admin/login`, values);

      if (adminRes.status === 200) {
        const adminData = adminRes.data;
        if (adminData.statusCode === 200) {
          swal("Success!", "Admin Login Successful!", "success").then(
            (value) => {
              if (value) {
                localStorage.setItem("token", adminData.token);
                const jwt = jwtDecode(localStorage.getItem("token"));
                navigate(`/${jwt.company_name}/index`);
              }
            }
          );
        } else if (adminData.statusCode === 202) {
          swal("Error!", adminData.message, "error");
        } else {
          swal("Error!", "Invalid admin data", "error");
        }
      } else {
        const tenantRes = await axios.post(`${baseUrl}/tenants/login`, {
          email: values.email,
          password: values.password,
        });

        if (tenantRes.status === 200) {
          const tenantData = tenantRes.data;
          if (tenantData.statusCode === 200) {
            swal("Success!", "Tenant Login Successful!", "success").then(
              (value) => {
                if (value) {
                  localStorage.setItem("token", tenantRes.data.tenantToken);
                  navigate("/tenant/tenantdashboard");
                }
              }
            );
          } else if (tenantData.statusCode === 202) {
            swal("Error!", tenantData.message, "error");
          } else {
            swal("Error!", "Invalid tenant data", "error");
          }
        } else {
          const staffRes = await axios.post(`${baseUrl}/staffmember/login`, {
            email: values.email,
            password: values.password,
          });
          if (staffRes.status === 200) {
            const vendorData = staffRes.data;
            if (vendorData.statusCode === 200) {
              swal(
                "Success!",
                "Staff Member Login Successful!",
                "success"
              ).then((value) => {
                if (value) {
                  localStorage.setItem("token", vendorData.staff_memberToken);
                  navigate("/staff/staffdashboard");
                }
              });
            } else if (vendorData.statusCode === 202) {
              swal("Error!", vendorData.message, "error");
            } else {
              swal("Error!", "Invalid staff member data", "error");
            }
          } else {
            const vendorRes = await axios.post(`${baseUrl}/vendor/login`, {
              email: values.email,
              password: values.password,
            });
            if (vendorRes.status === 200) {
              const staffmemberData = vendorRes.data;
              if (staffmemberData.statusCode === 200) {
                swal("Success!", "Vendor Login Successful!", "success").then(
                  (value) => {
                    if (value) {
                      localStorage.setItem(
                        "token",
                        staffmemberData.vendorToken
                      );
                      navigate("/vendor/vendordashboard");
                    }
                  }
                );
              } else if (staffmemberData.statusCode === 202) {
                swal("Error!", staffmemberData.message, "error");
              } else {
                swal("Error!", "Invalid vendor data", "error");
              }
            }
          }
        }
        // }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
              <small>Sign in with your credentials</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    name="email"
                    onBlur={loginFormik.handleBlur}
                    onChange={loginFormik.handleChange}
                    value={loginFormik.values.email}
                  />
                </InputGroup>
                {loginFormik.touched.email && loginFormik.errors.email ? (
                  <Typography variant="caption" style={{ color: "red" }}>
                    {loginFormik.errors.email}
                  </Typography>
                ) : null}
              </FormGroup>
              <FormGroup>
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

              <div className="custom-control custom-control-alternative custom-checkbox">
                <Row>
                  <Col>
                    <input
                      className="custom-control-input"
                      id=" customCheckLogin"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor=" customCheckLogin"
                    >
                      <span className="text-muted">Remember me</span>
                    </label>
                  </Col>
                  <Col xs="6">
                    <label
                      className=""
                      // href="#rms"
                      onClick={() => navigate(`/auth/forgetpassword`)}
                    >
                      <span
                        className="text-muted mb-4"
                        style={{ fontSize: "14px" }}
                      >
                        Forgot password?
                      </span>
                    </label>
                  </Col>
                </Row>
                <br />
              </div>
              <div className="text-center">
                {/* <Button className="my-4" color="primary" type="button">
                    Sign in
                  </Button> */}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  color="primary"
                >
                  {isLoading ? <CircularProgress size={24} /> : "Login"}
                </Button>
              </div>
              <br />
            </Form>
          </CardBody>
        </Card>
        {/* <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#rms"
                onClick={ () => navigate(`/auth/changepassword`)}
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#rms"
                onClick={(e) => e.preventDefault()}
              >
                <small>Create new account</small>
              </a>
            </Col>
          </Row> */}
      </Col>
    </>
  );
};

export default Login;
