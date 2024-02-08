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
  const imageUrl = process.env.REACT_APP_IMAGE_URL;

  const { id, admin } = useParams();

  const [propdropdownOpen, setpropdropdownOpen] = useState(false);
  const [categorydropdownOpen, setcategorydropdownOpen] = useState(false);
  const [vendordropdownOpen, setvendordropdownOpen] = useState(false);
  const [chargedropdownOpen, setchargedropdownOpen] = useState(false);
  const [tenantdownOpen, settenantdownOpen] = useState(false);
  const [entrydropdownOpen, setentrydropdownOpen] = useState(false);
  const [userdropdownOpen, setuserdropdownOpen] = useState(false);
  const [statusdropdownOpen, setstatusdropdownOpen] = useState(false);
  const [selectedProp, setSelectedProp] = useState("Select");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Select");
  const [selectedVendor, setSelectedVendor] = useState("Select");
  const [selectedCharge, setSelectedCharge] = useState("Select");
  const [selectedTenant, setSelectedTenant] = useState("Select");
  const [selectedEntry, setSelectedEntry] = useState("Select");
  const [selecteduser, setSelecteduser] = useState("Select");
  const [selectedStatus, setSelectedStatus] = useState("Select");
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
    try {
      const response = await axios.get(
        `${baseUrl}/unit/rental_unit/${propertyType}`
      );

      const units = response.data.data || [];

      return units;
    } catch (error) {
      console.error("Error fetching units:", error);
      return [];
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
    WorkFormik.values.rental_adress = property.rental_adress;
    WorkFormik.values.rental_id = property.rental_id;
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
    WorkFormik.values.vendor_name = value.vendor_name;
    WorkFormik.values.vendor_id = value.vendor_id;
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
    WorkFormik.values.staffmember_name = staff.staffmember_name;
    WorkFormik.values.staffmember_id = staff.staffmember_id;
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
      .get(`${baseUrl}/vendor//vendors/${accessType?.admin_id}`)
      .then((res) => {
        setAllVendors(res.data.data);
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
            `${baseUrl}/work-order/work-order/${id}`
          );
          const {
            workOrderData,
            partsData,
            rentalAdress,
            rentalUnit,
            staffMember,
            vendor,
            tenantData,
          } = response.data.data;
          setWorkOrderData(workOrderData);

          const formattedDueDate = workOrderData.date
            ? new Date(workOrderData.date).toISOString().split("T")[0]
            : "";

          setVid(workOrderData.workOrder_id);

          try {
            const units = await fetchUnitsByProperty(rentalAdress.rental_id);
            setUnitData(units);
          } catch (error) {
            console.error(error, "error");
          }

          setSelectedUnit(rentalUnit.rental_unit || "Select");
          setSelectedProp(rentalAdress.rental_adress || "Select");
          setSelectedCategory(workOrderData.work_category || "Select");
          setSelectedVendor(vendor.vendor_name || "Select");
          setSelectedCharge(workOrderData.work_charge_to || "Select");
          setSelectedEntry(
            workOrderData.entry_allowed === true ? "Yes" : "No" || "Select"
          );
          setSelecteduser(staffMember.staffmember_name || "Select");
          setSelectedStatus(workOrderData.status || "Select");
          setSelectedPriority(workOrderData.priority || "Select");
          setWorkOrderImage(workOrderData.workOrder_images || []);
          setSelectedFiles(workOrderData.workOrder_images || []);

          setSelectedTenant(
            tenantData.tenant_firstName + " " + tenantData.tenant_lastName ||
              "Select"
          );

          WorkFormik.setValues({
            invoice_number: workOrderData?.invoice_number || "",
            work_charge: workOrderData?.work_charge || "",
            detail: workOrderData?.detail || "",
            entry_contact: workOrderData?.entry_contact || "",
            final_total_amount: workOrderData?.final_total_amount || "",

            work_subject: workOrderData?.work_subject || "",
            rental_adress: rentalAdress?.rental_adress || "",
            rental_unit: rentalUnit?.rental_unit || "",
            rental_id: rentalAdress.rental_id || "",
            work_category: workOrderData?.work_category || "",
            vendor_name: vendor?.vendor_name || "",
            vendor_id: vendor?.vendor_id || "",
            unit_id: rentalUnit?.unit_id || "",
            tenant_id: tenantData?.tenant_id || "",
            tenant_name:
              tenantData?.tenant_firstName +
                " " +
                tenantData?.tenant_lastName || "",
            invoice_number: "",
            work_charge: workOrderData?.work_charge_to || "",
            entry_allowed:
              workOrderData.entry_allowed === true ? "Yes" : "No" || "",
            detail: "",
            entry_contact: "",
            work_performed: workOrderData?.work_performed || "",
            vendor_note: workOrderData?.vendor_notes || "",
            staffmember_name: staffMember?.staffmember_name || "",
            staffmember_id: staffMember?.staffmember_id || "",
            status: workOrderData?.status || "",
            due_date: formattedDueDate || "",
            priority: workOrderData?.priority || "",
            workOrderImage: workOrderData?.workOrder_images || "",
            final_total_amount: "",
            statusUpdatedBy: "Admin",
            entries: partsData.map((part) => ({
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
                res.data.files &&
                res.data.files.length > 0
              ) {
                image[i] = res.data.files[0].url;
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
        admin_id: accessType.admin_id || "",
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
        } else {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      }
      console.log(res.data.data, "yashuj");
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
      status: "",
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
    try {
      const res = await axios.get(
        `${baseUrl}/rentals/rentals/${accessType?.admin_id}`
      );
      if (res.data.statusCode === 200) {
        setPropertyData(res.data.data);
      } else if (res.data.statusCode === 201) {
        setPropertyData([]);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchStaffData = () => {
    fetch(`${baseUrl}/staffmember/staff_member/${accessType?.admin_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setstaffData(data.data);
        } else {
          console.error("Error:", data.message);
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
  }, [accessType]);

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
                res.data.files &&
                res.data.files.length > 0
              ) {
                image[i] = res.data.files[0].url;
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
        admin_id: accessType.admin_id || "",
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
    console.log(object, "yashu");
    try {
      const res = await axios.put(`${baseUrl}/work-order/work-order/${id}`);
      console.log(res);
    } catch (error) {}
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
    setTenantsDetails([]);
    try {
      const response = await axios.get(
        `${baseUrl}/leases/get_tenants/${rental_id}/${unit_id}`
      );
      setTenantsDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
  };

  const getTenantData = async () => {
    setSelectedTenant("Select");
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
      <AddWorkorderHeader />

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
                            onBlur={WorkFormik.handleBlur}
                            onChange={(e) => {
                              WorkFormik.handleChange(e);
                            }}
                            value={WorkFormik.values.work_subject}
                            required
                          />
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
                            }}
                          >
                            <thead className="thead-light">
                              <tr>
                                <th>Qty</th>
                                <th>Account</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Total</th>
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
