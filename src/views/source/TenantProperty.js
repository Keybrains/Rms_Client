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
import { RotatingLines } from "react-loader-spinner";

const TenantProperty = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [rental_adress, setRentalAddress] = useState([]);
  let [loader, setLoader] = React.useState(true);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState(null);
  const [tenantDetails, setTenantDetails] = useState({});
  const { id } = useParams();
  // console.log(id, tenantDetails);

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);
  let cookie_id = cookies.get("Tenant ID");

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getTenantData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/tenant/tenant_rental_addresses/${cookie_id}`
      );

      if (response.data && response.data.rental_adress) {
        // console.log("Data fetched successfully:", response.data);
        // setTenantDetails(response.data.data);
        setRentalAddress(response.data.rental_adress);

        const allTenants = await axios.get(
          `${baseUrl}/tenant/tenant_summary/${cookie_id}`
        );
        setPropertyDetails(allTenants.data.data.entries);
        // console.log(allTenants.data.data, "allTenants");
      } else {
        console.error("Data structure is not as expected:", response.data);
        setRentalAddress([]); // Set rental_adress to an empty array
      }
      setLoader(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setRentalAddress([]); // Set rental_adress to an empty array
      setPropertyError(error);
      setLoader(false);
    } finally {
      setPropertyLoading(false);
    }
  };

  useEffect(() => {
    getTenantData();
    // console.log(
    //   `${baseUrl}/tenant/tenant_rental_addresses/${cookie_id}`
    // );
  }, [cookie_id]);

  const navigate = useNavigate();

  // const getRentalData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${baseUrl}/rentals/rentals_property/${rental_adress}`
  //     );
  //     setpropertyDetails(response.data.data);
  //     setpropertyLoading(false);
  //   } catch (error) {
  //     setpropertyError(error);
  //     setpropertyLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   if (rental_adress) {
  //       console.log(`${baseUrl}/rentals/rentals_property/${rental_adress}`)
  //       getRentalData();
  //   }
  //   //console.log(rental_adress)
  // }, [rental_adress]);

  function navigateToTenantsDetails(rental_adress) {
    const tenantsDetailsURL = `/tenant/tenantpropertydetail/${rental_adress}`;
    window.location.href = tenantsDetailsURL;
    // console.log("Rental Address", rental_adress);
  }
  return (
    <>
      <TenantsHeader />
      {/* Page content */}
      <Container className="mt--6 ml--10" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h1 className="mb-0">Ledger</h1>
              </CardHeader>
              {!loader || rental_adress.length > 0 ? (
                <div className="table-responsive">
                  <>
                    <Table
                      className="align-items-center table-flush"
                      responsive
                      // style={{
                      //   width: "100%",
                      //   border: "1px solid #e5e5e5",
                      //   borderRadius: "8px",
                      //   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      // }}
                    >
                      <thead className="thead-light">
                        <tr>
                          <th>Rental Address</th>
                          <th>Start date</th>
                          <th>End Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyDetails.map((address, index) => (
                          <>
                            <tr
                              key={index}
                              // key={address}
                              onClick={() =>
                                navigateToTenantsDetails(address.rental_adress)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <td
                              // style={{
                              //   padding: "12px",
                              //   borderBottom: "1px solid #e5e5e5",
                              //   backgroundColor:
                              //     index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                              //   textAlign: "center",
                              // }}
                              >
                                {address.rental_adress}
                              </td>

                              <td>{address.start_date}</td>
                              <td>{address.end_date}</td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </Table>
                  </>
                </div>
              ) : (
                <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                  <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="50"
                    visible={loader}
                  />
                </div>
              )}
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default TenantProperty;
