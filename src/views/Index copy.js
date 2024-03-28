import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  DropdownItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { useNavigate } from "react-router-dom/dist";
import Work from "../assets/icons/AdminDashboard/Properti-icon.svg";
import "./source/dash.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import moment from "moment";
import { Pie } from "react-chartjs-2";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
import ArrowRight from "../assets/icons/AdminDashboard/rightarrow-icon.svg";
import Tenants from "../assets/icons/AdminDashboard/tenant-icon.svg";
import Applicants from "../assets/icons/AdminDashboard/applicant-icon.svg";
import Vendors from "../assets/icons/AdminDashboard/vendor-icon.svg";
import WorkOrders from "../assets/icons/AdminDashboard/workorder-icon.svg";
import { useParams } from "react-router-dom";
import Header from "components/Headers/Header.js";

const Index = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let navigate = useNavigate();

  const { admin } = useParams();

  const [accessType, setAccessType] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const PieChart = ({ data }) => {
    const chartData = {
      labels: ["Properties", "Tenants", "Applicants", "Vendors", "Work Orders"],
      datasets: [
        {
          data: data,
          backgroundColor: [
            "#152B51",
            "#283C5F",
            "#324B77",
            "#3C598E",
            "#5A86D5",
          ],
          hoverBackgroundColor: [
            "#152B51",
            "#283C5F",
            "#324B77",
            "#3C598E",
            "#5A86D5",
          ],
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
    };

    return (
      <div style={{ width: "200px", height: "200px", display: "flex" }}>
        <Pie data={chartData} options={options} />
      </div>
    );
  };

  const ComparisonGraph = ({ data, poll1 }) => {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={Object.keys(data).map((month) => ({
            month,
            "Active Plans": data[month].activePlans,
          }))}
        >
          <XAxis
            dataKey="month"
            axisLine={{ stroke: "transparent" }}
            tickLine={{ stroke: "transparent" }}
            tick={{ fontFamily: "Roboto", fontSize: 14 }}
          />
          <Bar dataKey="Active Plans" fill={poll1} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const ComparisonChartContainer = ({ poll1 }) => {
    const data = {
      Jan: { activePlans: 50 },
      Feb: { activePlans: 60 },
      Mar: { activePlans: 70 },
      Apr: { activePlans: 55 },
      May: { activePlans: 45 },
      Jun: { activePlans: 65 },
      Jul: { activePlans: 75 },
      Aug: { activePlans: 80 },
      Sep: { activePlans: 70 },
      Oct: { activePlans: 60 },
      Nov: { activePlans: 55 },
      Dec: { activePlans: 45 },
    };

    return <ComparisonGraph data={data} poll1={poll1} />;
  };

  const [selectedYearPlan, setSelectedYearPlan] = useState("This Year");
  const [dropdownOpenPlan, setdropdownOpenPlan] = useState(false);
  const togglePlan = () => setdropdownOpenPlan((prevState) => !prevState);
  const handleChangePlan = (year) => {
    setSelectedYearPlan(year);
  };

  let [loader, setLoader] = React.useState(true);
  const [data, setData] = useState({
    tenants: 0,
    rentals: 0,
    Vendors: 0,
    Applicants: 0,
    WorkOrders: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (accessType?.admin_id) {
        try {
          console.log("firsti");
          const response1 = await axios.get(
            `${baseUrl}/tenant/tenant_count/${accessType?.admin_id}`
          );
          const response2 = await axios.get(
            `${baseUrl}/rentals/rental_count/${accessType?.admin_id}`
          );
          const response4 = await axios.get(
            `${baseUrl}/vendor/vendor_count/${accessType?.admin_id}`
          );
          const response3 = await axios.get(
            `${baseUrl}/applicant/applicant_count/${accessType?.admin_id}`
          );
          const response5 = await axios.get(
            `${baseUrl}/work-order/workorder_count/${accessType?.admin_id}`
          );
          console.log(response1, "firsti");
          setLoader(false);
          const newData = {
            tenants: response1.data.count,
            rentals: response2.data.count,
            Vendors: response4.data.count,
            Applicants: response3.data.count,
            WorkOrders: response5.data.count,
          };

          setData(newData);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [accessType]);
  return (
    <div>
      <Header />

      <Container className="" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Row
              xs="1"
              sm="2"
              md="2"
              lg="3"
              xl={"5"}
              className="px-3 pt-3 pb-1"
            >
              <Col
                className="py-3"
                style={{
                  marginBottom: "20px",
                  fontFamily: "Properties",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "235px",
                    margin: "auto 5px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                    backgroundColor: "rgba(21, 43, 81, 1)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => navigate("/" + admin + "/propertiesTable")}
                >
                  <CardBody
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    className="py-5 flex-column"
                  >
                    <Row style={{ flex: 1.5 }}>
                      <Col>
                        <span
                          style={{
                            borderRadius: "50%",
                            fontSize: "16px",
                            padding: "20px",
                            boxShadow: "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                          }}
                        >
                          <img src={Work} height={25} width={25} />
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
                            fontSize: "20px",
                            fontWeight: "600",
                          }}
                        >
                          {data.rentals?.toString()?.padStart(2, "0") || "00"}
                        </span>
                      </Col>
                    </Row>
                    <Row className="pt-3">
                      <Col lg={12}>
                        <span
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            fontWeight: "500",
                          }}
                        >
                          Properties{" "}
                          <img src={ArrowRight} height={20} width={20} />
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col
                className="py-3"
                style={{
                  marginBottom: "20px",
                  fontFamily: "Manrope",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "235px",
                    margin: "auto 5px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                    backgroundColor: "rgba(40, 60, 95, 1)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => navigate("/" + admin + "/TenantsTable")}
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
                            fontSize: "16px",
                            padding: "20px",
                            boxShadow: "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                          }}
                        >
                          <img src={Tenants} height={25} width={25} />
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
                            fontSize: "20px",
                            fontWeight: "600",
                          }}
                        >
                          {data.tenants?.toString()?.padStart(2, "0") || "00"}
                        </span>
                      </Col>
                    </Row>
                    <Row className="pt-3">
                      <Col lg={12}>
                        <span
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            fontWeight: "500",
                          }}
                        >
                          Tenants{" "}
                          <img src={ArrowRight} height={20} width={20} />
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col
                className="py-3"
                style={{
                  marginBottom: "20px",
                  fontFamily: "Manrope",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "235px",
                    margin: "auto 5px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                    backgroundColor: "rgba(50, 75, 119, 1)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => navigate("/" + admin + "/Applicants")}
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
                            fontSize: "16px",
                            padding: "20px",
                            boxShadow: "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                          }}
                        >
                          <img src={Applicants} height={25} width={25} />
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
                            fontSize: "20px",
                            fontWeight: "600",
                          }}
                        >
                          {data.Applicants?.toString()?.padStart(2, "0") ||
                            "00"}
                        </span>
                      </Col>
                    </Row>
                    <Row className="pt-3">
                      <Col lg={12}>
                        <span
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            fontWeight: "500",
                          }}
                        >
                          Applicants {""}
                          <img src={ArrowRight} height={20} width={20} />
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col
                className="py-3"
                style={{
                  marginBottom: "20px",
                  fontFamily: "Manrope",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "235px",
                    margin: "auto 5px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                    backgroundColor: "rgba(60, 89, 142, 1)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => navigate("/" + admin + "/vendor")}
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
                            fontSize: "16px",
                            padding: "20px",
                            boxShadow: "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                          }}
                        >
                          <img src={Vendors} height={25} width={25} />
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
                            fontSize: "20px",
                            fontWeight: "600",
                          }}
                        >
                          {data.Vendors?.toString()?.padStart(2, "0") || "00"}
                        </span>
                      </Col>
                    </Row>
                    <Row className="pt-3">
                      <Col lg={12}>
                        <span
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            fontWeight: "500",
                          }}
                        >
                          Vendors {""}
                          <img src={ArrowRight} height={20} width={20} />
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col
                className="py-3"
                style={{
                  marginBottom: "20px",
                  fontFamily: "Manrope",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "235px",
                    margin: "auto 5px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                    backgroundColor: "rgba(90, 134, 213, 1)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => navigate("/" + admin + "/Workorder")}
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
                            fontSize: "16px",
                            padding: "20px",
                            boxShadow: "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                          }}
                        >
                          <img src={WorkOrders} height={25} width={25} />
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
                            fontSize: "20px",
                            fontWeight: "600",
                          }}
                        >
                          {data.WorkOrders?.toString()?.padStart(2, "0") ||
                            "00"}
                        </span>
                      </Col>
                    </Row>
                    <Row className="pt-3">
                      <Col lg={12}>
                        <span
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            fontWeight: "500",
                          }}
                        >
                          Work Orders {""}
                          <img src={ArrowRight} height={20} width={20} />
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="w-100">
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Row className="pl-2">
                  <Col className="pt-3  " xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Col>
                      <Card
                        className="second-cards"
                        style={{
                          cursor: "pointer",
                          height: "135px",
                          borderRadius: "20px",
                          boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Row>
                          <Col lg={12}>
                            <span
                              style={{
                                height: "50px",
                                backgroundColor: "#324B77",
                                borderTopLeftRadius: "20px",
                                borderTopRightRadius: "20px",
                                color: "#fff",
                                fontFamily: "Poppins",
                                boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",

                                fontWeight: "600",
                                fontSize: "12px",
                              }}
                              className="d-flex justify-content-center align-items-center"
                            >
                              Due rent for the month
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <CardBody
                              style={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                              className="py-1"
                            >
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontWeight: "600",
                                  fontSize: "20px",
                                  color: "rgba(90, 134, 213, 1)",
                                }}
                                className="d-flex justify-content-center align-items-center py-4"
                              >
                                1200
                              </span>
                            </CardBody>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Col>
                  <Col className="pt-3 " xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Col>
                      <Card
                        className="second-cards"
                        style={{
                          cursor: "pointer",
                          height: "135px",
                          borderRadius: "20px",
                          boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Row>
                          <Col lg={12}>
                            <span
                              style={{
                                height: "50px",
                                backgroundColor: "#324B77",
                                borderTopLeftRadius: "20px",
                                borderTopRightRadius: "20px",
                                color: "#fff",
                                fontFamily: "Poppins",
                                fontWeight: "600",
                                boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",

                                fontSize: "12px",
                              }}
                              className="d-flex justify-content-center align-items-center"
                            >
                              Total collected amount
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <CardBody
                              style={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                              className="py-1"
                            >
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontWeight: "600",
                                  fontSize: "20px",
                                  color: "rgba(90, 134, 213, 1)",
                                }}
                                className="d-flex justify-content-center align-items-center py-4"
                              >
                                2500
                              </span>
                            </CardBody>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Col>
                  <Col className="pt-3 " xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Col>
                      <Card
                        className="second-cards"
                        style={{
                          cursor: "pointer",
                          height: "135px",
                          borderRadius: "20px",
                          boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Row>
                          <Col lg={12}>
                            <span
                              style={{
                                height: "50px",
                                backgroundColor: "#324B77",
                                borderTopLeftRadius: "20px",
                                borderTopRightRadius: "20px",
                                color: "#fff",
                                fontFamily: "Poppins",
                                fontWeight: "600",
                                fontSize: "12px",
                                boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                              }}
                              className="d-flex justify-content-center align-items-center"
                            >
                              Total past due amount
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <CardBody
                              style={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                              className="py-1"
                            >
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontWeight: "600",
                                  fontSize: "20px",
                                  color: "rgba(90, 134, 213, 1)",
                                }}
                                className="d-flex justify-content-center align-items-center py-4"
                              >
                                1000
                              </span>
                            </CardBody>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Col>
                  <Col className="pt-3 " xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Col>
                      <Card
                        className="second-cards"
                        style={{
                          cursor: "pointer",
                          height: "135px",
                          borderRadius: "20px",
                          boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Row>
                          <Col lg={12}>
                            <span
                              style={{
                                height: "50px",
                                backgroundColor: "#324B77",
                                borderTopLeftRadius: "20px",
                                borderTopRightRadius: "20px",
                                color: "#fff",
                                fontFamily: "Poppins",
                                boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",

                                fontWeight: "600",
                                fontSize: "12px",
                              }}
                              className="d-flex justify-content-center align-items-center"
                            >
                              Last month collected amount
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <CardBody
                              style={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                              className="py-1"
                            >
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontWeight: "600",
                                  fontSize: "20px",
                                  color: "rgba(90, 134, 213, 1)",
                                }}
                                className="d-flex justify-content-center align-items-center py-4"
                              >
                                1800
                              </span>
                            </CardBody>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="w-100 my-5">
              <Col className="pt-3" xs={12} sm={12} md={12} lg={5} xl={5}>
                <Row style={{ marginLeft: "7px" }}>
                  <Col
                    style={{
                      marginBottom: "20px",
                      fontFamily: "Manrope",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                      borderRadius: "20px",
                    }}
                    className="mx-3"
                  >
                    <Card
                      style={{
                        cursor: "pointer",
                        height: "390px",
                        display: "flex",
                        flexDirection: "Row",
                        backgroundColor: "transparent",
                        border: "none",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <PieChart
                        data={[
                          data.rentals,
                          data.tenants,
                          data.Applicants,
                          data.Vendors,
                          data.WorkOrders,
                        ]}
                      />

                      <CardBody
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                        className="pt-1"
                      >
                        <div
                          style={{
                            margin: "3px 0",
                            fontFamily: "Poppins",
                            fontWeight: "400",
                            fontSize: "12px",
                            padding: "0 10px",
                            marginBottom: "15px",
                          }}
                        >
                          <i
                            class="fa-solid fa-square"
                            style={{ color: "#152B51" }}
                          ></i>{" "}
                          Properties
                        </div>
                        <div
                          style={{
                            margin: "3px 0",
                            fontFamily: "Poppins",
                            fontWeight: "400",
                            fontSize: "12px",
                            padding: "0 10px",
                            marginBottom: "15px",
                          }}
                        >
                          <i
                            class="fa-solid fa-square"
                            style={{ color: "#283C5F" }}
                          ></i>{" "}
                          Tenants
                        </div>
                        <div
                          style={{
                            margin: "3px 0",
                            fontFamily: "Poppins",
                            fontWeight: "400",
                            fontSize: "12px",
                            padding: "0 10px",
                            marginBottom: "15px",
                          }}
                        >
                          <i
                            class="fa-solid fa-square"
                            style={{ color: "#324B77" }}
                          ></i>{" "}
                          Applicants
                        </div>
                        <div
                          style={{
                            margin: "3px 0",
                            fontFamily: "Poppins",
                            fontWeight: "400",
                            fontSize: "12px",
                            padding: "0 10px",
                            marginBottom: "15px",
                          }}
                        >
                          <i
                            class="fa-solid fa-square"
                            style={{ color: "#3C598E" }}
                          ></i>{" "}
                          Vendors
                        </div>
                        <div
                          style={{
                            margin: "3px 0",
                            fontFamily: "Poppins",
                            fontWeight: "400",
                            fontSize: "12px",
                            padding: "0 10px",
                            marginBottom: "15px",
                          }}
                        >
                          <i
                            class="fa-solid fa-square"
                            style={{ color: "#5A86D5" }}
                          ></i>{" "}
                          Work Orders
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col xl={7} sm={12} lg={7} mx={12}>
                <Row
                  className="w-100 my-3 p-2  mx-4"
                  style={{
                    alignItems: "center",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    height: "390px",
                    borderRadius: "20px",
                  }}
                >
                  <Row className="w-100 px-3 my-3">
                    <Col className="d-flex justify-content-end">
                      <Dropdown isOpen={dropdownOpenPlan} toggle={togglePlan}>
                        <DropdownToggle
                          caret
                          style={{
                            backgroundColor: "rgba(50, 75, 119, 1)",
                            color: "#fff",
                          }}
                        >
                          {selectedYearPlan ? selectedYearPlan : "Select Year"}
                        </DropdownToggle>
                        <DropdownMenu
                          style={{ backgroundColor: "rgba(50, 75, 119, 1)" }}
                        >
                          <DropdownItem
                            onClick={() => handleChangePlan("This Year")}
                            style={{ color: "#fff" }}
                          >
                            This Year
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => handleChangePlan("Previous Year")}
                            style={{ color: "#fff" }}
                          >
                            Previous Year
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </Col>
                  </Row>
                  <ComparisonChartContainer poll1={"rgba(50, 75, 119, 1)"} />

                  <Col
                    style={{
                      fontSize: "16px",
                      fontFamily: "Manrope",
                      fontWeight: "700",
                    }}
                    className="pl-4 text-center"
                  >
                    Total Revenue
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Index;
