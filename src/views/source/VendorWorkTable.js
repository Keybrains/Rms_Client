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
  DropdownItem
} from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import VendorHeader from "components/Headers/VendorHeader";
import Cookies from 'universal-cookie';

const VendorWorkTable = () => {
  const navigate = useNavigate();
  const [workData, setWorkData] = useState([]);
  const [loader, setLoader] = useState(true);
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
      setLoader(false);
      setWorkData(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / pageItem));
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

  let cookies = new Cookies();
  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let authConfig = {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
          token: cookies.get("token"),
        },
      };
      // auth post method
      let res = await axios.post(
        "https://propertymanager.cloudpress.host/api/register/auth",
        { purpose: "validate access" },
        authConfig
      );
      if (res.data.statusCode !== 200) {
        // cookies.remove("token");
        navigate("/auth/login");
      }
    } else {
      navigate("/auth/login");
    }
  };

  React.useEffect(() => {
    chackAuth();
  }, [cookies.get("token")]);

  const navigateToDetails = (workorder_id) => {
    // const propDetailsURL = `/admin/WorkOrderDetails/${tenantId}`;
    navigate(`/vendor/vendorworkdetail/${workorder_id}`);
    console.log(workorder_id);
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
                        onClick={() =>
                          navigateToDetails(vendor.workorder_id)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td>{vendor.work_subject}</td>
                        <td>{`${vendor.unit_no} ${vendor.rental_adress}`}</td>
                        <td>{vendor.work_category}</td>
                        <td>{vendor.staffmember_name}</td>
                        <td>{vendor.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {paginatedData.length > 0 ? <Row>
                  <Col className="text-right m-3">
                    <Dropdown isOpen={leasedropdownOpen} toggle={toggle2}>
                      <DropdownToggle caret >
                        {pageItem}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() => setPageItem(6)}
                        >
                          6
                        </DropdownItem>
                        <DropdownItem
                          onClick={() =>
                            setPageItem(12)
                          }
                        >
                          12
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => setPageItem(18)}
                        >
                          18
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <Button
                      className="p-0"
                      style={{ backgroundColor: '#d0d0d0' }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-caret-left" viewBox="0 0 16 16">
                        <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
                      </svg>
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>{" "}
                    <Button
                      className="p-0"
                      style={{ backgroundColor: '#d0d0d0' }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
                        <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                      </svg>
                    </Button>{" "}

                  </Col>
                </Row> : <></>}
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
