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
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";
import AccountDialog from "components/AccountDialog";

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
  const [rentCycleDropdownOpen, setRentCycleDropdownOpen] = useState(false);
  const [openRecurringDialog, setOpenRecurringDialog] = useState(false);
  const [openOneTimeChargeDialog, setOpenOneTimeChargeDialog] = useState(false);
  const [addBankAccountDialogOpen, setAddBankAccountDialogOpen] =
    useState(false);
  const [paymentOptionDropdawnOpen, setpaymentOptionDropdawnOpen] =
    useState(false);

  //checkbox
  const [checkedCheckbox, setCheckedCheckbox] = useState(false);
  const [rentincdropdownOpen1, setRentincdropdownOpen1] = useState(false);
  const [rentincdropdownOpen2, setRentincdropdownOpen2] = useState(false);
  const [rentincdropdownOpen3, setRentincdropdownOpen3] = useState(false);
  const [rentincdropdownOpen4, setRentincdropdownOpen4] = useState(false);
  const [rentincdropdownOpen5, setRentincdropdownOpen5] = useState(false);
  const [rentincdropdownOpen6, setRentincdropdownOpen6] = useState(false);
  const [collapseper, setCollapseper] = useState(false);
  const [collapsecont, setCollapsecont] = useState(false);

  //selected variable dependancy
  const [selectedProperty, setselectedProperty] = useState("");
  const [selectedUnit, setselectedUnit] = useState("");
  const [selectedLeaseType, setSelectedLeaseType] = useState("");
  const [selectedOption, setSelectedOption] = useState("Tenant");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRentCycle, setSelectedRentCycle] = useState("");
  const [accountTypeName, setAccountTypeName] = useState("");
  const [selectPaymentMethod, setSelectPaymentMethod] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  //get response variables
  const [propertyData, setPropertyData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  const [tenantData, setTenantData] = useState([]);
  const [selectedTenantData, setSelectedTenantData] = useState([]);
  const [cosignerData, setCosignerData] = useState([]);
  const [recurringData, setRecurringData] = useState([]);
  const [oneTimeData, setOneTimeData] = useState([]);

  //display
  const [openTenantsDialog, setOpenTenantsDialog] = useState(false);
  const [showTenantTable, setShowTenantTable] = useState(false);
  const [display, setDisplay] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState("Tenant");

  // other isVariableStatement
  const [alignment, setAlignment] = useState("web");
  const [file, setFile] = useState("");

  //toggles
  const toggle = () => setPropertyDropdownOpen((prevState) => !prevState);
  const toggle2 = () => setUnitDropdownOpen((prevState) => !prevState);
  const toggle3 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const toggle6 = () => setRentCycleDropdownOpen((prevState) => !prevState);
  const toggle7 = () => setRentincdropdownOpen6((prevState) => !prevState);
  const toggle8 = () => setRentincdropdownOpen5((prevState) => !prevState);
  const paymentMethodtoggle = () =>
    setpaymentOptionDropdawnOpen((prevState) => !prevState);
  const toggle4 = () => {
    setCollapseper(!collapseper);
  };
  const toggle5 = () => {
    setCollapsecont(!collapsecont);
  };
  const toggleAddBankDialog = () => {
    setAddBankAccountDialogOpen((prevState) => !prevState);
  };

  //loaders
  const [loader, setLoader] = useState(false);

  //dropdown options
  const rentOptions = [
    "Daily",
    "Weekly",
    "Every two weeks",
    "Monthly",
    "Every two months",
    "Quarterly",
    "Yearly",
  ];
  const selectPaymentMethodData = ["Manually", "AutoPayment"];

  //formik for form
  const leaseFormik = useFormik({
    initialValues: {
      rental_id: "",
      unit_id: "",
      lease_type: "",
      start_date: "",
      end_date: "",
      uploaded_file: "",
      tenant_residentStatus: false,
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

  const rentChargeFormin = useFormik({
    initialValues: {
      amount: "",
      memo: "",
      charge_type: "Last Month's Rent",
      account: "Last Month's Rent",
      date: "",
      rent_cycle: "",
      security_amount: "",
      is_paid: false,
      is_lateFee: false,
    },
    validationSchema: yup.object({
      amount: yup.number().required("Required"),
      account: yup.string().required("Required"),
      charge_type: yup.string().required("Required"),
      rent_cycle: yup.string().required("Required"),
    }),
  });

  let recurringChargeSchema = useFormik({
    initialValues: {
      recuring_amount: "",
      recuring_account: "",
      recuringmemo: "",
    },

    validationSchema: yup.object({
      recuring_amount: yup.string().required("Required"),
      recuring_account: yup.string().required("Required"),
    }),

    onSubmit: (values, { resetForm }) => {
      if (editingIndex !== null) {
        setRecurringData((prevRecurringData) => {
          const updatedData = [...prevRecurringData];
          updatedData[editingIndex] = values;
          return updatedData;
        });

        setEditingIndex(null);
      } else {
        setRecurringData((prevRecurringData) => [...prevRecurringData, values]);
      }
      setOpenRecurringDialog(false);
      resetForm();
    },
  });

  let oneTimeChargeSchema = useFormik({
    initialValues: {
      onetime_amount: "",
      onetime_account: "",
      onetime_memo: "",
    },

    validationSchema: yup.object({
      onetime_amount: yup.string().required("Required"),
      onetime_account: yup.string().required("Required"),
    }),

    onSubmit: (values, { resetForm }) => {
      if (editingIndex !== null) {
        setOneTimeData((prevOneTimeData) => {
          const updatedData = [...prevOneTimeData];
          updatedData[editingIndex] = values;
          return updatedData;
        });

        setEditingIndex(null);
      } else {
        setOneTimeData((prevOneTimeData) => [...prevOneTimeData, values]);
      }
      setOpenOneTimeChargeDialog(false);
      resetForm();
    },
  });

  let paymentFormin = useFormik({
    initialValues: { card_number: "", exp_date: "", paymentMethod: "" },
    validationSchema: yup.object({
      paymentMethod: yup.string().required("Payment Method Required"),
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
    onSubmit: () => {
      setOpenTenantsDialog(false);
    },
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
    onSubmit: (values) => {
      setOpenTenantsDialog(false);
      setCosignerData(values);
    },
  });

  //onchange funtions
  const handlePropertyTypeSelect = (property) => {
    setselectedProperty(property.rental_adress);
    leaseFormik.setFieldValue("rental_id", property.rental_id);
    fetchUnitData(property.rental_id);
  };

  const handleUnitSelect = (unit) => {
    setselectedUnit(unit.rental_unit);
    leaseFormik.setFieldValue("unit_id", unit.unit_id);
  };

  const handleLeaseTypeSelect = (lease) => {
    setSelectedLeaseType(lease);
    leaseFormik.setFieldValue("lease_type", lease);
  };

  const handleDateChange = (date) => {
    const nextDate = moment(date).add(1, "months").format("YYYY-MM-DD");
    leaseFormik.setFieldValue("end_date", nextDate);
    // setIsDateUnavailable(false);
    // checkDate(nextDate);
  };

  const handleClose = () => {
    setOpenTenantsDialog(false);
    setOpenRecurringDialog(false);
    setOpenOneTimeChargeDialog(false);
  };

  const handleChange = (value) => {
    setShowTenantTable(!showTenantTable);
    setAlignment(value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCheckboxChange = (event, tenant) => {
    const {
      tenant_firstName,
      tenant_lastName,
      tenant_phoneNumber,
      tenant_alternativeNumber,
      tenant_email,
      tenant_alternativeEmail,
      tenant_password,
      tenant_birthDate,
      taxPayer_id,
      comments,
      emergency_contact: { name, relation, email, phoneNumber },
    } = tenant;
    if (event.target.checked) {
      setShowTenantTable(false);
      tenantFormik.setValues({
        tenant_firstName,
        tenant_lastName,
        tenant_phoneNumber,
        tenant_alternativeNumber,
        tenant_email,
        tenant_alternativeEmail,
        tenant_password,
        tenant_birthDate,
        taxPayer_id,
        comments,
        emergency_contact: {
          name,
          relation,
          email,
          phoneNumber,
        },
      });
      setSelectedTenantData({
        tenant_firstName,
        tenant_lastName,
        tenant_phoneNumber,
        tenant_alternativeNumber,
        tenant_email,
        tenant_alternativeEmail,
        tenant_password,
        tenant_birthDate,
        taxPayer_id,
        comments,
        emergency_contact: {
          name,
          relation,
          email,
          phoneNumber,
        },
      });
    } else {
      setCheckedCheckbox("");
      tenantFormik.resetForm();
    }
  };

  const handleTenantDelete = () => {
    setSelectedTenantData({});
    setCheckedCheckbox(null);
    tenantFormik.resetForm();
  };

  const handleCosignerDelete = () => {
    setCosignerData({});
    cosignerFormik.resetForm();
  };

  const handleselectedRentCycle = (rentcycle) => {
    setSelectedRentCycle(rentcycle);
    rentChargeFormin.setFieldValue("rent_cycle", rentcycle);

    const startDate = rentChargeFormin.values.start_date;
    let nextDue_date;
    let dayFrequency;
    switch (rentcycle) {
      case "Daily":
        nextDue_date = moment(startDate).add(1, "days").format("YYYY-MM-DD");
        dayFrequency = 1;
        break;
      case "Weekly":
        nextDue_date = moment(startDate).add(1, "weeks").format("YYYY-MM-DD");
        dayFrequency = 7;
        break;
      case "Every two weeks":
        nextDue_date = moment(startDate).add(2, "weeks").format("YYYY-MM-DD");
        dayFrequency = 14;
        break;
      case "Monthly":
        nextDue_date = moment(startDate).add(1, "months").format("YYYY-MM-DD");
        dayFrequency = 30;
        break;
      case "Every two months":
        nextDue_date = moment(startDate).add(2, "months").format("YYYY-MM-DD");
        dayFrequency = 60;
        break;
      case "Quarterly":
        nextDue_date = moment(startDate).add(3, "months").format("YYYY-MM-DD");
        dayFrequency = 120;
        break;
      default:
        nextDue_date = moment(startDate).add(1, "years").format("YYYY-MM-DD");
        dayFrequency = 365;
    }
    rentChargeFormin.setFieldValue("date", nextDue_date);
  };

  const handleClickOpenRecurring = () => {
    recurringChargeSchema.setValues({
      recuring_amount: "",
      recuring_account: "",
      recuringmemo: "",
    });
    setOpenRecurringDialog(true);
  };
  const handleClickOpenOneTimeCharge = () => {
    oneTimeChargeSchema.setValues({
      onetime_amount: "",
      onetime_account: "",
      onetime_memo: "",
    });
    setOpenOneTimeChargeDialog(true);
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

  const AddNewAccountName = async (accountName) => {
    toggleAddBankDialog();
    setAccountTypeName(accountName);
  };

  const editeReccuring = (index) => {
    setOpenRecurringDialog(true);
    setEditingIndex(index);
    recurringChargeSchema.setValues({
      recuring_amount: recurringData[index].recuring_amount,
      recuring_account: recurringData[index].recuring_account,
      recuringmemo: recurringData[index].recuringmemo,
    });
  };

  const editOneTime = (index) => {
    setOpenOneTimeChargeDialog(true);
    setEditingIndex(index);
    oneTimeChargeSchema.setValues({
      onetime_amount: oneTimeData[index].onetime_amount,
      onetime_account: oneTimeData[index].onetime_account,
      onetime_memo: oneTimeData[index].onetime_memo,
    });
  };

  const handleRecurringDelete = (indexToDelete) => {
    setRecurringData((prevData) => {
      return prevData.filter((data, index) => index !== indexToDelete);
    });
  };

  const handleOnetimeDelete = (indexToDelete) => {
    setOneTimeData((prevData) => {
      return prevData.filter((data, index) => index !== indexToDelete);
    });
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

  // console.log(
  //   // leaseFormik.values,
  //   // tenantFormik.values,
  //   // selectedTenantData,
  //   rentChargeFormin.values
  //   // cosignerFormik.values
  // );

  //files set
  const fileData = (files) => {
    const filesArray = [...files];

    if (filesArray.length <= 10 && file.length === 0) {
      const finalArray = [];

      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: accessType.first_name + " " + accessType.last_name,
          file_name: filesArray[i].name,
          // Create a blob link for each file
          upload_link: URL.createObjectURL(filesArray[i]),
        };
        finalArray.push(object);
      }

      setFile([...finalArray]);
      leaseFormik.setFieldValue("upload_file", [...finalArray]);
    } else if (
      file.length >= 0 &&
      file.length <= 10 &&
      filesArray.length + file.length > 10
    ) {
      setFile([...file]);
      leaseFormik.setFieldValue("upload_file", [...file]);
    } else {
      const finalArray = [];

      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: localStorage.getItem("user_id"),
          file_name: filesArray[i].name,
          // Create a blob link for each file
          upload_link: URL.createObjectURL(filesArray[i]),
        };
        finalArray.push(object);
      }

      setFile([...file, ...finalArray]);
      leaseFormik.setFieldValue("upload_file", [...file, ...finalArray]);
    }
  };

  const deleteFile = (index) => {
    const newFile = [...file];
    newFile.splice(index, 1);
    setFile(newFile);
    leaseFormik.setFieldValue("upload_file", newFile);
  };

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
                            {leaseFormik.errors &&
                            leaseFormik.errors?.rental_id &&
                            leaseFormik.touched &&
                            leaseFormik.touched?.rental_id ? (
                              <div div style={{ color: "red" }}>
                                {leaseFormik.errors.rental_id}
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
                              {leaseFormik.errors &&
                              leaseFormik.errors?.unit_id &&
                              leaseFormik.touched &&
                              leaseFormik.touched?.unit_id ? (
                                <div style={{ color: "red" }}>
                                  {leaseFormik.errors.unit_id}
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
                            {leaseFormik.errors &&
                            leaseFormik.errors?.lease_type &&
                            leaseFormik.touched &&
                            leaseFormik.touched?.lease_type ? (
                              <div style={{ color: "red" }}>
                                {leaseFormik.errors.lease_type}
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
                            onBlur={leaseFormik.handleBlur}
                            onChange={(e) => {
                              handleDateChange(e.target.value);
                              leaseFormik.handleChange(e);
                              //   checkStartDate(e.target.value);
                            }}
                            value={moment(leaseFormik.values.start_date).format(
                              "YYYY-MM-DD"
                            )}
                          />
                          {leaseFormik.errors &&
                          leaseFormik.errors?.start_date &&
                          leaseFormik.touched &&
                          leaseFormik.touched?.start_date ? (
                            <div style={{ color: "red" }}>
                              {leaseFormik.errors.start_date}
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
                            onBlur={leaseFormik.handleBlur}
                            onChange={(e) => {
                              leaseFormik.handleChange(e);
                              //   checkDate(e.target.value);
                            }}
                            value={moment(leaseFormik.values.end_date).format(
                              "YYYY-MM-DD"
                            )}
                            min={moment(leaseFormik.values.start_date).format(
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
                                <Col>{selectedTenantData.tenant_firstName}</Col>
                                <Col>{selectedTenantData.tenant_lastName}</Col>
                                <Col>
                                  {selectedTenantData.tenant_phoneNumber}
                                </Col>
                                <Col>
                                  <EditIcon
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setShowTenantTable(false);
                                      setOpenTenantsDialog(true);
                                      setSelectedOption("Tenant");
                                      setAlignment("Tenant");
                                    }}
                                  />

                                  <DeleteIcon
                                    style={{ cursor: "pointer" }}
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
                        leaseFormik.submitCount > 0 ? (
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
                                  <Col>{cosignerData.cosigner_firstName}</Col>
                                  <Col>{cosignerData.cosigner_lastName}</Col>
                                  <Col>{cosignerData.cosigner_phoneNumber}</Col>
                                  <Col>
                                    <EditIcon
                                      style={{ cursor: "pointer" }}
                                      onClick={setOpenTenantsDialog}
                                    />
                                    <DeleteIcon
                                      style={{ cursor: "pointer" }}
                                      onClick={handleCosignerDelete}
                                    />
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
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Rent cycle *
                          </label>
                          <FormGroup>
                            <Dropdown
                              isOpen={rentCycleDropdownOpen}
                              toggle={toggle6}
                            >
                              <DropdownToggle caret style={{ width: "100%" }}>
                                {selectedRentCycle
                                  ? selectedRentCycle
                                  : "Select"}
                              </DropdownToggle>
                              <DropdownMenu
                                style={{ width: "100%" }}
                                name="rent_cycle"
                                onBlur={rentChargeFormin.handleBlur}
                                onChange={(e) =>
                                  rentChargeFormin.handleChange(e)
                                }
                                value={rentChargeFormin.values.rent_cycle}
                              >
                                {rentOptions.map((option) => (
                                  <DropdownItem
                                    key={option}
                                    onClick={() =>
                                      handleselectedRentCycle(option)
                                    }
                                  >
                                    {option}
                                  </DropdownItem>
                                ))}
                              </DropdownMenu>
                            </Dropdown>
                          </FormGroup>
                          {rentChargeFormin.errors &&
                          rentChargeFormin.errors?.rent_cycle &&
                          rentChargeFormin.touched &&
                          rentChargeFormin.touched?.rent_cycle &&
                          rentChargeFormin.values.rent_cycle === "" ? (
                            <div style={{ color: "red" }}>
                              {rentChargeFormin.errors.rent_cycle}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
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
                                    onBlur={rentChargeFormin.handleBlur}
                                    value={rentChargeFormin.values.amount}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const numericValue = inputValue.replace(
                                        /\D/g,
                                        ""
                                      );
                                      rentChargeFormin.values.amount =
                                        numericValue;
                                      rentChargeFormin.handleChange({
                                        target: {
                                          name: "amount",
                                          value: numericValue,
                                        },
                                      });
                                    }}
                                  />
                                  {rentChargeFormin.errors &&
                                  rentChargeFormin.errors.amount &&
                                  rentChargeFormin.touched &&
                                  rentChargeFormin.touched.amount &&
                                  rentChargeFormin.values.amount === "" ? (
                                    <div style={{ color: "red" }}>
                                      {rentChargeFormin.errors.amount}
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
                                  name="date"
                                  onBlur={rentChargeFormin.handleBlur}
                                  onChange={(e) =>
                                    rentChargeFormin.handleChange(e)
                                  }
                                  value={rentChargeFormin.values.date}
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
                                  onBlur={rentChargeFormin.handleBlur}
                                  onChange={rentChargeFormin.handleChange}
                                  value={rentChargeFormin.values.memo}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Security Deposite */}
                  <h6 className="heading-small text-muted mb-4">
                    Security Deposite (Optional)
                  </h6>
                  <div className="pl-lg-2">
                    <FormGroup>
                      <br />
                      <Row>
                        <Col lg="2">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Amount
                            </label>
                            <br />
                            <FormGroup>
                              <Input
                                className="form-control-alternative"
                                id="input-reserve"
                                placeholder="$0.00"
                                type="text"
                                name="security_amount"
                                onBlur={rentChargeFormin.handleBlur}
                                onChange={rentChargeFormin.handleChange}
                                value={rentChargeFormin.values.security_amount}
                                onInput={(e) => {
                                  const inputValue = e.target.value;
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ""
                                  );
                                  e.target.value = numericValue;
                                }}
                              />
                            </FormGroup>
                          </FormGroup>
                        </Col>

                        <Col lg="7">
                          <FormGroup>
                            <br />
                            <label
                              className="form-control-label"
                              htmlFor="input-unitadd10"
                            >
                              Don't forget to record the payment once you have
                              connected the deposite
                            </label>
                          </FormGroup>
                        </Col>
                      </Row>
                    </FormGroup>
                  </div>
                  <hr />
                  <h6 className="heading-small text-muted mb-4">
                    Charges (Optional)
                  </h6>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Add Charges
                        </label>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <span
                          onClick={handleClickOpenRecurring}
                          style={{
                            cursor: "pointer",
                            fontSize: "14px",
                            fontFamily: "monospace",
                            color: "blue",
                          }}
                        >
                          <b style={{ fontSize: "20px" }}>+</b> Add Recurring
                        </span>
                        <Dialog
                          open={openRecurringDialog}
                          onClose={handleClose}
                        >
                          <DialogTitle style={{ background: "#F0F8FF" }}>
                            Add Recurring content
                          </DialogTitle>

                          <div>
                            <div
                              style={{ marginLeft: "4%", marginRight: "4%" }}
                            >
                              <br />
                              <div className="grid-container resp-header">
                                <div>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-unitadd11"
                                  >
                                    Account*
                                  </label>
                                  <FormGroup>
                                    <Dropdown
                                      isOpen={rentincdropdownOpen5}
                                      toggle={toggle8}
                                    >
                                      <DropdownToggle caret>
                                        {recurringChargeSchema.values
                                          .recuring_account
                                          ? recurringChargeSchema.values
                                              .recuring_account
                                          : "Select"}
                                      </DropdownToggle>
                                      <DropdownMenu
                                        style={{
                                          zIndex: 999,
                                          maxHeight: "280px",
                                          overflowY: "auto",
                                          width: "100%",
                                        }}
                                        name="recuring_account"
                                        onBlur={
                                          recurringChargeSchema.handleBlur
                                        }
                                        onChange={(e) =>
                                          recurringChargeSchema.handleChange(e)
                                        }
                                        value={
                                          recurringChargeSchema.values
                                            .recuring_account || ""
                                        }
                                      >
                                        {accountsData.map((account) => (
                                          <>
                                            {account.charge_type ===
                                            "Recurring Charge" ? (
                                              <DropdownItem
                                                onClick={() => {
                                                  recurringChargeSchema.setFieldValue(
                                                    "recuring_account",
                                                    account.account
                                                  );
                                                }}
                                                key={account.account_id}
                                              >
                                                {account.account}
                                              </DropdownItem>
                                            ) : (
                                              ""
                                            )}
                                          </>
                                        ))}
                                        <DropdownItem
                                          onClick={() =>
                                            AddNewAccountName(
                                              "Recurring Charge"
                                            )
                                          }
                                        >
                                          Add new account..
                                        </DropdownItem>
                                      </DropdownMenu>
                                      {recurringChargeSchema.errors &&
                                      recurringChargeSchema.errors
                                        .recuring_account &&
                                      recurringChargeSchema.touched &&
                                      recurringChargeSchema.touched
                                        .recuring_account &&
                                      recurringChargeSchema.values
                                        .recuring_account === "" ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            recurringChargeSchema.errors
                                              .recuring_account
                                          }
                                        </div>
                                      ) : null}
                                    </Dropdown>
                                  </FormGroup>
                                </div>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-address"
                                  >
                                    Amount*
                                  </label>
                                  <br />
                                  <FormGroup>
                                    <Input
                                      className="form-control-alternative"
                                      id="recuring_amount"
                                      placeholder="$0.00"
                                      type="text"
                                      name="recuring_amount"
                                      onBlur={recurringChargeSchema.handleBlur}
                                      value={
                                        recurringChargeSchema.values
                                          .recuring_amount || ""
                                      }
                                      onChange={(e) =>
                                        recurringChargeSchema.handleChange(e)
                                      }
                                      onInput={(e) => {
                                        const inputValue = e.target.value;
                                        const numericValue = inputValue.replace(
                                          /\D/g,
                                          ""
                                        );
                                        e.target.value = numericValue;
                                      }}
                                    />
                                    {recurringChargeSchema.errors &&
                                    recurringChargeSchema.errors
                                      .recuring_amount &&
                                    recurringChargeSchema.touched &&
                                    recurringChargeSchema.touched
                                      .recuring_amount &&
                                    recurringChargeSchema.values
                                      .recuring_amount === "" ? (
                                      <div style={{ color: "red" }}>
                                        {
                                          recurringChargeSchema.errors
                                            .recuring_amount
                                        }
                                      </div>
                                    ) : null}
                                  </FormGroup>
                                </FormGroup>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="recuringmemo"
                                  >
                                    Memo
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="recuringmemo"
                                    type="text"
                                    name="recuringmemo"
                                    onBlur={recurringChargeSchema.handleBlur}
                                    onChange={(e) => {
                                      recurringChargeSchema.values.recuringmemo =
                                        e.target.value;
                                      recurringChargeSchema.handleChange(e);
                                    }}
                                    value={
                                      recurringChargeSchema.values
                                        .recuringmemo || ""
                                    }
                                  />
                                </FormGroup>
                              </div>
                            </div>
                            <DialogActions>
                              <Button
                                type="submit"
                                style={{
                                  backgroundColor: "#007bff",
                                  color: "white",
                                }}
                                onClick={() => {
                                  recurringChargeSchema.handleSubmit();
                                }}
                              >
                                Add
                              </Button>
                              <Button onClick={handleClose}>Cancel</Button>
                            </DialogActions>
                          </div>
                        </Dialog>
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <span
                          onClick={handleClickOpenOneTimeCharge}
                          style={{
                            cursor: "pointer",
                            fontSize: "14px",
                            fontFamily: "monospace",
                            color: "blue",
                          }}
                        >
                          <b style={{ fontSize: "20px" }}>+</b> Add one Time
                          charge
                        </span>
                        <Dialog
                          open={openOneTimeChargeDialog}
                          onClose={handleClose}
                        >
                          <DialogTitle style={{ background: "#F0F8FF" }}>
                            Add one Time charge content
                          </DialogTitle>
                          <div>
                            <div style={{ padding: "5%" }}>
                              <div className="grid-container resp-header">
                                <div>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-unitadd11"
                                  >
                                    Account*
                                  </label>
                                  <FormGroup>
                                    <Dropdown
                                      isOpen={rentincdropdownOpen6}
                                      toggle={toggle7}
                                    >
                                      <DropdownToggle caret>
                                        {oneTimeChargeSchema.values
                                          .onetime_account
                                          ? oneTimeChargeSchema.values
                                              .onetime_account
                                          : "Select"}
                                      </DropdownToggle>
                                      <DropdownMenu
                                        style={{
                                          zIndex: 999,
                                          maxHeight: "280px",
                                          overflowY: "auto",
                                          width: "100%",
                                        }}
                                        name="onetime_account"
                                        onBlur={oneTimeChargeSchema.handleBlur}
                                        onChange={
                                          oneTimeChargeSchema.handleChange
                                        }
                                        value={
                                          oneTimeChargeSchema.values
                                            .onetime_account
                                        }
                                      >
                                        {accountsData.map((account) => (
                                          <>
                                            {account.charge_type ===
                                            "One Time Charge" ? (
                                              <DropdownItem
                                                onClick={() => {
                                                  oneTimeChargeSchema.setFieldValue(
                                                    "onetime_account",
                                                    account.account
                                                  );
                                                }}
                                                key={account.account_id}
                                              >
                                                {account.account}
                                              </DropdownItem>
                                            ) : (
                                              ""
                                            )}
                                          </>
                                        ))}
                                        <DropdownItem
                                          onClick={() =>
                                            AddNewAccountName("One Time Charge")
                                          }
                                        >
                                          Add new account..
                                        </DropdownItem>
                                      </DropdownMenu>
                                      {oneTimeChargeSchema.errors &&
                                      oneTimeChargeSchema.errors
                                        .onetime_account &&
                                      oneTimeChargeSchema.touched &&
                                      oneTimeChargeSchema.touched
                                        .onetime_account &&
                                      oneTimeChargeSchema.values
                                        .onetime_account === "" ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            oneTimeChargeSchema.errors
                                              .onetime_account
                                          }
                                        </div>
                                      ) : null}
                                    </Dropdown>
                                  </FormGroup>
                                </div>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-address"
                                  >
                                    Amount*
                                  </label>
                                  <br />
                                  <FormGroup>
                                    <Input
                                      className="form-control-alternative"
                                      id="input-reserve"
                                      placeholder="$0.00"
                                      type="text"
                                      name="onetime_amount"
                                      onBlur={oneTimeChargeSchema.handleBlur}
                                      onChange={
                                        oneTimeChargeSchema.handleChange
                                      }
                                      value={
                                        oneTimeChargeSchema.values
                                          .onetime_amount
                                      }
                                      onInput={(e) => {
                                        const inputValue = e.target.value;
                                        const numericValue = inputValue.replace(
                                          /\D/g,
                                          ""
                                        ); // Remove non-numeric characters
                                        e.target.value = numericValue;
                                        oneTimeChargeSchema.values.onetime_amount =
                                          numericValue;
                                      }}
                                    />
                                    {oneTimeChargeSchema.errors &&
                                    oneTimeChargeSchema.errors.onetime_amount &&
                                    oneTimeChargeSchema.touched &&
                                    oneTimeChargeSchema.touched
                                      .onetime_amount &&
                                    oneTimeChargeSchema.values
                                      .onetime_amount === "" ? (
                                      <div style={{ color: "red" }}>
                                        {
                                          oneTimeChargeSchema.errors
                                            .onetime_amount
                                        }
                                      </div>
                                    ) : null}
                                  </FormGroup>
                                </FormGroup>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-unitadd12"
                                  >
                                    Memo*
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-unitadd12"
                                    type="text"
                                    name="onetime_memo"
                                    onBlur={oneTimeChargeSchema.handleBlur}
                                    onChange={oneTimeChargeSchema.handleChange}
                                    value={
                                      oneTimeChargeSchema.values.onetime_memo
                                    }
                                    onInput={(e) => {
                                      oneTimeChargeSchema.values.onetime_memo =
                                        e.target.value;
                                    }}
                                  />
                                </FormGroup>
                              </div>
                            </div>
                            <DialogActions>
                              <Button
                                type="submit"
                                style={{
                                  backgroundColor: "#007bff",
                                  color: "white",
                                }}
                                onClick={() => {
                                  oneTimeChargeSchema.handleSubmit();
                                }}
                              >
                                Add
                              </Button>
                              <Button onClick={handleClose}>Cancel</Button>
                            </DialogActions>
                          </div>
                        </Dialog>
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* //add new accounts */}
                  <AccountDialog
                    addBankAccountDialogOpen={addBankAccountDialogOpen}
                    setAddBankAccountDialogOpen={setAddBankAccountDialogOpen}
                    accountTypeName={accountTypeName}
                    adminId={accessType?.admin_id}
                  />

                  {/* //reccuring charges Data */}
                  <div>
                    {recurringData.length > 0 ? (
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
                          <Col>Recurring Information</Col>
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
                          <Col>Account</Col>
                          <Col>Amount</Col>
                          <Col>Action</Col>
                        </Row>

                        {recurringData.map((data, index) => (
                          <Row
                            className="w-100 mt-1"
                            style={{
                              fontSize: "14px",
                              textTransform: "capitalize",
                              color: "#000",
                            }}
                            key={index} // Add a unique key to each iterated element
                          >
                            <Col>{data.recuring_account}</Col>
                            <Col>{data.recuring_amount}</Col>
                            <Col>
                              <EditIcon onClick={() => editeReccuring(index)} />
                              <DeleteIcon
                                onClick={() => handleRecurringDelete(index)}
                              />
                            </Col>
                          </Row>
                        ))}
                      </>
                    ) : null}
                  </div>

                  {/* one tme charges */}
                  <div>
                    {oneTimeData.length > 0 ? (
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
                          <Col>One Time Information</Col>
                        </Row>

                        <Row
                          className="w-100 mb-1"
                          style={{
                            fontSize: "17px",
                            color: "#aaa",
                            fontWeight: "bold",
                          }}
                        >
                          <Col>Account</Col>
                          <Col>Amount</Col>
                          <Col>Action</Col>
                        </Row>

                        {oneTimeData.map((data, index) => (
                          <Row
                            className="w-100 mt-1"
                            style={{
                              fontSize: "14px",
                              textTransform: "capitalize",
                              color: "#000",
                            }}
                            key={index}
                          >
                            <Col>{data.onetime_account}</Col>
                            <Col>{data.onetime_amount}</Col>
                            <Col>
                              <EditIcon onClick={() => editOneTime(index)} />
                              <DeleteIcon
                                onClick={() => handleOnetimeDelete(index)}
                              />
                            </Col>
                          </Row>
                        ))}
                      </>
                    ) : null}
                  </div>

                  <hr />

                  {/* uploaded file */}

                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Upload Files (Maximum of 10)
                        </label>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="d-flex">
                    <div className="file-upload-wrapper">
                      <TextField
                        type="file"
                        className="form-control-file d-none"
                        accept="file/*"
                        name="upload_file"
                        id="upload_file"
                        multiple
                        inputProps={{
                          multiple: true,
                          accept: "application/pdf",
                          max: 10,
                        }}
                        onChange={(e) => {
                          fileData(e.target.files);
                        }}
                      />
                      <label for="upload_file" className="btn">
                        Upload
                      </label>
                    </div>
                    <div className="d-flex ">
                      {file.length > 0 &&
                        file?.map((singleFile, index) => (
                          <div
                            key={index}
                            style={{ position: "relative", marginLeft: "50px" }}
                          >
                            {!lease_id ? (
                              <p
                                onClick={() => {
                                  window.open(singleFile.upload_link, "_blank");
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {singleFile?.file_name?.substr(0, 5)}
                                {singleFile?.file_name?.length > 5
                                  ? "..."
                                  : null}
                              </p>
                            ) : (
                              <p
                                onClick={() => {
                                  window.open(singleFile.upload_link, "_blank");
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {singleFile.file_name?.substr(0, 5)}
                                {singleFile.file_name?.length > 5
                                  ? "..."
                                  : null}
                              </p>
                            )}
                            <CloseIcon
                              style={{
                                cursor: "pointer",
                                position: "absolute",
                                left: "64px",
                                top: "-2px",
                              }}
                              onClick={() => deleteFile(index)}
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  <hr />
                  <Row>
                    <Col lg="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Residents center Welcome Email
                        </label>

                        <label
                          className="heading-small text-muted mb-4"
                          htmlFor="input-address"
                        >
                          we send a welcome Email to anyone without Resident
                          Center access
                        </label>
                      </FormGroup>
                    </Col>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            color="primary"
                            value={leaseFormik.values.tenant_residentStatus}
                            onChange={(e) => {
                              leaseFormik.setFieldValue(
                                "tenant_residentStatus",
                                e.target.checked
                              );
                            }}
                          />
                        }
                        labelPlacement="end"
                      />
                    </FormGroup>
                  </Row>

                  <hr />

                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Select Payment Method *
                        </label>
                        <FormGroup>
                          <Dropdown
                            isOpen={paymentOptionDropdawnOpen}
                            toggle={paymentMethodtoggle}
                          >
                            <DropdownToggle caret style={{ width: "100%" }}>
                              {selectPaymentMethod
                                ? selectPaymentMethod
                                : "Select"}
                            </DropdownToggle>
                            <DropdownMenu
                              style={{ width: "100%" }}
                              name="paymentMethod"
                              onBlur={paymentFormin.handleBlur}
                              onChange={(e) => paymentFormin.handleChange(e)}
                              value={paymentFormin.values.paymentMethod}
                            >
                              {selectPaymentMethodData.map((option) => (
                                <DropdownItem
                                  key={option}
                                  onClick={() => {
                                    setSelectPaymentMethod(option);
                                    paymentFormin.setFieldValue(
                                      "paymentMethod",
                                      option
                                    );
                                  }}
                                >
                                  {option}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                          {paymentFormin.errors &&
                          paymentFormin.errors?.paymentMethod &&
                          paymentFormin.touched &&
                          paymentFormin.touched?.paymentMethod &&
                          paymentFormin.values.paymentMethod === "" ? (
                            <div style={{ color: "red" }}>
                              {paymentFormin.errors.paymentMethod}
                            </div>
                          ) : null}
                        </FormGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Col sm="12">
                    {selectPaymentMethod === "AutoPayment" ? (
                      <>
                        <Row className="mb-3">
                          <Col xs="12" sm="7">
                            <Row>
                              <Col xs="12" sm="5">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor={`card_number`}
                                  >
                                    Card Number *
                                  </label>
                                  <Input
                                    type="text"
                                    id={`card_number`}
                                    placeholder="0000 0000 0000 0000"
                                    className="no-spinner"
                                    name={`card_number`}
                                    value={paymentFormin.values.card_number}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      paymentFormin.setFieldValue(
                                        `card_number`,
                                        inputValue
                                      );
                                    }}
                                  />
                                  {paymentFormin.errors &&
                                  paymentFormin.errors.card_number ? (
                                    <div style={{ color: "red" }}>
                                      {paymentFormin.errors.card_number}
                                    </div>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col xs="12" sm="5">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor={`exp_date`}
                                  >
                                    Expiration Date *
                                  </label>
                                  <Input
                                    type="text"
                                    id={`exp_date`}
                                    name={`exp_date`}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      paymentFormin.setFieldValue(
                                        `exp_date`,
                                        inputValue
                                      );
                                    }}
                                    value={paymentFormin.values.exp_date}
                                    placeholder="MM/YYYY"
                                  />
                                  {paymentFormin.errors &&
                                  paymentFormin.errors.exp_date ? (
                                    <div style={{ color: "red" }}>
                                      {paymentFormin.errors.exp_date}
                                    </div>
                                  ) : null}
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </>
                    ) : null}
                  </Col>
                  {loader ? (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: "green", cursor: "not-allowed" }}
                      disabled
                    >
                      Loading...
                    </button>
                  ) : lease_id ? (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: "green", cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (selectedTenantData.length !== 0) {
                          leaseFormik.handleSubmit(leaseFormik.values);
                          if (selectPaymentMethod === "AutoPayment") {
                            paymentFormin.handleSubmit();
                          }
                        } else {
                          leaseFormik.handleSubmit(leaseFormik.values);
                          if (selectPaymentMethod === "AutoPayment") {
                            paymentFormin.handleSubmit();
                          }
                          setDisplay(true);
                        }
                      }}
                    >
                      Update Lease
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: "green", cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (selectedTenantData.length !== 0) {
                          leaseFormik.handleSubmit();
                          if (selectPaymentMethod === "AutoPayment") {
                            paymentFormin.handleSubmit();
                          }
                        } else {
                          leaseFormik.handleSubmit();
                          if (selectPaymentMethod === "AutoPayment") {
                            paymentFormin.handleSubmit();
                          }
                          setDisplay(true);
                        }
                      }}
                    >
                      Create Lease
                    </button>
                  )}
                  <Button
                    color="primary"
                    // onClick={handleCloseButtonClick}
                    className="btn btn-primary"
                    style={{
                      background: "white",
                      color: "black",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </Button>
                  {tenantFormik.errors &&
                  tenantFormik.errors?.tenant_password &&
                  leaseFormik.submitCount > 0 ? (
                    <div style={{ color: "red" }}>
                      Tenant Password is missing
                    </div>
                  ) : null}
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
