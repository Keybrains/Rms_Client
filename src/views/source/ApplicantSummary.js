import Header from "components/Headers/Header";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import HomeIcon from "@mui/icons-material/Home";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
} from "reactstrap";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import { jwtDecode } from "jwt-decode";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import EmailIcon from "@mui/icons-material/Email";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import NoteIcon from "@mui/icons-material/Note";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import greenTick from "../../assets/img/icons/common/green_tick.jpg";
import { Link } from "react-router-dom";
import {
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import Cookies from "universal-cookie";
import MailIcon from "@mui/icons-material/Mail";
import FileOpen from "@mui/icons-material/FileOpen";
import { CheckBox } from "@mui/icons-material";
import * as yup from "yup";
import { RotatingLines } from "react-loader-spinner";

const ApplicantSummary = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const id = useParams().id;
  let cookies = new Cookies();
  const [applicantLoader, setApplicantLoader] = useState(true);
  const [loader, setLoader] = React.useState(true);
  const [loader2, setLoader2] = React.useState(false);
  const [loader3, setLoader3] = React.useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const [accessType, setAccessType] = useState(null);
  const [manager, setManager] = useState(null);

  const [selectedDropdownItem, setselectedDropdownItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = React.useState("Summary");

  const [applicantData, setApplicantData] = useState();
  const [propertyData, setPropertyData] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [propertydata, setPropertydata] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [userdropdownOpen, setuserDropdownOpen] = React.useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");

  const [isAttachFile, setIsAttachFile] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState("");
  const [combinedData, setCombinedData] = useState([]);
  const [fileName, setFileName] = useState("");

  const [isChecklistVisible, setChecklistVisible] = useState(false);
  const [checklistItems, setChecklistItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [checkedChecklist, CheckedChecklist] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  const handleStaticCheckboxChange = (event) => {
    const { id, checked } = event.target;
    const storedCheckedItems =
      JSON.parse(localStorage.getItem("staticCheckedItems")) || [];

    if (checked && !storedCheckedItems?.includes(id)) {
      storedCheckedItems.push(id);
    } else if (!checked && storedCheckedItems?.includes(id)) {
      const index = storedCheckedItems.indexOf(id);
      storedCheckedItems.splice(index, 1);
    }

    localStorage.setItem(
      "staticCheckedItems",
      JSON.stringify(storedCheckedItems)
    );
  };

  const toggleChecklist = () => {
    setChecklistVisible(!isChecklistVisible);
  };

  const toggle9 = () => {
    setuserDropdownOpen((prevState) => !prevState);
  };

  const toggle10 = () => {
    setUnitDropdownOpen((prevState) => !prevState);
  };

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      console.log(jwt, jwt);
      setAccessType(jwt.accessType);
      setManager(jwt.userName);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

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

  // Function to handle property selection
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

  const handleUnitSelect = (selectedUnit) => {
    if (selectedUnit === "Select Unit" || !selectedUnit) {
      setSelectedUnit(""); // Set selectedUnit state to empty string if "Select Unit" or no unit is chosen
      applicantFormik.setFieldValue("rental_units", null); // Set rental_units to null if "Select Unit" or no unit is chosen
    } else {
      setSelectedUnit(selectedUnit);
      applicantFormik.setFieldValue("rental_units", selectedUnit); // Update the formik state here
    }
  };

  const handleAttachFile = () => {
    setIsAttachFile(true);
  };

  useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch(`${baseUrl}/rentals/allproperty`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setPropertydata(data.data);
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === "Approved") {
      setLoader2(true);
      setTimeout(function () {
        setLoader2(false);
      }, 500);
    }
    if (newValue === "Rejected") {
      setLoader3(true);
      setTimeout(function () {
        setLoader3(false);
      }, 500);
    }
    //console.log(newValue);
    //console.log(matchedApplicant?.tenant_mobileNumber);
    tenantsData(matchedApplicant?.tenant_mobileNumber, newValue);
  };

  const dropdownList = ["Approved", "Rejected"];

  const selectedDropdown = (item) => {
    setselectedDropdownItem(item);

    //console.log(item, "item");
  };

  const toggle = () => setIsOpen((prevState) => !prevState);
  // const id = useParams().id;

  const applicantFormik = useFormik({
    initialValues: {
      applicant_checklist: [],
      applicant_checkedChecklist: [],
      status: "",
      tenant_firstName: "",
      tenant_lastName: "",
      tenant_mobileNumber: "",
      tenant_workNumber: "",
      tenant_homeNumber: "",
      tenant_faxPhoneNumber: "",
      tenant_email: "",
      attachment: "",
      rental_units: "",
      rental_adress: "",
      applicant_notes: notes,
      applicant_file: files,
      isMovein: false,
    },
    onSubmit: (values) => {
      handleEdit(values);
      //console.log(values, "values");
    },
  });

  const [rentaldata, setRentaldata] = useState([]);

  const tenantsData = async (number, status) => {
    // Construct the API URL
    const apiUrl = `${baseUrl}/applicant/applicant_get?tenant_mobileNumber=${number}&status=${status}`;

    try {
      // Fetch tenant data
      const response = await axios.get(apiUrl);
      const tenantData = response.data.data;
      console.log(response, "response.data");
      console.log(tenantData, "tenantData");
      // setTenantDetails(tenantData);
      setRentaldata(tenantData);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      // setError(error);
      // setLoading(false);
    }
  };

  const arrayOfStatus = [
    {
      value: "Approved",
      label: "The new rental application status",
    },
    {
      value: "Rejected",
      label: "The new rental application status",
    },
    {
      value: "Lease assigned",
      label: "Applicant added to a lease",
    },
    {
      value: "New",
      label: "New applicant record created",
    },
  ];

  const handleEditStatus = (item) => {
    //console.log(selectedDropdownItem, "selectedDropdownItem");

    // //console.log(updatedApplicant, "updatedApplicant 403");
    console.log(item, "item");
    const status = {
      status: item,
      statusUpdatedBy: manager,
    };
    console.log(status, "status");
    console.log(id, "id");
    axios
      .put(`${baseUrl}/applicant/applicant/${id}/status`, status)
      .catch((err) => {
        console.error(err);
      })
      .then((res) => {
        //console.log(res, "res");
        getApplicantData();
      });
  };

  const navigateToLease = () => {
    axios
      .get(`${baseUrl}/applicant/applicant_summary/${id}`)
      .then((response) => {
        const applicantsData = response.data.data;
        console.log(applicantsData, "data frpm 325");
        // Extract the rental address from the response
        const rentalAddress = applicantsData.rental_adress;
        //console.log(rentalAddress, "Rental Addressss");
        axios.get(`${baseUrl}/rentals/allproperty`).then((response) => {
          const property = response.data.data;
          //console.log(property, "properties");
          const matchedProperty = property.find((property) => {
            return property.rental_adress === rentalAddress;
          });
          //console.log(matchedProperty, "matchedProperty");
          if (!matchedProperty) {
            alert("Property not found");
            return;
          } else {
            // navigate(`/admin/Leaseing/${id}/${matchedProperty._id}`);
            navigate(
              `/admin/RentRollLeaseing`,
              //console.log(tenantID, "tenantID");
              {
                state: {
                  applicantData: applicantsData,
                },
              }
            );
            //console.log(matchedApplicant, "matchedApplicant");
            // axios
            // .get("https://propertymanager.cloudpress.host/api/tenant/tenant")
            // .then((response) => {
            //   //console.log(response.data.data,'response.data.data');
            //   const tenant = response.data.data;
            //   const matchedTenant = tenant.find((tenant) => {
            //     return tenant._id === id;
            //   })
            //   //console.log(matchedTenant, "matchedTenantdddd");
            // })
            // .then((err) => {
            //   //console.log(err);
            //   // setLoader(false);
            // });
            // navigate(`/admin/rentrolldetail/${id}/`);
          }
        });

        // Navigate to the leasing page with the rental address

        // //console.log(`/admin/RentRollLeaseing/${rentalAddress}`, "fgbasfg");
      })
      .catch((err) => {
        console.error(err);
        // Handle errors here if needed
      });
  };
  // const navigateToLease = () => {
  //   axios
  //     .get("https://propertymanager.cloudpress.host/api/applicant/applicant")
  //     .then((applicants) => {
  //       axios
  //         .get("https://propertymanager.cloudpress.host/api/rentals/allproperty")
  //         .then((properties) => {
  //           //console.log(applicants.data.data, "applicants");
  //           //console.log(properties.data.data, "properties");
  //           setApplicantData(applicants.data.data);
  //           const allProperties = properties.data.data;
  //           const allApplicants = applicants.data.data;
  //           const matchedProperty = allProperties.find((property) => {
  //             return property.rental_adress === allApplicants[0].rental_adress;
  //           });
  //           setPropertyData(matchedProperty);
  //           //console.log(matchedProperty, "matchedProperty");
  //           navigate(`/admin/Leaseing/${id}/${matchedProperty._id}`);
  //           // //console.log(response.data.data,'response.data.data');

  //           // setRentalsData(response.data.data);

  //           // setLoader(false);
  //         })
  //         .then((err) => {
  //           //console.log(err);
  //           // setLoader(false);
  //         });
  //     })
  //     .then((err) => {
  //       //console.log(err);
  //       // setLoader(false);rental_adressrental_address
  //     });
  // };

  // useEffect(() => {
  //   axios
  //     .get(`${baseUrl}/applicant/applicant_summary/${id}`)
  //     .then((applicants) => {
  //       axios
  //         .get("https://propertymanager.cloudpress.host/api/rentals/property")
  //         .then((properties) => {
  //           //console.log(applicants.data.data, "applicants");
  //           //console.log(properties.data.data, "properties");
  //           setApplicantData(applicants.data.data);
  //           const allProperties = properties.data.data;
  //           const allApplicants = applicants.data.data;
  //           const matchedProperty = allProperties.find((property) => {
  //             return property.rental_adress === allApplicants.rental_adress;
  //           });
  //           setPropertyData(matchedProperty);
  //           //console.log(matchedProperty, "matchedProperty");
  //           // navigate(`/admin/Leaseing/${id}/${matchedProperty._id}`);
  //           // //console.log(response.data.data,'response.data.data');

  //           // setRentalsData(response.data.data);

  //           // setLoader(false);
  //         })
  //         .then((err) => {
  //           //console.log(err);
  //           // setLoader(false);
  //         });
  //     })
  //     .then((err) => {
  //       //console.log(err);
  //       // setLoader(false);
  //     });
  // }, [id]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/applicant/applicant_summary/${id}`)
      .then((applicants) => {
        console.log(applicants.data.data, "gggg");

        axios
          .get(`${baseUrl}/rentals/property`)
          .then((properties) => {
            //console.log(applicants.data.data, "applicants");
            //console.log(properties.data.data, "properties");
            setApplicantData(applicants.data.data);
            const allProperties = properties.data.data;
            const allApplicants = applicants.data.data;
            const matchedProperty = allProperties.find((property) => {
              return property.rental_adress === allApplicants.rental_adress;
            });
            setPropertyData(matchedProperty);
            //console.log(matchedProperty, "matchedProperty");
          })
          .catch((error) => {
            console.error("Error fetching rental properties:", error);
            // Handle the error, e.g., display an error message to the user.
          });
      })
      .catch((error) => {
        console.error("Error fetching applicants:", error);
        // Handle the error, e.g., display an error message to the user.
      });
  }, [id]);

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      setChecklistItems([...checklistItems, newItem]);
      const allCheckbox = [...checklistItems, newItem];
      //console.log(allCheckbox, "allCheckbox");
      //console.log(matchedApplicant, "matchedApplicant");
      const updatedApplicant = {
        ...matchedApplicant,
        applicant_checklist: [...matchedApplicant.applicant_checklist, newItem],
      };
      //console.log(updatedApplicant, "updatedApplicant");
      axios
        .put(`${baseUrl}/applicant/applicant/${id}/checklist`, updatedApplicant)
        .then((response) => {
          //console.log(response.data.data, "response.data.data");
          getApplicantData();
        })
        .catch((err) => {
          console.error(err);
        });
      setNewItem(""); // Clear the input field
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    const updatedChecklist = checklistItems.filter(
      (item) => item !== itemToRemove
    );

    setChecklistItems(updatedChecklist);

    const updatedApplicant = {
      ...matchedApplicant,
      applicant_checklist: updatedChecklist,
    };

    axios
      .put(`${baseUrl}/applicant/applicant/${id}/checklist`, updatedApplicant)
      .then((response) => {
        // Handle response if needed
        getApplicantData(); // Refresh applicant data after update
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // const [tenantID, setTenantID]=useState("")
  const fetchDataAndPost = async () => {
    try {
      // Step 1: Fetch data from the API
      const response = await axios.get(
        `${baseUrl}/applicant/applicant_summary/${id}`
      );

      // Check if the response contains the data you expect
      const fetchedData = response.data;
      console.log(fetchedData, "fetched data");
      //console.log(fetchedData, "fetched data");
      if (fetchedData) {
        // Step 2: Create an object with the fetched data
        // const dataToSend = {
        //   tenant_firstName: fetchedData.data.tenant_firstName,
        //   tenant_lastName: fetchedData.data.tenant_lastName,
        //   tenant_unitNumber: fetchedData.data.tenant_unitNumber,
        //   tenant_mobileNumber: fetchedData.data.tenant_mobileNumber,
        //   tenant_workNumber: fetchedData.data.tenant_workNumber,
        //   tenant_homeNumber: fetchedData.data.tenant_homeNumber,
        //   tenant_faxPhoneNumber: fetchedData.data.tenant_faxPhoneNumber,
        //   tenant_email: fetchedData.data.tenant_email,
        //   entries: [
        //     {
        //       rental_adress: fetchedData.data.rental_adress,
        //       rental_units: fetchedData.data.rental_units,
        //     },
        //   ],
        // };
        const dataToSend = {
          tenant_firstName: fetchedData.data.tenant_firstName || "",
          tenant_lastName: fetchedData.data.tenant_lastName || "",
          tenant_unitNumber: fetchedData.data.tenant_unitNumbe || "",

          // tenant_phoneNumber: ,
          tenant_mobileNumber: fetchedData.data.tenant_mobileNumber || "",
          tenant_workNumber: fetchedData.data.tenant_workNumber || "",
          tenant_homeNumber: fetchedData.data.tenant_homeNumber || "",
          tenant_faxPhoneNumber: fetchedData.data.tenant_faxPhoneNumber || "",
          tenant_email: fetchedData.data.tenant_email || "",
          tenant_password: fetchedData.data.tenant_password || "",
          alternate_email: fetchedData.data.alternate_email || "",
          tenant_residentStatus: fetchedData.data.tenant_residentStatus || "",

          // personal information
          birth_date: fetchedData.data.birth_date || "",
          textpayer_id: fetchedData.data.textpayer_id || "",
          comments: fetchedData.data.comments || "",

          //Emergency contact

          contact_name: fetchedData.data.contact_name || "",
          relationship_tenants: fetchedData.data.relationship_tenants || "",
          email: fetchedData.data.email || "",
          emergency_PhoneNumber: fetchedData.data.emergency_PhoneNumber || "",
          entries: [
            {
              entryIndex: fetchedData.data.entryIndex || "",
              rental_units: fetchedData.data.rental_units || "",
              rental_adress: fetchedData.data.rental_adress || "",
              lease_type: fetchedData.data.lease_type || "",
              start_date: fetchedData.data.start_date || "",
              end_date: fetchedData.data.end_date || "",
              leasing_agent: fetchedData.data.leasing_agent || "",
              rent_cycle: fetchedData.data.rent_cycle || "",
              amount: fetchedData.data.amount || "",
              account: fetchedData.data.account || "",
              nextDue_date: fetchedData.data.nextDue_date || "",
              memo: fetchedData.data.memo || "",
              // upload_file: fetchedData.data.upload_file || "",
              isrenton: fetchedData.data.isrenton || false,
              rent_paid: fetchedData.data.rent_paid || false,
              propertyOnRent: fetchedData.data.propertyOnRent || false,

              //security deposite
              Due_date: fetchedData.data.Due_date || "",
              Security_amount: fetchedData.data.Security_amount || "",

              // add cosigner
              cosigner_firstName: fetchedData.data.cosigner_firstName || "",
              cosigner_lastName: fetchedData.data.cosigner_lastName || "",
              cosigner_mobileNumber:
                fetchedData.data.cosigner_mobileNumber || "",
              cosigner_workNumber: fetchedData.data.cosigner_workNumber || "",
              cosigner_homeNumber: fetchedData.data.cosigner_homeNumber || "",
              cosigner_faxPhoneNumber:
                fetchedData.data.cosigner_faxPhoneNumber || "",
              cosigner_email: fetchedData.data.cosigner_email || "",
              cosigner_alternateemail:
                fetchedData.data.cosigner_alternateemail || "",
              cosigner_streetAdress:
                fetchedData.data.cosigner_streetAdress || "",
              cosigner_city: fetchedData.data.cosigner_city || "",
              cosigner_state: fetchedData.data.cosigner_state || "",
              cosigner_zip: fetchedData.data.cosigner_zip || "",
              cosigner_country: fetchedData.data.cosigner_country || "",
              cosigner_postalcode: fetchedData.data.cosigner_postalcode || "",

              // add account
              account_name: fetchedData.data.account_name || "",
              account_type: fetchedData.data.account_type || "",

              //account level (sub account)
              parent_account: fetchedData.data.parent_account || "",
              account_number: fetchedData.data.account_number || "",
              fund_type: fetchedData.data.fund_type || "",
              cash_flow: fetchedData.data.cash_flow || "",
              notes: fetchedData.data.notes || "",

              tenant_residentStatus:
                fetchedData.data.tenant_residentStatus || false,
              rentalOwner_firstName:
                fetchedData.data.rentalOwner_firstName || "",
              rentalOwner_lastName: fetchedData.data.rentalOwner_lastName || "",
              rentalOwner_primaryemail:
                fetchedData.data.rentalOwner_email || "",
              rentalOwner_phoneNumber:
                fetchedData.data.rentalOwner_phoneNumber || "",
              rentalOwner_businessNumber:
                fetchedData.data.rentalOwner_businessNumber || "",
              rentalOwner_homeNumber:
                fetchedData.data.rentalOwner_homeNumber || "",
              rentalOwner_companyName:
                fetchedData.data.rentalOwner_companyName || "",

              // recurring_charges: fetchedData.recurring_charges || {},
              // one_time_charges: fetchedData.one_time_charges || {},
            },
          ],
        };

        console.log(dataToSend, "hagfjg");
        // Step 3: Make a POST request to send the data to the server
        // const postResponse = await axios.post(
        //   `${baseUrl}/tenant/tenant`,
        //   dataToSend
        // );
        // debugger
        //console.log(dataToSend, "hagfjg");
        // if (postResponse.status === 200) {
        //   console.log(postResponse,'clgbcmnm')
        //   //console.log("Data posted successfully:", postResponse.data.data);
        //   // setTenantID(postResponse.data.data._id)
        //   console.log(postResponse.data.data,'hjsadn')
        //   // debugger
        //
        // } else {
        //   console.error(
        //     "Data post request failed. Status code:",
        //     postResponse.status
        //   );
        //   console.error(
        //     "Error message from the server:",
        //     postResponse.data.message
        //   );
        // }
        navigateToLease(dataToSend);
      } else {
        // Handle the case where the fetched data is not as expected
        console.error("Invalid data format received from the API");
      }
    } catch (error) {
      // Handle errors if either the GET or POST request fails
      console.error("Data fetch or post failed", error);
    }
  };

  const [moveIn, setMoveIn] = useState([]);

  const [matchedApplicant, setMatchedApplicant] = useState([]);

  const getApplicantData = async () => {
    await axios
      .get(`${baseUrl}/applicant/applicant`)
      .then((response) => {
        console.log(response.data.data, "response.data.data");
        //console.log(response.data.data);
        if (response.data.data) {
          const applicantData = response.data.data;
          const matchedApplicant = applicantData.find((applicant) => {
            return applicant._id === id;
          });
          //console.log(matchedApplicant, "matchedApplicant");
          console.log(matchedApplicant, "matchedApplicant");
          setMatchedApplicant(matchedApplicant);
          setMoveIn(matchedApplicant.applicant_status[0]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    setApplicantLoader(false);
  };

  const onClickEditButton = async () => {
    setIsEdit(true);
    //console.log(matchedApplicant, "matchedApplicant from edit ");
    setSelectedPropertyType(matchedApplicant.rental_adress || "Select");
    try {
      const units = await fetchUnitsByProperty(matchedApplicant.rental_adress);
      //console.log(units, "units"); // Check the received units in the console

      setUnitData(units);
    } catch (error) {
      console.log(error, "error");
    }

    setSelectedUnit(matchedApplicant.rental_units || "Select");
    applicantFormik.setValues({
      tenant_firstName: matchedApplicant.tenant_firstName,
      tenant_lastName: matchedApplicant.tenant_lastName,
      tenant_unitNumber: matchedApplicant.tenant_unitNumber,
      tenant_mobileNumber: matchedApplicant.tenant_mobileNumber,
      tenant_workNumber: matchedApplicant.tenant_workNumber,
      tenant_homeNumber: matchedApplicant.tenant_homeNumber,
      tenant_faxPhoneNumber: matchedApplicant.tenant_faxPhoneNumber,
      tenant_email: matchedApplicant.tenant_email,
      rental_adress: matchedApplicant.rental_adress,
      rental_units: matchedApplicant.rental_units,
    });
  };

  const handleEdit = (values) => {
    setIsEdit(false);
    console.log(values, "values");
    let rentalUnitsValue = values.rental_units || matchedApplicant.rental_units;

    if (
      !rentalUnitsValue ||
      rentalUnitsValue === "Select Unit" ||
      rentalUnitsValue === ""
    ) {
      rentalUnitsValue = null;
    }

    const updatedApplicant = {
      tenant_firstName: values.tenant_firstName,
      tenant_lastName: values.tenant_lastName,
      tenant_unitNumber: values.tenant_unitNumber,
      tenant_mobileNumber: values.tenant_mobileNumber,
      tenant_homeNumber: values.tenant_homeNumber,
      tenant_faxPhoneNumber: values.tenant_faxPhoneNumber,
      tenant_email: values.tenant_email,
      tenant_workNumber: values.tenant_workNumber,
      rental_adress: values.rental_adress,
      rental_units: selectedUnit,
      status: selectedDropdownItem,
    };

    console.log("Rental Units Value before submission:", rentalUnitsValue);
    // Log the updated applicant data
    console.log("Updated Applicant Data: ", updatedApplicant);

    axios
      .put(`${baseUrl}/applicant/applicant/${id}`, updatedApplicant)
      .catch((err) => {
        console.error(err);
      })
      .then((res) => {
        getApplicantData();
      });
  };

  useEffect(() => {
    getApplicantData();
  }, []);

  useEffect(() => {
    // const storageKey = `applicant_${id}_checkedChecklist`;
    // const storedCheckedItems = JSON.parse(localStorage.getItem(storageKey));
    handleChecklistChange();
  }, [id]);

  const handleChecklistChange = async (event, item) => {
    try {
      // debugger

      const updatedItems = event.target.checked
        ? [...checkedItems, item]
        : checkedItems.filter((checkedItem) => checkedItem !== item);
      console.log(updatedItems, "updatedItems");
      setCheckedItems(updatedItems);

      // const storageKey = `applicant_${id}_checkedChecklist`;
      // localStorage.setItem(storageKey, JSON.stringify(updatedItems));

      // Make a PUT request to update the checked checklist on the server
      const apiUrl = `${baseUrl}/applicant/applicant/${id}/checked-checklist`;
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicant_checkedChecklist: updatedItems }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${errorData.message}`);
      }

      const responseData = await response.json();
      console.log(responseData);
      setCheckedItems(responseData.updatedApplicant.applicant_checkedChecklist); // You can handle the response data as needed
    } catch (error) {
      console.error(error.message); // Handle the error appropriately
    }
  };

  // const handleCheckItem = () => {
  //   if (newItem.trim() !== "") {
  //     setCheckedItems([...checkedItems, newItem]);
  //     const allCheckbox = [...checkedItems, newItem];
  //     //console.log(allCheckbox, "allCheckbox");
  //     //console.log(matchedApplicant, "matchedApplicant");
  //     const updatedApplicant = {
  //       ...matchedApplicant,
  //       applicant_checkedChecklist: [...matchedApplicant.applicant_checkedChecklist, newItem],
  //     };

  //     //console.log(updatedApplicant, "updatedApplicant");
  //     axios
  //       .put(
  //         `${baseUrl}/applicant/applicant/${id}/checked-checklist`,
  //         updatedApplicant
  //       )
  //       .then((response) => {
  //         //console.log(response.data.data, "response.data.data");
  //         getApplicantData();
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //     setNewItem(""); // Clear the input field
  //   }
  // };

  // const deleteColumn = (index) => {
  //   const updatedData = [...combinedData];
  //   updatedData.splice(index, 1);
  //   setCombinedData(updatedData);
  //   // Perform other necessary operations
  // };

  // const fileData = (files) => {
  //   const filesArray = Array.from(files);

  //   if (filesArray.length > 0) {
  //     // Allow only one file at a time
  //     setFiles(filesArray.slice(0, 1)); // Replace the existing file array with the new file

  //     const dataArray = new FormData();
  //     dataArray.append("b_video", filesArray[0]); // Use the first file from the array

  //     let url = "https://cdn.brandingprofitable.com/image_upload.php/";
  //     axios
  //       .post(url, dataArray, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((res) => {
  //         const imagePath = res?.data?.image_path; // Correct the key to "image_path"
  //         applicantFormik1.values.applicant_file = imagePath;
  //       })
  //       .catch((err) => {
  //         // Handle error if needed
  //       });
  //   }
  // };

  // const deleteFile = (index) => {
  //   const newFile = [...files];
  //   newFile.splice(index, 1);
  //   setFiles(newFile);
  // };

  // const handleOpenFile = (file) => {
  //   if (file.type === "text/plain") {
  //     // Read the contents of the text file
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const fileContent = event.target.result;

  //       // Display the content to the user (for demonstration, you might use an alert)
  //       alert("Content of the text file:\n\n" + fileContent);
  //     };
  //     reader.readAsText(file);
  //   } else {
  //     // For other file types, handle accordingly (e.g., open in a new tab)
  //     window.open(URL.createObjectURL(file));
  //   }
  // };

  //console.log(applicantFormik.values, "formik");
  // const getFileNameWithExtension = (file) => {
  //   const fileName = file?.name;
  //   return fileName;
  // };

  useEffect(() => {
    const maxLength = Math.max(notes.length, files.length);
    const updatedCombinedData = [];

    for (let i = 0; i < maxLength; i++) {
      const note = i < notes.length ? notes[i] : null;
      const file = i < files.length ? files[i] : null;

      updatedCombinedData.push({ note, file });
    }

    setCombinedData(updatedCombinedData);
  }, [notes, files]);

  const handleAddNote = () => {
    if (newNote !== "") {
      setNotes([...notes, newNote]);
      setNewNote("");
    }
  };

  const handleAddFile = () => {
    if (newFile !== null) {
      const dataArray = new FormData();
      dataArray.append("b_video", newFile);

      let url = "https://cdn.brandingprofitable.com/image_upload.php/";
      axios
        .post(url, dataArray, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const imagePath = res?.data?.image_path;
          applicantFormik1.values.applicant_file = imagePath;
        })
        .catch((err) => {
          console.error("Error uploading file:", err); // Log error here
        });
    } else {
      // Handle no file selected
    }
  };

  const handleSave = () => {
    if (newNote === "" || newFile === null) {
      // Display an alert or error message for incomplete fields
      toast.warning("Please fill in both the note and file.", {
        position: "top-center",
      });

      return; // Prevent further execution
    }

    if (newNote !== "" && newFile !== null) {
      setNotes([...notes, newNote]);
      setFiles([...files, newFile]);
      setNewNote("");
      setNewFile("");
      setIsAttachFile(false); // Close the box after adding data
      handleSubmit(); // Handle form submission or any other necessary actions
    } else {
      // Display an alert or error message for incomplete fields
      toast.warning("Please fill in both the note and file.", {
        position: "top-center",
      });
    }
  };

  const openFileInNewTab = (selectedFile) => {
    const fileURL = URL.createObjectURL(selectedFile);
    window.open(fileURL, "_blank");
  };

  const handleClearRow = async (document, appId) => {
    // const updatedCombinedData = [...combinedData];
    // updatedCombinedData.splice(rowIndex, 1);

    // // Remove corresponding note and file from their states
    // const updatedNotes = [...notes];
    // updatedNotes.splice(rowIndex, 1);

    // const updatedFiles = [...files];
    // updatedFiles.splice(rowIndex, 1);

    // setCombinedData(updatedCombinedData);
    // setNotes(updatedNotes);
    // setFiles(updatedFiles);

    const deleteUrl = `${baseUrl}/applicant/applicant/note_attachment/${appId}/${document._id}`;

    await axios
      .delete(deleteUrl)
      .then((res) => {
        console.log(res.data);
        toast.success("Document deleted successfully", {
          position: "top-center",
        });

        // getNotesAndFiles();
        getApplicantData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openFileInBrowser = (selectedFile) => {
    const fileURL = URL.createObjectURL(selectedFile);
    window.open(fileURL, "_blank");
  };

  const applicantFormik1 = useFormik({
    initialValues: {
      applicant_notes: notes,
      applicant_file: files,
    },
    validationSchema: yup.object({
      applicant_notes: yup.string().required("Required"),
    }),
    onSubmit: () => {
      // Remove this onSubmit logic if you only want to submit the form on button click
      // hadlenotesandfile(); // Call handleEdit function to make PUT request
    },
  });

  const handleSubmit = (values = {}) => {
    // Handle form submission
    hadlenotesandfile(values); // Call handleEdit function to make PUT request
  };
  console.log(typeof applicantFormik1.values.applicant_notes);
  console.log(typeof applicantFormik1.values.applicant_file);

  // const [newNote, setNewNote] = useState('');
  // const [newFile, setNewFile] = useState(null);
  // const [fileName, setFileName] = useState('');
  // const [isAttachFile, setIsAttachFile] = useState(false);

  const hadlenotesandfile = async () => {
    try {
      const formData = {
        applicant_notes: newNote,
        applicant_file: newFile.name,
      };

      console.log(formData, "formData");
      // formData.append('applicant_notes', newNote);
      // formData.append('applicant_file', newFile);
      const response = await axios.put(
        `${baseUrl}/applicant/applicant/note_attachment/${id}`,
        formData
      );
      if (response.data) {
        console.log(response.data, "response.data");
        setIsAttachFile(false);
        getApplicantData();
        // Handle success, update state, show a success message, etc.
      } else {
        // Handle error, show an error message, etc.
        console.log("error");
      }
      console.log("Response:", response.data);
      // Handle success, update state, show a success message, etc.
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      // Handle error, show an error message, etc.
    }
  };

  // ----------------------------------------------Applicant Put----------------------------------------------------------------------------

  const [applicantDatas, setApplicantDatas] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/applicant/applicant_summary/${id}`
        );

        if (response.data && response.data.data) {
          setApplicantDatas(response.data.data.applicant);
          console.log(response.data.data, "response.data.data.applicant");
          setCheckedItems(response.data.data.applicant_checkedChecklist);
        } else {
          console.error("Invalid data format received from the API");
        }
      } catch (error) {
        console.error("Data fetch failed", error);
      }
    };

    fetchData();
  }, []);

  // const isApplicantDataEmpty = Object?.keys(applicantDatas)?.length === 0;
  const isApplicantDataEmpty =
    !applicantDatas || Object.keys(applicantDatas).length === 0;

  const [formData, setFormData] = useState({
    applicant_firstName: "",
    applicant_lastName: "",
  });
  console.log(formData, "formData");

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = `${baseUrl}/applicant/application/${id}`;

      const updatedData = {
        // Add other fields as needed
        applicant: {
          applicant_firstName: formData.applicant_firstName,
          applicant_lastName: formData.applicant_lastName,

          applicant_socialSecurityNumber:
            formData.applicant_socialSecurityNumber,
          applicant_dob: formData.applicant_dob,
          applicant_country: formData.applicant_country,
          applicant_adress: formData.applicant_adress,
          applicant_city: formData.applicant_city,
          applicant_state: formData.applicant_state,
          applicant_zipcode: formData.applicant_zipcode,
          applicant_email: formData.applicant_email,
          applicant_cellPhone: formData.applicant_cellPhone,
          applicant_homePhone: formData.applicant_homePhone,
          applicant_emergencyContact_firstName:
            formData.applicant_emergencyContact_firstName,
          applicant_emergencyContact_lasttName:
            formData.applicant_emergencyContact_lasttName,
          applicant_emergencyContact_relationship:
            formData.applicant_emergencyContact_relationship,
          applicant_emergencyContact_email:
            formData.applicant_emergencyContact_email,
          applicant_emergencyContact_phone:
            formData.applicant_emergencyContact_phone,

          rental_country: formData.rental_country,
          rental_adress: formData.rental_adress,
          rental_city: formData.rental_city,
          rental_state: formData.rental_state,
          rental_zipcode: formData.rental_zipcode,
          rental_data_from: formData.rental_data_from,
          rental_date_to: formData.rental_date_to,
          rental_monthlyRent: formData.rental_monthlyRent,
          rental_resaonForLeaving: formData.rental_resaonForLeaving,
          rental_landlord_firstName: formData.rental_landlord_firstName,
          rental_landlord_lasttName: formData.rental_landlord_lasttName,
          rental_landlord_phoneNumber: formData.rental_landlord_phoneNumber,
          rental_landlord_email: formData.rental_landlord_email,

          employment_name: formData.employment_name,
          employment_country: formData.employment_country,
          employment_adress: formData.employment_adress,
          employment_city: formData.employment_city,
          employment_state: formData.employment_state,
          employment_zipcode: formData.employment_zipcode,
          employment_phoneNumber: formData.employment_phoneNumber,
          employment_email: formData.employment_email,
          employment_position: formData.employment_position,
          employment_date_from: formData.employment_date_from,
          employment_date_to: formData.employment_date_to,
          employment_monthlyGrossSalary: formData.employment_monthlyGrossSalary,
          employment_supervisor_name: formData.employment_supervisor_name,
          employment_supervisor_title: formData.employment_supervisor_title,
        },
      };

      const response = await axios.put(apiUrl, updatedData);

      console.log("PUT request response:", response.data);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleApplicantChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleManuallyEnterClick = () => {
    navigate("/admin/aplicant-form");
  };

  const [sendApplicantMail, setSendApplicantMail] = useState();
  const [sendApplicantMailLoader, setSendApplicantMailLoader] = useState(false);

  let sendApplicantMailData = async () => {
    setSendApplicantMailLoader(true);
    let responce = await axios.get(`${baseUrl}/applicant/applicant/mail/${id}`);
    setSendApplicantMail(responce.data.data);

    if (responce.data.statusCode === 200) {
      setSendApplicantMailLoader(false);
      toast.success("Application emailed", {
        position: "top-center",
      });
    } else {
      setSendApplicantMailLoader(false);
      toast.error("error", {
        position: "top-center",
      });
    }
  };

  const [loading, setLoading] = React.useState(false);
  function handleClick() {
    setLoading(true);
  }

  return (
    <>
      <Header title="ApplicantSummary" />
      <Container
        className="mt--9"
        onSubmit={applicantFormik.handleSubmit}
        fluid
      >
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              {applicantLoader ? (
                <tbody className="d-flex flex-direction-column justify-content-left align-items-left">
                  <tr>
                    <div className="p-5 m-5">
                      {/* <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={loader}/> */}
                    </div>
                  </tr>
                </tbody>
              ) : (
                <>
                  <h1 style={{ color: "white" }}>
                    Applicant :
                    {" " +
                      matchedApplicant?.tenant_firstName +
                      " " +
                      matchedApplicant?.tenant_lastName}
                  </h1>
                  <h4 style={{ color: "white" }}>
                    {/* Tenant |{" "} */}
                    {matchedApplicant.rental_adress}
                    {matchedApplicant.rental_units
                      ? " - " + matchedApplicant.rental_units
                      : " "}
                  </h4>
                </>
              )}
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/admin/Applicants")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <br />
        <Card elevation={2}>
          {/* <InputGroup>
            <Input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                border: "none",
              }}
            />
            <InputGroupAddon addonType="append">
              <Button
                color="secondary"
                onClick={handleSearch}
                style={{ marginLeft: "10px" }}
              >
                Search
              </Button>
            </InputGroupAddon>
          </InputGroup> */}
          {/* <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                fontSize: "25px",
                color: "black",
                marginRight: "10px",
                padding: "25px 0 0 25px ",
              }}
              color="text.secondary"
              gutterBottom
            >
              {matchedApplicant?.tenant_firstName +
                " " +
                matchedApplicant?.tenant_lastName +
                " ● " +
                matchedApplicant.rental_adress +
                " - " +
                matchedApplicant.rental_units}
            </Typography>
          </div> */}
          {applicantLoader ? (
            <tbody className="d-flex flex-direction-column justify-content-center align-items-center">
              <tr>
                <div className="p-5 m-5">
                  <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="50"
                    visible={loader}
                  />
                </div>
              </tr>
            </tbody>
          ) : (
            <>
              <div
                className="formInput d-flex flex-direction-row"
                style={{ margin: "30px 30px" }}
              >
                <Dropdown
                  //   isOpen={selectAccountDropDown}
                  //   toggle={toggle8}
                  isOpen={isOpen}
                  toggle={toggle}
                >
                  {console.log(matchedApplicant.applicant_status, "status")}
                  <DropdownToggle caret style={{ width: "100%" }}>
                    {matchedApplicant &&
                    matchedApplicant.applicant_status &&
                    matchedApplicant?.applicant_status[0]?.status
                      ? matchedApplicant?.applicant_status[0]?.status
                      : selectedDropdownItem
                      ? selectedDropdownItem
                      : "Select"}
                  </DropdownToggle>
                  <DropdownMenu
                    style={{ width: "100%" }}
                    name="rent_cycle"
                    //   onBlur={accountFormik.handleBlur}
                    //   onChange={accountFormik.handleChange}
                    //   value={accountFormik.values.account_type}
                  >
                    {dropdownList.map((item, index) => {
                      return (
                        <DropdownItem
                          key={index}
                          onClick={() => {
                            selectedDropdown(item);
                            handleEditStatus(item);
                          }}
                        >
                          {item}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </Dropdown>

                <LoadingButton
                  variant="contained"
                  loading={loading}
                  style={
                    moveIn && moveIn.status === "Approved"
                      ? { display: "block", marginLeft: "10px" }
                      : { display: "none" }
                  }
                  color="success"
                  onClick={(e) => {
                    fetchDataAndPost();
                    handleClick();
                    // navigate("/admin/RentRoll");
                  }}
                  disabled={
                    matchedApplicant && matchedApplicant.isMovedin === true
                  }
                >
                  Move in
                </LoadingButton>
              </div>
              <Row>
                <Col>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                      >
                        <Tab
                          label="Summary"
                          value="Summary"
                          style={{ textTransform: "none" }}
                        />
                        <Tab
                          label="Application"
                          value="Application"
                          style={{ textTransform: "none" }}
                        />
                        <Tab
                          label="Approved"
                          value="Approved"
                          style={{ textTransform: "none" }}
                          // onClick={(e) =>
                          //   tenantsData(
                          //     matchedApplicant?.tenant_mobileNumber,
                          //     e.target.value
                          //   )
                          // }
                        />
                        <Tab
                          label="Rejected"
                          value="Rejected"
                          style={{ textTransform: "none" }}
                        />
                      </TabList>
                    </Box>
                    <TabPanel value="Summary">
                      <Row>
                        <Col>
                          <Grid container spacing={3}>
                            <Grid item xs={9}>
                              <div>
                                <div>
                                  {isAttachFile ? (
                                    <Card
                                      style={{
                                        // width: "400px",
                                        // background: "#F4F6FF",
                                        // margin: "20px auto",
                                        position: "relative",
                                      }}
                                    >
                                      <span
                                        style={{
                                          position: "absolute",
                                          top: "5px",
                                          right: "5px",
                                          cursor: "pointer",
                                          fontSize: "24px",
                                        }}
                                        onClick={() => {
                                          setIsAttachFile(false);
                                        }}
                                      >
                                        &times;
                                      </span>
                                      <CardBody>
                                        <CardTitle tag="h4">Notes</CardTitle>

                                        {/* Notes */}
                                        <div>
                                          <div>
                                            <TextField
                                              type="text"
                                              size="small"
                                              fullWidth
                                              value={newNote}
                                              onChange={(e) => {
                                                setNewNote(e.target.value);
                                              }}
                                            />
                                          </div>

                                          <label
                                            htmlFor="upload_file"
                                            className="form-control-label"
                                            style={{
                                              display: "block",
                                              marginBottom: "15px",
                                              marginTop: "20px",
                                            }}
                                          >
                                            Upload Files (Maximum of 10)
                                          </label>
                                        </div>
                                        <div className="d-flex align-items-center">
                                          <input
                                            type="file"
                                            className="form-control-file d-none"
                                            accept="file/*"
                                            name="upload_file"
                                            id="upload_file"
                                            multiple
                                            onChange={(e) => {
                                              setNewFile(e.target.files[0]);
                                              // Display the file name
                                              setFileName(
                                                e.target.files[0]?.name || ""
                                              );
                                            }}
                                          />
                                          <label
                                            htmlFor="upload_file"
                                            className="btn btn-primary mr-3"
                                            style={{
                                              borderRadius: "5px",
                                              padding: "8px",
                                            }}
                                          >
                                            Choose Files
                                          </label>

                                          {newFile && (
                                            <p
                                              style={{
                                                cursor: "pointer",
                                                color: "blue",
                                              }}
                                              onClick={() =>
                                                openFileInBrowser(newFile)
                                              }
                                            >
                                              {fileName}
                                            </p>
                                          )}

                                          {applicantFormik1.touched
                                            .applicant_file &&
                                          applicantFormik1.errors
                                            .applicant_file ? (
                                            <div style={{ color: "red" }}>
                                              {
                                                applicantFormik1.errors
                                                  .applicant_file
                                              }
                                            </div>
                                          ) : null}
                                        </div>

                                        <div className="mt-3">
                                          <Button
                                            color="success"
                                            onClick={hadlenotesandfile}
                                            style={{ marginRight: "10px" }}
                                          >
                                            Save
                                          </Button>

                                          <Button
                                            onClick={() =>
                                              setIsAttachFile(false)
                                            }
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  ) : (
                                    <Button
                                      onClick={handleAttachFile}
                                      style={{
                                        marginTop: "3px",
                                        padding: "10px 20px",
                                        fontSize: "16px",
                                        borderRadius: "15px",
                                        boxShadow:
                                          "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                      }}
                                    >
                                      Attach note or file
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div>
                                  {console.log(checkedItems, "checked")}
                                  <input
                                    type="checkbox"
                                    id="CreditCheck"
                                    name="CreditCheck"
                                    value="CreditCheck"
                                    style={{
                                      transform: "scale(1.5)",
                                      marginLeft: "4px",
                                      marginTop: "20px",
                                      fontWeight: "bold",
                                    }}
                                    onChange={(e) =>
                                      handleChecklistChange(e, "CreditCheck")
                                    }
                                    checked={checkedItems?.includes(
                                      "CreditCheck"
                                    )}
                                  />{" "}
                                  Credit and background check <br />
                                  <input
                                    type="checkbox"
                                    id="EmploymentVerification"
                                    name="EmploymentVerification"
                                    value="EmploymentVerification"
                                    style={{
                                      transform: "scale(1.5)",
                                      marginLeft: "4px",
                                      marginTop: "20px",
                                      fontWeight: "bold",
                                    }}
                                    onChange={(e) =>
                                      handleChecklistChange(
                                        e,
                                        "EmploymentVerification"
                                      )
                                    }
                                    checked={checkedItems?.includes(
                                      "EmploymentVerification"
                                    )}
                                  />{" "}
                                  Employment verification <br />
                                  <input
                                    type="checkbox"
                                    id="ApplicationFee"
                                    name="ApplicationFee"
                                    value="ApplicationFee"
                                    style={{
                                      transform: "scale(1.5)",
                                      marginLeft: "4px",
                                      marginTop: "20px",
                                      fontWeight: "bold",
                                    }}
                                    onChange={(e) =>
                                      handleChecklistChange(e, "ApplicationFee")
                                    }
                                    checked={checkedItems?.includes(
                                      "ApplicationFee"
                                    )}
                                  />{" "}
                                  Application fee collected <br />
                                  <input
                                    type="checkbox"
                                    id="IncomeVerification"
                                    name="IncomeVerification"
                                    value="IncomeVerification"
                                    style={{
                                      transform: "scale(1.5)",
                                      marginLeft: "4px",
                                      marginTop: "20px",
                                      fontWeight: "bold",
                                    }}
                                    onChange={(e) =>
                                      handleChecklistChange(
                                        e,
                                        "IncomeVerification"
                                      )
                                    }
                                    checked={checkedItems?.includes(
                                      "IncomeVerification"
                                    )}
                                  />{" "}
                                  Income verification <br />
                                  <input
                                    type="checkbox"
                                    id="LandlordVerification"
                                    name="LandlordVerification"
                                    value="LandlordVerification"
                                    style={{
                                      transform: "scale(1.5)",
                                      marginLeft: "4px",
                                      marginTop: "20px",
                                      marginBottom: "20px",
                                      fontWeight: "bold",
                                    }}
                                    onChange={(e) =>
                                      handleChecklistChange(
                                        e,
                                        "LandlordVerification"
                                      )
                                    }
                                    checked={checkedItems?.includes(
                                      "LandlordVerification"
                                    )}
                                  />{" "}
                                  Landlord verification <br />
                                </div>

                                <Box display="flex" flexDirection="column">
                                  {matchedApplicant?.applicant_checklist?.map(
                                    (item, index) => (
                                      <div
                                        key={index}
                                        style={{
                                          paddingTop: "10px",
                                          margin: "0",
                                          padding: "0",
                                        }}
                                      >
                                        <FormControlLabel
                                          control={
                                            <input
                                              style={{
                                                transform: "scale(1.5)",
                                                marginLeft: "14px",
                                                // marginTop: "20px",
                                                fontWeight: "bold",
                                              }}
                                              type="checkbox"
                                              value={item}
                                              color="success"
                                              onChange={(e) =>
                                                handleChecklistChange(e, item)
                                              }
                                              checked={checkedItems?.includes(
                                                item
                                              )}
                                            />
                                          }
                                          label={
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "5px",
                                              }}
                                            >
                                              <span>{item}</span>
                                              <IconButton
                                                aria-label="delete"
                                                onClick={() =>
                                                  handleRemoveItem(item)
                                                }
                                              >
                                                <CloseIcon />
                                              </IconButton>
                                            </div>
                                          }
                                        />
                                      </div>
                                    )
                                  )}
                                </Box>
                                {isChecklistVisible && (
                                  <div>
                                    <Box
                                      display="flex"
                                      sx={{ width: "40%" }}
                                      flexDirection="row"
                                      alignItems="center"
                                      paddingTop="10px"
                                    >
                                      <TextField
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={newItem}
                                        onChange={(e) =>
                                          setNewItem(e.target.value)
                                        }
                                      />
                                      <CheckIcon
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                          marginLeft: "5px",
                                          cursor: "pointer",
                                          color: "green", // Change color as desired
                                          border: "2px solid green", // Border for the icon
                                          borderRadius: "5px", // Makes the border square
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                        onClick={handleAddItem}
                                      />
                                      <CloseIcon
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                          marginLeft: "5px",
                                          cursor: "pointer",
                                          color: "red", // Change color as desired
                                          border: "2px solid red", // Border for the icon
                                          borderRadius: "5px", // Makes the border square
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                        onClick={toggleChecklist}
                                      />
                                    </Box>
                                  </div>
                                )}
                                <br></br>
                                <Button
                                  variant="body1"
                                  sx={{
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={toggleChecklist}
                                >
                                  + Add checklist
                                </Button>
                              </div>

                              {matchedApplicant?.applicant_NotesAndFile?.length >
                                0 && (
                                <>
                                  <Row
                                    className="w-100 my-3"
                                    style={{
                                      fontSize: "18px",
                                      textTransform: "capitalize",
                                      color: "#5e72e4",
                                      fontWeight: "600",
                                      borderBottom: "1px solid #ddd",
                                      paddingTop: "15px",
                                    }}
                                  >
                                    <Col>Updates</Col>
                                  </Row>

                                  <Row
                                    className="w-100 mb-1"
                                    style={{
                                      fontSize: "15px",
                                      // textTransform: "uppercase",
                                      color: "#aaa",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    <Col>Note</Col>
                                    <Col>File</Col>
                                    <Col>Clear</Col>
                                  </Row>
                                  {console.log(
                                    matchedApplicant,
                                    "matchedApplicnt"
                                  )}

                                  {matchedApplicant?.applicant_NotesAndFile.map(
                                    (data, index) => (
                                      <Row
                                        className="w-100 mt-1"
                                        style={{
                                          fontSize: "12px",
                                          textTransform: "capitalize",
                                          color: "#000",
                                        }}
                                        key={index} // Ensure to provide a unique key when iterating in React
                                      >
                                        <Col>
                                          {data.applicant_file && (
                                            <p>{data.applicant_file}</p>
                                          )}
                                        </Col>
                                        <Col>
                                          {data.applicant_notes && (
                                            <div
                                              style={{
                                                display: "flex",
                                                // alignItems: "center",
                                              }}
                                            >
                                              <p
                                                onClick={() =>
                                                  openFileInNewTab(
                                                    data.applicant_notes
                                                  )
                                                }
                                              >
                                                <FileOpenIcon />
                                                {data.applicant_notes}
                                              </p>
                                            </div>
                                          )}
                                        </Col>
                                        <Col>
                                          <ClearIcon
                                            onClick={() => {
                                              handleClearRow(
                                                data,
                                                matchedApplicant._id
                                              );
                                            }}
                                          >
                                            Clear
                                          </ClearIcon>
                                        </Col>
                                      </Row>
                                    )
                                  )}
                                </>
                              )}

                              <>
                                <Row
                                  className="w-100 my-3 "
                                  style={{
                                    fontSize: "18px",
                                    textTransform: "capitalize",
                                    color: "#5e72e4",
                                    fontWeight: "600",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  <Col>Updates</Col>
                                </Row>

                                {matchedApplicant?.applicant_status?.map(
                                  (item, index) => (
                                    <Row
                                      className="w-100 mt-1  mb-5"
                                      style={{
                                        fontSize: "12px",
                                        textTransform: "capitalize",
                                        color: "#000",
                                      }}
                                      key={index}
                                    >
                                      <Col>{item.status || "N/A"}</Col>
                                      <Col>
                                        {item?.status
                                          ? arrayOfStatus.find(
                                              (x) => x.value === item.status
                                            )?.label
                                          : "N/A"}
                                      </Col>
                                      <Col>
                                        {item.statusUpdatedBy +
                                          " At " +
                                          item.updateAt || "N/A"}
                                      </Col>
                                    </Row>
                                  )
                                )}
                              </>
                            </Grid>

                            <Grid item xs="12" md="6" lg="4" xl="3">
                              {isEdit ? (
                                <Card
                                  style={{
                                    background: "#F4F6FF",
                                    border: "1px solid #ccc",
                                  }}
                                >
                                  <CardBody>
                                    {/* <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText> */}
                                    <form>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <div>
                                          <h5>Name</h5>
                                        </div>
                                        <TextField
                                          type="text"
                                          size="small"
                                          id="tenant_firstName"
                                          name="tenant_firstName"
                                          value={
                                            applicantFormik.values
                                              .tenant_firstName
                                          }
                                          onChange={
                                            applicantFormik.handleChange
                                          }
                                          onBlur={applicantFormik.handleBlur}
                                          placeholder="FirstName"
                                        />
                                        <TextField
                                          type="text"
                                          size="small"
                                          style={{ marginTop: "10px" }}
                                          placeholder="LastName"
                                          id="tenant_lastName"
                                          name="tenant_lastName"
                                          value={
                                            applicantFormik.values
                                              .tenant_lastName
                                          }
                                          onChange={
                                            applicantFormik.handleChange
                                          }
                                          onBlur={applicantFormik.handleBlur}
                                        />
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          marginTop: "10px",
                                        }}
                                      >
                                        <div>
                                          <h5>Numbers</h5>
                                        </div>
                                        <TextField
                                          type="number"
                                          size="small"
                                          placeholder="Mobile"
                                          id="tenant_mobileNumber"
                                          name="tenant_mobileNumber"
                                          value={
                                            applicantFormik.values
                                              .tenant_mobileNumber
                                          }
                                          onChange={
                                            applicantFormik.handleChange
                                          }
                                          onBlur={applicantFormik.handleBlur}
                                        />
                                        <TextField
                                          type="number"
                                          size="small"
                                          style={{ marginTop: "10px" }}
                                          placeholder="Business"
                                          id="tenant_workNumber"
                                          name="tenant_workNumber"
                                          value={
                                            applicantFormik.values
                                              .tenant_workNumber
                                          }
                                          onChange={
                                            applicantFormik.handleChange
                                          }
                                          onBlur={applicantFormik.handleBlur}
                                        />
                                        <TextField
                                          type="number"
                                          size="small"
                                          style={{ marginTop: "10px" }}
                                          placeholder="Home"
                                          id="tenant_homeNumber"
                                          name="tenant_homeNumber"
                                          value={
                                            applicantFormik.values
                                              .tenant_homeNumber
                                          }
                                          onChange={
                                            applicantFormik.handleChange
                                          }
                                          onBlur={applicantFormik.handleBlur}
                                        />
                                        <TextField
                                          type="number"
                                          size="small"
                                          style={{ marginTop: "10px" }}
                                          placeholder="Fax"
                                          id="tenant_faxPhoneNumber"
                                          name="tenant_faxPhoneNumber"
                                          value={
                                            applicantFormik.values
                                              .tenant_faxPhoneNumber
                                          }
                                          onChange={
                                            applicantFormik.handleChange
                                          }
                                          onBlur={applicantFormik.handleBlur}
                                        />
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <div style={{ marginTop: "10px" }}>
                                          <h5>Email</h5>
                                        </div>
                                        <TextField
                                          type="text"
                                          size="small"
                                          placeholder="Email"
                                          id="tenant_email"
                                          name="tenant_email"
                                          value={
                                            applicantFormik.values.tenant_email
                                          }
                                          onChange={
                                            applicantFormik.handleChange
                                          }
                                          onBlur={applicantFormik.handleBlur}
                                        />
                                      </div>
                                      <div>
                                        <label
                                          className="form-control-label"
                                          htmlFor="input-property"
                                          style={{ paddingTop: "15px" }}
                                        >
                                          Property
                                        </label>
                                        {/* {//console.log(propertyData, "propertyData")} */}
                                        <FormGroup>
                                          <Dropdown
                                            isOpen={userdropdownOpen}
                                            toggle={toggle9}
                                          >
                                            <DropdownToggle
                                              caret
                                              style={{
                                                width: "100%",
                                                marginRight: "15px",
                                              }}
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
                                              <DropdownItem value="">
                                                Select
                                              </DropdownItem>
                                              {propertydata.map((property) => (
                                                <DropdownItem
                                                  key={property._id}
                                                  onClick={() =>
                                                    handlePropertyTypeSelect(
                                                      property.rental_adress
                                                    )
                                                  }
                                                >
                                                  {property.rental_adress}
                                                </DropdownItem>
                                              ))}
                                            </DropdownMenu>
                                            {applicantFormik.errors &&
                                            applicantFormik.errors
                                              ?.rental_adress &&
                                            applicantFormik.touched &&
                                            applicantFormik.touched
                                              ?.rental_adress &&
                                            applicantFormik.values
                                              .rental_adress === "" ? (
                                              <div style={{ color: "red" }}>
                                                {
                                                  applicantFormik.errors
                                                    .rental_adress
                                                }
                                              </div>
                                            ) : null}
                                          </Dropdown>
                                        </FormGroup>
                                      </div>
                                      {console.log(unitData, "ubnitFsttvb")}
                                      {applicantFormik.values.rental_adress &&
                                        unitData &&
                                        unitData[0] &&
                                        unitData[0].rental_units && (
                                          <div>
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-unit"
                                            >
                                              Unit
                                            </label>
                                            <FormGroup
                                              style={{ marginLeft: "15px" }}
                                            >
                                              <Dropdown
                                                isOpen={unitDropdownOpen}
                                                toggle={toggle10}
                                              >
                                                <DropdownToggle caret>
                                                  {selectedUnit
                                                    ? selectedUnit
                                                    : "Select Unit"}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                  {unitData?.length > 0 ? (
                                                    unitData.map((unit) => (
                                                      <DropdownItem
                                                        key={unit._id}
                                                        onClick={() =>
                                                          handleUnitSelect(
                                                            unit.rental_units
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
                                                {applicantFormik.errors &&
                                                applicantFormik.errors
                                                  ?.rental_units &&
                                                applicantFormik.touched &&
                                                applicantFormik.touched
                                                  ?.rental_units &&
                                                applicantFormik.values
                                                  .rental_units === "" ? (
                                                  <div style={{ color: "red" }}>
                                                    {
                                                      applicantFormik.errors
                                                        .rental_units
                                                    }
                                                  </div>
                                                ) : null}
                                              </Dropdown>
                                            </FormGroup>
                                          </div>
                                        )}
                                      <div style={{ marginTop: "10px" }}>
                                        <Button
                                          color="success"
                                          type="submit"
                                          // onClick={() => {
                                          //   handleEdit();
                                          //   // setIsEdit(false);
                                          // }}
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          onClick={() => {
                                            setIsEdit(false);
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </form>
                                  </CardBody>

                                  {/* <Button
                              color="success"
                              onClick={() => {
                                setIsEdit(false);
                              }}
                              >
                              Save
                            </Button> */}
                                </Card>
                              ) : (
                                <Card
                                  sx={{ minWidth: 275 }}
                                  style={{
                                    background: "#F4F6FF",
                                    border: "1px solid #ccc",
                                  }}
                                >
                                  <CardContent>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        style={{
                                          fontSize: "20px",
                                          color: "black",
                                          marginRight: "10px",
                                        }}
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        {matchedApplicant?.tenant_firstName +
                                          " " +
                                          matchedApplicant?.tenant_lastName}
                                      </Typography>
                                      <Typography
                                        style={{
                                          cursor: "pointer",
                                          textDecoration: "underline",
                                          marginBottom: "5px",
                                          // border: "2px solid black", // Example: 5px solid black border
                                          // borderRadius: "10px", // Example: 10px border-radius
                                        }}
                                        onClick={onClickEditButton}
                                      >
                                        <EditIcon
                                          style={{ fontSize: "large" }}
                                        />
                                      </Typography>
                                    </div>
                                    <Typography variant="caption">
                                      Applicant
                                    </Typography>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Typography>
                                        <HomeIcon />
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          marginLeft: "10px",
                                        }}
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        {matchedApplicant?.tenant_homeNumber ||
                                          "N/A"}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Typography>
                                        <BusinessCenterIcon />
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          marginLeft: "10px",
                                        }}
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        {matchedApplicant?.tenant_workNumber ||
                                          "N/A"}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Typography>
                                        <PhoneAndroidIcon />
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          marginLeft: "10px",
                                        }}
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        {matchedApplicant?.tenant_mobileNumber ||
                                          "N/A"}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Typography>
                                        <EmailIcon />
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          marginLeft: "10px",
                                        }}
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        {matchedApplicant?.tenant_email ||
                                          "N/A"}
                                      </Typography>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </Grid>
                          </Grid>
                        </Col>
                      </Row>
                    </TabPanel>

                    <TabPanel value="Application">
                      <Row style={{ backgroundColor: "" }}>
                        <Col>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Box>
                                {isApplicantDataEmpty ? (
                                  <section className="">
                                    <div className="row d-flex ">
                                      <div>
                                        {/* Emergency Contact Relationship */}
                                        <div className="form-row pl-2">
                                          <p>
                                            A rental application is not
                                            associated with the applicant. A
                                            link to the online rental
                                            application can be either emailed
                                            directly to the applicant for
                                            completion or the application
                                            details can be entered into Buildium
                                            manually.
                                          </p>
                                        </div>

                                        {sendApplicantMail?.applicant_emailsend_date ? (
                                          <div className="d-flex align-items-center">
                                            <img
                                              src={greenTick}
                                              alt="Email send image"
                                              width="30px"
                                              height="30px"
                                            />{" "}
                                            <span className="ml-2">
                                              Application emailed{" "}
                                              {
                                                sendApplicantMail?.applicant_emailsend_date
                                              }
                                            </span>
                                          </div>
                                        ) : null}
                                      </div>

                                      <div className="mt-4 d-flex flex-column flex-sm-row align-items-center">
                                        <button
                                          type="button"
                                          className="btn btn-secondary ml-sm-3 mt-3 mt-sm-0"
                                          style={{
                                            borderRadius: "10px",
                                            transition:
                                              "border-color 0.3s ease-in-out, background-color 0.3s ease-in-out",
                                          }}
                                          onClick={sendApplicantMailData}
                                          disabled={sendApplicantMailLoader}
                                        >
                                          {sendApplicantMailLoader
                                            ? "Sending..."
                                            : "Email link to online rental application"}
                                        </button>

                                        <Link
                                          to={`/admin/applicant-form/${id}`}
                                          target="_blank"
                                          className="btn btn-secondary ml-sm-3 mt-3 mt-sm-0"
                                          style={{
                                            borderRadius: "10px",
                                            transition:
                                              "border-color 0.3s ease-in-out, background-color 0.3s ease-in-out",
                                          }}
                                        >
                                          Manually enter application details
                                        </Link>
                                      </div>
                                    </div>
                                  </section>
                                ) : (
                                  <>
                                    <div className="applicant-info mt-3">
                                      <div className="d-flex">
                                        <h2>Rental history</h2>
                                        <Link
                                          to={`/admin/applicant-form/${id}`}
                                          target="_blank"
                                          className="btn btn-secondary ml-sm-3 mt-3 mt-sm-0"
                                          style={{
                                            borderRadius: "10px",
                                            transition:
                                              "border-color 0.3s ease-in-out, background-color 0.3s ease-in-out",
                                          }}
                                        >
                                          Edit
                                        </Link>
                                      </div>
                                      <hr
                                        style={{
                                          border: "1px solid black",
                                          marginTop: "5px",
                                        }}
                                      />
                                      <table>
                                        <tbody>
                                          <tr>
                                            <td>APPLICANT NAME:</td>
                                            <td>
                                              <strong>
                                                {`${
                                                  applicantDatas?.applicant_firstName
                                                } ${" "} ${
                                                  applicantDatas?.applicant_lastName
                                                }`}
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>
                                              APPLICANT SOCIAL SECURITY NUMBER:
                                            </td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.applicant_socialSecurityNumber
                                                }
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>APPLICANT BIRTH DATE:</td>
                                            <td>
                                              <strong>
                                                {applicantDatas?.applicant_dob}
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>APPLICANT CURRENT ADDRESS:</td>
                                            <td>
                                              <strong>
                                                {`${applicantDatas?.applicant_country}, ${applicantDatas?.applicant_adress}, ${applicantDatas?.applicant_city}, ${applicantDatas?.applicant_state}, ${applicantDatas?.applicant_zipcode}`}
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>APPLICANT EMAIL:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.applicant_email
                                                }
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>APPLICANT CELL PHONE:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.applicant_cellPhone
                                                }
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>APPLICANT HOME PHONE:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.applicant_homePhone
                                                }
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>EMERGENCY CONTACT NAME:</td>
                                            <td>
                                              <strong>
                                                {`${applicantDatas?.applicant_emergencyContact_firstName}, ${applicantDatas?.applicant_emergencyContact_lasttName}`}
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              EMERGENCY CONTACT RELATIONSHIP:
                                            </td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.applicant_emergencyContact_relationship
                                                }
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>EMERGENCY CONTACT EMAIL:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.applicant_emergencyContact_email
                                                }
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>EMERGENCY CONTACT PHONE:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.applicant_emergencyContact_phone
                                                }
                                              </strong>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="applicant-info mt-3">
                                      <h2>Applicant Information</h2>
                                      <hr
                                        style={{
                                          border: "1px solid black",
                                          marginTop: "5px",
                                        }}
                                      />
                                      <table>
                                        <tbody>
                                          <tr>
                                            <td>RENTAL ADDRESS:</td>
                                            <td>
                                              <strong>
                                                {`${applicantDatas?.rental_country}, ${applicantDatas?.rental_adress}, ${applicantDatas?.rental_city}, ${applicantDatas?.rental_state}, ${applicantDatas?.rental_zipcode}`}
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>RENTAL DATES:</td>
                                            <td>
                                              <strong>
                                                {`${
                                                  applicantDatas?.rental_data_from
                                                } ${"-"} ${
                                                  applicantDatas?.rental_date_to
                                                }`}
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>MONTHLY RENT:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.rental_monthlyRent
                                                }
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>REASON FOR LEAVING:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.rental_resaonForLeaving
                                                }
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>LANDLORD NAME:</td>
                                            <td>
                                              <strong>
                                                {`${
                                                  applicantDatas?.rental_landlord_firstName
                                                } ${"-"} ${
                                                  applicantDatas?.rental_landlord_lasttName
                                                }`}
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>LANDLORD PHONE NUMBER:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.rental_landlord_phoneNumber
                                                }
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>LANDLORD EMAIL:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.rental_landlord_email
                                                }
                                              </strong>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="applicant-info mt-3">
                                      <h2 className="hr">Employment</h2>
                                      <hr
                                        style={{
                                          border: "1px solid black",
                                          marginTop: "5px",
                                        }}
                                      />
                                      <hr />
                                      <table>
                                        <tbody>
                                          <tr>
                                            <td>EMPLOYER NAME:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.employment_name
                                                }
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>EMPLOYER ADDRESS:</td>
                                            <td>
                                              <strong>
                                                {`${applicantDatas?.employment_country}, ${applicantDatas?.employment_adress}, ${applicantDatas?.employment_city}, ${applicantDatas?.employment_state}, ${applicantDatas?.employment_zipcode}`}
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>EMPLOYER PHONE NUMBER:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.employment_phoneNumber
                                                }
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>EMPLOYER EMAIL:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.employment_email
                                                }
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>POSITION HELD:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.employment_position
                                                }
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>EMPLOYMENT DATES:</td>
                                            <td>
                                              <strong>
                                                {`${applicantDatas?.employment_date_from}, ${applicantDatas?.employment_date_to}`}
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>MONTHLY GROSS SALARY:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.employment_monthlyGrossSalary
                                                }
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>SUPERVISOR NAME:</td>
                                            <td>
                                              <strong>
                                                {`${
                                                  applicantDatas?.employment_supervisor_first
                                                } ${" "} ${
                                                  applicantDatas?.employment_supervisor_last
                                                }`}
                                              </strong>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td>SUPERVISOR TITLE:</td>
                                            <td>
                                              <strong>
                                                {
                                                  applicantDatas?.employment_supervisor_title
                                                }
                                              </strong>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </Col>
                      </Row>
                    </TabPanel>

                    <TabPanel value="Approved">
                      <CardHeader className="border-0">
                        {/* <span>
                        <span>Property :</span>
                        <h2 style={{ color: "blue" }}> {rental}</h2>
                      </span> */}
                      </CardHeader>
                      <Row>
                        {loader2 ? (
                          <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                            <RotatingLines
                              strokeColor="grey"
                              strokeWidth="5"
                              animationDuration="0.75"
                              width="50"
                              visible={loader2}
                            />
                          </div>
                        ) : (
                          <Col>
                            {/* {Array.isArray(rentaldata) ? ( */}
                            <Grid container spacing={2}>
                              {console.log(rentaldata, "rentaldata")}
                              {rentaldata.map((tenant, index) => (
                                <Grid
                                  item
                                  xs={12}
                                  sm={6}
                                  // key={index}
                                >
                                  {/* {tenant.entries.map((entry) => ( */}
                                  <Box
                                    // key={index}
                                    border="1px solid #ccc"
                                    borderRadius="8px"
                                    padding="16px"
                                    maxWidth="400px"
                                    margin="20px"
                                  >
                                    <Row>
                                      <Col lg="2">
                                        <Box
                                          width="40px"
                                          height="40px"
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                          backgroundColor="grey"
                                          borderRadius="8px"
                                          color="white"
                                          fontSize="24px"
                                        >
                                          <AssignmentIndIcon />
                                        </Box>
                                      </Col>

                                      <Col lg="5">
                                        <div
                                          style={{
                                            color: "blue",
                                            height: "40px",
                                            fontWeight: "bold",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "start",
                                          }}
                                        >
                                          {tenant.tenant_firstName || "N/A"}{" "}
                                          {/* Jadeja Yash */}
                                          {tenant.tenant_lastName || "N/A"}
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            paddingTop: "3px",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              fontSize: "2px",
                                              color: "black",
                                            }}
                                          >
                                            <PhoneAndroidIcon />
                                          </Typography>
                                          {tenant.tenant_mobileNumber || "N/A"}
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              fontSize: "7px",
                                              color: "black",
                                            }}
                                          >
                                            <HomeIcon />
                                          </Typography>
                                          {tenant.rental_adress || "N/A"}
                                          {/* property1 */}
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            paddingTop: "3px",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                            color: "green",
                                          }}
                                        >
                                          {/* {tenant.tenant_mobileNumber || "N/A"} */}
                                          Approved
                                        </div>
                                      </Col>
                                    </Row>
                                  </Box>
                                  {/* ))} */}
                                </Grid>
                              ))}
                            </Grid>
                            {/* ) : (
                          <h3>No data available....</h3>
                        )} */}
                          </Col>
                        )}
                      </Row>
                    </TabPanel>
                    <TabPanel value="Rejected">
                      <CardHeader className="border-0">
                        {/* <span>
                        <span>Property :</span>
                        <h2 style={{ color: "blue" }}> {rental}</h2>
                      </span> */}
                      </CardHeader>
                      <Row>
                        {loader3 ? (
                          <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                            <RotatingLines
                              strokeColor="grey"
                              strokeWidth="5"
                              animationDuration="0.75"
                              width="50"
                              visible={loader3}
                            />
                          </div>
                        ) : (
                          <Col>
                            {/* {Array.isArray(rentaldata) ? ( */}
                            <Grid container spacing={2}>
                              {rentaldata.map((tenant, index) => (
                                <Grid
                                  item
                                  xs={12}
                                  sm={6}
                                  // key={index}
                                >
                                  {/* {tenant.entries.map((entry) => ( */}
                                  <Box
                                    // key={index}
                                    border="1px solid #ccc"
                                    borderRadius="8px"
                                    padding="16px"
                                    maxWidth="400px"
                                    margin="20px"
                                  >
                                    <Row>
                                      <Col lg="2">
                                        <Box
                                          width="40px"
                                          height="40px"
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                          backgroundColor="grey"
                                          borderRadius="8px"
                                          color="white"
                                          fontSize="24px"
                                        >
                                          <AssignmentIndIcon />
                                        </Box>
                                      </Col>

                                      <Col lg="5">
                                        <div
                                          style={{
                                            color: "blue",
                                            height: "40px",
                                            fontWeight: "bold",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "start",
                                          }}
                                        >
                                          {tenant.tenant_firstName || "N/A"}{" "}
                                          {/* Jadeja Yash */}
                                          {tenant.tenant_lastName || "N/A"}
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            paddingTop: "3px",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              fontSize: "2px",
                                              color: "black",
                                            }}
                                          >
                                            <PhoneAndroidIcon />
                                          </Typography>
                                          {tenant.tenant_mobileNumber || "N/A"}
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              fontSize: "7px",
                                              color: "black",
                                            }}
                                          >
                                            <HomeIcon />
                                          </Typography>
                                          {tenant.rental_adress || "N/A"}
                                          {/* property1 */}
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            paddingTop: "3px",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                            color: "red",
                                          }}
                                        >
                                          {/* {tenant.tenant_mobileNumber || "N/A"} */}
                                          Rejected
                                        </div>
                                      </Col>
                                    </Row>
                                  </Box>
                                  {/* ))} */}
                                </Grid>
                              ))}
                            </Grid>
                            {/* ) : (
                          <h3>No data available....</h3>
                        )} */}
                          </Col>
                        )}
                      </Row>
                    </TabPanel>
                  </TabContext>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </Container>
    </>
  );
};

export default ApplicantSummary;
