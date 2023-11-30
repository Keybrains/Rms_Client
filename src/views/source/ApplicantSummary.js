import Header from "components/Headers/Header";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import HomeIcon from "@mui/icons-material/Home";
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
import CloseIcon from "@mui/icons-material/Close";
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
import {
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
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

const ApplicantSummary = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  //console.log(id, "id");
  const [file, setFile] = useState("");
  const [selectedDropdownItem, setselectedDropdownItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = React.useState("Summary");
  const [searchText, setSearchText] = useState("");
  // const [isChecklistVisible, setIsChecklistVisible] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState("");
  const [showNotesFiles, setShowNotesFiles] = useState(false);

  const [applicantData, setApplicantData] = useState();
  const [propertyData, setPropertyData] = useState();
  const [isEdit, setIsEdit] = useState(false);

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
  const handleSearch = () => {
    // Handle search functionality here
    //console.log("Searching for:", searchText);
  };

  const handleAttachFile = () => {
    setIsAttachFile(true);
  };

  const handleClear = () => {
    setSearchText("");
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    //console.log(newValue);
    //console.log(matchedApplicant?.tenant_mobileNumber);
    tenantsData(matchedApplicant?.tenant_mobileNumber, newValue);
  };

  const dropdownList = ["Approved", "Rejected"];

  const selectedDropdown = (item) => {
    setselectedDropdownItem(item);

    //console.log(item, "item");
  };

  const handleOpen = () => {
    setIsOpen(true);
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
      applicant_notes: notes,
      applicant_attachment: file,
    },
    onSubmit: (values) => {
      handleEdit(values);
      //console.log(values, "values");
    },
  });

  const applicantFormik1 = useFormik({
    initialValues: {
      applicant_notes: notes,
      applicant_attachment: file,
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = (values) => {
    // Handle form submission
    hadlenotesandfile(values); // Call handleEdit function to make PUT request
  };
  console.log(typeof(applicantFormik1.values.applicant_notes))
  console.log(typeof(applicantFormik1.values.applicant_attachment))

  const hadlenotesandfile = (values) => {
    // Make a PUT request to update the data in the backend
    console.log(values)

    const data = {
      applicant_notes: applicantFormik1.values.applicant_notes,
      applicant_attachment: applicantFormik1.values.applicant_attachment,
    }

    const apiUrl = `https://propertymanager.cloudpress.host/api/applicant//applicant/note_attachment/${id}`;

    axios
      .put(apiUrl, data)
      .then((response) => {
        // Handle successful response from the API
        console.log("Data updated successfully:", response.data);
        // You might perform additional actions upon successful submission
      })
      .catch((error) => {
        // Handle errors if the PUT request fails
        console.error("Error updating data:", error);
        // You might display an error message to the user or perform other actions
      });
  };

  const [rentaldata, setRentaldata] = useState([]);

  const tenantsData = async (number, status) => {
    // Construct the API URL
    const apiUrl = `https://propertymanager.cloudpress.host/api/applicant/applicant_get?tenant_mobileNumber=${number}&status=${status}`;

    try {
      // Fetch tenant data
      const response = await axios.get(apiUrl);
      const tenantData = response.data.data;
      ////console.log(tenantData.tenant_firstName, "abcd");
      // setTenantDetails(tenantData);
      setRentaldata(tenantData);
      //console.log(response.data, "mansi");
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      // setError(error);
      // setLoading(false);
    }
  };

  const handleEditStatus = (item) => {
    //console.log(selectedDropdownItem, "selectedDropdownItem");

    // //console.log(updatedApplicant, "updatedApplicant 403");
    const status = {
      status: item,
    };
    axios
      .put(`https://propertymanager.cloudpress.host/api/applicant/applicant/${id}/status`, status)
      .catch((err) => {
        console.error(err);
      })
      .then((res) => {
        //console.log(res, "res");
        getApplicantData();
      });
  };

  const navigateToLease = (tenantID, entryIndex) => {
    axios
      .get(`https://propertymanager.cloudpress.host/api/applicant/applicant_summary/${id}`)
      .then((response) => {
        const data = response.data.data;

        // Extract the rental address from the response
        const rentalAddress = data.rental_adress;

        //console.log(rentalAddress, "Rental Addressss");
        axios
          .get("https://propertymanager.cloudpress.host/api/rentals/allproperty")
          .then((response) => {
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
              //console.log(tenantID, "tenantID");
              navigate(`/admin/RentRollLeaseing/${tenantID}/${entryIndex}`);
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
  //     .get(`https://propertymanager.cloudpress.host/api/applicant/applicant_summary/${id}`)
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
      .get(`https://propertymanager.cloudpress.host/api/applicant/applicant_summary/${id}`)
      .then((applicants) => {
        axios
          .get("https://propertymanager.cloudpress.host/api/rentals/property")
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

  const [isChecklistVisible, setChecklistVisible] = useState(false);
  const [checklistItems, setChecklistItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const toggleChecklist = () => {
    setChecklistVisible(!isChecklistVisible);
  };

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
        .put(
          `https://propertymanager.cloudpress.host/api/applicant/applicant/${id}/checklist`,
          updatedApplicant
        )
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
  // const [tenantID, setTenantID]=useState("")
  const fetchDataAndPost = async () => {
    try {
      // Step 1: Fetch data from the API
      const response = await axios.get(
        `https://propertymanager.cloudpress.host/api/applicant/applicant_summary/${id}`
      );

      // Check if the response contains the data you expect
      const fetchedData = response.data;
      //console.log(fetchedData, "fetched data");
      if (fetchedData) {
        // Step 2: Create an object with the fetched data
        const dataToSend = {
          tenant_firstName: fetchedData.data.tenant_firstName,
          tenant_lastName: fetchedData.data.tenant_lastName,
          tenant_unitNumber: fetchedData.data.tenant_unitNumber,
          tenant_mobileNumber: fetchedData.data.tenant_mobileNumber,
          tenant_workNumber: fetchedData.data.tenant_workNumber,
          tenant_homeNumber: fetchedData.data.tenant_homeNumber,
          tenant_faxPhoneNumber: fetchedData.data.tenant_faxPhoneNumber,
          tenant_email: fetchedData.data.tenant_email,
          entries: [
            {
              rental_adress: fetchedData.data.rental_adress,
              rental_units: fetchedData.data.rental_units,
            },
          ],
        };

        // Step 3: Make a POST request to send the data to the server
        const postResponse = await axios.post(
          "https://propertymanager.cloudpress.host/api/tenant/tenant",
          dataToSend
        );

        //console.log(dataToSend, "hagfjg");
        if (postResponse.status === 200) {
          //console.log("Data posted successfully:", postResponse.data.data);
          // setTenantID(postResponse.data.data._id)
          navigateToLease(
            postResponse.data.data._id,
            postResponse.data.data.entries[0].entryIndex
          );
        } else {
          console.error(
            "Data post request failed. Status code:",
            postResponse.status
          );
          console.error(
            "Error message from the server:",
            postResponse.data.message
          );
        }
      } else {
        // Handle the case where the fetched data is not as expected
        console.error("Invalid data format received from the API");
      }
    } catch (error) {
      // Handle errors if either the GET or POST request fails
      console.error("Data fetch or post failed", error);
    }
  };
  const [matchedApplicant, setMatchedApplicant] = useState([]);
  const getApplicantData = async () => {
    await axios
      .get("https://propertymanager.cloudpress.host/api/applicant/applicant")
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.data) {
          const applicantData = response.data.data;
          const matchedApplicant = applicantData.find((applicant) => {
            return applicant._id === id;
          });
          //console.log(matchedApplicant, "matchedApplicant");
          setMatchedApplicant(matchedApplicant);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const onClickEditButton = () => {
    setIsEdit(true);
    //console.log(matchedApplicant, "matchedApplicant from edit ");
    applicantFormik.setValues({
      tenant_firstName: matchedApplicant.tenant_firstName,
      tenant_lastName: matchedApplicant.tenant_lastName,
      tenant_unitNumber: matchedApplicant.tenant_unitNumber,
      tenant_mobileNumber: matchedApplicant.tenant_mobileNumber,
      tenant_workNumber: matchedApplicant.tenant_workNumber,
      tenant_homeNumber: matchedApplicant.tenant_homeNumber,
      tenant_faxPhoneNumber: matchedApplicant.tenant_faxPhoneNumber,
      tenant_email: matchedApplicant.tenant_email,
    });
  };

  const handleEdit = (values) => {
    setIsEdit(false);
    //console.log(matchedApplicant, "matchedApplicant from edit ");
    const updatedApplicant = {
      ...matchedApplicant,
      tenant_firstName: values.tenant_firstName,
      tenant_lastName: values.tenant_lastName,
      tenant_unitNumber: values.tenant_unitNumber,
      tenant_mobileNumber: values.tenant_mobileNumber,
      // tenant_workNumber: values.tenant_workNumber,
      tenant_homeNumber: values.tenant_homeNumber,
      tenant_faxPhoneNumber: values.tenant_faxPhoneNumber,
      tenant_email: values.tenant_email,
      tenant_workNumber: values.tenant_workNumber,
      status: selectedDropdownItem,
    };
    //console.log(updatedApplicant, "updatedApplicant");

    axios
      .put(
        `https://propertymanager.cloudpress.host/api/applicant/applicant/${id}`,
        updatedApplicant
      )
      .catch((err) => {
        console.error(err);
      })
      .then((res) => {
        //console.log(res, "res");
        getApplicantData();
      });
  };

  useEffect(() => {
    getApplicantData();
  }, []);

  const handleChecklistChange = (event, item) => {
    // if (event.target.checked) {
    //   setChecklistItems([...checklistItems, item]);
    //   const allCheckbox = [...checklistItems, item];
    //   //console.log(allCheckbox, "allCheckbox");
    //   //console.log(matchedApplicant, "matchedApplicant");
    //   const updatedApplicant = {
    //     ...matchedApplicant,
    //     applicant_checklist: [...matchedApplicant.applicant_checklist, item],
    //   };
    //   //console.log(updatedApplicant, "updatedApplicant");
    // }
    if (event.target.checked) {
      //console.log(item, "item");
      if (!applicantFormik.values.applicant_checkedChecklist.includes(item)) {
        applicantFormik.setFieldValue("applicant_checkedChecklist", [
          ...applicantFormik.values.applicant_checkedChecklist,
          item,
        ]);
      }
      // //console.log(applicantFormik.values, "ssssssssssss");
    } else {
      applicantFormik.setFieldValue(
        "applicant_checkedChecklist",
        applicantFormik.values.applicant_checkedChecklist.filter(
          (checklistItem) => checklistItem !== item
        )
      );
      // setChecklistItems([...checklistItems, item]);
    }
  };
  const fileData = (files) => {
    //setImgLoader(true);
    // //console.log(files, "file");
    const filesArray = Array.from(files);

    if (filesArray.length <= 10 && file.length === 0) {
      setFile([...filesArray]);
    } else if (
      file.length >= 0 &&
      file.length <= 10 &&
      filesArray.length + file.length > 10
    ) {
      setFile([...file]);
    } else {
      setFile([...file, ...filesArray]);
    }

    // //console.log(file, "fileanaadsaa");

    const dataArray = new FormData();
    dataArray.append("b_video", files);

    let url = "https://cdn.brandingprofitable.com/image_upload.php/";
    axios
      .post(url, dataArray, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        //setImgLoader(false);
        const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
        //console.log(imagePath, "imagePath");
        // setFile(imagePath);
        applicantFormik1.values.applicant_attachment = imagePath;
      })
      .catch((err) => {
        //setImgLoader(false);
        //console.log("Error uploading image:", err);
      });
  };

  const deleteFile = (index) => {
    const newFile = [...file];
    newFile.splice(index, 1);
    setFile(newFile);
  };

  const handleOpenFile = (file) => {
    if (file.type === "text/plain") {
      // Read the contents of the text file
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;

        // Display the content to the user (for demonstration, you might use an alert)
        alert("Content of the text file:\n\n" + fileContent);
      };
      reader.readAsText(file);
    } else {
      // For other file types, handle accordingly (e.g., open in a new tab)
      window.open(URL.createObjectURL(file));
    }
  };

  //console.log(applicantFormik.values, "formik");
  const getFileNameWithExtension = (file) => {
    const fileName = file?.name;
    return fileName;
  };

  const handleAddNote = () => {
    if (newNote !== "") {
      setNotes([...notes, newNote]);
      setNewNote("");
    }
  };

  const handleAddFile = () => {
    // Modify logic to add files only upon clicking "Save"
    // You can keep the existing logic if needed for immediate addition
    if (newFile !== "") {
      setNewFile("");
    }
  };

  const handleSave = () => {
    // Add selected files to the table on Save button click
    if (files.length + file.length <= 10) {
      setFile([...file, ...files]);
      setFiles([]);
    }
    setShowNotesFiles(true);
  };

  const handleClearAll = () => {
    setNotes([]);
    setFiles([]);
    setFile([]);
    setNewNote("");
    setNewFile("");
  };
  const openFileInNewTab = (selectedFile) => {
    const fileURL = URL.createObjectURL(selectedFile);
    window.open(fileURL, "_blank");
  };

  return (
    <>
      <Header title="ApplicantSummary" />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Applicant Details</h1>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
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
          <div
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
                " : " +
                matchedApplicant.rental_adress +
                " - " +
                matchedApplicant.rental_units}
            </Typography>
          </div>
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
              <DropdownToggle caret style={{ width: "100%" }}>
                {matchedApplicant.status
                  ? matchedApplicant.status
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
            <Button
              style={
                selectedDropdownItem === "Approved"
                  ? { display: "block", marginLeft: "10px" }
                  : { display: "none" }
              }
              color="success"
              onClick={(e) => {
                fetchDataAndPost();
                // navigate("/admin/RentRoll");
              }}
            >
              Move in
            </Button>
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
                    <Col lg="4">
                      <FormGroup>
                        <div>
                          {showNotesFiles &&
                            (notes.length > 0 || file.length > 0) && (
                              <div
                                style={{
                                  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                                  padding: "10px",
                                }}
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid #ccc",
                                        padding: "10px",
                                        width:
                                          "100%" /* Example: Divide the table into two equal columns */,
                                      }}
                                    >
                                      {notes.map((note, index) => (
                                        <div key={index}>
                                          <div>
                                            <p style={{ fontWeight: "bold" }}>
                                              Note: {note}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid #ccc",
                                        padding: "10px",
                                        width:
                                          "100%" /* Example: Divide the table into two equal columns */,
                                      }}
                                    >
                                      {file?.map((selectedFile, index) => (
                                        <div key={index}>
                                          <p
                                            onClick={() =>
                                              openFileInNewTab(selectedFile)
                                            }
                                            style={{
                                              cursor: "pointer",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            <FileOpenIcon />
                                            {selectedFile.name}
                                          </p>
                                        </div>
                                      ))}
                                    </td>
                                  </tr>
                                  {notes.length > 0 || file.length > 0 ? (
                                    <tr>
                                      <td
                                        colSpan="2"
                                        style={{
                                          padding: "10px",
                                          border: "1px solid #ccc",
                                          // textAlign: "center",
                                        }}
                                      >
                                        <button
                                          style={{
                                            padding: "5px 10px",
                                            borderRadius: "3px",
                                            background: "#28a745",
                                            color: "#fff",
                                            border: "none",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            handleClearAll();
                                          }}
                                        >
                                          Clear
                                        </button>
                                      </td>
                                    </tr>
                                  ) : null}
                                </tbody>
                              </div>
                            )}
                        </div>

                        <div>
                          {isAttachFile ? (
                            <Card
                              style={{
                                width: "400px",
                                margin: "20px auto",
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
                                  {notes.map((note, index) => (
                                    <div key={index}>
                                      <p>{note}</p>
                                    </div>
                                  ))}
                                  <div>
                                    <TextField
                                      type="text"
                                      size="small"
                                      fullWidth
                                      value={newNote}
                                      onChange={(e) =>
                                        {setNewNote(e.target.value);
                                          applicantFormik1.values.applicant_notes = e.target.value}
                                      }
                                    />
                                  </div>
                                </div>
                                <label
                                  htmlFor="upload_file"
                                  className="form-control-label"
                                  style={{
                                    display: "block",
                                    marginBottom: "8px",
                                  }}
                                >
                                  Upload Files (Maximum of 10)
                                </label>
                                <div className="d-flex align-items-center">
                                  <input
                                    type="file"
                                    className="form-control-file d-none"
                                    accept="file/*"
                                    name="upload_file"
                                    id="upload_file"
                                    multiple
                                    onChange={(e) => fileData(e.target.files)}
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
                                  {applicantFormik1.touched
                                    .applicant_attachment &&
                                  applicantFormik1.errors
                                    .applicant_attachment ? (
                                    <div style={{ color: "red" }}>
                                      {
                                        applicantFormik1.errors
                                          .applicant_attachment
                                      }
                                    </div>
                                  ) : null}
                                  {file.length > 0 &&
                                    file.map((file, index) => (
                                      <div
                                        key={index}
                                        className="position-relative"
                                        style={{ marginRight: "10px" }}
                                      >
                                        <p
                                          onClick={() => handleOpenFile(file)}
                                          style={{
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                          }}
                                        >
                                          {getFileNameWithExtension(file)}
                                        </p>
                                        <span
                                          className="close-icon"
                                          onClick={() => deleteFile(index)}
                                          style={{
                                            cursor: "pointer",
                                            position: "absolute",
                                            top: "-8px",
                                            right: "-5px",
                                            fontSize: "18px",
                                          }}
                                        >
                                          &times;
                                        </span>
                                      </div>
                                    ))}
                                </div>

                                <div className="mt-3">
                                  <Button
                                    color="success"
                                    onClick={() => {
                                      setIsAttachFile(false);
                                      handleAddNote();
                                      handleAddFile();
                                      handleSave();
                                      handleSubmit();
                                    }}
                                    style={{ marginRight: "10px" }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => setIsAttachFile(false)}
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
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              Attach note or file
                            </Button>
                          )}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Grid container spacing={3}>
                        <Grid item xs={9}>
                          <div>
                            <div>
                              <input
                                type="checkbox"
                                id="vehicle1"
                                name="vehicle1"
                                value="CreditCheck"
                                style={{
                                  transform: "scale(1.5)",
                                  marginLeft: "4px",
                                  marginTop: "20px",
                                  fontWeight: 'bold'
                                }}
                              />{" "}
                              Credit and background check <br />
                              <input
                                type="checkbox"
                                id="vehicle2"
                                name="vehicle2"
                                value="EmploymentVerification"
                                style={{
                                  transform: "scale(1.5)",
                                  marginLeft: "4px",
                                  marginTop: "20px",
                                  fontWeight: 'bold'
                                }}
                              />{" "}
                              Employment verification <br />
                              <input
                                type="checkbox"
                                id="vehicle3"
                                name="vehicle3"
                                value="ApplicationFee"
                                style={{
                                  transform: "scale(1.5)",
                                  marginLeft: "4px",
                                  marginTop: "20px",
                                  fontWeight: 'bold'
                                }}
                              />{" "}
                              Application fee collected <br />
                              <input
                                type="checkbox"
                                id="vehicle4"
                                name="vehicle4"
                                value="IncomeVerification"
                                style={{
                                  transform: "scale(1.5)",
                                  marginLeft: "4px",
                                  marginTop: "20px",
                                  fontWeight: 'bold'
                                }}
                              />{" "}
                              Income verification <br />
                              <input
                                type="checkbox"
                                id="vehicle5"
                                name="vehicle5"
                                value="LandlordVerification"
                                style={{
                                  transform: "scale(1.5)",
                                  marginLeft: "4px",
                                  marginTop: "20px",
                                  fontWeight: 'bold'
                                }}
                              />{" "}
                              Landlord verification <br />
                            </div>

                            <Box display="flex" flexDirection="column">
                              {matchedApplicant?.applicant_checklist?.map(
                                (item, index) => (
                                  <div key={index}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          value={item}
                                          color="success"
                                          onChange={(e) => {
                                            handleChecklistChange(e, item);
                                          }}
                                          checked={applicantFormik.values.applicant_checkedChecklist.includes(
                                            item
                                          )} // You can set the checked state as needed
                                        />
                                      }
                                      label={item}
                                    />
                                  </div>
                                )
                              )}
                            </Box>
                            {isChecklistVisible && (
                              <div>
                                <Box
                                  display="flex"
                                  sx={{ width: "50%" }}
                                  flexDirection="row"
                                  alignItems="center"
                                >
                                  <TextField
                                    type="text"
                                    size="small"
                                    fullWidth
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                  />
                                  <CheckIcon
                                    sx={{
                                      backgroundColor: "green",
                                      color: "white",
                                      width: "30px",
                                      height: "30px",
                                      marginLeft: "5px",
                                      cursor: "pointer",
                                    }}
                                    onClick={handleAddItem}
                                  />
                                  <CloseIcon
                                    sx={{
                                      backgroundColor: "red",
                                      color: "white",
                                      width: "30px",
                                      height: "30px",
                                      marginLeft: "5px",
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
                        </Grid>
                        <Grid item xs={3}>
                          {isEdit ? (
                            <Card>
                              <CardBody>
                                {/* <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText> */}
                                <form onSubmit={applicantFormik.handleSubmit}>
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
                                        applicantFormik.values.tenant_firstName
                                      }
                                      onChange={applicantFormik.handleChange}
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
                                        applicantFormik.values.tenant_lastName
                                      }
                                      onChange={applicantFormik.handleChange}
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
                                      onChange={applicantFormik.handleChange}
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
                                        applicantFormik.values.tenant_workNumber
                                      }
                                      onChange={applicantFormik.handleChange}
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
                                        applicantFormik.values.tenant_homeNumber
                                      }
                                      onChange={applicantFormik.handleChange}
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
                                      onChange={applicantFormik.handleChange}
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
                                      onChange={applicantFormik.handleChange}
                                      onBlur={applicantFormik.handleBlur}
                                    />
                                  </div>

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
                            <Card sx={{ minWidth: 275 }}>
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
                                    <EditIcon style={{ fontSize: "large" }} />
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
                                    sx={{ fontSize: 14, marginLeft: "10px" }}
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
                                    sx={{ fontSize: 14, marginLeft: "10px" }}
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
                                    sx={{ fontSize: 14, marginLeft: "10px" }}
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
                                    sx={{ fontSize: 14, marginLeft: "10px" }}
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {matchedApplicant?.tenant_email || "N/A"}
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
                <TabPanel value="Approved">
                  <CardHeader className="border-0">
                    {/* <span>
                        <span>Property :</span>
                        <h2 style={{ color: "blue" }}> {rental}</h2>
                      </span> */}
                  </CardHeader>
                  <Row>
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
                  </Row>
                </TabPanel>
              </TabContext>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default ApplicantSummary;
