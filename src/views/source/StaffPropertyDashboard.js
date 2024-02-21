import React, { useEffect, useState } from "react";
import StaffHeader from "../../components/Headers/StaffHeader";
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

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { RotatingLines } from "react-loader-spinner";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import moment from "moment";

const StaffPropertyDashboard = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [rental_adress, setRentalAddress] = useState([]);

  let [loader, setLoader] = React.useState(true);
  const [propertyDetails, setPropertyDetails] = useState([]);

  const [upArrow, setUpArrow] = React.useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
  const getTenantData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/staffmember/staffmember_property/${accessType?.staffmember_id}`
      );
      setPropertyDetails(response.data.data);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getTenantData();
  }, [accessType]);

  const navigate = useNavigate();

  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterTenantsBySearch();
    const paginatedData = filteredData;
    return paginatedData;
  };

  const filterTenantsBySearch = () => {
    let filteredData = [...propertyDetails];
  
    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      filteredData = filteredData.filter((tenant) => {
        return (
          (tenant.rental_adress && tenant.rental_adress.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (tenant.start_date && tenant.start_date.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (tenant.end_date && tenant.end_date.toLowerCase().includes(lowerCaseSearchQuery))
        );
      });
    }
  
    if (upArrow.length > 0) {
      const sortingArrows = upArrow;
      sortingArrows.forEach((sort) => {
        switch (sort) {
          case "rental_adress":
            filteredData.sort((a, b) =>
              a.rental_adress.localeCompare(b.rental_adress)
            );
            break;
          case "start_date":
            filteredData.sort(
              (a, b) => new Date(a.start_date) - new Date(b.start_date)
            );
            break;
          case "end_date":
            filteredData.sort(
              (a, b) => new Date(a.end_date) - new Date(b.end_date)
            );
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
  };

  React.useEffect(() => {
    getTenantData();
  }, [upArrow, sortBy]);

  return (
    <>
      <StaffHeader />
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
              {!loader || rental_adress?.length > 0 ? (
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
                          <th>
                            Rental Address
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
                          <th>
                            Property Subtype
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
                          <th>
                            Locality
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
                          <th>CreatedAt</th>
                        </tr>
                      </thead>
                      {propertyDetails.length === 0 ? (
                        <tbody>
                          <tr className="text-center">
                            <td colSpan="8" style={{ fontSize: "15px" }}>No Property Added</td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          {filterTenantsBySearchAndPage().map(
                            (address, index) => (
                              <>
                                <tr
                                  key={index}
                                  onClick={() =>
                                    navigate(
                                      // `/staff/staffpropertydetail/1708425958731`
                                      `/staff/staffpropertydetail/${address?.rental_id}`
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <td>{address?.rental_adress} </td>

                                  <td>{address?.propertysub_type}</td>
                                  <td>{address?.rental_city}</td>
                                  <td>
                                    {moment(address?.createdAt).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </td>
                                </tr>
                              </>
                            )
                          )}
                        </tbody>
                      )}
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

export default StaffPropertyDashboard;
