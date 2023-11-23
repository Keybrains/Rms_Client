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
import { useNavigate, useParams } from "react-router-dom";

const TAddWork = () => {
  const [workOrderData, setWorkOrderData] = useState(null);
  const { id } = useParams();

  let cookies = new Cookies();
  let cookie_id = cookies.get("Tenant ID");
  console.log(cookie_id, "cookie_id");

  const [open, setOpen] = React.useState(false);

  const [propdropdownOpen, setpropdropdownOpen] = React.useState(false);
  const [categorydropdownOpen, setcategorydropdownOpen] = React.useState(false);
  const [vendordropdownOpen, setvendordropdownOpen] = React.useState(false);
  const [entrydropdownOpen, setentrydropdownOpen] = React.useState(false);
  const [userdropdownOpen, setuserdropdownOpen] = React.useState(false);
  const [statusdropdownOpen, setstatusdropdownOpen] = React.useState(false);

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

  const handlePropertySelect = (property) => {
    setSelectedProp(property);
  };

  const handleCategorySelection = (value) => {
    setSelectedCategory(value);
    setcategorydropdownOpen(true);
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

  // React.useEffect(() => {
  //   if (id) {
  //     axios
  //       .get(`https://propertymanager.cloudpress.host/api/workorder/workorder_summary/${id}`)
  //       .then((response) => {
  //         const vendorData = response.data.data;
  //         setWorkOrderData(workOrderData);
  //         console.log(vendorData);

  //         const formattedDueDate = vendorData.due_date
  //           ? new Date(vendorData.due_date).toISOString().split("T")[0]
  //           : "";
  //         setSelectedProp(vendorData.rental_adress || "Select");
  //         setSelectedCategory(vendorData.work_category || "Select");
  //         setSelectedVendor(vendorData.vendor || "Select");
  //         setSelectedEntry(vendorData.entry_allowed || "Select");
  //         setSelecteduser(vendorData.staffmember_name || "Select");
  //         setSelectedStatus(vendorData.status);
  //         setSelectedPriority(vendorData.priority || "Select");

  //         WorkFormik.setValues({
  //           work_subject: vendorData.work_subject || "",
  //           unit_no: vendorData.unit_no || "",
  //           invoice_number: vendorData.invoice_number || "",
  //           work_charge: vendorData.work_charge || "",
  //           detail: vendorData.detail || "",
  //           entry_contact: vendorData.entry_contact || "",
  //           work_performed: vendorData.work_performed || "",
  //           vendor_note: vendorData.vendor_note || "",
  //           due_date: formattedDueDate,
  //         });
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching vendor data:", error);
  //       });
  //   }
  // }, [id]);

  const { v4: uuidv4 } = require("uuid");

  const handleSubmit = async (values) => {
    console.log(values, "values");
    try {
      values["rental_adress"] = selectedProp;
      values["work_category"] = selectedCategory;
      values["vendor"] = selectedVendor;
      values["entry_allowed"] = selectedEntry;

      const workorder_id = uuidv4();
      values["workorder_id"] = workorder_id;

      const work_subject = values.work_subject;

      if (id === undefined) {
        // Create the work order
        const workOrderRes = await axios.post(
          "https://propertymanager.cloudpress.host/api/workorder/workorder",
          values
        );

        // Check if the work order was created successfully
        if (workOrderRes.status === 200) {
          console.log(workOrderRes.data, "fjalkjflsk");
          // Use the work order data from the response to create the notification
          const notificationRes = await axios.post(
            "https://propertymanager.cloudpress.host/api/notification/notification/tenant",
            {
              workorder: {
                vendor_name: selectedVendor,
                staffmember_name: selecteduser,
                rental_adress: selectedProp,
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
        const editUrl = `https://propertymanager.cloudpress.host/api/workorder/workorder/${id}`;
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
      work_subject: "",
      rental_adress: "",
      unit_no: "",
      work_category: "",
      entry_allowed: "",
      staffmember_name: "",
      work_performed: "",
    },

    onSubmit: (values) => {
      handleSubmit(values);
      console.log(values, "values");
    },
  });

  // let cookies = new Cookies();
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

  React.useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch(
      `https://propertymanager.cloudpress.host/api/tenant/rental-address/${cookie_id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPropertyData(data.rentalAddresses); // Correct the property data source
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [cookie_id]);

  React.useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch(
      "https://propertymanager.cloudpress.host/api/addstaffmember/find_staffmember"
    )
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
                          />
                          {WorkFormik.touched.work_subject &&
                          WorkFormik.errors.work_subject ? (
                            <div style={{ color: "red" }}>
                              {WorkFormik.errors.work_subject}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
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
                            Property
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
                                <div>
                                  {propertyData.map((property) => (
                                    <DropdownItem
                                      key={property}
                                      onClick={() =>
                                        handlePropertySelect(property)
                                      }
                                    >
                                      {property}
                                    </DropdownItem>
                                  ))}
                                </div>
                              </DropdownMenu>
                            </Dropdown>
                          </FormGroup>
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Unit
                          </label>
                          <br />
                          <br />
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            placeholder="Flat Number"
                            type="text"
                            name="unit_no"
                            //name="nput-staffmember-name"
                            onBlur={WorkFormik.handleBlur}
                            onChange={(e) => {
                              // Update the state or Formik values with the new input value
                              WorkFormik.handleChange(e);
                            }}
                            value={WorkFormik.values.unit_no}
                          />
                          {WorkFormik.touched.unit_no &&
                          WorkFormik.errors.unit_no ? (
                            <div style={{ color: "red" }}>
                              {WorkFormik.errors.unit_no}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
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
                          {WorkFormik.touched.agent_email &&
                          WorkFormik.errors.agent_email ? (
                            <div style={{ color: "red" }}>
                              {WorkFormik.errors.agent_email}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
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
                  <button
                    type="submit"
                    className="btn btn-primary ml-4"
                    style={{ background: "green" }}
                  >
                    Add Work Order
                  </button>
                  <button
                    color="primary"
                    href="#rms"
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
      </Container>
    </>
  );
};

export default TAddWork;
