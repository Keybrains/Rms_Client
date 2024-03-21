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
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "../../variables/charts";
import { Doughnut } from "react-chartjs-2";
import TenantsHeader from "components/Headers/TenantsHeader";
import Cookies from "universal-cookie";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import StaffHeader from "components/Headers/StaffHeader";
import StaffWorkTable from "./StaffWorkTable";
import Work from "../../assets/icons/Work Light.svg";
import property from "../../assets/icons/AdminDashboard/Properti-icon.svg";
import ArrowRight from "../../assets/icons/ArrowRight.svg";

const StaffDashBoard = (props) => {
  const [circularData, setCircularData] = useState({
    datasets: [
      {
        data: [55, 45],
        backgroundColor: ["#152B51 ", "#5A86D5"],
        weight: 10,
      },
    ],
  });

  const baseUrl = process.env.REACT_APP_BASE_URL;

  let navigate = useNavigate();
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  let [loader, setLoader] = useState(false);
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
    if (accessType?.staffmember_id && accessType?.admin_id) {
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
    }
  };

  useEffect(() => {
    fetchPropertyCount();
  }, [accessType]);

  const [newWorkOrders, setNewWorkOrders] = useState([]);
  const [overdueWorkOrders, setOverdueWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const options = {
    maintainAspectRatio: false,
    cutoutPercentage: 70,
    rotation: 1 * Math.PI,
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          const label = data.labels[tooltipItem.index] || "";
          const value = data.datasets[0].data[tooltipItem.index];
          return `${label}: ${value}%`;
        },
      },
    },
  };

  useEffect(() => {
    const fetchWorkOrders = async () => {
      if (accessType?.staffmember_id && accessType?.admin_id) {
        try {
          const [newResponse, overdueResponse] = await Promise.all([
            axios.get(
              `${baseUrl}/staffmember/dashboard_workorder/${accessType?.staffmember_id}/${accessType?.admin_id}`
            ),
          ]);
          setNewWorkOrders(newResponse.data.data.new_workorder);
          setOverdueWorkOrders(newResponse.data.data.overdue_workorder);
        } catch (error) {
          console.error("Error fetching work orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchWorkOrders();
  }, [accessType]);

  return (
    <>
      <StaffHeader prop="My Dashboard" />
      <Container className="mx-3" fluid>
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
          <Row>
            <Col className="mt-3" xl="12">
              <Row>
                <Col lg={5}>
                  <Row>
                    <Col
                      style={{
                        fontFamily: "Poppins",
                        color: "#fff",
                      }}
                    >
                      <Card
                        style={{
                          cursor: "pointer",
                          height: "250px",
                          margin: "auto 20px",
                          borderRadius: "20px",
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                          backgroundColor: "#152B51",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CardBody
                          style={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                          className="py-5"
                        >
                          <Row>
                            <Col>
                              <span
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  fontSize: "20px",
                                  padding: "20px",
                                  boxShadow: "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                                }}
                              >
                                <img src={property} height={20} width={20} />
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              lg={12}
                              className="d-flex justify-content-start pt-5"
                            >
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: "25px",
                                  fontWeight: "600",
                                }}
                              >
                                {propertycount?.property_staffMember
                                  .toString()
                                  .padStart(2, "0")}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} className="pt-3">
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: "20px",
                                  fontWeight: "500",
                                }}
                                onClick={() => navigate("/staff/staffproperty")}
                              >
                                Properties{" "}
                                <img src={ArrowRight} height={12} width={12} />
                              </span>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col
                      style={{
                        fontFamily: "Poppins",
                        color: "#fff",
                      }}
                    >
                      <Card
                        style={{
                          cursor: "pointer",
                          height: "250px",
                          margin: "auto 20px",
                          borderRadius: "20px",
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                          backgroundColor: "#324B77",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CardBody
                          style={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                          className="py-5"
                        >
                          <Row>
                            <Col>
                              <span
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  fontSize: "20px",
                                  padding: "20px",
                                  boxShadow: "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                                }}
                              >
                                <img src={Work} height={20} width={20} />
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              lg={12}
                              className="d-flex justify-content-start pt-5"
                            >
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: "25px",
                                  fontWeight: "600",
                                }}
                              >
                                {propertycount?.workorder_staffMember
                                  .toString()
                                  .padStart(2, "0")}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} className="pt-3">
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: "20px",
                                  fontWeight: "500",
                                }}
                                onClick={() =>
                                  navigate("/staff/staffworktable")
                                }
                              >
                                Work Orders{" "}
                                <img src={ArrowRight} height={12} width={12} />
                              </span>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>
                <Col lg={7}>
                  <Row>
                    <Col
                      style={{
                        fontFamily: "Poppins",
                        color: "#fff",
                      }}
                    >
                      <Card
                        style={{
                          cursor: "pointer",
                          height: "253px",
                          fontWeight: "600",
                          margin: "auto 20px",
                          borderRadius: "20px",
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                          backgroundColor: "#fff",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CardHeader
                          className="d-flex justify-content-center"
                          style={{
                            backgroundColor: "#152B51",
                            borderRadius: "20px 20px 0 0",
                            fontSize: "20px",
                          }}
                        >
                          New Work Order
                        </CardHeader>
                        <CardBody
                          style={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                          className="py-5"
                        >
                          <Row>
                            <Col
                              lg={12}
                              className="d-flex justify-content-center "
                            >
                              <span
                                style={{
                                  height: "auto",
                                  fontWeight: "600",
                                  fontSize: "24px",
                                  color: "#5A86D5",
                                }}
                              >
                                Total:{" "}
                                {newWorkOrders?.length
                                  .toString()
                                  .padStart(2, "0")}
                              </span>
                            </Col>
                          </Row>

                          <Row>
                            <Col
                              lg={12}
                              className="d-flex justify-content-center mt-3"
                            >
                              <span
                                className="d-flex justify-content-center "
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  color: "#fff",
                                  backgroundColor: "#152B51",
                                  width: "100px",
                                  height: "30",
                                  borderRadius: "6px",
                                  padding: "6px",
                                }}
                                onClick={() =>
                                  navigate("/staff/staffworktable")
                                }
                              >
                                View All
                              </span>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col
                      style={{
                        fontFamily: "Poppins",
                        color: "#fff",
                      }}
                    >
                      <Card
                        style={{
                          cursor: "pointer",
                          height: "253px",
                          margin: "auto 20px",
                          borderRadius: "20px",
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                          backgroundColor: "#fff",
                          display: "flex",
                          flexDirection: "column",
                          fontWeight: "600",
                        }}
                      >
                        <CardHeader
                          className="d-flex justify-content-center"
                          style={{
                            backgroundColor: "#5A86D5",
                            borderRadius: "20px 20px 0 0",
                            fontSize: "20px",
                          }}
                        >
                          Overdue Work Order
                        </CardHeader>
                        <CardBody
                          style={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                          className="py-5 "
                        >
                          <Row>
                            <Col
                              lg={12}
                              className="d-flex justify-content-center "
                            >
                              <span
                                style={{
                                  width: "auto",
                                  height: "auto",
                                  fontWeight: "600",
                                  fontSize: "24px",
                                  // padding: "20px",
                                  color: "#5A86D5",
                                  // boxShadow: "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                                }}
                              >
                                Total:{" "}
                                {overdueWorkOrders?.length
                                  .toString()
                                  .padStart(2, "0")}
                              </span>
                            </Col>
                          </Row>

                          <Row>
                            <Col
                              lg={12}
                              className="d-flex justify-content-center mt-3"
                            >
                              <span
                                className="d-flex justify-content-center "
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  color: "#fff",
                                  backgroundColor: "#5A86D5",
                                  width: "100px",
                                  height: "30",
                                  borderRadius: "6px",
                                  padding: "6px",
                                }}
                                onClick={() =>
                                  navigate(
                                    "/staff/staffworktable?status=Over Due"
                                  )
                                }
                              >
                                View All
                              </span>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col className="mt-3" xl="2">
                  <div
                    className=""
                    style={{
                      textAlign: "center",
                      marginTop: "20px",
                      width: "300px",
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#525459",
                      fontFamily: "Manrope",
                    }}
                  >
                    {" "}
                    Analytic
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "20px",
                      position: "relative",
                      width: "300px",
                    }}
                  >
                    <Doughnut
                      data={circularData}
                      options={options}
                      width={250}
                      height={250}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "Secondary",
                        }}
                      >
                        Total Work Orders
                      </span>
                      <br />
                      <span
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#030303",
                        }}
                      >
                        {propertycount?.workorder_staffMember
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col
                  className="mx-5"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Col>
                    <Row className="mb-5" style={{ marginTop: "60px" }}>
                      <i
                        className="fa-solid fa-square mx-2"
                        style={{ color: "#152B51", fontSize: "20px" }}
                      ></i>
                      <span
                        style={{
                          color: "#1C1C1E",
                          fontSize: "16px",
                          fontFamily: "Poppins",
                        }}
                      >
                        New Work Orders
                      </span>
                    </Row>
                    <Row>
                      <i
                        className="fa-solid fa-square mx-2"
                        style={{ color: "#5A86D5", fontSize: "20px" }}
                      ></i>
                      <span
                        style={{
                          color: "#1C1C1E",
                          fontSize: "16px",
                          fontFamily: "Poppins",
                        }}
                      >
                        Overdue Work Orders
                      </span>
                    </Row>
                  </Col>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default StaffDashBoard;
