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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import swal from "sweetalert";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Header from "components/Headers/Header";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { RotatingLines } from "react-loader-spinner";
import Cookies from 'universal-cookie';

const PropertyType = () => {
  const { id } = useParams();
  let [propertyData, setPropertyData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingProperty, setEditingProperty] = useState([]) //niche set null karyu hatu
  // const [editingProperty, setEditingProperty] = React.useState({ property_type: '' }); //ana lidhe aave che?
  let navigate = useNavigate();
  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // let [id, setId] = React.useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  let [loader, setLoader] = React.useState(true);
  let [editData, setEditData] = React.useState({});

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  // const [selectedProperty, setSelectedProperty] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(6);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  // let getPropertyData = async () => {
  //   let responce = await axios.get("https://propertymanager.cloudpress.host/api/newproparty/newproparty");
  //   setPropertyData(responce.data.data);
  // };

  const handlePropertyTypeChange = (value) => {
    setEditingProperty((prev) => ({
      ...prev,
      property_type: value,
    }));
  };

  const openEditDialog = (property) => {
    setEditingProperty(property);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingProperty([]);
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

  const getPropertyData = async () => {
    try {
      const response = await axios.get(
        "https://propertymanager.cloudpress.host/api/newproparty/newproparty"
      );
      setLoader(false);
      setPropertyData(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / pageItem));
    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  };

  // if (!id) {
  //   var handleSubmit = async (values) => {
  //    // values["createAt"] = moment(new Date()).format("YYYY-MM-DD, HH:mm:ss");
  //     let response = await axios.post(
  //       "https://propertymanager.cloudpress.host/api/newproparty/newproparty",
  //       values
  //     );
  //     if (response.data.statusCode === 200) {
  //       setModalShowForPopupForm(false);
  //       getPropertyData();
  //       swal("", response.data.message, "success");
  //     } else {
  //       swal("", response.data.message, "error");
  //     }
  //   };
  // } else {
  //   handleSubmit = async (values) => {
  //     //values["upadateAt"] = moment(new Date()).format("YYYY-MM-DD, HH:mm:ss");
  //     let response = await axios.put(
  //       "https://propertymanager.cloudpress.host/api/newproparty/newproparty" + id,
  //       values
  //     );
  //     if (response.data.statusCode === 200) {
  //       setModalShowForPopupForm(false);
  //       getPropertyData();
  //       swal("", response.data.message, "success");
  //     }
  //   };
  // }
  const editPropertyData = async (id, updatedData) => {
    try {
      const editUrl = `https://propertymanager.cloudpress.host/api/newproparty/proparty-type/${id}`;
      console.log("Edit URL:", editUrl);
      console.log("Property ID:", id);
      console.log("Updated Data:", updatedData); // Log the updated data for debugging

      const response = await axios.put(editUrl, updatedData); // Send the updated data in the request body
      console.log("Edit Response:", response);

      if (response.status === 200) {
        swal("", response.data.message, "success");
        setEditDialogOpen(false)
        getPropertyData(); // Refresh the data after successful edit
      } else {
        swal("", response.data.message, "error");
        console.error("Edit request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error editing property:", error);
    }
    // console.log("object")
  };

  // Delete selected
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
          .delete("https://propertymanager.cloudpress.host/api/newproparty/newproparty/", {
            data: { _id: id },
          })

          .then((response) => {
            console.log(response.data)
            if (response.data.statusCode === 200) {
              swal("Success!", "Property Type deleted successfully!", "success");
              getPropertyData();
            } else if (response.data.statusCode === 201) {
              // Handle the case where property is already assigned
              swal("Warning!", "Property Type already assigned. Deletion not allowed.", "warning");
            } else {
              swal("error", response.data.message, "error");
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




  //  //   auto form fill up in edit
  //  let seletedEditData = async (datas) => {
  //   setModalShowForPopupForm(true);
  //   setId(datas._id);
  //   setEditData(datas);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getPropertyData();
  }, [pageItem]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (propertyData) {
    paginatedData = propertyData.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const editPropertyType = (id) => {
    navigate(`/admin/AddPropertyType/${id}`);
    console.log(id);
  };

  const filterPropertyBySearch = () => {
    if (searchQuery === undefined) {
      return paginatedData;
    }

    return paginatedData.filter((property) => {
      const isPropertyTypeMatch = property.property_type
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return isPropertyTypeMatch;
    });
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: 'white' }}>
                Property Type
              </h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/admin/AddPropertyType")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Property Type
            </Button>
          </Col>
        </Row><br />
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
                      {/* <th scope="col">Property_ID</th> */}
                      <th scope="col">Main Type</th>
                      <th scope="col">Sub Type</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterPropertyBySearch().map((property) => (
                      <tr key={property._id}>
                        <td>{property.property_type}</td>
                        <td>{property.propertysub_type}</td>
                        <td>
                          <div style={{ display: "flex" }}>

                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteProperty(property._id)}
                            >
                              <DeleteIcon />
                            </div>&nbsp; &nbsp; &nbsp;
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => editPropertyType(property._id)}
                            >
                              <EditIcon />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {paginatedData.length > 0 ? <Row>
                  <Col className="text-right m-3">
                    <Dropdown isOpen={leasedropdownOpen} toggle={toggle2}>
                      <DropdownToggle caret >
                        {pageItem}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() => setPageItem(6)}
                        >
                          6
                        </DropdownItem>
                        <DropdownItem
                          onClick={() =>
                            setPageItem(12)
                          }
                        >
                          12
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => setPageItem(18)}
                        >
                          18
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <Button
                      className="p-0"
                      style={{ backgroundColor: '#d0d0d0' }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-caret-left" viewBox="0 0 16 16">
                        <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
                      </svg>
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>{" "}
                    <Button
                      className="p-0"
                      style={{ backgroundColor: '#d0d0d0' }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
                        <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                      </svg>
                    </Button>{" "}

                  </Col>
                </Row> : <></>}
              </Card>)}
          </div>
        </Row>
      </Container>

    </>
  );
};

export default PropertyType;
