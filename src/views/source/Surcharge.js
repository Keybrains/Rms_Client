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
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkbox from "@mui/material/Checkbox";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

import SurchargeHeader from "components/Headers/SurchargeHeader";

function Surcharge() {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { surcharge_id, admin } = useParams();
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

  const surchargeFormik = useFormik({
    initialValues: {
      surcharge_percent: "",
    },
    validationSchema: yup.object({
      surcharge_percent: yup.number().required("Required"),
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
    if (surcharge_id) {
      axios
        .get(`${baseUrl}/surcharge/surcharge/get/${surcharge_id}`)
        .then((response) => {
          const propertyData = response.data.data[0];
          setpropertyType(propertyType);

          setSelectedProperty(propertyData.property_type || "Select");

          surchargeFormik.setValues({
            surcharge_percent: propertyData.surcharge_percent || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching property type data:", error);
        });
    }
  }, [surcharge_id]);

  async function handleSubmit(values) {
    try {
      const object = {
        admin_id: accessType?.admin_id,
        surcharge_percent: surchargeFormik.values.surcharge_percent,
      };

      if (surcharge_id === undefined) {
        const res = await axios.post(`${baseUrl}/surcharge/surcharge`, object);
        if (res.data.statusCode === 200) {
          handleResponse(res);
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

  function handleResponse(response) {
    const successMessage = surcharge_id
      ? "Property Type updated successfully"
      : "Property Type added successfully";
    const errorMessage = response.data.message;

    if (response.data.statusCode === 200) {
      // Show success toast
      toast.success(successMessage, {
        position: "top-center",
        autoClose: 1000,
        onClose: () => navigate(`/${admin}/surcharge`),
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
    navigate("../surcharge");
  };
  return (
    <>
      <SurchargeHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {surcharge_id ? "Edit Surcharge" : "New Surcharge"}
                    </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={surchargeFormik.handleSubmit}>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Surcharge *
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
                            value={surchargeFormik.values.surcharge_percent}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>
                  <Row>
                    <Button
                      type="submit"
                      className="btn btn-primary ml-4"
                      style={{ background: "green", color: "white" }}
                    >
                      {surcharge_id ? "Update Surcharge" : "Add Surcharge"}
                    </Button>
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
}

export default Surcharge;
