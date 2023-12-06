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

const WorkOrderDetails = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { workorder_id } = useParams();
  //console.log("ID:", workorder_id);
  const [outstandDetails, setoutstandDetails] = useState({});
  const [showTenantTable, setShowTenantTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [activeButton, setActiveButton] = useState("Summary");
  let navigate = useNavigate();

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
  
  const getOutstandData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/workorder/workorder_summary/${workorder_id}`
      );
      setoutstandDetails(response.data.data);
      setLoading(false);
      //console.log("Data", response.data.data);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
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

  React.useEffect(() => {
    getOutstandData();
  }, [workorder_id]);

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
                    onMouseEnter={() => handleMouseEnter("Summary")}
                    onMouseLeave={handleMouseLeave}
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
                    onMouseEnter={() => handleMouseEnter("Task")}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setActiveButton("Task")}
                  >
                    Task
                  </ToggleButton>
                </ToggleButtonGroup>
              </CardHeader>
              <div className="table-responsive">
                {activeButton === "Summary" && (
                  <Table
                    className="align-items-center table-flush"
                    responsive
                    style={{ width: "100%" }}
                  >
                    {loading ? (
                      <tr>
                        <td>Loading Work Order details...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td>Error: {error.message}</td>
                      </tr>
                    ) : outstandDetails.workorder_id ? (
                      <>
                        <tbody>
                          <tr>
                            <th colSpan="2" className="text-primary text-lg">
                              {outstandDetails.work_subject}
                            </th>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">Property </td>
                            <td>{outstandDetails.rental_adress || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">Category </td>
                            <td>{outstandDetails.work_category || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">
                              Vendor Notes{" "}
                            </td>
                            <td>{outstandDetails.vendor_note || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">Vendor </td>
                            <td>{outstandDetails.vendor_name || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">
                              Entry Allowed
                            </td>
                            <td>{outstandDetails.entry_allowed || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">
                              Work Performed{" "}
                            </td>
                            <td>{outstandDetails.work_performed || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">
                              Work Assigned
                            </td>
                            <td>{outstandDetails.staffmember_name || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">Status </td>
                            <td>{outstandDetails.status || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">Due Date</td>
                            <td>
                              {formatDateWithoutTime(
                                outstandDetails.due_date
                              ) || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">Priority </td>
                            <td>{outstandDetails.priority || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">
                              Entry Allowed
                            </td>
                            <td>{outstandDetails.entry_allowed || "N/A"}</td>
                          </tr>
                        </tbody>
                      </>
                    ) : (
                      <tbody>
                        <tr>
                          <td>No details found.</td>
                        </tr>
                      </tbody>
                    )}
                  </Table>
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
