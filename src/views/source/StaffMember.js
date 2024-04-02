import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Table,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Header from "components/Headers/Header";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { RotatingLines } from "react-loader-spinner";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import deleicon from "../../assets/img/icons/common/delete.svg";
import editicon from "../../assets/img/icons/common/editicon.svg";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const StaffMember = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id, admin } = useParams();
  let [StaffMemberData, setStaffMemberData] = useState();
  const [open, setOpen] = React.useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStaffMember, setEditingStaffMember] = React.useState(null);
  // let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  // let [id, setId] = React.useState();
  let [loader, setLoader] = React.useState(true);
  // let [editData, setEditData] = React.useState({});
  let navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const [upArrow, setUpArrow] = useState([]);
  const [sortBy, setSortBy] = useState([]);

  const openEditDialog = (staff) => {
    setEditingStaffMember(staff);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingStaffMember(null);
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

  const getStaffMemberData = async () => {
    if (accessType?.admin_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/staffmember/staff_member/${accessType?.admin_id}`
        );
        setLoader(false);
        setStaffMemberData(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / pageItem));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const [countRes, setCountRes] = useState("");
  const getStaffLimit = async () => {
    if (accessType?.admin_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/staffmember/limitation/${accessType?.admin_id}`
        );
        console.log(response.data);
        setCountRes(response.data);
      } catch (error) {
        console.error("Error fetching rental data:", error);
      }
    }
  };

  const editStaffMemberData = async (id, updatedData) => {
    try {
      const editUrl = `${baseUrl}/addstaffmember/staffmember/${id}`;
      //console.log("Edit URL:", editUrl);
      //console.log("ID:", id);
      //console.log("Updated Data:", updatedData); // Log the updated data for debugging

      const response = await axios.put(editUrl, updatedData); // Send the updated data in the request body
      //console.log("Edit Response:", response);

      if (response.status === 200) {
        toast.success("Staff Member updated successfully!", {
          position: "top-center",
        });
        getStaffMemberData(); // Refresh the data after successful edit
      } else {
        toast.error(response.data.message, {
          position: "top-center",
        });
        console.error("Edit request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error editing:", error);
    }
  };

  //console.log(StaffMemberData, "hii");
  //console.log("object");

  // Delete selected
  const deleteStaffMember = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this staff member!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${baseUrl}/staffmember/staff_member/${id}`)
          .then((response) => {
            if (response.data.statusCode === 200) {
              toast.success("Staff Member deleted successfully!", {
                position: "top-center",
                autoClose: 1000
              });
              getStaffMemberData();
              getStaffLimit();
            } else if (response.data.statusCode === 201) {
              toast.warning("Staff Member already assigned to workorder!", {
                position: "top-center",
                autoClose: 1000
              });
              getStaffMemberData();
            } else if (response.data.statusCode === 202) {
              toast.warning("Staff Member already assigned to property", {
                position: "top-center",
                autoClose: 1000
              });
              getStaffMemberData();
            } else {
              toast.error(response.data.message, {
                position: "top-center",
                autoClose: 1000
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting:", error);
          });
      } else {
        toast.success("Staff Member is safe :)", {
          position: "top-center",
          autoClose: 1000
        });
      }
    });
  };

  useEffect(() => {
    getStaffMemberData();
    getStaffLimit();
  }, [accessType]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (StaffMemberData) {
    paginatedData = StaffMemberData.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const editStaffMember = (id) => {
    navigate(`/${admin}/AddStaffMember/${id}`);
    //console.log(id);
  };

  const filterTenantsBySearch = () => {
    let filteredData = StaffMemberData;

    if (searchQuery) {
      filteredData = filteredData.filter((staff) => {
        const isNameMatch = staff.staffmember_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const isDesignationMatch = staff.staffmember_designation
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return isNameMatch || isDesignationMatch;
      });
    }

    if (upArrow.length > 0) {
      const sortingArrows = upArrow.length > 0 ? upArrow : null;

      sortingArrows.forEach((sort) => {
        switch (sort) {
          case "staffmember_name":
            filteredData.sort((a, b) => {
              const comparison = a.staffmember_name.localeCompare(
                b.staffmember_name
              );
              return upArrow.includes("staffmember_name")
                ? comparison
                : -comparison;
            });
            break;
          case "staffmember_designation":
            filteredData.sort((a, b) => {
              const comparison = a.staffmember_designation.localeCompare(
                b.staffmember_designation
              );
              return upArrow.includes("staffmember_designation")
                ? comparison
                : -comparison;
            });
            break;
          case "createAt":
            filteredData.sort((a, b) => {
              const comparison = new Date(a.createAt) - new Date(b.createAt);
              return upArrow.includes("createAt") ? comparison : -comparison;
            });
            break;
          case "staffmember_phoneNumber":
            filteredData.sort((a, b) => {
              const comparison =
                a.staffmember_phoneNumber - b.staffmember_phoneNumber;
              return upArrow.includes("staffmember_phoneNumber")
                ? comparison
                : -comparison;
            });
            break;
          case "staffmember_email":
            filteredData.sort((a, b) => {
              const comparison = a.staffmember_email.localeCompare(
                b.staffmember_email
              );
              return upArrow.includes("staffmember_email")
                ? comparison
                : -comparison;
            });
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
    //console.log(value);
    // setOnClickUpArrow(!onClickUpArrow);
  };

  useEffect(() => {
    // setLoader(false);
    // filterRentalsBySearch();
    getStaffMemberData();
  }, [upArrow, sortBy]);
  return (
    <>
      <Header />

      {/* Page content */}
      <Container className="" fluid style={{ marginTop: "3rem", height: "100vh" }}>
        <Row>
          <Col className="text-right">
            <Button
              // color="primary"
              //  href="#rms"
              // className="mr-4"
              onClick={() => {
                if (countRes.statusCode === 201) {
                  swal(
                    "Plan Limitation",
                    "The limit for adding staff members according to the plan has been reached.",
                    "warning"
                  );
                } else {
                  navigate("/" + admin + "/AddStaffMember");
                }
              }}
              size="small"
              style={{ background: "#152B51", color: "#fff" }}

            >
              Add Staff Member
            </Button>
          </Col>
          <Col xs="12" lg="12" sm="6">
            {/* <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Type</h1>
            </FormGroup> */}
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
                Staff Member
              </h2>
            </CardHeader>
          </Col>

        </Row>

        <br />
        {/* Table */}
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
                            {countRes.rentalCount}
                          </b>{" "}
                          {" / "}
                          Total :{" "}
                          <b style={{ color: "#152B51", fontWeight: 1000 }}>
                            {countRes.propertyCountLimit}
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
                      <th className="tablefontstyle" scope="col" style={{
                        borderTopLeftRadius: "15px",

                        color: "#152B51"
                      }}>
                        NAME
                        {sortBy.includes("staffmember_name") ? (
                          upArrow.includes("staffmember_name") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("staffmember_name")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("staffmember_name")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("staffmember_name")}
                          />
                        )}
                      </th>
                      <th className="tablefontstyle" scope="col" style={{ color: "#152B51" }}>
                        DESIGNATION
                        {sortBy.includes("staffmember_designation") ? (
                          upArrow.includes("staffmember_designation") ? (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("staffmember_designation")
                              }
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("staffmember_designation")
                              }
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("staffmember_designation")}
                          />
                        )}
                      </th>
                      <th className="tablefontstyle" scope="col" style={{ color: "#152B51" }}>
                        Contact
                        {sortBy.includes("staffmember_phoneNumber") ? (
                          upArrow.includes("staffmember_phoneNumber") ? (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("staffmember_phoneNumber")
                              }
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("staffmember_phoneNumber")
                              }
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("staffmember_phoneNumber")}
                          />
                        )}
                      </th>
                      <th className="tablefontstyle" scope="col" style={{ color: "#152B51" }}>
                        Mail Id
                        {sortBy.includes("staffmember_email") ? (
                          upArrow.includes("staffmember_email") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("staffmember_email")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("staffmember_email")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("staffmember_email")}
                          />
                        )}
                      </th>
                      <th className="tablefontstyle" scope="col" style={{ color: "#152B51" }}>
                        Created at
                        {sortBy.includes("createdAt") ? (
                          upArrow.includes("createdAt") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("createdAt")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("createdAt")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon tablebodyfont
                            onClick={() => sortData("createdAt")}
                          />
                        )}
                      </th>
                      <th className="tablefontstyle" scope="col" style={{ color: "#152B51" }}>Updated at</th>
                      <th className="tablefontstyle" scope="col" style={{ borderTopRightRadius: "15px", color: "#152B51" }}>ACTION</th>
                    </tr>
                  </thead>
                  {StaffMemberData.length === 0 ? (
                    <tbody>
                      <tr className="text-center">
                        <td colSpan="8" style={{ fontSize: "15px" }}>
                          No StaffMembers Added
                        </td>
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
                      {filterTenantsBySearchAndPage().map((staff) => (
                        <tr key={staff._id}
                          style={{
                            border: "0.5px solid rgba(50, 69, 103, 1)",
                            fontSize: "12px",
                            height: "40px",
                            fontFamily: "poppins",
                            fontWeight: "600",
                            lineHeight: "10.93px",
                          }}>
                          <td className="bordertopintd tablebodyfont">{staff.staffmember_name}</td>
                          <td className="bordertopintd tablebodyfont">{staff.staffmember_designation}</td>
                          <td className="bordertopintd tablebodyfont">{staff.staffmember_phoneNumber}</td>
                          <td className="bordertopintd tablebodyfont">{staff.staffmember_email}</td>
                          <td className="bordertopintd tablebodyfont">{staff.createdAt}</td>
                          <td className="bordertopintd tablebodyfont">{staff.updatedAt ? staff.updatedAt : "-"}</td>
                          <td className="bordertopintd tablebodyfont">
                            <div style={{ display: "flex" }}>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  deleteStaffMember(staff.staffmember_id)
                                }
                              >
                                <img src={deleicon} width={20} height={20} />

                              </div>
                              &nbsp; &nbsp; &nbsp;
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  editStaffMember(staff.staffmember_id)
                                }
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
                {/* <Row
                  className="mx-4 mt-3 d-flex align-items-center py-1"
                  style={{ borderRadius: "10px", height: "auto" }}
                >
                  <Col>
                    <Row
                      className="d-flex align-items-center"
                      style={{
                        border: "2px solid rgba(50, 69, 103, 1)",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                        height: "45px",
                        fontSize: "14px",
                        fontFamily: "poppins",
                        fontWeight: "600",
                        boxShadow: " 0px 4px 4px 0px #00000040",
                      }}
                    >
                      <Col style={{ color: "#152B51" }}>


                        Name
                        {sortBy.includes("staffmember_name") ? (
                          upArrow.includes("staffmember_name") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("staffmember_name")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("staffmember_name")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("staffmember_name")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>


                        Designation
                        {sortBy.includes("staffmember_designation") ? (
                          upArrow.includes("staffmember_designation") ? (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("staffmember_designation")
                              }
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("staffmember_designation")
                              }
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("staffmember_designation")}
                          />
                        )}
                      </Col>

                      <Col style={{ color: "#152B51" }}>

                        Contact
                        {sortBy.includes("staffmember_phoneNumber") ? (
                          upArrow.includes("staffmember_phoneNumber") ? (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("staffmember_phoneNumber")
                              }
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("staffmember_phoneNumber")
                              }
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("staffmember_phoneNumber")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>
                        Mail Id
                        {sortBy.includes("staffmember_email") ? (
                          upArrow.includes("staffmember_email") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("staffmember_email")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("staffmember_email")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("staffmember_email")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>

                        Created at
                        {sortBy.includes("createdAt") ? (
                          upArrow.includes("createdAt") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("createdAt")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("createdAt")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("createdAt")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>
                        Updated At{" "}

                      </Col>
                      <Col style={{ color: "#152B51" }}>
                        Action{" "}

                      </Col>
                    </Row>
                    {StaffMemberData.length === 0 ? (
                      <tbody>
                        <tr className="text-center">
                          <td colSpan="8" style={{ fontSize: "15px" }}>
                            No StaffMembers Added
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <Row
                        className="mt-3"
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
                        {filterTenantsBySearchAndPage().map((staff) => (
                            <Row
                              key={staff._id}
                              className="d-flex align-items-center"
                              // onClick={() => navigateToDetails(vendor?.workOrder_id)}

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
                              <Col style={{ color: "#152B51" }}>{staff?.staffmember_name} </Col>
                              <Col style={{ color: "#152B51" }}>{staff?.staffmember_designation}</Col>
                              <Col style={{ color: "#152B51" }}>{staff?.staffmember_phoneNumber}
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                              {staff?.staffmember_email}
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                              {staff?.createdAt}
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                              {staff?.updatedAt ? staff?.updatedAt : "-"}
                              </Col>
                              <Col>  <div style={{ display: "flex" }}>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    deleteStaffMember(staff?.staffmember_id)
                                  }
                                >
                                  <img src={deleicon} width={20} height={20} />

                                </div>
                                &nbsp; &nbsp; &nbsp;
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    editStaffMember(staff?.staffmember_id)
                                  }
                                >
                                  <img src={editicon} width={20} height={20} />

                                </div>
                              </div></Col>
                            </Row>
                          )
                          )}
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row> */}
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
                {/* </Card> */}
              </>
            )}
          </div>
        </Row>
      </Container>
      <Dialog
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ background: "#F0F8FF" }}>Update</DialogTitle>
        <br />
        <DialogContent style={{ width: "100%", maxWidth: "500px" }}>
          <FormGroup>
            <label className="form-control-label" htmlFor="input-property">
              What is the name of new staff member?
            </label>
            <br />
            {/* <InputLabel htmlFor="input-protype">Property Type</InputLabel> */}
            <Input
              className="form-control-alternative"
              id="input-staffmember"
              type="text"
              name="staffmember_name"
              value={editingStaffMember?.staffmember_name || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                setEditingStaffMember((prev) => ({
                  ...prev,
                  staffmember_name: newValue,
                }));
              }}
            />
          </FormGroup>
          <br />
          <br />

          <FormGroup>
            <label className="form-control-label" htmlFor="input-property">
              What is the designation?
            </label>
            <br />

            <Input
              className="form-control-alternative"
              id="input-staffmember"
              type="text"
              name="staffmember_designation"
              value={editingStaffMember?.staffmember_designation || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                setEditingStaffMember((prev) => ({
                  ...prev,
                  staffmember_designation: newValue,
                }));
              }}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button
            onClick={() => {
              // Handle the update logic here
              editStaffMemberData(editingStaffMember._id, editingStaffMember);
              closeEditDialog();
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
        <ToastContainer />
      </Dialog>
    </>
  );
};

export default StaffMember;
