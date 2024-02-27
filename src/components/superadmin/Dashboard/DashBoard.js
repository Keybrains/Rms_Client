import React, { useEffect, useState } from "react";
import SuperAdminHeader from "../Headers/SuperAdminHeader";
import { Card, CardHeader, Col, Container, Row } from "reactstrap";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DashBoard() {
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
      console.log(baseUrl);
      const res = await axios.get(
        `${baseUrl}/admin/superadmin_count`
      );
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

  return (
    <>
      <SuperAdminHeader />
      <Container className="mt--5" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <div className="container">
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2">
                <div
                  className="cards col mb-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/superadmin/plans")}
                >
                  <div
                    className="card"
                    style={{
                      backgroundColor: "white",
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      borderRadius: "10px",
                    }}
                  >
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h1 className="card-title">Plans</h1>
                      <p className="my-2 h1">{data?.plans}</p>
                    </div>
                  </div>
                </div>
                <div
                  className="cards col mb-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/superadmin/admin")}
                >
                  <div
                    className="card"
                    style={{
                      backgroundColor: "white",
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      borderRadius: "10px",
                    }}
                  >
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h1 className="card-title">Admin</h1>
                      <p className="my-2 h1">{data?.admins}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DashBoard;
