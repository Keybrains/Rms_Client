import { React, useEffect, useState } from "react";
import { withStyles } from "@mui/styles";

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
import { Button, ToggleButton } from "react-bootstrap";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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
import CheckIcon from "@mui/icons-material/Check";
import Switch from "@mui/material/Switch";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AddPlanForm = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [accessType, setAccessType] = useState();
  const [isPropertyCount, setPropertyCount] = useState(false);
  const [isTenantCount, setTenantCount] = useState(false);
  const [isLeaseCount, setLeaseCount] = useState(false);
  const [isRentalOwnerCount, setRentalOwnerCount] = useState(false);
  const [isApplicantCount, setApplicantCount] = useState(false);
  const [isVendorCount, setVendorCount] = useState(false);
  const [isStaffCount, setStaffCount] = useState(false);
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

  const CustomSwitch = withStyles({
    switchBase: {
      color: "#ffffff", // Change the color to the desired color when unchecked
      "&$checked": {
        color: "#152B51", // Change the color to white when the Switch is checked
      },
      "&$checked + $track": {
        backgroundColor: "#152B51", // Change the track color when the Switch is checked
      },
    },
    checked: {},
    track: {},
  })(Switch);

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
  const onChangePropertyToggle = (e) => {
    if (e.target.checked) {
      setPropertyCount(true);
    } else {
      setPropertyCount(false);
    }
  };
  const onChangeTenantToggle = (e) => {
    if (e.target.checked) {
      setTenantCount(true);
    } else {
      setTenantCount(false);
    }
  };

  const onChangeLeaseToggle = (e) => {
    if (e.target.checked) {
      setLeaseCount(true);
    } else {
      setLeaseCount(false);
    }
  };

  const onChangeRentalOwnerToggle = (e) => {
    if (e.target.checked) {
      setRentalOwnerCount(true);
    } else {
      setRentalOwnerCount(false);
    }
  };

  const onChangeApplicantToggle = (e) => {
    if (e.target.checked) {
      setApplicantCount(true);
    } else {
      setApplicantCount(false);
    }
  };

  const onChangeVendorToggle = (e) => {
    if (e.target.checked) {
      setVendorCount(true);
    } else {
      setVendorCount(false);
    }
  };

  const onChangeStaffToggle = (e) => {
    if (e.target.checked) {
      setStaffCount(true);
    } else {
      setStaffCount(false);
    }
  };

  const handleFeaturesChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const list = [...inputFields];
    list[index][name] = value;
    setInputFields(list);
  };

  const [loader, setLoader] = useState(false);

  const handleSubmit = async (values) => {
    setLoader(true);
    try {
      values["features"] = inputFields;

      if (!id) {
        var res = await axios.post(`${baseUrl}/plans/plans`, values);
        if (res.data.statusCode === 200 && values.plan_name !== "Free Plan") {
          const nmiResponse = await axios.post(
            `${baseUrl}/nmipayment/add-plan`,
            {
              admin_id : accessType?.admin_id,
              planPayments: values.plan_payments || "0",
              planAmount: values.plan_price,
              planName: values.plan_name,
              planId: res.data.data.plan_id,
              day_of_month: values.day_of_month,
              month_frequency: values.billing_interval,
            }
          );

          toast.success(res.data?.message, {
            position: "top-center",
            autoClose: 1000,
          });
          navigate("/superadmin/plans");
        } else if (values.plan_name === "Free Plan") {
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
      } else if (id) {
        res = await axios.put(`${baseUrl}/plans/plans/${id}`, values);
        if (res.data.statusCode === 200 && values.plan_name !== "Free Plan") {
          const nmiResponse = await axios.post(
            `${baseUrl}/nmipayment/edit-plan`,
            {
              admin_id : accessType?.admin_id,
              planPayments: values.plan_payments || "0",
              planAmount: values.plan_price,
              planName: values.plan_name,
              planId: id,
              day_of_month: values.day_of_month,
              month_frequency: values.billing_interval,
            }
          );

          toast.success(res.data?.message, {
            position: "top-center",
            autoClose: 1000,
          });
          navigate("/superadmin/plans");
        } else if (values.plan_name === "Free Plan") {
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
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error, {
        position: "top-center",
        autoClose: 1000,
      });
    } finally {
      setLoader(false);
      getPlan();
    }
  };

  const [plan, setPlan] = useState({});
  const getPlan = async () => {
    if (id) {
      try {
        const newResponse = await axios.get(`${baseUrl}/plans/plan_get/${id}`);
        setPlan(newResponse.data.data[0]);
        setPropertyCount(true);
        setTenantCount(true);
        setLeaseCount(true);
        setRentalOwnerCount(true);
        setApplicantCount(true);
        setVendorCount(true);
        setStaffCount(true);
        setInputFields(newResponse.data.data[0].features);
      } catch (error) {
        console.error("Error: ", error.message);
      }
    }
  };

  useEffect(() => {
    getPlan();
  }, [id]);

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <SuperAdminHeader />
      <Container className="mt-5 mx-3" fluid style={{width: "95%"}}>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}></h1>
              <h4 style={{ color: "white" }}></h4>
            </FormGroup>
          </Col>
          <Col className="text-right">
            <Button
              className="text-capitalize"
              size="small"
              onClick={() => navigate("/superadmin/plans")}
              style={{
                backgroundColor: "#152B51",
                color: "#ffffff",
                fontFamily: "Poppins",
                fontWeight: "500",
                fontSize: "18px",
                boxShadow: " 0px 4px 4px 0px #00000040 ",
              }}
            >
              Back
            </Button>
          </Col>
        </Row>

        <CardHeader
          className=" mt-3 mb-3"
          style={{
            backgroundColor: "#152B51",
            borderRadius: "10px",
            boxShadow: " 0px 4px 4px 0px #00000040 ",
          }}
        >
          <h3
            className="mb-0"
            style={{
              color: "#ffffff",
              fontFamily: "Poppins",
              fontWeight: "500",
              fontSize: "18px",
            }}
          >
            {!id ? "Add Plan " : "Edit Plan "}
          </h3>
        </CardHeader>
        <Row>
          <div className="col">
            <Card
              className="shadow"
              style={{
                border: "1px Solid #324567",
                boxShadow: " 0px 4px 4px 0px #00000040 ",
              }}
            >
              <div className="table-responsive">
                <div className="m-3">
                  {(id && plan && Object.keys(plan).length > 0) || !id ? (
                    <Formik
                      initialValues={{
                        plan_name: plan.plan_name || "",
                        plan_price: plan.plan_price || "",
                        billing_interval: plan.billing_interval || "",
                        plan_days: plan.plan_days || "",
                        day_of_month: plan.day_of_month || "",
                        billingOption: plan.billingOption || "",
                        plan_periods: plan.plan_periods || "",
                        earlyCancellationFee:
                          plan.earlyCancellationFee || false,
                        changePlan: plan.changePlan || false,
                        cancelMembership: plan.cancelMembership || false,
                        pauseMembership: plan.pauseMembership || false,
                        annual_discount: plan.annual_discount || "",
                        property_count: plan.property_count || "",
                        tenant_count: plan.tenant_count || "",
                        lease_count: plan.lease_count || "",
                        rentalowner_count: plan.rentalowner_count || "",
                        applicant_count: plan.applicant_count || "",
                        vendor_count: plan.vendor_count || "",
                        staffmember_count: plan.staffmember_count || "",
                        isPropertyCount: !!plan.property_count || "",
                        isTenantCount: !!plan.tenant_count || "",
                        isLeaseCount: !!plan.lease_count || "",
                        isRentalOwnerCount: !!plan.rentalowner_count || "",
                        isApplicantCount: !!plan.applicant_count || "",
                        isVendorCount: !!plan.vendor_count || "",
                        isStaffCount: !!plan.staffmember_count || "",
                        payment_functionality:
                          plan.payment_functionality || false,
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
                              placeholder="Enter plan name here...*"
                              label="Plan Name*"
                              name="plan_name"
                              value={values.plan_name}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              error={touched.plan_name && !!errors.plan_name}
                              helperText={touched.plan_name && errors.plan_name}
                              style={{ color: "#152B51" }}
                            />
                          </div>
                          <div className="mb-3 col-lg-8 col-md-12">
                            <TextField
                              type="number"
                              size="small"
                              fullWidth
                              placeholder="Enter cost per billing cycle here...*"
                              label="Cost Per Billing Cycle *"
                              name="plan_price"
                              value={values.plan_price}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              error={touched.plan_price && !!errors.plan_price}
                              helperText={
                                touched.plan_price && errors.plan_price
                              }
                              style={{ color: "#152B51" }}
                            />
                          </div>
                          <div className="mb-3 col-lg-8 col-md-12">
                            <FormControl fullWidth style={{ color: "#152B51" }}>
                              <InputLabel
                                size="small"
                                style={{ color: "#152B51" }}
                              >
                                Plan Billing Interval
                              </InputLabel>
                              <Select
                                size="small"
                                label="Select Billing-Interval"
                                name="billing_interval"
                                // color="success"
                                value={values.billing_interval}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                MenuProps={{
                                  style: {
                                    maxHeight: 250,
                                  },
                                }}
                                style={{ color: "#152B51" }}
                              >
                                <MenuItem
                                  style={{
                                    color: "#152B51",
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                  value={"1"}
                                >
                                  1
                                </MenuItem>
                                <MenuItem
                                  style={{
                                    color: "#152B51",
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                  value={"2"}
                                >
                                  2
                                </MenuItem>
                                <MenuItem
                                  style={{
                                    color: "#152B51",
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                  value={"3 (Quarterly)"}
                                >
                                  3 (Quarterly)
                                </MenuItem>
                                <MenuItem
                                  style={{
                                    color: "#152B51",
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                  value={"4"}
                                >
                                  4
                                </MenuItem>
                                <MenuItem
                                  style={{
                                    color: "#152B51",
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                  value={"5"}
                                >
                                  5
                                </MenuItem>
                                <MenuItem
                                  style={{
                                    color: "#152B51",
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                  value={"6 (Bi-Annually)"}
                                >
                                  6 (Bi-Annually)
                                </MenuItem>
                                <MenuItem
                                  style={{
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                  value={"7"}
                                >
                                  7
                                </MenuItem>
                                <MenuItem
                                  style={{
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                  value={"8"}
                                >
                                  8
                                </MenuItem>
                                <MenuItem
                                  style={{
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                  value={"9"}
                                >
                                  9
                                </MenuItem>
                                <MenuItem
                                  style={{
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                  value={"10"}
                                >
                                  10
                                </MenuItem>
                                <MenuItem
                                  style={{
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                  value={"11"}
                                >
                                  11
                                </MenuItem>
                                <MenuItem
                                  style={{
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                  value={"12 (Annually)"}
                                >
                                  12 (Annually)
                                </MenuItem>
                              </Select>
                              {touched.billing_interval &&
                              errors.billing_interval ? (
                                <div className="text-danger">
                                  {errors.billing_interval}
                                </div>
                              ) : null}
                            </FormControl>
                          </div>
                          {values.billing_interval === "12 (Annually)" ? (
                            <div className="mb-3 col-lg-8 col-md-12">
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
                              {touched.annual_discount &&
                              errors.annual_discount ? (
                                <div className="text-danger">
                                  {errors.annual_discount}
                                </div>
                              ) : null}
                            </div>
                          ) : null}

                          {values.billing_interval ? (
                            <div className="mb-3 col-lg-8 col-md-12">
                              <FormControl fullWidth>
                                <InputLabel size="small" color="success">
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
                                  style={{ color: "#152B51" }}
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
                          <div className="row ml-1">
                            <div className="mb-3 col-lg-4 col-md-6 d-flex">
                              <div style={{ width: "170px" }}>
                                <FormLabel component={"legend"}>
                                  <CustomSwitch
                                    checked={values.isPropertyCount}
                                    onChange={(e) => {
                                      onChangePropertyToggle(e);
                                      values.isPropertyCount =
                                        !values.isPropertyCount;
                                    }}
                                    name="property"
                                  />
                                  Property
                                </FormLabel>
                              </div>
                              <div>
                                <TextField
                                  type="text"
                                  name="property_count"
                                  value={values.property_count}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  onInput={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );
                                    e.target.value = numericValue;
                                  }}
                                  size="small"
                                  sx={
                                    isPropertyCount === true
                                      ? {
                                          display: "block",
                                          width: "100px",
                                        }
                                      : { display: "none" }
                                  }
                                  placeholder="Count"
                                />
                              </div>
                            </div>
                            <div className="mb-3 col-lg-4 col-md-6 d-flex">
                              <div style={{ width: "170px" }}>
                                <FormLabel component={"legend"}>
                                  <CustomSwitch
                                    checked={values.isTenantCount}
                                    onChange={(e) => {
                                      onChangeTenantToggle(e);
                                      values.isTenantCount =
                                        !values.isTenantCount;
                                    }}
                                    name="property"
                                  />
                                  Tenant
                                </FormLabel>
                              </div>
                              <div>
                                <TextField
                                  type="text"
                                  name="tenant_count"
                                  value={values.tenant_count}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  onInput={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );
                                    e.target.value = numericValue;
                                  }}
                                  size="small"
                                  sx={
                                    isTenantCount === true
                                      ? {
                                          display: "block",
                                          width: "100px",
                                        }
                                      : { display: "none" }
                                  }
                                  placeholder="Count"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row ml-1">
                            <div className="mb-3 col-lg-4 col-md-6 d-flex">
                              <div style={{ width: "170px" }}>
                                <FormLabel component={"legend"}>
                                  <CustomSwitch
                                    checked={values.isLeaseCount}
                                    onChange={(e) => {
                                      onChangeLeaseToggle(e);
                                      values.isLeaseCount =
                                        !values.isLeaseCount;
                                    }}
                                    name="property"
                                  />
                                  Lease
                                </FormLabel>
                              </div>
                              <div>
                                <TextField
                                  name="lease_count"
                                  type="text"
                                  value={values.lease_count}
                                  onBlur={(e) => {
                                    handleBlur(e);
                                  }}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  onInput={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );
                                    e.target.value = numericValue;
                                  }}
                                  size="small"
                                  sx={
                                    isLeaseCount === true
                                      ? {
                                          display: "block",
                                          width: "100px",
                                        }
                                      : { display: "none" }
                                  }
                                  placeholder="Count"
                                />
                              </div>
                            </div>
                            <div className="mb-3 col-lg-4 col-md-6 d-flex">
                              <div style={{ width: "170px" }}>
                                <FormLabel component={"legend"}>
                                  <CustomSwitch
                                    checked={values.isRentalOwnerCount}
                                    onChange={(e) => {
                                      onChangeRentalOwnerToggle(e);
                                      values.isRentalOwnerCount =
                                        !values.isRentalOwnerCount;
                                    }}
                                    name="property"
                                  />
                                  Rental Owner
                                </FormLabel>
                              </div>
                              <div>
                                <TextField
                                  name="rentalowner_count"
                                  type="text"
                                  value={values.rentalowner_count}
                                  onBlur={(e) => {
                                    handleBlur(e);
                                  }}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  onInput={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );
                                    e.target.value = numericValue;
                                  }}
                                  size="small"
                                  sx={
                                    isRentalOwnerCount === true
                                      ? {
                                          display: "block",
                                          width: "100px",
                                        }
                                      : { display: "none" }
                                  }
                                  placeholder="Count"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row ml-1">
                            <div className="mb-3 col-lg-4 col-md-6 d-flex">
                              <div style={{ width: "170px" }}>
                                <FormLabel component={"legend"}>
                                  <CustomSwitch
                                    checked={values.isApplicantCount}
                                    onChange={(e) => {
                                      onChangeApplicantToggle(e);
                                      values.isApplicantCount =
                                        !values.isApplicantCount;
                                    }}
                                    name="property"
                                  />
                                  Applicant
                                </FormLabel>
                              </div>
                              <div>
                                <TextField
                                  size="small"
                                  type="text"
                                  name="applicant_count"
                                  value={values.applicant_count}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  onBlur={handleBlur}
                                  onInput={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );
                                    e.target.value = numericValue;
                                  }}
                                  sx={
                                    isApplicantCount === true
                                      ? {
                                          display: "block",
                                          width: "100px",
                                        }
                                      : { display: "none" }
                                  }
                                  placeholder="Count"
                                />
                              </div>
                            </div>
                            <div className="mb-3 col-lg-4 col-md-6 d-flex">
                              <div style={{ width: "170px" }}>
                                <FormLabel component={"legend"}>
                                  <CustomSwitch
                                    checked={values.isStaffCount}
                                    onChange={(e) => {
                                      onChangeStaffToggle(e);
                                      values.isStaffCount =
                                        !values.isStaffCount;
                                    }}
                                    name="property"
                                  />
                                  Staff
                                </FormLabel>
                              </div>
                              <div>
                                <TextField
                                  name="staffmember_count"
                                  type="text"
                                  value={values.staffmember_count}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  onInput={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );
                                    e.target.value = numericValue;
                                  }}
                                  size="small"
                                  sx={
                                    isStaffCount === true
                                      ? {
                                          display: "block",
                                          width: "100px",
                                        }
                                      : { display: "none" }
                                  }
                                  placeholder="Count"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row ml-1">
                            <div className="mb-3 col-lg-4 col-md-6 d-flex">
                              <div style={{ width: "170px" }}>
                                <FormLabel component={"legend"}>
                                  <CustomSwitch
                                    checked={values.isVendorCount}
                                    onChange={(e) => {
                                      onChangeVendorToggle(e);
                                      values.isVendorCount =
                                        !values.isVendorCount;
                                    }}
                                    name="property"
                                  />
                                  Vendor
                                </FormLabel>
                              </div>
                              <div>
                                <TextField
                                  size="small"
                                  type="text"
                                  name="vendor_count"
                                  value={values.vendor_count}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  onBlur={handleBlur}
                                  onInput={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );
                                    e.target.value = numericValue;
                                  }}
                                  sx={
                                    isVendorCount === true
                                      ? {
                                          display: "block",
                                          width: "100px",
                                        }
                                      : { display: "none" }
                                  }
                                  placeholder="Count"
                                />
                              </div>
                            </div>
                            <div className="mb-3 col-lg-4 col-md-6 d-flex">
                              <FormLabel component={"legend"}>
                                <CustomSwitch
                                  name="payment_functionality"
                                  value={values.payment_functionality}
                                  checked={values.payment_functionality}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                />
                                Payment
                              </FormLabel>
                            </div>
                          </div>

                          <div className="mb-3 col-8">
                            <FormLabel
                              component="legend"
                              style={{
                                fontFamily: "Poppins",
                                fontWeight: "500",
                                fontSize: "14px",
                                color: "#152B51",
                              }}
                            >
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
                                        placeholder="Enter features here..."
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
                                  className="btn"
                                  style={{
                                    color: "#152B51",
                                    border: "1px solid #152B51",
                                    borderRadius: "6px",
                                    fontFamily: "Poppins",
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    padding: "6px 12px",
                                    lineHeight: "1.5",
                                    backgroundColor: "transparent",
                                  }}
                                  onClick={() => addInputField()}
                                >
                                  Add New
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mb-3 mx-2">
                            <Button
                              className="mt-3"
                              type="submit"
                              disabled={loader}
                              style={{
                                backgroundColor: "#152B51",
                                color: "#fff",
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: "400",
                              }}
                            >
                              {loader
                                ? "Loading..."
                                : !id
                                ? "Add Plan"
                                : "Edit Plan"}
                            </Button>
                            <Button
                              className="mt-3"
                              type=""
                              variant=""
                              onClick={() => navigate("/superadmin/plans")}
                              style={{
                                color: "#152B51",
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: "400",
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  ) : (
                    ""
                  )}
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
