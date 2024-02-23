import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useFormik } from "formik";
import Checkbox from "@mui/material/Checkbox";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
function CreditCardForm(props) {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { tenantId, closeModal, getCreditCard } = props;
  const { id, admin } = useParams();
  const [isMultiUnit, setIsMultiUnit] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState("");

  const paymentSchema = yup.object({
    card_number: yup
      .number()
      .required("Required")
      .typeError("Must be a number")
      .test(
        "is-size-16",
        "Card Number must be 16 digits",
        (val) => val?.toString().length === 16
      ),
    exp_date: yup
      .string()
      .matches(/^(0[1-9]|1[0-2])\/[0-9]{4}$/, "Invalid date format (MM/YYYY)")
      .required("Required"),
  });

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
      closeModal();
    },
  });
  const handlePropertySelection = (value) => {
    setSelectedProperty(value);
    localStorage.setItem("property", value);
  };
  const toggle = () => setproDropdownOpen((prevState) => !prevState);
  const [prodropdownOpen, setproDropdownOpen] = useState(false);

  const handleChangecheck = (e) => {
    setIsMultiUnit(e.target.checked);
  };

  const [propertyType, setpropertyType] = useState(null);
  const handleCloseButtonClick = () => {
    navigate("../rentals");
  };
  const navigate = useNavigate();

  async function handleSubmit(values) {
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
    }
  }
  const [accessType, setAccessType] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
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
        // onClose: () => navigate(`/${admin}/PropertyType`),
      });
    } else {
      // Show an error toast
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 1000,
      });
    }
  }
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
  return (
    <div>
      <Formik
        initialValues={{ card_number: "", exp_date: "" }}
        validationSchema={paymentSchema}
        onSubmit={(values, { resetForm  }) => {
          if (paymentSchema.isValid) {
            handleSubmit(values);
            resetForm();
          }
        }}
      >
        <Form onSubmit={propertyFormik.handleSubmit}>
          <Row className="mb-3">
            <Col xs="12" sm="12">
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
                        {propertyFormik.values.property_type || "Property Type"}
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
                        <div style={{ color: "red", marginBottom: "10px" }}>
                          {propertyFormik.errors.property_type}
                        </div>
                      ) : null}
                    </Dropdown>
                  </FormGroup>
                </Col>
              </Row>

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
                    <label className="form-control-label">Multi unit</label>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Button
              type="submit"
              className="btn btn-primary ml-4"
              style={{ background: "green", color: "white" }}
            >
              {id ? "Update Property Type" : "Add Property Type"}
            </Button>
          </Row>
        </Form>
      </Formik>
      <ToastContainer />
    </div>
  );
}

export default CreditCardForm;
