import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TenantsHeader from 'components/Headers/TenantsHeader';
import {
  Card,
  CardHeader,
  FormGroup,
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from "reactstrap";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useFormik } from 'formik';


const TWorkOrderDetails = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  //console.log(id);
  const [outstandDetails, setoutstandDetails] = useState({});
  const [showTenantTable, setShowTenantTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [updateButton, setUpdateButton] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [workOrderStatus, setWorkOrderStatus] = useState("");
  const [activeButton, setActiveButton] = useState('Summary');
  const [selectedStatus, setSelectedStatus] = useState("Select");
  const [selecteduser, setSelecteduser] = useState("Select");
  const [user, setUser] = useState(null);
  const [statusdropdownOpen, setstatusdropdownOpen] = React.useState(false);
  const toggle5 = () => setuserdropdownOpen((prevState) => !prevState);
  const [userdropdownOpen, setuserdropdownOpen] = React.useState(false);
  const [staffData, setstaffData] = useState([]);



  let navigate = useNavigate();

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
      setUser(jwt.userName);

    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const toggle6 = () => setstatusdropdownOpen((prevState) => !prevState);
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    // WorkFormik.values.status = status;
  };

  const [imagedetails, setImageDetails] = useState([]);
  const getOutstandData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/workorder/workorder_summary/${id}`);
      setoutstandDetails(response.data.data);
      setLoading(false);
      setWorkOrderStatus(response.data.data.workorder_status.reverse());
      setImageDetails(response.data.data.workOrderImage);
    } catch (error) {
      console.error('Error fetching tenant details:', error);
      setError(error);
      setLoading(false);
    }
  };
  const handleUpdateButtonClick = () => {
    // Add any logic or state changes you need before opening the dialog
    setUpdateButton(true);
    setOpenDialog(true);
  };

  const handleMouseEnter = (buttonValue) => {
    setHoveredButton(buttonValue);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const handleChange = () => {
    setShowTenantTable(!showTenantTable);
  };

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }
  const handleStaffSelect = (staff) => {
    setSelecteduser(staff);
    // WorkFormik.values.staffmember_name = staff;
  };
  React.useEffect(() => {
    getOutstandData();
    fetch(`${baseUrl}/addstaffmember/find_staffmember`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setstaffData(data.data);
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  }, [id]);
  React.useEffect(() => {
    getOutstandData();

  }, [id]);

  const detailstyle = {
    fontSize: "15px",
    color: "#525f7f",
    fontWeight: 600,
  };
  const handleDialogClose = () => {
    // Add any logic or state changes you need when the dialog is closed
    setOpenDialog(false);
  };
  const updateWorkorderFormik = useFormik({
    initialValues: {
      status: "",
      staffmember_name: "",
      due_date: "",
      // assigned_to: "",
      message: "",
      statusUpdatedBy: "",
    },
    onSubmit: (values) => {
      //console.log(values);
      // updateValues()
      // updateWorkorder(values);
    },
  });

  const updateValues = async () => {
    console.log(selectedStatus, "selected status");
    handleDialogClose();
    const formatedDate = updateWorkorderFormik.values.due_date
      ? new Date(updateWorkorderFormik.values.due_date)
          .toISOString()
          .split("T")[0]
      : "";
    await axios
      .put(`${baseUrl}/workorder/updateworkorder/${outstandDetails._id}`, {
        due_date: formatedDate,
        staffmember_name: selecteduser,
        message: updateWorkorderFormik.values.message,
        status: selectedStatus,
      })
      .then((res) => {
        console.log(res.data, "the wgike put");
        getOutstandData();
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .put(`${baseUrl}/workorder/workorder/${outstandDetails._id}/status`, {
        statusUpdatedBy: "Tenant",
        status:
          selectedStatus !== outstandDetails.status ? selectedStatus : " ",
        due_date:
          formatedDate !== outstandDetails.due_date ? formatedDate : " ",
        staffmember_name:
          selecteduser !== outstandDetails.staffmember_name
            ? selecteduser
            : " ",
        // updateAt: updatedAt,
      })
      .then((res) => {
        console.log(res.data, "the status put");
        getOutstandData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const total = () => {
    let total = 0;
    outstandDetails?.entries.map((item) => {
      total = total + item.total_amount;
    })
    return total;
  }

  const tableHeaderStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    fontWeight: "bold",
    textAlign: "left",
  };

  const tableCellStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
  };

  const tableFooterStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
  };

  const SmallSummaryCard = ({ label, value, textTruncate }) => {
    return (
      <div className="small-summary-card p-3"> {/* Added padding with the p-3 class */}
        <h6 className="text-uppercase text-muted mb-0">{label}</h6>
        <span className={`font-weight-bold ${textTruncate ? 'text-truncate' : ''}`}>{value}</span>
      </div>
    );
  }

  let cookie_id = localStorage.getItem("Tenant ID");
  const [tenantsDetails, setTenantsDetails] = useState();

  const getTenantData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/tenant/tenant/${cookie_id}/entries`
      );
      // console.log(response.data.data);
      setTenantsDetails(response.data.data[0]);
      console.log(response.data.data[0], "jaye");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };


  useEffect(() => {
    getTenantData();
  }, [cookie_id]);

  const [propertyDetails, setPropertyDetails] = useState({});
  const getPropertyData = async () => {
    if (outstandDetails.rental_adress && outstandDetails.rental_units) {
      try {
        const response = await axios.get(
          `${baseUrl}/propertyunit/property/${outstandDetails.rental_adress}/${outstandDetails.rental_units}`
        );
        setPropertyDetails(response.data[0]);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
        setError(error);
      }
    }
  };

  React.useEffect(() => {
    getPropertyData();
  }, [outstandDetails]);

  return (
    <>
      <TenantsHeader />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: 'white' }}>
                Work Order Details
              </h1>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/tenant/tenantwork")}
              size="sm"
              style={{ background: "white", color: "black" }}
            >
              Back
            </Button>
          </Col>
        </Row><br />
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <ToggleButtonGroup
                  color="primary"
                  // value={alignment}
                  exclusive
                  onChange={handleChange}
                  aria-label="Platform"

                >
                  <ToggleButton
                    value="Summary"
                    style={{
                      border: 'none',
                      background: 'none',
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      color: activeButton === 'Summary' ? '#3B2F2F' : 'inherit',
                      // textDecoration: activeButton === 'Summary' ? 'underline' : 'none',
                    }}
                    onMouseEnter={() => handleMouseEnter('Summary')}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setActiveButton('Summary')}
                  >
                    Summary
                  </ToggleButton>

                  <ToggleButton
                    value="Task"
                    style={{
                      border: 'none',
                      background: 'none',
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      color: activeButton === 'Task' ? '#3B2F2F' : 'inherit',
                      // textDecoration: activeButton === 'Task' ? 'underline' : 'none',
                    }}
                    onMouseEnter={() => handleMouseEnter('Task')}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setActiveButton('Task')}
                  >
                    Task
                  </ToggleButton>

                </ToggleButtonGroup>

              </CardHeader>
              <div className="table-responsive" >
                {console.log(tenantsDetails, "yash")}

                {activeButton === "Summary" && (
                  <div className="container-fluid">
                    <Row className="mb-4">
                      <Col lg="8" md="12">
                        {loading ? (
                          <div>Loading Work Order details...</div>
                        ) : error ? (
                          <div>Error: {error.message}</div>
                        ) : outstandDetails.workorder_id ? (
                          <>
                            <Box
                              border="1px solid #ccc"
                              borderRadius="8px"
                              padding="16px"
                              maxWidth="700px"
                              margin="20px"
                            >
                              <Box display="flex" alignItems="center" marginBottom="20px">
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
                                  marginRight="16px"
                                >
                                  <AssignmentOutlinedIcon />
                                </Box>
                                <Box flex="1">
                                  <h2 className="text text-lg" style={{ color: '#3B2F2F' }}>
                                    {outstandDetails.work_subject || "N/A"}
                                  </h2>
                                  <span>{outstandDetails.rental_adress || "N/A"}</span>
                                </Box>
                              </Box>
                              <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="stretch">

                                {/* Left side */}
                                <Box flex="1" className={{ xs: 'col-12', md: 'col-7' }} marginBottom={{ xs: '20px', md: '0' }}>
                                  <FormGroup marginBottom="20px">
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-property"
                                      style={{ marginBottom: "10px", fontWeight: "bold" }}
                                    >
                                      Description
                                    </label>
                                    <span style={{ fontSize: "13px", display: "block", marginTop: "5px" }}>
                                      {outstandDetails.work_performed || "N/A"}
                                    </span>
                                  </FormGroup>
                                  <FormGroup marginBottom="20px">
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-property"
                                      style={{ marginBottom: "10px", fontWeight: "bold" }}
                                    >
                                      Permission to enter
                                    </label>
                                    <span style={{ fontSize: "13px", display: "block", marginTop: "5px" }}>
                                      {outstandDetails.entry_allowed || "N/A"}
                                    </span>
                                  </FormGroup>
                                  <FormGroup marginBottom="20px">
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-property"
                                      style={{ marginBottom: "10px", fontWeight: "bold" }}
                                    >
                                      Vendor Notes
                                    </label>
                                    <span style={{ fontSize: "13px", display: "block", marginTop: "5px" }}>
                                      {outstandDetails.vendor_note || "N/A"}
                                    </span>
                                  </FormGroup>
                                </Box>

                                {/* Right side */}

                                <Box flex="1" className="d-flex flex-column">
                                  <Row style={{ border: "1px solid #ccc", borderRadius: "8px", margin: "15px auto", width: "100%" }}>
                                    <Col style={{ padding: "0 8px" }}>
                                      <SmallSummaryCard
                                        label="Status"
                                        value={outstandDetails.status || "N/A"}
                                        textTruncate // add this prop to enable text truncation
                                      />
                                    </Col>
                                  </Row>
                                  <Row style={{ border: "1px solid #ccc", borderRadius: "8px", margin: "15px auto", width: "100%" }}>
                                    <Col style={{ padding: "0 8px" }}>
                                      <SmallSummaryCard
                                        label="Due Date"
                                        value={outstandDetails.due_date || "N/A"}
                                        textTruncate // add this prop to enable text truncation
                                      />
                                    </Col>
                                  </Row>
                                  <Row style={{ border: "1px solid #ccc", borderRadius: "8px", margin: "15px auto", width: "100%" }}>
                                    <Col style={{ padding: "0 8px" }}>
                                      <SmallSummaryCard
                                        label="Assignees"
                                        value={outstandDetails.staffmember_name || "N/A"}
                                        textTruncate // add this prop to enable text truncation
                                      />
                                    </Col>
                                  </Row>
                                </Box>
                              </Box>
                            </Box>
                            {outstandDetails?.entries?.length > 0 && outstandDetails?.entries[0].part_qty
                              ? (
                                <Box
                                  border="1px solid #ccc"
                                  borderRadius="8px"
                                  padding="16px"
                                  maxWidth="700px"
                                  margin="20px"
                                  style={{ marginLeft: "auto", marginRight: "auto", overflowX: 'auto' }} // Center the box horizontally
                                >
                                  <h2 className="text text-lg" style={{ color: '#3B2F2F' }}>Parts and Labor</h2>
                                  <Box overflowX="auto">
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                      <thead>
                                        <tr>
                                          <th style={tableHeaderStyle}>QTY</th>
                                          <th style={tableHeaderStyle}>ACCOUNT</th>
                                          <th style={tableHeaderStyle}>DESCRIPTION</th>
                                          <th style={tableHeaderStyle}>PRICE</th>
                                          <th style={tableHeaderStyle}>AMOUNT</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {/* Add your table rows dynamically here */}
                                        {outstandDetails?.entries.map((item, index) => (
                                          <tr key={index}>
                                            <td style={tableCellStyle}>{item.part_qty}</td>
                                            <td style={tableCellStyle}>{item.account_type}</td>
                                            <td style={tableCellStyle}>{item.description}</td>
                                            <td style={{ ...tableCellStyle, textAlign: "right" }}>${item.part_price}</td>
                                            <td style={{ ...tableCellStyle, textAlign: "right" }}>${item.total_amount}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                      <tfoot>
                                        <tr>
                                          <td colSpan="4" style={tableHeaderStyle}>Total</td>
                                          <td style={{ ...tableFooterStyle, textAlign: "right" }}>${total()}</td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </Box>
                                </Box>
                              ) : null}
                              <Grid
                              container
                              border="1px solid #ccc"
                              borderRadius="8px"
                              padding="16px"
                              maxWidth="700px"
                              margin="20px"
                              style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                overflowX: "auto",
                              }} // Center the box horizontally
                            >
                              <Grid item xs={3} sm={3.5} md={3} lg={2} xl={2}>
                                <h2 className="text-primary text-lg">
                                  Updates
                                </h2>
                              </Grid>
                              <Grid item xs={3}>
                                <Button
                                  size="sm"
                                  onClick={handleUpdateButtonClick}
                                >
                                  Update
                                </Button>
                              </Grid>
                              {outstandDetails.workorder_status &&
                                outstandDetails.workorder_status.length > 0 &&
                                workOrderStatus.map((item, index) => (
                                  <Grid item xs={12}>
                                    <Box
                                      padding="12px"
                                      maxWidth="700px"
                                      style={{
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        overflowX: "auto",
                                      }} // Center the box horizontally
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div style={{ fontWeight: "bold" }}>
                                          {item.statusUpdatedBy} {item.createdAt ? 
                                            "Created this work order" : "Updated this work order"
                                           }
                                          <span style={{ fontSize: "13px" }}>
                                            &nbsp;({item.updateAt})
                                          </span>
                                        </div>
                                      </div>
                                      <hr
                                        style={{
                                          marginTop: "0px",
                                          marginBottom: "0px",
                                        }}
                                      />
                                      {console.log(item,'item')}
                                      <Grid container>
                                        {item.status !== (" " || "")  ||
                                        item.due_date !== (" " || "")  ||
                                        item.staffmember_name !== (" " || "")  ? (
                                          <>
                                            <Grid
                                              item
                                              xs={4}
                                              style={
                                                item.status === (" " || "") 
                                                  ? { display: "none" }
                                                  : { display: "block" }
                                              }
                                            >
                                              Status: {item.status}
                                            </Grid>
                                            <Grid
                                              item
                                              xs={4}
                                              style={
                                                item.due_date === (" " || null) 
                                                  ? { display: "none" }
                                                  : { display: "block" }
                                              }
                                            >
                                              Due Date: {item.due_date}
                                            </Grid>
                                            <Grid
                                              item
                                              xs={4}
                                              style={
                                                item.staffmember_name === (" " || null )
                                                  ? { display: "none" }
                                                  : { display: "block" }
                                              }
                                            >
                                              Assigned To:{" "}
                                              {item.staffmember_name}
                                            </Grid>
                                          </>
                                        ) : (
                                          <>
                                            <Grid item>
                                              {" "}
                                              Work Order Is Updated
                                            </Grid>
                                          </>
                                        )}
                                      </Grid>
                                    </Box>
                                  </Grid>
                                ))}
                            </Grid>

                          </>
                        ) : (
                          <div>No details found.</div>
                        )}
                      </Col>
                      <Col lg="4" md="12">
                        {outstandDetails?.workorder_id ? (
                          <Box
                            border="1px solid #ccc"
                            borderRadius="8px"
                            maxWidth="100%" // Use 100% to make it responsive
                            margin="20px"
                          >
                            <Box borderBottom="1px solid #ccc" style={{ minWidth: "100%", padding: "16px 16px 5px 16px", color: "#5e72e4" }}>
                              <h2 className="text" style={{ color: '#3B2F2F' }}>Contacts</h2>
                            </Box>
                            <Box
                              borderBottom="1px solid #ccc"
                              style={{ display: "flex", alignItems: "center", minWidth: "100%", padding: "16px 16px 5px 16px" }}
                            >
                              <Box width="16px" marginRight="10px">
                                {/* SVG icon */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="currentColor"
                                  className="bi bi-person-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                </svg>
                              </Box>
                              <Box width="100%" style={{ minWidth: "100%", padding: "0 16px" }}>
                                <span style={detailstyle}>Vendor</span> <br />
                                <span>{outstandDetails?.vendor_name || "N/A"}</span>
                              </Box>
                            </Box>
                            {tenantsDetails && typeof tenantsDetails === 'object' ? (
                              <Box
                                style={{ display: "flex", alignItems: "center", minWidth: "100%", padding: "16px 16px 5px 16px" }}
                              >
                                <Box width="16px" marginRight="10px">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    className="bi bi-person-fill"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                  </svg>
                                </Box>
                                <Box width="100%" style={{ minWidth: "100%", padding: "0 16px" }}>
                                  <span style={detailstyle}>Tenant</span> <br />
                                  <span>{tenantsDetails.tenant_firstName ? <>{tenantsDetails.tenant_firstName} {tenantsDetails.tenant_lastName}</> : ""}</span>
                                </Box>
                              </Box>
                            ) : null}
                          </Box>
                        ) : null}
                        {propertyDetails ? <>
                          <Box
                            border="1px solid #ccc"
                            borderRadius="8px"
                            maxWidth="100%" // Use 100% to make it responsive
                            margin="20px"
                            display="flex"
                            flexDirection="column"
                            alignItems="center" // Center content horizontally
                          >
                            <Box borderBottom="1px solid #ccc" style={{ width: "100%", padding: "16px", textAlign: "left", color: "#5e72e4" }}>
                              <h2 className="text" style={{ color: '#3B2F2F' }}>Property</h2>
                            </Box>
                            {propertyDetails?.propertyres_image || propertyDetails?.property_image ? (
                              <Box style={{ width: "100%", padding: "16px", display: "flex", alignItems: "center" }}>
                                <Box width="100%" style={{ minWidth: "100%", textAlign: "center" }}>
                                  <img
                                    src={
                                      propertyDetails.propertyres_image &&
                                      propertyDetails.propertyres_image
                                        .length > 0
                                        ? propertyDetails
                                            .propertyres_image[0][0]
                                        : propertyDetails.property_image &&
                                          propertyDetails.property_image
                                            .length > 0 &&
                                          propertyDetails.property_image[0][0]
                                    }
                                    alt="property"
                                    style={{ maxWidth: "80%", maxHeight: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
                                  />
                                </Box>
                              </Box>
                            ) : null}
                            <Box style={{ width: "100%", padding: "5px 16px", display: "flex", alignItems: "center" }}>
                              <Box width="100%" style={{ minWidth: "100%", textAlign: "center", cursor: 'pointer', color: 'blue' }} onClick={() => navigate(`/tenant/tenantpropertydetail/${propertyDetails.rental_adress}`)}>
                                <span>{propertyDetails?.rental_adress || "N/A"} ({propertyDetails?.rental_units})</span>
                              </Box>
                            </Box>
                            <Box style={{ width: "100%", padding: "5px 16px", display: "flex", alignItems: "center" }}>
                              <Box width="100%" style={{ minWidth: "100%", textAlign: "center" }}>
                                <span>{propertyDetails?.rental_city ? <>{propertyDetails?.rental_city},</> : ""} {propertyDetails?.rental_state ? <>{propertyDetails?.rental_state},</> : ""} {propertyDetails?.rental_country ? <>{propertyDetails?.rental_country},</> : ""} {propertyDetails.rental_postcode ? <>{propertyDetails.rental_postcode}.</> : ""}</span>
                              </Box>
                            </Box>
                          </Box>
                        </> : <></>}

                      </Col>
                    </Row>
                    {updateButton && (
                      <Form onSubmit={updateWorkorderFormik.handleSubmit}>
                        <Dialog open={openDialog} onClose={handleDialogClose}>
                          <DialogTitle>Update Dialog</DialogTitle>
                          <DialogContent>
                            <Grid container spacing={2}>
                              <Grid item xs={4}>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-desg"
                                  >
                                    Status *
                                  </label>
                                  <FormGroup>
                                    <Dropdown
                                      isOpen={statusdropdownOpen}
                                      toggle={toggle6}
                                    >
                                      <DropdownToggle caret>
                                        {selectedStatus
                                          ? selectedStatus
                                          : "Select"}
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                      </DropdownToggle>
                                      <DropdownMenu
                                        style={{
                                          width: "100%",
                                          maxHeight: "200px",
                                          overflowY: "auto",
                                        }}
                                      >
                                        <DropdownItem
                                          onClick={() =>
                                            handleStatusSelect("New")
                                          }
                                        >
                                          New
                                        </DropdownItem>
                                        <DropdownItem
                                          onClick={() =>
                                            handleStatusSelect("In Progress")
                                          }
                                        >
                                          In Progress
                                        </DropdownItem>
                                        <DropdownItem
                                          onClick={() =>
                                            handleStatusSelect("On Hold")
                                          }
                                        >
                                          On Hold
                                        </DropdownItem>
                                        <DropdownItem
                                          onClick={() =>
                                            handleStatusSelect("Complete")
                                          }
                                        >
                                          Complete
                                        </DropdownItem>
                                      </DropdownMenu>
                                      {/* {WorkFormik.errors &&
                                WorkFormik.errors?.status &&
                                WorkFormik.touched &&
                                WorkFormik.touched?.status &&
                                WorkFormik.values.status === "" ? (
                                <div style={{ color: "red" }}>
                                  {WorkFormik.errors.status}
                                </div>
                              ) : null} */}
                                    </Dropdown>
                                  </FormGroup>
                                </FormGroup>
                              </Grid>
                              <Grid item xs={6}>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-unitadd"
                                  >
                                    Due Date
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-unitadd"
                                    type="date"
                                    name="due_date"
                                    value={
                                      updateWorkorderFormik.values.due_date
                                    }
                                    onChange={
                                      updateWorkorderFormik.handleChange
                                    }
                                    onBlur={updateWorkorderFormik.handleBlur}
                                  />
                                  {/* {WorkFormik.touched.due_date &&
                            WorkFormik.errors.due_date ? (
                            <div style={{ color: "red" }}>
                              {WorkFormik.errors.due_date}
                            </div>
                          ) : null} */}
                                </FormGroup>
                              </Grid>
                              <Grid item xs={4}>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-desg"
                                  >
                                    Assigned To *
                                  </label>
                                  <FormGroup>
                                    <Dropdown
                                      isOpen={userdropdownOpen}
                                      toggle={toggle5}
                                    >
                                      <DropdownToggle caret>
                                        {selecteduser ? selecteduser : "Select"}
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                      </DropdownToggle>
                                      <DropdownMenu
                                        style={{
                                          width: "100%",
                                          maxHeight: "200px",
                                          overflowY: "auto",
                                        }}
                                      >
                                        <DropdownItem
                                          header
                                          style={{ color: "blue" }}
                                        >
                                          Staff
                                        </DropdownItem>
                                        {staffData.map((user) => (
                                          <DropdownItem
                                            key={user._id}
                                            onClick={() =>
                                              handleStaffSelect(
                                                user.staffmember_name
                                              )
                                            }
                                          >
                                            {user.staffmember_name}
                                          </DropdownItem>
                                        ))}
                                      </DropdownMenu>
                                      {/* {WorkFormik.errors &&
                                WorkFormik.errors?.staffmember_name &&
                                WorkFormik.touched &&
                                WorkFormik.touched?.staffmember_name &&
                                WorkFormik.values.staffmember_name === "" ? (
                                <div style={{ color: "red" }}>
                                  {WorkFormik.errors.staffmember_name}
                                </div>
                              ) : null} */}
                                    </Dropdown>
                                  </FormGroup>
                                </FormGroup>
                              </Grid>
                              <Grid item xs={12}>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-unitadd"
                                  >
                                    Message
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-unitadd"
                                    type="textarea"
                                    name="message"
                                    value={updateWorkorderFormik.values.message}
                                    onChange={
                                      updateWorkorderFormik.handleChange
                                    }
                                    onBlur={updateWorkorderFormik.handleBlur}
                                  />
                                  {/* {WorkFormik.touched.due_date &&
                            WorkFormik.errors.due_date ? (
                            <div style={{ color: "red" }}>
                              {WorkFormik.errors.due_date}
                            </div>
                          ) : null} */}
                                </FormGroup>
                              </Grid>
                            </Grid>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleDialogClose} color="primary">
                              Cancel
                            </Button>
                            <Button color="primary" onClick={updateValues}>
                              Save
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Form>
                    )}
                  </div>
                )}

                {activeButton === 'Task' && (
                  <div className="container-fluid">
                    <Row className="mb-4">
                      <Col lg="8" md="12">
                        <Box border="1px solid #ccc" borderRadius="8px" padding="16px" maxWidth="700px" margin={'20px'}>
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
                                <AssignmentOutlinedIcon />
                              </Box>
                            </Col>
                            <Col lg="8">
                              <span
                                style={{
                                  border: "2px solid",
                                  borderColor:
                                    outstandDetails.priority === "High"
                                      ? "red"
                                      : outstandDetails.priority === "Medium"
                                        ? "green"
                                        : outstandDetails.priority === "Low"
                                          ? "#FFD700"
                                          : "inherit",
                                  borderRadius: "15px",
                                  padding: "2px",
                                  fontSize: "15px",
                                  color:
                                    outstandDetails.priority === "High"
                                      ? "red"
                                      : outstandDetails.priority === "Medium"
                                        ? "green"
                                        : outstandDetails.priority === "Low"
                                          ? "#FFD700"
                                          : "inherit",
                                }}
                              >
                                &nbsp;{outstandDetails.priority}&nbsp;
                              </span>
                              <h2 className="text-lg" style={{ color: '#3B2F2F' }}>{outstandDetails.work_subject || "N/A"}</h2>

                              <span className="">{outstandDetails.rental_adress || "N/A"}</span>
                            </Col>
                          </Row><br />
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Description
                                </label><br />
                                <span style={{ fontSize: '13px' }}>{outstandDetails.work_performed || "N/A"}</span>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Status
                                </label><br />
                                <span style={{ fontSize: '13px' }}>{outstandDetails.status || "N/A"}</span>
                              </FormGroup>
                            </Col>

                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Due Date
                                </label><br />
                                <span style={{ fontSize: '13px' }}>{formatDateWithoutTime(
                                  outstandDetails.due_date
                                ) || "N/A"}</span>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Assignees
                                </label><br />
                                <span style={{ fontSize: '13px' }}>{outstandDetails.staffmember_name || "N/A"}</span>
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Permission to enter
                                </label><br />
                                <span style={{ fontSize: '13px' }}>{outstandDetails.entry_allowed || "N/A"}</span>
                              </FormGroup>
                            </Col>
                          </Row>
                        </Box>
                      </Col>

                      <Col lg="4" md="12">
                        {/* <Box
                      border="1px solid #ccc"
                      borderRadius="8px"
                      padding="16px"
                      maxWidth="1000px"
                      margin={"20px"}
                    > */}

                        {imagedetails ? (
                          <>
                            <Box
                              border="1px solid #ccc"
                              borderRadius="8px"
                              maxWidth="100%" // Use 100% to make it responsive
                              margin="20px"
                              display="flex"
                              flexDirection="column"
                              alignItems="center" // Center content horizontally
                            >
                              <Box borderBottom="1px solid #ccc" style={{ width: "100%", padding: "16px", textAlign: "left", color: "#5e72e4" }}>
                                <h2 className="text" style={{ color: '#3B2F2F' }}>Images</h2>
                              </Box>


                              {imagedetails && imagedetails.length > 0 ? (
                                <Box style={{ width: "100%", padding: "16px", marginTop: "10px", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                                  {imagedetails.map((imageUrl, index) => (
                                    <Box key={index} width="48%" style={{ minWidth: "48%", margin: "1%" }}>
                                      <img
                                        src={imageUrl}
                                        alt={`property ${index}`}
                                        style={{ width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
                                      />
                                    </Box>
                                  ))}
                                </Box>
                              ) : "No Images Attached"}
                              <br />
                              <Box style={{ width: "100%", padding: "5px 16px", display: "flex", alignItems: "center" }}>
                                <Box width="100%" style={{ minWidth: "100%", textAlign: "center", cursor: 'pointer', color: 'blue' }} onClick={() => navigate(`/tenant/tenantpropertydetail/${propertyDetails.rental_adress}`)}>
                                  <span>{propertyDetails?.rental_adress || "N/A"} ({propertyDetails?.rental_units})</span>
                                </Box>
                              </Box>
                              <Box style={{ width: "100%", padding: "5px 16px", display: "flex", alignItems: "center" }}>
                                <Box width="100%" style={{ minWidth: "100%", textAlign: "center" }}>
                                  <span>{propertyDetails.rental_city ? <>{propertyDetails.rental_city},</> : ""} {propertyDetails.rental_state ? <>{propertyDetails.rental_state},</> : ""} {propertyDetails.rental_country ? <>{propertyDetails.rental_country},</> : ""} {propertyDetails.rental_postcode ? <>{propertyDetails.rental_postcode}.</> : ""}</span>
                                </Box>
                              </Box>
                            </Box>
                          </>
                        ) : (
                          <>No Details Found</>
                        )}


                      </Col>
                    </Row>
                  </div>

                )}
              </div><br />
            </Card>
          </div>
        </Row>
        <br />
        <br />
      </Container>

    </>
  )
};

export default TWorkOrderDetails;