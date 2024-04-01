import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Box from "@mui/material/Box";
import profile from "../../assets/img/icons/common/profile1.svg";
import VendorHeader from "components/Headers/VendorHeader";
import {
  Card,
  CardHeader,
  FormGroup,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import {
  Grid,
} from "@mui/material";

import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
// import { Grid } from "react-loader-spinner";

const VendorWorkDetail = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageGetUrl = process.env.REACT_APP_IMAGE_GET_URL;
  const { workorder_id } = useParams();
  //console.log(id);
  const [outstandDetails, setoutstandDetails] = useState({});
  const [showTenantTable, setShowTenantTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [activeButton, setActiveButton] = useState("Summary");
  const [imagedetails, setImageDetails] = useState([]);
  const [updateButton, setUpdateButton] = useState(false);
  const [workOrderStatus, setWorkOrderStatus] = useState("");

  const handleUpdateButtonClick = () => {
    // Add any logic or state changes you need before opening the dialog
    setUpdateButton(true);
  };
  let navigate = useNavigate();
  const updateWorkorderFormik = useFormik({
    initialValues: {
      status: "",
      staffmember_name: "",
      date: "",
      staffmember_id: "",
      message: "",
      statusUpdatedBy: "",
    },
    onSubmit: (values) => {
      //console.log(values);
      // updateValues()
      // updateWorkorder(values);
    },
  });
  const getOutstandData = async () => {
    if (workorder_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/work-order/workorder_details/${workorder_id}`
        );
        setoutstandDetails(response?.data?.data);

        if (
          response?.data?.data?.workorder_updates &&
          response.data.data.workorder_updates.length > 0
        ) {
          const reversedUpdates = [
            ...response?.data?.data?.workorder_updates,
          ].reverse();

          const latestUpdate = reversedUpdates[0];

          setWorkOrderStatus(reversedUpdates);

          updateWorkorderFormik.setValues({
            status: response?.data?.data?.status,
            staffmember_name: latestUpdate?.staffmember_name,
            date: response?.data?.data?.date,
            assigned_to: response?.data?.data.staff_data?.staffmember_name,
            message: response?.data?.data?.message
              ? response?.data?.data?.message
              : "",
            statusUpdatedBy: latestUpdate?.statusUpdatedBy
              ? latestUpdate?.statusUpdatedBy
              : "Admin",
          });
        } else {
          console.log("No updates found in workorder_updates");
        }

        setLoading(false);
        setImageDetails(response?.data?.data?.workOrder_images);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
        setError(error);
        setLoading(false);
      }
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
  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
  React.useEffect(() => {
    getOutstandData();
  }, [workorder_id]);

  const [propertyDetails, setPropertyDetails] = useState({});
  const getPropertyData = async () => {
    // if (outstandDetails.rental_units === "") {
    //   try {
    //     const response = await axios.get(
    //       `${baseUrl}/propertyunit/property/${outstandDetails.rental_adress}`
    //     );
    //     setPropertyDetails(response.data[0]);
    //   } catch (error) {
    //     console.error("Error fetching tenant details:", error);
    //   }
    // } else if (outstandDetails.rental_adress && outstandDetails.rental_units) {
    //   try {
    //     const response = await axios.get(
    //       `${baseUrl}/propertyunit/property/${outstandDetails.rental_adress}/${outstandDetails.rental_units}`
    //     );
    //     setPropertyDetails(response.data[0]);
    //   } catch (error) {
    //     console.error("Error fetching tenant details:", error);
    //   }
    // }
  };

  React.useEffect(() => {
    getPropertyData();
  }, [outstandDetails]);

  const [tenantsDetails, setTenantsDetails] = useState();

  // const getTenantsData = async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}/tenant/findData`, {
  //       params: {
  //         rental_adress: propertyDetails?.rental_adress,
  //         rental_units: propertyDetails?.rental_units,
  //       },
  //     });
  //     response.data.map((data) => {
  //       data.entries.map((item) => {
  //         const currentDate = new Date();
  //         const sdate = new Date(item.start_date);
  //         const edate = new Date(item.end_date);

  //         // Compare the current date with start and end dates
  //         if (
  //           currentDate >= sdate &&
  //           currentDate < edate &&
  //           item.rental_adress === propertyDetails?.rental_adress &&
  //           item.rental_units === propertyDetails?.rental_units
  //         ) {
  //           // console.log('Response is OK');
  //           setTenantsDetails(data);
  //         }
  //       });
  //     });
  //   } catch (error) {
  //     console.error("Error fetching tenant details:", error);
  //     setError(error);
  //   }
  // };

  // React.useEffect(() => {
  //   getTenantsData();
  // }, [propertyDetails]);

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
    outstandDetails?.partsandcharge_data?.map((item) => {
      total = total + item.amount;
    });
    return total;
  };

  const detailstyle = {
    fontSize: "15px",
    color: "#525f7f",
    fontWeight: 600,
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

  return (
    <>
      <VendorHeader />
      {/* Page content */}
      <Container className="" fluid >
        <Row>
          <Col className="text-right">
            <Button
              // color="primary"
              className="mr-4"
              //  href="#rms"
              onClick={() => navigate("/vendor/vendorworktable")}
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
            {/* <Card className="" style={{backgroundColor:"transparent"}}> */}
            <CardHeader className=" border-0 d-flex justify-content-between align-items-center">
              <div>
                <ToggleButtonGroup
                  color="primary"
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
                      color:
                        activeButton === "Summary" ? "#152B51" : "inherit",
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
              </div>
              <div className="ml-auto ">
                {" "}
                <Button
                  color="primary"
                  //  href="#rms"
                  onClick={() =>
                    navigate(`/vendor/vendoraddwork/${workorder_id}`)
                  }
                  size="small"
                  style={{ background: "#152B51", color: "white" }}
                >
                  Add Details
                </Button>
              </div>
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
                      ) : outstandDetails?.workOrder_id ? (
                        <>
                          <Box
                            // border="1px solid #ccc"
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
                                {/* <AssignmentOutlinedIcon /> */}
                                <FormatListBulletedIcon />

                              </Box>
                              <Box flex="1">
                                <h2
                                  className="text-lg"
                                  style={{ color: "#152B51" }}
                                >
                                  {outstandDetails.work_subject || "N/A"}
                                </h2>
                                <span>
                                  {outstandDetails.property_data
                                    .rental_adress || "N/A"}
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

                              <Box flex="1" className="d-flex flex-column justify-content-end" >
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
                                      textTruncate
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
                                      textTruncate
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
                                        outstandDetails.staff_data
                                          .staffmember_name || "N/A"
                                      }
                                      textTruncate
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
                              }}
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
                                    width: "100%",
                                    borderCollapse: "collapse",
                                  }}
                                >
                                  <thead>
                                    <tr style={{
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
                                    {outstandDetails?.partsandcharge_data?.map(
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
                                    }}
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
                          // border="1px solid #ccc"
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
                                <span style={{
                                  fontWeight: "400",
                                  fontFamily: "Poppins",
                                  fontSize: "14px",
                                }}>
                                  {outstandDetails?.tenant_data
                                    .tenant_firstName ? (
                                    <>
                                      {
                                        outstandDetails?.tenant_data
                                          .tenant_firstName
                                      }{" "}
                                      {
                                        outstandDetails?.tenant_data
                                          .tenant_lastName
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
                      {outstandDetails ? (
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
                              <span
                                style={{ color: "#152B51", fontWeight: "500", fontFamily: "Poppins", fontSize: "16px", }}

                              >
                                Property
                              </span>
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
                                }}
                              >
                                <span style={{
                                  fontWeight: "400",
                                  fontFamily: "Poppins",
                                  fontSize: "14px",
                                }}>
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
                                  {outstandDetails.property_data
                                    ?.rental_city ? (
                                    <>
                                      {
                                        outstandDetails.property_data
                                          ?.rental_city
                                      }
                                      ,
                                    </>
                                  ) : (
                                    ""
                                  )}{" "}
                                  {outstandDetails.property_data
                                    ?.rental_state ? (
                                    <>
                                      {
                                        outstandDetails.property_data
                                          ?.rental_state
                                      }
                                      ,
                                    </>
                                  ) : (
                                    ""
                                  )}{" "}
                                  {outstandDetails.property_data
                                    ?.rental_country ? (
                                    <>
                                      {
                                        outstandDetails.property_data
                                          ?.rental_country
                                      }
                                      ,
                                    </>
                                  ) : (
                                    ""
                                  )}{" "}
                                  {outstandDetails.property_data
                                    ?.rental_postcode ? (
                                    <>
                                      {
                                        outstandDetails.property_data
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
                </div>
              )}

              {activeButton === "Task" && (
                <div className="container-fluid">
                  <Row className="mb-4">
                    <Col lg="8" md="12">
                      <Box
                        // border="1px solid #ccc"
                        border="0.5px solid #737791"
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
                          <Col lg="8">
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

                          <Col lg="4">
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
                                {outstandDetails.date || "N/A"}
                              </span>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg="8">
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
                                {outstandDetails.staff_data
                                  .staffmember_name || "N/A"}
                              </span>
                            </FormGroup>
                          </Col>
                          <Col lg="4">
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
                      {outstandDetails ? (
                        <>
                          <Box
                            // border="1px solid #ccc"
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
                              outstandDetails?.workOrder_images.length > 0 ? (
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
                                {outstandDetails?.workOrder_images.map(
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
                                }}
                              >
                                <span style={{ fontSize: "14px", fontFamily: "Poppins", fontWeight: "400" }}>
                                  {outstandDetails.property_data
                                    ?.rental_adress || "N/A"}{" "}
                                  ({outstandDetails.unit_data?.rental_unit})
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
                                  {outstandDetails.property_data
                                    ?.rental_city ? (
                                    <>
                                      {
                                        outstandDetails.property_data
                                          ?.rental_city
                                      }
                                      ,
                                    </>
                                  ) : (
                                    ""
                                  )}{" "}
                                  {outstandDetails.property_data
                                    ?.rental_state ? (
                                    <>
                                      {
                                        outstandDetails.property_data
                                          ?.rental_state
                                      }
                                      ,
                                    </>
                                  ) : (
                                    ""
                                  )}{" "}
                                  {outstandDetails.property_data
                                    ?.rental_country ? (
                                    <>
                                      {
                                        outstandDetails.property_data
                                          ?.rental_country
                                      }
                                      ,
                                    </>
                                  ) : (
                                    ""
                                  )}{" "}
                                  {outstandDetails.property_data
                                    ?.rental_postcode ? (
                                    <>
                                      {
                                        outstandDetails.property_data
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

export default VendorWorkDetail;
