import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const TenantsHeader = (props) => {
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
              <h1 className="display-2 text-white">
                {props.id ? "Edit Tenant" : "Add Tenant"}
              </h1>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default TenantsHeader;
