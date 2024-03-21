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
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import Header from "components/Headers/Header";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

const MailConfigurationCard = ({ data }) => {
  return (
    <div className="col-lg-6 mb-4">
      <div className="card h-100">
        <div className="card-body">
          <h3
            className="card-title font-weight-bold"
            style={{ borderBottom: "1px solid #ccc" }}
          >
            Configuration Details
          </h3>
          <p className="card-text font-weight-bold">Host:</p>
          <p className="card-text">{data.host}</p>
          <p className="card-text font-weight-bold">Port:</p>
          <p className="card-text">{data.port}</p>
          <p className="card-text font-weight-bold">User:</p>
          <p className="card-text">{data.user}</p>
          <p className="card-text font-weight-bold">Label:</p>
          <p className="card-text">{data.from_name}</p>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { admin } = useParams();
  let navigate = useNavigate();
  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);
  let [loader, setLoader] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const [selectedOption, setSelectedOption] = useState("surcharge");
  const [submitLoader, setSubmitLoader] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  //Selected option Surcharge
  const [surcharge, setsurcharge] = useState(null);
  const [surcharge_id, setSurchargeId] = useState(null);

  const surchargeFormik = useFormik({
    initialValues: {
      surcharge_percent: "",
      surcharge_percent_debit: "",
    },
    validationSchema: yup.object({
      surcharge_percent: yup.number().required("Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    let Admin_Id = accessType?.admin_id;
    axios
      .get(`${baseUrl}/surcharge/surcharge/getadmin/${Admin_Id}`)
      .then((response) => {
        const Data = response.data.data[0];
        setsurcharge(Data);
        setSurchargeId(Data.surcharge_id);
        surchargeFormik.setValues({
          surcharge_percent: Data.surcharge_percent || "",
          surcharge_percent_debit: Data.surcharge_percent_debit || "",
        });
      })
      .catch((error) => {
        console.error("Error fetching property type data:", error);
      });
  }, [accessType, selectedOption]);

  async function handleSubmit(values) {
    setSubmitLoader(true);
    try {
      const object = {
        admin_id: accessType?.admin_id,
        surcharge_percent: surchargeFormik.values.surcharge_percent,
        surcharge_percent_debit: surchargeFormik.values.surcharge_percent_debit,
      };

      if (!surcharge_id) {
        const res = await axios.post(`${baseUrl}/surcharge/surcharge`, object);
        if (res.data.statusCode === 200) {
          toast.success("Surcharge Added", {
            position: "top-center",
            autoClose: 800,
            // onClose: () => navigate(`/${admin}/surcharge`),
          });
        } else if (res.data.statusCode === 201) {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      } else {
        const editUrl = `${baseUrl}/surcharge/surcharge/${surcharge_id}`;
        const res = await axios.put(editUrl, object);
        if (res.data.statusCode === 200) {
          toast.success("Surcharge Updated", {
            position: "top-center",
            autoClose: 800,
            // onClose: () => navigate(`/${admin}/surcharge`),
          });
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
    } finally {
      setSubmitLoader(false);
    }
  }

  //Selected option Latefee Charge
  const [lateFee, setLateFee] = useState(null);
  const [latefee_id, setLateFeeId] = useState(null);
  const [testLoader, setTestLoader] = useState(false);

  const latefeeFormik = useFormik({
    initialValues: {
      duration: "",
      late_fee: "",
    },
    validationSchema: yup.object({
      duration: yup.number().required("Required"),
      late_fee: yup.number().required("Required"),
    }),
    onSubmit: (values) => {
      handleLateFeeSubmit(values);
    },
  });

  useEffect(() => {
    let Admin_Id = accessType?.admin_id;
    axios
      .get(`${baseUrl}/latefee/latefee/${Admin_Id}`)
      .then((response) => {
        const Data = response.data.data;
        setLateFee(Data);
        setLateFeeId(Data.latefee_id);
        latefeeFormik.setValues({
          duration: Data.duration || "",
          late_fee: Data.late_fee || "",
        });
      })
      .catch((error) => {
        console.error("Error fetching late fee data:", error);
      });
  }, [accessType, selectedOption]);

  async function handleLateFeeSubmit(values) {
    setSubmitLoader(true);
    try {
      const object = {
        admin_id: accessType?.admin_id,
        duration: latefeeFormik.values.duration,
        late_fee: latefeeFormik.values.late_fee,
      };

      if (!latefee_id) {
        const res = await axios.post(`${baseUrl}/latefee/latefee`, object);
        if (res.data.statusCode === 200) {
          toast.success("Late Fee Added", {
            position: "top-center",
            autoClose: 800,
            // onClose: () => navigate(`/${admin}/surcharge`),
          });
        } else if (res.data.statusCode === 201) {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      } else {
        const editUrl = `${baseUrl}/latefee/latefee/${latefee_id}`;
        const res = await axios.put(editUrl, object);
        if (res.data.statusCode === 200) {
          toast.success("Late Fee Updated", {
            position: "top-center",
            autoClose: 800,
            // onClose: () => navigate(`/${admin}/surcharge`),
          });
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
    } finally {
      setSubmitLoader(false);
    }
  }

  //Selected option NMI Account
  const [nmiKey, setNmiKey] = useState(null);
  const [key_id, setKeyId] = useState(null);
  const [responseText, setResponseText] = useState(null);

  const nmikeyFormik = useFormik({
    initialValues: {
      security_key: "",
      admin_id: "",
    },
    validationSchema: yup.object({
      security_key: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleNmiKeySubmit(values);
    },
  });
  useEffect(() => {
    let Admin_Id = accessType?.admin_id;
    axios
      .get(`${baseUrl}/nmi-keys/nmi-keys/${Admin_Id}`)
      .then((response) => {
        const Data = response.data.data;
        setNmiKey(Data);
        setKeyId(Data.key_id);
        nmikeyFormik.setValues({
          security_key: Data.security_key || "",
          //  late_fee: Data.late_fee || "",
        });
      })
      .catch((error) => {
        console.error("Error fetching late fee data:", error);
      });
  }, [accessType, selectedOption]);

  async function handleNmiKeySubmit(values) {
    setSubmitLoader(true);
    try {
      const object = {
        admin_id: accessType?.admin_id,
        security_key: values.security_key,
      };

      if (!key_id) {
        const res = await axios.post(`${baseUrl}/nmi-keys/nmi-keys`, object);
        if (res.data.statusCode === 200) {
          toast.success("Security Key Added", {
            position: "top-center",
            autoClose: 800,
            // onClose: () => navigate(`/${admin}/surcharge`),
          });
        } else if (res.data.statusCode === 201) {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      } else {
        const editUrl = `${baseUrl}/nmi-keys/nmi-keys/${key_id}`;
        const res = await axios.put(editUrl, object);
        if (res.data.statusCode === 200) {
          toast.success("Security Key Updated", {
            position: "top-center",
            autoClose: 800,
            // onClose: () => navigate(`/${admin}/surcharge`),
          });
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
    } finally {
      setSubmitLoader(false);
    }
  }

  async function handleTestKeyClick(values) {
    setTestLoader(true);
    try {
      const object = {
        first_name: accessType.first_name,
        last_name: accessType.last_name,
        email: accessType.email,
        security_key: values.security_key,
        cc_number: values.cc_number,
        cc_exp: values.cc_exp
      };


        const res = await axios.post(`${baseUrl}/nmipayment/test_sale`, {paymentDetails:object});
        if (res.data.statusCode === 100) {
          toast.success(res.data.message, {
            position: "top-center", 
            autoClose: 1000,
            // onClose: () => navigate(`/${admin}/surcharge`),
          });
          setResponseText(res.data.message)
        } else if (res.data.statusCode === 200) {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
          setResponseText(res.data.message)
        }
   
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    } finally {
      setTestLoader(false);
    }
  }

  //Selected option Mail
  const [mailData, setMailData] = useState([]);
  const [click, setClick] = useState(false);

  useEffect(() => {
    let Admin_Id = accessType?.admin_id;
    axios
      .get(`${baseUrl}/email_configration/mail/${Admin_Id}`)
      .then((response) => {
        const Data = response.data.data;
        setMailData(Data);
      })
      .catch((error) => {
        console.error("Error fetching property type data:", error);
      });
  }, [accessType, selectedOption]);

  const handleSubmitMail = async (values) => {
    let Admin_Id = accessType?.admin_id;
    setLoader(true);
    try {
      values.admin_id = Admin_Id;
      const res = await axios.post(`${baseUrl}/email_configration`, values);
      if (res.data.statusCode === 200) {
        toast.success("Email Linked", {
          position: "top-center",
          autoClose: 1000,
        });
        setClick(false);
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
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Settings</h1>
            </FormGroup>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Card className="shadow">
              {/* <CardHeader className="border-0">
                <h3 className="mb-0">Settings</h3>
              </CardHeader> */}
              <CardBody>
                <Row>
                  <Col xs="3">
                    <div style={{ border: "1px solid #ccc", height: "100%" }}>
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        <li style={{ borderBottom: "1px solid #ccc" }}>
                          <div
                            color="link"
                            onClick={() => handleOptionClick("surcharge")}
                            style={{
                              backgroundColor:
                                selectedOption === "surcharge"
                                  ? "#D3D3D3"
                                  : "inherit",
                              color: "black",
                              cursor: "pointer",
                              fontWeight: "bold",
                              padding: "20px 15px",
                            }}
                          >
                            Surcharge
                          </div>
                        </li>
                        <li style={{ borderBottom: "1px solid #ccc" }}>
                          <div
                            color="link"
                            onClick={() => handleOptionClick("latefee")}
                            style={{
                              backgroundColor:
                                selectedOption === "latefee"
                                  ? "#D3D3D3"
                                  : "inherit",
                              color: "black",
                              cursor: "pointer",
                              fontWeight: "bold",
                              padding: "20px 15px",
                            }}
                          >
                            Late Fee Charge
                          </div>
                        </li>
                        <li style={{ borderBottom: "1px solid #ccc" }}>
                          <div
                            color="link"
                            onClick={() => handleOptionClick("nmi-account")}
                            style={{
                              backgroundColor:
                                selectedOption === "nmi-account"
                                  ? "#D3D3D3"
                                  : "inherit",
                              color: "black",
                              cursor: "pointer",
                              fontWeight: "bold",
                              padding: "20px 15px",
                            }}
                          >
                            NMI Account
                          </div>
                        </li>
                        {/* <li style={{ borderBottom: "1px solid #ccc" }}>
                          <div
                            color="link"
                            onClick={() => handleOptionClick("mail")}
                            style={{
                              backgroundColor:
                                selectedOption === "mail"
                                  ? "#D3D3D3"
                                  : "inherit",
                              color: "black",
                              cursor: "pointer",
                              fontWeight: "bold",
                              padding: "20px 15px",
                            }}
                          >
                            Mail Service
                          </div>
                        </li> */}
                        {/* <li style={{ borderBottom: "1px solid #ccc" }}>
                          <div
                            color="link"
                            onClick={() => handleOptionClick("admin")}
                            style={{
                              backgroundColor:
                                selectedOption === "admin"
                                  ? "#D3D3D3"
                                  : "inherit",
                              color: "black",
                              cursor: "pointer",
                              fontWeight: "bold",
                              padding: "20px 15px",
                            }}
                          >
                            Admin
                          </div>
                        </li>
                        <li
                          style={{
                            marginBottom: "10px",
                            borderBottom: "1px solid #ccc",
                          }}
                        >
                          <div
                            color="link"
                            onClick={() => handleOptionClick("general")}
                            style={{
                              backgroundColor:
                                selectedOption === "general"
                                  ? "#D3D3D3"
                                  : "inherit",
                              color: "black",
                              cursor: "pointer",
                              fontWeight: "bold",
                              padding: "20px 15px",
                            }}
                          >
                            General
                          </div>
                        </li> */}
                      </ul>
                    </div>
                  </Col>
                  <Col xs="9">
                    <div>
                      <CardBody>
                        {selectedOption === "surcharge" && (
                          <div>
                            <h1>Surcharge</h1>
                            <Form onSubmit={surchargeFormik.handleSubmit}>
                              <div className="pl-lg-4 mt-5">
                                <Row>
                                  <span>
                                    You can set default surcharge percentage
                                    from here
                                  </span>
                                </Row>
                                <Row className="mt-4">
                                  <Col lg="6">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-property"
                                      >
                                        Credit Card Surcharge Percent
                                      </label>
                                      <br />
                                      <br />
                                      <Input
                                        className="form-control-alternative"
                                        id="input-protype"
                                        placeholder="Surcharge %"
                                        type="number"
                                        name="surcharge_percent"
                                        onBlur={surchargeFormik.handleBlur}
                                        onChange={surchargeFormik.handleChange}
                                        value={
                                          surchargeFormik.values
                                            .surcharge_percent
                                        }
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>

                                <Row className="mt-4">
                                  <Col lg="6">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-property"
                                      >
                                        Debit Card Surcharge Percent
                                      </label>
                                      <br />
                                      <br />
                                      <Input
                                        className="form-control-alternative"
                                        id="input-protype"
                                        placeholder="Surcharge %"
                                        type="number"
                                        name="surcharge_percent_debit"
                                        onBlur={surchargeFormik.handleBlur}
                                        onChange={surchargeFormik.handleChange}
                                        value={
                                          surchargeFormik.values
                                            .surcharge_percent_debit
                                        }
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </div>
                              <br />
                              <Row>
                                {submitLoader ? (
                                  <Button
                                    type="submit"
                                    className="btn btn-primary ml-4"
                                    style={{
                                      background: "green",
                                      color: "white",
                                    }}
                                    disabled
                                  >
                                    Loading...
                                  </Button>
                                ) : (
                                  <Button
                                    type="submit"
                                    className="btn btn-primary ml-5"
                                    style={{
                                      background: "green",
                                      color: "white",
                                    }}
                                  >
                                    {surcharge_id ? "Update" : "Save"}
                                  </Button>
                                )}
                                <Button
                                  color="primary"
                                  className="btn btn-primary ml-4"
                                  onClick={surchargeFormik.resetForm}
                                  style={{
                                    background: "white",
                                    color: "black",
                                  }}
                                >
                                  Reset
                                </Button>
                              </Row>
                            </Form>
                          </div>
                        )}
                        {selectedOption === "latefee" && (
                          <div>
                            <h1>Late Fee Charge</h1>
                            <Form onSubmit={latefeeFormik.handleSubmit}>
                              <div className="pl-lg-4 mt-5">
                                <Row>
                                  <span>
                                    You can set default Late fee charge from
                                    here
                                  </span>
                                </Row>
                                <Row className="mt-4">
                                  <Col lg="6">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-property"
                                      >
                                        Percentage
                                      </label>
                                      <br />
                                      <br />
                                      <Input
                                        className="form-control-alternative"
                                        id="input-protype"
                                        placeholder="Late Fee Charge"
                                        type="number"
                                        name="late_fee"
                                        onBlur={latefeeFormik.handleBlur}
                                        onChange={latefeeFormik.handleChange}
                                        value={latefeeFormik.values.late_fee}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>

                                <Row className="mt-4">
                                  <Col lg="6">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-property"
                                      >
                                        Duration
                                      </label>
                                      <br />
                                      <br />
                                      <Input
                                        className="form-control-alternative"
                                        id="input-protype"
                                        placeholder="Late Fee Duration"
                                        type="number"
                                        name="duration"
                                        onBlur={latefeeFormik.handleBlur}
                                        onChange={latefeeFormik.handleChange}
                                        value={latefeeFormik.values.duration}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <br />
                              </div>
                              <Row>
                                {submitLoader ? (
                                  <Button
                                    type="submit"
                                    className="btn btn-primary ml-4"
                                    style={{
                                      background: "green",
                                      color: "white",
                                    }}
                                    disabled
                                  >
                                    Loading...
                                  </Button>
                                ) : (
                                  <Button
                                    type="submit"
                                    className="btn btn-primary ml-5"
                                    style={{
                                      background: "green",
                                      color: "white",
                                    }}
                                  >
                                    {latefee_id ? "Update" : "Save"}
                                  </Button>
                                )}
                                <Button
                                  color="primary"
                                  className="btn btn-primary ml-4"
                                  onClick={latefeeFormik.resetForm}
                                  style={{
                                    background: "white",
                                    color: "black",
                                  }}
                                >
                                  Reset
                                </Button>
                              </Row>
                            </Form>
                          </div>
                        )}
                        {selectedOption === "mail" && (
                          <div className="table-responsive">
                            <h1>Mail Service</h1>
                            <div className="m-3">
                              <Row className="mt-5 mb-4 ml-0">
                                <span>
                                  You can set your mail configuration settings
                                  from here
                                </span>
                              </Row>
                              <div>
                                {click ? (
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
                                    validationSchema={yup.object().shape({
                                      host: yup.string().required("Required"),
                                      port: yup.number().required("Required"),
                                      user: yup.string().required("Required"),
                                      pass: yup.string().required("Required"),
                                      secure: yup.string().required("Required"),
                                      from_name: yup
                                        .string()
                                        .required("Required"),
                                      from_email: yup
                                        .string()
                                        .required("Required"),
                                    })}
                                    onSubmit={(values, { resetForm }) => {
                                      handleSubmitMail(values);
                                      resetForm();
                                    }}
                                  >
                                    {({
                                      values,
                                      errors,
                                      touched,
                                      handleBlur,
                                      handleChange,
                                      handleSubmit,
                                    }) => (
                                      <Form onSubmit={handleSubmit}>
                                        <div className="mb-3 col-lg-8 col-md-12">
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-property"
                                          >
                                            Host *
                                          </label>
                                          <TextField
                                            type="text"
                                            size="small"
                                            fullWidth
                                            placeholder="cloudpress.host"
                                            name="host"
                                            value={values.host}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={
                                              touched.host && !!errors.host
                                            }
                                            helperText={
                                              touched.host && errors.host
                                            }
                                          />
                                        </div>
                                        <div className="mb-3 col-lg-8 col-md-12">
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-property"
                                          >
                                            Port *
                                          </label>
                                          <TextField
                                            type="number"
                                            size="small"
                                            fullWidth
                                            placeholder="111"
                                            name="port"
                                            value={values.port}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={
                                              touched.port && !!errors.port
                                            }
                                            helperText={
                                              touched.port && errors.port
                                            }
                                          />
                                        </div>

                                        <div className="mb-3 col-lg-8 col-md-12">
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-property"
                                          >
                                            User *
                                          </label>
                                          <TextField
                                            type="text"
                                            size="small"
                                            fullWidth
                                            placeholder="Admin Name"
                                            name="user"
                                            value={values.user}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={
                                              touched.user && !!errors.user
                                            }
                                            helperText={
                                              touched.user && errors.user
                                            }
                                          />
                                        </div>
                                        <div className="mb-3 col-lg-8 col-md-12">
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-property"
                                          >
                                            Password *
                                          </label>
                                          <TextField
                                            type="text"
                                            size="small"
                                            fullWidth
                                            placeholder="Password"
                                            name="pass"
                                            value={values.pass}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={
                                              touched.pass && !!errors.pass
                                            }
                                            helperText={
                                              touched.pass && errors.pass
                                            }
                                          />
                                        </div>

                                        <div className="mb-3 col-lg-8 col-md-12">
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-property"
                                          >
                                            Secure
                                          </label>
                                          <FormControl fullWidth>
                                            <InputLabel size="small">
                                              Select
                                            </InputLabel>
                                            <Select
                                              size="small"
                                              name="secure"
                                              label="Select"
                                              value={values.secure}
                                              onBlur={handleBlur}
                                              onChange={handleChange}
                                              MenuProps={{
                                                style: {
                                                  maxHeight: 210,
                                                },
                                              }}
                                            >
                                              <MenuItem value={true}>
                                                True
                                              </MenuItem>
                                              <MenuItem value={false}>
                                                False
                                              </MenuItem>
                                            </Select>
                                            {touched.secure && errors.secure ? (
                                              <div className="text-danger">
                                                {errors.secure}
                                              </div>
                                            ) : null}
                                          </FormControl>
                                        </div>

                                        <div className="mb-3 col-lg-8 col-md-12">
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-property"
                                          >
                                            Mail Label
                                          </label>
                                          <TextField
                                            type="text"
                                            size="small"
                                            fullWidth
                                            placeholder="donotreply"
                                            name="from_name"
                                            value={values.from_name}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={
                                              touched.from_name &&
                                              !!errors.from_name
                                            }
                                            helperText={
                                              touched.from_name &&
                                              errors.from_name
                                            }
                                          />
                                        </div>

                                        <div className="mb-3 col-lg-8 col-md-12">
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-property"
                                          >
                                            Mail Sender ID
                                          </label>
                                          <TextField
                                            type="text"
                                            size="small"
                                            fullWidth
                                            placeholder="john@mail.com"
                                            name="from_email"
                                            value={values.from_email}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={
                                              touched.from_email &&
                                              !!errors.from_email
                                            }
                                            helperText={
                                              touched.from_email &&
                                              errors.from_email
                                            }
                                          />
                                        </div>

                                        <div className="mb-3 mx-2">
                                          <Button
                                            className="btn btn-primary"
                                            style={{
                                              background: "green",
                                              color: "white",
                                            }}
                                            type="submit"
                                            disabled={loader}
                                          >
                                            {loader
                                              ? "Loading..."
                                              : "Add Email"}
                                          </Button>
                                          <Button
                                            className="btn"
                                            onClick={() => setClick(false)}
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </Form>
                                    )}
                                  </Formik>
                                ) : (
                                  <>
                                    <div className="row row-cols-1 row-cols-md-2 g-4">
                                      {mailData &&
                                        mailData.map((data, index) => (
                                          <MailConfigurationCard
                                            key={index}
                                            data={data}
                                          />
                                        ))}
                                    </div>
                                    <div className="mb-3 mx-2">
                                      <Button
                                        className="btn1 btn-primary"
                                        color="primary"
                                        style={{ color: "white" }}
                                        onClick={() => setClick(true)}
                                      >
                                        Add New
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedOption === "nmi-account" && (
                          <div>
                            <h1>NMI Account Set Up</h1>
                            <Form onSubmit={nmikeyFormik.handleSubmit}>
                              <div className="pl-lg-4 mt-5">
                                <Row>
                                  <span>
                                    You can set your NMI account security key
                                    from here,
                                  </span>
                                </Row>
                                <Row className="mt-4">
                                  <Col lg="9">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                      >
                                        Security Key
                                      </label>
                                      <Input
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="Enter Security Key"
                                        type="text"
                                        name="security_key"
                                        onBlur={nmikeyFormik.handleBlur}
                                        onChange={nmikeyFormik.handleChange}
                                        value={nmikeyFormik.values.security_key}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row className="mt-4">
                                  <Col lg="9">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                      >
                                        Test NMI Account
                                      </label>
                                      <p>
                                        To test whether the account system has
                                        been successfully linked to the NMI
                                        account or not, please click on the
                                        button that will initiate a $1.00
                                        transaction to this security key's
                                        account.
                                      </p>
                                      <Row className="mt-4">
                                  <Col lg="4">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                      >
                                        Card Number
                                      </label>
                                      <Input
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="Card Number"
                                        type="number"
                                        name="cc_number"
                                        onBlur={nmikeyFormik.handleBlur}
                                        onChange={nmikeyFormik.handleChange}
                                        value={nmikeyFormik.values.cc_number}
                                        
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="4">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                      >
                                        Expiration Date
                                      </label>
                                      <Input
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="Expiry Date"
                                        type="text"
                                        name="cc_exp"
                                        onBlur={nmikeyFormik.handleBlur}
                                        onChange={nmikeyFormik.handleChange}
                                        value={nmikeyFormik.values.cc_exp}
                                        
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row className="mt-4">
                                <Col lg="4">
                                {testLoader ? (
                                  <Button
                                    type="submit"
                                    className="btn btn-primary ml-4"
                                    style={{
                                      background: "green",
                                      color: "white",
                                    }}
                                    disabled
                                  >
                                    Loading...
                                  </Button>
                                ) : (
                                <Button
                                        color="warning"
                                        // className="bg-warning text-white"
                                        type="submit"
                                        onClick={(e) => {
                                          handleTestKeyClick(nmikeyFormik.values);
                                          e.preventDefault();
                                        }}
                                      >
                                        Test Transaction
                                      </Button>
                                )}
                                  </Col>
                                  <Col lg="6">
                                    <label>{responseText}</label>
                                  </Col>
                                </Row>
                                   
                                    </FormGroup>
                                  </Col>
                                </Row>

                                <br />
                              </div>
                              <Row>
                                {submitLoader ? (
                                  <Button
                                    type="submit"
                                    className="btn btn-primary ml-4"
                                    style={{
                                      background: "green",
                                      color: "white",
                                    }}
                                    disabled
                                  >
                                    Loading...
                                  </Button>
                                ) : (
                                  <Button
                                    type="submit"
                                    className="btn btn-primary ml-5"
                                    style={{
                                      background: "green",
                                      color: "white",
                                    }}
                                  >
                                    {key_id ? "Update" : "Save"}
                                  </Button>
                                )}
                                <Button
                                  color="primary"
                                  className="btn btn-primary ml-4"
                                  onClick={nmikeyFormik.resetForm}
                                  style={{
                                    background: "white",
                                    color: "black",
                                  }}
                                >
                                  Reset
                                </Button>
                              </Row>
                            </Form>
                          </div>
                        )}
                      </CardBody>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Settings;
