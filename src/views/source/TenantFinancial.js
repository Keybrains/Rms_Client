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
  InputGroupText,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { CardContent, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TenantsHeader from "components/Headers/TenantsHeader";
import Cookies from "universal-cookie";
import { RotatingLines } from "react-loader-spinner";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import * as yup from "yup";
import swal from "sweetalert";
import Header from "components/Headers/Header";
import { useFormik } from "formik";
import Edit from "@mui/icons-material/Edit";
import moment from "moment";
import valid from "card-validator";
import CreditCardForm from "./CreditCardForm";

const TenantFinancial = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [rental_adress, setRentalAddress] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState(null);
  const [tenantDetails, setTenantDetails] = useState({});
  const { id } = useParams();
  const [GeneralLedgerData, setGeneralLedgerData] = useState([]);
  // console.log(id, tenantDetails);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalsOpen, setIsModalsOpen] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [userdropdownOpen, setuserDropdownOpen] = React.useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [searchQueryy, setSearchQueryy] = useState("");
  const [unit, setUnit] = useState("");
  const [propertyId, setPropertyId] = useState("");
  // const [cookie_id, setCookieId] = useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const [refund, setRefund] = useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  // const validateCardNumber = (cardNumber) => {
  //   const numberValidation = valid.number(cardNumber);
  //   return numberValidation.isPotentiallyValid && numberValidation.card;
  // };

  // const handleCorrect = async (values)=> {
  //   const isValidCard = validateCardNumber(financialFormik.values.card_number);

  //   const cardType = isValidCard.niceType;

  //   if (!isValidCard) {
  //     swal("Error", "Invalid credit card number", "error");
  //     return;
  //   }

  //   try {
  //     // Call the first API
  //     const customerVaultResponse = await axios.post(`${baseUrl}/nmipayment/create-customer-vault`, {
  //       first_name: "Manyaaaa",
  //       last_name: "Doe",
  //       ccnumber: financialFormik.values.card_number,
  //       ccexp: financialFormik.values.expiration_date,
  //     });

  //     if (customerVaultResponse.data && customerVaultResponse.data.data) {
  //       // Extract customer_vault_id from the first API response
  //       const customerVaultId = customerVaultResponse.data.data.customer_vault_id;
  //       const vaultResponse = customerVaultResponse.data.data.response_code;

  //       // Call the second API using the extracted customer_vault_id
  //       const creditCardResponse = await axios.post(`${baseUrl}/creditcard/addCreditCard`, {
  //         tenant_id: cookie_id,
  //         card_number: financialFormik.values.card_number,
  //         exp_date: financialFormik.values.expiration_date,
  //         card_type: cardType,
  //         customer_vault_id: customerVaultId,
  //         response_code: vaultResponse,
  //       });

  //       console.log("Credit Card Response:", creditCardResponse.data);
  //       console.log("Customer Vault Response:", customerVaultResponse.data);

  //       if (
  //         creditCardResponse.status === 200 &&
  //         customerVaultResponse.status === 200
  //       ) {
  //         swal("Success", "Card Added Successfully", "success");
  //         //closeModal();
  //         setAddCard(false);
  //         getCreditCard();
  //       } else {
  //         swal("Error", creditCardResponse.data.message, "error");
  //       }
  //     } else {
  //       // Handle the case where the response structure is not as expected
  //       swal("Error", "Unexpected response format from create-customer-vault API", "error");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     swal("Error", "Something went wrong!", "error");
  //   }
  // };

  // const handleIncorrect = () => {
  //   setAddCard(false);
  // };

  const openCardForm = () => {
    setIsModalsOpen(true);
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
  // Step 2: Event handler to open the modal
  const openModal = () => {
    financialFormik.setValues({
      account: "",
      amount: "",
      date: "",
      memo: "",
      unit: "",
      property: "",
      paymentType: "",
      card_number: "",
      expiration_date: "",
      check_number: "",
      customer_vault_id: "",
    });
    financialFormik.setFieldValue("tenantId", cookie_id);
    financialFormik.setFieldValue("first_name", tenantDetails.tenant_firstName);
    financialFormik.setFieldValue("last_name", tenantDetails.tenant_lastName);
    financialFormik.setFieldValue("email_name", tenantDetails.tenant_email);

    // Update other selected values
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

  // Event handler to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
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
      // Handle error (e.g., card type not found)
      console.error("Error fetching card logo:", error);
      setCardLogo(""); // Set to a default logo or leave it empty
    }
  };

  useEffect(() => {
    fetchCardLogo();
  }, []);

  const [customervault, setCustomervault] = useState([]);
  const [cardDetalis, setCardDetails] = useState([]);

  const getCreditCard = async () => {
    try {
      const response = await axios.get(`${baseUrl}/creditcard/getCreditCard/${cookie_id}`);
      setCustomervault(response.data);
    } catch (error) {
      console.error('Error fetching credit card details:', error);
    }
  };

  const getMultipleCustomerVault = async (customerVaultIds) => {
    try {
      const response = await axios.post(`${baseUrl}/nmipayment/get-multiple-customer-vault`, {
        customer_vault_id: customerVaultIds,
      });
     // Extract relevant information from the API response
     const extractedData = response.data.data.map((item) => ({
        cc_number: item.customer.cc_number,
        cc_exp: item.customer.cc_exp,
        cc_type: item.customer.cc_type,
        customer_vault_id: item.customer.customer_vault_id,
      }));

      // Update the cardDetails state
      setCardDetails(extractedData);
      console.log("object",response.data.data)
    } catch (error) {
      console.error('Error fetching multiple customer vault records:', error);
    }
  };

  useEffect(() => {
    getCreditCard();
  }, [cookie_id]);

  useEffect(() => {
    // Extract customer_vault_id values from cardDetails
    const customerVaultIds = customervault?.map((card) => card.customer_vault_id);

    if (customerVaultIds.length > 0) {
      // Call the API to get multiple customer vault records
      getMultipleCustomerVault(customerVaultIds);
    }
  }, [customervault]);

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }

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

  const financialFormik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      check_number: "",
      email_name: "",
      card_number: "",
      amount: "",
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
    },
    validationSchema: yup.object({
      first_name: yup.string().required("First name is required"),
      last_name: yup.string().required("Last name is required"),
      email_name: yup.string().required("Email is required"),
      amount: yup.number().required("Amount is required"),
      date: yup.date().required("Date is required"),
      account: yup.string().required("Amount is required"),
      paymentType: yup.string().required("Payment type is required"),
    }),
    onSubmit: (values, action) => {
      if (isEditable === true && paymentId) {
        editpayment(paymentId);
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
      ); // Set the received units in the unitData state
    } catch (error) {
      console.error("Error handling selected property:", error);
    }
  };

  const handleUnitSelect = (property) => {
    setSelectedUnit(property.rental_units);
    financialFormik.setFieldValue("unit", selectedUnit || "");
    financialFormik.setFieldValue("unit", property.rental_units || "");
  };

  // const getGeneralLedgerData = async () => {
  //   const apiUrl = `${baseUrl}/payment/merge_payment_charge/${cookie_id}`;

  //   try {
  //     const response = await axios.get(apiUrl);
  //     setLoader(false);

  //     if (response.data && response.data.data) {
  //       const mergedData = response.data.data;
  //       mergedData.sort((a, b) => new Date(b.date) - new Date(a.date));
  //       const dataWithBalance = calculateBalance(mergedData);
  //       console.log('first', response.data.data)
  //       setGeneralLedgerData(dataWithBalance);
  //     } else {
  //       console.error("Unexpected response format:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   getGeneralLedgerData();
  // }, [cookie_id]);

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);
  let cookie_id = localStorage.getItem("Tenant ID");

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getTenantData = async () => {
    try {
      console.log(cookie_id, "cookie_id");
      const response = await axios.get(
        `${baseUrl}/tenant/tenant_summary/${cookie_id}`
      );

      if (response.data) {
        setTenantDetails(response.data.data);
        setRentalAddress(response.data.rental_adress);

        const allTenants = await axios.get(
          `${baseUrl}/tenant/tenant_summary/${cookie_id}`
        );
        setPropertyDetails(allTenants.data.data.entries);
        setTenantDetails(allTenants.data.data);
        // console.log(allTenants.data.data, "allTenants");
      } else {
        console.error("Data structure is not as expected:", response.data);
        setRentalAddress([]); // Set rental_adress to an empty array
      }
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setRentalAddress([]); // Set rental_adress to an empty array
      setPropertyError(error);
    } finally {
      setPropertyLoading(false);
    }
  };

  React.useEffect(() => {
    getTenantData();
  }, [cookie_id]);

  // const getGeneralLedgerData = async () => {
  //   if (tenantDetails) {
  //     try {
  //       const promises = tenantDetails?.entries?.map(async (data, index) => {
  //         const rental = data?.rental_adress;
  //         const property_id = data?.property_id;
  //         const unit = data?.rental_units;
  //         if (rental && property_id && unit) {
  //           const url = `${baseUrl}/payment_charge/financial_unit?rental_adress=${rental}&property_id=${property_id}&unit=${unit}&tenant_id=${cookie_id}`;

  //           try {
  //             const response = await axios.get(url);
  //             if (response.data && response.data.data) {
  //               const mergedData = response.data.data;
  //               return mergedData[0]?.unit[0];
  //             } else {
  //               console.error("Unexpected response format:", response.data);
  //             }
  //           } catch (error) {
  //             console.error("Error fetching data:", error);
  //           }
  //         }
  //         if (rental && property_id) {
  //           const url = `${baseUrl}/payment_charge/financial?rental_adress=${rental}&property_id=${property_id}&tenant_id=${cookie_id}`;

  //           try {
  //             const response = await axios.get(url);
  //             if (response.data && response.data.data) {
  //               const mergedData = response.data.data;
  //               return mergedData[0]?.unit[0];
  //             } else {
  //               console.error("Unexpected response format:", response.data);
  //             }
  //           } catch (error) {
  //             console.error("Error fetching data:", error);
  //           }
  //         }
  //         return null;
  //       });

  //       const results = await Promise.all(promises);
  //       const validResults = results.filter((result) => result !== null);
  //       setLoader(false);
  //       setGeneralLedgerData((prevData) => [...validResults]);
  //       const data = [...validResults];
  //       const allPaymentAndCharges = data.flatMap((item) => {
  //         if (item !== undefined) {
  //           return item?.paymentAndCharges?.map((payment) => ({
  //             paymentAndCharges: payment,
  //             unit: item.unit,
  //             unit_id: item.unit_id,
  //             _id: item._id,
  //           }));
  //         }
  //       });
  //       setTotalPages(Math.ceil(allPaymentAndCharges.length / pageItem));
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   getGeneralLedgerData();
  // }, [tenantDetails, pageItem]);

  const navigate = useNavigate();
  useEffect(() => {
    getTenantData();
  }, []);

  const getGeneralLedgerData = async () => {
    try {
      const url = `${baseUrl}/nmipayment/nmipayments/tenant/${cookie_id}`;
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

  const [paymentLoader, setPaymentLoader] = useState(false);
  const [selectedCreditCard, setSelectedCreditCard] = useState(null);

  const handleCreditCardSelection = (selectedCard) => {
    if (selectedCreditCard === selectedCard.customer_vault_id) {
      setSelectedCreditCard(null); // Unselect if already selected
    } else {
      setSelectedCreditCard(selectedCard.customer_vault_id); // Select the clicked card
    }
  };

  // const getRentalData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${baseUrl}/rentals/rentals_property/${rental_adress}`
  //     );
  //     setpropertyDetails(response.data.data);
  //     setpropertyLoading(false);
  //   } catch (error) {
  //     setpropertyError(error);
  //     setpropertyLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   if (rental_adress) {
  //       console.log(`${baseUrl}/rentals/rentals_property/${rental_adress}`)
  //       getRentalData();
  //   }
  //   //console.log(rental_adress)
  // }, [rental_adress]);

  // function navigateToTenantsDetails(rental_adress) {
  //   navigate(`/tenant/tenantpropertydetail/${rental_adress}`);
  //   // const tenantsDetailsURL = `/tenant/tenantpropertydetail/${rental_adress}`;
  //   // window.location.href = tenantsDetailsURL;
  //   // console.log("Rental Address", rental_adress);
  // }
  // const formatCardNumber = (inputValue) => {
  //   if (typeof inputValue !== "string") {
  //     return ""; // Return an empty string if inputValue is not a string
  //   }

  //   const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
  //   const formattedValue = numericValue
  //     .replace(/(\d{4})/g, "$1 ") // Add a space after every four digits
  //     .trim(); // Remove any trailing space

  //   return formattedValue;
  // };

  // console.log(financialFormik.values,'financialFormik.values')

  const handleFinancialSubmit = async (values, action) => {
    let url = `${baseUrl}/nmipayment/postnmipayments`;

    // if (selectedPaymentType === "Credit Card" && values.expiration_date) {
    //   const dateParts = values.expiration_date.split("/");
    //   if (dateParts.length !== 2) {
    //     alert("Invalid date format");
    //     return;
    //   }
    //   const month = dateParts[0].padStart(2, "0");
    //   const year = dateParts[1].slice(-2);
    //   values.expiration_date = `${month}${year}`;
    //   // url = `${baseUrl}/nmipayment/sale`;
    // }
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
      } else if (selectedPaymentType === "Credit Card") {
        url = `${baseUrl}/nmipayment/sale`;
        values.status = "Success";
        values.type2 = "Payment";
      } else {
        url = `${baseUrl}/nmipayment/postnmipayments`;
        values.status = "Success";
        values.type2 = "Payment";
      }

      const creditCardDetails = cardDetalis.find(
        (card) => card.customer_vault_id === selectedCreditCard,
        console.log("miu", selectedCreditCard)
      );

      if (creditCardDetails) {
        // const [expMonth, expYear] = creditCardDetails.exp_date.split("/");
        // const formattedExpirationDate = `${expMonth}/${expYear.slice(-2)}`;

        // values.expiration_date = formattedExpirationDate;
        // values.card_number = Number(selectedCreditCard.card_number);
        values.customer_vault_id = selectedCreditCard;
      } else {
        console.error(
          "Credit card details not found for selected card:",
          selectedCreditCard
        );
      }

      console.log("values", values);
      const response = await axios.post(url, {
        paymentDetails: values,
      });

      // const response = await axios.post(url, {
      //   paymentDetails: values,
      // });

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

  // const postCharge = async (unit_id) => {
  //   const chargeObject = {
  //     properties: {
  //       rental_adress: selectedPropertyType,
  //       property_id: financialFormik.values.propertyId,
  //     },
  //     unit: [
  //       {
  //         unit: selectedUnit,
  //         unit_id: unit_id,
  //         paymentAndCharges: [
  //           {
  //             type: "Payment",
  //             charge_type: "",
  //             account: selectedAccount,
  //             amount: financialFormik.values.amount,
  //             rental_adress: selectedPropertyType,
  //             rent_cycle: "",
  //             month_year: moment().format("MM-YYYY"),
  //             date: moment().format("YYYY-MM-DD"),
  //             memo: "",
  //             tenant_id: cookie_id,
  //             tenant_firstName:
  //               tenantDetails.tenant_firstName +
  //               " " +
  //               tenantDetails.tenant_lastName,
  //           },
  //         ],
  //       },
  //     ],
  //   };

  //   const url = `${baseUrl}/payment_charge/payment_charge`;
  //   await axios
  //     .post(url, chargeObject)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

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
          rental.amount.toString().includes(searchQuery.toLowerCase()))||
          (rental.transactionid &&
              rental.transactionid.toString().includes(searchQuery.toLowerCase()))||
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
  const [isEditable, setIsEditable] = useState(false);
  const [paymentId, setPaymentId] = useState("");

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
          first_name: responseData.first_name || "",
          last_name: responseData.last_name || "",
          email_name: responseData.email_name || "",
          date: responseData.date || "",
          memo: responseData.memo || "",
          unit: responseData.unit || "",
          property: responseData.property || "",
          paymentType: responseData.paymentType || "",
          card_number: responseData.cc_number || "",
          expiration_date: responseData.expiration_date
            ? formatDate(responseData.expiration_date.toString())
            : "",
          cvv: responseData.cvv || "",
          check_number: responseData.check_number || "",
        });
        console.log(financialFormik, "ccnum");
        // Update other selected values
        setSelectedPaymentType(responseData.paymentType);
        setSelectedPropertyType(responseData.property);
        setSelectedUnit(responseData.unit);
        setSelectedAccount(responseData.account);
        setResponseData(responseData);

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
          account: financialFormik.values.account,
          first_name: financialFormik.values.first_name,
          last_name: financialFormik.values.last_name,
          property: financialFormik.values.property,
          unit: financialFormik.values.unit,
          memo: financialFormik.values.memo,
          email_name: financialFormik.values.email_name,
          date: financialFormik.values.date,
          check_number: financialFormik.values.check_number,
          paymentType: financialFormik.values.paymentType,
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

  console.log(paymentId ? paymentId : "");
  return (
    <>
      <TenantsHeader />
      {/* Page content */}
      <Container className="mt--8 ml--10" fluid>
        <Row>
          <Col xs="12" sm="9">
            <FormGroup className="">
              <h1 style={{ color: "white", marginLeft: "20px" }}>Ledger</h1>
            </FormGroup>
          </Col>

          <Col xs="1.5" sm="1.5">
            <Button
              color="primary"
              onClick={() => {
                openCardForm();
              }}
              size="sm"
              style={{
                background: "white",
                color: "#3B2F2F",
                marginRight: "20px",
                marginLeft: "10px",
              }}
            >
              Add Cards
            </Button>
          </Col>

          <Col xs="1.5" sm="1.8">
            <Button
              color="primary"
              onClick={() => {
                openModal();
                setIsEditable(false);
              }}
              size="sm"
              style={{ background: "white", color: "#3B2F2F" }}
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
                                    <td>{item?.type2 || "Payment"}</td>
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
                                        ? item?.amount
                                        : "0"}
                                    </td>
                                    <td>
                                      ${" "}
                                      {item?.type2 !== "Refund"
                                        ? item?.amount
                                        : "0"}
                                    </td>
                                    <td>
                                      {item?.type2 === "Payment" && item?.status === "Pending" ? (
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
                                                {/* {item?.paymentType ===
                                                  "Credit Card" &&
                                                  item?.status ===
                                                    "Success" && (
                                                    <DropdownItem
                                                      // style={{color:'black'}}
                                                      onClick={() => {
                                                        getEditData(item?._id);
                                                        setRefund(true);
                                                      }}
                                                    >
                                                      Refund
                                                    </DropdownItem>
                                                  )} */}
                                                {(item?.status === "Pending" ||
                                                  item?.type2 !==
                                                    "Credit Card") && (
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
                        {tenantDetails?.entries?.map((property, index) => (
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
                      required
                    />
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
                      required
                      disabled
                    />
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
                      required
                      disabled
                    />
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
                    required
                    disabled
                  />
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
                      disabled={refund === true}
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
                  </Dropdown>
                </FormGroup>
              </FormGroup>

              {selectedPaymentType === "Credit Card" ? (
                // <>
                //   {isEditable === false ? (
                //     <FormGroup>
                //       <label
                //         className="form-control-label"
                //         htmlFor="input-property"
                //       >
                //         Card Number *
                //       </label>
                //       <InputGroup>
                //         <Input
                //           type="string"
                //           id="card_number"
                //           placeholder="0000 0000 0000 0000"
                //           name="card_number"
                //           value={financialFormik.values.card_number}
                //           onBlur={financialFormik.handleBlur}
                //           onChange={(e) => {
                //             // const inputValue = e.target.value;
                //             // const numericValue = inputValue.replace(/\D/g, ''); // Remove non-numeric characters
                //             // const limitedValue = numericValue.slice(0, 12); // Limit to 12 digits
                //             // // const formattedValue = formatCardNumber(limitedValue);
                //             // e.target.value = limitedValue;
                //             financialFormik.handleChange(e);
                //           }}
                //           required
                //           disabled={refund === true}
                //         />
                //       </InputGroup>
                //     </FormGroup>
                //   ) : (
                //     ""
                //   )}
                //   {isEditable === false ? (
                // <Row>
                //   <Col>
                //     <FormGroup>
                //       <label
                //         className="form-control-label"
                //         htmlFor="input-property"
                //       >
                //         Expiration Date *
                //       </label>
                //       <Input
                //         type="text"
                //         id="expiration_date"
                //         name="expiration_date"
                //         onBlur={financialFormik.handleBlur}
                //         onChange={financialFormik.handleChange}
                //         value={financialFormik.values.expiration_date}
                //         placeholder="MM/YY"
                //         required
                //         disabled={refund === true}
                //         onInput={(e) => {
                //           let inputValue = e.target.value;
                //           const numericValue = inputValue.replace(
                //             /\D/g,
                //             ""
                //           );

                //           if (numericValue.length > 2) {
                //             const month = numericValue.substring(0, 2);
                //             const year = numericValue.substring(2, 6);
                //             e.target.value = `${month}/${year}`;
                //           } else {
                //             e.target.value = numericValue;
                //           }

                //           // Format the year to have a 4-digit length if more than 2 digits are entered
                //           if (numericValue.length >= 3) {
                //             const enteredYear = numericValue.substring(
                //               2,
                //               6
                //             );
                //             e.target.value = `${numericValue.substring(
                //               0,
                //               2
                //             )}/${enteredYear}`;
                //           }
                //         }}
                //       />
                //     </FormGroup>
                //   </Col>
                // <Col>
                //   <FormGroup>
                //     <label
                //       className="form-control-label"
                //       htmlFor="input-property"
                //     >
                //       CVV *
                //     </label>
                //     <Input
                //       type="number"
                //       id="cvv"
                //       placeholder="123"
                //       name="cvv"
                //       onBlur={financialFormik.handleBlur}
                //       onChange={(e) => {
                //         const inputValue = e.target.value;
                //         if (/^\d{0,3}$/.test(inputValue)) {
                //           // Only allow up to 3 digits
                //           financialFormik.handleChange(e);
                //         }
                //       }}
                //       value={financialFormik.values.cvv}
                //       maxLength={3}
                //       required
                //       disabled={refund === true}
                //     />
                //   </FormGroup>
                // </Col>
                //     </Row>
                //   ) : (
                //     ""
                //   )}
                // </>
                <>
                  {isEditable === false && refund === false ? (
                    <Card
                      className="w-100 mt-3"
                      style={{ background: "#F4F6FF" }}
                    >
                      <CardContent>
                        {/* Card Details */}
                        <div
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
                        </div>
                        {cardDetalis && cardDetalis.length > 0 && (
                          <Table responsive>
                            <tbody>
                              <tr>
                                <th>Select</th>
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
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedCreditCard ===
                                        item.customer_vault_id
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

                                  {selectedCreditCard ===
                                    item.customer_vault_id && (
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
                              color: "#3B2F2F",
                              marginRight: "10px",
                            }}
                          >
                            Add Credit Card
                          </Button>
                        </div>
                        <br />

                        {/* {addCard &&  (
                            <Row>
                            <Col sm='5'>
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Card Number *
                                </label>
                                <InputGroup>
                                  <Input
                                    type="string"
                                    id="card_number"
                                    placeholder="0000 0000 0000 0000"
                                    name="card_number"
                                    value={financialFormik.values.card_number}
                                    onBlur={financialFormik.handleBlur}
                                    onChange={(e) => {
                                      // const inputValue = e.target.value;
                                      // const numericValue = inputValue.replace(/\D/g, ''); // Remove non-numeric characters
                                      // const limitedValue = numericValue.slice(0, 12); // Limit to 12 digits
                                      // // const formattedValue = formatCardNumber(limitedValue);
                                      // e.target.value = limitedValue;
                                      financialFormik.handleChange(e);
                                    }}
                                    required
                                    disabled={refund === true}
                                  />
                                </InputGroup>
                              </FormGroup>
                            </Col>
  
                            <Col sm='4'>
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Expiration Date *
                                </label>
                                <Input
                                  type="text"
                                  id="expiration_date"
                                  name="expiration_date"
                                  onBlur={financialFormik.handleBlur}
                                  onChange={financialFormik.handleChange}
                                  value={financialFormik.values.expiration_date}
                                  placeholder="MM/YYYY"
                                  required
                                  disabled={refund === true}
                                  
                                />
                             
                              </FormGroup>
                            </Col>

                            <Col sm='3'>
                                <div style={{marginTop:'30px'}}>
                                  <span
                                    style={{ cursor: 'pointer', marginRight: '10px',fontSize:'20px',color:'green'}}
                                    onClick={handleCorrect}
                                  >
                                    ✔️
                                  </span>
                                  <span
                                    style={{ cursor: 'pointer',fontSize:'20px' }}
                                    onClick={handleIncorrect}
                                  >
                                    ❌
                                  </span>
                                </div>
                              </Col>
                          </Row>
                        )  
                        } */}
                      </CardContent>
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
                    />
                  </FormGroup>
                </>
              ) : null}
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
            tenantId={cookie_id}
            closeModal={closeModals}
            //getCreditCard={getCreditCard}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default TenantFinancial;
