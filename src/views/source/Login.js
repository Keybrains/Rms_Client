// reactstrap components
import React, { useEffect, useState } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Typography, colors } from "@mui/material";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AdminPanelSettingsRounded } from "@mui/icons-material";
import swal from "sweetalert";

const Login = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { admin, roll } = useParams();
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberedEmail") !== null
  );

  const [admin_id, setAdmin_id] = useState();

  useEffect(() => {
    const checkComapny = async () => {
      try {
        const res = await axios.get(`${baseUrl}/admin/check_company/${admin}`);
        if (res.data.statusCode === 200) {
          setAdmin_id(res.data.data.admin_id);
        }
      } catch (error) {
        console.error("Error: ", error.message);
      }
    };
    if (admin) {
      checkComapny();
    }
  }, [admin, roll]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      if (!admin_id) {
        const url = `${baseUrl}/admin/login`;
        
        const adminRes = await axios.post(url, values);

        if (adminRes.status === 200) {
          console.log(adminRes, "yash ");
          const adminData = adminRes.data;
          if (adminData.statusCode === 200) {
            toast.success("Admin Login successfully!", {
              position: "top-center",
              autoClose: 500,
            });
            setTimeout(() => {
              localStorage.setItem("token", adminData.token);
              const jwt = jwtDecode(localStorage.getItem("token"));
              navigate(`/${jwt.company_name}/index`);
            }, 1000);
          } else if (adminData.statusCode === 202) {
            toast.error(" Invalid Admin Password. Please try again.", {
              position: "top-center",
            });
          } else {
            const superAdminRes = await axios.post(
              `${baseUrl}/admin/superadmin_login`,
              values
            );
            console.log(superAdminRes, "yashu");
            if (superAdminRes.status === 200) {
              const superAdminData = superAdminRes.data;
              if (superAdminData.statusCode === 200) {
                toast.success("Super Admin Login successfully!", {
                  position: "top-center",
                  autoClose: 500,
                });
                setTimeout(() => {
                  localStorage.setItem("token", superAdminData.token);
                  navigate(`/superadmin/dashboard`);
                }, 1000);
              } else if (superAdminData.statusCode === 202) {
                toast.error(
                  " Invalid Super Admin Password. Please try again.",
                  {
                    autoClose: 500,
                    position: "top-center",
                  }
                );
              } else {
                toast.error("Invalid User Data", {
                  autoClose: 500,
                  position: "top-center",
                });
              }
            } else {
              toast.error("Invalid User Data", {
                autoClose: 500,
                position: "top-center",
              });
            }
          }
        } else {
          toast.error("User does not exits", {
            autoClose: 500,
            position: "top-center",
          });
        }
      } else if (roll) {
        console.log("object======");
        const response = await axios.post(`${baseUrl}/${roll}/login`, {
          email: values.email,
          password: values.password,
          admin_id: admin_id,
        });
        console.log("object======", response);

        if (response.status === 200) {
          const responceData = response.data;
          if (responceData.statusCode === 200) {
            toast.success(responceData.message, {
              position: "top-center",
              autoClose: 500,
            });
            setTimeout(() => {
              localStorage.setItem("token", response.data.token);
              if (roll === "tenants") {
                navigate("/tenant/tenantdashboard");
              } else if (roll === "vendor") {
                navigate("/vendor/vendordashboard");
              } else if (roll === "staffmember") {
                navigate("/staff/staffdashboard");
              }
            }, 1000);
          } else if (responceData.statusCode === 202) {
            toast.warning("Error ocuures!", {
              position: "top-center",
            });
          }
        }
      } else {
        toast.error("Invalid User Data", {
          autoClose: 500,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  let loginFormik = useFormik({
    initialValues: {
      email: localStorage.getItem("rememberedEmail") || "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Required"),
      password: yup.string().required("Required"),
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
          onSubmit={(e) =>
            loginFormik.handleSubmit(e, loginFormik.values.rememberMe)
          }
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
                      id="customCheckLogin"
                      type="checkbox"
                      onChange={() => setRememberMe(!rememberMe)}
                      checked={rememberMe}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckLogin"
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
                        style={{ fontSize: "14px", cursor: "pointer" }}
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
              <div className="d-flex justify-content-start mt-4">
                <Row>
                  <Col>
                    <span className="text-muted">Don't have an account?</span>
                    <a href="#" onClick={() => navigate(`/trial/trial-login`)}>
                      {" "}
                      Sign up
                    </a>
                  </Col>
                </Row>
                <br />
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
      <ToastContainer />
    </>
  );
};

export default Login;
