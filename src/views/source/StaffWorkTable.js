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
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get("status");

  useEffect(() => {
    if (status === "Over Due") {
      setSearchQuery2("Over Due");
    }
  }, [status]);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [workData, setWorkData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [staffmember_name, setStaffMember] = useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  const [searchQuery2, setSearchQuery2] = useState("");

  const [search, setSearch] = React.useState(false);
  const toggle3 = () => setSearch((prevState) => !prevState);

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
    if (accessType?.staffmember_id) {
      setLoader(true);
      try {
        const response = await axios.get(
          `${baseUrl}/work-order/staff_work/${accessType.staffmember_id}`
        );
        setWorkData(response.data.data);
        console.log(response.data.data, "this is fetched data");
        setStaffMember(response.data.data.staffmember_name);
        setTotalPages(Math.ceil(response.data.data.length / pageItem) || 1);
      } catch (error) {
        console.error("Error fetching work order data:", error);
      } finally {
        setLoader(false);
      }
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
    console.log(workorder_id, "id is -===0");
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

    setSearchQuery("");
    return workData.filter((rental) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const isUnitAddress = (rental.unit_no + " " + rental.rental_adress)
        .toLowerCase()
        .includes(lowerCaseQuery);
      const hasStaffMemberName =
        rental.staffmember_name &&
        rental.staffmember_name.toLowerCase().includes(lowerCaseQuery);
      return (
        rental.work_subject.toLowerCase().includes(lowerCaseQuery) ||
        rental.work_category.toLowerCase().includes(lowerCaseQuery) ||
        rental.status.toLowerCase().includes(lowerCaseQuery) ||
        isUnitAddress ||
        hasStaffMemberName ||
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
      <Container fluid className="bg-white h-100">
        <Row>
          <Col xs="12">
            <CardHeader
              className=" mt-3 mb-3 mx-4"
              style={{
                backgroundColor: "#152B51",
                borderRadius: "10px",
                boxShadow: " 0px 4px 4px 0px #00000040 ",
              }}
            >
              <h2
                className="mb-0"
                style={{
                  color: "#ffffff",
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  fontSize: "26px",
                }}
              >
                 Work Orders
              </h2>
            </CardHeader>
            <Row
              className="mx-2 mt-4 d-flex align-items-center py-1"
              style={{ borderRadius: "10px", height: "69px" }}
            >
              <CardHeader className="border-0">
                <Row>
                  <Col xs="12" sm="6" className="d-flex">
                    <FormGroup>
                      <Input
                        fullWidth
                        type="text"
                        placeholder="Search here..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: "100%",
                          maxWidth: "200px",
                          boxShadow: " 0px 4px 4px 0px #00000040",
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
                          boxShadow: " 0px 4px 4px 0px #00000040",
                          border: "1px solid #ced4da",
                          maxWidth: "200px",
                          minWidth: "200px",
                          backgroundColor: "transparent",
                          color: "#A7A7A7"
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
            </Row>
            
            <Row
              className="mx-3 mt-3 d-flex align-items-center py-1"
              style={{ borderRadius: "10px", height: "69px" }}
            >
              <Col>
                <Row
                  className="mx-1 d-flex align-items-center"
                  style={{
                    border: "2px solid rgba(50, 69, 103, 1)",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                    height: "45px",
                    fontFamily: "poppins",
                    fontSize: "14px",
                    fontWeight: "600",
                    boxShadow: " 0px 4px 4px 0px #00000040",

                  }}
                >
                  <Col>Work Order</Col>
                  <Col>Property</Col>
                  <Col>Category</Col>
                  <Col>Priority</Col>
                  <Col>Status</Col>
                  <Col>Created At</Col>
                  <Col>Updated At</Col>
                  <Col>Due Date</Col>
                </Row>
                <Row
                  className="mx-1 mt-3"
                  style={{
                    border: "0.5px solid rgba(50, 69, 103, 1)",
                    borderBottomLeftRadius: "12px",
                    borderBottomRightRadius: "12px",
                    overflow: "hidden",
                    fontSize: "16px",
                    fontWeight: "600",
                    lineHeight: "19.12px",
                  }}
                >
                  <Col>
                    {filterTenantsBySearchAndPage().map((vendor) => (
                      <Row
                        key={vendor?.workOrder_id}
                        className="d-flex align-items-center"
                        onClick={() => navigateToDetails(vendor?.workOrder_id)}
                        style={{
                          cursor: "pointer",
                          border: "0.5px solid rgba(50, 69, 103, 1)",
                          fontSize: "12px",
                          height: "40px",
                          fontFamily: "poppins",
                          fontWeight: "600",
                          lineHeight: "10.93px",
                        }}
                      >
                        <Col>{vendor?.work_subject}</Col>
                        <Col>
                          {vendor?.rental_data?.rental_adress}-
                          {vendor?.unit_data?.rental_unit}{" "}
                          {vendor?.unit_data?.rental_unit
                            ? " - " + vendor?.unit_data?.rental_unit
                            : null}
                        </Col>
                        <Col>{vendor?.work_category}</Col>
                        <Col>{vendor?.priority}</Col>
                        <Col>{vendor?.status}</Col>
                        <Col>{vendor?.createdAt}</Col>
                        <Col>{vendor?.updatedAt || "-"}</Col>
                        <Col>{vendor?.date || "-"}</Col>
                      </Row>
                    ))}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default StaffWorkTable;
