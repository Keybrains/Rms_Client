import classnames from "classnames";

import Chart from "chart.js";

import { Line, Bar } from "react-chartjs-2";
import { jwtDecode } from "jwt-decode";

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
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import VendorHeader from "components/Headers/VendorHeader";

const VendorDashBoard = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  let navigate = useNavigate();
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }
  const bgStyle = {
    backgroundColor: '#e4e6e7',
    paddingLeft: "10px"
    // width:"300px"
  };
  const spStyle = {
    color: 'red',
    // width:"300px"
  };
  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  const [showMoreNewOrders, setShowMoreNewOrders] = useState(false);
  const [showMoreOverdueOrders, setShowMoreOverdueOrders] = useState(false);

  const handleViewMoreNewOrders = () => {
    setShowMoreNewOrders(!showMoreNewOrders);
  };

  const handleViewMoreOverdueOrders = () => {
    setShowMoreOverdueOrders(!showMoreOverdueOrders);
  };
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

  return (
    <>
      <VendorHeader />
      <Container className="mt--7" fluid>
        <div>


          {/* Small Cards */}
          <Row lg="12" className="d-flex justify-content-around" >
            <Col lg="5" md="6" sm="12">
              <Card style={{
                justifyContent: "center",
                fontFamily: 'sans-serif',
                fontSize: '20px',
                color: 'black',
              }} >
                < CardBody>
                  <div className="mb-2 d-flex justify-content-start">
                    <span style={{ fontWeight: "bold", fontSize: "28px" }}> New Work Orders</span>
                  </div>
                  <div className="col-lg-2">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="">Total -</span>
                      <span> 7 </span>
                    </div>
                  </div>
                  <div style={bgStyle}>
                    <div className="d-flex justify-content-start">
                      <span className="">Leakage in bathroom</span>

                    </div>
                    <div className="col-lg-10" style={{ fontSize: "14px" }}>
                      <label className="d-flex justify-content-between mb-1">
                        <span>13/01/2024</span>
                        <span>New</span>
                      </label>
                    </div>
                  </div>
                  <div style={bgStyle}>
                    <div className="d-flex justify-content-start">
                      <span className="">Leakage in bathroom</span>

                    </div>
                    <div className="col-lg-10" style={{ fontSize: "14px" }}>
                      <label className="d-flex justify-content-between mb-1">
                        <span>13/01/2024</span>
                        <span>New</span>
                      </label>
                    </div>
                  </div>
                  <div style={bgStyle}>
                    <div className="d-flex justify-content-start">
                      <span className="">Leakage in bathroom</span>

                    </div>
                    <div className="col-lg-10" style={{ fontSize: "14px" }}>
                      <label className="d-flex justify-content-between mb-1">
                        <span>13/01/2024</span>
                        <span>New</span>
                      </label>
                    </div>
                  </div>

                  {showMoreNewOrders && (
                    <>
                      <div style={bgStyle}>
                        <div className="d-flex justify-content-start">
                          <span className="">Leakage in bathroom</span>

                        </div>
                        <div className="col-lg-10" style={{ fontSize: "14px" }}>
                          <label className="d-flex justify-content-between mb-1">
                            <span>13/01/2024</span>
                            <span>New</span>
                          </label>
                        </div>
                      </div>

                      <div style={bgStyle}>
                        <div className="d-flex justify-content-start">
                          <span className="">Leakage in bathroom</span>

                        </div>
                        <div className="col-lg-10" style={{ fontSize: "14px" }}>
                          <label className="d-flex justify-content-between mb-1">
                            <span>13/01/2024</span>
                            <span>New</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                  <label
                    className="d-flex justify-content-start"
                    style={{ cursor: 'pointer', color: 'blue' }}
                    onClick={handleViewMoreNewOrders}
                  >
                    {showMoreNewOrders ? 'View Less' : 'View All'}
                  </label>
                </CardBody>
              </Card>
            </Col>
            {/* <Col lg="4" md="6" sm="12">
              <Card style={{
                justifyContent: "center",
                fontFamily: 'sans-serif',
                fontSize: '25px',
                color: 'black',
                backgroundColor: '#cff5fc',
                padding: '10px',
                margin: '10px',
                borderRadius: '8px',
                textAlign: 'center',
                height: 'auto',
                marginBottom: '0',
              }}>
                <CardBody>
                  <div className="mb-2 d-flex justify-content-start">
                    <span style={{}}> Work Orders</span>
                  </div>

                  <div className="">
                    <div className="d-flex justify-content-between mb-1 ">
                      <p className="">In progress</p>
                      <p> 5 </p>
                    </div>
                  </div>

                </CardBody>
              </Card>
            </Col> */}
            <Col lg="5" md="6" sm="12">
              <Card style={{
                justifyContent: "center",
                fontFamily: 'sans-serif',
                fontSize: '20px',
                color: 'black',
              }} >
                < CardBody>
                  <div className="mb-2 d-flex justify-content-start">
                    <span style={{ fontWeight: "bold", fontSize: "28px" }}> Overdue Work Orders</span>
                  </div>
                  <div className="col-lg-2">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="">Total -</span>
                      <span> 5 </span>
                    </div>
                  </div>
                  <div style={bgStyle}>
                    <div className="d-flex justify-content-start">
                      <span className="">Leakage in bathroom</span>

                    </div>
                    <div className="col-lg-10" style={{ fontSize: "14px" }}>
                      <label className="d-flex justify-content-between mb-1">
                        <span style={spStyle}>30/01/2024</span>
                        <span>In progress</span>
                      </label>
                    </div>
                  </div>
                  <div style={bgStyle}>
                    <div className="d-flex justify-content-start">
                      <span className="">Leakage in bathroom</span>


                    </div>
                    <div className="col-lg-10" style={{ fontSize: "14px" }}>
                      <label className="d-flex justify-content-between mb-1">
                        <span style={spStyle}>30/01/2024</span>
                        <span>In progress</span>

                      </label>
                    </div>
                  </div>
                  <div style={bgStyle}>
                    <div className="d-flex justify-content-start">
                      <span className="">Leakage in bathroom</span>


                    </div>
                    <div className="col-lg-10" style={{ fontSize: "14px" }}>
                      <label className="d-flex justify-content-between mb-1">
                        <span style={spStyle}>30/01/2024</span>
                        <span>In progress</span>

                      </label>
                    </div>
                  </div>

                  {showMoreOverdueOrders && (
                    <>
                      <div style={bgStyle}>
                        <div className="d-flex justify-content-start">
                          <span className="">Leakage in bathroom</span>

                        </div>
                        <div className="col-lg-10" style={{ fontSize: "14px" }}>
                          <label className="d-flex justify-content-between mb-1">
                            <span style={spStyle}>30/01/2024</span>
                            <span>In progress</span>

                          </label>
                        </div>
                      </div>

                      <div style={bgStyle}>
                        <div className="d-flex justify-content-start">
                          <span className="">Leakage in bathroom</span>


                        </div>
                        <div className="col-lg-10" style={{ fontSize: "14px" }}>
                          <label className="d-flex justify-content-between mb-1">
                            <span style={spStyle}>30/01/2024</span>
                            <span>In progress</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                  <label
                    className="d-flex justify-content-start"
                    style={{ cursor: 'pointer', color: 'blue' }}
                    onClick={handleViewMoreOverdueOrders}
                  >
                    {showMoreOverdueOrders ? 'View Less' : 'View All'}
                  </label>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container >
    </>
  );
};

export default VendorDashBoard;
