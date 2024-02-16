import React, { useEffect, useState } from "react";
import SuperAdminHeader from "../Headers/SuperAdminHeader";
import { Card, CardHeader, Col, Container, Row } from "reactstrap";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function DashBoard() {
  const [accessType, setAccessType] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
  
  return (
    <>
      <SuperAdminHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Welcome To Super Admin DashBoard</h3>
                  </Col>
                </Row>
              </CardHeader>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DashBoard;
