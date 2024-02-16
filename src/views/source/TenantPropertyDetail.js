import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Table, Container, Row, Card, CardHeader } from "reactstrap";
import TenantsHeader from "components/Headers/TenantsHeader";
import { FormGroup, Col, Button } from "reactstrap";
import { jwtDecode } from "jwt-decode";
import PropImage from "../../assets/img/icons/common/pexels-binyamin-mellish-186077.jpg";

const TenantPropertyDetail = () => {
  const { lease_id } = useParams();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  
  const [accessType, setAccessType] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
  
  const [propertyDetails, setPropertyDetails] = useState([]);
  const getRentalData = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/leases/lease_summary/${lease_id}`
      );
      setPropertyDetails(res.data.data[0]);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
  };

  useEffect(() => {
    getRentalData();
  }, [lease_id]);

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
              //  href="#rms"
              onClick={() => navigate("/tenant/tenantproperty")}
              size="sm"
              style={{ background: "white", color: "#263238" }}
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
                {/* {propertyDetails?.map((propertyDetails) => ( */}
                <>
                  {/* {propertyDetails?.entries?.map((entry) => ( */}
                  <>
                    <div className="row m-3">
                      <div className="col-12">
                        <div
                          className="align-items-center table-flush"
                          responsive
                          style={{ width: "100%" }}
                        >
                          <div className="w-100">
                            <div class="card mb-3 col-md-2">
                              <div className="row g-0">
                                <div className="col-md-4">
                                  <img
                                    className="mt-2 mb-2"
                                    src={
                                      propertyDetails?.rental_data
                                        ?.prop_image || PropImage
                                    }
                                    // src={PropImage}
                                    alt="Property Details"
                                    style={{ maxWidth: "8rem" }}
                                  />
                                </div>
                                {/* <div className="col-md-8">
                                  <div className="card-body">
                                    <h5
                                      className="card-title"
                                      style={{ color: "#263238" }}
                                    >
                                      Property Details
                                    </h5>
                                    <p className="card-text">
                                      <small className="text-muted">
                                        Address
                                      </small>
                                    </p>
                                    <p className="card-text">
                                      {
                                        propertyDetails?.property_type_data
                                          ?.propertysub_type
                                      }{" "}
                                      |{" "}
                                      {
                                        propertyDetails?.rental_data
                                          ?.rental_adress
                                      }
                                    </p>
                                  </div>
                                </div> */}
                              </div>
                            </div>
                            <Row
                              className="w-100 my-3 "
                              style={{
                                fontSize: "18px",
                                textTransform: "capitalize",
                                color: "#263238",
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
                                    <td>
                                      {
                                        propertyDetails?.rental_data
                                          ?.property_type
                                      }
                                    </td>
                                    <td>
                                      {
                                        propertyDetails?.rental_data
                                          ?.rental_adress
                                      }
                                    </td>
                                    <td>
                                      {
                                        propertyDetails?.rental_data
                                          ?.rental_city
                                      }
                                    </td>
                                    <td>
                                      {
                                        propertyDetails?.rental_data
                                          ?.rental_country
                                      }
                                    </td>
                                    <td>
                                      {
                                        propertyDetails?.rental_data
                                          ?.rental_postcode
                                      }
                                    </td>
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
                              <Col style={{ color: "#263238" }}>
                                Rental owner detail
                              </Col>
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
                                  </tr>

                                  <tr className="body">
                                    <td>
                                      {
                                        propertyDetails?.rentalowner_data
                                          ?.rentalOwner_firstName
                                      }
                                    </td>
                                    <td>
                                      {
                                        propertyDetails?.rentalowner_data
                                          ?.rentalOwner_lastName
                                      }
                                    </td>
                                    <td>
                                      {
                                        propertyDetails?.rentalowner_data
                                          ?.rentalOwner_companyName
                                      }
                                    </td>
                                    <td>
                                      {
                                        propertyDetails?.rentalowner_data
                                          ?.rentalOwner_primaryEmail
                                      }
                                    </td>
                                    <td>
                                      {
                                        propertyDetails?.rentalowner_data
                                          ?.rentalOwner_phoneNumber
                                      }
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </Row>
                            {/* <Row
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
                                </Row> */}
                            <Row
                              className="w-100 my-3 "
                              style={{
                                fontSize: "18px",
                                textTransform: "capitalize",
                                color: "#263238",
                                fontWeight: "600",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              <Col>Staff Details</Col>
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
                                    <td>
                                      {propertyDetails?.staffmember_data
                                        ?.staffmember_name ||
                                        "No staff member assigned"}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </Row>
                            <Row
                              className="w-100 my-3 "
                              style={{
                                fontSize: "18px",
                                textTransform: "capitalize",
                                color: "#263238",
                                fontWeight: "600",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              <Col>Unit Details</Col>
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

                                  <tr
                                    // key={index}
                                    // onClick={() => {
                                    //   // setPropSummary(true);
                                    //   setPropId(unit._id);
                                    //   setClickedObject(unit);
                                    // }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <td>
                                      {propertyDetails?.unit_data
                                        ?.rental_unit || "N/A"}
                                    </td>
                                    <td>
                                      {propertyDetails?.unit_data
                                        ?.rental_unit_adress || "N/A"}
                                    </td>
                                    <td>
                                      {propertyDetails?.unit_data?.rental_bed ||
                                        "N/A"}
                                    </td>

                                    <td>
                                      {propertyDetails?.unit_data
                                        ?.rental_bath || "N/A"}
                                    </td>
                                    <td>
                                      {propertyDetails?.unit_data
                                        ?.rental_sqft || "N/A"}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                  {/* ))} */}
                </>
                {/* ))} */}
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
