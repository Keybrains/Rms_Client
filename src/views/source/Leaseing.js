import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import TenantHeader from "components/Headers/TenantHeader";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Leaseing = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_URL;
  const { tenant_id, admin } = useParams();
  const navigate = useNavigate();

  const [accessType, setAccessType] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  //display
  const [showPassword, setShowPassword] = useState(false);
  //loaders
  const [loader, setLoader] = useState(false);

  const tenantFormik = useFormik({
    initialValues: {
      tenant_id: "",
      tenant_firstName: "",
      tenant_lastName: "",
      tenant_phoneNumber: "",
      tenant_alternativeNumber: "",
      tenant_email: "",
      tenant_alternativeEmail: "",
      tenant_password: "",
      tenant_birthDate: "",
      taxPayer_id: "",
      comments: "",
      emergency_contact: {
        name: "",
        relation: "",
        email: "",
        phoneNumber: "",
      },
    },
    validationSchema: yup.object({
      tenant_firstName: yup.string().required("Required"),
      tenant_lastName: yup.string().required("Required"),
      tenant_phoneNumber: yup.number().required("Required"),
      tenant_email: yup.string().required("Requied").email("Invalid email address")
        .required("Email is required"),
      tenant_alternativeEmail: yup.string().email("Invalid email address"),

      emergency_contact: yup.object().shape({
        email: yup.string().email("Invalid email address")
      }),

      tenant_password: tenant_id
        ? yup
          .string()
          .min(8, "Password is too short")
          .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Must Contain One Uppercase, One Lowercase, One Number, and one special case Character"
          )
          .required("Required")
        : "",
    }),
    onSubmit: (values) => {
      if (tenant_id) {
        editTenant();
      } else {
        addTenant(values);
      }
    },
  });

  const addTenant = async () => {
    const object = { ...tenantFormik.values, admin_id: accessType?.admin_id };

    try {
      setLoader(true);
      const res = await axios.post(`${baseUrl}/tenant/tenants`, object);
      if (res.data.statusCode === 200) {
        toast.success("Tenant Added successfully!", {
          position: "top-center",
          autoClose: 900,
          onClose: () => navigate(`/${admin}/TenantsTable`)
        });

      } else {
        toast.warning(res.data.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
      });
      console.error("Error:", error.message);
    }
    setLoader(false);
  };

  const editTenant = async () => {
    const object = tenantFormik.values;

    try {
      setLoader(true);
      const res = await axios.put(
        `${baseUrl}/tenant/tenants/${tenant_id}`,
        object
      );
      if (res.data.statusCode === 200) {
        toast.success("Tenant Updated successfully!", {
          position: "top-center",
          autoClose: 900,
          onClose: () => navigate(`/${admin}/TenantsTable`)
        });
      } else {
        toast.warning(res.data.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
      });
      console.error("Error:", error.message);
    }
    setLoader(false);
  };

  const fetchTenantData = async () => {
    if (tenant_id) {
      try {
        const res = await axios.get(`${baseUrl}/tenant/get_tenant/${tenant_id}`);
        if (res.data.statusCode === 200) {
          tenantFormik.setValues(res.data.data);
        } else if (res.data.statusCode === 201) {
          tenantFormik.resetForm();
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  };

  const handleCloseButtonClick = () => {
    navigate(`/${admin}/TenantsTable`);
  };

  //useeffects
  useEffect(() => {
    if (tenant_id) {
      fetchTenantData();
    }
  }, [tenant_id]);

  return (
    <>
      <TenantHeader id={tenant_id} />

      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {tenant_id ? "Edit Tenant" : "New Tenant"}
                    </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <Row>
                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="tenant_firstName"
                                >
                                  First Name *
                                </label>
                                <Input
                                  id="tenant_firstName"
                                  className="form-control-alternative"
                                  variant="standard"
                                  type="text"
                                  placeholder="First Name"
                                  style={{
                                    marginRight: "10px",
                                    flex: 1,
                                  }}
                                  name="tenant_firstName"
                                  onBlur={tenantFormik.handleBlur}
                                  onChange={tenantFormik.handleChange}
                                  value={tenantFormik.values.tenant_firstName}
                                />
                                {tenantFormik.touched.tenant_firstName &&
                                  tenantFormik.errors.tenant_firstName ? (
                                  <div style={{ color: "red" }}>
                                    {tenantFormik.errors.tenant_firstName}
                                  </div>
                                ) : null}
                              </FormGroup>
                            </Col>

                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="tenant_lastName"
                                >
                                  Last Name *
                                </label>
                                <br />
                                <Input
                                  id="tenant_lastName"
                                  className="form-control-alternative"
                                  variant="standard"
                                  type="text"
                                  placeholder="Last Name"
                                  style={{
                                    marginRight: "10px",
                                    flex: 1,
                                  }}
                                  name="tenant_lastName"
                                  onBlur={tenantFormik.handleBlur}
                                  onChange={tenantFormik.handleChange}
                                  value={tenantFormik.values.tenant_lastName}
                                />
                                {tenantFormik.touched.tenant_lastName &&
                                  tenantFormik.errors.tenant_lastName ? (
                                  <div style={{ color: "red" }}>
                                    {tenantFormik.errors.tenant_lastName}
                                  </div>
                                ) : null}
                              </FormGroup>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <Row>
                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="tenant_phoneNumber"
                                >
                                  Phone Number*
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="tenant_phoneNumber"
                                  type="text"
                                  name="tenant_phoneNumber"
                                  placeholder="Phone Number"
                                  onBlur={tenantFormik.handleBlur}
                                  onChange={tenantFormik.handleChange}
                                  value={tenantFormik.values.tenant_phoneNumber}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="tenant_alternativeNumber"
                                  style={{
                                    paddingTop: "3%",
                                  }}
                                >
                                  Work Number
                                </label>
                                <br />
                                <Input
                                  id="tenant_alternativeNumber"
                                  className="form-control-alternative"
                                  variant="standard"
                                  type="text"
                                  placeholder="Alternative Number"
                                  style={{
                                    marginRight: "10px",
                                    flex: 1,
                                  }} // Adjust flex property
                                  name="tenant_alternativeNumber"
                                  onBlur={tenantFormik.handleBlur}
                                  onChange={tenantFormik.handleChange}
                                  value={
                                    tenantFormik.values.tenant_alternativeNumber
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
                              </FormGroup>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <Row>
                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="tenant_email"
                                >
                                  Email *
                                </label>
                                <br />
                                <Input
                                  id="tenant_email"
                                  className="form-control-alternative"
                                  variant="standard"
                                  type="text"
                                  placeholder="Email"
                                  style={{
                                    marginRight: "10px",
                                    flex: 1,
                                  }}
                                  name="tenant_email"
                                  onBlur={tenantFormik.handleBlur}
                                  onChange={tenantFormik.handleChange}
                                  value={tenantFormik.values.tenant_email}
                                />
                                {tenantFormik.touched.tenant_email &&
                                  tenantFormik.errors.tenant_email ? (
                                  <div style={{ color: "red" }}>
                                    {tenantFormik.errors.tenant_email}
                                  </div>
                                ) : null}
                              </FormGroup>
                            </Col>
                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="tenant_alternativeEmail"
                                  style={{
                                    paddingTop: "3%",
                                  }}
                                >
                                  Alternative Email
                                </label>
                                <br />
                                <Input
                                  id="tenant_alternativeEmail"
                                  className="form-control-alternative"
                                  variant="standard"
                                  type="text"
                                  placeholder="Alternative Email"
                                  style={{
                                    marginRight: "10px",
                                    flex: 1,
                                  }}
                                  name="tenant_alternativeEmail"
                                  onBlur={tenantFormik.handleBlur}
                                  onChange={(e) => tenantFormik.handleChange(e)}
                                  value={
                                    tenantFormik.values.tenant_alternativeEmail
                                  }
                                />
                                {tenantFormik.touched.tenant_alternativeEmail &&
                                  tenantFormik.errors.tenant_alternativeEmail ? (
                                  <div style={{ color: "red" }}>
                                    {tenantFormik.errors.tenant_alternativeEmail}
                                  </div>
                                ) : null}
                              </FormGroup>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <Row>
                            <Col lg="3">
                              <FormGroup>
                                <div
                                  style={{
                                    flex: 1,
                                    marginRight: "10px",
                                  }}
                                >
                                  <label
                                    className="form-control-label"
                                    htmlFor="tenant_password"
                                  >
                                    Password*
                                  </label>
                                  <br />
                                  <div style={{ display: "flex" }}>
                                    <Input
                                      id="tenant_password"
                                      className="form-control-alternative"
                                      variant="standard"
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Password"
                                      style={{
                                        marginRight: "10px",
                                        flex: 1,
                                      }}
                                      name="tenant_password"
                                      onBlur={tenantFormik.handleBlur}
                                      onChange={tenantFormik.handleChange}
                                      value={
                                        tenantFormik.values.tenant_password
                                      }
                                    />
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                    >
                                      {<VisibilityIcon />}
                                    </Button>
                                  </div>
                                  {tenantFormik.errors &&
                                    tenantFormik.errors?.tenant_password &&
                                    tenantFormik.touched &&
                                    tenantFormik.touched?.tenant_password ? (
                                    <div style={{ color: "red" }}>
                                      {tenantFormik.errors.tenant_password}
                                    </div>
                                  ) : null}
                                </div>
                              </FormGroup>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">
                    Personal Information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Row>
                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-unitadd3"
                                >
                                  Date of Birth
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-unitadd3"
                                  placeholder="3000"
                                  type="date"
                                  name="tenant_birthDate"
                                  onBlur={tenantFormik.handleBlur}
                                  onChange={tenantFormik.handleChange}
                                  value={tenantFormik.values.tenant_birthDate}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-unitadd4"
                                >
                                  TaxPayer ID
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-unitadd4"
                                  type="text"
                                  name="taxPayer_id"
                                  onBlur={tenantFormik.handleBlur}
                                  onChange={tenantFormik.handleChange}
                                  value={tenantFormik.values.taxPayer_id}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <div className="pl-lg-2">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Col lg="3">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-address"
                              >
                                Comments
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-address"
                                type="textarea"
                                style={{
                                  height: "90px",
                                  width: "100%",
                                  // maxWidth: "25rem",
                                }}
                                name="comments"
                                onBlur={tenantFormik.handleBlur}
                                onChange={tenantFormik.handleChange}
                                value={tenantFormik.values.comments}
                              />
                            </FormGroup>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">
                    Emergency Contact
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Row>
                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-unitadd5"
                                >
                                  Contact Name
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-unitadd5"
                                  type="text"
                                  name="emergency_contact.name"
                                  placeholder="Contact Name"
                                  onBlur={tenantFormik.handleBlur}
                                  onChange={tenantFormik.handleChange}
                                  value={
                                    tenantFormik.values.emergency_contact.name
                                  }
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-unitadd6"
                                >
                                  Relationship to Tenant
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-unitadd6"
                                  type="text"
                                  name="emergency_contact.relation"
                                  placeholder="Relationship to Tenant"
                                  onBlur={tenantFormik.handleBlur}
                                  onChange={tenantFormik.handleChange}
                                  value={
                                    tenantFormik.values.emergency_contact
                                      .relation
                                  }
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Row>
                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-unitadd7"
                                >
                                  E-Mail
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-unitadd7"
                                  type="text"
                                  name="emergency_contact.email"
                                  placeholder="Email"
                                  onBlur={tenantFormik.handleBlur}
                                  onChange={tenantFormik.handleChange}
                                  value={
                                    tenantFormik.values.emergency_contact.email
                                  }
                                />
                                {tenantFormik.touched?.emergency_contact?.email &&
                                  tenantFormik.errors?.emergency_contact?.email ? (
                                  <div style={{ color: "red" }}>
                                    {tenantFormik.errors?.emergency_contact?.email}
                                  </div>
                                ) : null}
                              </FormGroup>
                            </Col>
                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-unitadd8"
                                >
                                  Phone Number
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-unitadd8"
                                  type="text"
                                  name="emergency_contact.phoneNumber"
                                  placeholder="Phone Number"
                                  onBlur={tenantFormik.handleBlur}
                                  onChange={tenantFormik.handleChange}
                                  value={
                                    tenantFormik.values.emergency_contact
                                      .phoneNumber
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
                              </FormGroup>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <Row>
                    <div className="pl-lg-4">
                      {loader ? (
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ background: "green", cursor: "not-allowed" }}
                          disabled
                        >
                          Loading...
                        </button>
                      ) : tenant_id ? (
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ background: "green", cursor: "pointer" }}
                          onClick={(e) => {
                            e.preventDefault();
                            tenantFormik.handleSubmit();
                          }}
                        >
                          Update Tenant
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary "
                          style={{ background: "green", cursor: "pointer" }}
                          disabled={!tenantFormik.isValid}
                          onClick={(e) => {
                            e.preventDefault();
                            tenantFormik.handleSubmit();
                          }}
                        >
                          Add Tenant
                        </button>
                      )}
                      <button
                        // color="primary"
                        onClick={handleCloseButtonClick}
                        className="btn btn-success"
                        style={{
                          background: "white",
                          color: "black",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="ml-3">
                      {/* Conditional message */}
                      {!tenantFormik.isValid && (
                        <div style={{ color: 'red', marginTop: '10px' }}>
                          Please fill in all fields correctly.
                        </div>
                      )}
                    </div>
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

export default Leaseing;
