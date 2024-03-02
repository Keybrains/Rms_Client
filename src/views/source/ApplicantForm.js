import Header from "components/Headers/Header";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useFormik } from "formik";

const ApplicantForm = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const sidenavMain = document.getElementById("sidenav-main");
    const headerElement = document.querySelector(".header");

    if (sidenavMain) {
      sidenavMain.style.display = "none";
    }

    if (headerElement) {
      headerElement.style.display = "none";
    }

    return () => {
      if (sidenavMain) {
        sidenavMain.style.display = "block";
      }

      if (headerElement) {
        headerElement.style.display = "block";
      }
    };
  }, []);

  const [selectedDropdownItem, setselectedDropdownItem] = useState("");
  const [applicantData, setApplicantData] = useState();
  const [propertyData, setPropertyData] = useState();
  const [isEdit, setIsEdit] = useState(false);

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
    },
  });

  useEffect(() => {
    axios
      .get(`${baseUrl}/applicant/applicant_summary/${id}`)
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
          })
          .catch((error) => {
            console.error("Error fetching rental properties:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching applicants:", error);
      });
  }, [id]);

  const [matchedApplicant, setMatchedApplicant] = useState([]);
  const getApplicantData = async () => {
    await axios
      .get(`${baseUrl}/applicant/applicant`)
      .then((response) => {
        if (response.data.data) {
          const applicantData = response.data.data;
          const matchedApplicant = applicantData.find((applicant) => {
            return applicant._id === id;
          });
          setMatchedApplicant(matchedApplicant);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleEdit = (values) => {
    setIsEdit(false);
    const updatedApplicant = {
      ...matchedApplicant,
      tenant_firstName: values.tenant_firstName,
      tenant_lastName: values.tenant_lastName,
      tenant_unitNumber: values.tenant_unitNumber,
      tenant_mobileNumber: values.tenant_mobileNumber,
      tenant_homeNumber: values.tenant_homeNumber,
      tenant_faxPhoneNumber: values.tenant_faxPhoneNumber,
      tenant_email: values.tenant_email,
      tenant_workNumber: values.tenant_workNumber,
      status: selectedDropdownItem,
    };

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
    applicant_phoneNumber: "",
    applicant_homeNumber: "",
    emergency_contact: {
      first_name: "",
      last_name: "",
      relationship: "",
      email: "",
      phone_number: "",
    },
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
          applicant_phoneNumber: formData.applicant_phoneNumber,
          applicant_homeNumber: formData.applicant_homeNumber,
          emergency_contactfirst_name:
            formData.emergency_contact.first_name,
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
        toast.success(response.data.message, {
          position: "top-center",
        });
        navigate("/admin/Applicants/");
      } else {
        // If the status is not 200, handle the error
        toast.error(response.data.message, {
          position: "top-center",
        });
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

        const { applicant, tenant_firstName } = response.data.data;

        setFormData({
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
          applicant_phoneNumber: applicant.applicant_phoneNumber || "",
          applicant_homeNumber: applicant.applicant_homeNumber || "",
          emergency_contactfirst_name:
            applicant.emergency_contact.first_name || "",
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
        });
      } catch (error) {
        console.error("Error fetching applicant data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
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
            <div className="row d-flex justify-content-center p-5">
              <form
                style={{ width: "100%" }}
                onSubmit={applicantFormik.handleSubmit}
              >
                <div>
                  <h2>Applicant information</h2>
                  <div className="form-row">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        name="applicant_firstName"
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
                  </div>
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
                        {applicantselectedCountry
                          ? applicantselectedCountry
                          : "Country"}
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
                  <div className="form-row mt-4">
                    <div className="col">
                      <input
                        type="Number"
                        className="form-control"
                        placeholder="Applicant cell phone"
                        name="applicant_phoneNumber"
                        value={formData.applicant_phoneNumber}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="applicantHomePhone">
                          Applicant home phone
                        </label>
                        <input
                          type="Number"
                          className="form-control"
                          placeholder="Enter home phone"
                          name="applicant_homeNumber"
                          value={formData.applicant_homeNumber}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    <idv className="form-row mt-4">
                      <label htmlFor="firstName">Emergency contact</label>
                    </idv>
                    <div className="form-row">
                      <div className="col-md-6 form-group">
                        <label htmlFor="firstName">First name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter first name"
                          name="emergency_contact.first_name"
                          value={formData.emergency_contact.first_name}
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

                    <div>
                      <div className="form-row">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Relationship
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

                    <div>
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Email
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

                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="applicantHomePhone">
                          Phone number
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
                  <div>
                    <h2>Rental history</h2>

                    <div className="mt-4">
                      <Dropdown
                        isOpen={prodropdownOpen2}
                        toggle={toggle2}
                        style={{ width: "100%" }}
                      >
                        <DropdownToggle
                          className="w-100 d-flex justify-content-between align-items-center border rounded"
                          style={{
                            borderColor: "#007BFF",
                            borderWidth: "20px",
                          }}
                        >
                          {RentalselectedCountry
                            ? RentalselectedCountry
                            : "Country"}
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

                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="firstName">Start date</label>
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
                        <label htmlFor="lastName">End date</label>
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

                    <div>
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

                    <div>
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
                      <div className="col"></div>
                    </div>

                    <div>
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
                  <hr />
                  <div>
                    <h2>Employment</h2>
                    <div>
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
                          style={{
                            borderColor: "#007BFF",
                            borderWidth: "20px",
                          }}
                        >
                          {EmploymentselectedCountry
                            ? EmploymentselectedCountry
                            : "Country"}
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

                    <div>
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

                    <div>
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Position held
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Position held"
                            name="employment_position"
                            value={formData.employment_position}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="firstName">Rental dates (From)</label>
                        <input
                          type="date"
                          className="form-control"
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
                          name="employment_date_to"
                          value={formData.employment_date_to}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    <div>
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

                    <div>
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
                  <div>
                    <h2>Terms and conditions</h2>

                    <div>
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
                          <label
                            className="form-check-label"
                            for="defaultCheck1"
                          >
                            Agreed to*
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
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
                      </div>
                    </div>
                  </div>
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
        <ToastContainer />
      </Container>
    </>
  );
};

export default ApplicantForm;
