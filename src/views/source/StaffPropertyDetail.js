import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Table, Container, Row, Card, CardHeader } from "reactstrap";
import StaffHeader from "../../components/Headers/StaffHeader";
import { FormGroup, Col, Button } from "reactstrap";
import { jwtDecode } from "jwt-decode";

import Cookies from "universal-cookie";

const StaffPropertyDetail = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageGetUrl = process.env.REACT_APP_IMAGE_GET_URL;
  const { rental_id } = useParams();
  const [propertyDetails, setPropertyDetails] = useState([]);
  const navigate = useNavigate();

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getRentalData = async () => {
    if (rental_id) {
      try {
        const res = await axios.get(
          `${baseUrl}/staffmember/staffmember_summary/${rental_id}`
        );
        setPropertyDetails(res.data.data[0]);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
      }
    }
  };

  useEffect(() => {
    getRentalData();
  }, []);

  return (
    <>
      <StaffHeader />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Details</h1>
            </FormGroup>
          </Col>
          <Col className="text-right">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/staff/staffproperty")}
              size="sm"
              style={{ background: "white", color: "#3B2F2F" }}
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
                <>
                  <div className="row m-3">
                    <div className="col-12">
                      <div
                        className="align-items-center table-flush"
                        responsive
                        style={{ width: "100%" }}
                      >
                        <div className="w-100">
                          <div className="card mb-3 col-md-2">
                            <div className="row g-0">
                              <div className="col-md-4">
                                <img
                                  className="mt-2 mb-2"
                                  src={
                                    propertyDetails?.rental_image ? `${imageGetUrl}/${propertyDetails?.rental_image}` : ""
                                  }
                                  alt="Property Details"
                                  style={{ maxWidth: "8rem" }}
                                />
                              </div>
                            </div>
                          </div>
                          <Row
                            className="w-100 my-3 "
                            style={{
                              fontSize: "18px",
                              textTransform: "capitalize",
                              color: "#3B2F2F",
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
                                    {" "}
                                    {
                                      propertyDetails?.property_type_data
                                        ?.property_type
                                    }
                                  </td>
                                  <td> {propertyDetails?.rental_adress}</td>
                                  <td> {propertyDetails?.rental_city}</td>
                                  <td> {propertyDetails?.rental_country}</td>
                                  <td> {propertyDetails?.rental_postcode}</td>
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
                            <Col style={{ color: "#3B2F2F" }}>
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

                          <Row
                            className="w-100 my-3 "
                            style={{
                              fontSize: "18px",
                              textTransform: "capitalize",
                              color: "#3B2F2F",
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
                              color: "#3B2F2F",
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
                                    {propertyDetails?.unit_data?.rental_unit ||
                                      "N/A"}
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
                                    {propertyDetails?.unit_data?.rental_bath ||
                                      "N/A"}
                                  </td>
                                  <td>
                                    {propertyDetails?.unit_data?.rental_sqft ||
                                      "N/A"}
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

export default StaffPropertyDetail;
