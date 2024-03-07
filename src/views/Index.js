/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// import { useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
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

import Header from "components/Headers/Header.js";
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { RotatingLines } from "react-loader-spinner";


const Index = (props) => {

  const { admin } = useParams();

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  let [loader, setLoader] = React.useState(true);

  let navigate = useNavigate();
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);
  const [adminData, setAdminData] = useState(null)

  console.warn(adminData, "data after decode")

  // http://192.168.1.11:4000/api/admin/company/sst

  // statusCode 200 404

  // const checkAdminExist = async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}/admin/company/${admin}`);

  //     const status = response.data.statusCode;

  //     if (status != 200) {
  //       navigate(`/${admin}/404`)
  //     }else{
  //       alert('ok')
  //     }

  //   } catch (error) {
  //     console.log("error in acheck admin exist", error)
  //   }
  // }

  // useEffect(() => {
  //   checkAdminExist()
  // }, [admin])

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
      setAdminData(jwt)
    } else {
      navigate("/auth/login");
    }
  }, []);

  const [data, setData] = useState({
    tenants: 0,
    rentals: 0,
    rentalowner: 0,
    staff: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("firsti")
        const response1 = await axios.get(`${baseUrl}/tenants/tenant_count/${accessType.admin_id}`);
        const response2 = await axios.get(`${baseUrl}/rentals/rental_count/${accessType.admin_id}`);
        const response3 = await axios.get(
          `${baseUrl}/rental_owner/rental_owner_count/${accessType.admin_id}`);
        const response4 = await axios.get(
          `${baseUrl}/staffmember/staff_count/${accessType.admin_id}`);
        console.log(response1, "firsti")
        setLoader(false);
        const newData = {
          tenants: response1.data.count,
          rentals: response2.data.count,
          rentalowner: response3.data.count,
          staff: response4.data.count,
        };

        setData(newData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [accessType]);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
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
            <Col
              xl="3"
              onClick={() => {
                navigate("/" + admin + "/propertiesTable");
              }}
            >

              <Card
                className="shadow h-100 mx-2 mt-3 pt-3"
                style={{ backgroundColor: "#d1e9fc", cursor: "pointer" }}
              >
                <CardBody className="d-flex flex-column justify-content-center  text-center">
                  <div className="d-flex align-items-center flex-column p-3">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        color: "#000080",
                        width: "70px",
                        height: "70px",
                        fontSize: "30px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(125deg, #fff 10%, #d1e9fc, #d1e9fc)",
                      }}
                    >
                      <i className="ni ni-pin-3"></i>
                    </div>
                    <div style={{ color: "#000080", fontSize: "20px" }}>
                      Properties
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#000080",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    {data.rentals}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col
              xl="3"
              onClick={() => {
                navigate("/" + admin + "/TenantsTable");
              }}
            >
              <Card
                className="shadow h-100 mx-2 mt-3 pt-3"
                style={{ backgroundColor: "#000080", cursor: "pointer" }}
              >
                <CardBody className="d-flex flex-column justify-content-center  text-center">
                  <div className="d-flex align-items-center flex-column p-3">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        color: "#d1e9fc",
                        width: "70px",
                        height: "70px",
                        fontSize: "30px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(125deg, #fff 10%, #000080, #000080)",
                      }}
                    >
                      <i className="ni ni-single-02"></i>
                    </div>
                    <div style={{ color: "#d1e9fc", fontSize: "20px" }}>
                      Tenants
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#d1e9fc",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    {data.tenants}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col
              xl="3"
              onClick={() => {
                navigate("/" + admin + "/RentalownerTable");
              }}
            >
              <Card
                className="shadow h-100 mx-2 mt-3 pt-3"
                style={{ backgroundColor: "#d1e9fc", cursor: "pointer" }}
              >
                <CardBody className="d-flex flex-column justify-content-center  text-center">
                  <div className="d-flex align-items-center flex-column p-3">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        color: "#000080",
                        width: "70px",
                        height: "70px",
                        fontSize: "30px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(125deg, #fff 10%, #d1e9fc, #d1e9fc)",
                      }}
                    >
                      <i className="ni ni-building"></i>
                    </div>
                    <div style={{ color: "#000080", fontSize: "20px" }}>
                      Rental Owners
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#000080",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    {data.rentalowner}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col
              xl="3"
              onClick={() => {
                navigate("/" + admin + "/StaffMember");
              }}
            >
              <Card
                className="shadow h-100 mx-2 mt-3 pt-3"
                style={{ backgroundColor: "#000080", cursor: "pointer" }}
              >
                <CardBody className="d-flex flex-column justify-content-center  text-center">
                  <div className="d-flex align-items-center flex-column p-3">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        color: "#d1e9fc",
                        width: "70px",
                        height: "70px",
                        fontSize: "30px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(125deg, #fff 10%, #000080, #000080)",
                      }}
                    >
                      <i className="ni ni-badge"></i>
                    </div>
                    <div style={{ color: "#d1e9fc", fontSize: "20px" }}>
                      Staff Members
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#d1e9fc",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    {data.staff}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

      </Container>
    </>
  );
};

export default Index;
