import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "components/Headers/Header";
import Cookies from "universal-cookie";
import {
  Card,
  CardHeader,
  CardBody,
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
  const { admin } = useParams()
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
    if (id) {
      try {
        const response = await axios.get(
          `${baseUrl}/rental_owner/rentalowner_details/${id}`
        );
        setRentalOwnerDetails(response.data.data[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rental owner details:", error);
        setError(error);
        setLoading(false);
      }
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
      {/* <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>{rentalOwnerDetails.rentalOwner_firstName +
                " " +
                rentalOwnerDetails.rentalOwner_lastName}</h1>
              <h4 style={{ color: "white" }}>Rentalowner</h4>
            </FormGroup>
          </Col>
          <Col className="text-right">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate(`/${admin}/RentalownerTable`)}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row> */}

        <Container className="" fluid style={{ marginTop: "4rem", height: "100vh" }}>
        <Row>
          <Col className="text-left" >
            <FormGroup className=" align-item-left text-left ml-4">
              <h1 className="text-left" style={{
                color: "#152B51",
                fontFamily: "Poppins",
                fontWeight: "600",
                fontSize: "18px",

              }}>{rentalOwnerDetails.rentalOwner_firstName +
                " " +
                rentalOwnerDetails.rentalOwner_lastName}</h1>
              <h4  style={{
                color: "#B9BFCB",
                fontFamily: "Poppins",
                fontWeight: "500",
                fontSize: "14px",
              }}>Rentalowner</h4>
            </FormGroup>
          </Col>
          <Col className="text-right">
            <Button
              className="mr-4"

              // color="primary"
              //  href="#rms"
              onClick={() => navigate(`/${admin}/RentalownerTable`)}
              size="small"
              style={{ background: "#152B51", color: "#fff" }}

            >
              Back
            </Button>
          </Col>
        </Row> 
      <Col xs="12" lg="12" sm="6">
          {/* <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Type</h1>
            </FormGroup> */}
          <CardHeader
            className=" mt-3 mx-2"
            style={{
              backgroundColor: "#152B51",
              borderRadius: "10px",
              boxShadow: " 0px 4px 4px 0px #00000040 ",
            }}
          >
            <h2
              className=""
              style={{
                color: "#ffffff",
                fontFamily: "Poppins",
                fontWeight: "500",
                fontSize: "26px",
              }}
            >
              Summary
            </h2>
          </CardHeader>
        </Col>
        <Row>
          <div className="col">   
              <div className="table-responsive">
                <div className="m-3">
                  <Container fluid>
                    <Row className="mb-3">
                      <Col>
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
                          ) : rentalOwnerDetails.rentalowner_id ? (
                            <>
                              <div className="w-100">
                              <Card className="bg-white shadow mt-3" style={{boxShadow: "0px 4px 4px 0px #00000040",border: "1px solid #324567"}}>
                              <CardHeader className="bg-white border-0">
                                <h3
                                  className="mb-0"
                                  style={{ fontSize: "18px", fontWeight: "600", fontFamily: "Poppins", color: "#152B51" }}
                                >
                                  Personal Information
                                </h3>
                                </CardHeader>
                                <CardBody>
                                <Row
                                  className="w-100 mb-1"
                                  style={{
                                    // textTransform: "uppercase",
                                    color: "#152B514D",
                                    fontSize:"14px",
                                    fontWeight:"500",
                                    fontFamily:"Poppins",

                                  }}
                                >
                                  <Col>Name</Col>
                                  <Col>Birth Date</Col>
                                  <Col>Company Name</Col>
                                </Row>
                                <Row
                                  className="w-100 mt-1 mb-5"
                                  style={{
                                    fontSize: "16px",
                                    // textTransform: "capitalize",
                                    fontFamily:"Poppins",
                                    fontWeight:"600",
                                    color:"#152B51",
                                  }}
                                >
                                  <Col>
                                    {rentalOwnerDetails.rentalOwner_firstName +
                                      " " +
                                      rentalOwnerDetails.rentalOwner_lastName || "N/A"}
                                  </Col>
                                  <Col>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-calendar-event"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                    </svg>{" "}
                                    {formatDateWithoutTime(
                                      rentalOwnerDetails.birth_date
                                    ) || "N/A"}
                                  </Col>
                                  <Col>  {rentalOwnerDetails.rentalOwner_companyName ||
                                    "N/A"}</Col>
                                </Row>
                                <Row
                                  className="w-100 mb-1"
                                  style={{
                                    // textTransform: "uppercase",
                                    color: "#152B514D",
                                    fontSize:"14px",
                                    fontWeight:"500",
                                    fontFamily:"Poppins",

                                  }}
                                >
                                  <Col>Street Address</Col>
                                  <Col>City</Col>
                                  <Col>State</Col>
                                </Row>
                                <Row
                                  className="w-100 mt-1 mb-5"
                                  style={{
                                    fontSize: "16px",
                                    // textTransform: "capitalize",
                                    fontFamily:"Poppins",
                                    fontWeight:"600",
                                    color:"#152B51",
                                  }}
                                >
                                  <Col>
                                    {rentalOwnerDetails.street_address ||
                                      "N/A"}
                                  </Col>
                                  <Col>
                                    {rentalOwnerDetails.city || "N/A"}
                                  </Col>
                                  <Col>  {rentalOwnerDetails.state || "N/A"}</Col>
                                </Row>
                                <Row
                                  className="w-100 mb-1"
                                  style={{
                                    // textTransform: "uppercase",
                                    color: "#152B514D",
                                    fontSize:"14px",
                                    fontWeight:"500",
                                    fontFamily:"Poppins",

                                  }}
                                >
                                  <Col>Country</Col>
                                  <Col>Zipcode</Col>
                                  <Col></Col>



                                </Row>
                                <Row
                                  className="w-100 mt-1 mb-5"
                                  style={{
                                    fontSize: "16px",
                                    // textTransform: "capitalize",
                                    fontFamily:"Poppins",
                                    fontWeight:"600",
                                    color:"#152B51",
                                  }}
                                >
                                  <Col>
                                    {rentalOwnerDetails.country || "N/A"}
                                  </Col>
                                  <Col>
                                    {rentalOwnerDetails.postal_code || "N/A"}
                                  </Col>
                                  <Col>

                                  </Col>

                                </Row>
                                </CardBody>
                                </Card>
                             

                                <Card className="bg-white shadow mt-3 " style={{boxShadow: "0px 4px 4px 0px #00000040",border: "1px solid #324567"}}>
                              <CardHeader className="bg-white border-0">
                                <h3
                                  className="mb-0"
                                  style={{ fontSize: "18px", fontWeight: "600", fontFamily: "Poppins", color: "#152B51" }}
                                >
                                  Contact Information
                                </h3>
                                </CardHeader>
                                <CardBody>
                                <Row
                                  className="w-100 mb-1"
                                  style={{
                                    // textTransform: "uppercase",
                                    color: "#152B514D",
                                    fontSize:"14px",
                                    fontWeight:"500",
                                    fontFamily:"Poppins",

                                  }}
                                >
                                  <Col>Phone Number</Col>
                                  <Col>Home Number</Col>
                                  <Col>Business Number</Col>


                                </Row>
                                <Row
                                  className="w-100 mt-1 mb-5"
                                  style={{
                                    fontSize: "16px",
                                    // textTransform: "capitalize",
                                    fontFamily:"Poppins",
                                    fontWeight:"600",
                                    color:"#152B51",
                                  }}
                                >
                                  <Col>
                                    <a
                                      href={`tel:${rentalOwnerDetails.rentalOwner_phoneNumber}`}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="15"
                                        height="15"
                                        fill="currentColor"
                                        className="bi bi-telephone-outbound"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5" />
                                      </svg>{" "}
                                      {rentalOwnerDetails.rentalOwner_phoneNumber ||
                                        "N/A"}
                                    </a>
                                  </Col>


                                  <Col>
                                    {rentalOwnerDetails.rentalOwner_homeNumber || "N/A"}
                                  </Col>
                                  <Col>
                                    {rentalOwnerDetails.rentalOwner_businessNumber ||
                                      "N/A"}
                                  </Col>
                                </Row>
                                <Row
                                  className="w-100 mb-1"
                                  style={{
                                    // textTransform: "uppercase",
                                    color: "#152B514D",
                                    fontSize:"14px",
                                    fontWeight:"500",
                                    fontFamily:"Poppins",

                                  }}
                                >
                                  <Col>Email</Col>
                                  <Col>Alternate Email</Col>
                                  <Col></Col>


                                </Row>
                                <Row
                                  className="w-100 mt-1 mb-5"
                                  style={{
                                    fontSize: "16px",
                                    // textTransform: "capitalize",
                                    fontFamily:"Poppins",
                                    fontWeight:"600",
                                    color:"#152B51",
                                  }}
                                >

                                  <Col style={{ textTransform: "lowercase" }}>
                                    <a
                                      href={`mailto:${rentalOwnerDetails.rentalOwner_primaryEmail}`}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="15"
                                        height="15"
                                        fill="currentColor"
                                        className="bi bi-envelope-paper"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M4 0a2 2 0 0 0-2 2v1.133l-.941.502A2 2 0 0 0 0 5.4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5.4a2 2 0 0 0-1.059-1.765L14 3.133V2a2 2 0 0 0-2-2zm10 4.267.470.25A1 1 0 0 1 15 5.4v.817l-1 .6zm-1 3.15-3.75 2.25L8 8.917l-1.25.75L3 7.417V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm-11-.6-1-.6V5.4a1 1 0 0 1 .53-.882L2 4.267zm13 .566v5.734l-4.778-2.867zm-.035 6.88A1 1 0 0 1 14 15H2a1 1 0 0 1-.965-.738L8 10.083zM1 13.116V7.383l4.778 2.867L1 13.117Z" />
                                      </svg>{" "}
                                      {rentalOwnerDetails.rentalOwner_primaryEmail ||
                                        "N/A"}
                                    </a>
                                  </Col>
                                  <Col style={{ textTransform: "lowercase" }}>
                                    <a
                                      href={`mailto:${rentalOwnerDetails.rentalOwner_alternateEmail}`}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="15"
                                        height="15"
                                        fill="currentColor"
                                        className="bi bi-envelope-paper"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M4 0a2 2 0 0 0-2 2v1.133l-.941.502A2 2 0 0 0 0 5.4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5.4a2 2 0 0 0-1.059-1.765L14 3.133V2a2 2 0 0 0-2-2zm10 4.267.470.25A1 1 0 0 1 15 5.4v.817l-1 .6zm-1 3.15-3.75 2.25L8 8.917l-1.25.75L3 7.417V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm-11-.6-1-.6V5.4a1 1 0 0 1 .53-.882L2 4.267zm13 .566v5.734l-4.778-2.867zm-.035 6.88A1 1 0 0 1 14 15H2a1 1 0 0 1-.965-.738L8 10.083zM1 13.116V7.383l4.778 2.867L1 13.117Z" />
                                      </svg>{" "}
                                      {rentalOwnerDetails.rentalOwner_alternateEmail ||
                                        "N/A"}
                                    </a>
                                  </Col>
                                  <Col >

                                  </Col>
                                </Row>
                                </CardBody>
                                </Card>

                             

                                <Card className="bg-white shadow mt-3" style={{boxShadow: "0px 4px 4px 0px #00000040",border: "1px solid #324567"}}>
                              <CardHeader className="bg-white border-0">
                                <h3
                                  className="mb-0"
                                  style={{ fontSize: "18px", fontWeight: "600", fontFamily: "Poppins", color: "#152B51" }}
                                >
                                  Managment Agreement Details
                                </h3>
                                </CardHeader>
                                <CardBody>
                                <Row
                                  className="w-100 mb-1"
                                  style={{
                                    // textTransform: "uppercase",
                                    color: "#152B514D",
                                    fontSize:"14px",
                                    fontWeight:"500",
                                    fontFamily:"Poppins",

                                  }}
                                >
                                  <Col>Start Date</Col>
                                  <Col>End Date</Col>

                                </Row>
                                <Row
                                  className="w-100 mt-1 mb-5"
                                  style={{
                                    fontSize: "16px",
                                    // textTransform: "capitalize",
                                    fontFamily:"Poppins",
                                    fontWeight:"600",
                                    color:"#152B51",
                                  }}
                                >
                                  <Col>  {formatDateWithoutTime(
                                    rentalOwnerDetails.start_date
                                  ) || "N/A"}</Col>
                                  <Col>
                                    {formatDateWithoutTime(
                                      rentalOwnerDetails.end_date
                                    ) || "N/A"}
                                  </Col>

                                </Row>
                                </CardBody>
                                </Card>

                                <Card className="bg-white shadow mt-3" style={{boxShadow: "0px 4px 4px 0px #00000040",border: "1px solid #324567"}}>
                              <CardHeader className="bg-white border-0">
                                <h3
                                  className="mb-0"
                                  style={{ fontSize: "18px", fontWeight: "600", fontFamily: "Poppins", color: "#152B51" }}
                                >
                                  1099 -NEC Tax Filling Information
                                </h3>
                                </CardHeader>
                                <CardBody>                               
                                <Row
                                  className="w-100 mb-1"
                                  style={{
                                    // textTransform: "uppercase",
                                    color: "#152B514D",
                                    fontSize:"14px",
                                    fontWeight:"500",
                                    fontFamily:"Poppins",

                                  }}
                                >
                                  <Col>Text Identify Type</Col>
                                  <Col>Text Payer Id</Col>

                                </Row>
                                <Row
                                  className="w-100 mt-1 mb-5"
                                  style={{
                                    fontSize: "16px",
                                    // textTransform: "capitalize",
                                    fontFamily:"Poppins",
                                    fontWeight:"600",
                                    color:"#152B51",
                                  }}
                                >
                                  <Col>{rentalOwnerDetails.text_identityType || "N/A"}</Col>
                                  <Col>
                                    {rentalOwnerDetails.texpayer_id || "N/A"}
                                  </Col>

                                </Row>
                                </CardBody>
                                </Card>

                              </div>
                              {/* <tbody>
                        <tr>
                          <th colSpan="2" className="text-primary text-lg">
                            Personal Information
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            First Name:
                          </td>
                          <td>
                            {rentalOwnerDetails.rentalOwner_firstName || "N/A"}
                          </td>
                          {console.log("first",rentalOwnerDetails.rentalOwner_firstName)}
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
                      </tbody> */}
                              {/* <tbody>
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
                      </tbody> */}
                            </>
                          ) : (
                            <tbody>
                              <tr>
                                <td>No Rental Owner details found.</td>
                              </tr>
                            </tbody>
                          )}
                        </Table>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </div>
  );
};

export default RentalOwnerDetail;
