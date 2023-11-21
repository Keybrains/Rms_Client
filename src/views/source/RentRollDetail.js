import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { set } from "date-fns";
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
  console.log(tenantId, entryIndex, "tenantId, entryIndex");
  console.log(tenant_firstName, "tenant_firstName");
  const { tenant_firstName } = useParams();
  const [tenantDetails, setTenantDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [value, setValue] = React.useState("Summary");
  const [rental, setRental] = useState("");
  const [rentaldata, setRentaldata] = useState([]);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
        const response = await fetch(
          `http://localhost:4000/api/payment/Payment_summary/tenant/${tenantId}/${entryIndex}`
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

  const apiUrl = `http://localhost:4000/api/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;

  const id = tenantId;
  const entry = entryIndex;

  const getTenantData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTenantDetails(response.data.data);
      console.log(response.data.data, "hiiii");
      const rental = response.data.data.entries.rental_adress;
      setRental(rental);
      console.log(rental, "hell");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  const navigateToSummary = async (tenantId, entryIndex) => {
    // Construct the API URL
    const apiUrl = `http://localhost:4000/api/tenant/tenant_summary/${id}/entry/${entry}`;

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
    const apiUrl = `http://localhost:4000/api/tenant/tenant_summary/${id}/entry/${entry}`;

    try {
      // Fetch tenant data
      const response = await axios.get(apiUrl);
      const tenantData = response.data.data;

      // Access the rental_adress within the entries object
      const rentalAddress = tenantData.entries.rental_adress;
      // Set the tenantDetails state and loading state
      setTenantDetails(tenantData);
      console.log(rentalAddress, "rentalAddress");
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
    const apiUrl = `http://localhost:4000/api/tenant/tenant_summary/${id}/entry/${entry}`;

    try {
      // Fetch tenant data
      const response = await axios.get(apiUrl);
      const tenantData = response.data.data;

      // Set the tenantDetails state and loading state
      setTenantDetails(tenantData);
      console.log(tenant_firstName, "tenant_firstName");
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

  const tenantsData = async () => {
    // Construct the API URL
    const apiUrl = `http://localhost:4000/api/tenant/tenant-detail/tenants/${rental}`;

    try {
      // Fetch tenant data
      const response = await axios.get(apiUrl);
      const tenantData = response.data.data;
      console.log(tenantData.tenant_firstName, "abcd");
      setTenantDetails(tenantData);
      setRentaldata(tenantData);
      console.log(tenantData, "mansi");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };
  console.log(rentaldata, "rentalData");

  useEffect(() => {
    getTenantData();
  }, []);

  useEffect(() => {
    if (tenantId && entryIndex) {
      getTenantData();
      // getTenantData();
      console.log(rental, "rental");
      setValue("Tenant");
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

  // Check Authentication (token)
  const checkAuth = async () => {
    if (cookies.get("token")) {
      let authConfig = {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
          token: cookies.get("token"),
        },
      };
      try {
        // Authentication post method
        const res = await axios.post(
          "http://localhost:4000/api/register/auth",
          { purpose: "validate access" },
          authConfig
        );
        if (res.data.statusCode !== 200) {
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("Error validating access:", error);
        navigate("/auth/login");
      }
    } else {
      navigate("/auth/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, [cookies.get("token")]);

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

  //Financial functions
  const [GeneralLedgerData, setGeneralLedgerData] = useState([]);
  const [loader, setLoader] = React.useState(true);

  const getGeneralLedgerData = async () => {
    const apiUrl = `http://localhost:4000/api/payment/merge_payment_charge/${tenantId}`;

    try {
      const response = await axios.get(apiUrl);
      setLoader(false);

      // Check if the response contains the expected properties
      if (response.data && response.data.data) {
        const mergedData = response.data.data;

        // Check if the payments and charges properties exist
        if (mergedData.payments && mergedData.charges) {
          // Assuming you want to merge payments and charges into a single array
          const combinedData = [...mergedData.payments, ...mergedData.charges];

          setGeneralLedgerData(combinedData);
        } else {
          console.error(
            "Payments or charges data is missing from the response."
          );
        }
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

  function calculateBalance(type, entry, index) {
    let balance = 0;

    for (let i = 0; i <= index; i++) {
      const currentEntry = GeneralLedgerData[i]?.entries[index];

      if (currentEntry) {
        if (
          type === "Charge" &&
          typeof currentEntry.charges_amount === "number"
        ) {
          balance += currentEntry.charges_amount;
        } else if (
          type === "Payment" &&
          typeof currentEntry.amount === "number"
        ) {
          balance -= currentEntry.amount;
        }
      }
    }

    return balance;
  }
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
            `http://localhost:4000/api/payment/delete_charge/${chargeId}/${chargeIndex}`
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
                      <Col>
                        <div className="table-responsive">
                          <Table
                            className="align-items-center table-flush"
                            responsive
                            style={{ width: "100%" }}
                          >
                            {loading ? (
                              <tr>
                                <td>Loading tenant details...</td>
                              </tr>
                            ) : error ? (
                              <tr>
                                <td>Error: {error.message}</td>
                              </tr>
                            ) : tenantDetails._id ? (
                              <>
                                <tbody>
                                  <tr>
                                    <th
                                      colSpan="2"
                                      className="text-primary text-lg"
                                    >
                                      Tenant Details
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      First Name:
                                    </td>
                                    <td>
                                      {tenantDetails.tenant_firstName || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Last Name:
                                    </td>
                                    <td>
                                      {tenantDetails.tenant_lastName || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Phone:
                                    </td>
                                    <td>
                                      {tenantDetails.tenant_mobileNumber ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Email:
                                    </td>
                                    <td>
                                      {tenantDetails.tenant_email || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th
                                      colSpan="2"
                                      className="text-primary text-lg"
                                    >
                                      Personal Information
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Birth Date:
                                    </td>
                                    <td>
                                      {formatDateWithoutTime(
                                        tenantDetails.birth_date
                                      ) || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      TextPayer Id:
                                    </td>
                                    <td>
                                      {tenantDetails.textpayer_id || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Comments:
                                    </td>
                                    <td>{tenantDetails.comments || "N/A"}</td>
                                  </tr>
                                  <th
                                    colSpan="2"
                                    className="text-primary text-lg"
                                  >
                                    Emergency Contact
                                  </th>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Contact Name:
                                    </td>
                                    <td>
                                      {tenantDetails.contact_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Relation With Tenants:
                                    </td>
                                    <td>
                                      {tenantDetails.relationship_tenants ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Emergency Email:
                                    </td>
                                    <td>{tenantDetails.email || "N/A"}</td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Emergency PhoneNumber:
                                    </td>
                                    <td>
                                      {tenantDetails.emergency_PhoneNumber ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                </tbody>

                                <tbody>
                                  <tr>
                                    <th
                                      colSpan="2"
                                      className="text-primary text-lg"
                                    >
                                      Lease Details
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Property Type:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.rental_adress ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Lease Type:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.lease_type ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Start Date:
                                    </td>
                                    <td>
                                      {formatDateWithoutTime(
                                        tenantDetails.entries.start_date
                                      ) || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      End Date:
                                    </td>
                                    <td>
                                      {formatDateWithoutTime(
                                        tenantDetails.entries.end_date
                                      ) || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Rent Cycle:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.rent_cycle ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Rent Amount:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.amount || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Account:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.account || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Next Due Date:
                                    </td>
                                    <td>
                                      {formatDateWithoutTime(
                                        tenantDetails.entries.nextDue_date
                                      ) || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Memo:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.memo || "N/A"}
                                    </td>
                                  </tr>
                                </tbody>

                                <tbody>
                                  <tr>
                                    <th
                                      colSpan="2"
                                      className="text-primary text-lg"
                                    >
                                      Co-signer Details
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      First Name:
                                    </td>
                                    <td>
                                      {tenantDetails.entries
                                        .cosigner_firstName || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Last Name:
                                    </td>
                                    <td>
                                      {tenantDetails.entries
                                        .cosigner_lastName || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Mobile Number:
                                    </td>
                                    <td>
                                      {tenantDetails.entries
                                        .cosigner_mobileNumber || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Work Number:
                                    </td>
                                    <td>
                                      {tenantDetails.entries
                                        .cosigner_workNumber || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Home Number:
                                    </td>
                                    <td>
                                      {tenantDetails.entries
                                        .cosigner_homeNumber || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Fax Number:
                                    </td>
                                    <td>
                                      {tenantDetails.entries
                                        .cosigner_faxPhoneNumber || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Email:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.cosigner_email ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Alternate Email:
                                    </td>
                                    <td>
                                      {tenantDetails.entries
                                        .cosigner_alternateemail || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Street Address:
                                    </td>
                                    <td>
                                      {tenantDetails.entries
                                        .cosigner_streetAdress || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      City:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.cosigner_city ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      State:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.cosigner_state ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Country:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.cosigner_country ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Postal Code:
                                    </td>
                                    <td>
                                      {tenantDetails.entries
                                        .cosigner_postalcode || "N/A"}
                                    </td>
                                  </tr>
                                </tbody>

                                <tbody>
                                  <tr>
                                    <th
                                      colSpan="2"
                                      className="text-primary text-lg"
                                    >
                                      Recurring Payment Details
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Amount:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.recuring_amount ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Account:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.recuring_account ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Next Due Date:
                                    </td>
                                    <td>
                                      {formatDateWithoutTime(
                                        tenantDetails.entries
                                          .recuringnextDue_date
                                      ) || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Memo:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.recuringmemo ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Frequency:
                                    </td>
                                    <td>
                                      {tenantDetails.entries
                                        .recuringfrequency || "N/A"}
                                    </td>
                                  </tr>
                                </tbody>

                                <tbody>
                                  <tr>
                                    <th
                                      colSpan="2"
                                      className="text-primary text-lg"
                                    >
                                      One-time Payment Details
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Amount:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.onetime_amount ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Account:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.onetime_account ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Due Date:
                                    </td>
                                    <td>
                                      {formatDateWithoutTime(
                                        tenantDetails.entries.onetime_Due_date
                                      ) || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-weight-bold text-md">
                                      Memo:
                                    </td>
                                    <td>
                                      {tenantDetails.entries.onetime_memo ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                </tbody>
                              </>
                            ) : (
                              <tbody>
                                <tr>
                                  <td>No tenant details found.</td>
                                </tr>
                              </tbody>
                            )}
                          </Table>
                        </div>
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
                                                    ? generalledger.charges_date
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
                                                  ? entry.charges_amount
                                                  : "-"}
                                              </td>
                                              <td>
                                                {generalledger.type ===
                                                "Payment"
                                                  ? entry.amount
                                                  : "-"}
                                              </td>
                                              <td>
                                                {calculateBalance(
                                                  generalledger.type,
                                                  entry,
                                                  index
                                                )}
                                              </td>
                                              <td>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    gap: "5px",
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      console.log(
                                                        "Entry Object:",
                                                        entry
                                                      );
                                                      deleteCharge(
                                                        generalledger._id,
                                                        entry.chargeIndex
                                                      );
                                                      console.log(generalledger._id,"dsgdg")
                                                      console.log(entry.chargeIndex,"dsgdg")
                                                    }}
                                                  >
                                                    <DeleteIcon />
                                                  </div>
                                                  <div
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    <EditIcon />
                                                  </div>
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
                        <h2 style={{ color: "blue" }}> {rental}</h2>
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

                                      <Col lg="5">
                                        <div
                                          style={{
                                            color: "blue",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {tenant.tenant_firstName || "N/A"}{" "}
                                          {tenant.tenant_lastName || "N/A"}
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
