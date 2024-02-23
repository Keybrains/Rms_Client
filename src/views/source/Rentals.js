import RentalHeader from "components/Headers/RentalHeader";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  ModalHeader,
  ModalBody,
  Modal,
} from "reactstrap";
import AddpropertyModal from "./AddpropertyModal";
import StaffMemberModal from "./StaffMemberModal";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import { useFormik } from "formik";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//rentals
import {
  dialogPaperStyles,
  editProperty,
  handleSubmit,
} from "./Functions/Rentals";

//units
import { roomsArray, bathArray } from "./Functions/Units";

const Rentals = () => {
  const { rental_id, admin } = useParams();
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_URL;

  const [loader, setLoader] = useState(false);
  const [display, setDisplay] = useState(false);
  const [selectedPropType, setSelectedPropType] = useState("");
  const [open, setOpen] = useState(false);
  const [propType, setPropType] = useState("");
  const [StaffMemberData, setStaffMemberData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [userdropdownOpen, setuserDropdownOpen] = useState(false);
  const [proDropdownOpen, setproDropdownOpen] = useState(false);
  const [showRentalOwnerTable, setshowRentalOwnerTable] = useState(false);
  const [isRentalDialogOpen, setRentalDialogOpen] = useState(false);
  const [checkedCheckbox, setCheckedCheckbox] = useState();
  const [selectedRentalOwnerData, setSelectedRentalOwnerData] = useState([]);
  const [rentalownerData, setRentalownerData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [accessType, setAccessType] = useState({});

  const toggle1 = () => setproDropdownOpen((prevState) => !prevState);
  const toggle3 = () => setuserDropdownOpen((prevState) => !prevState);

  const residentialSchema = yup.object({
    rental_sqft: yup.string().required("Required"),
  });

  const commercialSchema = yup.object({
    rental_sqft: yup.string().required("Required"),
  });

  const residentialSchema2 = yup.object({
    rental_unit: yup.string().required("Required"),
    rental_sqft: yup.string().required("Required"),
  });

  const commercialSchema2 = yup.object({
    rental_sqft: yup.string().required("Required"),
    rental_unit: yup.string().required("Required"),
  });

  let rentalsFormik = useFormik({
    initialValues: {
      rental_id: "",
      rental_adress: "",
      is_rent_on: false,
      rental_city: "",
      rental_state: "",
      rental_country: "",
      rental_postcode: "",
      staffmember_id: "",
      staffmember_name: "",
      property_type: "",

      //RESIDENTIAL
      residential: [
        {
          rental_bed: "",
          rental_bath: "",
          propertyres_image: [],
          rental_sqft: "",
          rental_unit: "",
          rental_unit_adress: "",
        },
      ],

      //COMMERCIAL
      commercial: [
        {
          rental_sqft: "",
          rental_unit: "",
          rental_unit_adress: "",
          property_image: [],
        },
      ],
    },
    validationSchema: yup.object({
      rental_postcode: yup.string().required("Required"),
      property_type: yup.string().required("Required"),
      rental_adress: yup.string().required("Required"),
      rental_city: yup.string().required("Required"),
      rental_country: yup.string().required("Required"),
      rental_state: yup.string().required("Required"),
      ...(selectedPropType.is_multiunit
        ? propType === "Residential"
          ? { residential: yup.array().of(residentialSchema2) }
          : { commercial: yup.array().of(commercialSchema2) }
        : propType === "Residential"
        ? { residential: yup.array().of(residentialSchema) }
        : { commercial: yup.array().of(commercialSchema) }),
    }),
    onSubmit: async (values) => {
      if (selectedRentalOwnerData.length !== 0) {
        try {
          const res = await handleSubmit(
            values,
            rentalOwnerFormik.values,
            accessType.admin_id,
            selectedPropType.property_id,
            selectedFiles
          );
          if (res === false) {
            setLoader(false);
            navigate("/" + admin + "/propertiesTable");
          } else {
            setLoader(false);
          }
        } catch {
          setLoader(false);
        }
      } else {
        setDisplay(true);
      }
    },
  });

  const checkRentalOwner = async (values) => {
    try {
      const res = await axios.post(
        `${baseUrl}/rental_owner/check_rental_owner`,
        values
      );
      if (res.data.statusCode === 200) {
        setSelectedRentalOwnerData(values);
        setshowRentalOwnerTable(false);
        handleAddrentalOwner();
        handleClose();
      }
      if (res.data.statusCode === 201) {
        toast.warn(res.data.message, {
          position: "top-center",
          autoClose: 500,
        });
      }
    } catch (error) {
      console.error("Error: ", error.message);
    }
  };

  let rentalOwnerFormik = useFormik({
    initialValues: {
      rentalowner_id: "",
      rentalOwner_firstName: "",
      rentalOwner_lastName: "",
      rentalOwner_companyName: "",
      rentalOwner_primaryEmail: "",
      rentalOwner_alternativeEmail: "",
      rentalOwner_phoneNumber: "",
      rentalOwner_homeNumber: "",
      rentalOwner_businessNumber: "",
      street_address: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      chooseExistingOwner: false,
    },
    validationSchema: yup.object({
      rentalOwner_firstName: yup.string().required("Required"),
      rentalOwner_lastName: yup.string().required("Required"),
      rentalOwner_phoneNumber: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      if (!values.rentalowner_id) {
        checkRentalOwner(values);
      } else {
        setSelectedRentalOwnerData(values);
        setshowRentalOwnerTable(false);
        handleAddrentalOwner();
        handleClose();
      }
    },
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, []);

  const fetchEditeData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/rentals/rental_summary/${rental_id}`
      );

      const response2 = await axios.get(
        `${baseUrl}/unit/rental_unit/${rental_id}`
      );

      setPropType(response.data.data[0].property_type_data.property_type);
      setSelectedPropType(response.data.data[0].property_type_data);
      setSelectedUser(response.data.data[0].staffmember_data.staffmember_name);

      rentalsFormik.setValues({
        rental_id: response.data.data[0].rental_id,
        rental_adress: response.data.data[0].rental_adress,
        is_rent_on: response.data.data[0].is_rent_on,
        rental_city: response.data.data[0].rental_city,
        rental_state: response.data.data[0].rental_state,
        rental_country: response.data.data[0].rental_country,
        rental_postcode: response.data.data[0].rental_postcode,
        staffmember_id: response.data.data[0].staffmember_id,
        staffmember_name: response.data.data[0].staffmember_name,
        residential:
          response.data.data[0].property_type_data.property_type ===
          "Residential"
            ? response2.data.data.map((item) => {
                const {
                  rental_unit,
                  rental_unit_adress,
                  rental_sqft,
                  rental_bath,
                  rental_bed,
                  rental_images,
                  unit_id,
                } = item;

                return {
                  rental_unit: rental_unit,
                  rental_unit_adress: rental_unit_adress,
                  rental_sqft: rental_sqft,
                  rental_bath: rental_bath,
                  rental_bed: rental_bed,
                  rental_images: rental_images,
                  unit_id: unit_id,
                };
              })
            : [],
        commercial:
          response.data.data[0].property_type_data.property_type ===
          "Commercial"
            ? response2.data.data.map((item) => {
                const {
                  rental_unit,
                  rental_unit_adress,
                  rental_sqft,
                  rental_images,
                  unit_id,
                } = item;

                return {
                  rental_unit: rental_unit,
                  rental_unit_adress: rental_unit_adress,
                  rental_sqft: rental_sqft,
                  rental_images: rental_images,
                  unit_id: unit_id,
                };
              })
            : [],
      });

      rentalOwnerFormik.setValues({
        rentalowner_id: response.data.data[0].rental_owner_data.rentalowner_id,
        rentalOwner_firstName:
          response.data.data[0].rental_owner_data.rentalOwner_firstName,
        rentalOwner_lastName:
          response.data.data[0].rental_owner_data.rentalOwner_lastName,
        rentalOwner_companyName:
          response.data.data[0].rental_owner_data.rentalOwner_companyName,
        rentalOwner_primaryEmail:
          response.data.data[0].rental_owner_data.rentalOwner_primaryEmail,
        rentalOwner_alternativeEmail:
          response.data.data[0].rental_owner_data.rentalOwner_alternativeEmail,
        rentalOwner_phoneNumber:
          response.data.data[0].rental_owner_data.rentalOwner_phoneNumber,
        rentalOwner_homeNumber:
          response.data.data[0].rental_owner_data.rentalOwner_homeNumber,
        rentalOwner_businessNumber:
          response.data.data[0].rental_owner_data.rentalOwner_businessNumber,
        street_address: response.data.data[0].rental_owner_data.street_address,
        city: response.data.data[0].rental_owner_data.city,
        state: response.data.data[0].rental_owner_data.state,
        country: response.data.data[0].rental_owner_data.country,
        postal_code: response.data.data[0].rental_owner_data.postal_code,
        chooseExistingOwner: false,
      });

      setSelectedRentalOwnerData(response.data.data[0].rental_owner_data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchPropertyTypeData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/propertytype/property_type/${accessType.admin_id}`
      );
      setPropertyData(response.data.data);
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const fetchRentalOwnerData = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/rentals/rental-owners/${accessType.admin_id}`
      );
      const data = await response.json();

      if (response.ok) {
        setRentalownerData(data || []);
      } else {
        console.error("Error:", data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const fetchStaffMemberData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/staffmember/staff_member/${accessType.admin_id}`
      );
      setStaffMemberData(response.data.data);
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetchEditeData();
  }, [rental_id]);

  useEffect(() => {
    fetchPropertyTypeData();
    fetchRentalOwnerData();
    fetchStaffMemberData();
  }, [accessType]);

  const handleClose = () => {
    setOpen(false);
    setRentalDialogOpen(false);
  };

  const handleCloseButtonClick = () => {
    navigate("../propertiesTable");
  };

  const addCommercialUnit = () => {
    const newUnit = {
      rental_unit: "",
      rental_soft: "",
      rental_unit_adress: "",
      property_image: [],
    };

    rentalsFormik.setValues({
      ...rentalsFormik.values,
      commercial: [...rentalsFormik.values.commercial, newUnit],
    });
  };

  const addResidentialUnits = () => {
    const newUnit = {
      rental_bed: "",
      rental_bath: "",
      propertyres_image: [],
      rental_sqft: "",
      rental_unit: "",
      rental_unit_adress: "",
    };

    rentalsFormik.setValues({
      ...rentalsFormik.values,
      residential: [...rentalsFormik.values.residential, newUnit],
    });
  };

  const deleteCommercialUnit = (index) => {
    const updatedCommercialUnits = [...rentalsFormik.values.commercial];
    updatedCommercialUnits.splice(index, 1);
    rentalsFormik.setValues({
      ...rentalsFormik.values,
      commercial: updatedCommercialUnits,
    });

    setSelectedFiles((prevSelectedFiles) => {
      const updatedFiles = { ...prevSelectedFiles };
      delete updatedFiles[index];
      return updatedFiles;
    });
  };

  const deleteResidentialUnit = (index) => {
    const updatedResidentialUnits = [...rentalsFormik.values.residential];
    updatedResidentialUnits.splice(index, 1);
    rentalsFormik.setValues({
      ...rentalsFormik.values,
      residential: updatedResidentialUnits,
    });

    setSelectedFiles((prevSelectedFiles) => {
      const updatedFiles = { ...prevSelectedFiles };
      delete updatedFiles[index];
      return updatedFiles;
    });
  };

  const fileData = (e, i) => {
    setSelectedFiles((prevSelectedFiles) => ({
      ...prevSelectedFiles,
      [i]: [...e.target.files],
    }));
  };

  const clearSelectedPhoto = (commercialIndex, index) => {
    setSelectedFiles((prevSelectedFiles) => {
      const updatedFiles = { ...prevSelectedFiles };

      if (updatedFiles[index]) {
        updatedFiles[index] = updatedFiles[index].filter(
          (file, i) => i !== commercialIndex
        );
      }

      return updatedFiles;
    });
  };

  const togglePhotoDialog = () => {};

  const handleUserSelection = (value) => {
    setSelectedUser(value.staffmember_name);
    setuserDropdownOpen(true);
  };

  const handleRentalownerDelete = () => {
    setSelectedRentalOwnerData([]);
    rentalOwnerFormik.resetForm();
  };

  const handleCheckboxChange = (rentalOwnerInfo) => {
    rentalOwnerFormik.setValues({
      rentalowner_id: rentalOwnerInfo.rentalowner_id,
      rentalOwner_firstName: rentalOwnerInfo.rentalOwner_firstName,
      rentalOwner_lastName: rentalOwnerInfo.rentalOwner_lastName,
      rentalOwner_companyName: rentalOwnerInfo.rentalOwner_companyName,
      rentalOwner_primaryEmail: rentalOwnerInfo.rentalOwner_primaryEmail,
      rentalOwner_alternativeEmail:
        rentalOwnerInfo.rentalOwner_alternativeEmail,
      rentalOwner_phoneNumber: rentalOwnerInfo.rentalOwner_phoneNumber,
      rentalOwner_homeNumber: rentalOwnerInfo.rentalOwner_homeNumber,
      rentalOwner_businessNumber: rentalOwnerInfo.rentalOwner_businessNumber,
      street_address: rentalOwnerInfo.street_address,
      city: rentalOwnerInfo.city,
      state: rentalOwnerInfo.state,
      postal_code: rentalOwnerInfo.postal_code,
      country: rentalOwnerInfo.country,
      chooseExistingOwner: true,
    });
  };

  const handleAddrentalOwner = () => {
    const newrentalOwnerDetails = {
      rentalOwner_firstName: rentalOwnerFormik.values.rentalOwner_firstName,
      rentalOwner_lastName: rentalOwnerFormik.values.rentalOwner_lastName,
      rentalOwner_phoneNumber: rentalOwnerFormik.values.rentalOwner_phoneNumber,
      rentalOwner_primaryEmail:
        rentalOwnerFormik.values.rentalOwner_primaryEmail,
      rentalOwner_alternativeEmail:
        rentalOwnerFormik.values.rentalOwner_alternativeEmail,
      rentalOwner_homeNumber: rentalOwnerFormik.values.rentalOwner_homeNumber,
      rentalOwner_businessNumber:
        rentalOwnerFormik.values.rentalOwner_businessNumber,
      rentalowner_id: rentalOwnerFormik.values.rentalowner_id || "",
    };
    setSelectedRentalOwnerData(newrentalOwnerDetails);
    if (!rental_id) {
      toast.success("Rental Owner Added Successfully!", {
        position: "top-center",
        autoClose: 500,
      });
    }
    setDisplay(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChange = () => {
    setshowRentalOwnerTable(!showRentalOwnerTable);
  };

  const handlePropSelection = (propertyType) => {
    rentalsFormik.setFieldValue("property_type", propertyType.property_type);
    setSelectedPropType(propertyType);
    setPropType(propertyType.property_type);
    setSelectedFiles([]);
  };
  const openCardForm = () => {
    console.log("Opening card form");
    setIsModalOpen(true);
  };
  const openCardForm1 = () => {
    console.log("Opening card form");
    setisMOdalopen1(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setisMOdalopen1(false);
    fetchPropertyTypeData();
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMOdalopen1, setisMOdalopen1] = useState(false);
  console.log(isModalOpen, "isModalOpen");
  const { tenantId, entryIndex } = useParams();

  return (
    <>
      <RentalHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card
              className="bg-secondary shadow"
              onSubmit={rentalsFormik.handleSubmit}
            >
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {rental_id ? "Edit Property" : "New Property"}
                    </h3>
                  </Col>
                  <Col className="text-right" xs="4"></Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form role="form" open={open} onClose={handleClose}>
                  <h6 className="heading-small text-muted mb-4">
                    Property information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            What is the property type?
                          </label>
                          <br />
                          <br />
                          <Dropdown
                            isOpen={proDropdownOpen}
                            toggle={toggle1}
                            disabled={rental_id}
                          >
                            <DropdownToggle caret>
                              {selectedPropType &&
                              selectedPropType.propertysub_type
                                ? selectedPropType.propertysub_type
                                : selectedPropType &&
                                  !selectedPropType.propertysub_type
                                ? selectedPropType
                                : "Select Property Type"}
                            </DropdownToggle>
                            <DropdownMenu>
                              {Object.values(
                                propertyData.reduce((acc, item) => {
                                  if (!acc[item.property_type]) {
                                    acc[item.property_type] = [item];
                                  } else {
                                    acc[item.property_type].push(item);
                                  }
                                  return acc;
                                }, {})
                              ).map((propertyGroup) => (
                                <React.Fragment
                                  key={propertyGroup[0].property_type}
                                >
                                  <DropdownItem
                                    header
                                    style={{ color: "blue" }}
                                  >
                                    {propertyGroup[0].property_type}
                                  </DropdownItem>
                                  {propertyGroup.map((subtype) => (
                                    <DropdownItem
                                      key={subtype.propertysub_type}
                                      onClick={() => {
                                        handlePropSelection(subtype);
                                      }}
                                    >
                                      {subtype.propertysub_type}
                                    </DropdownItem>
                                  ))}
                                </React.Fragment>
                              ))}
                              <DropdownItem
                                style={{ borderTop: "1px solid grey" }}
                                onClick={() => openCardForm()}
                              >
                                {/* {subtype.propertysub_type} */}
                                Add new Properties
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                          {
                            <div>
                              {rentalsFormik.errors &&
                              rentalsFormik.errors?.property_type &&
                              rentalsFormik.touched &&
                              rentalsFormik.touched?.property_type ? (
                                <div style={{ color: "red" }}>
                                  {rentalsFormik.errors?.property_type}
                                </div>
                              ) : null}
                            </div>
                          }
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            What is the street address?
                          </label>
                          <br />
                          <br />
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Address *
                            </label>
                            <Input
                              required
                              className="form-control-alternative"
                              id="input-address"
                              placeholder="Address"
                              type="text"
                              name="rental_adress"
                              onBlur={rentalsFormik.handleBlur}
                              onChange={(e) =>
                                rentalsFormik.setFieldValue(
                                  "rental_adress",
                                  e.target.value
                                )
                              }
                              value={rentalsFormik.values?.rental_adress}
                            />
                            {
                              <div>
                                {rentalsFormik.errors &&
                                rentalsFormik.errors?.rental_adress &&
                                rentalsFormik.touched &&
                                rentalsFormik.touched?.rental_adress ? (
                                  <div style={{ color: "red" }}>
                                    {rentalsFormik.errors?.rental_adress}
                                  </div>
                                ) : null}
                              </div>
                            }
                          </FormGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            City *
                          </label>
                          <Input
                            required
                            className="form-control-alternative"
                            id="input-city"
                            placeholder="New York"
                            type="text"
                            name="rental_city"
                            onBlur={rentalsFormik.handleBlur}
                            onChange={(e) =>
                              rentalsFormik.setFieldValue(
                                "rental_city",
                                e.target.value
                              )
                            }
                            value={rentalsFormik.values?.rental_city}
                          />
                          {
                            <div>
                              {rentalsFormik.errors &&
                              rentalsFormik.errors?.rental_city &&
                              rentalsFormik.touched &&
                              rentalsFormik.touched?.rental_city ? (
                                <div style={{ color: "red" }}>
                                  {rentalsFormik.errors?.rental_city}
                                </div>
                              ) : null}
                            </div>
                          }
                        </FormGroup>
                      </Col>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            State *
                          </label>
                          <Input
                            required
                            className="form-control-alternative"
                            id="input-country"
                            placeholder="state"
                            type="text"
                            name="rental_state"
                            onBlur={rentalsFormik.handleBlur}
                            onChange={(e) =>
                              rentalsFormik.setFieldValue(
                                "rental_state",
                                e.target.value
                              )
                            }
                            value={rentalsFormik.values?.rental_state}
                          />
                          {
                            <div>
                              {rentalsFormik.errors &&
                              rentalsFormik.errors?.rental_state &&
                              rentalsFormik.touched &&
                              rentalsFormik.touched?.rental_state ? (
                                <div style={{ color: "red" }}>
                                  {rentalsFormik.errors?.rental_state}
                                </div>
                              ) : null}
                            </div>
                          }
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Country *
                          </label>
                          <Input
                            required
                            className="form-control-alternative"
                            id="input-country"
                            placeholder="United States"
                            type="text"
                            name="rental_country"
                            onBlur={rentalsFormik.handleBlur}
                            onChange={(e) =>
                              rentalsFormik.setFieldValue(
                                "rental_country",
                                e.target.value
                              )
                            }
                            value={rentalsFormik.values?.rental_country}
                          />
                          {
                            <div>
                              {rentalsFormik.errors &&
                              rentalsFormik.errors?.rental_country &&
                              rentalsFormik.touched &&
                              rentalsFormik.touched?.rental_country ? (
                                <div style={{ color: "red" }}>
                                  {rentalsFormik.errors?.rental_country}
                                </div>
                              ) : null}
                            </div>
                          }
                        </FormGroup>
                      </Col>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Postal code *
                          </label>
                          <Input
                            required
                            className="form-control-alternative"
                            id="input-postal-code"
                            placeholder="Postal code"
                            type="text"
                            name="rental_postcode"
                            onBlur={rentalsFormik.handleBlur}
                            onChange={(e) =>
                              rentalsFormik.setFieldValue(
                                "rental_postcode",
                                e.target.value.toUpperCase()
                              )
                            }
                            value={rentalsFormik.values?.rental_postcode}
                            onInput={(e) => {
                              const inputValue = e.target.value;
                              const sanitizedValue = inputValue.replace(
                                /[^A-Za-z0-9-]/g,
                                ""
                              );
                              e.target.value = sanitizedValue.toUpperCase();
                            }}
                          />
                          {
                            <div>
                              {rentalsFormik.errors &&
                              rentalsFormik.errors?.rental_postcode &&
                              rentalsFormik.touched &&
                              rentalsFormik.touched?.rental_postcode ? (
                                <div style={{ color: "red" }}>
                                  {rentalsFormik.errors?.rental_postcode}
                                </div>
                              ) : null}
                            </div>
                          }
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">
                    Owner information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Who is the property owner? (Required)
                          </label>
                          <br />
                          <br />
                          <label
                            className="label2"
                            style={{ fontSize: "0.7rem" }}
                          >
                            This information wiil be used to help prepare owner
                            drawns and 1099s.
                          </label>
                          <br />
                          <span
                            onClick={setRentalDialogOpen}
                            style={{
                              cursor: "pointer",
                              fontSize: "14px",
                              fontFamily: "monospace",
                              color: "blue",
                            }}
                          >
                            <b style={{ fontSize: "20px" }}>+</b> Add rental
                            owner
                            {display === false ? (
                              <></>
                            ) : (
                              <div style={{ color: "red" }}>Required</div>
                            )}
                          </span>
                          <Dialog
                            open={isRentalDialogOpen}
                            onClose={handleClose}
                            PaperProps={{ style: dialogPaperStyles }}
                          >
                            <Form onSubmit={rentalOwnerFormik.handleSubmit}>
                              <DialogTitle style={{ background: "#F0F8FF" }}>
                                Add rental owner
                              </DialogTitle>

                              <DialogContent style={{ width: "100%" }}>
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
                                      Choose an existing rental owner
                                    </label>
                                  </div>
                                  <br />
                                </div>
                                {showRentalOwnerTable && rentalownerData && (
                                  <div
                                    style={{
                                      maxHeight: "400px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <Input
                                      type="text"
                                      placeholder="Search by first and last name"
                                      value={searchQuery}
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
                                              RentalOwner Name
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
                                              .filter((rentalOwner) => {
                                                const fullName = `${rentalOwner.rentalOwner_firstName} ${rentalOwner.rentalOwner_lastName}`;
                                                return fullName
                                                  .toLowerCase()
                                                  .includes(
                                                    searchQuery.toLowerCase()
                                                  );
                                              })
                                              .map((rentalOwner, index) => (
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
                                                    {
                                                      rentalOwner.rentalOwner_firstName
                                                    }
                                                    &nbsp;
                                                    {
                                                      rentalOwner.rentalOwner_lastName
                                                    }
                                                    {` (${rentalOwner.rentalOwner_phoneNumber})`}
                                                  </td>
                                                  <td
                                                    style={{
                                                      paddingLeft: "15px",
                                                      paddingTop: "15px",
                                                    }}
                                                  >
                                                    <Checkbox
                                                      type="checkbox"
                                                      name="rentalOwner"
                                                      id={
                                                        rentalOwner.rentalOwner_phoneNumber
                                                      }
                                                      checked={
                                                        rentalOwner.rentalOwner_phoneNumber ===
                                                        checkedCheckbox
                                                      }
                                                      onChange={(event) => {
                                                        setCheckedCheckbox(
                                                          rentalOwner.rentalOwner_phoneNumber
                                                        );

                                                        handleCheckboxChange(
                                                          rentalOwner
                                                        );
                                                        setshowRentalOwnerTable(
                                                          false
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
                                {!showRentalOwnerTable && (
                                  <div>
                                    <div
                                      className="formInput"
                                      style={{ margin: "10px 10px" }}
                                    >
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-country"
                                      >
                                        Name *
                                      </label>
                                      <br />
                                      <Input
                                        required
                                        id="standard-multiline-static"
                                        className="popinput"
                                        type="text"
                                        placeholder="First Name"
                                        style={{ marginRight: "10px", flex: 1 }}
                                        name="rentalOwner_firstName"
                                        onBlur={rentalOwnerFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalOwnerFormik.setFieldValue(
                                            "rentalOwner_firstName",
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          rentalOwnerFormik.values
                                            .rentalOwner_firstName
                                        }
                                      />

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_firstName &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_firstName &&
                                      rentalsFormik.submitCount > 0 ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_firstName
                                          }
                                        </div>
                                      ) : null}
                                      <br />
                                      <Input
                                        required
                                        id="standard-multiline-static"
                                        className="popinput"
                                        type="text"
                                        placeholder="Last Name"
                                        style={{ flex: 1 }}
                                        name="rentalOwner_lastName"
                                        onBlur={rentalOwnerFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalOwnerFormik.setFieldValue(
                                            "rentalOwner_lastName",
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          rentalOwnerFormik.values
                                            .rentalOwner_lastName
                                        }
                                      />

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_lastName &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_lastName ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_lastName
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                    <div
                                      className="formInput"
                                      style={{ margin: "30px 10px" }}
                                    >
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-address"
                                      >
                                        Company Name *
                                      </label>
                                      <br />
                                      <Input
                                        required
                                        id="standard-multiline-static"
                                        className="popinput"
                                        type="text"
                                        placeholder="L & T Company"
                                        style={{ marginRight: "10px", flex: 1 }}
                                        name="rentalOwner_companyName"
                                        onBlur={rentalOwnerFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalOwnerFormik.setFieldValue(
                                            "rentalOwner_companyName",
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          rentalOwnerFormik.values
                                            .rentalOwner_companyName
                                        }
                                      />
                                      {rentalOwnerFormik.touched
                                        .rentalOwner_companyName &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_companyName ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_companyName
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                    <div
                                      className="formInput"
                                      style={{ margin: "30px 10px" }}
                                    >
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-address"
                                      >
                                        Primary Email *
                                      </label>
                                      <br />
                                      <InputGroup
                                        style={{
                                          marginRight: "10px",
                                          marginTop: "5px",
                                          flex: 1,
                                        }}
                                      >
                                        <Input
                                          required
                                          id="standard-multiline-static"
                                          className="popinput"
                                          type="text"
                                          name="rentalOwner_primaryEmail"
                                          onBlur={rentalOwnerFormik.handleBlur}
                                          placeholder="Email"
                                          onChange={(e) => {
                                            rentalOwnerFormik.setFieldValue(
                                              "rentalOwner_primaryEmail",
                                              e.target.value
                                            );
                                          }}
                                          value={
                                            rentalOwnerFormik.values
                                              .rentalOwner_primaryEmail
                                          }
                                        />
                                        <InputGroupAddon addonType="prepend">
                                          <span
                                            className="input-group-text"
                                            style={{
                                              paddingBottom: "8px",
                                              paddingTop: "8px",
                                            }}
                                          >
                                            <EmailIcon />
                                          </span>
                                        </InputGroupAddon>
                                      </InputGroup>

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_primaryEmail &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_primaryEmail ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_primaryEmail
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                    <div
                                      className="formInput"
                                      style={{ margin: "30px 10px" }}
                                    >
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-address"
                                      >
                                        Alternative Email
                                      </label>
                                      <br />
                                      <InputGroup
                                        style={{
                                          marginRight: "10px",
                                          marginTop: "5px",
                                          flex: 1,
                                        }}
                                      >
                                        <Input
                                          id="standard-multiline-static"
                                          className="popinput"
                                          type="text"
                                          name="rentalOwner_alternativeEmail"
                                          onBlur={rentalOwnerFormik.handleBlur}
                                          placeholder="Alternative Email"
                                          onChange={(e) => {
                                            rentalOwnerFormik.setFieldValue(
                                              "rentalOwner_alternativeEmail",
                                              e.target.value
                                            );
                                          }}
                                          value={
                                            rentalOwnerFormik.values
                                              .rentalOwner_alternativeEmail
                                          }
                                        />
                                        <InputGroupAddon addonType="prepend">
                                          <span
                                            className="input-group-text"
                                            style={{
                                              paddingBottom: "8px",
                                              paddingTop: "8px",
                                            }}
                                          >
                                            <EmailIcon />
                                          </span>
                                        </InputGroupAddon>
                                      </InputGroup>
                                    </div>
                                    <div
                                      className="formInput"
                                      style={{ margin: "30px 10px" }}
                                    >
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-address"
                                      >
                                        Phone Numbers
                                      </label>
                                      <br />
                                      <InputGroup
                                        style={{
                                          marginBottom: "30px",
                                          marginRight: "10px",
                                          marginTop: "5px",
                                          flex: 1,
                                        }}
                                      >
                                        <Input
                                          required
                                          id="standard-multiline-static"
                                          className="popinput"
                                          type="text"
                                          name="rentalOwner_phoneNumber"
                                          onBlur={rentalOwnerFormik.handleBlur}
                                          placeholder="Phone Number"
                                          onChange={(e) => {
                                            rentalOwnerFormik.setFieldValue(
                                              "rentalOwner_phoneNumber",
                                              e.target.value
                                            );
                                          }}
                                          value={
                                            rentalOwnerFormik.values
                                              .rentalOwner_phoneNumber
                                          }
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, "");
                                            e.target.value = numericValue;
                                          }}
                                        />
                                        <InputGroupAddon addonType="prepend">
                                          <span
                                            className="input-group-text"
                                            style={{
                                              paddingBottom: "8px",
                                              paddingTop: "8px",
                                            }}
                                          >
                                            <PhoneIcon />
                                          </span>
                                        </InputGroupAddon>
                                      </InputGroup>

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_phoneNumber &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_phoneNumber ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_phoneNumber
                                          }
                                        </div>
                                      ) : null}
                                      <InputGroup
                                        style={{
                                          marginBottom: "30px",
                                          marginRight: "10px",
                                          flex: 1,
                                        }}
                                      >
                                        <Input
                                          id="standard-multiline-static"
                                          className="popinput"
                                          type="text"
                                          name="rentalOwner_homeNumber"
                                          onBlur={rentalOwnerFormik.handleBlur}
                                          placeholder="Home Number"
                                          onChange={(e) => {
                                            rentalOwnerFormik.setFieldValue(
                                              "rentalOwner_homeNumber",
                                              e.target.value
                                            );
                                          }}
                                          value={
                                            rentalOwnerFormik.values
                                              .rentalOwner_homeNumber
                                          }
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, "");
                                            e.target.value = numericValue;
                                          }}
                                        />
                                        <InputGroupAddon addonType="prepend">
                                          <span
                                            className="input-group-text"
                                            style={{
                                              paddingBottom: "8px",
                                              paddingTop: "8px",
                                            }}
                                          >
                                            <HomeIcon />
                                          </span>
                                        </InputGroupAddon>
                                      </InputGroup>

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_homeNumber &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_homeNumber ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_homeNumber
                                          }
                                        </div>
                                      ) : null}
                                      <InputGroup
                                        style={{
                                          marginBottom: "10px",
                                          marginRight: "10px",
                                          flex: 1,
                                        }}
                                      >
                                        <Input
                                          id="standard-multiline-static"
                                          className="popinput"
                                          type="text"
                                          name="rentalOwner_businessNumber"
                                          onBlur={rentalOwnerFormik.handleBlur}
                                          placeholder="Business Number"
                                          onChange={(e) => {
                                            rentalOwnerFormik.setFieldValue(
                                              "rentalOwner_businessNumber",
                                              e.target.value
                                            );
                                          }}
                                          value={
                                            rentalOwnerFormik.values
                                              .rentalOwner_businessNumber
                                          }
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, "");
                                            e.target.value = numericValue;
                                          }}
                                        />

                                        <InputGroupAddon addonType="prepend">
                                          <span
                                            className="input-group-text"
                                            style={{
                                              paddingBottom: "8px",
                                              paddingTop: "8px",
                                            }}
                                          >
                                            <BusinessIcon />
                                          </span>
                                        </InputGroupAddon>
                                      </InputGroup>

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_businessNumber &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_businessNumber ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_businessNumber
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                    <div
                                      className="formInput"
                                      style={{ margin: "30px 10px" }}
                                    >
                                      <div>Street Address</div>
                                      <br />
                                      <Row>
                                        <FormGroup className="col-12">
                                          <Input
                                            required
                                            className="form-control-alternative"
                                            id="input-address"
                                            placeholder="street_address"
                                            type="text"
                                            name="street_address"
                                            onBlur={
                                              rentalOwnerFormik.handleBlur
                                            }
                                            onChange={(e) =>
                                              rentalOwnerFormik.setFieldValue(
                                                "street_address",
                                                e.target.value
                                              )
                                            }
                                            value={
                                              rentalOwnerFormik.values
                                                ?.street_address
                                            }
                                            style={{
                                              border: "1px solid #cad1d7",
                                            }}
                                          />
                                        </FormGroup>
                                        <FormGroup className="col-6">
                                          <Input
                                            required
                                            className="form-control-alternative"
                                            id="input-address"
                                            placeholder="City"
                                            type="text"
                                            name="city"
                                            onBlur={
                                              rentalOwnerFormik.handleBlur
                                            }
                                            onChange={(e) =>
                                              rentalOwnerFormik.setFieldValue(
                                                "city",
                                                e.target.value
                                              )
                                            }
                                            value={
                                              rentalOwnerFormik.values?.city
                                            }
                                            style={{
                                              border: "1px solid #cad1d7",
                                            }}
                                          />
                                        </FormGroup>
                                        <FormGroup className="col-6">
                                          <Input
                                            required
                                            className="form-control-alternative"
                                            id="input-address"
                                            placeholder="State"
                                            type="text"
                                            name="state"
                                            onBlur={
                                              rentalOwnerFormik.handleBlur
                                            }
                                            onChange={(e) =>
                                              rentalOwnerFormik.setFieldValue(
                                                "state",
                                                e.target.value
                                              )
                                            }
                                            value={
                                              rentalOwnerFormik.values?.state
                                            }
                                            style={{
                                              border: "1px solid #cad1d7",
                                            }}
                                          />
                                        </FormGroup>
                                      </Row>
                                      <Row>
                                        <FormGroup className="col-6">
                                          <Input
                                            required
                                            className="form-control-alternative"
                                            id="input-address"
                                            placeholder="Country"
                                            type="text"
                                            name="country"
                                            onBlur={
                                              rentalOwnerFormik.handleBlur
                                            }
                                            onChange={(e) =>
                                              rentalOwnerFormik.setFieldValue(
                                                "country",
                                                e.target.value
                                              )
                                            }
                                            value={
                                              rentalOwnerFormik.values?.country
                                            }
                                            style={{
                                              border: "1px solid #cad1d7",
                                            }}
                                          />
                                        </FormGroup>
                                        <FormGroup className="col-6">
                                          <Input
                                            required
                                            className="form-control-alternative"
                                            id="input-address"
                                            placeholder="Postal code"
                                            type="text"
                                            name="postal_code"
                                            onBlur={
                                              rentalOwnerFormik.handleBlur
                                            }
                                            onChange={(e) =>
                                              rentalOwnerFormik.setFieldValue(
                                                "postal_code",
                                                e.target.value
                                              )
                                            }
                                            value={
                                              rentalOwnerFormik.values
                                                ?.postal_code
                                            }
                                            style={{
                                              border: "1px solid #cad1d7",
                                            }}
                                          />
                                        </FormGroup>
                                      </Row>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                              <DialogActions>
                                <Button type="submit" color="primary">
                                  Add
                                </Button>
                                <Button onClick={handleClose}>Cancel</Button>
                              </DialogActions>
                            </Form>
                          </Dialog>
                          {Object.keys(selectedRentalOwnerData).length > 0 ? (
                            <div>
                              <h3
                                style={{
                                  marginTop: "2%",
                                }}
                              >
                                Rental owner Information
                              </h3>
                              <table
                                style={{
                                  borderCollapse: "collapse",
                                  width: "100%",
                                  marginTop: "2%",
                                }}
                              >
                                <thead>
                                  <tr style={{ background: "#f2f2f2" }}>
                                    <th
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      First Name
                                    </th>
                                    <th
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      Last Name
                                    </th>
                                    <th
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      Phone Number
                                    </th>
                                    <th
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      {
                                        selectedRentalOwnerData.rentalOwner_firstName
                                      }
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      {
                                        selectedRentalOwnerData.rentalOwner_lastName
                                      }
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      {
                                        selectedRentalOwnerData.rentalOwner_phoneNumber
                                      }
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      <EditIcon
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          setshowRentalOwnerTable(false);
                                          setRentalDialogOpen(true);
                                        }}
                                      />
                                      <DeleteIcon
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          setshowRentalOwnerTable(false);
                                          handleRentalownerDelete();
                                        }}
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <div className="pl-lg-4">
                    <Row>
                      <br />
                    </Row>{" "}
                    <br />
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Who will be the primary manager of this property?
                          </label>
                          <br />
                          <br />
                          <label
                            className="label2"
                            style={{ fontSize: "0.7rem" }}
                          >
                            If the staff member has not yet been added as a user
                            in your account,they can be added to the
                            account,then as the manager later through the
                            property's summary details.
                          </label>
                          <br />
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Manager (Optional)
                          </label>
                          <br />
                          <FormGroup>
                            <Dropdown
                              isOpen={userdropdownOpen}
                              toggle={toggle3}
                            >
                              <DropdownToggle caret>
                                {selectedUser ? selectedUser : "Select"}
                              </DropdownToggle>
                              <DropdownMenu>
                                {StaffMemberData.map((user) => (
                                  <DropdownItem
                                    key={user.staffmember_id}
                                    onClick={() => {
                                      handleUserSelection(user);
                                      rentalsFormik.setFieldValue(
                                        "staffmember_name",
                                        user.staffmember_name
                                      );
                                      rentalsFormik.setFieldValue(
                                        "staffmember_id",
                                        user.staffmember_id
                                      );
                                    }}
                                  >
                                    {user.staffmember_name}
                                  </DropdownItem>
                                ))}
                                <DropdownItem
                                  onClick={() => openCardForm1()}
                                  style={{ borderTop: "1px solid grey" }}
                                >
                                  Add New Staff member
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </FormGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <hr className="my-4" />
                  {!rental_id && propType === "Residential" && (
                    <div className="pl-lg-4">
                      <h6 className="heading-small text-muted mb-4">
                        Residential Unit
                      </h6>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Enter Residential Units
                        </label>
                        <br />
                        <br />
                        {rentalsFormik.values &&
                          rentalsFormik.values?.residential.map(
                            (residential, residentialIndex) => (
                              <div key={residentialIndex}>
                                <Row style={{ position: "relative" }}>
                                  <ClearIcon
                                    style={{
                                      cursor: "pointer",
                                      position: "absolute",
                                      right: "10px",
                                      display: selectedPropType.is_multiunit
                                        ? "block"
                                        : "none",
                                      marginBottom: "20px",
                                    }}
                                    onClick={() => {
                                      deleteResidentialUnit(residentialIndex);
                                    }}
                                  />
                                  <Col
                                    lg="3"
                                    style={
                                      selectedPropType.is_multiunit
                                        ? {
                                            display: "block",
                                            marginTop: "20px",
                                          }
                                        : { display: "none" }
                                    }
                                  >
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor={`input-unit-${residentialIndex}`}
                                        style={{ paddingTop: "10px" }}
                                      >
                                        Unit *
                                      </label>
                                      <Input
                                        required
                                        className="form-control-alternative"
                                        id={`input-unit-${residentialIndex}`}
                                        placeholder="102"
                                        type="text"
                                        name={`residential[${residentialIndex}].rental_unit`}
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const newValue = value.replace(
                                            /[^A-Za-z0-9]/g,
                                            ""
                                          );

                                          rentalsFormik.setFieldValue(
                                            `residential[${residentialIndex}].rental_unit`,
                                            newValue
                                          );
                                        }}
                                        value={
                                          rentalsFormik.values.residential[
                                            residentialIndex
                                          ].rental_unit
                                        }
                                      />
                                      {rentalsFormik.errors &&
                                      rentalsFormik.errors?.residential &&
                                      rentalsFormik.errors.residential[
                                        residentialIndex
                                      ]?.rental_unit &&
                                      rentalsFormik.touched &&
                                      rentalsFormik.touched?.residential &&
                                      rentalsFormik.touched.residential[
                                        residentialIndex
                                      ]?.rental_unit ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalsFormik.errors.residential[
                                              residentialIndex
                                            ]?.rental_unit
                                          }
                                        </div>
                                      ) : null}
                                    </FormGroup>
                                  </Col>
                                  <Col
                                    lg="4"
                                    style={
                                      selectedPropType.is_multiunit
                                        ? { display: "block" }
                                        : { display: "none" }
                                    }
                                  >
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                        style={{ paddingTop: "30px" }}
                                      >
                                        Unit Address
                                      </label>
                                      <Input
                                        required
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="A12 Bhaskar Enclave, Phase 2 - 102"
                                        type="text"
                                        name={`residential[${residentialIndex}].rental_unit_adress`}
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={(e) =>
                                          rentalsFormik.setFieldValue(
                                            `residential[${residentialIndex}].rental_unit_adress`,
                                            e.target.value
                                          )
                                        }
                                        value={
                                          rentalsFormik.values.residential[
                                            residentialIndex
                                          ].rental_unit_adress
                                        }
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="3">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                        style={{ paddingTop: "30px" }}
                                      >
                                        SQFT *
                                      </label>
                                      <Input
                                        required
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="3000"
                                        type="text"
                                        name={`residential[${residentialIndex}].rental_sqft`}
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalsFormik.setFieldValue(
                                            `residential[${residentialIndex}].rental_sqft`,
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          rentalsFormik.values.residential[
                                            residentialIndex
                                          ].rental_sqft
                                        }
                                        onInput={(e) => {
                                          const inputValue = e.target.value;
                                          const numericValue =
                                            inputValue.replace(/\D/g, "");
                                          e.target.value = numericValue;
                                        }}
                                      />
                                      {rentalsFormik.errors &&
                                      rentalsFormik.errors?.residential &&
                                      rentalsFormik.errors.residential[
                                        residentialIndex
                                      ]?.rental_sqft &&
                                      rentalsFormik.touched &&
                                      rentalsFormik.touched?.residential &&
                                      rentalsFormik.touched.residential[
                                        residentialIndex
                                      ]?.rental_sqft ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalsFormik.errors.residential[
                                              residentialIndex
                                            ]?.rental_sqft
                                          }
                                        </div>
                                      ) : null}
                                    </FormGroup>
                                  </Col>
                                  <Col lg="8">
                                    <FormGroup>
                                      <br />
                                      <Row
                                        style={{
                                          display: "flex",
                                          flexDirection: "row",
                                        }}
                                      >
                                        <Col md="4">
                                          <FormGroup>
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-unitadd"
                                            >
                                              Bath
                                            </label>
                                            <Autocomplete
                                              className="form-control-alternative"
                                              id="input-unitadd"
                                              freeSolo
                                              size="small"
                                              options={bathArray.map(
                                                (option) => option
                                              )}
                                              onChange={(event, newValue) => {
                                                rentalsFormik.setFieldValue(
                                                  `residential[${residentialIndex}].rental_bath`,
                                                  newValue
                                                );
                                              }}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  name={`residential[${residentialIndex}].rental_bath`}
                                                  id={`residential[${residentialIndex}].rental_bath`}
                                                  value={
                                                    rentalsFormik.values
                                                      .residential[
                                                      residentialIndex
                                                    ].rental_bath
                                                  }
                                                  onChange={(e) => {
                                                    rentalsFormik.setFieldValue(
                                                      `residential[${residentialIndex}].rental_bath`,
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              )}
                                            />
                                          </FormGroup>
                                        </Col>
                                        <Col md="4">
                                          <FormGroup>
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-unitadd"
                                            >
                                              Bed
                                            </label>

                                            <Autocomplete
                                              className="form-control-alternative"
                                              id="input-unitadd"
                                              freeSolo
                                              size="small"
                                              options={roomsArray.map(
                                                (option) => option
                                              )}
                                              onChange={(event, newValue) => {
                                                rentalsFormik.setFieldValue(
                                                  `residential[${residentialIndex}].rental_bed`,
                                                  newValue
                                                );
                                              }}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  name={`residential[${residentialIndex}].rental_bed`}
                                                  id={`residential[${residentialIndex}].rental_bed`}
                                                  value={
                                                    rentalsFormik.values
                                                      .residential[
                                                      residentialIndex
                                                    ].rental_bed
                                                  }
                                                  onChange={(e) => {
                                                    rentalsFormik.setFieldValue(
                                                      `residential[${residentialIndex}].rental_bed`,
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              )}
                                            />
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                      &nbsp;&nbsp;
                                    </FormGroup>
                                  </Col>

                                  {/* myyphotos */}
                                  <Col lg="5">
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <FormGroup
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <label
                                          className="form-control-label"
                                          htmlFor="input-unitadd"
                                        >
                                          Photo
                                        </label>
                                        <span
                                          onClick={togglePhotoDialog}
                                          style={{
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontFamily: "monospace",
                                            color: "blue",
                                          }}
                                        >
                                          {" "}
                                          <br />
                                          <input
                                            type="file"
                                            className="form-control-file d-none"
                                            accept="image/*"
                                            multiple
                                            id={`propertyres_image_${residentialIndex}`}
                                            name={`propertyres_image_${residentialIndex}`}
                                            onChange={(e) =>
                                              fileData(e, residentialIndex)
                                            }
                                          />
                                          <label
                                            htmlFor={`propertyres_image_${residentialIndex}`}
                                          >
                                            <b style={{ fontSize: "20px" }}>
                                              +
                                            </b>
                                            Add
                                          </label>
                                        </span>
                                      </FormGroup>

                                      <FormGroup
                                        style={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          paddingLeft: "10px",
                                        }}
                                      >
                                        <div
                                          className="mt-3 d-flex"
                                          style={{
                                            justifyContent: "center",
                                            flexWrap: "wrap",
                                          }}
                                        >
                                          {selectedFiles[residentialIndex] &&
                                            selectedFiles[residentialIndex]
                                              .length > 0 &&
                                            selectedFiles[residentialIndex].map(
                                              (unitImg, index) => (
                                                <div
                                                  key={index}
                                                  style={{
                                                    position: "relative",
                                                    width: "100px",
                                                    height: "100px",
                                                    margin: "10px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                  }}
                                                >
                                                  <img
                                                    src={
                                                      unitImg instanceof File
                                                        ? URL.createObjectURL(
                                                            unitImg
                                                          )
                                                        : unitImg
                                                    }
                                                    alt=""
                                                    style={{
                                                      width: "100px",
                                                      height: "100px",
                                                      maxHeight: "100%",
                                                      maxWidth: "100%",
                                                      borderRadius: "10px",
                                                    }}
                                                    onClick={() => {
                                                      // setSelectedImage(unitImg);
                                                      setOpen(true);
                                                    }}
                                                  />
                                                  <ClearIcon
                                                    style={{
                                                      cursor: "pointer",
                                                      alignSelf: "flex-start",
                                                      position: "absolute",
                                                      top: "-12px",
                                                      right: "-12px",
                                                    }}
                                                    onClick={() =>
                                                      clearSelectedPhoto(
                                                        index,
                                                        residentialIndex
                                                      )
                                                    }
                                                  />
                                                </div>
                                              )
                                            )}
                                          {/* <OpenImageDialog
                                            open={open}
                                            setOpen={setOpen}
                                            selectedImage={selectedImage}
                                          /> */}
                                        </div>
                                      </FormGroup>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            )
                          )}
                        <Row>
                          <Col>
                            <Button
                              onClick={addResidentialUnits}
                              style={
                                selectedPropType.is_multiunit
                                  ? { display: "block" }
                                  : { display: "none" }
                              }
                            >
                              Add another unit
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    </div>
                  )}
                  {!rental_id && propType === "Commercial" && (
                    <div className="pl-lg-4">
                      <h6 className="heading-small text-muted mb-4">
                        Commercial Unit
                      </h6>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Enter Commercial Units
                        </label>
                        <br />
                        <br />
                        {rentalsFormik.values &&
                          rentalsFormik.values.commercial.map(
                            (commercialUnit, commercialIndex) => (
                              <div key={commercialIndex}>
                                <Row style={{ position: "relative" }}>
                                  <ClearIcon
                                    style={{
                                      cursor: "pointer",
                                      position: "absolute",
                                      right: "10px",
                                      display: selectedPropType.is_multiunit
                                        ? "block"
                                        : "none",
                                    }}
                                    onClick={() => {
                                      deleteCommercialUnit(commercialIndex);
                                    }}
                                  />

                                  <Col
                                    lg="3"
                                    style={
                                      selectedPropType.is_multiunit
                                        ? { display: "block" }
                                        : { display: "none" }
                                    }
                                  >
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor={`input-unit-${commercialIndex}`}
                                      >
                                        Unit *
                                      </label>
                                      <Input
                                        required
                                        className="form-control-alternative"
                                        id={`input-unit-${commercialIndex}`}
                                        placeholder="102"
                                        type="text"
                                        name={`commercial[${commercialIndex}].rental_unit`}
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalsFormik.setFieldValue(
                                            `commercial[${commercialIndex}].rental_unit`,
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          rentalsFormik.values.commercial[
                                            commercialIndex
                                          ].rental_unit
                                        }
                                      />
                                      {rentalsFormik.errors &&
                                      rentalsFormik.errors?.commercial &&
                                      rentalsFormik.errors.commercial[
                                        commercialIndex
                                      ]?.rental_unit &&
                                      rentalsFormik.touched &&
                                      rentalsFormik.touched?.commercial &&
                                      rentalsFormik.touched.commercial[
                                        commercialIndex
                                      ]?.rental_unit ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalsFormik.errors.commercial[
                                              commercialIndex
                                            ]?.rental_unit
                                          }
                                        </div>
                                      ) : null}
                                    </FormGroup>
                                  </Col>
                                  <Col
                                    lg="4"
                                    style={
                                      selectedPropType.is_multiunit
                                        ? { display: "block" }
                                        : { display: "none" }
                                    }
                                  >
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                      >
                                        Unit Address
                                      </label>
                                      <Input
                                        required
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="A12 Bhaskar Enclave, Phase 2 - 102"
                                        type="text"
                                        name={`commercial[${commercialIndex}].rental_unit_adress`}
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalsFormik.setFieldValue(
                                            `commercial[${commercialIndex}].rental_unit_adress`,
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          rentalsFormik.values.commercial[
                                            commercialIndex
                                          ].rental_unit_adress
                                        }
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="2">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                      >
                                        SQFT *
                                      </label>
                                      <Input
                                        required
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="3000"
                                        type="text"
                                        name={`commercial[${commercialIndex}].rental_sqft`}
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalsFormik.setFieldValue(
                                            `commercial[${commercialIndex}].rental_sqft`,
                                            e.target.value
                                          );
                                        }}
                                        onInput={(e) => {
                                          const inputValue = e.target.value;
                                          const numericValue =
                                            inputValue.replace(/\D/g, "");
                                          e.target.value = numericValue;
                                        }}
                                        value={
                                          rentalsFormik.values.commercial[
                                            commercialIndex
                                          ].rental_sqft
                                        }
                                      />
                                      {rentalsFormik.errors &&
                                      rentalsFormik.errors?.commercial &&
                                      rentalsFormik.errors.commercial[
                                        commercialIndex
                                      ]?.rental_sqft &&
                                      rentalsFormik.touched &&
                                      rentalsFormik.touched?.commercial &&
                                      rentalsFormik.touched.commercial[
                                        commercialIndex
                                      ]?.rental_sqft ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalsFormik.errors.commercial[
                                              commercialIndex
                                            ]?.rental_sqft
                                          }
                                        </div>
                                      ) : null}
                                    </FormGroup>
                                  </Col>

                                  {/* myyphotos */}
                                  <Col lg="5">
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <FormGroup
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <label
                                          className="form-control-label"
                                          htmlFor="input-unitadd"
                                        >
                                          Photo
                                        </label>
                                        <span
                                          onClick={togglePhotoDialog}
                                          style={{
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontFamily: "monospace",
                                            color: "blue",
                                          }}
                                        >
                                          {" "}
                                          <br />
                                          <input
                                            type="file"
                                            className="form-control-file d-none"
                                            accept="image/*"
                                            multiple
                                            id={`property_image${commercialIndex}`}
                                            name={`property_image${commercialIndex}`}
                                            onChange={(e) =>
                                              fileData(e, commercialIndex)
                                            }
                                          />
                                          <label
                                            htmlFor={`property_image${commercialIndex}`}
                                          >
                                            <b style={{ fontSize: "20px" }}>
                                              +
                                            </b>{" "}
                                            Add
                                          </label>
                                        </span>
                                      </FormGroup>
                                      <FormGroup>
                                        <div
                                          className="mt-3 d-flex"
                                          style={{
                                            justifyContent: "center",
                                            flexWrap: "wrap",
                                          }}
                                        >
                                          {selectedFiles[commercialIndex] &&
                                            selectedFiles[commercialIndex]
                                              .length > 0 &&
                                            selectedFiles[commercialIndex].map(
                                              (unitImg, index) => (
                                                <div
                                                  key={index}
                                                  style={{
                                                    position: "relative",
                                                    width: "100px",
                                                    height: "100px",
                                                    margin: "10px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                  }}
                                                >
                                                  <img
                                                    src={
                                                      unitImg instanceof File
                                                        ? URL.createObjectURL(
                                                            unitImg
                                                          )
                                                        : unitImg
                                                    }
                                                    alt=""
                                                    style={{
                                                      width: "100px",
                                                      height: "100px",
                                                      maxHeight: "100%",
                                                      maxWidth: "100%",
                                                      borderRadius: "10px",
                                                    }}
                                                    onClick={() => {
                                                      // setSelectedImage(unitImg);
                                                      setOpen(true);
                                                    }}
                                                  />
                                                  <ClearIcon
                                                    style={{
                                                      cursor: "pointer",
                                                      alignSelf: "flex-start",
                                                      position: "absolute",
                                                      top: "-12px",
                                                      right: "-12px",
                                                    }}
                                                    onClick={() =>
                                                      clearSelectedPhoto(
                                                        index,
                                                        commercialIndex
                                                      )
                                                    }
                                                  />
                                                </div>
                                              )
                                            )}
                                          {/* <OpenImageDialog
                                            open={open}
                                            setOpen={setOpen}
                                            selectedImage={selectedImage}
                                          /> */}
                                        </div>
                                      </FormGroup>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            )
                          )}
                        <Row>
                          <Col>
                            <Button
                              onClick={addCommercialUnit}
                              style={
                                selectedPropType.is_multiunit
                                  ? { display: "block" }
                                  : { display: "none" }
                              }
                            >
                              Add another unit
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    </div>
                  )}
                  <div className="pl-lg-4">
                    {loader ? (
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ background: "green", cursor: "not-allowed" }}
                        disabled
                      >
                        Loading...
                      </button>
                    ) : rental_id ? (
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ background: "green", cursor: "pointer" }}
                        onClick={async (e) => {
                          e.preventDefault();
                          setLoader(true);
                          const res = await editProperty(
                            rentalsFormik.values,
                            rentalOwnerFormik.values,
                            accessType.admin_id,
                            selectedPropType.property_id
                          );
                          setLoader(false);
                          if (res === false) {
                            setLoader(false);
                            navigate("/" + admin + "/propertiesTable");
                          } else {
                            setLoader(false);
                          }
                        }}
                      >
                        Update Property
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ background: "green", cursor: "pointer" }}
                        onClick={(e) => {
                          e.preventDefault();
                          if (selectedRentalOwnerData.length !== 0) {
                            rentalsFormik.handleSubmit();
                          } else {
                            rentalsFormik.handleSubmit();
                            setDisplay(true);
                          }
                        }}
                      >
                        Create Property
                      </button>
                    )}
                    <button
                      href="#pablo"
                      onClick={handleCloseButtonClick}
                      className="btn btn-primary"
                      style={{
                        background: "white",
                        color: "black",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal isOpen={isModalOpen} toggle={closeModal}>
          <ModalHeader toggle={closeModal} className="bg-secondary text-white">
            <strong style={{ fontSize: 18 }}>Add new Properties</strong>
          </ModalHeader>
          <ModalBody>
            <AddpropertyModal
              tenantId={tenantId}
              closeModal={closeModal}
              // getCreditCard={getCreditCard}
            />
          </ModalBody>
        </Modal>

        <Modal isOpen={isMOdalopen1} toggle={closeModal}>
          <ModalHeader toggle={closeModal} className="bg-secondary text-white">
            <strong style={{ fontSize: 18 }}>Add new Staff Member</strong>
          </ModalHeader>
          <ModalBody>
            <StaffMemberModal
              tenantId={tenantId}
              closeModal={closeModal}
              // getCreditCard={getCreditCard}
            />
          </ModalBody>
        </Modal>
        <ToastContainer />
      </Container>
    </>
  );
};

export default Rentals;
