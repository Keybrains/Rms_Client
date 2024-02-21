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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import StaffHeader from "components/Headers/StaffHeader";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const StaffWorkTable = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [workData, setWorkData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  const paginatedData = workData.slice(startIndex, endIndex);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRentalData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/work-order/staff_work/${accessType.staffmember_id}`
      );
      setWorkData(response.data.data);
      console.log(response.data.data, "this is fetched data");
      setTotalPages(Math.ceil(response.data.data.length / pageItem) || 1);
    } catch (error) {
      console.error("Error fetching work order data:", error);
    }
  };
  useEffect(() => {
    getRentalData();
  }, [pageItem]);

  React.useEffect(() => {
    if (accessType) {
      getRentalData();
    }
  }, [accessType]);

  const navigateToDetails = (workorder_id) => {
    navigate(`/staff/staffworkdetails/${workorder_id}`);
  };

  const filterRentalsBySearch = () => {
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
        isUnitAddress ||
        rental.staffmember_name.toLowerCase().includes(lowerCaseQuery) ||
        rental.priority.toLowerCase().includes(lowerCaseQuery)
      );
    });
  };

  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterRentalsBySearch();
    const paginatedData = filteredData.slice(startIndex, endIndex);
    return paginatedData;
  };

  return (
    <>
      <StaffHeader />
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
                    <th scope="col">priority</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {filterTenantsBySearchAndPage().map((vendor) => (
                    <tr
                      key={vendor.workOrder_id}
                      onClick={() => navigateToDetails(vendor.workOrder_id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{vendor.work_subject}</td>
                      <td>
                        {vendor.rental_data.rental_adress}-
                        {vendor.unit_data.rental_unit}{" "}
                        {vendor.unit_data.rental_unit
                          ? " - " + vendor.unit_data.rental_unit
                          : null}
                      </td>
                      <td>{vendor.work_category}</td>
                      <td>{vendor.priority}</td>
                      <td>{vendor.status}</td>
                      <td>{vendor.createdAt}</td>
                      <td>{vendor.updateAt || "-"}</td>
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
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default StaffWorkTable;
