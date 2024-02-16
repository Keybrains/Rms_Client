import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import Header from "components/Headers/Header";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { RotatingLines } from "react-loader-spinner";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Container,
  Row,
  Col,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Table,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
} from "reactstrap";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import MailIcon from "@mui/icons-material/Mail";
import HomeIcon from "@mui/icons-material/Home";
import { jwtDecode } from "jwt-decode";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { set } from "date-fns";
import swal from "sweetalert";
import {
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { BloodtypeOutlined } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import DoneIcon from "@mui/icons-material/Done";
import jsPDF from "jspdf";
import Img from "assets/img/theme/team-4-800x800.jpg";
import { useLocation } from "react-router-dom";
import moment from "moment";
import "./Leaseing.css";
import CreditCardForm from "./CreditCardForm";

const RentRollDetail = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { tenantId, entryIndex } = useParams();
  console.log(tenantId, entryIndex, "tenantId, entryIndex");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");
  const [tenantDetails, setTenantDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [value, setValue] = React.useState("Summary");
  const [rental, setRental] = useState("");
  const [unit, setUnit] = useState("");
  const [rentaldata, setRentaldata] = useState([]);
  const [paymentData, setPaymentData] = useState(null);

  const [balance, setBalance] = useState("");
  const [GeneralLedgerData, setGeneralLedgerData] = useState([]);
  const [loader, setLoader] = React.useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isModalsOpen, setIsModalsOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [customervault, setCustomervault] = useState([]);
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [cardDetalis, setCardDetails] = useState([]);
  const [isBilling, setIsBilling] = useState(false);
  const [vaultId, setVaultId] = useState(false);

  const openCardForm = () => {
    setIsModalsOpen(true);
  };

  const closeModals = () => {
    setIsModalsOpen(false);
    getCreditCard();
    getMultipleCustomerVault();
  };

  const closeRefund = () => {
    setIsRefundOpen(false);
    // getCreditCard();
    // getMultipleCustomerVault();
  };

  const getCreditCard = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/creditcard/getCreditCards/${tenantId}`
      );
      setCustomervault(response.data);
      setVaultId(response.data.customer_vault_id);
      getMultipleCustomerVault(response.data.customer_vault_id);

      const hasCustomerVaultId = response.data.some(
        (card) => card.customer_vault_id
      );

      if (hasCustomerVaultId) {
        setIsBilling(true);
      } else {
        setIsBilling(false);
      }
    } catch (error) {
      console.error("Error fetching credit card details:", error);
      setIsBilling(false);
    }
  };

  const getMultipleCustomerVault = async (customerVaultIds) => {
    try {
      setPaymentLoader(true);
      if (customerVaultIds.length === 0) {
        setCardDetails([]);
        return;
      }

      const response = await axios.post(
        `${baseUrl}/nmipayment/get-billing-customer-vault`,
        {
          customer_vault_id: customerVaultIds,
        }
      );

      // Check if customer.billing is an array
      const billingData = response.data.data.customer.billing;

      if (Array.isArray(billingData)) {
        const extractedData = billingData.map((item) => ({
          billing_id: item["@attributes"].id,
          cc_number: item.cc_number,
          cc_exp: item.cc_exp,
          cc_type: item.cc_type,
          customer_vault_id: item.customer_vault_id,
        }));

        setPaymentLoader(false);
        setCardDetails(extractedData);
      } else if (billingData) {
        // If there's only one record, create an array with a single item
        const extractedData = [
          {
            billing_id: billingData["@attributes"].id,
            cc_number: billingData.cc_number,
            cc_exp: billingData.cc_exp,
            cc_type: billingData.cc_type,
            customer_vault_id: billingData.customer_vault_id,
          },
        ];

        setPaymentLoader(false);
        setCardDetails(extractedData);
        console.log("objectss", extractedData);
      } else {
        console.error(
          "Invalid response structure - customer.billing is not an array"
        );
        setPaymentLoader(false);
        setCardDetails([]);
      }
    } catch (error) {
      console.error("Error fetching multiple customer vault records:", error);
      setPaymentLoader(false);
    }
  };

  useEffect(() => {
    getCreditCard();
  }, [tenantId]);

  useEffect(() => {
    // Extract customer_vault_id values from cardDetails
    const customerVaultIds =
      customervault?.card_detail?.map((card) => card.billing_id) || [];

    if (customerVaultIds.length > 0) {
      // Call the API to get multiple customer vault records
      getMultipleCustomerVault(customerVaultIds);
    }
  }, [customervault]);

  const handleDeleteCard = async (customerVaultId, billingId) => {
    try {
      // Make parallel requests to delete from your record and NMI
      const [deleteRecordResponse, deleteNMIResponse] = await Promise.all([
        axios.delete(`${baseUrl}/creditcard/deleteCreditCard/${billingId}`),
        axios.post(`${baseUrl}/nmipayment/delete-customer-billing`, {
          customer_vault_id: customerVaultId,
          billing_id: billingId,
        }),
      ]);

      // Check the responses
      if (
        deleteRecordResponse.status === 200 &&
        deleteNMIResponse.status === 200
      ) {
        swal("Success", "Card deleted successfully", "success");
        getCreditCard(); // all vault id get from this function
      } else {
        // Handle errors, show a message, or log the error
        console.error(
          "Delete card failed:",
          deleteRecordResponse.statusText,
          deleteNMIResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error deleting card:", error.message);
    }
  };

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick2 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option) => {
    // Perform actions based on the selected option
    generatePDF(option);
    handleClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
        const response = await fetch(
          `${baseUrl}/payment/Payment_summary/tenant/${tenantId}/${entryIndex}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          setPaymentData(data.data[0]);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        // You can set an error state or display an error message to the user
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect will run once on component mount

  useEffect(() => {
    if (tenantId && entryIndex) {
      getTenantData(tenantId, entryIndex);
    }
  }, [tenantId, entryIndex]);

  const [unitId, setUnitId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);

  const apiUrl = `${baseUrl}/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;

  const id = tenantId;
  const entry = entryIndex;

  const getTenantData = async () => {
    try {
      const apiUrl = `${baseUrl}/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;
      const response = await axios.get(apiUrl);
      setTenantDetails(response.data.data);
      const rental = response.data.data.entries.rental_adress;
      const unit = response.data.data.entries.rental_units;
      const unitId = response.data.data.entries.unit_id;
      const propertysId = response.data.data.entries.property_id;

      setRental(rental);
      // setUnit(unit);
      // setUnitId(unitId);
      setPropertyId(propertysId);

      if (unitId && unit) {
        const url = `${baseUrl}/payment_charge/financial_unit?rental_adress=${rental}&property_id=${propertysId}&unit=${unit}&tenant_id=${tenantId}`;

        axios
          .get(url)
          .then((response) => {
            setLoader(false);

            if (response.data && response.data.data) {
              const mergedData = response.data.data;

              setGeneralLedgerData(mergedData[0]?.unit[0]);
            } else {
              console.error("Unexpected response format:", response.data);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } else {
        const url = `${baseUrl}/payment_charge/financial?rental_adress=${rental}&property_id=${propertysId}&tenant_id=${tenantId}`;

        axios
          .get(url)
          .then((response) => {
            setLoader(false);

            if (response.data && response.data.data) {
              const mergedData = response.data.data;

              setGeneralLedgerData(mergedData[0]?.unit[0]);
            } else {
              console.error("Unexpected response format:", response.data);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }

      // axios
      //   .get(
      //     `${baseUrl}/propertyunit/prop_id/${response.data.data.entries.unit_id}`
      //   )
      //   .then((res) => {
      // if (res.data) {
      // setRentaldata(res.data.data);
      // const matchedUnit = res?.data?.find((item) => {
      //   if (item.unit_id === unitId) {
      //     setRentaldata(item);
      //   }
      // });
      // setPropertyId(res.data.data[0].propertyId);
      // const url = `https://propertymanager.cloudpress.host/api/payment_charge/financial_unit?rental_adress=Testing&property_id=6568198deb1c48ddf1dbef35&unit=A&tenant_id=656d9e573b2237290eceae1f`

      // const response = await axios.get(url);

      // }
      // })
      // .catch((error) => {
      //   console.error(error);
      // });
      setUnitId(unitId);

      // setPropertyId(propertyId);
      setRental(rental);
      setUnit(unit);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  const navigateToSummary = async (tenantId, entryIndex) => {
    // Construct the API URL
    const apiUrl = `${baseUrl}/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;

    try {
      // Fetch tenant data
      const response = await axios.get(apiUrl);
      const tenantData = response.data.data;

      // Set the tenantDetails state and loading state
      setTenantDetails(tenantData);
      setLoading(false);

      // Set the active tab to "Summary" and navigate to the appropriate path
      setValue("Summary");
      // navigate(
      //   `/admin/rentrolldetail/${tenantData.tenantId}/${tenantData.entryIndex}`
      // );
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  const navigateToTenant = async () => {
    const apiUrl = `${baseUrl}/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;

    try {
      // Fetch tenant data
      const response = await axios.get(apiUrl);
      const tenantData = response.data.data;

      // Access the rental_adress within the entries object
      const rentalAddress = tenantData.entries.rental_adress;
      setTenantDetails(tenantData);
      setLoading(false);
      // Set the active tab to "Tenant" and navigate to the appropriate path using rentalAddress
      setValue("Tenant");
      // navigate(`/admin/rentrolldetail/${tenantData.tenantId}/${tenantData.entryIndex}`);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  const navigateToFinancial = async () => {
    // Construct the API URL
    const apiUrl = `${baseUrl}/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;

    try {
      // Fetch tenant data
      const response = await axios.get(apiUrl);
      const tenantData = response.data.data;

      // Set the tenantDetails state and loading state
      setTenantDetails(tenantData);
      //console.log(tenant_firstName, "tenant_firstName");
      setLoading(false);

      // Set the active tab to "Tenant" and navigate to the appropriate path using rentalAddress
      setValue("Financial");
      // navigate(`/admin/rentrolldetail/${tenantData.tenantId}/${tenantData.entryIndex}`);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  // const tenantsData = async () => {
  //   // Construct the API URL
  //   const apiUrl = `${baseUrl}/tenant/tenant-detail/tenants/${rental}`;

  //   try {
  //     // Fetch tenant data
  //     const response = await axios.get(apiUrl);
  //     const tenantData = response.data.data;
  //     setTenantDetails(tenantData);
  //     setRentaldata(tenantData);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching tenant details:", error);
  //     setError(error);
  //     setLoading(false);
  //   }
  // };
  //console.log(rentaldata, "rentalData");
  const tenantsData = async () => {
    // Construct the API URL
    let apiUrl;
    if (unit === undefined) {
      apiUrl = `${baseUrl}/tenant/tenant-detail/tenants/${rental}`;
    } else {
      apiUrl = `${baseUrl}/tenant/tenant-detail/tenants/${rental}/${unit}`;
      console.log(apiUrl, "apiUrl");
    }
    try {
      // Fetch tenant data
      const response = await axios.get(apiUrl);
      const tenantData = response.data.data;
      setTimeout(() => {
        //setTenantDetails(tenantData);
        setRentaldata(tenantData);
        console.log(tenantData, "tenantsdata");
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTenantData();
  }, []);

  useEffect(() => {
    if (tenantId && entryIndex) {
      getTenantData();
      // getTenantData();
      // console.log(rental, "rental");
      if (source == "payment") {
        setValue("Financial");
      } else {
        setValue("Summary");
      }
      // tenantsData();

      if (rental) {
        // debugger
        // console.log(rentaldata, "rentalData");
        tenantsData();
        // navigateToTenant();
      }
    }
  }, [rental]);

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }

  const handleChange = (newValue) => {
    if (newValue === "Summary") {
      setValue("Summary"); // Update the active tab
      navigateToSummary(tenantId, entryIndex);
    } else if (newValue === "Tenant") {
      setValue("Tenant"); // Update the active tab
      navigateToTenant();
      tenantsData();
    } else if (newValue === "Financial") {
      setValue("Financial"); // Update the active tab
      navigateToFinancial();
    }
  };

  const calculateBalance = (data) => {
    // console.log(data);
    let balance = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      const currentEntry = data[i];
      for (let j = currentEntry.entries.length - 1; j >= 0; j--) {
        if (currentEntry.type === "Charge") {
          balance += currentEntry.entries[j].charges_amount;
        } else if (currentEntry.type === "Payment") {
          balance -= currentEntry.entries[j].amount;
        }
        data[i].entries[j].balance = balance;
      }
    }

    //console.log("data",data)
    return data;
  };
  const [myData, setMyData] = useState([]);

  const doSomething = async () => {
    let response = await axios.get(`${baseUrl}/tenant/tenants`);
    const data = response.data.data;
    const filteredData = data.filter((item) => item._id === tenantId);
    filteredData.forEach((item) => {
      console.log(item._id, "vaibhav");
    });
    setMyData(filteredData);
  };

  useEffect(() => {
    doSomething();
  }, []);

  const [myData1, setMyData1] = useState([]);
  console.log("myData1:", myData1);
  const doSomething1 = async () => {
    try {
      let response = await axios.get(`${baseUrl}/tenant/tenants`);
      const data = response.data.data;

      const filteredData = data.filter((item, index) => {
        // Replace 'tenantId' with the specific ID you're looking for
        return item._id === tenantId && item.entries.entryIndex === entryIndex;
      });

      setMyData1(filteredData);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    doSomething1();
  }, []);

  const getStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today >= start && today <= end) {
      return "Active";
    } else if (today < start) {
      return "FUTURE";
    } else if (today > end) {
      return "EXPIRED";
    } else {
      return "-";
    }
  };
  // const getGeneralLedgerData = async () => {
  //   const apiUrl = `${baseUrl}/payment/merge_payment_charge/${tenantId}`;

  //   try {
  //     const response = await axios.get(apiUrl);
  //     setLoader(false);

  //     if (response.data && response.data.data) {
  //       const mergedData = response.data.data;
  //       // console.log(mergedData)
  //       mergedData.sort((a, b) => new Date(b.date) - new Date(a.date));
  //       const dataWithBalance = calculateBalance(mergedData);

  //       setGeneralLedgerData(dataWithBalance);
  //     } else {
  //       console.error("Unexpected response format:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  const getGeneralLedgerData = async () => {
    // const apiUrl = `https://propertymanager.cloudpress.host/api/payment/merge_payment_charge/${tenantId}`;
    // try {
    //   const response = await axios.get(apiUrl);
    //   setLoader(false);
    //   if (response.data && response.data.data) {
    //     const mergedData = response.data.data;
    //     // console.log(mergedData)
    //     mergedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    //     const dataWithBalance = calculateBalance(mergedData);
    //     setGeneralLedgerData(dataWithBalance);
    //     setBalance(dataWithBalance[0].entries[0].balance);
    //   } else {
    //     console.error("Unexpected response format:", response.data);
    //   }
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
    // getTenantData();
  };

  useEffect(() => {
    getGeneralLedgerData();
  }, [tenantId]);

  const deleteCharge = async (Id) => {
    console.log(Id, "chargeId");

    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this entry!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      // Make the callback function async
      if (willDelete) {
        try {
          const response = await axios.delete(
            `${baseUrl}/payment_charge/delete_entry/${Id}`
          );
          if (response.data.statusCode === 200) {
            swal("Success!", "Entry deleted successfully!", "success");
            getGeneralLedgerData();
            getTenantData();
          } else {
            swal("", response.data.message, "error");
          }
        } catch (error) {
          console.error("Error deleting entry:", error);
          swal("", "Failed to delete entry", "error");
        }
      } else {
        swal("Cancelled", "Entry is safe :)", "info");
      }
    });
  };

  const editcharge = (chargeId) => {
    // console.log(tenantDetails,'tenant_firstName')
    navigate(`/admin/AddCharge/${chargeId}`, {
      state: { tenantDetails: tenantDetails },
    });

    // console.log(id);
  };
  const editpayment = (paymentId) => {
    navigate(`/admin/AddPayment/${paymentId}`, {
      state: { tenantDetails: tenantDetails },
    });
    // console.log(id);
  };

  // =====================================================================

  const [showModal, setShowModal] = useState(false);

  const handleMoveOutClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  // ============================================================================

  const [moveOutDate, setMoveOutDate] = useState("");
  const [noticeGivenDate, setNoticeGivenDate] = useState("");

  useEffect(() => {
    // Set noticeGivenDate to the current date when the component mounts
    const currentDate = new Date().toISOString().split("T")[0];
    setNoticeGivenDate(currentDate);
  }, []);
  const handleMoveout = () => {
    if (moveOutDate && noticeGivenDate) {
      const updatedApplicant = {
        moveout_date: moveOutDate,
        moveout_notice_given_date: noticeGivenDate,
        end_date: moveOutDate,
      };

      axios
        .put(
          `${baseUrl}/tenant/moveout/${tenantId}/${entryIndex}`,
          updatedApplicant
        )
        .then((res) => {
          console.log(res, "res");
          if (res.data.statusCode === 200) {
            swal("Success!", "Move-out Successfully", "success");
            // Close the modal if the status code is 200
            handleModalClose();
            getTenantData();
            tenantsData();
          }
        })
        .catch((err) => {
          swal("Error", "An error occurred while Move-out", "error");
          console.error(err);
        });
    } else {
      swal(
        "Error",
        "NOTICE GIVEN DATE && MOVE-OUT DATE must be required",
        "error"
      );
    }
  };

  // Function to generate PDF from table data
  const generatePDF = (selectedOption) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Tenant Statement", 75, 16);
    // set moment based on selected option
    let dateBasedOnOption;

    switch (selectedOption) {
      case "Last 30 days":
        dateBasedOnOption =
          moment().subtract(30, "days").format("MM/DD/YYYY") +
          "-" +
          moment().format("MM/DD/YYYY");
        break;
      case "Last 3 months":
        dateBasedOnOption =
          moment().subtract(3, "months").format("MM/DD/YYYY") +
          "-" +
          moment().format("MM/DD/YYYY");
        break;
      case "Last 12 months":
        dateBasedOnOption =
          moment().subtract(12, "months").format("MM/DD/YYYY") +
          "-" +
          moment().format("MM/DD/YYYY");
        break;
      case "All transactions":
        dateBasedOnOption = "";
        break;
      default:
        // Handle default case here
        break;
    }
    console.log(dateBasedOnOption, "datebased on option ");
    doc.setFontSize(11);
    doc.text(`${dateBasedOnOption}`, 83, 22);
    doc.addImage(Img, "JPEG", 166, 10, 30, 15);
    const rentalfirstname =
      tenantDetails.tenant_firstName + " " + tenantDetails.tenant_lastName;
    doc.setFontSize(10);
    doc.text("Name :", 15, 38);
    doc.text(rentalfirstname, 15, 44);
    const rentaladress = tenantDetails.entries.rental_adress +
    " - " +
    tenantDetails.entries.rental_units;
    doc.setFontSize(10);
    doc.text("Property :", 15, 52);
    doc.text(rentaladress, 15, 58);
    // const rentalunit =
    //   tenantDetails.entries.rental_adress +
    //   " - " +
    //   tenantDetails.entries.rental_units;
    // doc.setFontSize(8);
    // doc.text(rentalunit, 15, 65);
    doc.setFontSize(15);
    doc.text("Statement", 15, 72);
    const tableStartY = 75;

    const today = new Date(); // Get current date
    let startDate;

    // Calculate the start date based on the selected option
    switch (selectedOption) {
      case "Last 30 days":
        startDate = new Date();
        startDate.setDate(today.getDate() - 30);
        break;
      case "Last 3 months":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "Last 12 months":
        startDate = new Date();
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case "All transactions":
        startDate = null; // If all transactions are needed, set startDate to null
        break;
      default:
        startDate = null;
        break;
    }

    let filteredData = GeneralLedgerData && GeneralLedgerData.paymentAndCharges;
    console.log(filteredData, "vaibhav");

    if (startDate) {
      filteredData = GeneralLedgerData.paymentAndCharges.filter(
        (generalledger) => {
          const ledgerDate = new Date(generalledger.date)
            .toISOString()
            .split("T")[0];
          const start = startDate.toISOString().split("T")[0];
          const end = today.toISOString().split("T")[0];
          return ledgerDate >= start && ledgerDate <= end;
        }
      );
      console.log(filteredData, "filteredData");
    }

    const tableData = filteredData && [
      ...filteredData.reverse().map((entry) => {
        return [
          entry.date || "N/A",
          entry.type || "N/A",
          entry.account
            ? entry.account
            : entry.charge_type
            ? entry.charge_type
            : "N/A",
          entry.status || "-",
          entry.transactionid || "-",
          entry.type === "Charge" || entry.type === "Refund" ? "$" + entry.amount : "-",
          entry.type === "Payment" ? "$" + entry.amount : "-",
          entry.Total ? "$" + entry.Total : "-",
        ];
      }),
      [
        "",
        "",
        "",
        "",
        "",
        "",
        "Total Balance:",
        "$" + filteredData.reverse()[0]?.Total,
      ],
    ];

    // .flat();
    console.log(tableData, "tableData");

    doc.autoTable({
      startY: tableStartY,
      head: [
        ["Date", "Type", "Account", "Status","Transaction ID", "Increase", "Decrease", "Balance"],
      ],
      body: tableData,
      didDrawCell: (data) => {
        if (data.row.index === tableData.length - 1) {
          // Draw lines above and below "Balance Due" row
          doc.setLineWidth(1);
          doc.line(
            data.cell.x,
            data.cell.y,
            data.cell.x + data.cell.width,
            data.cell.y
          );
          doc.line(
            data.cell.x,
            data.cell.y + data.cell.height,
            data.cell.x + data.cell.width,
            data.cell.y + data.cell.height
          );
        }
      },
    });
    doc.save("general_ledger.pdf");
  };

  const getStatus1 = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today >= start && today <= end) {
      return "TENANT";
    } else if (today < start) {
      return "FUTURE TENANT";
    } else if (today > end) {
      return "PAST TENANT";
    } else {
      return "-";
    }
  };
  //sahil20231206
  // Filter the specific entry based on entryIndex from URL parameters
  const selectedEntry = myData.find(
    (item) => item.entries.entryIndex === entryIndex
  );
  // Check if the entry exists and then display the status
  const status = selectedEntry
    ? getStatus1(
        selectedEntry.entries.start_date,
        selectedEntry.entries.end_date
      )
    : "-";

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // console.log(isModalOpen, "isModalOpen");

  // const openCardForm = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   getCreditCard()
  // };

  // const [cardDetalis, setCardDetails] = useState([]);
  // const getCreditCard = async () => {
  //   const response = await axios.get(
  //     `${baseUrl}/creditcard/getCreditCard/${tenantId}`
  //   );
  //   setCardDetails(response.data);
  //   console.log(response, "yashu");
  // };

  // useEffect(() => {
  //   getCreditCard();
  // }, [tenantId]);

  const [refund, setRefund] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showOptionsId, setShowOptionsId] = useState("");
  const [actionType, setActionType] = useState("");
  const [ResponseData, setResponseData] = useState("");

  const toggleOptions = (id) => {
    setShowOptions(!showOptions);
    setShowOptionsId(id);
  };

  const generalledgerFormik = useFormik({
    initialValues: {
      date: "",
      rental_adress: "",
      tenant_id: "",
      entryIndex: "",
      amount: "",
      payment_type: "",
      customer_vault_id: "",
      billing_id: "",
      creditcard_number: "",
      expiration_date: "",
      cvv: "",
      tenant_firstName: "",
      tenant_lastName: "",
      email_name: "",
      memo: "",
      entries: [
        {
          paymentIndex: "",
          account: "",
          amount: "",
          balance: "",
        },
      ],
      attachment: "",
      total_amount: "",
      response: "",
      responsetext: "",
      authcode: "",
      transactionid: "",
      avsresponse: "",
      cvvresponse: "",
      type2: "",
      response_code: "",
      cc_type: "",
    },
    validationSchema: yup.object({
      date: yup.string().required("Required"),
      amount: yup.string().required("Required"),
      payment_type: yup.string().required("Required"),
      entries: yup.array().of(
        yup.object().shape({
          account: yup.string().required("Required"),
          // balance: yup.number().required("Required"),
          amount: yup.number().required("Required"),
        })
      ),
    }),
    onSubmit: (values) => {
      //handleRefundClick();
      // if (Number(generalledgerFormik.values.amount) === Number(total_amount)) {
      // handleSubmit(values);
      // }
    },
  });
  console.log("object", generalledgerFormik.values);
  const fetchData = async (id) => {
    try {
      const response = await axios.get(
        `${baseUrl}/payment_charge/get_entry/${id}`
      );
      if (response.data.statusCode === 200) {
        // setFile(response.data.data.charges_attachment);
        setResponseData(response.data.data);
        generalledgerFormik.setValues({
          date: response.data.data.date,
          amount: response.data.data.amount,
          payment_type: response.data.data.payment_type,
          customer_vault_id: response.data.data.customer_vault_id,
          billing_id: response.data.data.billing_id,
          charges_attachment: response.data.data.charges_attachment,
          memo: response.data.data.memo,
          entries: [
            {
              account: response.data.data.account || "",
              amount: response.data.data.amount || "",
              balance: response.data.data.amount || "",
            },
          ],
        });
        // setSelectedRec(response.data.data.tenant_firstName && response.data.data.tenant_lastName )
        // setSelectedCreditCard(response.data.data.billing_id)
        // setSelectedProp(response.data.data.payment_type)
        console.log("meet", id);
        console.log("meet", response.data);
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);
  console.log("response data=======", ResponseData);

  const handleRefundClick = async () => {
    try {
      setPaymentLoader(true);
      // Assuming 'item' is a prop or state variable
      const { _id, payment_type, transactionid } = ResponseData;
      const commonData = {
        transactionId: ResponseData.transactionid,
        customer_vault_id: ResponseData.customer_vault_id,
        billing_id: ResponseData.billing_id,
        amount: generalledgerFormik.values.amount,
        payment_type: ResponseData.payment_type,
        date: generalledgerFormik.values.date,
        total_amount: generalledgerFormik.values.amount,
        tenant_firstName: ResponseData.tenant_firstName,
        tenant_lastName: ResponseData.tenant_lastName,
        tenant_id: ResponseData.tenant_id,
        email_name: ResponseData.email_name,
        account: ResponseData.account,
        type: ResponseData.type,
        // memo: generalledgerFormik.values.memo,
        // cvv: ResponseData.cvv,
        _id: ResponseData._id,
        rental_adress: ResponseData.rental_adress,
        //unit: ResponseData.unit,
      };
      console.log("comman data=======", commonData);

      if (payment_type === "Credit Card") {
        const response = await axios.post(`${baseUrl}/nmipayment/new-refund`, {
          refundDetails: commonData,
        });
        if (response.data.status === 200) {
          swal("Success!", response.data.data, "success");
          await getGeneralLedgerData();
          closeRefund();
        } else if (response.data.status === 201) {
          swal("Warning!", response.data.data.error, "warning");
        } else {
          console.error("Failed to process refund:", response.statusText);
        }
      } else if (payment_type === "Cash" || payment_type === "Check") {
        const response = await axios.post(
          `${baseUrl}/nmipayment/new-manual-refund/${_id}`,
          {
            refundDetails: commonData,
          }
        );

        if (response.data.statusCode === 200) {
          //await setRefund(false);
          swal("Success!", response.data.message, "success");
          await getGeneralLedgerData();
          closeRefund();
        } else {
          swal("Warning!", response.statusText, "warning");
          console.error("Failed to process refund:", response.statusText);
        }
      } else {
        console.log(
          "Refund is only available for Credit Card, Cash, or Check payments."
        );
      }
    } catch (error) {
      if (error?.response?.data?.statusCode === 400) {
        swal("Warning!", error.response.data.message, "warning");
      }
      console.error("Error:", error);
    } finally {
      setPaymentLoader(false);
    }
  };

  return (
    <div>
      <Header />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              {loading ? (
                <tbody>
                  <tr>
                    <td></td>
                  </tr>
                </tbody>
              ) : (
                <>
                  <h1 style={{ color: "white" }}>
                    {tenantDetails.tenant_firstName +
                      " " +
                      tenantDetails.tenant_lastName}
                  </h1>
                  <h5 style={{ color: "white" }}>
                    {status} |{" "}
                    {tenantDetails._id
                      ? tenantDetails.entries.rental_adress
                      : " "}
                    {tenantDetails._id &&
                    tenantDetails.entries.rental_units !== undefined &&
                    tenantDetails.entries.rental_units !== ""
                      ? ` - ${tenantDetails.entries.rental_units}`
                      : ""}
                  </h5>
                </>
              )}
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/admin/RentRoll")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0"></CardHeader>
              <Col>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={(e, newValue) => handleChange(newValue)}
                      aria-label="lab API tabs example"
                      value={value}
                    >
                      <Tab
                        label="Summary"
                        value="Summary"
                        style={{ textTransform: "none" }}
                      />
                      <Tab
                        label="Financial"
                        value="Financial"
                        style={{ textTransform: "none" }}
                      />
                      <Tab
                        label="Tenant"
                        value="Tenant"
                        style={{ textTransform: "none" }}
                      />
                    </TabList>
                  </Box>
                  <TabPanel value="Summary">
                    <Row>
                      <div className="col">
                        <Card className="shadow">
                          <div className="table-responsive">
                            <div
                              className="row m-3"
                              style={{ overflow: "hidden" }}
                            >
                              <div className="col-md-8">
                                <div
                                  className="align-items-center table-flush"
                                  style={{ width: "100%" }}
                                >
                                  {loading ? (
                                    <tbody>
                                      <tr>
                                        <td>Loading tenant details...</td>
                                      </tr>
                                    </tbody>
                                  ) : error ? (
                                    <tbody>
                                      <tr>
                                        <td>Error: {error.message}</td>
                                      </tr>
                                    </tbody>
                                  ) : tenantDetails._id ? (
                                    <div className="w-100">
                                      <Row
                                        className="w-100 my-3"
                                        style={{
                                          fontSize: "18px",
                                          textTransform: "capitalize",
                                          color: "#5e72e4",
                                          fontWeight: "600",
                                          borderBottom: "1px solid #ddd",
                                        }}
                                      >
                                        <Col>Tenant Details</Col>
                                      </Row>
                                      <Row
                                        className="w-100 mb-1"
                                        style={{
                                          fontSize: "10px",
                                          textTransform: "uppercase",
                                          color: "#aaa",
                                        }}
                                      >
                                        <Col>Unit</Col>
                                        <Col>Rental Owner</Col>
                                        <Col>Tenant</Col>
                                      </Row>
                                      <Row
                                        className="w-100 mt-1 mb-5"
                                        style={{
                                          fontSize: "12px",
                                          textTransform: "capitalize",
                                          color: "#000",
                                        }}
                                      >
                                        <Col>
                                          {tenantDetails?.entries
                                            .rental_adress +
                                            " " +
                                            tenantDetails?.entries
                                              .rental_units || "N/A"}
                                        </Col>
                                        <Col>
                                          {tenantDetails.entries
                                            .rentalOwner_firstName
                                            ? tenantDetails.entries
                                                .rentalOwner_firstName +
                                              " " +
                                              tenantDetails.entries
                                                .rentalOwner_lastName
                                            : "N/A"}
                                        </Col>
                                        <Col>
                                          {tenantDetails?.tenant_firstName +
                                            " " +
                                            tenantDetails?.tenant_lastName ||
                                            "N/A"}
                                        </Col>
                                      </Row>
                                    </div>
                                  ) : (
                                    <tbody>
                                      <tr>
                                        <td>No tenant details found.</td>
                                      </tr>
                                    </tbody>
                                  )}
                                </div>
                                <div
                                  className="row mt-3"
                                  style={{ overflow: "auto" }}
                                >
                                  <Row
                                    className="w-100 my-3"
                                    style={{
                                      fontSize: "18px",
                                      textTransform: "capitalize",
                                      color: "#5e72e4",
                                      fontWeight: "600",
                                      borderBottom: "1px solid #ddd",
                                    }}
                                  >
                                    <Col>Lease Details</Col>
                                  </Row>
                                  <Row
                                    className="mb-1 m-0 p-0"
                                    style={{ fontSize: "12px", color: "#000" }}
                                  >
                                    <Table>
                                      <tbody
                                        className="tbbody p-0 m-0"
                                        style={{
                                          borderTopRightRadius: "5px",
                                          borderTopLeftRadius: "5px",
                                          borderBottomLeftRadius: "5px",
                                          borderBottomRightRadius: "5px",
                                        }}
                                      >
                                        <tr className="header">
                                          <th>Status</th>
                                          <th>Start - End</th>
                                          <th>Property</th>
                                          <th>Type</th>
                                          <th>Rent</th>
                                        </tr>
                                        {myData ? (
                                          <>
                                            {myData.map((item) => (
                                              <tr
                                                key={item._id}
                                                className="body"
                                              >
                                                <td>
                                                  {getStatus(
                                                    item.entries.start_date,
                                                    item.entries.end_date
                                                  )}
                                                </td>
                                                <td>
                                                  <Link
                                                    to={`/admin/rentrolldetail/${item._id}/${item.entries.entryIndex}`}
                                                  >
                                                    {formatDateWithoutTime(
                                                      item.entries.start_date
                                                    ) +
                                                      " To " +
                                                      formatDateWithoutTime(
                                                        item.entries.end_date
                                                      ) || "N/A"}
                                                  </Link>
                                                </td>
                                                <td>
                                                  {item.entries.rental_adress ||
                                                    "N/A"}
                                                </td>
                                                <td>
                                                  {item.entries.lease_type ||
                                                    "N/A"}
                                                </td>
                                                <td>{item.entries.amount}</td>
                                              </tr>
                                            ))}
                                          </>
                                        ) : null}
                                      </tbody>
                                    </Table>
                                  </Row>
                                </div>
                              </div>

                              <div className="col-md-4 mt-3">
                                <Card style={{ background: "#F4F6FF" }}>
                                  <CardContent>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          fontWeight: "bold",
                                        }}
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        Credit balance:
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          marginLeft: "10px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {GeneralLedgerData &&
                                          GeneralLedgerData.paymentAndCharges &&
                                          GeneralLedgerData.paymentAndCharges
                                            .length > 0 &&
                                          "$" +
                                            Math.abs(
                                              GeneralLedgerData
                                                .paymentAndCharges[0].Total
                                            )}
                                      </Typography>
                                    </div>
                                    <hr
                                      style={{
                                        marginTop: "2px",
                                        marginBottom: "6px",
                                      }}
                                    />

                                    <>
                                      <div>
                                        <div className="entry-container">
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                              alignItems: "center",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: 14,
                                                fontWeight: "bold",
                                                marginRight: "10px",
                                              }}
                                              color="text.secondary"
                                              gutterBottom
                                            >
                                              Rent:
                                            </Typography>
                                            {myData1.map((item, index) => (
                                              <Typography
                                                key={index}
                                                sx={{
                                                  fontSize: 14,
                                                  fontWeight: "bold",
                                                  marginRight: "10px",
                                                }}
                                                color="text.secondary"
                                                gutterBottom
                                              >
                                                ${item.entries.amount}
                                              </Typography>
                                            ))}
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              fontSize: 14,
                                              fontWeight: "bold",
                                            }}
                                            color="text.secondary"
                                            gutterBottom
                                          >
                                            Due date :
                                          </Typography>
                                          {myData1.map((item, index) => (
                                            <Typography
                                              key={index}
                                              sx={{
                                                fontSize: 14,
                                                fontWeight: "bold",
                                                marginRight: "10px",
                                              }}
                                              color="text.secondary"
                                              gutterBottom
                                            >
                                              {item.entries.nextDue_date}
                                            </Typography>
                                          ))}
                                        </div>
                                      </div>
                                    </>

                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Button
                                        color="primary"
                                        onClick={() =>
                                          navigate(
                                            `/admin/AddPayment/${tenantId}/${entryIndex}`
                                          )
                                        }
                                        style={{
                                          background: "white",
                                          color: "blue",
                                          marginRight: "10px",
                                        }}
                                      >
                                        Receive Payment
                                      </Button>
                                      {myData1.map((item, index) => (
                                        <Typography
                                          key={index}
                                          sx={{
                                            fontSize: 14,
                                            marginLeft: "10px",
                                            paddingTop: "10px",
                                            cursor: "pointer",
                                            color: "blue",
                                          }}
                                        >
                                          <Link
                                            to={`/admin/rentrolldetail/${tenantId}/${entryIndex}?source=payment`}
                                            onClick={() =>
                                              setValue(`Financial`)
                                            }
                                          >
                                            Lease Ledger
                                          </Link>
                                        </Typography>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card
                                  className="mt-1"
                                  style={{
                                    background: "#F4F6FF",
                                    maxWidth: "500px",
                                    height: "530px",
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                  }}
                                >
                                  <CardContent>
                                    <Typography
                                      sx={{
                                        fontSize: 17,
                                        fontWeight: "bold",
                                        fontFamily: "Arial",
                                        textTransform: "capitalize",
                                        marginRight: "10px",
                                      }}
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      Credit Cards
                                    </Typography>
                                    {/* Card Details */}
                                    {paymentLoader ? (
                                      <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                                        <RotatingLines
                                          strokeColor="grey"
                                          strokeWidth="5"
                                          animationDuration="0.75"
                                          width="50"
                                          visible={paymentLoader}
                                        />
                                      </div>
                                    ) : cardDetalis &&
                                      cardDetalis.length > 0 ? (
                                      <Table
                                        responsive
                                        style={{ overflowX: "hidden" }}
                                      >
                                        <tbody>
                                          <tr>
                                            <th>Card Number</th>
                                            <th>Card Type</th>
                                            <th></th>
                                          </tr>
                                          {cardDetalis.map((item, index) => (
                                            <tr
                                              key={index}
                                              style={{ marginBottom: "10px" }}
                                            >
                                              <td>
                                                <Typography
                                                  sx={{
                                                    fontSize: 14,
                                                    fontWeight: "bold",
                                                    fontStyle: "italic",
                                                    fontFamily: "Arial",
                                                    textTransform: "capitalize",
                                                    marginRight: "10px",
                                                  }}
                                                  color="text.secondary"
                                                  gutterBottom
                                                >
                                                  {item.cc_number}
                                                </Typography>
                                              </td>
                                              <td>
                                                <Typography
                                                  sx={{
                                                    fontSize: 14,
                                                    marginRight: "10px",
                                                  }}
                                                  color="text.secondary"
                                                  gutterBottom
                                                >
                                                  {item.cc_type}
                                                  {item.cc_type && (
                                                    <img
                                                      src={`https://logo.clearbit.com/${item.cc_type.toLowerCase()}.com`}
                                                      alt={`${item.cc_type} Logo`}
                                                      style={{
                                                        width: "40%",
                                                        marginLeft: "10%",
                                                      }}
                                                    />
                                                  )}
                                                </Typography>
                                              </td>
                                              <td>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <DeleteIcon
                                                    onClick={() =>
                                                      handleDeleteCard(
                                                        item.customer_vault_id,
                                                        item.billing_id
                                                      )
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                      marginRight: "5px",
                                                    }}
                                                  />
                                                  {/* <EditIcon
                              onClick={() =>
                                getEditData(item.customer_vault_id)
                              }
                              style={{ cursor: "pointer" }}
                            /> */}
                                                </div>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </Table>
                                    ) : (
                                      <Typography
                                        variant="body1"
                                        color="text.secondary"
                                      >
                                        No cards added.
                                      </Typography>
                                    )}

                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Button
                                        color="primary"
                                        onClick={() => openCardForm()}
                                        style={{
                                          background: "white",
                                          color: "blue",
                                          marginRight: "10px",
                                        }}
                                      >
                                        Add Credit Card
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Row>
                  </TabPanel>
                  <TabPanel value="Financial">
                    <Container className="mt--10" fluid>
                      <Row>
                        <Col xs="12" sm="6">
                          <FormGroup>
                            <h3 style={{ color: "blue" }}>Lease Ledger</h3>
                          </FormGroup>
                        </Col>
                        <Col
                          className="d-flex justify-content-end"
                          xs="12"
                          sm="6"
                        >
                          <Button
                            color="primary"
                            ////  href="#rms"
                            onClick={() =>
                              navigate(
                                `/admin/AddPayment/${tenantId}/${entryIndex}`,
                                {
                                  state: {
                                    unit_name: unit,
                                    unit_id: unitId,
                                    property_id: propertyId,
                                    rental_adress: rental,
                                  },
                                }
                              )
                            }
                            style={{
                              background: "white",
                              color: "blue",
                              marginRight: "10px",
                            }}
                          >
                            Receive Payment
                          </Button>
                          <Button
                            color="primary"
                            ////  href="#rms"
                            onClick={() =>
                              navigate(
                                `/admin/AddCharge/${tenantId}/${entryIndex}`,
                                {
                                  state: {
                                    unit_name: unit,
                                    unit_id: unitId,
                                    property_id: propertyId,
                                    rental_adress: rental,
                                  },
                                }
                              )
                            }
                            style={{ background: "white", color: "blue" }}
                          >
                            Enter Charge
                          </Button>
                        </Col>
                      </Row>
                      <br />
                      <Row
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                          <DropdownToggle caret>Export</DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() => handleOptionClick("Last 30 days")}
                            >
                              Last 30 days
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleOptionClick("Last 3 months")}
                            >
                              Last 3 months
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleOptionClick("Last 12 months")
                              }
                            >
                              Last 12 months
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleOptionClick("All transactions")
                              }
                            >
                              All transactions
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </Row>
                      <br />
                      <Row>
                        <div className="col">
                          {loader ? (
                            <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                              <RotatingLines
                                strokeColor="grey"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="50"
                                visible={loader}
                              />
                            </div>
                          ) : (
                            <Card className="shadow">
                              <CardHeader className="border-0"></CardHeader>

                              <Table
                                className="align-items-center table-flush"
                                responsive
                              >
                                <thead className="thead-light">
                                  <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Transaction</th>
                                    <th scope="col">Account</th>
                                    <th scope="col">Increase</th>
                                    <th scope="col">Decrease</th>
                                    <th scope="col">Balance</th>
                                    <th scope="col">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {GeneralLedgerData &&
                                    GeneralLedgerData?.paymentAndCharges?.map(
                                      (generalledger) => (
                                        <>
                                          <tr key={`${generalledger._id}`}>
                                            <td>{generalledger.date || "-"}</td>
                                            <td>{generalledger.type || "-"}</td>

                                            <td
                                              style={{
                                                color:
                                                 ( generalledger.type ===
                                                  "Payment" && generalledger.status === "Success")
                                                    ? "#50975E"
                                                    :  ( generalledger.type ===
                                                      "Refund" && generalledger.status === "Success")
                                                    ? "#ffc40c"
                                                    :  (generalledger.status === "Failure")
                                                    ? "#AA3322"
                                                    : "inherit",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {generalledger.status &&
                                              generalledger.payment_type
                                                ? `Manual ${generalledger.type} ${generalledger.status} for ${generalledger.payment_type}`
                                                : "- - - - - - - - - - - - - - - - -"}
                                              {generalledger.transactionid
                                                ? ` (#${generalledger.transactionid})`
                                                : ""}
                                            </td>

                                            <td>
                                              {generalledger.account || "-"}
                                            </td>
                                            <td>
                                              {generalledger.type ===
                                                "Charge" ||
                                              generalledger.type === "Refund"
                                                ? "$" + generalledger.amount
                                                : "-"}
                                            </td>
                                            <td>
                                              {generalledger.type === "Payment"
                                                ? "$" + generalledger.amount
                                                : "-"}
                                            </td>
                                            <td>
                                              {generalledger.Total !== undefined
                                                ? generalledger.Total >= 0
                                                  ? `$${generalledger.Total}`
                                                  : `$(${Math.abs(
                                                      generalledger.Total
                                                    )})`
                                                : "0"}
                                              {/* {calculateBalance(
                                                  generalledger.type,
                                                  entry,
                                                  index
                                                )} */}
                                            </td>
                                            <td>
                                              {/* {generalledger.type ===
                                                  "Charge" && (
                                                  <div
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    <DeleteIcon
                                                      onClick={() => {
                                                        console.log(
                                                          generalledger,
                                                          "geennennene"
                                                        );
                                                        deleteCharge(
                                                          generalledger._id
                                                        );
                                                      }}
                                                    />
                                                  </div>
                                                )}

                                                {generalledger.type ===
                                                  "Charge" && (
                                                  <div
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      editcharge(
                                                        generalledger._id
                                                      );
                                                    }}
                                                  >
                                                    <EditIcon />
                                                  </div>
                                                )}
                                                {generalledger.type ===
                                                  "Payment" && (
                                                  <div
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      editpayment(
                                                        generalledger._id
                                                      );
                                                    }}
                                                  >
                                                    <EditIcon />
                                                  </div>
                                                )} */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  gap: "5px",
                                                }}
                                              >
                                                {generalledger?.status !==
                                                  "Failure" &&
                                                generalledger?.type !==
                                                  "Refund" ? (
                                                  <UncontrolledDropdown nav>
                                                    <DropdownToggle
                                                      className="pr-0"
                                                      nav
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        toggleOptions(
                                                          generalledger?._id
                                                        )
                                                      }
                                                    >
                                                      <span
                                                        className="avatar avatar-sm rounded-circle"
                                                        style={{
                                                          margin: "-20px",
                                                          background:
                                                            "transparent",
                                                          color: "lightblue",
                                                          fontWeight: "bold",
                                                          border:
                                                            "2px solid lightblue",
                                                          padding: "10px",
                                                          display: "flex",
                                                          alignItems: "center",
                                                          justifyContent:
                                                            "center",
                                                        }}
                                                      >
                                                        ...
                                                      </span>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-arrow">
                                                      {generalledger?._id ===
                                                        showOptionsId && (
                                                        <div>
                                                          {generalledger?.status ===
                                                            "Success" && (
                                                            <DropdownItem
                                                              // style={{color:'black'}}
                                                              onClick={() => {
                                                                fetchData(
                                                                  generalledger._id
                                                                );
                                                                setIsRefundOpen(
                                                                  true
                                                                );
                                                                setRefund(true);
                                                              }}
                                                            >
                                                              Refund
                                                            </DropdownItem>
                                                          )}
                                                          {(generalledger?.status ===
                                                            "Pending" ||
                                                            generalledger?.payment_type ===
                                                              "Cash" ||
                                                            generalledger?.payment_type ===
                                                              "Check" ||
                                                            generalledger?.type ===
                                                              "Charge") && (
                                                            <DropdownItem
                                                              tag="div"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                editpayment(
                                                                  generalledger._id
                                                                );
                                                              }}
                                                            >
                                                              Edit
                                                            </DropdownItem>
                                                          )}
                                                        </div>
                                                      )}
                                                    </DropdownMenu>
                                                  </UncontrolledDropdown>
                                                ) : (
                                                  <div
                                                    style={{
                                                      fontSize: "15px",
                                                      fontWeight: "bolder",
                                                      paddingLeft: "5px",
                                                    }}
                                                  >
                                                    --
                                                  </div>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        </>
                                      )
                                    )}
                                </tbody>
                              </Table>
                            </Card>
                          )}
                        </div>
                      </Row>
                      <br />
                      <br />
                    </Container>
                  </TabPanel>
                  <TabPanel value="Tenant">
                    <CardHeader className="border-0">
                      <span>
                        <span>Property :</span>
                        <h2 style={{ color: "blue" }}>
                          {rental}
                          {unit && `- ${unit}`}
                        </h2>
                      </span>
                    </CardHeader>
                    <Row>
                      <Col>
                        {Array.isArray(rentaldata) ? (
                          <Grid container spacing={2}>
                            {console.log(rentaldata, "rentalsdat")}
                            {rentaldata.map((tenant, index) => (
                              <Grid item xs={12} sm={6} key={index}>
                                {tenant.entries.map((entry) => (
                                  <Box
                                    key={index}
                                    border="1px solid #ccc"
                                    borderRadius="8px"
                                    padding="16px"
                                    maxWidth="700px"
                                    margin="20px"
                                  >
                                    {!entry.moveout_notice_given_date ? (
                                      <div
                                        className="d-flex justify-content-end h5"
                                        onClick={handleMoveOutClick}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <LogoutIcon fontSize="small" /> Move out
                                      </div>
                                    ) : (
                                      <div
                                        className="d-flex justify-content-end h5"
                                        // style={{ cursor: "pointer" }}
                                      >
                                        <DoneIcon fontSize="small" /> Move Out
                                      </div>
                                    )}

                                    <Modal
                                      show={showModal}
                                      onHide={handleModalClose}
                                    >
                                      <Modal.Header>
                                        <Modal.Title>
                                          Move out tenants
                                        </Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>
                                        <div>
                                          Select tenants to move out. If
                                          everyone is moving, the lease will end
                                          on the last move-out date. If some
                                          tenants are staying, you’ll need to
                                          renew the lease. Note: Renters
                                          insurance policies will be permanently
                                          deleted upon move-out.
                                        </div>
                                        <hr />
                                        {/* {rentaldata?.map((country) => ( */}
                                        <React.Fragment>
                                          <Table striped bordered responsive>
                                            <thead>
                                              <tr>
                                                <th>Address / Unit</th>
                                                <th>LEASE TYPE</th>
                                                <th>START - END</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {/* Example rows */}
                                              <tr>
                                                <td>
                                                  {entry.rental_adress
                                                    ? entry.rental_adress
                                                    : ""}{" "}
                                                  {entry.rental_units
                                                    ? entry.rental_units
                                                    : ""}
                                                </td>
                                                <td>Fixed</td>
                                                <td>
                                                  {entry.start_date
                                                    ? entry.start_date
                                                    : ""}{" "}
                                                  {entry.end_date
                                                    ? entry.end_date
                                                    : ""}
                                                </td>
                                              </tr>
                                              {/* Add more rows dynamically based on your data */}
                                            </tbody>
                                          </Table>
                                          <Table striped bordered responsive>
                                            <thead>
                                              <tr>
                                                <th>TENANT</th>
                                                <th>NOTICE GIVEN DATE</th>
                                                <th>MOVE-OUT DATE</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {/* Example rows */}
                                              <tr>
                                                <td>
                                                  {tenant.tenant_firstName +
                                                    " "}{" "}
                                                  {tenant.tenant_lastName}
                                                </td>
                                                <td>
                                                  <div className="col">
                                                    <input
                                                      type="date"
                                                      className="form-control"
                                                      placeholder="Notice Given Date"
                                                      value={noticeGivenDate}
                                                      // onChange={(e) =>
                                                      //   setMoveOutDate(
                                                      //     e.target.value
                                                      //   )
                                                      // }
                                                      onChange={(e) =>
                                                        setNoticeGivenDate(
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className="col">
                                                    <input
                                                      type="date"
                                                      className="form-control"
                                                      placeholder="Move-out Date"
                                                      value={moveOutDate}
                                                      onChange={(e) =>
                                                        setMoveOutDate(
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </td>
                                              </tr>
                                              {/* Add more rows dynamically based on your data */}
                                            </tbody>
                                          </Table>
                                        </React.Fragment>
                                        {/* ))} */}
                                      </Modal.Body>
                                      <Modal.Footer>
                                        <Button
                                          style={{ backgroundColor: "#008000" }}
                                          onClick={handleMoveout}
                                        >
                                          Move out
                                        </Button>
                                        <Button
                                          style={{ backgroundColor: "#ffffff" }}
                                          onClick={handleModalClose}
                                        >
                                          Close
                                        </Button>
                                        {/* You can add additional buttons or actions as needed */}
                                      </Modal.Footer>
                                    </Modal>

                                    <Row>
                                      <Col lg="2">
                                        <Box
                                          width="40px"
                                          height="40px"
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                          backgroundColor="grey"
                                          borderRadius="8px"
                                          color="white"
                                          fontSize="24px"
                                        >
                                          <AssignmentIndIcon />
                                        </Box>
                                      </Col>

                                      <Col lg="7">
                                        <div
                                          style={{
                                            color: "blue",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {tenant.tenant_firstName || "N/A"}{" "}
                                          {tenant.tenant_lastName || "N/A"}
                                          <br></br>
                                          {entry.rental_adress}
                                          {entry.rental_units !== "" &&
                                          entry.rental_units !== undefined
                                            ? ` - ${entry.rental_units}`
                                            : null}
                                        </div>

                                        <div>
                                          {" "}
                                          {formatDateWithoutTime(
                                            entry.start_date
                                          ) || "N/A"}{" "}
                                          to{" "}
                                          {formatDateWithoutTime(
                                            entry.end_date
                                          ) || "N/A"}
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              fontSize: "2px",
                                              color: "black",
                                            }}
                                          >
                                            <PhoneAndroidIcon />
                                          </Typography>
                                          {tenant.tenant_mobileNumber || "N/A"}
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              fontSize: "7px",
                                              color: "black",
                                            }}
                                          >
                                            <MailIcon />
                                          </Typography>
                                          {tenant.tenant_email || "N/A"}
                                        </div>
                                        <div
                                          style={
                                            entry.moveout_notice_given_date
                                              ? {
                                                  // display:"block",
                                                  display: "flex",
                                                  flexDirection: "row",
                                                  marginTop: "10px",
                                                }
                                              : {
                                                  display: "none",
                                                }
                                          }
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              // fontSize: "7px",
                                              color: "black",
                                            }}
                                          >
                                            Notice date:
                                          </Typography>
                                          {entry.moveout_notice_given_date ||
                                            "N/A"}
                                        </div>
                                        <div
                                          style={
                                            entry.moveout_date
                                              ? {
                                                  // display:"block",
                                                  display: "flex",
                                                  flexDirection: "row",
                                                  marginTop: "10px",
                                                }
                                              : {
                                                  display: "none",
                                                }
                                          }
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              // fontSize: "7px",
                                              color: "black",
                                            }}
                                          >
                                            Move out:
                                          </Typography>
                                          {entry.moveout_date || "N/A"}
                                        </div>
                                      </Col>
                                    </Row>
                                  </Box>
                                ))}
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <h3>No data available....</h3>
                        )}
                      </Col>
                      <Col xs="12" md="6" lg="4" xl="3">
                        <Card style={{ background: "#F4F6FF" }}>
                          <CardContent>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  fontWeight: "bold",
                                }}
                                color="text.secondary"
                                gutterBottom
                              >
                                Credit balance:
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  marginLeft: "10px",
                                  fontWeight: "bold",
                                }}
                              >
                                {console.log(
                                  GeneralLedgerData,
                                  "GeneralLeder Data"
                                )}
                                {GeneralLedgerData &&
                                  GeneralLedgerData.paymentAndCharges &&
                                  GeneralLedgerData.paymentAndCharges.length >
                                    0 &&
                                  "$" +
                                    Math.abs(
                                      GeneralLedgerData.paymentAndCharges[0]
                                        .Total
                                    )}
                              </Typography>
                            </div>
                            <hr
                              style={{
                                marginTop: "2px",
                                marginBottom: "6px",
                              }}
                            />
                            {/* Display entries data */}
                            {/* {paymentData.entries &&
                          paymentData.entries.length > 0 && ( */}
                            <>
                              <div>
                                {/* {paymentData.entries.map(
                                  (entry, index) => ( */}
                                <div className="entry-container">
                                  {/* <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      marginBottom: "5px",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                      }}
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      Prepayments:
                                    </Typography>
                                    <Typography sx={{ fontSize: 14 }}>
                                       entry.amount 
                                    </Typography>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      marginBottom: "5px",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                      }}
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      Deposite held:
                                    </Typography>
                                  </div> */}
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      marginBottom: "5px",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                      }}
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      Rent:
                                    </Typography>
                                    {myData1.map((item) => (
                                      <>
                                        <Typography
                                          sx={{
                                            fontSize: 14,
                                            fontWeight: "bold",
                                            marginRight: "10px",
                                          }}
                                          color="text.secondary"
                                          gutterBottom
                                        >
                                          ${item.entries.amount}
                                        </Typography>
                                      </>
                                    ))}
                                  </div>
                                </div>
                                {/* )
                                )} */}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  marginTop: "10px",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                  }}
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  Due date :
                                </Typography>
                                {myData1.map((item) => (
                                  <>
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                      }}
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      {item.entries.nextDue_date}
                                    </Typography>
                                  </>
                                ))}
                              </div>
                            </>
                            {/* )} */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginTop: "10px",
                              }}
                            >
                              <Button
                                color="primary"
                                ////  href="#rms"
                                onClick={() =>
                                  navigate(
                                    `/admin/AddPayment/${tenantId}/${entryIndex}`,
                                    {
                                      state: {
                                        unit_name: unit,
                                        unit_id: unitId,
                                        property_id: propertyId,
                                        rental_adress: rental,
                                      },
                                    }
                                  )
                                }
                                style={{
                                  background: "white",
                                  color: "blue",
                                  marginRight: "10px",
                                }}
                              >
                                Receive Payment
                              </Button>

                              {myData1.map((item) => (
                                <>
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      marginLeft: "10px",
                                      paddingTop: "10px",
                                      cursor: "pointer",
                                      color: "blue",
                                    }}
                                    // onClick={() => handleChange("Financial")}
                                  >
                                    <Link
                                      to={`/admin/rentrolldetail/${tenantId}/${entryIndex}?source=payment`}
                                      onClick={() => {
                                        setValue(`Financial`);
                                      }}
                                    >
                                      Lease Ledger
                                    </Link>
                                  </Typography>
                                </>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </Col>
                    </Row>
                    <Row></Row>
                  </TabPanel>
                </TabContext>
              </Col>
            </Card>
          </div>
        </Row>
        <br />
        <br />
      </Container>

      <Modal
        isOpen={isRefundOpen}
        toggle={closeRefund}
        style={{ maxWidth: "1000px" }}
      >
        <ModalHeader toggle={closeRefund} className="bg-secondary text-white">
          <strong style={{ fontSize: 18 }}>Make Refund</strong>
        </ModalHeader>

        <Form>
          <ModalBody>
            <Row>
              <Col lg="2">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-unitadd">
                    Date
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-unitadd"
                    placeholder="3000"
                    type="date"
                    name="date"
                    onBlur={generalledgerFormik.handleBlur}
                    onChange={generalledgerFormik.handleChange}
                    value={generalledgerFormik.values.date}
                  />
                  {generalledgerFormik.touched.date &&
                  generalledgerFormik.errors.date ? (
                    <div style={{ color: "red" }}>
                      {generalledgerFormik.errors.date}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="4">
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-property"
                  >
                    Refund Amount *
                  </label>
                  <Input
                    type="text"
                    id="amount"
                    placeholder="Enter amount"
                    name="amount"
                    onBlur={generalledgerFormik.handleBlur}
                    onWheel={(e) => e.preventDefault()}
                    onKeyDown={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        //event.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const numericValue = inputValue.replace(/\D/g, "");
                      generalledgerFormik.values.amount = numericValue;
                      generalledgerFormik.handleChange({
                        target: {
                          name: "amount",
                          value: numericValue,
                        },
                      });
                    }}
                    //-onChange={generalledgerFormik.handleChange}
                    value={generalledgerFormik.values.amount}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col lg="3">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-unitadd">
                    Memo
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-unitadd"
                    placeholder="if left blank, will show 'Payment'"
                    type="text"
                    name="memo"
                    onBlur={generalledgerFormik.handleBlur}
                    onChange={generalledgerFormik.handleChange}
                    value={generalledgerFormik.values.memo}
                  />

                  {generalledgerFormik.touched.memo &&
                  generalledgerFormik.errors.memo ? (
                    <div style={{ color: "red" }}>
                      {generalledgerFormik.errors.memo}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            {paymentLoader ? (
              <Button disabled color="success" type="submit">
                Loading
              </Button>
            ) : (
              <Button
                color="success"
                type="submit"
                onClick={(e) => {
                  handleRefundClick();
                  e.preventDefault();
                }}
              >
                Make Refund
              </Button>
            )}
            <Button onClick={closeRefund}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Modal
        isOpen={isModalsOpen}
        toggle={closeModals}
        style={{ maxWidth: "1000px" }}
      >
        <ModalHeader toggle={closeModals} className="bg-secondary text-white">
          <strong style={{ fontSize: 18 }}>Add Credit Card</strong>
        </ModalHeader>
        <ModalBody>
          <CreditCardForm
            tenantId={tenantId}
            closeModal={closeModals}
            //getCreditCard={getCreditCard}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default RentRollDetail;
