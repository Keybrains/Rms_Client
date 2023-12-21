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

const StaffMember = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
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
  const [pageItem, setPageItem] = React.useState(6);
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
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getStaffMemberData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/addstaffmember/addstaffmember`
      );
      setLoader(false);
      setStaffMemberData(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / pageItem));
    } catch (error) {
      console.error("Error fetching data:", error);
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
        swal("Success!", "Staff Member updated successfully!", "success");
        getStaffMemberData(); // Refresh the data after successful edit
      } else {
        swal("", response.data.message, "error");
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
          .delete(`${baseUrl}/addstaffmember/delete_staffmember`, {
            data: { _id: id },
          })
          .then((response) => {
            if (response.data.statusCode === 200) {
              swal("Success!", "Staff Member deleted successfully!", "success");
              getStaffMemberData();
            } else if (response.data.statusCode === 201) {
              swal(
                "Warning!",
                "Staff Member already assigned to workorder!",
                "warning"
              );
              getStaffMemberData();
            } else if (response.data.statusCode === 202) {
              swal(
                "Warning!",
                "Staff Member already assigned to property!",
                "warning"
              );
              getStaffMemberData();
            } else {
              swal("Error", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting:", error);
          });
      } else {
        swal("Cancelled", "Staff Member is safe :)", "info");
      }
    });
  };

  //   auto form fill up in edit
  // let seletedEditData = async (datas) => {
  //   setModalShowForPopupForm(true);
  //   setId(datas._id);
  //   setEditData(datas);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getStaffMemberData();
  }, [pageItem]);

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
    navigate(`/admin/AddStaffMember/${id}`);
    //console.log(id);
  };

  const filterTenantsBySearch = () => {
    let filteredData = StaffMemberData;
  
    if (searchQuery) {
      filteredData = filteredData
        .filter((staff) => {
          const isNameMatch = staff.staffmember_name.toLowerCase().includes(searchQuery.toLowerCase());
          const isDesignationMatch = staff.staffmember_designation.toLowerCase().includes(searchQuery.toLowerCase());
          return isNameMatch || isDesignationMatch;
        });
    }
  
    if (upArrow.length > 0 ) {
      const sortingArrows = upArrow.length > 0 ? upArrow : null;
  
      sortingArrows.forEach((sort) => {
        switch (sort) {
          case "staffmember_name":
            filteredData.sort((a, b) => {
              const comparison = a.staffmember_name.localeCompare(b.staffmember_name);
              return upArrow.includes("staffmember_name") ? comparison : -comparison;
            });
            break;
          case "staffmember_designation":
            filteredData.sort((a, b) => {
              const comparison = a.staffmember_designation.localeCompare(b.staffmember_designation);
              return upArrow.includes("staffmember_designation") ? comparison : -comparison;
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
              const comparison = a.staffmember_phoneNumber - b.staffmember_phoneNumber;
              return upArrow.includes("staffmember_phoneNumber") ? comparison : -comparison;
            });
            break;
          case "staffmember_email":
            filteredData.sort((a, b) => {
              const comparison = a.staffmember_email.localeCompare(b.staffmember_email);
              return upArrow.includes("staffmember_email") ? comparison : -comparison;
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
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Staff Member</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/admin/AddStaffMember")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Staff Member
            </Button>
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
                      <th scope="col">NAME
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
                      <th scope="col">DESIGNATION
                      {sortBy.includes("staffmember_designation") ? (
                          upArrow.includes("staffmember_designation") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("staffmember_designation")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("staffmember_designation")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("staffmember_designation")}
                          />
                        )}
                      </th>
                      <th scope="col">Contact
                      {sortBy.includes("staffmember_phoneNumber") ? (
                          upArrow.includes("staffmember_phoneNumber") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("staffmember_phoneNumber")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("staffmember_phoneNumber")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("staffmember_phoneNumber")}
                          />
                        )}</th>
                      <th scope="col">Mail Id
                      {sortBy.includes("staffmember_email") ? (
                          upArrow.includes("staffmember_email") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("staffmember_email")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("staffmember_email")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("staffmember_email")}
                          />
                        )}</th>
                      <th scope="col">Created at
                      {sortBy.includes("createAt") ? (
                          upArrow.includes("createAt") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("createAt")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("createAt")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("createAt")}
                          />
                        )}</th>
                      <th scope="col">Updated at</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterTenantsBySearchAndPage().map((staff) => (
                      <tr key={staff._id}>
                        <td>{staff.staffmember_name}</td>
                        <td>{staff.staffmember_designation}</td>
                        <td>{staff.staffmember_phoneNumber}</td>
                        <td>{staff.staffmember_email}</td>
                        <td>{staff.createAt}</td>
                        <td>{staff.updateAt ? staff.updateAt : "-"}</td>
                        <td>
                          <div style={{ display: "flex" }}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteStaffMember(staff._id)}
                            >
                              <DeleteIcon />
                            </div>
                            &nbsp; &nbsp; &nbsp;
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => editStaffMember(staff._id)}
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
      </Dialog>
    </>
  );
};

export default StaffMember;
