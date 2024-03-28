import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Table, Container, Row, Card, CardHeader } from "reactstrap";
import TenantsHeader from "components/Headers/TenantsHeader";
import { FormGroup, Col, Button } from "reactstrap";
import { jwtDecode } from "jwt-decode";
import { RotatingLines } from "react-loader-spinner";

const TenantPropertyDetail = () => {
  const { lease_id } = useParams();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageGetUrl = process.env.REACT_APP_IMAGE_GET_URL;
  const navigate = useNavigate();
  let [loader, setLoader] = React.useState(true);

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
    if (lease_id) {
      try {
        const res = await axios.get(
          `${baseUrl}/leases/lease_summary/${lease_id}`
        );
        setPropertyDetails(res.data.data);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
      }
    }
  };

  useEffect(() => {
    getRentalData();
  }, [lease_id]);

  return (
    <>
      <TenantsHeader />
      <Container className="" fluid style={{ height: "100vh" }}>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Details</h1>
            </FormGroup>
          </Col>
          <Col className="text-right" style={{ paddingRight: "40px" }}>
            <Button
              // color="primary"
              //  href="#rms"
              onClick={() => navigate("/tenant/tenantproperty")}
              size="small"
              style={{ background: "#152B51", color: "white",
              boxShadow: " 0px 4px 4px 0px #00000040",
            
            }}

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
        {/* Table */}
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

                          <Row>
                            <Col md={10} lg={10}>
                              <table
                                className="table table-bordered"
                                style={{ color: "#152B51", fontFamily: "Poppins", width: "100%" }}
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
                                      {propertyDetails?.propertysub_type}
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
                            </Col>
                            <Col md={2} lg={2}>
                              <div >
                                {console.log(propertyDetails)}
                                <img
                                  // className="mt-2 mb-2"
                                  src={
                                    propertyDetails?.rental_image
                                      ? `${imageGetUrl}/${propertyDetails?.rental_image}`
                                      : ""
                                  }
                                  alt="Property Details"
                                  style={{ width: "100%",height:"6.4rem" }}
                                />
                              </div>
                            </Col>
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
                              Rental Owner Details
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
                                    Company name
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
                                    {propertyDetails?.rentalOwner_firstName}
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {propertyDetails?.rentalOwner_lastName}
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {
                                      propertyDetails?.rentalOwner_companyName
                                    }
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {
                                      propertyDetails?.rentalOwner_primaryEmail
                                    }
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {
                                      propertyDetails?.rentalOwner_phoneNumber
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
                              Staff Details
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
                                    {propertyDetails?.staffmember_name ||
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
                              Unit Details
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
                                    {propertyDetails?.rental_unit || "N/A"}
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {propertyDetails?.rental_unit_adress ||
                                      "N/A"}
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {propertyDetails?.rental_bed || "N/A"}
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {propertyDetails?.rental_bath || "N/A"}
                                  </td>
                                  <td style={{ border: "0.5px solid #324567" }}>
                                    {propertyDetails?.rental_sqft || "N/A"}
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
        <br />
        <br />
      </Container>
    </>
  );
};

export default TenantPropertyDetail;
