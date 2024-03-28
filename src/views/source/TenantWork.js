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
import moment from "moment";

const TenantWork = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get("status");

  // useEffect(() => {
  //   if (status) {
  //     setSearchQuery2(status);
  //   }
  // }, [status]);
  useEffect(() => {
    if (status === "Over Due") {
      setSearchQuery2("Over Due");
    }
  }, [status]);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let navigate = useNavigate();
  const [workData, setWorkData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  let [loader, setLoader] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const [searchQuery2, setSearchQuery2] = useState("");
  const [search, setSearch] = React.useState(false);
  const toggle3 = () => setSearch((prevState) => !prevState);

  const [upArrow, setUpArrow] = useState([]);
  const [sortBy, setSortBy] = useState([]);

  const [accessType, setAccessType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  // var paginatedData;
  // if (workData) {
  //   paginatedData = workData.slice(startIndex, endIndex);
  // }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRentalData = async () => {
    if (accessType?.tenant_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/work-order/tenant_work/${accessType?.tenant_id}`
        );

        setWorkData(response.data.data);
        console.log(response.data.data, "janak")
        setTotalPages(Math.ceil(response.data?.data?.length / pageItem));
      } catch (error) {
        console.error("Error fetching work order data:", error);
      }
      finally {
        setLoader(false);

      }
    }
  };

  useEffect(() => {
    getRentalData();
  }, [accessType, pageItem]);

  const navigateToDetails = (tenantId) => {
    navigate(`/tenant/Tworkorderdetail/${tenantId}`);
  };

  const filterRentalsBySearch = () => {
    let filteredData;
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
    if (!searchQuery ) {
      return workData;
    }

    if (searchQuery && !searchQuery2) {
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
            break;
        }
      });
      return filteredData;
    }
  };
  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterRentalsBySearch();
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
  };

  return (
    <>
      <TenantsHeader />
      {/* Page content */}
      <Container className="" fluid style={{ marginTop: "4rem", height: "100vh" }}>
        {/* Table */}
        <Row>
          <Col className="text-right">
            <Button
              className="mx-4"
              // color="primary"
              //  href="#rms"
              onClick={() => navigate("/tenant/taddwork")}
              size="small"
              style={{ background: "#152B51", color: "white" }}
            >
              Add Work Order
            </Button>
          </Col>
        </Row>
        <br />
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

        <Row>
          <div className="col">
            {/* <Card className="shadow"> */}
            <CardHeader className="border-0">
              <Row className="d-flex mx-2">
                {/* <Col xs="12" sm="6"> */}
                <FormGroup className="mr-sm-2">
                  <Input
                    fullWidth
                    type="text"
                    placeholder="Search here..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchQuery2("");
                    }}
                    style={{
                      width: "100%",
                      maxWidth: "200px",
                      boxShadow: " 0px 4px 4px 0px #00000040",
                      minWidth: "200px",
                    }}
                  />
                </FormGroup>
                <FormGroup className="mr-sm-2">
                  <Dropdown isOpen={search} toggle={toggle3}>
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
                          ? "Select Type"
                          : searchQuery2
                        : "Select Type"}
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
                </FormGroup>
                {/* </Col> */}
              </Row>
            </CardHeader>

            <Row
              className="mx-2  d-flex align-items-center py-1"
              style={{
                borderRadius: "10px", height: "auto",
                // boxShadow: " 0px 4px 4px 0px #00000040",

              }}
            >
              <Col>
                <Row
                  className="mx-1 d-flex align-items-center"
                  style={{
                    border: "2px solid rgba(50, 69, 103, 1)",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                    height: "45px",
                    fontSize: "14px",
                    fontFamily: "poppins",
                    fontWeight: "600",
                    boxShadow: "0px 4px 4px 0px #00000040",
                  }}
                >
                  <Col>Work Order</Col>
                  <Col>Property</Col>
                  <Col>Category</Col>
                  <Col>Assigned</Col>
                  <Col>Status</Col>
                  <Col>Created At</Col>
                  <Col>Updated At</Col>

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
                    // lineHeight: "19.12px",
                  }}
                >
                  <Col>
                    {filterTenantsBySearchAndPage()?.map((rental) => (
                      <Row
                        key={rental?.workOrder_id}
                        className="d-flex align-items-center"
                        onClick={() =>
                          navigateToDetails(rental?.workOrder_id)
                        }
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
                        <Col>{rental?.work_subject}</Col>
                        <Col>
                          {rental?.rental_adress}{" "}
                          {rental?.rental_unit
                            ? " - " + rental?.rental_unit
                            : null}
                        </Col>
                        <Col>{rental?.work_category}</Col>
                        <Col>{rental?.staffmember_name}</Col>
                        <Col>{rental?.status}</Col>
                        <Col>{rental?.createdAt}</Col>
                        <Col>{rental?.updatedAt || "-"}</Col>

                      </Row>
                    ))}
                  </Col>
                </Row>
              </Col>
            </Row>
            {workData?.length > 0 ? (
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

            {/* </Card> */}
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

