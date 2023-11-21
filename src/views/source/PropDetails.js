import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "components/Headers/Header";
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
import ClearIcon from "@mui/icons-material/Clear";

import Cookies from "universal-cookie";
import { Modal } from "@mui/material";
import { Clear, Image } from "@mui/icons-material";
import { OpenImageDialog } from "components/OpenImageDialog";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const PropDetails = () => {
  const { id, entryIndex } = useParams();
  console.log(id);
  const [propertyDetails, setpropertyDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let navigate = useNavigate();
  const [matchedProperty, setMatchedProperty] = useState({});
  const getRentalsData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/rentals/rentals_summary/${id}`
      );
      setpropertyDetails(response.data.data);
      console.log(response.data.data,'response frirn simmary')
      const matchedProperty = response.data.data.entries.find(
        (property) => property.entryIndex === entryIndex
      )
      setMatchedProperty(matchedProperty)
      console.log(matchedProperty,`matched property`)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getRentalsData();
    console.log(id);
  }, [id]);

  let cookies = new Cookies();
  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let authConfig = {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
          token: cookies.get("token"),
        },
      };
      // auth post method
      let res = await axios.post(
        "http://localhost:4000/api/register/auth",
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

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // const openModal = (imageUrl) => {
  //   setSelectedImage(imageUrl);
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  // function ImageModal({ imageUrl, closeModal }) {
  //   return (
  //     <div className="image-modal" onClick={closeModal}>
  //       <img src={imageUrl} alt="Opened Image" />
  //     </div>
  //   );
  // }

  return (
    <>
      <Header />
      {/* Page content */}
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
              onClick={() => navigate("/admin/propertiesTable")}
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
                  {loading ? (
                    <tbody>
                      <tr>
                        <td>Loading Property details...</td>
                      </tr>
                    </tbody>
                  ) : error ? (
                    <tbody>
                      <tr>
                        <td>Error: {error.message}</td>
                      </tr>
                    </tbody>
                  ) : propertyDetails._id ? (
                    <>
                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Property Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Image</td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                              }}
                            >
                              {matchedProperty.propertyres_image &&
                                matchedProperty.propertyres_image.length >
                                  0 && (
                                  <div
                                    style={{
                                      width: "100%", // Expands to full width by default
                                    }}
                                  >
                                    Residential:
                                    {matchedProperty.propertyres_image.map(
                                      (propertyres_image, index) => (
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
                                      )
                                    )}
                                    {/* <Modal
                                      open={open}
                                      onClose={handleClose}
                                      aria-labelledby="modal-modal-title"
                                      aria-describedby="modal-modal-description"
                                    >
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "50%",
                                          transform: "translate(-50%, -50%)",
                                          backgroundColor: "white",
                                          border: "2px solid #000",
                                          padding: "2rem",
                                        }}
                                      >
                                        <img
                                          style={style}
                                          src={selectedImage}
                                          alt="Image"
                                        />
                                        <ClearIcon
                                          style={{
                                            cursor: "pointer",
                                            position: "absolute",
                                            top: "-99px",
                                            right: "-171px",
                                          }}
                                          onClick={handleClose}
                                        />
                                      </div>
                                    </Modal> */}
                                    <OpenImageDialog open={open} setOpen={setOpen} selectedImage={selectedImage} />
                                  </div>
                                )}
                              {matchedProperty.property_image &&
                                matchedProperty.property_image.length > 0 && (
                                  <div
                                    style={{
                                      width: "100%", // Expands to full width by default
                                    }}
                                  >
                                    Commercial:
                                    {matchedProperty.property_image.map(
                                      (property_image, index) => (
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
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td className="font-weight-bold text-md">
                            Property Type
                          </td>
                          <td>{matchedProperty.property_type || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Address</td>
                          <td>{matchedProperty.rental_adress || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">City</td>
                          <td>{matchedProperty.rental_city || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Country</td>
                          <td>{matchedProperty.rental_country || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Postcode</td>
                          <td>{matchedProperty.rental_postcode || "N/A"}</td>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
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
                            {propertyDetails.rentalOwner_companyName || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">E-Mail</td>
                          <td>
                            {propertyDetails.rentalOwner_primaryEmail || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Phone Number
                          </td>
                          <td>
                            {propertyDetails.rentalOwner_phoneNumber || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Home Number
                          </td>
                          <td>
                            {propertyDetails.rentalOwner_homeNumber || "N/A"}
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

                      {/* <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Account Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Operating Account
                          </td>
                          <td>
                            {propertyDetails.rentalOwner_operatingAccount ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Property Reserve
                          </td>
                          <td>
                            {propertyDetails.rentalOwner_propertyReserve ||
                              "N/A"}
                          </td>
                        </tr>
                      </tbody> */}

                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Staff Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Staff Member
                          </td>
                          <td>{matchedProperty.staffMember || "N/A"}</td>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Unit Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Unit</td>
                          <td>
                            {matchedProperty.rental_units ||
                              matchedProperty.rentalcom_units ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Unit Address
                          </td>
                          <td>
                            {matchedProperty.rental_unitsAdress ||
                              matchedProperty.rentalcom_unitsAdress ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Bed</td>
                          <td>{matchedProperty.rental_bed || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Bath</td>
                          <td>{matchedProperty.rental_bath || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">SQFT</td>
                          <td>
                            {matchedProperty.rental_soft ||
                              matchedProperty.rentalcom_soft ||
                              "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </>
                  ) : (
                    <tbody>
                      <tr>
                        <td>No details found.</td>
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
    </>
  );
};

export default PropDetails;
