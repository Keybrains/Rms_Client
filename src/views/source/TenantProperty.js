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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const TenantProperty = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [rental_adress, setRentalAddress] = useState([]);
  let [loader, setLoader] = React.useState(true);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState(null);
  const [tenantDetails, setTenantDetails] = useState({});
  const { id } = useParams();
  const [upArrow, setUpArrow] = React.useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  
  // console.log(id, tenantDetails);

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);
  let cookie_id = localStorage.getItem("Tenant ID");

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
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
    navigate(`/tenant/tenantpropertydetail/${rental_adress}`);
    // window.location.href = tenantsDetailsURL;
    // console.log("Rental Address", rental_adress);
  }

  
  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterTenantsBySearch();
    const paginatedData = filteredData;
    return paginatedData;
  };

  const filterTenantsBySearch = () => {
    let filteredData = [...propertyDetails]; // Create a copy of tentalsData to avoid mutating the original array
  
    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      filteredData = filteredData.filter((tenant) => {
        // const name = `${tenant.tenant_firstName} ${tenant.tenant_lastName}`;
  
        return (
          tenant.rental_adress.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant.start_date.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant.end_date.toLowerCase().includes(lowerCaseSearchQuery)
        );
      });
    }
  
    if (upArrow.length > 0) {
      const sortingArrows = upArrow;
      sortingArrows.forEach((sort) => {
        switch (sort) {
          case "rental_adress":
            filteredData.sort((a, b) => a.rental_adress.localeCompare(b.rental_adress));
            break;
          case "start_date":
            filteredData.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            break;
          case "end_date":
            filteredData.sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
            break;
          default:
            // If an unknown sort option is provided, do nothing
            break;
        }
      });
    }
  
    return filteredData;
  };

  const sortData = (value) => {
    if (!sortBy.includes(value)) {
      setSortBy([...sortBy, value]);
      setUpArrow([...upArrow, value]);
      filterTenantsBySearchAndPage();
    } else {
      setSortBy(sortBy.filter((sort) => sort !== value));
      setUpArrow(upArrow.filter((sort) => sort !== value));
      filterTenantsBySearchAndPage();
    }
    //console.log(value);
    // setOnClickUpArrow(!onClickUpArrow);
  };

  React.useEffect(() => {

    // setLoader(false);
    // filterRentalsBySearch();
    getTenantData();
  }, [upArrow, sortBy]);

  return (
    <>
      <TenantsHeader />
      {/* Page content */}
      <Container className="mt--8 ml--10" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Properties</h1>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                {/* <h1 className="mb-0">Property</h1> */}
                <Row>
                    <Col xs="12" sm="6">
                      <FormGroup className="">
                        <Input
                          fullWidth
                          type="text"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            width: "100%",
                            maxWidth: "200px",
                            minWidth: "200px",
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
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
                          <th>Rental Address
                          {sortBy.includes("rental_adress") ? (
                          upArrow.includes("rental_adress") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("rental_adress")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("rental_adress")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("rental_adress")}
                          />
                        )}

                          </th>
                          <th>Start date

                          {sortBy.includes("start_date") ? (
                          upArrow.includes("start_date") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("start_date")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("start_date")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("start_date")}
                          />
                        )}
                          </th>
                          <th>End Date

                          {sortBy.includes("end_date") ? (
                          upArrow.includes("end_date") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("end_date")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("end_date")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("end_date")}
                          />
                        )}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterTenantsBySearchAndPage().map((address, index) => (
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
                                {address.rental_adress} {address.rental_units ? " - " + address.rental_units : null}
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
