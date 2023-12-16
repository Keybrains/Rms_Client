import React, { useState, useEffect } from "react";
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
import { jwtDecode } from "jwt-decode";
import Header from "components/Headers/Header";
import axios from "axios";
import swal from "sweetalert";
import { RotatingLines } from "react-loader-spinner";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Vendor = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(6);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    getVendorData();
  }, [pageItem]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (vendorData) {
    paginatedData = vendorData.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const getVendorData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/vendor/vendor`
      );
      setLoader(false);
      setVendorData(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / pageItem));
      // //console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteVendor = async (id) => {
    // Show a confirmation dialog to the user
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this vendor!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(
            `${baseUrl}/vendor/delete_vendor`,
            {
              data: { _id: id },
            }
          );

          if (response.data.statusCode === 200) {
            swal("Success!", "Vendor deleted successfully", "success");
            getVendorData();
          } else if (response.data.statusCode === 201) {
            swal(
              "Warning!",
              "Vendor already assigned to workorder!",
              "warning"
            );
            getVendorData();
          } else {
            swal("", response.data.message, "error");
          }
        } catch (error) {
          console.error("Error deleting vendor:", error);
        }
      } else {
        swal("Cancelled", "Vendor is safe :)", "info");
      }
    });
  };

  const editVendor = (id) => {
    navigate(`/admin/addvendor/${id}`);
    //console.log(id);
  };

  const filterTenantsBySearch = () => {
    if (searchQuery === undefined) {
      return vendorData;
    }
    return vendorData.filter((tenant) => {
      if (!tenant.entries) {
        return false; // If entries is undefined, exclude this tenant
      }

      const name = tenant.tenant_firstName + " " + tenant.tenant_lastName;

      return (
        (tenant.entries.rental_adress &&
          tenant.entries.rental_adress
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (tenant.tenant_firstName &&
          tenant.tenant_firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (tenant.entries.lease_type &&
          tenant.entries.lease_type
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (tenant.tenant_lastName &&
          tenant.tenant_lastName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterTenantsBySearch();
    const paginatedData = filteredData.slice(startIndex, endIndex);
    return paginatedData;
  };

  return (
    <>
      <Header />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Vendor</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/admin/addvendor")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add Vendor
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
                      <FormGroup className="">
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
                      <th scope="col">Name</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Mail ID</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterTenantsBySearchAndPage().map((vendor) => (
                      <tr key={vendor._id}>
                        <td>{vendor.vendor_name}</td>
                        <td>{vendor.vendor_phoneNumber}</td>
                        <td>{vendor.vendor_email}</td>
                        <td>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteVendor(vendor._id)}
                            >
                              <DeleteIcon />
                            </div>
                            &nbsp; &nbsp;
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => editVendor(vendor._id)}
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

export default Vendor;
