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
  
  const PropDetails = () => {
    const { id } = useParams();
    console.log(id);
    const [outstandDetails, setoutstandDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let navigate = useNavigate();
  
    const getOutstandData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/tenant/tenant_summary/${id}`);
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