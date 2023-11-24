import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import StaffHeader from "components/Headers/StaffHeader";
import {
  Button,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap"; // Import other necessary components from 'reactstrap'
import { jwtDecode } from "jwt-decode";

const StaffProfile = () => {
  const { id } = useParams();
  console.log(id);
  const [staffDetails, setStaffDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let cookie_id = cookies.get("Staff ID");

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
    const getStaffData = async () => {
      try {
        if (!cookie_id) {
          throw new Error("Staff ID not found in cookies");
        }

        const response = await axios.get(
          `https://propertymanager.cloudpress.host/api/addstaffmember/staffmember_summary/${cookie_id}`
        );
        console.log(response.data.data);
        setStaffDetails(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching staff details:", error.message);
        setError(error);
        setLoading(false);
      }
    };

    getStaffData();
  }, [cookie_id, id]);

  return (
    <>
      <StaffHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col>
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
                  <tbody>
                    {loading ? (
                      <tr>
                        <td>Loading staff details...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td>Error: {error.message}</td>
                      </tr>
                    ) : staffDetails._id ? (
                      <>
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
                          <td>{staffDetails.staffmember_name}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Designation:
                          </td>
                          <td>{staffDetails.staffmember_designation}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Phone:</td>
                          <td>{staffDetails.staffmember_phoneNumber}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Email:</td>
                          <td>{staffDetails.staffmember_email}</td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td>No staff details found.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default StaffProfile;
