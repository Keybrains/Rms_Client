import {
  Button,
  Card,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "components/Headers/Header";
import { useFormik } from "formik";
import Edit from "@mui/icons-material/Edit";
import moment from "moment";

const TenantFinancial = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [rental_adress, setRentalAddress] = useState([]);
  const [Ledger, setLedger] = useState([]);
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
  const [unit, setUnit] = useState("");
  const [propertyId, setPropertyId] = useState("");
  // const [cookie_id, setCookieId] = useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const [loader, setLoader] = React.useState(true);

  const handleSearch = (e) => {
    setSearchQueryy(e.target.value);
  };
  const toggle9 = () => {
    setuserDropdownOpen((prevState) => !prevState);
  };

  const toggle10 = () => {
    setUnitDropdownOpen((prevState) => !prevState);
  };

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);
  let cookie_id = localStorage.getItem("Tenant ID");

  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const fetchLedger = async () => {

    try {
      const response = await axios.get(
        `${baseUrl}/payment/tenant_financial/${accessType?.tenant_id}`
      );
      setLedger(response.data.data);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setLoader(false);
    }

  };
  useEffect(() => {
    fetchLedger();
  }, [accessType]);

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
    financialFormik.setFieldValue("tenantId", cookie_id);
    financialFormik.setFieldValue("first_name", tenantDetails.tenant_firstName);
    financialFormik.setFieldValue("last_name", tenantDetails.tenant_lastName);
    financialFormik.setFieldValue("email_name", tenantDetails.tenant_email);
    setIsModalOpen(true);
  };

  // Event handler to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }

  const calculateBalance = (data) => {
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

    return data;
  };

  const financialFormik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email_name: "",
      card_number: "",
      amount: "",
      account: "",
      expiration_date: "",
      cvv: "",
      tenantId: "",
      propertyId: "",
      unitId: "",
    },
    validationSchema: yup.object({
      first_name: yup.string().required("First name is required"),
      last_name: yup.string().required("Last name is required"),
      email_name: yup.string().required("Email is required"),
      card_number: yup.number().required("Card number is required"),
      amount: yup.number().required("Amount is required"),
      account: yup.string().required("Amount is required"),
      expiration_date: yup.string().required("Expiration date is required"),
      cvv: yup.number().required("CVV is required"),
    }),
    onSubmit: (values, action) => {
      if (isEditable && paymentId) {
        editpayment(paymentId);
      }
    },
  });
  const handlePropertyTypeSelect = async (property) => {
    setSelectedPropertyType(property.rental_adress);
    financialFormik.setFieldValue("propertyId", property.property_id || "");
    financialFormik.setFieldValue("unitId", property.unit_id || "");
    setSelectedUnit("");
    setUnit(property.rental_unit);
    setPropertyId(property.property_id);
    setSelectedUnit("");
    try {
      const units = await fetchUnitsByProperty(property.rental_adress);
      setUnitData(units);
    } catch (error) {
      console.error("Error handling selected property:", error);
    }
  };
  const handleUnitSelect = (property) => {
    setSelectedUnit(property.rental_units);
    financialFormik.setFieldValue("unitId", property._id || "");
    financialFormik.setFieldValue("unit", property.rental_units || "");
  };

  const [paymentLoader, setPaymentLoader] = useState(false);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (GeneralLedgerData) {
    const allPaymentAndCharges = GeneralLedgerData.flatMap((item) => {
      if (item !== undefined) {
        return item?.paymentAndCharges?.map((payment) => ({
          paymentAndCharges: payment,
          unit: item.unit,
          unit_id: item.unit_id,
          _id: item._id,
        }));
      } else {
        return;
      }
    });
    paginatedData = allPaymentAndCharges.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filterRentalsBySearch = () => {
    if (!searchQuery) {
      return GeneralLedgerData.flatMap((item) => {
        return item?.paymentAndCharges?.map((payment) => ({
          paymentAndCharges: payment,
          unit: item.unit,
          unit_id: item.unit_id,
          _id: item._id,
        }));
      });
    }

    const allPaymentAndCharges = GeneralLedgerData.flatMap((item) => {
      return item.paymentAndCharges.map((payment) => ({
        paymentAndCharges: payment,
        unit: item.unit,
        unit_id: item.unit_id,
        _id: item._id,
      }));
    });

    return allPaymentAndCharges.filter((rental) => {
      // const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        (rental.paymentAndCharges.charges_account &&
          rental.paymentAndCharges.charges_account.includes(
            searchQuery.toLowerCase()
          )) ||
        (rental.paymentAndCharges.account &&
          rental.paymentAndCharges.account
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (rental.paymentAndCharges.type &&
          rental.paymentAndCharges.type
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (rental.paymentAndCharges.charges_memo &&
          rental.paymentAndCharges.charges_memo
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (rental.paymentAndCharges.memo &&
          rental.paymentAndCharges.memo
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (rental.paymentAndCharges.amount &&
          rental.paymentAndCharges.amount
            .toString()
            .includes(searchQuery.toLowerCase()))
      );
    });
  };
  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterRentalsBySearch();
    const paginatedData = filteredData.slice(startIndex, endIndex);
    // setFilterData(paginatedData)
    return paginatedData;
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const [oneTimeCharges, setOneTimeCharges] = useState([]);
  const [RecAccountNames, setRecAccountNames] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleAccountSelection = (value) => {
    setSelectedAccount(value);
    financialFormik.values.account = value;
  };

  const [isEditable, setIsEditable] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const getEditeData = async (id) => {
    try {
      const response = await axios.get(
        `${baseUrl}/payment_charge/get_entry/${id}`
      );
      if (response.data.statusCode === 200) {
        const responseData = response.data.data;

        // Find the corresponding propertyId based on rental_adress
        const matchingEntry = tenantDetails?.entries?.find(
          (item) => item.rental_adress === responseData.rental_adress
        );

        // Set propertyId if matching entry is found
        financialFormik.setValues((prevValues) => ({
          ...prevValues,
          account: responseData.account || "",
          amount: responseData.amount || "",
          propertyId: matchingEntry.property_id,
        }));

        // Update other selected values
        setSelectedPropertyType(responseData.rental_adress);
        setSelectedUnit(responseData.rental_unit);
        setSelectedAccount(responseData.account);
        setIsEditable(true);
        setPaymentId(id);
        openModal();
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const editpayment = async (id) => {
    const rentalAddress = financialFormik.values.rental_adress;

    try {
      const updatedValues = {
        month_year: moment().format("MM-YYYY"),
        date: moment().format("YYYY-MM-DD"),
        amount: financialFormik.values.amount,
        tenant_firstName: financialFormik.values.first_name,
        tenant_lastName: financialFormik.values.last_name,
        attachment: financialFormik.values.attachment,
        rental_adress: financialFormik.values.rental_adress,
        tenant_id: cookie_id,

        entries: [
          {
            account: financialFormik.values.account,
            balance: parseFloat(financialFormik.values.amount),
            amount: parseFloat(financialFormik.values.amount),
          },
        ],
      };

      //console.log(updatedValues, "updatedValues");

      const putUrl = `${baseUrl}/payment_charge/edit_entry/${id}`;
      const response = await axios.put(putUrl, updatedValues);

      if (response.data.statusCode === 200) {
        closeModal();
        console.log("Response Data:", response.data);
        toast.success("Payments Update Successfully", {
          position: "top-center",
        });
        navigate(`/tenant/tenantFinancial`);
      } else {
        toast.error(response.data.message, {
          position: "top-center",
        });
        console.error("Server Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  };

  console.log(paymentId ? paymentId : "");
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

          <Col className="text-right">
            <Button
              color="primary"
              //  href="#rms"
              onClick={openModal}
              size="sm"
              style={{ background: "white", color: "#263238" }}
            >
              Make Payment
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <div className="col">
            {/* {loader ? (
              <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={loader}
                />
              </div>
            ) : ( */}
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
                        <CardHeader className="border-0">
                          <Row>
                            <Col xs="12" sm="6">
                              <FormGroup>
                                <Input
                                  fullWidth
                                  type="text"
                                  placeholder="Search"
                                  value={searchQuery}
                                  onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                  }
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
                          {Ledger.length === 0 ? (
                            <tbody>
                              <tr className="text-center">
                                <td colSpan="7" style={{ fontSize: "15px" }}>No Ledger Added</td>
                              </tr>
                            </tbody>

                          ) : (
                            <tbody>
                              {Ledger &&
                                Ledger.length > 0 &&
                                Ledger.map((item, index) => (
                                  <tr
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                    className="w-100"
                                  >
                                    <td>
                                      {moment(item?.createdAt).format(
                                        "DD-MM-YYYY"
                                      ) || "N/A"}
                                    </td>

                                    <td>{item?.type || "N/A"}</td>

                                    <td>
                                      {item?.entry?.map((data, i) => (
                                        <>
                                          <div className="d-flex">
                                            <div className="">
                                              {i + 1}
                                              {". "}
                                            </div>
                                            <div>{data?.account}</div>
                                          </div>
                                        </>
                                      ))}
                                    </td>

                                    <td>
                                      {" "}
                                      {item.is_leaseAdded === true
                                        ? item.entry.map((data, i) => (
                                          <>
                                            <div className="d-flex ">
                                              <div>
                                                {i + 1}
                                                {". "}
                                              </div>
                                              <div>{data.memo}</div>
                                            </div>
                                          </>
                                        ))
                                        : item.entry[0].memo}
                                    </td>

                                    {item.type === "charge" ? (
                                      <td> {item?.total_amount}</td>
                                    ) : (
                                      <td>-</td>
                                    )}
                                    {item.type === "payment" ? (
                                      <td> {item?.total_amount}</td>
                                    ) : (
                                      <td>-</td>
                                    )}
                                    <td>{item?.balance}</td>
                                    {/* <td></td> */}
                                  </tr>
                                ))}
                            </tbody>)}
                        </Table>
                        {paginatedData.length > 0 ? (
                          <Row>
                            <Col className="text-right m-3">
                              <Dropdown
                                isOpen={leasedropdownOpen}
                                toggle={toggle2}
                              >
                                <DropdownToggle caret>
                                  {pageItem}
                                </DropdownToggle>
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
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
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
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
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
                  <Form onSubmit={financialFormik.handleSubmit}>
                    <ModalHeader
                      toggle={closeModal}
                      className="bg-secondary text-white"
                    >
                      <strong style={{ fontSize: 18 }}>Make Payment</strong>
                    </ModalHeader>

                    <ModalBody>
                      <div>
                        <Row>
                          <Col md="6">
                            <label
                              className="form-control-label"
                              htmlFor="input-property"
                            >
                              Property*
                            </label>
                            <FormGroup>
                              <Dropdown
                                isOpen={userdropdownOpen}
                                toggle={toggle9}
                              >
                                <DropdownToggle
                                  caret
                                  style={{ width: "100%" }}
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
                                  {tenantDetails?.entries?.map(
                                    (property, index) => (
                                      <DropdownItem
                                        key={index}
                                        onClick={() => {
                                          handlePropertyTypeSelect(property);
                                          financialFormik.setFieldValue(
                                            "propertyId",
                                            property.property_id
                                          );
                                        }}
                                      >
                                        {property.rental_adress}
                                      </DropdownItem>
                                    )
                                  )}
                                </DropdownMenu>
                              </Dropdown>
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            {unitData.length !== 0 ? (
                              <>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Unit *
                                </label>
                                <FormGroup>
                                  <Dropdown
                                    isOpen={unitDropdownOpen}
                                    toggle={toggle10}
                                  >
                                    <DropdownToggle
                                      caret
                                      style={{ width: "100%" }}
                                    >
                                      {selectedUnit
                                        ? selectedUnit
                                        : "Select Unit"}
                                    </DropdownToggle>
                                    <DropdownMenu
                                      style={{
                                        width: "100%",
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                      }}
                                    >
                                      {unitData?.map((property, index) => (
                                        <DropdownItem
                                          key={index}
                                          onClick={() => {
                                            handleUnitSelect(property);
                                          }}
                                        >
                                          {property.rental_units}
                                        </DropdownItem>
                                      ))}
                                    </DropdownMenu>
                                  </Dropdown>
                                </FormGroup>
                              </>
                            ) : null}
                          </Col>

                          <Col md="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                              >
                                Amount *
                              </label>
                              <Input
                                type="text"
                                id="amount"
                                placeholder="Enter amount"
                                name="amount"
                                onBlur={financialFormik.handleBlur}
                                onInput={(e) => {
                                  const inputValue = e.target.value;
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ""
                                  );
                                  e.target.value = numericValue;
                                }}
                                onChange={financialFormik.handleChange}
                                value={financialFormik.values.amount}
                                required
                              />
                            </FormGroup>
                          </Col>

                          <Col md="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                              >
                                Account *
                              </label>
                              <FormGroup>
                                <Dropdown
                                  isOpen={dropdownOpen}
                                  toggle={toggleDropdown}
                                >
                                  <DropdownToggle caret>
                                    {selectedAccount
                                      ? selectedAccount
                                      : "Select"}
                                  </DropdownToggle>
                                  <DropdownMenu
                                    style={{
                                      zIndex: 999,
                                      maxHeight: "200px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    <DropdownItem
                                      header
                                      style={{ color: "blue" }}
                                    >
                                      Liability Account
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() =>
                                        handleAccountSelection(
                                          "Last Month's Rent"
                                        )
                                      }
                                    >
                                      Last Month's Rent
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() =>
                                        handleAccountSelection("Prepayments")
                                      }
                                    >
                                      Prepayments
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() =>
                                        handleAccountSelection(
                                          "Security Deposit Liability"
                                        )
                                      }
                                    >
                                      Security Deposit Liability
                                    </DropdownItem>

                                    <DropdownItem
                                      header
                                      style={{ color: "blue" }}
                                    >
                                      Income Account
                                    </DropdownItem>
                                    {accountData?.map((item) => (
                                      <DropdownItem
                                        key={item._id}
                                        onClick={() =>
                                          handleAccountSelection(
                                            item.account_name
                                          )
                                        }
                                      >
                                        {item.account_name}
                                      </DropdownItem>
                                    ))}
                                    {RecAccountNames ? (
                                      <>
                                        <DropdownItem
                                          header
                                          style={{ color: "blue" }}
                                        >
                                          Reccuring Charges
                                        </DropdownItem>
                                        {RecAccountNames?.map((item) => (
                                          <DropdownItem
                                            key={item._id}
                                            onClick={() =>
                                              handleAccountSelection(
                                                item.account_name
                                              )
                                            }
                                          >
                                            {item.account_name}
                                          </DropdownItem>
                                        ))}
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    {oneTimeCharges ? (
                                      <>
                                        <DropdownItem
                                          header
                                          style={{ color: "blue" }}
                                        >
                                          One Time Charges
                                        </DropdownItem>
                                        {oneTimeCharges?.map((item) => (
                                          <DropdownItem
                                            key={item._id}
                                            onClick={() =>
                                              handleAccountSelection(
                                                item.account_name
                                              )
                                            }
                                          >
                                            {item.account_name}
                                          </DropdownItem>
                                        ))}
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </DropdownMenu>
                                </Dropdown>
                              </FormGroup>
                            </FormGroup>
                          </Col>

                          <Col md="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                              >
                                First Name *
                              </label>
                              <Input
                                type="text"
                                id="first_name"
                                placeholder="First Name"
                                name="first_name"
                                onBlur={financialFormik.handleBlur}
                                onChange={financialFormik.handleChange}
                                value={financialFormik.values.first_name}
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                              >
                                Last Name *
                              </label>
                              <Input
                                type="text"
                                id="last_name"
                                placeholder="Enter last name"
                                name="last_name"
                                onBlur={financialFormik.handleBlur}
                                onChange={financialFormik.handleChange}
                                value={financialFormik.values.last_name}
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
                              id="email_name"
                              placeholder="Enter Email"
                              name="email_name"
                              value={financialFormik.values.email_name}
                              onBlur={financialFormik.handleBlur}
                              onChange={financialFormik.handleChange}
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
                              type="number"
                              id="card_number"
                              placeholder="0000 0000 0000"
                              name="card_number"
                              value={financialFormik.values.card_number}
                              onBlur={financialFormik.handleBlur}
                              onChange={(e) => {
                                // const inputValue = e.target.value;
                                // const numericValue = inputValue.replace(/\D/g, ''); // Remove non-numeric characters
                                // const limitedValue = numericValue.slice(0, 12); // Limit to 12 digits
                                // // const formattedValue = formatCardNumber(limitedValue);
                                // e.target.value = limitedValue;
                                financialFormik.handleChange(e);
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
                                id="expiration_date"
                                name="expiration_date"
                                onBlur={financialFormik.handleBlur}
                                onChange={financialFormik.handleChange}
                                value={financialFormik.values.expiration_date}
                                placeholder="MM/YY"
                                required
                                onInput={(e) => {
                                  let inputValue = e.target.value;
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ""
                                  );

                                  if (numericValue.length > 2) {
                                    const month = numericValue.substring(
                                      0,
                                      2
                                    );
                                    const year = numericValue.substring(2, 6);
                                    e.target.value = `${month}/${year}`;
                                  } else {
                                    e.target.value = numericValue;
                                  }

                                  // Format the year to have a 4-digit length if more than 2 digits are entered
                                  if (numericValue.length >= 3) {
                                    const enteredYear =
                                      numericValue.substring(2, 6);
                                    e.target.value = `${numericValue.substring(
                                      0,
                                      2
                                    )}/${enteredYear}`;
                                  }
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col>
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                              >
                                CVV *
                              </label>
                              <Input
                                type="number"
                                id="cvv"
                                placeholder="123"
                                name="cvv"
                                onBlur={financialFormik.handleBlur}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  if (/^\d{0,3}$/.test(inputValue)) {
                                    // Only allow up to 3 digits
                                    financialFormik.handleChange(e);
                                  }
                                }}
                                value={financialFormik.values.cvv}
                                maxLength={3}
                                required
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      {paymentLoader ? (
                        <Button disabled color="success" type="submit">
                          Loading
                        </Button>
                      ) : (
                        <Button color="success" type="submit">
                          Make Payment
                        </Button>
                      )}
                      <Button onClick={closeModal}>Cancel</Button>
                    </ModalFooter>
                  </Form>
                </Modal>
              </Container>
            </Card>

          </div>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
};

export default TenantFinancial;
