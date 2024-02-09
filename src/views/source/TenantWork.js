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
  DropdownToggle,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  // UncontrolledTooltip,
} from "reactstrap";
// core components
import TenantsHeader from "components/Headers/TenantsHeader";
import * as React from "react";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import swal from "sweetalert";
import Dialog from "@mui/material/Dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Link } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import Cookies from "universal-cookie";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect } from "react";

const TenantWork = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let navigate = useNavigate();
  const [workData, setWorkData] = useState([]);

  const [selectedProp, setSelectedProp] = useState("All rentals");
  const [prodropdownOpen, setproDropdownOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRentals, setEditingRentals] = useState([]);
  let [modalShowForPopupForm, setModalShowForPopupForm] = useState(false);
  const [query, setQuery] = useState("");
  let [editData, setEditData] = useState({});
  const [propertyData, setPropertyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRentalsData, setFilteredRentalsData] = useState([]);
  let [loader, setLoader] = React.useState(true);
  const toggle1 = () => setproDropdownOpen((prevState) => !prevState);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  const [tenantDetails, setTenantDetails] = useState({});
  const [rental_adress, setRentalAddress] = useState("");
  const [rentalAddress, setRentalAddresses] = useState([]);
  const [upArrow, setUpArrow] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  //console.log(rental_adress);
  const { id } = useParams();
  //console.log(id, tenantDetails);

  //console.log("cookie_id:", cookie_id);
  //console.log(rental_adress);
  const [loading, setLoading] = useState(true);
  // const { rental_adress } = useParams();
  const handlePropSelection = (value) => {
    setSelectedProp(value);
    setproDropdownOpen(true);
  };

  const openEditDialog = (rentals) => {
    setEditDialogOpen(true);
    setEditingRentals(rentals);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingRentals(null);
  };

  // let cookies = new Cookies();
  // Check Authe(token)

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);
  let cookie_id = localStorage.getItem("Tenant ID");

  useEffect(() => {
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
        `${baseUrl}/tenant/tenant_summary/${accessType.tenant_id}`
      );
      const entries = response.data.data.entries;

      if (entries.length > 0) {
        const rentalAddresses = entries
          .map((entry) => entry.rental_adress)
          .join("^");
        const rentalUnits = entries
          .map((entry) => entry.rental_units)
          .join("^");
        setTenantDetails(response.data.data);
        getRentalData(rentalAddresses, rentalUnits);
        //getVendorDetails(rentalAddresses);
      } else {
        console.error("No rental addresses found.");
      }

      setLoader(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setLoader(false);
    }
  };
  React.useEffect(() => {
    getTenantData();
    // //console.log(id)
  }, [cookie_id, pageItem]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (workData) {
    paginatedData = workData.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRentalData = async (addresses, units) => {
    
  };

  useEffect(() => {
    if (rentalAddress && rentalAddress.length > 0) {
      setLoader(true);
    }
  }, [rentalAddress]);

  const navigateToDetails = (tenantId) => {
    // const propDetailsURL = `/admin/WorkOrderDetails/${tenantId}`;
    navigate(`/tenant/Tworkorderdetail/${tenantId}`);
    //console.log(tenantId);
  };

  const filterRentalsBySearch = () => {
    let filteredData = [...workData]; // Create a copy of workData to avoid mutating the original array

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toString().toLowerCase();
      filteredData = filteredData.filter((work) => {
        return (
          (work.rental_adress &&
            work.rental_adress.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (work.work_subject &&
            work.work_subject.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (work.work_category &&
            work.work_category.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (work.staffmember_name &&
            work.staffmember_name.toLowerCase().includes(lowerCaseSearchQuery))
        );
      });
    }

    if (upArrow.length > 0) {
      const sortingArrows = upArrow;
      sortingArrows.forEach((value) => {
        switch (value) {
          case "rental_adress":
            filteredData.sort((a, b) =>
              a.rental_adress.localeCompare(b.rental_adress)
            );
            break;
          case "work_subject":
            filteredData.sort((a, b) =>
              a.work_subject.localeCompare(b.work_subject)
            );
            break;
          case "work_category":
            filteredData.sort((a, b) =>
              a.work_category.localeCompare(b.work_category)
            );
            break;
          case "staffmember_name":
            filteredData.sort((a, b) =>
              a.staffmember_name.localeCompare(b.staffmember_name)
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

  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterRentalsBySearch();
    const paginatedData = filteredData.slice(startIndex, endIndex);
    return paginatedData;
  };

  const getRentalDataAfterDelete = async (addresses, units) => {
    try {
      const response = await axios.get(
        `${baseUrl}/workorder/workorder/tenant/${addresses}`
      );
      if (Array.isArray(response.data.data)) {
        // Response is an array of work orders
        setTotalPages(Math.ceil(response.data.data.length / pageItem));
        setWorkData(response.data.data);
      } else if (typeof response.data.data === "object") {
        // Response is a single work order object
        setTotalPages(Math.ceil(response.data.data.length / pageItem));
        setWorkData(response.data.data);
      } else {
        console.error(
          "Response data is not an array or object:",
          response.data.data
        );
      }
    } catch (error) {
      console.error("Error fetching work order data:", error);
    }
  };

  const getTenantDataAfterDelete = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/tenant/tenant_summary/${cookie_id}`
      );
      const entries = response.data.data.entries;
      if (entries.length > 0) {
        const rentalAddresses = entries
          .map((entry) => entry.rental_adress)
          .join("^");
        const rentalUnits = entries
          .map((entry) => entry.rental_units)
          .join("^");
        setTenantDetails(response.data.data);
        getRentalDataAfterDelete(rentalAddresses, rentalUnits);
        //getVendorDetails(rentalAddresses);
      } else {
        console.error("No rental addresses found.");
      }
      setLoader(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setLoader(false);
    }
  };

  const deleteworkorder = (workorder_id) => {
    // Show a confirmation dialog to the user
    swal({
      title: "Are you sure",
      text: "Once deleted, you will not be able to recover this work order!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        console.log("Deleting work order with ID:", workorder_id);
        axios
          .delete(`${baseUrl}/workorder/deleteworkorderbyId/${workorder_id}`)
          .then((response) => {
            console.log("Response from delete API:", response);
            if (response.data.statusCode === 200) {
              toast.success("Work Order deleted successfully!", {
                position: "top-center",
              });
              setTimeout(() => {
                getTenantDataAfterDelete();
              }, 200);
            } else {
              toast.error(response.data.message, {
                position: "top-center",
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting work order:", error);
          });
      } else {
        toast.success("Work Order is safe!", {
          position: "top-center",
        });
      }
    });
  };

  const editworkorder = (id) => {
    navigate(`/tenant/taddwork/?id=${id}`);
    console.log(id, "workorder_id");
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

  return (
    <>
      <TenantsHeader />
      {/* Page content */}
      <Container className="mt--8" fluid>
        {/* Table */}
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Work Orders</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/tenant/taddwork")}
              size="sm"
              style={{ background: "white", color: "black" }}
            >
              Add Work Order
            </Button>
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
                      <FormGroup>
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
                        Work Order
                        {sortBy.includes("work_subject") ? (
                          upArrow.includes("work_subject") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("work_subject")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("work_subject")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("work_subject")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Property
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
                        Category
                        {sortBy.includes("work_category") ? (
                          upArrow.includes("work_category") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("work_category")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("work_category")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("work_category")}
                          />
                        )}
                      </th>
                      <th scope="col">Created At</th>
                      <th scope="col">Updated At</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filterTenantsBySearchAndPage().map((rental) => (
                      <tr
                        key={rental._id}
                        onClick={() => navigateToDetails(rental.workorder_id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{rental.work_subject}</td>
                        <td>{rental.rental_adress}</td>
                        <td>{rental.work_category}</td>
                        {/* <td>{rental.staffmember_name}</td>
                        <td>{rental.status}</td> */}
                        <td>{rental.createdAt}</td>
                        <td>{rental.updateAt || "-"}</td>
                        <td>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                editworkorder(
                                  rental.workorder_id
                                  //rental.entries.entryIndex
                                );
                              }}
                            >
                              <EditIcon />
                            </div>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteworkorder(rental.workorder_id);
                              }}
                            >
                              <DeleteIcon />
                            </div>
                          </div>
                        </td>
                      </tr>
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
                        Page {currentPage} of {totalPages || "1"}
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
        <br />
        <br />
        <ToastContainer />
      </Container>
    </>
  );
};

export default TenantWork;
