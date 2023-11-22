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
} from "reactstrap";
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

  const navigateToRentRollDetails = (tenantId, entryIndex) => {
    navigate(`/admin/rentrolldetail/${tenantId}/${entryIndex}`);
    console.log(tenantId, "Tenant Id");
    console.log(entryIndex, "Entry Index");
  };

  let cookies = new Cookies();
  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let authConfig = {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
          token: cookies.get("token"),
        },
      };
      // auth post method
      let res = await axios.post(
        "https://propertymanager.cloudpress.host/api/register/auth",
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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://propertymanager.cloudpress.host/api/tenant/tenant"
      );
      setLoader(false);
      setTenantsData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
  const filterRentRollsBySearch = () => {
    if (searchQuery === undefined) {
      return tenantsData;
    }

    return tenantsData.filter((tenant) => {
      return tenant.entries.some((entry) => {
        const rentalAddress = entry.rental_adress;
        if (rentalAddress && typeof rentalAddress === "string") {
          return rentalAddress
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        return false;
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

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
                        {tenant.entries.map((entry) => (
                          // <td key={entry.key}>{entry.value}</td>

                          <tr
                            key={tenant._id}
                            onClick={() =>
                              navigateToRentRollDetails(
                                tenant._id,
                                entry.entryIndex
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <td>
                              {tenant.tenant_firstName} {tenant.tenant_lastName}
                            </td>
                            <td>{entry.rental_adress}</td>
                            <td>{entry.lease_type}</td>
                            <td>{entry.start_date}</td>
                            <td>{entry.end_date}</td>
                            {/* <td>{entry.entryIndex}</td> */}
                            {/* <td>{entry.rental_adress}</td> */}
                            <td style={{}}>
                              <div style={{ display: "flex", gap: "5px" }}>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Entry Object:", entry);
                                    deleteTenant(tenant._id, entry.entryIndex);
                                    // console.log(entry.entryIndex,"dsgdg")
                                  }}
                                >
                                  <DeleteIcon />
                                </div>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editLeasing(tenant._id, entry.entryIndex);
                                  }}
                                >
                                  <EditIcon />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </Table>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default RentRoll;
