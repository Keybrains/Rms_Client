import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Table, Container, Row, Card, CardHeader } from "reactstrap";
import StaffHeader from '../../components/Headers/StaffHeader'
import { FormGroup, Col, Button } from "reactstrap";
import { jwtDecode } from "jwt-decode";
import PropImage from "../../assets/img/icons/common/pexels-binyamin-mellish-186077.jpg"


import Cookies from "universal-cookie";


const StaffPropertyDetail= () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { rental_adress } = useParams();
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [propertyUnit, setPropertyUnit] = useState([]);
  const [propId, setPropId] = useState("");
  const [clickedObject, setClickedObject] = useState({});
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
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);




  return (
    <>
      <StaffHeader />
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
             //  href="#rms"
              onClick={() => navigate("/tenant/tenantproperty")}
              size="sm"
              style={{ background: "white", color: "#3B2F2F" }}
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
              
                  <>
                   
                     
                        <div className="row m-3">
                          <div className="col-12">
                            <div
                              className="align-items-center table-flush"
                              responsive
                              style={{ width: "100%" }}
                            >
                             <div className="w-100">
                            <div className="card mb-3 col-md-2">
                              <div className="row g-0">
                                <div className="col-md-4">
                                  <img
                                    className="mt-2 mb-2"
                                    src={PropImage}
                                    // src={PropImage}
                                    alt="Property Details"
                                    style={{ maxWidth: "8rem" }}
                                  />
                                </div>
                                  
                                  </div>
                                </div>
                                <Row
                                  className="w-100 my-3 "
                                  style={{
                                    fontSize: "18px",
                                    textTransform: "capitalize",
                                    color:'#3B2F2F',
                                    fontWeight: "600",
                                    borderBottom: "1px solid #ddd",
                                    
                                  }}
                                >
                                  <Col>Property Details</Col>
                                </Row>
                                <Row
                                  className="mb-1 m-0 p-0"
                                  style={{ fontSize: "12px", color: "#000" }}
                                >
                                  <Table>
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
                                        <th>Property Details</th>
                                        <th>Address</th>
                                        <th>City</th>
                                        <th>Country</th>
                                        <th>Post code</th>
                                      </tr>

                                      <tr className="body">
                                        <td> Typedecember</td>
                                        <td>Tranquil Haven Cottage</td>
                                        <td>New York</td>
                                        <td>U S</td>
                                        <td>201204</td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </Row>
                                <Row
                                  className="w-100 my-3 "
                                  style={{
                                    fontSize: "18px",
                                    textTransform: "capitalize",
                                    color: "#022d60",
                                    fontWeight: "600",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  <Col style={{color:'#3B2F2F'}}>Rental owner detail</Col>
                                </Row>
                                <Row
                                  className="mb-1 m-0 p-0"
                                  style={{ fontSize: "12px", color: "#000" }}
                                >
                                  <Table>
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
                                        <th>Last name</th>
                                        <th>Compnay name</th>
                                        <th>Email</th>
                                        <th>Phone no</th>
                                      </tr>

                                      <tr className="body">
                                        <td>
                                          John 
                                        </td>
                                        <td>
                                         Doe
                                        </td>
                                        <td>
                                          Hi-Soft
                                        </td>
                                        <td>
                                          johndoe@properties.com
                                        </td>
                                        <td>
                                         7418529630
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </Row>
                              
                                <Row
                                  className="w-100 my-3 "
                                  style={{
                                    fontSize: "18px",
                                    textTransform: "capitalize",
                                    color: "#3B2F2F",
                                    fontWeight: "600",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  <Col>Staff Details</Col>
                                </Row>
                                <Row
                                  className="mb-1 m-0 p-0"
                                  style={{ fontSize: "12px", color: "#000" }}
                                >
                                  <Table>
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
                                        <th>Staff member</th>
                                      </tr>

                                      <tr className="body">
                                        <td>Mansi Patel</td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </Row>
                                <Row
                                  className="w-100 my-3 "
                                  style={{
                                    fontSize: "18px",
                                    textTransform: "capitalize",
                                    color: "#3B2F2F",
                                    fontWeight: "600",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  <Col>Unit Details</Col>
                                </Row>
                                <Row
                                  className="mb-1 m-0 p-0"
                                  style={{ fontSize: "12px", color: "#000" }}
                                >
                                  <Table>
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
                                        <th>Unit</th>
                                        <th>Unit address</th>
                                        <th>Bed</th>
                                        <th>Bath</th>
                                        <th>Squrefit</th>
                                      </tr>

                                     
                                        <tr
                                         
                                          style={{ cursor: "pointer" }}
                                        >
                                          <td>12</td>
                                          <td>
                                           212
                                          </td>
                                          <td>N/A</td>

                                          <td>N/A</td>
                                          <td>1212</td>

                                        </tr>
                                     
                                    </tbody>
                                  </Table>
                                </Row>
                              </div>
                            </div>
                          </div>
                        </div>
                      
                  </>
                
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

export default StaffPropertyDetail;
