import classnames from "classnames";

import Chart from "chart.js";

import { Line, Bar } from "react-chartjs-2";

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
import { jwtDecode } from "jwt-decode";
// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import TenantsHeader from "components/Headers/TenantsHeader";
import Cookies from "universal-cookie";
// import { useNavigate } from "react-router-dom";

import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import StaffHeader from "components/Headers/StaffHeader";
import StaffWorkTable from "./StaffWorkTable";

const StaffDashBoard = (props) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  let navigate = useNavigate();
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }
  const bgStyle = {
    backgroundColor: "#b3e6b3",
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
  let [loader, setLoader] = useState(false);

  // const handleViewMoreNewOrders = () => {
  //   setShowMoreNewOrders(!showMoreNewOrders);
  // };

  // const handleViewMoreOverdueOrders = () => {
  //   setShowMoreOverdueOrders(!showMoreOverdueOrders);
  // };
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

  const [propertycount, setpropertycount] = useState();
  const fetchPropertyCount = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        `${baseUrl}/staffmember/count/${accessType?.staffmember_id}/${accessType?.admin_id}`
      );
      setpropertycount(res.data);
    } catch (error) {
      console.error("Error: ", error.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPropertyCount();
  }, [accessType]);

  const cardStyle = {
    // background: `url(${require("../assets/img/us3.jpeg").default})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "40vh",
    alignItems: "center",
    justifyContent: "center",
    // display: 'flex',
    fontFamily: "sans-serif",
    fontSize: "35px",
    color: "black",
    // textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  };
  const subcardStyle = {
    backgroundColor: "#033E3E",
    border: "none",
    minHeight: "25vh",
    color: "#fff",
    fontSize: "25px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.10)",
  };
  const subbcardStyle = {
    backgroundColor: "#033E3E",
    border: "none",
    minHeight: "25vh",
    color: "#fff",
    fontSize: "25px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.10)",
  };
  const smallCardStyle = {
    backgroundColor: "#ffffff", // Background color of the small cards
    padding: "10px",
    margin: "10px",
    borderRadius: "8px",
    textAlign: "center",
    height: "150px", // Adjusted height
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 1)", // Your desired box shadow
  };
  const [newWorkOrders, setNewWorkOrders] = useState([]);
  const [overdueWorkOrders, setOverdueWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const [newResponse, overdueResponse] = await Promise.all([
          axios.get(
            `${baseUrl}/staffmember/dashboard_workorder/${accessType?.staffmember_id}/${accessType?.admin_id}`
          ), // Replace this with your actual overdue work orders API endpoint
        ]);
        setNewWorkOrders(newResponse.data.data.new_workorder);
        setOverdueWorkOrders(newResponse.data.data.overdue_workorder);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching work orders:", error);
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, [accessType]);
  const [isPasOverdue, setIsPasOverdue] = useState(false);

  const handleLabelClick = () => {
    // Set isPasOverdue to true when the label is clicked
    setIsPasOverdue(true);
  };

  return (
    <>
      <StaffHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <div className="mb-3">
          <Card
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
              // minHeight: "25vh",

              justifyContent: "center",
              // display: 'flex',
              // fontFamily: "sans-serif",
              fontSize: "20px",
              color: "black",
            }}
          >
            <CardBody>
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody style={cardStyle}>
                      <div style={{ textAlign: "center" }}>
                        Welcome to 302 Properties
                      </div>
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
                        <>
                          {propertycount === 0 ? (
                            <div>Data not found</div>
                          ) : (
                            <>
                              <Row
                                style={{}}
                                className="d-flex justify-content-around"
                              >
                                <Col lg="4" sm="12" className="mb-3">
                                  <Card style={subcardStyle}>
                                    <CardBody className="d-flex flex-column justify-content-center  text-center mb-3">
                                      <div className="d-flex align-items-center flex-column p-3 ">
                                        <div
                                          className="d-flex justify-content-center align-items-center"
                                          style={{
                                            color: "#cfd8dc",
                                            width: "70px",
                                            height: "70px",
                                            fontSize: "30px",
                                            borderRadius: "50%",
                                            background:
                                              "linear-gradient(125deg, #fff 10%,#033E3E,#263238)",
                                          }}
                                        >
                                          <i className="ni ni-pin-3"></i>
                                        </div>
                                        <div
                                          style={{
                                            color: "cfd8dc",
                                            fontSize: "20px",
                                          }}
                                        >
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
                                        {propertycount?.property_staffMember}
                                        {/* {propertycount} */}
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
                                            color: "white",
                                            width: "70px",
                                            height: "70px",
                                            fontSize: "30px",
                                            borderRadius: "50%",
                                            background:
                                              "linear-gradient(125deg, #fff 10%,#033E3E,#263238)",
                                          }}
                                        >
                                          <i className="ni ni-badge"></i>
                                        </div>
                                        <div
                                          style={{
                                            color: "white",
                                            fontSize: "20px",
                                          }}
                                        >
                                          Work Orders
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          color: "white",
                                          fontSize: "22px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {propertycount?.workorder_staffMember}
                                      </div>
                                    </CardBody>
                                  </Card>
                                </Col>
                              </Row>
                              <Row
                                lg="12"
                                className="d-flex justify-content-around"
                              >
                                <Col lg="5" md="12" sm="12" className="mb-3">
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
                                    <CardBody>
                                      <div className="mb-2 d-flex justify-content-start">
                                        <span
                                          style={{
                                            fontWeight: "bold",
                                            fontSize: "28px",
                                          }}
                                        >
                                          New Work Orders
                                        </span>
                                      </div>
                                      <div className="col-lg-2">
                                        <div className="d-flex justify-content-between mb-2">
                                          <span className="">Total </span>
                                          <span>{newWorkOrders.length}</span>
                                        </div>
                                      </div>
                                      {newWorkOrders
                                        .slice(0, 3)
                                        .map((order, index) => (
                                          <div key={index} style={bgStyle}>
                                            <div className="d-flex justify-content-start">
                                              <span className="">
                                                {order.work_subject}
                                              </span>
                                            </div>
                                            <div
                                              className="col-lg-10"
                                              style={{ fontSize: "14px" }}
                                            >
                                              <label className="d-flex justify-content-between mb-1 leackage-status">
                                                <span>{order.date}</span>
                                                <span>{order.status}</span>
                                              </label>
                                            </div>
                                          </div>
                                        ))}
                                      <label
                                        className="d-flex justify-content-start"
                                        style={{
                                          cursor: "pointer",
                                          color: "blue",
                                        }}
                                        // onClick={handleViewMoreNewOrders}
                                        onClick={() =>
                                          navigate("/staff/staffworktable")
                                        }
                                      >
                                        View All
                                        {/* {showMoreNewOrders
                                          ? "View Less"
                                          : "View All"} */}
                                      </label>
                                    </CardBody>
                                  </Card>
                                </Col>

                                <Col lg="5" md="12" sm="12">
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
                                          style={{
                                            fontWeight: "bold",
                                            fontSize: "28px",
                                          }}
                                        >
                                          Overdue Work Orders
                                        </span>
                                      </div>
                                      <div className="col-lg-2">
                                        <div className="d-flex justify-content-between mb-2">
                                          <span className="">Total </span>
                                          <span>
                                            {overdueWorkOrders.length}
                                          </span>
                                        </div>
                                      </div>
                                      {overdueWorkOrders
                                        .slice(0, 3)
                                        .map((order, index) => (
                                          <div key={index} style={bgStyle}>
                                            <div className="d-flex justify-content-start">
                                              <span className="">
                                                {order.work_subject}
                                              </span>
                                            </div>
                                            <div
                                              className="col-lg-10"
                                              style={{ fontSize: "14px" }}
                                            >
                                              <label className="d-flex justify-content-between mb-1 leackage-status text-danger">
                                                <span>{order.date}</span>
                                                <span>{order.status}</span>
                                              </label>
                                            </div>
                                          </div>
                                        ))}
                                      <label
                                        className="d-flex justify-content-start"
                                        style={{
                                          cursor: "pointer",
                                          color: "blue",
                                        }}
                                        onClick={() =>
                                          navigate(
                                            "/staff/staffworktable?status=Over Due"
                                          )
                                        }
                                      >
                                        View All
                                      </label>
                                    </CardBody>
                                  </Card>
                                </Col>
                              </Row>
                            </>
                          )}
                        </>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
        <div>{/* Small Cards */}</div>
      </Container>
    </>
  );
};

export default StaffDashBoard;
