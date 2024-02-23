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
import TenantsHeader from "components/Headers/TenantsHeader";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const TenantWork = () => {
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
  const [staffDetails, setStaffDetails] = useState({});
  //console.log("staffname", staffmember_name);
  //console.log(staffDetails);
  //console.log("workData", workData);
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

  let cookie_id = localStorage.getItem("Staff ID");

  // const getWorkData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${baseUrl}/addstaffmember/staffmember_summary/${cookie_id}`
  //     );
  //     if (response.data && response.data.data) {
  //       console.log(response.data.data,"sonani");
  //       setStaffDetails(response.data.data);

  //       setStaffMember(response.data.data.staffmember_name);
  //       setTotalPages(Math.ceil(response.data.data.length / pageItem)||1);
  //     } else {
  //       console.error("Invalid or missing data in API response.");
  //     }
  //     setLoader(false);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   getWorkData();
  // }, [pageItem]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  const paginatedData = workData.slice(startIndex, endIndex);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRentalData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `${baseUrl}/work-order/tenant_work/${accessType.tenant_id}`
      );

      setWorkData(response.data.data);
      console.log(response.data, "yash")
      setTotalPages(Math.ceil(response.data.data.length / pageItem) || 1);

    } catch (error) {

      console.error("Error fetching work order data:", error);
    }
    finally {
      setLoader(false);
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

  const navigateToDetails = (tenantId) => {
    navigate(`/tenant/Tworkorderdetail/${tenantId}`);
    console.log(tenantId, "id is -===0");
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
  //       rental.rental_adress.toLowerCase().includes(lowerCaseQuery)||
  //       rental.staffmember_name.toLowerCase().includes(lowerCaseQuery)||
  //       rental.priority.toLowerCase().includes(lowerCaseQuery)
  //     );
  //   });
  // };
  console.log(searchQuery2, "yash");
  const filterRentalsBySearch = () => {
    // Start by filtering based on the selected status if available
    if (searchQuery2 && searchQuery2 !== "All") {
      if (searchQuery2 === "Over Due") {
        // Filter for Over Due items
        let currentDate = new Date();
        return workData.filter(
          rental => new Date(rental.date) < currentDate && rental.status !== "Complete"
        );
      } else {
        // Filter for other statuses
        return workData.filter(
          rental => rental.status.toLowerCase() === searchQuery2.toLowerCase()
        );
      }
    }
  
    // If no specific status selected, apply other filters
    // Here, I assume you want to filter based on other search criteria
    return workData.filter(rental => {
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
        hasStaffMemberName
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
      <TenantsHeader />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup>
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
                <Row>
                  <Col
                    xs="12"
                    sm="6"
                    className="d-flex"
                    style={{ gap: "10px" }}
                  >
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
                ) : workData.length === 0 ? (
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
                        <th scope="col">Work Order</th>
                        <th scope="col">Property</th>
                        <th scope="col">Category</th>
                        <th scope="col">Assigned</th>
                        <th scope="col">Status</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterTenantsBySearchAndPage().map((rental) => (
                        <tr
                          key={rental?.workOrder_id}
                          onClick={() => navigateToDetails(rental?.workOrder_id)}
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

export default TenantWork;
