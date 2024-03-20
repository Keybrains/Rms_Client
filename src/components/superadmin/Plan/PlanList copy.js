import SuperAdminHeader from "components/Headers/SuperAdminHeader";
import React from "react";
import { Col, Container, Row } from "reactstrap";

const PlanList = () => {
  return (
    <>
      <SuperAdminHeader prop={"Plans"} />

      <Container className="mt--5" fluid>
        <Row>
          <Col className="order-xl-1 mt-3" xl="12"></Col>
        </Row>
      </Container>
    </>
  );
};

export default PlanList;
