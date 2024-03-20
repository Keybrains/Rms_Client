import axios from "axios";
import SuperAdminHeader from "components/Headers/SuperAdminHeader";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
} from "reactstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Plan from "../../../assets/icons/Plans2.svg";
import PlanList from "../../../assets/icons/planlist.svg";
import inactiveplan from "../../../assets/icons/inactiveplan.svg";
import Admin from "../../../assets/icons/admin2.svg";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";

const ComparisonGraph = ({ data, poll1, poll2 }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={Object.keys(data).map((month) => ({
          month,
          "Active Plans": data[month].activePlans,
          "Inactive Plans": data[month].inactivePlans,
        }))}
        barGap={-5}
      >
        <XAxis
          dataKey="month"
          axisLine={{ stroke: "transparent" }}
          tickLine={{ stroke: "transparent" }}
          tick={{ fontFamily: "Roboto", fontSize: 14 }}
        />
        <Bar
          dataKey="Active Plans"
          fill={poll1}
          shape={({ x, y, width, height }) => {
            const radius = 12;
            return (
              <g>
                <rect
                  x={x}
                  y={y}
                  width={width * 0.8}
                  height={height}
                  fill={poll1}
                  rx={radius}
                  ry={radius}
                />
                <rect
                  x={x}
                  y={y + height - radius}
                  width={width * 0.8}
                  height={radius}
                  fill={poll1}
                />
              </g>
            );
          }}
        />
        <Bar
          dataKey="Inactive Plans"
          fill={poll2}
          shape={({ x, y, width, height }) => {
            const radius = 12;
            return (
              <g>
                <rect
                  x={x}
                  y={y}
                  width={width * 0.8}
                  height={height}
                  fill={poll2}
                  rx={radius}
                  ry={radius}
                />
                <rect
                  x={x}
                  y={y + height - radius}
                  width={width * 0.8}
                  height={radius}
                  fill={poll2}
                />
              </g>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ComparisonChartContainer = ({ poll1, poll2 }) => {
  const data = {
    Jan: { activePlans: 50, inactivePlans: 30 },
    Feb: { activePlans: 60, inactivePlans: 25 },
    March: { activePlans: 70, inactivePlans: 35 },
    April: { activePlans: 55, inactivePlans: 40 },
    May: { activePlans: 45, inactivePlans: 20 },
    June: { activePlans: 65, inactivePlans: 30 },
    July: { activePlans: 75, inactivePlans: 35 },
    Aug: { activePlans: 80, inactivePlans: 30 },
    Sept: { activePlans: 70, inactivePlans: 25 },
    Oct: { activePlans: 60, inactivePlans: 35 },
    Nov: { activePlans: 55, inactivePlans: 45 },
    Dec: { activePlans: 45, inactivePlans: 20 },
  };

  return <ComparisonGraph data={data} poll1={poll1} poll2={poll2} />;
};

const DashBoard2 = () => {
  const [accessType, setAccessType] = useState();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const [data, setData] = useState({
    admins: 0,
    plans: 0,
  });

  const fetchCounts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/admin/superadmin_count`);
      if (res.data.statusCode === 200) {
        setData({
          plans: res.data.plan,
          admins: res.data.admin,
        });
      }
    } catch (error) {
      console.error("Error: ", error.message);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [accessType]);

  function CircleProgressBar({ value }) {
    return (
      <div style={{ width: "70px", height: "70px" }}>
        <CircularProgressbar
          value={value}
          text={value}
          strokeWidth={6}
          styles={buildStyles({
            strokeLinecap: "round",
            textSize: "40px",
            pathColor: `#fff`,
            textColor: "#fff",
            trailColor: "rgba(141, 183, 223, 1)",
          })}
        />
      </div>
    );
  }

  const [selectedYearPlan, setSelectedYearPlan] = useState("This Year");
  const [selectedYearAdmin, setSelectedYearAdmin] = useState("This Year");

  const [dropdownOpenPlan, setdropdownOpenPlan] = useState(false);
  const [dropdownOpenAdmin, setdropdownOpenAdmin] = useState(false);

  const togglePlan = () => setdropdownOpenPlan((prevState) => !prevState);

  const toggleAdmin = () => {
    setdropdownOpenAdmin((prevState) => !prevState);
  };

  const handleChangePlan = (year) => {
    setSelectedYearPlan(year);
  };

  const handleChangeAdmin = (year) => {
    setSelectedYearAdmin(year);
  };

  return (
    <>
      <SuperAdminHeader prop={"My Dashboard"} />
      <Container fluid className="px-5">
        <Row>
          <Col className="order-xl-1 mt-3" xl="12">
            <Row xs="1" sm="1" md="2" lg="3">
              <Col
                className="py-3"
                style={{
                  marginBottom: "20px",
                  fontFamily: "Manrope",
                  color: "#fff",
                }}
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "230px",
                    maxWidth: "450px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                    backgroundColor: "rgba(21, 43, 81, 1)",
                  }}
                >
                  <CardBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      flexGrow: 1,
                    }}
                  >
                    <Row style={{ marginBottom: "10px" }}>
                      <Col style={{ fontSize: "28px" }} lg={12}>
                        Plans
                      </Col>
                      <Col style={{ fontSize: "18px" }} lg={12}>
                        Total: {data.plans.totalPlan}
                      </Col>
                    </Row>
                    <Row
                      style={{ marginTop: "10px" }}
                      className="w-100 d-flex justify-content-between"
                    >
                      <Col xs={6} sm={6} md={8} lg={12} xl={6}>
                        <CircleProgressBar value={data.plans.totalPlan} />
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={8}
                        lg={12}
                        xl={6}
                        className="d-flex justify-content-end"
                      >
                        <img src={Plan} width={60} height={60} />
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
                }}
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "230px",
                    maxWidth: "450px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                    backgroundColor: "rgba(50, 75, 119, 1)",
                  }}
                >
                  <CardBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      flexGrow: 1,
                    }}
                  >
                    <Row style={{ marginBottom: "10px" }}>
                      <Col style={{ fontSize: "28px" }} lg={12}>
                        Active Plans
                      </Col>
                      <Col style={{ fontSize: "18px" }} lg={12}>
                        Total: {data.plans.activePlan}
                      </Col>
                    </Row>
                    <Row
                      style={{ marginTop: "10px" }}
                      className="w-100 d-flex justify-content-between"
                    >
                      <Col xs={6} sm={6} md={8} lg={12} xl={6}>
                        <CircleProgressBar value={data.plans.activePlan} />
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={8}
                        lg={12}
                        xl={6}
                        className="d-flex justify-content-end"
                      >
                        <img src={PlanList} width={60} height={60} />
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
                }}
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "230px",
                    maxWidth: "450px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                    backgroundColor: "rgba(94, 118, 163, 1)",
                  }}
                >
                  <CardBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      flexGrow: 1,
                    }}
                  >
                    <Row style={{ marginBottom: "10px" }}>
                      <Col style={{ fontSize: "28px" }} lg={12}>
                        Inactive Plans
                      </Col>
                      <Col style={{ fontSize: "18px" }} lg={12}>
                        Total: {data.plans.inactivePlan}
                      </Col>
                    </Row>
                    <Row
                      style={{ marginTop: "10px" }}
                      className="w-100 d-flex justify-content-between"
                    >
                      <Col xs={6} sm={6} md={8} lg={12} xl={6}>
                        <CircleProgressBar value={data.plans.inactivePlan} />
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={8}
                        lg={12}
                        xl={6}
                        className="d-flex justify-content-end"
                      >
                        <img src={inactiveplan} width={60} height={60} />
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
                }}
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "230px",
                    maxWidth: "450px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                    backgroundColor: "rgba(70, 104, 166, 1)",
                  }}
                >
                  <CardBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      flexGrow: 1,
                    }}
                  >
                    <Row style={{ marginBottom: "10px" }}>
                      <Col style={{ fontSize: "28px" }} lg={12}>
                        Admin
                      </Col>
                      <Col style={{ fontSize: "18px" }} lg={12}>
                        Total: 20
                      </Col>
                    </Row>
                    <Row
                      style={{ marginTop: "10px" }}
                      className="w-100 d-flex justify-content-between"
                    >
                      <Col xs={6} sm={6} md={8} lg={12} xl={6}>
                        <CircleProgressBar value={20} />
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={8}
                        lg={12}
                        xl={6}
                        className="d-flex justify-content-end"
                      >
                        <img src={Admin} width={60} height={60} />
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
                }}
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "230px",
                    maxWidth: "450px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                    backgroundColor: "rgba(80, 119, 190, 1)",
                  }}
                >
                  <CardBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      flexGrow: 1,
                    }}
                  >
                    <Row style={{ marginBottom: "10px" }}>
                      <Col style={{ fontSize: "28px" }} lg={12}>
                        Active Admin
                      </Col>
                      <Col style={{ fontSize: "18px" }} lg={12}>
                        Total: 15
                      </Col>
                    </Row>
                    <Row
                      style={{ marginTop: "10px" }}
                      className="w-100 d-flex justify-content-between"
                    >
                      <Col xs={6} sm={6} md={8} lg={12} xl={6}>
                        <CircleProgressBar value={15} />
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={8}
                        lg={12}
                        xl={6}
                        className="d-flex justify-content-end"
                      >
                        <img src={PlanList} width={60} height={60} />
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
                }}
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "230px",
                    maxWidth: "450px",
                    borderRadius: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                    backgroundColor: "rgba(125, 157, 214, 1)",
                  }}
                >
                  <CardBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      flexGrow: 1,
                    }}
                  >
                    <Row style={{ marginBottom: "10px" }}>
                      <Col style={{ fontSize: "28px" }} lg={12}>
                        Inactive Admin
                      </Col>
                      <Col style={{ fontSize: "18px" }} lg={12}>
                        Total: 05
                      </Col>
                    </Row>
                    <Row
                      style={{ marginTop: "10px" }}
                      className="w-100 d-flex justify-content-between"
                    >
                      <Col xs={6} sm={6} md={8} lg={12} xl={6}>
                        <CircleProgressBar value={5} />
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={8}
                        lg={12}
                        xl={6}
                        className="d-flex justify-content-end"
                      >
                        <img src={inactiveplan} width={60} height={60} />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row xs="12" sm="12" md="12" lg="12">
              <Col
                className="pt-3"
                style={{
                  marginBottom: "20px",
                  fontFamily: "Manrope",
                  color: "#000",
                  fontSize: "24px",
                }}
              >
                <h1
                  className="display-2"
                  style={{ fontFamily: "manrope", fontSize: "30px" }}
                >
                  Statistics
                </h1>
              </Col>
            </Row>
            <Row className="w-100 mb-5">
              <Col xs={12} lg={6} sm={12} md={12} className="pt-3">
                <Card
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                    border: "0.3px solid rgba(82, 84, 89, 0.5)",
                    borderRadius: "12px",
                  }}
                  // className="ml-4"
                >
                  <Row className="w-100 px-3 my-3">
                    <Col
                      style={{
                        fontSize: "16px",
                        fontFamily: "Manrope",
                        fontWeight: "700",
                      }}
                      className="pl-4"
                    >
                      Plans
                    </Col>
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
                  <Row className="w-100 py-3 px-5">
                    <ComparisonChartContainer
                      poll1={"rgba(50, 75, 119, 1)"}
                      poll2={"rgba(94, 118, 163, 1)"}
                    />
                  </Row>
                  <Row className="w-100 px-3 my-1">
                    <Col
                      lg={12}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <span
                        style={{ fontFamily: "Poppins", fontSize: "15px" }}
                        className="px-3"
                      >
                        <i
                          class="fa-solid fa-circle px-1"
                          style={{ color: "rgba(50, 75, 119, 1)" }}
                        ></i>
                        Active Plans
                      </span>
                      <span
                        style={{ fontFamily: "Poppins", fontSize: "15px" }}
                        className="px-3"
                      >
                        <i
                          class="fa-solid fa-circle px-1"
                          style={{ color: "rgba(94, 118, 163, 1)" }}
                        ></i>
                        Inactive Plans
                      </span>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={12} lg={6} sm={12} md={12} className="pt-3">
                <Card
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                    border: "0.3px solid rgba(82, 84, 89, 0.5)",
                    borderRadius: "12px",
                  }}
                  // className="ml-4"
                >
                  <Row className="w-100 px-3 my-3">
                    <Col
                      style={{
                        fontSize: "16px",
                        fontFamily: "Manrope",
                        fontWeight: "700",
                      }}
                      className="pl-4"
                    >
                      Admin
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <Dropdown isOpen={dropdownOpenAdmin} toggle={toggleAdmin}>
                        <DropdownToggle
                          caret
                          style={{
                            backgroundColor: "rgba(80, 119, 190, 1)",
                            color: "#fff",
                          }}
                        >
                          {selectedYearAdmin
                            ? selectedYearAdmin
                            : "Select Year"}
                        </DropdownToggle>
                        <DropdownMenu
                          style={{ backgroundColor: "rgba(80, 119, 190, 1)" }}
                        >
                          <DropdownItem
                            onClick={() => handleChangeAdmin("This Year")}
                            style={{ color: "#fff" }}
                          >
                            This Year
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => handleChangeAdmin("Previous Year")}
                            style={{ color: "#fff" }}
                          >
                            Previous Year
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </Col>
                  </Row>
                  <Row className="w-100 py-3 px-5">
                    <ComparisonChartContainer
                      poll1={"rgba(80, 119, 190, 1)"}
                      poll2={"rgba(125, 157, 214, 1)"}
                    />
                  </Row>
                  <Row className="w-100 px-3 my-1">
                    <Col
                      lg={12}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <span
                        style={{ fontFamily: "Poppins", fontSize: "15px" }}
                        className="px-3"
                      >
                        <i
                          class="fa-solid fa-circle px-1"
                          style={{ color: "rgba(80, 119, 190, 1)" }}
                        ></i>
                        Active Admin
                      </span>
                      <span
                        style={{ fontFamily: "Poppins", fontSize: "15px" }}
                        className="px-3"
                      >
                        <i
                          class="fa-solid fa-circle px-1"
                          style={{ color: "rgba(125, 157, 214, 1)" }}
                        ></i>
                        Inactive Admin
                      </span>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DashBoard2;
