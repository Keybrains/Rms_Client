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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import {
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkbox from "@mui/material/Checkbox";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import AddPropertyTypeHeader from "components/Headers/AddPropertyTypeHeader.js";

const AddPropertyType = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id, admin } = useParams();
  const [prodropdownOpen, setproDropdownOpen] = useState(false);
  const [isMultiUnit, setIsMultiUnit] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState("");

  const toggle = () => setproDropdownOpen((prevState) => !prevState);

  const navigate = useNavigate();

  const handleChangecheck = (e) => {
    setIsMultiUnit(e.target.checked);
  };

  const handlePropertySelection = (value) => {
    setSelectedProperty(value);
    localStorage.setItem("property", value);
  };

  const propertyFormik = useFormik({
    initialValues: {
      property_type: "",
      propertysub_type: "",
      isMultiUnit: false,
    },
    validationSchema: yup.object({
      property_type: yup.string().required("Required"),
      propertysub_type: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const [propertyType, setpropertyType] = useState(null);

  const cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

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
            property_type: propertyData?.property_type || "",
            propertysub_type: propertyData?.propertysub_type || "",
            isMultiUnit: propertyData?.is_multiunit,
          });
        })
        .catch((error) => {
          console.error("Error fetching property type data:", error);
        });
    }
  }, [id]);

  const [submitLoader, setSubmitLoader] = useState(false);

  async function handleSubmit(values) {
    setSubmitLoader(true);
    try {
      const object = {
        admin_id: accessType?.admin_id,
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
    } finally {
      setSubmitLoader(false);
    }
  }

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
        onClose: () => navigate(`/${admin}/PropertyType`),
      });
    } else {
      // Show an error toast
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 1000,
      });
    }
  }

  const handleCloseButtonClick = () => {
    navigate("../PropertyType");
  };

  return (
    <>
      {/* <AddPropertyTypeHeader /> */}
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
              {id ? "Edit Property Type" : "Add Property Type"}

            </h2>
          </CardHeader>
        </Col>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-white shadow mt-3 mx-4" style={{ boxShadow: " 0px 4px 4px 0px #00000040", border: "1px solid #324567" }}>
             
              <CardBody>
                <Form onSubmit={propertyFormik.handleSubmit}>
                  <div className="">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Property Type *
                          </label>
                          <br />
                          <br />
                          <Dropdown isOpen={prodropdownOpen} toggle={toggle}>
                            <DropdownToggle caret
                              style={{
                                boxShadow: " 0px 4px 4px 0px #00000040",
                                border: "1px solid #ced4da",
                                maxWidth: "200px",
                                minWidth: "200px",
                                backgroundColor: "transparent",
                                color: "#A7A7A7"
                              }}
                            >
                              {propertyFormik.values.property_type ||
                                "Property Type"}
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={() =>
                                  propertyFormik.handleChange({
                                    target: {
                                      name: "property_type",
                                      value: "Residential",
                                    },
                                  })
                                }
                              >
                                Residential
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  propertyFormik.handleChange({
                                    target: {
                                      name: "property_type",
                                      value: "Commercial",
                                    },
                                  })
                                }
                              >
                                Commercial
                              </DropdownItem>
                            </DropdownMenu>
                            {propertyFormik.touched.property_type &&
                              propertyFormik.errors.property_type ? (
                              <div
                                style={{ color: "red", marginBottom: "10px" }}
                              >
                                {propertyFormik.errors.property_type}
                              </div>
                            ) : null}
                          </Dropdown>
                        </FormGroup>
                      </Col>
                    </Row>

                    <br />
                  </div>
                  {/* <hr className="my-4" /> */}
                  <div className="">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Property Sub Type *
                          </label>
                          <br />
                          <br />
                          <Input
                            style={{
                              boxShadow: " 0px 4px 4px 0px #00000040 ",
                              borderRadius: "6px",
                              width: "30%",
                            }}
                            className="form-control-alternative"
                            id="input-protype"
                            placeholder="Townhome"
                            type="text"
                            name="propertysub_type"
                            onBlur={propertyFormik.handleBlur}
                            onChange={propertyFormik.handleChange}
                            value={propertyFormik.values.propertysub_type}

                          />
                          {propertyFormik.touched.property_type &&
                            propertyFormik.errors.property_type ? (
                            <div
                              style={{ color: "red", marginBottom: "10px" }}
                            >
                              {propertyFormik.errors.property_type}
                            </div>
                          ) : null}
                          <br></br>
                          <Checkbox
                            onChange={handleChangecheck}
                            checked={isMultiUnit}
                            style={{ color: "#152B51" }}
                          />

                          <label className="form-control-label" style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: "16px", color: "#8A95A8" }}>
                            Multi unit
                          </label>
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
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
                        className="ml-3"
                        style={{
                          background: "#152B51", color: "white", fontFamily: "Poppins", fontWeight: "400", fontSize: "14px",
                          cursor: "pointer",

                        }}
                        disabled={!propertyFormik.isValid}
                      >
                        {id ? "Update Property Type" : "Add Property Type"}
                      </Button>
                    )}
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
                    {!propertyFormik.isValid && (
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

export default AddPropertyType;
