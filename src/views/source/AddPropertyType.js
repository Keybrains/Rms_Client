import React from "react";
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
  Label,
} from "reactstrap";

import {
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useState } from "react";
import AddPropertyTypeHeader from "components/Headers/AddPropertyTypeHeader.js";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Checkbox from "@mui/material/Checkbox";

const AddPropertyType = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id , admin} = useParams();
  const [prodropdownOpen, setproDropdownOpen] = React.useState(false);
  const [isMultiUnit, setIsMultiUnit] = React.useState(false);

  const [selectedProperty, setSelectedProperty] = React.useState("");

  const toggle = () => setproDropdownOpen((prevState) => !prevState);

  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    navigate("../PropertyType");
  };

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
      //console.log(values, "values");
    },
  });

  const [propertyType, setpropertyType] = useState(null);

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

  React.useEffect(() => {
    if (id) {
      axios
        .get(`${baseUrl}/propertytype/property/type/${id}`)
        .then((response) => {
          const propertyData = response.data.data[0];
          setpropertyType(propertyType);
          setIsMultiUnit(propertyData.is_multiunit);
          // console.log(propertyData);

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

  async function handleSubmit(values) {
    try {
      // Include isMultiUnit in the values to be sent to the server
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
        if (res.data.statusCode === 200) {
          handleResponse(res);
        } else if (res.data.statusCode === 201) {
          swal("error", res.data.message, "error");
        }
      } else {
        const editUrl = `${baseUrl}/propertytype/property_type/${id}`;
        const res = await axios.put(editUrl, object);
        if (res.data.statusCode === 200) {
          handleResponse(res);
        } else if (res.data.statusCode === 400) {
          swal("error", res.data.message, "error");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
      // Handle the error and display an error message to the user if necessary.
    }
  }
  function handleResponse(response) {
    if (response.data.statusCode === 200) {
      navigate("/"+admin+"/PropertyType");
      swal(
        "Success!",
        id
          ? "Property Type updated successfully"
          : "Property Type added successfully!",
        "success"
      );
    } else {
      alert(response.data.message);
    }
  }
  return (
    <>
      <AddPropertyTypeHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card
              className="bg-secondary shadow"
              onSubmit={propertyFormik.handleSubmit}
            >
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
                <Form>
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
                    <button
                      type="submit"
                      className="btn btn-primary ml-4"
                      style={{ background: "green" }}
                      // onClick={handleCloseButtonClick}
                    >
                      {id ? "Update Property Type" : "Add Property Type"}
                    </button>
                    <button
                      color="primary"
                      //  href="#rms"
                      className="btn btn-primary"
                      onClick={handleCloseButtonClick}
                      size="sm"
                      style={{ background: "white", color: "black" }}
                    >
                      Cancel
                    </button>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddPropertyType;
