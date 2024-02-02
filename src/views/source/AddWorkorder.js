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
import * as yup from "yup";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import AddWorkorderHeader from "components/Headers/AddWorkorderHeader";
import ClearIcon from "@mui/icons-material/Clear";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import { OpenImageDialog } from "components/OpenImageDialog";

const AddWorkorder = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_URL;
  const { id, admin } = useParams();
  const { rental_id } = useParams();
  const [propdropdownOpen, setpropdropdownOpen] = React.useState(false);
  const [categorydropdownOpen, setcategorydropdownOpen] = React.useState(false);
  const [vendordropdownOpen, setvendordropdownOpen] = React.useState(false);
  const [chargedropdownOpen, setchargedropdownOpen] = React.useState(false);
  const [tenantdownOpen, settenantdownOpen] = React.useState(false);
  const [entrydropdownOpen, setentrydropdownOpen] = React.useState(false);
  const [userdropdownOpen, setuserdropdownOpen] = React.useState(false);
  const [statusdropdownOpen, setstatusdropdownOpen] = React.useState(false);

  const [selectedProp, setSelectedProp] = useState("Select");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Select");
  const [selectedVendor, setSelectedVendor] = useState("Select");
  const [selectedCharge, setSelectedCharge] = useState("Select");
  const [selectedTenant, setSelectedTenant] = useState("Select");
  const [selectedTenantData, setSelectedTenantData] = useState({});
  const [selectedEntry, setSelectedEntry] = useState("Select");
  const [selecteduser, setSelecteduser] = useState("Select");
  const [selectedStatus, setSelectedStatus] = useState("Select");
  const [unitData, setUnitData] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState("");

  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const toggle11 = () => {
    setUnitDropdownOpen((prevState) => !prevState);
  };

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
      // console.log(jwt,'accessType');
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleAccountSelection = (value, index) => {
    const updatedEntries = [...WorkFormik.values.entries];
    if (updatedEntries[index]) {
      updatedEntries[index].account_type = value;
      WorkFormik.setValues({
        ...WorkFormik.values,
        entries: updatedEntries,
      });
    } else {
      console.error(`Entry at index ${index} is undefined.`);
    }
  };

  const toggle1 = () => setpropdropdownOpen((prevState) => !prevState);
  const toggle2 = () => setcategorydropdownOpen((prevState) => !prevState);
  const toggle3 = () => setvendordropdownOpen((prevState) => !prevState);
  const toggle4 = () => setentrydropdownOpen((prevState) => !prevState);
  const toggle5 = () => setuserdropdownOpen((prevState) => !prevState);
  const toggle6 = () => setstatusdropdownOpen((prevState) => !prevState);
  const toggle7 = () => setchargedropdownOpen((prevState) => !prevState);
  const toggle8 = () => settenantdownOpen((prevState) => !prevState);

  const [propertyData, setPropertyData] = useState([]);
  const [staffData, setstaffData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    part_qty: "",
    account_type: "",
    description: "",
    part_price: "",
    total_amount: "",
  });
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [allVendors, setAllVendors] = useState([]);
  const [workOrderImage, setWorkOrderImage] = useState([]);

  const fetchUnitsByProperty = async (propertyType) => {
    try {
      console.log(propertyType, "propertyType");
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

  const handlePropertyTypeSelect = async (property) => {
    setSelectedProp(property.rental_adress);
    WorkFormik.values.rental_adress = property.rental_adress;
    WorkFormik.values.rental_id = property._id;
    setSelectedUnit("");
    try {
      const units = await fetchUnitsByProperty(property.rental_adress);
      setUnitData(units);
    } catch (error) {
      console.error("Error handling selected property:", error);
    }
  };

  const handleUnitSelect = (selectedUnit, unitId) => {
    setSelectedUnit(selectedUnit);
    WorkFormik.values.rental_units = selectedUnit;
    console.log(selectedUnit, "selectedUnit");
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
    WorkFormik.values.vendor = value;
  };

  const handleEntrySelect = (value) => {
    setSelectedEntry(value);
  };

  const handleChargeSelect = (value) => {
    setSelectedCharge(value);
  };

  const handleStaffSelect = (staff) => {
    setSelecteduser(staff);
    WorkFormik.values.staffmember_name = staff;
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    WorkFormik.values.status = status;
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
    navigate("../Workorder");
  };

  const handleAddRow = () => {
    const newEntry = {
      part_qty: "",
      account_type: "",
      description: "",
      part_price: "",
      total_amount: "",
      dropdownOpen: false,
    };
    if (WorkFormik.values.entries) {
      WorkFormik.setValues({
        ...WorkFormik.values,
        entries: [...WorkFormik.values.entries, newEntry],
      });
    }
  };

  const handleRemoveRow = (index) => {
    const updatedEntries = [...WorkFormik.values.entries];
    updatedEntries.splice(index, 1); // Remove the entry at the specified index
    WorkFormik.setValues({
      ...WorkFormik.values,
      entries: updatedEntries,
    });
  };

  const toggleDropdown = (index) => {
    const updatedEntries = [...WorkFormik.values.entries];
    updatedEntries[index].dropdownOpen = !updatedEntries[index].dropdownOpen;
    WorkFormik.setValues({
      ...WorkFormik.values,
      entries: updatedEntries,
    });
  };

  const setVendorsName = () => {
    axios
      .get(`${baseUrl}/vendor/vendor_name`)
      .then((res) => {
        // console.log(res, "res of all vendors");
        // console.log(res.data.data, "ressssssss");
        const names = res.data.data.map((item) => {
          return item.vendor_name;
        });
        setAllVendors(names);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [workOrderData, setWorkOrderData] = useState(null);
  const [vid, setVid] = useState("");
  const [entriesID, setentriesID] = useState("");
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `${baseUrl}/workorder/workorder_summary/${id}`
          );

          const vendorData = response.data.data;
          setWorkOrderData(vendorData);

          const formattedDueDate = vendorData.due_date
            ? new Date(vendorData.due_date).toISOString().split("T")[0]
            : "";

          setVid(vendorData._id);
          if (vendorData && vendorData.entries.length > 0) {
            setentriesID(vendorData.entries._id);
          }

          try {
            const units = await fetchUnitsByProperty(vendorData.rental_adress);
            setUnitData(units);
          } catch (error) {
            console.log(error, "error");
          }
          setSelectedUnit(vendorData.rental_units || "Select");
          setSelectedProp(vendorData.rental_adress || "Select");
          setSelectedCategory(vendorData.work_category || "Select");
          setSelectedVendor(vendorData.vendor_name || "Select");
          setSelectedCharge(vendorData.work_charge || "Select");
          setSelectedEntry(vendorData.entry_allowed || "Select");
          setSelecteduser(vendorData.staffmember_name || "Select");
          setSelectedStatus(vendorData.status || "Select");
          setSelectedPriority(vendorData.priority || "Select");
          setSelectedAccount(vendorData.account_type || "Select");
          setWorkOrderImage(vendorData.workOrderImage || []);

          const entriesData = vendorData.entries || []; // Make sure entries is an array
          console.log(vendorData.work_subject, "vendorData");
          WorkFormik.setValues({
            work_subject: vendorData.work_subject || "",
            rental_units: vendorData.rental_units || "",
            invoice_number: vendorData.invoice_number || "",
            work_charge: vendorData.work_charge || "",
            detail: vendorData.detail || "",
            entry_contact: vendorData.entry_contact || "",
            work_performed: vendorData.work_performed || "",
            vendor_note: vendorData.vendor_note || "",
            due_date: formattedDueDate,
            final_total_amount: vendorData.final_total_amount || "",
            entries: entriesData.map((entry) => ({
              part_qty: entry.part_qty || "",
              account_type: entry.account_type || "Select",
              description: entry.description || "",
              part_price: entry.part_price || "",
              total_amount: entry.total_amount || "",
              dropdownOpen: false,
            })),
          });
        } catch (error) {
          console.error("Error fetching vendor data:", error);
        }
      }
    };

    fetchData();
  }, [id]);

  const { v4: uuidv4 } = require("uuid");
  const [loader, setLoader] = useState(false);

  async function handleSubmit(values, work) {
    setLoader(true);
    var image;
    const imageData = new FormData();
    for (let index = 0; index < selectedFiles.length; index++) {
      const element = selectedFiles[index];
      imageData.append(`files`, element);
    }

    const url = `${imageUrl}/images/upload`; // Use the correct endpoint for multiple files upload
    try {
      const result = await axios.post(url, imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      image = {
        prop_image: result.data.files.map((data, index) => {
          return data.url;
        }),
      };
      console.log(image, "imgs");
    } catch (error) {
      console.error(error);
    }
    try {
      values["rental_adress"] = selectedProp;
      values["work_category"] = WorkFormik.values.work_category
        ? WorkFormik.values.work_category
        : selectedCategory;
      values["vendor_name"] = selectedVendor;
      values["work_charge"] = selectedCharge;
      values["entry_allowed"] = selectedEntry;
      values["staffmember_name"] = selecteduser;
      values["status"] = selectedStatus;
      values["priority"] = selectedPriority;
      values["account_type"] = selectedAccount;
      values["final_total_amount"] = final_total_amount;
      values["rental_units"] = selectedUnit;
      values["workOrderImage"] = image.prop_image;

      const entries = WorkFormik.values.entries.map((entry) => ({
        part_qty: entry.part_qty,
        account_type: entry.account_type,
        description: entry.description,
        part_price: parseFloat(entry.part_price),
        total_amount: parseFloat(entry.total_amount),
      }));

      values["entries"] = entries;
      const workorder_id = uuidv4();
      values["workorder_id"] = workorder_id;

      if (selectedCharge === "Property") {
        const entry = WorkFormik.values.entries.map((entry) => ({
          charge_type: "Workorder Charge",
          account: entry.account_type,
          amount: parseFloat(entry.total_amount),
          date: WorkFormik.values.due_date,
        }));
        const object = {
          properties: {
            rental_adress: WorkFormik.values.rental_adress,
            property_id: WorkFormik.values.rental_id,
          },
          unit: [
            {
              unit: WorkFormik.values.rental_units,
              unit_id: WorkFormik.values.unit_id,
              property_expense: entry,
            },
          ],
        };
        const chargework = await axios
          .post(`${baseUrl}/payment_charge/property_expense`, object)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (selectedCharge === "Tenant") {
        const entry = WorkFormik.values.entries.map((entry) => ({
          charge_type: "Workorder Charge",
          account: entry.account_type,
          amount: parseFloat(entry.total_amount),
          date: WorkFormik.values.due_date,
          tenant_firstName: selectedTenant,
          tenant_id: selectedTenantData._id,
          rental_adress: WorkFormik.values.rental_adress,
        }));
        const object = {
          properties: {
            rental_adress: WorkFormik.values.rental_adress,
            property_id: WorkFormik.values.rental_id,
          },
          unit: [
            {
              unit: WorkFormik.values.rental_units,
              unit_id: WorkFormik.values.unit_id,
              paymentAndCharges: entry,
            },
          ],
        };
        const chargework = await axios
          .post(`${baseUrl}/payment_charge/payment_charge`, object)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      const work_subject = values.work_subject;
      if (id === undefined) {
        // Create the work order
        // console.log(values,'values after submit')
        const workOrderRes = await axios.post(
          `${baseUrl}/workorder/workorder`,
          values
        );

        // Check if the work order was created successfully
        if (workOrderRes.status === 200) {
          // console.log(workOrderRes.data);
          // Use the work order data from the response to create the notification
          const notificationRes = await axios.post(
            `${baseUrl}/notification/notification`,
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
          handleResponse(workOrderRes, notificationRes);
        } else {
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
    setLoader(false);
  }

  // function handleResponse(response) {
  //   if (response.status === 200) {
  //     if (rental_id) {
  //       navigate(
  //         `/${admin}/PropDetails/${WorkFormik.values.rental_id}/${rental_id}?source=task`
  //       );
  //     } else {
  //       navigate("/"+admin+" /Workorder");
  //     }
  //     
  //   } else {
  //     alert(response.data.message);
  //   }
  // }
  
  function handleResponse(response) {
    const successMessage = rental_id ? "Workorder updated successfully" : "Workorder added successfully";
    const errorMessage = response.data.message;
  
    if (response.data.statusCode === 200) {
      // Show success toast
      toast.success(successMessage, {
        position: 'top-center',
        autoClose: 1000,
        onClose: () =>  navigate(
          `/${admin}/PropDetails/${WorkFormik.values.rental_id}/${rental_id}?source=task`
        ),
      });
    } else {
      // Show an error toast
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 1000,
      });
    }
  }

  const WorkFormik = useFormik({
    initialValues: {
      work_subject: "",
      rental_adress: "",
      rental_units: "",
      work_category: "",
      vendor_name: "",
      invoice_number: "",
      work_charge: "",
      entry_allowed: "",
      detail: "",
      entry_contact: "",
      work_performed: "",
      vendor_note: "",
      staffmember_name: "",
      status: "",
      due_date: "",
      priority: "",
      final_total_amount: "",
      workOrderImage: [],
      statusUpdatedBy: "Admin",
      entries: [
        {
          part_qty: "",
          account_type: selectedAccount,
          description: "",
          part_price: "",
          total_amount: "",
          dropdownOpen: false,
        },
      ],
    },

    validationSchema: yup.object({
      rental_adress: yup.string().required("Required"),
      vendor: yup.string().required("Required"),
      staffmember_name: yup.string().required("Required"),
      work_category: yup.string().required("Required"),
      status: yup.string().required("Required"),
    }),

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  console.log(WorkFormik.values.rental_units, "kk");

  const clearSelectedPhoto = (index, name) => {
    if (name === "propertyres_image") {
      const filteredImage = workOrderImage.filter((item, i) => i !== index);
      const filteredImage2 = selectedFiles.filter((item, i) => i !== index);
      setSelectedFiles(filteredImage2);
      setWorkOrderImage(filteredImage);
    }
  };

  React.useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch(`${baseUrl}/rentals/allproperty`)
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

  React.useEffect(() => {
    setVendorsName();

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

  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileData = (e, type) => {
    // Use the correct state-setting function for setSelectedFiles
    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...e.target.files,
    ]);

    const newFiles = [
      ...workOrderImage,
      ...Array.from(e.target.files).map((file) => URL.createObjectURL(file)),
    ];

    // Update the state with the new files
    setWorkOrderImage(newFiles);
  };
  console.log(workOrderImage, "workOrderImage");

  const handleQuantityChange = (e, index) => {
    const updatedEntries = [...WorkFormik.values.entries];
    updatedEntries[index].part_qty = e.target.value;
    const quantity = parseFloat(e.target.value);
    const price = parseFloat(updatedEntries[index].part_price);
    updatedEntries[index].total_amount =
      isNaN(quantity) || isNaN(price) ? "" : (quantity * price).toFixed(2);
    WorkFormik.setValues({
      ...WorkFormik.values,
      entries: updatedEntries,
    });
  };

  const handlePriceChange = (e, index) => {
    const updatedEntries = [...WorkFormik.values.entries];
    updatedEntries[index].part_price = e.target.value;
    const quantity = parseFloat(updatedEntries[index].part_qty);
    const price = parseFloat(e.target.value);
    updatedEntries[index].total_amount =
      isNaN(quantity) || isNaN(price) ? "" : (quantity * price).toFixed(2);
    WorkFormik.setValues({
      ...WorkFormik.values,
      entries: updatedEntries,
    });
  };

  // Calculate the total
  let final_total_amount = 0;
  WorkFormik.values.entries.forEach((entries) => {
    if (entries.total_amount) {
      final_total_amount += parseFloat(entries.total_amount);
    }
  });

  const editworkorder = async (vid) => {
    const formattedDueDate = WorkFormik.values.due_date
      ? new Date(WorkFormik.values.due_date).toISOString().split("T")[0]
      : "";
    setLoader(true);
    var image;
    const imageData = new FormData();
    for (let index = 0; index < selectedFiles.length; index++) {
      const element = selectedFiles[index];
      imageData.append(`files`, element);
    }

    const url = `${imageUrl}/images/upload`; // Use the correct endpoint for multiple files upload
    try {
      const result = await axios.post(url, imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      image = {
        prop_image: result.data.files.map((data, index) => {
          return data.url;
        }),
      };
      console.log(image, "imgs");
    } catch (error) {
      console.error(error);
    }
    try {
      console.log(baseUrl);
      const entriesData = WorkFormik.entries || [];
      const response = await axios.put(
        `${baseUrl}/workorder/updateworkorder/${vid}`,
        {
          work_subject: WorkFormik.values.work_subject,
          rental_adress: selectedProp,
          rental_units: WorkFormik.values.rental_units,
          work_category: WorkFormik.values.work_category,
          vendor_name: selectedVendor,
          invoice_number: WorkFormik.values.invoice_number,
          work_charge: selectedCharge,
          entry_allowed: selectedEntry,
          staffmember_name: WorkFormik.values.staffmember_name,
          work_performed: WorkFormik.values.work_performed,
          vendor_note: WorkFormik.values.vendor_note,
          workOrderImage: image.prop_image,
          priority: selectedPriority,
          status: selectedStatus,
          due_date: formattedDueDate,
          statusUpdatedBy: "Admin",

          // part_qty: entry.part_qty,
          // account_type: entry.account_type,
          // description: entry.description,
          // part_price: entry.part_price,
          // total_amount: entry.total_amount,
        }
      );
      handleResponse(response);
      console.log("Workorder updated successfully", response.data);
    } catch (error) {
      console.error("Error updating workorder:", error);
    }
    await axios
      .put(`${baseUrl}/workorder/workorder/${workOrderData._id}/status`, {
        statusUpdatedBy: accessType.userName,
        status: selectedStatus !== workOrderData.status ? selectedStatus : "",
        due_date:
          formattedDueDate !== workOrderData.due_date ? formattedDueDate : "",
        staffmember_name:
          selecteduser !== workOrderData.staffmember_name ? selecteduser : "",
        // updateAt: updatedAt,
      })
      .then((res) => {
        console.log(res.data, "the status put");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(workOrderData, "workorderdata");

  const [isDisplay, setIsDisplay] = useState("false");
  useEffect(() => {
    if (WorkFormik?.values?.entries[0]?.account_type) {
      setIsDisplay("true");
    } else {
      setIsDisplay("false");
    }
  }, [WorkFormik]);

  const [tenantsDetails, setTenantsDetails] = useState([]);
  const getPropertyData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/tenant/findData`, {
        params: {
          rental_adress: selectedProp,
          rental_units: selectedUnit,
        },
      });
      setTenantsDetails(response.data);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
  };

  const getTenantData = async () => {
    setSelectedTenant("Select");
    if (selectedCharge === "Tenant" && selectedProp) {
      const data = getPropertyData();
    } else {
      setTenantsDetails([]);
    }
  };

  useEffect(() => {
    getTenantData();
  }, [selectedCharge, selectedUnit, selectedProp]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/rentals/rentals_workorder/${rental_id}`
        );

        setSelectedProp(response.data.data.entry.rental_adress);
        WorkFormik.setFieldValue(
          "rental_adress",
          response.data.data.entry.rental_adress
        );
        WorkFormik.setFieldValue(
          "rental_id",
          response.data.data.rentalOwner._id
        );
        setSelectedUnit("");
        try {
          const units = await fetchUnitsByProperty(
            response.data.data.entry.rental_adress
          );
          setUnitData(units);
        } catch (error) {
          console.error("Error handling selected property:", error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [rental_id]);

  return (
    <>
      <AddWorkorderHeader />
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
                    <h3 className="mb-0">
                      {" "}
                      {id ? "Edit Work Order" : "New Work Order"}
                    </h3>
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
                            id="input-work-subject"
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
                      <Col>
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
                            <label htmlFor={`workOrderImage`}>
                              <b style={{ fontSize: "20px" }}>+</b> Add
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
                                key={index} // Use a unique identifier, such as index or image URL
                                style={{
                                  position: "relative",
                                  width: "100px",
                                  height: "100px",
                                  margin: "10px",
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                {console.log(unitImg, "unitImage")}
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
                                  onClick={() =>
                                    clearSelectedPhoto(
                                      index,
                                      "propertyres_image"
                                    )
                                  }
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
                      {/* Property Dropdown */}
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
                              onBlur={WorkFormik.handleBlur}
                              disabled={rental_id ? true : false}
                            >
                              <DropdownToggle caret style={{ width: "100%" }}>
                                {selectedProp
                                  ? selectedProp
                                  : "Select a property..."}
                                &nbsp;&nbsp;&nbsp;&nbsp;
                              </DropdownToggle>
                              <DropdownMenu
                                style={{
                                  width: "100%",
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                  overflowX: "hidden",
                                }}
                              >
                                {propertyData.map((property, index) => (
                                  <DropdownItem
                                    key={index}
                                    onClick={() => {
                                      handlePropertyTypeSelect(property);
                                    }}
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

                      {/* Unit Dropdown */}
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
                      {/* First Column - Category Dropdown */}
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Category *
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
                            {WorkFormik.errors &&
                            WorkFormik.errors?.work_category &&
                            WorkFormik.touched &&
                            WorkFormik.touched?.work_category &&
                            WorkFormik.values.work_category === "" ? (
                              <div style={{ color: "red" }}>
                                {WorkFormik.errors.work_category}
                              </div>
                            ) : null}
                          </Dropdown>
                        </FormGroup>
                      </Col>

                      {/* Second Column - Other Category Input */}
                      <Col
                        lg="4"
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
                            onBlur={WorkFormik.handleBlur}
                            onChange={(e) => {
                              WorkFormik.setFieldValue(
                                "work_category",
                                e.target.value
                              );
                            }}
                            value={WorkFormik.values.work_category}
                          />
                        </FormGroup>
                      </Col>

                      {/* Third Column - Vendor Dropdown */}
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Vendor *
                          </label>
                          <br />
                          <br />
                          <Dropdown
                            isOpen={vendordropdownOpen}
                            toggle={toggle3}
                          >
                            <DropdownToggle caret style={{ width: "100%" }}>
                              {selectedVendor} &nbsp;&nbsp;&nbsp;&nbsp;
                            </DropdownToggle>
                            <DropdownMenu style={{ width: "100%" }}>
                              {allVendors.map((vendor, index) => (
                                <DropdownItem
                                  key={index}
                                  onClick={() => handleVendorSelect(vendor)}
                                >
                                  {vendor}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                            {WorkFormik.errors &&
                            WorkFormik.errors?.vendor &&
                            WorkFormik.touched &&
                            WorkFormik.touched?.vendor &&
                            WorkFormik.values.vendor === "" ? (
                              <div style={{ color: "red" }}>
                                {WorkFormik.errors.vendor}
                              </div>
                            ) : null}
                          </Dropdown>
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
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Assigned To *
                          </label>
                          <br />
                          <br />
                          <FormGroup>
                            <Dropdown
                              isOpen={userdropdownOpen}
                              toggle={toggle5}
                            >
                              <DropdownToggle caret>
                                {selecteduser ? selecteduser : "Select"}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              </DropdownToggle>
                              <DropdownMenu
                                style={{
                                  width: "100%",
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                }}
                              >
                                <DropdownItem header style={{ color: "blue" }}>
                                  Staff
                                </DropdownItem>
                                {staffData.map((user) => (
                                  <DropdownItem
                                    key={user._id}
                                    onClick={() =>
                                      handleStaffSelect(user.staffmember_name)
                                    }
                                  >
                                    {user.staffmember_name}
                                  </DropdownItem>
                                ))}
                              </DropdownMenu>
                              {WorkFormik.errors &&
                              WorkFormik.errors?.staffmember_name &&
                              WorkFormik.touched &&
                              WorkFormik.touched?.staffmember_name &&
                              WorkFormik.values.staffmember_name === "" ? (
                                <div style={{ color: "red" }}>
                                  {WorkFormik.errors.staffmember_name}
                                </div>
                              ) : null}
                            </Dropdown>
                          </FormGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>

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

                  <div className="pl-lg-4">
                    <label className="form-control-label" htmlFor="input-desg">
                      Parts and Labor
                    </label>
                    <Col lg="12">
                      <FormGroup>
                        <div className="table-responsive">
                          <Table
                            className="table table-bordered"
                            responsive
                            style={{
                              borderCollapse: "collapse",
                              border: "1px solid #ddd",
                              // width: "100% !important",
                            }}
                          >
                            <thead className="thead-light">
                              <tr>
                                <th>Qty</th>
                                <th>Account</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Total</th>
                                {/* <th scope="col">ACTION</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {WorkFormik.values.entries?.map(
                                (entry, index) => (
                                  <tr key={index}>
                                    <td>
                                      <Input
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="Quantity"
                                        type="text"
                                        name={`entries[${index}].part_qty`}
                                        onChange={(e) =>
                                          handleQuantityChange(e, index)
                                        }
                                        value={entry.part_qty}
                                      />
                                      {WorkFormik.touched.entries &&
                                      WorkFormik.touched.entries[index] &&
                                      WorkFormik.errors.entries &&
                                      WorkFormik.errors.entries[index] &&
                                      WorkFormik.errors.entries[index]
                                        .part_qty ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            WorkFormik.errors.entries[index]
                                              .part_qty
                                          }
                                        </div>
                                      ) : null}
                                    </td>
                                    <td>
                                      <Dropdown
                                        isOpen={entry.dropdownOpen}
                                        toggle={() => toggleDropdown(index)}
                                      >
                                        <DropdownToggle
                                          caret
                                          style={{ width: "100%" }}
                                        >
                                          {entry.account_type || "Select"}{" "}
                                          &nbsp;&nbsp;&nbsp;&nbsp;
                                        </DropdownToggle>
                                        <DropdownMenu
                                          style={{
                                            width: "100%",
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                          }}
                                        >
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Advertising",
                                                index
                                              )
                                            }
                                          >
                                            Advertising
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Association Fees",
                                                index
                                              )
                                            }
                                          >
                                            Association Fees
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Auto and Travel",
                                                index
                                              )
                                            }
                                          >
                                            Auto and Travel
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Bank Fees",
                                                index
                                              )
                                            }
                                          >
                                            Bank Fees
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Cleaning and Maintenance",
                                                index
                                              )
                                            }
                                          >
                                            Cleaning and Maintenance
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Commissions",
                                                index
                                              )
                                            }
                                          >
                                            Commissions
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Depreciation Expense",
                                                index
                                              )
                                            }
                                          >
                                            Depreciation Expense
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Insurance",
                                                index
                                              )
                                            }
                                          >
                                            Insurance
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Legal and Professional Fees",
                                                index
                                              )
                                            }
                                          >
                                            Legal and Professional Fees
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Licenses and Permits",
                                                index
                                              )
                                            }
                                          >
                                            Licenses and Permits
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Management Fees",
                                                index
                                              )
                                            }
                                          >
                                            Management Fees
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Mortgage Interest",
                                                index
                                              )
                                            }
                                          >
                                            Mortgage Interest
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Other Expenses",
                                                index
                                              )
                                            }
                                          >
                                            Other Expenses
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Other Interest Expenses",
                                                index
                                              )
                                            }
                                          >
                                            Other Interest Expenses
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Postage and Delivery",
                                                index
                                              )
                                            }
                                          >
                                            Postage and Delivery
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Repairs",
                                                index
                                              )
                                            }
                                          >
                                            Repairs
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() =>
                                              handleAccountSelection(
                                                "Insurance",
                                                index
                                              )
                                            }
                                          >
                                            Other Expenses
                                          </DropdownItem>
                                        </DropdownMenu>
                                      </Dropdown>
                                    </td>
                                    <td>
                                      <Input
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="Description"
                                        type="text"
                                        name={`entries[${index}].description`}
                                        onBlur={WorkFormik.handleBlur}
                                        onChange={WorkFormik.handleChange}
                                        value={entry.description}
                                      />
                                      {WorkFormik.touched.entries &&
                                      WorkFormik.touched.entries[index] &&
                                      WorkFormik.errors.entries &&
                                      WorkFormik.errors.entries[index] &&
                                      WorkFormik.errors.entries[index]
                                        .description ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            WorkFormik.errors.entries[index]
                                              .description
                                          }
                                        </div>
                                      ) : null}
                                    </td>
                                    <td>
                                      <Input
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="Price"
                                        type="text"
                                        name={`entries[${index}].part_price`}
                                        onChange={(e) =>
                                          handlePriceChange(e, index)
                                        }
                                        value={entry.part_price}
                                        onInput={(e) => {
                                          const inputValue = e.target.value;
                                          const numericValue =
                                            inputValue.replace(/\D/g, "");
                                          e.target.value = numericValue;
                                        }}
                                      />
                                      {WorkFormik.touched.entries &&
                                      WorkFormik.touched.entries[index] &&
                                      WorkFormik.errors.entries &&
                                      WorkFormik.errors.entries[index] &&
                                      WorkFormik.errors.entries[index]
                                        .part_price ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            WorkFormik.errors.entries[index]
                                              .part_price
                                          }
                                        </div>
                                      ) : null}
                                    </td>
                                    <td>
                                      <Input
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="Total"
                                        type="number"
                                        name={`entries[${index}].total_amount`}
                                        onBlur={WorkFormik.handleBlur}
                                        onChange={WorkFormik.handleChange}
                                        value={entry.total_amount}
                                        disabled // Disable the input
                                      />
                                      {WorkFormik.touched.entries &&
                                      WorkFormik.touched.entries[index] &&
                                      WorkFormik.errors.entries &&
                                      WorkFormik.errors.entries[index] &&
                                      WorkFormik.errors.entries[index]
                                        .total_amount ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            WorkFormik.errors.entries[index]
                                              .total_amount
                                          }
                                        </div>
                                      ) : null}
                                    </td>
                                    <td style={{ border: "none" }}>
                                      <ClearIcon
                                        type="button"
                                        style={{
                                          cursor: "pointer",
                                          padding: 0,
                                        }}
                                        onClick={() => handleRemoveRow(index)}
                                      >
                                        Remove
                                      </ClearIcon>
                                    </td>
                                  </tr>
                                )
                              )}
                              <tr>
                                <th>Total</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>{final_total_amount.toFixed(2)}</th>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="4">
                                  <Button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddRow}
                                  >
                                    Add Row
                                  </Button>
                                </td>
                              </tr>
                            </tfoot>
                          </Table>
                        </div>
                      </FormGroup>
                    </Col>
                    {/* <div>
                                <input
                                type="number"
                                name="qty"
                                placeholder="Qty"
                                value={formData.qty}
                                onChange={handleChange}
                                />
                                <input
                                type="text"
                                name="account"
                                placeholder="Account"
                                value={formData.account}
                                onChange={handleChange}
                                />
                                <input
                                type="text"
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                                />
                                <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleChange}
                                />
                                <input
                                type="number"
                                name="total"
                                placeholder="Total"
                                value={formData.total}
                                onChange={handleChange}
                                />
                                <button onClick={handleAddRow}>Add Row</button>
                            </div> */}
                  </div>
                  <br />
                  <br />

                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-member"
                          >
                            Vendor Notes
                          </label>
                          <br />
                          <br />
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            placeholder=""
                            type="textarea"
                            name="vendor_note"
                            //name="nput-staffmember-name"
                            onBlur={WorkFormik.handleBlur}
                            onChange={(e) => {
                              // Update the state or Formik values with the new input value
                              WorkFormik.handleChange(e);
                            }}
                            value={WorkFormik.values.vendor_note}
                          />
                          {WorkFormik.touched.vendor_note &&
                          WorkFormik.errors.vendor_note ? (
                            <div style={{ color: "red" }}>
                              {WorkFormik.errors.vendor_note}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>

                  <div className="pl-lg-4">
                    <Row>
                      {isDisplay === "true" ? (
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-desg"
                            >
                              Charge Work To
                            </label>
                            <br />
                            <br />
                            <Dropdown
                              isOpen={chargedropdownOpen}
                              toggle={toggle7}
                            >
                              <DropdownToggle caret style={{ width: "100%" }}>
                                {selectedCharge} &nbsp;&nbsp;&nbsp;&nbsp;
                              </DropdownToggle>
                              <DropdownMenu style={{ width: "100%" }}>
                                <DropdownItem
                                  onClick={() => handleChargeSelect("Property")}
                                >
                                  Property
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => handleChargeSelect("Tenant")}
                                >
                                  Tenant
                                </DropdownItem>
                              </DropdownMenu>
                              {WorkFormik.touched.work_charge &&
                              WorkFormik.errors.work_charge ? (
                                <div style={{ color: "red" }}>
                                  {WorkFormik.errors.work_charge}
                                </div>
                              ) : null}
                            </Dropdown>
                          </FormGroup>
                        </Col>
                      ) : null}
                      {tenantsDetails.length > 0 ? (
                        <>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-desg"
                              >
                                Tenant
                              </label>
                              <br />
                              <br />
                              <Dropdown
                                isOpen={tenantdownOpen}
                                toggle={toggle8}
                              >
                                <DropdownToggle caret style={{ width: "100%" }}>
                                  {selectedTenant} &nbsp;&nbsp;&nbsp;&nbsp;
                                </DropdownToggle>
                                <DropdownMenu style={{ width: "100%" }}>
                                  {tenantsDetails.map((item) => (
                                    <DropdownItem
                                      key={item._id}
                                      onClick={() => {
                                        setSelectedTenant(
                                          item.tenant_firstName +
                                            " " +
                                            item.tenant_lastName
                                        );
                                        setSelectedTenantData(item);
                                      }}
                                    >
                                      {item.tenant_firstName +
                                        " " +
                                        item.tenant_lastName}
                                    </DropdownItem>
                                  ))}
                                </DropdownMenu>
                              </Dropdown>
                            </FormGroup>
                          </Col>
                        </>
                      ) : (
                        <></>
                      )}
                    </Row>
                  </div>

                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Priority
                          </label>
                          <br />
                          <br />
                          <div className="pl-lg-4">
                            <Row>
                              <Col xs="3">
                                <Label check>
                                  <Input
                                    type="radio"
                                    name="priority"
                                    value="High"
                                    checked={selectedPriority === "High"}
                                    onChange={handlePriorityChange}
                                  />
                                  High
                                </Label>
                              </Col>
                              &nbsp;
                              <Col xs="4">
                                <Label check>
                                  <Input
                                    type="radio"
                                    name="priority"
                                    value="Medium"
                                    checked={selectedPriority === "Medium"}
                                    onChange={handlePriorityChange}
                                  />
                                  Medium
                                </Label>
                              </Col>
                              &nbsp;
                              <Col xs="4">
                                <Label check>
                                  <Input
                                    type="radio"
                                    name="priority"
                                    value="Low"
                                    checked={selectedPriority === "Low"}
                                    onChange={handlePriorityChange}
                                  />
                                  Low
                                </Label>
                              </Col>
                            </Row>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <br />

                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Status *
                          </label>
                          <br />
                          <br />
                          <FormGroup>
                            <Dropdown
                              isOpen={statusdropdownOpen}
                              toggle={toggle6}
                            >
                              <DropdownToggle caret>
                                {selectedStatus ? selectedStatus : "Select"}
                                &nbsp;&nbsp;&nbsp;&nbsp;
                              </DropdownToggle>
                              <DropdownMenu
                                style={{
                                  width: "100%",
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                }}
                              >
                                <DropdownItem
                                  onClick={() => handleStatusSelect("New")}
                                >
                                  New
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() =>
                                    handleStatusSelect("In Progress")
                                  }
                                >
                                  In Progress
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => handleStatusSelect("On Hold")}
                                >
                                  On Hold
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => handleStatusSelect("Complete")}
                                >
                                  Complete
                                </DropdownItem>
                              </DropdownMenu>
                              {WorkFormik.errors &&
                              WorkFormik.errors?.status &&
                              WorkFormik.touched &&
                              WorkFormik.touched?.status &&
                              WorkFormik.values.status === "" ? (
                                <div style={{ color: "red" }}>
                                  {WorkFormik.errors.status}
                                </div>
                              ) : null}
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
                          </label>
                          <br />
                          <br />
                          <Input
                            className="form-control-alternative"
                            id="input-unitadd"
                            type="date"
                            name="due_date"
                            onBlur={WorkFormik.handleBlur}
                            onChange={WorkFormik.handleChange}
                            value={WorkFormik.values.due_date}
                          />
                          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              className="form-control-alternative"
                              name="due_date"
                              slotProps={{ textField: { size: "small" } }}
                              views={["year", "month", "day"]}
                              id="input-unitadd"
                              placeholder="3000"
                              dateFormat="MM-dd-yyyy"
                              onBlur={WorkFormik.handleBlur}
                              selected={WorkFormik.values.due_date} // Use 'selected' prop instead of 'value'
                              onChange={(date) => {
                                WorkFormik.setFieldValue("due_date", date); // Update the Formik field value
                              }}
                            />
                          </LocalizationProvider> */}
                          {WorkFormik.touched.due_date &&
                          WorkFormik.errors.due_date ? (
                            <div style={{ color: "red" }}>
                              {WorkFormik.errors.due_date}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <br />
                  </div>
                  {loader ? (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: "green", cursor: "not-allowed" }}
                      disabled
                    >
                      Loading...
                    </button>
                  ) : id ? (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: "green", cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        editworkorder(vid);
                      }}
                    >
                      Update Work Order
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary ml-4"
                      style={{ background: "green" }}
                    >
                      Add Work Order
                    </button>
                  )}
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
        <ToastContainer />
      </Container>
    </>
  );
};

export default AddWorkorder;
