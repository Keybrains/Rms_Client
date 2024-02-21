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
  Table,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import TenantsHeader from "components/Headers/TenantsHeader";
import Cookies from "universal-cookie";
import { RotatingLines } from "react-loader-spinner";


const TenantProfile = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  // console.log(id);
  const [tenantDetails, setTenantDetails] = useState({});
  console.log(tenantDetails, "tenantDetails");
  const [tenantDetails1, setTenantDetails1] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  // let rentalId = localStorage.getItem("ID")
  let cookies = new Cookies();
  let cookie_id = localStorage.getItem("Tenant ID");
  let cookie_email = localStorage.getItem("Tenant email");
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getTenantData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/tenants/tenant_profile/${accessType?.tenant_id}`
      );
      setTenantDetails(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTenantData();
  }, [accessType]);

  const getTenantData1 = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/tenant/tenant_summary/${cookie_id}`
      );
      setTenantDetails1(response.data.data);
      // console.log(response.data.data);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    getTenantData1();
    // console.log(
    //   `${baseUrl}/tenant/tenant_summary/${cookie_id}`
    // );
  }, [id]);

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }
  return (
    <>
      <TenantsHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow" style={{ backgroundColor: "#FFFEFA" }}>
              <CardHeader className="border-0">
                {/* <h3 className="mb-0">Summary </h3> */}
              </CardHeader>
              {loading ? (
                <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                  <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="50"
                    visible={loading}
                  />
                </div>

              ) : (
                <div className="table-responsive">
                  <div className="row m-3">
                    <div className="col-12">
                      <div
                        className="align-items-center table-flush"
                        responsive
                        style={{ width: "100%" }}
                      >
                        <div className="w-100">
                          {tenantDetails ? (
                            // tenantDetails.map((tenantDetails, index) => (
                            <div>
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
                                <Col>Personal Details</Col>
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
                                      <th>First Name</th>
                                      <th>Last Name</th>
                                      <th>Phone</th>
                                      <th>Email</th>
                                    </tr>

                                    <tr className="body">
                                      <td>
                                        {tenantDetails?.tenantData
                                          ?.tenant_firstName || "N/A"}
                                      </td>
                                      <td>
                                        {tenantDetails?.tenantData?.tenant_lastName ||
                                          "N/A"}
                                      </td>
                                      <td>
                                        {tenantDetails?.tenantData?.tenant_phoneNumber ||
                                          "N/A"}
                                      </td>
                                      <td>
                                        {tenantDetails?.tenantData?.tenant_email || "N/A"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </Row>
                            </div>
                            // ))
                          ) : (
                            <tr>
                              <td>Loading Tenant details...</td>
                            </tr>
                          )}
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
                            <Col>Lease Details</Col>
                          </Row>
                          {Array.isArray(tenantDetails?.leaseData) ? (
                            tenantDetails.leaseData.map((tenantDetails, index) => (
                              <div key={index}>
                                <Row
                                  className="mb-1 m-0 p-0"
                                  style={{ fontSize: "12px", color: "#000" }}
                                >
                                  <Table style={{ marginBottom: "20px" }}>
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
                                        <th>Property</th>
                                        <th>Lease Type</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Rent Cycle</th>
                                        <th>Rent Amount</th>
                                        <th>Next Due Date</th>
                                      </tr>

                                      <tr className="body">
                                        <td>
                                          {tenantDetails?.rental
                                            ?.rental_adress || "N/A"}
                                        </td>
                                        <td>
                                          {tenantDetails?.lease
                                            ?.lease_type || "N/A"}
                                        </td>

                                        <td>
                                          {formatDateWithoutTime(
                                            tenantDetails?.lease?.start_date
                                          ) || "N/A"}
                                        </td>

                                        <td>
                                          {formatDateWithoutTime(
                                            tenantDetails?.lease?.end_date
                                          ) || "N/A"}
                                        </td>
                                        <td>
                                          {tenantDetails?.rental
                                            ?.rent_cycle || "N/A"}
                                        </td>
                                        <td>
                                          {tenantDetails?.rental?.amount ||
                                            "N/A"}
                                        </td>

                                        <td>
                                          {formatDateWithoutTime(
                                            tenantDetails?.rental
                                              ?.nextDue_date
                                          ) || "N/A"}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </Row>
                              </div>
                            ))
                          ) : (
                            <tr>
                              <td>Data not found</td>
                            </tr>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default TenantProfile;
