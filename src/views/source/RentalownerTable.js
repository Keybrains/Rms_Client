import React, { useState, useEffect } from "react";
import {
  Badge,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
  Button,
  Input,
  FormGroup,
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
import Cookies from "universal-cookie";
import Header from "components/Headers/Header";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import Button from "@mui/material/Button";
import swal from "sweetalert"; // Import sweetalert
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

const RentalownerTable = () => {
  const [rentalsData, setRentalsData] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedRentalOwner, setEditedRentalOwner] = useState({
    _id: "", // Add an _id field to keep track of the edited record
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  let [loader, setLoader] = React.useState(true);
  const [tenantsData, setTenantsData] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  let navigate = useNavigate();

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

  const fetchRentalsData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/rentalowner/rentalowner"
      );
      if (response.data && Array.isArray(response.data.data)) {
        setLoader(false);
        setRentalsData(response.data.data);
      } else {
        console.error("Invalid API response structure: ", response.data);
      }
    } catch (error) {
      console.error("Error fetching rentals data: ", error);
    }
  };

  useEffect(() => {
    fetchRentalsData();
  }, []);

  function navigateToRentRollDetails(rentalOwnerId) {
    const rentalOwnerURL = `/admin/rentalownerdetail/${rentalOwnerId}`;
    window.location.href = rentalOwnerURL;
  }

  const editTenantData = async (id, updatedData) => {
    try {
      const editUrl = `http://localhost:4000/api/rentalowner/rentalowner/${id}`;
      //console.log("Edit URL:", editUrl);
      //console.log("Property ID:", id);
      //console.log("Updated Data:", updatedData); // Log the updated data for debugging

      const response = await axios.put(editUrl, updatedData); // Send the updated data in the request body
      //console.log("Edit Response:", response);

      if (response.status === 200) {
        swal("", response.data.message, "success");
        fetchRentalsData(); // Refresh the data after successful edit
      } else {
        swal("", response.data.message, "error");
        console.error("Edit request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error editing property:", error);
    }
  };
  const openEditDialog = (rentalOwner) => {
    setEditingTenant({ ...rentalOwner });
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const editRentalOwner = (id) => {
    navigate(`/admin/Rentalowner/${id}`);
    //console.log(id);
  };
  const deleteTenant = (id) => {
    // Show a confirmation dialog to the user
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
            "http://localhost:4000/api/rentalowner/delete_rentalowner",
            {
              data: { _id: id },
            }
          )
          .then((response) => {
            if (response.data.statusCode === 200) {
              fetchRentalsData();
              // Show a success SweetAlert message here
              swal("Deleted!", "The tenant has been deleted.", "success");
            } else {
              console.error("Failed to delete tenant property");
              // Show an error SweetAlert message here if needed
              swal("Error", "Failed to delete tenant property", "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting tenant:", error);
            // Show an error SweetAlert message here if needed
            swal(
              "Error",
              "An error occurred while deleting the tenant.",
              "error"
            );
          });
      } else {
        swal("Cancelled", "Tenant is safe :)", "info");
      }
    });
  };

  const filterRentalOwnersBySearch = () => {
    if (!searchQuery) {
      return rentalsData;
    }

    return rentalsData.filter((rentalOwner) => {
      return (
        `${rentalOwner.rentalowner_firstName} ${rentalOwner.rentalOwner_lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        rentalOwner.rentalOwner_streetAdress
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        `${rentalOwner.rental_city}, ${rentalOwner.rental_country}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        rentalOwner.rentalOwner_primaryEmail
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });
  };

  return (
    <>
      <Header />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Rental Owner</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/admin/Rentalowner")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Rental Owner
            </Button>
            <br />
          </Col>
        </Row>
        <br />
        <Row>
          <div className="col">
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
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      {/* <th scope="col">Agreement Ends On</th> */}
                      <th scope="col">Address</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Email</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterRentalOwnersBySearch()?.map((rentalOwner) => (
                      <tr
                        key={rentalOwner._id}
                        onClick={() =>
                          navigateToRentRollDetails(rentalOwner._id)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td>{rentalOwner.rentalowner_firstName}</td>
                        <td>{rentalOwner.rentalOwner_lastName}</td>
                        {/* <td>{rentalOwner.end_date}</td> */}
                        <td>{rentalOwner.rentalOwner_streetAdress}</td>
                        <td>{rentalOwner.rentalOwner_phoneNumber}</td>
                        <td>{rentalOwner.rentalOwner_primaryEmail}</td>
                        <td style={{}}>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent the row click event from firing
                                deleteTenant(rentalOwner._id);
                              }}
                            >
                              <DeleteIcon />
                            </div>
                            &nbsp; &nbsp; &nbsp;
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent the row click event from firing
                                editRentalOwner(rentalOwner._id);
                              }}
                            >
                              <EditIcon />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            )}
          </div>
        </Row>
      </Container>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        maxWidth="xs" // Set to "xs" for a smaller width
        fullWidth
      >
        <DialogTitle style={{ background: "#F0F8FF", marginBottom: "16px" }}>
          Edit RentRoll
        </DialogTitle>
        <DialogContent style={{ width: "100%", maxWidth: "500px" }}>
          {/* <div style={{ marginBottom: "16px" }}>
            <InputLabel>FirstName</InputLabel>
            <TextField
              fullWidth
              value={editingTenant?.rentalowner_firstName || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  rentalowner_firstName: e.target.value,
                })
              }
            />
          </div> */}
          <FormGroup>
            <label className="form-control-label" htmlFor="input-property">
              FirstName
            </label>
            <Input
              className="form-control-alternative"
              id="input-protype"
              type="text"
              name="rentalowner_firstName"
              value={editingTenant?.rentalowner_firstName || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  rentalowner_firstName: e.target.value,
                })
              }
            />
          </FormGroup>
          {/* <div style={{ marginBottom: "16px" }}>
            <InputLabel>lastName</InputLabel>
            <TextField
              fullWidth
              value={editingTenant?.rentalOwner_lastName || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  rentalOwner_lastName: e.target.value,
                })
              }
            />
          </div> */}
          <FormGroup>
            <label className="form-control-label" htmlFor="input-property">
              lastName
            </label>
            <Input
              className="form-control-alternative"
              id="input-protype"
              type="text"
              name="rentalowner_lastName"
              value={editingTenant?.rentalOwner_lastName || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  rentalOwner_lastName: e.target.value,
                })
              }
            />
          </FormGroup>
          {/* <div style={{ marginBottom: "16px" }}>
            <InputLabel>phoneNumber</InputLabel>
            <TextField
              fullWidth
              value={editingTenant?.rentalOwner_phoneNumber || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  rentalOwner_phoneNumber: e.target.value,
                })
              }
            />
          </div> */}
          <FormGroup>
            <label className="form-control-label" htmlFor="input-property">
              phoneNumber
            </label>
            <Input
              className="form-control-alternative"
              id="input-protype"
              type="text"
              name="rentalOwner_phoneNumber"
              value={editingTenant?.rentalOwner_phoneNumber || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  rentalOwner_phoneNumber: e.target.value,
                })
              }
            />
          </FormGroup>
          {/* <div style={{ marginBottom: "16px" }}>
            <InputLabel>Address</InputLabel>
            <TextField
              fullWidth
              value={editingTenant?.rentalOwner_streetAdress || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  rentalOwner_streetAdress: e.target.value,
                })
              }
            />
          </div> */}
          <FormGroup>
            <label className="form-control-label" htmlFor="input-property">
              Address
            </label>
            <Input
              className="form-control-alternative"
              id="input-protype"
              type="text"
              name="rentalOwner_streetAdress"
              value={editingTenant?.rentalOwner_streetAdress || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  rentalOwner_streetAdress: e.target.value,
                })
              }
            />
          </FormGroup>
          {/* <div style={{ marginBottom: "16px" }}>
            <InputLabel>Email</InputLabel>
            <TextField
              fullWidth
              value={editingTenant?.rentalOwner_primaryEmail || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  rentalOwner_primaryEmail: e.target.value,
                })
              }
            />
          </div> */}
          <FormGroup>
            <label className="form-control-label" htmlFor="input-property">
              Email
            </label>
            <Input
              className="form-control-alternative"
              id="input-protype"
              type="text"
              name="rentalOwner_primaryEmail"
              value={editingTenant?.rentalOwner_primaryEmail || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  rentalOwner_primaryEmail: e.target.value,
                })
              }
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button
            onClick={() => {
              editTenantData(editingTenant._id, editingTenant);
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RentalownerTable;
