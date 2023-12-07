import {
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Table,
  Label,
  InputGroupAddon,
  InputGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TenantsHeader from "components/Headers/TenantsHeader";
import Cookies from "universal-cookie";
import { RotatingLines } from "react-loader-spinner";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import * as yup from "yup";
import swal from "sweetalert";
import Header from "components/Headers/Header";
import { useFormik } from "formik";
import Edit from "@mui/icons-material/Edit";
const TenantFinancial = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [rental_adress, setRentalAddress] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState(null);
  const [tenantDetails, setTenantDetails] = useState({});
  const { id } = useParams();
  const [GeneralLedgerData, setGeneralLedgerData] = useState([]);
  // console.log(id, tenantDetails);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const handleUnitSelect = (selectedUnit) => {
    setSelectedUnit(selectedUnit);
    applicantFormik.setFieldValue("rental_units", selectedUnit); // Update the formik state here
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
  // Step 2: Event handler to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Event handler to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [loader, setLoader] = React.useState(true);

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }

  const calculateBalance = (data) => {
    // console.log(data);
    let balance = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      const currentEntry = data[i];
      for (let j = currentEntry.entries.length - 1; j >= 0; j--) {
        if (currentEntry.type === "Charge") {
          balance += currentEntry.entries[j].charges_amount;
        } else if (currentEntry.type === "Payment") {
          balance -= currentEntry.entries[j].amount;
        }
        data[i].entries[j].balance = balance;
      }
    }

    //console.log("data",data)
    return data;
  };
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
      statusUpdatedBy: "",
    },
    validationSchema: yup.object({
      tenant_firstName: yup.string().required("Required"),
      tenant_lastName: yup.string().required("Required"),
      tenant_email: yup.string().required("Required"),
      tenant_mobileNumber: yup.string().required("Required"),
      rental_adress: yup.string().required("Required"),
    }),
    onSubmit: (values, action) => {
      // handleFormSubmit(values, action);
      //console.log(values, "values");
    },
  });
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
  const getGeneralLedgerData = async () => {
    const apiUrl = `${baseUrl}/payment/merge_payment_charge/${cookie_id}`;

    try {
      const response = await axios.get(apiUrl);
      setLoader(false);

      if (response.data && response.data.data) {
        const mergedData = response.data.data;
        mergedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        const dataWithBalance = calculateBalance(mergedData);

        setGeneralLedgerData(dataWithBalance);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getGeneralLedgerData();
  }, [cookie_id]);

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);
  let cookie_id = cookies.get("Tenant ID");

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getTenantData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/tenant/tenant_rental_addresses/${cookie_id}`
      );

      if (response.data && response.data.rental_adress) {
        // console.log("Data fetched successfully:", response.data);
        // setTenantDetails(response.data.data);
        setRentalAddress(response.data.rental_adress);

        const allTenants = await axios.get(
          `${baseUrl}/tenant/tenant_summary/${cookie_id}`
        );
        setPropertyDetails(allTenants.data.data.entries);
        // console.log(allTenants.data.data, "allTenants");
      } else {
        console.error("Data structure is not as expected:", response.data);
        setRentalAddress([]); // Set rental_adress to an empty array
      }
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setRentalAddress([]); // Set rental_adress to an empty array
      setPropertyError(error);
    } finally {
      setPropertyLoading(false);
    }
  };

  useEffect(() => {
    getTenantData();
    // console.log(
    //   `${baseUrl}/tenant/tenant_rental_addresses/${cookie_id}`
    // );
  }, [cookie_id]);

  const navigate = useNavigate();

  // const getRentalData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${baseUrl}/rentals/rentals_property/${rental_adress}`
  //     );
  //     setpropertyDetails(response.data.data);
  //     setpropertyLoading(false);
  //   } catch (error) {
  //     setpropertyError(error);
  //     setpropertyLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   if (rental_adress) {
  //       console.log(`${baseUrl}/rentals/rentals_property/${rental_adress}`)
  //       getRentalData();
  //   }
  //   //console.log(rental_adress)
  // }, [rental_adress]);

  function navigateToTenantsDetails(rental_adress) {
    const tenantsDetailsURL = `/tenant/tenantpropertydetail/${rental_adress}`;
    window.location.href = tenantsDetailsURL;
    // console.log("Rental Address", rental_adress);
  }
  const formatCardNumber = (inputValue) => {
    if (typeof inputValue !== 'string') {
      return ''; // Return an empty string if inputValue is not a string
    }

    const numericValue = inputValue.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedValue = numericValue
      .replace(/(\d{4})/g, '$1 ') // Add a space after every four digits
      .trim(); // Remove any trailing space

    return formattedValue;
  };

  return (
    <>
      <TenantsHeader />
      {/* Page content */}
      <Container className="mt--8 ml--10" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Ledger</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            {/* <Button
                      color="primary"
                      href="#rms"
                      onClick={() => navigate("/tenant/taddwork")}
                      size="sm"
                      style={{ background: "white", color: "black" }}
                    >
                      Payment
                    </Button> */}
            <Button
              color="primary"
              href="#rms"
              onClick={openModal}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Make Payment
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
                <Container className="mt--10" fluid>
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
                          <CardHeader className="border-0"></CardHeader>

                          <Table
                            className="align-items-center table-flush"
                            responsive
                          >
                            <thead className="thead-light">
                              <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Type</th>
                                <th scope="col">Account</th>
                                <th scope="col">Memo</th>
                                <th scope="col">Increase</th>
                                <th scope="col">Decrease</th>
                                <th scope="col">Balance</th>
                              </tr>
                            </thead>
                            {/* {console.log(GeneralLedgerData)} */}
                            <tbody>
                              {Array.isArray(GeneralLedgerData) ? (
                                GeneralLedgerData.map((generalledger) => (
                                  <>
                                    {generalledger.entries.map(
                                      (entry, index) => (
                                        <tr
                                          key={`${generalledger._id}_${index}`}
                                        >
                                          <td>
                                            {formatDateWithoutTime(
                                              generalledger.type === "Charge"
                                                ? generalledger.date
                                                : generalledger.date
                                            ) || "N/A"}
                                          </td>
                                          <td>{generalledger.type}</td>
                                          <td>
                                            {generalledger.type === "Charge"
                                              ? entry.charges_account
                                              : entry.account}
                                          </td>
                                          <td>
                                            {generalledger.type === "Charge"
                                              ? generalledger.charges_memo
                                              : generalledger.memo}
                                          </td>
                                          <td>
                                            {generalledger.type === "Charge"
                                              ? "$" + entry.charges_amount
                                              : "-"}
                                          </td>
                                          <td>
                                            {generalledger.type === "Payment"
                                              ? "$" + entry.amount
                                              : "-"}
                                          </td>
                                          <td>
                                            {entry.balance !== undefined
                                              ? entry.balance >= 0
                                                ? `$${entry.balance}`
                                                : `$(${Math.abs(
                                                  entry.balance
                                                )})`
                                              : "0"}
                                            {/* {console.log(entry.balance)} */}
                                            {/* {calculateBalance(
                                                  generalledger.type,
                                                  entry,
                                                  index
                                                )} */}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </>
                                ))
                              ) : (
                                <p>GeneralLedgerData is not an array</p>
                              )}
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
                        <strong style={{ fontSize: 18 }}>Make Payment</strong>
                      </ModalHeader>

                      <ModalBody>
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
                                  value={
                                    applicantFormik.values.tenant_firstName
                                  }
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
                              Card Number *
                            </label>
                            <InputGroup>
                              <Input
                                type="text"
                                id="tenant_cardnumber"
                                placeholder="0000 0000 0000"
                                name="tenant_cardnumber"
                                value={formatCardNumber(applicantFormik.values.tenant_cardnumber)}
                                onBlur={applicantFormik.handleBlur}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  const numericValue = inputValue.replace(/\D/g, ''); // Remove non-numeric characters
                                  const limitedValue = numericValue.slice(0, 12); // Limit to 12 digits
                                  const formattedValue = formatCardNumber(limitedValue);
                                  e.target.value = formattedValue;
                                  applicantFormik.handleChange(e);
                                }}
                                required
                              />


                            </InputGroup>
                          </FormGroup>
                          <Row>
                            <Col>
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Expiration Date *
                                </label>
                                <Input
                                  type="text"
                                  id="tenant_Expirationdate"
                                  name="tenant_Expirationdate"
                                  onBlur={applicantFormik.handleBlur}
                                  onChange={applicantFormik.handleChange}
                                  value={applicantFormik.values.tenant_Expirationdate}
                                  placeholder="MM/YY"
                                  required
                                  onInput={(e) => {
                                    let inputValue = e.target.value;

                                    // Remove non-numeric characters
                                    const numericValue = inputValue.replace(/\D/g, '');

                                    // Set the input value to the sanitized value (numeric only)
                                    e.target.value = numericValue;

                                    // Format the date as "MM/YY"
                                    if (numericValue.length > 2) {
                                      const month = numericValue.substring(0, 2);
                                      const year = numericValue.substring(2, 6);
                                      e.target.value = `${month}/${year}`;
                                    }

                                    // Restrict the year to be 4 digits starting from the current year
                                    const currentYear = new Date().getFullYear().toString();
                                    if (numericValue.length > 5) {
                                      const enteredYear = numericValue.substring(3, 7);
                                      if (enteredYear < currentYear) {
                                        e.target.value = `${numericValue.substring(0, 2)}/${currentYear.substring(2, 4)}`;
                                      }
                                    }
                                  }}
                                />




                              </FormGroup>
                            </Col>
                            <Col>
                              <FormGroup>
                                <label className="form-control-label" htmlFor="input-property">
                                  Cvv *
                                </label>
                                <Input
                                  type="text"
                                  id="tenant_cvv"
                                  placeholder="123"
                                  name="tenant_cvv"
                                  onBlur={applicantFormik.handleBlur}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (/^\d{0,3}$/.test(inputValue)) {
                                      // Only allow up to 3 digits
                                      applicantFormik.handleChange(e);
                                    }
                                  }}
                                  value={applicantFormik.values.tenant_Cvv}
                                  maxLength={3}
                                  required
                                />
                              </FormGroup>

                            </Col>
                          </Row>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="success" type="submit">
                          Make Payment
                        </Button>
                        <Button onClick={closeModal}>Cancel</Button>
                      </ModalFooter>
                    </Form>
                  </Modal>
                </Container>
              </Card>
            )}
          </div>
        </Row>
      </Container>
    </>
  );
};

export default TenantFinancial;
