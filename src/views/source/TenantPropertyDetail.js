import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Table, Container, Row, Card, CardHeader } from "reactstrap";
import TenantsHeader from "components/Headers/TenantsHeader";
import { FormGroup, Col, Button } from "reactstrap";
import { jwtDecode } from "jwt-decode";
import { OpenImageDialog } from "components/OpenImageDialog";
import Cookies from "universal-cookie";

const TenantPropertyDetail = () => {
  const { rental_adress } = useParams();
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [open, setOpen] = React.useState(false);
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
    const getRentalData = async () => {
      try {
        //const encodedAddress = encodeURIComponent(rental_adress);
        const url = `https://propertymanager.cloudpress.host/api/rentals/Rentals_summary/tenant/${rental_adress}`;

        const response = await axios.get(url);
        setPropertyDetails(response.data.data);
        //console.log(response.data.data);
        setPropertyLoading(false);
      } catch (error) {
        setPropertyError(error);
        setPropertyLoading(false);
      }
    };
    getRentalData();
  }, [rental_adress]);

  return (
    <>
      <TenantsHeader />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Details</h1>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/tenant/tenantproperty")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <br />
        {/* Table */}
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
                  {propertyDetails.map((propertyDetails) => (
                    <>
                      {propertyDetails.entries.map((entry) => (
                        <>
                          <tbody>
                            <tr>
                              <th
                                colSpan="2"
                                className="text-lg"
                                style={{ color: "#3B2F2F" }}
                              >
                                Property Details
                              </th>
                            </tr>
                            {/* <tr>
                              <td className="font-weight-bold text-md">
                                Image
                              </td>
                              <td>
                                <img
                                  src={
                                    entry.propertyres_image ||
                                    entry.property_image
                                  }
                                  alt="Property Details"
                                  style={{ maxWidth: "8rem" }}
                                />
                              </td>
                            </tr> */}
                          <tr>
  <td className="font-weight-bold text-md">Image</td>
  <td>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {entry.propertyres_image &&
        entry.propertyres_image.length > 0 && (
          <div
            style={{
              width: "100%", // Expands to full width by default
            }}
          >
            Residential:
            {entry.propertyres_image.map((propertyres_image, index) => (
              <img
                key={index}
                src={propertyres_image}
                alt="Property Details"
                onClick={() => {
                  setSelectedImage(propertyres_image);
                  setOpen(true);
                }}
                style={{
                  width: "100px",
                  height: "100px",
                  // objectFit: "cover",
                  margin: "10px",
                  borderRadius: "10px",
                  "@media (max-width: 768px)": {
                    width: "100%", // Full-width on smaller screens
                  },
                }}
              />
            ))}
          </div>
        )}
      {entry.property_image && entry.property_image.length > 0 && !entry.propertyres_image && (
        <div
          style={{
            width: "100%", // Expands to full width by default
          }}
        >
          Commercial:
          {entry.property_image.map((property_image, index) => (
            <img
              key={index}
              src={property_image}
              alt="Property Details"
              style={{
                width: "100px",
                height: "100px",
                // objectFit: "cover",
                margin: "10px",
                borderRadius: "10px",
                "@media (max-width: 768px)": {
                  width: "100%", // Full-width on smaller screens
                },
              }}
            />
          ))}
        </div>
      )}
    </div>
  </td>
</tr>

                            <tr>
                              <td className="font-weight-bold text-md">
                                Property Type
                              </td>
                              <td>
                                {entry.property_type || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                Address
                              </td>
                              <td>
                                {entry.rental_adress || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">City</td>
                              <td>
                                {entry.rental_city || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                Country
                              </td>
                              <td>
                                {entry.rental_country ||
                                  "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                Postcode
                              </td>
                              <td>
                                {entry.rental_postcode ||
                                  "N/A"}
                              </td>
                            </tr>
                          </tbody>

                          <tbody>
                            <tr>
                              <th
                                colSpan="2"
                                className="text-lg"
                                style={{ color: "#3B2F2F" }}
                              >
                                Rental Owner Details
                              </th>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                First Name
                              </td>
                              <td>
                                {propertyDetails.rentalOwner_firstName || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                Last Name
                              </td>
                              <td>
                                {propertyDetails.rentalOwner_lastName || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                Company Name
                              </td>
                              <td>
                                {propertyDetails.rentalOwner_companyName ||
                                  "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                E-Mail
                              </td>
                              <td>
                                {propertyDetails.rentalOwner_primaryEmail ||
                                  "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                Phone Number
                              </td>
                              <td>
                                {propertyDetails.rentalOwner_phoneNumber ||
                                  "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                Home Number
                              </td>
                              <td>
                                {propertyDetails.rentalOwner_homeNumber ||
                                  "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                Business Number
                              </td>
                              <td>
                                {propertyDetails.rentalOwner_businessNumber ||
                                  "N/A"}
                              </td>
                            </tr>
                          </tbody>

                          <tbody>
                            <tr>
                              <th
                                colSpan="2"
                                className="text-lg"
                                style={{ color: "#3B2F2F" }}
                              >
                                Account Details
                              </th>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                Operating Account
                              </td>
                              <td>
                                {entry
                                  .rentalOwner_operatingAccount || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                Property Reserve
                              </td>
                              <td>
                                {entry
                                  .rentalOwner_propertyReserve || "N/A"}
                              </td>
                            </tr>
                          </tbody>

                          <tbody>
                            <tr>
                              <th
                                colSpan="2"
                                className="text-lg"
                                style={{ color: "#3B2F2F" }}
                              >
                                Staff Details
                              </th>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                Staff Member
                              </td>
                              <td>
                                {entry.staffMember || "N/A"}
                              </td>
                            </tr>
                          </tbody>

                          <tbody>
                            <tr>
                              <th
                                colSpan="2"
                                className="text-lg"
                                style={{ color: "#3B2F2F" }}
                              >
                                Unit Details
                              </th>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">Unit</td>
                              <td>
                                {entry.rental_units ||
                                  entry.rentalcom_units ||
                                  "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">
                                Unit Address
                              </td>
                              <td>
                                {entry.rental_unitsAdress ||
                                  entry.rentalcom_unitsAdress ||
                                  "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">Bed</td>
                              <td>
                                {entry.rental_bed || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">Bath</td>
                              <td>
                                {entry.rental_bath || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold text-md">SQFT</td>
                              <td>
                                {entry.rental_soft ||
                                  entry.rentalcom_soft ||
                                  "N/A"}
                              </td>
                            </tr>
                          </tbody>
                        </>
                      ))}
                    </>
                  ))}
                </Table>
              </div>
            </Card>
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default TenantPropertyDetail;
