import { Container, Row, Col } from "reactstrap";

const AddPropertyTypeHeader = () => {
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "300px",
          background:"blue",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className=" align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Add Property Type</h1>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AddPropertyTypeHeader;
