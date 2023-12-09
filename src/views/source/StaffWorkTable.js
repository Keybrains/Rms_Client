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
  const [loader, setLoader] = useState(true);
  const [staffmember_name, setStaffMember] = useState("");
  const [staffDetails, setStaffDetails] = useState({});
  //console.log("staffname", staffmember_name);
  //console.log(staffDetails);
  //console.log("workData", workData);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(6);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
 
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

  let cookie_id = cookies.get("Staff ID");

  const getWorkData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/addstaffmember/staffmember_summary/${cookie_id}`
      );
      if (response.data && response.data.data) {
        //console.log(response.data.data);
        setStaffDetails(response.data.data);
        setStaffMember(response.data.data.staffmember_name);
        setTotalPages(Math.ceil(response.data.data.length / pageItem));
      } else {
        console.error("Invalid or missing data in API response.");
      }
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getWorkData();
  }, [pageItem]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  const paginatedData = workData.slice(startIndex, endIndex);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRentalData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/workorder/workorder/by-staff-member/${staffmember_name}`
      );
      setWorkData(response.data.data);
      //console.log(response.data);
    } catch (error) {
      console.error("Error fetching work order data:", error);
    }
  };

  React.useEffect(() => {
    if (staffmember_name) {
      getRentalData();
    }
    ////console.log(staffmember_name)
  }, [staffmember_name]);

  // Log staffmember_name after setting it
  //console.log("staffmember_name:", staffmember_name);

  const navigateToDetails = (workorder_id) => {
    // const propDetailsURL = `/admin/WorkOrderDetails/${tenantId}`;
    navigate(`/staff/staffworkdetails/${workorder_id}`);
    //console.log(workorder_id);
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
      );
    });
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
                    </tr>
                  </thead>
                  <tbody>
                    {filterRentalsBySearch().map((vendor) => (
                      <tr
                        key={vendor._id}
                        onClick={() => navigateToDetails(vendor.workorder_id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{vendor.work_subject}</td>
                        <td>{`${vendor.unit_no} ${vendor.staffmember_name}`}</td>
                        <td>{vendor.work_category}</td>
                        <td>{vendor.staffmember_name}</td>
                        <td>{vendor.status}</td>
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
        <br />
        <br />
      </Container>
    </>
  );
};

export default StaffWorkTable;
