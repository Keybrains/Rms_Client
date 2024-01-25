import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "components/Headers/Header";
import Cookies from "universal-cookie";
import {
  Card,
  CardHeader,
  FormGroup,
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { jwtDecode } from "jwt-decode";
import { CardContent, Typography } from "@mui/material";
import { RotatingLines } from "react-loader-spinner";
import CreditCardForm from "./CreditCardForm";

const TenantDetailPage = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [loader, setLoader] = React.useState(true);
  const { tenantId, entryIndex } = useParams();
  const [tenantDetails, setTenantDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [GeneralLedgerData, setGeneralLedgerData] = useState([]);
  const [rental, setRental] = useState("");
  const [unit, setUnit] = useState("");
  const [unitId, setUnitId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);

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

  // const apiUrl = `${baseUrl}/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;
  // const getTenantData = async () => {
  //   try {
  //     const response = await axios.get(apiUrl);
  //     console.log(response.data.data, "huihui");
  //     const rental = response.data.data.entries.rental_adress;
  //     const unit = response.data.data.entries.rental_units;
  //     const unitId = response.data.data.entries.unit_id;
  //     const propertysId = response.data.data.entries.property_id;
  //     setTenantDetails(response.data.data);
  //     setRental(rental);
  //     setPropertyId(propertysId);
  //     setUnit(unit);
  //     setUnitId(unitId);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching tenant details:", error);
  //     setError(error);
  //     setLoading(false);
  //   }
  // };

  const getTenantData = async () => {
    try {
      const apiUrl = `${baseUrl}/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;
      const response = await axios.get(apiUrl);
      console.log(response.data.data, "huihyui");
      setTenantDetails(response.data.data);
      //console.log(response.data.data, "hiiii");
      const rental = response.data.data.entries.rental_adress;
      const unit = response.data.data.entries.rental_units;
      const unitId = response.data.data.entries.unit_id;
      const propertysId = response.data.data.entries.property_id;
      console.log(propertysId, "propertysId");

      setRental(rental);
      // setUnit(unit);
      // setUnitId(unitId);
      setPropertyId(propertysId);
      console.log(response.data.data.entries.rental_units, "res.daya dhstab");
      if (unitId && unit) {
        console.log("1");
        const url = `${baseUrl}/payment_charge/financial_unit?rental_adress=${rental}&property_id=${propertysId}&unit=${unit}&tenant_id=${tenantId}`;
        console.log(url, "huewfjnmk");
        axios
          .get(url)
          .then((response) => {
            setLoader(false);

            if (response.data && response.data.data) {
              const mergedData = response.data.data;
              console.log(mergedData, "mergedData1");

              setGeneralLedgerData(mergedData[0]?.unit[0]);
            } else {
              console.error("Unexpected response format:", response.data);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } else {
        console.log("2");

        const url = `${baseUrl}/payment_charge/financial?rental_adress=${rental}&property_id=${propertysId}&tenant_id=${tenantId}`;

        console.log(url, "huewfjnmk");

        axios
          .get(url)
          .then((response) => {
            setLoader(false);

            if (response.data && response.data.data) {
              const mergedData = response.data.data;
              console.log(mergedData, "mergedData2");

              setGeneralLedgerData(mergedData[0]?.unit[0]);
            } else {
              console.error("Unexpected response format:", response.data);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
      setUnitId(unitId);

      // setPropertyId(propertyId);

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

  useEffect(() => {
    getTenantData();
  }, [tenantId, entryIndex]);

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }

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
  const [balance, setBalance] = useState("");
  const getGeneralLedgerData = async () => {
    const apiUrl = `${baseUrl}/payment/merge_payment_charge/${tenantId}`;
    try {
      const response = await axios.get(apiUrl);
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

  const [myData, setMyData] = useState([]);

  const doSomething = async () => {
    let responce = await axios.get(`${baseUrl}/tenant/tenants`);
    const data = responce.data.data;
    const filteredData = data.filter((item) => item._id === tenantId);
    setMyData(filteredData);
  };

  useEffect(() => {
    doSomething();
  }, []);

  const [myData1, setMyData1] = useState([]);
  console.log("myData1:", myData1);
  const doSomething1 = async () => {
    try {
      let response = await axios.get(`${baseUrl}/tenant/tenants`);
      const data = response.data.data;

      const filteredData = data.filter((item, index) => {
        // Replace 'tenantId' with the specific ID you're looking for
        return item._id === tenantId && item.entries.entryIndex === entryIndex;
      });

      setMyData1(filteredData);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    doSomething1();
  }, []);

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

  //sahil20231206
  const getStatus1 = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today >= start && today <= end) {
      return "TENANT";
    } else if (today < start) {
      return "FUTURE TENANT";
    } else if (today > end) {
      return "PAST TENANT";
    } else {
      return "-";
    }
  };
  //sahil20231206
  // Filter the specific entry based on entryIndex from URL parameters
  const selectedEntry = myData.find(
    (item) => item.entries.entryIndex === entryIndex
  );
  // Check if the entry exists and then display the status
  const status = selectedEntry
    ? getStatus1(
        selectedEntry.entries.start_date,
        selectedEntry.entries.end_date
      )
    : "-";

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCardForm = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    getCreditCard()
  };

  const [cardDetalis, setCardDetails] = useState([]);
  const getCreditCard = async () => {
    const response = await axios.get(
      `https://propertymanager.cloudpress.host/api/creditcard/getCreditCard/${tenantId}`
    );
    setCardDetails(response.data);
    console.log(response, "yashu");
  };

  useEffect(() => {
    getCreditCard();
  }, [tenantId]);

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
                <h1 style={{ color: "white" }}>
                  {tenantDetails.tenant_firstName +
                    " " +
                    tenantDetails.tenant_lastName}
                </h1>
              )}
              <h5 style={{ color: "white" }}>
                {status} |{" "}
                {tenantDetails._id ? tenantDetails.entries.rental_adress : " "}
                {tenantDetails._id &&
                tenantDetails.entries.rental_units !== undefined &&
                tenantDetails.entries.rental_units !== ""
                  ? ` - ${tenantDetails.entries.rental_units}`
                  : ""}
              </h5>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/admin/TenantsTable")}
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
                <h3 className="mb-0">Summary</h3>
              </CardHeader>
              <div className="table-responsive">
                <div className="row m-3" style={{ overflow: "hidden" }}>
                  <div className="col-md-8">
                    <div
                      className="align-items-center table-flush"
                      responsive
                      style={{ width: "100%" }}
                    >
                      {loading ? (
                        <tbody className="d-flex flex-direction-column justify-content-center align-items-center">
                          <tr>
                            <div className="p-5 m-5">
                              <RotatingLines
                                strokeColor="grey"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="50"
                                visible={loader}
                              />
                            </div>
                          </tr>
                        </tbody>
                      ) : error ? (
                        <tbody>
                          <tr>
                            <td>Error: {error.message}</td>
                          </tr>
                        </tbody>
                      ) : tenantDetails._id ? (
                        <>
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
                              <Col>Contact Information</Col>
                            </Row>
                            <Row
                              className="w-100 mb-1"
                              style={{
                                fontSize: "10px",
                                textTransform: "uppercase",
                                color: "#aaa",
                              }}
                            >
                              <Col>Name</Col>
                              <Col>Phone</Col>
                              <Col>Email</Col>
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
                                {tenantDetails.tenant_firstName +
                                  " " +
                                  tenantDetails.tenant_lastName || "N/A"}
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
                                    className="bi bi-telephone-outbound"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5" />
                                  </svg>{" "}
                                  {tenantDetails.tenant_mobileNumber || "N/A"}
                                </a>
                              </Col>
                              <Col style={{ textTransform: "lowercase" }}>
                                <a
                                  href={`mailto:${tenantDetails.tenant_email}`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15"
                                    height="15"
                                    fill="currentColor"
                                    className="bi bi-envelope-paper"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M4 0a2 2 0 0 0-2 2v1.133l-.941.502A2 2 0 0 0 0 5.4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5.4a2 2 0 0 0-1.059-1.765L14 3.133V2a2 2 0 0 0-2-2zm10 4.267.470.25A1 1 0 0 1 15 5.4v.817l-1 .6zm-1 3.15-3.75 2.25L8 8.917l-1.25.75L3 7.417V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm-11-.6-1-.6V5.4a1 1 0 0 1 .53-.882L2 4.267zm13 .566v5.734l-4.778-2.867zm-.035 6.88A1 1 0 0 1 14 15H2a1 1 0 0 1-.965-.738L8 10.083zM1 13.116V7.383l4.778 2.867L1 13.117Z" />
                                  </svg>{" "}
                                  {tenantDetails.tenant_email || "N/A"}
                                </a>
                              </Col>
                            </Row>
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
                              <Col>Personal Information</Col>
                            </Row>
                            <Row
                              className="w-100 mb-1"
                              style={{
                                fontSize: "10px",
                                textTransform: "uppercase",
                                color: "#aaa",
                              }}
                            >
                              <Col>Birth Date</Col>
                              <Col>TaxPayer Id</Col>
                              <Col>Comments</Col>
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
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-calendar-event"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                </svg>{" "}
                                {formatDateWithoutTime(
                                  tenantDetails.birth_date
                                ) || "N/A"}
                              </Col>
                              <Col>{tenantDetails.textpayer_id || "N/A"}</Col>
                              <Col>{tenantDetails.comments || "N/A"}</Col>
                            </Row>
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
                              <Col>Emergency Contact</Col>
                            </Row>
                            <Row
                              className="w-100 mb-1"
                              style={{
                                fontSize: "10px",
                                textTransform: "uppercase",
                                color: "#aaa",
                              }}
                            >
                              <Col>Contact Name</Col>
                              <Col>Relation With Tenants</Col>
                              <Col>Emergency Email</Col>
                              <Col>Emergency PhoneNumber</Col>
                            </Row>
                            <Row
                              className="w-100 mt-1 mb-5"
                              style={{
                                fontSize: "12px",
                                textTransform: "capitalize",
                                color: "#000",
                              }}
                            >
                              <Col>{tenantDetails.contact_name || "N/A"}</Col>
                              <Col>
                                {tenantDetails.relationship_tenants || "N/A"}
                              </Col>
                              <Col style={{ textTransform: "lowercase" }}>
                                {tenantDetails.email || "N/A"}
                              </Col>
                              <Col>
                                {tenantDetails.emergency_PhoneNumber || "N/A"}
                              </Col>
                            </Row>
                          </div>
                        </>
                      ) : (
                        <tbody>
                          <tr>
                            <td>No tenant details found.</td>
                          </tr>
                        </tbody>
                      )}
                    </div>
                    <div className="row mt-3" style={{ overflow: "auto" }}>
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
                            {myData ? (
                              <>
                                {myData.map((item) => (
                                  <>
                                    <tr className="body">
                                      <td>
                                        {getStatus(
                                          item.entries.start_date,
                                          item.entries.end_date
                                        )}
                                      </td>
                                      <td>
                                        <Link
                                          to={`/admin/rentrolldetail/${item._id}/${item.entries.entryIndex}`}
                                          onClick={(e) => {
                                            console.log(item._id, "Tenant Id");
                                            console.log(
                                              item.entries.entryIndex,
                                              "Entry Index"
                                            );
                                          }}
                                        >
                                          {formatDateWithoutTime(
                                            item.entries.start_date
                                          ) +
                                            " To " +
                                            formatDateWithoutTime(
                                              item.entries.end_date
                                            ) || "N/A"}
                                        </Link>
                                      </td>
                                      <td>
                                        {item.entries.rental_adress || "N/A"}
                                      </td>
                                      <td>
                                        {item.entries.lease_type || "N/A"}
                                      </td>
                                      <td>{item.entries.amount}</td>
                                    </tr>
                                  </>
                                ))}
                              </>
                            ) : null}
                          </tbody>
                        </Table>
                      </Row>
                    </div>
                  </div>
                  <div className="col-md-4 mt-3">
                    {loading ? (
                      <tbody className="d-flex flex-direction-column justify-content-center align-items-center">
                        <tr></tr>
                      </tbody>
                    ) : (
                      <>
                        <Card
                          className="w-100"
                          style={{ background: "#F4F6FF" }}
                        >
                          <CardContent>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {myData1.map((item, index) => (
                                <div
                                  key={index}
                                  style={{ marginBottom: "10px" }}
                                >
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
                                    {getStatus(
                                      item.entries.start_date,
                                      item.entries.end_date
                                    )
                                      .charAt(0)
                                      .toUpperCase() +
                                      getStatus(
                                        item.entries.start_date,
                                        item.entries.end_date
                                      )
                                        .substring(1)
                                        .toLowerCase()}
                                  </Typography>

                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      // fontWeight: "bold",
                                      marginRight: "10px",
                                    }}
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {item.entries.rental_adress || "N/A"}
                                  </Typography>
                                </div>
                              ))}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {myData1.map((item, index) => (
                                <div key={index}>
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      fontWeight: "bold",
                                      fontFamily: "Arial",
                                      fontStyle: "italic",
                                      marginRight: "10px",
                                    }}
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {item.entries.lease_type || "N/A"}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      // fontWeight: "bold",
                                      marginRight: "10px",
                                    }}
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {formatDateWithoutTime(
                                      item.entries.start_date
                                    ) +
                                      " To " +
                                      formatDateWithoutTime(
                                        item.entries.end_date
                                      ) || "N/A"}
                                  </Typography>
                                </div>
                              ))}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: "5px",
                              }}
                            ></div>
                            <hr
                              style={{
                                marginTop: "2px",
                                marginBottom: "6px",
                              }}
                            />
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
                                {"$" + Math.abs(balance)}
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
                                    {myData1.map((item) => (
                                      <>
                                        <Typography
                                          sx={{
                                            fontSize: 14,
                                            fontWeight: "bold",
                                            marginRight: "10px",
                                          }}
                                          color="text.secondary"
                                          gutterBottom
                                        >
                                          ${item.entries.amount}
                                        </Typography>
                                      </>
                                    ))}
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
                                {myData1.map((item) => (
                                  <>
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                      }}
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      {item.entries.nextDue_date}
                                    </Typography>
                                  </>
                                ))}
                              </div>
                            </>
                            {/* )} */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginTop: "10px",
                              }}
                            >
                              <Button
                                color="primary"
                                ////  href="#rms"
                                onClick={() =>
                                  navigate(
                                    `/admin/AddPayment/${tenantId}/${entryIndex}`,
                                    {
                                      state: {
                                        unit_name: unit,
                                        unit_id: unitId,
                                        property_id: propertyId,
                                        rental_adress: rental,
                                      },
                                    }
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
                              {myData1.map((item) => (
                                <>
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
                                    <Link
                                      to={`/admin/rentrolldetail/${tenantId}/${entryIndex}?source=payment`}
                                      onClick={(e) => {}}
                                    >
                                      Lease Ledger
                                    </Link>
                                  </Typography>
                                </>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card
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
                                <tr>
                                  <th>Card Number</th>
                                  <th>expiration Date</th>
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
                                        {item.card_number.slice(0, 4) +
                                          "*".repeat(8) +
                                          item.card_number.slice(-4)}
                                      </Typography>
                                    </td>
                                    <td>
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          // fontWeight: "bold",
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
                        </Card>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Row>
        <br />
        <br />
        <Modal isOpen={isModalOpen} toggle={closeModal} style={{ maxWidth: '950px'}}>
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
      </Container>
    </div>
  );
};

export default TenantDetailPage;
