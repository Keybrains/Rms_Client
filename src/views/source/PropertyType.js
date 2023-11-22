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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import swal from "sweetalert";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Header from "components/Headers/Header";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { RotatingLines } from "react-loader-spinner";
import Cookies from 'universal-cookie';

const PropertyType = () => {
  const {id} = useParams();
  let [propertyData, setPropertyData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingProperty, setEditingProperty] = useState([]) //niche set null karyu hatu
  // const [editingProperty, setEditingProperty] = React.useState({ property_type: '' }); //ana lidhe aave che?
  let navigate = useNavigate();
  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  // let [id, setId] = React.useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  let [loader, setLoader] = React.useState(true);
  let [editData, setEditData] = React.useState({});

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [selectedProperty, setSelectedProperty] = React.useState("");
  
  // let getPropertyData = async () => {
  //   let responce = await axios.get("https://propertymanager.cloudpress.host/api/newproparty/newproparty");
  //   setPropertyData(responce.data.data);
  // };

  const handlePropertyTypeChange = (value) => {
    setEditingProperty((prev) => ({
      ...prev,
      property_type: value,
    }));
  };

  const openEditDialog = (property) => {
    setEditingProperty(property);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingProperty([]);
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

  const getPropertyData = async () => {
    try {
      const response = await axios.get(
        "https://propertymanager.cloudpress.host/api/newproparty/newproparty"
      );
      setLoader(false);
      setPropertyData(response.data.data);
    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  };

  // if (!id) {
  //   var handleSubmit = async (values) => {
  //    // values["createAt"] = moment(new Date()).format("YYYY-MM-DD, HH:mm:ss");
  //     let response = await axios.post(
  //       "https://propertymanager.cloudpress.host/api/newproparty/newproparty",
  //       values
  //     );
  //     if (response.data.statusCode === 200) {
  //       setModalShowForPopupForm(false);
  //       getPropertyData();
  //       swal("", response.data.message, "success");
  //     } else {
  //       swal("", response.data.message, "error");
  //     }
  //   };
  // } else {
  //   handleSubmit = async (values) => {
  //     //values["upadateAt"] = moment(new Date()).format("YYYY-MM-DD, HH:mm:ss");
  //     let response = await axios.put(
  //       "https://propertymanager.cloudpress.host/api/newproparty/newproparty" + id,
  //       values
  //     );
  //     if (response.data.statusCode === 200) {
  //       setModalShowForPopupForm(false);
  //       getPropertyData();
  //       swal("", response.data.message, "success");
  //     }
  //   };
  // }
  const editPropertyData = async (id, updatedData) => {
    try {
      const editUrl = `https://propertymanager.cloudpress.host/api/newproparty/proparty-type/${id}`;
      console.log("Edit URL:", editUrl);
      console.log("Property ID:", id);
      console.log("Updated Data:", updatedData); // Log the updated data for debugging

      const response = await axios.put(editUrl, updatedData); // Send the updated data in the request body
      console.log("Edit Response:", response);

      if (response.status === 200) {
        swal("",response.data.message, "success");
        setEditDialogOpen(false)
        getPropertyData(); // Refresh the data after successful edit
      } else {
        swal("",response.data.message, "error");
        console.error("Edit request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error editing property:", error);
    }
    // console.log("object")
  };

  // Delete selected
  const deleteProperty = (id) => {
    // Show a confirmation dialog to the user
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this property!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete("https://propertymanager.cloudpress.host/api/newproparty/newproparty/", {
            data: { _id: id },
          })

          .then((response) => {
            console.log(response.data)
            if (response.data.statusCode === 200) {
              swal("Success!", "Property Type deleted successfully!", "success");
              getPropertyData();
            } else if (response.data.statusCode === 201) {
              // Handle the case where property is already assigned
              swal("Warning!", "Property Type already assigned. Deletion not allowed.", "warning");
            } else {
              swal("error", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting property:", error);
          });
      } else {
        swal("Cancelled", "Property is safe :)", "info");
      }
    });
  };
  

   

  //  //   auto form fill up in edit
  //  let seletedEditData = async (datas) => {
  //   setModalShowForPopupForm(true);
  //   setId(datas._id);
  //   setEditData(datas);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getPropertyData();
  }, []);
  
  const editPropertyType = (id) => {
    navigate(`/admin/AddPropertyType/${id}`);
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
                  Property Type
                </h1>
                </FormGroup>
            </Col>
          
            <Col className="text-right" xs="12" sm="6">
            <Button
                color="primary"
                href="#rms"
                onClick={() => navigate("/admin/AddPropertyType")}
                size="sm"
                style={{ background: "white", color: "blue" }}
              >
                Add New Property Type
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
                {/* <h3 className="mb-0">Property Types</h3> */}
              </CardHeader>

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    {/* <th scope="col">Property_ID</th> */}
                    <th scope="col">Main Type</th>
                    <th scope="col">Sub Type</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyData?.map((property) => (
                    <tr key={property._id}>
                      <td>{property.property_type}</td>
                      <td>{property.propertysub_type}</td>
                      <td>
                        <div style={{ display: "flex" }}>
                          
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteProperty(property._id)}
                          >
                            <DeleteIcon />
                          </div>&nbsp; &nbsp; &nbsp;
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => editPropertyType(property._id)}
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
     
    </>
  );
};

export default PropertyType;
