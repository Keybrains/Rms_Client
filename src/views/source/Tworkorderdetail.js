import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import profile from "../../assets/img/icons/common/profile1.svg";
import TenantsHeader from "components/Headers/TenantsHeader";
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
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";

const TWorkOrderDetails = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageGetUrl = process.env.REACT_APP_IMAGE_GET_URL;
  const { id } = useParams();
  console.log(id);
  const [outstandDetails, setoutstandDetails] = useState({});
  const [showTenantTable, setShowTenantTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [updateButton, setUpdateButton] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [workOrderStatus, setWorkOrderStatus] = useState("");
  const [activeButton, setActiveButton] = useState("Summary");
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
      // setUser(jwt.userName);
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
    if (id) {
      try {
        const response = await axios.get(
          `${baseUrl}/work-order/workorder_details/${id}`
        );
        setoutstandDetails(response.data.data);
        setLoading(false);
        //setWorkOrderStatus(response.data.data.workorder_status.reverse());
        setImageDetails(response.data.data.workOrderImage);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
        setError(error);
        setLoading(false);
      }
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
  // React.useEffect(() => {
  //   getOutstandData();
  //   fetch(`${baseUrl}/addstaffmember/find_staffmember`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.statusCode === 200) {
  //         setstaffData(data.data);
  //       } else {
  //         // Handle error
  //         console.error("Error:", data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       // Handle network error
  //       console.error("Network error:", error);
  //     });
  // }, [id]);
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
        statusUpdatedBy:
          tenantsDetails.tenant_firstName +
          " " +
          tenantsDetails.tenant_lastName +
          "(Tenant)",
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
    outstandDetails?.partsandcharge_data?.map((item) => {
      total = total + item.amount;
    });
    return total;
  };

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
      <div className="small-summary-card p-3">
        {" "}
        {/* Added padding with the p-3 class */}
        <h6 className="text-uppercase text-muted mb-0" style={{ fontSize: "14px", fontFamily: "Poppins", fontWeight: "400" }}>{label}</h6>
        <span
          className={`font-weight-bold ${textTruncate ? "text-truncate" : ""}`}
          style={{ fontSize: "16px", fontFamily: "Poppins", fontWeight: "500", color: "#152B51" }}

        >
          {value}
        </span>
      </div>
    );
  };

  let cookie_id = localStorage.getItem("Tenant ID");
  const [tenantsDetails, setTenantsDetails] = useState();

  // const getTenantData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${baseUrl}/tenant/tenant/${cookie_id}/entries`
  //     );
  //     // console.log(response.data.data);
  //     setTenantsDetails(response.data.data[0]);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching tenant details:", error);
  //     setError(error);
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getTenantData();
  // }, [cookie_id]);

  const [propertyDetails, setPropertyDetails] = useState({});
  const getPropertyData = async () => {
    if (outstandDetails?.rental_unit === "") {
      try {
        const response = await axios.get(
          `${baseUrl}/propertyunit/property/${outstandDetails.rental_adress}`
        );
        setPropertyDetails(response.data[0]);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
      }
    } else if (outstandDetails.rental_adress && outstandDetails.rental_unit) {
      try {
        const response = await axios.get(
          `${baseUrl}/propertyunit/property/${outstandDetails.rental_adress}/${outstandDetails.rental_unit}`
        );
        setPropertyDetails(response.data[0]);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
      }
    }
  };

  React.useEffect(() => {
    // getPropertyData();
  }, [outstandDetails]);

  return (
    <>
      <TenantsHeader />
      {/* Page content */}
      <Container className="" fluid>
        <Row>
          <Col className="text-right mx-4">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/tenant/tenantwork")}
              size="small"
              style={{ background: "#152B51", color: "#fff" }}
            >
              Back
            </Button>
          </Col>
          <Col xs="12" lg="12" sm="6">
            <FormGroup className="">
              {/* <h1 style={{ color: "red" }}>Work Order Details</h1> */}
            </FormGroup>
            <CardHeader
              className=" mt-3 mx-4"
              style={{
                backgroundColor: "#152B51",
                borderRadius: "10px",
                boxShadow: " 0px 4px 4px 0px #00000040 ",
              }}
            >
              <h2
                className=""
                style={{
                  color: "#ffffff",
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  fontSize: "26px",
                }}
              >
                Work Order Details
              </h2>
            </CardHeader>
          </Col>

        </Row>
        <br />
        {/* Table */}
        <Row>
          <div className="col">
            {/* <Card className="shadow"> */}
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
                      fontSize: "18px",
                      fontFamily: "Poppins",
                      fontWeight: "600",
                      color: activeButton === "Summary" ? "#152B51" : "inherit",
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
                      fontSize: "18px",
                      fontFamily: "Poppins",
                      fontWeight: "600",
                      color: activeButton === "Task" ? "#152B51" : "inherit",
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
                  <div className="container-fluid">
                    <Row className="mb-4">
                      <Col lg="8" md="12">
                        {loading ? (
                          <div>Loading Work Order details...</div>
                        ) : error ? (
                          <div>Error: {error.message}</div>
                        ) : outstandDetails.workOrder_id ? (
                          <>
                            <Box
                              border="0.5px solid #737791"
                              borderRadius="10px"
                              padding="16px"
                              maxWidth="900px"
                              boxShadow=" 0px 4px 4px 0px #00000040"

                              margin="20px"
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                marginBottom="20px"
                              >
                                <Box
                                  width="40px"
                                  height="40px"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  backgroundColor="#152B51"
                                  borderRadius="8px"
                                  color="white"
                                  fontSize="24px"
                                  marginRight="16px"
                                >
                                  <FormatListBulletedIcon />

                                </Box>
                                <Box flex="1">
                                  <h2
                                    className="text text-lg"
                                    style={{ color: "#152B51" }}
                                  >
                                    {outstandDetails.work_subject || "N/A"}
                                  </h2>
                                  <span>
                                    {outstandDetails.property_data
                                      .rental_adress || "N/A"}{" "}
                                    {outstandDetails?.unit_data?.rental_unit
                                      ? " - " +
                                      outstandDetails?.unit_data?.rental_unit
                                      : null}
                                  </span>
                                </Box>
                              </Box>
                              <Box
                                display="flex"
                                flexDirection={{ xs: "column", md: "row" }}
                                alignItems="stretch"
                              >
                                {/* Left side */}
                                <Box
                                  flex="1"
                                  className={{ xs: "col-12", md: "col-7" }}
                                  marginBottom={{ xs: "20px", md: "0" }}
                                >
                                  <FormGroup marginBottom="20px" style={{ padding: "15px" }}>
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-property"
                                      style={{
                                        marginBottom: "10px",
                                        fontWeight: "500",
                                        fontFamily: "Poppins",
                                        fontSize: "16px",
                                        color: "#152B51",
                                      }}
                                    >
                                      Description
                                    </label>
                                    <span
                                      style={{
                                        fontWeight: "400",
                                        fontFamily: "Poppins",
                                        fontSize: "14px",
                                        display: "block",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {outstandDetails.work_performed || "N/A"}
                                    </span>
                                  </FormGroup>
                                  <FormGroup marginBottom="20px" style={{ padding: "15px" }}>
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-property"
                                      style={{
                                        marginBottom: "10px",
                                        fontWeight: "500",
                                        fontFamily: "Poppins",
                                        fontSize: "16px",
                                        color: "#152B51",
                                      }}
                                    >
                                      Permission to enter
                                    </label>
                                    <span
                                      style={{
                                        fontWeight: "400",
                                        fontFamily: "Poppins",
                                        fontSize: "14px",
                                        display: "block",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {outstandDetails?.entry_allowed
                                        ? "Yes"
                                        : "No"}
                                    </span>
                                  </FormGroup>
                                  <FormGroup marginBottom="20px" style={{ padding: "15px" }}>
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-property"
                                      style={{
                                        marginBottom: "10px",
                                        fontWeight: "500",
                                        fontFamily: "Poppins",
                                        fontSize: "16px",
                                        color: "#152B51",
                                      }}
                                    >
                                      Vendor Notes
                                    </label>
                                    <span
                                      style={{
                                        fontWeight: "400",
                                        fontFamily: "Poppins",
                                        fontSize: "14px",
                                        display: "block",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {outstandDetails.vendor_notes || "N/A"}
                                    </span>
                                  </FormGroup>
                                </Box>

                                {/* Right side */}

                                <Box flex="1" className="d-flex flex-column justify-content-end">
                                  <Row
                                    style={{
                                      border: "1px solid #ccc",
                                      borderRadius: "8px",
                                      margin: "15px auto",
                                      width: "60%",
                                    }}
                                  >
                                    <Col style={{ padding: "0 8px" }}>
                                      <SmallSummaryCard
                                        label="Status"
                                        value={outstandDetails.status || "N/A"}
                                        textTruncate // add this prop to enable text truncation
                                      />
                                    </Col>
                                  </Row>
                                  <Row
                                    style={{
                                      border: "1px solid #ccc",
                                      borderRadius: "8px",
                                      margin: "15px auto",
                                      width: "60%",
                                    }}
                                  >
                                    <Col style={{ padding: "0 8px" }}>
                                      <SmallSummaryCard
                                        label="Due Date"
                                        value={outstandDetails.date || "N/A"}
                                        textTruncate // add this prop to enable text truncation
                                      />
                                    </Col>
                                  </Row>
                                  <Row
                                    style={{
                                      border: "1px solid #ccc",
                                      borderRadius: "8px",
                                      margin: "15px auto",
                                      width: "60%",
                                    }}
                                  >
                                    <Col style={{ padding: "0 8px" }}>
                                      <SmallSummaryCard
                                        label="Assignees"
                                        value={
                                          outstandDetails?.staff_data
                                            ?.staffmember_name || "N/A"
                                        }
                                        textTruncate // add this prop to enable text truncation
                                      />
                                    </Col>
                                  </Row>
                                </Box>
                              </Box>
                            </Box>
                            {outstandDetails?.partsandcharge_data?.length > 0 &&
                              outstandDetails?.partsandcharge_data ? (
                              <Box
                                // border="1px solid #ccc"
                                border="0.5px solid #737791"
                                borderRadius="10px"
                                padding="16px"
                                maxWidth="900px"
                                boxShadow=" 0px 4px 4px 0px #00000040"

                                margin="20px"
                                style={{
                                  marginRight: "auto",
                                  overflowX: "auto",
                                }} // Center the box horizontally
                              >
                                <h2
                                  className="text text-lg"
                                  style={{ color: "#152B51", fontWeight: "500", fontFamily: "Poppins", fontSize: "16px", }}

                                >
                                  Parts and Labor
                                </h2>
                                <Box overflowX="auto">
                                  <table
                                    style={{
                                      fontWeight: "500",
                                      width: "100%",
                                      fontFamily: "Poppins",
                                      borderCollapse: "collapse",

                                      fontSize: "14px", color: "#152B51"
                                    }}
                                  >
                                    <thead>
                                      <tr
                                        style={{
                                          fontWeight: "500",
                                          fontFamily: "Poppins",
                                          fontSize: "14px", color: "#152B51"
                                        }}>
                                        <th style={tableHeaderStyle}>QTY</th>
                                        <th style={tableHeaderStyle}>
                                          ACCOUNT
                                        </th>
                                        <th style={tableHeaderStyle}>
                                          DESCRIPTION
                                        </th>
                                        <th style={tableHeaderStyle}>PRICE</th>
                                        <th style={tableHeaderStyle}>AMOUNT</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* Add your table rows dynamically here */}
                                      {outstandDetails?.partsandcharge_data.map(
                                        (item, index) => (
                                          <tr key={index}>
                                            <td style={tableCellStyle}>
                                              {item.parts_quantity}
                                            </td>
                                            <td style={tableCellStyle}>
                                              {item.account}
                                            </td>
                                            <td style={tableCellStyle}>
                                              {item.description}
                                            </td>
                                            <td
                                              style={{
                                                ...tableCellStyle,
                                                textAlign: "right",
                                              }}
                                            >
                                              ${item.parts_price}
                                            </td>
                                            <td
                                              style={{
                                                ...tableCellStyle,
                                                textAlign: "right",
                                              }}
                                            >
                                              ${item.amount}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                    <tfoot>
                                      <tr>
                                        <td
                                          colSpan="4"
                                          style={{
                                            ...tableFooterStyle,
                                            fontWeight: "400",
                                            fontFamily: "Poppins",
                                            fontSize: "14px", color: "#152B51"
                                          }}
                                        >
                                          Total
                                        </td>
                                        <td
                                          style={{
                                            ...tableFooterStyle,
                                            textAlign: "right",
                                            fontWeight: "400",
                                            fontFamily: "Poppins",
                                            fontSize: "14px", color: "#152B51"
                                          }}
                                        >
                                          ${total()}
                                        </td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </Box>
                              </Box>
                            ) : null}
                            <Grid
                              container
                              // border="1px solid #ccc"
                              border="0.5px solid #737791"
                              borderRadius="10px"
                              padding="16px"
                              maxWidth="900px"
                              boxShadow=" 0px 4px 4px 0px #00000040"
                              margin="20px"
                              style={{
                                marginRight: "auto",
                                overflowX: "auto",
                              }}
                            >
                              <Grid item xs={3} sm={3.5} md={3} lg={2} xl={2}>
                                <h2
                                  className="text-lg"
                                  style={{ color: "#152B51", fontWeight: "500", fontFamily: "Poppins", fontSize: "16px", }}

                                >
                                  Updates
                                </h2>
                              </Grid>
                              <Grid item xs={3} sm={3.5} md={3} lg={2} xl={2}>
                                <Button

                                  size="small"
                                  onClick={handleUpdateButtonClick}
                                  style={{ color: "#C2C3CF", boxShadow: "0px 4px 4px 0px #00000040", backgroundColor: "transparent", }}
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
                                          {item.statusUpdatedBy}{" "}
                                          {item.createdAt
                                            ? "Created this work order"
                                            : "Updated this work order"}
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

                                      {console.log(item, "item")}
                                      <Grid container>
                                        {!Object.keys(item).includes(
                                          "status"
                                        ) ||
                                          Object.keys(item).includes(
                                            "due_date"
                                          ) ||
                                          item.status !== (" " || "") ||
                                          item.due_date !== (" " || "") ||
                                          item.staffmember_name !==
                                          (" " || "") ? (
                                          <>
                                            <Grid
                                              item
                                              xs={4}
                                              style={
                                                !Object.keys(item).includes(
                                                  "status"
                                                ) ||
                                                  item.status === (" " || null)
                                                  ? { display: "none" }
                                                  : { display: "block" }
                                              }
                                            >
                                              Status: {item.status}
                                            </Grid>
                                            <Grid
                                              itemx
                                              xs={4}
                                              style={
                                                !Object.keys(item).includes(
                                                  "due_date"
                                                ) ||
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
                                              style={{
                                                display:
                                                  item.staffmember_name &&
                                                    item.staffmember_name.trim() !==
                                                    ""
                                                    ? "block"
                                                    : "none",
                                              }}
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
                        {outstandDetails?.workOrder_id ? (
                          <Box
                            border="0.5px solid #737791"
                            borderRadius="10px"
                            boxShadow=" 0px 4px 4px 0px #00000040"
                            maxWidth="100%"
                            margin="20px"
                          >
                            <Box
                              className="align-item-center text-center"
                              borderBottom="1px solid #ccc"
                              style={{
                                width: "100%",
                                padding: "16px",
                                textAlign: "left",
                                boxShadow: " 0px 4px 4px 0px #00000040",
                                color: "#5e72e4",
                              }}
                            >
                              <span
                                style={{ color: "#152B51", fontWeight: "500", fontFamily: "Poppins", fontSize: "16px", }}

                              >
                                Contacts
                              </span>
                            </Box>
                            <Box
                              borderBottom="1px solid #ccc"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                minWidth: "100%",
                                padding: "16px 16px 5px 16px",
                              }}
                            >
                              <Box width="16px" marginRight="10px">
                                {/* SVG icon */}
                                <img src={profile} height={20} width={20} />

                              </Box>
                              <Box
                                width="100%"
                                style={{ minWidth: "100%", padding: "0 16px" }}
                              >
                                <span style={{ color: "#152B51", fontWeight: "500", fontFamily: "Poppins", fontSize: "16px", }}
                                >Vendor</span> <br />
                                <span style={{
                                  fontWeight: "400",
                                  fontFamily: "Poppins",
                                  fontSize: "14px",
                                }}>
                                  {outstandDetails?.vendor_data.vendor_name ||
                                    "N/A"}
                                </span>
                              </Box>
                            </Box>
                            {outstandDetails?.tenant_data &&
                              typeof outstandDetails?.tenant_data === "object" ? (
                              <Box
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  minWidth: "100%",
                                  padding: "16px 16px 5px 16px",
                                }}
                              >
                                <Box width="16px" marginRight="10px">
                                  <img src={profile} height={20} width={20} />

                                </Box>
                                <Box
                                  width="100%"
                                  style={{
                                    minWidth: "100%",
                                    padding: "0 16px",
                                  }}
                                >
                                  <span style={{ color: "#152B51", fontWeight: "500", fontFamily: "Poppins", fontSize: "16px", }}
                                  >Tenant</span> <br />
                                  <span
                                    style={{
                                      fontWeight: "400",
                                      fontFamily: "Poppins",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {outstandDetails?.tenant_data
                                      ?.tenant_firstName ? (
                                      <>
                                        {
                                          outstandDetails?.tenant_data
                                            ?.tenant_firstName
                                        }{" "}
                                        {
                                          outstandDetails?.tenant_data
                                            ?.tenant_lastName
                                        }
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                </Box>
                              </Box>
                            ) : null}
                          </Box>
                        ) : null}
                        {outstandDetails?.property_data ? (
                          <>
                            <Box
                              // border="1px solid #ccc"
                              border="0.5px solid #737791"
                              borderRadius="10px"
                              maxWidth="100%"
                              margin="20px"
                              display="flex"
                              boxShadow=" 0px 4px 4px 0px #00000040"
                              flexDirection="column"
                              alignItems="center"
                            >
                              <Box
                                className="align-item-center text-center"

                                borderBottom="1px solid #ccc"
                                style={{
                                  width: "100%",
                                  padding: "16px",
                                  textAlign: "left",
                                  boxShadow: " 0px 4px 4px 0px #00000040",
                                  color: "#5e72e4",
                                }}
                              >
                                <h2
                                  className="text"
                                  style={{ color: "#152B51", fontWeight: "500", fontFamily: "Poppins", fontSize: "16px", }}

                                >
                                  Property
                                </h2>
                              </Box>
                              {outstandDetails?.property_data?.rental_image ? (
                                <Box
                                  style={{
                                    width: "100%",
                                    padding: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Box
                                    width="100%"
                                    style={{
                                      minWidth: "100%",
                                      textAlign: "center",
                                    }}
                                  >
                                    <img
                                      src={`${imageGetUrl}/${outstandDetails?.property_data.rental_image}`}
                                      alt="property"
                                      style={{
                                        maxWidth: "80%",
                                        maxHeight: "100%",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                      }}
                                    />
                                  </Box>
                                </Box>
                              ) : null}
                              <Box
                                style={{
                                  width: "100%",
                                  padding: "5px 16px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  width="100%"
                                  style={{
                                    minWidth: "100%",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    color: "blue",
                                  }}
                                  onClick={() =>
                                    navigate(
                                      `/tenant/tenantpropertydetail/${outstandDetails?.property_data.rental_adress}`
                                    )
                                  }
                                >
                                  <span>
                                    {outstandDetails?.property_data
                                      ?.rental_adress || "N/A"}
                                    {outstandDetails?.unit_data?.rental_unit ? (
                                      " (" +
                                      outstandDetails?.unit_data?.rental_unit +
                                      ")"
                                    ) : (
                                      <></>
                                    )}
                                  </span>
                                </Box>
                              </Box>
                              <Box
                                style={{
                                  width: "100%",
                                  padding: "5px 16px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  width="100%"
                                  style={{
                                    minWidth: "100%",
                                    textAlign: "center",
                                  }}
                                >
                                  <span>
                                    {outstandDetails?.property_data
                                      ?.rental_city ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_city
                                        }
                                        ,
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                    {outstandDetails?.property_data
                                      ?.rental_state ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_state
                                        }
                                        ,
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                  </span>
                                  <span>
                                    {outstandDetails?.property_data
                                      ?.rental_country ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_country
                                        }
                                        ,
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                    {outstandDetails?.property_data
                                      ?.rental_postcode ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_postcode
                                        }
                                        .
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                </Box>
                              </Box>
                            </Box>
                          </>
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                    {updateButton && (
                      <Form onSubmit={updateWorkorderFormik.handleSubmit}>
                        <Dialog open={openDialog} onClose={handleDialogClose}>
                          <DialogTitle style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: "26px", color: "#152B51" }}>Update Dialog</DialogTitle>
                          <DialogContent>
                            <Grid container spacing={2}>
                              <Grid item xs={4}>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-desg"
                                    style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: "16px", color: "#8A95A8" }}
                                  >
                                    Status *
                                  </label>
                                  <FormGroup>
                                    <Dropdown
                                      isOpen={statusdropdownOpen}
                                      toggle={toggle6}
                                    >
                                      <DropdownToggle caret
                                        style={{
                                          boxShadow: " 0px 4px 4px 0px #00000040",
                                          border: "1px solid #ced4da",
                                          backgroundColor: "transparent",
                                          color: "#C2C3CF"
                                        }}
                                      >
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
                                    style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: "16px", color: "#8A95A8" }}

                                  >
                                    Due Date
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    style={{
                                      boxShadow: " 0px 4px 4px 0px #00000040",
                                    }}
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
                                    style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: "16px", color: "#8A95A8" }}

                                  >
                                    Assigned To *
                                  </label>
                                  <FormGroup>
                                    <Dropdown
                                      isOpen={userdropdownOpen}
                                      toggle={toggle5}
                                    >
                                      <DropdownToggle caret style={{
                                        boxShadow: " 0px 4px 4px 0px #00000040",
                                        border: "1px solid #ced4da",
                                        backgroundColor: "transparent",
                                        color: "#C2C3CF"
                                      }}>
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
                                    style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: "16px", color: "#8A95A8" }}

                                  >
                                    Message
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    style={{
                                      boxShadow: " 0px 4px 4px 0px #00000040"

                                    }}
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
                          <DialogActions className="d-flex justify-content-start mx-3 mb-3">
                            <Button size="small" style={{ color: "white", backgroundColor: "#152B51" }} onClick={updateValues}>
                              Save
                            </Button>
                            <Button onClick={handleDialogClose} style={{ color: "#152B51", backgroundColor: "transparent" }}>
                              Cancel
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Form>
                    )}
                  </div>
                )}

                {activeButton === "Task" && (
                  <div className="container-fluid">
                    <Row className="mb-4">
                      <Col lg="8" md="12">
                        <Box
                          border="0.5px solid #737791"
                          // border="1px solid #ccc"
                          borderRadius="10px"
                          padding="16px"
                          maxWidth="900px"
                          margin={"20px"}
                          boxShadow=" 0px 4px 4px 0px #00000040"

                        >
                          <Row style={{ justifyContent: "space-between" }}>
                            <Col lg="8" className="d-flex" style={{ alignItems: "center" }}>
                              <Box
                                width="40px"
                                height="40px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                backgroundColor="#152B51"
                                borderRadius="8px"
                                color="white"
                                fontSize="24px"

                              >

                                <FormatListBulletedIcon />

                              </Box>
                              <Col>
                                <h2
                                  className=""
                                  style={{ color: "#152B51", marginBottom: 0, fontFamily: "poppins" }}
                                >
                                  {outstandDetails?.work_subject || "N/A"}
                                </h2>

                                <span className="my-o" style={{ fontSize: "14px", fontFamily: "Poppins", fontWeight: "400" }}>
                                  {outstandDetails.property_data?.rental_adress ||
                                    "N/A"}
                                  {outstandDetails?.unit_data?.rental_unit ? (
                                    " (" +
                                    outstandDetails?.unit_data?.rental_unit +
                                    ")"
                                  ) : (
                                    <></>
                                  )}
                                </span>

                              </Col>
                            </Col>
                            <Col lg="2" className="text-end">
                              <span
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
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
                                    borderRadius: "8px",
                                    padding: "4px",
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
                                  &nbsp;{outstandDetails?.priority}&nbsp;
                                </span>
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
                                  style={{ fontSize: "16px", fontFamily: "Poppins", fontWeight: "500", color: "#152B51" }}

                                >
                                  Description
                                </label>
                                <br />
                                <span style={{ fontSize: "14px", fontFamily: "Poppins", fontWeight: "400" }}>

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
                                  style={{ fontSize: "16px", fontFamily: "Poppins", fontWeight: "500", color: "#152B51" }}

                                >
                                  Status
                                </label>
                                <br />
                                <span style={{ fontSize: "14px", fontFamily: "Poppins", fontWeight: "400" }}>

                                  {outstandDetails.status || "N/A"}
                                </span>
                              </FormGroup>
                            </Col>

                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                  style={{ fontSize: "16px", fontFamily: "Poppins", fontWeight: "500", color: "#152B51" }}

                                >
                                  Due Date
                                </label>
                                <br />
                                <span style={{ fontSize: "14px", fontFamily: "Poppins", fontWeight: "400" }}>

                                  {formatDateWithoutTime(
                                    outstandDetails.date || "N/A"
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
                                  style={{ fontSize: "16px", fontFamily: "Poppins", fontWeight: "500", color: "#152B51" }}

                                >
                                  Assignees
                                </label>
                                <br />
                                <span style={{ fontSize: "14px", fontFamily: "Poppins", fontWeight: "400" }}>

                                  {outstandDetails?.staff_data
                                    ?.staffmember_name || "N/A"}
                                </span>
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                  style={{ fontSize: "16px", fontFamily: "Poppins", fontWeight: "500", color: "#152B51" }}

                                >
                                  Permission to enter
                                </label>
                                <br />
                                <span style={{ fontSize: "14px", fontFamily: "Poppins", fontWeight: "400" }}>

                                  {outstandDetails?.entry_allowed
                                    ? "Yes"
                                    : "No"}
                                </span>
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

                        {outstandDetails ? (
                          <>
                            <Box
                              border="0.5px solid #737791"
                              borderRadius="10px"
                              maxWidth="100%"
                              margin="20px"
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              boxShadow=" 0px 4px 4px 0px #00000040"
                            >
                              <Box
                                className="align-item-center text-center"
                                borderBottom="1px solid #ccc"
                                style={{
                                  width: "100%",
                                  padding: "10px",
                                  textAlign: "left",
                                  color: "#152B51",
                                  boxShadow: "0px 4px 4px 0px #00000040",
                                  marginBottom: "10px"
                                }}
                              >
                                <span
                                  style={{ color: "#152B51", fontWeight: "500", fontFamily: "Poppins", fontSize: "16px", }}

                                >
                                  Images
                                </span>
                              </Box>

                              {outstandDetails?.workOrder_images &&
                                outstandDetails?.workOrder_images?.length > 0 ? (
                                <Box
                                  style={{
                                    width: "100%",
                                    padding: "16px",
                                    marginTop: "10px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    fontFamily: "poppins",

                                  }}
                                >
                                  {outstandDetails?.workOrder_images?.map(
                                    (imageUrl, index) => (
                                      <Box
                                        key={index}
                                        width="48%"
                                        style={{
                                          minWidth: "48%",
                                          margin: "1%",
                                        }}
                                      >
                                        <img
                                          src={`${imageGetUrl}/${imageUrl}`}
                                          alt={`property ${index}`}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "8px",
                                            border: "1px solid #ccc",
                                          }}
                                        />
                                      </Box>
                                    )
                                  )}
                                </Box>
                              ) : (
                                <div className="mt-3">
                                  No Images Attached
                                </div>
                              )}
                              <br />
                              <Box
                                style={{
                                  width: "100%",
                                  padding: "5px 16px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  width="100%"
                                  style={{
                                    minWidth: "100%",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    color: "blue",
                                  }}
                                  onClick={() =>
                                    navigate(
                                      `/tenant/tenantpropertydetail/${propertyDetails.rental_adress}`
                                    )
                                  }
                                >
                                  <span style={{ fontSize: "14px", fontFamily: "Poppins", fontWeight: "400" }}>

                                    {outstandDetails?.property_data
                                      ?.rental_adress || "N/A"}{" "}
                                    (
                                    {outstandDetails?.unit_data?.rental_unit
                                      ? outstandDetails?.unit_data?.rental_unit
                                      : "N/A"}
                                    )
                                  </span>
                                </Box>
                              </Box>
                              <Box
                                style={{
                                  width: "100%",
                                  padding: "5px 16px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  width="100%"
                                  style={{
                                    minWidth: "100%",
                                    textAlign: "center",
                                  }}
                                >
                                  <span style={{ fontSize: "14px", fontFamily: "Poppins", fontWeight: "400" }}>

                                    {outstandDetails?.property_data
                                      ?.rental_city ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_city
                                        }
                                        ,
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                    {outstandDetails?.property_data
                                      ?.rental_state ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_state
                                        }
                                        ,
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                    {outstandDetails?.property_data
                                      ?.rental_country ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_country
                                        }
                                        ,
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                    {outstandDetails?.property_data
                                      ?.rental_postcode ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_postcode
                                        }
                                        .
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </span>
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
              </div>
              <br />
            {/* </Card> */}
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default TWorkOrderDetails;
