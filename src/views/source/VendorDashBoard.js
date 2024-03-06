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
import { RotatingLines } from "react-loader-spinner";

const VendorDashBoard = (props) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let [loader, setLoader] = React.useState(true);

  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  let navigate = useNavigate();
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }
  const bgStyle = {
    backgroundColor: "#e4e6e7",
    paddingLeft: "10px",
    // width:"300px"
  };
  const spStyle = {
    color: "red",
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
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const [newWorkOrders, setNewWorkOrders] = useState([]);
  const [overdueWorkOrders, setOverdueWorkOrders] = useState([]);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/vendor/dashboard_workorder/${accessType?.vendor_id}/${accessType?.admin_id}`
        );
        if (response.status === 200) {
          const { data } = response.data;
          setNewWorkOrders(data.new_workorder);
          setOverdueWorkOrders(data.overdue_workorder);
          console.log(data.new_workorder,data.overdue_workorder,"jack")
          console.log(`${baseUrl}/vendor/dashboard_workorder/${accessType?.vendor_id}/${accessType?.admin_id}`,"jaaa")
          setLoader(false);

        } else {
          console.error("Failed to fetch work orders");
        }
      } catch (error) {
        console.error("Error fetching work orders:", error);
      }
    };
    fetchWorkOrders();
  }, [accessType]);

  return (
    <>
      <VendorHeader />
      <Container className="mt--7" fluid>
        <div>
          {/* Small Cards */}
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
          <Row lg="12" className="d-flex justify-content-around">
            <Col lg="5" md="6" sm="12">
              <Card
                style={{
                  justifyContent: "center",
                  fontFamily: "sans-serif",
                  fontSize: "20px",
                  color: "black",
                }}
              >
                  <CardBody>
                    <div className="mb-2 d-flex justify-content-start">
                      <span style={{ fontWeight: "bold", fontSize: "28px" }}>
                        {" "}
                        New Work Orders
                      </span>
                    </div>
                    <div className="col-lg-6">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="">Total - {newWorkOrders.length}</span>
                      </div>
                    </div>
                    {newWorkOrders.slice(0, 3).map((order, index) => (
                      <div key={index} style={bgStyle}>
                        <div className="d-flex justify-content-start">
                          <span className="">{order.work_subject}</span>
                        </div>
                        <div className="col-lg-10" style={{ fontSize: "14px" }}>
                          <label className="d-flex justify-content-between mb-1 leackage-status">
                            <span>{order.date}</span>
                            <span>{order.status}</span>
                          </label>
                        </div>
                      </div>
                    ))}
                    <label
                      className="d-flex justify-content-start"
                      style={{ cursor: "pointer", color: "blue" }}
                      // onClick={handleViewMoreNewOrders}
                      onClick={() => navigate("/vendor/vendorworktable")}
                    >
                      {showMoreNewOrders ? "View Less" : "View All"}
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
              <Card
                style={{
                  justifyContent: "center",
                  fontFamily: "sans-serif",
                  fontSize: "20px",
                  color: "black",
                }}
              >
                <CardBody>
                  <div className="mb-2 d-flex justify-content-start">
                    <span style={{ fontWeight: "bold", fontSize: "28px" }}>
                      {" "}
                      Overdue Work Orders
                    </span>
                  </div>
                  <div className="col-lg-6">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="">
                        Total - {overdueWorkOrders.length}
                      </span>
                    </div>
                  </div>
                  {overdueWorkOrders.slice(0, 3).map((order, index) => (
                    <div key={index} style={bgStyle}>
                      <div className="d-flex justify-content-start">
                        <span className="">{order.work_subject}</span>
                      </div>
                      <div className="col-lg-10" style={{ fontSize: "14px" }}>
                        <label className="d-flex justify-content-between mb-1 leackage-status text-danger">
                          <span>{order.date}</span>
                          <span>{order.status}</span>
                        </label>
                      </div>
                    </div>
                  ))}
                  <label
                    className="d-flex justify-content-start"
                    style={{ cursor: "pointer", color: "blue" }}
                    // onClick={handleViewMoreOverdueOrders}
                    onClick={() =>
                      navigate("/vendor/vendorworktable?status=Over Due")
                    }
                  >
                    {showMoreOverdueOrders ? "View Less" : "View All"}
                  </label>
                </CardBody>
              </Card>
            </Col>
          </Row>
          )}
        </div>
      </Container>
    </>
  );
};

export default VendorDashBoard;
