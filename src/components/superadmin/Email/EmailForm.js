import { React, useEffect, useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SuperAdminHeader from "../Headers/SuperAdminHeader";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import {
  Card,
  CardHeader,
  FormGroup,
  Container,
  Row,
  Col,
  Table,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const EmailForm = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [accessType, setAccessType] = useState();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const [inputFields, setInputFields] = useState([
    {
      features: "",
    },
  ]);

  const [loader, setLoader] = useState(false);

  const handleSubmit = async (values) => {
    setLoader(true);
    try {
      values["features"] = inputFields;
      const res = await axios.post(`${baseUrl}/email_configration`, values);
      if (res.data.statusCode === 200) {
        toast.success(res.data?.message, {
          position: "top-center",
          autoClose: 1000,
        });
        navigate("/superadmin/plans");
      } else {
        toast.error(res.data.message, {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error, {
        position: "top-center",
        autoClose: 1000,
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      <SuperAdminHeader />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}></h1>
              <h4 style={{ color: "white" }}></h4>
            </FormGroup>
          </Col>
          <Col className="text-right">
            <Button
              className="mb-2"
              color="primary"
              size="sm"
              onClick={() => navigate("/superadmin/plans")}
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>

        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Add Email </h3>
              </CardHeader>
              <div className="table-responsive">
                <div className="m-3">
                  <Formik
                    initialValues={{
                      superadmin_id: "",
                      admin_id: "",
                      host: "",
                      port: "",
                      user: "",
                      pass: "",
                      secure: "",
                      from_name: "",
                      from_email: "",
                    }}
                    validationSchema={Yup.object().shape({
                      host: Yup.string().required("Required"),
                      port: Yup.number().required("Required"),
                      user: Yup.string().required("Required"),
                      pass: Yup.string().required("Required"),
                      secure: Yup.string().required("Required"),
                      from_name: Yup.string().required("Required"),
                      from_email: Yup.string().required("Required"),
                    })}
                    onSubmit={(values, { resetForm }) => {
                      console.log(values, "===========================");
                      handleSubmit(values);
                      resetForm();
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleBlur,
                      handleChange,
                    }) => (
                      <Form>
                        <div className="mb-3 col-lg-8 col-md-12">
                          <TextField
                            type="text"
                            size="small"
                            fullWidth
                            placeholder="Host *"
                            label="Host*"
                            name="host"
                            value={values.host}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={touched.host && !!errors.host}
                            helperText={touched.host && errors.host}
                          />
                        </div>
                        <div className="mb-3 col-lg-8 col-md-12">
                          <TextField
                            type="number"
                            size="small"
                            fullWidth
                            placeholder="Port *"
                            label="Port*"
                            name="port"
                            value={values.port}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={touched.port && !!errors.port}
                            helperText={touched.port && errors.port}
                          />
                        </div>

                        <div className="mb-3 col-lg-8 col-md-12">
                          <TextField
                            type="text"
                            size="small"
                            fullWidth
                            placeholder="User *"
                            label="User*"
                            name="user"
                            value={values.user}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={touched.user && !!errors.user}
                            helperText={touched.user && errors.user}
                          />
                        </div>
                        <div className="mb-3 col-lg-8 col-md-12">
                          <TextField
                            type="text"
                            size="small"
                            fullWidth
                            placeholder="Pass *"
                            label="Pass*"
                            name="pass"
                            value={values.pass}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={touched.pass && !!errors.pass}
                            helperText={touched.pass && errors.pass}
                          />
                        </div>

                        <div className="mb-3 col-lg-8 col-md-12">
                          <FormControl fullWidth>
                            <InputLabel size="small">Secure</InputLabel>
                            <Select
                              size="small"
                              label="Secure"
                              name="secure"
                              value={values.secure}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              MenuProps={{
                                style: {
                                  maxHeight: 210,
                                },
                              }}
                            >
                              <MenuItem value={true}>True</MenuItem>
                              <MenuItem value={false}>False</MenuItem>
                            </Select>
                            {touched.secure && errors.secure ? (
                              <div className="text-danger">{errors.secure}</div>
                            ) : null}
                          </FormControl>
                        </div>

                        <div className="mb-3 col-lg-8 col-md-12">
                          <TextField
                            type="text"
                            size="small"
                            fullWidth
                            placeholder="From-name *"
                            label="From-name*"
                            name="from_name"
                            value={values.from_name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={touched.from_name && !!errors.from_name}
                            helperText={touched.from_name && errors.from_name}
                          />
                        </div>

                        <div className="mb-3 col-lg-8 col-md-12">
                          <TextField
                            type="text"
                            size="small"
                            fullWidth
                            placeholder="From-email *"
                            label="From-email*"
                            name="from_email"
                            value={values.from_email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={touched.from_email && !!errors.from_email}
                            helperText={touched.from_email && errors.from_email}
                          />
                        </div>

                        <div className="mb-3 mx-2">
                          <Button
                            className="mt-3"
                            type="submit"
                            variant="success"
                            disabled={loader}
                          >
                            {loader ? "Loading..." : "Add Email"}
                          </Button>
                          <Button
                            className="mt-3"
                            type=""
                            variant=""
                            onClick={() => navigate("/superadmin/plans")}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </Card>
          </div>
        </Row>

        <br />
        <br />
      </Container>
    </div>
  );
};

export default EmailForm;
