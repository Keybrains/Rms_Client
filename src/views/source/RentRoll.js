import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Table,
  Container,
  Button,
  Input,
  FormGroup,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { jwtDecode } from "jwt-decode";
import { Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "components/Headers/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { RotatingLines } from "react-loader-spinner";
import Cookies from "universal-cookie";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const RentRoll = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [tenantsData, setTenantsData] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  let [loader, setLoader] = React.useState(true);
  const [upArrow, setUpArrow] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  const navigateToRentRollDetails = (tenantId) => {
    navigate(`/admin/rentrolldetail/${tenantId}`);
  };
  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/leases/leases/${accessType.admin_id}`
      );

      if (response.data.statusCode === 200) {
        const data = response.data.data;
        const transformedData = data.map((item) => {
          return {
            tenant_id: item.tenant.tenant_id,
            tenant_firstName: item.tenant.tenant_firstName,
            tenant_lastName: item.tenant.tenant_lastName,
            rental_id: item.rental.rental_id,
            rental_adress: item.rental.rental_adress,
            unit_id: item.unit.unit_id,
            rental_unit: item.unit.rental_unit,
            lease_id: item.lease.lease_id,
            lease_type: item.lease.lease_type,
            start_date: item.lease.start_date,
            end_date: item.lease.end_date,
            createdAt: item.lease.createdAt,
            updatedAt: item.lease.updatedAt,
          };
        });
        const reversedData = transformedData.slice().reverse();
        setLoader(false);
        setTenantsData(reversedData);
        setTotalPages(Math.ceil(reversedData.length / pageItem));
      } else {
        console.log(response.data.message);
        return;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageItem, accessType]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (tenantsData) {
    paginatedData = tenantsData.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    console.log(page, "page");
    setCurrentPage(page);
  };

  const filterRentRollsBySearch = () => {
    let filteredData = [...tenantsData];

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      filteredData = filteredData.filter((tenant) => {
        const name = `${tenant.tenant_firstName} ${tenant.tenant_lastName}`;
        return (
          tenant.rental_adress.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant.lease_type.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant.tenant_firstName
            .toLowerCase()
            .includes(lowerCaseSearchQuery) ||
          tenant.tenant_lastName.toLowerCase().includes(lowerCaseSearchQuery) ||
          name.toLowerCase().includes(lowerCaseSearchQuery)
        );
      });
    }

    if (upArrow.length > 0) {
      upArrow.forEach((value) => {
        switch (value) {
          case "rental_adress":
            filteredData.sort((a, b) =>
              a.rental_adress.localeCompare(b.rental_adress)
            );
            break;
          case "lease_type":
            filteredData.sort((a, b) =>
              a.lease_type.localeCompare(b.lease_type)
            );
            break;
          case "tenant_firstName":
            filteredData.sort((a, b) =>
              a.tenant_firstName.localeCompare(b.tenant_firstName)
            );
            break;
          case "start_date":
            filteredData.sort(
              (a, b) => new Date(a.start_date) - new Date(b.start_date)
            );
            break;
          case "amount":
            filteredData.sort((a, b) => a.amount - b.amount);
            break;
          case "createAt":
            filteredData.sort(
              (a, b) => new Date(a.createAt) - new Date(b.createAt)
            );
            break;
          default:
            filteredData.slice(startIndex, endIndex);
            break;
        }
      });
    }

    return filteredData;
  };

  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterRentRollsBySearch();
    const paginatedData = filteredData.slice(startIndex, endIndex);
    return paginatedData;
  };

  const deleteTenant = (lease_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this lease!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const res = await axios.delete(`${baseUrl}/leases/leases/${lease_id}`);
        if (res.data.statusCode === 200) {
          swal("Success", res.data.message, "success");
          fetchData();
        } else {
          swal("Warning", res.data.message, "warning");
        }
      } else {
        swal("Cancelled", "Tenant is safe :)", "info");
      }
    });
  };

  const editLeasing = (id) => {
    navigate(`/admin/RentRollLeaseing/${id}`);
  };

  const getStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today >= start && today <= end) {
      return "TENANT";
    } else if (today < start) {
      return "FUTURE TENANT";
    } else if (today > end) {
      return "PAST TENANT";
    } else {
      return "-";
    }
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

  return (
    <>
      <Header />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Rent Roll</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              onClick={() => navigate("/admin/RentRollLeaseing")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Lease
            </Button>
          </Col>
        </Row>
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {loader ? (
              <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={loader}
                />
              </div>
            ) : (
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
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">
                        Tenant Name
                        {sortBy.includes("tenant_firstName") ? (
                          upArrow.includes("tenant_firstName") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("tenant_firstName")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("tenant_firstName")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("tenant_firstName")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Lease
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
                      <th scope="col">
                        Type
                        {sortBy.includes("lease_type") ? (
                          upArrow.includes("lease_type") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("lease_type")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("lease_type")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("lease_type")}
                          />
                        )}
                      </th>

                      <th scope="col">Status</th>
                      <th scope="col">
                        Start Date-End Date
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
                      <th scope="col">
                        Rent
                        {sortBy.includes("amount") ? (
                          upArrow.includes("amount") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("amount")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("amount")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon onClick={() => sortData("amount")} />
                        )}
                      </th>
                      <th scope="col">
                        Created At
                        {sortBy.includes("createdAt") ? (
                          upArrow.includes("createdAt") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("createdAt")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("createdAt")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("createdAt")}
                          />
                        )}
                      </th>
                      <th scope="col">Last Updated</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterTenantsBySearchAndPage()?.map((tenant) => (
                      <>
                        <tr
                          key={tenant.lease_id}
                          onClick={() =>
                            navigateToRentRollDetails(tenant.lease_id)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            {tenant.tenant_firstName} {tenant.tenant_lastName}
                          </td>
                          <td>
                            {tenant.rental_adress}{" "}
                            {tenant.rental_unit
                              ? " - " + tenant.rental_unit
                              : null}{" "}
                          </td>
                          <td>{tenant.lease_type}</td>
                          <td>
                            {getStatus(tenant.start_date, tenant.end_date)}
                          </td>
                          <td>
                            {tenant.start_date} to {tenant.end_date}
                          </td>
                          <td>{tenant.amount}</td>
                          <td>{tenant.createdAt} </td>
                          <td>{tenant.updatedAt ? tenant.updatedAt : "-"} </td>
                          <td style={{}}>
                            <div style={{ display: "flex", gap: "5px" }}>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTenant(tenant.lease_id);
                                }}
                              >
                                <DeleteIcon />
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editLeasing(tenant.lease_id);
                                }}
                              >
                                <EditIcon />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
                {paginatedData.length > 0 ? (
                  <Row>
                    <Col className="text-right m-3">
                      <Dropdown isOpen={leasedropdownOpen} toggle={toggle2}>
                        <DropdownToggle caret>{pageItem}</DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() => {
                              setPageItem(10);
                              setCurrentPage(1);
                            }}
                          >
                            10
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setPageItem(25);
                              setCurrentPage(1);
                            }}
                          >
                            25
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setPageItem(50);
                              setCurrentPage(1);
                            }}
                          >
                            50
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setPageItem(100);
                              setCurrentPage(1);
                            }}
                          >
                            100
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                      <Button
                        className="p-0"
                        style={{ backgroundColor: "#d0d0d0" }}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-caret-left"
                          viewBox="0 0 16 16"
                        >
                          <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
                        </svg>
                      </Button>
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>{" "}
                      <Button
                        className="p-0"
                        style={{ backgroundColor: "#d0d0d0" }}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-caret-right"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                        </svg>
                      </Button>{" "}
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default RentRoll;
