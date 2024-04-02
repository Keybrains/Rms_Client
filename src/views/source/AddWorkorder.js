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
import { jwtDecode } from "jwt-decode";
import { OpenImageDialog } from "components/OpenImageDialog";

const AddWorkorder = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_POST_URL;
  const imageGetUrl = process.env.REACT_APP_IMAGE_GET_URL;

  const { id, admin } = useParams();

  const [propdropdownOpen, setpropdropdownOpen] = useState(false);
  const [categorydropdownOpen, setcategorydropdownOpen] = useState(false);
  const [vendordropdownOpen, setvendordropdownOpen] = useState(false);
  const [chargedropdownOpen, setchargedropdownOpen] = useState(false);
  const [tenantdownOpen, settenantdownOpen] = useState(false);
  const [entrydropdownOpen, setentrydropdownOpen] = useState(false);
  const [userdropdownOpen, setuserdropdownOpen] = useState(false);
  const [statusdropdownOpen, setstatusdropdownOpen] = useState(false);
  const [selectedProp, setSelectedProp] = useState("Select here...");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Select here...");
  const [selectedVendor, setSelectedVendor] = useState("Select here...");
  const [selectedCharge, setSelectedCharge] = useState("Select here...");
  const [selectedTenant, setSelectedTenant] = useState("Select here...");
  const [selectedEntry, setSelectedEntry] = useState("Select here...");
  const [selecteduser, setSelecteduser] = useState("Select here...");
  const [selectedStatus, setSelectedStatus] = useState("New");
  const [unitData, setUnitData] = useState([]);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);

  const toggle1 = () => setpropdropdownOpen((prevState) => !prevState);
  const toggle2 = () => setcategorydropdownOpen((prevState) => !prevState);
  const toggle3 = () => setvendordropdownOpen((prevState) => !prevState);
  const toggle4 = () => setentrydropdownOpen((prevState) => !prevState);
  const toggle5 = () => setuserdropdownOpen((prevState) => !prevState);
  const toggle6 = () => setstatusdropdownOpen((prevState) => !prevState);
  const toggle7 = () => setchargedropdownOpen((prevState) => !prevState);
  const toggle8 = () => settenantdownOpen((prevState) => !prevState);
  const toggle11 = () => {
    setUnitDropdownOpen((prevState) => !prevState);
  };
  const toggleDropdown = (index) => {
    const updatedEntries = [...WorkFormik.values.entries];
    updatedEntries[index].dropdownOpen = !updatedEntries[index].dropdownOpen;
    WorkFormik.setValues({
      ...WorkFormik.values,
      entries: updatedEntries,
    });
  };

  const [accessType, setAccessType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const [propertyData, setPropertyData] = useState([]);
  const [staffData, setstaffData] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [allVendors, setAllVendors] = useState([]);
  const [workOrderImage, setWorkOrderImage] = useState([]);

  const fetchUnitsByProperty = async (propertyType) => {
    if (propertyType) {
      try {
        const response = await axios.get(
          `${baseUrl}/unit/rental_unit/${propertyType}`
        );

        const units = response?.data?.data || [];

        return units;
      } catch (error) {
        console.error("Error fetching units:", error);
        return [];
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

  const handlePropertyTypeSelect = async (property) => {
    setSelectedProp(property.rental_adress);
    WorkFormik.values.rental_adress = property?.rental_adress;
    WorkFormik.values.rental_id = property?.rental_id;
    setSelectedUnit("");
    try {
      const units = await fetchUnitsByProperty(property.rental_id);
      setUnitData(units);
    } catch (error) {
      console.error("Error handling selected property:", error);
    }
  };

  const handleUnitSelect = (selectedUnit, unitId) => {
    setSelectedUnit(selectedUnit);
    WorkFormik.values.rental_unit = selectedUnit;
    WorkFormik.setFieldValue("unit_id", unitId);
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
    setSelectedVendor(value.vendor_name);
    WorkFormik.values.vendor_name = value?.vendor_name;
    WorkFormik.values.vendor_id = value?.vendor_id;
  };

  const handleEntrySelect = (value) => {
    setSelectedEntry(value);
    WorkFormik.values.entry_allowed = value;
  };

  const handleChargeSelect = (value) => {
    setSelectedCharge(value);
    WorkFormik.values.work_charge = value;
  };

  const handleStaffSelect = (staff) => {
    setSelecteduser(staff.staffmember_name);
    WorkFormik.values.staffmember_name = staff?.staffmember_name;
    WorkFormik.values.staffmember_id = staff?.staffmember_id;
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    WorkFormik.values.status = status;
  };

  const handlePriorityChange = (event) => {
    setSelectedPriority(event.target.value);
    WorkFormik.values.priority = event.target.value;
  };

  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    navigate("/" + admin + "/Workorder");
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
    updatedEntries.splice(index, 1);
    WorkFormik.setValues({
      ...WorkFormik.values,
      entries: updatedEntries,
    });
  };

  const setVendorsName = () => {
    axios
      .get(`${baseUrl}/vendor/vendors/${accessType?.admin_id}`)
      .then((res) => {
        setAllVendors(res.data?.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [workOrderData, setWorkOrderData] = useState(null);
  const [vid, setVid] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
          } = response?.data?.data;
          setWorkOrderData(response?.data?.data);

          const formattedDueDate = response?.data?.data?.date
            ? new Date(response?.data?.data?.date).toISOString().split("T")[0]
            : "";

          setVid(response?.data?.data?.workOrder_id);

          try {
            const units = await fetchUnitsByProperty(property_data?.rental_id);
            setUnitData(units);
          } catch (error) {
            console.error(error, "error");
          }

          setSelectedUnit(unit_data?.rental_unit || "Select");
          setSelectedProp(property_data?.rental_adress || "Select");
          setSelectedCategory(response?.data?.data?.work_category || "Select");
          setSelectedVendor(vendor_data?.vendor_name || "Select");
          setSelectedCharge(response?.data?.data?.work_charge_to || "Select");
          setSelectedEntry(
            response?.data?.data?.entry_allowed === true ? "Yes" : "No" || "Select"
          );
          setSelecteduser(staff_data?.staffmember_name || "Select");
          setSelectedStatus(response?.data?.data?.status || "Select");
          setSelectedPriority(response?.data?.data?.priority || "Select");
          setWorkOrderImage(response?.data?.data?.workOrder_images || []);
          setSelectedFiles(response?.data?.data?.workOrder_images || []);
          setSelectedTenant(
            tenant_data?.tenant_firstName + " " + tenant_data?.tenant_lastName ||
            "Select"
          );

          WorkFormik.setValues({
            invoice_number: response?.data?.data?.invoice_number || "",
            work_charge_to: response?.data?.data?.work_charge_to || "",
            detail: response?.data?.data?.detail || "",
            entry_contact: response?.data?.data?.entry_contact || "",
            final_total_amount: response?.data?.data?.final_total_amount || "",

            work_subject: response?.data?.data?.work_subject || "",
            rental_adress: property_data?.rental_adress || "",
            rental_unit: unit_data?.rental_unit || "",
            rental_id: property_data?.rental_id || "",
            work_category: response?.data?.data?.work_category || "",
            vendor_name: vendor_data?.vendor_name || "",
            vendor_id: vendor_data?.vendor_id || "",
            unit_id: unit_data?.unit_id || "",
            tenant_id: tenant_data?.tenant_id || "",
            tenant_name:
              tenant_data?.tenant_firstName +
              " " +
              tenant_data?.tenant_lastName || "",
            invoice_number: "",
            work_charge: response?.data?.data?.work_charge_to || "",
            entry_allowed:
              response?.data?.data?.entry_allowed === true ? "Yes" : "No" || "",
            detail: "",
            entry_contact: "",
            work_performed: response?.data?.data?.work_performed || "",
            vendor_note: response?.data?.data?.vendor_notes || "",
            staffmember_name: staff_data?.staffmember_name || "",
            staffmember_id: staff_data?.staffmember_id || "",
            status: response?.data?.data?.status || "",
            due_date: formattedDueDate || "",
            priority: response?.data?.data?.priority || "",
            workOrderImage: response?.data?.data?.workOrder_images || "",
            final_total_amount: "",
            statusUpdatedBy: "Admin",
            entries: partsandcharge_data?.map((part) => ({
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

  const [loader, setLoader] = useState(false);

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
                res.data?.files &&
                res.data?.files.length > 0
              ) {
                fileItem = res.data?.files[0].filename;
                image[i] = res.data?.files[0].filename;
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
        admin_id: accessType?.admin_id || "",
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
        if (res.data?.statusCode === 200) {
          toast.success("Work Order Added Successfully.", {
            position: "top-center",
            autoClose: 1000,
            // onClose: () => navigate(`/${admin}/Workorder`),
          });
          setTimeout(() => {
            navigate("/" + admin + "/Workorder");
          }, 2000);
        } else {
          console.log(res.data, "res.data");
          toast.error(res.data?.message, {
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

  const WorkFormik = useFormik({
    initialValues: {
      work_subject: "",
      rental_adress: "",
      rental_unit: "",
      rental_id: "",
      work_category: "",
      vendor_name: "",
      vendor_id: "",
      unit_id: "",
      tenant_name: "",
      tenant_id: "",
      invoice_number: "",
      work_charge: "",
      entry_allowed: "",
      detail: "",
      entry_contact: "",
      work_performed: "",
      vendor_note: "",
      staffmember_name: "",
      staffmember_id: "",
      status: "New",
      due_date: "",
      priority: "",
      final_total_amount: "",
      workOrderImage: [],
      statusUpdatedBy: "Admin",
      entries: [
        {
          part_qty: "",
          account_type: "",
          description: "",
          part_price: "",
          charge_type: "Workorder Charge",
          total_amount: "",
          dropdownOpen: false,
        },
      ],
    },

    validationSchema: yup.object({
      rental_adress: yup.string().required("Required"),
      vendor_name: yup.string().required("Required"),
      staffmember_name: yup.string().required("Required"),
      work_category: yup.string().required("Required"),
      status: yup.string().required("Required"),
    }),

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const clearSelectedPhoto = (index, name) => {
    if (name === "propertyres_image") {
      const filteredImage = workOrderImage.filter((item, i) => i !== index);
      const filteredImage2 = selectedFiles.filter((item, i) => i !== index);
      setSelectedFiles(filteredImage2);
      setWorkOrderImage(filteredImage);
    }
  };

  const fetchPropertyData = async () => {
    if (accessType?.admin_id) {
      try {
        const res = await axios.get(
          `${baseUrl}/rentals/rentals/${accessType?.admin_id}`
        );
        if (res.data?.statusCode === 200) {
          setPropertyData(res.data?.data);
        } else if (res.data?.statusCode === 201) {
          setPropertyData([]);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  };
  const fetchStaffData = () => {
    fetch(`${baseUrl}/staffmember/staff_member/${accessType?.admin_id}`)
      .then((response) => response?.json())
      .then((data) => {
        if (data?.statusCode === 200) {
          setstaffData(data?.data);
          console.log(data?.data, "---------------------------------");
        } else {
          console.error("Error:", data?.message);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  };

  useEffect(() => {
    fetchPropertyData();
    setVendorsName();
    fetchStaffData();
  }, [accessType?.admin_id]);

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

  const isBlobURL = (url) => {
    return url.startsWith("blob:");
  };

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

  let final_total_amount = 0;
  WorkFormik.values.entries.forEach((entries) => {
    if (entries.total_amount) {
      final_total_amount += parseFloat(entries.total_amount);
    }
  });

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
                res.data?.files &&
                res.data?.files.length > 0
              ) {
                fileItem = res.data?.files[0].filename;
                image[i] = res.data?.files[0].filename;
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
        admin_id: accessType?.admin_id || "",
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
        updated_by: { admin_id: accessType?.admin_id },
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
      if (res.data?.statusCode === 200) {
        toast.success("Workorder Updated Successfully", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate("/" + admin + "/Workorder");
        }, 2000);
      } else {
        toast.warning(res.data?.message, {
          position: "top-center",
          autoClose: 1000,
        });
      }
      console.log(res);
    } catch (error) { }
    setLoader(false);
  };

  const [isDisplay, setIsDisplay] = useState("false");
  useEffect(() => {
    if (WorkFormik?.values?.entries[0]?.account_type) {
      setIsDisplay("true");
    } else {
      setIsDisplay("false");
    }
  }, [WorkFormik]);

  const [tenantsDetails, setTenantsDetails] = useState([]);
  const getPropertyData = async (rental_id, unit_id) => {
    if (rental_id && unit_id) {
      setTenantsDetails([]);
      try {
        const response = await axios.get(
          `${baseUrl}/leases/get_tenants/${rental_id}/${unit_id}`
        );
        setTenantsDetails(response?.data?.data);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
      }
    }
  };

  const getTenantData = async () => {
    if (
      selectedCharge === "Tenant" &&
      WorkFormik.values.rental_id &&
      WorkFormik.values.unit_id
    ) {
      const rental_id = WorkFormik.values.rental_id;
      const unit_id = WorkFormik.values.unit_id;
      getPropertyData(rental_id, unit_id);
    } else {
      setTenantsDetails([]);
    }
  };

  useEffect(() => {
    getTenantData();
  }, [selectedCharge, selectedUnit, selectedProp]);

  return (
    <>
      {/* <AddWorkorderHeader /> */}

      <Container className="" fluid style={{ marginTop: "4rem", height: "100vh" }}>

        <Col xs="12" lg="12" sm="6">
          <CardHeader
            className=" mt-3 mx-2"
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
              {id ? "Edit Work Order" : "Add Work Order"}

            </h2>
          </CardHeader>
        </Col>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-white shadow mt-3 mx-4 " style={{ boxShadow: " 0px 4px 4px 0px #00000040", border: "1px solid #324567" }}
              onSubmit={WorkFormik.handleSubmit}
            >
              <CardBody>
                <Form>
                  <div className="">
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-member"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Subject *
                          </label>
                          <br />
                          <Input
                            style={{
                              boxShadow: " 0px 4px 4px 0px #00000040 ",
                              borderRadius: "6px",
                              width: "60%",
                            }}
                            className="form-control-alternative"
                            id="work_subject"
                            placeholder="Enter subject here..."
                            type="text"
                            name="work_subject"
                            onBlur={WorkFormik.handleBlur}
                            onChange={(e) => {
                              WorkFormik.handleChange(e);
                            }}
                            value={WorkFormik.values.work_subject}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="mt-2">
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
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
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
                            <input
                              type="file"
                              className="form-control-file d-none"
                              accept="image/*"
                              multiple
                              id={`workOrderImage`}
                              name={`workOrderImage`}
                              onChange={(e) => fileData(e)}
                            />
                            <label className="d-flex justify-content-center" htmlFor={`workOrderImage`} 
                              style={{
                                fontFamily: "Poppins", fontSize: "14px", fontWeight: "400", color: "white", backgroundColor: "#152B51", borderRadius: "6px", padding: "5px",
                                boxShadow: " 0px 4px 4px 0px #00000040",

                              }}
                            >
                              {/* <b style={{ fontSize: "20px" }}>+</b> Add */}
                              Upload 
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
                        className=" d-flex"
                        style={{
                          justifyContent: "center",
                          flexWrap: "wrap",
                          overflow: "auto",
                        }}
                      >
                        <div className="d-flex">
                          {workOrderImage &&
                            workOrderImage.length > 0 &&
                            workOrderImage.map((unitImg, index) => (
                              <div
                                key={index}
                                style={{
                                  position: "relative",
                                  width: "100px",
                                  height: "100px",
                                  display: "flex",
                                  flexDirection: "column",
                                  marginRight: "20px",
                                }}
                              >
                                <img
                                  src={
                                    !isBlobURL(unitImg)
                                      ? `${imageGetUrl}/${unitImg}`
                                      : unitImg
                                  }
                                  alt=""
                                  style={{
                                    width: "150px",
                                    height: "150px",
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
                                    top: "-6px",
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
                  </div>

                  <div className="">
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Property *
                          </label>
                          <FormGroup>
                            <Dropdown
                              isOpen={propdropdownOpen}
                              toggle={toggle1}
                              onBlur={WorkFormik.handleBlur}
                            >
                              <DropdownToggle caret style={{
                                width: "100%", boxShadow: " 0px 4px 4px 0px #00000040",
                                border: "1px solid #ced4da",

                                backgroundColor: "transparent",
                                color: "#A7A7A7"
                              }}>
                                {selectedProp
                                  ? selectedProp
                                  : "Select a property..."}
                                &nbsp;&nbsp;&nbsp;&nbsp;
                              </DropdownToggle>
                              <DropdownMenu

                                style={{
                                  width: "max-content",
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

                      <Col lg="4">
                        {selectedProp &&
                          unitData &&
                          unitData[0] &&
                          unitData[0].rental_unit && (
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-unit"
                                style={{
                                  // marginBottom: "10px",
                                  fontWeight: "500",
                                  fontFamily: "Poppins",
                                  fontSize: "16px",
                                  color: "#8A95A8",
                                }}
                              >
                                Unit *
                              </label>
                              <FormGroup>
                                <Dropdown
                                  isOpen={unitDropdownOpen}
                                  toggle={toggle11}
                                >
                                  <DropdownToggle caret style={{
                                    width: "100%", boxShadow: " 0px 4px 4px 0px #00000040",
                                    border: "1px solid #ced4da",

                                    backgroundColor: "transparent",
                                    color: "#A7A7A7"
                                  }}>
                                    {selectedUnit
                                      ? selectedUnit
                                      : "Select Unit"}
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    {unitData.length > 0 ? (
                                      unitData.map((unit) => (
                                        <DropdownItem
                                          key={unit.unit_id}
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
                  </div>

                  <div className="">
                    <Row className="mt-2">
                      <Col lg="2">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                            style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#8A95A8" }}

                          >
                            Category *
                          </label>
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

                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                            style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#8A95A8" }}

                          >
                            Vendor *
                          </label>
                          <br />
                          <Dropdown
                            isOpen={vendordropdownOpen}
                            toggle={toggle3}
                          >
                            <DropdownToggle caret style={{
                              width: "100%", boxShadow: " 0px 4px 4px 0px #00000040",
                              border: "1px solid #ced4da",
                              backgroundColor: "transparent",
                              color: "#A7A7A7"
                            }}>
                              {selectedVendor} &nbsp;&nbsp;&nbsp;&nbsp;
                            </DropdownToggle>
                            <DropdownMenu style={{ width: "100%" }}>
                              {allVendors?.map((vendor, index) => (
                                <DropdownItem
                                  key={index}
                                  onClick={() => handleVendorSelect(vendor)}
                                >
                                  {vendor.vendor_name}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                            {WorkFormik.errors &&
                              WorkFormik.errors?.vendor_name &&
                              WorkFormik.touched &&
                              WorkFormik.touched?.vendor_name &&
                              WorkFormik.values.vendor_name === "" ? (
                              <div style={{ color: "red" }}>
                                {WorkFormik.errors.vendor_name}
                              </div>
                            ) : null}
                          </Dropdown>
                        </FormGroup>
                      </Col>

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
                            style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#8A95A8" }}

                          >
                            Other Category
                          </label>
                          <br />

                          <Input
                            style={{
                              boxShadow: " 0px 4px 4px 0px #00000040 ",
                              borderRadius: "6px",
                              width: "60%",
                            }}
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
                    </Row>
                  </div>

                  <div className="">
                    <Row className="mt-2">
                      <Col lg="2">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                            style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#8A95A8" }}

                          >
                            Entry Allowed
                          </label>
                          <br />
                          <Dropdown isOpen={entrydropdownOpen} toggle={toggle4}

                          >
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
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                            style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#8A95A8" }}

                          >
                            Assigned To *
                          </label>
                          <br />
                          <FormGroup>
                            <Dropdown
                              isOpen={userdropdownOpen}
                              toggle={toggle5}
                            >
                              <DropdownToggle caret style={{
                                width: "100%", boxShadow: " 0px 4px 4px 0px #00000040",
                                border: "1px solid #ced4da",
                                backgroundColor: "transparent",
                                color: "#A7A7A7"
                              }}>
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
                                    onClick={() => handleStaffSelect(user)}
                                  >
                                    {user.staffmember_name}
                                  </DropdownItem>
                                ))}
                              </DropdownMenu>
                              {WorkFormik.errors &&
                                WorkFormik.errors?.staffmember_name &&
                                WorkFormik.touched &&
                                WorkFormik.touched?.staffmember_name ? (
                                <div style={{ color: "red" }}>
                                  {WorkFormik.errors.staffmember_name}
                                </div>
                              ) : null}
                            </Dropdown>
                          </FormGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <div className="">
                    <Row className="mt-2">
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
                          <Input
                            style={{
                              boxShadow: " 0px 4px 4px 0px #00000040 ",
                              borderRadius: "6px",
                            }}
                            className="form-control-alternative"
                            id="input-name"
                            placeholder="Enter here..."
                            type="textarea"
                            name="work_performed"
                            onBlur={WorkFormik.handleBlur}
                            onChange={(e) => {
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
                  </div>
                </Form>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-white shadow mt-3 mb-3 mx-4 " style={{ boxShadow: " 0px 4px 4px 0px #00000040", border: "1px solid #324567" }}

            >
              <CardBody>
                <Form>
                  <div className="">
                    <label
                      className="form-control-label "
                      htmlFor="input-desg"
                      style={{ fontFamily: "Poppins", fontSize: "18px", fontWeight: "600", color: "#152B51" }}

                    >
                      Parts and Labor
                    </label>
                    <Col lg="12" >
                      <FormGroup>
                        <div className="table-responsive">
                          <Table
                            className="table table-bordered"
                            responsive
                            style={{
                              borderCollapse: "collapse",
                              border: "1px solid #152B51",
                              overflow: "hidden",
                              boxShadow: " 0px 4px 4px 0px #00000040",
                            }}
                          >
                            <thead className="">
                              <tr style={{
                                fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#152B51",
                                border: "1px solid #152B51",

                              }}>
                                <th style={{
                                  fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#152B51",
                                  border: "1px solid #152B51",

                                }}>Qty</th>
                                <th style={{
                                  fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#152B51",
                                  border: "1px solid #152B51",

                                }}>Account</th>
                                <th style={{
                                  fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#152B51",
                                  border: "1px solid #152B51",

                                }}>Description</th>
                                <th style={{
                                  fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#152B51",
                                  border: "1px solid #152B51",

                                }}>Price</th>
                                <th style={{
                                  fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#152B51",
                                  border: "1px solid #152B51",

                                }}>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {WorkFormik.values.entries?.map(
                                (entry, index) => (
                                  <tr key={index} style={{
                                    border: "1px solid #152B51",
                                  }}>
                                    <td style={{
                                      border: "1px solid #152B51",
                                    }}>
                                      <Input
                                        style={{
                                          boxShadow: " 0px 4px 4px 0px #00000040 ",
                                          borderRadius: "6px",
                                        }}
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
                                    <td style={{
                                      border: "1px solid #152B51",
                                    }}>
                                      <Dropdown
                                        isOpen={entry.dropdownOpen}
                                        toggle={() => toggleDropdown(index)}
                                      >
                                        <DropdownToggle
                                          caret
                                          style={{
                                            width: "100%", boxShadow: " 0px 4px 4px 0px #00000040",
                                            border: "1px solid #ced4da",
                                            backgroundColor: "transparent",
                                            color: "#A7A7A7"
                                          }}
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
                                    <td style={{
                                      border: "1px solid #152B51",
                                    }}>
                                      <Input
                                        style={{
                                          boxShadow: " 0px 4px 4px 0px #00000040 ",
                                          borderRadius: "6px",
                                        }}
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
                                    <td style={{
                                      border: "1px solid #152B51",
                                    }}>
                                      <Input
                                        style={{
                                          boxShadow: " 0px 4px 4px 0px #00000040 ",
                                          borderRadius: "6px",
                                        }}
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
                                    <td style={{
                                      border: "1px solid #152B51",
                                    }}>
                                      <Input
                                        style={{
                                          boxShadow: " 0px 4px 4px 0px #00000040 ",
                                          borderRadius: "6px",
                                        }}
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
                                    <td style={{
                                      border: "1px solid #152B51",
                                    }}>
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
                              <tr style={{
                                border: "1px solid #152B51",
                              }}>
                                <th style={{
                                  fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#152B51",
                                  border: "1px solid #152B51",

                                }}>Total</th>
                                <th style={{
                                  border: "1px solid #152B51",
                                }}></th>
                                <th style={{
                                  border: "1px solid #152B51",
                                }}></th>
                                <th style={{
                                  border: "1px solid #152B51",
                                }}></th>
                                <th style={{
                                  fontFamily: "Poppins", fontSize: "16px", fontWeight: "500", color: "#152B51",
                                  border: "1px solid #152B51",

                                }}>{final_total_amount.toFixed(2)}</th>
                              </tr>
                            </tbody>
                            {/* <tfoot>
                              <tr >
                                <td colSpan="4" style={{
                                  border: "1px solid #152B51",
                                }}>
                                  <Button
                                    type="button"
                                    className="btn"
                                    onClick={handleAddRow}
                                    style={{ color: "white", backgroundColor: "#152B51" }}
                                  >
                                    Add Row
                                  </Button>
                                </td>
                              </tr>
                            </tfoot> */}
                          </Table>
                        </div>
                      </FormGroup>
                    </Col>
                  </div>
                  <div className="pl-lg-2">

                  <Button
                    type="button"
                    className="btn"
                    onClick={handleAddRow}
                    style={{ color: "white", backgroundColor: "#152B51" }}
                  >
                    Add Row
                  </Button>
                  </div>
                  <div >
                    <Row className="mt-3">
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-member"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}

                          >
                            Vendor Notes
                          </label>
                          <br />
                          <Input
                            style={{
                              boxShadow: " 0px 4px 4px 0px #00000040 ",
                              borderRadius: "6px",
                            }}
                            className="form-control-alternative"
                            id="input-name"
                            placeholder="Enter here..."
                            type="textarea"
                            name="vendor_note"
                            onBlur={WorkFormik.handleBlur}
                            onChange={(e) => {
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
                  </div>

                  <div >
                    <Row>
                      {isDisplay === "true" ? (
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-desg"
                              style={{
                                // marginBottom: "10px",
                                fontWeight: "500",
                                fontFamily: "Poppins",
                                fontSize: "16px",
                                color: "#8A95A8",
                              }}
                            >
                              Charge Work To
                            </label>
                            <br />
                            <Dropdown
                              isOpen={chargedropdownOpen}
                              toggle={toggle7}
                            >
                              <DropdownToggle caret style={{
                                width: "100%", boxShadow: " 0px 4px 4px 0px #00000040",
                                border: "1px solid #ced4da",

                                backgroundColor: "transparent",
                                color: "#A7A7A7"
                              }}>
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
                                style={{
                                  // marginBottom: "10px",
                                  fontWeight: "500",
                                  fontFamily: "Poppins",
                                  fontSize: "16px",
                                  color: "#8A95A8",
                                }}
                              >
                                Tenant
                              </label>
                              <br />
                              <Dropdown
                                isOpen={tenantdownOpen}
                                toggle={toggle8}
                              >
                                <DropdownToggle caret style={{
                                  width: "100%", boxShadow: " 0px 4px 4px 0px #00000040",
                                  border: "1px solid #ced4da",

                                  backgroundColor: "transparent",
                                  color: "#A7A7A7"
                                }}>
                                  {selectedTenant} &nbsp;&nbsp;&nbsp;&nbsp;
                                </DropdownToggle>
                                <DropdownMenu style={{ width: "100%" }}>
                                  {tenantsDetails?.map((item) => (
                                    <DropdownItem
                                      key={item?.tenant_id}
                                      onClick={() => {
                                        setSelectedTenant(
                                          item?.tenant_firstName +
                                          " " +
                                          item?.tenant_lastName
                                        );
                                        WorkFormik.setFieldValue(
                                          "tenant_name",
                                          item?.tenant_firstName +
                                          " " +
                                          item?.tenant_lastName
                                        );
                                        WorkFormik.setFieldValue(
                                          "tenant_id",
                                          item?.tenant_id
                                        );
                                      }}
                                    >
                                      {item?.tenant_firstName +
                                        " " +
                                        item?.tenant_lastName}
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

                  <div >
                    <Row className="mt-2">
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Priority
                          </label>
                          <br />
                          <div className="pl-lg-4">
                            <Row>
                              <Col xs="3">
                                <Label check style={{
                                  // marginBottom: "10px",
                                  fontWeight: "400",
                                  fontFamily: "Poppins",
                                  fontSize: "14px",
                                  color: "#152B514D",
                                }}>
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
                                <Label check
                                  style={{
                                    // marginBottom: "10px",
                                    fontWeight: "400",
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    color: "#152B514D",
                                  }}
                                >
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
                              &nbsp; &nbsp;
                              <Col xs="4">
                                <Label check
                                  style={{
                                    // marginBottom: "10px",
                                    fontWeight: "400",
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    color: "#152B514D",
                                  }}
                                >
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

                  <div className="">
                    <Row className="mt-3">
                      <Col lg="2">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Status *
                          </label>
                          <br />
                          <FormGroup>
                            <Dropdown
                              isOpen={statusdropdownOpen}
                              toggle={toggle6}
                            >
                              <DropdownToggle caret style={{
                                width: "100%", boxShadow: " 0px 4px 4px 0px #00000040",
                                border: "1px solid #ced4da",

                                backgroundColor: "transparent",
                                color: "#A7A7A7"
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
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Due Date
                          </label>
                          <br />
                          <Input
                            style={{
                              boxShadow: " 0px 4px 4px 0px #00000040 ",
                              borderRadius: "6px",
                              width: "60%",
                            }}
                            className="form-control-alternative"
                            id="input-unitadd"
                            type="date"
                            name="due_date"
                            onBlur={WorkFormik.handleBlur}
                            onChange={WorkFormik.handleChange}
                            value={WorkFormik.values.due_date}
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
                  </div>

                  <div className="mt-3">

                    {loader ? (
                      <Button
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: "#152B51", cursor: "not-allowed", color: "white" }}
                        disabled
                      >
                        Loading...
                      </Button>
                    ) : id ? (
                      <Button
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: "#152B51", cursor: "pointer", color: "white" }}
                        onClick={(e) => {
                          e.preventDefault();
                          editworkorder(vid);
                        }}
                      >
                        Update Work Order
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="btn "
                        style={{ backgroundColor: "#152B51", cursor: "pointer", color: "white" }}
                        disabled={!WorkFormik.isValid}
                      >
                        Add Work Order
                      </Button>
                    )}
                    <Button
                      // color="primary"
                      className="btn"
                      onClick={handleCloseButtonClick}
                      size="small"
                      style={{ backgroundColor: "white", color: "#152B51" }}

                    >
                      Cancel
                    </Button>
                  </div>
                  {/* Conditional message */}
                  {!WorkFormik.isValid && (
                    <div style={{ color: "red", marginTop: "10px" }}>
                      Please fill in all fields correctly.
                    </div>
                  )}

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
