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
import Checkbox from "@mui/material/Checkbox";
import { RotatingLines } from "react-loader-spinner";

import Header from "components/Headers/Header";
import * as React from "react";
import axios from "axios";
import { useFormik } from "formik";
import Edit from "@mui/icons-material/Edit";
import { jwtDecode } from "jwt-decode";

const Applicants = () => {
  const [rentalsData, setRentalsData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(6);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  // Step 1: Create state to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenantData, setSelectedTenantData] = useState([]);
  const [selectedTenants, setSelectedTenants] = useState([]);

  const [propertyData, setPropertyData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [userdropdownOpen, setuserDropdownOpen] = React.useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [searchQueryy, setSearchQueryy] = useState("");
  
  const handleSearch = (e) => {
    setSearchQueryy(e.target.value);
  };
  const toggle9 = () => {
    setuserDropdownOpen((prevState) => !prevState);
  };

  const toggle10 = () => {
    setUnitDropdownOpen((prevState) => !prevState);
  };

  const fetchUnitsByProperty = async (propertyType) => {
    try {
      const response = await fetch(
        `https://propertymanager.cloudpress.host/api/propertyunit/rentals_property/${propertyType}`
      );
      const data = await response.json();
      // Ensure that units are extracted correctly and set as an array
      const units = data?.data || [];
      return units;
    } catch (error) {
      console.error("Error fetching units:", error);
      return [];
    }
  };

  // Function to handle property selection
  const handlePropertyTypeSelect = async (propertyType) => {
    setSelectedPropertyType(propertyType);
    applicantFormik.setFieldValue("rental_adress", propertyType);
    setSelectedUnit(""); // Reset selected unit when a new property is selected
    try {
      const units = await fetchUnitsByProperty(propertyType);
      //console.log(units, "units"); // Check the received units in the console
      setUnitData(units); // Set the received units in the unitData state
    } catch (error) {
      console.error("Error handling selected property:", error);
    }
  };

  const handleUnitSelect = (selectedUnit) => {
    setSelectedUnit(selectedUnit);
    applicantFormik.setFieldValue("rental_units", selectedUnit); // Update the formik state here
  };

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
      setTotalPages(Math.ceil(response.data.data.length / pageItem));
      setRentalsData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getRentalsData();
  }, [pageItem]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (rentalsData) {
    paginatedData = rentalsData.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [selectedRentalOwnerData, setSelectedRentalOwnerData] = useState([]);
  //console.log(selectedRentalOwnerData, "selectedRentalOwnerData");
  const [selectedrentalOwners, setSelectedrentalOwners] = useState([]);
  const [showRentalOwnerTable, setshowRentalOwnerTable] = useState(false);
  const [checkedCheckbox, setCheckedCheckbox] = useState();
  const [rentalownerData, setRentalownerData] = useState([]);

  const handleChange = () => {
    setshowRentalOwnerTable(!showRentalOwnerTable);
  };

  const handleCheckboxChange = (event, tenantInfo, mobileNumber) => {
    if (checkedCheckbox === mobileNumber) {
      // If the checkbox is already checked, uncheck it
      setCheckedCheckbox(null);
    } else {
      // Otherwise, check the checkbox
      setCheckedCheckbox(mobileNumber);
    }

    // Toggle the selected tenants in the state when their checkboxes are clicked
    if (event.target.checked) {
      setSelectedTenants([tenantInfo, ...selectedTenants]);
      applicantFormik.setValues({
        tenant_firstName: tenantInfo.tenant_firstName,
        tenant_lastName: tenantInfo.tenant_lastName || "",
        tenant_email: tenantInfo.tenant_email || "",
        tenant_mobileNumber: tenantInfo.tenant_mobileNumber || "",
        tenant_homeNumber: tenantInfo.tenant_homeNumber || "",
        tenant_workNumber: tenantInfo.tenant_workNumber || "",
      });
      setshowRentalOwnerTable(false);
      // //console.log(tenantInfo.tenant_firstName);
    } else {
      setSelectedTenants(
        selectedTenants.filter((tenant) => tenant !== tenantInfo)
      );
      applicantFormik.setValues({
        tenant_firstName: "",
        tenant_lastName: "",
        tenant_email: "",
        tenant_mobileNumber: "",
        tenant_homeNumber: "",
        tenant_workNumber: "",
      });
    }
  };

  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    navigate("../Agent");
  };

  let cookies = new Cookies();
  // Check Authe(token)
  // let chackAuth = async () => {
  //   if (cookies.get("token")) {
  //     let authConfig = {
  //       headers: {
  //         Authorization: `Bearer ${cookies.get("token")}`,
  //         token: cookies.get("token"),
  //       },
  //     };
  //     // auth post method
  //     let res = await axios.post(
  //       "https://propertymanager.cloudpress.host/api/register/auth",
  //       { purpose: "validate access" },
  //       authConfig
  //     );
  //     if (res.data.statusCode !== 200) {
  //       // cookies.remove("token");
  //       navigate("/auth/login");
  //     }
  //   } else {
  //     navigate("/auth/login");
  //   }
  // };

  // React.useEffect(() => {
  //   chackAuth();
  // }, [cookies.get("token")]);

  const [accessType, setAccessType] = useState(null);
  const [manager,setManager]=useState("");
  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
      setManager(jwt.userName)
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

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
      rental_units: "",
      statusUpdatedBy:"",
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
      //console.log(values, "values");
    },
  });

  const handleFormSubmit = (values, action) => {
    axios
      .post("https://propertymanager.cloudpress.host/api/applicant/applicant", {...values,statusUpdatedBy:manager})
      .then((response) => {
        //console.log("Applicant created successfully:", response.data.data._id);
        // console.log(response.data.data);
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

  useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch("https://propertymanager.cloudpress.host/api/applicant/existing/applicant")
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setRentalownerData(data.data);
          // //console.log("here is my data", data.data);
        } else {
          // Handle error
          // console.error("Error:", data.message);
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
        console.log(response.data.data,'respones.data');
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

  const filterApplicantsBySearch = () => {
    if (searchQuery === undefined) {
      return paginatedData;
    }

    return paginatedData.filter((tenant) => {
      const isRentalAddressMatch = tenant.rental_adress
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const isFirstNameMatch = (
        tenant.tenant_firstName +
        " " +
        tenant.tenant_lastName
      )
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const isEmailMatch = tenant.tenant_email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return isRentalAddressMatch || isFirstNameMatch || isEmailMatch;
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
                      <th scope="col">Updated At</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>

                      {/* <th scope="col">Last Updated</th> */}
                      {/* <th scope="col">% complete</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filterApplicantsBySearch().map((applicant, index) => (
                      <tr
                        key={index}
                        onClick={() =>
                          navigate(`/admin/Applicants/${applicant._id}`)
                        }
                      >
                        {console.log(applicant,'Applicant')}
                        <td>{applicant.tenant_firstName}</td>
                        <td>{applicant.tenant_lastName}</td>
                        <td>{applicant.tenant_email}</td>
                        <td>{applicant.tenant_mobileNumber}</td>
                        <td>{applicant.rental_adress}</td>
                        <td>{applicant.updateAt}</td>
                        <td>{applicant?.applicant_status[0]?.status || "Undecided"}</td>
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
                          class="bi bi-caret-left"
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
                          class="bi bi-caret-right"
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
        <Modal isOpen={isModalOpen} toggle={closeModal}>
          <Form onSubmit={applicantFormik.handleSubmit}>
            <ModalHeader
              toggle={closeModal}
              className="bg-secondary text-white"
            >
              <strong style={{ fontSize: 18 }}>Add Applicant</strong>
            </ModalHeader>

            <ModalBody>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingTop: "25px",
                  }}
                >
                  <Checkbox
                    onChange={handleChange}
                    style={{ marginRight: "10px" }}
                    checked={showRentalOwnerTable === true}
                  />
                  <label className="form-control-label">
                    Choose an existing Applicant
                  </label>
                </div>
                <br />
              </div>
              {showRentalOwnerTable && (
                <div className="RentalOwnerTable">
                  <Input
                    type="text"
                    placeholder="Search by first and last name"
                    value={searchQueryy}
                    onChange={handleSearch}
                    style={{
                      marginBottom: "10px",
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "1px solid #ddd",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>Applicant Name</th>
                        <th>Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(rentalownerData) &&
                        rentalownerData
                          .filter((tenant) => {
                            const fullName = `${tenant.tenant_firstName} ${tenant.tenant_lastName}`;
                            return fullName
                              .toLowerCase()
                              .includes(searchQueryy.toLowerCase());
                          })
                          .map((tenant, index) => (
                            <tr
                              key={index}
                              style={{
                                border: "1px solid #ddd",
                              }}
                            >
                              <td>
                                <pre>
                                  {tenant.tenant_firstName}&nbsp;
                                  {tenant.tenant_lastName}
                                  {`(${tenant.tenant_mobileNumber})`}
                                </pre>
                              </td>
                              <td>
                                {/* <FormControlLabel
                                                          control={  */}
                                <Checkbox
                                  type="checkbox"
                                  name="tenant"
                                  id={tenant.tenant_mobileNumber}
                                  checked={
                                    tenant.tenant_mobileNumber ===
                                    checkedCheckbox
                                  }
                                  onChange={(event) => {
                                    setCheckedCheckbox(
                                      tenant.tenant_mobileNumber
                                    );
                                    // const tenantInfo = `${tenant.tenant_firstName ||
                                    //   ""
                                    //   } ${tenant.tenant_lastName ||
                                    //   ""
                                    //   } ${tenant.tenant_mobileNumber ||
                                    //   ""
                                    //   } ${tenant.tenant_email ||
                                    //   ""
                                    //   }`;
                                    const tenantInfo = {
                                      tenant_mobileNumber:
                                        tenant.tenant_mobileNumber,
                                      tenant_firstName: tenant.tenant_firstName,
                                      tenant_lastName: tenant.tenant_lastName,
                                      tenant_homeNumber:
                                        tenant.tenant_homeNumber,
                                      tenant_email: tenant.tenant_email,
                                      tenant_workNumber:
                                        tenant.tenant_workNumber,
                                    };
                                    handleCheckboxChange(
                                      event,
                                      tenantInfo,
                                      tenant.tenant_mobileNumber
                                    );
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                  <br />
                </div>
              )}
              {!showRentalOwnerTable && (
                <div>
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
                          const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
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
                          const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
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
                          const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
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
                          const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
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
                    {/* {//console.log(propertyData, "propertyData")} */}
                    <FormGroup style={{ marginRight: "15px" }}>
                      <Dropdown isOpen={userdropdownOpen} toggle={toggle9}>
                        <DropdownToggle
                          caret
                          style={{ width: "100%", marginRight: "15px" }}
                        >
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
                              onClick={() =>
                                handlePropertyTypeSelect(property.rental_adress)
                              }
                            >
                              {property.rental_adress}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                        {applicantFormik.errors &&
                        applicantFormik.errors?.rental_adress &&
                        applicantFormik.touched &&
                        applicantFormik.touched?.rental_adress &&
                        applicantFormik.values.rental_adress === "" ? (
                          <div style={{ color: "red" }}>
                            {applicantFormik.errors.rental_adress}
                          </div>
                        ) : null}
                      </Dropdown>
                    </FormGroup>
                  </FormGroup>

                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-unit">
                      Unit *
                    </label>
                    <FormGroup style={{ marginLeft: "15px" }}>
                      <Dropdown isOpen={unitDropdownOpen} toggle={toggle10}>
                        <DropdownToggle caret>
                          {selectedUnit ? selectedUnit : "Select Unit"}
                        </DropdownToggle>
                        <DropdownMenu>
                          {unitData.length > 0 ? (
                            unitData.map((unit) => (
                              <DropdownItem
                                key={unit._id}
                                onClick={() =>
                                  handleUnitSelect(unit.rental_units)
                                }
                              >
                                {unit.rental_units}
                              </DropdownItem>
                            ))
                          ) : (
                            <DropdownItem disabled>
                              No units available
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                        {applicantFormik.errors &&
                        applicantFormik.errors?.rental_units &&
                        applicantFormik.touched &&
                        applicantFormik.touched?.rental_units &&
                        applicantFormik.values.rental_units === "" ? (
                          <div style={{ color: "red" }}>
                            {applicantFormik.errors.rental_units}
                          </div>
                        ) : null}
                      </Dropdown>
                    </FormGroup>
                  </FormGroup>
                </div>
              )}
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
