import { Container, Row, Col } from "reactstrap";

const SuperAdminHeader = () => {
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "300px",
          background: "blue",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <span className="mask bg-gradient-info opacity-8" />
        <Container className=" align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Super Admin DashBoard</h1>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SuperAdminHeader;