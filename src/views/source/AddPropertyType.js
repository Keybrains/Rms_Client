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
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";
import Checkbox from "@mui/material/Checkbox";

const AddPropertyType = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [prodropdownOpen, setproDropdownOpen] = React.useState(false);
  const [isMultiUnit, setIsMultiUnit] = React.useState(false);

  const [selectedProperty, setSelectedProperty] = React.useState("");
  // //console.log(selectedProperty, "selectedProperty")

  const toggle = () => setproDropdownOpen((prevState) => !prevState);

  const [open, setOpen] = React.useState(false);

  // const handlePropSelection = (value) => {
  //   setSelectedProp(value);
  //   setproDropdownOpen(true);
  // };

  // const handleClickOpen = () => {
  //     setOpen(true);
  //   };
  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    // Use history.push to navigate to the PropertiesTable page
    navigate("../PropertyType");
  };

  const handleChangecheck = (e) => {
    setIsMultiUnit(e.target.checked);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    // setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // const handlePropertySelection = (values) => {
  //   setSelectedProperty(values);
  //   //console.log(`Selected Property: ${values}`);
  // };

  const handlePropertySelection = (value) => {
    setSelectedProperty(value);
    localStorage.setItem("property", value);
    //console.log(`Selected Property: ${value}`);
  };

  // let [editData, setEditData] = React.useState({});
  // let [id, setId] = React.useState();

  // //   auto form fill up in edit
  // let seletedEditData = async (datas) => {
  //   // setModalShowForPopupForm(true);
  //   setId(datas._id);
  //   setEditData(datas);
  // };

  //let navigate = useNavigate();
  // const handleSubmit = async (values) => {
  //   //console.log(values, "values");
  //   try {
  //     values["property_type"] = selectedProperty;
  //     const res = await axios.post(
  //       "https://propertymanager.cloudpress.host/api/newproparty/newproparty",
  //       values
  //     );

  //     if (res.data.statusCode === 200) {
  //       navigate("/admin/PropertyType");
  //       swal("Success!", "Property Type added successfully!", "success");
  //       //console.log(`Selected Property: ${values.property_type}`);

  //     } else {
  //       alert(res.data.message);
  //     }
  //   } catch (error) {
  //     //console.log("Error", error);
  //   }
  // };

  const propertyFormik = useFormik({
    initialValues: {
      property_type: "",
      propertysub_type: "",
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
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  React.useEffect(() => {
    if (id) {
      axios
        .get(`${baseUrl}/newproparty/newproperty_summary/${id}`)
        .then((response) => {
          const propertyData = response.data.data;
          setpropertyType(propertyType);
          //console.log(propertyData);

          setSelectedProperty(propertyData.property_type || "Select");

          propertyFormik.setValues({
            property_type: propertyData.property_type || "",
            propertysub_type: propertyData.propertysub_type || "",

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
       values.ismultiunit = isMultiUnit;
      // values["property_type"] = selectedProperty;
      if (id === undefined) {
        const res = await axios.post(
          `${baseUrl}/newproparty/newproparty`,
          values
        );
        handleResponse(res);
      } else {
        const editUrl = `${baseUrl}/newproparty/proparty-type/${id}`;
        const res = await axios.put(editUrl, values);
        handleResponse(res);
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
    if (response.status === 200) {
      navigate("/admin/PropertyType");
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
                            value={propertyFormik.values.propertysub_type}
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
                    href="#rms"
                    className="btn btn-primary"
                    onClick={handleCloseButtonClick}
                    size="sm"
                    style={{ background: "white", color: "black" }}
                  >
                    Cancel
                  </button>
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
