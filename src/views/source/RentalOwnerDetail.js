import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "components/Headers/Header";
import Cookies from "universal-cookie";
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
import { jwtDecode } from "jwt-decode";

const RentalOwnerDetail = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  //console.log(id);
  const [rentalOwnerDetails, setRentalOwnerDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let navigate = useNavigate();

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

  const getRentalOwnerData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/rentalowner/rentalowner/${id}`
      );
      //console.log(response.data.data);
      setRentalOwnerDetails(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rental owner details:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRentalOwnerData();
    //console.log(id);
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
    <div>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Rental Owner Details</h1>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
             //  href="#rms"
              onClick={() => navigate("/admin/RentalownerTable")}
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
                <h3 className="mb-0">Summary </h3>
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
                        <td>Loading rental owner details...</td>
                      </tr>
                    </tbody>
                  ) : error ? (
                    <tbody>
                      <tr>
                        <td>Error: {error.message}</td>
                      </tr>
                    </tbody>
                  ) : rentalOwnerDetails._id ? (
                    <>
                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Rental Owner Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            First Name:
                          </td>
                          <td>
                            {rentalOwnerDetails.rentalowner_firstName || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Last Name:
                          </td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_lastName || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Company Name:
                          </td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_companyName ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Birth Date:
                          </td>
                          <td>
                            {formatDateWithoutTime(
                              rentalOwnerDetails.birth_date
                            ) || "N/A"}
                          </td>
                        </tr>
                      </tbody>
                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Managment Agreement Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Start Date:
                          </td>
                          <td>
                            {formatDateWithoutTime(
                              rentalOwnerDetails.start_date
                            ) || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            End Date:
                          </td>
                          <td>
                            {formatDateWithoutTime(
                              rentalOwnerDetails.end_date
                            ) || "N/A"}
                          </td>
                        </tr>
                      </tbody>
                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Contact Information
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Primary Email:
                          </td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_primaryEmail ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Alternat Email:
                          </td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_alternateEmail ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Phone Number:
                          </td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_phoneNumber ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Home Number:
                          </td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_homeNumber || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Business Number:
                          </td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_businessNumber ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Telephone Number:
                          </td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_telephoneNumber ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Street Address:
                          </td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_streetAdress ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">City:</td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_city || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">State:</td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_state || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Zip Code:
                          </td>
                          <td>{rentalOwnerDetails.rentalOwner_zip || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Country:</td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_country || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Comments:
                          </td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_comments || "N/A"}
                          </td>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            1099 -NEC Tax Filling Information
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Text Identify Type:
                          </td>
                          <td>
                            {rentalOwnerDetails.text_identityType || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Text Payer Id:
                          </td>
                          <td>{rentalOwnerDetails.textpayer_id || "N/A"}</td>
                        </tr>
                      </tbody>
                    </>
                  ) : (
                    <tbody>
                      <tr>
                        <td>No Rental Owner details found.</td>
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

export default RentalOwnerDetail;
