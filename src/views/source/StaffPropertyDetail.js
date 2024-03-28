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
      <Container className="" fluid >
        <Row>
          {/* <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Details</h1>
            </FormGroup>
          </Col> */}
          <Col className="text-right" style={{ paddingRight: "40px" }}>
            <Button
              // color="primary"
              //  href="#rms"
              onClick={() => navigate("/staff/staffproperty")}
              size="small"
              style={{ background: "#152B51", color: "white" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <div style={{ paddingLeft: "22px", paddingRight: "22px" }}>
          <Card
            className="shadow"
            style={{ backgroundColor: "#152B51", padding: "15px" }}
          >
            <h3 className="mb-0 text-left" style={{ color: "#fff" }}>
              Property Details
            </h3>
          </Card>
        </div>
        <br />
        <Row>
          <div className="col">
            <h3 className="mb-2 my-0 mx-5" style={{ color: "#152B51" }}>
              Summary
            </h3>
            <div className="table-responsive">
              <>
                <div className="row m-2">
                  <div className="col-12">
                    <div
                      className="align-items-center table-flush"
                      responsive
                      style={{ width: "100%" }}
                    >
                      <div className="w-100">
                        <Card
                          className="p-4 mb-5"
                          style={{
                            boxShadow: "0px 4px 4px 0px #00000040",
                            border: "0.5px solid #152B51",
                            borderRadius: "10px",
                          }}
                        >
                          <Row
                            className="w-100"
                            style={{
                              fontSize: "18px",
                              textTransform: "capitalize",
                              color: "#3B2F2F",
                              fontWeight: "600",
                              // borderBottom: "1px solid #ddd",
                            }}
                          >
                            <Col
                              className="mb-2"
                              style={{
                                color: "#152B51",
                                fontFamily: "Poppins",
                              }}
                            >
                              Property Details
                            </Col>
                          </Row>

                          <table
                            class="table table-bordered"
                            style={{ color: "#152B51", fontFamily: "Poppins" }}
                          >
                            <thead>
                              <tr>
                                <th
                                  scope="col"
                                  style={{
                                    border: "0.5px solid #324567",
                                    textTransform: "capitalize",
                                    fontSize: "15px",
                                  }}
                                >
                                  Property Details
                                </th>
                                <th
                                  scope="col"
                                  style={{
                                    border: "0.5px solid #324567",
                                    textTransform: "capitalize",
                                    fontSize: "15px",
                                  }}
                                >
                                  Address
                                </th>
                                <th
                                  scope="col"
                                  style={{
                                    border: "0.5px solid #324567",
                                    textTransform: "capitalize",
                                    fontSize: "15px",
                                  }}
                                >
                                  City
                                </th>
                                <th
                                  scope="col"
                                  style={{
                                    border: "0.5px solid #324567",
                                    textTransform: "capitalize",
                                    fontSize: "15px",
                                  }}
                                >
                                  Country
                                </th>
                                <th
                                  scope="col"
                                  style={{
                                    border: "0.5px solid #324567",
                                    textTransform: "capitalize",
                                    fontSize: "15px",
                                  }}
                                >
                                  Post code
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td
                                  scope="row"
                                  style={{ border: "0.5px solid #324567" }}
                                >
                                  {" "}
                                  {
                                    propertyDetails?.property_type_data
                                      ?.property_type
                                  }
                                </td>
                                <td style={{ border: "0.5px solid #324567" }}>
                                  {propertyDetails?.rental_adress}
                                </td>
                                <td style={{ border: "0.5px solid #324567" }}>
                                  {propertyDetails?.rental_city}
                                </td>
                                <td style={{ border: "0.5px solid #324567" }}>
                                  {propertyDetails?.rental_country}
                                </td>
                                <td style={{ border: "0.5px solid #324567" }}>
                                  {propertyDetails?.rental_postcode}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Card>
                        <Card
                          className="p-4 mb-5"
                          style={{
                            boxShadow: "0px 4px 4px 0px #00000040",
                            border: "0.5px solid #152B51",
                            borderRadius: "10px",
                          }}
                        >
                          <Row
                            className="w-100"
                            style={{
                              fontSize: "18px",
                              textTransform: "capitalize",
                              color: "#3B2F2F",
                              fontWeight: "600",
                              // borderBottom: "1px solid #ddd",
                            }}
                          >
                            <Col
                              className="mb-2"
                              style={{
                                color: "#152B51",
                                fontFamily: "Poppins",
                              }}
                            >
                              Property Details
                            </Col>
                          </Row>
                          <Row
                            className="mb-1 m-0 p-0"
                            style={{ fontSize: "12px", color: "#000" }}
                          >
                            <table
                              class="table table-bordered"
                              style={{
                                color: "#152B51",
                                fontFamily: "Poppins",
                              }}
                            >
                              <thead>
                                <tr>
                                  <th
                                    scope="col"
                                    style={{
                                      border: "0.5px solid #324567",
                                      textTransform: "capitalize",
                                      fontSize: "15px",
                                    }}
                                  >
                                    First name
                                  </th>
                                  <th
                                    scope="col"
                                    style={{
                                      border: "0.5px solid #324567",
                                      textTransform: "capitalize",
                                      fontSize: "15px",
                                    }}
                                  >
                                    Last name
                                  </th>
                                  <th
                                    scope="col"
                                    style={{
                                      border: "0.5px solid #324567",
                                      textTransform: "capitalize",
                                      fontSize: "15px",
                                    }}
                                  >
                                    Compnay name
                                  </th>
                                  <th
                                    scope="col"
                                    style={{
                                      border: "0.5px solid #324567",
                                      textTransform: "capitalize",
                                      fontSize: "15px",
                                    }}
                                  >
                                    Email
                                  </th>
                                  <th
                                    scope="col"
                                    style={{
                                      border: "0.5px solid #324567",
                                      textTransform: "capitalize",
                                      fontSize: "15px",
                                    }}
                                  >
                                    Phone no
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td
                                    scope="row"
                                    style={{ border: "0.5px solid #324567" }}
                                  >
                                    {
                                      propertyDetails?.rentalowner_data
                                        ?.rentalOwner_firstName
                                    }
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {
                                      propertyDetails?.rentalowner_data
                                        ?.rentalOwner_lastName
                                    }
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {
                                      propertyDetails?.rentalowner_data
                                        ?.rentalOwner_companyName
                                    }
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {
                                      propertyDetails?.rentalowner_data
                                        ?.rentalOwner_primaryEmail
                                    }
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {
                                      propertyDetails?.rentalowner_data
                                        ?.rentalOwner_phoneNumber
                                    }
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Row>
                        </Card>

                        <Card
                          className="p-4 mb-5"
                          style={{
                            boxShadow: "0px 4px 4px 0px #00000040",
                            border: "0.5px solid #152B51",
                            borderRadius: "10px",
                          }}
                        >
                          <Row
                            className="w-100"
                            style={{
                              fontSize: "18px",
                              textTransform: "capitalize",
                              color: "#3B2F2F",
                              fontWeight: "600",
                              // borderBottom: "1px solid #ddd",
                            }}
                          >
                            <Col
                              className="mb-2"
                              style={{
                                color: "#152B51",
                                fontFamily: "Poppins",
                              }}
                            >
                              Property Details
                            </Col>
                          </Row>
                          <Row
                            className="mb-1 m-0 p-0"
                            style={{ fontSize: "12px", color: "#000" }}
                          >
                            <table
                              class="table table-bordered"
                              style={{
                                color: "#152B51",
                                fontFamily: "Poppins",
                              }}
                            >
                              <thead>
                                <tr>
                                  <th
                                    scope="col"
                                    style={{
                                      border: "0.5px solid #324567",
                                      fontSize: "18px",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    Staff member
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td
                                    scope="row"
                                    style={{
                                      border: "0.5px solid #324567",
                                      borderRight: "0.5px solid #324567",
                                    }}
                                  >
                                    {propertyDetails?.staffmember_data
                                      ?.staffmember_name ||
                                      "No staff member assigned"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Row>
                        </Card>
                        <Card
                          className="p-4"
                          style={{
                            boxShadow: "0px 4px 4px 0px #00000040",
                            border: "0.5px solid #152B51",
                            borderRadius: "10px",
                          }}
                        >
                          <Row
                            className="w-100"
                            style={{
                              fontSize: "18px",
                              textTransform: "capitalize",
                              color: "#3B2F2F",
                              fontWeight: "600",
                              // borderBottom: "1px solid #ddd",
                            }}
                          >
                            <Col
                              className="mb-2"
                              style={{
                                color: "#152B51",
                                fontFamily: "Poppins",
                              }}
                            >
                              Property Details
                            </Col>
                          </Row>
                          <Row
                            className="mb-1 m-0 p-0"
                            style={{ fontSize: "12px", color: "#000" }}
                          >
                            <table
                              class="table table-bordered"
                              style={{
                                color: "#152B51",
                                fontFamily: "Poppins",
                              }}
                            >
                              <thead>
                                <tr>
                                  <th
                                    scope="col"
                                    style={{
                                      border: "0.5px solid #324567",
                                      textTransform: "capitalize",
                                      fontSize: "15px",
                                    }}
                                  >
                                    Unit
                                  </th>
                                  <th
                                    scope="col"
                                    style={{
                                      border: "0.5px solid #324567",
                                      textTransform: "capitalize",
                                      fontSize: "15px",
                                    }}
                                  >
                                    Unit Address
                                  </th>
                                  <th
                                    scope="col"
                                    style={{
                                      border: "0.5px solid #324567",
                                      textTransform: "capitalize",
                                      fontSize: "15px",
                                    }}
                                  >
                                    Bed
                                  </th>
                                  <th
                                    scope="col"
                                    style={{
                                      border: "0.5px solid #324567",
                                      textTransform: "capitalize",
                                      fontSize: "15px",
                                    }}
                                  >
                                    Bath
                                  </th>
                                  <th
                                    scope="col"
                                    style={{
                                      border: "0.5px solid #324567",
                                      textTransform: "capitalize",
                                      fontSize: "15px",
                                    }}
                                  >
                                    Square Fit
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                // key={index}
                                // onClick={() => {
                                //   setPropSummary(true);
                                //   setPropId(unit._id);
                                //   setClickedObject(unit);
                                // }}
                                // style={{ cursor: "pointer" }}
                                >
                                  <td
                                    scope="row"
                                    style={{ border: "0.5px solid #324567" }}
                                  >
                                    {propertyDetails?.unit_data?.rental_unit ||
                                      "N/A"}
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {propertyDetails?.unit_data
                                      ?.rental_unit_adress || "N/A"}
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {propertyDetails?.unit_data?.rental_bed ||
                                      "N/A"}
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {propertyDetails?.unit_data?.rental_bath ||
                                      "N/A"}
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {propertyDetails?.unit_data?.rental_sqft ||
                                      "N/A"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Row>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default StaffPropertyDetail;
