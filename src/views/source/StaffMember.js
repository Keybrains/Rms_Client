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
  import React from 'react';
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
  import Cookies from 'universal-cookie';

  const StaffMember = () => {
    const {id} = useParams();
    let [StaffMemberData, setStaffMemberData] = useState();
    const [open, setOpen] = React.useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editingStaffMember, setEditingStaffMember] = React.useState(null);
    let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
    // let [id, setId] = React.useState();
    let [loader, setLoader] = React.useState(true);
    let [editData, setEditData] = React.useState({});
    let navigate = useNavigate();

    const openEditDialog = (staff) => {
      setEditingStaffMember(staff);
      setEditDialogOpen(true);
    };
  
    const closeEditDialog = () => {
      setEditDialogOpen(false);
      setEditingStaffMember(null);
    };

    let cookies = new Cookies();
    // Check Authe(token)
    let chackAuth = async () => {
      if (cookies.get("token")) {
        let  authConfig = {
          headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
          token: cookies.get("token"),
        },
      };
      // auth post method
      let res = await axios.post(
        "http://localhost:4000/api/register/auth",
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

    const getStaffMemberData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/addstaffmember/addstaffmember"
        );
        setLoader(false);
        setStaffMemberData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const editStaffMemberData = async (id, updatedData) => {
      try {
        const editUrl = `http://localhost:4000/api/addstaffmember/staffmember/${id}`;
        console.log("Edit URL:", editUrl);
        console.log("ID:", id);
        console.log("Updated Data:", updatedData); // Log the updated data for debugging
  
        const response = await axios.put(editUrl, updatedData); // Send the updated data in the request body
        console.log("Edit Response:", response);
  
        if (response.status === 200) {
          swal("Success!", "Staff Member updated successfully!", "success");
          getStaffMemberData(); // Refresh the data after successful edit
        } else {
          swal("",response.data.message, "error");
          console.error("Edit request failed with status:", response.status);
        }
      } catch (error) {
        console.error("Error editing:", error);
      }
    };

   
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
                .delete("http://localhost:4000/api/addstaffmember/delete_staffmember", {
                  data: { _id: id },
                })
                .then((response) => {
                  if (response.data.statusCode === 200) {
                    swal("Success!", "Staff Member deleted successfully!", "success");
                    getStaffMemberData();
                  } 
                  else if (response.data.statusCode === 201) {
                    swal("Warning!", "Staff Member already assigned to workorder!", "warning");
                    getStaffMemberData();
                  } 
                  else if (response.data.statusCode === 202) {
                    swal("Warning!", "Staff Member already assigned to property!", "warning");
                    getStaffMemberData();
                  } 
                  else {
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
      }, []);

      const editStaffMember = (id) => {
        navigate(`/admin/AddStaffMember/${id}`);
        console.log(id);
      };
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--8" fluid>
        <Row>
            <Col xs="12" sm="6">
              <FormGroup className="">
                <h1 style={{color:'white'}}>
                  Staff Member
                </h1>
                </FormGroup>
            </Col>
          
            <Col className="text-right" xs="12" sm="6">
            <Button
                color="primary"
                href="#rms"
                onClick={() => navigate("/admin/AddStaffMember")}
                size="sm"
                style={{ background: "white", color: "blue" }}
              >
                Add New Staff Member
              </Button>  
              </Col>
          </Row><br/>
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
                  {/* <h3 className="mb-0">Staff Members</h3>    */}
                </CardHeader>
  
  
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">NAME</th>
                      <th scope="col">DESIGNATION</th>
                      <th scope="col">Contact</th>
                      <th scope="col">Mail Id</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                  {StaffMemberData?.map((staff) => (
                    <tr key={staff._id}>
                      <td>{staff.staffmember_name}</td>
                      <td>{staff.staffmember_designation}</td>
                      <td>{staff.staffmember_phoneNumber}</td>
                      <td>{staff.staffmember_email}</td>
                      <td>
                        <div style={{ display: "flex" }}>
                          
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteStaffMember(staff._id)}
                          >
                            <DeleteIcon />
                          </div>&nbsp; &nbsp; &nbsp;
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
              </Card>)}
              </div>
           </Row>
        </Container>
        <Dialog
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ background: "#F0F8FF" }}>Update</DialogTitle><br/>
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

         
          </FormGroup><br/><br/>
            
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