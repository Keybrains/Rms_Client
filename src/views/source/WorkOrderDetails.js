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
        console.log("first", response.data.data);
        setLoading(false);
        //console.log("Data", response.data.data);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
        setError(error);
        setLoading(false);
      }
    };
    const SmallSummaryCard = ({ label, value }) => (
      <Box
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "5px",
          marginBottom: "10px",
          transition: "border-color 0.3s",
          "&:hover": {
            borderColor: "#73b680",
            cursor: "pointer",
          },
        }}
      >
        <Row>
          <Col>
            <label
              style={{
                fontSize: "13px",
                color: "#525f7f",
                fontWeight: "600",
              }}
            >
              {label}
            </label>
          </Col>
        </Row>
        <Row>
          <Col>
            {label === 'Status' && (
              <FontAwesomeIcon
                icon={value === 'Incomplete' ? faExclamationCircle : faCheckCircle}
                style={{ marginRight: '5px' }}
              />
            )}
            {label === 'Due Date' && (
              <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '5px' }} />
            )}
            <span style={{ fontSize: '13px' }}>{value || 'N/A'}</span>
          </Col>
        </Row>
      </Box>
    );
    
    const detailstyle = {
      fontSize: "15px",
      color: "#525f7f",
      fontWeight: 600,
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
                        <div className="tab d-flex">
                          <div className="col-8">
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

                                <Col
                                  className="head"
                                  style={{
                                    marginLeft: "-50px",
                                    marginBottom: "20px",
                                  }}
                                  lg="8"
                                >
                                  <h2 className="text-primary text-lg">
                                    {outstandDetails.work_subject || "N/A"}
                                  </h2>

                                  <span className="">
                                    {outstandDetails.rental_adress || "N/A"}
                                  </span>
                                </Col>
                              </Row>
                              <div className="main d-flex">
                                <div className="col-7">
                                  <Row>
                                    <Col>
                                      <FormGroup>
                                        <label
                                          className="form-control-label"
                                          htmlFor="input-property"
                                          style={detailstyle}
                                        >
                                          Description
                                        </label>
                                        <br />
                                        <span style={{ fontSize: "13px" }}>
                                          {outstandDetails.work_performed ||
                                            "N/A"}
                                        </span>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col>
                                      <FormGroup>
                                        <label
                                          className="form-control-label"
                                          htmlFor="input-property"
                                          style={detailstyle}
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
                                </div>
                                <div
                                  style={{ marginTop: "-60px" }}
                                  className="col-5 "
                                >
                                  {/* Right side with SmallSummaryCard components */}
                                  <Col>
                                    <Row>
                                      <Col>
                                        <SmallSummaryCard
                                          label="Status"
                                          value={outstandDetails.status || "N/A"}
                                        />
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col>
                                        <SmallSummaryCard
                                          label="Due Date"
                                          value={
                                            outstandDetails.due_date || "N/A"
                                          }
                                        />
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col>
                                        <SmallSummaryCard
                                          label="Assignees"
                                          value={
                                            outstandDetails.staffmember_name ||
                                            "N/A"
                                          }
                                        />
                                      </Col>
                                    </Row>
                                  </Col>
                                </div>
                              </div>
                            </Box>
                          </div>
                          <div className="tables col-4">
                            <Table
                              className="align-items-center table-flush"
                              responsive
                              style={{ border: "1px solid #ccc" }}
                            >
                              <thead
                                className="thead-light"
                                style={{
                                  borderBottom: "1px solid #ccc",
                                  borderColor: "#ccc",
                                }}
                              >
                                <tr>
                                  <th scope="col"style={detailstyle}>Details</th>
                                </tr>
                              </thead>

                              <tbody>
                                <tr>
                                  <td>
                                    <span style={detailstyle}>Property</span>{" "}
                                    <br />
                                    <span>
                                      {outstandDetails.rental_adress || "N/A"}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <span style={detailstyle}>Category</span>{" "}
                                    <br />
                                    <span>
                                      {outstandDetails.work_category || "N/A"}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <span style={detailstyle}>Vendor Notes</span>{" "}
                                    <br />
                                    <span>
                                      {outstandDetails.vendor_note || "N/A"}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <span style={detailstyle}>Vendor</span> <br />
                                    <span>
                                      {outstandDetails.vendor_name || "N/A"}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <span style={detailstyle}>Priority</span>{" "}
                                    <br />
                                    <span>
                                      {outstandDetails.priority || "N/A"}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <span style={detailstyle}>Entry Allowed</span>{" "}
                                    <br />
                                    <span>
                                      {outstandDetails.entry_allowed || "N/A"}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <span style={detailstyle}>
                                      Work Performed
                                    </span>{" "}
                                    <br />
                                    <span>
                                      {outstandDetails.work_performed || "N/A"}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <span style={detailstyle}>Work Assigned</span>{" "}
                                    <br />
                                    <span>
                                      {outstandDetails.staffmember_name || "N/A"}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </div>
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
