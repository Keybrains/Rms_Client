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
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Link } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import Cookies from "universal-cookie";

const TenantWork = () => {
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
  const [pageItem, setPageItem] = React.useState(6);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  const [tenantDetails, setTenantDetails] = useState({});
  const [rental_adress, setRentalAddress] = useState("");
  const [rentalAddress, setRentalAddresses] = useState([]);
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
  let cookie_id = cookies.get("Tenant ID");
  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getTenantData = async () => {
    try {
      const response = await axios.get(
        `https://propertymanager.cloudpress.host/api/tenant/tenant_summary/${cookie_id}`
      );
      const entries = response.data.data.entries;

      if (entries.length > 0) {
        const rentalAddresses = entries
          .map((entry) => entry.rental_adress)
          .join("-");
        ////console.log(rentalAddresses, "mansi");
        setTenantDetails(response.data.data);
        getRentalData(rentalAddresses);
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

  const getRentalData = async (addresses) => {
    try {
      const response = await axios.get(
        `https://propertymanager.cloudpress.host/api/workorder/workorder/tenant/${addresses}`
      );
      //console.log(response, "abc");

      if (Array.isArray(response.data.data)) {
        // Response is an array of work orders
        setTotalPages(Math.ceil(response.data.data.length / pageItem));
        setWorkData((prevData) => [...prevData, ...response.data.data]);
      } else if (typeof response.data.data === "object") {
        // Response is a single work order object
        setTotalPages(Math.ceil(response.data.data.length / pageItem));
        setWorkData((prevData) => [...prevData, response.data.data]);
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

  React.useEffect(() => {
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
    if (!searchQuery) {
      return paginatedData;
    }

    return paginatedData.filter((rental) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        rental.work_subject.toLowerCase().includes(lowerCaseQuery) ||
        rental.work_category.toLowerCase().includes(lowerCaseQuery) ||
        rental.status.toLowerCase().includes(lowerCaseQuery) ||
        rental.rental_adress.toLowerCase().includes(lowerCaseQuery) ||
        rental.staffmember_name.toLowerCase().includes(lowerCaseQuery) ||
        rental.priority.toLowerCase().includes(lowerCaseQuery)
      );
    });
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
              href="#rms"
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
                      <th scope="col">Work Order</th>
                      <th scope="col">Property</th>
                      <th scope="col">Category</th>
                      <th scope="col">Assigned</th>
                      <th scope="col">Status</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filterRentalsBySearch().map((rental) => (
                      <tr
                        key={rental._id}
                        onClick={() => navigateToDetails(rental.workorder_id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{rental.work_subject}</td>
                        <td>{rental.rental_adress}</td>
                        <td>{rental.work_category}</td>
                        <td>{rental.staffmember_name}</td>
                        <td>{rental.status}</td>

                        <td>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                // deleteRentals(rental._id);
                              }}
                            >
                              <DeleteIcon />
                            </div>
                            &nbsp; &nbsp; &nbsp;
                            {/* <div
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation(); 
                              openEditDialog(rental);
                            }}
                          >
                            <EditIcon />
                          </div> */}
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
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default TenantWork;
