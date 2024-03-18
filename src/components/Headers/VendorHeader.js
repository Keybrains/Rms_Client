import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const VendorHeader = () => {
  return (
    <>
      <div className="header pb-5 pt-4 pt-lg-6 d-flex align-items-center">
        <span className="mask opacity-8" />
        <Container className="align-items-center mt-3" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1
                // className="display-2 px-5"
                className="d-flex justify-content-start "

                style={{ fontFamily: "manrope", fontSize: "30px" }}
              >
                My Dashboard
              </h1>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default VendorHeader;
  