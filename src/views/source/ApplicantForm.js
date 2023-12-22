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
import swal from "sweetalert";

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

const ApplicantForm = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    // Add styles to hide the sidebar and header
    const sidenavMain = document.getElementById("sidenav-main");
    const headerElement = document.querySelector(".header");

    if (sidenavMain) {
      sidenavMain.style.display = "none";
    }

    if (headerElement) {
      headerElement.style.display = "none";
    }

    // Cleanup on component unmount
    return () => {
      // Restore sidebar and header visibility on unmount if needed
      if (sidenavMain) {
        sidenavMain.style.display = "block";
      }

      if (headerElement) {
        headerElement.style.display = "block";
      }
    };
  }, []);

  const navigate = useNavigate();
  const id = useParams().id;
  console.log(id, "id");
  const [selectedDropdownItem, setselectedDropdownItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = React.useState("Summary");
  const [searchText, setSearchText] = useState("");
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [applicantData, setApplicantData] = useState();
  const [propertyData, setPropertyData] = useState();
  const [isEdit, setIsEdit] = useState(false);

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  //   const [countries, setCountries] = useState([]);

  //   useEffect(() => {
  //     // Fetch countries from the API
  //     const fetchCountries = async () => {
  //       try {
  //         const response = await axios.get("https://restcountries.com/v3.1/all");
  //         // Sort countries alphabetically by name
  //         const sortedCountries = response.data.sort((a, b) =>
  //           a.name.common.localeCompare(b.name.common)
  //         );
  //         setCountries(sortedCountries);
  //       } catch (error) {
  //         console.error("Error fetching countries:", error);
  //       }
  //     };

  //     fetchCountries();
  //   }, []);

  //   React.useEffect(() => {
  //     if (localStorage.getItem("token")) {
  //       const jwt = jwtDecode(localStorage.getItem("token"));
  //       setAccessType(jwt.accessType);
  //     } else {
  //       navigate("/auth/login");
  //     }
  //   }, [navigate]);
  //   const handleSearch = () => {
  //     // Handle search functionality here
  //     console.log("Searching for:", searchText);
  //   };

  const [prodropdownOpen, setProDropdownOpen] = useState(false);
  const [applicantselectedCountry, setApplicantSelectedCountry] =
    useState(null);
  const toggle1 = () => {
    setProDropdownOpen(!prodropdownOpen);
  };

  const [prodropdownOpen2, setProDropdownOpen2] = useState(false);
  const [RentalselectedCountry, setRentalSelectedCountry] = useState(null);
  const toggle2 = () => {
    setProDropdownOpen2(!prodropdownOpen2);
  };

  const [prodropdownOpen3, setProDropdownOpen3] = useState(false);
  const [EmploymentselectedCountry, setEmploymentSelectedCountry] =
    useState(null);
  const toggle3 = () => {
    setProDropdownOpen3(!prodropdownOpen3);
  };

  const staticCountries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas (the)",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia (Plurinational State of)",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory (the)",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cayman Islands (the)",
    "Central African Republic (the)",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands (the)",
    "Colombia",
    "Comoros (the)",
    "Congo (the Democratic Republic of the)",
    "Congo (the)",
    "Cook Islands (the)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czechia",
    "Côte d'Ivoire",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic (the)",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands (the) [Malvinas]",
    "Faroe Islands (the)",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories (the)",
    "Gabon",
    "Gambia (the)",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Holy See (the)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea (the Democratic People's Republic of)",
    "Korea (the Republic of)",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic (the)",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands (the)",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia (Federated States of)",
    "Moldova (the Republic of)",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands (the)",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger (the)",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands (the)",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine, State of",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines (the)",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Republic of North Macedonia",
    "Romania",
    "Russian Federation (the)",
    "Rwanda",
    "Réunion",
    "Saint Barthélemy",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin (French part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten (Dutch part)",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan (the)",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands (the)",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates (the)",
    "United Kingdom of Great Britain and Northern Ireland (the)",
    "United States Minor Outlying Islands (the)",
    "United States of America (the)",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela (Bolivarian Republic of)",
    "Viet Nam",
    "Virgin Islands (British)",
    "Virgin Islands (U.S.)",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
    "Åland Islands",
  ];

  //   const [prodropdownOpen, setproDropdownOpen] = React.useState(false);

  const handleAttachFile = () => {
    setIsAttachFile(true);
  };

  const handleClear = () => {
    setSearchText("");
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
    console.log(matchedApplicant?.tenant_mobileNumber);
    tenantsData(matchedApplicant?.tenant_mobileNumber, newValue);
  };

  const dropdownList = ["Approved", "Rejected"];

  const selectedDropdown = (item) => {
    setselectedDropdownItem(item);

    console.log(item, "item");
  };

  const handleOpen = () => {
    setIsOpen(true);
  };
  const toggle = () => setIsOpen((prevState) => !prevState);
  //   const toggle1 = () => setproDropdownOpen((prevState) => !prevState);
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
    },
    onSubmit: (values) => {
      handleEdit(values);
      console.log(values, "values");
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
      //console.log(tenantData.tenant_firstName, "abcd");
      // setTenantDetails(tenantData);
      setRentaldata(tenantData);
      console.log(response.data, "mansi");
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      // setError(error);
      // setLoading(false);
    }
  };

  const handleEditStatus = (item) => {
    console.log(selectedDropdownItem, "selectedDropdownItem");

    // console.log(updatedApplicant, "updatedApplicant 403");
    const status = {
      status: item,
    };
    axios
      .put(
        `${baseUrl}/applicant/applicant/${id}/status`,
        status
      )
      .catch((err) => {
        console.error(err);
      })
      .then((res) => {
        console.log(res, "res");
        getApplicantData();
      });
  };

  const navigateToLease = (tenantID, entryIndex) => {
    axios
      .get(
        `${baseUrl}/applicant/applicant_summary/${id}`
      )
      .then((response) => {
        const data = response.data.data;

        // Extract the rental address from the response
        const rentalAddress = data.rental_adress;

        console.log(rentalAddress, "Rental Addressss");
        axios
          .get(
            `${baseUrl}/rentals/allproperty`
          )
          .then((response) => {
            const property = response.data.data;
            console.log(property, "properties");
            const matchedProperty = property.find((property) => {
              return property.rental_adress === rentalAddress;
            });
            console.log(matchedProperty, "matchedProperty");
            if (!matchedProperty) {
              alert("Property not found");
              return;
            } else {
              // navigate(`/admin/Leaseing/${id}/${matchedProperty._id}`);
              console.log(tenantID, "tenantID");
              navigate(`/admin/RentRollLeaseing/${tenantID}/${entryIndex}`);
              console.log(matchedApplicant, "matchedApplicant");
              // axios
              // .get("https://propertymanager.cloudpress.host/api/tenant/tenant")
              // .then((response) => {
              //   console.log(response.data.data,'response.data.data');
              //   const tenant = response.data.data;
              //   const matchedTenant = tenant.find((tenant) => {
              //     return tenant._id === id;
              //   })
              //   console.log(matchedTenant, "matchedTenantdddd");
              // })
              // .then((err) => {
              //   console.log(err);
              //   // setLoader(false);
              // });
              // navigate(`/admin/rentrolldetail/${id}/`);
            }
          });

        // Navigate to the leasing page with the rental address

        // console.log(`/admin/RentRollLeaseing/${rentalAddress}`, "fgbasfg");
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
  //           console.log(applicants.data.data, "applicants");
  //           console.log(properties.data.data, "properties");
  //           setApplicantData(applicants.data.data);
  //           const allProperties = properties.data.data;
  //           const allApplicants = applicants.data.data;
  //           const matchedProperty = allProperties.find((property) => {
  //             return property.rental_adress === allApplicants[0].rental_adress;
  //           });
  //           setPropertyData(matchedProperty);
  //           console.log(matchedProperty, "matchedProperty");
  //           navigate(`/admin/Leaseing/${id}/${matchedProperty._id}`);
  //           // console.log(response.data.data,'response.data.data');

  //           // setRentalsData(response.data.data);

  //           // setLoader(false);
  //         })
  //         .then((err) => {
  //           console.log(err);
  //           // setLoader(false);
  //         });
  //     })
  //     .then((err) => {
  //       console.log(err);
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
  //           console.log(applicants.data.data, "applicants");
  //           console.log(properties.data.data, "properties");
  //           setApplicantData(applicants.data.data);
  //           const allProperties = properties.data.data;
  //           const allApplicants = applicants.data.data;
  //           const matchedProperty = allProperties.find((property) => {
  //             return property.rental_adress === allApplicants.rental_adress;
  //           });
  //           setPropertyData(matchedProperty);
  //           console.log(matchedProperty, "matchedProperty");
  //           // navigate(`/admin/Leaseing/${id}/${matchedProperty._id}`);
  //           // console.log(response.data.data,'response.data.data');

  //           // setRentalsData(response.data.data);

  //           // setLoader(false);
  //         })
  //         .then((err) => {
  //           console.log(err);
  //           // setLoader(false);
  //         });
  //     })
  //     .then((err) => {
  //       console.log(err);
  //       // setLoader(false);
  //     });
  // }, [id]);

  useEffect(() => {
    axios
      .get(
        `${baseUrl}/applicant/applicant_summary/${id}`
      )
      .then((applicants) => {
        axios
          .get(`${baseUrl}/rentals/property`)
          .then((properties) => {
            setApplicantData(applicants.data.data);
            const allProperties = properties.data.data;
            const allApplicants = applicants.data.data;
            const matchedProperty = allProperties.find((property) => {
              return property.rental_adress === allApplicants.rental_adress;
            });
            setPropertyData(matchedProperty);
            console.log(matchedProperty, "matchedProperty");
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
      console.log(allCheckbox, "allCheckbox");
      console.log(matchedApplicant, "matchedApplicant");
      const updatedApplicant = {
        ...matchedApplicant,
        applicant_checklist: [...matchedApplicant.applicant_checklist, newItem],
      };
      console.log(updatedApplicant, "updatedApplicant");
      axios
        .put(
          `${baseUrl}/applicant/applicant/${id}/checklist`,
          updatedApplicant
        )
        .then((response) => {
          console.log(response.data.data, "response.data.data");
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
        `${baseUrl}/applicant/applicant_summary/${id}`
      );

      // Check if the response contains the data you expect
      const fetchedData = response.data;
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
          isApplicant: true,
          entries: [
            {
              rental_adress: fetchedData.data.rental_adress,
              rental_units: fetchedData.data.rental_units,
            },
          ],
        };

        // Step 3: Make a POST request to send the data to the server
        const postResponse = await axios.post(
          `${baseUrl}/tenant/tenant`,
          dataToSend
        );

        console.log(dataToSend, "hagfjg");
        if (postResponse.status === 200) {
          console.log("Data posted successfully:", postResponse.data.data);
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
      .get(`${baseUrl}/applicant/applicant`)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.data) {
          const applicantData = response.data.data;
          const matchedApplicant = applicantData.find((applicant) => {
            return applicant._id === id;
          });
          console.log(matchedApplicant, "matchedApplicant");
          setMatchedApplicant(matchedApplicant);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const onClickEditButton = () => {
    setIsEdit(true);
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
    console.log(matchedApplicant, "matchedApplicant from edit ");
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
    console.log(updatedApplicant, "updatedApplicant");

    axios
      .put(
        `${baseUrl}/applicant/applicant/${id}`,
        updatedApplicant
      )
      .catch((err) => {
        console.error(err);
      })
      .then((res) => {
        console.log(res, "res");
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
    //   console.log(allCheckbox, "allCheckbox");
    //   console.log(matchedApplicant, "matchedApplicant");
    //   const updatedApplicant = {
    //     ...matchedApplicant,
    //     applicant_checklist: [...matchedApplicant.applicant_checklist, item],
    //   };
    //   console.log(updatedApplicant, "updatedApplicant");
    // }
    if (event.target.checked) {
      console.log(item, "item");
      if (!applicantFormik.values.applicant_checkedChecklist.includes(item)) {
        applicantFormik.setFieldValue("applicant_checkedChecklist", [
          ...applicantFormik.values.applicant_checkedChecklist,
          item,
        ]);
      }
      // console.log(applicantFormik.values, "ssssssssssss");
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

  // ----------------------------------------------Applicant Put----------------------------------------------------------------------------

  const [formData, setFormData] = useState({
    applicant_firstName: "",
    applicant_lastName: "",
    applicant_socialSecurityNumber: "",
    applicant_dob: "",
    applicant_country: "",
    applicant_adress: "",
    applicant_city: "",
    applicant_state: "",
    applicant_zipcode: "",
    applicant_email: "",
    applicant_cellPhone: "",
    applicant_homePhone: "",
    applicant_emergencyContact_firstName: "",
    applicant_emergencyContact_lasttName: "",
    applicant_emergencyContact_relationship: "",
    applicant_emergencyContact_email: "",
    applicant_emergencyContact_phone: "",
    rental_country: "",
    rental_adress: "",
    rental_city: "",
    rental_state: "",
    rental_zipcode: "",
    rental_data_from: "",
    rental_date_to: "",
    rental_monthlyRent: "",
    rental_resaonForLeaving: "",
    rental_landlord_firstName: "",
    rental_landlord_lasttName: "",
    rental_landlord_phoneNumber: "",
    rental_landlord_email: "",
    employment_name: "",
    employment_country: "",
    employment_adress: "",
    employment_city: "",
    employment_state: "",
    employment_zipcode: "",
    employment_phoneNumber: "",
    employment_email: "",
    employment_position: "",
    employment_date_from: "",
    employment_date_to: "",
    employment_monthlyGrossSalary: "",
    employment_supervisor_name: "",
    employment_supervisor_title: "",
  });

  const handleSubmit = async (e) => {
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
          applicant_country: applicantselectedCountry,
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

            rental_country: RentalselectedCountry,
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
          employment_country: EmploymentselectedCountry,
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

      if (response.status === 200) {
        // Check if the response status is 200
        swal("Success!", response.data.message, "success");
        navigate("/admin/Applicants/");
      } else {
        // If the status is not 200, handle the error
        swal("", response.data.message, "error");
      }
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/applicant/applicant_summary/${id}`
        );
        // const { applicant } = response.data.data;
        const { applicant, tenant_firstName } = response.data.data;
        console.log(tenant_firstName, "tenant_firstName");

        // Update the formValues state with the fetched data
        setFormData({
          //   applicant_firstName: applicant.applicant_firstName || '',
          //   applicant_lastName: applicant.applicant_lastName || '',
          //   applicant_socialSecurityNumber: String(applicant.applicant_socialSecurityNumber) || '',

          //   applicant_firstName: applicant.applicant_firstName || "",
          applicant_firstName:
            applicant.applicant_firstName || tenant_firstName || "",
          applicant_lastName: applicant.applicant_lastName || "",

          applicant_socialSecurityNumber:
            applicant.applicant_socialSecurityNumber || "",
          applicant_dob: applicant.applicant_dob || "",
          applicant_country: applicant.applicant_country || "",
          applicant_adress: applicant.applicant_adress || "",
          applicant_city: applicant.applicant_city || "",
          applicant_state: applicant.applicant_state || "",
          applicant_zipcode: applicant.applicant_zipcode || "",
          applicant_email: applicant.applicant_email || "",
          applicant_cellPhone: applicant.applicant_cellPhone || "",
          applicant_homePhone: applicant.applicant_homePhone || "",
          applicant_emergencyContact_firstName:
            applicant.applicant_emergencyContact_firstName || "",
          applicant_emergencyContact_lasttName:
            applicant.applicant_emergencyContact_lasttName || "",
          applicant_emergencyContact_relationship:
            applicant.applicant_emergencyContact_relationship || "",
          applicant_emergencyContact_email:
            applicant.applicant_emergencyContact_email || "",
          applicant_emergencyContact_phone:
            applicant.applicant_emergencyContact_phone || "",

          rental_country: applicant.rental_country || "",
          rental_adress: applicant.rental_adress || "",
          rental_city: applicant.rental_city || "",
          rental_state: applicant.rental_state || "",
          rental_zipcode: applicant.rental_zipcode || "",
          rental_data_from: applicant.rental_data_from || "",
          rental_date_to: applicant.rental_date_to || "",
          rental_monthlyRent: applicant.rental_monthlyRent || "",
          rental_resaonForLeaving: applicant.rental_resaonForLeaving || "",
          rental_landlord_firstName: applicant.rental_landlord_firstName || "",
          rental_landlord_lasttName: applicant.rental_landlord_lasttName || "",
          rental_landlord_phoneNumber:
            applicant.rental_landlord_phoneNumber || "",
          rental_landlord_email: applicant.rental_landlord_email || "",

          employment_name: applicant.employment_name || "",
          employment_country: applicant.employment_country || "",
          employment_adress: applicant.employment_adress || "",
          employment_city: applicant.employment_city || "",
          employment_state: applicant.employment_state || "",
          employment_zipcode: applicant.employment_zipcode || "",
          employment_phoneNumber: applicant.employment_phoneNumber || "",
          employment_email: applicant.employment_email || "",
          employment_position: applicant.employment_position || "",
          employment_date_from: applicant.employment_date_from || "",
          employment_date_to: applicant.employment_date_to || "",
          employment_monthlyGrossSalary:
            applicant.employment_monthlyGrossSalary || "",
          employment_supervisor_name:
            applicant.employment_supervisor_name || "",
          employment_supervisor_title:
            applicant.employment_supervisor_title || "",

          // Update other form fields accordingly
        });
      } catch (error) {
        console.error("Error fetching applicant data:", error);
      }
    };

    fetchData();
  }, [id]);

  //   const handleApplicantChange = (e) => {
  //     // Handle changes to form fields here
  //     setFormValues({
  //       ...formValues,
  //       [e.target.name]: e.target.value,
  //     });
  //   };

  return (
    <>
      <Header title="ApplicantSummary" />
      <Container className="mt-5" style={{ paddingLeft: 30, paddingRight: 30 }}>
        <Box>
          <section
            className=" justify-content-center align-items-center"
            style={{
              backgroundColor: "white",
              zIndex: 10000,
              borderRadius: 15,
            }}
          >
            <div
              className="row d-flex justify-content-center p-5"
              // style={{ backgroundColor: "red" }}
            >
              <form
                style={{ width: "100%" }}
                onSubmit={applicantFormik.handleSubmit}
              >
                <div>
                  {" "}
                  {/* Main Title */}
                  <h2>Applicant information</h2>
                  {/* 1 */}
                  <div className="form-row">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        name="applicant_firstName"
                        // value={formData.applicant_firstName}
                        value={formData.applicant_firstName}
                        onChange={handleApplicantChange}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Last name"
                        name="applicant_lastName"
                        value={formData.applicant_lastName}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  {/* 2 */}
                  <div className="form-row mt-4">
                    <div className="col">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Applicant social security number"
                        name="applicant_socialSecurityNumber"
                        value={formData.applicant_socialSecurityNumber}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  {/* Input 3 */}
                  <div className="form-row mt-4">
                    <div className="col">
                      <label htmlFor="applicantHomePhone">
                        Applicant birth date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="First name"
                        name="applicant_dob"
                        value={formData.applicant_dob}
                        onChange={handleApplicantChange}
                      />
                    </div>
                    <div className="col">
                      {/* Add another input or leave it empty */}
                    </div>
                  </div>
                  {/* 4 */}
                  {/* <div className="mt-4">
                    <Dropdown
                      isOpen={prodropdownOpen}
                      toggle={toggle1}
                      style={{ width: "100%" }}
                    >
                      <DropdownToggle
                        className="w-100 d-flex justify-content-between align-items-center border rounded"
                        style={{
                          borderColor: "#007BFF",
                          borderWidth: "20px",
                        }}
                      >
                        <span>{"Country"}</span>
                        <span className="caret-icon">&#9662;</span>
                      </DropdownToggle>
                      <DropdownMenu
                        style={{ overflowY: "auto", maxHeight: 200 }}
                      >
                        {countries.map((country) => (
                          <DropdownItem key={country.cca2} onClick={() => {}}>
                            {country.name.common}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div> */}
                  <div className="mt-4">
                    <Dropdown
                      isOpen={prodropdownOpen}
                      toggle={toggle1}
                      style={{ width: "100%" }}
                    >
                      <DropdownToggle
                        className="w-100 d-flex justify-content-between align-items-center border rounded"
                        style={{ borderColor: "#007BFF", borderWidth: "20px" }}
                      >
                        {applicantselectedCountry ? applicantselectedCountry : "Country"}
                        <span className="caret-icon">&#9662;</span>
                      </DropdownToggle>
                      <DropdownMenu
                        style={{ overflowY: "auto", maxHeight: 200 }}
                      >
                        {staticCountries.map((country) => (
                          <DropdownItem
                            key={country}
                            onClick={() => {
                              setApplicantSelectedCountry(country);
                            }}
                          >
                            {country}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  {/* 5 */}
                  <div className="form-row mt-4">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Street Adress"
                        name="applicant_adress"
                        value={formData.applicant_adress}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  {/* 6 */}
                  <div className="form-row mt-4">
                    <div className="col-7">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="City"
                        name="applicant_city"
                        value={formData.applicant_city}
                        onChange={handleApplicantChange}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="State"
                        name="applicant_state"
                        value={formData.applicant_state}
                        onChange={handleApplicantChange}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Zip"
                        name="applicant_zipcode"
                        value={formData.applicant_zipcode}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  {/*7 */}
                  <div className="form-row mt-4">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Applicant email"
                        name="applicant_email"
                        value={formData.applicant_email}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  {/* 8 */}
                  <div className="form-row mt-4">
                    <div className="col">
                      <input
                        type="Number"
                        className="form-control"
                        placeholder="Applicant cell phone"
                        name="applicant_cellPhone"
                        value={formData.applicant_cellPhone}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  {/* 9 */}
                  <div className="form-row mt-4 pl-4">
                    <div className="col-md-12">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="defaultCheck1"
                      />
                      <label className="form-check-label" for="defaultCheck1">
                        Opt-in to receive text messages from
                        gecbhavnagar.managebuilding.com.{" "}
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          Terms and conditions apply.
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    {/* Input 10 */}
                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="applicantHomePhone">
                          Applicant home phone
                        </label>
                        <input
                          type="Number"
                          className="form-control"
                          placeholder="Enter home phone"
                          name="applicant_homePhone"
                          value={formData.applicant_homePhone}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    {/* Input 11 */}
                    <div className="form-row mt-4">
                      <div className="col-md-6 form-group">
                        <label htmlFor="firstName">
                          Emergency contact name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter first name"
                          name="applicant_emergencyContact_firstName"
                          value={formData.applicant_emergencyContact_firstName}
                          onChange={handleApplicantChange}
                        />
                      </div>

                      <div className="col-md-6 form-group">
                        <label htmlFor="lastName">Last name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter last name"
                          name="applicant_emergencyContact_lasttName"
                          value={formData.applicant_emergencyContact_lasttName}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    {/* Input 12 */}
                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Emergency contact relationship
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter relationship"
                            name="applicant_emergencyContact_relationship"
                            value={
                              formData.applicant_emergencyContact_relationship
                            }
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Input 13 */}
                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Emergency contact email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Emergency contact email"
                            name="applicant_emergencyContact_email"
                            value={formData.applicant_emergencyContact_email}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Input 14 */}
                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="applicantHomePhone">
                          Emergency contact phone
                        </label>
                        <input
                          type="Number"
                          className="form-control"
                          placeholder="Emergency contact phone"
                          name="applicant_emergencyContact_phone"
                          value={formData.applicant_emergencyContact_phone}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>
                    <hr />
                  </div>
                  {/* -------------------------------------------------------------- */}
                  <div>
                    {/* Main Title */}
                    <h2>Rental history</h2>

  <div className="mt-4">
                    <Dropdown
                      isOpen={prodropdownOpen2}
                      toggle={toggle2}
                      style={{ width: "100%" }}
                    >
                      <DropdownToggle
                        className="w-100 d-flex justify-content-between align-items-center border rounded"
                        style={{ borderColor: "#007BFF", borderWidth: "20px" }}
                      >
                        {RentalselectedCountry ? RentalselectedCountry : "Country"}
                        <span className="caret-icon">&#9662;</span>
                      </DropdownToggle>
                      <DropdownMenu
                        style={{ overflowY: "auto", maxHeight: 200 }}
                      >
                        {staticCountries.map((country) => (
                          <DropdownItem
                            key={country}
                            onClick={() => {
                              setRentalSelectedCountry(country);
                            }}
                          >
                            {country}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                    {/* Input 15 */}
                    {/* <div>
                                          <div className="form-row mt-4">
                                            <div className="col">
                                              <label htmlFor="emergencyContactRelationship">
                                                Rental address
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Rental Country"
                                                name="rental_country"
                                                value={formData.rental_country}
                                                onChange={handleApplicantChange}
                                              />
                                            </div>
                                          </div>
                                        </div> */}

                    {/* 16 */}
                    <div className="form-row mt-4">
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Street Adress"
                          name="rental_adress"
                          value={formData.rental_adress}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    {/* 17 */}
                    <div className="form-row mt-4">
                      <div className="col-7">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="City"
                          name="rental_city"
                          value={formData.rental_city}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="State"
                          name="rental_state"
                          value={formData.rental_state}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Zip"
                          name="rental_zipcode"
                          value={formData.rental_zipcode}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    {/* Input 18 */}
                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="firstName">Rental dates</label>
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Enter first name"
                          id="firstName"
                          name="rental_data_from"
                          value={formData.rental_data_from}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="lastName">Last name</label>
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Enter last name"
                          id="lastName"
                          name="rental_date_to"
                          value={formData.rental_date_to}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    {/* Input 19 */}
                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Monthly rent
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=" Monthly rent"
                            name="rental_monthlyRent"
                            value={formData.rental_monthlyRent}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Input 20 */}
                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Reason for leaving
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Reason for leaving"
                            name="rental_resaonForLeaving"
                            value={formData.rental_resaonForLeaving}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Input 21 */}
                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="firstName">Landlord name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter first name"
                          name="rental_landlord_firstName"
                          value={formData.rental_landlord_firstName}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="lastName">Last name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter last name"
                          name="rental_landlord_lasttName"
                          value={formData.rental_landlord_lasttName}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    {/* Input 22 */}
                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="firstName">Landlord phone number</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Landlord phone number"
                          name="rental_landlord_phoneNumber"
                          value={formData.rental_landlord_phoneNumber}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        {/* <label htmlFor="lastName">
                                          Last name
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Enter last name"
                                          id="lastName"
                                        /> */}
                      </div>
                    </div>

                    {/* Input 23 */}
                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Landlord email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Landlord email"
                            name="rental_landlord_email"
                            value={formData.rental_landlord_email}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ------------------------------------------------------------------------------------------------------------ */}
                  <hr />
                  <div>
                    {/* Main Title */}
                    <h2>Employment</h2>

                    {/* Input 15 */}
                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Employer name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Employer name"
                            name="employment_name"
                            value={formData.employment_name}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                    <Dropdown
                      isOpen={prodropdownOpen3}
                      toggle={toggle3}
                      style={{ width: "100%" }}
                    >
                      <DropdownToggle
                        className="w-100 d-flex justify-content-between align-items-center border rounded"
                        style={{ borderColor: "#007BFF", borderWidth: "20px" }}
                      >
                        {EmploymentselectedCountry ? EmploymentselectedCountry : "Country"}
                        <span className="caret-icon">&#9662;</span>
                      </DropdownToggle>
                      <DropdownMenu
                        style={{ overflowY: "auto", maxHeight: 200 }}
                      >
                        {staticCountries.map((country) => (
                          <DropdownItem
                            key={country}
                            onClick={() => {
                              setEmploymentSelectedCountry(country);
                            }}
                          >
                            {country}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>



                    {/* 16 */}
                    <div className="form-row mt-4">
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Street Adress"
                          name="employment_adress"
                          value={formData.employment_adress}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    {/* 17 */}
                    <div className="form-row mt-4">
                      <div className="col-7">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="City"
                          name="employment_city"
                          value={formData.employment_city}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="State"
                          name="employment_state"
                          value={formData.employment_state}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Zip"
                          name="employment_zipcode"
                          value={formData.employment_zipcode}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    {/* Input 22 */}
                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="firstName">Employer phone number</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Employer phone number"
                          name="employment_phoneNumber"
                          value={formData.employment_phoneNumber}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col"></div>
                    </div>

                    {/* Input 19 */}
                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Employer email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="
                                              Employer email"
                            name="employment_email"
                            value={formData.employment_email}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Input 19 */}
                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Position held
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="
                                              Position held"
                            name="employment_position"
                            value={formData.employment_position}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Input 18 */}
                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="firstName">Rental dates (From)</label>
                        <input
                          type="date"
                          className="form-control"
                          // placeholder="Enter first name"
                          name="employment_date_from"
                          value={formData.employment_date_from}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="lastName">Rental dates (To)</label>
                        <input
                          type="date"
                          className="form-control"
                          // placeholder="Enter last name"
                          name="employment_date_to"
                          value={formData.employment_date_to}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    {/* Input 19 */}
                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Monthly gross salary
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=" Monthly gross salary"
                            name="employment_monthlyGrossSalary"
                            value={formData.employment_monthlyGrossSalary}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Input 21 */}
                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="firstName">Supervisor name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter first name"
                          name="employment_supervisor_first"
                          value={formData.employment_supervisor_first}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="lastName">Last name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter last name"
                          name="employment_supervisor_last"
                          value={formData.employment_supervisor_last}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    {/* Input 23 */}
                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Supervisor title
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Supervisor title"
                            name="employment_supervisor_title"
                            value={formData.employment_supervisor_title}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* ======================================================================================= */}
                  <div>
                    {/* Main Title */}
                    <h2>Terms and conditions</h2>

                    {/* Input 23 */}
                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row mt-4 pl-2">
                        <p>
                          I understand that this is a routine application to
                          establish credit, character, employment, and rental
                          history. I also understand that this is NOT an
                          agreement to rent and that all applications must be
                          approved. I authorize verification of references
                          given. I declare that the statements above are true
                          and correct, and I agree that the landlord may
                          terminate my agreement entered into in reliance on any
                          misstatement made above.
                        </p>
                      </div>

                      <div className="form-row mt-4 pl-4">
                        <div className="col-md-12">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="defaultCheck1"
                          />
                          <label className="form-check-label" for="defaultCheck1">
                            Agreed to*
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Agreed by
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Agreed by"
                            id="emergencyContactRelationship"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* Emergency Contact Relationship */}
                      <div className="form-row mt-4 pl-2">
                        <p>
                          By submitting this application, I am: (1) giving
                          gecbhavnagar.managebuilding.com permission to run a
                          background check on me, which may include obtaining my
                          credit report from a consumer reporting agency; and
                          (2) agreeing to the{" "}
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            {" "}
                            Privacy Policy{" "}
                          </span>{" "}
                          and{" "}
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            {" "}
                            Terms of Service.{" "}
                          </span>
                        </p>
                        {/* <div className="col">
                                            <label htmlFor="emergencyContactRelationship">
                                              Supervisor title
                                            </label>
                                            <input
                                              type="email"
                                              className="form-control"
                                              placeholder="Supervisor title"
                                              id="emergencyContactRelationship"
                                            />
                                          </div> */}
                      </div>
                    </div>
                  </div>
                  {/* ------------------------------------------------------------------------------------------------------------- */}
                </div>
                <div className="mt-4 d-flex flex-column flex-sm-row">
                  <button
                    type="button"
                    className="btn btn-primary mb-3 mb-sm-0 mr-sm-3"
                    style={{ borderRadius: "10px" }}
                    onClick={handleSubmit}
                  >
                    Save Application
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ borderRadius: "10px" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>
        </Box>
      </Container>
    </>
  );
};

export default ApplicantForm;
