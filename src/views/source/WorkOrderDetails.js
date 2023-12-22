import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Header from "components/Headers/Header";
import {
  Card,
  CardHeader,
  FormGroup,
  Container,
  Row,
  Col,
  Table,
  Button,
} from "reactstrap";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const WorkOrderDetails = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { workorder_id } = useParams();
  //console.log("ID:", workorder_id);
  const [outstandDetails, setoutstandDetails] = useState({});
  const [showTenantTable, setShowTenantTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [hoveredButton, setHoveredButton] = useState(null);
  const [activeButton, setActiveButton] = useState("Summary");
  let navigate = useNavigate();

  let cookies = new Cookies();

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      // setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getOutstandData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/workorder/workorder_summary/${workorder_id}`
      );
      setoutstandDetails(response.data.data);
      console.log("first", response.data.data);
      setLoading(false);
      //console.log("Data", response.data.data);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };
  const SmallSummaryCard = ({ label, value, textTruncate }) => {
    return (
      <div className="small-summary-card p-3"> {/* Added padding with the p-3 class */}
        <h6 className="text-uppercase text-muted mb-0">{label}</h6>
        <span className={`font-weight-bold ${textTruncate ? 'text-truncate' : ''}`}>{value}</span>
      </div>
    );
  }
  const detailstyle = {
    fontSize: "15px",
    color: "#525f7f",
    fontWeight: 600,
  };

  // const handleMouseEnter = (buttonValue) => {
  //   setHoveredButton(buttonValue);
  // };

  // const handleMouseLeave = () => {
  //   setHoveredButton(null);
  // };

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

  React.useEffect(() => {
    getOutstandData();
  }, [workorder_id]);

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
    } if (outstandDetails.rental_adress) {
      try {
        const response = await axios.get(
          `${baseUrl}/propertyunit/rentals_property/${outstandDetails.rental_adress}`
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

  const [tenantsDetails, setTenantsDetails] = useState();

  const getTenantsData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/tenant/findData`, {
        params: {
          rental_adress: propertyDetails?.rental_adress,
          rental_units: propertyDetails?.rental_units,
        },
      });
      console.log(response.data, "yash");
      response.data.map((data) => {
        data.entries.map((item) => {
          const currentDate = new Date();
          const sdate = new Date(item.start_date);
          const edate = new Date(item.end_date);

          // Compare the current date with start and end dates
          if (currentDate >= sdate && currentDate < edate && item.rental_adress === propertyDetails?.rental_adress && item.rental_units === propertyDetails?.rental_units) {
            // console.log('Response is OK');
            console.log(data, "yashu");
            setTenantsDetails(data);
          }
        })
      })
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
    }
  }

  React.useEffect(() => {
    getTenantsData();
  }, [propertyDetails]);

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

  const total = () => {
    let total = 0;
    outstandDetails?.entries.map((item) => {
      total = total + item.total_amount;
    })
    return total;
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Work Order Details</h1>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/admin/Workorder")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <br />
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
                      border: "none",
                      background: "none",
                      textTransform: "capitalize",
                      cursor: "pointer",
                      color: activeButton === "Summary" ? "blue" : "inherit",
                      // textDecoration: activeButton === 'Summary' ? 'underline' : 'none',
                    }}
                    // onMouseEnter={() => handleMouseEnter("Summary")}
                    // onMouseLeave={handleMouseLeave}
                    onClick={() => setActiveButton("Summary")}
                  >
                    Summary
                  </ToggleButton>

                  <ToggleButton
                    value="Task"
                    style={{
                      border: "none",
                      background: "none",
                      textTransform: "capitalize",
                      cursor: "pointer",
                      color: activeButton === "Task" ? "blue" : "inherit",
                      // textDecoration: activeButton === 'Task' ? 'underline' : 'none',
                    }}
                    // onMouseEnter={() => handleMouseEnter("Task")}
                    // onMouseLeave={handleMouseLeave}
                    onClick={() => setActiveButton("Task")}
                  >
                    Task
                  </ToggleButton>
                </ToggleButtonGroup>
              </CardHeader>
              <div className="table-responsive">
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
                                  <h2 className="text-primary text-lg">
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
                                  <h2 className="text-primary text-lg">Parts and Labor</h2>
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
                              <h3 className="text-primary">Contacts</h3>
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
                        {propertyDetails?.rental_adress ? <>
                          <Box
                            border="1px solid #ccc"
                            borderRadius="8px"
                            maxWidth="100%" // Use 100% to make it responsive
                            margin="20px"
                            display="flex"
                            flexDirection="column"
                            alignItems="center" // Center content horizontally
                          >
                            <Box borderBottom="1px solid #ccc" style={{ width: "100%", padding: "16px", textAlign: "center", color: "#5e72e4" }}>
                              <h3 className="text-primary">Property</h3>
                            </Box>
                            {propertyDetails?.propertyres_image || propertyDetails?.property_image ? (
                              <Box style={{ width: "100%", padding: "16px", display: "flex", alignItems: "center" }}>
                                <Box width="100%" style={{ minWidth: "100%", textAlign: "center" }}>
                                  <img
                                    src={propertyDetails?.propertyres_image || propertyDetails?.property_image}
                                    alt="property"
                                    style={{ maxWidth: "80%", maxHeight: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
                                  />
                                </Box>
                              </Box>
                            ) : null}
                            <Box style={{ width: "100%", padding: "5px 16px", display: "flex", alignItems: "center" }}>
                              <Box width="100%" style={{ minWidth: "100%", textAlign: "center", cursor: 'pointer', color: 'blue' }} onClick={() => navigate(`/admin/PropDetails/${propertyDetails.rentalId}/${propertyDetails.propertyId}`)}>
                                <span>{propertyDetails.rental_adress || "N/A"} ({propertyDetails.rental_units})</span>
                              </Box>
                            </Box>
                            <Box style={{ width: "100%", padding: "5px 16px", display: "flex", alignItems: "center" }}>
                              <Box width="100%" style={{ minWidth: "100%", textAlign: "center" }}>
                                <span>{propertyDetails.rental_city ? <>{propertyDetails.rental_city},</> : ""} {propertyDetails.rental_state ? <>{propertyDetails.rental_state},</> : ""} {propertyDetails.rental_country ? <>{propertyDetails.rental_country},</> : ""} {propertyDetails.rental_postcode ? <>{propertyDetails.rental_postcode}.</> : ""}</span>
                              </Box>
                            </Box>
                          </Box>
                        </> : <></>}

                      </Col>
                    </Row>
                  </div>
                )}
                {activeButton === "Task" && (
                  <div>
                    <Box
                      border="1px solid #ccc"
                      borderRadius="8px"
                      padding="16px"
                      maxWidth="700px"
                      margin={"20px"}
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
                          <h2 className="text-primary text-lg">
                            {outstandDetails.work_subject || "N/A"}
                          </h2>

                          <span className="">
                            {outstandDetails.rental_adress || "N/A"}
                          </span>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-property"
                            >
                              Description
                            </label>
                            <br />
                            <span style={{ fontSize: "13px" }}>
                              {outstandDetails.work_performed || "N/A"}
                            </span>
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
                            </label>
                            <br />
                            <span style={{ fontSize: "13px" }}>
                              {outstandDetails.status || "N/A"}
                            </span>
                          </FormGroup>
                        </Col>

                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-property"
                            >
                              Due Date
                            </label>
                            <br />
                            <span style={{ fontSize: "13px" }}>
                              {formatDateWithoutTime(
                                outstandDetails.due_date
                              ) || "N/A"}
                            </span>
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
                            </label>
                            <br />
                            <span style={{ fontSize: "13px" }}>
                              {outstandDetails.staffmember_name || "N/A"}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-property"
                            >
                              Permission to enter
                            </label>
                            <br />
                            <span style={{ fontSize: "13px" }}>
                              {outstandDetails.entry_allowed || "N/A"}
                            </span>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Box>
                  </div>
                )}
              </div>
              <br />
            </Card>
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default WorkOrderDetails;
