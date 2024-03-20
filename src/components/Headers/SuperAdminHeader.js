import { Row, Col } from "reactstrap";

const SuperAdminHeader = ({ prop }) => {
  return (
    <>
      <div className="header pb-3 pt-1 px-5 d-flex align-items-center">
        <Row>
          <Col>
            <h1
              style={{
                fontFamily: "manrope",
                fontSize: "30px",
                fontWeight: "700",
              }}
            >
              {prop}
            </h1>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SuperAdminHeader;
