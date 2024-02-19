import { React, useEffect, useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  Grid,
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

const AddPlanForm = () => {
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

  const addInputField = () => {
    setInputFields([
      ...inputFields,
      {
        features: "",
      },
    ]);
  };
  const removeInputFields = (index) => {
    const rows = [...inputFields];
    rows.splice(index, 1);
    setInputFields(rows);
  };
  const handleFeaturesChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const list = [...inputFields];
    list[index][name] = value;
    setInputFields(list);
  };
  const [showBillingPeriods, setShowBillingPeriods] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (values) => {
    setLoader(true);
    try {
      values["features"] = inputFields;
      const res = await axios.post(`${baseUrl}/plans/plans`, values);
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
          <Col className="text-right" >
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
                <h3 className="mb-0">Add Plan </h3>
              </CardHeader>
              <div className="table-responsive">
                <div className="m-3">
                  <Formik
                    initialValues={{
                      plan_name: "",
                      plan_price: "",
                      billing_interval: "",
                      plan_days: "",
                      day_of_month: "",
                      billingOption: "",
                      plan_periods: "",
                      earlyCancellationFee: false,
                      changePlan: false,
                      cancelMembership: false,
                      pauseMembership: false,
                    }}
                    validationSchema={Yup.object().shape({
                      plan_name: Yup.string().required("Required"),
                      plan_price: Yup.number().required("Required"),
                    })}
                    onSubmit={(values, { resetForm }) => {
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
                            placeholder="Add Plan *"
                            label="Plan Name*"
                            name="plan_name"
                            value={values.plan_name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={touched.plan_name && !!errors.plan_name}
                            helperText={touched.plan_name && errors.plan_name}
                          />
                        </div>
                        <div className="mb-3 col-lg-8 col-md-12">
                          <TextField
                            type="number"
                            size="small"
                            fullWidth
                            placeholder="Add Price *"
                            label="Cost Per Billing Cycle *"
                            name="plan_price"
                            value={values.plan_price}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={touched.plan_price && !!errors.plan_price}
                            helperText={touched.plan_price && errors.plan_price}
                          />
                        </div>
                        <div className="mb-3 col-lg-8 col-md-12">
                          <FormControl fullWidth>
                            <InputLabel size="small">
                              Plan Billing Interval
                            </InputLabel>
                            <Select
                              size="small"
                              label="Select Billing-Interval"
                              name="billing_interval"
                              value={values.billing_interval}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              MenuProps={{
                                style: {
                                  maxHeight: 210,
                                },
                              }}
                            >
                              <MenuItem value={"Monthly"}>Monthly</MenuItem>
                              <MenuItem value={"Annual"}>Annual</MenuItem>
                            </Select>
                            {touched.billing_interval &&
                            errors.billing_interval ? (
                              <div className="text-danger">
                                {errors.billing_interval}
                              </div>
                            ) : null}
                          </FormControl>
                        </div>

                        {values.billing_interval === "Annual" ? (
                          <div className="mt-3 mb-3 mx-0 col-lg-8">
                            <TextField
                              type="number"
                              size="small"
                              fullWidth
                              placeholder="Annual Discount *"
                              label="Annual Discount *"
                              name="annual_discount"
                              value={values.annual_discount}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            {touched.annual_discount && errors.annual_discount ? (
                              <div className="text-danger">
                                {errors.annual_discount}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        {values.billing_interval === "Monthly" ? (
                          <div className="mt-3 mb-3 mx-0 col-lg-8">
                            <FormControl fullWidth>
                              <InputLabel size="small">
                                Charge on Day of Month *
                              </InputLabel>
                              <Select
                                size="small"
                                fullWidth
                                label="Charge on Day of Month *"
                                name="day_of_month"
                                value={values.day_of_month}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                MenuProps={{
                                  style: {
                                    maxHeight: 250,
                                  },
                                }}
                              >
                                {[...Array(28).keys()].map((day) => (
                                  <MenuItem key={day + 1} value={day + 1}>
                                    {day + 1}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        ) : null}
                        <div className="mb-3 col-8">
                          <FormLabel component="legend">
                            Add Features:
                          </FormLabel>
                          {inputFields.map((data, index) => {
                            const { features } = data;
                            return (
                              <div className="row" key={index}>
                                <div className="col">
                                  <div className="form-group">
                                    <TextField
                                      type="text"
                                      size="small"
                                      fullWidth
                                      onChange={(evnt) =>
                                        handleFeaturesChange(index, evnt)
                                      }
                                      value={features}
                                      name="features"
                                      className="form-control"
                                      placeholder="Features"
                                    />
                                  </div>
                                </div>
                                <div className="">
                                  {inputFields.length !== 1 ? (
                                    <div
                                      className="mt-2"
                                      style={{ cursor: "pointer" }}
                                      onClick={removeInputFields}
                                    >
                                      ✖️
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          <div className="row">
                            <div className="col-sm-12">
                              <div
                                className="btn btn-outline-primary"
                                sm
                                onClick={() => addInputField()}
                              >
                                Add New
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="mb-3 mx-3">
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Set how many times you wish to charge the
                              customer?
                            </FormLabel>
                            <RadioGroup
                              aria-label="billingOption"
                              name="billingOption"
                              value={values.billingOption}
                              onChange={handleChange}
                            >
                              <FormControlLabel
                                value="autoRenew"
                                control={<Radio />}
                                onChange={() => setShowBillingPeriods(true)}
                                label={
                                  <span style={{ fontSize: "0.8rem" }}>
                                    Auto renew plan after term expires
                                  </span>
                                }
                              />
                              <FormControlLabel
                                value="chargeUntilTerm"
                                control={<Radio />}
                                label={
                                  <span style={{ fontSize: "0.8rem" }}>
                                    Charge customers until their term commitment
                                    expires
                                  </span>
                                }
                                onChange={() => setShowBillingPeriods(false)}
                              />
                              <FormControlLabel
                                value="chargeUntilCancellation"
                                control={<Radio />}
                                onChange={() => setShowBillingPeriods(false)}
                                label={
                                  <span style={{ fontSize: "0.8rem" }}>
                                    Charge customers until cancellation, no term
                                    commitment
                                  </span>
                                }
                              />
                            </RadioGroup>
                          </FormControl>
                        </div> */}
                        {/* {showBillingPeriods && (
                          <div className="mb-3 col-lg-8">
                            <TextField
                              type="number"
                              size="small"
                              fullWidth
                              placeholder="Add Number *"
                              label="Number of Billing Periods *"
                              name="plan_periods"
                              value={values.plan_periods}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            {touched.plan_periods && errors.plan_periods && (
                              <div className="text-danger">
                                {errors.plan_periods}
                              </div>
                            )}
                          </div>
                        )} */}
                        {/* <div className="mb-3 mx-3">
                          <FormLabel component="legend">
                            Additional Options:
                          </FormLabel>
                          <div className="mb-2">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.earlyCancellationFee}
                                  onChange={handleChange}
                                  name="earlyCancellationFee"
                                />
                              }
                              label={
                                <span style={{ fontSize: "0.8rem" }}>
                                  Set early membership cancellation fee
                                </span>
                              }
                            />
                          </div>
                          <div className="mb-2">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.changePlan}
                                  onChange={handleChange}
                                  name="changePlan"
                                />
                              }
                              label={
                                <span style={{ fontSize: "0.8rem" }}>
                                  Allow member to change plan
                                </span>
                              }
                            />
                          </div>
                          <div className="mb-2">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.cancelMembership}
                                  onChange={handleChange}
                                  name="cancelMembership"
                                />
                              }
                              label={
                                <span style={{ fontSize: "0.8rem" }}>
                                  Allow member to cancel billing/membership
                                </span>
                              }
                            />
                          </div>
                          <div className="mb-2">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.pauseMembership}
                                  onChange={handleChange}
                                  name="pauseMembership"
                                />
                              }
                              label={
                                <span style={{ fontSize: "0.8rem" }}>
                                  Allow member to pause billing/membership
                                </span>
                              }
                            />
                          </div>
                        </div> */}
                        <div className="mb-3 mx-2">
                          <Button
                            className="mt-3"
                            type="submit"
                            variant="success"
                            disabled={loader}
                          >
                            {loader ? "Loading..." : "Add Plan"}
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

export default AddPlanForm;
