import React, { useState, useEffect } from "react";
import {
  Badge,
  Card,
  CardHeader,
  Table,
  Container,
  FormGroup,
  Row,
  Col,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { jwtDecode } from "jwt-decode";
import VendorHeader from "components/Headers/VendorHeader";
import Cookies from "universal-cookie";

const VendorWorkTable = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get("status");

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [workData, setWorkData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const [searchQuery2, setSearchQuery2] = useState("");

  const [search, setSearch] = React.useState(false);
  const toggle3 = () => setSearch((prevState) => !prevState);
  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const getWorkData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/work-order/vendor_work/${accessType.vendor_id}`
      );
      setLoader(false);
      setWorkData(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / pageItem));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getWorkData();
  }, [accessType, pageItem]);

  const navigateToDetails = (workorder_id) => {
    navigate(`/vendor/vendorworkdetail/${workorder_id}`);
  };

  const filterRentalsBySearchAndPage = () => {
    const filteredData = filterRentalsBySearch();
    const paginatedData = filteredData.slice(startIndex, endIndex);
    return paginatedData;
  };

  const filterRentalsBySearch = () => {
    if (searchQuery2 && !searchQuery) {
      if (searchQuery2 === "All") {
        return workData;
      }

      if (searchQuery2 === "Over Due") {
        return workData.filter((rental) => {
          let currentDate = new Date();
          let rentalDate = new Date(rental.date);
          return rentalDate < currentDate && rental.status !== "Complete";
        });
      }

      return workData.filter((rental) => {
        const lowerCaseQuery = searchQuery2.toLowerCase();
        return rental.status.toLowerCase().includes(lowerCaseQuery);
      });
    }
    if (!searchQuery) {
      return workData;
    }

    return workData.filter((rental) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const isUnitAddress = (rental.unit_no + " " + rental.rental_adress)
        .toLowerCase()
        .includes(lowerCaseQuery);
      return (
        rental.work_subject.toLowerCase().includes(lowerCaseQuery) ||
        rental.work_category.toLowerCase().includes(lowerCaseQuery) ||
        rental.status.toLowerCase().includes(lowerCaseQuery) ||
        (rental.staffmember_name &&
          rental.staffmember_name.toLowerCase().includes(lowerCaseQuery)) || // Check if staffmember_name exists
        isUnitAddress ||
        rental.priority.toLowerCase().includes(lowerCaseQuery)
      );
    });
  };

  useEffect(() => {
    if (status === "Over Due") {
      setSearchQuery2("Over Due");
    }
  }, [status]);

  return (
    <>
      <VendorHeader />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup>
              <h1 style={{ color: "white" }}>Work Orders</h1>
            </FormGroup>
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
                    <Col xs="12" sm="6" className="d-flex">
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
                      <Dropdown
                        isOpen={search}
                        toggle={toggle3}
                        className="mx-2"
                      >
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
                              ? "Select Status"
                              : searchQuery2
                            : "Select Status"}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() => {
                              setSearchQuery2("New");
                              setSearchQuery("");
                            }}
                          >
                            New
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setSearchQuery2("In Progress");
                              setSearchQuery("");
                            }}
                          >
                            In Progress
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setSearchQuery2("On Hold");
                              setSearchQuery("");
                            }}
                          >
                            On Hold
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setSearchQuery2("Complete");
                              setSearchQuery("");
                            }}
                          >
                            Complete
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setSearchQuery2("Over Due");
                              setSearchQuery("");
                            }}
                          >
                            Over Due
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
                    </Col>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Work Order</th>
                      <th scope="col">Property</th>
                      <th scope="col">Category</th>
                      <th scope="col">priority</th>
                      <th scope="col">Status</th>
                      <th scope="col">Created At</th>
                      <th scope="col">Updated At</th>
                      <th scope="col">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterRentalsBySearchAndPage().map((vendor) => (
                      <tr
                        key={vendor.vendor_id}
                        onClick={() => navigateToDetails(vendor.workOrder_id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{vendor.work_subject}</td>
                        <td>
                          {vendor.rental_data.rental_adress}{" "}
                          {vendor.unit_data.rental_unit
                            ? " - " + vendor.unit_data.rental_unit
                            : null}
                        </td>
                        <td>{vendor.work_category}</td>
                        <td>{vendor.priority}</td>
                        <td>{vendor.status}</td>
                        <td>{vendor.createdAt}</td>
                        <td>{vendor.updateAt || "-"}</td>
                        <td>{vendor.date || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {workData.length > 0 ? (
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
                ) : null}
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

export default VendorWorkTable;
