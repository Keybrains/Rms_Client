import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroupAddon,
  InputGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
// core components
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import { RotatingLines } from "react-loader-spinner";

import Header from "components/Headers/Header";
import * as React from "react";
import axios from "axios";
import { useFormik } from "formik";
import Edit from "@mui/icons-material/Edit";

const Applicants = () => {
  const [rentalsData, setRentalsData] = useState([]);
  const [loader, setLoader] = useState(true);

  // Step 1: Create state to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Step 2: Event handler to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Event handler to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getRentalsData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/applicant/applicant"
      );
      setRentalsData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getRentalsData();
  }, []);

  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    navigate("../Agent");
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

  const applicantFormik = useFormik({
    initialValues: {
      tenant_firstName: "",
      tenant_lastName: "",
      tenant_email: "",
      tenant_mobileNumber: "",
      tenant_homeNumber: "",
      tenant_workNumber: "",
      tenant_faxPhoneNumber: "",
      rental_adress: "",
    },
    validationSchema: yup.object({
      tenant_firstName: yup.string().required("Required"),
      tenant_lastName: yup.string().required("Required"),
      tenant_email: yup.string().required("Required"),
      tenant_mobileNumber: yup.string().required("Required"),
      rental_adress: yup.string().required("Required"),
    }),
    onSubmit: (values, action) => {
      handleFormSubmit(values, action);

      console.log(values, "values");
    },
  });
  const handleFormSubmit = (values, action) => {
    axios
      .post("http://localhost:4000/api/applicant/applicant", values)
      .then((response) => {
        console.log("Applicant created successfully:", response.data.data._id); 
        closeModal();

        action.resetForm();
        navigate(`/admin/Applicants/${response.data.data._id}`);
        setSelectedPropertyType("");
        applicantFormik.setFieldValue("rental_adress", "");
      })

      .catch((error) => {
        console.error("Error creating applicant:", error);
      });
  };
  const [propertyData, setPropertyData] = useState([]);

  const [userdropdownOpen, setuserDropdownOpen] = React.useState(false);
  const toggle9 = () => setuserDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch("http://localhost:4000/api/rentals/allproperty")
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setPropertyData(data.data);
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  }, []);

  const getApplicantData = () => {
    axios
      .get("http://localhost:4000/api/applicant/applicant")
      .then((response) => {
        setRentalsData(response.data.data);
        setLoader(false);
      })
      .then((err) => {
        console.log(err);
        // setLoader(false);
      });
  };
  useEffect(() => {
    getApplicantData();
  }, [isModalOpen]);
  // const deleteFile = (index) => {
  //   axios.delete(`http://localhost:4000/api/applicant/applicant`,index).then((response) => {
  //     console.log(response);
  //   }).catch((err) => {
  //     console.log(err);
  //   })
  // }

  const deleteRentals = (id) => {
    // Show a confirmation dialog to the user
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this applicants!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete("http://localhost:4000/api/applicant/applicant", {
            data: { _id: id },
          })
          .then((response) => {
            if (response.data.statusCode === 200) {
              swal("Success!", "Applicants deleted successfully", "success");
              // getWorkData(); // Refresh your work order data or perform other actions
              // navigate(`admin/Applicants/${id}`);
              getApplicantData();
            } else {
              swal("", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting work order:", error);
          });
      } else {
        swal("Cancelled", "Applicants is safe :)", "info");
      }
    });
  };

  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const handlePropertyTypeSelect = (propertyType) => {
    setSelectedPropertyType(propertyType);
    applicantFormik.setFieldValue("rental_adress", propertyType);
  };

  const [searchQuery, setSearchQuery] = React.useState("");
  const filterTenantsBySearch = () => {
    if (searchQuery === undefined) {
      return rentalsData;
    }

    return rentalsData.filter((tenant) => {
      return tenant.tenant_firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.tenant_lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // tenant.tenant_mobileNumber.includes(Number(searchQuery)) ||
        tenant.tenant_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.rental_adress.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup>
              <h1 style={{ color: "white" }}>Applicants</h1>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={openModal}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Applicant
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
                  {/* <h3 className="mb-0">Applicants</h3> */}
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
                      <th scope="col">FirstName</th>
                      <th scope="col">LastName</th>

                      {/* <th scope="col">Listed</th> */}
                      {/* <th scope="col">Unit</th> */}
                      {/* <th scope="col">Phone</th> */}
                      <th scope="col">Email</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Property</th>
                      <th scope="col">Actions</th>

                      {/* <th scope="col">Last Updated</th> */}
                      {/* <th scope="col">% complete</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filterTenantsBySearch().map((applicant, index) => (
                      <tr
                        key={index}
                        onClick={() =>
                          navigate(`/admin/Applicants/${applicant._id}`)
                        }
                      >
                        <td>{applicant.tenant_firstName}</td>
                        <td>{applicant.tenant_lastName}</td>
                        <td>{applicant.tenant_email}</td>
                        <td>{applicant.tenant_mobileNumber}</td>
                        <td>{applicant.rental_adress}</td>
                        <td>
                          <DeleteIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRentals(applicant._id);
                            }}
                          />
                          <EditIcon
                            onClick={() =>
                              navigate(`/admin/Applicants/${applicant._id}`)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            )}
          </div>
        </Row>
        <br />
        <br />
        <Modal isOpen={isModalOpen} toggle={closeModal}>
          <Form onSubmit={applicantFormik.handleSubmit}>
            <ModalHeader
              toggle={closeModal}
              className="bg-secondary text-white"
            >
              <strong style={{fontSize:18}}>Add Applicant</strong>
            </ModalHeader>

            <ModalBody>
              <Row>
                <Col>
                  <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-property"
                  >
                    First Name *
                  </label>
                    <Input
                      type="text"
                      id="tenant_firstName"
                      placeholder="First Name"
                      name="tenant_firstName"
                      onBlur={applicantFormik.handleBlur}
                      onChange={applicantFormik.handleChange}
                      value={applicantFormik.values.tenant_firstName}
                      required 
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-property"
                  >
                    Last Name *
                  </label>
                    <Input
                      type="text"
                      id="tenant_lastName"
                      placeholder="Enter last name"
                      name="tenant_lastName"
                      onBlur={applicantFormik.handleBlur}
                      onChange={applicantFormik.handleChange}
                      value={applicantFormik.values.tenant_lastName}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-property"
                  >
                    Email *
                  </label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    id="tenant_email"
                    placeholder="Enter Email"
                    name="tenant_email"
                    value={applicantFormik.values.tenant_email}
                    onBlur={applicantFormik.handleBlur}
                    onChange={applicantFormik.handleChange}
                    required
                  />
                  
                </InputGroup>
              </FormGroup>
              {/* <div className="mb-3 form-check">
                <Input
                  type="checkbox"
                  className="form-check-input"
                  id="exampleCheck1"
                  checked={applicantFormik.values.exampleCheck1}
                  onChange={applicantFormik.handleChange}
                  name="exampleCheck1"
                  value={applicantFormik.values.exampleCheck1}
                />

                <Label className="form-check-label" for="exampleCheck1">
                  email link to online rental application
                </Label>
              </div> */}
              <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-property"
                  >
                    Mobile Number *
                  </label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <span className="input-group-text">
                      <i className="fas fa-mobile-alt"></i>
                    </span>
                  </InputGroupAddon>
                  <Input
                    type="tel" // Use type "tel" for mobile numbers
                    id="tenant_mobileNumber"
                    placeholder="Enter Mobile Number"
                    name="tenant_mobileNumber"
                    onBlur={applicantFormik.handleBlur}
                    onChange={applicantFormik.handleChange}
                    value={applicantFormik.values.tenant_mobileNumber}
                    onInput={(e) => {
                      const inputValue = e.target.value;
                      const numericValue = inputValue.replace(
                        /\D/g,
                        ""
                      ); // Remove non-numeric characters
                      e.target.value = numericValue;
                    }}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <span className="input-group-text">
                      <i className="fas fa-home"></i>
                    </span>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    id="tenant_homeNumber"
                    placeholder="Enter Home Number"
                    value={applicantFormik.values.tenant_homeNumber}
                    onBlur={applicantFormik.handleBlur}
                    onChange={applicantFormik.handleChange}
                    onInput={(e) => {
                      const inputValue = e.target.value;
                      const numericValue = inputValue.replace(
                        /\D/g,
                        ""
                      ); // Remove non-numeric characters
                      e.target.value = numericValue;
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <span className="input-group-text">
                      <i className="fas fa-fax"></i>
                    </span>
                  </InputGroupAddon>
                  <Input
                    id="tenant_workNumber"
                    type="text"
                    placeholder="Enter Business Number"
                    value={applicantFormik.values.tenant_workNumber}
                    onBlur={applicantFormik.handleBlur}
                    onChange={applicantFormik.handleChange}
                    onInput={(e) => {
                      const inputValue = e.target.value;
                      const numericValue = inputValue.replace(
                        /\D/g,
                        ""
                      ); // Remove non-numeric characters
                      e.target.value = numericValue;
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <span className="input-group-text">
                      <i className="fas fa-fax"></i>
                    </span>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    id="tenant_faxPhoneNumber"
                    placeholder="Enter Telephone Number"
                    value={applicantFormik.values.tenant_faxPhoneNumber}
                    onBlur={applicantFormik.handleBlur}
                    onChange={applicantFormik.handleChange}
                    onInput={(e) => {
                      const inputValue = e.target.value;
                      const numericValue = inputValue.replace(
                        /\D/g,
                        ""
                      ); // Remove non-numeric characters
                      e.target.value = numericValue;
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
              
                  <label
                    className="form-control-label"
                    htmlFor="input-property"
                  >
                    Property *
                  </label>
                  {/* {console.log(propertyData, "propertyData")} */}
                  <FormGroup>
                    <Dropdown isOpen={userdropdownOpen} toggle={toggle9}>
                      <DropdownToggle caret style={{ width: "100%" }}>
                        {selectedPropertyType
                          ? selectedPropertyType
                          : "Select Property"}
                      </DropdownToggle>
                      <DropdownMenu
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        <DropdownItem value="">Select</DropdownItem>
                        {propertyData.map((property) => (
                          <DropdownItem
                            key={property._id}
                            onClick={() => handlePropertyTypeSelect(property.rental_adress)}
                          >
                            {property.rental_adress}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                      {applicantFormik.errors &&
                              applicantFormik.errors?.rental_adress &&
                              applicantFormik.touched &&
                              applicantFormik.touched?.rental_adress && applicantFormik.values.rental_adress==="" ? (
                                <div style={{ color: "red" }}>
                                  {applicantFormik.errors.rental_adress}
                                </div>
                              ) : null}
                    </Dropdown>
                  </FormGroup>
              
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="success" type="submit">
                Create Applicant
              </Button>
              <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default Applicants;
