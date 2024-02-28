import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CardContent, Typography } from "@mui/material";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  Container,
  Table,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ModalHeader,
  ModalBody,
  Modal,
} from "reactstrap";
import PaymentHeader from "components/Headers/PaymentHeader";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import "jspdf-autotable";
import "jspdf-autotable";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import CreditCardForm from "./CreditCardForm";
import TenantPropertyDetail from "./TenantPropertyDetail";

function AddPayment() {
  const [accessType, setAccessType] = useState(null);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_URL;
  const navigate = useNavigate();
  const { lease_id, admin, payment_id } = useParams();
  const [tenantId, setTenantId] = useState("");
  const [tenantData, setTenantData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [recdropdownOpen, setrecDropdownOpen] = useState(false);
  const toggle2 = () => setrecDropdownOpen((prevState) => !prevState);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
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
      setCardLogo("");
    }
  };

  useEffect(() => {
    fetchCardLogo();
  }, []);

  //NMI Payment Section
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customervault, setCustomervault] = useState([]);
  const [cardDetalis, setCardDetails] = useState([]);
  const [isBilling, setIsBilling] = useState(false);
  const [vaultId, setVaultId] = useState(false);
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [selectedCreditCard, setSelectedCreditCard] = useState(null);
  const [totalAmount1, setTotalAmount1] = useState();
  const [surchargePercentage, setSurchargePercentage] = useState();
  // Fetch surcharge from the API
  const fetchData = async () => {
    // try {
    // const response = await fetch(
    //   `${baseUrl}/surcharge/surcharge/get/1708427568557`
    // );
    let adminid = accessType?.admin_id;
    const url = `${baseUrl}/surcharge/surcharge/getadmin/${adminid}`;
    axios
      .get(url)
      .then((response) => {
        const Data = response.data.data[0];
        console.log("manu", Data);
        setSurchargePercentage(response.data.data[0].surcharge_percent);
      })
      .catch((error) => {
        console.error("Error fetching property type data:", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, [accessType?.admin_id]);

  // Calculate total amount after surcharge
  const calculateTotalAmount = () => {
    const amount = parseFloat(generalledgerFormik.values.total_amount) || 0;
    let totalAmount = amount;

    if (selectedPaymentMethod === "Credit Card") {
      const surchargeAmount = (amount * surchargePercentage) / 100;
      generalledgerFormik.setFieldValue("surcharge", surchargeAmount);
      totalAmount += surchargeAmount;
    }
    return totalAmount;
  };

  useEffect(() => {
    const totalAmount = calculateTotalAmount();
    setTotalAmount1(totalAmount);
  }, [surchargePercentage, selectedPaymentMethod]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openCardForm = () => {
    setIsModalOpen(true);
  };

  const handleCreditCardSelection = (selectedCard) => {
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      //customer_vault_id: selectedCard.customer_vault_id,
      billing_id: selectedCard.billing_id,
    });
    setSelectedCreditCard(selectedCard.billing_id);
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

  const generalledgerFormik = useFormik({
    initialValues: {
      payment_id: "",
      date: "",
      total_amount: "",
      payments_memo: "",
      customer_vault_id: "",
      billing_id: "",
      transaction_id: "",
      surcharge: "",
      payments: [
        {
          entry_id: "",
          account: "",
          amount: "",
          balance: "",
          charge_type: "",
        },
      ],
      payments_attachment: [],
    },
    validationSchema: yup.object({
      date: yup.string().required("Required"),
      total_amount: yup.string().required("Required"),
      payments: yup.array().of(
        yup.object().shape({
          account: yup.string().required("Required"),
          amount: yup
            .number()
            .required("Required")
            .min(1, "Amount must be greater than zero.")
            .test(
              "is-less-than-balance",
              "Amount must be less than or equal to balance",
              function (value) {
                if (value && this.parent.balance) {
                  const balance = this.parent.balance;
                  return value <= balance;
                }
              }
            ),
        })
      ),
    }),
    onSubmit: (values) => {
      if (Number(generalledgerFormik.values.total_amount) === Number(total)) {
        handleSubmit(values);
      }
    },
  });

  const editPayment = async (values) => {
    setLoader(true);

    if (file) {
      try {
        const uploadPromises = file?.map(async (fileItem, i) => {
          if (fileItem.upload_file instanceof File) {
            try {
              const form = new FormData();
              form.append("files", fileItem.upload_file);

              const res = await axios.post(`${baseUrl}/images/upload`, form);
              if (
                res &&
                res.data &&
                res.data.files &&
                res.data.files.length > 0
              ) {
                fileItem.upload_file = res.data.files[0].filename;
              } else {
                console.error("Unexpected response format:", res);
              }
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Error processing file uploads:", error);
      }
    }

    const object = {
      payment_id: payment_id,
      admin_id: accessType.admin_id,
      tenant_id: tenantData?.tenant_id,
      lease_id: lease_id,

      entry: values.charges?.map((item) => {
        const data = {
          entry_id: item.entry_id,
          account: item.account,
          amount: Number(item.amount),
          memo: values.payments_memo || "payment",
          date: values.date,
          charge_type: item.charge_type,
        };
        return data;
      }),

      total_amount: total,
      uploaded_file: file,
    };

    try {
      const res = await axios.put(
        `${baseUrl}/payment/payment/${payment_id}`,
        object
      );
      if (res.data.statusCode === 200) {
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 1000,
        });
        navigate(`/${admin}/rentrolldetail/${lease_id}`);
      } else {
        toast.warning(res.data.message, {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error: ", error.message);
      toast.error(error.message, {
        position: "top-center",
        autoClose: 1000,
      });
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoader(true);
    if (file) {
      try {
        const uploadPromises = file?.map(async (fileItem, i) => {
          if (fileItem.upload_file instanceof File) {
            try {
              const form = new FormData();
              form.append("files", fileItem.upload_file);

              const res = await axios.post(`${baseUrl}/images/upload`, form);
              if (
                res &&
                res.data &&
                res.data.files &&
                res.data.files.length > 0
              ) {
                fileItem.upload_file = res.data.files[0].filename;
              } else {
                console.error("Unexpected response format:", res);
              }
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Error processing file uploads:", error);
      }
    }
    let nmiResponse;
    const financialDate = new Date(values.date);
    const currentDate = new Date();

    // Extract year, month, and day components separately
    const financialYear = financialDate.getFullYear();
    const financialMonth = financialDate.getMonth() + 1; // Months are zero-based, so add 1
    const financialDay = financialDate.getDate();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const currentDay = currentDate.getDate();

    // Combine year, month, and day components into a string representation of the date
    const financialDateString =
      financialYear + "-" + financialMonth + "-" + financialDay;
    const currentDateString =
      currentYear + "-" + currentMonth + "-" + currentDay;

    try {
      if (selectedPaymentMethod === "Credit Card") {
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
        if (financialDateString <= currentDateString) {
          // First, make the call to baseUrl/nmipayment/sale
          const url = `${baseUrl}/nmipayment/sale`;
          const postObject = {
            first_name: tenantData.tenant_firstName,
            last_name: tenantData.tenant_lastName,
            email_name: tenantData.tenant_email,
            customer_vault_id: values.customer_vault_id,
            billing_id: values.billing_id,
            surcharge: values.surcharge,
            amount: values.total_amount,
            tenantId: tenantData.tenant_id,
            date: values.date,
            address1: "",
          };

          const response = await axios.post(url, {
            paymentDetails: postObject,
          });

          // Check response status and handle accordingly
          if (response.data && response.data.statusCode === 100) {
            nmiResponse = response.data.data;
          } else {
            console.error("Unexpected response format:", response.data.data);
            // swal("", response.data.message, "error");
            return; // Exit function early if there's an error
          }
        } else {
          const paymentObject = {
            admin_id: accessType.admin_id,
            tenant_id: tenantData?.tenant_id,
            lease_id: lease_id,
            payment_type: selectedPaymentMethod,
            customer_vault_id: values.customer_vault_id,
            billing_id: values.billing_id,
            response: "PENDING",
            entry: values.payments?.map((item) => ({
              entry_id: item?.entry_id,
              account: item.account,
              balance: item.balance,
              amount: Number(item.amount),
              memo: values.payments_memo || "payment",
              date: values.date,
              charge_type: item.charge_type,
            })),
            total_amount: total,
            is_leaseAdded: false,
            uploaded_file: file,
          };
          const paymentResponse = await axios.post(
            `${baseUrl}/payment/payment`,
            paymentObject
          );

          if (paymentResponse.data.statusCode === 200) {
            toast.success("Future Payment Scheduled", {
              position: "top-center",
              autoClose: 1000,
            });
            navigate(`/${admin}/rentrolldetail/${lease_id}`);
          } else {
            toast.warning(paymentResponse.data.message, {
              position: "top-center",
              autoClose: 1000,
            });
          }
        }
      } else if (
        selectedPaymentMethod === "Check" ||
        selectedPaymentMethod === "Cash"
      ) {
        const paymentObject = {
          admin_id: accessType.admin_id,
          tenant_id: tenantData?.tenant_id,
          lease_id: lease_id,
          payment_type: selectedPaymentMethod,
          entry: values.payments?.map((item) => ({
            entry_id: item?.entry_id,
            account: item.account,
            balance: item.balance,
            amount: Number(item.amount),
            memo: values.payments_memo || "payment",
            date: values.date,
            charge_type: item.charge_type,
          })),
          total_amount: total,
          is_leaseAdded: false,
          uploaded_file: file,
          response: "SUCCESS",
        };
        const paymentResponse = await axios.post(
          `${baseUrl}/payment/payment`,
          paymentObject
        );

        if (paymentResponse.data.statusCode === 200) {
          toast.success("Payment Done Successfully", {
            position: "top-center",
            autoClose: 1000,
          });
          navigate(`/${admin}/rentrolldetail/${lease_id}`);
        } else {
          toast.warning(paymentResponse.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      }

      if (nmiResponse) {
        const paymentObject = {
          admin_id: accessType.admin_id,
          tenant_id: tenantData?.tenant_id,
          lease_id: lease_id,
          payment_type: selectedPaymentMethod,
          entry: values.payments?.map((item) => ({
            entry_id: item?.entry_id,
            account: item.account,
            balance: item.balance,
            amount: Number(item.amount),
            memo: values.payments_memo || "payment",
            date: values.date,
            charge_type: item.charge_type,
          })),
          total_amount: total,
          is_leaseAdded: false,
          uploaded_file: file,
          // Include relevant transaction details from the first API call
          transaction_id: nmiResponse.transactionid,
          response: nmiResponse.responsetext,
        };

        // Make the second API call to baseUrl/payment/payment
        const paymentResponse = await axios.post(
          `${baseUrl}/payment/payment`,
          paymentObject
        );

        // Handle response from the second API call
        if (paymentResponse.data.statusCode === 200) {
          toast.success("Payment Done Successfully", {
            position: "top-center",
            autoClose: 1000,
          });
          navigate(`/${admin}/rentrolldetail/${lease_id}`);
        } else {
          toast.warning(paymentResponse.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      console.error("Error: ", error.message);
    } finally {
      setLoader(false);
    }
  };

  const fetchchargeData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/charge/charges/${lease_id}`);
      const data = response.data.totalCharges
        .map((item) => {
          const myData = item.entry
            .filter((element) => element.charge_amount > 0)
            .map((element) => {
              const items = {
                entry_id: element.entry_id,
                account: element.account,
                balance: element.charge_amount,
                amount: 0,
                charge_type: element.charge_type,
                dropdownOpen: false,
              };
              return items;
            });
          return myData;
        })
        .flat();

      generalledgerFormik.setValues({
        payments: data,
        payment_id: "",
        date: "",
        total_amount: 0,
        payments_memo: "",
        payments_attachment: [],
      });
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
  };

  const [recAccounts, setRecAccounts] = useState([]);
  const [oneTimeAccounts, setoneTimeAccounts] = useState([]);
  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/accounts/accounts/${accessType?.admin_id}`
      );
      if (res.data.statusCode === 200) {
        const filteredData1 = res.data.data.filter(
          (item) => item.charge_type === "Recurring Charge"
        );
        const filteredData2 = res.data.data.filter(
          (item) => item.charge_type === "One Time Charge"
        );
        setRecAccounts(filteredData1);
        setoneTimeAccounts(filteredData2);
      } else if (res.data.statusCode === 201) {
        setRecAccounts();
        setoneTimeAccounts();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchTenant = async () => {
    try {
      const res = await axios.get(`${baseUrl}/leases/lease_tenant/${lease_id}`);
      if (res.data.statusCode === 200) {
        setTenantData(res.data.data);
        setTenantId(res.data.data.tenant_id);
      }
    } catch (error) {
      console.error("Error: ", error.message);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [accessType?.admin_id]);

  useEffect(() => {
    fetchchargeData();
    fetchTenant();
  }, [lease_id]);

  const [total, setTotal] = useState(0);
  const handleTotal = () => {
    let sum = 0;
    generalledgerFormik.values.payments?.forEach((element) => {
      sum += parseInt(Number(element.amount));
    });
    setTotal(sum);
  };

  useEffect(() => {
    handleTotal();
  }, [generalledgerFormik.values.payments]);

  const toggleDropdown = (index) => {
    const updatedCharges = [...generalledgerFormik.values.payments];
    updatedCharges[index].dropdownOpen = !updatedCharges[index].dropdownOpen;
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      payments: updatedCharges,
    });
  };

  const handleAccountSelection = (value, index, chargeType) => {
    const updatedCharges = [...generalledgerFormik.values.payments];

    if (updatedCharges[index]) {
      updatedCharges[index].account = value;
      updatedCharges[index].charge_type = chargeType;
      generalledgerFormik.setValues({
        ...generalledgerFormik.values,
        payments: updatedCharges,
      });
    }
  };

  const handleAddRow = () => {
    const newCharges = {
      account: "",
      amount: "",
    };
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      payments: [...generalledgerFormik.values.payments, newCharges],
    });
  };

  const handleRemoveRow = (index) => {
    const updatedCharges = [...generalledgerFormik.values.payments];
    updatedCharges.splice(index, 1);
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      payments: updatedCharges,
    });
  };

  const [file, setFile] = useState([]);
  const fileData = (files) => {
    const filesArray = [...files];
    if (filesArray.length <= 10 && file.length === 0) {
      const finalArray = [];
      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: accessType?.first_name + " " + accessType?.last_name,
          file_name: filesArray[i].name,
        };
        finalArray.push(object);
      }
      setFile([...finalArray]);
    } else if (
      file.length >= 0 &&
      file.length <= 10 &&
      filesArray.length + file.length > 10
    ) {
      setFile([...file]);
    } else {
      const finalArray = [];

      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: accessType?.first_name + " " + accessType?.last_name,
          file_name: filesArray[i].name,
        };
        finalArray.push(object);
      }
      setFile([...file, ...finalArray]);
    }
  };

  const deleteFile = (index) => {
    const newFile = [...file];
    newFile.splice(index, 1);
    setFile(newFile);
    generalledgerFormik.setFieldValue("charges_attachment", newFile);
  };

  const handleOpenFile = (item) => {
    if (typeof item !== "string") {
      const url = URL.createObjectURL(item);
      window.open(url, "_blank");
    } else {
      window.open(
        `http://192.168.1.10:4000/api/images/get-file/${item}`,
        "_blank"
      );
    }
  };

  const handleCloseButtonClick = () => {
    navigate(`/${admin}/rentrolldetail/${lease_id}`);
  };

  return (
    <>
      <PaymentHeader />
      <style>
        {`
            .custom-date-picker {
            background-color: white;
            }
        `}
      </style>
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {" "}
                      Payment for{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {tenantData.tenant_firstName}{" "}
                        {tenantData.tenant_lastName}
                      </span>
                    </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
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
                          Amount *
                        </label>
                        <Input
                          type="number"
                          id="amount"
                          placeholder="Enter amount"
                          name="total_amount"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.total_amount}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Payment Method
                        </label>
                        <br />
                        <Dropdown
                          isOpen={recdropdownOpen}
                          toggle={toggle2}
                          disabled={payment_id}
                        >
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedPaymentMethod
                              ? selectedPaymentMethod
                              : "Selcet Method"}
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                              width: "100%",
                              maxHeight: "200px",
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            <DropdownItem
                              onClick={() =>
                                setSelectedPaymentMethod("Credit Card")
                              }
                            >
                              Credit Card
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => setSelectedPaymentMethod("Check")}
                            >
                              Check
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => setSelectedPaymentMethod("Cash")}
                            >
                              Cash
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                    <Col sm="12">
                      <Row>
                        {selectedPaymentMethod === "Credit Card" ? (
                          <>
                            {/* {refund === false ? ( */}

                            <Card
                              className="w-100 mt-3"
                              style={{ background: "#F4F6FF" }}
                            >
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                              >
                                Credit card transactions will charge{" "}
                                <strong style={{ color: "blue" }}>
                                  {surchargePercentage}%
                                </strong>
                              </label>
                              <CardContent>
                                {/* Card Details */}
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
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
                                                selectedCreditCard ==
                                                item.billing_id
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
                                          {/* 
                                      {selectedCreditCard ===
                                        item.billing_id && (
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
                                                onBlur={
                                                  generalledgerFormik.handleBlur
                                                }
                                                onChange={(e) => {
                                                  const inputValue =
                                                    e.target.value;
                                                  if (
                                                    /^\d{0,3}$/.test(inputValue)
                                                  ) {
                                                    // Only allow up to 3 digits
                                                    generalledgerFormik.handleChange(
                                                      e
                                                    );
                                                  }
                                                }}
                                                value={
                                                  generalledgerFormik.values.cvv
                                                }
                                                required
                                                //disabled={refund === true}
                                              />
                                            </FormGroup>
                                          </Row>
                                        </td>
                                      )} */}
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
                              </CardContent>
                            </Card>
                            {/* ) : (
                    ""
                  )} */}
                          </>
                        ) : selectedPaymentMethod === "Check" ? (
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
                                onBlur={generalledgerFormik.handleBlur}
                                onChange={generalledgerFormik.handleChange}
                                value={generalledgerFormik.values.check_number}
                                required
                              />
                            </FormGroup>
                          </>
                        ) : null}
                      </Row>
                      {/* {selectedPaymentMethod === "Credit Card" ? (
                        <>
                          <Row>
                            <Col sm="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Card Number *
                                </label>
                                <InputGroup>
                                  <Input
                                    type="number"
                                    id="creditcard_number"
                                    placeholder="0000 0000 0000 0000"
                                    name="creditcard_number"
                                  />
                                </InputGroup>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm="2">
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
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="2">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Cvv *
                                </label>
                                <Input
                                  type="number"
                                  id="cvv"
                                  placeholder="XXX"
                                  name="cvv"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </>
                      ) : (
                        ""
                      )} */}
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="3">
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
                          placeholder="if left blank, will show 'Payment'"
                          type="text"
                          name="memo"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Apply Payment to Balances
                        </label>
                        <div className="table-responsive">
                          <Table
                            className="table table-bordered"
                            style={{
                              borderCollapse: "collapse",
                              border: "1px solid #ddd",
                              overflow: "hidden",
                            }}
                          >
                            <thead>
                              <tr>
                                <th>Account</th>
                                <th>Balance</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <>
                                {generalledgerFormik.values.payments?.map(
                                  (payments, index) => (
                                    <tr key={index}>
                                      <td>
                                        <Dropdown
                                          isOpen={payments.dropdownOpen}
                                          toggle={() => toggleDropdown(index)}
                                        >
                                          <DropdownToggle caret>
                                            {payments.account
                                              ? payments.account
                                              : "Select"}
                                          </DropdownToggle>
                                          <DropdownMenu
                                            style={{
                                              zIndex: 999,
                                              maxHeight: "200px",
                                              overflowY: "auto",
                                            }}
                                          >
                                            <DropdownItem
                                              header
                                              style={{ color: "blue" }}
                                            >
                                              Liability Account
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() => {
                                                handleAccountSelection(
                                                  "Last Month's Rent",
                                                  index,
                                                  "Liability Account"
                                                );
                                              }}
                                            >
                                              Last Month's Rent
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() => {
                                                handleAccountSelection(
                                                  "Prepayments",
                                                  index,
                                                  "Liability Account"
                                                );
                                              }}
                                            >
                                              Prepayments
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() => {
                                                handleAccountSelection(
                                                  "Security Deposit Liability",
                                                  index,
                                                  "Liability Account"
                                                );
                                              }}
                                            >
                                              Security Deposit Liability
                                            </DropdownItem>
                                            {recAccounts.length > 0 ? (
                                              <>
                                                <DropdownItem
                                                  header
                                                  style={{ color: "blue" }}
                                                >
                                                  Reccuring Charges
                                                </DropdownItem>
                                                {recAccounts?.map((item) => (
                                                  <DropdownItem
                                                    key={item._id}
                                                    onClick={() => {
                                                      handleAccountSelection(
                                                        item.account,
                                                        index,
                                                        "Recurring Charge"
                                                      );
                                                    }}
                                                  >
                                                    {item.account}
                                                  </DropdownItem>
                                                ))}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                            {oneTimeAccounts.length > 0 ? (
                                              <>
                                                <DropdownItem
                                                  header
                                                  style={{ color: "blue" }}
                                                >
                                                  One Time Charges
                                                </DropdownItem>
                                                {oneTimeAccounts?.map(
                                                  (item) => (
                                                    <DropdownItem
                                                      key={item._id}
                                                      onClick={() => {
                                                        handleAccountSelection(
                                                          item.account,
                                                          index,
                                                          "One Time Charge"
                                                        );
                                                      }}
                                                    >
                                                      {item.account}
                                                    </DropdownItem>
                                                  )
                                                )}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </DropdownMenu>
                                        </Dropdown>
                                      </td>
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          type="number"
                                          name={`payments[${index}].balance`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={
                                            payments?.entry_id
                                              ? payments.balance -
                                                payments.amount
                                              : payments?.balance
                                          }
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          style={{ width: "80%" }}
                                          type="text"
                                          name={`payments[${index}].amount`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={(e) => {
                                            if (!payments?.entry_id) {
                                              payments.balance = e.target.value;
                                            }
                                            generalledgerFormik.handleChange(e);
                                          }}
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, "");
                                            e.target.value = numericValue;
                                          }}
                                          value={payments.amount}
                                        />
                                        {generalledgerFormik.touched.payments &&
                                        generalledgerFormik.touched.payments[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.payments &&
                                        generalledgerFormik.errors.payments[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.payments[
                                          index
                                        ].amount ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .payments[index].amount
                                            }
                                          </div>
                                        ) : null}
                                      </td>
                                      {!payment_id && (
                                        <td>
                                          <ClearIcon
                                            type="button"
                                            style={{
                                              cursor: "pointer",
                                              padding: 0,
                                            }}
                                            onClick={() =>
                                              handleRemoveRow(index)
                                            }
                                          >
                                            Remove
                                          </ClearIcon>
                                        </td>
                                      )}
                                    </tr>
                                  )
                                )}
                                <tr>
                                  <th>Total</th>
                                  <th>{total.toFixed(2)}</th>
                                </tr>
                                {Number(
                                  generalledgerFormik.values.total_amount || 0
                                ) !== Number(total) ? (
                                  <tr>
                                    <th colSpan={2}>
                                      <span
                                        style={{
                                          cursor: "pointer",
                                          color: "red",
                                        }}
                                      >
                                        The payment's amount must match the
                                        total applied to balance. The difference
                                        is $
                                        {Math.abs(
                                          generalledgerFormik.values
                                            .total_amount - total
                                        ).toFixed(2)}
                                      </span>
                                    </th>
                                  </tr>
                                ) : null}
                              </>
                            </tbody>
                            {!payment_id && (
                              <tfoot>
                                <tr>
                                  <td colSpan="4">
                                    <Button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={handleAddRow}
                                    >
                                      Add Row
                                    </Button>
                                  </td>
                                </tr>
                              </tfoot>
                            )}
                          </Table>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Upload Files (Maximum of 10)
                        </label>

                        <div className="d-flex">
                          <div className="file-upload-wrapper">
                            <input
                              type="file"
                              className="form-control-file d-none"
                              accept="file/*"
                              name="upload_file"
                              id="upload_file"
                              multiple
                              onChange={(e) => fileData(e.target.files)}
                            />
                            <label for="upload_file" className="btn">
                              Choose Files
                            </label>
                          </div>

                          <div className="d-flex ">
                            {file?.length > 0 &&
                              file?.map((file, index) => (
                                <div
                                  key={index}
                                  style={{
                                    position: "relative",
                                    marginLeft: "50px",
                                  }}
                                >
                                  <p
                                    onClick={() =>
                                      handleOpenFile(
                                        file?.upload_file
                                          ? file?.upload_file
                                          : file?.name?.upload_file
                                      )
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    {file?.name?.file_name
                                      ? file?.name?.file_name?.substr(0, 5)
                                      : file?.file_name?.substr(0, 5)}
                                    {file?.name?.file_name
                                      ? file?.name?.file_name?.length > 5
                                        ? "..."
                                        : null
                                      : file?.file_name?.length > 5
                                      ? "..."
                                      : null}
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
                              ))}
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col lg="3">
                      <FormGroup>
                        <Checkbox name="print_receipt" />
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Print Receipt
                        </label>
                      </FormGroup>
                    </Col>
                  </Row> */}
                  <Row>
                    <Col lg="5">
                      <FormGroup>
                        {loader ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                              background: "green",
                              cursor: "not-allowed",
                            }}
                            disabled
                          >
                            Loading...
                          </button>
                        ) : payment_id ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              editPayment(generalledgerFormik.values);
                            }}
                          >
                            Edit Payment
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              generalledgerFormik.handleSubmit();
                            }}
                          >
                            Add Payment
                          </button>
                        )}

                        <Button
                          color="primary"
                          className="btn btn-primary"
                          onClick={handleCloseButtonClick}
                          style={{ background: "white", color: "black" }}
                        >
                          Cancel
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal
          isOpen={isModalOpen}
          toggle={closeModal}
          style={{ maxWidth: "1000px" }}
        >
          <ModalHeader toggle={closeModal} className="bg-secondary text-white">
            <strong style={{ fontSize: 18 }}>Add Credit Card</strong>
          </ModalHeader>
          <ModalBody>
            <CreditCardForm
              tenantId={tenantId}
              closeModal={closeModal}
              //getCreditCard={getCreditCard}
            />
          </ModalBody>
        </Modal>
        <ToastContainer />
      </Container>
    </>
  );
}

export default AddPayment;
