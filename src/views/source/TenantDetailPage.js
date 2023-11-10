import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "components/Headers/Header";
import Cookies from 'universal-cookie';
import {
  Card,
  CardHeader,
  FormGroup,
  Container,
  Row,
  Col,
  Table,
  Button,
} from "reactstrap";

const TenantDetailPage = () => {
  const { tenantId, entryIndex } = useParams();  
  const { id } = useParams();
  const [tenantDetails, setTenantDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  let cookies = new Cookies();
  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let  authConfig = {
        headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
        token: cookies.get("token"),
      },
    };
    // auth post method
    let res = await axios.post(
      "https://propertymanager.cloudpress.host/api/register/auth",
      { purpose: "validate access" },
      authConfig
    );
    if (res.data.statusCode !== 200) {
      // cookies.remove("token");
      navigate("/auth/login");
    }
  } else {
    navigate("/auth/login");
  }
};

React.useEffect(() => {
  chackAuth();
}, [cookies.get("token")]);

const apiUrl = `https://propertymanager.cloudpress.host/api/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`;
const getTenantData = async () => {
  try {
    const response = await axios.get(apiUrl);
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
}, [tenantId, entryIndex]);

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }
  

  return (
    <div>
      <Header />

      <Container className="mt--7" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Tenant Details</h1>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/admin/TenantsTable")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Summary</h3>
              </CardHeader>
              <div className="table-responsive">
                <Table
                  className="align-items-center table-flush"
                  responsive
                  style={{ width: "100%" }}
                >
                  {loading ? (
                    <tbody>
                      <tr>
                        <td>Loading tenant details...</td>
                      </tr>
                    </tbody>
                  ) : error ? (
                    <tbody>
                      <tr>
                        <td>Error: {error.message}</td>
                      </tr>
                    </tbody>
                  ) : tenantDetails._id ? (
                    <>
                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Tenant Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            First Name:
                          </td>
                          <td>
                            {tenantDetails.tenant_firstName || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Last Name:
                          </td>
                          <td>
                            {tenantDetails.tenant_lastName || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Phone:</td>
                          <td>
                            {tenantDetails.tenant_mobileNumber || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Email:</td>
                          <td>
                            {tenantDetails.tenant_email || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Personal Information
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Birth Date:
                          </td>
                          <td>
                            {formatDateWithoutTime(
                              tenantDetails.birth_date
                            ) || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            TextPayer Id:
                          </td>
                          <td>{tenantDetails.textpayer_id || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Comments:
                          </td>
                          <td>{tenantDetails.comments || "N/A"}</td>
                        </tr>
                        <th colSpan="2" className="text-primary text-lg">
                          Emergency Contact
                        </th>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Contact Name:
                          </td>
                          <td>{tenantDetails.contact_name || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Relation With Tenants:
                          </td>
                          <td>
                            {tenantDetails.relationship_tenants || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Emergency Email:
                          </td>
                          <td>{tenantDetails.email || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Emergency PhoneNumber:
                          </td>
                          <td>
                            {tenantDetails.emergency_PhoneNumber || "N/A"}
                          </td>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Lease Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Property Type:
                          </td>
                          <td>
                            {tenantDetails.entries.rental_adress || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Lease Type:
                          </td>
                          <td>{tenantDetails.entries.lease_type || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Start Date:
                          </td>
                          <td>
                            {formatDateWithoutTime(
                              tenantDetails.entries.start_date
                            ) || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            End Date:
                          </td>
                          <td>
                            {formatDateWithoutTime(
                              tenantDetails.entries.end_date
                            ) || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Rent Cycle:
                          </td>
                          <td>{tenantDetails.entries.rent_cycle || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Rent Amount:
                          </td>
                          <td>{tenantDetails.entries.amount || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Account:
                          </td>
                          <td>{tenantDetails.entries.account || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Next Due Date:
                          </td>
                          <td>
                            {formatDateWithoutTime(
                              tenantDetails.entries.nextDue_date
                            ) || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Memo:
                          </td>
                          <td>{tenantDetails.entries.memo || "N/A"}</td>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Co-signer Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            First Name:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_firstName || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Last Name:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_lastName || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Mobile Number:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_mobileNumber || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Work Number:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_workNumber || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Home Number:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_homeNumber || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Fax Number:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_faxPhoneNumber || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Email:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_email || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Alternate Email:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_alternateemail || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Street Address:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_streetAdress || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            City:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_city || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            State:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_state || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Country:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_country || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Postal Code:
                          </td>
                          <td>
                            {tenantDetails.entries.cosigner_postalcode || "N/A"}
                          </td>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Recurring Payment Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Amount:
                          </td>
                          <td>
                            {tenantDetails.entries.recuring_amount || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Account:
                          </td>
                          <td>
                            {tenantDetails.entries.recuring_account || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Next Due Date:
                          </td>
                          <td>
                            {tenantDetails.entries.recuringnextDue_date || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Memo:
                          </td>
                          <td>
                            {tenantDetails.entries.recuringmemo || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Frequency:
                          </td>
                          <td>
                            {tenantDetails.entries.recuringfrequency || "N/A"}
                          </td>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            One-time Payment Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Amount:
                          </td>
                          <td>
                            {tenantDetails.entries.onetime_amount || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Account:
                          </td>
                          <td>
                            {tenantDetails.entries.onetime_account || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Due Date:
                          </td>
                          <td>
                            {formatDateWithoutTime(
                              tenantDetails.entries.onetime_Due_date
                            ) || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Memo:
                          </td>
                          <td>
                            {tenantDetails.entries.onetime_memo || "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </>
                  ) : (
                    <tbody>
                      <tr>
                        <td>No tenant details found.</td>
                      </tr>
                    </tbody>
                  )}
                </Table>
              </div>
            </Card>
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </div>
  );
};

export default TenantDetailPage;
