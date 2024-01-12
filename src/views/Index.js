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
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
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

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
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

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let response1 = await axios.get(
          `https://propertymanager.cloudpress.host/api/tenant/tenants/count`
        );
        setData((prevData) => ({
          ...prevData,
          tenants: response1.data.totalCount,
        }));
      } catch (error) {
        console.log(error);
      }
      try {
        let response2 = await axios.get(
          `https://propertymanager.cloudpress.host/api/rentals/rentals/count`
        );
        setData((prevData) => ({
          ...prevData,
          rentals: response2.data.totalCount,
        }));
      } catch (error) {
        console.log(error);
      }
      try {
        let response3 = await axios.get(
          `https://propertymanager.cloudpress.host/api/rentals/rentalowner/count`
        );
        setData((prevData) => ({
          ...prevData,
          rentalowner: response3.data.totalCount,
        }));
      } catch (error) {
        console.log(error);
      }
      try {
        let response4 = await axios.get(
          `https://propertymanager.cloudpress.host/api/addstaffmember/staff/count`
        );
        setData((prevData) => ({
          ...prevData,
          staff: response4.data.totalCount,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col
            xl="3"
            onClick={() => {
              navigate("/admin/propertiesTable");
            }}
          >
            <Card
              className="shadow h-100 mx-2 mt-3 pt-3"
              style={{ backgroundColor: "#d1e9fc", cursor: 'pointer' }}
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
              navigate("/admin/TenantsTable");
            }}
          >
            <Card
              className="shadow h-100 mx-2 mt-3 pt-3"
              style={{ backgroundColor: "#000080", cursor: 'pointer' }}
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
              navigate("/admin/propertiesTable");
            }}
          >
            <Card
              className="shadow h-100 mx-2 mt-3 pt-3"
              style={{ backgroundColor: "#d1e9fc", cursor: 'pointer' }}
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
              navigate("/admin/StaffMember");
            }}
          >
            <Card
              className="shadow h-100 mx-2 mt-3 pt-3"
              style={{ backgroundColor: "#000080", cursor: 'pointer' }}
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
      </Container>
    </>
  );
};

export default Index;
