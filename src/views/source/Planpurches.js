import React, { useState } from "react";
import RentalHeader from "components/Headers/PlanHeader";
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  FormGroup,
  Form,
} from "reactstrap";
import "./plan.css";

function Planpurches() {
  const [Continue, setContinue] = useState(false);
  return (
    <>
      <RentalHeader />
      <Container fluid className="mt--7" id="home">
        <Row className=" justify-content-center">
          <Col
            xs={12}
            md={12}
            lg={12}
            className="my-5 d-flex flex-column interactive-card"
            style={{ borderTopRightRadius: "30px" }}
          >
            <div className="">
              <div
                className="homee-section card h-100 premium-cards "
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  
                }}
              >
                <div className=" card-body mb-5">
                  <div className="homee-section"> 
                    <b style={{ color: "rgb(10, 37, 59)" }}>
                      <h2>1. Enter the company Address</h2>
                    </b>
                    <p>
                      Enter the company’s headquarters to ensure accurate tax
                      information.
                    </p>
                    <Form
                      onSubmit={(event) => {
                        event.preventDefault();
                        setContinue(true);
                      }}
                    >
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-member"
                        >
                          STREET ADDRESS
                        </label>

                        <Input
                          className="mb-1"
                          style={{ width: "550px" }}
                          type="text"
                          required
                        />
                        <Input
                          className=""
                          style={{ width: "550px" }}
                          type="text"
                        />
                      </FormGroup>
                      <div className="d-flex">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-member"
                          >
                            CITY
                          </label>

                          <Input
                            className="mb-1"
                            style={{ width: "170px" }}
                            type="text"
                            required
                          />
                        </FormGroup>
                        <FormGroup className="mx-3">
                          <label
                            className="form-control-label"
                            htmlFor="input-member"
                          >
                            STATE
                          </label>

                          <Input
                            className="mb-1"
                            style={{ width: "170px" }}
                            type="select" // Set the type to "select" for dropdown
                            required
                          >
                            {/* Options for the dropdown */}
                            <option value="">Select State</option>
                            <option value="state1">State 1</option>
                            <option value="state2">State 2</option>
                          </Input>
                        </FormGroup>

                        <FormGroup className="mx-2">
                          <label
                            className="form-control-label"
                            htmlFor="input-member"
                          >
                            ZIP
                          </label>

                          <Input
                            className="mb-1"
                            style={{ width: "170px" }}
                            type="number"
                            required
                          />
                        </FormGroup>
                      </div>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-member"
                        >
                          COUNTRY
                        </label>

                        <Input
                          className="mb-1"
                          style={{ width: "550px" }}
                          type="select"
                          required
                        >
                          <option value="">Select State</option>
                          <option value="state1">COUNTRY 1</option>
                          <option value="state2">COUNTRY 2</option>
                        </Input>
                      </FormGroup>
                      <Button
                        size="sm"
                        style={{
                          background: "black",
                          color: "white",
                          width: "100px",
                          height: "50px",
                        }}
                        className="mb-5"
                      >
                        Continue
                      </Button>
                    </Form>
                    {Continue === true ? (
                      <>
                        <b style={{ color: "rgb(10, 37, 59)" }}>
                          <h2>
                            {" "}
                            2. Review subscription & enter payment information
                          </h2>
                        </b>
                        <div
                          className="card  premium-cards"
                          style={{
                            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                            width: "90%",
                          }}
                        >
                          <div
                            className=" card-body "
                            style={{ paddingLeft: "30px", color: "black" }}
                          >
                            <b style={{ color: "rgb(10, 37, 59)" }}>
                              Subtotal
                              <hr />
                            </b>
                            <div className="d-flex">
                              <p>Growth - Annual Subscription 10% Discount</p>
                              <p style={{ paddingLeft: "57%" }}>$1,880.00</p>
                            </div>
                            <p className="mb-5">
                              10 unit plan - 2/6/2024 to 2/5/2025
                            </p>
                            <div className="d-flex">
                              <p style={{ fontWeight: "bolder" }}>TOTAL:</p>
                              <p
                                style={{
                                  paddingLeft: "84%",
                                  fontWeight: "bolder",
                                }}
                              >
                                $1,880.00
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="card  premium-cards"
                          style={{
                            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                            width: "90%",
                            marginTop: "30px",
                          }}
                        >
                          <div
                            className=" card-body"
                            style={{ paddingLeft: "30px", color: "black" }}
                          >
                            <b style={{ color: "rgb(10, 37, 59)" }}>
                              Payment information
                              <hr />
                            </b>

                            <div className="d-flex">
                              <label
                                className="form-control-label px-5 mb-3"
                                htmlFor="input-member"
                              >
                                Card type
                              </label>
                              <Input
                                className="mb-3"
                                style={{ width: "400px", marginLeft: "57px" }}
                                type="text"
                                required
                              />
                            </div>
                            <div className="d-flex">
                              <label
                                className="form-control-label px-5 mb-3"
                                htmlFor="input-member"
                              >
                                Card Number
                              </label>
                              <Input
                                className="mb-3"
                                style={{ width: "400px", marginLeft: "29px" }}
                                type="text"
                                required
                              />
                            </div>
                            <div className="d-flex">
                              <label
                                className="form-control-label px-5"
                                htmlFor="input-member"
                              >
                                Expiration Date{" "}
                              </label>
                              <Input
                                className="mb-1"
                                style={{ width: "180px", marginLeft: "16px" }}
                                type="select"
                                required
                              >
                                <option value="">--Select one--</option>
                                <option value="state1">01</option>
                                <option value="state2">02</option>
                                <option value="state2">03</option>
                                <option value="state2">04</option>
                                <option value="state2">05</option>
                                <option value="state2">06</option>
                                <option value="state2">07</option>
                                <option value="state2">08</option>
                                <option value="state2">09</option>
                                <option value="state2">10</option>
                                <option value="state2">11</option>
                                <option value="state2">12</option>
                              </Input>
                              <p
                                style={{
                                  paddingLeft: "18px",
                                  paddingRight: "18px",
                                  paddingTop: "5px",
                                }}
                              >
                                /
                              </p>
                              <Input
                                className=""
                                style={{ width: "180px" }}
                                type="select"
                                required
                              >
                                <option value="">--Select one--</option>
                                <option value="state1">2024</option>
                                <option value="state2">2025</option>
                                <option value="state2">2026</option>
                                <option value="state2">2026</option>
                                <option value="state2">2027</option>
                                <option value="state2">2028</option>
                                <option value="state2">2029</option>
                                <option value="state2">2030</option>
                                <option value="state2">2031</option>
                                <option value="state2">2032</option>
                                <option value="state2">2033</option>
                                <option value="state2">2034</option>
                              </Input>
                            </div>
                            <div className="d-flex">
                              <label
                                className="form-control-label px-5"
                                htmlFor="input-member"
                              >
                                CVV{" "}
                              </label>
                              <Input
                                className="mb-1"
                                style={{ width: "400px", marginLeft: "93px" }}
                                type="text"
                                required
                              />
                            </div>
                            <div className="d-flex">
                              <label
                                className="form-control-label px-5"
                                htmlFor="input-member"
                              >
                                Cardholder Name{" "}
                              </label>
                              <Input
                                className="mb-1"
                                style={{ width: "400px" }}
                                type="text"
                                required
                              />
                            </div>
                            <Button
                              size="sm"
                              style={{
                                background: "black",
                                color: "white",
                                width: "100px",
                                height: "50px",
                                marginLeft: "218px",
                                marginTop: "40px",
                              }}
                              className="mb-5"
                            >
                              Submit
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
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

export default Planpurches;
