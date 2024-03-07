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
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkbox from "@mui/material/Checkbox";
import { RotatingLines } from "react-loader-spinner";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import WestIcon from "@mui/icons-material/West";
import Header from "components/Headers/Header";
import * as React from "react";
import axios from "axios";
import { useFormik } from "formik";
import Edit from "@mui/icons-material/Edit";
import { jwtDecode } from "jwt-decode";

const Applicants = () => {
  const { admin } = useParams();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [rentalsData, setRentalsData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");

  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
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
  const [selectedPropertyId, setselectedPropertyId] = useState("");
  // const [searchQuery, setSearchQuery] = useState("");
  const [upArrow, setUpArrow] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const handleSearch = (e) => {
    setSearchQuery1(e.target.value);
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
        `${baseUrl}/propertyunit/rentals_property/${propertyType}`
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
  const [ownerData, setOwnerData] = useState([]);
  // const [selectedOwner, setSelectedOwner] = useState(null);
  // Function to handle property selection

  const fetchUnitData = async (rental_id) => {
    try {
      const res = await axios.get(`${baseUrl}/unit/rental_unit/${rental_id}`);
      if (res.data.statusCode === 200) {
        const filteredData = res.data.data.filter(
          (item) => item.rental_unit !== ""
        );
        if (filteredData.length === 0) {
          applicantFormik.setFieldValue("unit_id", res.data.data[0].unit_id);
        }
        setUnitData(filteredData);
      } else if (res.data.statusCode === 201) {
        setUnitData([]);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handlePropertyTypeSelect = async (property) => {
    setSelectedPropertyType(property.rental_adress);
    setselectedPropertyId(property.rental_id);
    applicantFormik.setFieldValue("rental_adress", property.rental_adress);
    setSelectedUnit(""); // Reset selected unit when a new property is selected
    try {
      const units = await fetchUnitsByProperty(property.rental_adress);
      setOwnerData(property);
      // console.log(units, "units"); // Check the received units in the console
      setUnitData(units); // Set the received units in the unitData state

      fetchUnitData(property.rental_id);
    } catch (error) {
      console.error("Error handling selected property:", error);
    }
  };

  const [unitId, setUnitId] = useState(null);
  const handleUnitSelect = (selectedUnit) => {
    setSelectedUnit(selectedUnit.rental_unit);
    setUnitId(selectedUnit.unit_id);
    applicantFormik.setFieldValue("rental_unit", selectedUnit.rental_unit); // Update the formik state here
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (applicant) => {
    setSelectedApplicant(applicant);
    openModal(); // Open the modal when an applicant is selected for editing
  };

  const handleSelectedApplicantChange = (e) => {
    const { name, value } = e.target;
    setSelectedApplicant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const updateApplicantData = async () => {
    try {
      // Your selected applicant data
      const selectedApplicantData = {
        applicant_firstName: selectedApplicant.applicant_firstName,
        applicant_lastName: selectedApplicant.applicant_lastName,
        applicant_email: selectedApplicant.applicant_email,
        applicant_phoneNumber: selectedApplicant.applicant_phoneNumber,
        applicant_homeNumber: selectedApplicant.applicant_homeNumber,
        applicant_businessNumber: selectedApplicant.applicant_businessNumber,
        applicant_telephoneNumber: selectedApplicant.applicant_telephoneNumber,
      };

      // API endpoint for updating applicant data
      // const apiUrl = `${baseUrl}/applicant/applicant/1708005396068`;
      const apiUrl = `${baseUrl}/applicant/applicant/${selectedApplicant.applicant_id}`;

      // Send PUT request to update the data
      const response = await axios.put(apiUrl, selectedApplicantData);

      if (response.data.statusCode === 200) {
        closeModal();
        toast.success("Applicant Update Successfully", {
          position: "top-center",
          autoClose: 500,
        });
      } else {
        toast.warning(response.data.message, {
          position: "top-center",
        });
      }

      // You can handle any success actions here, such as showing a success message or updating state.
    } catch (error) {
      // Handle error
      console.error("Error updating applicant data:", error);
      toast.error(error, {
        position: "top-center",
      });

      // You can handle any error actions here, such as showing an error message or logging the error.
    } finally {
      setBtnLoader(false); // Reset the button loader state after API call
    }
  };

  const getTableData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/applicant/applicant/${admin}`
      );
      setTotalPages(Math.ceil(response.data.data.length / pageItem));
      setRentalsData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getTableData();
    getApplicatsLimit();
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
    console.warn(tenantInfo, "tenantInfo");

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
        applicant_firstName: tenantInfo.applicant_firstName,
        applicant_id: tenantInfo.applicant_id,
        applicant_lastName: tenantInfo.applicant_lastName || "",
        applicant_email: tenantInfo.applicant_email || "",
        tenant_mobileNumber: tenantInfo.applicant_phoneNumber || "",
        tenant_homeNumber: tenantInfo.applicant_homeNumber || "",
        tenant_workNumber: tenantInfo.applicant_telephoneNumber || "",
        tenant_businessNumber: tenantInfo.applicant_businessNumber || "",
      });
      setshowRentalOwnerTable(false);
    } else {
      setSelectedTenants(
        selectedTenants.filter((tenant) => tenant !== tenantInfo)
      );
      applicantFormik.setValues({
        applicant_firstName: "",
        applicant_lastName: "",
        applicant_email: "",
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
  // if (localStorage.getItem("token")) {
  // let authConfig = {
  // headers: {
  // Authorization: `Bearer ${localStorage.getItem("token")}`,
  // token: localStorage.getItem("token"),
  // },
  // };
  // // auth post method
  // let res = await axios.post(
  // "http://192.168.1.10:4000/api/register/auth",
  // { purpose: "validate access" },
  // authConfig
  // );
  // if (res.data.statusCode !== 200) {
  // // localStorage.removeItem("token");
  // navigate("/auth/login");
  // }
  // } else {
  // navigate("/auth/login");
  // };
  // }

  // React.useEffect(() => {
  // chackAuth();
  // }, [localStorage.getItem("token")]);

  const [accessType, setAccessType] = useState(null);
  const [manager, setManager] = useState("");
  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
      setManager(jwt.userName);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const applicantFormik = useFormik({
    initialValues: {
      applicant_firstName: "",
      applicant_lastName: "",
      applicant_email: "",
      tenant_mobileNumber: "",
      tenant_homeNumber: "",
      tenant_workNumber: "",
      tenant_businessNumber: "",
      tenant_faxPhoneNumber: "",
      rental_adress: "",
      rental_unit: "",
      statusUpdatedBy: "",
    },
    validationSchema: yup.object({
      applicant_firstName: yup.string().required("Required"),
      applicant_lastName: yup.string().required("Required"),
      applicant_email: yup.string().required("Required"),
      tenant_mobileNumber: yup.string().required("Required"),
      rental_adress: yup.string().required("Required"),
    }),
    onSubmit: (values, action) => {
      handleFormSubmit(values, action);
    },
  });

  const handleFormSubmit = (values, action) => {
    setBtnLoader(true);
    try {
      const requestBody = {
        applicant: {
          applicant_id: values.applicant_id,
          applicant_firstName: values.applicant_firstName,
          applicant_lastName: values.applicant_lastName,
          applicant_email: values.applicant_email,
          applicant_phoneNumber: values.tenant_mobileNumber,
          applicant_homeNumber: values.tenant_homeNumber,
          applicant_businessNumber: values.tenant_businessNumber,
          applicant_telephoneNumber: values.tenant_faxPhoneNumber,
          admin_id: accessType.admin_id,
        },
        lease: {
          rental_id: selectedPropertyId,
          unit_id: unitId || "",
          admin_id: accessType.admin_id,
        },
      };

      axios
        .post(`${baseUrl}/applicant/applicant`, requestBody)
        .then((response) => {
          if (response.data.statusCode === 200) {
            closeModal();
            applicantFormik.resetForm();
            toast.success("Applicant Added Successfully", {
              position: "top-center",
              autoClose: 500,
            });
            navigate(
              `/${admin}/Applicants/${response.data.data.data.applicant_id}`
            );
            setSelectedPropertyType("");
            applicantFormik.setFieldValue("rental_adress", "");
          } else if (response.status === 201) {
            swal(
              "Failed!",
              "Applicant number already exist in system",
              "warning"
            );
          }
        })

        .catch((error) => {
          console.error("Error creating applicant:", error);
        });

      setBtnLoader(false);
    } catch (error) {
      setBtnLoader(false);
      console.error("error in submit applicant", error);
    }
  };

  //get data apis
  const fetchPropertyData = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/rentals/rentals/${accessType.admin_id}`
      );
      if (res.data.statusCode === 200) {
        setPropertyData(res.data.data);
        setLoader(false);
      } else if (res.data.statusCode === 201) {
        setPropertyData([]);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [accessType]);

  const fetchExistingPropetiesData = async () => {
    // Make an HTTP GET request to your Express API endpoint
    fetch(`${baseUrl}/applicant/applicant/${accessType?.admin_id}`)
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
  };

  useEffect(() => {
    fetchExistingPropetiesData();
  }, [accessType]);

  const getApplicantData = () => {
    axios
      .get(`${baseUrl}/applicant/applicant_lease/${accessType?.admin_id}`)
      .then((response) => {
        setRentalsData(response.data.data);
      })
      .catch((err) => {
        console.log(err);
        // setLoader(false);
      });
  };
  useEffect(() => {
    getApplicantData();
  }, [accessType, isModalOpen]);

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
          .delete(`${baseUrl}/applicant/applicant`, {
            data: { _id: id },
          })
          .then((response) => {
            if (response.data.statusCode === 200) {
              toast.success("Applicants deleted successfully", {
                position: "top-center",
              });
              // getWorkData(); // Refresh your work order data or perform other actions
              // navigate(`admin/Applicants/${id}`);
              getApplicantData();
            } else {
              toast.warning(response.data.message, {
                position: "top-center",
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting work order:", error);
          });
      } else {
        toast.warning("Applicant is safe!", {
          position: "top-center",
        });
      }
    });
  };
  const filterApplicantsBySearch = () => {
    let filteredData = rentalsData;

    if (searchQuery) {
      filteredData = filteredData.filter((applicant) => {
        const fullName = `${applicant.applicant_firstName} ${applicant.applicant_lastName}`;
        return (
          fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant?.rental_data?.rental_adress
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          applicant?.applicant_status?.status
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          applicant?.applicant_email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      });
    }

    if (upArrow.length > 0) {
      upArrow.forEach((sort) => {
        switch (sort) {
          case "rental_adress":
            filteredData.sort((a, b) =>
              a.rental_adress.localeCompare(b.rental_adress)
            );
            break;
          case "applicant_lastName":
            filteredData.sort((a, b) =>
              a.applicant_lastName.localeCompare(b.applicant_lastName)
            );
            break;
          case "applicant_firstName":
            filteredData.sort((a, b) =>
              a.applicant_firstName.localeCompare(b.applicant_firstName)
            );
            break;
          case "tenant_mobileNumber":
            filteredData.sort(
              (a, b) => a.tenant_mobileNumber - b.tenant_mobileNumber
            );
            break;
          case "applicant_email":
            filteredData.sort((a, b) =>
              a.applicant_email.localeCompare(b.applicant_email)
            );
            break;
          case "start_date":
            filteredData.sort(
              (a, b) => new Date(a.start_date) - new Date(b.start_date)
            );
            break;
          case "createAt":
            filteredData.sort(
              (a, b) => new Date(a.createAt) - new Date(b.createAt)
            );
            break;
          default:
            // If an unknown sort option is provided, do nothing
            break;
        }
      });
    }
    if (upArrow.length > 0) {
      upArrow.forEach((sort) => {
        switch (sort) {
          case "rental_adress":
            filteredData.sort((a, b) =>
              a.rental_adress.localeCompare(b.rental_adress)
            );
            break;
          case "applicant_lastName":
            filteredData.sort((a, b) =>
              a.applicant_lastName.localeCompare(b.applicant_lastName)
            );
            break;
          case "applicant_firstName":
            filteredData.sort((a, b) =>
              a.applicant_firstName.localeCompare(b.applicant_firstName)
            );
            break;
          case "tenant_mobileNumber":
            filteredData.sort(
              (a, b) => a.tenant_mobileNumber - b.tenant_mobileNumber
            );
            break;
          case "applicant_email":
            filteredData.sort((a, b) =>
              a.applicant_email.localeCompare(b.applicant_email)
            );
            break;
          case "start_date":
            filteredData.sort(
              (a, b) => new Date(a.start_date) - new Date(b.start_date)
            );
            break;
          case "createAt":
            filteredData.sort(
              (a, b) => new Date(a.createAt) - new Date(b.createAt)
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
    const filteredData = filterApplicantsBySearch();
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
  const [countRes, setCountRes] = useState("");

  const getApplicatsLimit = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/applicant/limitation/${accessType.admin_id}`
      );
      console.log(response.data, "yash");
      setCountRes(response.data);
    } catch (error) {
      console.error("Error fetching rental data:", error);
    }
  };

  useEffect(() => {
    getApplicatsLimit();
  }, [rentalsData]);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup>
              <h1 style={{ color: "white" }}>Applicants</h1>
            </FormGroup>
          </Col>
          <Col className="text-right">
            {/* <Button
              color="primary"
              // href="#rms"
              onClick={openModal}
              // onClick={() => {
              //   setSelectedApplicant({})
              //   openModal()
              // }}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Applicant
            </Button> */}
            <Button
              color="primary"
              onClick={() => {
                if (countRes.statusCode === 201) {
                  swal(
                    "Plan Limitation",
                    "The limit for adding applicants according to the plan has been reached.",
                    "warning"
                  );
                } else {
                  openModal();
                }
              }}
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
                    <Col className="d-flex justify-content-end">
                      <FormGroup>
                        <p>
                          Added :{" "}
                          <b style={{ color: "blue", fontWeight: 1000 }}>
                            {countRes.applicantCount}
                          </b>{" "}
                          {" / "}
                          Total :{" "}
                          <b style={{ color: "blue", fontWeight: 1000 }}>
                            {countRes.applicantCountLimit}
                          </b>
                        </p>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">
                        FirstName
                        {sortBy.includes("applicant_firstName") ? (
                          upArrow.includes("applicant_firstName") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("applicant_firstName")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("applicant_firstName")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("applicant_firstName")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        LastName
                        {sortBy.includes("applicant_lastName") ? (
                          upArrow.includes("applicant_lastName") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("applicant_lastName")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("applicant_lastName")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("applicant_lastName")}
                          />
                        )}
                      </th>

                      {/* <th scope="col">Listed</th> */}
                      {/* <th scope="col">Unit</th> */}
                      {/* <th scope="col">Phone</th> */}
                      <th scope="col">
                        Email
                        {sortBy.includes("applicant_email") ? (
                          upArrow.includes("applicant_email") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("applicant_email")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("applicant_email")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("applicant_email")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Phone Number
                        {sortBy.includes("tenant_mobileNumber") ? (
                          upArrow.includes("tenant_mobileNumber") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("tenant_mobileNumber")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("tenant_mobileNumber")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("tenant_mobileNumber")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Property
                        {sortBy.includes("rental_adress") ? (
                          upArrow.includes("rental_adress") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("rental_adress")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("rental_adress")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("rental_adress")}
                          />
                        )}
                      </th>
                      <th scope="col">Status</th>
                      <th scope="col">
                        Created At
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
                        )}
                      </th>
                      <th scope="col">Updated At</th>
                      <th scope="col">Actions</th>

                      {/* <th scope="col">Last Updated</th> */}
                      {/* <th scope="col">% complete</th> */}
                    </tr>
                  </thead>
                  {rentalsData.length === 0 ? (
                    <tbody>
                      <tr className="text-center">
                        <td colSpan="8" style={{ fontSize: "15px" }}>
                          No Applicants Added
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {filterTenantsBySearchAndPage()?.map(
                        (applicant, index) => (
                          <tr
                            key={index}
                            onClick={() =>
                              navigate(
                                `/${admin}/Applicants/${applicant.applicant_id}`
                              )
                            }
                          >
                            <td>{applicant?.applicant_firstName}</td>
                            <td>{applicant?.applicant_lastName}</td>
                            <td>{applicant?.applicant_email}</td>
                            <td>{applicant?.applicant_phoneNumber}</td>
                            <td>
                              {applicant?.rental_data?.rental_adress}{" "}
                              {applicant?.unit_data &&
                              applicant?.unit_data?.rental_unit
                                ? " - " + applicant?.unit_data?.rental_unit
                                : null}
                            </td>

                            <td>
                              {applicant?.applicant_status?.status ||
                                "Undecided"}
                            </td>
                            <td>{applicant?.createdAt}</td>
                            <td>{applicant?.updatedAt || " - "}</td>
                            <td>
                              {/* <DeleteIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRentals(applicant._id);
                              }}
                            /> */}
                              <EditIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(applicant);
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  )}
                </Table>
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
              {selectedApplicant ? "Edit Applicant" : "Add Applicant"}
            </ModalHeader>

            <ModalBody>
              {selectedApplicant ? (
                // Render fields for editing an existing applicant
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
                          id="applicant_firstName"
                          placeholder="Enter Firstname"
                          name="applicant_firstName"
                          value={selectedApplicant.applicant_firstName}
                          onChange={handleSelectedApplicantChange}
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
                          id="applicant_lastName"
                          placeholder="Enter Lastname"
                          name="applicant_lastName"
                          value={selectedApplicant.applicant_lastName}
                          onChange={handleSelectedApplicantChange}
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
                        id="applicant_email"
                        placeholder="Enter Email"
                        name="applicant_email"
                        value={selectedApplicant.applicant_email}
                        onChange={handleSelectedApplicantChange}
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
                        name="applicant_phoneNumber"
                        placeholder="Enter Phone Number"
                        value={selectedApplicant.applicant_phoneNumber}
                        onChange={handleSelectedApplicantChange}
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
                          <i className="fas fa-home"></i>
                        </span>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        id="tenant_homeNumber"
                        placeholder="Enter Home Number"
                        name="applicant_homeNumber"
                        value={selectedApplicant.applicant_homeNumber}
                        onChange={handleSelectedApplicantChange}
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
                        id="tenant_businessNumber"
                        type="text"
                        placeholder="Enter Business Number"
                        name="applicant_businessNumber"
                        value={selectedApplicant.applicant_businessNumber}
                        onChange={handleSelectedApplicantChange}
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
                        id="tenant_workNumber"
                        placeholder="Enter Telephone Number"
                        name="applicant_telephoneNumber"
                        value={selectedApplicant.applicant_telephoneNumber}
                        onChange={handleSelectedApplicantChange}
                        onInput={(e) => {
                          const inputValue = e.target.value;
                          const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                          e.target.value = numericValue;
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </div>
              ) : (
                !showRentalOwnerTable && (
                  <div>
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
                            id="applicant_firstName"
                            placeholder="First Name"
                            name="applicant_firstName"
                            onBlur={applicantFormik.handleBlur}
                            onChange={applicantFormik.handleChange}
                            value={applicantFormik.values.applicant_firstName}
                          />
                          {applicantFormik.touched.applicant_firstName &&
                          applicantFormik.errors.applicant_firstName ? (
                            <div style={{ color: "red", marginBottom: "10px" }}>
                              {applicantFormik.errors.applicant_firstName}
                            </div>
                          ) : null}
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
                            id="applicant_lastName"
                            placeholder="Enter last name"
                            name="applicant_lastName"
                            onBlur={applicantFormik.handleBlur}
                            onChange={applicantFormik.handleChange}
                            value={applicantFormik.values.applicant_lastName}
                          />
                          {applicantFormik.touched.applicant_lastName &&
                          applicantFormik.errors.applicant_lastName ? (
                            <div style={{ color: "red", marginBottom: "10px" }}>
                              {applicantFormik.errors.applicant_lastName}
                            </div>
                          ) : null}
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
                          id="applicant_email"
                          placeholder="Enter Email"
                          name="applicant_email"
                          value={applicantFormik.values.applicant_email}
                          onBlur={applicantFormik.handleBlur}
                          onChange={applicantFormik.handleChange}
                        />
                      </InputGroup>
                      {applicantFormik.touched.applicant_email &&
                      applicantFormik.errors.applicant_email ? (
                        <div style={{ color: "red", marginBottom: "10px" }}>
                          {applicantFormik.errors.applicant_email}
                        </div>
                      ) : null}
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
                        />
                      </InputGroup>
                      {applicantFormik.touched.tenant_mobileNumber &&
                      applicantFormik.errors.tenant_mobileNumber ? (
                        <div style={{ color: "red", marginBottom: "10px" }}>
                          {applicantFormik.errors.tenant_mobileNumber}
                        </div>
                      ) : null}
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
                          id="tenant_businessNumber"
                          type="text"
                          placeholder="Enter Business Number"
                          value={applicantFormik.values.tenant_businessNumber}
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
                          id="tenant_workNumber"
                          placeholder="Enter Telephone Number"
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
                      <label
                        className="form-control-label"
                        htmlFor="input-property"
                      >
                        Property *
                      </label>
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
                            <DropdownItem disabled value="">
                              Select
                            </DropdownItem>
                            {propertyData.map((property, index) => (
                              <DropdownItem
                                key={index}
                                onClick={() =>
                                  handlePropertyTypeSelect(property)
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
                    {unitData.length != 0 && (
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unit"
                        >
                          Unit *
                        </label>
                        <FormGroup style={{ marginLeft: "15px" }}>
                          <Dropdown isOpen={unitDropdownOpen} toggle={toggle10}>
                            <DropdownToggle caret>
                              {selectedUnit ? selectedUnit : "Select Unit"}
                            </DropdownToggle>
                            <DropdownMenu>
                              {unitData.length > 0 ? (
                                unitData.map((unit, index) => (
                                  <DropdownItem
                                    key={index}
                                    onClick={() => handleUnitSelect(unit)}
                                  >
                                    {unit.rental_unit}
                                  </DropdownItem>
                                ))
                              ) : (
                                <DropdownItem disabled>
                                  No units available
                                </DropdownItem>
                              )}
                            </DropdownMenu>
                            {applicantFormik.errors &&
                            applicantFormik.errors?.rental_unit &&
                            applicantFormik.touched &&
                            applicantFormik.touched?.rental_unit &&
                            applicantFormik.values.rental_unit === "" ? (
                              <div style={{ color: "red" }}>
                                {applicantFormik.errors.rental_unit}
                              </div>
                            ) : null}
                          </Dropdown>
                        </FormGroup>
                      </FormGroup>
                    )}
                  </div>
                )
              )}
              {showRentalOwnerTable && (
                <div
                  style={{
                    maxHeight: "400px",
                    overflow: "hidden",
                  }}
                >
                  <div>
                    <Label
                      onClick={() =>
                        setshowRentalOwnerTable(!showRentalOwnerTable)
                      }
                      style={{ color: "#1171ef", fontWeight: "bold " }}
                    >
                      <WestIcon />
                      Back
                    </Label>
                  </div>
                  <Input
                    type="text"
                    placeholder="Search by first and last name"
                    value={searchQuery1}
                    onChange={handleSearch}
                    style={{
                      marginBottom: "10px",
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <div
                    style={{
                      maxHeight: "calc(400px - 40px)",
                      overflowY: "auto",
                      border: "1px solid #ddd",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              padding: "15px",
                            }}
                          >
                            Applicant Name
                          </th>
                          <th
                            style={{
                              padding: "15px",
                            }}
                          >
                            Select
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(rentalownerData) &&
                          rentalownerData
                            .filter((tenant) => {
                              const fullName = `${tenant?.applicant_firstName} ${tenant?.applicant_lastName}`;
                              return fullName
                                .toLowerCase()
                                .includes(searchQuery1.toLowerCase());
                            })
                            .map((tenant, index) => (
                              <tr
                                key={index}
                                style={{
                                  border: "1px solid #ddd",
                                }}
                              >
                                <td
                                  style={{
                                    paddingLeft: "15px",
                                    paddingTop: "15px",
                                  }}
                                >
                                  <pre>
                                    {tenant?.applicant_firstName}&nbsp;
                                    {tenant?.applicant_lastName}
                                    {`(${tenant?.applicant_phoneNumber})`}
                                  </pre>
                                </td>
                                <td
                                  style={{
                                    paddingLeft: "15px",
                                    paddingTop: "15px",
                                  }}
                                >
                                  <Checkbox
                                    type="checkbox"
                                    name="tenant"
                                    id={tenant.applicant_phoneNumber}
                                    checked={
                                      tenant.applicant_phoneNumber ===
                                      checkedCheckbox
                                    }
                                    onChange={(event) => {
                                      setCheckedCheckbox(
                                        tenant.applicant_phoneNumber
                                      );
                                      const tenantInfo = {
                                        applicant_phoneNumber:
                                          tenant.applicant_phoneNumber,
                                        applicant_firstName:
                                          tenant.applicant_firstName,
                                        applicant_lastName:
                                          tenant.applicant_lastName,
                                        applicant_homeNumber:
                                          tenant.applicant_homeNumber,
                                        applicant_email: tenant.applicant_email,
                                        applicant_businessNumber:
                                          tenant.applicant_businessNumber,
                                        applicant_telephoneNumber:
                                          tenant.applicant_telephoneNumber,
                                      };
                                      handleCheckboxChange(
                                        event,
                                        tenantInfo,
                                        tenant.applicant_phoneNumber
                                      );
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                  <br />
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              {btnLoader ? (
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: "green", cursor: "not-allowed" }}
                  disabled
                >
                  Loading...
                </button>
              ) : (
                <>
                  {selectedApplicant ? (
                    <Button
                      color="success"
                      onClick={() => {
                        setBtnLoader(true);
                        updateApplicantData();
                      }}
                    >
                      Update Applicant
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      type="submit"
                      disabled={!applicantFormik.isValid}
                    >
                      Create Applicant
                    </Button>
                  )}
                </>
              )}
              <Button
                onClick={() => {
                  closeModal();
                  applicantFormik.resetForm();
                }}
              >
                Cancel
              </Button>
              {/* Conditional message */}
              {!applicantFormik.isValid && (
                <div style={{ color: "red", marginTop: "10px" }}>
                  Please fill in all fields correctly.
                </div>
              )}
            </ModalFooter>
          </Form>
        </Modal>

        <ToastContainer />
      </Container>
    </>
  );
};

export default Applicants;
