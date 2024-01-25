import { useFormik } from "formik";
import moment from "moment";
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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
} from "reactstrap";
import * as yup from "yup";
import LeaseHeader from "components/Headers/LeaseHeader.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  ToggleButtonGroup,
  ToggleButton,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const Leaseing2 = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_URL;
  const { lease_id } = useParams();
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

  //dropdowns
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [leaseDropdownOpen, setLeaseDropdownOpen] = useState(false);

  //checkbox
  const [checkedCheckbox, setCheckedCheckbox] = useState(false);
  const [rentincdropdownOpen1, setRentincdropdownOpen1] = useState(false);
  const [rentincdropdownOpen2, setRentincdropdownOpen2] = useState(false);
  const [rentincdropdownOpen3, setRentincdropdownOpen3] = useState(false);
  const [rentincdropdownOpen4, setRentincdropdownOpen4] = useState(false);
  const [collapseper, setCollapseper] = useState(false);
  const [collapsecont, setCollapsecont] = useState(false);

  //selected variable dependancy
  const [selectedProperty, setselectedProperty] = useState("");
  const [selectedUnit, setselectedUnit] = useState("");
  const [selectedLeaseType, setSelectedLeaseType] = useState("");
  const [selectedOption, setSelectedOption] = useState("Tenant");
  const [searchQuery, setSearchQuery] = useState("");

  //get response variables
  const [propertyData, setPropertyData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  const [tenantData, setTenantData] = useState([]);
  const [selectedTenantData, setSelectedTenantData] = useState([]);
  const [cosignerData, setCosignerData] = useState([]);

  //display
  const [openTenantsDialog, setOpenTenantsDialog] = useState(false);
  const [showTenantTable, setShowTenantTable] = useState(false);
  const [display, setDisplay] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState("Tenant");

  // other isVariableStatement
  const [alignment, setAlignment] = useState("web");

  //toggles
  const toggle = () => setPropertyDropdownOpen((prevState) => !prevState);
  const toggle2 = () => setUnitDropdownOpen((prevState) => !prevState);
  const toggle3 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const toggle4 = () => {
    setCollapseper(!collapseper);
  };
  const toggle5 = () => {
    setCollapsecont(!collapsecont);
  };

  //formik for form
  const leaseFormin = useFormik({
    initialValues: {
      rental_id: "",
      unit_id: "",
      lease_type: "",
      start_date: "",
      end_date: "",
      uploaded_file: "",
    },
    validationSchema: yup.object({
      rental_id: yup.string().required("Required"),
      unit_id: yup.string().required("Required"),
      lease_type: yup.string().required("Required"),
      start_date: yup.string().required("Required"),
      end_date: yup.string().required("Required"),
      uploaded_file: yup.string().required("Required"),
    }),
  });

  const chargeFormin = useFormik({
    initialValues: {
      amount: "",
      memo: "",
      charge_type: "",
      account: "",
      date: "",
      is_paid: false,
      is_lateFee: false,
    },
    validationSchema: yup.object({
      amount: yup.number().required("Required"),
      account: yup.string().required("Required"),
      charge_type: yup.string().required("Required"),
    }),
  });

  const tenantFormik = useFormik({
    initialValues: {
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
      tenant_email: yup.string().required("Required"),
      tenant_password: yup
        .string()
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number, and one special case Character"
        )
        .required("Required"),
    }),
  });

  const cosignerFormik = useFormik({
    initialValues: {
      cosigner_firstName: "",
      cosigner_lastName: "",
      cosigner_phoneNumber: "",
      cosigner_alternativeNumber: "",
      cosigner_email: "",
      cosigner_alternativeEmail: "",
      cosigner_address: "",
      cosigner_city: "",
      cosigner_country: "",
      cosigner_postalcode: "",
    },
    validationSchema: yup.object({
      cosigner_firstName: yup.string().required("Required"),
      cosigner_lastName: yup.string().required("Required"),
      cosigner_phoneNumber: yup.number().required("Required"),
      cosigner_email: yup.string().required("Required"),
    }),
  });

  //onchange funtions
  const handlePropertyTypeSelect = (property) => {
    setselectedProperty(property.rental_adress);
    leaseFormin.setFieldValue("rental_id", property.rental_id);
    fetchUnitData(property.rental_id);
  };

  const handleUnitSelect = (unit) => {
    setselectedUnit(unit.rental_unit);
    leaseFormin.setFieldValue("unit_id", unit.unit_id);
  };

  const handleLeaseTypeSelect = (lease) => {
    setSelectedLeaseType(lease);
    leaseFormin.setFieldValue("lease_type", lease);
  };

  const handleDateChange = (date) => {
    const nextDate = moment(date).add(1, "months").format("YYYY-MM-DD");
    leaseFormin.setFieldValue("end_date", nextDate);
    // setIsDateUnavailable(false);
    // checkDate(nextDate);
  };

  const handleClose = () => {
    setOpenTenantsDialog(false);
  };

  const handleChange = (value) => {
    setShowTenantTable(!showTenantTable);
    setAlignment(value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCheckboxChange = (event, tenant) => {
    if (event.target.checked) {
      tenantFormik.setValues(tenant);
    }
  };

  const handleTenantDelete = () => {
    setSelectedTenantData({});
    setCheckedCheckbox(null);
    tenantFormik.resetForm();
  };

  const handleClick1 = () => {
    setRentincdropdownOpen1(!rentincdropdownOpen1);
  };

  const handleClick2 = () => {
    setRentincdropdownOpen2(!rentincdropdownOpen2);
  };

  const handleClick3 = () => {
    setRentincdropdownOpen3(!rentincdropdownOpen3);
  };

  const handleClick4 = () => {
    setRentincdropdownOpen4(!rentincdropdownOpen4);
  };

  //get data apis
  const fetchPropertyData = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/rentals/rentals/${accessType.admin_id}`
      );
      if (res.data.statusCode === 200) {
        setPropertyData(res.data.data);
      } else if (res.data.statusCode === 201) {
        setPropertyData([]);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchUnitData = async (rental_id) => {
    try {
      const res = await axios.get(`${baseUrl}/unit/rental_unit/${rental_id}`);
      if (res.data.statusCode === 200) {
        setUnitData(res.data.data);
      } else if (res.data.statusCode === 201) {
        setUnitData([]);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/accounts/accounts/${accessType.admin_id}`
      );
      if (res.data.statusCode === 200) {
        setAccountsData(res.data.data);
      } else if (res.data.statusCode === 201) {
        setAccountsData([]);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchTenantData = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/tenants/tenants/${accessType.admin_id}`
      );
      if (res.data.statusCode === 200) {
        setTenantData(res.data.data);
      } else if (res.data.statusCode === 201) {
        setTenantData([]);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  //get data apis useeffect
  useEffect(() => {
    fetchPropertyData();
    fetchAccounts();
    fetchTenantData();
  }, [accessType]);

  console.log(
    leaseFormin.values,
    tenantFormik.values,
    chargeFormin.values,
    cosignerFormik.values
  );

  return (
    <>
      <LeaseHeader />

      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {lease_id ? "Edit Lease" : "New Lease"}
                    </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  {/* lease */}
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Property*
                        </label>
                        <FormGroup>
                          <Dropdown
                            isOpen={propertyDropdownOpen}
                            toggle={toggle}
                          >
                            <DropdownToggle caret style={{ width: "100%" }}>
                              {selectedProperty
                                ? selectedProperty
                                : "Select Property"}
                            </DropdownToggle>
                            <DropdownMenu
                              style={{
                                width: "100%",
                                maxHeight: "200px",
                                overflowY: "auto",
                              }}
                            >
                              {propertyData.map((property, index) => (
                                <DropdownItem
                                  key={index}
                                  onClick={() => {
                                    handlePropertyTypeSelect(property);
                                  }}
                                >
                                  {property.rental_adress}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                            {leaseFormin.errors &&
                            leaseFormin.errors?.rental_id &&
                            leaseFormin.touched &&
                            leaseFormin.touched?.rental_id ? (
                              <div div style={{ color: "red" }}>
                                {leaseFormin.errors.rental_id}
                              </div>
                            ) : null}
                          </Dropdown>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      {selectedProperty && unitData && (
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-unit"
                            style={{ marginLeft: "15px" }}
                          >
                            Unit *
                          </label>
                          <FormGroup style={{ marginLeft: "15px" }}>
                            <Dropdown
                              isOpen={unitDropdownOpen}
                              toggle={toggle2}
                            >
                              <DropdownToggle caret>
                                {selectedUnit ? selectedUnit : "Select Unit"}
                              </DropdownToggle>
                              <DropdownMenu>
                                {unitData.length > 0 ? (
                                  unitData.map((unit) => (
                                    <DropdownItem
                                      key={unit.unit_id}
                                      onClick={() => handleUnitSelect(unit)}
                                    >
                                      {unit.rental_unit}
                                    </DropdownItem>
                                  ))
                                ) : (
                                  <DropdownItem disabled>
                                    No units available
                                  </DropdownItem>
                                )}
                              </DropdownMenu>
                              {leaseFormin.errors &&
                              leaseFormin.errors?.unit_id &&
                              leaseFormin.touched &&
                              leaseFormin.touched?.unit_id ? (
                                <div style={{ color: "red" }}>
                                  {leaseFormin.errors.unit_id}
                                </div>
                              ) : null}
                            </Dropdown>
                          </FormGroup>
                        </FormGroup>
                      )}
                    </Row>
                    <Row>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Lease Type *
                          </label>
                          <br />
                          <Dropdown isOpen={leaseDropdownOpen} toggle={toggle3}>
                            <DropdownToggle caret style={{ width: "100%" }}>
                              {selectedLeaseType
                                ? selectedLeaseType
                                : "Select Lease"}
                              &nbsp;&nbsp;&nbsp;&nbsp;
                            </DropdownToggle>
                            <DropdownMenu style={{ width: "100%" }}>
                              <DropdownItem
                                onClick={() => handleLeaseTypeSelect("Fixed")}
                              >
                                Fixed
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  handleLeaseTypeSelect("Fixed w/rollover")
                                }
                              >
                                Fixed w/rollover
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  handleLeaseTypeSelect(
                                    "At-will(month to month)"
                                  )
                                }
                              >
                                At-will(month to month)
                              </DropdownItem>
                            </DropdownMenu>
                            {leaseFormin.errors &&
                            leaseFormin.errors?.lease_type &&
                            leaseFormin.touched &&
                            leaseFormin.touched?.lease_type ? (
                              <div style={{ color: "red" }}>
                                {leaseFormin.errors.lease_type}
                              </div>
                            ) : null}
                          </Dropdown>
                        </FormGroup>
                      </Col>
                      &nbsp; &nbsp; &nbsp; &nbsp;
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-unitadd1"
                          >
                            Start Date *
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-unitadd1"
                            placeholder="3000"
                            type="date"
                            name="start_date"
                            onBlur={leaseFormin.handleBlur}
                            onChange={(e) => {
                              handleDateChange(e.target.value);
                              leaseFormin.handleChange(e);
                              //   checkStartDate(e.target.value);
                            }}
                            value={moment(leaseFormin.values.start_date).format(
                              "YYYY-MM-DD"
                            )}
                          />
                          {leaseFormin.errors &&
                          leaseFormin.errors?.start_date &&
                          leaseFormin.touched &&
                          leaseFormin.touched?.start_date ? (
                            <div style={{ color: "red" }}>
                              {leaseFormin.errors.start_date}
                            </div>
                          ) : null}
                          {/* {isStartDateUnavailable && (
                            <div style={{ color: "red", marginTop: "8px" }}>
                              This start date overlaps with an existing lease:{" "}
                              {overlapStartDateLease?.rental_adress} | -{" "}
                              {moment(overlapStartDateLease?.start_date).format(
                                "DD-MM-YYYY"
                              )}{" "}
                              {moment(overlapStartDateLease?.end_date).format(
                                "DD-MM-YYYY"
                              )}
                              . Please adjust your start date and try again.
                            </div>
                          )} */}
                        </FormGroup>
                      </Col>
                      &nbsp; &nbsp; &nbsp;
                      <Col
                        lg="3"
                        style={
                          selectedLeaseType === "At-will"
                            ? { display: "none" }
                            : { display: "block" }
                        }
                      >
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-unitadd2"
                          >
                            End Date
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-unitadd2"
                            placeholder="3000"
                            type="date"
                            name="end_date"
                            onBlur={leaseFormin.handleBlur}
                            onChange={(e) => {
                              leaseFormin.handleChange(e);
                              //   checkDate(e.target.value);
                            }}
                            value={moment(leaseFormin.values.end_date).format(
                              "YYYY-MM-DD"
                            )}
                            min={moment(leaseFormin.values.start_date).format(
                              "YYYY-MM-DD"
                            )}
                          />

                          {/* {isDateUnavailable && (
                            <div style={{ color: "red", marginTop: "8px" }}>
                              This date range overlaps with an existing lease:{" "}
                              {overlapLease?.rental_adress} | -{" "}
                              {moment(overlapLease?.start_date).format(
                                "DD-MM-YYYY"
                              )}{" "}
                              {moment(overlapLease?.end_date).format(
                                "DD-MM-YYYY"
                              )}
                              . Please adjust your date range and try again.
                            </div>
                          )} */}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <hr className="my-4" />

                  {/* tenant and cosigner */}
                  <h6 className="heading-small text-muted mb-4">
                    Tenants and Cosigner
                  </h6>
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <span
                          onClick={() => {
                            setShowTenantTable(false);
                            setOpenTenantsDialog(true);
                          }}
                          style={{
                            cursor: "pointer",
                            fontSize: "14px",
                            fontFamily: "monospace",
                            color: "blue",
                          }}
                        >
                          <b style={{ fontSize: "20px" }}>+</b> Add Tenant or
                          Cosigner
                          {display === false ? (
                            <></>
                          ) : (
                            <div style={{ color: "red" }}>Required</div>
                          )}
                        </span>

                        <Dialog open={openTenantsDialog} onClose={handleClose}>
                          <DialogTitle style={{ background: "#F0F8FF" }}>
                            Add Tenant or Cosigner
                          </DialogTitle>
                          <DialogContent
                            style={{ width: "100%", maxWidth: "500px" }}
                          >
                            <div
                              style={{
                                alignItems: "center",
                                margin: "30px 0",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <ToggleButtonGroup
                                  color="primary"
                                  value={alignment}
                                  exclusive
                                  onChange={(e) => {
                                    handleChange(e.target.value);
                                  }}
                                  aria-label="Platform"
                                  style={{ width: "100%" }}
                                >
                                  <ToggleButton
                                    value="Tenant"
                                    onClick={() => {
                                      setSelectedOption("Tenant");
                                      setShowForm(true);
                                    }}
                                    style={{
                                      width: "15rem",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    Tenant
                                  </ToggleButton>
                                  <ToggleButton
                                    value="Cosigner"
                                    onClick={() => {
                                      setSelectedOption("Cosigner");
                                      setShowForm(true);
                                    }}
                                    style={{
                                      width: "15rem",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    Cosigner
                                  </ToggleButton>
                                </ToggleButtonGroup>
                              </div>
                              <br />

                              {showForm && (
                                <div>
                                  {selectedOption === "Tenant" && (
                                    <div className="tenant">
                                      <div>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Checkbox
                                            onChange={handleChange}
                                            style={{ marginRight: "10px" }}
                                            checked={showTenantTable === true}
                                          />
                                          <label className="form-control-label">
                                            Choose an existing tenant
                                          </label>
                                        </div>
                                        <br />
                                      </div>

                                      {showTenantTable &&
                                        tenantData.length > 0 && (
                                          <div
                                            style={{
                                              maxHeight: "400px",
                                              overflow: "hidden",
                                            }}
                                          >
                                            <Input
                                              type="text"
                                              placeholder="Search by first and last name"
                                              value={searchQuery}
                                              onChange={handleSearch}
                                              style={{
                                                marginBottom: "10px",
                                                width: "100%",
                                                padding: "8px",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                              }}
                                            />
                                            <div
                                              style={{
                                                maxHeight: "calc(400px - 40px)",
                                                overflowY: "auto",
                                                border: "1px solid #ddd",
                                              }}
                                            >
                                              <table
                                                style={{
                                                  width: "100%",
                                                  borderCollapse: "collapse",
                                                }}
                                              >
                                                <thead>
                                                  <tr>
                                                    <th
                                                      style={{
                                                        padding: "15px",
                                                      }}
                                                    >
                                                      Tenant Name
                                                    </th>
                                                    <th
                                                      style={{
                                                        padding: "15px",
                                                      }}
                                                    >
                                                      Select
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {Array.isArray(tenantData) &&
                                                    tenantData
                                                      .filter((tenant) => {
                                                        const fullName = `${tenant.tenant_firstName} ${tenant.tenant_lastName}`;
                                                        return fullName
                                                          .toLowerCase()
                                                          .includes(
                                                            searchQuery.toLowerCase()
                                                          );
                                                      })
                                                      .map((tenant, index) => (
                                                        <tr
                                                          key={index}
                                                          style={{
                                                            border:
                                                              "1px solid #ddd",
                                                          }}
                                                        >
                                                          <td
                                                            style={{
                                                              paddingLeft:
                                                                "15px",
                                                              paddingTop:
                                                                "15px",
                                                            }}
                                                          >
                                                            <pre>
                                                              {
                                                                tenant.tenant_firstName
                                                              }{" "}
                                                              {
                                                                tenant.tenant_lastName
                                                              }{" "}
                                                              {`(${tenant.tenant_phoneNumber})`}
                                                            </pre>
                                                          </td>
                                                          <td
                                                            style={{
                                                              paddingLeft:
                                                                "15px",
                                                              paddingTop:
                                                                "15px",
                                                            }}
                                                          >
                                                            <Checkbox
                                                              type="checkbox"
                                                              name="tenant"
                                                              id={
                                                                tenant.tenant_phoneNumber
                                                              }
                                                              checked={
                                                                tenant.tenant_phoneNumber ===
                                                                checkedCheckbox
                                                              }
                                                              onChange={(
                                                                event
                                                              ) => {
                                                                setCheckedCheckbox(
                                                                  tenant.tenant_phoneNumber
                                                                );
                                                                handleCheckboxChange(
                                                                  event,
                                                                  tenant
                                                                );
                                                              }}
                                                            />
                                                          </td>
                                                        </tr>
                                                      ))}
                                                </tbody>
                                              </table>
                                            </div>
                                            <br />
                                          </div>
                                        )}
                                      {!showTenantTable && (
                                        <div
                                          className="TenantDetail"
                                          style={{ margin: "10px 10px" }}
                                        >
                                          <span
                                            style={{
                                              marginBottom: "1rem",
                                              display: "flex",
                                              background: "grey",
                                              cursor: "pointer",
                                            }}
                                          >
                                            &nbsp; Contact information
                                          </span>
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                            }}
                                          >
                                            <div
                                              style={{
                                                flex: 1,
                                                marginRight: "10px",
                                              }}
                                            >
                                              <label
                                                className="form-control-label"
                                                htmlFor="tenant_firstName"
                                              >
                                                First Name *
                                              </label>
                                              <br />
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
                                                onChange={
                                                  tenantFormik.handleChange
                                                }
                                                value={
                                                  tenantFormik.values
                                                    .tenant_firstName
                                                }
                                              />
                                              {tenantFormik.touched
                                                .tenant_firstName &&
                                              tenantFormik.errors
                                                .tenant_firstName ? (
                                                <div style={{ color: "red" }}>
                                                  {
                                                    tenantFormik.errors
                                                      .tenant_firstName
                                                  }
                                                </div>
                                              ) : null}
                                            </div>
                                            <div
                                              style={{
                                                flex: 1,
                                                marginRight: "10px",
                                              }}
                                            >
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
                                                onChange={
                                                  tenantFormik.handleChange
                                                }
                                                value={
                                                  tenantFormik.values
                                                    .tenant_lastName
                                                }
                                              />
                                              {tenantFormik.touched
                                                .tenant_lastName &&
                                              tenantFormik.errors
                                                .tenant_lastName ? (
                                                <div style={{ color: "red" }}>
                                                  {
                                                    tenantFormik.errors
                                                      .tenant_lastName
                                                  }
                                                </div>
                                              ) : null}
                                            </div>
                                          </div>
                                          <br />
                                          <div
                                            style={{
                                              // display: "flex",
                                              flexDirection: "row",
                                              alignItems: "center",
                                            }}
                                          >
                                            <div
                                              style={{
                                                flex: 1,
                                                marginRight: "10px",
                                              }}
                                            >
                                              <label
                                                className="form-control-label"
                                                htmlFor="tenant_phoneNumber"
                                              >
                                                Phone Number*
                                              </label>
                                              <br />
                                              <Input
                                                id="tenant_phoneNumber"
                                                className="form-control-alternative"
                                                variant="standard"
                                                type="text"
                                                placeholder="Phone Number"
                                                style={{
                                                  marginRight: "10px",
                                                  flex: 1,
                                                }} // Adjust flex property
                                                name="tenant_phoneNumber"
                                                onBlur={tenantFormik.handleBlur}
                                                onChange={
                                                  tenantFormik.handleChange
                                                }
                                                value={
                                                  tenantFormik.values
                                                    .tenant_phoneNumber
                                                }
                                                onInput={(e) => {
                                                  const inputValue =
                                                    e.target.value;
                                                  const numericValue =
                                                    inputValue.replace(
                                                      /\D/g,
                                                      ""
                                                    ); // Remove non-numeric characters
                                                  e.target.value = numericValue;
                                                }}
                                              />
                                              {tenantFormik.touched
                                                .tenant_phoneNumber &&
                                              tenantFormik.errors
                                                .tenant_phoneNumber ? (
                                                <div style={{ color: "red" }}>
                                                  {
                                                    tenantFormik.errors
                                                      .tenant_phoneNumber
                                                  }
                                                </div>
                                              ) : null}
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                              }}
                                            >
                                              {rentincdropdownOpen1 && (
                                                <div
                                                  style={{
                                                    flex: 1,
                                                    marginRight: "10px",
                                                  }}
                                                >
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
                                                    onBlur={
                                                      tenantFormik.handleBlur
                                                    }
                                                    onChange={
                                                      tenantFormik.handleChange
                                                    }
                                                    value={
                                                      tenantFormik.values
                                                        .tenant_alternativeNumber
                                                    }
                                                    onInput={(e) => {
                                                      const inputValue =
                                                        e.target.value;
                                                      const numericValue =
                                                        inputValue.replace(
                                                          /\D/g,
                                                          ""
                                                        );
                                                      e.target.value =
                                                        numericValue;
                                                    }}
                                                  />
                                                </div>
                                              )}
                                              <span
                                                onClick={handleClick1}
                                                style={{
                                                  cursor: "pointer",
                                                  fontSize: "14px",
                                                  fontFamily: "monospace",
                                                  color: "blue",
                                                  paddingTop: "3%",
                                                }}
                                              >
                                                <b style={{ fontSize: "20px" }}>
                                                  +
                                                </b>
                                                Add alternative Phone
                                              </span>
                                            </div>
                                          </div>
                                          <br />
                                          <div
                                            style={{
                                              flexDirection: "row",
                                              alignItems: "center",
                                            }}
                                          >
                                            <div
                                              style={{
                                                flex: 1,
                                                marginRight: "10px",
                                              }}
                                            >
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
                                                onChange={
                                                  tenantFormik.handleChange
                                                }
                                                value={
                                                  tenantFormik.values
                                                    .tenant_email
                                                }
                                              />
                                              {tenantFormik.touched
                                                .tenant_email &&
                                              tenantFormik.errors
                                                .tenant_email ? (
                                                <div style={{ color: "red" }}>
                                                  {
                                                    tenantFormik.errors
                                                      .tenant_email
                                                  }
                                                </div>
                                              ) : null}
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                              }}
                                            >
                                              {rentincdropdownOpen2 && (
                                                <div
                                                  style={{
                                                    flex: 1,
                                                    marginRight: "10px",
                                                  }}
                                                >
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
                                                    id="tenant_email"
                                                    className="form-control-alternative"
                                                    variant="standard"
                                                    type="text"
                                                    placeholder="Alternative Email"
                                                    style={{
                                                      marginRight: "10px",
                                                      flex: 1,
                                                    }}
                                                    name="tenant_alternativeEmail"
                                                    onBlur={
                                                      tenantFormik.handleBlur
                                                    }
                                                    onChange={
                                                      tenantFormik.handleChange
                                                    }
                                                    value={
                                                      tenantFormik.values
                                                        .tenant_alternativeEmail
                                                    }
                                                  />
                                                </div>
                                              )}
                                              <span
                                                onClick={handleClick2}
                                                style={{
                                                  cursor: "pointer",
                                                  fontSize: "14px",
                                                  fontFamily: "monospace",
                                                  color: "blue",
                                                  paddingTop: "3%",
                                                }}
                                              >
                                                <b style={{ fontSize: "20px" }}>
                                                  +
                                                </b>
                                                Add alternative Email
                                              </span>
                                            </div>
                                            <div
                                              style={{
                                                flex: 1,
                                                marginRight: "10px",
                                                marginTop: "20px",
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
                                                  type={
                                                    showPassword
                                                      ? "text"
                                                      : "password"
                                                  }
                                                  placeholder="Password"
                                                  style={{
                                                    marginRight: "10px",
                                                    flex: 1,
                                                  }}
                                                  name="tenant_password"
                                                  onBlur={
                                                    tenantFormik.handleBlur
                                                  }
                                                  onChange={
                                                    tenantFormik.handleChange
                                                  }
                                                  value={
                                                    tenantFormik.values
                                                      .tenant_password
                                                  }
                                                />
                                                <Button
                                                  type="button"
                                                  onClick={() =>
                                                    setShowPassword(
                                                      !showPassword
                                                    )
                                                  }
                                                >
                                                  {<VisibilityIcon />}
                                                </Button>
                                              </div>
                                              {tenantFormik.errors &&
                                              tenantFormik.errors
                                                ?.tenant_password &&
                                              tenantFormik.touched &&
                                              tenantFormik.touched
                                                ?.tenant_password ? (
                                                <div style={{ color: "red" }}>
                                                  {
                                                    tenantFormik.errors
                                                      .tenant_password
                                                  }
                                                </div>
                                              ) : null}
                                            </div>
                                          </div>
                                          <br />
                                          <div>
                                            <span
                                              onClick={toggle4}
                                              style={{
                                                marginBottom: "1rem",
                                                display: "flex",
                                                background: "grey",
                                                cursor: "pointer",
                                              }}
                                            >
                                              <b>+ </b>&nbsp; Personal
                                              information
                                            </span>
                                            <Collapse isOpen={collapseper}>
                                              <Card>
                                                <CardBody>
                                                  <Row>
                                                    <Col lg="5">
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
                                                          onBlur={
                                                            tenantFormik.handleBlur
                                                          }
                                                          onChange={
                                                            tenantFormik.handleChange
                                                          }
                                                          value={
                                                            tenantFormik.values
                                                              .tenant_birthDate
                                                          }
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                    <Col lg="7">
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
                                                          onBlur={
                                                            tenantFormik.handleBlur
                                                          }
                                                          onChange={
                                                            tenantFormik.handleChange
                                                          }
                                                          value={
                                                            tenantFormik.values
                                                              .taxPayer_id
                                                          }
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col lg="7">
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
                                                            maxWidth: "25rem",
                                                          }}
                                                          name="comments"
                                                          onBlur={
                                                            tenantFormik.handleBlur
                                                          }
                                                          onChange={
                                                            tenantFormik.handleChange
                                                          }
                                                          value={
                                                            tenantFormik.values
                                                              .comments
                                                          }
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>
                                                </CardBody>
                                              </Card>
                                            </Collapse>
                                          </div>
                                          <div>
                                            <span
                                              onClick={toggle5}
                                              style={{
                                                marginBottom: "1rem",
                                                display: "flex",
                                                background: "grey",
                                                cursor: "pointer",
                                              }}
                                            >
                                              <b>+ </b>&nbsp; Emergency Contact
                                            </span>
                                            <Collapse isOpen={collapsecont}>
                                              <Card>
                                                <CardBody>
                                                  <Row>
                                                    <Col lg="6">
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
                                                          onBlur={
                                                            tenantFormik.handleBlur
                                                          }
                                                          onChange={
                                                            tenantFormik.handleChange
                                                          }
                                                          value={
                                                            tenantFormik.values
                                                              .emergency_contact
                                                              .name
                                                          }
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
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
                                                          onBlur={
                                                            tenantFormik.handleBlur
                                                          }
                                                          onChange={
                                                            tenantFormik.handleChange
                                                          }
                                                          value={
                                                            tenantFormik.values
                                                              .emergency_contact
                                                              .relation
                                                          }
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col lg="6">
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
                                                          name=".emergency_contactemail"
                                                          onBlur={
                                                            tenantFormik.handleBlur
                                                          }
                                                          onChange={
                                                            tenantFormik.handleChange
                                                          }
                                                          value={
                                                            tenantFormik.values
                                                              .emergency_contact
                                                              .email
                                                          }
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
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
                                                          onBlur={
                                                            tenantFormik.handleBlur
                                                          }
                                                          onChange={
                                                            tenantFormik.handleChange
                                                          }
                                                          value={
                                                            tenantFormik.values
                                                              .emergency_contact
                                                              .phoneNumber
                                                          }
                                                          onInput={(e) => {
                                                            const inputValue =
                                                              e.target.value;
                                                            const numericValue =
                                                              inputValue.replace(
                                                                /\D/g,
                                                                ""
                                                              ); // Remove non-numeric characters
                                                            e.target.value =
                                                              numericValue;
                                                          }}
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>
                                                </CardBody>
                                              </Card>
                                            </Collapse>
                                          </div>
                                        </div>
                                      )}

                                      <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={() => {
                                          setShowTenantTable(false);
                                          tenantFormik.handleSubmit();
                                        }}
                                      >
                                        Add Tenant
                                      </button>
                                      <Button onClick={handleClose}>
                                        Cancel
                                      </Button>
                                    </div>
                                  )}

                                  {selectedOption === "Cosigner" && (
                                    <div className="cosigner">
                                      <div>
                                        <span
                                          style={{
                                            marginBottom: "1rem",
                                            display: "flex",
                                            background: "grey",
                                            cursor: "pointer",
                                          }}
                                        >
                                          &nbsp;Contact information
                                        </span>
                                      </div>

                                      <div
                                        className="formInput"
                                        style={{ margin: "10px 10px" }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                          }}
                                        >
                                          <div
                                            style={{
                                              flex: 1,
                                              marginRight: "10px",
                                            }}
                                          >
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-firstname"
                                            >
                                              First Name
                                            </label>
                                            <Input
                                              className="form-control-alternative"
                                              id="cosigner_firstName"
                                              placeholder="First Name"
                                              type="text"
                                              name="cosigner_firstName"
                                              onBlur={cosignerFormik.handleBlur}
                                              onChange={(e) =>
                                                cosignerFormik.handleChange(e)
                                              }
                                              value={
                                                cosignerFormik.values
                                                  .cosigner_firstName
                                              }
                                            />
                                            {cosignerFormik.errors &&
                                            cosignerFormik.errors
                                              ?.cosigner_firstName &&
                                            cosignerFormik.touched &&
                                            cosignerFormik.touched
                                              ?.cosigner_firstName &&
                                            cosignerFormik.values
                                              .cosigner_firstName === "" ? (
                                              <div style={{ color: "red" }}>
                                                {
                                                  cosignerFormik.errors
                                                    .cosigner_firstName
                                                }
                                              </div>
                                            ) : null}
                                          </div>
                                          <div style={{ flex: 1 }}>
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-lastname"
                                            >
                                              Last Name
                                            </label>
                                            <Input
                                              className="form-control-alternative"
                                              id="cosigner_lastName"
                                              placeholder="Last Name"
                                              type="text"
                                              name="cosigner_lastName"
                                              onBlur={cosignerFormik.handleBlur}
                                              onChange={
                                                cosignerFormik.handleChange
                                              }
                                              value={
                                                cosignerFormik.values
                                                  .cosigner_lastName
                                              }
                                            />
                                            {cosignerFormik.errors &&
                                            cosignerFormik.errors
                                              ?.cosigner_lastName &&
                                            cosignerFormik.touched &&
                                            cosignerFormik.touched
                                              ?.cosigner_lastName &&
                                            cosignerFormik.values
                                              .cosigner_lastName === "" ? (
                                              <div style={{ color: "red" }}>
                                                {
                                                  cosignerFormik.errors
                                                    .cosigner_lastName
                                                }
                                              </div>
                                            ) : null}
                                          </div>
                                        </div>
                                        <br />
                                        <div
                                          style={{
                                            // display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div
                                            style={{
                                              flex: 1,
                                              marginRight: "10px",
                                            }}
                                          >
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-lastname"
                                            >
                                              Phone Number
                                            </label>
                                            <br />
                                            <Input
                                              className="form-control-alternative"
                                              id="cosigner_phoneNumber"
                                              placeholder="Phone Number"
                                              type="text"
                                              name="cosigner_phoneNumber"
                                              onBlur={cosignerFormik.handleBlur}
                                              onChange={
                                                cosignerFormik.handleChange
                                              }
                                              value={
                                                cosignerFormik.values
                                                  .cosigner_phoneNumber
                                              }
                                              InputProps={{
                                                startAdornment: (
                                                  <InputAdornment position="start">
                                                    <PhoneIcon />
                                                  </InputAdornment>
                                                ),
                                              }}
                                              onInput={(e) => {
                                                const inputValue =
                                                  e.target.value;
                                                const numericValue =
                                                  inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                                                e.target.value = numericValue;
                                              }}
                                            />
                                            {cosignerFormik.errors &&
                                            cosignerFormik.errors
                                              .cosigner_phoneNumber &&
                                            cosignerFormik.touched &&
                                            cosignerFormik.touched
                                              .cosigner_phoneNumber &&
                                            cosignerFormik.values
                                              .cosigner_phoneNumber === "" ? (
                                              <div style={{ color: "red" }}>
                                                {
                                                  cosignerFormik.errors
                                                    .cosigner_phoneNumber
                                                }
                                              </div>
                                            ) : null}
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                            }}
                                          >
                                            {rentincdropdownOpen3 && (
                                              <div
                                                style={{
                                                  flex: 1,
                                                  marginRight: "10px",
                                                }}
                                              >
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
                                                  id="cosigner_alternativeNumber"
                                                  className="form-control-alternative"
                                                  variant="standard"
                                                  type="text"
                                                  placeholder="Alternative Number"
                                                  style={{
                                                    marginRight: "10px",
                                                    flex: 1,
                                                  }} // Adjust flex property
                                                  name="cosigner_alternativeNumber"
                                                  onBlur={
                                                    cosignerFormik.handleBlur
                                                  }
                                                  onChange={
                                                    cosignerFormik.handleChange
                                                  }
                                                  value={
                                                    cosignerFormik.values
                                                      .cosigner_alternativeNumber
                                                  }
                                                  onInput={(e) => {
                                                    const inputValue =
                                                      e.target.value;
                                                    const numericValue =
                                                      inputValue.replace(
                                                        /\D/g,
                                                        ""
                                                      ); // Remove non-numeric characters
                                                    e.target.value =
                                                      numericValue;
                                                    cosignerFormik.values.cosigner_alternativeNumber =
                                                      numericValue;
                                                  }}
                                                />
                                              </div>
                                            )}
                                            <span
                                              onClick={handleClick3}
                                              style={{
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                fontFamily: "monospace",
                                                color: "blue",
                                                paddingTop: "3%",
                                              }}
                                            >
                                              <b style={{ fontSize: "20px" }}>
                                                +
                                              </b>
                                              Add alternative Phone
                                            </span>
                                          </div>
                                        </div>
                                        <br />
                                        <div
                                          style={{
                                            // display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div
                                            style={{
                                              flex: 1,
                                              marginRight: "10px",
                                            }}
                                          >
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-email"
                                            >
                                              Email
                                            </label>
                                            <br />
                                            <Input
                                              className="form-control-alternative"
                                              id="cosigner_email"
                                              placeholder="Email"
                                              type="text"
                                              name="cosigner_email"
                                              onBlur={cosignerFormik.handleBlur}
                                              onChange={(e) =>
                                                cosignerFormik.handleChange(e)
                                              }
                                              value={
                                                cosignerFormik.values
                                                  .cosigner_email
                                              }
                                              InputProps={{
                                                startAdornment: (
                                                  <InputAdornment position="start">
                                                    <EmailIcon />
                                                  </InputAdornment>
                                                ),
                                              }}
                                            />
                                            {cosignerFormik.errors &&
                                            cosignerFormik.errors
                                              .cosigner_email &&
                                            cosignerFormik.touched &&
                                            cosignerFormik.touched
                                              .cosigner_email &&
                                            cosignerFormik.values
                                              .cosigner_email === "" ? (
                                              <div style={{ color: "red" }}>
                                                {
                                                  cosignerFormik.errors
                                                    .cosigner_email
                                                }
                                              </div>
                                            ) : null}
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                            }}
                                          >
                                            {rentincdropdownOpen4 && (
                                              <div
                                                style={{
                                                  flex: 1,
                                                  marginRight: "10px",
                                                }}
                                              >
                                                <label
                                                  className="form-control-label"
                                                  htmlFor="input-firstname"
                                                  style={{
                                                    paddingTop: "3%",
                                                  }}
                                                >
                                                  Alternative Email
                                                </label>
                                                <br />
                                                <Input
                                                  id="cosigner_alternativeEmail"
                                                  className="form-control-alternative"
                                                  variant="standard"
                                                  type="text"
                                                  placeholder="Alternative Email"
                                                  style={{
                                                    marginRight: "10px",
                                                    flex: 1,
                                                  }}
                                                  name="cosigner_alternativeEmail"
                                                  onBlur={
                                                    cosignerFormik.handleBlur
                                                  }
                                                  onChange={(e) =>
                                                    cosignerFormik.handleChange(
                                                      e
                                                    )
                                                  }
                                                  value={
                                                    cosignerFormik.values
                                                      .cosigner_alternativeEmail
                                                  }
                                                />
                                              </div>
                                            )}
                                            <span
                                              onClick={handleClick4}
                                              style={{
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                fontFamily: "monospace",
                                                color: "blue",
                                                paddingTop: "3%", // Add this to create space between the input and the link
                                              }}
                                            >
                                              <b style={{ fontSize: "20px" }}>
                                                +
                                              </b>
                                              Add alternative Email
                                            </span>
                                          </div>
                                        </div>
                                        <hr />
                                        <div>
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-email"
                                          >
                                            Address
                                          </label>
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <FormGroup>
                                            <label
                                              className="form-control-label"
                                              htmlFor="cosigner_adress"
                                            >
                                              Street Address
                                            </label>
                                            <Input
                                              className="form-control-alternative"
                                              id="cosigner_adress"
                                              placeholder="Address"
                                              type="textarea"
                                              style={{
                                                width: "100%",
                                                maxWidth: "25rem",
                                              }}
                                              onBlur={cosignerFormik.handleBlur}
                                              onChange={(e) =>
                                                cosignerFormik.handleChange(e)
                                              }
                                              value={
                                                cosignerFormik.values
                                                  .cosigner_adress
                                              }
                                            />
                                          </FormGroup>
                                        </div>
                                        <div>
                                          <Row>
                                            <Col lg="4">
                                              <FormGroup>
                                                <label
                                                  className="form-control-label"
                                                  htmlFor="input-city"
                                                >
                                                  City
                                                </label>
                                                <Input
                                                  className="form-control-alternative"
                                                  id="cosigner_city"
                                                  placeholder="New York"
                                                  type="text"
                                                  name="cosigner_city"
                                                  onBlur={
                                                    cosignerFormik.handleBlur
                                                  }
                                                  onChange={(e) =>
                                                    cosignerFormik.handleChange(
                                                      e
                                                    )
                                                  }
                                                  value={
                                                    cosignerFormik.values
                                                      .cosigner_city
                                                  }
                                                />
                                              </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                              <FormGroup>
                                                <label
                                                  className="form-control-label"
                                                  htmlFor="input-country"
                                                >
                                                  Country
                                                </label>
                                                <Input
                                                  className="form-control-alternative"
                                                  id="cosigner_country"
                                                  placeholder="United States"
                                                  type="text"
                                                  name="cosigner_country"
                                                  onBlur={
                                                    cosignerFormik.handleBlur
                                                  }
                                                  onChange={(e) =>
                                                    cosignerFormik.handleChange(
                                                      e
                                                    )
                                                  }
                                                  value={
                                                    cosignerFormik.values
                                                      .cosigner_country
                                                  }
                                                />
                                              </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                              <FormGroup>
                                                <label
                                                  className="form-control-label"
                                                  htmlFor="input-country"
                                                >
                                                  Postal code
                                                </label>
                                                <Input
                                                  className="form-control-alternative"
                                                  id="cosigner_postalcode"
                                                  placeholder="Postal code"
                                                  type="text"
                                                  name="cosigner_postalcode"
                                                  onBlur={
                                                    cosignerFormik.handleBlur
                                                  }
                                                  onChange={(e) =>
                                                    cosignerFormik.handleChange(
                                                      e
                                                    )
                                                  }
                                                  value={
                                                    cosignerFormik.values
                                                      .cosigner_postalcode
                                                  }
                                                  onInput={(e) => {
                                                    const inputValue =
                                                      e.target.value;
                                                    const numericValue =
                                                      inputValue.replace(
                                                        /\D/g,
                                                        ""
                                                      );
                                                    e.target.value =
                                                      numericValue;
                                                  }}
                                                />
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                        <br />
                                      </div>
                                      <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={() => {
                                          cosignerFormik.handleSubmit();
                                        }}
                                      >
                                        Add Cosigner
                                      </button>
                                      <Button onClick={handleClose}>
                                        Cancel
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <div>
                          {selectedTenantData &&
                          Object.keys(selectedTenantData).length > 0 ? (
                            <>
                              <Row
                                className="w-100 my-3"
                                style={{
                                  fontSize: "18px",
                                  textTransform: "capitalize",
                                  color: "#5e72e4",
                                  fontWeight: "600",
                                  borderBottom: "1px solid #ddd",
                                  paddingTop: "15px",
                                }}
                              >
                                <Col>Tenant</Col>
                              </Row>

                              <Row
                                className="w-100 mb-1"
                                style={{
                                  fontSize: "17px",
                                  // textTransform: "uppercase",
                                  color: "#aaa",
                                  fontWeight: "bold",
                                }}
                              >
                                <Col>First Name</Col>
                                <Col>Last Name</Col>
                                <Col>Phone Number</Col>
                                <Col>Action</Col>
                              </Row>

                              <Row
                                className="w-100 mt-1"
                                style={{
                                  fontSize: "14px",
                                  textTransform: "capitalize",
                                  color: "#000",
                                }}
                              >
                                <Col>{selectedTenantData.firstName}</Col>
                                <Col>{selectedTenantData.lastName}</Col>
                                <Col>{selectedTenantData.mobileNumber}</Col>
                                <Col>
                                  <EditIcon
                                    onClick={() => {
                                      setShowTenantTable(false);
                                      setOpenTenantsDialog(true);
                                      setSelectedOption("Tenant");
                                      setAlignment("Tenant");
                                    }}
                                  />

                                  <DeleteIcon
                                    onClick={() => {
                                      setShowTenantTable(false);
                                      handleTenantDelete();
                                    }}
                                  />
                                </Col>
                              </Row>
                            </>
                          ) : null}
                        </div>
                        {tenantFormik.errors &&
                        tenantFormik.errors?.tenant_password &&
                        leaseFormin.submitCount > 0 ? (
                          <div style={{ color: "red" }}>
                            {tenantFormik.errors.tenant_password}
                          </div>
                        ) : null}

                        <div>
                          {cosignerData &&
                            Object.keys(cosignerData).length > 0 && (
                              <>
                                <Row
                                  className="w-100 my-3"
                                  style={{
                                    fontSize: "18px",
                                    textTransform: "capitalize",
                                    color: "#5e72e4",
                                    fontWeight: "600",
                                    borderBottom: "1px solid #ddd",
                                    paddingTop: "15px",
                                  }}
                                >
                                  <Col>Cosigner</Col>
                                </Row>

                                <Row
                                  className="w-100 mb-1"
                                  style={{
                                    fontSize: "17px",
                                    // textTransform: "uppercase",
                                    color: "#aaa",
                                    fontWeight: "bold",
                                  }}
                                >
                                  <Col>First Name</Col>
                                  <Col>Last Name</Col>
                                  <Col>Phone Number</Col>
                                  <Col>Action</Col>
                                </Row>

                                <Row
                                  className="w-100 mt-1"
                                  style={{
                                    fontSize: "14px",
                                    textTransform: "capitalize",
                                    color: "#000",
                                  }}
                                >
                                  <Col>{cosignerData.firstName}</Col>
                                  <Col>{cosignerData.lastName}</Col>
                                  <Col>{cosignerData.mobileNumber}</Col>
                                  <Col>
                                    {/* <EditIcon onClick={setOpenTenantsDialog} />
                                    <DeleteIcon
                                      onClick={handleCosignerDelete}
                                    /> */}
                                    hi
                                  </Col>
                                </Row>
                              </>
                            )}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>

                  <hr className="my-4" />

                  {/* rent charge */}
                  <h6 className="heading-small text-muted mb-4">
                    Rent (Optional)
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <Row>
                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  Amount *
                                </label>
                                <br />
                                <FormGroup>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-reserve"
                                    placeholder="$0.00"
                                    type="text"
                                    name="amount"
                                    onBlur={chargeFormin.handleBlur}
                                    value={chargeFormin.values.amount}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const numericValue = inputValue.replace(
                                        /\D/g,
                                        ""
                                      );
                                      chargeFormin.values.amount = numericValue;
                                      chargeFormin.handleChange({
                                        target: {
                                          name: "amount",
                                          value: numericValue,
                                        },
                                      });
                                    }}
                                  />
                                  {chargeFormin.errors &&
                                  chargeFormin.errors.amount &&
                                  chargeFormin.touched &&
                                  chargeFormin.touched.amount &&
                                  chargeFormin.values.amount === "" ? (
                                    <div style={{ color: "red" }}>
                                      {chargeFormin.errors.amount}
                                    </div>
                                  ) : null}
                                </FormGroup>
                              </FormGroup>
                            </Col>

                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-unitadd9"
                                >
                                  Next Due Date
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-unitadd9"
                                  placeholder="3000"
                                  type="date"
                                  name="nextDue_date"
                                  onBlur={chargeFormin.handleBlur}
                                  onChange={(e) => chargeFormin.handleChange(e)}
                                  value={chargeFormin.values.nextDue_date}
                                />
                              </FormGroup>
                            </Col>

                            <Col lg="3">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="memo"
                                >
                                  Memo
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="memo"
                                  type="text"
                                  name="memo"
                                  onBlur={chargeFormin.handleBlur}
                                  onChange={chargeFormin.handleChange}
                                  value={chargeFormin.values.memo}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Leaseing2;
