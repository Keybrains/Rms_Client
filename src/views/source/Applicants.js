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
        "https://propertymanager.cloudpress.host/api/applicant/applicant"
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

  const applicantFormik = useFormik({
    initialValues: {
      applicant_firstName: "",
      applicant_lastName: "",
      applicant_email: "",
      applicant_phoneNumber: "",
      applicant_homeNumber: "",
      applicant_businessNumber: "",
      applicant_telephoneNumber: "",
      rental_adress: "",
    },
    validationSchema: yup.object({
      // applicant_firstName: yup.string().required("Required"),
      // applicant_lastName: yup.string().required("Required"),
      // applicant_email: yup.string().required("Required"),
      // applicant_phoneNumber: yup.string().required("Required"),
      // applicant_homeNumber: yup.string().required("Required"),
      // applicant_businessNumber: yup.string().required("Required"),
      // applicant_telephoneNumber: yup.string().required("Required"),
      // applicant_property: yup.string().required("Required"),applicant
    }),
    onSubmit: (values, action) => {
      handleFormSubmit(values, action);

      console.log(values, "values");
    },
  });
  const handleFormSubmit = (values, action) => {
    // const formData = {
    //     applicant_firstName: FirstName,
    //     applicant_lastName: lastName,
    //     applicant_email: email,
    //     applicant_phoneNumber: mobileNumber,
    //     applicant_homeNumber: homeAddress,
    //     applicant_businessNumber: businessCenter,
    //     applicant_telephoneNumber: fax,
    //     applicant_property: property,
    // };

    // console.log('Form Data:', formData); // Log the formData
    console.log(applicantFormik.values, "values");
    axios
      .post("https://propertymanager.cloudpress.host/api/applicant/applicant", values)
      .then((response) => {
        console.log("Applicant created successfully:", response.data.data._id); // Log the response
        closeModal();

        action.resetForm();
        navigate(`/admin/Applicants/${response.data.data._id}`);

        // Reset the form fields by setting state variables to empty strings
        //  setFirstName("");
        //  setLastName("");
        //  setEmail("");
        //  setMobileNumber("");
        //  setHomeAddress("");
        //  setBusinessCenter("");
        //  setFax("");
        //  setProperty("");
        // applicantFormik.setFieldValue("applicant_firstName", "");
        // applicantFormik.setFieldValue("applicant_lastName", "");
        // applicantFormik.setFieldValue("applicant_email", "");
        // applicantFormik.setFieldValue("applicant_phoneNumber", "");
        // applicantFormik.setFieldValue("applicant_homeNumber", "");
        // applicantFormik.setFieldValue("applicant_businessNumber", "");
        // applicantFormik.setFieldValue("applicant_telephoneNumber", "");
        setSelectedPropertyType("");
        applicantFormik.setFieldValue("rental_adress", "");
      })

      .catch((error) => {
        console.error("Error creating applicant:", error); // Log any errors
      });
  };
  const [propertyData, setPropertyData] = useState([]);

  const [userdropdownOpen, setuserDropdownOpen] = React.useState(false);
  const toggle9 = () => setuserDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch("https://propertymanager.cloudpress.host/api/rentals/allproperty")
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
      .get("https://propertymanager.cloudpress.host/api/applicant/applicant")
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
  //   axios.delete(`https://propertymanager.cloudpress.host/api/applicant/applicant`,index).then((response) => {
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
          .delete("https://propertymanager.cloudpress.host/api/applicant/applicant", {
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
                    {rentalsData.map((applicant, index) => (
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
              <strong> Add Applicant</strong>
            </ModalHeader>

            <ModalBody>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="applicantName">Name</Label>

                    <Input
                      type="text"
                      id="tenant_firstName"
                      placeholder="First Name"
                      onBlur={applicantFormik.handleBlur}
                      onChange={applicantFormik.handleChange}
                      value={applicantFormik.values.tenant_firstName}
                      // value={FirstName}
                      // onChange={(e) => setFirstName(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="lastName">Last Name</Label>
                    <Input
                      type="text"
                      id="tenant_lastName"
                      placeholder="Enter last name"
                      onBlur={applicantFormik.handleBlur}
                      onChange={applicantFormik.handleChange}
                      value={applicantFormik.values.tenant_lastName}
                      // value={lastName}
                      // onChange={(e) => setLastName(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="Email">Email</Label>
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
                    value={applicantFormik.values.tenant_email}
                    onBlur={applicantFormik.handleBlur}
                    onChange={applicantFormik.handleChange}
                  />
                </InputGroup>
              </FormGroup>
              <div className="mb-3 form-check">
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
                        </div>
              <FormGroup>
                <Label for="MobileNumber">Mobile Number</Label>
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
                    value={applicantFormik.values.tenant_mobileNumber}
                    onBlur={applicantFormik.handleBlur}
                    onChange={applicantFormik.handleChange}
                    // value={mobileNumber}
                    // onChange={(e) => setMobileNumber(e.target.value)}
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
                    // value={homeAddress}
                    // onChange={(e) => setHomeAddress(e.target.value)}
                    // placeholder="Home Address"
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

                    // value={businessCenter}
                    // onChange={(e) => setBusinessCenter(e.target.value)}
                    // placeholder="Home Address"
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
                    // value={fax}
                    // onChange={(e) => setFax(e.target.value)}

                    // placeholder=""
                  />
                </InputGroup>
              </FormGroup>
              <hr></hr>
              <FormGroup>
                <Col lg="6">
                  <label
                    className="form-control-label"
                    htmlFor="input-property"
                  >
                    Property*
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
                    </Dropdown>
                  </FormGroup>
                </Col>
              </FormGroup>
              <hr></hr>

              {/* Add more form fields here */}
            </ModalBody>

            <ModalFooter>
              {/* <Button color="secondary" onClick={closeModal}>
                        Close
                    </Button> */}
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
