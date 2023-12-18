import {
  Badge,
  Card,
  CardHeader,
  Table,
  Container,
  FormGroup,
  Row,
  Button,
  Input,
  Col,
  // UncontrolledTooltip,
} from "reactstrap";
import {
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  NativeSelect,
} from "@material-ui/core";
// core components
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import Header from "components/Headers/Header";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import swal from "sweetalert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";

const OutstandingBalance = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let [tentalsData, setTenantsDate] = React.useState();
  const [open, setOpen] = React.useState(false);
  let [loader, setLoader] = React.useState(true);
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingOutstanding, setEditingOutstanding] = React.useState(null);
  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  let [id, setId] = React.useState();
  let [editData, setEditData] = React.useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTenantsData, setFilteredTenantsData] = useState([]);
  let navigate = useNavigate()

  const [selectedPropertyType, setSelectedPropertyType] = React.useState("");
  // //console.log(selectedPropertyType, "selectedPropertyType")
  const handlePropertyTypeSelect = (propertyType) => {
    setSelectedPropertyType(propertyType);
    // localStorage.setItem("propertyType", propertyType);
  };

  const openEditDialog = (rentals) => {
    setEditingOutstanding(rentals);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingOutstanding(null);
  };

  function navigateToDetails(tenantId) {
    navigate(`/admin/OutstandDetails/${tenantId}`);

    // const propDetailsURL = `/admin/OutstandDetails/${tenantId}`;
    // window.location.href = propDetailsURL;
  }

  let getTenantsDate = async () => {
    let responce = await axios.get(`${baseUrl}/tenant/tenant`);
    setLoader(false);
    setTenantsDate(responce.data.data);
  };
  React.useEffect(() => {
    getTenantsDate();
  }, []);

  const editPropertyData = async (id, updatedData) => {
    try {
      const editUrl = `${baseUrl}/tenant/tenant/${id}`;
      //console.log("Edit URL:", editUrl);
      //console.log("Property ID:", id);
      //console.log("Updated Data:", updatedData); // Log the updated data for debugging

      const response = await axios.put(editUrl, updatedData); // Send the updated data in the request body
      //console.log("Edit Response:", response);

      if (response.status === 200) {
        swal("Success!", "Balance updated successfully", "success");
        getTenantsDate(); // Refresh the data after successful edit
      } else {
        swal("", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error editing property:", error);
    }
  };

  const deleteProperty = (id) => {
    // Show a confirmation dialog to the user
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this property!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${baseUrl}/tenant/tenant`, {
            data: { _id: id },
          })
          .then((response) => {
            if (response.data.statusCode === 200) {
              swal("Success!", "Property deleted successfully", "success");
              getTenantsDate();
            } else {
              swal("", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting property:", error);
          });
      } else {
        swal("Cancelled", "Property is safe :)", "info");
      }
    });
  };

  const filterTenantsBySearch = () => {
    if (!searchQuery) {
      return tentalsData;
    }

    return tentalsData.filter((tenant) => {
      return (
        tenant.rental_adress
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.tenant_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  React.useEffect(() => {
    getTenantsDate();
  }, []);

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
      <Container className="mt--7" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Outstanding Balances</h1>
            </FormGroup>
          </Col>
        </Row>
        <br />
        {/* Table */}
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
                      <th scope="col">Lease</th>
                      <th scope="col">Past due email</th>
                      <th scope="col">0-30 days</th>
                      <th scope="col">31-60 days</th>
                      <th scope="col">61-90 days</th>
                      <th scope="col">90+ days</th>
                      <th scope="col">Balance</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterTenantsBySearch()?.map((tenant) => (
                      <tr
                        key={tenant._id}
                        onClick={() => navigateToDetails(tenant._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{tenant.rental_adress}</td>
                        <td>{tenant.tenant_email}</td>
                        <td>{tenant.amount}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{tenant.amount}</td>
                        <td>
                          <div style={{ display: "flex" }}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click from triggering this
                                deleteProperty(tenant._id);
                              }}
                            >
                              <DeleteIcon />
                            </div>
                            &nbsp; &nbsp; &nbsp;
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click from triggering this
                                openEditDialog(tenant);
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
        <br />
        <br />
      </Container>
      <Dialog
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ background: "#F0F8FF" }}>Update</DialogTitle>
        <DialogContent style={{ width: "100%", maxWidth: "500px" }}>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="input-tenant-firstName"
            >
              Lease
            </label>
            <br />
            <Input
              className="form-control-alternative"
              id="input-tenant-firstName"
              type="text"
              name="property_type"
              value={editingOutstanding?.rental_adress || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                setEditingOutstanding((prev) => ({
                  ...prev,
                  rental_adress: newValue,
                }));
              }}
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="input-tenant-lastName"
            >
              Past Due Email
            </label>
            <br />
            <Input
              className="form-control-alternative"
              id="input-tenant-lastName"
              type="text"
              name="tenant_email"
              value={editingOutstanding?.tenant_email || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                setEditingOutstanding((prev) => ({
                  ...prev,
                  tenant_email: newValue,
                }));
              }}
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="input-tenant-mobilenumber"
            >
              Amount
            </label>
            <br />
            <Input
              className="form-control-alternative"
              id="input-tenant-mobilenumber"
              type="text"
              name="amount"
              value={editingOutstanding?.amount || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                setEditingOutstanding((prev) => ({
                  ...prev,
                  amount: newValue,
                }));
              }}
            />
          </FormGroup>
          <FormGroup>
            <label className="form-control-label" htmlFor="input-tenant-email">
              Balance
            </label>
            <br />
            <Input
              className="form-control-alternative"
              id="input-tenant-email"
              type="text"
              name="amount"
              value={editingOutstanding?.amount || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                setEditingOutstanding((prev) => ({
                  ...prev,
                  amount: newValue,
                }));
              }}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button
            onClick={() => {
              // Handle the update logic here
              editPropertyData(editingOutstanding._id, editingOutstanding);
              closeEditDialog();
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

export default OutstandingBalance;
