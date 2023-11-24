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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import StaffHeader from "components/Headers/StaffHeader";

const StaffDashBoard = (props) => {
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
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const cardStyle = {
    // background: `url(${require("../assets/img/us3.jpeg").default})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "70vh",
    alignItems: "center",
    justifyContent: "center",
    // display: 'flex',
    fontFamily: "sans-serif",
    fontSize: "30px",
    color: "black",
    // textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  };

  return (
    <>
      <StaffHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <div>
          <Card>
            <CardBody style={cardStyle}>Welcome to 302 Properties</CardBody>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default StaffDashBoard;
