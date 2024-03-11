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
import { RotatingLines } from "react-loader-spinner";

const VendorProfile = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [vendorDetails, setVendorDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [accessType, setAccessType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, []);

  const getVendorData = async () => {
    if (accessType?.vendor_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/vendor/get_vendor/${accessType.vendor_id}`
        );
        setVendorDetails(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
      }
    }
  };
  useEffect(() => {
    getVendorData();
  }, [accessType]);

  return (
    <>
      <VendorHeader />

      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow" style={{ backgroundColor: "#FFFEFA" }}>
              <CardHeader className="border-0">
                <h2 className="mb-0" style={{ color: "#36013F" }}>
                  Personal Details
                </h2>
              </CardHeader>
              <div className="table-responsive" style={{ padding: "15px" }}>
                <Table
                  className="align-items-center table-flush"
                  responsive
                  style={{ width: "100%" }}
                >
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
                  ) : vendorDetails.vendor_id ? (
                    <>
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
                          <th>Phone Number</th>
                          <th>Email</th>
                        </tr>
                        <>
                          <>
                            <tr className="body">
                              <td>{vendorDetails.vendor_name}</td>
                              <td>{vendorDetails.vendor_phoneNumber}</td>
                              <td>{vendorDetails.vendor_email}</td>
                            </tr>
                          </>
                        </>
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
