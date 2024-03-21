import classnames from "classnames";

import Chart from "chart.js";

// import { Line, Bar } from "react-chartjs-2";
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
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import VendorHeader from "components/Headers/VendorHeader";
import { RotatingLines } from "react-loader-spinner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
} from "recharts";
import book from "../../assets/icons/bookpaper.svg";
import clock from "../../assets/icons/clock.svg";

const ComparisonGraph = ({ data }) => {
  // }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={Object.keys(data).map((month) => ({
          month,
          "Active Plans": data[month].activePlans,
          "Inactive Plans": data[month].inactivePlans,
        }))}
      >
        <Tooltip />
        <Bar dataKey="Active Plans" fill="#152B51" barSize={20} />
        <Bar dataKey="Inactive Plans" fill="#5A86D5" barSize={20} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ComparisonChartContainer = () => {
  const data = {
    Jan: { activePlans: 50, inactivePlans: 30 },
    Feb: { activePlans: 60, inactivePlans: 25 },
    Mar: { activePlans: 70, inactivePlans: 35 },
    Apr: { activePlans: 55, inactivePlans: 40 },
    May: { activePlans: 45, inactivePlans: 20 },
    Jun: { activePlans: 65, inactivePlans: 30 },
    Jul: { activePlans: 75, inactivePlans: 35 },
    Aug: { activePlans: 50, inactivePlans: 30 },
    Sep: { activePlans: 70, inactivePlans: 25 },
    Oct: { activePlans: 60, inactivePlans: 35 },
    Nov: { activePlans: 55, inactivePlans: 45 },
    Dec: { activePlans: 45, inactivePlans: 20 },
  };

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto" }}>
      <ComparisonGraph data={data} />
    </div>
  );
};

const VendorDashBoard = (props) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let [loader, setLoader] = React.useState(true);

  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  let navigate = useNavigate();
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

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
      if (accessType?.vendor_id && accessType?.admin_id) {
        try {
          const response = await axios.get(
            `${baseUrl}/vendor/dashboard_workorder/${accessType?.vendor_id}/${accessType?.admin_id}`
          );
          if (response.status === 200) {
            const { data } = response.data;
            setNewWorkOrders(data.new_workorder);
            setOverdueWorkOrders(data.overdue_workorder);
            console.log(data.new_workorder, data.overdue_workorder, "jack");
            console.log(
              `${baseUrl}/vendor/dashboard_workorder/${accessType?.vendor_id}/${accessType?.admin_id}`,
              "jaaa"
            );
          } else {
            console.error("Failed to fetch work orders");
          }
        } catch (error) {
          console.error("Error fetching work orders:", error);
        } finally {
          setLoader(false);
        }
      }
    };
    fetchWorkOrders();
  }, [accessType]);

  const [selectedYearPlan, setSelectedYearPlan] = useState("This Year");

  const [dropdownOpenPlan, setdropdownOpenPlan] = useState(false);

  const togglePlan = () => setdropdownOpenPlan((prevState) => !prevState);

  const handleChangePlan = (year) => {
    setSelectedYearPlan(year);
  };

  return (
    <>
      <VendorHeader prop={"My Dashboard"} />

      <Container className="mx-3" fluid>
        <div>
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
              <Row>
                <Col className="order-xl-1 mt-3" xl="12">
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
                              height: "230px",
                              margin: "auto 10px",
                              borderRadius: "16px",
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
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "50%",
                                      fontSize: "20px",
                                      padding: "15px",
                                      boxShadow:
                                        "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                                    }}
                                  >
                                    <img src={book} height={20} width={20} />
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  lg={12}
                                  className="d-flex justify-content-start align-items-center pt-5"
                                >
                                  <span
                                    style={{
                                      fontFamily: "Poppins",
                                      fontSize: "24px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {newWorkOrders?.length
                                      .toString()
                                      .padStart(2, "0")}
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  lg={12}
                                  className="pt-4 align-items-center"
                                >
                                  <span
                                    style={{
                                      fontFamily: "Poppins",
                                      fontSize: "14px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    New Work Orders
                                  </span>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                          <label
                            className="d-flex justify-content-center mt-3"
                            style={{
                              cursor: "pointer",
                              color: "white",
                              backgroundColor: "#152B51",
                              height: "39px",
                              width: "92%",
                              marginLeft: "10px",
                              borderRadius: "6px",
                              padding: "8px",
                              boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                            }}
                            // onClick={handleViewMoreOverdueOrders}
                            onClick={() => navigate("/vendor/vendorworktable")}
                          >
                            <span
                              style={{
                                borderBottom: "2px solid #D7E0FF",
                                fontFamily: "Poppins",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              View All
                            </span>
                          </label>
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
                              height: "230px",
                              margin: "auto 10px",
                              borderRadius: "16px",
                              boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                              backgroundColor: "#5A86D5",
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
                              <Row style={{ flex: 1 }}>
                                <Col>
                                  <span
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "50%",
                                      fontSize: "20px",
                                      padding: "15px",
                                      boxShadow:
                                        "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                                    }}
                                  >
                                    <img src={clock} height={20} width={20} />
                                  </span>
                                </Col>
                              </Row>
                              <Row style={{ flex: 1 }}>
                                <Col
                                  lg={12}
                                  className="d-flex justify-content-start pt-5"
                                >
                                  <span
                                    style={{
                                      fontFamily: "Poppins",
                                      fontSize: "24px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {overdueWorkOrders?.length
                                      .toString()
                                      .padStart(2, "0")}
                                  </span>
                                </Col>
                              </Row>
                              <Row style={{ flex: 1 }}>
                                <Col
                                  lg={12}
                                  className="pt-4 align-items-center"
                                >
                                  <span
                                    style={{
                                      fontFamily: "Poppins",
                                      fontSize: "14px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    Overdue Work Orders
                                  </span>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                          <label
                            className="d-flex justify-content-center mt-3"
                            style={{
                              cursor: "pointer",
                              color: "white",
                              backgroundColor: "#5A86D5",
                              height: "39px",
                              width: "92%",
                              marginLeft: "10px",
                              borderRadius: "6px",
                              padding: "8px",
                              boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                            }}
                            onClick={() =>
                              navigate(
                                "/vendor/vendorworktable?status=Over Due"
                              )
                            }
                          >
                            <span
                              style={{
                                borderBottom: "2px solid #D7E0FF",
                                fontFamily: "Poppins",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              View All{" "}
                            </span>
                          </label>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row style={{ fontFamily: "poppins" }}>
                <Col xs={12} lg={10} sm={12} md={10}>
                  <div className="d-flex mt-3">
                    <div
                      className="mr-auto p-2"
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        fontFamily: "Manrope",
                        color: "#030303",
                      }}
                    >
                      Statistics
                    </div>
                    <div
                      className="px-1 py-0 d-flex align-items-center"
                      style={{
                        backgroundColor: "#CEE9FF",
                        borderRadius: "5px",
                        width: "155px",
                        height: "34px",
                      }}
                    >
                      <i
                        className="fa-solid fa-square mx-2"
                        style={{ color: "#152B51" }}
                      ></i>
                      <span
                        style={{
                          color: "#1C1C1E",
                          fontSize: "12px",
                          fontFamily: "Poppins",
                          fontWeight: "400",
                        }}
                      >
                        New Work Orders
                      </span>
                    </div>
                    <div
                      className="px-1 py-0 d-flex align-items-center ml-5"
                      style={{
                        backgroundColor: "#CEE9FF",
                        borderRadius: "5px",
                        width: "182px",
                        height: "34px",
                      }}
                    >
                      <i
                        className="fa-solid fa-square mx-2 "
                        style={{ color: "#5A86D5" }}
                      ></i>
                      <span
                        style={{
                          color: "#1C1C1E",
                          fontSize: "12px",
                          fontFamily: "Poppins",
                          fontWeight: "400",
                        }}
                      >
                        Overdue Work Orders
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="mt-3 mb-3 mx-1">
                <Col
                  xs={12}
                  lg={11}
                  xl={10}
                  sm={12}
                  md={12}
                  style={{
                    border: "0.5px Solid #A8A9AC",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                  }}
                >
                  <Col className="d-flex justify-content-end mt-3 mb-3">
                    <Dropdown
                      isOpen={dropdownOpenPlan}
                      toggle={togglePlan}
                      style={{ width: "180px", borderRadius: "16px" }}
                    >
                      <DropdownToggle
                        caret
                        style={{
                          backgroundColor: "#152B51",
                          color: "#fff",
                          width: "100%",
                        }}
                      >
                        {selectedYearPlan ? selectedYearPlan : "Select Year"}
                      </DropdownToggle>
                      <DropdownMenu
                        style={{
                          backgroundColor: "#152B51",
                          left: "0",
                          transform: "translateX(-100%)",
                        }}
                      >
                        <DropdownItem
                          onClick={() => handleChangePlan("This Year")}
                          style={{
                            color: "#fff",
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#5A86D5")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "transparent")
                          }
                        >
                          This Year
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleChangePlan("Previous Year")}
                          style={{
                            color: "#fff",
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#5A86D5")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "transparent")
                          }
                        >
                          Previous Year
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </Col>

                  <ComparisonChartContainer />
                </Col>
              </Row>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default VendorDashBoard;
