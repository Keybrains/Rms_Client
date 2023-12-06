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
import axios from "axios";
import TenantsHeader from "components/Headers/TenantsHeader";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import VendorHeader from "components/Headers/VendorHeader";

const VendorProfile = () => {
  const { id } = useParams();
  //console.log(id);
  const [vendorDetails, setVendorDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  // let rentalId = localStorage.getItem("ID")
  // Inside your useEffect, update the axios.get call as follows:
  const getVendorData = async () => {
    try {
      const response = await axios.get(
        `https://propertymanager.cloudpress.host/api/vendor/vendor_summary/${cookie_id}`
      );
      //console.log(response.data.data);
      setVendorDetails(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getVendorData();
    //console.log(id);
  }, [id]);

  // let cookies = new Cookies();
  // Check Authe(token)

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);
  let cookie_id = cookies.get("Vendor ID");

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    <>
      <VendorHeader />
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
                  {loading ? (
                    <tr>
                      <td>Loading vendor details...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td>Error: {error.message}</td>
                    </tr>
                  ) : vendorDetails._id ? (
                    <>
                      <tbody>
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
                          <td class="font-weight-bold text-md">First Name:</td>
                          <td>{vendorDetails.vendor_name}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">
                            Phone Number:
                          </td>
                          <td>{vendorDetails.vendor_phoneNumber}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">Email:</td>
                          <td>{vendorDetails.vendor_email}</td>
                        </tr>
                      </tbody>
                    </>
                  ) : (
                    <tbody>
                      <tr>
                        <td>No vendor details found.</td>
                      </tr>
                    </tbody>
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

export default VendorProfile;
