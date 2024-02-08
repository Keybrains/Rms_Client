import {
  Button,
  Card,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Table,
  Label,
  InputGroupAddon,
  InputGroup,
  Dropdown,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { CardContent, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { RotatingLines } from "react-loader-spinner";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import * as yup from "yup";
import swal from "sweetalert";
import Header from "components/Headers/Header";
import { Formik, useFormik } from "formik";
import Edit from "@mui/icons-material/Edit";
import moment from "moment";
import axios from "axios";
import valid from "card-validator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheckAlt, faUndo } from "@fortawesome/free-solid-svg-icons";
import CreditCardForm from "./CreditCardForm";
import SurchargeForm from "./Surcharge";

const DemoPayment = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const tenantId = "658a70ea75bd6d8f3b6dbfde";

  const [isEditable, setIsEditable] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [rental_adress, setRentalAddress] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState(null);
  const [tenantDetails, setTenantDetails] = useState({});
  const { id } = useParams();
  const [GeneralLedgerData, setGeneralLedgerData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [userdropdownOpen, setuserDropdownOpen] = React.useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [searchQueryy, setSearchQueryy] = useState("");
  const [unit, setUnit] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [refund, setRefund] = useState(false);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  //const [addCard, setAddCard] = useState(false);
  const [isModalsOpen, setIsModalsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openCardForm = () => {
    setIsModalsOpen(true);
  };

  const openSurchargeForm = () => {
    setIsOpen(true);
  };

  const closeSurchargeModel = () => {
    setIsOpen(false);
  };

  const closeModals = () => {
    setIsModalsOpen(false);
    getCreditCard();
    getMultipleCustomerVault();
  };

  const handleSearch = (e) => {
    setSearchQueryy(e.target.value);
  };

  const toggle9 = () => {
    setuserDropdownOpen((prevState) => !prevState);
  };

  const toggle10 = () => {
    setUnitDropdownOpen((prevState) => !prevState);
  };

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

  const [isSubmitted, setIsSubmitted] = useState(false);

  const openModal = () => {
    //   financialFormik.setFieldValue("tenantId", cookie_id);
    //   financialFormik.setFieldValue("first_name", tenantDetails.tenant_firstName);
    //   financialFormik.setFieldValue("last_name", tenantDetails.tenant_lastName);
    //   financialFormik.setFieldValue("email_name", tenantDetails.tenant_email);
    setIsSubmitted(false);
    financialFormik.resetForm();

    // Update other selected values
    // setSurchargePercentage(0);
    setSelectedCreditCard("");
    setSelectedPaymentType("");
    setSelectedPropertyType("");
    setSelectedUnit("");
    setSelectedAccount("");
    setPaymentId("");
    setIsModalOpen(true);
    getCreditCard();
    getMultipleCustomerVault();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (refund === true) {
      setRefund(false);
    }
    setActionType("");
  };
  const [loader, setLoader] = React.useState(true);
  const [cardLogo, setCardLogo] = useState("");

  const fetchCardLogo = async (cardType) => {
    try {
      if (!cardType) {
        throw new Error("Card type is undefined");
      }

      const response = await axios.get(
        `https://logo.clearbit.com/${cardType.toLowerCase()}.com`
      );
      setCardLogo(response.config.url);
    } catch (error) {
      console.error("Error fetching card logo:", error);
      setCardLogo("");
    }
  };

  useEffect(() => {
    fetchCardLogo();
  }, []);

  const [customervault, setCustomervault] = useState([]);
  const [cardDetalis, setCardDetails] = useState([]);
  const [isBilling, setIsBilling] = useState(false);
  const [vaultId, setVaultId] = useState(false);

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

  React.useEffect(() => {
    fetch(`${baseUrl}/rentals/allproperty`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setPropertyData(data.data);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  }, []);

  const [totalAmount1, setTotalAmount1] = useState();

  const financialFormik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      check_number: "",
      email_name: "",
      card_number: "",
      amount: "",
      surcharge: "",
      surcharge_percent: "",
      date: "",
      memo: "",
      paymentType: "",
      status: "",
      account: "",
      expiration_date: "",
      cvv: "",
      tenantId: "",
      property: "",
      unit: "",
      type2: "Payment",
      customer_vault_id: "",
      billing_id: "",
    },
    validationSchema: yup.object({
      first_name: yup.string().required("Required"),
      last_name: yup.string().required("Required"),
      email_name: yup.string().required("Required"),
      property: yup.string().required("Required"),
      amount: yup.number().required("Required"),
      date: yup.date().required("Required"),
      account: yup.string().required("Required"),
      paymentType: yup.string().required("Required"),
    }),
    onSubmit: (values, action) => {
      setIsSubmitted(true);
      if (isEditable === true && paymentId) {
        editpayment(paymentId);
      } else if (refund === true && paymentId) {
        handleRefundClick();
      } else {
        handleFinancialSubmit(values, action);
      }
    },
  });

  const handlePropertyTypeSelect = async (property) => {
    setSelectedPropertyType(property.rental_adress || property.property);
    financialFormik.setFieldValue(
      "property",
      selectedPropertyType || property.property || ""
    );
    financialFormik.setFieldValue("unit", selectedUnit || "");
    setUnit(property.rental_unit);
    setPropertyId(property.property_id);
    setSelectedUnit("");
    try {
      const units = await fetchUnitsByProperty(
        property.rental_adress || property.property
      );
      setUnitData(
        units.filter(
          (item) => item.rental_units !== undefined && item.rental_units !== ""
        )
      );
    } catch (error) {
      console.error("Error handling selected property:", error);
    }
  };

  const handleUnitSelect = (property) => {
    setSelectedUnit(property.rental_units);
    financialFormik.setFieldValue("unit", selectedUnit || "");
    financialFormik.setFieldValue("unit", property.rental_units || "");
  };

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
      // console.log(jwt,'accessType');
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getGeneralLedgerData = async () => {
    try {
      const url = `${baseUrl}/nmipayment/nmipayments`;
      try {
        const response = await axios.get(url);
        setGeneralLedgerData(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / pageItem));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getGeneralLedgerData();
  }, [pageItem]);

  const navigate = useNavigate();

  const [paymentLoader, setPaymentLoader] = useState(false);
  const [selectedCreditCard, setSelectedCreditCard] = useState(null);

  const handleCreditCardSelection = (selectedCard) => {
    financialFormik.setValues({
      ...financialFormik.values,
      //customer_vault_id: selectedCard.customer_vault_id,
      billing_id: selectedCard.billing_id,
    });
    setSelectedCreditCard(selectedCard.billing_id);
  };

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/surcharge/surcharge/65c2286de41c9056bb233a85`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data.data) {
        setSurchargePercentage(data.data.surcharge_percent);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleFinancialSubmit = async (values, action) => {
    let url = `${baseUrl}/nmipayment/postnmipayments`;
    values.account = selectedAccount;

    try {
      setPaymentLoader(true);
      const financialDate = new Date(values.date);
      const currentDate = new Date();
      if (
        selectedPaymentType === "Credit Card" &&
        financialDate > currentDate
      ) {
        url = `${baseUrl}/nmipayment/postnmipayments`;
        values.status = "Pending";
        values.type2 = "Payment";
        values.surcharge_percent = surchargePercentage;
        values.total_amount = calculateTotalAmount();
      } else if (selectedPaymentType === "Credit Card") {
        url = `${baseUrl}/nmipayment/sale`;
        values.status = "Success";
        values.type2 = "Payment";
        values.total_amount = calculateTotalAmount();
      } else {
        url = `${baseUrl}/nmipayment/postnmipayments`;
        values.status = "Success";
        values.type2 = "Payment";
        values.total_amount = calculateTotalAmount();
      }

      const creditCardDetails = cardDetalis.find(
        (card) => card.billing_id === selectedCreditCard
      );

      if (creditCardDetails) {
        values.customer_vault_id = vaultId;
        values.billing_id = selectedCreditCard;
      } else {
        console.error(
          "Credit card details not found for selected card:",
          selectedCreditCard
        );
      }

      const response = await axios.post(url, {
        paymentDetails: values,
      });

      if (
        response.data &&
        (response.data.statusCode === 100 || response.status === 200)
      ) {
        swal("Success!", "Payment Successful", "success");
        await getGeneralLedgerData();
        closeModal();
      } else {
        console.error("Unexpected response format:", response.data);
        swal("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      swal("", error.message, "error");
    } finally {
      setPaymentLoader(false);
    }
  };

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  const [paginatedData, setPaginatedData] = useState([]);

  useEffect(() => {
    setPaginatedData(GeneralLedgerData.slice(startIndex, endIndex));
  }, [startIndex, endIndex, GeneralLedgerData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filterRentalsBySearch = () => {
    if (!searchQuery) {
      return GeneralLedgerData;
    }

    return GeneralLedgerData.filter((rental) => {
      // const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        (rental.type2 &&
          rental.type2.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (rental.account &&
          rental.account.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (rental.paymentType &&
          rental.paymentType
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (rental.amount &&
          rental.amount.toString().includes(searchQuery.toLowerCase())) ||
        (rental.transactionid &&
          rental.transactionid
            .toString()
            .includes(searchQuery.toLowerCase())) ||
        (rental.status &&
          rental.status.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  };

  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterRentalsBySearch();
    const paginatedData = filteredData.slice(startIndex, endIndex);
    // setFilterData(paginatedData)
    return paginatedData;
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const [oneTimeCharges, setOneTimeCharges] = useState([]);
  const [RecAccountNames, setRecAccountNames] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState("");

  const handlePaymentTypeChange = (type) => {
    setSelectedPaymentType(type);
    financialFormik.setFieldValue("paymentType", type);
  };

  useEffect(() => {
    fetch(`${baseUrl}/addaccount/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setAccountData(data.data);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  }, []);

  const fetchingRecAccountNames = async () => {
    fetch(`${baseUrl}/recurringAcc/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setRecAccountNames(data.data);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  };

  const fetchingOneTimeCharges = async () => {
    fetch(`${baseUrl}/onetimecharge/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setOneTimeCharges(data.data);
        } else {
          console.error("Error:", data.message);
        }
      });
  };

  useEffect(() => {
    fetchingRecAccountNames();
    fetchingOneTimeCharges();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleDropdown2 = () => {
    setDropdownOpen2(!dropdownOpen2);
  };

  const handleAccountSelection = (value) => {
    setSelectedAccount(value);
    financialFormik.values.account = value;
  };

  const [ResponseData, setResponseData] = useState("");

  const formatDate = (inputDate) => {
    const tryFormats = ["MM/YY", "M/YY", "MM/YYYY", "M/YYYY"];

    let formattedDate = null;

    for (const format of tryFormats) {
      const parsedDate = new Date(
        inputDate.replace(/(\d{1,2})(\d{2})/, `$1/01/$2`)
      );
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = parsedDate.toLocaleDateString("en-US", {
          month: "2-digit",
          year: "2-digit",
        });
        break;
      }
    }

    return formattedDate || "Invalid Date";
  };

  const getEditData = async (id) => {
    try {
      const response = await axios.get(
        `${baseUrl}/nmipayment/nmipayments/${id}`
      );
      if (response.data.statusCode === 200) {
        const responseData = response.data.data;
        openModal();
        handlePropertyTypeSelect(responseData);

        financialFormik.setValues({
          account: responseData.account || "",
          amount: responseData.amount || "",
          surcharge_percent: responseData.surcharge_percent || "",
          first_name: responseData.first_name || "",
          last_name: responseData.last_name || "",
          email_name: responseData.email_name || "",
          date: responseData.date || "",
          memo: responseData.memo || "",
          unit: responseData.unit || "",
          property: responseData.property || "",
          paymentType: responseData.paymentType || "",
          check_number: responseData.check_number || "",
        });
        // Update other selected values
        // setSurchargePercentage(responseData.surcharge_percent);
        setSelectedPaymentType(responseData.paymentType);
        setSelectedPropertyType(responseData.property);
        setSelectedUnit(responseData.unit);
        setSelectedAccount(responseData.account);
        setResponseData(responseData);
        setVaultId(responseData.vaultId);
        setSelectedCreditCard(responseData.billing_id);
        setPaymentId(id);
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const editpayment = async (id) => {
    try {
      setPaymentLoader(true);
      const response = await axios.get(
        `${baseUrl}/nmipayment/nmipayments/${id}`
      );

      if (response.data.statusCode === 200) {
        const updatedValues = {
          amount: financialFormik.values.amount,
          surcharge: financialFormik.values.surcharge,
          account: financialFormik.values.account,
          first_name: financialFormik.values.first_name,
          last_name: financialFormik.values.last_name,
          property: financialFormik.values.property,
          unit: financialFormik.values.unit,
          memo: financialFormik.values.memo,
          email_name: financialFormik.values.email_name,
          date: financialFormik.values.date,
          customer_vault_id: financialFormik.values.customer_vault_id,
          billing_id: financialFormik.values.billing_id,
          check_number: financialFormik.values.check_number,
          paymentType: financialFormik.values.paymentType,
          total_amount: calculateTotalAmount(),
        };

        const putUrl = `${baseUrl}/nmipayment/updatepayment/${id}`;
        const putResponse = await axios.put(putUrl, updatedValues);

        if (putResponse.data.statusCode === 200) {
          closeModal();
          await getGeneralLedgerData();
          swal("Success", "Payment Updated Successfully", "success");
          navigate(`/admin/Payment`);
        } else {
          swal("Error", putResponse.data.message, "error");
          console.error("Server Error:", putResponse.data.message);
        }
      } else {
        swal("Error", response.data.message, "error");
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    } finally {
      setPaymentLoader(false);
    }
  };

  const [showOptions, setShowOptions] = useState(false);
  const [showOptionsId, setShowOptionsId] = useState("");
  const [actionType, setActionType] = useState("");

  const toggleOptions = (id) => {
    setShowOptions(!showOptions);
    setShowOptionsId(id);
  };

  const handleRefundClick = async () => {
    try {
      setPaymentLoader(true);
      // Assuming 'item' is a prop or state variable
      const { _id, paymentType, transactionid } = ResponseData;

      const commonData = {
        transactionId: ResponseData.transactionid,
        customer_vault_id: ResponseData.customer_vault_id,
        billing_id: ResponseData.billing_id,
        tenantId: ResponseData.tenantId,
        amount: financialFormik.values.amount,
        paymentType: ResponseData.paymentType,
        date: financialFormik.values.date,
        total_amount: calculateTotalAmount(),
        first_name: ResponseData.first_name,
        last_name: ResponseData.last_name,
        email_name: ResponseData.email_name,
        account: ResponseData.account,
        type2: ResponseData.type2,
        memo: financialFormik.values.memo,
        cvv: ResponseData.cvv,
        property: ResponseData.property,
        unit: ResponseData.unit,
      };

      if (paymentType === "Credit Card") {
        const response = await axios.post(`${baseUrl}/nmipayment/refund`, {
          refundDetails: commonData,
        });
        if (response.data.status === 200) {
          swal("Success!", response.data.data, "success");
          await getGeneralLedgerData();
          closeModal();
        } else if (response.data.status === 201) {
          swal("Warning!", response.data.data.error, "warning");
        } else {
          console.error("Failed to process refund:", response.statusText);
        }
      } else if (paymentType === "Cash" || paymentType === "Check") {
        const response = await axios.post(
          `${baseUrl}/nmipayment/manual-refund/${_id}`,
          {
            refundDetails: commonData,
          }
        );

        if (response.data.statusCode === 200) {
          //await setRefund(false);
          swal("Success!", response.data.message, "success");
          await getGeneralLedgerData();
          closeModal();
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

  const [surchargePercentage, setSurchargePercentage] = useState();

  // Calculate total amount after surcharge
  const calculateTotalAmount = () => {
    const amount = parseFloat(financialFormik.values.amount) || 0;
    let totalAmount = amount;

    if (selectedPaymentType === "Credit Card" && !refund) {
      const surchargeAmount = (amount * surchargePercentage) / 100;
      financialFormik.setFieldValue("surcharge", surchargeAmount);
      totalAmount += surchargeAmount;
    }
    return totalAmount;
  };

  // const totalAmount = calculateTotalAmount();

  useEffect(() => {
    const totalAmount = calculateTotalAmount();
    setTotalAmount1(totalAmount);
  }, [financialFormik.values.amount, surchargePercentage, selectedPaymentType]);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--8 ml--10" fluid>
        <Row>
          <Col xs="12" sm="9">
            <FormGroup className="">
              <h1 style={{ color: "white", marginLeft: "20px" }}>Ledger</h1>
            </FormGroup>
          </Col>
          <Col xs="1.5" sm="1">
            <Button
              color="primary"
              onClick={() => {
                openSurchargeForm();
              }}
              size="sm"
              style={{
                background: "white",
                color: "blue",
              }}
            >
              Add Surcharge
            </Button>
          </Col>
          <Col xs="1.5" sm="1">
            <Button
              color="primary"
              onClick={() => {
                openCardForm();
              }}
              size="sm"
              style={{
                background: "white",
                color: "blue",
              }}
            >
              Add Cards
            </Button>
          </Col>

          <Col xs="1.5" sm="1">
            <Button
              color="primary"
              onClick={() => {
                openModal();
                setIsEditable(false);
              }}
              size="sm"
              style={{
                background: "white",
                color: "blue",
              }}
            >
              Make Payment
            </Button>
          </Col>
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
              // <Card className="shadow">
              <Container className="mt--10" fluid>
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
                        <CardHeader className="border-0">
                          <Row>
                            <Col xs="12" sm="6">
                              <FormGroup>
                                <Input
                                  fullWidth
                                  type="text"
                                  placeholder="Search"
                                  value={searchQuery}
                                  onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                  }
                                  style={{
                                    width: "100%",
                                    maxWidth: "200px",
                                    minWidth: "200px",
                                  }}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </CardHeader>

                        <Table
                          className="align-items-center table-flush"
                          responsive
                        >
                          <thead className="thead-light">
                            <tr>
                              <th scope="col">Date</th>
                              <th scope="col">Type</th>
                              <th scope="col">Status</th>
                              <th scope="col">Transaction Id</th>
                              <th scope="col">Payment Method</th>
                              <th scope="col">Account</th>
                              <th scope="col">Increase</th>
                              <th scope="col">Decrease</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterTenantsBySearchAndPage().map(
                              (item, index) => (
                                <React.Fragment key={index}>
                                  <tr
                                    key={item._id}
                                    style={{ position: "relative" }}
                                  >
                                    <td>{item?.date || "N/A"}</td>
                                    <td
                                      style={{
                                        color:
                                          item.type2 === "Refund"
                                            ? "darkred"
                                            : "green",
                                      }}
                                    >
                                      {" "}
                                      {item?.type2 === "Payment" && (
                                        <FontAwesomeIcon
                                          icon={faMoneyCheckAlt}
                                          style={{ color: "green" }}
                                        />
                                      )}
                                      {item?.type2 === "Refund" && (
                                        <FontAwesomeIcon
                                          icon={faUndo}
                                          style={{ color: "darkred" }}
                                        />
                                      )}
                                      &nbsp;{item?.type2 || "Payment"}
                                    </td>
                                    <td>{item?.status || "N/A"}</td>
                                    <td>
                                      {item?.transactionid ||
                                        "- - - - - - - - - -"}
                                    </td>
                                    <td>{item?.paymentType || "N/A"}</td>
                                    <td>{item?.account || "N/A"}</td>
                                    <td>
                                      ${" "}
                                      {item?.type2 === "Refund"
                                        ? item?.total_amount
                                        : "0"}
                                    </td>
                                    <td>
                                      ${" "}
                                      {item?.type2 !== "Refund"
                                        ? item?.total_amount
                                        : "0"}
                                    </td>
                                    <td>
                                      {item?.type2 === "Payment" &&
                                      item?.status !== "Failure" ? (
                                        <UncontrolledDropdown nav>
                                          <DropdownToggle
                                            className="pr-0"
                                            nav
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              toggleOptions(item?._id)
                                            }
                                          >
                                            <span
                                              className="avatar avatar-sm rounded-circle"
                                              style={{
                                                margin: "-20px",
                                                background: "transparent",
                                                color: "lightblue",
                                                fontWeight: "bold",
                                                border: "2px solid lightblue",
                                                padding: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                              }}
                                            >
                                              ...
                                            </span>
                                          </DropdownToggle>
                                          <DropdownMenu className="dropdown-menu-arrow">
                                            {item?._id === showOptionsId && (
                                              <div>
                                                {item?.status === "Success" && (
                                                  <DropdownItem
                                                    // style={{color:'black'}}
                                                    onClick={() => {
                                                      getEditData(item?._id);
                                                      setRefund(true);
                                                    }}
                                                  >
                                                    Refund
                                                  </DropdownItem>
                                                )}
                                                {(item?.status === "Pending" ||
                                                  item?.type2 === "Cash" ||
                                                  item?.type2 === "Check") && (
                                                  <DropdownItem
                                                    tag="div"
                                                    onClick={() => {
                                                      getEditData(item?._id);
                                                      setIsEditable(true);
                                                      setActionType(
                                                        "Update Payment"
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
                                    </td>
                                  </tr>
                                </React.Fragment>
                              )
                            )}
                          </tbody>
                        </Table>
                        {paginatedData.length > 0 ? (
                          <Row>
                            <Col className="text-right m-3">
                              <Dropdown
                                isOpen={leasedropdownOpen}
                                toggle={toggle2}
                              >
                                <DropdownToggle caret>
                                  {pageItem}
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    onClick={() => {
                                      setPageItem(10);
                                      setCurrentPage(1);
                                    }}
                                  >
                                    10
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => {
                                      setPageItem(25);
                                      setCurrentPage(1);
                                    }}
                                  >
                                    25
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => {
                                      setPageItem(50);
                                      setCurrentPage(1);
                                    }}
                                  >
                                    50
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => {
                                      setPageItem(100);
                                      setCurrentPage(1);
                                    }}
                                  >
                                    100
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                              <Button
                                className="p-0"
                                style={{ backgroundColor: "#d0d0d0" }}
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  fill="currentColor"
                                  className="bi bi-caret-left"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
                                </svg>
                              </Button>
                              <span>
                                Page {currentPage} of {totalPages}
                              </span>{" "}
                              <Button
                                className="p-0"
                                style={{ backgroundColor: "#d0d0d0" }}
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  fill="currentColor"
                                  className="bi bi-caret-right"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                                </svg>
                              </Button>{" "}
                            </Col>
                          </Row>
                        ) : (
                          <></>
                        )}
                      </Card>
                    )}
                  </div>
                </Row>
                <br />
                <br />
              </Container>
              // </Card>
            )}
          </div>
        </Row>
      </Container>
      <Modal
        isOpen={isModalOpen}
        toggle={closeModal}
        style={{ maxWidth: "650px" }}
      >
        <Form onSubmit={financialFormik.handleSubmit}>
          <ModalHeader toggle={closeModal} className="bg-secondary text-white">
            <strong style={{ fontSize: 18 }}>
              {refund === true ? "Make Refund" : actionType || "Make Payment"}
            </strong>
          </ModalHeader>

          <ModalBody>
            <div>
              <Row>
                <Col md="6">
                  <label
                    className="form-control-label"
                    htmlFor="input-property"
                  >
                    Property*
                  </label>
                  <FormGroup>
                    <Dropdown
                      isOpen={userdropdownOpen}
                      toggle={toggle9}
                      disabled={refund === true}
                    >
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
                              handlePropertyTypeSelect(property);
                              financialFormik.setFieldValue(
                                "property",
                                property.rental_adress
                              );
                            }}
                          >
                            {property.rental_adress}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                      {financialFormik.touched.property &&
                      financialFormik.errors.property ? (
                        <div style={{ color: "red", marginBottom: "10px" }}>
                          {financialFormik.errors.property}
                        </div>
                      ) : null}
                    </Dropdown>
                  </FormGroup>
                </Col>

                <Col md="6">
                  {unitData && unitData.length !== 0 ? (
                    <>
                      <label
                        className="form-control-label"
                        htmlFor="input-property"
                      >
                        Unit *
                      </label>
                      <FormGroup>
                        <Dropdown
                          isOpen={unitDropdownOpen}
                          toggle={toggle10}
                          disabled={refund === true}
                        >
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedUnit ? selectedUnit : "Select Unit"}
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                              width: "100%",
                              maxHeight: "200px",
                              overflowY: "auto",
                            }}
                          >
                            {unitData.length !== 0 &&
                              unitData?.map((property, index) => (
                                <DropdownItem
                                  key={index}
                                  onClick={() => {
                                    handleUnitSelect(property);
                                  }}
                                >
                                  {property.rental_units}
                                </DropdownItem>
                              ))}
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </>
                  ) : null}
                </Col>

                <Col md="6">
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-property"
                    >
                      Amount *
                    </label>
                    <Input
                      type="text"
                      id="amount"
                      placeholder="Enter amount"
                      name="amount"
                      onBlur={financialFormik.handleBlur}
                      onInput={(e) => {
                        const inputValue = e.target.value;
                        // Remove non-numeric and non-dot characters
                        const numericValue = inputValue.replace(/[^0-9.]/g, "");
                        const validNumericValue = numericValue.replace(
                          /(\.\d*\.|\D+)/g,
                          "$1"
                        );
                        e.target.value = validNumericValue;
                      }}
                      onChange={financialFormik.handleChange}
                      value={financialFormik.values.amount}
                    />
                    {financialFormik.touched.amount &&
                    financialFormik.errors.amount ? (
                      <div style={{ color: "red", marginBottom: "10px" }}>
                        {financialFormik.errors.amount}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-property"
                    >
                      Account *
                    </label>
                    <FormGroup>
                      <Dropdown
                        isOpen={dropdownOpen}
                        toggle={toggleDropdown}
                        disabled={refund === true}
                      >
                        <DropdownToggle caret>
                          {selectedAccount ? selectedAccount : "Select"}
                        </DropdownToggle>
                        <DropdownMenu
                          style={{
                            zIndex: 999,
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                        >
                          <DropdownItem header style={{ color: "blue" }}>
                            Liability Account
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              handleAccountSelection("Last Month's Rent")
                            }
                          >
                            Last Month's Rent
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              handleAccountSelection("Prepayments")
                            }
                          >
                            Prepayments
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              handleAccountSelection(
                                "Security Deposit Liability"
                              )
                            }
                          >
                            Security Deposit Liability
                          </DropdownItem>

                          <DropdownItem header style={{ color: "blue" }}>
                            Income Account
                          </DropdownItem>
                          {accountData?.map((item) => (
                            <DropdownItem
                              key={item._id}
                              onClick={() =>
                                handleAccountSelection(item.account_name)
                              }
                            >
                              {item.account_name}
                            </DropdownItem>
                          ))}
                          {RecAccountNames ? (
                            <>
                              <DropdownItem header style={{ color: "blue" }}>
                                Reccuring Charges
                              </DropdownItem>
                              {RecAccountNames?.map((item) => (
                                <DropdownItem
                                  key={item._id}
                                  onClick={() =>
                                    handleAccountSelection(item.account_name)
                                  }
                                >
                                  {item.account_name}
                                </DropdownItem>
                              ))}
                            </>
                          ) : (
                            <></>
                          )}
                          {oneTimeCharges ? (
                            <>
                              <DropdownItem header style={{ color: "blue" }}>
                                One Time Charges
                              </DropdownItem>
                              {oneTimeCharges?.map((item) => (
                                <DropdownItem
                                  key={item._id}
                                  onClick={() =>
                                    handleAccountSelection(item.account_name)
                                  }
                                >
                                  {item.account_name}
                                </DropdownItem>
                              ))}
                            </>
                          ) : (
                            <></>
                          )}
                        </DropdownMenu>
                        {financialFormik.touched.account &&
                        financialFormik.errors.account ? (
                          <div style={{ color: "red", marginBottom: "10px" }}>
                            {financialFormik.errors.account}
                          </div>
                        ) : null}
                      </Dropdown>
                    </FormGroup>
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-property"
                    >
                      First Name *
                    </label>
                    <Input
                      type="text"
                      id="first_name"
                      placeholder="First Name"
                      name="first_name"
                      onBlur={financialFormik.handleBlur}
                      onChange={financialFormik.handleChange}
                      value={financialFormik.values.first_name}
                      disabled={refund === true}
                    />
                    {financialFormik.touched.first_name &&
                    financialFormik.errors.first_name ? (
                      <div style={{ color: "red", marginBottom: "10px" }}>
                        {financialFormik.errors.first_name}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-property"
                    >
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      id="last_name"
                      placeholder="Enter last name"
                      name="last_name"
                      onBlur={financialFormik.handleBlur}
                      onChange={financialFormik.handleChange}
                      value={financialFormik.values.last_name}
                      disabled={refund === true}
                    />
                    {financialFormik.touched.last_name &&
                    financialFormik.errors.last_name ? (
                      <div style={{ color: "red", marginBottom: "10px" }}>
                        {financialFormik.errors.last_name}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <label className="form-control-label" htmlFor="input-property">
                  Email *
                </label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    id="email_name"
                    placeholder="Enter Email"
                    name="email_name"
                    value={financialFormik.values.email_name}
                    onBlur={financialFormik.handleBlur}
                    onChange={financialFormik.handleChange}
                    disabled={refund === true}
                  />
                  {financialFormik.touched.email_name &&
                  financialFormik.errors.email_name ? (
                    <div style={{ color: "red", marginBottom: "10px" }}>
                      {financialFormik.errors.email_name}
                    </div>
                  ) : null}
                </InputGroup>
              </FormGroup>

              <Row>
                <Col>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="date">
                      Date *
                    </label>
                    <Input
                      className="form-control-alternative"
                      id="input-unitadd1"
                      placeholder="3000"
                      type="date"
                      name="date"
                      value={financialFormik.values.date}
                      onBlur={financialFormik.handleBlur}
                      onChange={financialFormik.handleChange}
                    />
                    {financialFormik.touched.date &&
                    financialFormik.errors.date ? (
                      <div style={{ color: "red", marginBottom: "10px" }}>
                        {financialFormik.errors.date}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-unitadd"
                    >
                      Memo
                    </label>
                    <Input
                      className="form-control-alternative"
                      id="input-unitadd"
                      placeholder="Payment"
                      type="text"
                      name="memo"
                      onBlur={financialFormik.handleBlur}
                      onChange={financialFormik.handleChange}
                      value={financialFormik.values.memo}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <label className="form-control-label" htmlFor="paymentType">
                  Payment Method *
                </label>
                <FormGroup>
                  <Dropdown
                    isOpen={dropdownOpen2}
                    toggle={toggleDropdown2}
                    disabled={refund === true}
                  >
                    <DropdownToggle caret>
                      {selectedPaymentType ? selectedPaymentType : "Select"}
                    </DropdownToggle>
                    <DropdownMenu
                      style={{
                        zIndex: 999,
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      <DropdownItem
                        onClick={() => handlePaymentTypeChange("Cash")}
                      >
                        Cash
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handlePaymentTypeChange("Credit Card")}
                      >
                        Credit Card
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handlePaymentTypeChange("Check")}
                      >
                        Check
                      </DropdownItem>
                    </DropdownMenu>
                    {financialFormik.touched.paymentType &&
                    financialFormik.errors.paymentType ? (
                      <div style={{ color: "red", marginBottom: "10px" }}>
                        {financialFormik.errors.paymentType}
                      </div>
                    ) : null}
                  </Dropdown>
                </FormGroup>
              </FormGroup>

              {selectedPaymentType === "Credit Card" ? (
                <>
                  {refund === false ? (
                    <Card
                      className="w-100 mt-3"
                      style={{ background: "#F4F6FF" }}
                    >
                             <label className="form-control-label" htmlFor="input-property">
                   &nbsp; Credit card transactions will charge <strong style={{color:'blue'}}>{surchargePercentage}%</strong>
                  </label>
                      <CardContent>
                        {/* Card Details */}
                        {/* <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <Typography
                            sx={{
                              fontSize: 15,
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
                        </div> */}
                        {cardDetalis && cardDetalis.length > 0 && (
                          <Table responsive>
                            <tbody>
                              <tr>
                                <th>Select</th>
                                <th>Card Number</th>
                                <th>Card Type</th>
                              </tr>
                              {cardDetalis.map((item, index) => (
                                <tr
                                  key={index}
                                  style={{ marginBottom: "10px" }}
                                >
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedCreditCard == item.billing_id
                                      }
                                      onChange={() =>
                                        handleCreditCardSelection(item)
                                      }
                                    />
                                  </td>
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
                                            width: "20%",
                                            marginLeft: "10%",
                                          }}
                                        />
                                      )}
                                    </Typography>
                                  </td>

                                  {selectedCreditCard === item.billing_id && (
                                    <td>
                                      <Row>
                                        <FormGroup>
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-property"
                                          >
                                            CVV *
                                          </label>
                                          <Input
                                            type="number"
                                            id="cvv"
                                            placeholder="123"
                                            name="cvv"
                                            onBlur={financialFormik.handleBlur}
                                            onChange={(e) => {
                                              const inputValue = e.target.value;
                                              if (
                                                /^\d{0,3}$/.test(inputValue)
                                              ) {
                                                // Only allow up to 3 digits
                                                financialFormik.handleChange(e);
                                              }
                                            }}
                                            value={financialFormik.values.cvv}
                                            required
                                            disabled={refund === true}
                                          />
                                        </FormGroup>
                                      </Row>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}

                        {/* Add Credit Card Button */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: "10px",
                          }}
                        >
                          <Button
                            color="primary"
                            onClick={() => {
                              openCardForm();
                            }}
                            style={{
                              background: "white",
                              color: "blue",
                              marginRight: "10px",
                            }}
                          >
                            Add Credit Card
                          </Button>
                        </div>
                        <br />
                      </CardContent>

                      {/* <Col md="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Surcharge Percentage *
                          </label>
                          <Input
                            type="number"
                            id="surcharge_percent"
                            placeholder="Enter percentage"
                            name="surcharge_percent"
                            onBlur={financialFormik.handleBlur}
                            onChange={handleSurchargeChange}
                            value={financialFormik.values.surcharge_percent}
                          />
                          {financialFormik.touched.surcharge_percent &&
                          financialFormik.errors.surcharge_percent ? (
                            <div style={{ color: "red", marginBottom: "10px" }}>
                              {financialFormik.errors.surcharge_percent}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col> */}
                    </Card>
                  ) : (
                    ""
                  )}
                </>
              ) : selectedPaymentType === "Check" ? (
                <>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-property"
                    >
                      Check Number *
                    </label>
                    <Input
                      type="text"
                      id="check_number"
                      placeholder="Enter check number"
                      name="check_number"
                      onBlur={financialFormik.handleBlur}
                      onChange={financialFormik.handleChange}
                      value={financialFormik.values.check_number}
                      required
                      disabled={refund === true}
                    />
                  </FormGroup>
                </>
              ) : null}
            </div>
            {/* Display the total amount */}
            <div>
              Total Amount to be Paid:{" "}
              <strong style={{ color: "green" }}>
                $ {totalAmount1 || financialFormik.values.amount || 0}{" "}
              </strong>
            </div>
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
                // onClick={() => setRefund(false)}
              >
                {refund === true ? "Make Refund" : actionType || "Make Payment"}
              </Button>
            )}
            <Button onClick={closeModal}>Cancel</Button>
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

      <Modal isOpen={isOpen} toggle={closeSurchargeModel}>
        <ModalHeader
          toggle={closeSurchargeModel}
          className="bg-secondary text-white"
        >
          <strong style={{ fontSize: 18 }}>Add Surcharge</strong>
        </ModalHeader>
        <ModalBody>
          <SurchargeForm
            ///tenantId={tenantId}
            closeModal={closeSurchargeModel}
            //getCreditCard={getCreditCard}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default DemoPayment;
