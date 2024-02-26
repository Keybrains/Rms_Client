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

  const [submitLoader, setSubmitLoader] = useState(false);

  async function handleSubmit(values) {
    setSubmitLoader(true);
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
        console.log(res.data, "shivam")
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
      <AddPropertyTypeHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {id ? "Edit Property Type" : "New Property Type"}
                    </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={propertyFormik.handleSubmit}>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Property Type *
                          </label>
                          <br />
                          <br />
                          <Dropdown isOpen={prodropdownOpen} toggle={toggle}>
                            <DropdownToggle caret>
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
                  <hr className="my-4" />
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Property Sub Type *
                          </label>
                          <br />
                          <br />
                          <Input
                            className="form-control-alternative"
                            id="input-protype"
                            placeholder="Townhome"
                            type="text"
                            name="propertysub_type"
                            onBlur={propertyFormik.handleBlur}
                            onChange={propertyFormik.handleChange}
                            value={propertyFormik.values.propertysub_type.trim()}
                            required
                          />
                          <br></br>
                          <Checkbox
                            onChange={handleChangecheck}
                            checked={isMultiUnit}
                            style={{ marginRight: "10px" }}
                          />
                          <label className="form-control-label">
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
                        className="btn btn-primary ml-4"
                        style={{ background: "green", color: "white" }}
                        disabled
                      >
                        Loading...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="btn btn-primary ml-4"
                        style={{ background: "green", color: "white" }}
                      >
                        {id ? "Update Property Type" : "Add Property Type"}
                      </Button>
                    )}
                    <Button
                      color="primary"
                      className="btn btn-primary"
                      onClick={handleCloseButtonClick}
                      size="sm"
                      style={{ background: "white", color: "black" }}
                    >
                      Cancel
                    </Button>
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
