import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
} from "reactstrap";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

import { useState } from "react";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Header from "components/Headers/Header";

const SumProperties = () => {
  const [prodropdownOpen, setproDropdownOpen] = React.useState(false);

  const [selectedProp, setSelectedProp] = useState("Select");
  let [rentalsData, setRentalsData] = useState();

  const toggle = () => setproDropdownOpen((prevState) => !prevState);

  const [open, setOpen] = React.useState(false);

  let getRentalsData = async (id) => {
    let responce = await axios.get(
      "http://localhost:4000/api/rentals/rentals_summary/6502f925be676a11da6ae793"
    );
    setRentalsData(responce.data.data);
  };
  let navigate = useNavigate()

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    getRentalsData();
  }, []);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="summary">Summary</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-member"
                          >
                            Property Details
                          </label>
                          <br />
                          <br />

                          <div></div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>
                  <hr className="my-4" />
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Photo
                          </label>
                          <br />
                          <br />
                          {/* <Input
                                        className="form-control-alternative"
                                        id="input-staffmember-desg"
                                        placeholder="Manager"
                                        type="text"
                                        name='staffmember_designation'
                                        onBlur={StaffMemberFormik.handleBlur}
                                        onChange={StaffMemberFormik.handleChange}
                                        value={StaffMemberFormik.values.staffmember_designation}
                                        />
                                        {StaffMemberFormik.touched.staffmember_designation &&
                                          StaffMemberFormik.errors.staffmember_designation ? (
                                            <div style={{ color: "red" }}>
                                              {StaffMemberFormik.errors.staffmember_designation}
                                            </div>
                                          ) : null} */}
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>

                  <button
                    color="primary"
                    href="#rms"
                    className="btn btn-primary"
                    onClick={handleClose}
                    size="sm"
                    style={{ background: "white", color: "black" }}
                  >
                    Back
                  </button>
                </Form>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SumProperties;
