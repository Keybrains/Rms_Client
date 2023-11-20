import Chart from "chart.js";

import {
  Card,
  CardBody,
  Container,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";

import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AgentHeader from "components/Headers/AgentHeader";

const AgentdashBoard = (props) => {
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
  console.log(cookies.get("token"), "abc")


  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let  authConfig = {
        headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
        token: cookies.get("token"),
      },
    };
    // auth post method
    let res = await axios.post(
      "https://propertymanager.cloudpress.host/api/register/auth",
      { purpose: "validate access" },
      authConfig
    );
    if (res.data.statusCode !== 200) {
      // cookies.remove("token");
      navigate("/auth/login");
    }
  } else {
    navigate("/auth/login");
  }
};

React.useEffect(() => {
  chackAuth();
}, [cookies.get("token")]);

  
  const cardStyle = {
    // background: `url(${require("../assets/img/us3.jpeg").default})`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '70vh',
    alignItems: 'center',
    justifyContent: "center",
    // display: 'flex',
    fontFamily: 'sans-serif',
    fontSize: '30px',
    color: 'black',
    // textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  };
  

  React.useEffect(() => {
    chackAuth();
  }, [cookies.get("token")]);

  return (
    <>
      <AgentHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
          <div >
          <Card>
           <CardBody style={cardStyle}>
              Welcome to 302 Properties
            </CardBody>
          </Card>
          
        </div>

      </Container>
    </>
  );
};

export default AgentdashBoard;
