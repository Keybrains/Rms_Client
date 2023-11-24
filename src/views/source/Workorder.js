import {
  Card,
  CardHeader,
  Table,
  Container,
  FormGroup,
  Row,
  Button,
  Col,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// core components
import Header from "components/Headers/Header";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { RotatingLines } from "react-loader-spinner";

const Workorder = () => {
  let navigate = useNavigate();
  let [workData, setWorkData] = useState();
  let [loader, setLoader] = React.useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(6);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  const getWorkData = async () => {
    try {
      const response = await axios.get(
        "https://propertymanager.cloudpress.host/api/workorder/workorder"
      );
      setWorkData(response.data.data);
      setLoader(false);
      setTotalPages(Math.ceil(response.data.data.length / pageItem));
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

  const deleteRentals = (id) => {
    // Show a confirmation dialog to the user
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this work order!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            "https://propertymanager.cloudpress.host/api/workorder/delete_workorder",
            {
              data: { _id: id },
            }
          )
          .then((response) => {
            if (response.data.statusCode === 200) {
              swal("Success!", "Work Order deleted successfully", "success");
              getWorkData(); // Refresh your work order data or perform other actions
            } else {
              swal("", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting work order:", error);
          });
      } else {
        swal("Cancelled", "Work Order is safe :)", "info");
      }
    });
  };

  React.useEffect(() => {
    getWorkData();
  }, [pageItem]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (workData) {
    paginatedData = workData.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const editWorkOrder = (id) => {
    navigate(`/admin/addworkorder/${id}`);
    console.log(id);
  };

  // const filterRentalsBySearch = () => {
  //   if (!searchQuery) {
  //     return workData;
  //   }

  //   return workData.filter((rental) => {
  //     const lowerCaseQuery = searchQuery.toLowerCase();
  //     return (
  //       rental.work_subject.toLowerCase().includes(lowerCaseQuery) ||
  //       rental.work_category.toLowerCase().includes(lowerCaseQuery) ||
  //       rental.status.toLowerCase().includes(lowerCaseQuery) ||
  //       rental.rental_adress.toLowerCase().includes(lowerCaseQuery) ||
  //       rental.staffmember_name.toLowerCase().includes(lowerCaseQuery) ||
  //       rental.priority.toLowerCase().includes(lowerCaseQuery)
  //       // rental.due_date.formattedDate.includes(lowerCaseQuery)
  //     );
  //   });
  // };
  const filterRentalsBySearch = () => {
    if (!searchQuery) {
      return paginatedData;
    }

    return paginatedData.filter((rental) => {
      const lowerCaseQuery = searchQuery.toLowerCase();

      const isUnitAddress = (rental.unit_no + " " + rental.rental_adress)
        .toLowerCase()
        .includes(lowerCaseQuery);
      return (
        rental.work_subject.toLowerCase().includes(lowerCaseQuery) ||
        rental.work_category.toLowerCase().includes(lowerCaseQuery) ||
        rental.status.toLowerCase().includes(lowerCaseQuery) ||
        isUnitAddress ||
        rental.staffmember_name.toLowerCase().includes(lowerCaseQuery) ||
        rental.priority.toLowerCase().includes(lowerCaseQuery)

        // rental.due_date.formattedDate.includes(lowerCaseQuery)
      );
    });
  };

  const navigateToDetails = (workorder_id) => {
    // const propDetailsURL = `/admin/WorkOrderDetails/${tenantId}`;
    navigate(`/admin/workorderdetail/${workorder_id}`);
    console.log(workorder_id);
  };

  return (
    <>
      <Header />
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
              onClick={() => navigate("/admin/addworkorder")}
              size="sm"
              style={{ background: "white", color: "blue" }}
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
                        <td>{`${rental.unit_no} ${rental.rental_adress}`}</td>
                        <td>{rental.work_category}</td>
                        <td>{rental.staffmember_name}</td>
                        <td>{rental.status}</td>

                        <td>
                          <div style={{ display: "flex", gap: "0px" }}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRentals(rental._id);
                              }}
                            >
                              <DeleteIcon />
                            </div>
                            &nbsp; &nbsp; &nbsp;
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                editWorkOrder(rental.workorder_id);
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

export default Workorder;
