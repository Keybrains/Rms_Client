import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Table,
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

const RentRollDetail = () => {
  const { tenantId, entryIndex } = useParams();
  //console.log(tenant_firstName, "tenant_firstName");
  //console.log(tenantId, entryIndex, "tenantId, entryIndex");
  const { tenant_firstName } = useParams();
  const [tenantDetails, setTenantDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [value, setValue] = React.useState("Summary");
  const [rental, setRental] = useState("");
  const [unit, setUnit] = useState("");
  const [rentaldata, setRentaldata] = useState([]);
  const [paymentData, setPaymentData] = useState(null);
  const [myData, setMyData] = useState([]);
  const [balance, setBalance] = useState("");
 const [GeneralLedgerData, setGeneralLedgerData] = useState([]);
 const [loader, setLoader] = React.useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
        const response = await fetch(
          `https://propertymanager.cloudpress.host/api/payment/Payment_summary/tenant/${tenantId}/${entryIndex}`
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

  const handleClick = () => {
    navigate(`../AddPayment/${tenantId}/${entryIndex}`);
  };
  // const handleClick1 = () => {
  //   if (type === "charge") {
  //     navigate(`../AddPayment/${mainId}/charge/${chargeIndex}`);
  //   } else if (type === "payment") {
  //     navigate("/payment-page");
  //   }
  // };
  const apiUrl = `https://propertymanager.cloudpress.host/api/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;

  const id = tenantId;
  const entry = entryIndex;

  const getTenantData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTenantDetails(response.data.data);
      //console.log(response.data.data, "hiiii");
      const rental = response.data.data.entries.rental_adress;
      const unit = response.data.data.entries.rental_units;
      setRental(rental);
      // console.log(rental, "hell");
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
    const apiUrl = `https://propertymanager.cloudpress.host/api/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;

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
    const apiUrl = `https://propertymanager.cloudpress.host/api/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;

    try {
      // Fetch tenant data
      const response = await axios.get(apiUrl);
      const tenantData = response.data.data;

      // Access the rental_adress within the entries object
      const rentalAddress = tenantData.entries.rental_adress;
      // Set the tenantDetails state and loading state
      setTenantDetails(tenantData);
      // console.log(rentalAddress, "rentalAddress");
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
    const apiUrl = `https://propertymanager.cloudpress.host/api/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;

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
  //   const apiUrl = `https://propertymanager.cloudpress.host/api/tenant/tenant-detail/tenants/${rental}`;

  //   try {
  //     // Fetch tenant data
  //     const response = await axios.get(apiUrl);
  //     const tenantData = response.data.data;
  //     //console.log(tenantData.tenant_firstName, "abcd");
  //     setTenantDetails(tenantData);
  //     setRentaldata(tenantData);
  //     //console.log(tenantData, "mansi");
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
      apiUrl = `https://propertymanager.cloudpress.host/api/tenant/tenant-detail/tenants/${rental}`;
    } else {
      apiUrl = `https://propertymanager.cloudpress.host/api/tenant/tenant-detail/tenants/${rental}/${unit}`;
    }

    try {
      // Fetch tenant data
      const response = await axios.get(apiUrl);
      const tenantData = response.data.data;
      //console.log(tenantData.tenant_firstName, "abcd");
      setTenantDetails(tenantData);
      setRentaldata(tenantData);
      //console.log(tenantData, "mansi");
      setLoading(false);
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
      setValue("Summary");
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
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
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
  const doSomething = async () => {
    let responce = await axios.get("https://propertymanager.cloudpress.host/api/tenant/tenants");
    const data = responce.data.data;
    const filteredData = data.filter((item) => item._id === tenantId);
    console.log(filteredData, "yashr");
    setMyData(filteredData);
  };

  useEffect(() => {
    doSomething();
  }, []);

  const getStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today >= start && today <= end) {
      return "ACTIVE";
    } else if (today < start) {
      return "FUTURE";
    } else {
      return "-"; // Change this to suit your requirement for other cases
    }
  };
  // const getGeneralLedgerData = async () => {
  //   const apiUrl = `https://propertymanager.cloudpress.host/api/payment/merge_payment_charge/${tenantId}`;

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
    const apiUrl = `https://propertymanager.cloudpress.host/api/payment/merge_payment_charge/${tenantId}`;
    try {
      const response = await axios.get(apiUrl);
  setLoader(false);
      if (response.data && response.data.data) {
        const mergedData = response.data.data;
        // console.log(mergedData)
        mergedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        const dataWithBalance = calculateBalance(mergedData);
        
        setBalance(dataWithBalance[0].entries[0].balance);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getGeneralLedgerData();
  }, [tenantId]);

  const deleteCharge = (chargeId, chargeIndex) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this entry!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `https://propertymanager.cloudpress.host/api/payment/delete_charge/${chargeId}/${chargeIndex}`
          )
          .then((response) => {
            if (response.data.statusCode === 200) {
              swal("Success!", "Entry deleted successfully!", "success");
              getGeneralLedgerData();
              // Optionally, you can refresh your data here.
            } else {
              swal("", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting entry:", error);
            swal("", "Failed to delete entry", "error");
          });
      } else {
        swal("Cancelled", "Entry is safe :)", "info");
      }
    });
  };
  const editcharge = (id, chargeIndex) => {
    navigate(`/admin/AddCharge/${id}/charge/${chargeIndex}`);
    // console.log(id);
  };
  const editpayment = (id, paymentIndex) => {
    navigate(`/admin/AddPayment/${id}/payment/${paymentIndex}`);
    // console.log(id);
  };
  
  return (
    <div>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col xs="12" sm="6">
            <h1 style={{ color: "white" }}>Rent Roll Details</h1>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
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
              <CardHeader className="border-0">
                <div className="ml-3">
                  <h1>
                    {tenantDetails?.entries.rental_adress}
                    {"-"}
                    {tenantDetails?.entries.rental_units}
                    {"●"}
                    {tenantDetails?.tenant_firstName}
                  </h1>
                </div>
              </CardHeader>
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
                          <CardHeader className="border-0"></CardHeader>
                          <div className="table-responsive">
                            <div className="row m-3">
                              <div className="col-9">
                                <div
                                  className="align-items-center table-flush"
                                  responsive
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
                                        className="w-100 my-3 "
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
                                        className="w-100 mb-1 "
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
                                          <a
                                            href={`tel:${tenantDetails.tenant_mobileNumber}`}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="15"
                                              height="15"
                                              fill="currentColor"
                                              class="bi bi-telephone-outbound"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5" />
                                            </svg>{" "}
                                            {tenantDetails.rental_owner ||
                                              "N/A"}
                                          </a>
                                        </Col>
                                        <Col>
                                          {tenantDetails?.tenant_firstName +
                                            " " +
                                            tenantDetails?.tenant_lastName ||
                                            "N/A"}
                                        </Col>
                                      </Row>

                                      <Row
                                        className="w-100 my-3 "
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
                                        style={{
                                          fontSize: "12px",
                                          color: "#000",
                                        }}
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
                                                  <>
                                                    <tr className="body">
                                                      <td>
                                                        {getStatus(
                                                          item.entries
                                                            .start_date,
                                                          item.entries.end_date
                                                        )}
                                                      </td>
                                                      <td>
                                                        <Link
                                                          to={`/admin/rentrolldetail/${item._id}/${item.entries.entryIndex}`}
                                                          onClick={(e) => {
                                                            // Handle any additional actions onClick if needed
                                                            console.log(
                                                              item._id,
                                                              "Tenant Id"
                                                            );
                                                            console.log(
                                                              item.entries
                                                                .entryIndex,
                                                              "Entry Index"
                                                            );
                                                          }}
                                                        >
                                                          {formatDateWithoutTime(
                                                            item.entries
                                                              .start_date
                                                          ) +
                                                            "-" +
                                                            formatDateWithoutTime(
                                                              item.entries
                                                                .end_date
                                                            ) || "N/A"}
                                                        </Link>
                                                      </td>
                                                      <td>
                                                        {item.entries
                                                          .rental_adress ||
                                                          "N/A"}
                                                      </td>
                                                      <td>
                                                        {item.entries
                                                          .lease_type || "N/A"}
                                                      </td>
                                                      <td>
                                                        {item.entries.amount}
                                                      </td>
                                                    </tr>
                                                  </>
                                                ))}
                                              </>
                                            ) : null}
                                          </tbody>
                                        </Table>
                                      </Row>
                                      <Row className="w-100 my-3 text-left">
                                        <Col>
                                          <a href="#">Reset Pasword</a>
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
                              </div>
                              <div className="col-3 mt-3">
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
                                        {"$" + balance}
                                      </Typography>
                                    </div>
                                    <hr
                                      style={{
                                        marginTop: "2px",
                                        marginBottom: "6px",
                                      }}
                                    />

                                    {/* {paymentData.entries &&
                          paymentData.entries.length > 0 && ( */}
                                    <>
                                      <div>
                                        {/* {paymentData.entries.map(
                                  (entry, index) => ( */}
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
                                              entry.account:
                                            </Typography>
                                            <Typography sx={{ fontSize: 14 }}>
                                              entry.amount
                                            </Typography>
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
                                        <Typography
                                          sx={{
                                            fontSize: 14,
                                            marginLeft: "10px",
                                          }}
                                        >
                                          10/12/2023
                                        </Typography>
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
                                        color="success"
                                        // onClick={handleClick}
                                        style={{
                                          fontSize: "13px",
                                          background: "white",
                                          color: "green",
                                          "&:hover": {
                                            background: "green",
                                            color: "white",
                                          },
                                        }}
                                      >
                                        Payment
                                      </Button>
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
                                        Lease Ledger
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
                            href="#rms"
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
                          <Button
                            color="primary"
                            href="#rms"
                            onClick={() =>
                              navigate(
                                `/admin/AddCharge/${tenantId}/${entryIndex}`
                              )
                            }
                            style={{ background: "white", color: "blue" }}
                          >
                            Enter Charge
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
                                    <th scope="col">Account</th>
                                    <th scope="col">Memo</th>
                                    <th scope="col">Increase</th>
                                    <th scope="col">Decrease</th>
                                    <th scope="col">Balance</th>
                                    <th scope="col">Action</th>
                                  </tr>
                                </thead>
                                {/* {console.log(GeneralLedgerData)} */}
                                <tbody>
                                  {Array.isArray(GeneralLedgerData) ? (
                                    GeneralLedgerData.map((generalledger) => (
                                      <>
                                        {generalledger.entries.map(
                                          (entry, index) => (
                                            <tr
                                              key={`${generalledger._id}_${index}`}
                                            >
                                              <td>
                                                {formatDateWithoutTime(
                                                  generalledger.type ===
                                                    "Charge"
                                                    ? generalledger.date
                                                    : generalledger.date
                                                ) || "N/A"}
                                              </td>
                                              <td>{generalledger.type}</td>
                                              <td>
                                                {generalledger.type === "Charge"
                                                  ? entry.charges_account
                                                  : entry.account}
                                              </td>
                                              <td>
                                                {generalledger.type === "Charge"
                                                  ? generalledger.charges_memo
                                                  : generalledger.memo}
                                              </td>
                                              <td>
                                                {generalledger.type === "Charge"
                                                  ? "$" + entry.charges_amount
                                                  : "-"}
                                              </td>
                                              <td>
                                                {generalledger.type ===
                                                "Payment"
                                                  ? "$" + entry.amount
                                                  : "-"}
                                              </td>
                                              <td>
                                                {entry.balance !== undefined
                                                  ? entry.balance >= 0
                                                    ? `$${entry.balance}`
                                                    : `$(${Math.abs(
                                                        entry.balance
                                                      )})`
                                                  : "0"}
                                                {/* {calculateBalance(
                                                  generalledger.type,
                                                  entry,
                                                  index
                                                )} */}
                                              </td>
                                              <td>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    gap: "5px",
                                                  }}
                                                >
                                                  {generalledger.type ===
                                                    "Charge" && (
                                                    <div
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        // console.log(
                                                        //   "Entry Object:",
                                                        //   entry
                                                        // );
                                                        deleteCharge(
                                                          generalledger._id,
                                                          entry.chargeIndex
                                                        );
                                                        // console.log(
                                                        //   generalledger._id,
                                                        //   "dsgdg"
                                                        // );
                                                        // console.log(
                                                        //   entry.chargeIndex,
                                                        //   "dsgdg"
                                                        // );
                                                      }}
                                                    >
                                                      <DeleteIcon />
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
                                                          generalledger._id,
                                                          entry.chargeIndex
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
                                                          generalledger._id,
                                                          entry.paymentIndex
                                                        );
                                                      }}
                                                    >
                                                      <EditIcon />
                                                    </div>
                                                  )}
                                                </div>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </>
                                    ))
                                  ) : (
                                    <p>GeneralLedgerData is not an array</p>
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
                                          {entry.rental_adress}-
                                          {entry.rental_units}
                                        </div>

                                        <div>
                                          {" "}
                                          {formatDateWithoutTime(
                                            entry.start_date
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
                                            <HomeIcon />
                                          </Typography>
                                          {tenant.tenant_homeNumber || "N/A"}
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
                                            <BusinessCenterIcon />
                                          </Typography>
                                          {tenant.tenant_workNumber || "N/A"}
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
                        {paymentData && (
                          <Card style={{ background: "#F4F6FF" }}>
                            <CardContent>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: 14, fontWeight: "bold" }}
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
                                  ${paymentData.amount}
                                </Typography>
                              </div>
                              <hr
                                style={{
                                  marginTop: "2px",
                                  marginBottom: "6px",
                                }}
                              />
                              {/* Display entries data */}
                              {paymentData.entries &&
                                paymentData.entries.length > 0 && (
                                  <>
                                    <div>
                                      {paymentData.entries.map(
                                        (entry, index) => (
                                          <div
                                            key={index}
                                            className="entry-container"
                                          >
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
                                                {entry.account}:
                                              </Typography>
                                              <Typography sx={{ fontSize: 14 }}>
                                                {entry.amount}
                                              </Typography>
                                            </div>
                                          </div>
                                        )
                                      )}
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
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          marginLeft: "10px",
                                        }}
                                      >
                                        10/12/2023
                                      </Typography>
                                    </div>
                                  </>
                                )}
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  marginTop: "10px",
                                }}
                              >
                                <Button
                                  color="success"
                                  onClick={handleClick}
                                  style={{
                                    fontSize: "13px",
                                    background: "white",
                                    color: "green",
                                    "&:hover": {
                                      background: "green",
                                      color: "white",
                                    },
                                  }}
                                >
                                  Payment
                                </Button>
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    marginLeft: "10px",
                                    paddingTop: "10px",
                                    cursor: "pointer",
                                    color: "blue",
                                  }}
                                  onClick={() => handleChange("Financial")}
                                >
                                  Lease Ledger
                                </Typography>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Col>
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
    </div>
  );
};

export default RentRollDetail;
