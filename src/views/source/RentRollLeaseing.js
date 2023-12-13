import React, { useEffect } from "react";
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
  Label,
} from "reactstrap";

import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
// import RentalHeader from "components/Headers/RentalHeader.js";
// import TenantsHeader from "components/Headers/TenantsHeader";
import Checkbox from "@mui/material/Checkbox";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
// import HomeIcon from "@mui/icons-material/Home";
// import BusinessIcon from "@mui/icons-material/Business";
import DialogTitle from "@mui/material/DialogTitle";
// import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { FormControlLabel, Paper, Switch, TextField } from "@mui/material";
import LeaseHeader from "components/Headers/LeaseHeader.js";
// import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Leaseing.css";
import swal from "sweetalert";
// import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "universal-cookie";
import AccountDialog from "components/AccountDialog";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { useLocation } from "react-router-dom";
const RentRollLeaseing = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id, entryIndex } = useParams();
  const location = useLocation();
  const { state } = location;
  const yourData = state && state.fromComponent;
  // console.log(yourData, "yourData");
  // console.log(id, propertyId, "propertyId");
  const [tenantData, setTenantData] = useState([]);
  const [selectedTenantData, setSelectedTenantData] = useState([]);
  const [checkedCheckbox, setCheckedCheckbox] = useState(null);

  const [cosignerData, setCosignerData] = useState([]);
  const [recurringData, setRecurringData] = useState([]);
  const [oneTimeData, setOneTimeData] = useState([]);
  // const [selectedAccountLevel, setSelectedAccountLevel] =
  //   useState("Parent Account");

  const [alignment, setAlignment] = React.useState("web");
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const [rentdropdownOpen, setrentDropdownOpen] = React.useState(false);
  const [rentincdropdownOpen, setrentincDropdownOpen] = React.useState(false);
  const [rentdropdownOpen1, setrentDropdownOpen1] = React.useState(false);
  const [rentdropdownOpen2, setrentDropdownOpen2] = React.useState(false);
  const [rentdropdownOpen3, setrentDropdownOpen3] = React.useState(false);
  const [selectAccountDropDown, setSelectAccountDropDown] =
    React.useState(false);
  const [selectAccountLevelDropDown, setSelectAccountLevelDropDown] =
    React.useState(false);
  const [AddBankAccountDialogOpen, setAddBankAccountDialogOpen] =
    useState(false);
  const [selectFundTypeDropDown, setSelectFundtypeDropDown] =
    React.useState(false);
  // const [bankdropdownOpen, setbankDropdownOpen] = React.useState(false);

  const [openTenantsDialog, setOpenTenantsDialog] = useState(false);
  const [openOneTimeChargeDialog, setOpenOneTimeChargeDialog] = useState(false);
  const [openRecurringDialog, setOpenRecurringDialog] = useState(false);
  // const [openSplitRentDialog, setOpenSplitRentDialog] = useState(false);
  const [rentincdropdownOpen1, setrentincDropdownOpen1] = React.useState(false);
  const [rentincdropdownOpen2, setrentincDropdownOpen2] = React.useState(false);
  const [rentincdropdownOpen3, setrentincDropdownOpen3] = React.useState(false);
  const [rentincdropdownOpen4, setrentincDropdownOpen4] = React.useState(false);

  const [apiData, setApiData] = useState([]);
  const [isDateRangeUsed, setIsDateRangeUsed] = useState(false);
  const [paymentOptionDropdawnOpen, setPaymentOptionDropdawnOpen] =
    useState(false);
  const [showTenantTable, setShowTenantTable] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState("");

  const [agentdropdownOpen, setagentDropdownOpen] = React.useState(false);
  // const [selectedAccountLevel, setselectedAccountLevel] = useState("");
  const [agentData, setAgentData] = useState([]);

  const [collapseper, setCollapseper] = useState(false);
  const [collapsecont, setCollapsecont] = useState(false);

  const [selectedOption, setSelectedOption] = useState("Tenant");
  // const [selectedValue, setSelectedValue] = useState(null);
  const [showForm, setShowForm] = useState("Tenant");

  const [accountNames, setAccountNames] = useState([]);
  const [RecAccountNames, setRecAccountNames] = useState([]);
  const [oneTimeCharges, setOneTimeCharges] = useState([]);
  const [accountTypeName, setAccountTypeName] = useState([]);
  // const [selectedProp, setSelectedProp] = useState("");
  const [propertyData, setPropertyData] = useState([]);
  // console.log(propertyData, "dsgjhsdkgjh"); // Add this line before rendering the dropdown

  const [userdropdownOpen, setuserDropdownOpen] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [selectedTenants, setSelectedTenants] = useState([]);

  const [toggleApiCall, setToggleApiCall] = useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [unitData, setUnitData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const rentOptions = [
    "Daily",
    "Weekly",
    "Every two weeks",
    "Monthly",
    "Every two months",
    "Quarterly",
    "Yearly",
  ];
  const selectPaymentMethod = ["Manually", "AutoPayment"];
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const toggle = () => setagentDropdownOpen((prevState) => !prevState);
  const toggle1 = () =>
    setSelectAccountLevelDropDown((prevState) => !prevState);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const toggle3 = () => setrentDropdownOpen((prevState) => !prevState);
  const toggle4 = () => setrentincDropdownOpen((prevState) => !prevState);
  const toggle5 = () => setrentDropdownOpen1((prevState) => !prevState);
  const toggle6 = () => setrentDropdownOpen2((prevState) => !prevState);
  const toggle7 = () => setrentDropdownOpen3((prevState) => !prevState);
  const toggle8 = () => setSelectAccountDropDown((prevState) => !prevState);
  const toggle9 = () => setuserDropdownOpen((prevState) => !prevState);
  const toggle10 = () => setSelectFundtypeDropDown((prevState) => !prevState);
  const toggle11 = () => {
    setUnitDropdownOpen((prevState) => !prevState);
  };
  const paymentMethodtoggle = () =>
    setPaymentOptionDropdawnOpen((prevState) => !prevState);
  const handleClick = (event) => {
    setrentincDropdownOpen1((current) => !current);
  };

  const handleChange = (value) => {
    setShowTenantTable(!showTenantTable);
    console.log(value, "valuesForm handle change");
    setAlignment(value);
  };

  const [signature, setSignature] = useState("Signed");
  const handleSignatureChange = (event) => {
    setSignature(event.target.value);
  };

  const handleClick1 = (event) => {
    setrentincDropdownOpen2((current) => !current);
  };

  const handleClick2 = (event) => {
    setrentincDropdownOpen3((current) => !current);
  };

  const handleClick3 = (event) => {
    setrentincDropdownOpen4((current) => !current);
  };

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent.agent_name);
  };

  const handleClickOpenOneTimeCharge = () => {
    oneTimeChargeSchema.setValues({
      onetime_amount: "",
      onetime_account: "",
      // onetime_Due_date: "",
      onetime_memo: "",
    });
    setOpenOneTimeChargeDialog(true);
  };

  const handleClickOpenRecurring = () => {
    recurringChargeSchema.setValues({
      recuring_amount: "",
      recuring_account: "",
      recuringmemo: "",
    });
    setOpenRecurringDialog(true);
  };

  const toggleAddBankDialog = () => {
    setAddBankAccountDialogOpen((prevState) => !prevState);
  };
  const handleCloseDialog = () => {
    setAddBankAccountDialogOpen(false);
  };
  const handleClose = () => {
    setOpenTenantsDialog(false);
    setOpenOneTimeChargeDialog(false);
    setOpenRecurringDialog(false);
    // setOpenSplitRentDialog(false);
  };

  const toggleper = () => {
    setCollapseper(!collapseper);
  };

  const togglecont = () => {
    setCollapsecont(!collapsecont);
  };

  // const handleOptionClick = (option) => {
  //   setSelectedOption(option);
  //   setShowForm(true);
  // };
  const fetchUnitsByProperty = async (propertyType) => {
    try {
      const response = await fetch(
        `${baseUrl}/propertyunit/rentals_property/${propertyType}`
      );
      const data = await response.json();
      // Ensure that units are extracted correctly and set as an array
      const units = data?.data || [];
      return units;
    } catch (error) {
      console.error("Error fetching units:", error);
      return [];
    }
  };
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [ownerData, setOwnerData] = useState({});
  console.log(ownerData, "ownerData");
  // console.log(selectedPropertyType, "selectedPropertyType")
  const handlePropertyTypeSelect = async (propertyType, property) => {
    setSelectedPropertyType(propertyType);
    setPropertyId(property._id);
    entrySchema.values.rental_adress = propertyType;
    setSelectedUnit(""); // Reset selected unit when a new property is selected
    setOwnerData(property);
    try {
      const units = await fetchUnitsByProperty(propertyType);
      console.log(units, "units"); // Check the received units in the console
      setUnitData(units); // Set the received units in the unitData state
    } catch (error) {
      console.error("Error handling selected property:", error);
    }
  };

  const [selectedLeaseType, setselectedLeaseType] = useState("");

  const handleLeaseTypeSelect = (leasetype) => {
    setselectedLeaseType(leasetype);
    // localStorage.setItem("leasetype", leasetype);
    entrySchema.values.lease_type = leasetype;
  };

  const [selectPaymentMethodDropdawn, setSelectPaymentMethodDropdawn] =
    useState("");

  const handleselectedPaymetMethod = (paymentMethod) => {
    setSelectPaymentMethodDropdawn(paymentMethod);
    // localStorage.setItem("leasetype", leasetype);
    entrySchema.setFieldValue("paymentMethod", paymentMethod);
    setSelectPaymentMethodDropdawn(paymentMethod);
  };

  const [selectedRentCycle, setselectedRentCycle] = useState("");
  const handleselectedRentCycle = (rentcycle) => {
    setselectedRentCycle(rentcycle);
    // localStorage.setItem("leasetype", leasetype);
    // entrySchema.values.rent_cycle = rentcycle;
    entrySchema.setFieldValue("rent_cycle", rentcycle);
    // };
    // localStorage.setItem("leasetype", leasetype);
    const startDate = entrySchema.values.start_date;
    let nextDue_date;
    switch (rentcycle) {
      case "Daily":
        nextDue_date = moment(startDate).add(1, "days").format("YYYY-MM-DD");
        break;
      case "Weekly":
        nextDue_date = moment(startDate).add(1, "weeks").format("YYYY-MM-DD");
        break;
      case "Every two weeks":
        nextDue_date = moment(startDate).add(2, "weeks").format("YYYY-MM-DD");
        break;
      case "Monthly":
        nextDue_date = moment(startDate).add(1, "months").format("YYYY-MM-DD");
        break;
      case "Every two months":
        nextDue_date = moment(startDate).add(2, "months").format("YYYY-MM-DD");
        break;
      case "Quarterly":
        nextDue_date = moment(startDate).add(3, "months").format("YYYY-MM-DD");
        break;
      default:
        nextDue_date = moment(startDate).add(1, "years").format("YYYY-MM-DD");
    }
    entrySchema.setFieldValue("nextDue_date", nextDue_date);
    // entrySchema.values.rent_cycle = rentcycle;
    setselectedRentCycle(rentcycle);
  };

  const [selectedAccount, setselectedAccount] = useState("");
  const hadleselectedAccount = (account) => {
    setselectedAccount(account);
    // localStorage.setItem("leasetype", leasetype);
  };

  const [rIndex, setRIndex] = useState(0);
  const [cIndex, setCIndex] = useState(0);

  const [selectedOneTimeAccount, setselectedOneTimeAccount] = useState("");
  const hadleselectedOneTimeAccount = (account) => {
    setselectedOneTimeAccount(account);
    oneTimeChargeSchema.values.onetime_account = account;
    // localStorage.setItem("leasetype", leasetype);
  };

  const [selectedRecuringAccount, setselectedRecuringAccount] = useState("");
  const hadleselectedRecuringAccount = (account) => {
    setselectedRecuringAccount(account);
    recurringChargeSchema.values.recuring_account = account;
    // localStorage.setItem("leasetype", leasetype);
  };

  const [selectedFrequency, setselectedFrequency] = useState("");
  const hadleselectedFrequency = (frequency) => {
    setselectedFrequency(frequency);
    // localStorage.setItem("leasetype", leasetype);
  };

  const [selectedAccountType, setselectedAccountType] = useState("");
  const hadleselectedAccountType = (frequency) => {
    setselectedAccountType(frequency);
    // localStorage.setItem("leasetype", leasetype);
  };

  const [selectedAccountLevel, setselectedAccountLevel] = useState("");
  const hadleselectedAccountLevel = (level) => {
    setselectedAccountLevel(level);
  };

  const [selectedFundType, setselectedFundType] = useState("");
  const hadleselectedFundType = (level) => {
    setselectedFundType(level);
  };

  const handleCloseButtonClick = () => {
    // Use history.push to navigate to the PropertiesTable page
    navigate("../TenantsTable");
  };
  const AddNewAccountName = async (accountName) => {
    toggleAddBankDialog();
    setAccountTypeName(accountName);
  };

  const [display, setDisplay] = React.useState(false);
  const handleAddTenant = () => {
    if (selectedTenants.length === 0) {
      const newTenantDetails = {
        firstName: tenantsSchema.values.tenant_firstName,
        lastName: tenantsSchema.values.tenant_lastName,
        mobileNumber: tenantsSchema.values.tenant_mobileNumber,
        email: tenantsSchema.values.tenant_email,
        tenant_password: tenantsSchema.values.tenant_password,
      };
      setSelectedTenantData(newTenantDetails);
      if (!id) {
        swal("Success!", "New tenant added successfully", "success");
      }
    } else {
      setSelectedTenants([]);
      const selectedTenant = selectedTenants[0];
      // console.log(selectedTenants, "selectedTenants");
      const tenantParts = selectedTenant.split(" ");
      // leaseFormik.setFieldValue("tenant_firstName", tenantParts[0] || "");
      // leaseFormik.setFieldValue("tenant_lastName", tenantParts[1] || "");
      // leaseFormik.setFieldValue("tenant_mobileNumber", tenantParts[2] || "");
      // leaseFormik.setFieldValue("tenant_email", tenantParts[3] || "");
      // leaseFormik.setFieldValue("textpayer_id", tenantParts[4] || "");
      // leaseFormik.setFieldValue("birth_date", tenantParts[5] || "");
      // leaseFormik.setFieldValue("comments", tenantParts[6] || "");
      // leaseFormik.setFieldValue("contact_name", tenantParts[7] || "");
      // leaseFormik.setFieldValue("relationship_tenants", tenantParts[8] || "");
      // leaseFormik.setFieldValue("email", tenantParts[9] || "");
      // leaseFormik.setFieldValue("emergency_PhoneNumber", tenantParts[10] || "");
      // leaseFormik.setFieldValue("tenant_password", tenantParts[11] || "");
      // leaseFormik.setFieldValue("tenant_workNumber", tenantParts[12] || "");
      // leaseFormik.setFieldValue("alternate_email", tenantParts[13] || "");

      const tenantDetails = {
        firstName: tenantParts[0],
        lastName: tenantParts[1],
        mobileNumber: tenantParts[2],
        tenant_password:tenantParts[11],

        // textpayerid: tenantParts[3],
        // birthdate: tenantParts[4],
        // comments: tenantParts[5],
        // contactname: tenantParts[7],
        // realationwithtenants: tenantParts[8],
        // email: tenantParts[8],
        // realationwithtenants: tenantParts[8],

        // Add other details as needed
      };
      setSelectedTenantData(tenantDetails);

      swal("Success!", "Tenant details Added", "success");
    }
    setDisplay(false);
  };

  const handleAddCosigner = () => {
    const newCosigner = {
      firstName: cosignerSchema.values.cosigner_firstName,
      lastName: cosignerSchema.values.cosigner_lastName,
      mobileNumber: cosignerSchema.values.cosigner_mobileNumber,
    };
    setCosignerData(newCosigner);
    swal("Success!", "Cosigner added successfully", "success");
  };

  const [mode, setMode] = useState("Add");
  const [rindex, setrIndex] = useState("Add");
  const [cindex, setcIndex] = useState("Add");

  const handleAddRecurring = () => {
    const newRecurring = {
      recuring_amount: recurringChargeSchema.values.recuring_amount,
      recuring_account: recurringChargeSchema.values.recuring_account,
      // recuringnextDue_date: leaseFormik.values.recuringnextDue_date,
      recuringmemo:
        recurringChargeSchema.values.recuringmemo || "Recurring Charge",
      // recuringfrequency: leaseFormik.values.recuringfrequency,
    };

    // console.log(newRecurring, "yash")
    if (mode === "update") {
      setRecurringData((prevData) => {
        // Use map to update the element at the specified index
        return prevData.map((item, index) =>
          index === rindex ? newRecurring : item
        );
      });
      swal("Success!", "Recurring updated successfully", "success");
    } else {
      setRecurringData((prevData) => {
        // Check if prevData is an array before spreading
        if (!Array.isArray(prevData)) {
          return [newRecurring]; // Initialize a new array if prevData is not an array
        }
        return [...prevData, newRecurring];
      });
      swal("Success!", "Recurring added successfully", "success");
    }

    setMode("Add");
  };

  const handleAddOneTime = () => {
    const newOneTime = {
      onetime_amount: oneTimeChargeSchema.values.onetime_amount,
      onetime_account: oneTimeChargeSchema.values.onetime_account,
      // recuringnextDue_date: leaseFormik.values.recuringnextDue_date,
      onetime_memo:
        oneTimeChargeSchema.values.onetime_memo || "One Time Charge",
      // recuringfrequency: leaseFormik.values.recuringfrequency,
    };

    // console.log(newRecurring, "yash")
    if (mode === "update") {
      setOneTimeData((prevData) => {
        // Use map to update the element at the specified index
        return prevData.map((item, index) =>
          index === cindex ? newOneTime : item
        );
      });
      swal("Success!", "Recurring updated successfully", "success");
    } else {
      setOneTimeData((prevData) => {
        // Check if prevData is an array before spreading
        if (!Array.isArray(prevData)) {
          return [newOneTime]; // Initialize a new array if prevData is not an array
        }
        return [...prevData, newOneTime];
      });
      swal("Success!", "Recurring added successfully", "success");
    }

    setMode("Add");
  };

  const handleTenantDelete = () => {
    setSelectedTenantData({});
    setCheckedCheckbox(null);
    tenantsSchema.setValues({
      tenant_firstName: "",
      tenant_lastName: "",
      tenant_unitNumber: "",
      // tenant_phoneNumber: "",
      tenant_mobileNumber: "",
      tenant_workNumber: "",
      tenant_homeNumber: "",
      tenant_faxPhoneNumber: "",
      tenant_email: "",
      tenant_password: "",
      alternate_email: "",
      tenant_residentStatus: "",

      // personal information
      birth_date: "",
      textpayer_id: "",
      comments: "",

      //Emergency contact

      contact_name: "",
      relationship_tenants: "",
      email: "",
      emergency_PhoneNumber: "",
    });
  };

  const handleCosignerDelete = () => {
    setCosignerData([]);
    cosignerSchema.setValues({
      cosigner_firstName: "",
      cosigner_lastName: "",
      cosigner_mobileNumber: "",
      cosigner_workNumber: "",
      cosigner_homeNumber: "",
      cosigner_faxPhoneNumber: "",
      cosigner_email: "",
      cosigner_alternateemail: "",
      cosigner_streetAdress: "",
      cosigner_city: "",
      cosigner_state: "",
      cosigner_zip: "",
      cosigner_country: "",
      cosigner_postalcode: "",
    });
  };

  const handleRecurringDelete = (indexToDelete) => {
    // setRecurringData({});
    setRecurringData((prevData) => {
      // Use filter to exclude the element at the specified index
      return prevData.filter((data, index) => index !== indexToDelete);
    });
  };

  const handleOnetimeDelete = (indexToDelete) => {
    setOneTimeData((prevData) => {
      // Use filter to exclude the element at the specified index
      return prevData.filter((data, index) => index !== indexToDelete);
    });
  };
  // Define a function to handle closing the dialog and navigating
  const handleDialogClose = () => {
    // navigate("/admin/Leaseing");
    setOpenTenantsDialog(false);
    setOpenOneTimeChargeDialog(false);
    setOpenRecurringDialog(false);
    // setOpenSplitRentDialog(false);
  };
  // <button type="submit" className="btn btn-primary" onClick={handleDialogClose}>
  //   Add Tenant
  // </button>

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setselectedAccountLevel(value);
  };
  const [isDateUnavailable, setIsDateUnavailable] = useState(false);
  const handleDateChange = (date) => {
    const nextDate = moment(date).add(1, "months").format("YYYY-MM-DD");
    entrySchema.values.end_date = nextDate;
    setIsDateUnavailable(false);
    checkDate(date);
  };

  const [file, setFile] = useState("");
  let navigate = useNavigate();

  const handleAdd = async (values) => {
    values["account_name "] = selectedAccount;
    values["account_type"] = selectedAccountType;
    values["parent_account"] = selectedAccountLevel;
    values["fund_type"] = selectedFundType;

    // console.log(values, "values");
    try {
      // values["property_type"] = localStorage.getItem("propertyType");
      const res = await axios.post(`${baseUrl}/addaccount/addaccount`, values);
      if (res.data.statusCode === 200) {
        swal("", res.data.message, "success");
        navigate("/admin/Leaseing");
      } else {
        swal("", res.data.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const fileData = (file) => {
  //   //setImgLoader(true);
  //   const dataArray = new FormData();
  //   dataArray.append("b_video", file);

  //   let url = "https://cdn.brandingprofitable.com/image_upload.php/";
  //   axios
  //     .post(url, dataArray, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((res) => {
  //       //setImgLoader(false);
  //       const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
  //       console.log(imagePath, "imagePath");
  //       setFile(imagePath);
  //     })
  //     .catch((err) => {
  //       //setImgLoader(false);
  //       console.log("Error uploading image:", err);
  //     });
  // };
  // console.log(propertyId, "porpeorjinhb");
  const fileData = (files) => {
    //setImgLoader(true);
    // console.log(files, "file");
    const filesArray = [...files];

    if (filesArray.length <= 10 && file.length === 0) {
      const finalArray = [];
      // i want to loop and create object
      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: localStorage.getItem("user_id"),
          file_name: filesArray[i].name,
        };
        // Do something with the object... push it to final array
        finalArray.push(object);
      }
      setFile([...finalArray]);
      entrySchema.setFieldValue("upload_file", [...finalArray]);
    } else if (
      file.length >= 0 &&
      file.length <= 10 &&
      filesArray.length + file.length > 10
    ) {
      setFile([...file]);
      entrySchema.setFieldValue("upload_file", [...file]);
    } else {
      const finalArray = [];

      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: localStorage.getItem("user_id"),
          file_name: filesArray[i].name,
        };
        // Do something with the object... push it to final array
        finalArray.push(object);
      }
      setFile([...file, ...finalArray]);

      entrySchema.setFieldValue("upload_file", [...file, ...finalArray]);
    }

    // console.log(file, "fileanaadsaa");

    const dataArray = new FormData();
    dataArray.append("b_video", files);

    let url = "https://cdn.brandingprofitable.com/image_upload.php/";
    axios
      .post(url, dataArray, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        //setImgLoader(false);
        const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
        // console.log(imagePath, "imagePath");
        // setFile(imagePath);
      })
      .catch((err) => {
        //setImgLoader(false);
        console.log("Error uploading image:", err);
      });
  };
  const deleteFile = (index) => {
    const newFile = [...file];
    newFile.splice(index, 1);
    setFile(newFile);
  };

  const handleOpenFile = (item) => {
    console.log(file, "fike");
    if (file.length > 0) {
      //   const fileToOpen = file?.filter((file) => {
      //     return file.name === item.name;
      // });
      // console.log(fileToOpen, "fileToOpen");
      console.log(item, "item");
      const url = URL.createObjectURL(item);
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch(`${baseUrl}/rentals/allproperty`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setPropertyData(data.data);
          console.log(data.data, "gdasga");
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  }, []);

  const fetchingAccountNames = async () => {
    console.log("fetching account names");
    fetch(`${baseUrl}/addaccount/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          // console.log(data.data,'Data from adding the account'); // Add this line to check the data
          setAccountNames(data.data);
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  };

  const fetchingRecAccountNames = async () => {
    console.log("fetching rec accounr names");
    fetch(`${baseUrl}/recurringAcc/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          // console.log(data.data,'Data from adding the account'); // Add this line to check the data
          setRecAccountNames(data.data);
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  };

  const fetchingOneTimeCharges = async () => {
    // console.log("fetcjhiine pne rime charges");
    fetch(`${baseUrl}/onetimecharge/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          // console.log(data.data,'Data from adding the account'); // Add this line to check the data
          setOneTimeCharges(data.data);
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      });
  };

  // const AddNewAccountName = async (accountName) => {
  //   toggleAddBankDialog();
  //   setAccountTypeName(accountName);
  // };

  useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetchingAccountNames();
    fetchingRecAccountNames();
    fetchingOneTimeCharges();
  }, [toggleApiCall]);

  // console.log(accountNames, "accountNames after handle add");

  useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetchingAccountNames();
    fetchingRecAccountNames();
    fetchingOneTimeCharges();
  }, []);

  // useEffect(() => {
  //   // Make an HTTP GET request to your Express API endpoint
  //   fetch("https://propertymanager.cloudpress.host/api/addaccount/find_accountname")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.statusCode === 200) {
  //         console.log(data.data); // Add this line to check the data
  //         setAccountNames(data.data);
  //       } else {
  //         // Handle error
  // console.error("Error:", data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       // Handle network error
  //       console.error("Network error:", error);
  //     });
  // }, []);

  useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch(`${baseUrl}/addagent/find_agentname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setAgentData(data.data);
          // console.log(data);
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  }, []);

  const handleCheckboxChange = (event, tenantInfo, mobileNumber) => {
    if (checkedCheckbox === mobileNumber) {
      // If the checkbox is already checked, uncheck it
      setCheckedCheckbox(null);
    } else {
      // Otherwise, check the checkbox
      setCheckedCheckbox(mobileNumber);
    }
    // Toggle the selected tenants in the state when their checkboxes are clicked
    if (event.target.checked) {
      // console.log(selectedTenants)
      setSelectedTenants([tenantInfo, ...selectedTenants]);
      tenantsSchema.setValues({
        //   Add tenants
        tenant_firstName: tenantInfo.tenant_firstName,
        tenant_lastName: tenantInfo.tenant_lastName,
        tenant_unitNumber: tenantInfo.tenant_unitNumber,
        // tenant_phoneNumber: { type: Number },
        tenant_mobileNumber: tenantInfo.tenant_mobileNumber,
        tenant_workNumber: tenantInfo.tenant_workNumber,
        tenant_homeNumber: tenantInfo.tenant_homeNumber,
        tenant_faxPhoneNumber: tenantInfo.tenant_faxPhoneNumber,
        tenant_email: tenantInfo.tenant_email,
        tenant_password: tenantInfo.tenant_password,
        alternate_email: tenantInfo.alternate_email,
        tenant_residentStatus: tenantInfo.tenant_residentStatus,

        // personal information
        birth_date: tenantInfo.birth_date,
        textpayer_id: tenantInfo.textpayer_id,
        comments: tenantInfo.comments,

        //Emergency contact

        contact_name: tenantInfo.contact_name,
        relationship_tenants: tenantInfo.relationship_tenants,
        email: tenantInfo.email,
        emergency_PhoneNumber: tenantInfo.emergency_PhoneNumber,
      });
      // setShowTenantTable(false);
      console.log(tenantInfo.tenant_firstName, "yup", tenantsSchema.values);
    } else {
      // console.log(selectedTenants)
      setSelectedTenants(
        selectedTenants.filter((tenant) => tenant !== tenantInfo)
      );
      tenantsSchema.setValues({
        tenant_firstName: "",
        tenant_lastName: "",
        tenant_unitNumber: "",
        // tenant_phoneNumber: "",
        tenant_mobileNumber: "",
        tenant_workNumber: "",
        tenant_homeNumber: "",
        tenant_faxPhoneNumber: "",
        tenant_email: "",
        tenant_password: "",
        alternate_email: "",
        tenant_residentStatus: "",

        // personal information
        birth_date: "",
        textpayer_id: "",
        comments: "",

        //Emergency contact

        contact_name: "",
        relationship_tenants: "",
        email: "",
        emergency_PhoneNumber: "",
      });
    }
  };

  useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch(`${baseUrl}/tenant/existing/tenant`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setTenantData(data.data);
          // console.log("here is my data", data.data);
        } else {
          // Handle error
          // console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  }, []);
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

  let accountFormik = useFormik({
    initialValues: {
      // add account
      account_name: "",
      account_type: "",
      parent_account: "",
      account_number: "",
      fund_type: "",
      cash_flow: "",
      notes: "",

      //account level (sub account)
    },
    validationSchema: yup.object({
      account_name: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleAdd(values);
      console.log(values, "values");
    },
  });

  // const leaseValidationSchema = yup.object({
  //   // tenant_firstName: yup.string().required("Required"),
  //   // tenant_lastName: yup.string().required("Required"),
  //   // tenant_mobileNumber: yup.string().required("Required"),
  //   // tenant_email: yup.string().required("Required"),
  //   // tenant_password: yup
  //   //   .string()
  //   //   .min(8, "Password is too short")
  //   //   .matches(
  //   //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  //   //     "Must Contain One Uppercase, One Lowercase, One Number, and one special case Character"
  //   //   ),
  //   entries: yup.array().of(
  //     yup.object().shape({
  //       rental_adress: yup.string().required("Required"),
  //       lease_type: yup.string().required("Required"),
  //       start_date: yup.date().required("Required"),
  //       amount: yup.string().required("Required"),
  //       // cosigner_firstName: yup.string().required("Required"),
  //       // cosigner_lastName: yup.string().required("Required"),
  //       // cosigner_mobileNumber: yup.string().required("Required"),
  //       // cosigner_email: yup.string().required("Required"),
  //     })
  //   ),
  // });

  // const consignerValidationSchema = yup.object({
  //   // tenant_firstName: yup.string().required("Required"),
  //   // tenant_lastName: yup.string().required("Required"),
  //   // tenant_mobileNumber: yup.string().required("Required"),
  //   // tenant_email: yup.string().required("Required"),
  //   // tenant_password: yup
  //   //   .string()
  //   //   .min(8, "Password is too short")
  //   //   .matches(
  //   //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  //   //     "Must Contain One Uppercase, One Lowercase, One Number, and one special case Character"
  //   //   ),
  //   entries: yup.array().of(
  //     yup.object().shape({
  //       // rental_adress: yup.string().required("Required"),
  //       // lease_type: yup.string().required("Required"),
  //       // start_date: yup.date().required("Required"),
  //       // amount: yup.string().required("Required"),
  //       cosigner_firstName: yup.string().required("Required"),
  //       cosigner_lastName: yup.string().required("Required"),
  //       cosigner_mobileNumber: yup.string().required("Required"),
  //       cosigner_email: yup.string().required("Required"),
  //     })
  //   ),
  // });
  // const tenantsValidationSchema = yup.object({
  //   tenant_firstName: yup.string().required("Required"),
  //   tenant_lastName: yup.string().required("Required"),
  //   tenant_mobileNumber: yup.string().required("Required"),
  //   tenant_email: yup.string().required("Required"),
  //   tenant_password: yup
  //     .string()
  //     .min(8, "Password is too short")
  //     .matches(
  //       /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  //       "Must Contain One Uppercase, One Lowercase, One Number, and one special case Character"
  //     )
  //     .required("Required"),
  // });

  // let leaseFormik = useFormik({
  //   initialValues: {
  //     // add Tenants

  //     // tenant_firstName: "",
  //     // tenant_lastName: "",
  //     // tenant_mobileNumber: "",
  //     // tenant_email: "",
  //     // tenant_password: "",
  //     // tenant_workNumber: "",
  //     // tenant_unitNumber: "",
  //     // tenant_homeNumber: "",
  //     // tenant_faxPhoneNumber: "",
  //     // alternate_email: "",
  //     // tenant_residentStatus: "",

  //     // birth_date: "",
  //     // textpayer_id: "",
  //     // comments: "",

  //     // contact_name: "",
  //     // relationship_tenants: "",
  //     // email: "",
  //     // emergency_PhoneNumber: "",
  //     entries: [
  //       {
  //         rental_adress: "",
  //         lease_type: "",
  //         start_date: "",
  //         end_date: "",
  //         // leasing_agent: "",
  //         // rent_cycle: "",
  //         amount: "",
  //         // account: "",
  //         // nextDue_date: "",
  //         // memo: "",
  //         // isrenton: false,
  //         // propertyOnRent: false,
  //         // Due_date: "",
  //         // Security_amount: "",
  //         // // add cosigner

  //         // cosigner_firstName: "",
  //         // cosigner_lastName: "",
  //         // cosigner_mobileNumber: "",
  //         // cosigner_workNumber: "",
  //         // cosigner_homeNumber: "",
  //         // cosigner_faxPhoneNumber: "",
  //         // cosigner_email: "",
  //         // cosigner_alternateemail: "",
  //         // cosigner_streetAdress: "",
  //         // cosigner_city: "",
  //         // cosigner_state: "",
  //         // cosigner_zip: "",
  //         // cosigner_country: "",
  //         // cosigner_postalcode: "",

  //         // add recuring charge

  //         recuring_amount: "",
  //         recuring_account: "",
  //         // recuringnextDue_date: "",
  //         recuringmemo: "",
  //         // recuringfrequency: "",

  //         //add one time charge

  //         onetime_amount: "",
  //         onetime_account: "",
  //         onetime_memo: "",

  //         // add account
  //         account_name: "",
  //         account_type: "",
  //         account_number: "",

  //         //upload File
  //         upload_file: "",

  //         // parent account
  //         parent_account: "",
  //         fund_type: "",
  //         cash_flow: "",
  //         notes: "",
  //       },
  //     ],
  //   },
  //   validationSchema: leaseValidationSchema,
  //   onSubmit: (values) => {
  //     if (selectedTenantData.length !== 0 || !tenantsFormik.errors) {
  //       handleSubmit(values);
  //     } else {
  //       setDisplay(true);
  //     }
  //   },
  // });
  // // { console.log(leaseFormik) }

  // let consignerFormik = useFormik({
  //   initialValues: {
  //     // // add Tenants
  //     // tenant_firstName: "",
  //     // tenant_lastName: "",
  //     // tenant_mobileNumber: "",
  //     // tenant_email: "",
  //     // tenant_password: "",
  //     // tenant_workNumber: "",
  //     // tenant_unitNumber: "",
  //     // tenant_homeNumber: "",
  //     // tenant_faxPhoneNumber: "",
  //     // alternate_email: "",
  //     // tenant_residentStatus: "",
  //     // birth_date: "",
  //     // textpayer_id: "",
  //     // comments: "",
  //     // contact_name: "",
  //     // relationship_tenants: "",
  //     // email: "",
  //     // emergency_PhoneNumber: "",
  //     entries: [
  //       {
  //         // rental_adress: "",
  //         // lease_type: "",
  //         // start_date: "",
  //         // end_date: "",
  //         // leasing_agent: "",
  //         // rent_cycle: "",
  //         // amount: "",
  //         // account: "",
  //         // nextDue_date: "",
  //         // memo: "",
  //         // isrenton: false,
  //         // propertyOnRent: false,
  //         // Due_date: "",
  //         // Security_amount: "",
  //         // add cosigner
  //         cosigner_firstName: "",
  //         cosigner_lastName: "",
  //         cosigner_mobileNumber: "",
  //         cosigner_workNumber: "",
  //         cosigner_homeNumber: "",
  //         cosigner_faxPhoneNumber: "",
  //         cosigner_email: "",
  //         cosigner_alternateemail: "",
  //         cosigner_streetAdress: "",
  //         cosigner_city: "",
  //         cosigner_state: "",
  //         cosigner_zip: "",
  //         cosigner_country: "",
  //         cosigner_postalcode: "",
  //         // // add recuring charge
  //         // recuring_amount: "",
  //         // recuring_account: "",
  //         // recuringnextDue_date: "",
  //         // recuringmemo: "",
  //         // recuringfrequency: "",
  //         // //add one time charge
  //         // onetime_amount: "",
  //         // onetime_account: "",
  //         // onetime_Due_date: "",
  //         // onetime_memo: "",
  //         // // add account
  //         // account_name: "",
  //         // account_type: "",
  //         // //upload File
  //         // upload_file: "",
  //         // parent account
  //         // parent_account: "",
  //         // account_number: "",
  //         // fund_type: "",
  //         // cash_flow: "",
  //         // notes: "",
  //       },
  //     ],
  //   },
  //   validationSchema: consignerValidationSchema,
  //   onSubmit: () => {
  //     handleDialogClose();
  //     handleAddCosigner();
  //   },
  // });
  // let tenantsFormik = useFormik({
  //   initialValues: {
  //     tenant_firstName: "",
  //     tenant_lastName: "",
  //     tenant_mobileNumber: "",
  //     tenant_email: "",
  //     tenant_password: "",
  //     tenant_workNumber: "",
  //     tenant_unitNumber: "",
  //     tenant_homeNumber: "",
  //     tenant_faxPhoneNumber: "",
  //     alternate_email: "",
  //     tenant_residentStatus: "",
  //     birth_date: "",
  //     textpayer_id: "",
  //     comments: "",
  //     contact_name: "",
  //     relationship_tenants: "",
  //     email: "",
  //     emergency_PhoneNumber: "",
  //   },
  //   validationSchema: tenantsValidationSchema,
  //   onSubmit: () => {
  //     // handleSubmit(values);
  //     handleAddTenant();
  //     handleDialogClose();
  //     // console.log(values, "values");
  //   },
  // });
  const [overlapLease, setOverlapLease] = useState(null);

  const checkDate = async (dates) => {
    if (selectedPropertyType && selectedUnit) {
      let response = await axios.get(`${baseUrl}/tenant/tenants`);
      const data = response.data.data;

      let isUnavailable = false;
      let overlappingLease = null;

      data.forEach((entry) => {
        if (
          selectedPropertyType === entry.entries.rental_adress &&
          selectedUnit === entry.entries.rental_units
        ) {
          const sDate = new Date(entry.entries.start_date);
          const eDate = new Date(entry.entries.end_date);
          const inputDate = new Date(dates);

          if (
            sDate.getTime() < inputDate.getTime() &&
            inputDate.getTime() < eDate.getTime()
          ) {
            isUnavailable = true;
            overlappingLease = entry.entries;
          }
        }
      });

      setIsDateUnavailable(isUnavailable);
      setOverlapLease(overlappingLease);
    }
  };

  let recurringChargeSchema = useFormik({
    initialValues: {
      recuring_amount: "",
      recuring_account: "",
      // recuringnextDue_date: "",
      recuringmemo: "",
      // recuringfrequency: "",
    },

    validationSchema: yup.object({
      recuring_amount: yup.string().required("Required"),
      recuring_account: yup.string().required("Required"),
    }),

    onSubmit: () => {
      handleDialogClose();
      handleAddRecurring();
    },
  });

  let oneTimeChargeSchema = useFormik({
    initialValues: {
      onetime_amount: "",
      onetime_account: "",
      // onetime_Due_date: "",
      onetime_memo: "",
    },

    validationSchema: yup.object({
      onetime_amount: yup.string().required("Required"),
      onetime_account: yup.string().required("Required"),
    }),

    onSubmit: () => {
      handleDialogClose();
      handleAddOneTime();
    },
  });

  let entrySchema = useFormik({
    initialValues: {
      rental_adress: "",
      tenant_residentStatus:false,
      lease_type: "",
      rental_units: "",
      unit_id: "",
      start_date: "",
      end_date: "",
      leasing_agent: "",
      rent_cycle: "",
      amount: "",
      account: "",
      nextDue_date: "",
      memo: "",
      upload_file: [],
      isrenton: false,
      rent_paid: false,
      propertyOnRent: false,
      property_id: "",

      //security deposite
      Due_date: "",
      Security_amount: "",

      // add account
      account_name: "",
      account_type: "",

      //account level (sub account)
      parent_account: "",
      account_number: "",
      fund_type: "",
      cash_flow: "",
      notes: "",
    },

    validationSchema: yup.object({
      rental_adress: yup.string().required("Required"),
      lease_type: yup.string().required("Required"),
      start_date: yup.string().required("Required"),
      amount: yup.string().required("Required"),
    }),

    onSubmit: (values) => {
      if (selectedTenantData.length !== 0) {
        handleSubmit(values);
      } else {
        // console.log("data not ok")
        setDisplay(true);
      }
    },
  });

  let tenantsSchema = useFormik({
    //   Add tenants
    initialValues: {
      tenant_firstName: "",
      tenant_lastName: "",
      tenant_unitNumber: "",
      // tenant_phoneNumber: "",
      tenant_mobileNumber: "",
      tenant_workNumber: "",
      tenant_homeNumber: "",
      tenant_faxPhoneNumber: "",
      tenant_email: "",
      tenant_password: "",
      alternate_email: "",
      tenant_residentStatus: "",

      // personal information
      birth_date: "",
      textpayer_id: "",
      comments: "",

      //Emergency contact

      contact_name: "",
      relationship_tenants: "",
      email: "",
      emergency_PhoneNumber: "",
    },

    validationSchema: yup.object({
      tenant_firstName: yup.string().required("Required"),
      tenant_lastName: yup.string().required("Required"),
      tenant_mobileNumber: yup.string().required("Required"),
      tenant_email: yup.string().required("Email is required"),
      tenant_password: yup
        .string()
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number, and one special case Character"
        )
        .required("Password is required"),
    }),

    onSubmit: () => {
      // handleSubmit(values);
      handleAddTenant();
      handleDialogClose();
      // handleAddTenant();
      // handleDialogClose();
      // console.log(values, "values");
    },
  });

  let cosignerSchema = useFormik({
    initialValues: {
      // add cosigner
      cosigner_firstName: "",
      cosigner_lastName: "",
      cosigner_mobileNumber: "",
      cosigner_workNumber: "",
      cosigner_homeNumber: "",
      cosigner_faxPhoneNumber: "",
      cosigner_email: "",
      cosigner_alternateemail: "",
      cosigner_streetAdress: "",
      cosigner_city: "",
      cosigner_state: "",
      cosigner_zip: "",
      cosigner_country: "",
      cosigner_postalcode: "",
    },

    validationSchema: yup.object({
      cosigner_firstName: yup.string().required("Required"),
      cosigner_lastName: yup.string().required("Required"),
      cosigner_mobileNumber: yup.string().required("Required"),
      cosigner_email: yup.string().required("Required"),
    }),

    onSubmit: () => {
      // handleSubmit(values);
      // handleAddTenant();
      handleDialogClose();
      handleAddCosigner();
      // handleDialogClose();
      // console.log(values, "values");
    },
  });

  const applicantData = state && state.applicantData;
  console.log(applicantData, "applicantData");
  console.log(propertyId, "propertyId");
  useEffect(() => {
    const setData = async () => {
      if (state && state.applicantData) {
        try {
          const units = await fetchUnitsByProperty(applicantData.rental_adress);
          console.log(units, "unitssssssssssssss"); // Check the received units in the console

          setUnitData(units);
        } catch (error) {
          console.log(error, "error");
        }

        setSelectedTenantData({
          firstName: applicantData.tenant_firstName || "",
          lastName: applicantData.tenant_lastName || "",
          mobileNumber: applicantData.tenant_mobileNumber || "",
        });
        setPropertyId(applicantData.property_id);
        setSelectPaymentMethodDropdawn(applicantData.paymentMethod || "Select");

        setSelectedPropertyType(applicantData.rental_adress || "Select");
        setselectedLeaseType(applicantData.lease_type || "Select");
        setselectedRentCycle(applicantData.rent_cycle || "Select");
        setselectedAccount(applicantData.account || "Select");
        setselectedAccount(applicantData.account_name || "Select");
        setselectedOneTimeAccount(applicantData.onetime_account || "Select");
        setselectedRecuringAccount(applicantData.recuring_account);
        setselectedFrequency(applicantData.recuringfrequency || "Select");
        setselectedAccountType(applicantData.account_type || "Select");
        setselectedAccountLevel(applicantData.parent_account || "Select");
        setselectedFundType(applicantData.fund_type || "Select");
        setSelectedAgent(applicantData.leasing_agent || "Select");
        setSelectedUnit(applicantData.rental_units || "");

        entrySchema.setValues({
          entryIndex: applicantData.entryIndex,
          rental_adress: applicantData.rental_adress,
          rental_units: applicantData.rental_units,
          lease_type: applicantData.lease_type,
          start_date: applicantData.start_date,
          end_date: applicantData.end_date,
          leasing_agent: applicantData.leasing_agent,
          rent_cycle: applicantData.rent_cycle,
          amount: applicantData.amount,
          account: applicantData.account,
          nextDue_date: applicantData.nextDue_date,
          memo: applicantData.memo || "Rent",
          upload_file: applicantData.upload_file,
          isrenton: applicantData.isrenton,
          rent_paid: applicantData.rent_paid,
          propertyOnRent: applicantData.propertyOnRent,
          paymentMethod: applicantData.paymentMethod,

          //security deposite
          Due_date: applicantData.Due_date,
          Security_amount: applicantData.Security_amount,

          // add cosigner
          cosigner_firstName: applicantData.cosigner_firstName,
          cosigner_lastName: applicantData.cosigner_lastName,
          cosigner_mobileNumber: applicantData.cosigner_mobileNumber,
          cosigner_workNumber: applicantData.cosigner_workNumber,
          cosigner_homeNumber: applicantData.cosigner_homeNumber,
          cosigner_faxPhoneNumber: applicantData.cosigner_faxPhoneNumber,
          cosigner_email: applicantData.cosigner_email,
          cosigner_alternateemail: applicantData.cosigner_alternateemail,
          cosigner_streetAdress: applicantData.cosigner_streetAdress,
          cosigner_city: applicantData.cosigner_city,
          cosigner_state: applicantData.cosigner_state,
          cosigner_zip: applicantData.cosigner_zip,
          cosigner_country: applicantData.cosigner_country,
          cosigner_postalcode: applicantData.cosigner_postalcode,

          // add account
          account_name: applicantData.account_name,
          account_type: applicantData.account_type,

          //account level (sub account)
          parent_account: applicantData.parent_account,
          account_number: applicantData.account_number,
          fund_type: applicantData.fund_type,
          cash_flow: applicantData.cash_flow,
          notes: applicantData.notes,
          unit_id: applicantData.unit_id,
          property_id: applicantData.property_id,
          // rental_units: applicantData.rental_units
        });

        tenantsSchema.setValues({
          tenant_id: applicantData.tenant_id,

          //   Add tenants
          tenant_firstName: applicantData.tenant_firstName,
          tenant_lastName: applicantData.tenant_lastName,
          tenant_unitNumber: applicantData.tenant_unitNumber,
          // tenant_phoneNumber: { type: Number },
          tenant_mobileNumber: applicantData.tenant_mobileNumber,
          tenant_workNumber: applicantData.tenant_workNumber,
          tenant_homeNumber: applicantData.tenant_homeNumber,
          tenant_faxPhoneNumber: applicantData.tenant_faxPhoneNumber,
          tenant_email: applicantData.tenant_email,
          tenant_password: applicantData.tenant_password,
          alternate_email: applicantData.alternate_email,
          tenant_residentStatus: applicantData.tenant_residentStatus,

          // personal information
          birth_date: applicantData.birth_date,
          textpayer_id: applicantData.textpayer_id,
          comments: applicantData.comments,

          //Emergency contact

          contact_name: applicantData.contact_name,
          relationship_tenants: applicantData.relationship_tenants,
          email: applicantData.email,
          emergency_PhoneNumber: applicantData.emergency_PhoneNumber,
        });
        setOwnerData({
          rentalOwner_firstName: applicantData.rentalOwner_firstName,
          rentalOwner_lastName: applicantData.rentalOwner_lastName,
          rentalOwner_primaryemail: applicantData.rentalOwner_email,
          rentalOwner_phoneNumber: applicantData.rentalOwner_phoneNumber,
          rentalOwner_businessNumber: applicantData.rentalOwner_businessNumber,
          rentalOwner_homeNumber: applicantData.rentalOwner_homeNumber,
          rentalOwner_companyName: applicantData.rentalOwner_companyName,
        });
      }
    };
    setData();
  }, []);
  console.log(tenantsSchema.values, entrySchema.values, "tenantsSchema.values");
  // Fetch vendor data if editing an existing vendor
  useEffect(() => {
    const fetchData = async () => {
      if (id && entryIndex) {
        const url = `${baseUrl}/tenant/tenant_summary/${id}`;
        try {
          const response = await axios.get(url);
          const laesingdata = response.data.data;
          console.log(laesingdata, "laesingdata");
          setTenantData(laesingdata);
          setSelectedTenantData({
            firstName: laesingdata.tenant_firstName || "",
            lastName: laesingdata.tenant_lastName || "",
            mobileNumber: laesingdata.tenant_mobileNumber || "",
          });

          const matchedLease = laesingdata.entries.find(
            (entry) => entry.entryIndex === entryIndex
          );
          console.log(matchedLease, "matchedLease");
          try {
            const units = await fetchUnitsByProperty(
              matchedLease.rental_adress
            );
            console.log(units, "unitssssssssssssss"); // Check the received units in the console

            setUnitData(units);
          } catch (error) {
            console.log(error, "error");
          }

          // handleAddTenant();

          // const formattedStartDate = matchedLease.start_date
          //   ? new Date(matchedLease.start_date).toISOString().split("T")[0]
          //   : "";
          // const formattedEndDate = matchedLease.end_date
          //   ? new Date(matchedLease.end_date).toISOString().split("T")[0]
          //   : "";
          // const formattedNextDueDate = matchedLease.nextDue_date
          //   ? new Date(matchedLease.nextDue_date).toISOString().split("T")[0]
          //   : "";

          // const formattedBirthDate = laesingdata.birth_date
          //   ? new Date(laesingdata.birth_date).toISOString().split("T")[0]
          //   : "";

          // const formattedDueDate = matchedLease.Due_date
          //   ? new Date(matchedLease.Due_date).toISOString().split("T")[0]
          //   : "";

          // const formattedRecuringNextDueDate = matchedLease.recuringnextDue_date
          //   ? new Date(matchedLease.recuringnextDue_date)
          //     .toISOString()
          //     .split("T")[0]
          //   : "";

          // const formattedOnetimeDueDate = matchedLease.onetime_Due_date
          //   ? new Date(matchedLease.onetime_Due_date)
          //     .toISOString()
          //     .split("T")[0]
          //   : "";

          setSelectedPropertyType(matchedLease.rental_adress || "Select");
          setselectedLeaseType(matchedLease.lease_type || "Select");
          setselectedRentCycle(matchedLease.rent_cycle || "Select");
          setselectedAccount(matchedLease.account || "Select");
          setselectedAccount(matchedLease.account_name || "Select");
          setselectedOneTimeAccount(matchedLease.onetime_account || "Select");
          setselectedRecuringAccount(matchedLease.recuring_account);
          setselectedFrequency(matchedLease.recuringfrequency || "Select");
          setselectedAccountType(matchedLease.account_type || "Select");
          setselectedAccountLevel(matchedLease.parent_account || "Select");
          setselectedFundType(matchedLease.fund_type || "Select");
          setSelectedAgent(matchedLease.leasing_agent || "Select");
          setSelectedUnit(matchedLease.rental_units || "");
          setSelectPaymentMethodDropdawn(
            matchedLease.paymentMethod || "Select"
          );
          // setSelectedUnit(matchedLease.rental_units || "Select");
          // console.log(laesingdata, "yashraj")
          // setFile(arrayOfObjects || "Select");
          // console.log(matchedLease.upload_file, "upload_fileeee");

          // console.log(data, "data");
          setFile(matchedLease.upload_file);
          entrySchema.setValues({
            entryIndex: matchedLease.entryIndex,
            rental_adress: matchedLease.rental_adress,
            rental_units: matchedLease.rental_units,
            lease_type: matchedLease.lease_type,
            start_date: matchedLease.start_date,
            end_date: matchedLease.end_date,
            leasing_agent: matchedLease.leasing_agent,
            rent_cycle: matchedLease.rent_cycle,
            amount: matchedLease.amount,
            account: matchedLease.account,
            nextDue_date: matchedLease.nextDue_date,
            memo: matchedLease.memo,
            upload_file: matchedLease.upload_file,
            isrenton: matchedLease.isrenton,
            rent_paid: matchedLease.rent_paid,
            propertyOnRent: matchedLease.propertyOnRent,

            //security deposite
            Due_date: matchedLease.Due_date,
            Security_amount: matchedLease.Security_amount,

            // add cosigner
            cosigner_firstName: matchedLease.cosigner_firstName,
            cosigner_lastName: matchedLease.cosigner_lastName,
            cosigner_mobileNumber: matchedLease.cosigner_mobileNumber,
            cosigner_workNumber: matchedLease.cosigner_workNumber,
            cosigner_homeNumber: matchedLease.cosigner_homeNumber,
            cosigner_faxPhoneNumber: matchedLease.cosigner_faxPhoneNumber,
            cosigner_email: matchedLease.cosigner_email,
            cosigner_alternateemail: matchedLease.cosigner_alternateemail,
            cosigner_streetAdress: matchedLease.cosigner_streetAdress,
            cosigner_city: matchedLease.cosigner_city,
            cosigner_state: matchedLease.cosigner_state,
            cosigner_zip: matchedLease.cosigner_zip,
            cosigner_country: matchedLease.cosigner_country,
            cosigner_postalcode: matchedLease.cosigner_postalcode,

            // add account
            account_name: matchedLease.account_name,
            account_type: matchedLease.account_type,

            //account level (sub account)
            parent_account: matchedLease.parent_account,
            account_number: matchedLease.account_number,
            fund_type: matchedLease.fund_type,
            cash_flow: matchedLease.cash_flow,
            notes: matchedLease.notes,
          });

          tenantsSchema.setValues({
            tenant_id: laesingdata.tenant_id,

            //   Add tenants
            tenant_firstName: laesingdata.tenant_firstName,
            tenant_lastName: laesingdata.tenant_lastName,
            tenant_unitNumber: laesingdata.tenant_unitNumber,
            // tenant_phoneNumber: { type: Number },
            tenant_mobileNumber: laesingdata.tenant_mobileNumber,
            tenant_workNumber: laesingdata.tenant_workNumber,
            tenant_homeNumber: laesingdata.tenant_homeNumber,
            tenant_faxPhoneNumber: laesingdata.tenant_faxPhoneNumber,
            tenant_email: laesingdata.tenant_email,
            tenant_password: laesingdata.tenant_password,
            alternate_email: laesingdata.alternate_email,
            tenant_residentStatus: laesingdata.tenant_residentStatus,

            // personal information
            birth_date: laesingdata.birth_date,
            textpayer_id: laesingdata.textpayer_id,
            comments: laesingdata.comments,

            //Emergency contact

            contact_name: laesingdata.contact_name,
            relationship_tenants: laesingdata.relationship_tenants,
            email: laesingdata.email,
            emergency_PhoneNumber: laesingdata.emergency_PhoneNumber,
          });
          setOwnerData({
            rentalOwner_firstName: matchedLease.rentalOwner_firstName,
            rentalOwner_lastName: matchedLease.rentalOwner_lastName,
            rentalOwner_primaryemail: matchedLease.rentalOwner_email,
            rentalOwner_phoneNumber: matchedLease.rentalOwner_phoneNumber,
            rentalOwner_businessNumber: matchedLease.rentalOwner_businessNumber,
            rentalOwner_homeNumber: matchedLease.rentalOwner_homeNumber,
            rentalOwner_companyName: matchedLease.rentalOwner_companyName,
          });
          // setPropertyId(matchedLease.property_id);

          setRecurringData(matchedLease.recurring_charges);
          setOneTimeData(matchedLease.one_time_charges);
          console.log(matchedLease, "yush");
          // leaseFormik.setValues({
          //   entries: [
          //     {
          //       rental_adress: matchedLease.rental_adress || "",
          //       lease_type: matchedLease.lease_type || "",
          //       start_date: matchedLease.start_date || "",
          //       end_date: matchedLease.end_date || "",
          //       amount: matchedLease.amount || "",
          //       recuring_amount: matchedLease.recuring_amount || "",
          //       recuring_account: matchedLease.recuring_account || "",
          //       recuringmemo: matchedLease.recuringmemo || "",

          //       //add one time charge
          //       onetime_amount: matchedLease.onetime_amount || "",
          //       onetime_account: matchedLease.onetime_account || "",
          //       onetime_memo: matchedLease.onetime_memo || "",

          //       // add account
          //       account_name: matchedLease.account_name || "",
          //       account_type: matchedLease.account_type || "",
          //       account_number: matchedLease.account_number || "",

          //       //upload File
          //       upload_file: matchedLease.upload_file || "",

          //       // parent account
          //       parent_account: matchedLease.parent_account || "",
          //       fund_type: matchedLease.fund_type || "",
          //       cash_flow: matchedLease.cash_flow || "",
          //       notes: matchedLease.notes || "",
          //     },
          //   ],
          // });

          // tenantsFormik.setValues({
          //   birth_date: formattedBirthDate || "",
          //   textpayer_id: laesingdata.textpayer_id || "",
          //   comments: laesingdata.comments || "",
          //   contact_name: laesingdata.contact_name || "",
          //   relationship_tenants: laesingdata.relationship_tenants || "",
          //   email: laesingdata.email || "",
          //   emergency_PhoneNumber: laesingdata.emergency_PhoneNumber || "",
          //   // Due_date: formattedDueDate,
          //   tenant_firstName: laesingdata.tenant_firstName || "",
          //   tenant_lastName: laesingdata.tenant_lastName || "",
          //   tenant_mobileNumber: laesingdata.tenant_mobileNumber || "",
          //   tenant_email: laesingdata.tenant_email || "",
          //   tenant_password: laesingdata.tenant_password || "",
          //   tenant_workNumber: laesingdata.tenant_workNumber || "",
          //   alternate_email: laesingdata.alternate_email || "",
          // });

          // consignerFormik.setValues({
          //   entries: [
          //     {
          //       cosigner_firstName: matchedLease.cosigner_firstName || "",
          //       cosigner_lastName: matchedLease.cosigner_lastName || "",
          //       cosigner_mobileNumber: matchedLease.cosigner_mobileNumber || "",
          //       cosigner_workNumber: matchedLease.cosigner_workNumber || "",
          //       cosigner_homeNumber: matchedLease.cosigner_homeNumber || "",
          //       cosigner_faxPhoneNumber:
          //         matchedLease.cosigner_faxPhoneNumber || "",
          //       cosigner_email: matchedLease.cosigner_email || "",
          //       cosigner_alternateemail:
          //         matchedLease.cosigner_alternateemail || "",
          //       cosigner_streetAdress: matchedLease.cosigner_streetAdress || "",
          //       cosigner_city: matchedLease.cosigner_city || "",
          //       cosigner_state: matchedLease.cosigner_state || "",
          //       cosigner_country: matchedLease.cosigner_country || "",
          //       cosigner_postalcode: matchedLease.cosigner_postalcode || "",
          //     },
          //   ],
          // });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [id, entryIndex]);

  const [isStartDateUnavailable, setIsStartDateUnavailable] = useState(false);
  const [overlapStartDateLease, setOverlapStartDateLease] = useState(null);

  const checkStartDate = async (date) => {
    if (selectedPropertyType && selectedUnit) {
      let response = await axios.get(`${baseUrl}/tenant/tenants`);
      const data = response.data.data;

      let isStartDateUnavailable = false;
      let overlappingLease = null;

      data.forEach((entry) => {
        if (
          selectedPropertyType === entry.entries.rental_adress &&
          selectedUnit === entry.entries.rental_units
        ) {
          const sDate = new Date(entry.entries.start_date);
          const eDate = new Date(entry.entries.end_date);
          const inputDate = new Date(date);

          if (
            sDate.getTime() < inputDate.getTime() &&
            inputDate.getTime() < eDate.getTime()
          ) {
            isStartDateUnavailable = true;
            overlappingLease = entry.entries;
          }
        }
      });

      setIsStartDateUnavailable(isStartDateUnavailable);
      setOverlapStartDateLease(overlappingLease);

      // Additional validation logic can be added here
      if (isStartDateUnavailable) {
        entrySchema.setFieldError(
          "start_date",
          "Start date overlaps with an existing lease"
        );
      } else {
        entrySchema.setFieldError("start_date", null);
      }
    }
  };

  const handleSubmit = async (values) => {
    const tenantObject = {
      tenant_firstName: tenantsSchema.values.tenant_firstName,
      tenant_lastName: tenantsSchema.values.tenant_lastName,
      tenant_unitNumber: tenantsSchema.values.tenant_unitNumber,

      // tenant_phoneNumber: ,
      tenant_mobileNumber: tenantsSchema.values.tenant_mobileNumber,
      tenant_workNumber: tenantsSchema.values.tenant_workNumber,
      tenant_homeNumber: tenantsSchema.values.tenant_homeNumber,
      tenant_faxPhoneNumber: tenantsSchema.values.tenant_faxPhoneNumber,
      tenant_email: tenantsSchema.values.tenant_email,
      tenant_password: tenantsSchema.values.tenant_password,
      alternate_email: tenantsSchema.values.alternate_email,
      tenant_residentStatus: tenantsSchema.values.tenant_residentStatus,

      // personal information
      birth_date: tenantsSchema.values.birth_date,
      textpayer_id: tenantsSchema.values.textpayer_id,
      comments: tenantsSchema.values.comments,

      //Emergency contact

      contact_name: tenantsSchema.values.contact_name,
      relationship_tenants: tenantsSchema.values.relationship_tenants,
      email: tenantsSchema.values.email,
      emergency_PhoneNumber: tenantsSchema.values.emergency_PhoneNumber,
      entries: [
        {
          entryIndex: entrySchema.values.entryIndex,
          paymentMethod: entrySchema.values.paymentMethod,
          rental_units: entrySchema.values.rental_units,
          rental_adress: entrySchema.values.rental_adress,
          lease_type: entrySchema.values.lease_type,
          start_date: entrySchema.values.start_date,
          end_date: entrySchema.values.end_date,
          leasing_agent: entrySchema.values.leasing_agent,
          rent_cycle: entrySchema.values.rent_cycle,
          amount: entrySchema.values.amount,
          account: entrySchema.values.account,
          nextDue_date: entrySchema.values.nextDue_date,
          property_id: propertyId,
          memo: entrySchema.values.memo || "Rent",
          upload_file: entrySchema.values.upload_file,
          isrenton: entrySchema.values.isrenton,
          rent_paid: entrySchema.values.rent_paid,
          propertyOnRent: entrySchema.values.propertyOnRent,

          //security deposite
          Due_date: entrySchema.values.Due_date,
          Security_amount: entrySchema.values.Security_amount,

          // add cosigner
          cosigner_firstName: cosignerSchema.values.cosigner_firstName,
          cosigner_lastName: cosignerSchema.values.cosigner_lastName,
          cosigner_mobileNumber: cosignerSchema.values.cosigner_mobileNumber,
          cosigner_workNumber: cosignerSchema.values.cosigner_workNumber,
          cosigner_homeNumber: cosignerSchema.values.cosigner_homeNumber,
          cosigner_faxPhoneNumber:
            cosignerSchema.values.cosigner_faxPhoneNumber,
          cosigner_email: cosignerSchema.values.cosigner_email,
          cosigner_alternateemail:
            cosignerSchema.values.cosigner_alternateemail,
          cosigner_streetAdress: cosignerSchema.values.cosigner_streetAdress,
          cosigner_city: cosignerSchema.values.cosigner_city,
          cosigner_state: cosignerSchema.values.cosigner_state,
          cosigner_zip: cosignerSchema.values.cosigner_zip,
          cosigner_country: cosignerSchema.values.cosigner_country,
          cosigner_postalcode: cosignerSchema.values.cosigner_postalcode,

          // add account
          account_name: entrySchema.values.account_name,
          account_type: entrySchema.values.account_type,

          //account level (sub account)
          parent_account: entrySchema.values.parent_account,
          account_number: entrySchema.values.account_number,
          fund_type: entrySchema.values.fund_type,
          cash_flow: entrySchema.values.cash_flow,
          notes: entrySchema.values.notes,
          unit_id: entrySchema.values.unit_id,
          recurring_charges: recurringData,
          one_time_charges: oneTimeData,

          tenant_residentStatus: entrySchema.values.tenant_residentStatus || false,
          rentalOwner_firstName: ownerData.rentalOwner_firstName,
          rentalOwner_lastName: ownerData.rentalOwner_lastName,
          rentalOwner_primaryemail: ownerData.rentalOwner_email,
          rentalOwner_phoneNumber: ownerData.rentalOwner_phoneNumber,
          rentalOwner_businessNumber: ownerData.rentalOwner_businessNumber,
          rentalOwner_homeNumber: ownerData.rentalOwner_homeNumber,
          rentalOwner_companyName: ownerData.rentalOwner_companyName,
        },
      ],
    };
    console.log(tenantObject, "sdgvfyfbhjnkml,kjnhbgvfcvhb");
    // debugger

    try {
      const res = await axios.get(`${baseUrl}/tenant/tenant`);
      if (res.data.statusCode === 200) {
        console.log(res.data.data, "allTenants");
        const allTenants = res.data.data;
        const filteredData = allTenants.find((item) => {
          return (
            item.tenant_firstName === tenantsSchema.values.tenant_firstName &&
            item.tenant_email === tenantsSchema.values.tenant_email &&
            item.tenant_lastName === tenantsSchema.values.tenant_lastName
          );
        });

        if (filteredData) {
          const putObject = {
            entries: tenantObject.entries,
          };
          // debugger

          const tenantId = filteredData._id;
          console.log(tenantId, "tenantId");

          const res = await axios.put(
            `${baseUrl}/tenant/tenant/${tenantId}`,
            putObject
          );
          if (res.data.statusCode === 200) {
            console.log(res.data.data, "allTenants22");
            const delay = (ms) =>
              new Promise((resolve) => setTimeout(resolve, ms));

            // debugger;
            if (entrySchema.values.unit_id) {
              await postCharge(
                entrySchema.values.rental_units,
                entrySchema.values.unit_id,
                tenantId
              );

              await postDeposit(
                entrySchema.values.rental_units,
                entrySchema.values.unit_id,
                tenantId,
                entrySchema.values.Security_amount
              );

              // await delay(1000); // Delay for 3 seconds

              for (const item of recurringData) {
                await postRecOneCharge(
                  entrySchema.values.rental_units,
                  entrySchema.values.unit_id,
                  tenantId,
                  item,
                  "Recurring"
                );
                await delay(1000); // Delay for 3 seconds
              }

              for (const item of oneTimeData) {
                await postRecOneCharge(
                  entrySchema.values.rental_units,
                  entrySchema.values.unit_id,
                  tenantId,
                  item,
                  "OneTime"
                );
                await delay(1000); // Delay for 3 seconds
              }
            } else {
              await postCharge("", "", tenantId);
              await postDeposit(
                "",
                "",
                tenantId,
                entrySchema.values.Security_amount
              );

              await postDeposit(
                "",
                "",
                tenantId,
                entrySchema.values.Security_amount
              );

              for (const item of recurringData) {
                await postRecOneCharge("", "", tenantId, item, "Recurring");
                await delay(1000); // Delay for 3 seconds
              }

              for (const item of oneTimeData) {
                await postRecOneCharge("", "", tenantId, item, "OneTime");
                await delay(1000); // Delay for 3 seconds
              }
            }
            swal("", res.data.message, "success");
            navigate("/admin/TenantsTable");
          } else {
            swal("", res.data.message, "error");
          }
          handleResponse(res);
        } else {
          if (id === undefined) {
            console.log(tenantObject, "leaseObject");
            // debugger
            const res = await axios.post(
              `${baseUrl}/tenant/tenant`,
              tenantObject
            );
            if (res.data.statusCode === 200) {
              console.log(res.data.data, "response after adding data");
              debugger;
              const delay = (ms) =>
                new Promise((resolve) => setTimeout(resolve, ms));

              // debugger;
              if (entrySchema.values.unit_id) {
                await postCharge(
                  res.data.data.entries[0].rental_units,
                  res.data.data.entries[0].unit_id,
                  res.data.data._id
                );
                await postDeposit(
                  res.data.data.entries[0].rental_units,
                  res.data.data.entries[0].unit_id,
                  res.data.data._id,
                  res.data.data.entries[0].Security_amount
                );

                for (const item of recurringData) {
                  await postRecOneCharge(
                    res.data.data.entries[0].rental_units,
                    res.data.data.entries[0].unit_id,
                    res.data.data._id,
                    item,
                    "Recurring"
                  );
                  await delay(1000); // Delay for 3 seconds
                }

                for (const item of oneTimeData) {
                  await postRecOneCharge(
                    res.data.data.entries[0].rental_units,
                    res.data.data.entries[0].unit_id,
                    res.data.data._id,
                    item,
                    "OneTime"
                  );
                  await delay(1000); // Delay for 3 seconds
                }
              } else {
                await postCharge("", "", res.data.data._id);
                await postDeposit(
                  "",
                  "",
                  res.data.data._id,
                  res.data.data.entries[0].Security_amount
                );
                for (const item of recurringData) {
                  await postRecOneCharge(
                    "",
                    "",
                    res.data.data._id,
                    item,
                    "Recurring"
                  );
                  await delay(1000); // Delay for 3 seconds
                }

                for (const item of oneTimeData) {
                  await postRecOneCharge(
                    "",
                    "",
                    res.data.data._id,
                    item,
                    "OneTime"
                  );
                  await delay(1000); // Delay for 3 seconds
                }
              }
              swal("", res.data.message, "success");
              navigate("/admin/TenantsTable");
            } else {
              swal("", res.data.message, "error");
            }
            handleResponse(res);
          } else {
          }
        }
      } else {
        swal("", res.data.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
    console.log(tenantObject, "leaseObject");
    // console.log(leaseObject, "leaseObject");
    console.log(values, "values to check");
    try {
      console.log(id, "id from parameter");

      // values["property_type"] = localStorage.getItem("propertyType");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(entrySchema.values, "entry cahsdkajl;");

  const postCharge = async (unit, unitId, tenantId) => {
    const chargeObject = {
      properties: {
        rental_adress: entrySchema.values.rental_adress,
        property_id: propertyId,
      },
      unit: [
        {
          unit: unit,
          unit_id: unitId,
          paymentAndCharges: [
            {
              type: "Charge",
              charge_type: "Rent",
              //account: entrySchema.values.account,
              amount: parseFloat(entrySchema.values.amount),
              rental_adress: entrySchema.values.rental_adress,
              rent_cycle: entrySchema.values.rent_cycle,
              month_year: moment().format("MM-YYYY"),
              date: moment().format("YYYY-MM-DD"),
              memo: entrySchema.values.memo ? entrySchema.values.memo : "Rent",
              tenant_id: tenantId,
              isPaid:false,
              tenant_firstName:
                tenantsSchema.values.tenant_firstName +
                " " +
                tenantsSchema.values.tenant_lastName,
            },
          ],
        },
      ],
    };
    console.log(chargeObject, "from post charge");

    const url = `${baseUrl}/payment_charge/payment_charge`;
    await axios
      .post(url, chargeObject)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const postDeposit = async (unit, unitId, tenantId, Security_amount) => {
    const chargeObject = {
      properties: {
        rental_adress: entrySchema.values.rental_adress,
        property_id: propertyId,
      },
      unit: [
        {
          unit: unit,
          unit_id: unitId,
          paymentAndCharges: [
            {
              type: "Charge",
              charge_type: "Security Deposit",
              account: "Security Deposit",
              amount: parseFloat(Security_amount),
              rental_adress: entrySchema.values.rental_adress,
              rent_cycle: "",
              month_year: moment().format("MM-YYYY"),
              date: moment().format("YYYY-MM-DD"),
              memo: "Security Deposit",
              tenant_id: tenantId,
              isPaid:false,
              tenant_firstName:
                tenantsSchema.values.tenant_firstName +
                " " +
                tenantsSchema.values.tenant_lastName,
            },
          ],
        },
      ],
    };

    const url = `${baseUrl}/payment_charge/payment_charge`;
    await axios
      .post(url, chargeObject)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postRecOneCharge = async (unit, unitId, tenantId, item, chargeType) => {
    console.log(
      unit,
      unitId,
      tenantId,
      item,
      chargeType,
      "unit, unitId, tenantId, item, chargeType"
    );
    // debugger;

    const chargeObject = {
      properties: {
        rental_adress: entrySchema.values.rental_adress,
        property_id: propertyId,
      },
      unit: [
        {
          unit: unit,
          unit_id: unitId,
          paymentAndCharges: [
            {
              type: "Charge",
              charge_type: chargeType,
              account:
                chargeType === "Recurring"
                  ? item?.recuring_account || ""
                  : item?.onetime_account || "",
              amount:
                chargeType === "Recurring"
                  ? parseFloat(item?.recuring_amount) || ""
                  : item?.onetime_amount || "",
              rental_adress: entrySchema.values.rental_adress,
              rent_cycle: "",
              month_year: moment().format("MM-YYYY"),
              date: moment().format("YYYY-MM-DD"),
              isPaid:false,
              memo:
                chargeType === "Recurring"
                  ? item?.recuringmemo || ""
                  : item?.onetime_memo || "",
              tenant_id: tenantId,
              tenant_firstName:
                tenantsSchema.values.tenant_firstName +
                " " +
                tenantsSchema.values.tenant_lastName,
            },
          ],
        },
      ],
    };

    const url = `${baseUrl}/payment_charge/payment_charge`;
    try {
      const res = await axios.post(url, chargeObject);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const editLease = async (id) => {
    // const arrayOfNames = file.map((item) => item.name);

    const editUrl = `${baseUrl}/tenant/tenants/${id}/entry/${entryIndex}`;
    const entriesArray = [];
    try {
      const units = await fetchUnitsByProperty(entrySchema.values.rental_units);
      //console.log(units, "units"); // Check the received units in the console
      setUnitData(units);
    } catch (error) {
      console.log(error, "error");
    }
    const entriesObject = {
      entryIndex: entrySchema.values.entryIndex,
      rental_adress: entrySchema.values.rental_adress,
      lease_type: entrySchema.values.lease_type,
      start_date: entrySchema.values.start_date,
      rental_units: entrySchema.values.rental_units,
      end_date: entrySchema.values.end_date,
      leasing_agent: entrySchema.values.leasing_agent,
      rent_cycle: entrySchema.values.rent_cycle,
      amount: entrySchema.values.amount,
      account: entrySchema.values.account,
      nextDue_date: entrySchema.values.nextDue_date,
      memo: entrySchema.values.memo,
      upload_file: entrySchema.values.upload_file,
      isrenton: entrySchema.values.isrenton,
      rent_paid: entrySchema.values.rent_paid,
      propertyOnRent: entrySchema.values.propertyOnRent,

      //security deposite
      Due_date: entrySchema.values.Due_date,
      Security_amount: entrySchema.values.Security_amount,

      // add cosigner
      cosigner_firstName: cosignerSchema.values.cosigner_firstName,
      cosigner_lastName: cosignerSchema.values.cosigner_lastName,
      cosigner_mobileNumber: cosignerSchema.values.cosigner_mobileNumber,
      cosigner_workNumber: cosignerSchema.values.cosigner_workNumber,
      cosigner_homeNumber: cosignerSchema.values.cosigner_homeNumber,
      cosigner_faxPhoneNumber: cosignerSchema.values.cosigner_faxPhoneNumber,
      cosigner_email: cosignerSchema.values.cosigner_email,
      cosigner_alternateemail: cosignerSchema.values.cosigner_alternateemail,
      cosigner_streetAdress: cosignerSchema.values.cosigner_streetAdress,
      cosigner_city: cosignerSchema.values.cosigner_city,
      cosigner_state: cosignerSchema.values.cosigner_state,
      cosigner_zip: cosignerSchema.values.cosigner_zip,
      cosigner_country: cosignerSchema.values.cosigner_country,
      cosigner_postalcode: cosignerSchema.values.cosigner_postalcode,

      // add account
      account_name: entrySchema.values.account_name,
      account_type: entrySchema.values.account_type,

      //account level (sub account)
      parent_account: entrySchema.values.parent_account,
      account_number: entrySchema.values.account_number,
      fund_type: entrySchema.values.fund_type,
      cash_flow: entrySchema.values.cash_flow,
      notes: entrySchema.values.notes,

      recurring_charges: recurringData,
      one_time_charges: oneTimeData,

      tenant_residentStatus: ownerData.tenant_residentStatus,
      rentalOwner_firstName: ownerData.rentalOwner_firstName,
      rentalOwner_lastName: ownerData.rentalOwner_lastName,
      rentalOwner_primaryemail: ownerData.rentalOwner_email,
      rentalOwner_phoneNumber: ownerData.rentalOwner_phoneNumber,
      rentalOwner_businessNumber: ownerData.rentalOwner_businessNumber,
      rentalOwner_homeNumber: ownerData.rentalOwner_homeNumber,
      rentalOwner_companyName: ownerData.rentalOwner_companyName,
    };
    entriesArray.push(entriesObject);

    const leaseObject = {
      tenant_firstName: tenantsSchema.values.tenant_firstName,
      tenant_lastName: tenantsSchema.values.tenant_lastName,
      tenant_unitNumber: tenantsSchema.values.tenant_unitNumber,

      // tenant_phoneNumber: ,
      tenant_mobileNumber: tenantsSchema.values.tenant_mobileNumber,
      tenant_workNumber: tenantsSchema.values.tenant_workNumber,
      tenant_homeNumber: tenantsSchema.values.tenant_homeNumber,
      tenant_faxPhoneNumber: tenantsSchema.values.tenant_faxPhoneNumber,
      tenant_email: tenantsSchema.values.tenant_email,
      tenant_password: tenantsSchema.values.tenant_password,
      alternate_email: tenantsSchema.values.alternate_email,
      tenant_residentStatus: tenantsSchema.values.tenant_residentStatus,

      // personal information
      birth_date: tenantsSchema.values.birth_date,
      textpayer_id: tenantsSchema.values.textpayer_id,
      comments: tenantsSchema.values.comments,

      //Emergency contact

      contact_name: tenantsSchema.values.contact_name,
      relationship_tenants: tenantsSchema.values.relationship_tenants,
      email: tenantsSchema.values.email,
      emergency_PhoneNumber: tenantsSchema.values.emergency_PhoneNumber,
      entries: entriesArray,
    };

    // console.log(leaseObject, "updated values");
    await axios
      .put(editUrl, leaseObject)
      .then((response) => {
        // console.log(response, "response1111");
        handleResponse(response);
        if (id && entryIndex) {
          navigate(`/admin/rentrolldetail/${id}/${entryIndex}`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function handleResponse(response) {
    if (response.status === 200) {
      navigate("/admin/TenantsTable");
      swal(
        "Success!",
        id ? "Tenant updated successfully" : "Tenant added successfully!",
        "success"
      );
    } else {
      alert(response.data.message);
    }
  }
  // const getNextMonthFirstDay = () => {
  //   const now = new Date();
  //   let current;

  //   if (now.getMonth() === 11) {
  //     current = new Date(now.getFullYear() + 1, 0, 1 + 1)
  //       .toISOString()
  //       .slice(0, 10);
  //   } else {
  //     current = new Date(now.getFullYear(), now.getMonth() + 1, 1 + 1)
  //       .toISOString()
  //       .slice(0, 10);
  //   }

  //   return current;
  // };

  // useEffect(() => {
  //   // console.log(propertyId, "tenantId");
  //   if (entryIndex) {
  //     setAlignment("Signed");
  //     axios
  //       .get("https://propertymanager.cloudpress.host/api/rentals/allproperty")
  //       .then((propRes) => {
  //         axios
  //           .get(
  //             `${baseUrl}/applicant/applicant`
  //           )
  //           .then((response) => {
  //             console.log(response.data.data);
  //             if (response.data.data) {
  //               const propertyData = propRes.data.data;
  //               const selectedProperty = propertyData.find(
  //                 (property) => property._id === entryIndex
  //               );
  //               console.log(selectedProperty, "selectedProperty");
  //               setSelectedPropertyType(selectedProperty.rental_adress);
  //               setselectedLeaseType("Fixed");
  //               handleselectedRentCycle("Monthly");
  //               setselectedAccount("Rent income");
  //               leaseFormik.setFieldValue(
  //                 "tenant_nextDue_date",
  //                 getNextMonthFirstDay()
  //               );
  //               leaseFormik.setFieldValue(
  //                 "Due_date",
  //                 new Date().toISOString().slice(0, 10)
  //               );
  //               const applicantData = response.data.data;
  //               const matchedApplicant = applicantData.find((applicant) => {
  //                 return applicant._id === id;
  //               });
  //               console.log(matchedApplicant, "matchedApplicant");
  //               leaseFormik.setValues({
  //                 tenant_firstName: matchedApplicant.tenant_firstName,
  //                 tenant_lastName: matchedApplicant.tenant_lastName,
  //                 tenant_unitNumber: matchedApplicant.tenant_unitNumber,
  //                 tenant_mobileNumber: matchedApplicant.tenant_mobileNumber,
  //                 tenant_workNumber: matchedApplicant.tenant_workNumber,
  //                 tenant_homeNumber: matchedApplicant.tenant_homeNumber,
  //                 tenant_faxPhoneNumber: matchedApplicant.tenant_faxPhoneNumber,
  //                 tenant_email: matchedApplicant.tenant_email,
  //               })
  //             }
  //           })
  //           .catch((err) => {
  //             console.error(err);
  //           });
  //       });

  //     // console.log(matchedApplicant, "matchedApplicant");
  //   }
  //   // // Make an HTTP GET request to your Express API endpoint
  //   // fetch("http://64.225.8.160:4000/addagent/find_agentname")
  //   //   .then((response) => response.json())
  //   //   .then((data) => {
  //   //     if (data.statusCode === 200) {
  //   //       setAgentData(data.data);
  //   //       console.log(data);
  //   //     } else {
  //   //       // Handle error
  //   //       console.error("Error:", data.message);
  //   //     }
  //   // })
  //   // .catch((error) => {
  //   //   // Handle network error
  //   //   console.error("Network error:", error);
  //   // });
  // }, []);

  const editeReccuring = (index) => {
    setOpenRecurringDialog(true);
    recurringChargeSchema.setValues({
      recuring_amount: recurringData[index].recuring_amount,
      recuring_account: recurringData[index].recuring_account,
      recuringmemo: recurringData[index].recuringmemo,
    });
    setMode("update");
    setrIndex(index);
  };

  const editOneTime = (index) => {
    setOpenOneTimeChargeDialog(true);
    oneTimeChargeSchema.setValues({
      onetime_amount: oneTimeData[index].onetime_amount,
      onetime_account: oneTimeData[index].onetime_account,
      onetime_memo: oneTimeData[index].onetime_memo,
    });
    setMode("update");
    setcIndex(index);
  };
  // const [unitId, setUnitId] = useState();

  const handleUnitSelect = (selectedUnit, unitId) => {
    setSelectedUnit(selectedUnit);
    entrySchema.values.rental_units = selectedUnit;

    entrySchema.setFieldValue("unit_id", unitId);
    // entrySchema.values.unit_idd = unitId;
    entrySchema.setValues({
      ...entrySchema.values,
      rental_units: selectedUnit,
      unit_id: unitId,
    });
  };

  return (
    <>
      <LeaseHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card
              className="bg-secondary shadow"
              onSubmit={entrySchema.handleSubmit}
            >
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">{id ? "Edit Lease" : "New Lease"}</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  {/* <h6 className="heading-small text-muted mb-4">Signature</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Signature Status
                          </label>
                          <br />
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <ToggleButtonGroup
                              color="primary"
                              value={signature}
                              exclusive
                              onChange={handleSignatureChange}
                              aria-label="Platform"
                              style={{ width: "100%" }}
                            >
                              <ToggleButton
                                value="Signed"
                                style={{
                                  width: "100rem",
                                  textTransform: "capitalize",
                                }}
                              >
                                Signed
                              </ToggleButton>
                              <ToggleButton
                                value="Unsigned"
                                style={{
                                  width: "100rem",
                                  textTransform: "capitalize",
                                }}
                              >
                                Unsigned
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div> */}
                  <br />

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
                          <Dropdown isOpen={userdropdownOpen} toggle={toggle9}>
                            <DropdownToggle caret style={{ width: "100%" }}>
                              {selectedPropertyType
                                ? selectedPropertyType
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
                                    handlePropertyTypeSelect(
                                      property.rental_adress,
                                      property
                                    );
                                  }}
                                >
                                  {property.rental_adress}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                            {entrySchema.errors &&
                            entrySchema.errors?.rental_adress &&
                            entrySchema.touched &&
                            entrySchema.touched?.rental_adress &&
                            entrySchema.values.rental_adress === "" ? (
                              <div div style={{ color: "red" }}>
                                {entrySchema.errors.rental_adress}
                              </div>
                            ) : null}
                          </Dropdown>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      {entrySchema.values.rental_adress &&
                        unitData &&
                        unitData[0] &&
                        unitData[0].rental_units && (
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
                                toggle={toggle11}
                              >
                                <DropdownToggle caret>
                                  {selectedUnit ? selectedUnit : "Select Unit"}
                                </DropdownToggle>
                                <DropdownMenu>
                                  {unitData.length > 0 ? (
                                    unitData.map((unit) => (
                                      <DropdownItem
                                        key={unit._id}
                                        onClick={() =>
                                          handleUnitSelect(
                                            unit.rental_units,
                                            unit._id
                                          )
                                        }
                                      >
                                        {unit.rental_units}
                                      </DropdownItem>
                                    ))
                                  ) : (
                                    <DropdownItem disabled>
                                      No units available
                                    </DropdownItem>
                                  )}
                                </DropdownMenu>
                                {entrySchema.errors &&
                                entrySchema.errors?.rental_units &&
                                entrySchema.touched &&
                                entrySchema.touched?.rental_units &&
                                entrySchema.values.rental_units === "" ? (
                                  <div style={{ color: "red" }}>
                                    {entrySchema.errors.rental_units}
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
                            Lease Type
                          </label>
                          <br />
                          <Dropdown isOpen={leasedropdownOpen} toggle={toggle2}>
                            <DropdownToggle caret style={{ width: "100%" }}>
                              {selectedLeaseType
                                ? selectedLeaseType
                                : "Select Lease"}{" "}
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
                            {entrySchema.errors &&
                            entrySchema.errors?.lease_type &&
                            entrySchema.touched &&
                            entrySchema.touched?.lease_type &&
                            entrySchema.values.lease_type === "" ? (
                              <div style={{ color: "red" }}>
                                {entrySchema.errors.lease_type}
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
                            onBlur={entrySchema.handleBlur}
                            onChange={(e) => {
                              handleDateChange(e.target.value);
                              entrySchema.handleChange(e);
                              checkStartDate(e.target.value); // Check for start date
                              console.log(
                                "isStartDateUnavailable:",
                                isDateUnavailable
                              );
                            }}
                            value={moment(entrySchema.values.start_date).format(
                              "YYYY-MM-DD"
                            )}
                          />
                          {isStartDateUnavailable && (
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
                          )}
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
                            End Date *
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-unitadd2"
                            placeholder="3000"
                            type="date"
                            name="end_date"
                            onBlur={entrySchema.handleBlur}
                            onChange={(e) => {
                              entrySchema.handleChange(e);
                              checkDate(e.target.value);
                              console.log(
                                "isDateUnavailable:",
                                isDateUnavailable
                              );
                            }}
                            value={moment(entrySchema.values.end_date).format(
                              "YYYY-MM-DD"
                            )}
                            min={moment(entrySchema.values.start_date).format(
                              "YYYY-MM-DD"
                            )}
                          />
                          {isDateUnavailable && (
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
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    {/* <Row>
                      <Col lg="6">
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Leasing Agent
                        </label>
                        <FormGroup>
                          <Dropdown isOpen={agentdropdownOpen} toggle={toggle}>
                            <DropdownToggle caret style={{ width: "100%" }}>
                              {selectedAgent ? selectedAgent : "Select Agent"}{" "}
                              &nbsp;&nbsp;&nbsp;&nbsp;
                            </DropdownToggle>
                            <DropdownMenu style={{ width: "100%" }}>
                              <DropdownItem value="">Select</DropdownItem>
                              {agentData.map((agent) => (
                                <DropdownItem
                                  key={agent._id}
                                  onClick={() => handleAgentSelect(agent)}
                                >
                                  {agent.agent_name}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </FormGroup>
                      </Col>
                    </Row> */}
                  </div>

                  <hr className="my-4" />

                  <h6 className="heading-small text-muted mb-4">
                    Tenants and Cosigner
                  </h6>
                  {/* <div className="pl-lg-4"></div> */}

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
                          Consigner
                          {display === false ? (
                            <></>
                          ) : (
                            <div style={{ color: "red" }}>required</div>
                          )}
                        </span>

                        <Dialog open={openTenantsDialog} onClose={handleClose}>
                          <DialogTitle style={{ background: "#F0F8FF" }}>
                            Add tenant or cosigner
                          </DialogTitle>
                          <DialogContent
                            style={{ width: "100%", maxWidth: "500px" }}
                          >
                            <div
                              style={{
                                // display: "flex",
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
                                                              }
                                                              {
                                                                tenant.tenant_lastName
                                                              }
                                                              {`(${tenant.tenant_mobileNumber})`}
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
                                                            {/* <FormControlLabel
                                                          control={  */}
                                                            <Checkbox
                                                              type="checkbox"
                                                              name="tenant"
                                                              id={
                                                                tenant.tenant_mobileNumber
                                                              }
                                                              checked={
                                                                tenant.tenant_mobileNumber ===
                                                                checkedCheckbox
                                                              }
                                                              onChange={(
                                                                event
                                                              ) => {
                                                                setCheckedCheckbox(
                                                                  tenant.tenant_mobileNumber
                                                                );
                                                                // const tenantInfo = `${tenant.tenant_firstName || ""}
                                                                // ${tenant.tenant_lastName ||
                                                                //   ""
                                                                //   } ${tenant.tenant_mobileNumber ||
                                                                //   ""
                                                                //   } ${tenant.tenant_email ||
                                                                //   ""
                                                                //   } ${tenant.textpayer_id ||
                                                                //   ""
                                                                //   } ${tenant.birth_date ||
                                                                //   ""
                                                                //   } ${tenant.comments ||
                                                                //   ""
                                                                //   } ${tenant.contact_name ||
                                                                //   ""
                                                                //   } ${tenant.relationship_tenants ||
                                                                //   ""
                                                                //   } ${tenant.email ||
                                                                //   ""
                                                                //   } ${tenant.emergency_PhoneNumber ||
                                                                //   ""
                                                                //   } ${tenant.tenant_password ||
                                                                //   ""
                                                                //   } ${tenant.tenant_workNumber ||
                                                                //   ""
                                                                //   } ${tenant.alternate_email ||
                                                                //   ""
                                                                //   }`;
                                                                const tenantInfo1 =
                                                                  {
                                                                    tenant_firstName:
                                                                      tenant.tenant_firstName,
                                                                    tenant_lastName:
                                                                      tenant.tenant_lastName,
                                                                    tenant_mobileNumber:
                                                                      tenant.tenant_mobileNumber,
                                                                    tenant_email:
                                                                      tenant.tenant_email,
                                                                    textpayer_id:
                                                                      tenant.textpayer_id,
                                                                    birth_date:
                                                                      tenant.birth_date,
                                                                    comments:
                                                                      tenant.comments,
                                                                    contact_name:
                                                                      tenant.contact_name,
                                                                    relationship_tenants:
                                                                      tenant.relationship_tenants,
                                                                    email:
                                                                      tenant.email,
                                                                    emergency_PhoneNumber:
                                                                      tenant.emergency_PhoneNumber,
                                                                    tenant_password:
                                                                      tenant.tenant_password,
                                                                    tenant_workNumber:
                                                                      tenant.tenant_workNumber,
                                                                    alternate_email:
                                                                      tenant.alternate_email,
                                                                  };
                                                                handleCheckboxChange(
                                                                  event,
                                                                  tenantInfo1,
                                                                  tenant.tenant_mobileNumber
                                                                );
                                                                // console.log(tenantInfo1)
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
                                            &nbsp;Contact information
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
                                                // style={{
                                                //   fontFamily: "monospace",
                                                //   fontSize: "14px",
                                                // }}
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
                                                }} // Adjust flex property
                                                name="tenant_firstName"
                                                onBlur={
                                                  tenantsSchema.handleBlur
                                                }
                                                onChange={
                                                  tenantsSchema.handleChange
                                                }
                                                value={
                                                  tenantsSchema.values
                                                    .tenant_firstName
                                                }
                                              />
                                              {tenantsSchema.touched
                                                .tenant_firstName &&
                                              tenantsSchema.errors
                                                .tenant_firstName ? (
                                                <div style={{ color: "red" }}>
                                                  {
                                                    tenantsSchema.errors
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
                                                // style={{
                                                //   fontFamily: "monospace",
                                                //   fontSize: "14px",
                                                // }}
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
                                                }} // Adjust flex property
                                                name="tenant_lastName"
                                                onBlur={
                                                  tenantsSchema.handleBlur
                                                }
                                                onChange={
                                                  tenantsSchema.handleChange
                                                }
                                                value={
                                                  tenantsSchema.values
                                                    .tenant_lastName
                                                }
                                              />
                                              {tenantsSchema.touched
                                                .tenant_lastName &&
                                              tenantsSchema.errors
                                                .tenant_lastName ? (
                                                <div style={{ color: "red" }}>
                                                  {
                                                    tenantsSchema.errors
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
                                                htmlFor="tenant_mobileNumber"
                                                // style={{
                                                //   fontFamily: "monospace",
                                                //   fontSize: "14px",
                                                // }}
                                              >
                                                Phone Number*
                                              </label>
                                              <br />
                                              <Input
                                                id="tenant_mobileNumber"
                                                className="form-control-alternative"
                                                variant="standard"
                                                type="text"
                                                placeholder="phoneNumber"
                                                style={{
                                                  marginRight: "10px",
                                                  flex: 1,
                                                }} // Adjust flex property
                                                name="tenant_mobileNumber"
                                                onBlur={
                                                  tenantsSchema.handleBlur
                                                }
                                                onChange={
                                                  tenantsSchema.handleChange
                                                }
                                                value={
                                                  tenantsSchema.values
                                                    .tenant_mobileNumber
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
                                              {tenantsSchema.touched
                                                .tenant_mobileNumber &&
                                              tenantsSchema.errors
                                                .tenant_mobileNumber ? (
                                                <div style={{ color: "red" }}>
                                                  {
                                                    tenantsSchema.errors
                                                      .tenant_mobileNumber
                                                  }
                                                </div>
                                              ) : null}
                                            </div>
                                            {/* <span
                                              onClick={setOpenTenantsDialog}
                                              style={{
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                fontFamily: "monospace",
                                                color: "blue",
                                              }}
                                            >
                                              <b style={{ fontSize: "20px" }}>
                                                +
                                              </b>{" "}
                                              Add alternative Phone
                                            </span> */}
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
                                                    htmlFor="tenant_workNumber"
                                                    style={{
                                                      paddingTop: "3%",
                                                    }}
                                                  >
                                                    Work Number*
                                                  </label>
                                                  <br />
                                                  <Input
                                                    id="tenant_workNumber"
                                                    className="form-control-alternative"
                                                    variant="standard"
                                                    type="text"
                                                    placeholder="Alternative Number"
                                                    style={{
                                                      marginRight: "10px",
                                                      flex: 1,
                                                    }} // Adjust flex property
                                                    name="tenant_workNumber"
                                                    onBlur={
                                                      tenantsSchema.handleBlur
                                                    }
                                                    onChange={
                                                      tenantsSchema.handleChange
                                                    }
                                                    value={
                                                      tenantsSchema.values
                                                        .tenant_workNumber
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
                                                  {/* {tenantsFormik.touched
                                                    .tenant_workNumber &&
                                                    tenantsFormik.errors
                                                      .tenant_workNumber ? (
                                                    <div
                                                      style={{ color: "red" }}
                                                    >
                                                      {
                                                        tenantsFormik.errors
                                                          .tenant_workNumber
                                                      }
                                                    </div>
                                                  ) : null} */}
                                                </div>
                                              )}
                                              <span
                                                onClick={handleClick}
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
                                                htmlFor="tenant_email"
                                                // style={{
                                                //   fontFamily: "monospace",
                                                //   fontSize: "14px",
                                                // }}
                                              >
                                                Email*
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
                                                }} // Adjust flex property
                                                name="tenant_email"
                                                onBlur={
                                                  tenantsSchema.handleBlur
                                                }
                                                onChange={
                                                  tenantsSchema.handleChange
                                                }
                                                value={
                                                  tenantsSchema.values
                                                    .tenant_email
                                                }
                                              />
                                              {tenantsSchema.touched
                                                .tenant_email &&
                                              tenantsSchema.errors
                                                .tenant_email ? (
                                                <div style={{ color: "red" }}>
                                                  {
                                                    tenantsSchema.errors
                                                      .tenant_email
                                                  }
                                                </div>
                                              ) : null}
                                            </div>
                                            {/* <span
                                                onClick={setOpenTenantsDialog}
                                                style={{
                                                  cursor: "pointer",
                                                  fontSize: "14px",
                                                  fontFamily: "monospace",
                                                  color: "blue",
                                                  marginLeft: "10px", // Add this to create space between the input and the link
                                                }}
                                              >
                                                <b style={{ fontSize: "20px" }}>
                                                  +
                                                </b>{" "}
                                                Add alternative Email
                                              </span> */}
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
                                                    htmlFor="alternate_email"
                                                    style={{
                                                      paddingTop: "3%",
                                                    }}
                                                  >
                                                    Alternative Email*
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
                                                    }} // Adjust flex property
                                                    name="alternate_email"
                                                    onBlur={
                                                      tenantsSchema.handleBlur
                                                    }
                                                    onChange={
                                                      tenantsSchema.handleChange
                                                    }
                                                    value={
                                                      tenantsSchema.values
                                                        .alternate_email
                                                    }
                                                  />
                                                  {/* {tenantsSchema.touched
                                                    .alternate_email &&
                                                    tenantsSchema.errors
                                                      .alternate_email &&
                                                    tenantsSchema.values
                                                      .tenant_email === "" ? (
                                                    <div
                                                      style={{ color: "red" }}
                                                    >
                                                      {
                                                        tenantsSchema.errors
                                                          .alternate_email
                                                      }
                                                    </div>
                                                  ) : null} */}
                                                </div>
                                              )}
                                              <span
                                                onClick={handleClick1}
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
                                                // style={{
                                                //   fontFamily: "monospace",
                                                //   fontSize: "14px",
                                                // }}
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
                                                  }} // Adjust flex property
                                                  name="tenant_password"
                                                  onBlur={
                                                    tenantsSchema.handleBlur
                                                  }
                                                  onChange={
                                                    tenantsSchema.handleChange
                                                  }
                                                  value={
                                                    tenantsSchema.values
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
                                              {/* {tenantsFormik.touched
                                                .tenant_password &&
                                                tenantsFormik.errors
                                                  .tenant_password && tenantsFormik.values
                                                    .tenant_password === '' ? (
                                                <div style={{ color: "red" }}>
                                                  {
                                                    tenantsFormik.errors
                                                      .tenant_password
                                                  }
                                                </div>
                                              ) : null} */}
                                              {tenantsSchema.errors &&
                                              tenantsSchema.errors
                                                ?.tenant_password &&
                                              tenantsSchema.touched &&
                                              tenantsSchema.touched
                                                ?.tenant_password ? (
                                                <div style={{ color: "red" }}>
                                                  {
                                                    tenantsSchema.errors
                                                      .tenant_password
                                                  }
                                                  {/* {console.log(tenantsFormik.errors.tenant_password)} */}
                                                </div>
                                              ) : null}
                                            </div>
                                          </div>
                                          {/* <hr /> */}
                                          {/* <div>
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-email"
                                            >
                                              Address*
                                            </label>
                                          </div> */}

                                          {/* <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Checkbox
                                              //onClick={handleChange}
                                              style={{ marginRight: "10px" }}
                                            />
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-unitadd"
                                            >
                                              {" "}
                                              Same as Unit Address
                                            </label>
                                          </div> */}
                                          {/* <div>
                                              <span
                                                onClick={setOpenTenantsDialog}
                                                style={{
                                                  cursor: "pointer",
                                                  fontSize: "14px",
                                                  fontFamily: "monospace",
                                                  color: "blue",
                                                  marginLeft: "10px", // Add this to create space between the input and the link
                                                }}
                                              >
                                                <b style={{ fontSize: "20px" }}>
                                                  +
                                                </b>{" "}
                                                Add alternative Address
                                              </span>
                                            </div> */}
                                          <br />
                                          <div>
                                            <span
                                              onClick={toggleper}
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
                                                          name="birth_date"
                                                          onBlur={
                                                            tenantsSchema.handleBlur
                                                          }
                                                          onChange={
                                                            tenantsSchema.handleChange
                                                          }
                                                          value={
                                                            tenantsSchema.values
                                                              .birth_date
                                                          }
                                                        />
                                                        {/* {tenantsSchema.touched
                                                          .birth_date &&
                                                          tenantsSchema.errors
                                                            .birth_date ? (
                                                          <div
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            {
                                                              tenantsSchema
                                                                .errors
                                                                .birth_date
                                                            }
                                                          </div>
                                                        ) : null} */}
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
                                                          name="textpayer_id"
                                                          onBlur={
                                                            tenantsSchema.handleBlur
                                                          }
                                                          onChange={
                                                            tenantsSchema.handleChange
                                                          }
                                                          value={
                                                            tenantsSchema.values
                                                              .textpayer_id
                                                          }
                                                        />
                                                        {/* {tenantsFormik.touched
                                                          .textpayer_id &&
                                                          tenantsFormik.errors
                                                            .textpayer_id ? (
                                                          <div
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            {
                                                              tenantsFormik
                                                                .errors
                                                                .textpayer_id
                                                            }
                                                          </div>
                                                        ) : null} */}
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
                                                            tenantsSchema.handleBlur
                                                          }
                                                          onChange={
                                                            tenantsSchema.handleChange
                                                          }
                                                          value={
                                                            tenantsSchema.values
                                                              .comments
                                                          }
                                                        />
                                                        {/* {tenantsFormik.touched
                                                          .comments &&
                                                          tenantsFormik.errors
                                                            .comments ? (
                                                          <div
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            {
                                                              tenantsFormik
                                                                .errors.comments
                                                            }
                                                          </div>
                                                        ) : null} */}
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>
                                                </CardBody>
                                              </Card>
                                            </Collapse>
                                          </div>
                                          <div>
                                            <span
                                              onClick={togglecont}
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
                                                          name="contact_name"
                                                          onBlur={
                                                            tenantsSchema.handleBlur
                                                          }
                                                          onChange={
                                                            tenantsSchema.handleChange
                                                          }
                                                          value={
                                                            tenantsSchema.values
                                                              .contact_name
                                                          }
                                                        />
                                                        {/* {tenantsFormik.touched
                                                          .contact_name &&
                                                          tenantsFormik.errors
                                                            .contact_name ? (
                                                          <div
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            {
                                                              tenantsFormik
                                                                .errors
                                                                .contact_name
                                                            }
                                                          </div>
                                                        ) : null} */}
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
                                                          name="relationship_tenants"
                                                          onBlur={
                                                            tenantsSchema.handleBlur
                                                          }
                                                          onChange={
                                                            tenantsSchema.handleChange
                                                          }
                                                          value={
                                                            tenantsSchema.values
                                                              .relationship_tenants
                                                          }
                                                        />
                                                        {/* {tenantsFormik.touched
                                                          .relationship_tenants &&
                                                          tenantsFormik.errors
                                                            .relationship_tenants ? (
                                                          <div
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            {
                                                              tenantsFormik
                                                                .errors
                                                                .relationship_tenants
                                                            }
                                                          </div>
                                                        ) : null} */}
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
                                                          name="email"
                                                          onBlur={
                                                            tenantsSchema.handleBlur
                                                          }
                                                          onChange={
                                                            tenantsSchema.handleChange
                                                          }
                                                          value={
                                                            tenantsSchema.values
                                                              .email
                                                          }
                                                        />
                                                        {/* {tenantsSchema.touched
                                                          .email &&
                                                          tenantsSchema.errors
                                                            .email ? (
                                                          <div
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            {
                                                              tenantsSchema
                                                                .errors.email
                                                            }
                                                          </div>
                                                        ) : null} */}
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
                                                          name="emergency_PhoneNumber"
                                                          onBlur={
                                                            tenantsSchema.handleBlur
                                                          }
                                                          onChange={
                                                            tenantsSchema.handleChange
                                                          }
                                                          value={
                                                            tenantsSchema.values
                                                              .emergency_PhoneNumber
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
                                                        {/* {tenantsSchema.touched
                                                          .emergency_PhoneNumber &&
                                                          tenantsSchema.errors
                                                            .emergency_PhoneNumber ? (
                                                          <div
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            {
                                                              tenantsSchema
                                                                .errors
                                                                .emergency_PhoneNumber
                                                            }
                                                          </div>
                                                        ) : null} */}
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
                                          tenantsSchema.handleSubmit(); // Call this function to close the dialog
                                        }}
                                        // style={{ background: "green" }}
                                      >
                                        Add Tenant
                                      </button>
                                      <Button
                                        // className="btn btn-primary"
                                        // style={{ background: "blue" }}

                                        onClick={handleClose}
                                      >
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
                                              onBlur={cosignerSchema.handleBlur}
                                              onChange={(e) =>
                                                cosignerSchema.handleChange(e)
                                              }
                                              value={
                                                cosignerSchema.values
                                                  .cosigner_firstName
                                              }
                                            />
                                            {cosignerSchema.errors &&
                                            cosignerSchema.errors
                                              ?.cosigner_firstName &&
                                            cosignerSchema.touched &&
                                            cosignerSchema.touched
                                              ?.cosigner_firstName &&
                                            cosignerSchema.values
                                              .cosigner_firstName === "" ? (
                                              <div style={{ color: "red" }}>
                                                {
                                                  cosignerSchema.errors
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
                                              onBlur={cosignerSchema.handleBlur}
                                              onChange={
                                                cosignerSchema.handleChange
                                              }
                                              value={
                                                cosignerSchema.values
                                                  .cosigner_lastName
                                              }
                                            />
                                            {cosignerSchema.errors &&
                                            cosignerSchema.errors
                                              ?.cosigner_lastName &&
                                            cosignerSchema.touched &&
                                            cosignerSchema.touched
                                              ?.cosigner_lastName &&
                                            cosignerSchema.values
                                              .cosigner_lastName === "" ? (
                                              <div style={{ color: "red" }}>
                                                {
                                                  cosignerSchema.errors
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
                                              id="cosigner_mobileNumber"
                                              placeholder="Phone Number"
                                              type="text"
                                              name="cosigner_mobileNumber"
                                              onBlur={cosignerSchema.handleBlur}
                                              onChange={
                                                cosignerSchema.handleChange
                                              }
                                              value={
                                                cosignerSchema.values
                                                  .cosigner_mobileNumber
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
                                            {cosignerSchema.errors &&
                                            cosignerSchema.errors
                                              .cosigner_mobileNumber &&
                                            cosignerSchema.touched &&
                                            cosignerSchema.touched
                                              .cosigner_mobileNumber &&
                                            cosignerSchema.values
                                              .cosigner_mobileNumber === "" ? (
                                              <div style={{ color: "red" }}>
                                                {
                                                  cosignerSchema.errors
                                                    .cosigner_mobileNumber
                                                }
                                              </div>
                                            ) : null}
                                          </div>
                                          {/* <span
                                            onClick={setOpenTenantsDialog}
                                            style={{
                                              cursor: "pointer",
                                              fontSize: "14px",
                                              fontFamily: "monospace",
                                              color: "blue",
                                            }}
                                          >
                                            <b style={{ fontSize: "20px" }}>
                                              +
                                            </b>{" "}
                                            Add alternative Phone
                                          </span> */}
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
                                                  htmlFor="tenant_workNumber"
                                                  style={{
                                                    paddingTop: "3%",
                                                  }}
                                                >
                                                  Work Number
                                                </label>
                                                <br />
                                                <Input
                                                  id="cosigner_workNumber"
                                                  className="form-control-alternative"
                                                  variant="standard"
                                                  type="text"
                                                  placeholder="Alternative Number"
                                                  style={{
                                                    marginRight: "10px",
                                                    flex: 1,
                                                  }} // Adjust flex property
                                                  name="cosigner_workNumber"
                                                  onBlur={
                                                    cosignerSchema.handleBlur
                                                  }
                                                  onChange={
                                                    cosignerSchema.handleChange
                                                  }
                                                  value={
                                                    cosignerSchema.values
                                                      .cosigner_workNumber
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
                                                    cosignerSchema.values.cosigner_workNumber =
                                                      numericValue;
                                                  }}
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
                                              onBlur={cosignerSchema.handleBlur}
                                              onChange={(e) =>
                                                cosignerSchema.handleChange(e)
                                              }
                                              value={
                                                cosignerSchema.values
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
                                            {cosignerSchema.errors &&
                                            cosignerSchema.errors
                                              .cosigner_email &&
                                            cosignerSchema.touched &&
                                            cosignerSchema.touched
                                              .cosigner_email &&
                                            cosignerSchema.values
                                              .cosigner_email === "" ? (
                                              <div style={{ color: "red" }}>
                                                {
                                                  cosignerSchema.errors
                                                    .cosigner_email
                                                }
                                              </div>
                                            ) : null}
                                          </div>
                                          {/* <span
                                            onClick={setOpenTenantsDialog}
                                            style={{
                                              cursor: "pointer",
                                              fontSize: "14px",
                                              fontFamily: "monospace",
                                              color: "blue",
                                              marginLeft: "10px", // Add this to create space between the input and the link
                                            }}
                                          >
                                            <b style={{ fontSize: "20px" }}>
                                              +
                                            </b>{" "}
                                            Add alternative Email
                                          </span> */}
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
                                                  Alternative Email*
                                                </label>
                                                <br />
                                                <Input
                                                  id="cosigner_alternateemail"
                                                  className="form-control-alternative"
                                                  variant="standard"
                                                  type="text"
                                                  placeholder="Alternative Email"
                                                  style={{
                                                    marginRight: "10px",
                                                    flex: 1,
                                                  }} // Adjust flex property
                                                  name="cosigner_alternateemail"
                                                  onBlur={
                                                    cosignerSchema.handleBlur
                                                  }
                                                  onChange={(e) =>
                                                    cosignerSchema.handleChange(
                                                      e
                                                    )
                                                  }
                                                  value={
                                                    cosignerSchema.values
                                                      .cosigner_alternateemail
                                                  }
                                                />
                                                {/* {consignerFormik.touched
                                                  .cosigner_alternateemail &&
                                                  consignerFormik.errors
                                                    .cosigner_alternateemail ? (
                                                  <div style={{ color: "red" }}>
                                                    {
                                                      consignerFormik.errors
                                                        .cosigner_alternateemail
                                                    }
                                                  </div>
                                                ) : null} */}
                                              </div>
                                            )}
                                            <span
                                              onClick={handleClick3}
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
                                              htmlFor="cosigner_streetAdress"
                                            >
                                              Street Address
                                            </label>
                                            <Input
                                              className="form-control-alternative"
                                              id="cosigner_streetAdress"
                                              placeholder="Address"
                                              type="textarea"
                                              style={{
                                                width: "100%",
                                                maxWidth: "25rem",
                                              }}
                                              onBlur={cosignerSchema.handleBlur}
                                              onChange={(e) =>
                                                cosignerSchema.handleChange(e)
                                              }
                                              value={
                                                cosignerSchema.values
                                                  .cosigner_streetAdress
                                              }
                                            />
                                            {/* {consignerFormik.touched
                                              .cosigner_streetAdress &&
                                              consignerFormik.errors
                                                .cosigner_streetAdress ? (
                                              <div style={{ color: "red" }}>
                                                {
                                                  consignerFormik.errors
                                                    .cosigner_streetAdress
                                                }
                                              </div>
                                            ) : null} */}
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
                                                    cosignerSchema.handleBlur
                                                  }
                                                  onChange={(e) =>
                                                    cosignerSchema.handleChange(
                                                      e
                                                    )
                                                  }
                                                  value={
                                                    cosignerSchema.values
                                                      .cosigner_city
                                                  }
                                                />
                                                {/* {consignerFormik.touched
                                                  .cosigner_city &&
                                                  consignerFormik.errors
                                                    .cosigner_city ? (
                                                  <div style={{ color: "red" }}>
                                                    {
                                                      consignerFormik.errors
                                                        .cosigner_city
                                                    }
                                                  </div>
                                                ) : null} */}
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
                                                    cosignerSchema.handleBlur
                                                  }
                                                  onChange={(e) =>
                                                    cosignerSchema.handleChange(
                                                      e
                                                    )
                                                  }
                                                  value={
                                                    cosignerSchema.values
                                                      .cosigner_country
                                                  }
                                                />
                                                {/* {consignerFormik.touched
                                                  .cosigner_country &&
                                                  consignerFormik.errors
                                                    .cosigner_country ? (
                                                  <div style={{ color: "red" }}>
                                                    {
                                                      consignerFormik.errors
                                                        .cosigner_country
                                                    }
                                                  </div>
                                                ) : null} */}
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
                                                    cosignerSchema.handleBlur
                                                  }
                                                  onChange={(e) =>
                                                    cosignerSchema.handleChange(
                                                      e
                                                    )
                                                  }
                                                  value={
                                                    cosignerSchema.values
                                                      .cosigner_postalcode
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
                                                {/* {consignerFormik.touched
                                                  .cosigner_postalcode &&
                                                  consignerFormik.errors
                                                    .cosigner_postalcode ? (
                                                  <div style={{ color: "red" }}>
                                                    {
                                                      consignerFormik.errors
                                                        .cosigner_postalcode
                                                    }
                                                  </div>
                                                ) : null} */}
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                        {/* <div>
                                          <span
                                            onClick={setOpenTenantsDialog}
                                            style={{
                                              cursor: "pointer",
                                              fontSize: "14px",
                                              fontFamily: "monospace",
                                              color: "blue",
                                              marginLeft: "10px",
                                            }}
                                          >
                                            <b style={{ fontSize: "20px" }}>
                                              +
                                            </b>{" "}
                                            Add alternative Address
                                          </span>
                                        </div> */}
                                        <br />
                                      </div>
                                      <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={() => {
                                          cosignerSchema.handleSubmit();
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
                        {tenantsSchema.errors &&
                        tenantsSchema.errors?.tenant_password && entrySchema.submitCount>0 
                        ? (
                          <div style={{ color: "red" }}>
                            {tenantsSchema.errors.tenant_password}
                            {/* {console.log(tenantsFormik.errors.tenant_password)} */}
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
                                    <EditIcon onClick={setOpenTenantsDialog} />
                                    <DeleteIcon
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

                  {/* /================================================================================================================================================= */}

                  <hr className="my-4" />
                  {/* Address */}
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
                            Rent cycle
                          </label>
                          <FormGroup>
                            <Dropdown
                              isOpen={rentdropdownOpen}
                              toggle={toggle3}
                            >
                              <DropdownToggle caret style={{ width: "100%" }}>
                                {selectedRentCycle
                                  ? selectedRentCycle
                                  : "Select"}
                              </DropdownToggle>
                              <DropdownMenu
                                style={{ width: "100%" }}
                                name="rent_cycle"
                                onBlur={entrySchema.handleBlur}
                                onChange={(e) => entrySchema.handleChange(e)}
                                value={entrySchema.values.rent_cycle}
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
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  {/* <hr className="my-4" /> */}
                  {/* Address */}

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
                                    onBlur={entrySchema.handleBlur}
                                    //onChange={leaseFormik.handleChange}
                                    value={entrySchema.values.amount}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const numericValue = inputValue.replace(
                                        /\D/g,
                                        ""
                                      );
                                      entrySchema.values.amount = numericValue;
                                      entrySchema.handleChange({
                                        target: {
                                          name: "amount",
                                          value: numericValue,
                                        },
                                      });
                                    }}
                                  />
                                  {entrySchema.errors &&
                                  entrySchema.errors.amount &&
                                  entrySchema.touched &&
                                  entrySchema.touched.amount &&
                                  entrySchema.values.amount === "" ? (
                                    <div style={{ color: "red" }}>
                                      {entrySchema.errors.amount}
                                    </div>
                                  ) : null}
                                </FormGroup>
                              </FormGroup>
                            </Col>

                            {/* <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                                style={{ marginLeft: "10px" }}
                              >
                                Account
                              </label>
                              <br />
                              <FormGroup style={{ marginLeft: "10px" }}>
                                <Dropdown
                                  isOpen={rentincdropdownOpen}
                                  toggle={toggle4}
                                >
                                  <DropdownToggle
                                    caret
                                    style={{ width: "100%" }}
                                  >
                                    {selectedAccount
                                      ? selectedAccount
                                      : "Select"}
                                  </DropdownToggle>
                                  <DropdownMenu
                                    style={{
                                      zIndex: 999,
                                      maxHeight: "280px",
                                      // overflowX: "hidden",
                                      overflowY: "auto",
                                      width: "100%",
                                    }}
                                  >
                                    {entrySchema.touched.account &&
                                    entrySchema.errors.account ? (
                                      <div style={{ color: "red" }}>
                                        {entrySchema.errors.account}
                                      </div>
                                    ) : null}
                                    <DropdownItem
                                      header
                                      style={{ color: "blue" }}
                                    >
                                      Income Account
                                    </DropdownItem>
                                    {accountNames.map((item) => {
                                      const accountName =
                                        item.account_name || ""; // Use an empty string if account_name is missing
                                      return (
                                        <DropdownItem
                                          key={item._id}
                                          onClick={() =>
                                            hadleselectedAccount(accountName)
                                          }
                                        >
                                          {accountName}
                                        </DropdownItem>
                                      );
                                    })}
                                    <DropdownItem
                                      onClick={() =>
                                        AddNewAccountName("rentAccountName")
                                      }
                                    >
                                      Add new account..
                                    </DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
                                <AccountDialog
                                  AddBankAccountDialogOpen={
                                    AddBankAccountDialogOpen
                                  }
                                  handleCloseDialog={handleCloseDialog}
                                  selectAccountDropDown={selectAccountDropDown}
                                  toggle8={toggle8}
                                  setAddBankAccountDialogOpen={
                                    setAddBankAccountDialogOpen
                                  }
                                  toggle1={toggle1}
                                  selectAccountLevelDropDown={
                                    selectAccountLevelDropDown
                                  }
                                  selectFundTypeDropDown={
                                    selectFundTypeDropDown
                                  }
                                  toggle10={toggle10}
                                  selectedAccount={selectedAccount}
                                  accountTypeName={accountTypeName}
                                  setToggleApiCall={setToggleApiCall}
                                  toggleApiCall={toggleApiCall}
                                />
                                <AccountDialog
                                  AddBankAccountDialogOpen={
                                    AddBankAccountDialogOpen
                                  }
                                  handleCloseDialog={handleCloseDialog}
                                  selectAccountDropDown={selectAccountDropDown}
                                  toggle8={toggle8}
                                  setAddBankAccountDialogOpen={
                                    setAddBankAccountDialogOpen
                                  }
                                  toggle1={toggle1}
                                  selectAccountLevelDropDown={
                                    selectAccountLevelDropDown
                                  }
                                  selectFundTypeDropDown={
                                    selectFundTypeDropDown
                                  }
                                  toggle10={toggle10}
                                  selectedAccount={selectedAccount}
                                  accountTypeName={accountTypeName}
                                  setToggleApiCall={setToggleApiCall}
                                  toggleApiCall={toggleApiCall}
                                  hadleselectedAccount={hadleselectedAccount}
                                  hadleselectedOneTimeAccount={
                                    hadleselectedOneTimeAccount
                                  }
                                  hadleselectedRecuringAccount={
                                    hadleselectedRecuringAccount
                                  }
                                />
                              </FormGroup>
                            </FormGroup> */}

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
                                  onBlur={entrySchema.handleBlur}
                                  onChange={(e) => entrySchema.handleChange(e)}
                                  value={entrySchema.values.nextDue_date}
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
                                  onBlur={entrySchema.handleBlur}
                                  onChange={entrySchema.handleChange}
                                  value={entrySchema.values.memo}
                                />
                                {/* {leaseFormik.touched.memo &&
                                  leaseFormik.errors.memo ? (
                                  <div style={{ color: "red" }}>
                                    {leaseFormik.errors.memo}
                                  </div>
                                ) : null} */}
                              </FormGroup>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">
                    Security Deposite (Optional)
                  </h6>
                  <div className="pl-lg-2">
                    <FormGroup>
                      {/* <label
                        className="form-control-label"
                        htmlFor="input-address"
                      >
                        Security Deposite (Optional)
                      </label> */}
                      <br />
                      <Row>
                        {/* <Col lg="2">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-unitadd"
                            >
                              Next Due Date
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-unitadd"
                              placeholder="3000"
                              type="date"
                              name="Due_date"
                              onBlur={entrySchema.handleBlur}
                              onChange={entrySchema.handleChange}
                              value={entrySchema.values.Due_date}
                            />

                            {entrySchema.touched.tenant_start_date &&
                            entrySchema.errors.Due_date ? (
                              <div style={{ color: "red" }}>
                                {entrySchema.errors.Due_date}
                              </div>
                            ) : null}
                          </FormGroup>
                        </Col> */}
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
                                name="Security_amount"
                                onBlur={entrySchema.handleBlur}
                                onChange={entrySchema.handleChange}
                                value={entrySchema.values.Security_amount}
                                onInput={(e) => {
                                  const inputValue = e.target.value;
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ""
                                  ); // Remove non-numeric characters
                                  e.target.value = numericValue;
                                }}
                              />
                              {/* {leaseFormik.touched.Security_amount &&
                                leaseFormik.errors.Security_amount ? (
                                <div style={{ color: "red" }}>
                                  {leaseFormik.errors.Security_amount}
                                </div>
                              ) : null} */}
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
                                      isOpen={rentdropdownOpen1}
                                      toggle={toggle5}
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
                                          // overflowX: "hidden",
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
                                        {/* {console.log(recurringChargeSchema.values)} */}
                                        {RecAccountNames.map((item) => {
                                          const accountName =
                                            item.account_name || ""; // Use an empty string if account_name is missing
                                          return (
                                            <DropdownItem
                                              key={item._id}
                                              onClick={() =>
                                                hadleselectedRecuringAccount(
                                                  accountName
                                                )
                                              }
                                            >
                                              {accountName}
                                            </DropdownItem>
                                          );
                                        })}
                                        <DropdownItem
                                          onClick={() =>
                                            AddNewAccountName("recAccountName")
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
                                {/* <div>
                                  <FormGroup>
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-unitadd"
                                    >
                                      Next Due Date*
                                    </label>
                                    <Input
                                      className="form-control-alternative"
                                      id="recuringnextDue_date"
                                      placeholder="3000"
                                      type="date"
                                      name="recuringnextDue_date"
                                      onBlur={leaseFormik.handleBlur}
                                      onChange={leaseFormik.handleChange}
                                      value={
                                        leaseFormik.values.recuringnextDue_date
                                      }
                                    />
                                   
                                    {leaseFormik.touched.recuringnextDue_date &&
                                    leaseFormik.errors.recuringnextDue_date ? (
                                      <div style={{ color: "red" }}>
                                        {
                                          leaseFormik.errors
                                            .recuringnextDue_date
                                        }
                                      </div>
                                    ) : null}
                                  </FormGroup>
                                </div> */}
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
                                      // onChange={(e) => recurringChargeSchema.handleChange(e)}
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
                                        ); // Remove non-numeric characters
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
                                {/* {console.log(
                                  entrySchema.values,
                                  "entrySchema.values"
                                )} */}
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

                                  {/* {leaseFormik.touched.entries[0].recuringmemo &&
                                    leaseFormik.errors.recuringmemo ? (
                                    <div style={{ color: "red" }}>
                                      {leaseFormik.errors.recuringmemo}
                                    </div>
                                  ) : null} */}
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
                                      isOpen={rentdropdownOpen3}
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
                                          // overflowX: "hidden",
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
                                        {oneTimeCharges.map((item) => {
                                          const accountName =
                                            item.account_name || ""; // Use an empty string if account_name is missing
                                          return (
                                            <DropdownItem
                                              key={item._id}
                                              onClick={() =>
                                                hadleselectedOneTimeAccount(
                                                  accountName
                                                )
                                              }
                                            >
                                              {accountName}
                                            </DropdownItem>
                                          );
                                        })}
                                        <DropdownItem
                                          onClick={() =>
                                            AddNewAccountName("oneTimeName")
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
                                {/* <div>
                                  <FormGroup>
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-unitadd"
                                    >
                                      Next Due Date*
                                    </label>
                                    <Input
                                      className="form-control-alternative"
                                      id="input-unitadd"
                                      placeholder="3000"
                                      type="date"
                                      name="onetime_Due_date"
                                      onBlur={leaseFormik.handleBlur}
                                      onChange={leaseFormik.handleChange}
                                      value={
                                        leaseFormik.values.onetime_Due_date
                                      }
                                    />
                                    {leaseFormik.touched.onetime_Due_date &&
                                    leaseFormik.errors.onetime_Due_date ? (
                                      <div style={{ color: "red" }}>
                                        {leaseFormik.errors.onetime_Due_date}
                                      </div>
                                    ) : null}
                                  </FormGroup>
                                </div> */}
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
                                    Memo
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
                                  {/* {leaseFormik.touched.onetime_memo &&
                                    leaseFormik.errors.onetime_memo ? (
                                    <div style={{ color: "red" }}>
                                      {leaseFormik.errors.onetime_memo}
                                    </div>
                                  ) : null} */}
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
                                onClick={(e) => {
                                  // e.preventDefault();
                                  // handleAddOneTime();
                                  // handleDialogClose(); // Call this function to close the dialog
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
                  <AccountDialog
                    AddBankAccountDialogOpen={AddBankAccountDialogOpen}
                    handleCloseDialog={handleCloseDialog}
                    selectAccountDropDown={selectAccountDropDown}
                    toggle8={toggle8}
                    setAddBankAccountDialogOpen={setAddBankAccountDialogOpen}
                    toggle1={toggle1}
                    selectAccountLevelDropDown={selectAccountLevelDropDown}
                    selectFundTypeDropDown={selectFundTypeDropDown}
                    toggle10={toggle10}
                    selectedAccount={selectedAccount}
                    accountTypeName={accountTypeName}
                    setToggleApiCall={setToggleApiCall}
                    toggleApiCall={toggleApiCall}
                    hadleselectedAccount={hadleselectedAccount}
                    hadleselectedOneTimeAccount={hadleselectedOneTimeAccount}
                    hadleselectedRecuringAccount={hadleselectedRecuringAccount}
                  />

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
                            // textTransform: "uppercase",
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
                            key={index} // Add a unique key to each iterated element
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

                  {/* <div className="file-upload-wrapper">
                    <input
                      type="file"
                      className="form-control-file d-block"
                      accept="file/*"
                      name="upload_file"
                      onChange={(e) => fileData(e.target.files[0])}
                      // onChange={rentalsFormik.handleChange}
                      value={leaseFormik.values.upload_file}
                    />
                    {leaseFormik.touched.upload_file &&
                    leaseFormik.errors.upload_file ? (
                      <div style={{ color: "red" }}>
                        {leaseFormik.errors.upload_file}
                      </div>
                    ) : null}
                  </div> */}
                  <div className="d-flex">
                    <div className="file-upload-wrapper">
                      {/* {console.log(
                        entrySchema.values,
                        "entrySchema.values 5662"
                      )} */}
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
                        // inputProps={{ multiple: true }}
                        onChange={(e) => {
                          // console.log(e.target.files, "target.files");
                          // entrySchema.setFieldValue("upload_file", [...e.target.files]);
                          fileData(e.target.files);
                        }}
                        // onChange={rentalsFormik.handleChange}
                        // value={entrySchema.values.upload_file}
                      />
                      <label for="upload_file" className="btn">
                        Upload
                      </label>
                    </div>
                    <div className="d-flex ">
                      {/* {id
                        ? file.length > 0 &&
                          file
                            .map((item) => {
                              return "name:" + item;
                            })
                            .map((file, index) => (
                              <div
                                key={index}
                                style={{
                                  position: "relative",
                                  marginLeft: "50px",
                                }}
                              >
                                <p
                                  // onClick={() => handleOpenFile(file)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {file?.name?.substr(0, 5)}
                                  {file?.name?.length > 5 ? "..." : null}
                                </p>
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
                            ))
                        : file.length > 0 &&
                          file?.map((file, index) => (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                marginLeft: "50px",
                              }}
                            >
                              <p
                                onClick={() => handleOpenFile(file)}
                                style={{ cursor: "pointer" }}
                              >
                                {file?.name?.substr(0, 5)}
                                {file?.name?.length > 5 ? "..." : null}
                              </p>
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
                          ))} */}
                      {/* {console.log(file, "file")} */}

                      {file.length > 0 &&
                        file?.map((singleFile, index) => (
                          <div
                            key={index}
                            style={{ position: "relative", marginLeft: "50px" }}
                          >
                            {!id || yourData === "ApplicantSummary" ? (
                              <p
                                onClick={() =>
                                  handleOpenFile(singleFile.upload_file)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {/* {console.log(file, "fromm 5867")} */}
                                {singleFile?.file_name?.substr(0, 5)}
                                {singleFile?.file_name?.length > 5
                                  ? "..."
                                  : null}
                              </p>
                            ) : (
                              <p
                                // onClick={() => handleOpenFile(file.upload_file)}
                                style={{ cursor: "pointer" }}
                              >
                                {/* {console.log(file, "file 5803")} */}
                                {file[0]?.file_name?.substr(0, 5)}
                                {file[0]?.file_name?.length > 5 ? "..." : null}
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
                          
                          value={entrySchema.values.tenant_residentStatus}
                          onChange={(e) => {
                            entrySchema.setFieldValue(
                              "tenant_residentStatus",
                              e.target.checked
                            );
                            console.log( entrySchema.setFieldValue(
                              "tenant_residentStatus",
                              e.target.checked),"setFieldValue");
                            console.log(entrySchema.values.tenant_residentStatus,"value");
                            console.log(e.target.checked,"e.target.checked");
                          }}
                        />
                      }
                      // label="End"
                      labelPlacement="end"
                    />
                  </FormGroup>
                  </Row>

                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Select Payment Method
                        </label>
                        <FormGroup>
                          <Dropdown
                            isOpen={paymentOptionDropdawnOpen}
                            toggle={paymentMethodtoggle}
                          >
                            <DropdownToggle caret style={{ width: "100%" }}>
                              {selectPaymentMethodDropdawn
                                ? selectPaymentMethodDropdawn
                                : "Select"}
                            </DropdownToggle>
                            <DropdownMenu
                              style={{ width: "100%" }}
                              name="paymentMethod"
                              onBlur={entrySchema.handleBlur}
                              onChange={(e) => entrySchema.handleChange(e)}
                              value={entrySchema.values.paymentMethod}
                            >
                              {selectPaymentMethod.map((option) => (
                                <DropdownItem
                                  key={option}
                                  onClick={() =>
                                    handleselectedPaymetMethod(option)
                                  }
                                >
                                  {option}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </FormGroup>
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* <Button
                  color="primary"
                 //  href="#rms"
                  onClick={(e) => e.preventDefault()}
                  size="sm"
                  style={{ background: "green" }}
                >
                  Save

                </Button> */}
                  {/* <Button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      background: "green",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      leaseFormik.handleSubmit();
                    }}
                  >
                    {id ? "Update Lease" : "Add Lease"}
                  </Button> */}
                  {/* {console.log(tenantsSchema.values, "tenantsSchema.values")} */}
                  {id && yourData !== "ApplicantSummary" ? (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: "green", cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        editLease(id);
                      }}
                    >
                      Update Lease
                    </button>
                  ) : (
                    <>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: "green", cursor: "pointer" }}
                    >
                      Create Lease
                    </button>
                    
                      </>
                  )}
                  <Button
                    color="primary"
                    ////  href="#rms"
                    onClick={handleCloseButtonClick}
                    // size="sm"
                    className="btn btn-primary"
                    style={{
                      background: "white",
                      color: "black",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </Button>
                  {tenantsSchema.errors &&
                      tenantsSchema.errors?.tenant_password && entrySchema.submitCount>0 
                      ? (
                        <div style={{ color: "red" }}>
                          {/* {console.log(tenantsFormik.errors.tenant_password)} */}
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

export default RentRollLeaseing;
