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
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "components/Headers/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert"; // Import sweetalert
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import { RotatingLines } from "react-loader-spinner";
import Cookies from "universal-cookie";

const RentRoll = () => {
  const [tenantsData, setTenantsData] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  let [loader, setLoader] = React.useState(true);

  // function navigateToRentRollDetails(rentRollId) {
  //   const rentRollDetailsURL = `/admin/rentrolldetail/${rentRollId}`;
  //   window.location.href = rentRollDetailsURL;
  // }
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(6);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  const navigateToRentRollDetails = (tenantId, entryIndex) => {
    navigate(`/admin/rentrolldetail/${tenantId}/${entryIndex}`);
    console.log(tenantId, "Tenant Id");
    console.log(entryIndex, "Entry Index");
  };
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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://propertymanager.cloudpress.host/api/tenant/tenants"
      );
      setLoader(false);
      setTenantsData(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / pageItem));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [pageItem]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (tenantsData) {
    paginatedData = tenantsData.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // const filterRentRollsBySearch = () => {
  //   if (!searchQuery) {
  //     return tenantsData;
  //   }

  //   return tenantsData.filter((tenant) => {
  //     return (
  //       `${tenant.tenant_firstName} ${tenant.tenant_lastName}`
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //       tenant.property_type
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //       tenant.lease_type.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   });
  // };
  // const filterRentRollsBySearch = () => {
  //   if (searchQuery === undefined) {
  //     return tenantsData;
  //   }

  //   return tenantsData.filter((tenant) => {
  //     return tenant.entries.some((entry) => {
  //       const rentalAddress = entry.rental_adress;
  //       if (rentalAddress && typeof rentalAddress === "string") {
  //         return rentalAddress
  //           .toLowerCase()
  //           .includes(searchQuery.toLowerCase());
  //       }
  //       return false;
  //     });
  //   });
  // };
  const filterRentRollsBySearch = () => {
    if (searchQuery === undefined) {
      return paginatedData;
    }
    // console.log(paginatedData)
    return paginatedData.filter((tenant) => {
      const name = tenant.tenant_firstName + " " + tenant.tenant_lastName;
      console.log(tenant);
      return (
        tenant.entries.rental_adress
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.tenant_firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.entries.lease_type
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.tenant_lastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const deleteTenant = (tenantId, entryIndex) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this tenant!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `https://propertymanager.cloudpress.host/api/tenant/tenant/${tenantId}/entry/${entryIndex}`
          )
          .then((response) => {
            if (response.data.statusCode === 200) {
              swal("Success!", "Tenant deleted successfully!", "success");
              fetchData();
              // getTenantsDate();
              // Optionally, you can refresh your tenant data here.
            } else {
              swal("", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting Tenant:", error);
          });
      } else {
        swal("Cancelled", "Tenant is safe :)", "info");
      }
    });
  };

  const editLeasing = (id, entryIndex) => {
    navigate(`/admin/Leaseing/${id}/${entryIndex}`);
    console.log(id);
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
              href="#rms"
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
                      <th scope="col">Tenant Name</th>
                      <th scope="col">Lease</th>
                      <th scope="col">Type</th>
                      <th scope="col">Start Date</th>
                      <th scope="col">End Date</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterRentRollsBySearch()?.map((tenant) => (
                      <>
                        <tr
                          key={tenant._id}
                          onClick={() =>
                            navigateToRentRollDetails(
                              tenant._id,
                              tenant.entries.entryIndex
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            {tenant.tenant_firstName} {tenant.tenant_lastName}
                          </td>
                          <td>{tenant.entries.rental_adress}</td>
                          <td>{tenant.entries.lease_type}</td>
                          <td>{tenant.entries.start_date}</td>
                          <td>{tenant.entries.end_date}</td>
                          {/* <td>{tenant.entries.entryIndex}</td>
                        <td>{tenant.entries.rental_adress}</td> */}
                          <td style={{}}>
                            <div style={{ display: "flex", gap: "5px" }}>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTenant(
                                    tenant._id,
                                    tenant.entries.entryIndex
                                  );
                                  // console.log(entry.entryIndex,"dsgdg")
                                }}
                              >
                                <DeleteIcon />
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editLeasing(
                                    tenant._id,
                                    tenant.entries.entryIndex
                                  );
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
                              setPageItem(6);
                              setCurrentPage(1);
                            }}
                          >
                            6
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setPageItem(12);
                              setCurrentPage(1);
                            }}
                          >
                            12
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setPageItem(18);
                              setCurrentPage(1);
                            }}
                          >
                            18
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
                          class="bi bi-caret-left"
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
                          class="bi bi-caret-right"
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
