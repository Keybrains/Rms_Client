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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import deleicon from "../../assets/img/icons/common/delete.svg";
import editicon from "../../assets/img/icons/common/editicon.svg";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";


const Vendor = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { admin } = useParams();
  const [vendorData, setVendorData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const [upArrow, setUpArrow] = useState([]);
  const [sortBy, setSortBy] = useState([]);

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
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getVendorData = async () => {
    if (accessType?.admin_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/vendor/vendors/${accessType?.admin_id}`
        );
        setLoader(false);
        if (response.data.statusCode === 200) {
          setVendorData(response.data.data);
          setTotalPages(Math.ceil(response.data.data.length / pageItem));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  useEffect(() => {
    getVendorData();
    getVendorsLimit();
  }, [accessType]);

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
            `${baseUrl}/vendor/delete_vendor/${id}`
          );

          if (response.data.statusCode === 200) {
            toast.success("Vendor Deleted Successful!", {
              position: "top-center",
              autoClose: 1000,
            });
            getVendorsLimit();
            getVendorData();
          } else if (response.data.statusCode === 201) {
            toast.warning("Vendor already assigned to workorder!", {
              position: "top-center",
              autoClose: 1000,
            });

            getVendorData();
          } else {
            toast.error(response.data.message, {
              position: "top-center",
              autoClose: 1000,
            });
          }
        } catch (error) {
          console.error("Error deleting vendor:", error);
        }
      } else {
        toast.success("Vendor is safe", {
          position: "top-center",
        });
      }
    });
  };

  const editVendor = (id) => {
    navigate(`/${admin}/addvendor/${id}`);
    //console.log(id);
  };

  const filterTenantsBySearch = () => {
    let filteredData = vendorData;

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toString().toLowerCase();
      filteredData = filteredData.filter((tenant) => {
        const phoneNumberString = tenant.vendor_phoneNumber?.toString();
        const isMatch =
          (tenant.vendor_name &&
            tenant.vendor_name.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (tenant.vendor_email &&
            tenant.vendor_email.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (phoneNumberString &&
            phoneNumberString.includes(lowerCaseSearchQuery));
        return isMatch;
      });
    }

    if (upArrow.length > 0) {
      upArrow.forEach((value) => {
        switch (value) {
          case "vendor_name":
            filteredData.sort((a, b) =>
              a.vendor_name.localeCompare(b.vendor_name)
            );
            break;
          case "vendor_email":
            filteredData.sort((a, b) =>
              a.vendor_email.localeCompare(b.vendor_email)
            );
            break;
          case "vendor_phoneNumber":
            filteredData.sort(
              (a, b) => a.vendor_phoneNumber - b.vendor_phoneNumber
            );
            break;
          default:
            // If an unknown sort option is provided, do nothing
            break;
        }
      });
    }

    if (upArrow.length === 0) {
      upArrow.forEach((value) => {
        switch (value) {
          case "vendor_name":
            filteredData.sort((a, b) =>
              b.vendor_name.localeCompare(a.vendor_name)
            );
            break;
          case "vendor_email":
            filteredData.sort((a, b) =>
              b.vendor_email.localeCompare(a.vendor_email)
            );
            break;
          case "vendor_phoneNumber":
            filteredData.sort(
              (a, b) => b.vendor_phoneNumber - a.vendor_phoneNumber
            );
            break;
          default:
            // If an unknown sort option is provided, do nothing
            break;
        }
      });
    }

    return filteredData;
  };

  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterTenantsBySearch();
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
    //console.log(value);
    // setOnClickUpArrow(!onClickUpArrow);
  };

  useEffect(() => {
    // setLoader(false);
    // filterRentalsBySearch();
    getVendorData();
  }, [upArrow, sortBy]);

  const [countRes, setCountRes] = useState("");

  const getVendorsLimit = async () => {
    if (accessType?.admin_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/vendor/limitation/${accessType?.admin_id}`
        );
        console.log(response.data, "yash");
        setCountRes(response.data);
      } catch (error) {
        console.error("Error fetching rental data:", error);
      }
    }
  };




  return (
    <>
      <Header />
      <Container className="" fluid style={{ marginTop: "3rem", height: "100vh" }}>

        <Row>

          <Col className="text-right">
            {/* <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/" + admin + "/addvendor")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add Vendor
            </Button> */}
            <Button
              // color="primary"
              onClick={() => {
                if (countRes.statusCode === 201) {
                  swal(
                    "Plan Limitation",
                    "The limit for adding vendor according to the plan has been reached.",
                    "warning"
                  );
                } else {
                  navigate("/" + admin + "/addvendor");
                }
              }}
              size="small"
              style={{ background: "#152B51", color: "#fff" }}

            >
              Add Vendor
            </Button>
          </Col>

          <Col xs="12" lg="12" sm="6">
           
            <CardHeader
              className=" mt-3 "
              style={{
                backgroundColor: "#152B51",
                borderRadius: "10px",
                boxShadow: " 0px 4px 4px 0px #00000040 ",
              }}
            >
              <h2
                className=""
                style={{
                  color: "#ffffff",
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  fontSize: "26px",
                }}
              >
                Vendor
              </h2>
            </CardHeader>
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
              <>
                {/* <Card className="shadow"> */}
                {/* <CardHeader className="border-0"> */}
                <Row className="mb-3">
                  <Col xs="12" sm="6">
                    <FormGroup className="">
                      <Input
                        fullWidth
                        type="text"
                        placeholder="Search here..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: "100%",
                          maxWidth: "200px",
                          minWidth: "200px",
                          boxShadow: " 0px 4px 4px 0px #00000040",
                          border: "1px solid #ced4da",
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <FormGroup>
                      <p style={{ fontFamily: "Poppins", fontSize: "18px", fontWeight: "500" }}>

                        Added :{" "}
                        <b style={{ color: "#152B51", fontWeight: 1000 }}>

                          {countRes.vendorCount}
                        </b>{" "}
                        {" / "}
                        Total :{" "}
                        <b style={{ color: "#152B51", fontWeight: 1000 }}>

                          {countRes.vendorCountLimit}
                        </b>
                      </p>
                    </FormGroup>
                  </Col>
                </Row>
                {/* </CardHeader> */}
                <Table className="align-items-center table-flush" responsive style={{ borderCollapse: "collapse" }}>
                  <thead className="" style={{
                    height: "45px",
                    fontSize: "14px",
                    fontFamily: "poppins",
                    fontWeight: "600",
                    boxShadow: " 0px 4px 4px 0px #00000040",
                  }}>
                    <tr style={{
                      border: "2px solid rgba(50, 69, 103, 1)",
                    }}>
                      <th scope="col" style={{
                        borderTopLeftRadius: "15px",

                        color: "#152B51"
                      }}>
                        Name
                        {sortBy.includes("vendor_name") ? (
                          upArrow.includes("vendor_name") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("vendor_name")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("vendor_name")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("vendor_name")}
                          />
                        )}
                      </th>
                      <th scope="col" style={{ color: "#152B51" }}>
                        Phone Number
                        {sortBy.includes("vendor_phoneNumber") ? (
                          upArrow.includes("vendor_phoneNumber") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("vendor_phoneNumber")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("vendor_phoneNumber")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("vendor_phoneNumber")}
                          />
                        )}
                      </th>
                      <th scope="col" style={{ color: "#152B51" }}>
                        Mail ID
                        {sortBy.includes("vendor_email") ? (
                          upArrow.includes("vendor_email") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("vendor_email")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("vendor_email")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("vendor_email")}
                          />
                        )}
                      </th>
                      <th scope="col" style={{ borderTopRightRadius: "15px", color: "#152B51" }}>ACTION</th>
                    </tr>
                  </thead>
                  {vendorData?.length === 0 ? (
                    <tbody>
                      <tr className="text-center">
                        <td colSpan="4">No Vendors Added</td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      <tr style={{
                        border: "none",
                      }}>
                        {/* Empty row */}
                        <td colSpan="9"></td>
                      </tr>
                      {filterTenantsBySearchAndPage()?.map((vendor) => (
                        <tr key={vendor.vendor_id} style={{
                          border: "0.5px solid rgba(50, 69, 103, 1)",
                          fontSize: "12px",
                          height: "40px",
                          fontFamily: "poppins",
                          fontWeight: "600",
                          lineHeight: "10.93px",
                        }}>
                          <td className="bordertopintd">{vendor.vendor_name}</td>
                          <td className="bordertopintd">{vendor.vendor_phoneNumber}</td>
                          <td className="bordertopintd">{vendor.vendor_email}</td>
                          <td className="bordertopintd">
                            <div style={{ display: "flex", gap: "5px" }}>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={() => deleteVendor(vendor.vendor_id)}
                              >
                                <img src={deleicon} width={20} height={20} />

                              </div>
                              &nbsp; &nbsp;
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={() => editVendor(vendor.vendor_id)}
                              >
                                <img src={editicon} width={20} height={20} />

                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </Table>
                {paginatedData?.length > 0 ? (
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
                {/* </Card> */}
              </>
            )}
          </div>
        </Row>
        <br />
        <br />
        <ToastContainer />
      </Container>
    </>
  );
};

export default Vendor;
