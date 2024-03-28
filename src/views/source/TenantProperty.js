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
import moment from "moment";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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
    if (accessType?.tenant_id) {
      try {
        const allTenants = await axios.get(
          `${baseUrl}/tenant/tenant_property/${accessType.tenant_id}`
        );
        setPropertyDetails(allTenants.data.data);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching tenant details:", error);

      }
    }
  };

  useEffect(() => {
    getTenantData();
  }, [accessType]);

  const navigate = useNavigate();

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
      <Container className=" " fluid style={{ marginTop: "4rem", height: "100vh" }}>

        <Row>
          <div className="col">
            <CardHeader
              className=" mt-3 mb-3 mx-2"
              style={{
                backgroundColor: "#152B51",
                borderRadius: "10px",
                boxShadow: " 0px 4px 4px 0px #00000040 ",
              }}
            >
              <h2
                className="mb-0"
                style={{
                  color: "#ffffff",
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  fontSize: "26px",
                }}
              >
                Properties
              </h2>
            </CardHeader>
            <>
              <Row>
                <Col xs="12" sm="6">
                  <FormGroup className="mx-2">
                    <Input
                      fullWidth
                      type="text"
                      placeholder="Search here..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        maxWidth: "200px",
                        minWidth: "200px",
                        marginTop: "20px",
                        boxShadow: "0px 4px 4px 0px #00000040",
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              {!loader || rental_adress?.length > 0 ? (
                <Row
                  className="mx-2 mt-3 d-flex align-items-center py-1"
                  style={{ borderRadius: "10px", height: "69px" }}
                >
                  <Col>
                    <Row
                      className="d-flex align-items-center"
                      style={{
                        border: "2px solid rgba(50, 69, 103, 1)",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                        height: "45px",
                      }}
                    >
                      <Col style={{ color: "#152B51" }}>
                        Rental Address {console.log(sortBy, "yash", upArrow)}
                        {sortBy.includes("rental_adress") ? (
                          upArrow.includes("rental_adress") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rental_adress")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rental_adress")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rental_adress")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>
                        Start date{" "}
                        {sortBy.includes("start_date") ? (
                          upArrow.includes("start_date") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("start_date")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("start_date")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("start_date")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>
                        End Date{" "}
                        {sortBy.includes("end_date") ? (
                          upArrow.includes("end_date") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("end_date")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("end_date")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("end_date")}
                          />
                        )}
                      </Col>

                    </Row>
                    <Row
                      className="mt-3"
                      style={{
                        border: "0.5px solid rgba(50, 69, 103, 1)",
                        borderBottomLeftRadius: "12px",
                        borderBottomRightRadius: "12px",
                        overflow: "hidden",
                        fontSize: "16px",
                        fontWeight: "600",
                        lineHeight: "19.12px",
                      }}
                    >
                      <Col>
                        {filterTenantsBySearchAndPage().map(
                          (address, index) => (
                            <Row
                              key={index}
                              className="d-flex align-items-center"
                              // onClick={() => navigateToDetails(vendor?.workOrder_id)}
                              onClick={() => navigate(`/tenant/tenantpropertydetail/${address?.lease_id}`)}

                              style={{
                                cursor: "pointer",
                                border: "0.5px solid rgba(50, 69, 103, 1)",
                                fontSize: "12px",
                                height: "40px",
                                fontFamily: "poppins",
                                fontWeight: "600",
                                lineHeight: "10.93px",
                              }}
                            >
                              <Col style={{ color: "#152B51" }}> {address?.rental_adress}{" "}
                                {address?.rental_units
                                  ? " - " + address?.rental_units
                                  : null} </Col>
                              <Col style={{ color: "#152B51" }}>{address?.start_date}</Col>
                              <Col style={{ color: "#152B51" }}>{address?.end_date}</Col>

                            </Row>
                          )
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
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
            </>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default TenantProperty;
