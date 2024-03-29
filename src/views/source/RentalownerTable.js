import React, { useState, useEffect } from "react";
import {
  Badge,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
  Button,
  Input,
  FormGroup,
} from "reactstrap";
import { jwtDecode } from "jwt-decode";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
} from "@mui/material";
import Cookies from "universal-cookie";
import Header from "components/Headers/Header";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert"; // Import sweetalert
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate, useParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import deleicon from "../../assets/img/icons/common/delete.svg";
import editicon from "../../assets/img/icons/common/editicon.svg";

const RentalownerTable = () => {
  const { admin } = useParams();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [rentalsData, setRentalsData] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedRentalOwner, setEditedRentalOwner] = useState({
    _id: "", // Add an _id field to keep track of the edited record
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  let [loader, setLoader] = React.useState(true);
  const [tenantsData, setTenantsData] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  let navigate = useNavigate();

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const fetchRentalsData = async () => {
    if (accessType?.admin_id) {
      // setLoader(true);

      try {
        const response = await axios.get(
          `${baseUrl}/rentals/rental-owners/${accessType?.admin_id}`
        );
        if (response.status === 200) {
          setRentalsData(response.data);
          console.log('response.data', response.data)
        } else {
          console.error("Invalid API response structure: ", response.data);
        }
      } catch (error) {
        console.error("Error fetching rentals data: ", error);
      } finally {
        setLoader(false);

      }
    }
  };
  useEffect(() => {
    if (accessType?.admin_id) {
      fetchRentalsData();
      getRentalOwnersLimit();
    }
  }, [accessType]);


  function navigateToRentRollDetails(rentalowner_id) {
    navigate(`/${admin}/rentalownerdetail/${rentalowner_id}`);
  }

  const editRentalOwner = (id) => {
    navigate(`/${admin}/Rentalowner/${id}`);
  };

  const deleteTenant = (rentalowner_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this rental-owner!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${baseUrl}/rentals/rental-owners/${rentalowner_id}`)
          .then((response) => {
            if (response.data.statusCode === 200) {
              fetchRentalsData();
              setTimeout(() => {
                toast.success("The Rental-Owner has been deleted!", {
                  position: "top-center",
                  autoClose: 2000, // Adjusted timeout for quick display
                });
              }, 500);
            } else if (response.data.statusCode === 201) {
              toast.warn(response.data.message, {
                position: "top-center",
              });
            } else {
              toast.error(response.data.message, {
                position: "top-center",
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting tenant:", error);
            toast.error(error.message, {
              position: "top-center",
            });
          });
      } else {
        toast.success("Tenant is safe :)", {
          position: "top-center",
        });
      }
    });
  };

  const filterRentalOwnersBySearch = () => {
    if (!searchQuery) {
      return rentalsData;
    }

    return rentalsData.filter((rentalOwner) => {
      return (
        `${rentalOwner.rentalOwner_firstName} ${rentalOwner.rentalOwner_lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (rentalOwner.rentalOwner_streetAdress &&
          rentalOwner.rentalOwner_streetAdress
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        `${rentalOwner.rental_city}, ${rentalOwner.rental_country}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        rentalOwner.rentalOwner_primaryEmail
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });
  };

  const [countRes, setCountRes] = useState("");
  const getRentalOwnersLimit = async () => {
    if (accessType?.admin_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/rental_owner/limitation/${accessType?.admin_id}`
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
              onClick={() => navigate("/" + admin + "/Rentalowner")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Rental Owner
            </Button> */}
            <Button
              // color="primary"
              className="mr-4"

              onClick={() => {
                if (countRes.statusCode === 201) {
                  swal(
                    "Plan Limitation",
                    "The limit for adding rentalowners according to the plan has been reached.",
                    "warning"
                  );
                } else {
                  navigate("/" + admin + "/Rentalowner");
                }
              }}
              size="small"
              style={{ background: "#152B51", color: "#fff" }}

            >
              Add New Rental Owner
            </Button>
            <br />
          </Col>
        
          <Col xs="12" lg="12" sm="6">
            {/* <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Type</h1>
            </FormGroup> */}
            <CardHeader
              className=" mt-3 mx-4"
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
                Rental Owner
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
                <CardHeader className="border-0">
                  <Row>
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
                      <p style={{fontFamily:"Poppins", fontSize:"18px", fontWeight:"500"}}>

                          Added :{" "}
                          <b style={{ color: "#152B51", fontWeight: 1000 }}>

                            {countRes.rentalownerCount}
                          </b>{" "}
                          {" / "}
                          Total :{" "}
                          <b style={{ color: "#152B51", fontWeight: 1000 }}>

                            {countRes.rentalOwnerCountLimit}
                          </b>
                        </p>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardHeader>
                {/* <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Email</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  {rentalsData.length === 0 ?(
                    <tbody>
                      <tr className="text-center">
                        <td colSpan="5" style={{ fontSize: "15px" }}>
                          No RentalOwners Added
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {filterRentalOwnersBySearch()?.map((rentalOwner) => (
                        <tr
                          key={rentalOwner.rentalowner_id}
                          onClick={() =>
                            navigateToRentRollDetails(
                              rentalOwner.rentalowner_id
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>{rentalOwner.rentalOwner_firstName}</td>
                          <td>{rentalOwner.rentalOwner_lastName}</td>
                         
                          <td>{rentalOwner.rentalOwner_phoneNumber}</td>
                          <td>{rentalOwner.rentalOwner_primaryEmail}</td>
                          <td style={{}}>
                            <div style={{ display: "flex", gap: "5px" }}>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTenant(rentalOwner.rentalowner_id);
                                }}
                              >
                                <DeleteIcon />
                              </div>
                              &nbsp; &nbsp; &nbsp;
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editRentalOwner(rentalOwner.rentalowner_id);
                                }}
                              >
                                <EditIcon />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}

                </Table> */}
                 <Row
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


                        First Name
                       
                      </Col>
                      <Col style={{ color: "#152B51" }}>


                        Last Name
                       
                      </Col>

                      <Col style={{ color: "#152B51" }}>

                        Phone 
                       
                      </Col>
                      <Col style={{ color: "#152B51" }}>
                        Email
                       
                      </Col>
                      <Col style={{ color: "#152B51" }}>

                      Action
                        
                      </Col>
                    
                    </Row>
                    {rentalsData.length === 0 ?(
                    <tbody>
                      <tr className="text-center">
                        <td colSpan="5" style={{ fontSize: "15px" }}>
                          No RentalOwners Added
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
                        {filterRentalOwnersBySearch()?.map((rentalOwner) => (
                            <Row
                              key={rentalOwner.rentalowner_id}
                              className="d-flex align-items-center"
                              // onClick={() => navigateToDetails(vendor?.workOrder_id)}
                              onClick={() =>
                                navigateToRentRollDetails(
                                  rentalOwner.rentalowner_id
                                )
                              }
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
                              <Col style={{ color: "#152B51" }}>{rentalOwner.rentalOwner_firstName} </Col>
                              <Col style={{ color: "#152B51" }}>{rentalOwner.rentalOwner_lastName}</Col>
                              <Col style={{ color: "#152B51" }}>{rentalOwner.rentalOwner_phoneNumber}
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                              {rentalOwner.rentalOwner_primaryEmail}
                              </Col>
                             
                              <Col>  <div style={{ display: "flex" }}>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTenant(rentalOwner.rentalowner_id);
                                  }}
                                >
                                  <img src={deleicon} width={20} height={20} />

                                </div>
                                &nbsp; &nbsp; &nbsp;
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editRentalOwner(rentalOwner.rentalowner_id);
                                  }}
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
                </Row>
              {/* </Card> */}
              </>
            )}
          </div>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
};

export default RentalownerTable;
