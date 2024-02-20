import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Chart from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import classnames from "classnames";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import TenantsHeader from "components/Headers/TenantsHeader";

const TenantDashBoard = (props) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  let navigate = useNavigate();
  
  const [accessType, setAccessType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }
const[propertycount,setpropertycount] = useState()
  const fetchPropertyCount = async () => {
    try {
      const res = await axios.get(`${baseUrl}/tenants/property_count/${accessType.tenant_id}`);
      console.log(res.data.data, "khushi");
      setpropertycount(res.data.data)
    } catch (error) {
      console.error("Error: ", error.message);
    }
  }

  useEffect(() => {
    fetchPropertyCount();
  }, [accessType])

  const toggleNavs = (e, index) => {
    // e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  const bgStyle = {
    backgroundColor: "#E4E6E7",
    paddingLeft: "10px",
    // width:"300px"
  };
  const spStyle = {
    color: "red",
    // width:"300px"
  };
  const [showMoreNewOrders, setShowMoreNewOrders] = useState(false);
  const [showMoreOverdueOrders, setShowMoreOverdueOrders] = useState(false);
  const handleViewMoreNewOrders = () => {
    setShowMoreNewOrders(!showMoreNewOrders);
  };
  const handleViewMoreOverdueOrders = () => {
    setShowMoreOverdueOrders(!showMoreOverdueOrders);
  };

  const cardStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "70vh",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
    fontSize: "35px",
    color: "black",
  };
  const subcardStyle = {
    backgroundColor: "#263238",
    border: "none",
    minHeight: "25vh",
    color: "#eceff1",
    fontSize: "25px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.10)",
  };
  const subbcardStyle = {
    backgroundColor: "#cfd8dc",
    border: "none",
    minHeight: "25vh",
    color: "#263238",
    fontSize: "25px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.10)",
  };

  return (
    <>
      <TenantsHeader />
      
      <Container className="mt--7" fluid>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody style={cardStyle}>
                <div style={{ textAlign: "center" }}>
                  Welcome to 302 Properties
                </div>
                <Row style={{ padding:"15px"}}>
                  <Col lg="4" sm="12" className="mb-3">
                    <Card style={subcardStyle}>
                    
                      <CardBody className="d-flex flex-column justify-content-center  text-center">
                        <div className="d-flex align-items-center flex-column p-3">
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              color: "#cfd8dc",
                              width: "70px",
                              height: "70px",
                              fontSize: "30px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(125deg, #ffff 5%,#263238,#263238)",
                            }}
                          >
                            <i className="ni ni-pin-3"></i>
                          </div>
                          <div style={{ color: "cfd8dc", fontSize: "20px" }}>
                            Properties
                          </div>
                        </div>
                        <div
                          style={{
                            color: "cfd8dc",
                            fontSize: "22px",
                            fontWeight: "bold",
                          }}
                        >
                         {/* 8 */}
                         {propertycount}
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg="4" className="mb-3">
                    <Card style={subbcardStyle}>
                      <CardBody className="d-flex flex-column justify-content-center  text-center">
                        <div className="d-flex align-items-center flex-column p-3">
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              color: "#263238",
                              width: "70px",
                              height: "70px",
                              fontSize: "30px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(125deg, #fff 10%, #cfd8dc, #cfd8dc)",
                            }}
                          >
                            <i className="ni ni-badge"></i>
                          </div>
                          <div style={{ color: "#263238", fontSize: "20px" }}>
                            Work Orders
                          </div>
                        </div>
                        <div
                          style={{
                            color: "#263238",
                            fontSize: "22px",
                            fontWeight: "bold",
                          }}
                        >
                          8
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg="4" style={{ }}>
                    <Card style={subcardStyle}>
                      <CardBody className="d-flex flex-column justify-content-center  text-center">
                        <div className="d-flex align-items-center flex-column p-3">
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              color: "#cfd8dc",
                              width: "70px",
                              height: "70px",
                              fontSize: "30px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(125deg, #ffff 5%,#263238,#263238)",
                            }}
                          >
                            <i className="ni ni-money-coins"></i>
                          </div>
                          <div style={{ color: "cfd8dc", fontSize: "20px" }}>
                            Balance
                          </div>
                        </div>
                        <div
                          style={{
                            color: "cfd8dc",
                            fontSize: "22px",
                            fontWeight: "bold",
                          }}
                        >
                          8
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Row lg="12" className="d-flex justify-content-around">
                  <Col lg="6" md="12" sm="12" className="mb-3">
                    <Card
                      style={{
                        justifyContent: "center",
                        fontFamily: "sans-serif",
                        fontSize: "20px",
                        color: "black",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 1)", // Your desired box shadow
                        // border:"0.5px solid black"
                      }}
                    >
                      <Col>
                      <CardBody>
                        <div className="mb-2 d-flex justify-content-start">
                          <span
                            style={{ fontWeight: "bold", fontSize: "28px" }}
                          >
                            {" "}
                            New Work Orders
                          </span>
                        </div>
                        <div className="col-lg-6">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="">Total - 7</span>
                          </div>
                        </div>
                        <div style={bgStyle} className="leackage">
                          <div className="d-flex justify-content-start">
                            <span className="">Leakage in bathroom</span>{" "}
                          </div>
                          <div
                            className="col-lg-10"
                            style={{ fontSize: "14px" }}
                          >
                            <label className="d-flex justify-content-between mb-1 leackage-status">
                              <span>13/01/2024</span>
                              <span>New</span>
                            </label>
                          </div>
                        </div>
                        <div style={bgStyle}>
                          <div className="d-flex justify-content-start">
                            <span className="">Leakage in bathroom</span>{" "}
                          </div>
                          <div
                            className="col-lg-10"
                            style={{ fontSize: "14px" }}
                          >
                            <label className="d-flex justify-content-between mb-1 leackage-status">
                              <span>13/01/2024</span>
                              <span>New</span>
                            </label>
                          </div>
                        </div>
                        <div style={bgStyle}>
                          <div className="d-flex justify-content-start">
                            <span className="">Leakage in bathroom</span>{" "}
                          </div>
                          <div
                            className="col-lg-10"
                            style={{ fontSize: "14px" }}
                          >
                            <label className="d-flex justify-content-between mb-1 leackage-status">
                              <span>13/01/2024</span>
                              <span>New</span>
                            </label>
                          </div>
                        </div>{" "}
                        {showMoreNewOrders && (
                          <>
                            <div style={bgStyle}>
                              <div className="d-flex justify-content-start">
                                <span className="">Leakage in bathroom</span>{" "}
                              </div>
                              <div
                                className="col-lg-10"
                                style={{ fontSize: "14px" }}
                              >
                                <label className="d-flex justify-content-between mb-1 leackage-status">
                                  <span>13/01/2024</span>
                                  <span>New</span>
                                </label>
                              </div>
                            </div>{" "}
                            <div style={bgStyle}>
                              <div className="d-flex justify-content-start">
                                <span className="">Leakage in bathroom</span>{" "}
                              </div>
                              <div
                                className="col-lg-10"
                                style={{ fontSize: "14px" }}
                              >
                                <label className="d-flex justify-content-between mb-1 leackage-status">
                                  <span>13/01/2024</span>
                                  <span>New</span>
                                </label>
                              </div>
                            </div>
                          </>
                        )}
                        <label
                          className="d-flex justify-content-start"
                          style={{ cursor: "pointer", color: "blue" }}
                          onClick={handleViewMoreNewOrders}
                        >
                          {showMoreNewOrders ? "View Less" : "View All"}
                        </label>
                      </CardBody>

                      </Col>
                    </Card>
                  </Col>{" "}
                  <Col lg="6" md="12" sm="12" className="mb-3">
                    <Card
                      style={{
                        justifyContent: "center",
                        fontFamily: "sans-serif",
                        fontSize: "20px",
                        color: "black",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 1)",
                      }}
                    >
                      <CardBody>
                        <div className="mb-2 d-flex justify-content-start">
                          <span
                            style={{ fontWeight: "bold", fontSize: "28px" }}
                          >
                            {" "}
                            Overdue Work Orders
                          </span>
                        </div>
                        <div className="col-lg-6">
                          <div className="d-flex justify-content-between mb-2 ">
                            <span className="">Total - 5</span>
                          </div>
                        </div>
                        <div style={bgStyle} className="leackage">
                          <div className="d-flex justify-content-start">
                            <span className="">Leakage in bathroom</span>{" "}
                          </div>
                          <div
                            className="col-lg-10"
                            style={{ fontSize: "14px" }}
                          >
                            <label
                              style={spStyle}
                              className="d-flex justify-content-between mb-1 leackage-status"
                            >
                              <span>30/01/2024</span>
                              <span>In progress</span>
                            </label>
                          </div>
                        </div>
                        <div style={bgStyle}>
                          <div className="d-flex justify-content-start">
                            <span className="">Leakage in bathroom</span>{" "}
                          </div>
                          <div
                            className="col-lg-10"
                            style={{ fontSize: "14px" }}
                          >
                            <label
                              style={spStyle}
                              className="d-flex justify-content-between mb-1 leackage-status"
                            >
                              <span>30/01/2024</span>
                              <span>In progress</span>{" "}
                            </label>
                          </div>
                        </div>
                        <div style={bgStyle}>
                          <div className="d-flex justify-content-start">
                            <span className="">Leakage in bathroom</span>{" "}
                          </div>
                          <div
                            className="col-lg-10"
                            style={{ fontSize: "14px" }}
                          >
                            <label
                              style={spStyle}
                              className="d-flex justify-content-between mb-1 leackage-status"
                            >
                              <span>30/01/2024</span>
                              <span>In progress</span>{" "}
                            </label>
                          </div>
                        </div>{" "}
                        {showMoreOverdueOrders && (
                          <>
                            <div style={bgStyle}>
                              <div className="d-flex justify-content-start">
                                <span className="">Leakage in bathroom</span>{" "}
                              </div>
                              <div
                                className="col-lg-10"
                                style={{ fontSize: "14px" }}
                              >
                                <label
                                  style={spStyle}
                                  className="d-flex justify-content-between mb-1 leackage-status"
                                >
                                  <span>30/01/2024</span>
                                  <span>In progress</span>{" "}
                                </label>
                              </div>
                            </div>{" "}
                            <div style={bgStyle}>
                              <div className="d-flex justify-content-start">
                                <span className="">Leakage in bathroom</span>{" "}
                              </div>
                              <div
                                className="col-lg-10"
                                style={{ fontSize: "14px" }}
                              >
                                <label
                                  style={spStyle}
                                  className="d-flex justify-content-between mb-1"
                                >
                                  <span>30/01/2024</span>
                                  <span>In progress</span>
                                </label>
                              </div>
                            </div>
                          </>
                        )}
                        <label
                          className="d-flex justify-content-start"
                          style={{ cursor: "pointer", color: "blue" }}
                          onClick={handleViewMoreOverdueOrders}
                        >
                          {showMoreOverdueOrders ? "View Less" : "View All"}
                        </label>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TenantDashBoard;
