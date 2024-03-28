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

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getTenantData = async () => {
    if (accessType?.tenant_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/tenant/tenant_profile/${accessType?.tenant_id}`
        );
        setTenantDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getTenantData();
  }, [accessType]);

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
      <Container className="" fluid style={{ marginTop: "4rem", height: "100vh" }}>
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
          <>
            <Row>
              <div className="col">
                <Card
                  className="shadow mx-3"
                  style={{
                    backgroundColor: "#152B51",
                    padding: "20px",
                    borderRadius: "10px",
                    paddingRight: "90px",
                    paddingLeftL: "90px",
                  }}
                >
                  <h2 className="mb-0" style={{ color: "white" }}>
                    Personal Details
                  </h2>
                </Card>

                <Row
                  className="mx-3 py-0 mt-3"
                  style={{
                    border: ".5px solid rgba(50, 69, 103, 1)",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                    height: "45px",
                    alignItems: "center",
                    borderBottom: "0px",
                    color: "#152B51",


                  }}
                >
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Name
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Designation
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Phone Number
                  </Col>
                  <Col
                    style={{
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Email
                  </Col>
                </Row>
                <Row
                  className="mx-3 py-0"
                  style={{
                    border: ".5px solid rgba(50, 69, 103, 1)",
                    borderBottomLeftRadius: "12px",
                    borderBottomRightRadius: "12px",
                    height: "45px",
                    alignItems: "center",
                    color: "#152B51",
                    boxShadow: "0px 4px 4px 0px #00000040"
                  }}
                >
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                      fontSize: "12px"
                    }}
                  >
                    {tenantDetails?.tenant_firstName ||
                      "N/A"}
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                      fontSize: "12px"
                    }}
                  >
                    {tenantDetails?.tenant_lastName ||
                      "N/A"}
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                      fontSize: "12px"
                    }}
                  >
                    {tenantDetails?.tenant_phoneNumber ||
                      "N/A"}
                  </Col>
                  <Col
                    style={{
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                      fontSize: "12px"
                    }}
                  >
                    {tenantDetails?.tenant_email || "N/A"}
                  </Col>
                </Row>
                {/* </tbody>
              </table> */}
              </div>
            </Row>
            <Row>
              <div className="col">
                <Card
                  className="shadow mt-5 mx-3"
                  style={{
                    backgroundColor: "#152B51",
                    padding: "20px",
                    borderRadius: "10px",
                    paddingRight: "90px",
                    paddingLeftL: "90px",
                  }}
                >
                  <h2 className="mb-0" style={{ color: "white" }}>
                    Lease Details
                  </h2>
                </Card>

                <Row
                  className="mx-3 py-0 mt-3"
                  style={{
                    border: ".5px solid rgba(50, 69, 103, 1)",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                    height: "45px",
                    alignItems: "center",
                    borderBottom: "0px",
                    color: "#152B51",


                  }}
                >
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Property
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Lease Type
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Start Date
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    End Date
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Rent Cycle
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Rent Amount
                  </Col>
                  <Col
                    style={{
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Next Due Date
                  </Col>

                </Row>
                <Row
                  className="mx-3 py-0"
                  style={{
                    border: ".5px solid rgba(50, 69, 103, 1)",
                    borderBottomLeftRadius: "12px",
                    borderBottomRightRadius: "12px",
                    height: "45px",
                    alignItems: "center",
                    color: "#152B51",
                    boxShadow: "0px 4px 4px 0px #00000040"
                  }}
                >
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                      fontSize: "12px"
                    }}
                  >
                    {tenantDetails?.rental_adress || "N/A"}
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                      fontSize: "12px"
                    }}
                  >
                    {tenantDetails?.lease_type || "N/A"}
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                      fontSize: "12px"
                    }}
                  >
                    {formatDateWithoutTime(
                      tenantDetails?.start_date
                    ) || "N/A"}
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                      fontSize: "12px"
                    }}
                  >
                    {formatDateWithoutTime(
                      tenantDetails?.end_date
                    ) || "N/A"}
                  </Col>

                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                      fontSize: "12px"
                    }}
                  >
                    {tenantDetails?.rent_cycle || "N/A"}
                  </Col>
                  <Col
                    style={{
                      borderRight: ".5px solid rgba(50, 69, 103, 1)",
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                      fontSize: "12px"
                    }}
                  >
                    {tenantDetails?.amount || "N/A"}
                  </Col>

                  <Col
                    style={{
                      height: "100%",
                      alignItems: "center",
                      display: "flex",
                      fontSize: "12px"
                    }}
                  >
                    {formatDateWithoutTime(
                      tenantDetails?.date
                    ) || "N/A"}
                  </Col>
                </Row>
                {/* </tbody>
              </table> */}
              </div>
            </Row>
          </>
        )}
      </Container >
    </>
  );
};

export default TenantProfile;
