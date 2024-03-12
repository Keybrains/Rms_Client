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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import moment from "moment";

const PropertyType = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id, admin } = useParams();
  let [propertyData, setPropertyData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingProperty, setEditingProperty] = useState([]); //niche set null karyu hatu
  // const [editingProperty, setEditingProperty] = React.useState({ property_type: '' }); //ana lidhe aave che?
  let navigate = useNavigate();
  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");

  // let [id, setId] = React.useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  let [loader, setLoader] = React.useState(true);
  let [editData, setEditData] = React.useState({});

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  // const [selectedProperty, setSelectedProperty] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const [search, setSearch] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const toggle3 = () => setSearch((prevState) => !prevState);
  const [upArrow, setUpArrow] = useState([]);
  const [sortBy, setSortBy] = useState([]);

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
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getPropertyData = async () => {
    if (accessType?.admin_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/propertytype/property_type/${accessType?.admin_id}`
        );
        setLoader(false);
        setPropertyData(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / pageItem));
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    }
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
          .delete(`${baseUrl}/propertytype/property_type/${id}`)

          .then((response) => {
            if (response.data.statusCode === 200) {
              toast.success("Property Type deleted successfully!", {
                position: "top-center",
                autoClose: 500,
              });
              getPropertyData();
            } else if (response.data.statusCode === 201) {
              // Handle the case where property is already assigned

              toast.warning(
                "Property Type already assigned. Deletion not allowed.",
                {
                  position: "top-center",
                  autoClose: 500,
                }
              );
            } else {
              toast.error(response.data.message, {
                position: "top-center",
                autoClose: 500,
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting property:", error);
          });
      } else {
        toast.success("property is safe :)", {
          position: "top-center",
          autoClose: 500,
        });
      }
    });
  };

  useEffect(() => {
    getPropertyData();
  }, [accessType]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (propertyData) {
    paginatedData = propertyData?.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const editPropertyType = (id) => {
    navigate(`/${admin}/AddPropertyType/${id}`);
    //console.log(id);
  };

  const filterPropertyBySearch = () => {
    let filteredData = propertyData;

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      filteredData = filteredData.filter((property) => {
        const isPropertyTypeMatch = property.property_type
          .toLowerCase()
          .includes(lowerCaseSearchQuery);
        const isPropertySubTypeMatch = property.propertysub_type
          .toLowerCase()
          .includes(lowerCaseSearchQuery);
        return isPropertyTypeMatch || isPropertySubTypeMatch;
      });
    }
    if (searchQuery2) {
      if (searchQuery2 === "All") {
        return filteredData;
      }
      const lowerCaseSearchQuery = searchQuery2.toLowerCase();
      filteredData = filteredData.filter((property) => {
        const isPropertyTypeMatch = property.property_type
          .toLowerCase()
          .includes(lowerCaseSearchQuery);
        const isPropertySubTypeMatch = property.propertysub_type
          .toLowerCase()
          .includes(lowerCaseSearchQuery);
        return isPropertyTypeMatch || isPropertySubTypeMatch;
      });
    }

    if (upArrow.length > 0) {
      const sortingArrows = upArrow.length > 0 ? upArrow : null;
      sortingArrows.forEach((sort) => {
        switch (sort) {
          case "propertysub_type":
            filteredData.sort((a, b) => {
              const comparison = a.propertysub_type.localeCompare(
                b.propertysub_type
              );
              return upArrow.includes("propertysub_type")
                ? comparison
                : -comparison;
            });
            break;
          case "property_type":
            filteredData.sort((a, b) => {
              const comparison = a.property_type.localeCompare(b.property_type);
              return upArrow.includes("property_type")
                ? comparison
                : -comparison;
            });
            break;
          case "createAt":
            filteredData.sort((a, b) => {
              const comparison = new Date(a.createAt) - new Date(b.createAt);
              return upArrow.includes("createAt") ? comparison : -comparison;
            });
            break;
          default:
            // If an unknown sort option is provided, do nothing
            break;
        }
      });
    }

    return filteredData;
  };

  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterPropertyBySearch();
    const paginatedData = filteredData?.slice(startIndex, endIndex);
    return paginatedData;
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

  useEffect(() => {
    // setLoader(false);
    // filterRentalsBySearch();
    getPropertyData();
  }, [upArrow, sortBy]);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Type</h1>
            </FormGroup>
          </Col>

          <Col className="text-right">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/" + admin + "/AddPropertyType")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Property Type
            </Button>
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
                  <Row className="d-flex">
                    <FormGroup className="mr-sm-2">
                      <Input
                        fullWidth
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setSearchQuery2("");
                        }}
                        style={{
                          width: "100%",
                          maxWidth: "200px",
                          minWidth: "200px",
                          border: "1px solid #ced4da", // Border color similar to the input
                        }}
                      />
                    </FormGroup>
                    <FormGroup className="mr-sm-2">
                      <Dropdown isOpen={search} toggle={toggle3}>
                        <DropdownToggle
                          caret
                          style={{
                            boxShadow: "none",
                            border: "1px solid #ced4da",
                            maxWidth: "200px",
                            minWidth: "200px",
                          }}
                        >
                          {searchQuery2
                            ? searchQuery
                              ? "Select Type"
                              : searchQuery2
                            : "Select Type"}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() => {
                              setSearchQuery2("Residential");
                              setSearchQuery("");
                            }}
                          >
                            Residential
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setSearchQuery2("Commercial");
                              setSearchQuery("");
                            }}
                          >
                            Commercial
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setSearchQuery2("All");
                              setSearchQuery("");
                            }}
                          >
                            All
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </FormGroup>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      {/* <th scope="col">Property_ID</th> */}
                      <th scope="col">
                        Main Type
                        {sortBy.includes("property_type") ? (
                          upArrow.includes("property_type") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("property_type")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("property_type")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("property_type")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Sub Type
                        {sortBy.includes("propertysub_type") ? (
                          upArrow.includes("propertysub_type") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("propertysub_type")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("propertysub_type")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("propertysub_type")}
                          />
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
                      <th scope="col">Updated At</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  {propertyData?.length === 0 ? (
                    <tbody>
                      <tr className="text-center">
                        <td colSpan="5" style={{ fontSize: "15px" }}>
                          No Property Types Added
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {filterTenantsBySearchAndPage()?.map((property) => (
                        <tr key={property._id}>
                          <td>{property.property_type}</td>
                          <td>{property.propertysub_type}</td>
                          <td>
                            {moment(property.createdAt).format("DD-MM-YYYY")}
                          </td>
                          <td>
                            {moment(property.updatedAt).format("DD-MM-YYYY")}
                          </td>
                          <td>
                            <div style={{ display: "flex" }}>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  deleteProperty(property.property_id)
                                }
                              >
                                <DeleteIcon />
                              </div>
                              &nbsp; &nbsp; &nbsp;
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  editPropertyType(property.property_id)
                                }
                              >
                                <EditIcon />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </Table>
                {paginatedData?.length > 0 ? (
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
          </div>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
};

export default PropertyType;
