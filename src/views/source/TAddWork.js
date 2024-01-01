import React from "react";
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

import { useState } from "react";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import TenantHeader from "components/Headers/TenantsHeader";
import swal from "sweetalert";
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
  const [workOrderData, setWorkOrderData] = useState(null);
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);

  const [propdropdownOpen, setpropdropdownOpen] = React.useState(false);
  const [categorydropdownOpen, setcategorydropdownOpen] = React.useState(false);
  const [vendordropdownOpen, setvendordropdownOpen] = React.useState(false);
  const [entrydropdownOpen, setentrydropdownOpen] = React.useState(false);
  const [userdropdownOpen, setuserdropdownOpen] = React.useState(false);
  const [statusdropdownOpen, setstatusdropdownOpen] = React.useState(false);
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
    setSelectedProp(property);
    WorkFormik.values.rental_adress = property;

    setSelectedUnit(""); // Reset selected unit when a new property is selected
    try {
      const units = await fetchUnitsByProperty(property);
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
    }
    else {
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
    navigate("../tenantwork");
  };

  // Use URLSearchParams to extract parameters from the query string
  var [getData, setGetData] = useState()
  const [vid, setVid] = useState('')
  const location = useLocation();
  const { search } = location;
  const queryParams = new URLSearchParams(search);
  const id1 = queryParams.get("id");
  console.log("workorder_id", id1);
  var [getData, setGetData] = useState();

  const fetchUnitsByProperty = async (propertyType) => {
    try {
      const response = await fetch(
        `${baseUrl}/propertyunit/rentals_property/${propertyType}`
      );
      const data = await response.json();
      // Ensure that units are extracted correctly and set as an array
      const units = data?.data || [];

      console.log(data, "units246");
      return units;
    } catch (error) {
      console.error("Error fetching units:", error);
      return [];
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/workorder/findworkorderbyId/${id1}`
        );
        let getWorkData = response.data.data;
        setGetData(getWorkData);
        setVid(getWorkData[0]._id)
        console.log("empty", response.data.data);
        WorkFormik.setValues({
          work_subject: getWorkData[0].work_subject || "",
          rental_adress: getWorkData[0].rental_adress || "",
          rental_units: getWorkData[0].rental_units || "",
          unit_no: getWorkData[0].unit_no || "",
          work_category: getWorkData[0].work_category || "",
          entry_allowed: getWorkData[0].entry_allowed || "",
          work_performed: getWorkData[0].work_performed || "",

        });
        setSelectedUnit(getWorkData[0].rental_units || "Select");
        setSelectedProp(getWorkData[0].rental_adress);
        setSelectedEntry(getWorkData[0].entry_allowed);
        setSelectedCategory(getWorkData[0].work_category);
        setWorkOrderImage(getWorkData[0].workOrderImage || []);
      } catch (error) {
        console.log(error, "aaa");
      }
    };
    fetchData();
  }, [baseUrl, id]);

  const { v4: uuidv4 } = require("uuid");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (values) => {
    setLoader(true);
    var image;
    const imageData = new FormData();
    for (let index = 0; index < selectedFiles.length; index++) {
      const element = selectedFiles[index];
      imageData.append(`files`, element);
    }

    const url = `${baseUrl}/images/upload`; // Use the correct endpoint for multiple files upload
    try {
      const result = await axios.post(url, imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      image = {
        prop_image: result.data.files.map((data, index) => {
          return data.url;
        }),
      };
      console.log(image, "imgs");
    }
    catch (error) {
      console.error(error);
    }
    try {
      values["rental_adress"] = selectedProp;
      values["rental_units"] = selectedUnit;
      values["work_category"] = WorkFormik.values.work_category ? WorkFormik.values.work_category : selectedCategory;
      values["vendor"] = selectedVendor;
      values["entry_allowed"] = selectedEntry;
      values["workOrderImage"] = image.prop_image;

      const workorder_id = uuidv4();
      values["workorder_id"] = workorder_id;

      const work_subject = values.work_subject;

      if (id === undefined) {
        // Create the work order
        const workOrderRes = await axios.post(
          `${baseUrl}/workorder/workorder`,
          values
        );

        // Check if the work order was created successfully
        if (workOrderRes.status === 200) {
          //console.log(workOrderRes.data, "fjalkjflsk");
          // Use the work order data from the response to create the notification
          const notificationRes = await axios.post(
            `${baseUrl}/notification/notification/tenant`,
            {
              workorder: {
                vendor_name: selectedVendor,
                staffmember_name: selecteduser,
                rental_adress: selectedProp,
                rental_units: selectedUnit,
                work_subject: work_subject,
                workorder_id: workorder_id,
              },
              notification: {},
            }
          );

          // Handle the notification response if needed
          handleResponse(workOrderRes, notificationRes);
        } else {
          // Handle the error and display an error message to the user if necessary.
          console.error("Work Order Error:", workOrderRes.data);
        }
      } else {
        const editUrl = `${baseUrl}/workorder/workorder/${id}`;
        const res = await axios.put(editUrl, values);
        handleResponse(res);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  };

  function handleResponse(response) {
    if (response.status === 200) {
      navigate("/tenant/tenantwork");
      swal(
        "Success!",
        id ? "Workorder updated successfully" : "Workorder added successfully!",
        "success"
      );
    } else {
      alert(response.data.message);
    }
  }

  const WorkFormik = useFormik({
    initialValues: {
      work_subject: getData?.work_subject ? getData.work_subject : "",
      rental_adress: "",
      rental_units: "",
      work_category: "",
      entry_allowed: "",
      staffmember_name: "",
      work_performed: "",
      workOrderImage: [],
    },

    validationSchema: yup.object({
      rental_adress: yup.string().required("Required"),
      // rental_units: yup.string().required("Required"),
      // vendor: yup.string().required("Required"),
      // staffmember_name: yup.string().required("Required"),
      work_category: yup.string().required("Required"),
      // status: yup.string().required("Required"),
    }),

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);
  let cookie_id = localStorage.getItem("Tenant ID");

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  React.useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch(`${baseUrl}/tenant/rental-address/${cookie_id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const uniqueAddresses = [...new Set(data.rentalAddresses.map(item => item[0].rental_adress))];
        setPropertyData(uniqueAddresses);
        setUnitData(data.rentalUnits);
        console.log(data, "mansi")// Correct the property data source
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [cookie_id]);

  React.useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
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
  }, []);

  const [workOrderImage, setWorkOrderImage] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const clearSelectedPhoto = (index, name) => {
    if (name === "propertyres_image") {
      const filteredImage = workOrderImage.filter((item, i) => i !== index);
      const filteredImage2 = selectedFiles.filter((item, i) => i !== index);
      setSelectedFiles(filteredImage2);
      setWorkOrderImage(filteredImage);
    }
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileData = (e, type) => {
    // Use the correct state-setting function for setSelectedFiles
    setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...e.target.files]);

    const newFiles = [
      ...workOrderImage,
      ...Array.from(e.target.files).map((file) => URL.createObjectURL(file)),
    ];

    // Update the state with the new files
    setWorkOrderImage(newFiles);
  };

  const editworkorder = async (vid) => {
    try {
      console.log(baseUrl)
      const response = await axios.put(`${baseUrl}/workorder/updateworkorder/${vid}`, {
        // work_subject: response.data.data[0].work_subject,
        // rental_adress: selectedProp,
        // work_performed: response.data.data[0].work_performed ,
        // entry_allowed: selectedEntry,
        // work_category: selectedCategory,
        work_subject: WorkFormik.values.work_subject,
        rental_adress: selectedProp,
        rental_units: WorkFormik.values.rental_units,
        work_category: WorkFormik.values.work_category,
        entry_allowed: selectedEntry,
        work_performed: WorkFormik.values.work_performed,
        workOrderImage: WorkFormik.values.workOrderImage,
        statusUpdatedBy: accessType.userName,

        // Add other fields as needed
      });
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
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card
              className="bg-secondary shadow"
              onSubmit={WorkFormik.handleSubmit}
            >
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">New Work Order</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-member"
                          >
                            Subject *
                          </label>
                          <br />
                          <br />
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            placeholder="Add Subject"
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
                      <Col >
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
                            // onClick={workOrderDialog}
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
                              id={`workOrderImage`}
                              name={`workOrderImage`}
                              onChange={(e) => fileData(e)}
                            />

                            <label
                              htmlFor={`workOrderImage`}
                            >
                              <b style={{ fontSize: "20px" }}>
                                +
                              </b>{" "}
                              Add
                            </label>
                            {/* <b style={{ fontSize: "20px" }}>+</b> Add */}
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
                          {workOrderImage &&
                            workOrderImage.length > 0 &&
                            workOrderImage.map((unitImg, index) => (
                              <div
                                key={index}  // Use a unique identifier, such as index or image URL
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
                                  src={unitImg}
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
                                  onClick={() => clearSelectedPhoto(index, "propertyres_image")}
                                />
                              </div>
                            ))}
                          <OpenImageDialog
                            open={open}
                            setOpen={setOpen}
                            selectedImage={selectedImage}
                          />
                        </div>
                        <OpenImageDialog
                          open={open}
                          setOpen={setOpen}
                          selectedImage={selectedImage}
                        />
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
                              <DropdownToggle caret style={{ width: "100%" }}>
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
                                {propertyData.length > 0 ? (
                                  <div style={{ color: 'blue' }}>
                                    {
                                      propertyData.map((property, index) => (
                                        <DropdownItem
                                          key={index}
                                          onClick={() => handlePropertyTypeSelect(property)}
                                        >
                                          {property}
                                        </DropdownItem>
                                      ))
                                    }
                                  </div>
                                ) : (
                                  <p>No data available</p>
                                )}
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
                          unitData[0].rental_units && (
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
                                              unit.rental_units,
                                              unit._id
                                            )
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
                                  {WorkFormik.errors &&
                                    WorkFormik.errors?.rental_units &&
                                    WorkFormik.touched &&
                                    WorkFormik.touched?.rental_units &&
                                    WorkFormik.values.rental_units === "" ? (
                                    <div style={{ color: "red" }}>
                                      {WorkFormik.errors.rental_units}
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
                          >
                            Category
                          </label>
                          <br />
                          <br />
                          <Dropdown
                            isOpen={categorydropdownOpen}
                            toggle={toggle2}
                          >
                            <DropdownToggle caret style={{ width: "100%" }}>
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
                      <Col lg="3"
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
                                "work_category", e.target.value
                              )
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
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Entry Allowed
                          </label>
                          <br />
                          <br />
                          <Dropdown isOpen={entrydropdownOpen} toggle={toggle4}>
                            <DropdownToggle caret style={{ width: "100%" }}>
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
                          >
                            Work To Be Performed
                          </label>
                          <br />
                          <br />
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            placeholder=""
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
                      style={{ background: "green", cursor: "pointer" }}
                      onClick={(e) => {
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
                      style={{ background: "green" }}
                    >
                      Add Work Order
                    </button>)}
                  <button
                    color="primary"
                    //  href="#rms"
                    className="btn btn-primary"
                    onClick={handleCloseButtonClick}
                    size="sm"
                    style={{ background: "white", color: "black" }}
                  >
                    Cancel
                  </button>
                </Form>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container >
    </>
  );
};

export default TAddWork;
