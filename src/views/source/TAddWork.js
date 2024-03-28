import React, { useEffect } from "react";
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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Table,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import TenantHeader from "components/Headers/TenantsHeader";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "universal-cookie";
import ClearIcon from "@mui/icons-material/Clear";
import { OpenImageDialog } from "components/OpenImageDialog";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const TAddWork = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_POST_URL;
  const imageGetUrl = process.env.REACT_APP_IMAGE_GET_URL;
  const [workOrderData, setWorkOrderData] = useState(null);
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  const [propdropdownOpen, setpropdropdownOpen] = useState(false);
  const [categorydropdownOpen, setcategorydropdownOpen] = useState(false);
  const [vendordropdownOpen, setvendordropdownOpen] = useState(false);
  const [entrydropdownOpen, setentrydropdownOpen] = useState(false);
  const [userdropdownOpen, setuserdropdownOpen] = useState(false);
  const [statusdropdownOpen, setstatusdropdownOpen] = useState(false);
  const [unitData, setUnitData] = useState([]);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const toggle11 = () => {
    setUnitDropdownOpen((prevState) => !prevState);
  };
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedProp, setSelectedProp] = useState("Select Property");
  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const [selectedVendor, setSelectedVendor] = useState("Select Vendor");
  const [selectedEntry, setSelectedEntry] = useState("Select");
  const [selecteduser, setSelecteduser] = useState("Select");
  const [selectedStatus, setSelectedStatus] = useState("Select");

  const toggle1 = () => setpropdropdownOpen((prevState) => !prevState);
  const toggle2 = () => setcategorydropdownOpen((prevState) => !prevState);
  const toggle3 = () => setvendordropdownOpen((prevState) => !prevState);
  const toggle4 = () => setentrydropdownOpen((prevState) => !prevState);
  const toggle5 = () => setuserdropdownOpen((prevState) => !prevState);
  const toggle6 = () => setstatusdropdownOpen((prevState) => !prevState);

  const [propertyData, setPropertyData] = useState([]);
  const [staffData, setstaffData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    qty: "",
    account: "",
    description: "",
    price: "",
    total: "",
  });
  const [selectedPriority, setSelectedPriority] = useState("");

  const handlePropertyTypeSelect = async (property) => {
    setSelectedProp(property.rental_adress);
    WorkFormik.values.rental_adress = property.rental_adress;
    WorkFormik.values.rental_id = property.rental_id;

    setSelectedUnit("");
    try {
      const units = await fetchUnitsByProperty(property.rental_id);
      setUnitData(units); // Set the received units in the unitData state
    } catch (error) {
      console.error("Error handling selected property:", error);
    }
  };

  const handleUnitSelect = (selectedUnit, unitId) => {
    setSelectedUnit(selectedUnit);
    WorkFormik.values.rental_units = selectedUnit;
    WorkFormik.setFieldValue("unit_id", unitId);

    // entrySchema.values.unit_id = unitId;
  };

  const handleCategorySelection = (value) => {
    setSelectedCategory(value);
    setcategorydropdownOpen(true);
    if (value === "Other") {
      WorkFormik.values.work_category = "";
    } else {
      WorkFormik.values.work_category = value;
    }
  };

  const handleVendorSelect = (value) => {
    setSelectedVendor(value);
  };

  const handleEntrySelect = (value) => {
    setSelectedEntry(value);
  };

  const handleStaffSelect = (staff) => {
    setSelecteduser(staff);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
  };

  const handlePriorityChange = (event) => {
    setSelectedPriority(event.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    navigate("/tenant/tenantwork");
  };


  // Use URLSearchParams to extract parameters from the query string
  const [getData, setGetData] = useState();
  const [vid, setVid] = useState("");
  const location = useLocation();
  const { search } = location;
  const queryParams = new URLSearchParams(search);
  const id1 = queryParams.get("id");

  const fetchUnitsByProperty = async (propertyType) => {
    try {
      const response = await fetch(
        `${baseUrl}/unit/rental_unit/${propertyType}`
      );
      const data = await response.json();
      const units = data?.data || [];

      return units;
    } catch (error) {
      console.error("Error fetching units:", error);
      return [];
    }
  };
  const [vendorDetails, setVendorDetails] = useState([]);
  const getVendorDetails = async () => {
    if (cookie_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/tenant/tenant_summary/${cookie_id}`
        );
        const entries = response.data.data.entries;

        if (entries.length > 0) {
          setVendorDetails(response.data.data);
          // getRentalData(rentalAddresses, rentalUnits);
        } else {
          console.error("No rental addresses found.");
        }

        setLoader(false);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id1) {
        try {
          const response = await axios.get(
            `${baseUrl}/workorder/findworkorderbyId/${id1}`
          );
          let getWorkData = response.data.data;
          setGetData(getWorkData);
          setVid(getWorkData[0]._id);
          WorkFormik.setValues({
            work_subject: getWorkData[0].work_subject || "",
            rental_adress: getWorkData[0].rental_adress || "",
            rental_unit: getWorkData[0].rental_unit || "",
            unit_no: getWorkData[0].unit_no || "",
            work_category: getWorkData[0].work_category || "",
            entry_allowed: getWorkData[0].entry_allowed || "",
            work_performed: getWorkData[0].work_performed || "",
          });
          setSelectedUnit(getWorkData[0].rental_unit || "Select");
          setSelectedProp(getWorkData[0].rental_adress);
          setSelectedEntry(getWorkData[0].entry_allowed);
          setSelectedCategory(getWorkData[0].work_category);
          setSelectedFiles(getWorkData[0].workOrderImage || []);
        } catch (error) {
          console.log(error, "aaa");
        }
      };
    }
    fetchData();
    getVendorDetails();
  }, [baseUrl, id]);

  console.log(vendorDetails, "vendorDetails");

  const { v4: uuidv4 } = require("uuid");
  const [loader, setLoader] = useState(false);

  //   const handleSubmit = async (values,event) => {
  //     // event.preventDefault(); 
  //     setLoader(true);
  //     let image;

  //     if (selectedFiles) {
  //       const imageData = new FormData();
  //       for (let index = 0; index < selectedFiles.length; index++) {
  //         const element = selectedFiles[index];
  //         imageData.append(`files`, element);
  //       }

  //       const url = `${imageUrl}/images/upload`;
  //       try {
  //         const result = await axios.post(url, imageData, {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         });
  //         image = result.data.files.map((data, index) => {
  //           return data.filename;
  //         });
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }

  //     try {
  //       values["rental_adress"] = selectedProp;
  //       values["rental_units"] = selectedUnit;
  //       values["work_category"] = WorkFormik.values.work_category ? WorkFormik.values.work_category : selectedCategory;
  //       values["vendor"] = selectedVendor;
  //       values["entry_allowed"] = selectedEntry;
  //       values["workOrderImage"] = image;

  //       const workorder_id = uuidv4();
  //       values["workorder_id"] = workorder_id;

  //       const work_subject = values.work_subject;

  //       if (id === undefined) {
  //         const formData = {
  //           ...values,
  //           statusUpdatedBy: vendorDetails.tenant_firstName + " " + vendorDetails.tenant_lastName,
  //         };
  //         const workOrderRes = await axios.post(`${baseUrl}/work-order/work-order`, formData);

  //         if (workOrderRes.status === 200) {
  //           if (workOrderRes.data.statusCode === 200) {
  //             toast.success("Work Order Added Successfully.", {
  //               position: "top-center",
  //               autoClose: 1000,
  //             });
  //             navigate("/tenant/tenantwork");
  //           } else {
  //             console.log(workOrderRes.data, "workOrderRes.data");
  //             toast.error(workOrderRes.data.message, {
  //               position: "top-center",
  //               autoClose: 1000,
  //             });
  //           }
  //         }
  //       } else {
  //         const editUrl = `${baseUrl}/workorder/workorder/${id}`;
  //         const res = await axios.put(editUrl, values);
  //         handleResponse(res);
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //       if (error.response) {
  //         console.error("Response Data:", error.response.data);
  //       }
  //     }

  //     setLoader(false);
  // };

  const handleSubmit = async (values) => {
    // setSubmitting(true); // Set form submitting state to true
    setLoader(true);


    try {
      // Construct form data to be submitted
      const formData = {
        ...values,
        rental_adress: selectedProp,
        rental_unit: selectedUnit,
        work_category: values.work_category || selectedCategory,
        vendor: selectedVendor,
        entry_allowed: selectedEntry === "Yes" ? true : false,
        statusUpdatedBy: `${vendorDetails.tenant_firstName} ${vendorDetails.tenant_lastName}`,
      };

      // Make POST request to save workorder
      const workOrderRes = await axios.post(`${baseUrl}/work-order/work-order`, { workOrder: formData });
      console.log(workOrderRes, "yashu")
      if (workOrderRes.status === 200 && workOrderRes.data.statusCode === 200) {
        toast.success("Work Order Added Successfully.", {
          position: "top-center",
          autoClose: 1000,
        });
        navigate("/tenant/tenantwork");// Navigate to tenantwork page on success
      } else {
        console.error(workOrderRes.data.message);
        toast.error(workOrderRes.data.message, {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }

    setLoader(false);
    // setSubmitting(false); // Set form submitting state to false
  };
  function handleResponse(response) {
    const successMessage = id
      ? "Workorder updated successfully"
      : "Workorder added successfully";
    const errorMessage = response.data.message;

    if (response.data.statusCode === 200) {
      // Show success toast
      toast.success(successMessage, {
        position: "top-center",
        autoClose: 1000,
        onClose: () => navigate("/tenant/tenantwork"),
      });
    } else {
      // Show an error toast
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 1000,
      });
    }
  }

  const WorkFormik = useFormik({
    initialValues: {
      work_subject: getData?.work_subject ? getData.work_subject : "",
      rental_adress: "",
      rental_unit: "",
      work_category: "",
      entry_allowed: "",
      staffmember_name: "",
      work_performed: "",
      workOrderImage: [],
    },

    validationSchema: yup.object({
      // rental_adress: yup.string().required("Required"),
      // rental_units: yup.string().required("Required"),
      // vendor: yup.string().required("Required"),
      // staffmember_name: yup.string().required("Required"),
      work_category: yup.string().required("Required"),
      // status: yup.string().required("Required"),
    }),


    onSubmit: handleSubmit,
  },
  );

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);
  let cookie_id = localStorage.getItem("Tenant ID");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const fetchRentals = () => {
    if (accessType?.tenant_id) {

      axios.get(`${baseUrl}/tenant/tenant_property/${accessType?.tenant_id}`)
        .then((response) => {
          const responseData = response.data.data;
          if (responseData.length > 0) {
            setPropertyData(responseData);
          } else {
            console.log("No data available");
          }

        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [accessType]);

  const fetchStaffMembers = () => {
    fetch(`${baseUrl}/addstaffmember/find_staffmember`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setstaffData(data.data);
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const [selectedImage, setSelectedImage] = useState([]);

  const clearSelectedPhoto = (index, name) => {
    const filteredImage2 = selectedFiles.filter((item, i) => i !== index);
    setSelectedFiles(filteredImage2);
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileData = (e) => {
    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...e.target.files,
    ]);
  };

  const editworkorder = async (vid) => {
    try {
      console.log(baseUrl);
      const response = await axios.put(
        `${baseUrl}/workorder/updateworkorder/${vid}`,
        {
          work_subject: WorkFormik.values.work_subject,
          rental_adress: selectedProp,
          rental_unit: WorkFormik.values.rental_unit,
          work_category: WorkFormik.values.work_category,
          entry_allowed: selectedEntry,
          work_performed: WorkFormik.values.work_performed,
          workOrderImage: WorkFormik.values.workOrderImage,
          statusUpdatedBy:
            vendorDetails.tenant_firstName +
            " " +
            vendorDetails.tenant_lastName,

          // Add other fields as needed
        }
      );
      handleResponse(response);
      console.log("Workorder updated successfully", response.data);
    } catch (error) {
      console.error("Error updating workorder:", error);
    }
  };

  return (
    <>
      <TenantHeader />
      {/* Page content */}
      <Container className="" fluid style={{ marginTop: "3rem", height: "100vh" }}>
        <Row >
          <Col className="order-xl-1" xl="12">
            <Card
              className=" mb-3"
              style={{ borderRadius: "20px", }}
            >
              {/* onSubmit={WorkFormik.handleSubmit} */}
              <Form onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(WorkFormik.values)
              }}>
                <CardHeader className="mx-5 mt-5" style={{
                  backgroundColor: "#152B51",
                  borderRadius: "6px",
                  height: "45px",
                  boxShadow: " 0px 4px 4px 0px #00000040 ",
                  padding: "6px 7px 1px 21px",

                }}>
                  {/* <Row className="align-items-center">
                    <Col xs="8">
                      <span className="" style={{
                        color: "#ffffff",
                        fontFamily: "Poppins",
                        fontWeight: "500",
                        fontSize: "22px",
                      }}>New Work Order</span>
                    </Col>
                  </Row> */}
                  <span className=" align-items-center " style={{
                    color: "#ffffff",
                    fontFamily: "Poppins",
                    fontWeight: "500",
                    fontSize: "22px",
                    // padding:"6px 7px 1px 21px",
                  }}>New Work Order</span>
                </CardHeader >
                <CardBody className="bg-white">
                  <Form>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-member"
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#8A95A8" }}
                            >
                              Subject *
                            </label>
                            <br />
                            <br />
                            <Input
                              style={{
                                boxShadow: " 0px 4px 4px 0px #00000040 ",
                                borderRadius: "6px",

                              }}
                              className="form-control-alternative"
                              id="input-name"
                              placeholder="Add Subject here..."
                              type="text"
                              name="work_subject"
                              //name="nput-staffmember-name"
                              onBlur={WorkFormik.handleBlur}
                              onChange={(e) => {
                                // Update the state or Formik values with the new input value
                                WorkFormik.handleChange(e);
                              }}
                              value={WorkFormik.values.work_subject}
                              required
                            />
                            {/* {WorkFormik.touched.work_subject &&
                          WorkFormik.errors.work_subject ? (
                            <div style={{ color: "red" }}>
                              {WorkFormik.errors.work_subject}
                            </div>
                          ) : null} */}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <label
                              className="form-control-label mt-3"
                              htmlFor="input-unitadd"
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#8A95A8" }}

                            >
                              Photo
                            </label>
                            <span
                              style={{
                                cursor: "pointer",
                                fontSize: "14px",
                                fontFamily: "monospace",
                                color: "blue",
                              }}
                            >
                              <br />
                              <input
                                type="file"
                                className="form-control-file d-none"
                                accept="image/*"
                                multiple
                                id={`workOrderImage`}
                                name={`workOrderImage`}
                                onChange={(e) => fileData(e)}
                              />
                              <label htmlFor={`workOrderImage`}

                                style={{
                                  fontFamily: "Poppins", fontSize: "14px", fontWeight: "400", color: "white", backgroundColor: "#152B51", borderRadius: "6px", padding: "15px",
                                  boxShadow: " 0px 4px 4px 0px #00000040",

                                }}

                              >
                                {/* <b style={{ fontSize: "20px" }}>+</b> Add */}
                                Upload here...
                              </label>
                            </span>
                          </FormGroup>
                        </Col>
                      </Row>
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
                          <div className="d-flex">
                            {selectedFiles &&
                              selectedFiles.length > 0 &&
                              selectedFiles.map((unitImg, index) => (
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
                                      typeof unitImg === "string"
                                        ? `${imageGetUrl}/${unitImg}`
                                        : URL.createObjectURL(unitImg)
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
                                      setSelectedImage(unitImg);
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
                                    onClick={() => clearSelectedPhoto(index)}
                                  />
                                </div>
                              ))}
                          </div>
                          {open && (
                            <OpenImageDialog
                              open={open}
                              setOpen={setOpen}
                              selectedImage={selectedImage}
                            />
                          )}
                        </div>
                      </FormGroup>
                      <br />
                    </div>

                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-desg"
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#8A95A8" }}

                            >
                              Property *
                            </label>
                            <br />
                            <br />
                            <FormGroup>
                              <Dropdown

                                isOpen={propdropdownOpen}
                                toggle={toggle1}
                              >
                                <DropdownToggle caret style={{
                                  width: "100%", boxShadow: " 0px 4px 4px 0px #00000040",
                                  border: "1px solid #ced4da",

                                  backgroundColor: "transparent",
                                  color: "#A7A7A7"
                                }}>
                                  {selectedProp
                                    ? selectedProp
                                    : "Select a property..."}{" "}
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                </DropdownToggle>
                                <DropdownMenu
                                  style={{
                                    width: "100%",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                  }}
                                >
                                  {/* Check if propertyData is not empty */}
                                  {/* {propertyData.length > 0 ? (
                                    propertyData.map((address, index) => (
                                      <DropdownItem
                                        key={index}
                                        onClick={() => handlePropertyTypeSelect(address)}
                                      >
                                        {address}
                                      </DropdownItem>
                                    ))
                                  ) : (
                                    <p>No data available</p>
                                  )} */}
                                  {console.log(propertyData, "yash")}
                                  {propertyData.map((property, index) => (
                                    <DropdownItem
                                      key={index}
                                      onClick={() => handlePropertyTypeSelect(property)}
                                    >
                                      {property.rental_adress}
                                    </DropdownItem>
                                  ))}
                                </DropdownMenu>



                                {WorkFormik.errors &&
                                  WorkFormik.errors?.rental_adress &&
                                  WorkFormik.touched &&
                                  WorkFormik.touched?.rental_adress &&
                                  WorkFormik.values.rental_adress === "" ? (
                                  <div style={{ color: "red" }}>
                                    {WorkFormik.errors.rental_adress}
                                  </div>
                                ) : null}
                              </Dropdown>
                            </FormGroup>
                          </FormGroup>
                        </Col>

                        <Col lg="4">
                          {selectedProp &&
                            unitData &&
                            unitData[0] &&
                            unitData[0].rental_unit && (
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-unit"
                                >
                                  Unit *
                                </label>
                                <br />
                                <br />
                                <FormGroup>
                                  <Dropdown
                                    isOpen={unitDropdownOpen}
                                    toggle={toggle11}
                                  >
                                    <DropdownToggle caret>
                                      {selectedUnit
                                        ? selectedUnit
                                        : "Select Unit"}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      {unitData.length > 0 ? (
                                        unitData.map((unit) => (
                                          <DropdownItem
                                            key={unit._id}
                                            onClick={() =>
                                              handleUnitSelect(
                                                unit.rental_unit,
                                                unit.unit_id
                                              )
                                            }
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
                                    {WorkFormik.errors &&
                                      WorkFormik.errors?.rental_unit &&
                                      WorkFormik.touched &&
                                      WorkFormik.touched?.rental_unit &&
                                      WorkFormik.values.rental_unit === "" ? (
                                      <div style={{ color: "red" }}>
                                        {WorkFormik.errors.rental_unit}
                                      </div>
                                    ) : null}
                                  </Dropdown>
                                </FormGroup>
                              </FormGroup>
                            )}
                        </Col>
                      </Row>
                      <br />
                    </div>

                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-desg"
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#8A95A8" }}

                            >
                              Category
                            </label>
                            <br />
                            <br />
                            <Dropdown
                              isOpen={categorydropdownOpen}
                              toggle={toggle2}
                            >
                              <DropdownToggle caret style={{
                                width: "100%", boxShadow: " 0px 4px 4px 0px #00000040",
                                border: "1px solid #ced4da",

                                backgroundColor: "transparent",
                                color: "#A7A7A7"
                              }}>
                                {selectedCategory} &nbsp;&nbsp;&nbsp;&nbsp;
                              </DropdownToggle>
                              <DropdownMenu style={{ width: "100%" }}>
                                <DropdownItem
                                  onClick={() =>
                                    handleCategorySelection("Complaint")
                                  }
                                >
                                  Complaint
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() =>
                                    handleCategorySelection(
                                      "Contribution Request"
                                    )
                                  }
                                >
                                  Contribution Request
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() =>
                                    handleCategorySelection("Feedback/Suggestion")
                                  }
                                >
                                  Feedback/Suggestion
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() =>
                                    handleCategorySelection("General Inquiry")
                                  }
                                >
                                  General Inquiry
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() =>
                                    handleCategorySelection("Maintenance Request")
                                  }
                                >
                                  Maintenance Request
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => handleCategorySelection("Other")}
                                >
                                  Other
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </FormGroup>
                        </Col>
                        <Col
                          lg="3"
                          style={
                            selectedCategory === "Other"
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-member"
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#8A95A8" }}

                            >
                              Other Category
                            </label>
                            <br />
                            <br />
                            <Input
                              className="form-control-alternative"
                              id="input-work-subject"
                              placeholder="Enter Other Category"
                              type="text"
                              name="work_category"
                              //name="nput-staffmember-name"
                              onBlur={WorkFormik.handleBlur}
                              onChange={(e) => {
                                // Update the state or Formik values with the new input value
                                // WorkFormik.handleChange(e);
                                WorkFormik.setFieldValue(
                                  "work_category",
                                  e.target.value
                                );
                              }}
                              value={WorkFormik.values.work_category}
                            // required
                            />
                            {/* {WorkFormik.touched.work_subject &&
                          WorkFormik.errors.work_subject ? (
                            <div style={{ color: "red" }}>
                              {WorkFormik.errors.work_subject}
                            </div>
                          ) : null} */}
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label mt-3"
                              htmlFor="input-desg"
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#8A95A8" }}

                            >
                              Entry Allowed
                            </label>
                            <br />
                            <br />
                            <Dropdown isOpen={entrydropdownOpen} toggle={toggle4}>
                              <DropdownToggle caret style={{
                                width: "100%", boxShadow: " 0px 4px 4px 0px #00000040",
                                border: "1px solid #ced4da",
                                backgroundColor: "transparent",
                                color: "#A7A7A7"
                              }}>
                                {selectedEntry} &nbsp;&nbsp;&nbsp;&nbsp;
                              </DropdownToggle>
                              <DropdownMenu style={{ width: "100%" }}>
                                <DropdownItem
                                  onClick={() => handleEntrySelect("Yes")}
                                >
                                  Yes
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => handleEntrySelect("No")}
                                >
                                  No
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </FormGroup>
                        </Col>
                      </Row>
                      <br />
                    </div>

                    {/* <div className="pl-lg-4">
                        <Row>
                            <Col lg="6">
                                    <FormGroup>
                                        <label
                                        className="form-control-label"
                                        htmlFor="input-desg"
                                        >
                                        Vendor *
                                        </label><br/><br/>
                                        <Dropdown isOpen={vendordropdownOpen} toggle={toggle3}>
                                        <DropdownToggle caret style={{ width: '100%'}}>{selectedVendor} &nbsp;&nbsp;&nbsp;&nbsp;</DropdownToggle>
                                        <DropdownMenu style={{ width: '100%'}}>
                                            <DropdownItem onClick={() => handleVendorSelect("302 properties")}>302 properties</DropdownItem>
                                            <DropdownItem onClick={() => handleVendorSelect("Other")}>Other</DropdownItem>   
                                        </DropdownMenu>
                                    </Dropdown>
                                          
                                    </FormGroup>
                                </Col>
                        </Row>
                        <br/>
                        </div> */}

                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-member"
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#8A95A8" }}

                            >
                              Work To Be Performed
                            </label>
                            <br />
                            <br />
                            <Input
                              className="form-control-alternative"
                              style={{ boxShadow: " 0px 4px 4px 0px #00000040 " }}
                              id="input-name"
                              placeholder="Enter here..."
                              type="textarea"
                              name="work_performed"
                              //name="nput-staffmember-name"
                              onBlur={WorkFormik.handleBlur}
                              onChange={(e) => {
                                // Update the state or Formik values with the new input value
                                WorkFormik.handleChange(e);
                              }}
                              value={WorkFormik.values.work_performed}
                            />
                            {WorkFormik.touched.work_performed &&
                              WorkFormik.errors.work_performed ? (
                              <div style={{ color: "red" }}>
                                {WorkFormik.errors.work_performed}
                              </div>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <br />
                    </div>

                    {/* <div className="pl-lg-4">
                            <Row>
                                <Col lg="3">
                                    <FormGroup>
                                        <label
                                        className="form-control-label"
                                        htmlFor="input-desg"
                                        >
                                        Status 
                                        </label><br/><br/>
                                        <FormGroup>
                                            <Dropdown isOpen={statusdropdownOpen} toggle={toggle6}>
                                                <DropdownToggle caret>
                                                {selectedStatus ? selectedStatus : 'Select'}&nbsp;&nbsp;&nbsp;&nbsp;
                                                </DropdownToggle>
                                                <DropdownMenu style={{
                                                    width: "100%",
                                                    maxHeight: "200px",
                                                    overflowY: "auto",
                                                }}>
                                                <DropdownItem onClick={() => handleStatusSelect("Yes")}>New</DropdownItem>
                                                <DropdownItem onClick={() => handleStatusSelect("No")}>In Progress</DropdownItem>
                                                <DropdownItem onClick={() => handleStatusSelect("Yes")}>On Hold</DropdownItem>
                                                <DropdownItem onClick={() => handleStatusSelect("Yes")}>Complete</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                            </FormGroup>
                                          
                                    </FormGroup>
                                </Col>
                                <Col lg="3">
                                    <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                    >
                                        Due Date 
                                    </label><br/><br/>
                                    <Input
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        type="date"
                                        name="start_date"
                                        onBlur={WorkFormik.handleBlur}
                                        onChange={WorkFormik.handleChange}
                                        value={WorkFormik.values.start_date}
                                    />
                                    {WorkFormik.touched.start_date &&
                                    WorkFormik.errors.start_date ? (
                                        <div style={{ color: "red" }}>
                                        {WorkFormik.errors.start_date}
                                        </div>
                                    ) : null}
                                    </FormGroup>
                                </Col>
                        </Row>
                      
                        <br/>
                        </div> */}
                    {id1 ? (
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ backgroundColor: "#152B51", cursor: "pointer" }}
                        onSubmit={(e) => {
                          e.preventDefault();
                          editworkorder(vid);
                        }}
                      >
                        Update Lease
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary ml-4"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit(WorkFormik.values);
                        }}
                        style={{ backgroundColor: "#152B51" }}
                      >
                        Add Work Order
                      </button>
                    )}
                    <button
                      // color="#152B51"
                      //  href="#rms"
                      className="btn "
                      onClick={handleCloseButtonClick}
                      size="sm"
                      style={{ background: "white", color: "#152B51" }}
                    >
                      Cancel
                    </button>
                  </Form>
                  <br />
                </CardBody>
              </Form>
            </Card>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
};

export default TAddWork;
