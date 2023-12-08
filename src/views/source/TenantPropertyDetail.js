import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Table, Container, Row, Card, CardHeader } from "reactstrap";
import TenantsHeader from "components/Headers/TenantsHeader";
import { FormGroup, Col, Button } from "reactstrap";
import { jwtDecode } from "jwt-decode";
import { OpenImageDialog } from "components/OpenImageDialog";
import Cookies from "universal-cookie";
import card from "../../assets/img/theme/angular.jpg";

const TenantPropertyDetail = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { rental_adress } = useParams();
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const getRentalData = async () => {
      try {
        //const encodedAddress = encodeURIComponent(rental_adress);
        const url = `${baseUrl}/rentals/Rentals_summary/tenant/${rental_adress}`;

        const response = await axios.get(url);
        setPropertyDetails(response.data.data);
        //console.log(response.data.data);
        setPropertyLoading(false);
      } catch (error) {
        setPropertyError(error);
        setPropertyLoading(false);
      }
    };
    getRentalData();
  }, [rental_adress]);

  return (
    <>
      <TenantsHeader />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Details</h1>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/tenant/tenantproperty")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <br />
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Summary</h3>
              </CardHeader>
              <div className="table-responsive">
                <div className="row m-3">
                  <div className="col-12">
                    <div
                      className="align-items-center table-flush"
                      responsive
                      style={{ width: "100%" }}
                    >
                      <div className="w-100">
                        <div className="card mb-3 col-6">
                          <div className="row g-0">
                            <div className="col-md-4">
                              <img
                                src={card}
                                className="img-fluid rounded-start"
                                alt="..."
                              />
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <h5 className="card-title">Property details</h5>
                                <p className="card-text">
                                  <small className="text-muted">Address</small>
                                </p>
                                <p className="card-text">
                                  flat Vijatraj Nagar canada canada 12345
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Row
                          className="w-100 my-3 "
                          style={{
                            fontSize: "18px",
                            textTransform: "capitalize",
                            color: "#022d60",
                            fontWeight: "600",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          <Col>Property Details</Col>
                        </Row>
                        <Row
                          className="mb-1 m-0 p-0"
                          style={{ fontSize: "12px", color: "#000" }}
                        >
                          <Table>
                            <tbody
                              className="tbbody p-0 m-0"
                              style={{
                                borderTopRightRadius: "5px",
                                borderTopLeftRadius: "5px",
                                borderBottomLeftRadius: "5px",
                                borderBottomRightRadius: "5px",
                              }}
                            >
                              <tr className="header">
                                <th>Property Details</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>Country</th>
                                <th>Post code</th>
                              </tr>

                              <tr className="body">
                                <td>home</td>
                                <td>Bhavnagar</td>
                                <td>Bhavnagar</td>
                                <td>India</td>
                                <td>364003</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Row>
                        <Row
                          className="w-100 my-3 "
                          style={{
                            fontSize: "18px",
                            textTransform: "capitalize",
                            color: "#022d60",
                            fontWeight: "600",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          <Col>Rental owner detail</Col>
                        </Row>
                        <Row
                          className="mb-1 m-0 p-0"
                          style={{ fontSize: "12px", color: "#000" }}
                        >
                          <Table>
                            <tbody
                              className="tbbody p-0 m-0"
                              style={{
                                borderTopRightRadius: "5px",
                                borderTopLeftRadius: "5px",
                                borderBottomLeftRadius: "5px",
                                borderBottomRightRadius: "5px",
                              }}
                            >
                              <tr className="header">
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Compnay name</th>
                                <th>Email</th>
                                <th>Phone no</th>
                                <th>Home no</th>
                                <th>Business no</th>
                              </tr>

                              <tr className="body">
                                <td>Shivam</td>
                                <td>Shukla</td>
                                <td>Sparrow</td>
                                <td>shiv@gmail.com</td>
                                <td>7878987856</td>
                                <td>45/B</td>
                                <td>9913943467</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Row>
                        <Row
                          className="w-100 my-3 "
                          style={{
                            fontSize: "18px",
                            textTransform: "capitalize",
                            color: "#022d60",
                            fontWeight: "600",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          <Col>Account detail</Col>
                        </Row>
                        <Row
                          className="mb-1 m-0 p-0"
                          style={{ fontSize: "12px", color: "#000" }}
                        >
                          <Table>
                            <tbody
                              className="tbbody p-0 m-0"
                              style={{
                                borderTopRightRadius: "5px",
                                borderTopLeftRadius: "5px",
                                borderBottomLeftRadius: "5px",
                                borderBottomRightRadius: "5px",
                              }}
                            >
                              <tr className="header">
                                <th>Operating account</th>
                                <th>Profit reserve</th>
                              </tr>

                              <tr className="body">
                                <td>Testing</td>
                                <td>Hello</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Row>
                        <Row
                          className="w-100 my-3 "
                          style={{
                            fontSize: "18px",
                            textTransform: "capitalize",
                            color: "#022d60",
                            fontWeight: "600",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          <Col>Staff detail</Col>
                        </Row>
                        <Row
                          className="mb-1 m-0 p-0"
                          style={{ fontSize: "12px", color: "#000" }}
                        >
                          <Table>
                            <tbody
                              className="tbbody p-0 m-0"
                              style={{
                                borderTopRightRadius: "5px",
                                borderTopLeftRadius: "5px",
                                borderBottomLeftRadius: "5px",
                                borderBottomRightRadius: "5px",
                              }}
                            >
                              <tr className="header">
                                <th>Staff member</th>
                              </tr>

                              <tr className="body">
                                <td>Shivam</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Row>
                        <Row
                          className="w-100 my-3 "
                          style={{
                            fontSize: "18px",
                            textTransform: "capitalize",
                            color: "#022d60",
                            fontWeight: "600",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          <Col>Unit detail</Col>
                        </Row>
                        <Row
                          className="mb-1 m-0 p-0"
                          style={{ fontSize: "12px", color: "#000" }}
                        >
                          <Table>
                            <tbody
                              className="tbbody p-0 m-0"
                              style={{
                                borderTopRightRadius: "5px",
                                borderTopLeftRadius: "5px",
                                borderBottomLeftRadius: "5px",
                                borderBottomRightRadius: "5px",
                              }}
                            >
                              <tr className="header">
                                <th>Unit</th>
                                <th>Unit address</th>
                                <th>Bed</th>
                                <th>Bath</th>
                                <th>Squrefit</th>
                              </tr>

                              <tr className="body">
                                <td>1</td>
                                <td>Bhavnagar</td>
                                <td>3</td>
                                <td>3</td>
                                <td>1000</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Row>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default TenantPropertyDetail;
