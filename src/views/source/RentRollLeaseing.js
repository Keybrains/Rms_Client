import { useFormik } from "formik";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  ModalHeader,
  ModalBody,
  Modal,
} from "reactstrap";
import RentRollModal from "./StaffMemberModal";
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
import queryString from "query-string";
import { RotatingLines } from "react-loader-spinner";

const RentRollLeaseing = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_POST_URL;
  const imageGetUrl = process.env.REACT_APP_IMAGE_GET_URL;
  const { lease_id, applicant_id, admin } = useParams();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const data = urlParams.get("data");
  const state = JSON.parse(data);

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
  const [alignment, setAlignment] = useState("Tenant");
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
  const [dataLoader, setDataLoader] = useState(false);

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
      uploaded_file: [],
      tenant_residentStatus: false,
    },
    validationSchema: yup.object({
      rental_id: yup.string().required("Required"),
      unit_id: yup.string().required("Required"),
      lease_type: yup.string().required("Required"),
      start_date: yup.string().required("Required"),
      end_date: yup.string().required("Required"),
    }),
    onSubmit: async () => {
      const res = await handleDateCheck();

      if (res === 200) {
        if (lease_id && applicant_id) {
          addLease();
        } else if (lease_id) {
          updateLease();
        } else {
          addLease();
        }
      } else {
        const errorMessage = `Please select another date range. Overlapping ( ${selectedUnit ? selectedUnit + " - " : ""
          }${selectedProperty} to ${selectedTenantData.tenant_firstName} ${selectedTenantData.tenant_lastName
          }) with existing lease.`;

        leaseFormik.setFieldError("start_date", errorMessage);
      }
    },
  });

  const rentChargeFormik = useFormik({
    initialValues: {
      amount: "",
      memo: "Last Month's Rent",
      charge_type: "Rent",
      account: "Last Month's Rent",
      date: "",
      rent_cycle: "",
      is_paid: false,
      is_repeatable: true,
      is_lateFee: false,
    },
    validationSchema: yup.object({
      amount: yup.number().required("Required"),
      rent_cycle: yup.string().required("Required"),
    }),
  });

  const securityChargeFormik = useFormik({
    initialValues: {
      amount: "",
      memo: "Security Deposite",
      charge_type: "Security Deposite",
      account: "Security Deposite",
      date: moment().format("YYYY-MM-DD"),
      is_paid: false,
      is_repeatable: false,
      is_lateFee: false,
    },
    validationSchema: yup.object({
      amount: yup.number().required("Required"),
    }),
  });

  let recurringFormink = useFormik({
    initialValues: {
      amount: "",
      memo: "Recurring Charge",
      charge_type: "Recurring Charge",
      account: "",
      date: "",
      rent_cycle: "",
      is_repeatable: true,
      is_paid: false,
      is_lateFee: false,
    },
    validationSchema: yup.object({
      amount: yup.string().required("Required"),
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
      toast.success("Recurring Charge Added", {
        position: "top-center",
        autoClose: 1000,
      });
      setOpenRecurringDialog(false);
      resetForm();
    },
  });

  let oneTimeFormik = useFormik({
    initialValues: {
      amount: "",
      memo: "One Time Charge",
      charge_type: "One Time Charge",
      account: "",
      date: "",
      is_repeatable: false,
      is_paid: false,
      is_lateFee: false,
    },
    validationSchema: yup.object({
      amount: yup.string().required("Required"),
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
      toast.success("One Time Charge Added", {
        position: "top-center",
        autoClose: 1000,
      });
      setOpenOneTimeChargeDialog(false);
      resetForm();
    },
  });

  // let paymentFormik = useFormik({
  //   initialValues: { card_number: "", exp_date: "", paymentMethod: "" },
  //   validationSchema: yup.object({
  //     paymentMethod: yup.string().required("Payment Method Required"),
  //     card_number: yup
  //       .number()
  //       .required("Required")
  //       .typeError("Must be a number")
  //       .test(
  //         "is-size-16",
  //         "Card Number must be 16 digits",
  //         (val) => val?.toString().length === 16
  //       ),
  //     exp_date: yup
  //       .string()
  //       .matches(/^(0[1-9]|1[0-2])\/[0-9]{4}$/, "Invalid date format (MM/YYYY)")
  //       .required("Required"),
  //   }),
  // });

  const tenantFormik = useFormik({
    initialValues: {
      tenant_id: "",
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
      tenant_email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      tenant_password: yup
        .string()
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number, and one special case Character"
        )
        .required("Required"),
    }),
    onSubmit: (values) => {
      toast.success("Tenant Added Successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      setSelectedTenantData({
        tenant_firstName: values.tenant_firstName,
        tenant_lastName: values.tenant_lastName,
        tenant_phoneNumber: values.tenant_phoneNumber,
      });
      setOpenTenantsDialog(false);
      setDisplay(false);
    },
  });

  const cosignerFormik = useFormik({
    initialValues: {
      cosigner_id: "",
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
      cosigner_email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      toast.success("Cosigner Added Successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      setOpenTenantsDialog(false);
      setCosignerData(values);
    },
  });

  //update lease
  const updateLease = async () => {
    setLoader(true);
    const fileUrl = [];
    if (file) {
      try {
        const uploadPromises = file.map(async (fileItem, i) => {
          if (fileItem instanceof File) {
            try {
              const form = new FormData();
              form.append("files", fileItem);

              const res = await axios.post(`${imageUrl}/images/upload`, form);

              if (
                res &&
                res.data &&
                res.data.files &&
                res.data.files.length > 0
              ) {
                fileUrl.push(res.data.files[0].filename);
                fileItem = res.data.files[0].filename;
              } else {
                console.error("Unexpected response format:", res);
              }
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          } else {
            fileUrl.push(fileItem);
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Error processing file uploads:", error);
      }
    }
    try {
      const entryData = [];
      const rentEntryData = {
        entry_id: rentChargeFormik.values.entry_id,
        memo: rentChargeFormik.values.memo,
        account: rentChargeFormik.values.account,
        amount: rentChargeFormik.values.amount,
        date: rentChargeFormik.values.date,
        rent_cycle: rentChargeFormik.values.rent_cycle,
        is_repeatable: true,
        charge_type: rentChargeFormik.values.charge_type,
      };

      if (rentEntryData) {
        entryData.push(rentEntryData);
      }

      const depoEntryData = {
        entry_id: securityChargeFormik.values.entry_id,
        memo: securityChargeFormik.values.memo,
        account: securityChargeFormik.values.account,
        amount: securityChargeFormik.values.amount,
        date: securityChargeFormik.values.date,
        is_repeatable: false,
        charge_type: securityChargeFormik.values.charge_type,
      };

      if (depoEntryData) {
        entryData.push(depoEntryData);
      }

      recurringData?.map((item) => {
        const data = {
          entry_id: item.entry_id,
          memo: item.memo,
          account: item.account,
          amount: item.amount,
          date: rentChargeFormik.values.date,
          rent_cycle: rentChargeFormik.values.rent_cycle,
          is_repeatable: true,
          charge_type: item.charge_type,
        };
        if (data) {
          entryData.push(data);
        }
        return data;
      });

      oneTimeData?.map((item) => {
        const data = {
          entry_id: item.entry_id,
          memo: item.memo,
          account: item.account,
          amount: item.amount,
          date: rentChargeFormik.values.date,
          is_repeatable: false,
          charge_type: item.charge_type,
        };
        if (data) {
          entryData.push(data);
        }
        return data;
      });

      const object = {
        leaseData: {
          ...leaseFormik.values,
          entry: entryData,
          admin_id: accessType?.admin_id,
          uploaded_file: fileUrl,
          lease_id: lease_id,
        },
        tenantData: { ...tenantFormik.values, admin_id: accessType?.admin_id },
        cosignerData: {
          ...cosignerFormik.values,
          admin_id: accessType?.admin_id,
        },
      };

      const res = await axios.put(
        `${baseUrl}/leases/leases/${lease_id}`,
        object
      );
      if (res.data.statusCode === 200) {
        toast.success("Lease Updated Successfully", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          
          navigate(`/${admin}/RentRoll`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
    setLoader(false);
  };

  const addLease = async () => {
    setLoader(true);
    const fileUrl = [];
    if (file) {
      try {
        const uploadPromises = file.map(async (fileItem, i) => {
          if (fileItem instanceof File) {
            try {
              const form = new FormData();
              form.append("files", fileItem);

              const res = await axios.post(`${imageUrl}/images/upload`, form);

              if (
                res &&
                res.data &&
                res.data.files &&
                res.data.files.length > 0
              ) {
                fileUrl.push(res.data.files[0].filename);
                fileItem = res.data.files[0].filename;
              } else {
                console.error("Unexpected response format:", res);
              }
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          } else {
            fileUrl.push(fileItem);
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Error processing file uploads:", error);
      }
    }

    const entryData = [];
    const rentEntryData = {
      memo: rentChargeFormik.values.memo,
      account: rentChargeFormik.values.account,
      amount: rentChargeFormik.values.amount,
      date: rentChargeFormik.values.date,
      rent_cycle: rentChargeFormik.values.rent_cycle,
      is_repeatable: true,
      charge_type: rentChargeFormik.values.charge_type,
    };

    if (rentEntryData) {
      entryData.push(rentEntryData);
    }

    const depoEntryData = {
      memo: securityChargeFormik.values.memo,
      account: securityChargeFormik.values.account,
      amount: securityChargeFormik.values.amount,
      date: securityChargeFormik.values.date,
      is_repeatable: false,
      charge_type: securityChargeFormik.values.charge_type,
    };

    if (depoEntryData) {
      entryData.push(depoEntryData);
    }

    recurringData?.map((item) => {
      const data = {
        memo: item.memo,
        account: item.account,
        amount: item.amount,
        date: rentChargeFormik.values.date,
        rent_cycle: rentChargeFormik.values.rent_cycle,
        is_repeatable: true,
        charge_type: item.charge_type,
      };
      if (data) {
        entryData.push(data);
      }
      return data;
    });

    oneTimeData?.map((item) => {
      const data = {
        memo: item.memo,
        account: item.account,
        amount: item.amount,
        date: rentChargeFormik.values.date,
        is_repeatable: false,
        charge_type: item.charge_type,
      };
      if (data) {
        entryData.push(data);
      }
      return data;
    });

    const object = {
      leaseData: {
        ...leaseFormik.values,
        entry: entryData,
        admin_id: accessType?.admin_id,
        uploaded_file: fileUrl,
      },
      tenantData: { ...tenantFormik.values, admin_id: accessType?.admin_id },
      cosignerData: { ...cosignerFormik.values, admin_id: accessType?.admin_id },
      chargeData: {
        admin_id: accessType?.admin_id,
          is_leaseAdded: true,
        entry: entryData,
      },
    };

    try {
      const res = await axios.post(`${baseUrl}/leases/leases`, object);
      if (res.data.statusCode === 201) {
        toast.error(res.data.message, {
          position: "top-center",
          autoClose: 5000,
        });
        // Optionally, stop further execution or navigate the user away
        return; // This prevents the code from proceeding further
      }

      if (res.data.statusCode === 200) {
        if (applicant_id) {
          const res2 = await axios.put(
            `${baseUrl}/applicant/applicant/${applicant_id}`,
            {
              isMovedin: true,
              applicant_status: [
                {
                  status: "Approved",
                  statusUpdatedBy: "Admin",
                },
              ],
            }
          );
          if (res2.data.statusCode === 200) {
            toast.success("Lease Added Successfully", {
              position: "top-center",
              autoClose: 1000,
            });
            setTimeout(() => {
          
              navigate(`/${admin}/RentRoll`);
            }, 2000);
           
          }
        } else {
          toast.success("Lease Added Successfully", {
            position: "top-center",
            autoClose: 1000,
          });
          setTimeout(() => {
          
            navigate(`/${admin}/RentRoll`);
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
    setLoader(false);
  };

  //onchange funtions
  const handlePropertyTypeSelect = async (property) => {
    try {
      setselectedProperty(property.rental_adress);
      leaseFormik.setFieldValue("rental_id", property.rental_id);
      setselectedUnit("");
      leaseFormik.setFieldValue("unit_id", "");
      await fetchUnitData(property.rental_id);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleUnitSelect = (unit) => {
    setselectedUnit(unit?.rental_unit);
    leaseFormik.setFieldValue("unit_id", unit?.unit_id);
  };

  useEffect(() => {
    if (state?.unit_id) {
      const property = {
        rental_adress: state.rental_adress,
        rental_id: state.rental_id,
      };
      handlePropertyTypeSelect(property);
      const unit = {
        rental_unit: state.rental_unit,
        unit_id: state.unit_id,
      };
      handleUnitSelect(unit);
    }
  }, []);

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
      tenant_id,
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
        tenant_id,
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
    rentChargeFormik.setFieldValue("rent_cycle", rentcycle);
    recurringFormink.setFieldValue("rent_cycle", rentcycle);

    const startDate = leaseFormik.values.start_date;
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
    recurringFormink.setFieldValue("date", nextDue_date);
    oneTimeFormik.setFieldValue("date", nextDue_date);
    rentChargeFormik.setFieldValue("date", nextDue_date);
    securityChargeFormik.setFieldValue("date", nextDue_date);
  };

  useEffect(() => {
    handleselectedRentCycle(selectedRentCycle);
    handleDateChange(leaseFormik.values.start_date);
  }, [leaseFormik?.values?.start_date]);

  const handleClickOpenRecurring = () => {
    recurringFormink.resetForm();
    setOpenRecurringDialog(true);
  };
  const handleClickOpenOneTimeCharge = () => {
    oneTimeFormik.resetForm();
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
    recurringFormink.setValues({
      amount: recurringData[index].amount,
      account: recurringData[index].account,
      memo: recurringData[index].memo,
      charge_type: "Recurring Charge",
      date: "",
      rent_cycle: "",
      is_paid: false,
      is_lateFee: false,
    });
  };

  const editOneTime = (index) => {
    setOpenOneTimeChargeDialog(true);
    setEditingIndex(index);
    oneTimeFormik.setValues({
      amount: oneTimeData[index].amount,
      account: oneTimeData[index].account,
      memo: oneTimeData[index].memo,
      charge_type: "One Time Charge",
      date: "",
      rent_cycle: "",
      is_paid: false,
      is_lateFee: false,
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

  const handleCloseButtonClick = () => {
    navigate("/" + admin + "/RentRoll");
  };

  const handleDateCheck = async () => {
    const object = {
      lease_id: lease_id,
      tenant_id: tenantFormik.values.tenant_id,
      rental_id: leaseFormik.values.rental_id,
      unit_id: leaseFormik.values.unit_id,
      start_date: leaseFormik.values.start_date,
      end_date: leaseFormik.values.end_date,
    };
    try {
      const { tenant_id, rental_id, start_date, end_date } = object;
      if (
        tenant_id !== "" &&
        rental_id !== "" &&
        start_date !== "" &&
        end_date !== ""
      ) {
        const res = await axios.post(`${baseUrl}/leases/check_lease`, object);
        if (res.data.statusCode === (201 || 400)) {
          toast.warning(res.data.message, {
            position: "top-center",
          });
          return;
        }
        if (res.data.statusCode === 200) {
          return res.data.statusCode;
        }
      } else {
        return 200;
      }
    } catch (error) {
      console.error("Error :", error.message);
    }
  };

  //get data apis
  const fetchPropertyData = async () => {
    if (accessType?.admin_id) {
      try {
        const res = await axios.get(
          `${baseUrl}/rentals/rentals/${accessType?.admin_id}`
        );
        if (res.data.statusCode === 200) {
          setPropertyData(res.data.data);
        } else if (res.data.statusCode === 201) {
          setPropertyData([]);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  };

  const fetchUnitData = async (rental_id) => {
    if (rental_id) {
      try {
        const res = await axios.get(`${baseUrl}/unit/rental_unit/${rental_id}`);
        if (res.data.statusCode === 200) {
          const filteredData = res.data.data.filter(
            (item) => item.rental_unit !== ""
          );
          if (filteredData.length === 0) {
            leaseFormik.setFieldValue("unit_id", res.data.data[0].unit_id);
          }
          setUnitData(filteredData);
        } else if (res.data.statusCode === 201) {
          setUnitData([]);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  };

  const fetchAccounts = async () => {
    if (accessType?.admin_id) {
      try {
        const res = await axios.get(
          `${baseUrl}/accounts/accounts/${accessType?.admin_id}`
        );
        if (res.data.statusCode === 200) {
          setAccountsData(res.data.data);
        } else if (res.data.statusCode === 201) {
          setAccountsData([]);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  };

  const fetchTenantData = async () => {
    if (accessType?.admin_id) {
      try {
        const res = await axios.get(
          `${baseUrl}/tenant/tenants/${accessType?.admin_id}`
        );
        if (res.data.statusCode === 200) {
          setTenantData(res.data.data);
        } else if (res.data.statusCode === 201) {
          setTenantData([]);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  };

  const fetchLeaseData = async () => {
    if (lease_id) {
      setDataLoader(true);
      try {
        const res = await axios.get(`${baseUrl}/leases/get_lease/${lease_id}`);
        if (res.data.statusCode === 200) {
          const { data } = res.data;

          if (!data) {
            console.error("Empty data object received.");
            // Handle the case where no data is returned, possibly by showing an error message
            return;
          }

          const {
            leases,
            tenant,
            rent_charge_data,
            Security_charge_data,
            rec_charge_data,
            one_charge_data,
            unit_data,
          } = data;

          leaseFormik.setValues(leases);
          tenantFormik.setValues(tenant);
          setSelectedTenantData(tenant);

          setSelectedLeaseType(leases?.lease_type || "Fixed");
          setSelectedRentCycle(rent_charge_data?.[0]?.rent_cycle || "Monthly");

          leaseFormik.setFieldValue("lease_type", "Fixed");
          rentChargeFormik.setFieldValue("rent_cycle", "Monthly");
          recurringFormink.setFieldValue("rent_cycle", "Monthly");

          if (rent_charge_data) {
            rentChargeFormik.setValues(rent_charge_data?.[0]);
          }
          if (Security_charge_data) {
            securityChargeFormik.setValues(Security_charge_data?.[0]);
          }
          if (rec_charge_data) {
            setRecurringData(rec_charge_data || []);
          }
          if (one_charge_data) {
            setOneTimeData(one_charge_data || []);
          }

          if (leases && propertyData) {
            const property = propertyData.find(
              (property) => property.rental_id === leases.rental_id
            );
            if (property) {
              await handlePropertyTypeSelect(property);
            }
          }
          setFile(leases?.uploaded_file);
          // Handle unit selection
          handleUnitSelect(unit_data);
          if (applicant_id) {
            setDisplay(true);
          }
        }
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setDataLoader(false);
      }
    }
  };

  //get data apis useeffect
  useEffect(() => {
    fetchPropertyData();
    fetchAccounts();
    fetchTenantData();
  }, [accessType]);

  useEffect(() => {
    if (lease_id) {
      fetchLeaseData();
    }
  }, [lease_id, propertyData]);

  //files set
  const fileData = (files) => {
    const filesArray = [...files];

    if (filesArray.length <= 10 && file?.length === 0) {
      const finalArray = [];

      for (let i = 0; i < filesArray.length; i++) {
        finalArray.push(filesArray[i]);
      }

      setFile([...finalArray]);
    } else if (
      file?.length >= 0 &&
      file?.length <= 10 &&
      filesArray.length + file?.length > 10
    ) {
      setFile([...file]);
    } else {
      const finalArray = [];

      for (let i = 0; i < filesArray.length; i++) {
        finalArray.push(filesArray[i]);
      }

      setFile([...file, ...finalArray]);
    }
  };

  const deleteFile = (index) => {
    const newFile = [...file];
    newFile.splice(index, 1);
    setFile(newFile);
  };

  return (
    <>
      <LeaseHeader id={lease_id} id2={applicant_id} />

      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            {dataLoader ? (
              <Card>
                <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                  <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="50"
                    visible={dataLoader}
                  />
                </div>
              </Card>
            ) : (
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">
                        {lease_id && applicant_id
                          ? "Add Lease"
                          : lease_id
                            ? "Update Lease"
                            : "Add Lease"}
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
                                {/* <DropdownItem onClick={() => openCardForm()}>
                                hie
                              </DropdownItem> */}
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
                        {((selectedProperty && unitData.length > 0) ||
                          selectedUnit !== "") && (
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
                                    {unitData.map((unit) => (
                                      <DropdownItem
                                        key={unit.unit_id}
                                        onClick={() => handleUnitSelect(unit)}
                                      >
                                        {unit.rental_unit}
                                      </DropdownItem>
                                    ))}
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
                            <Dropdown
                              isOpen={leaseDropdownOpen}
                              toggle={toggle3}
                            >
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
                              }}
                              value={moment(
                                leaseFormik.values.start_date
                              ).format("YYYY-MM-DD")}
                            />
                            {leaseFormik.errors &&
                              leaseFormik.errors?.start_date &&
                              leaseFormik.touched &&
                              leaseFormik.touched?.start_date ? (
                              <div style={{ color: "red" }}>
                                {leaseFormik.errors.start_date}
                              </div>
                            ) : null}
                          </FormGroup>
                        </Col>
                        &nbsp; &nbsp; &nbsp;
                        <Col
                          lg="3"
                          style={
                            selectedLeaseType === "At-will(month to month)"
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
                              }}
                              value={moment(leaseFormik.values.end_date).format(
                                "YYYY-MM-DD"
                              )}
                              min={moment(leaseFormik.values.start_date).format(
                                "YYYY-MM-DD"
                              )}
                            />
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
                              setAlignment("Tenant");
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

                          <Dialog
                            open={openTenantsDialog}
                            onClose={handleClose}
                          >
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
                                                  maxHeight:
                                                    "calc(400px - 40px)",
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
                                                    {Array.isArray(
                                                      tenantData
                                                    ) &&
                                                      tenantData
                                                        .filter((tenant) => {
                                                          const fullName = `${tenant.tenant_firstName} ${tenant.tenant_lastName}`;
                                                          return fullName
                                                            .toLowerCase()
                                                            .includes(
                                                              searchQuery.toLowerCase()
                                                            );
                                                        })
                                                        .map(
                                                          (tenant, index) => (
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
                                                          )
                                                        )}
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
                                                  onBlur={
                                                    tenantFormik.handleBlur
                                                  }
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
                                                  onBlur={
                                                    tenantFormik.handleBlur
                                                  }
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
                                                  onBlur={
                                                    tenantFormik.handleBlur
                                                  }
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
                                                    e.target.value =
                                                      numericValue;
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
                                                  <b
                                                    style={{ fontSize: "20px" }}
                                                  >
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
                                                  onBlur={
                                                    tenantFormik.handleBlur
                                                  }
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
                                                  <b
                                                    style={{ fontSize: "20px" }}
                                                  >
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
                                                <div
                                                  style={{ display: "flex" }}
                                                >
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
                                                              tenantFormik
                                                                .values
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
                                                              tenantFormik
                                                                .values
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
                                                              tenantFormik
                                                                .values.comments
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
                                                <b>+ </b>&nbsp; Emergency
                                                Contact
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
                                                              tenantFormik
                                                                ?.values
                                                                ?.emergency_contact
                                                                ?.name
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
                                                            Relationship to
                                                            Tenant
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
                                                              tenantFormik
                                                                ?.values
                                                                ?.emergency_contact
                                                                ?.relation
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
                                                            name="emergency_contact.email"
                                                            onBlur={
                                                              tenantFormik.handleBlur
                                                            }
                                                            onChange={
                                                              tenantFormik.handleChange
                                                            }
                                                            value={
                                                              tenantFormik
                                                                ?.values
                                                                ?.emergency_contact
                                                                ?.email
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
                                                              tenantFormik
                                                                ?.values
                                                                ?.emergency_contact
                                                                ?.phoneNumber
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
                                                  </CardBody>
                                                </Card>
                                              </Collapse>
                                            </div>
                                          </div>
                                        )}

                                        <button
                                          type="submit"
                                          className="btn btn-primary"
                                          disabled={!tenantFormik?.isValid}
                                          onClick={() => {
                                            tenantFormik.handleSubmit();
                                          }}
                                        >
                                          Add Tenant
                                        </button>
                                        <Button
                                          onClick={() => {
                                            handleClose();
                                            tenantFormik.resetForm();
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        {/* Conditional message */}
                                        {!tenantFormik?.isValid && (
                                          <div
                                            style={{
                                              color: "red",
                                              marginTop: "10px",
                                            }}
                                          >
                                            Please fill in all fields correctly.
                                          </div>
                                        )}
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
                                                onBlur={
                                                  cosignerFormik.handleBlur
                                                }
                                                onChange={(e) =>
                                                  cosignerFormik.handleChange(e)
                                                }
                                                value={
                                                  cosignerFormik?.values
                                                    ?.cosigner_firstName
                                                }
                                              />
                                              {cosignerFormik?.errors &&
                                                cosignerFormik.errors
                                                  ?.cosigner_firstName &&
                                                cosignerFormik.touched &&
                                                cosignerFormik.touched
                                                  ?.cosigner_firstName ? (
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
                                                onBlur={
                                                  cosignerFormik.handleBlur
                                                }
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
                                                  ?.cosigner_lastName ? (
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
                                                onBlur={
                                                  cosignerFormik.handleBlur
                                                }
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
                                                    inputValue.replace(
                                                      /\D/g,
                                                      ""
                                                    ); // Remove non-numeric characters
                                                  e.target.value = numericValue;
                                                }}
                                              />
                                              {cosignerFormik.errors &&
                                                cosignerFormik.errors
                                                  .cosigner_phoneNumber &&
                                                cosignerFormik.touched &&
                                                cosignerFormik.touched
                                                  .cosigner_phoneNumber ? (
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
                                                onBlur={
                                                  cosignerFormik.handleBlur
                                                }
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
                                                  .cosigner_email ? (
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
                                                onBlur={
                                                  cosignerFormik.handleBlur
                                                }
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
                                                  .{" "}
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
                                          disabled={!cosignerFormik.isValid}
                                          onClick={() => {
                                            cosignerFormik.handleSubmit();
                                          }}
                                        >
                                          Add Cosigner
                                        </button>
                                        <Button
                                          onClick={() => {
                                            handleClose();
                                            cosignerFormik.resetForm();
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        {/* Conditional message */}
                                        {!cosignerFormik.isValid && (
                                          <div
                                            style={{
                                              color: "red",
                                              marginTop: "10px",
                                            }}
                                          >
                                            Please fill in all fields correctly.
                                          </div>
                                        )}
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
                                  <Col>
                                    {selectedTenantData.tenant_firstName}
                                  </Col>
                                  <Col>
                                    {selectedTenantData.tenant_lastName}
                                  </Col>
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
                                    <Col>
                                      {cosignerData.cosigner_phoneNumber}
                                    </Col>
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
                                  onBlur={rentChargeFormik.handleBlur}
                                  onChange={(e) =>
                                    rentChargeFormik.handleChange(e)
                                  }
                                  value={rentChargeFormik.values.rent_cycle}
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
                            {rentChargeFormik.errors &&
                              rentChargeFormik.errors?.rent_cycle &&
                              rentChargeFormik.touched &&
                              rentChargeFormik.touched?.rent_cycle ? (
                              <div style={{ color: "red" }}>
                                {rentChargeFormik.errors.rent_cycle}
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
                                      onBlur={rentChargeFormik.handleBlur}
                                      value={rentChargeFormik.values.amount}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const numericValue = inputValue.replace(
                                          /\D/g,
                                          ""
                                        );
                                        rentChargeFormik.values.amount =
                                          numericValue;
                                        rentChargeFormik.handleChange({
                                          target: {
                                            name: "amount",
                                            value: numericValue,
                                          },
                                        });
                                      }}
                                    />
                                    {rentChargeFormik.errors &&
                                      rentChargeFormik.errors.amount &&
                                      rentChargeFormik.touched &&
                                      rentChargeFormik.touched.amount ? (
                                      <div style={{ color: "red" }}>
                                        {rentChargeFormik.errors.amount}
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
                                    onBlur={rentChargeFormik.handleBlur}
                                    onChange={(e) => {
                                      rentChargeFormik.handleChange(e);
                                      securityChargeFormik.handleChange(e);
                                      recurringFormink.handleChange(e);
                                      oneTimeFormik.handleChange(e);
                                    }}
                                    value={rentChargeFormik.values.date}
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
                                    onBlur={rentChargeFormik.handleBlur}
                                    onChange={rentChargeFormik.handleChange}
                                    value={rentChargeFormik.values.memo}
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
                                  name="amount"
                                  onBlur={securityChargeFormik.handleBlur}
                                  onChange={securityChargeFormik.handleChange}
                                  value={securityChargeFormik.values.amount}
                                  onInput={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );
                                    e.target.value = numericValue;
                                  }}
                                />
                                {securityChargeFormik.errors &&
                                  securityChargeFormik.errors.amount &&
                                  securityChargeFormik.touched &&
                                  securityChargeFormik.touched.amount ? (
                                  <div style={{ color: "red" }}>
                                    {securityChargeFormik.errors.amount}
                                  </div>
                                ) : null}
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
                            <b style={{ fontSize: "20px" }}>+</b>
                            Add Recurring Charge
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
                                          {recurringFormink.values.account
                                            ? recurringFormink.values.account
                                            : "Select"}
                                        </DropdownToggle>
                                        <DropdownMenu
                                          style={{
                                            zIndex: 999,
                                            maxHeight: "280px",
                                            overflowY: "auto",
                                            width: "100%",
                                          }}
                                          name="account"
                                          onBlur={recurringFormink.handleBlur}
                                          onChange={(e) =>
                                            recurringFormink.handleChange(e)
                                          }
                                          value={
                                            recurringFormink.values.account ||
                                            ""
                                          }
                                        >
                                          {accountsData.map((account) => (
                                            <>
                                              {account.charge_type ===
                                                "Recurring Charge" ? (
                                                <DropdownItem
                                                  onClick={() => {
                                                    recurringFormink.setFieldValue(
                                                      "account",
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
                                        {recurringFormink.errors &&
                                          recurringFormink.errors.account &&
                                          recurringFormink.touched &&
                                          recurringFormink.touched.account ? (
                                          <div style={{ color: "red" }}>
                                            {recurringFormink.errors.account}
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
                                        id="amount"
                                        placeholder="$0.00"
                                        type="text"
                                        name="amount"
                                        onBlur={recurringFormink.handleBlur}
                                        value={
                                          recurringFormink.values.amount || ""
                                        }
                                        onChange={(e) =>
                                          recurringFormink.handleChange(e)
                                        }
                                        onInput={(e) => {
                                          const inputValue = e.target.value;
                                          const numericValue =
                                            inputValue.replace(/\D/g, "");
                                          e.target.value = numericValue;
                                        }}
                                      />
                                      {recurringFormink.errors &&
                                        recurringFormink.errors.amount &&
                                        recurringFormink.touched &&
                                        recurringFormink.touched.amount ? (
                                        <div style={{ color: "red" }}>
                                          {recurringFormink.errors.amount}
                                        </div>
                                      ) : null}
                                    </FormGroup>
                                  </FormGroup>
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
                                      onBlur={recurringFormink.handleBlur}
                                      onChange={(e) => {
                                        recurringFormink.values.memo =
                                          e.target.value;
                                        recurringFormink.handleChange(e);
                                      }}
                                      value={recurringFormink.values.memo || ""}
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
                                    recurringFormink.handleSubmit();
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
                            <b style={{ fontSize: "20px" }}>+</b> Add One Time
                            Charge
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
                                          {oneTimeFormik.values.account
                                            ? oneTimeFormik.values.account
                                            : "Select"}
                                        </DropdownToggle>
                                        <DropdownMenu
                                          style={{
                                            zIndex: 999,
                                            maxHeight: "280px",
                                            overflowY: "auto",
                                            width: "100%",
                                          }}
                                          name="account"
                                          onBlur={oneTimeFormik.handleBlur}
                                          onChange={oneTimeFormik.handleChange}
                                          value={oneTimeFormik.values.account}
                                        >
                                          {accountsData.map((account) => (
                                            <>
                                              {account.charge_type ===
                                                "One Time Charge" ? (
                                                <DropdownItem
                                                  onClick={() => {
                                                    oneTimeFormik.setFieldValue(
                                                      "account",
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
                                                "One Time Charge"
                                              )
                                            }
                                          >
                                            Add new account..
                                          </DropdownItem>
                                        </DropdownMenu>
                                        {oneTimeFormik.errors &&
                                          oneTimeFormik.errors.account &&
                                          oneTimeFormik.touched &&
                                          oneTimeFormik.touched.account ? (
                                          <div style={{ color: "red" }}>
                                            {oneTimeFormik.errors.account}
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
                                        name="amount"
                                        onBlur={oneTimeFormik.handleBlur}
                                        onChange={oneTimeFormik.handleChange}
                                        value={oneTimeFormik.values.amount}
                                        onInput={(e) => {
                                          const inputValue = e.target.value;
                                          const numericValue =
                                            inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                                          e.target.value = numericValue;
                                          oneTimeFormik.values.amount =
                                            numericValue;
                                        }}
                                      />
                                      {oneTimeFormik.errors &&
                                        oneTimeFormik.errors.amount &&
                                        oneTimeFormik.touched &&
                                        oneTimeFormik.touched.amount ? (
                                        <div style={{ color: "red" }}>
                                          {oneTimeFormik.errors.amount}
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
                                      name="memo"
                                      onBlur={oneTimeFormik.handleBlur}
                                      onChange={oneTimeFormik.handleChange}
                                      value={oneTimeFormik.values.memo}
                                      onInput={(e) => {
                                        oneTimeFormik.values.memo =
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
                                    oneTimeFormik.handleSubmit();
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
                      fetchAccounts={fetchAccounts}
                    />

                    {/* //Recurring Charges Data */}
                    <div>
                      {recurringData?.length > 0 ? (
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

                          {recurringData?.map((data, index) => (
                            <Row
                              className="w-100 mt-1"
                              style={{
                                fontSize: "14px",
                                textTransform: "capitalize",
                                color: "#000",
                              }}
                              key={index} // Add a unique key to each iterated element
                            >
                              <Col>{data.account}</Col>
                              <Col>{data.amount}</Col>
                              <Col>
                                <EditIcon
                                  onClick={() => editeReccuring(index)}
                                />
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
                      {oneTimeData?.length > 0 ? (
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

                          {oneTimeData?.map((data, index) => (
                            <Row
                              className="w-100 mt-1"
                              style={{
                                fontSize: "14px",
                                textTransform: "capitalize",
                                color: "#000",
                              }}
                              key={index}
                            >
                              <Col>{data.account}</Col>
                              <Col>{data.amount}</Col>
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
                        <label for="upload_file" className="btn btn-primary">
                          Upload
                        </label>
                      </div>
                      <div className="d-flex ">
                        {file.length > 0 &&
                          file?.map((singleFile, index) => (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                marginLeft: "50px",
                              }}
                            >
                              {!lease_id ? (
                                <p
                                  onClick={() => {
                                    if (singleFile) {
                                    }
                                    window.open(
                                      URL.createObjectURL(singleFile),
                                      "_blank"
                                    );
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  {singleFile?.name?.substr(0, 5)}
                                  {singleFile?.name?.length > 5 ? "..." : null}
                                </p>
                              ) : (
                                <p
                                  onClick={() => {
                                    window.open(
                                      `${imageGetUrl}/${singleFile}`,
                                      "_blank"
                                    );
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  {singleFile.substr(0, 5)}
                                  {singleFile?.length > 5 ? "..." : null}
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

                    {/* <hr /> */}

                    {/* <Row>
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
                              onBlur={paymentFormik.handleBlur}
                              onChange={(e) => paymentFormik.handleChange(e)}
                              value={paymentFormik.values.paymentMethod}
                            >
                              {selectPaymentMethodData.map((option) => (
                                <DropdownItem
                                  key={option}
                                  onClick={() => {
                                    setSelectPaymentMethod(option);
                                    paymentFormik.setFieldValue(
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
                          {paymentFormik.errors &&
                          paymentFormik.errors?.paymentMethod &&
                          paymentFormik.touched &&
                          paymentFormik.touched?.paymentMethod &&
                          paymentFormik.values.paymentMethod === "" ? (
                            <div style={{ color: "red" }}>
                              {paymentFormik.errors.paymentMethod}
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
                                    value={paymentFormik.values.card_number}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      paymentFormik.setFieldValue(
                                        `card_number`,
                                        inputValue
                                      );
                                    }}
                                  />
                                  {paymentFormik.errors &&
                                  paymentFormik.errors.card_number ? (
                                    <div style={{ color: "red" }}>
                                      {paymentFormik.errors.card_number}
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
                                      paymentFormik.setFieldValue(
                                        `exp_date`,
                                        inputValue
                                      );
                                    }}
                                    value={paymentFormik.values.exp_date}
                                    placeholder="MM/YYYY"
                                  />
                                  {paymentFormik.errors &&
                                  paymentFormik.errors.exp_date ? (
                                    <div style={{ color: "red" }}>
                                      {paymentFormik.errors.exp_date}
                                    </div>
                                  ) : null}
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </>
                    ) : null}
                  </Col> */}
                    <Row>
                      {loader ? (
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ background: "green", cursor: "not-allowed" }}
                          disabled
                        >
                          Loading...
                        </button>
                      ) : lease_id && !applicant_id ? (
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ background: "green", cursor: "pointer" }}
                          onClick={(e) => {
                            e.preventDefault();
                            if (selectedTenantData.length !== 0) {
                              if (
                                Object.keys(tenantFormik.errors).length !== 0 &&
                                Object.keys(rentChargeFormik.errors).length !==
                                0
                              ) {
                                return;
                              }
                              leaseFormik.handleSubmit();
                              return;
                            } else {
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
                          disabled={
                            !leaseFormik.isValid || !tenantFormik.isValid
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            if (selectedTenantData.length !== 0) {
                              if (
                                Object.keys(tenantFormik.errors).length !== 0 &&
                                Object.keys(rentChargeFormik.errors).length !==
                                0
                              ) {
                                return;
                              }
                              leaseFormik.handleSubmit();
                              return;
                            } else {
                              setDisplay(true);
                            }
                          }}
                        >
                          Create Lease
                        </button>
                      )}
                      <Button
                        // color="primary"
                        onClick={handleCloseButtonClick}
                        className="btn btn-success"
                        style={{
                          background: "white",
                          color: "black",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </Button>
                      {tenantFormik.errors &&
                        leaseFormik.isValid &&
                        tenantFormik.errors?.tenant_password &&
                        leaseFormik.submitCount > 0 ? (
                        <div style={{ color: "red" }}>
                          Tenant Password is missing
                        </div>
                      ) : null}

                      {!leaseFormik.isValid && (
                        <div style={{ color: "red", marginTop: "10px" }}>
                          Please fill in all fields correctly.
                        </div>
                      )}
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
};

export default RentRollLeaseing;
