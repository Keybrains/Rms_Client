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

const TenantProfile = () => {
  const { id } = useParams();
  console.log(id);
  const [tenantDetails, setTenantDetails] = useState({});
  const [tenantDetails1, setTenantDetails1] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  // let rentalId = localStorage.getItem("ID")
  let cookies = new Cookies();
  let cookie_id = cookies.get("Tenant ID");
  let cookie_email = cookies.get("Tenant email");
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getTenantData = async () => {
    try {
      const response = await axios.get(
        `https://propertymanager.cloudpress.host/api/tenant/tenant/${cookie_id}/entries`
      );
      console.log(response.data.data);
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
    console.log(
      `https://propertymanager.cloudpress.host/api/tenant/tenant/${cookie_id}/entries`
    );
  }, [id]);

  const getTenantData1 = async () => {
    try {
      const response = await axios.get(
        `https://propertymanager.cloudpress.host/api/tenant/tenant_summary/${cookie_id}`
      );
      setTenantDetails1([response.data.data]);
      console.log(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTenantData1();
    console.log(
      `https://propertymanager.cloudpress.host/api/tenant/tenant_summary/${cookie_id}`
    );
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
              <div className="table-responsive">
                <Table
                  className="align-items-center table-flush"
                  responsive
                  style={{ width: "100%" }}
                >
                  {Array.isArray(tenantDetails1) ? (
                    tenantDetails1.map((tenantDetails) => (
                      <tbody key={tenantDetails.id}>
                        <tr>
                          <th
                            colSpan="2"
                            className="text-lg"
                            style={{ color: "#3B2F2F" }}
                          >
                            Personal Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            First Name:
                          </td>
                          <td>{tenantDetails.tenant_firstName || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Last Name:
                          </td>
                          <td>{tenantDetails.tenant_lastName || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Phone:</td>
                          <td>{tenantDetails.tenant_mobileNumber || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Email:</td>
                          <td>{tenantDetails.tenant_email || "N/A"}</td>
                        </tr>
                      </tbody>
                    ))
                  ) : (
                    <tr>
                      <td>Loading vendor details...</td>
                    </tr>
                  )}

                  {Array.isArray(tenantDetails) ? (
                    tenantDetails.map((tenantDetails) => (
                      <>
                        <tbody>
                          <tr>
                            <th
                              colSpan="2"
                              className="text-lg"
                              style={{ color: "#3B2F2F" }}
                            >
                              Lease Details
                            </th>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">
                              Property Type:
                            </td>
                            <td>
                              {tenantDetails.entries.rental_adress || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">
                              Lease Type:
                            </td>
                            <td>{tenantDetails.entries.lease_type || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">
                              Start Date:
                            </td>
                            <td>
                              {formatDateWithoutTime(
                                tenantDetails.entries.start_date
                              ) || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">End Date:</td>
                            <td>
                              {formatDateWithoutTime(
                                tenantDetails.entries.end_date
                              ) || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">
                              Rent Cycle:
                            </td>
                            <td>{tenantDetails.entries.rent_cycle || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">
                              Rent Amount:
                            </td>
                            <td>{tenantDetails.entries.amount || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">Account:</td>
                            <td>{tenantDetails.entries.account || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">
                              Next Due Date:
                            </td>
                            <td>
                              {formatDateWithoutTime(
                                tenantDetails.entries.nextDue_date
                              ) || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-md">
                              Uploaded Files:
                            </td>
                            <td>
                              {tenantDetails.entries.upload_file || "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </>
                    ))
                  ) : (
                    <tr>
                      <td>Loading vendor details...</td>
                    </tr>
                  )}
                </Table>
              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default TenantProfile;
