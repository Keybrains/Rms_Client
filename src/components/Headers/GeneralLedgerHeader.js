import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, FormGroup } from "reactstrap";

const GeneralLedgerHeader = () => {
  const navigate = useNavigate();
  const {admin} = useParams()

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
        <span className="mask bg-gradient-info opacity-8" />
        {/* Header container */}
        <Container fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>General Ledger</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" >
            <Button
              color="primary"
              ////  href="#rms"
              onClick={() => navigate("/"+admin+"/addgeneralledger")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add General Ledger
            </Button>
          </Col>
        </Row>
        </Container>
      </div>
    </>
  );
};

export default GeneralLedgerHeader;
