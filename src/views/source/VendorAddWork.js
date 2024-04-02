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
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import VendorHeader from "components/Headers/VendorHeader";
import ClearIcon from "@mui/icons-material/Clear";
import "react-datepicker/dist/react-datepicker.css";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import { OpenImageDialog } from "components/OpenImageDialog";
import PropertyType from "./PropertyType";

const VendorAddWork = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_POST_URL;
  const imageGetUrl = process.env.REACT_APP_IMAGE_GET_URL;
  const { workorder_id } = useParams();
  //console.log(workorder_id, "workorder_id");
  const { id } = useParams();
  //console.log(id, "id");
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [propdropdownOpen, setpropdropdownOpen] = React.useState(false);
  const [categorydropdownOpen, setcategorydropdownOpen] = React.useState(false);
  const [vendordropdownOpen, setvendordropdownOpen] = React.useState(false);
  const [entrydropdownOpen, setentrydropdownOpen] = React.useState(false);
  const [userdropdownOpen, setuserdropdownOpen] = React.useState(false);
  const [statusdropdownOpen, setstatusdropdownOpen] = React.useState(false);
  const [vendorNames, setVendorNames] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [selectedProp, setSelectedProp] = useState("Select");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Select");
  const [selectedVendor, setSelectedVendor] = useState("Select");
  const [selectedEntry, setSelectedEntry] = useState("Select");
  const [selecteduser, setSelecteduser] = useState("Select");
  const [selectedStatus, setSelectedStatus] = useState("Select");
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState("Select");
  const [selectedTenant, setSelectedTenant] = useState("Select");



  const toggle11 = () => {
    setUnitDropdownOpen((prevState) => !prevState);
  };
  const toggle1 = () => setpropdropdownOpen((prevState) => !prevState);
  const toggle2 = () => setcategorydropdownOpen((prevState) => !prevState);
  const toggle3 = () => setvendordropdownOpen((prevState) => !prevState);
  const toggle4 = () => setentrydropdownOpen((prevState) => !prevState);
  const toggle5 = () => setuserdropdownOpen((prevState) => !prevState);
  const toggle6 = () => setstatusdropdownOpen((prevState) => !prevState);

  const [accountData, setAccountData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [staffData, setstaffData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [workOrderImage, setWorkOrderImage] = useState([]);

  const [formData, setFormData] = useState({
    part_qty: "",
    account_type: "",
    description: "",
    part_price: "",
    total_amount: "",
  });
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  // const handlePropertySelect = (property) => {
  //   setSelectedProp(property);
  // };

  const handlePropertySelect = async (property) => {
    setSelectedProp(property);
    WorkFormik.values.rental_adress = property;

    setSelectedUnit("");
    try {
      const units = await fetchUnitsByProperty(property.rental_adress);
      setUnitData(units);
    } catch (error) {
      console.error("Error handling selected property:", error);
    }
  };

  const fetchUnitsByProperty = async (propertyType) => {
    try {
      console.log(propertyType, "propertyType");
      const response = await fetch(
        `${baseUrl}/propertyunit/rentals_property/${propertyType}`
      );
      const data = await response.json();
      // Ensure that units are extracted correctly and set as an array
      const units = data?.data || [];

      console.log(units, "units246");
      return units;
    } catch (error) {
      console.error("Error fetching units:", error);
      return [];
    }
  };

  const [vid, setVid] = useState("");
  const [entriesID, setentriesID] = useState("");

  const [imagedetails, setImageDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `${baseUrl}/workorder/workorder_summary/${id}`
          );
          setImageDetails(response.data.data.workOrderImage);
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

  let cookies = new Cookies();
  let cookie_id = localStorage.getItem("Vendor ID");

  const [accessType, setAccessType] = useState(null);
  console.log(accessType, "accessType");
  // const [vendorDetails, setVendorDetails] = useState({});
  const [vendorname, setVendorname] = useState("");

  const getVendorDetails = async () => {
    if (cookie_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/vendor/vendor_summary/${cookie_id}`
        );
        // console.log(response.data.data);
        // setVendorDetails(response.data.data);
        setVendorname(response.data.data.vendor_name);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching vendor details:", error);
        // setError(error);
        // setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
      console.log(jwt.accessType, "jwt.accessType");
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    navigate("/vendor/vendorworktable");
  };

  const handleAddRow = () => {
    const newEntry = {
      part_qty: "",
      account_type: "",
      description: "",
      part_price: "",
      // total_amount: "",
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

  const [selectedAccount, setSelectedAccount] = useState("");
  const [outstandDetails, setoutstandDetails] = useState({});
  const getOutstandData = async () => {
    if (id) {
      try {
        const response = await axios.get(

          `${baseUrl}/workorder/workorder_summary/${id}`
        );
        setoutstandDetails(response.data.data);
        // setWorkOrderStatus(response.data.data.workorder_status.reverse());
        setSelectedStatus(response.data.data.status);
        setSelecteduser(response.data.data.staffmember_name);
        // updateWorkorderFormik.setValues({
        //   status: response.data.data.status,
        //   // staffmember_name: response.data.data.staffmember_name,
        //   due_date: response.data.data.due_date,
        //   assigned_to: response.data.data.staffmember_name,
        //   message: response.data.data.message ? response.data.data.message : "",
        //   statusUpdatedBy: response.data.data.statusUpdatedBy
        //     ? response.data.data.statusUpdatedBy
        //     : "Admin",
        // });
        // setLoading(false);
        // setImageDetails(response.data.data.workOrderImage);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
        // setError(error);
        // setLoading(false);
      }
    }
  };

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

  const [workOrderData, setWorkOrderData] = useState(null);

  useEffect(() => {
    getVendorDetails();
    getOutstandData();
    fetch(`${baseUrl}/addaccount/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setAccountData(data.data);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  }, []);

  // Fetch vendor data if editing an existing vendor
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `${baseUrl}/work-order/workorder_details/${id}`
          );
          const {
            partsandcharge_data,
            property_data,
            unit_data,
            staff_data,
            vendor_data,
            tenant_data,
          } = response.data.data;
          setWorkOrderData(response.data.data);

          const formattedDueDate = response.data.data.date
            ? new Date(response.data.data.date).toISOString().split("T")[0]
            : "";

          setVid(response.data.data.workOrder_id);

          try {
            const units = await fetchUnitsByProperty(property_data.rental_id);
            setUnitData(units);
          } catch (error) {
            console.error(error, "error");
          }

          setSelectedUnit(unit_data.rental_unit || "Select");
          setSelectedProp(property_data.rental_adress || "Select");
          setSelectedCategory(response.data.data.work_category || "Select");
          setSelectedVendor(vendor_data.vendor_name || "Select");
          setSelectedCharge(response.data.data.work_charge_to || "Select");
          setSelectedEntry(
            response.data.data.entry_allowed === true ? "Yes" : "No" || "Select"
          );
          setSelecteduser(staff_data.staffmember_name || "Select");
          setSelectedStatus(response.data.data.status || "Select");
          setSelectedPriority(response.data.data.priority || "Select");
          setWorkOrderImage(response.data.data.workOrder_images || []);
          setSelectedFiles(response.data.data.workOrder_images || []);
          setSelectedTenant(
            tenant_data.tenant_firstName + " " + tenant_data.tenant_lastName ||
            "Select"
          );

          WorkFormik.setValues({
            invoice_number: response.data.data?.invoice_number || "",
            work_charge_to: response.data.data?.work_charge_to || "",
            detail: response.data.data?.detail || "",
            entry_contact: response.data.data?.entry_contact || "",
            final_total_amount: response.data.data?.final_total_amount || "",

            work_subject: response.data.data?.work_subject || "",
            rental_adress: property_data?.rental_adress || "",
            rental_unit: unit_data?.rental_unit || "",
            rental_id: property_data.rental_id || "",
            work_category: response.data.data?.work_category || "",
            vendor_name: vendor_data?.vendor_name || "",
            vendor_id: vendor_data?.vendor_id || "",
            unit_id: unit_data?.unit_id || "",
            tenant_id: tenant_data?.tenant_id || "",
            tenant_name:
              tenant_data?.tenant_firstName +
              " " +
              tenant_data?.tenant_lastName || "",
            invoice_number: "",
            work_charge: response.data.data?.work_charge_to || "",
            entry_allowed:
              response.data.data.entry_allowed === true ? "Yes" : "No" || "",
            detail: "",
            entry_contact: "",
            work_performed: response.data.data?.work_performed || "",
            vendor_note: response.data.data?.vendor_notes || "",
            staffmember_name: staff_data?.staffmember_name || "",
            staffmember_id: staff_data?.staffmember_id || "",
            status: response.data.data?.status || "",
            due_date: formattedDueDate || "",
            priority: response.data.data?.priority || "",
            workOrderImage: response.data.data?.workOrder_images || "",
            final_total_amount: "",
            statusUpdatedBy: "Admin",
            entries: partsandcharge_data.map((part) => ({
              part_qty: part?.parts_quantity || "",
              parts_id: part?.parts_id || "",
              account_type: part?.account || "Select",
              description: part?.description || "",
              charge_type: "Workorder Charge",
              part_price: part?.parts_price || "",
              total_amount: part?.amount || "",
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

  // async function handleSubmit(values, work) {
  //   setLoader(true);
  //   try {
  //     values["rental_adress"] = selectedProp;
  //     values["work_category"] = selectedCategory;
  //     values["vendor_name"] = selectedVendor;
  //     values["entry_allowed"] = selectedEntry;
  //     values["staffmember_name"] = selecteduser;
  //     values["status"] = selectedStatus;
  //     values["priority"] = selectedPriority;
  //     values["account_type"] = selectedAccount;
  //     values["final_total_amount"] = final_total_amount;
  //     values["rental_units"] = selectedUnit;
  //     values["workOrderImage"] = workOrderImage;

  //     const entries = WorkFormik.values.entries.map((entry) => ({
  //       part_qty: entry.part_qty,
  //       account_type: entry.account_type,
  //       description: entry.description,
  //       part_price: parseFloat(entry.part_price),
  //       total_amount: parseFloat(entry.total_amount),
  //     }));

  //     values["entries"] = entries;

  //     // Moved this line below values assignment
  //     const workorder_id = uuidv4();
  //     values["workorder_id"] = workorder_id;

  //     const work_subject = values.work_subject;

  //     if (id === undefined) {
  //       // Create the work order
  //       const workOrderRes = await axios.post(
  //         `${baseUrl}/workorder/workorder`,
  //         { ...values, statusUpdatedBy: vendorname }
  //       );

  //       // Check if the work order was created successfully
  //       if (workOrderRes.status === 200) {
  //         const notificationRes = await axios.post(
  //           `${baseUrl}/notification/notification`,
  //           {
  //             workorder: {
  //               vendor_name: selectedVendor,
  //               staffmember_name: selecteduser,
  //               rental_adress: selectedProp,
  //               work_subject: work_subject,
  //               workorder_id: workorder_id,
  //             },
  //             notification: {},
  //           }
  //         );

  //         // Handle the notification response if needed
  //         handleResponse(workOrderRes, notificationRes);
  //       } else {
  //         console.error("Work Order Error:", workOrderRes.data);
  //       }
  //     } else {
  //       const editUrl = `${baseUrl}/workorder/workorder/${id}`;
  //       const res = await axios.put(editUrl, values);
  //       if (res.status === 200) {
  //         const notification = await axios.post(
  //           `${baseUrl}/notification/notification/vendor`,
  //           {
  //             workorder: {
  //               vendor_name: selectedVendor,
  //               staffmember_name: selecteduser,
  //               rental_adress: selectedProp,
  //               work_subject: work_subject,
  //               workorder_id: workorder_id,
  //             },
  //             notification: {},
  //           }
  //         );
  //         handleResponse(res, notification);
  //       } else {
  //         console.error("Work Order Error:", res.data);
  //       }

  //       await axios
  //         .put(`${baseUrl}/workorder/workorder/${outstandDetails._id}/status`, {
  //           statusUpdatedBy: vendorname + "(Vendor)",
  //           status: selectedStatus,
  //           // updateAt: updatedAt,
  //         })
  //         .then((res) => {
  //           console.log(res.data, "the status put");
  //           // getOutstandData();
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //       //console.log("ID", id);
  //       //console.log("Workorderid", workorder_id);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     if (error.response) {
  //       console.error("Response Data:", error.response.data);
  //     }
  //   }
  // }
  const handleSubmit = async (values) => {
    setLoader(true);
    let image = [];

    if (selectedFiles) {
      try {
        const uploadPromises = selectedFiles.map(async (fileItem, i) => {
          if (fileItem instanceof File) {
            try {
              const form = new FormData();
              form.append("files", fileItem);

              const res = await axios.post(`${imageUrl}/images/upload`, form);

              if (
                res &&
                res.data &&
                res.data.files &&
                res.data.files.length > 0
              ) {
                fileItem = res.data.files[0].filename;
                image[i] = res.data.files[0].filename;
              } else {
                console.error("Unexpected response format:", res);
              }
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          } else {
            image[i] = fileItem;
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Error processing file uploads:", error);
      }
    }

    const object = {
      workOrder: {
        // admin_id: accessType?.admin_id || "",
        rental_id: WorkFormik.values.rental_id || "",
        unit_id: WorkFormik.values.unit_id || "",
        vendor_id: WorkFormik.values.vendor_id || "",
        tenant_id: WorkFormik.values.tenant_id || "",
        staffmember_id: WorkFormik.values.staffmember_id || "",
        work_subject: WorkFormik.values.work_subject || "",
        work_category: WorkFormik.values.work_category || "",
        entry_allowed: WorkFormik.values.entry_allowed === "Yes" ? true : false,
        work_performed: WorkFormik.values.work_performed || "",
        workOrder_images: image || "",
        vendor_notes: WorkFormik.values.vendor_note || "",
        priority: WorkFormik.values.priority || "",
        work_charge_to: WorkFormik.values.work_charge || "",
        status: WorkFormik.values.status || "",
        date: WorkFormik.values.due_date || "",
      },
      parts: WorkFormik.values.entries.map((item) => {
        return {
          parts_quantity: item.part_qty || 0,
          account: item.account_type || "",
          description: item.description || "",
          charge_type: "Workorder Charge",
          parts_price: item.part_price || 0,
          amount: item.total_amount || 0,
        };
      }),
    };

    try {
      const res = await axios.post(`${baseUrl}/work-order/work-order`, object);
      if (res.status === 200) {
        if (res.data.statusCode === 200) {
          toast.success("Work Order Added Successfully.", {
            position: "top-center",
            autoClose: 1000,
            // onClose: () => navigate(`/${admin}/Workorder`),
          });
          navigate("/vendor/vendorworktable");
        } else {
          console.log(res.data, "res.data");
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      console.error("Error: ", error.message);
    }
    setLoader(false);
  };
  function handleResponse(response) {
    if (response.data.statusCode === 200) {
      navigate("/vendor/vendorworktable");

      toast.success(
        id
          ? "Workeorder  Updated successfully"
          : "Workeorder  Added successfully",
        {
          position: "top-center",
          autoClose: 1000,
        }
      );
    } else {
      // Show an error toast
      toast.error(response.data.message, {
        position: "top-center",
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
      vendor: "",
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

      entries: [
        {
          part_qty: "",
          account_type: "",
          description: "",
          part_price: "",
          total_amount: "",
          dropdownOpen: false,
        },
      ],
    },

    onSubmit: (values) => {
      handleSubmit(values);
      //console.log(values, "values");
    },
  });

  const clearSelectedPhoto = (image) => {
    const filteredImage = workOrderImage.filter((item) => {
      return item !== image;
    });
    // console.log(filteredImage, "filteredImage");
    // setResidentialImage(filteredImage);
    setWorkOrderImage([...filteredImage]);

    WorkFormik.setFieldValue("workOrderImage", filteredImage);
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
    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...e.target.files,
    ]);

    const newFiles = [
      ...workOrderImage,
      ...Array.from(e.target.files).map((file) => URL.createObjectURL(file)),
    ];

    setWorkOrderImage(newFiles);
  };
  const editworkorder = async (vid) => {
    setLoader(true);
    let image = [];

    if (selectedFiles) {
      try {
        const uploadPromises = selectedFiles.map(async (fileItem, i) => {
          if (fileItem instanceof File) {
            try {
              const form = new FormData();
              form.append("files", fileItem);

              const res = await axios.post(`${imageUrl}/images/upload`, form);

              if (
                res &&
                res.data &&
                res.data.files &&
                res.data.files.length > 0
              ) {
                fileItem = res.data.files[0].filename;
                image[i] = res.data.files[0].filename;
              } else {
                console.error("Unexpected response format:", res);
              }
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          } else {
            image[i] = fileItem;
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Error processing file uploads:", error);
      }
    }

    const object = {
      workOrder: {
        // admin_id: accessType?.admin_id || "",
        workOrder_id: id,
        rental_id: WorkFormik.values.rental_id || "",
        unit_id: WorkFormik.values.unit_id || "",
        vendor_id: WorkFormik.values.vendor_id || "",
        tenant_id: WorkFormik.values.tenant_id || "",
        staffmember_id: WorkFormik.values.staffmember_id || "",
        work_subject: WorkFormik.values.work_subject || "",
        work_category: WorkFormik.values.work_category || "",
        entry_allowed:
          WorkFormik.values.entry_allowed === "Yes" ? true : false || "",
        work_performed: WorkFormik.values.work_performed || "",
        workOrder_images: image || "",
        vendor_notes: WorkFormik.values.vendor_note || "",
        priority: WorkFormik.values.priority || "",
        work_charge_to: WorkFormik.values.work_charge || "",
        status: WorkFormik.values.status || "",
        date: WorkFormik.values.due_date || "",
        // updated_by: { admin_id: accessType?.admin_id },
      },
      parts: WorkFormik.values.entries.map((item) => {
        return {
          parts_quantity: item.part_qty || 0,
          parts_id: item.parts_id,
          account: item.account_type || "",
          description: item.description || "",
          workOrder_id: id,
          charge_type: "Workorder Charge",
          parts_price: item.part_price || 0,
          amount: item.total_amount || 0,
        };
      }),
    };
    try {
      const res = await axios.put(
        `${baseUrl}/work-order/work-order/${id}`,
        object
      );
      console.log(res);
      navigate("/vendor/vendorworktable");
    } catch (error) { }
    setLoader(false);
  };
  // const fileData = async (file, name, index) => {
  //   //setImgLoader(true);
  //   const allData = [];
  //   const axiosRequests = [];
  //   console.log(file, "file after adding");

  //   for (let i = 0; i < file.length; i++) {
  //     // setImgLoader(true);
  //     const dataArray = new FormData();
  //     dataArray.append("b_video", file[i]);
  //     let url = "https://www.sparrowgroups.com/CDN/image_upload.php";

  //     // Push the Axios request promises into an array
  //     axiosRequests.push(
  //       axios
  //         .post(url, dataArray, {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         })
  //         .then((res) => {
  //           // setImgLoader(false);
  //           const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
  //           console.log(imagePath, "imagePath");
  //           allData.push(imagePath);
  //         })
  //         .catch((err) => {
  //           // setImgLoader(false);
  //           console.log("Error uploading image:", err);
  //         })
  //     );
  //   }
  //   console.log(allData, "allData");

  //   // Wait for all Axios requests to complete before logging the data
  //   await Promise.all(axiosRequests);

  //   if (workOrderImage && workOrderImage.length > 0) {
  //     setWorkOrderImage([...workOrderImage, ...allData]);
  //   } else {
  //     setWorkOrderImage([...allData]);
  //   }

  //   // console.log(allData, "allData");
  //   // console.log(residentialImage, "residentialImage");
  //   // console.log(commercialImage, "commercialImage");
  // };

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
  useEffect(() => {
    const fetchVendorNames = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `${baseUrl}/workorder/workorder/vendor/${id}`
          );
          const data = response.data;
          setSelectedVendor(data.vendor_name);
        } catch (error) {
          console.error("Error fetching vendor names:", error);
        }
      }
    };

    fetchVendorNames();
  }, []);

  return (
    <>
      <VendorHeader />
      {/* Page content */}
      <Container fluid style={{ marginTop: "4rem" }} >
        <Row>
          <Col className="order-xl-1" xl="12">
            {/* <Card
              className="bg-secondary shadow"
              onSubmit={WorkFormik.handleSubmit}
            > */}

            <CardHeader
              className=" mt-3 mx-5"
              style={{
                backgroundColor: "#152B51",
                borderRadius: "10px",
                boxShadow: " 0px 4px 4px 0px #00000040 ",
              }}
            >
              <h2
                className=""
                style={{
                  color: "#ffffff",
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  fontSize: "26px",
                }}
              >
                {id ? "Edit Work Order" : "New Work Order"}

              </h2>
            </CardHeader>
            <CardBody>
              <Form onSubmit={WorkFormik.handleSubmit}>
                <Box
                  // border="1px solid #ccc"
                  border="0.5px solid #737791"
                  borderRadius="8px"
                  padding="16px"
                  maxWidth="100%"
                  boxShadow=" 0px 4px 4px 0px #00000040"

                  margin="20px"
                >
                  <Box
                    // display="flex"
                    alignItems="center"
                    marginBottom="20px"
                  >
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-member"
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500" }}
                            >
                              Subject *
                            </label>
                            <br />
                            <br />
                            <Input
                              style={{
                                boxShadow: " 0px 4px 4px 0px #00000040 ", border: "0.5px solid #32456780"
                              }}
                              className="form-control-alternative"
                              id="input-work-subject"
                              placeholder="Add Subject"
                              type="text"
                              name="work_subject"
                              readOnly
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
                      <Row>
                        <Col>
                          {imagedetails > 0 ? (
                            <FormGroup
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <label
                                className="form-control-label"
                                htmlFor="input-unitadd"
                                style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500" }}

                              >
                                Photo
                              </label>
                              {/* <span
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
                                           
                                            onChange={(e) => {
                                              const file = [...e.target.files];
                                              fileData(
                                                file,
                                                "propertyres_image",
                      
                                              );

                                              if (file.length > 0) {
                                                const allImages = file.map(
                                                  (file) => {
                                                    return URL.createObjectURL(
                                                      file
                                                    );
                                                  }
                                                );
                                                // console.log(
                                                //   residentialIndex,
                                                //   "indexxxxxx"
                                                // );
                                                if (
                                                  workOrderImage && workOrderImage.length>0
                                                ) {
                                                  setWorkOrderImage([
                                                    ...workOrderImage, ...allImages,
                                                    ]);
                                                    WorkFormik.setFieldValue(
                                                      `workOrderImage`,
                                                      [...WorkFormik.values.workOrderImage,
                                                      ...allImages]
                                                    );
                                                } else {
                                                  setWorkOrderImage([
                                                    ...allImages,
                                                  ]);
                                                  WorkFormik.setFieldValue(
                                                    `workOrderImage`,
                                                    [...allImages]
                                                  )
                                                }
                                              } else {
                                                setWorkOrderImage([
                                                  ...workOrderImage
                                                ]);
                                                WorkFormik.setFieldValue(
                                                  `workOrderImage`,
                                                 [ ...WorkFormik.values.workOrderImage]
                                                )
                                                // )
                                              }
                                            }}
                                          />
                                          
                                          <label
                                            htmlFor={`workOrderImage`}
                                          >
                                            <b style={{ fontSize: "20px" }}>
                                              +
                                            </b>{" "}
                                            Add
                                          </label>
                                        </span> */}
                            </FormGroup>
                          ) : null}
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
                          {workOrderImage.map((image, index) => (
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
                                src={image}
                                alt=""
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  maxHeight: "100%",
                                  maxWidth: "100%",
                                  borderRadius: "10px",
                                }}
                                onClick={() => {
                                  setSelectedImage(image);
                                  setOpen(true);
                                }}
                              />
                              {/* <ClearIcon
                                                  style={{
                                                    cursor: "pointer",
                                                    alignSelf: "flex-start",
                                                    position: "absolute",
                                                    top: "-12px",
                                                    right: "-12px",
                                                  }}
                                                  onClick={() =>
                                                    clearSelectedPhoto(
                                                      // residentialIndex,
                                                      image,
                                                    )
                                                  }
                                                  
                                                /> */}
                            </div>
                          ))}
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
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500" }}
                            >
                              Property
                            </label>
                            <br />
                            <br />
                            <FormGroup>
                              <Dropdown
                                style={{
                                  boxShadow: " 0px 4px 4px 0px #00000040 ",
                                }}
                                isOpen={propdropdownOpen}
                                toggle={toggle1}
                                disabled={true}
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
                                  }}
                                >
                                  {propertyData.map((property) => (
                                    <DropdownItem
                                      key={property._id}
                                      onClick={() =>
                                        handlePropertySelect(
                                          property.rental_adress
                                        )
                                      }
                                    >
                                      {property.rental_adress}
                                    </DropdownItem>
                                  ))}
                                </DropdownMenu>
                              </Dropdown>
                            </FormGroup>
                          </FormGroup>
                        </Col>

                        <Col lg="4">
                          <Row>
                            {console.log(unitData, "mj")}

                            {selectedProp &&
                              unitData &&
                              unitData[0] &&
                              unitData[0].rental_units && (
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-unit"
                                    style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", marginLeft: "15px" }}

                                  >
                                    Unit *
                                  </label>
                                  <br />
                                  <br />
                                  <FormGroup style={{ marginLeft: "15px" }}>
                                    <Dropdown
                                      isOpen={unitDropdownOpen}
                                      toggle={toggle11}
                                      disabled={true}
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
                                      {/* {WorkFormik.errors &&
                                    WorkFormik.errors?.rental_units &&
                                    WorkFormik.touched &&
                                    WorkFormik.touched?.rental_units &&
                                    WorkFormik.values.rental_units === "" ? (
                                      <div style={{ color: "red" }}>
                                        {WorkFormik.errors.rental_units}
                                      </div>
                                    ) : null} */}
                                    </Dropdown>
                                  </FormGroup>
                                </FormGroup>
                              )}
                          </Row>
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
                              htmlFor="input-desg"
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500" }}
                            >
                              Category
                            </label>
                            <br />
                            <br />
                            <Dropdown
                              style={{
                                boxShadow: " 0px 4px 4px 0px #00000040 ",
                              }}
                              isOpen={categorydropdownOpen}
                              toggle={toggle2}
                              disabled={true}
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
                          </label>
                          <br />
                          <br />
                          <Dropdown
                            isOpen={vendordropdownOpen}
                            toggle={toggle3}
                            disabled={true}
                          >
                            <DropdownToggle caret style={{ width: "100%" }}>
                              {selectedVendor} &nbsp;&nbsp;&nbsp;&nbsp;
                            </DropdownToggle>
                            <DropdownMenu style={{ width: "100%" }}>
                              {Array.isArray(vendorNames) &&
                                vendorNames.map((vendor, index) => (
                                  <DropdownItem
                                    key={index}
                                    onClick={() => handleVendorSelect(vendor)}
                                  >
                                    {vendor}
                                  </DropdownItem>
                                ))}
                            </DropdownMenu>
                          </Dropdown>
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div> */}

                    {/* <div className="pl-lg-4">
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Invoice Number
                          </label>
                          <br />
                          <br />
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            placeholder="Add Number"
                            type="text"
                            name="invoice_number"
                            readOnly
                            //name="nput-staffmember-name"
                            onBlur={WorkFormik.handleBlur}
                            onChange={(e) => {
                              // Update the state or Formik values with the new input value
                              WorkFormik.handleChange(e);
                            }}
                            value={WorkFormik.values.invoice_number}
                          />
                          {WorkFormik.touched.invoice_number &&
                          WorkFormik.errors.invoice_number ? (
                            <div style={{ color: "red" }}>
                              {WorkFormik.errors.invoice_number}
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
                            Charge Work To
                          </label>
                          <br />
                          <br />
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            placeholder=""
                            type="text"
                            name="work_charge"
                            readOnly
                            //name="nput-staffmember-name"
                            onBlur={WorkFormik.handleBlur}
                            onChange={(e) => {
                              // Update the state or Formik values with the new input value
                              WorkFormik.handleChange(e);
                            }}
                            value={WorkFormik.values.work_charge}
                          />
                          {WorkFormik.touched.work_charge &&
                          WorkFormik.errors.work_charge ? (
                            <div style={{ color: "red" }}>
                              {WorkFormik.errors.work_charge}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div> */}

                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-desg"
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500" }}

                            >
                              Entry Allowed
                            </label>
                            <br />
                            <br />
                            <Dropdown
                              style={{
                                boxShadow: " 0px 4px 4px 0px #00000040 ",
                              }}
                              isOpen={entrydropdownOpen}
                              toggle={toggle4}
                              disabled={true}
                            >
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
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500" }}

                            >
                              Assigned To *
                            </label>
                            <br />
                            <br />
                            <FormGroup>
                              <Dropdown

                                isOpen={userdropdownOpen}
                                toggle={toggle5}
                                disabled={true}
                              >
                                <DropdownToggle caret style={{ boxShadow: " 0px 4px 4px 0px #00000040", }}>
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
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500" }}
                            >
                              Work To Be Performed
                            </label>
                            <br />
                            <br />
                            <Input
                              style={{
                                boxShadow: " 0px 4px 4px 0px #00000040 ", border: "0.5px solid #32456780"
                              }}
                              className="form-control-alternative"
                              id="input-name"
                              placeholder=""
                              type="textarea"
                              name="work_performed"
                              readOnly
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
                  </Box>
                </Box>

                <Box
                  // border="1px solid #ccc"
                  border="0.5px solid #737791"
                  borderRadius="8px"
                  padding="16px"
                  maxWidth="100%"
                  boxShadow=" 0px 4px 4px 0px #00000040"

                  margin="20px"
                >
                  <Box
                    // display="flex"
                    alignItems="center"
                    marginBottom="20px"
                  >
                    <div className="pl-lg-4">
                      <label className="form-control-label" htmlFor="input-desg" style={{ fontFamily: "Poppins", fontSize: "18px", fontWeight: "500", color: "#152B51" }}>
                        Parts and Labor
                      </label>
                      <Col lg="12">
                        <FormGroup>
                          <div className="table-responsive" style={{
                            boxShadow: " 0px 4px 4px 0px #00000040 ", border: "0.5px solid #32456780"
                          }}>
                            <Table
                              className="table table-bordered"
                              responsive
                              style={{
                                borderCollapse: "collapse",
                                // border: "1px solid #ddd",

                                // width: "100% !important",
                              }}
                            >
                              <thead style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#152B51" }}>
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
                                  <th style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#152B51" }}>Total</th>
                                  <th></th>
                                  <th></th>
                                  <th></th>
                                  <th style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#152B51" }}>{final_total_amount.toFixed(2)}</th>
                                </tr>
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td colSpan="4">
                                    <Button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={handleAddRow}
                                      style={{ backgroundColor: "#152B51", fontFamily: "Poppins", fontSize: "14px", fontWeight: "500", color: "white" }}
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
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500" }}
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
                              style={{
                                boxShadow: " 0px 4px 4px 0px #00000040 ", border: "0.5px solid #32456780"
                              }}
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
                        <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-desg"
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500" }}

                            >
                              Priority
                            </label>
                            <br />
                            <br />
                            <div style={{ display: "flex" }}>
                              <Col xs="3">
                                <Label check 
                                    style={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "400", color: "#152B514D" }}
                                
                                >
                                  <Input
                                    type="radio"
                                    name="priority"
                                    value="High"
                                    checked={selectedPriority === "High"}
                                    onChange={handlePriorityChange}
                                    disabled // Set disabled to make it readonly

                                  />
                                  High
                                </Label>
                              </Col>
                              &nbsp;
                              <Col xs="4">
                                <Label check
                                    style={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "400", color: "#152B514D" }}
                                
                                >
                                  <Input
                                    type="radio"
                                    name="priority"
                                    value="Medium"
                                    checked={selectedPriority === "Medium"}
                                    onChange={handlePriorityChange}
                                    disabled // Set disabled to make it readonly

                                  />
                                  Medium
                                </Label>
                              </Col>
                              &nbsp;
                              <Col xs="4">
                                <Label check 
                                    style={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "400", color: "#152B514D"}}
                                
                                >
                                  <Input
                                    type="radio"
                                    name="priority"
                                    value="Low"
                                    checked={selectedPriority === "Low"}
                                    onChange={handlePriorityChange}
                                    disabled // Set disabled to make it readonly

                                  />
                                  Low
                                </Label>
                              </Col>
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
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500" }}

                            >
                              Status
                            </label>
                            <br />
                            <br />
                            <FormGroup>
                              <Dropdown

                                isOpen={statusdropdownOpen}
                                toggle={toggle6}
                              >
                                <DropdownToggle caret style={{
                                  boxShadow: " 0px 4px 4px 0px #00000040",
                                }}>
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
                              </Dropdown>
                            </FormGroup>
                          </FormGroup>
                        </Col>
                        <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-unitadd"
                              style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500" }}
                            >
                              Due Date
                            </label>
                            <br />
                            <br />
                            <Input
                              style={{
                                boxShadow: " 0px 4px 4px 0px #00000040",
                              }}
                              className="form-control-alternative"
                              id="input-unitadd"
                              type="date"
                              name="due_date"
                              onBlur={WorkFormik.handleBlur}
                              onChange={WorkFormik.handleChange}
                              value={WorkFormik.values.due_date}
                              readOnly
                            />
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
                  </Box>
                </Box>
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
                    className=" mx-3 btn btn-primary"
                    style={{
                      backgroundColor: "#152B51", cursor: "pointer", fontFamily: "Poppins", fontSize: "14px", fontWeight: "400",
                      boxShadow: " 0px 4px 4px 0px #00000040 ",

                    }}
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
                    onSubmit={{ handleSubmit }}
                    className=" btn btn-primary mx-3"
                    style={{
                      backgroundColor: "#152B51", fontFamily: "Poppins", fontSize: "14px", fontWeight: "400",
                      boxShadow: " 0px 4px 4px 0px #00000040 ",

                    }}
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
                  style={{
                    background: "white", color: "#152B51", fontFamily: "Poppins", fontSize: "14px", fontWeight: "400",
                    boxShadow: " 0px 4px 4px 0px #00000040 ",

                  }}
                >
                  Cancel
                </button>
              </Form>
              <br />
            </CardBody>
            {/* </Card> */}
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
};

export default VendorAddWork;
