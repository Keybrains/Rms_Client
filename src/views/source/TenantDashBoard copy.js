import React, { useEffect, useState } from "react";
import TenantsHeader from "components/Headers/TenantsHeader";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom/dist";
import axios from "axios";
import moment from "moment";
import { Pie } from "react-chartjs-2";

// ======== icons ============
import Work from "../../assets/icons/Work Light.svg";
import ArrowRight from "../../assets/icons/ArrowRight.svg";
import Balance from "../../assets/icons/Balance.svg";
import Key from "../../assets/icons/Key.svg";
import Timer from "../../assets/icons/Timer.svg";
import Calender from "../../assets/icons/Calender.svg";
import Circle1 from "../../assets/icons/Circle1.svg";
import Circle2 from "../../assets/icons/Circle2.svg";

const TenantDashBoard = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
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

  const [totalWorkOrder, setTotalWorkOrder] = useState([]);
  const [newWorkOrders, setNewWorkOrders] = useState([]);
  const [overdueWorkOrders, setOverdueWorkOrders] = useState([]);
  const fetchworkorder = async () => {
    if (accessType?.tenant_id && accessType?.admin_id) {
      try {
        const newResponse = await axios.get(
          `${baseUrl}/tenant/dashboard_workorder/${accessType?.tenant_id}`
        );
        setNewWorkOrders(newResponse.data.data.new_workorder);
        setOverdueWorkOrders(newResponse.data.data.overdue_workorder);
        setTotalWorkOrder(newResponse.data.data.total);
      } catch (error) {
        console.error("Error: ", error.message);
      }
    }
  };

  const [leaseData, setLeaseData] = useState(0);
  const [tenantBalance, setTenantBalance] = useState(0);
  const fetchPropertyCount = async () => {
    if (accessType?.tenant_id) {
      try {
        const property = await axios.get(
          `${baseUrl}/tenant/count/${accessType?.tenant_id}`
        );
        setLeaseData(property?.data?.data);

        const balance = await axios.get(
          `${baseUrl}/payment/tenant_financial/${accessType?.tenant_id}`
        );
        setTenantBalance(balance?.data?.totalBalance);
      } catch (error) {
        console.error("Error: ", error.message);
      }
    }
  };

  useEffect(() => {
    fetchworkorder();
    fetchPropertyCount();
  }, [accessType]);

  const PieChart = ({ data }) => {
    const chartData = {
      labels: ["Overdue Work Orders", "New Work Orders"],
      datasets: [
        {
          data: data,
          backgroundColor: ["rgba(90, 134, 213, 1)", "rgba(21, 43, 81, 1)"],
          hoverBackgroundColor: [
            "rgba(90, 134, 213, 1)",
            "rgba(21, 43, 81, 1)",
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
      <div style={{ width: "250px", height: "250px" }}>
        <Pie data={chartData} options={options} />
      </div>
    );
  };

  return (
    <>
      <TenantsHeader prop={"My Dashboard"} />
      <Container fluid className="px-5">
        <Row>
          <Col className="order-xl-1 mt-3" xl="12">
            <Row xs="1" sm="2" md="2" lg="3" xl="5" className="px-3 pt-3 pb-1">
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
                    height: "250px",
                    margin: "auto 5px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                    backgroundColor: "rgba(21, 43, 81, 1)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => navigate("/tenant/tenantwork")}
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
                            padding: "25px",
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
                            fontSize: "25px",
                            fontWeight: "600",
                          }}
                        >
                          {totalWorkOrder?.toString()?.padStart(2, "0") || "00"}
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
                        >
                          Work Orders{" "}
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
                    height: "250px",
                    margin: "auto 5px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                    backgroundColor: "rgba(40, 60, 95, 1)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => navigate("/tenant/tenantFinancial")}
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
                            padding: "25px",
                            boxShadow: "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                          }}
                        >
                          <img src={Balance} height={25} width={25} />
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
                          {tenantBalance?.toString()?.padStart(2, "0") || "00"}
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
                        >
                          Balance{" "}
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
                    height: "250px",
                    margin: "auto 5px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                    backgroundColor: "rgba(50, 75, 119, 1)",
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
                            padding: "25px",
                            boxShadow: "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                          }}
                        >
                          <img src={Key} height={25} width={25} />
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
                          {leaseData?.rent?.toString()?.padStart(2, "0") ||
                            "00"}
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
                        >
                          Monthly Rent
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
                    height: "250px",
                    margin: "auto 5px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                    backgroundColor: "rgba(60, 89, 142, 1)",
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
                            padding: "25px",
                            boxShadow: "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                          }}
                        >
                          <img src={Timer} height={25} width={25} />
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
                          {leaseData?.due_date
                            ? moment(leaseData?.due_date).format("YYYY/MM/DD")
                            : "----/--/--"}
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
                        >
                          Due Date
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
                    height: "250px",
                    margin: "auto 5px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                    backgroundColor: "rgba(90, 134, 213, 1)",
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
                            padding: "25px",
                            boxShadow: "rgba(0, 0, 0, 0.75) 0 4px 4px 0",
                          }}
                        >
                          <img src={Calender} height={25} width={25} />
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
                          {leaseData?.end_date
                            ? moment(leaseData?.end_date).format("YYYY/MM/DD")
                            : "----/--/--"}
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
                        >
                          Lease End Date
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="w-100">
              <Col xs={12} sm={12} md={12} lg={7} xl={7}>
                <Row className="pl-2">
                  <Col className="pt-3" xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Col className="py-5">
                      <Card
                        style={{
                          cursor: "pointer",
                          height: "200px",
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
                                height: "55px",
                                backgroundColor: "rgba(21, 43, 81, 1)",
                                borderTopLeftRadius: "20px",
                                borderTopRightRadius: "20px",
                                color: "#fff",
                                fontFamily: "Poppins",
                                fontWeight: "600",
                                fontSize: "20px",
                              }}
                              className="d-flex justify-content-center align-items-center"
                            >
                              New Work Orders
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
                              className="py-3"
                            >
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontWeight: "600",
                                  fontSize: "25px",
                                  color: "rgba(90, 134, 213, 1)",
                                }}
                                className="d-flex justify-content-center align-items-center py-3"
                              >
                                Total :{" "}
                                {newWorkOrders
                                  ? newWorkOrders.toString().padStart(2, "0")
                                  : "00"}
                              </span>
                              <span className="d-flex justify-content-center align-items-center pt-2">
                                <span
                                  style={{
                                    padding: "4px 50px",
                                    backgroundColor: "rgba(21, 43, 81, 1)",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    fontFamily: "Poppins",
                                    fontWeight: "600",
                                    fontSize: "18px",
                                  }}
                                  onClick={() =>
                                    navigate("/tenant/tenantwork?status=New")
                                  }
                                >
                                  View All
                                </span>
                              </span>
                            </CardBody>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Col>

                  <Col className="pt-3" xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Col className="py-5">
                      <Card
                        style={{
                          cursor: "pointer",
                          height: "200px",
                          borderRadius: "20px",
                          boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Row>
                          <Col>
                            <span
                              style={{
                                width: "100%",
                                height: "55px",
                                backgroundColor: "rgba(90, 134, 213, 1)",
                                borderTopLeftRadius: "20px",
                                borderTopRightRadius: "20px",
                                color: "#fff",
                                fontFamily: "Poppins",
                                fontWeight: "600",
                                fontSize: "20px",
                              }}
                              className="d-flex justify-content-center align-items-center"
                            >
                              Overdue Work Orders
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
                              className="py-3"
                            >
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontWeight: "600",
                                  fontSize: "25px",
                                  color: "rgba(90, 134, 213, 1)",
                                }}
                                className="d-flex justify-content-center align-items-center py-3"
                              >
                                Total :{" "}
                                {overdueWorkOrders
                                  ? overdueWorkOrders
                                      .toString()
                                      .padStart(2, "0")
                                  : "00"}
                              </span>
                              <span className="d-flex justify-content-center align-items-center pt-2">
                                <span
                                  style={{
                                    padding: "4px 50px",
                                    backgroundColor: "rgba(90, 134, 213, 1)",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    fontFamily: "Poppins",
                                    fontWeight: "600",
                                    fontSize: "18px",
                                  }}
                                  onClick={() =>
                                    navigate(
                                      "/tenant/tenantwork?status=Overdue"
                                    )
                                  }
                                >
                                  View All
                                </span>
                              </span>
                            </CardBody>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Col>
                </Row>
              </Col>

              <Col className="pt-3" xs={12} sm={12} md={12} lg={5} xl={5}>
                <Col
                  style={{
                    marginBottom: "20px",
                    fontFamily: "Manrope",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="pt-5 pb-1"
                >
                  <Card
                    style={{
                      cursor: "pointer",
                      height: "460px",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "transparent",
                      border: "none",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PieChart
                      data={[overdueWorkOrders || 0, newWorkOrders || 0]}
                    />

                    <CardBody
                      style={{
                        flexGrow: 1,
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
                          fontSize: "22px",
                          padding: "0 10px",
                        }}
                      >
                        <img src={Circle1} width={22} height={22} /> New Work
                        Orders
                      </div>
                      <div
                        style={{
                          margin: "3px 0",
                          fontFamily: "Poppins",
                          fontWeight: "400",
                          fontSize: "22px",
                          padding: "0 10px",
                        }}
                      >
                        <img src={Circle2} width={22} height={22} /> Overdue
                        Work Orders
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TenantDashBoard;
