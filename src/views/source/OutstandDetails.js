import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from 'components/Headers/Header';
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
import { jwtDecode } from "jwt-decode";
  
  const PropDetails = () => {
    const { id } = useParams();
    console.log(id);
    const [outstandDetails, setoutstandDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let navigate = useNavigate();
  
    const getOutstandData = async () => {
      try {
        const response = await axios.get(`https://propertymanager.cloudpress.host/api/tenant/tenant_summary/${id}`);
        setoutstandDetails(response.data.data);
        setLoading(false);
      } catch (error) {
      console.error('Error fetching tenant details:', error);
        setError(error);
        setLoading(false);
      }
    };

    React.useEffect(() => {
      getOutstandData();
      console.log(id)
    }, [id]);

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

    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--8" fluid>
        <Row>
            <Col xs="12" sm="6">
              <FormGroup className="">
                <h1 style={{color:'white'}}>
                  Outstanding Balance Details
                </h1>
                </FormGroup>
            </Col>
            <Col className="text-right" xs="12" sm="6">
                    <Button
                      color="primary"
                      href="#rms"
                      onClick={() => navigate("/admin/OutstandingBalance")}
                      size="sm"
                      style={{ background: "white", color: "blue" }}
                    >
                      Back
                    </Button>
              </Col>
          </Row><br/>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Summary</h3>
                </CardHeader>
                <div className="table-responsive" >
                                <Table className="align-items-center table-flush" responsive style={{width:"100%"}}>
                                    {loading ? (
                                        <tr>
                                            <td>Loading balance details...</td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td>Error: {error.message}</td>
                                        </tr>
                                    ) : outstandDetails._id ? (
                                        <>
                                            <tbody >
                                                <tr>
                                                    <th colSpan="2" className="text-primary text-lg">Lease Details</th>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Lease </td>
                                                    <td>{outstandDetails.rental_adress || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Past due mail </td>
                                                    <td>{outstandDetails.tenant_email || "N/A"}</td>
                                                </tr>
                                              
                                            </tbody>

                                            <tbody>
                                                <tr>
                                                    <th colSpan="2" className="text-primary text-lg">Amount Details</th>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Amount</td>
                                                    <td>{outstandDetails.amount || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Balance</td>
                                                    <td>{outstandDetails.amount || "N/A"}</td>
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
    )};
  
  export default PropDetails;