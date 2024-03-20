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

  useEffect(() => {
    if (status) {
      setSearchQuery2(status);
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
  var paginatedData;
  if (workData) {
    paginatedData = workData.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRentalData = async () => {
    if (accessType?.tenant_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/work-order/tenant_work/${accessType.tenant_id}`
        );

        setTotalPages(Math.ceil(response.data.data.length / pageItem));
        setWorkData(response.data.data);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching work order data:", error);
      }
    }
  };

  useEffect(() => {
    getRentalData();
  }, [accessType]);

  const navigateToDetails = (tenantId) => {
    navigate(`/tenant/Tworkorderdetail/${tenantId}`);
  };

  const filterRentalsBySearch = () => {
    if (searchQuery2 && !searchQuery) {
      if (searchQuery2 === "All") {
        return workData;
      } else if (searchQuery2 === "Overdue") {
        return workData.filter((rental) => {
          return (
            moment(rental.date).format("YYYY-MM-DD") <
              moment().format("YYYY-MM-DD") && rental.status !== "Complete"
          );
        });
      } else if (searchQuery2 === "New") {
        return workData.filter((rental) => {
          return (
            moment(rental.date).format("YYYY-MM-DD") >=
              moment().format("YYYY-MM-DD") && rental.status !== "Complete"
          );
        });
      } else {
        return workData.filter((rental) => {
          const lowerCaseQuery = searchQuery2.toLowerCase();
          return rental.status.toLowerCase().includes(lowerCaseQuery);
        });
      }
    }

    if (!searchQuery && !searchQuery2) {
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

    // if (upArrow.length > 0) {
    //   const sortingArrows = upArrow;
    //   sortingArrows.forEach((value) => {
    //     switch (value) {
    //       case "rental_adress":
    //         filteredData.sort((a, b) =>
    //           a.rental_adress.localeCompare(b.rental_adress)
    //         );
    //         break;
    //       case "work_subject":
    //         filteredData.sort((a, b) =>
    //           a.work_subject.localeCompare(b.work_subject)
    //         );
    //         break;
    //       case "work_category":
    //         filteredData.sort((a, b) =>
    //           a.work_category.localeCompare(b.work_category)
    //         );
    //         break;
    //       case "staffmember_name":
    //         filteredData.sort((a, b) =>
    //           a.staffmember_name.localeCompare(b.staffmember_name)
    //         );
    //         break;
    //     }
    //   });
    //   return filteredData;
    // }
  };
  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterRentalsBySearch();
    const paginatedData = filteredData.slice(startIndex, endIndex);
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
      <Container className="mt--8" fluid>
        {/* Table */}
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Work Orders</h1>
            </FormGroup>
          </Col>

          <Col className="text-right">
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
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="d-flex">
                  {/* <Col xs="12" sm="6"> */}
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
                            setSearchQuery2("Overdue");
                            setSearchQuery("");
                          }}
                        >
                          Overdue
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
              <Table className="align-items-center table-flush" responsive>
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
                ) : filterTenantsBySearchAndPage().length === 0 ? (
                  <>
                    <tbody>
                      <tr className="text-center">
                        <td colSpan="8" style={{ fontSize: "15px" }}>
                          No Work Order Added
                        </td>
                      </tr>
                    </tbody>
                  </>
                ) : (
                  <>
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
                        <th scope="col">
                          Assigned
                          {sortBy.includes("staffmember_name") ? (
                            upArrow.includes("staffmember_name") ? (
                              <ArrowDownwardIcon
                                onClick={() => sortData("staffmember_name")}
                              />
                            ) : (
                              <ArrowUpwardIcon
                                onClick={() => sortData("staffmember_name")}
                              />
                            )
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("staffmember_name")}
                            />
                          )}
                        </th>
                        <th scope="col">Status</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterTenantsBySearchAndPage().map((rental) => (
                        <tr
                          key={rental?.workOrder_id}
                          onClick={() =>
                            navigateToDetails(rental?.workOrder_id)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>{rental?.work_subject}</td>
                          <td>
                            {rental?.rental_adress}{" "}
                            {rental?.rental_unit
                              ? " - " + rental?.rental_unit
                              : null}
                          </td>
                          <td>{rental?.work_category}</td>
                          <td>{rental?.staffmember_name}</td>
                          <td>{rental?.status}</td>
                          <td>{rental?.createdAt}</td>
                          <td>{rental?.updatedAt || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
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
