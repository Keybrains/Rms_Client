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
import card1 from "../../assets/img/icons/common/Union.svg";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useMediaQuery } from "@material-ui/core";
// import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
const RoundedBar = (props) => {
  const { x, y, width, height } = props;

  // Adjusted the q commands to reduce the curve to 2px
  return (
    <path
      fill={props.fill}
      d={`M${x},${y + height}h${width}v-${height + 10}q0,-2 -2,-2h-${width - 10}q-2,0 -2,2v${height + 10}`}
    />
  );
};

const ComparisonGraph = ({ data }) => {
  const isXS = useMediaQuery('(max-width: 599.95px)');
  const isSM = useMediaQuery('(min-width: 600px) and (max-width: 959.95px)');
  const isMD = useMediaQuery('(min-width: 960px) and (max-width: 1279.95px)');
  const isLG = useMediaQuery('(min-width: 1280px) and (max-width: 1919.95px)');
  const isXL = useMediaQuery('(min-width: 1920px)');

  const graphData = {
    barGap: isXL ? 4 : isLG ? 4 : isMD ? 4 : isSM ? 4 : isXS ? 4 : 0,
    barCategoryGap: isXL ? 40 : isLG ? 40 : isMD ? 40 : isSM ? 40 :  isXS ? 40 :  0

  }
  return (
    <ResponsiveContainer width="100%" height={300} margin={{ top: 0 }}>
      <BarChart
        data={Object.keys(data).map((month) => ({
          month,
          "Active Plans": data[month].activePlans,
          "Inactive Plans": data[month].inactivePlans,
        }))}
        barGap={graphData.barGap}
        barCategoryGap={graphData.barCategoryGap}
      >
        <XAxis
          dataKey="month"
          axisLine={{ stroke: "transparent" }}
          tickLine={{ stroke: "transparent" }}
        />
        <Bar
          dataKey="Active Plans"
          fill="#152B51"
          // shape={<RoundedBar />}
          stroke="#000"
        />
        <Bar
          dataKey="Inactive Plans"
          fill="#5A86D5"
        // shape={<RoundedBar />}
        />
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

  // const data = {
  //   January: { activePlans: 50, inactivePlans: 30 },
  //   February: { activePlans: 60, inactivePlans: 25 },
  //   March: { activePlans: 70, inactivePlans: 35 },
  //   April: { activePlans: 55, inactivePlans: 40 },
  //   May: { activePlans: 45, inactivePlans: 20 },
  //   June: { activePlans: 65, inactivePlans: 30 },
  //   July: { activePlans: 75, inactivePlans: 35 },
  //   August: { activePlans: 50, inactivePlans: 30 },
  //   September: { activePlans: 70, inactivePlans: 25 },
  //   October: { activePlans: 60, inactivePlans: 35 },
  //   November: { activePlans: 55, inactivePlans: 45 },
  //   December: { activePlans: 45, inactivePlans: 20 },
  // };

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto" }}>
      <ComparisonGraph data={data} />
    </div>
  );
};


// const ComparisonGraph = ({ data }) => {

//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <BarChart
//         data={Object.keys(data).map((month) => ({
//           month,
//           "Active Plans": data[month].activePlans,
//           "Inactive Plans": data[month].inactivePlans,
//         }))}
//         barGap={5}
//         barCategoryGap={20}
//       >
//         <XAxis
//           dataKey="month"
//           axisLine={{ stroke: "transparent" }}
//           tickLine={{ stroke: "transparent" }}
//         />
//         <Bar dataKey="Active Plans" fill="#152B51" />
//         <Bar dataKey="Inactive Plans" fill="#5A86D5" />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

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
      if (accessType?.vendor_id && accessType?.admin_id) {
        try {
          const response = await axios.get(
            `${baseUrl}/vendor/dashboard_workorder/${accessType?.vendor_id}/${accessType?.admin_id}`
          );
          if (response.status === 200) {
            const { data } = response.data;
            setNewWorkOrders(data.new_workorder);
            setOverdueWorkOrders(data.overdue_workorder);
            console.log(data.new_workorder, data.overdue_workorder, "jack")
            console.log(`${baseUrl}/vendor/dashboard_workorder/${accessType?.vendor_id}/${accessType?.admin_id}`, "jaaa")

          } else {
            console.error("Failed to fetch work orders");
          }
        } catch (error) {
          console.error("Error fetching work orders:", error);
        }
        finally {
          setLoader(false);
        }

      };
    }
    fetchWorkOrders();
  }, [accessType]);

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
      <VendorHeader />

      <Container className="mt--10" fluid
      // style={{ backgroundColor: "#fff" }}
      >
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
              <Row lg="12" className="d-flex" >
                <Col lg="2" md="6" sm="12" xs="12">
                  <Card
                    style={{
                      justifyContent: "center",
                      fontFamily: "sans-serif",
                      fontSize: "20px",
                      color: "white",
                      borderRadius: "16px",
                      width: "180px",
                      height: "180px",
                      background: "#152B51",
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                    }}
                  >
                    <CardBody>
                      <div className="mb-2 d-flex justify-content-start">
                        <span style={{ fontWeight: "bold", fontSize: "28px", width: "40px", height: "40px" }}>
                          {" "}
                          <i className="fa-solid fa-file-lines" style={{ backgroundColor: "#152B51", borderRadius: "50%", padding: "14px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.7)" }}></i>

                        </span>
                      </div>
                      <div className="col-lg-6" style={{ width: "40px", height: "32px", marginTop: "25px" }}>
                        <div className="d-flex justify-content-start mb-2">
                          <span className="">
                            {newWorkOrders.length}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-start " style={{ marginTop: "15px" }}>
                        <p style={{ fontSize: "12px", marginLeft: "10px" }}>New Work Orders</p>
                      </div>
                    </CardBody>
                  </Card>
                  <label
                    className="d-flex justify-content-center mt-2"
                    style={{
                      cursor: "pointer", color: "white", backgroundColor: "#152B51", width: "180px", height: "34px",
                      borderRadius: "6px", padding: "6px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                    }}
                    // onClick={handleViewMoreOverdueOrders}
                    onClick={() => navigate("/vendor/vendorworktable")}
                  >
                    {/* <span style={{ borderBottom: "2px solid #D7E0FF" }}>  {showMoreOverdueOrders ? "View Less" : "View All"}</span> */}
                    <span style={{ borderBottom: "2px solid #D7E0FF" }}>  View All</span>


                  </label>
                </Col>
                <Col lg="2" md="6" sm="12" xs="12">
                  <Card
                    style={{
                      justifyContent: "center",
                      fontFamily: "sans-serif",
                      fontSize: "20px",
                      color: "white",
                      borderRadius: "16px",
                      width: "180px",
                      height: "180px",
                      background: "#5A86D5",
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",
                    }}
                  >
                    <CardBody>
                      <div className="mb-2 d-flex justify-content-start">
                        <span style={{ fontWeight: "bold", fontSize: "28px", width: "40px", height: "40px" }}>
                          {" "}
                          <i className="fa-solid fa-hourglass-end" style={{ backgroundColor: "#5A86D5", borderRadius: "50%", padding: "14px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.7)" }}></i>

                        </span>
                      </div>
                      <div className="col-lg-6" style={{ width: "40px", height: "32px", marginTop: "25px" }}>
                        <div className="d-flex justify-content-start mb-2">
                          <span className="">
                            {newWorkOrders.length}
                          </span>
                        </div>
                      </div>
                      <div
                        className=" "
                        style={{ marginTop: "15px", }}
                      >
                        <p style={{ fontSize: "12px", marginLeft: "10px" }}>Overdue Work Orders</p>
                      </div>
                    </CardBody>
                  </Card>
                  <label
                    className="d-flex justify-content-center mt-2"
                    style={{
                      cursor: "pointer", color: "white", backgroundColor: "#5A86D5", width: "180px", height: "34px",
                      borderRadius: "6px", padding: "6px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0",

                    }}
                    // onClick={handleViewMoreOverdueOrders}
                    onClick={() =>
                      navigate("/vendor/vendorworktable?status=Over Due")
                    }
                  >
                    <span style={{ borderBottom: "2px solid #D7E0FF" }}>  View All </span>

                  </label>
                </Col>

              </Row>
              {/* <Row  className="d-flex justi">
            <Col lg="12">
              <Col lg="6">
              
              Statistics

              </Col>
              <Col lg="6">
              
              <span>Statistics</span>
              <span>Statistics</span>

              

              </Col>
            </Col>
            </Row> */}
              <Row style={{ fontFamily: "poppins" }}>
                <Col xs={12} lg={10} sm={12} md={10}>
                  <div className="d-flex mt-3">
                    <div className="mr-auto p-2" style={{ fontSize: "24px", fontWeight: "bold", color: "black" }}>Statistics</div>
                    <div className="px-1 py-0 d-flex align-items-center" style={{ backgroundColor: "#CEE9FF", borderRadius: "5px", width: "155px", height: "34px" }}>
                      <i className="fa-solid fa-square mx-2" style={{ color: "#152B51" }}></i>
                      <span style={{ color: "#1C1C1E", fontSize: "12px", }}>New Work Orders</span>
                    </div>
                    <div className="px-1 py-0 d-flex align-items-center ml-5" style={{ backgroundColor: "#CEE9FF", borderRadius: "5px", width: "155px", height: "34px" }}>
                      <i className="fa-solid fa-square mx-2" style={{ color: "#5A86D5" }}></i>
                      <span style={{ color: "#1C1C1E", fontSize: "12px", }}>Overdue Work Orders</span>
                    </div>
                  </div>
                </Col>
              </Row>


              <Row className="mt-3 mb-3" >
                <Col xs={12} lg={11} xl={10} sm={12} md={12} style={{ border: "0.5px Solid #A8A9AC", borderRadius: "20px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 4px 0", }}>
                  <Col className="d-flex justify-content-end mt-3 mb-3">
                    <Dropdown isOpen={dropdownOpenPlan} toggle={togglePlan} style={{ width: "180px", borderRadius: "16px" }} >
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
                          style={{ color: "#fff", backgroundColor: "transparent" }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = "#5A86D5"}
                          onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                        >
                          This Year
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleChangePlan("Previous Year")}
                          style={{ color: "#fff", backgroundColor: "transparent" }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = "#5A86D5"}
                          onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
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
