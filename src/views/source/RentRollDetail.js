import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "components/Headers/Header";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import {
  Button,
  Card,
  CardHeader,
  FormGroup,
  Container,
  Row,
  Col,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
  Form,
  Input,
} from "reactstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import MailIcon from "@mui/icons-material/Mail";
import { jwtDecode } from "jwt-decode";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CardContent, Grid, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DoneIcon from "@mui/icons-material/Done";
import "./Leaseing.css";
import CreditCardForm from "./CreditCardForm";
import swal from "sweetalert";

const RentRollDetail = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { lease_id, admin } = useParams();
  const navigate = useNavigate();

  const [accessType, setAccessType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  //set lease data
  const [leaseData, setLeaseData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const fetchLeaseData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/leases/lease_summary/${lease_id}`
      );
      setLeaseData(res.data.data);
    } catch (error) {
      console.error("Error: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  //set financial data
  const [financialData, setFinancialData] = useState([]);
  const fetchfinancialData = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        `${baseUrl}/payment/charges_payments/${lease_id}`
      );
      setFinancialData(res.data.data);
      setTotalAmount(res.data.totalBalance);
    } catch (error) {
      console.error("Error: ", error.message);
    } finally {
      setLoader(false);
    }
  };

  const [tenantDetails, setTenantDetails] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const fetchTenantsData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/tenants/leases/${lease_id}`);
      setTenantDetails(res.data.data);
      setTenantId(res.data.data[0].tenant_id);
    } catch (error) {
      console.error("Error: ", error.message);
    } finally {
      setLoading(false);
    }
  };
  console.log("tenant manu", tenantId);
  console.log("tenant manu", tenantDetails);
  useEffect(() => {
    fetchLeaseData();
    fetchfinancialData();
    fetchTenantsData();
  }, [lease_id]);

  const [value, setValue] = useState("Summary");
  const handleChange = (value) => {
    setValue(value);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [showModal, setShowModal] = useState(false);
  const [moveOutDate, setMoveOutDate] = useState("");
  const [noticeGivenDate, setNoticeGivenDate] = useState("");
  const handleMoveOutClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleMoveout = (lease_id) => {
    if (moveOutDate && noticeGivenDate) {
      const updatedApplicant = {
        moveout_notice_given_date: noticeGivenDate,
        moveout_date: moveOutDate,
      };

      axios
        .put(`${baseUrl}/leases/lease_moveout/${lease_id}`, updatedApplicant)
        .then((res) => {
          console.log(res, "res");
          if (res.data.statusCode === 200) {
            toast.success("Move-out Successfully", {
              position: "top-center",
              autoClose: 500,
            });
            handleModalClose();
            fetchTenantsData();
            fetchLeaseData();
          }
        })
        .catch((err) => {
          toast.error("An error occurred while Move-out", {
            position: "top-center",
            autoClose: 500,
          });
          console.error(err);
        });
    } else {
      toast.error("NOTICE GIVEN DATE && MOVE-OUT DATE must be required", {
        position: "top-center",
        autoClose: 500,
      });
    }
  };

  const [refund, setRefund] = useState(false);
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [showOptions, setShowOptions] = useState(false);
  const [showOptionsId, setShowOptionsId] = useState("");
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [ResponseData, setResponseData] = useState("");

  const handleOptionClick = (option) => {
    // generatePDF(option);
    // handleClose();
  };

  const toggleOptions = (id) => {
    setShowOptions(!showOptions);
    setShowOptionsId(id);
  };

  const closeRefund = () => {
    setIsRefundOpen(false);
    // getTenantData();
    // getCreditCard();
    // getMultipleCustomerVault();
  };

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
      // if (Number(generalledgerFormik.values.total_amount) === Number(total)) {
      //   handleSubmit(values);
      // }
    },
  });

  const fetchData = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/payment/payment/${id}`);

      if (response.data.statusCode === 200) {
        // setFile(response.data.data.charges_attachment);
        setResponseData(response.data.data);
        generalledgerFormik.setValues({
          date: response.data.data[0].entry[0].date,
          amount: response.data.data[0].total_amount,
          payment_type: response.data.data[0].payment_type,
          customer_vault_id: response.data.data[0].customer_vault_id,
          billing_id: response.data.data[0].billing_id,
          charges_attachment: response.data.data[0].charges_attachment,

          entry: [
            {
              account: response.data.data[0].account || "",
              amount: response.data.data[0].amount || "",
              // balance: response.data.data[0].amount || "",
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
  }, []);

  const handleRefundClick = async () => {
    try {
      setPaymentLoader(true);
      // Assuming 'item' is a prop or state variable
      const { payment_id, payment_type } = ResponseData[0];
      const commonData = {
        transactionId: ResponseData[0].transaction_id,
        customer_vault_id: ResponseData[0].customer_vault_id,
        billing_id: ResponseData[0].billing_id,
        amount: generalledgerFormik.values.amount,
        payment_type: ResponseData[0].payment_type,

        total_amount: generalledgerFormik.values.amount,
        tenant_firstName: ResponseData.tenant_data.tenant_firstName,
        tenant_lastName: ResponseData.tenant_data.tenant_lastName,
        tenant_id: ResponseData[0].tenant_id,
        lease_id: ResponseData[0].lease_id,
        email_name: ResponseData.tenant_data.tenant_email,
        // account: ResponseData[0].account,
        type: ResponseData[0].type,
        // memo: generalledgerFormik.values.memo,
        // cvv: ResponseData.cvv,
        // _id: ResponseData._id,
        // rental_adress: ResponseData.rental_adress,
        //unit: ResponseData.unit,
        entry: ResponseData[0].entry.map((item) => {
          const obj = {
            amount: item.amount,
            account: item.account,
            date: generalledgerFormik.values.date,
            memo: generalledgerFormik.values.memo,
          };
          return obj;
        }),
      };
      console.log("comman data=======", commonData);

      if (payment_type === "Credit Card") {
        const response = await axios.post(`${baseUrl}/nmipayment/new-refund`, {
          refundDetails: commonData,
        });
        if (response.data.status === 200) {
          swal("Success!", response.data.data, "success");
          await fetchfinancialData();
          closeRefund();
        } else if (response.data.status === 201) {
          swal("Warning!", response.data.data.error, "warning");
        } else {
          console.error("Failed to process refund:", response.statusText);
        }
      } else if (payment_type === "Cash" || payment_type === "Check") {
        const response = await axios.post(
          `${baseUrl}/nmipayment/manual-refund/${payment_id}`,
          {
            refundDetails: commonData,
          }
        );

        if (response.data.statusCode === 200) {
          //await setRefund(false);
          swal("Success!", response.data.message, "success");
          await fetchfinancialData();
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

  const openCardForm = () => {
    setIsModalOpen(true);
  };

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }

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

  const [expandedRows, setExpandedRows] = useState([]);
  const [expandedData, setExpandedData] = useState([]);
  const openAccount = (ledger, i) => {
    const isExpanded = expandedRows.includes(i);

    if (!isExpanded) {
      setExpandedRows([...expandedRows, i]);
      setExpandedData((prevExpandedData) => ({
        ...prevExpandedData,
        [i]: ledger?.entry,
      }));
    } else {
      setExpandedRows(expandedRows.filter((row) => row !== i));
      setExpandedData((prevExpandedData) => {
        const newData = { ...prevExpandedData };
        delete newData[i];
        return newData;
      });
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
                    {leaseData?.tenant_firstName +
                      " " +
                      leaseData?.tenant_lastName}
                  </h1>
                  <h5 style={{ color: "white" }}>
                    {getStatus(leaseData?.start_date, leaseData?.end_date)} |{" "}
                    {leaseData?.rental_adress ? leaseData?.rental_adress : " "}
                    {leaseData?.rental_unit &&
                    leaseData?.rental_unit !== undefined &&
                    leaseData?.rental_unit !== ""
                      ? ` - ${leaseData?.rental_unit}`
                      : ""}
                  </h5>
                </>
              )}
            </FormGroup>
          </Col>
          <Col className="text-right">
            <Button
              color="primary"
              onClick={() => navigate("/" + admin + "/RentRoll")}
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
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      overflow: "scroll",
                    }}
                  >
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
                              style={{ overflow: "auto" }}
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
                                  ) : leaseData?.lease_id ? (
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
                                          {leaseData?.rental_adress +
                                            " " +
                                            leaseData?.rental_unit || "N/A"}
                                        </Col>
                                        <Col>
                                          {leaseData?.rentalOwner_firstName
                                            ? leaseData?.rentalOwner_firstName +
                                              " " +
                                              leaseData?.rentalOwner_lastName
                                            : "N/A"}
                                        </Col>
                                        <Col>
                                          {leaseData?.tenant_firstName +
                                            " " +
                                            leaseData?.tenant_lastName || "N/A"}
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
                                        {leaseData ? (
                                          <>
                                            <tr
                                              key={leaseData?.lease_id}
                                              className="body"
                                            >
                                              <td>
                                                {getStatus(
                                                  leaseData?.start_date,
                                                  leaseData?.end_date
                                                )}
                                              </td>
                                              <td>
                                                {formatDateWithoutTime(
                                                  leaseData?.start_date
                                                ) +
                                                  " To " +
                                                  formatDateWithoutTime(
                                                    leaseData?.end_date
                                                  ) || "N/A"}
                                              </td>
                                              <td>
                                                {leaseData?.rental_adress ||
                                                  "N/A"}
                                              </td>
                                              <td>
                                                {leaseData?.lease_type || "N/A"}
                                              </td>
                                              <td>{leaseData?.amount}</td>
                                            </tr>
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
                                        {totalAmount
                                          ? totalAmount < 0
                                            ? `$(${Math.abs(
                                                totalAmount?.toFixed(2)
                                              )})`
                                            : `$${totalAmount?.toFixed(2)}`
                                          : "$ 0.00"}
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
                                            <Typography
                                              sx={{
                                                fontSize: 14,
                                                fontWeight: "bold",
                                                marginRight: "10px",
                                              }}
                                              color="text.secondary"
                                              gutterBottom
                                            >
                                              {leaseData?.amount}
                                            </Typography>
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                            marginRight: "10px",
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
                                            Due date:
                                          </Typography>
                                          <Typography
                                            sx={{
                                              fontSize: 14,
                                              fontWeight: "bold",
                                              marginRight: "10px",
                                            }}
                                            color="text.secondary"
                                            gutterBottom
                                          >
                                            {leaseData?.date}
                                          </Typography>
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
                                            `/${admin}/AddPayment/${lease_id}`
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
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          marginLeft: "10px",
                                          paddingTop: "10px",
                                          cursor: "pointer",
                                          color: "blue",
                                        }}
                                      >
                                        <div
                                          onClick={() => setValue(`Financial`)}
                                        >
                                          Lease Ledger
                                        </div>
                                      </Typography>
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
                        <Col xs="12" sm="6"></Col>
                        <Col
                          className="d-flex justify-content-end"
                          xs="12"
                          sm="6"
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
                            Add Cards
                          </Button>
                          <Button
                            color="primary"
                            onClick={() =>
                              navigate(`/${admin}/AddPayment/${lease_id}`)
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
                            onClick={() =>
                              navigate(`/${admin}/AddCharge/${lease_id}`)
                            }
                            style={{ background: "white", color: "blue" }}
                          >
                            Enter Charge
                          </Button>
                        </Col>
                      </Row>
                      <br />
                      {/* <Row
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
                      </Row> */}
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
                              <CardHeader className="border-0">
                                Lease Ledger
                              </CardHeader>

                              <Table
                                className="align-items-center table-flush"
                                responsive
                              >
                                <thead className="thead-light">
                                  <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Account</th>
                                    <th scope="col">Transaction</th>
                                    <th scope="col">Increase</th>
                                    <th scope="col">Decrease</th>
                                    <th scope="col">Balance</th>
                                    <th scope="col">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {financialData &&
                                    financialData?.map(
                                      (generalledger, index) => (
                                        <>
                                          <tr
                                            key={`${
                                              generalledger?.payment_id ||
                                              generalledger?.charge_id
                                            }`}
                                          >
                                            <td>
                                              {generalledger?.entry[0]?.date ||
                                                "-"}
                                            </td>
                                            <td>
                                              {generalledger?.type || "-"}
                                            </td>

                                            <td
                                              style={{
                                                cursor:
                                                  generalledger?.entry?.length >
                                                  1
                                                    ? "pointer"
                                                    : "",
                                              }}
                                              onClick={() => {
                                                if (
                                                  generalledger?.entry?.length >
                                                    1 &&
                                                  generalledger?.type !==
                                                    "Refund"
                                                ) {
                                                  openAccount(
                                                    generalledger,
                                                    index
                                                  );
                                                }
                                              }}
                                            >
                                              {generalledger.entry?.map(
                                                (item) => (
                                                  <>
                                                    {item.account}
                                                    <br />
                                                  </>
                                                )
                                              ) || "-"}
                                            </td>
                                            <td
                                              style={{
                                                color:
                                                  generalledger.type ===
                                                    "Payment" &&
                                                  generalledger.response ===
                                                    "SUCCESS"
                                                    ? "#50975E"
                                                    : generalledger.type ===
                                                        "Refund" &&
                                                      generalledger.response ===
                                                        "SUCCESS"
                                                    ? "#ffc40c"
                                                    : generalledger.response ===
                                                      "FAILURE"
                                                    ? "#AA3322"
                                                    : "inherit",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {generalledger.response &&
                                              generalledger.payment_type
                                                ? `Manual ${generalledger.type} ${generalledger.response} for ${generalledger.payment_type}`
                                                : "- - - - - - - - - - - - - - - - -"}
                                              {generalledger.transaction_id
                                                ? ` (#${generalledger.transaction_id})`
                                                : ""}
                                            </td>
                                            <td>
                                              {generalledger.type ===
                                                "Charge" ||
                                              generalledger.type === "Refund"
                                                ? "$" +
                                                  generalledger.total_amount
                                                : "-"}
                                            </td>
                                            <td>
                                              {generalledger.type === "Payment"
                                                ? "$" +
                                                  generalledger.total_amount
                                                : "-"}
                                            </td>
                                            <td>
                                              {generalledger.balance !==
                                              undefined
                                                ? generalledger.balance >= 0
                                                  ? `$${generalledger?.balance?.toFixed(
                                                      2
                                                    )}`
                                                  : `$(${Math.abs(
                                                      generalledger?.balance?.toFixed(
                                                        2
                                                      )
                                                    )})`
                                                : "0"}
                                            </td>
                                            <td>
                                              <div
                                                style={{
                                                  display: "flex",
                                                  gap: "5px",
                                                }}
                                              >
                                                {generalledger?.response !==
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
                                                          generalledger?.payment_id
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
                                                      {generalledger?.payment_id ===
                                                        showOptionsId && (
                                                        <div>
                                                          {generalledger?.response ===
                                                            "SUCCESS" && (
                                                            <DropdownItem
                                                              // style={{color:'black'}}
                                                              onClick={() => {
                                                                fetchData(
                                                                  generalledger.payment_id
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
                                                          {(generalledger?.response ===
                                                            "PENDING" ||
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
                                                                if (
                                                                  generalledger?.type ===
                                                                  "Charge"
                                                                ) {
                                                                  navigate(
                                                                    `/${admin}/AddCharge/${lease_id}/${generalledger.charge_id}`
                                                                  );
                                                                } else {
                                                                  navigate(
                                                                    `/${admin}/AddPayment/${lease_id}/${generalledger.payment_id}`
                                                                  );
                                                                }
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
                                          {expandedRows.includes(index) && (
                                            <tr
                                              style={{
                                                border: "0",
                                                backgroundColor: "#f6f9fc",
                                              }}
                                              key={`expanded_${index}`}
                                            >
                                              <td
                                                scope="col"
                                                style={{ border: "0" }}
                                                colSpan="2"
                                              ></td>
                                              <td
                                                scope="col"
                                                style={{ border: "0" }}
                                                colSpan="2"
                                                className="text-left"
                                              >
                                                <b>Accounts</b>
                                                <br />
                                                {expandedData[index].map(
                                                  (item, subIndex) => (
                                                    <span
                                                      key={`expanded_${index}_${subIndex}`}
                                                    >
                                                      {item?.account}
                                                      <br />
                                                    </span>
                                                  )
                                                )}
                                              </td>
                                              <td
                                                scope="col"
                                                style={{ border: "0" }}
                                              >
                                                {financialData[index]?.type ===
                                                  "Charge" ||
                                                financialData[index]?.type ===
                                                  "Refund" ? (
                                                  <>
                                                    <b>Amount</b>
                                                    <br />
                                                  </>
                                                ) : (
                                                  ""
                                                )}
                                                {expandedData[index].map(
                                                  (data, subIndex) => (
                                                    <>
                                                      {financialData[index]
                                                        ?.type === "Charge" ||
                                                      financialData[index]
                                                        ?.type === "Refund"
                                                        ? "$" + data?.amount
                                                        : ""}
                                                      <br />
                                                    </>
                                                  )
                                                )}
                                              </td>
                                              <td
                                                scope="col"
                                                style={{ border: "0" }}
                                              >
                                                {financialData[index]?.type ===
                                                "Payment" ? (
                                                  <>
                                                    <b>Amount</b>
                                                    <br />
                                                  </>
                                                ) : (
                                                  ""
                                                )}
                                                {expandedData[index].map(
                                                  (data, subIndex) => (
                                                    <>
                                                      {financialData[index]
                                                        ?.type === "Payment"
                                                        ? "$" + data?.amount
                                                        : ""}
                                                      <br />
                                                    </>
                                                  )
                                                )}
                                              </td>
                                              <td
                                                scope="col"
                                                style={{ border: "0" }}
                                              ></td>
                                              <td></td>
                                              {console.log(
                                                expandedData[index],
                                                "yash"
                                              )}
                                            </tr>
                                          )}
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
                  {console.log("lease data manu", leaseData)}
                  <TabPanel value="Tenant">
                    <CardHeader className="border-0">
                      <span>
                        <span>Property :</span>
                        <h2 style={{ color: "blue" }}>
                          {leaseData?.rental_adress +
                            (leaseData?.rental_unit
                              ? " - " + leaseData?.rental_unit
                              : "")}
                        </h2>
                      </span>
                    </CardHeader>
                    <Row>
                      <Col>
                        {Array.isArray(tenantDetails) ? (
                          <Grid container spacing={2}>
                            {tenantDetails.map((tenant, index) => (
                              <Grid item xs={12} sm={6}>
                                <Box
                                  key={index}
                                  border="1px solid #ccc"
                                  borderRadius="8px"
                                  padding="16px"
                                  maxWidth="700px"
                                  margin="20px"
                                >
                                  {!tenant?.moveout_notice_given_date ? (
                                    <div
                                      className="d-flex justify-content-end h5"
                                      onClick={handleMoveOutClick}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <LogoutIcon fontSize="small" /> Move out
                                    </div>
                                  ) : (
                                    <div className="d-flex justify-content-end h5">
                                      <DoneIcon fontSize="small" /> Move Out
                                    </div>
                                  )}

                                  <Modal isOpen={showModal}>
                                    <ModalHeader>
                                      <strong style={{ fontSize: 18 }}>
                                        Move Out Tenants
                                      </strong>
                                    </ModalHeader>
                                    <ModalBody>
                                      <div>
                                        Select tenants to move out. If everyone
                                        is moving, the lease will end on the
                                        last move-out date. If some tenants are
                                        staying, you’ll need to renew the lease.
                                        Note: Renters insurance policies will be
                                        permanently deleted upon move-out.
                                      </div>
                                      <hr />
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
                                            <tr>
                                              <td>
                                                {tenant.rental_adress
                                                  ? tenant.rental_adress
                                                  : ""}{" "}
                                                {tenant.rental_unit
                                                  ? tenant.rental_unit
                                                  : ""}
                                              </td>
                                              <td>Fixed</td>
                                              <td>
                                                {tenant.start_date
                                                  ? tenant.start_date
                                                  : ""}{" "}
                                                {tenant.end_date
                                                  ? tenant.end_date
                                                  : ""}
                                              </td>
                                            </tr>
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
                                            <tr>
                                              <td>
                                                {tenant.tenant_firstName + " "}{" "}
                                                {tenant.tenant_lastName}
                                              </td>
                                              <td>
                                                <div className="col">
                                                  <input
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="Notice Given Date"
                                                    value={noticeGivenDate}
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
                                          </tbody>
                                        </Table>
                                      </React.Fragment>
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        style={{
                                          backgroundColor: "#008000",
                                          color: "#ffffff",
                                        }}
                                        onClick={() =>
                                          handleMoveout(tenant.lease_id)
                                        }
                                      >
                                        Move out
                                      </Button>
                                      <Button
                                        style={{ backgroundColor: "#ffffff" }}
                                        onClick={handleModalClose}
                                      >
                                        Close
                                      </Button>
                                    </ModalFooter>
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
                                        {tenant.tenant_firstName || "N/A"}
                                        {tenant.tenant_lastName || "N/A"}
                                        <br></br>
                                        {tenant.rental_adress}
                                        {tenant.rental_unit !== "" &&
                                        tenant.rental_unit !== undefined
                                          ? ` - ${tenant.rental_unit}`
                                          : null}
                                      </div>

                                      <div>
                                        {" "}
                                        {formatDateWithoutTime(
                                          tenant.start_date
                                        ) || "N/A"}{" "}
                                        to{" "}
                                        {formatDateWithoutTime(
                                          tenant.end_date
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
                                        {tenant.tenant_phoneNumber || "N/A"}
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
                                          tenant.moveout_notice_given_date
                                            ? {
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
                                            color: "black",
                                          }}
                                        >
                                          Notice date:
                                        </Typography>
                                        {tenant.moveout_notice_given_date ||
                                          "N/A"}
                                      </div>
                                      <div
                                        style={
                                          tenant.moveout_date
                                            ? {
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
                                            color: "black",
                                          }}
                                        >
                                          Move out:
                                        </Typography>
                                        {tenant.moveout_date || "N/A"}
                                      </div>
                                    </Col>
                                  </Row>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <h3>No data available....</h3>
                        )}
                      </Col>

                      {/* <Col xs="12" md="6" lg="4" xl="3"> */}
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
                                {totalAmount
                                  ? totalAmount < 0
                                    ? `$(${Math.abs(totalAmount?.toFixed(2))})`
                                    : `$${totalAmount?.toFixed(2)}`
                                  : "$ 0.00"}
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
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                      }}
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      {leaseData?.amount}
                                    </Typography>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginTop: "10px",
                                    marginRight: "10px",
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
                                    Due date:
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      fontWeight: "bold",
                                      marginRight: "10px",
                                    }}
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {leaseData?.date}
                                  </Typography>
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
                                  navigate(`/${admin}/AddPayment/${lease_id}`)
                                }
                                style={{
                                  background: "white",
                                  color: "blue",
                                  marginRight: "10px",
                                }}
                              >
                                Receive Payment
                              </Button>
                              <Typography
                                // key={index}
                                sx={{
                                  fontSize: 14,
                                  marginLeft: "10px",
                                  paddingTop: "10px",
                                  cursor: "pointer",
                                  color: "blue",
                                }}
                              >
                                <div onClick={() => setValue(`Financial`)}>
                                  Lease Ledger
                                </div>
                              </Typography>
                            </div>
                          </CardContent>
                        </Card>
                        {/* <Card
                                  className="w-100 mt-3"
                                  style={{ background: "#F4F6FF" }}
                                >
                                  <CardContent>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: 18,
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
                                            <th>Card Number</th>
                                            <th>Expiration Date</th>
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
                                                  {item.card_number.slice(
                                                    0,
                                                    4
                                                  ) +
                                                    "*".repeat(8) +
                                                    item.card_number.slice(-4)}
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
                                                  {item.exp_date}
                                                </Typography>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </Table>
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
                                </Card> */}
                      </div>
                      {/* </Col> */}
                    </Row>
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
    </div>
  );
};

export default RentRollDetail;
