import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
} from "reactstrap";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import RentalHeader from "components/Headers/RentalHeader.js";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import { useMediaQuery } from "@material-ui/core";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "universal-cookie";
import { OpenImageDialog } from "components/OpenImageDialog";
import { Autocomplete } from "@mui/material";
import moment from "moment/moment";
import CircularProgress from "@mui/material/CircularProgress";

const Rentals = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [prodropdownOpen, setproDropdownOpen] = React.useState(null);
  const [bankdropdownOpen, setbankDropdownOpen] = React.useState(false);
  const [userdropdownOpen, setuserDropdownOpen] = React.useState(false);
  const [baddropdownOpen, setbadDropdownOpen] = React.useState(null);
  const [bathdropdownOpen, setBathDropdownOpen] = React.useState(null);

  const [isAddBankDialogOpen, setAddBankDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [isRentalDialogOpen, setRentalDialogOpen] = useState(false);
  const [isPhotoresDialogOpen, setPhotoresDialogOpen] = useState(false);

  const [propertyData, setPropertyData] = useState([]);
  const [rentalownerData, setRentalownerData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [StaffMemberData, setStaffMemberData] = useState([]);
  const [selectedProp, setSelectedProp] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBad, setSelectedBad] = useState("");
  const [open, setOpen] = React.useState(false);
  // const [open, setOpen] = useState(false);
  // const [uploadedImage, setUploadedImage] = useState(null);
  // const [selectedPhoto, setSelectedPhoto] = useState(null);

  // const [selectedCategory, setSelectedCategory] = useState("");
  // const [selectedSubtype, setSelectedSubtype] = useState("");

  const toggle1 = () => setproDropdownOpen((prevState) => !prevState);
  const toggle2 = () => setbankDropdownOpen((prevState) => !prevState);
  const toggle3 = () => setuserDropdownOpen((prevState) => !prevState);
  const toggle4 = (index) =>
    setbadDropdownOpen((prevIndex) => (prevIndex === index ? null : index));
  const toggle5 = (index) =>
    setBathDropdownOpen((prevState) => (prevState === index ? null : index));

  const [openImage, setOpenImage] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [rentalsData, setRentalsData] = useState(null);
  const [selectedRentalOwnerData, setSelectedRentalOwnerData] = useState([]);
  // console.log(selectedRentalOwnerData, "selectedRentalOwnerData");
  const [selectedrentalOwners, setSelectedrentalOwners] = useState([]);
  const [showRentalOwnerTable, setshowRentalOwnerTable] = useState(false);
  const [checkedCheckbox, setCheckedCheckbox] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const bathArray = [
    "1 Bath",
    "1.5 Bath",
    "2 Bath",
    "2.5 Bath",
    "3 Bath",
    "3.5 Bath",
    "4 Bath",
    "4.5 Bath",
    "5 Bath",
    "5+ Bath",
  ];

  const roomsArray = [
    "1 Bed",
    "2 Bed",
    "3 Bed",
    "4 Bed",
    "5 Bed",
    "6 Bed",
    "7 Bed",
    "8 Bed",
    "9 Bed",
    "9+ Bed",
  ];

  const handleChange = () => {
    setshowRentalOwnerTable(!showRentalOwnerTable);
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const [file, setFile] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/rentals/existing/rentals`);
        const data = await response.json();

        if (response.ok) {
          setRentalownerData(data.data || []); // Ensure data is an array or handle empty data
          console.log("Here is the fetched data:", data.data);
        } else {
          console.error("Error:", data.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchData();
  }, [baseUrl, setRentalownerData]); // Add dependencies that trigger a refetch if changed

  const handleCheckboxChange = (event, rentalOwnerInfo, phoneNumber) => {
    if (checkedCheckbox === phoneNumber) {
      // If the checkbox is already checked, uncheck it
      setCheckedCheckbox(null);
      rentalOwnerFormik.setValues({
        rentalOwner_firstName: "",
        rentalOwner_lastName: "",
        rentalOwner_phoneNumber: "",
        rentalOwner_businessNumber: "",
        rentalOwner_homeNumber: "",
        rentalOwner_primaryEmail: "",
        rentalOwner_companyName: "",
      });
    } else {
      // Otherwise, check the checkbox
      setCheckedCheckbox(phoneNumber);
    }

    // Toggle the selected rentalOwners in the state when their checkboxes are clicked
    if (event.target.checked) {
      console.log(
        [rentalOwnerInfo, ...selectedrentalOwners],
        "[rentalOwnerInfo, ...selectedrentalOwners]"
      );
      setSelectedrentalOwners([rentalOwnerInfo, ...selectedrentalOwners]);
    } else {
      setSelectedrentalOwners(
        selectedrentalOwners.filter(
          (rentalOwner) => rentalOwner !== rentalOwnerInfo
        )
      );
    }
  };

  const handleAddrentalOwner = () => {
    if (selectedrentalOwners.length === 0) {
      const newrentalOwnerDetails = {
        firstName: rentalOwnerFormik.values.rentalOwner_firstName,
        lastName: rentalOwnerFormik.values.rentalOwner_lastName,
        phoneNumber: rentalOwnerFormik.values.rentalOwner_phoneNumber,
      };
      setSelectedRentalOwnerData(newrentalOwnerDetails);
      if (!id) {
        swal("Success!", "New rentalOwner added successfully", "success");
      }
    } else {
      console.log(selectedrentalOwner, "selectedrentalOwner");
      setSelectedrentalOwners([]);
      const selectedrentalOwner = selectedrentalOwners[0];
      console.log(selectedrentalOwners, "selectedrentalOwners");
      const rentalOwnerParts = selectedrentalOwner
        .split("-")
        .map((part) => part.trim());
      rentalsFormik.setFieldValue(
        "rentalOwner_firstName",
        rentalOwnerParts[0] || ""
      );
      rentalsFormik.setFieldValue(
        "rentalOwner_lastName",
        rentalOwnerParts[1] || ""
      );
      rentalsFormik.setFieldValue(
        "rentalOwner_phoneNumber",
        rentalOwnerParts[2] || ""
      );
      rentalsFormik.setFieldValue(
        "rentalOwner_companyName",
        rentalOwnerParts[3] || ""
      );
      rentalsFormik.setFieldValue(
        "rentalOwner_primaryEmail",
        rentalOwnerParts[4] || ""
      );

      rentalsFormik.setFieldValue(
        "rentalOwner_homeNumber",
        rentalOwnerParts[5] || ""
      );
      rentalsFormik.setFieldValue(
        "rentalOwner_businessNumber",
        rentalOwnerParts[6] || ""
      );
      const rentalOwnerDetails = {
        firstName: rentalOwnerParts[0],
        lastName: rentalOwnerParts[1],
        phoneNumber: rentalOwnerParts[2],
        companyName: rentalOwnerParts[3],
        primaryEmail: rentalOwnerParts[4],
        homeNumber: rentalOwnerParts[5],
        businessNumber: rentalOwnerParts[6],
      };
      setSelectedRentalOwnerData(rentalOwnerDetails);
      // console.log(rentalOwnerParts);
      if (!id) {
        swal("Success!", "rentalOwner details Added", "success");
      }
    }
  };

  const dialogPaperStyles = {
    maxWidth: "lg",
    width: "100%",
    verflowY: "auto",
  };
  const [propType, setPropType] = useState("");

  const handlePropSelection = (propertyType) => {
    rentalsFormik.setFieldValue("property_type", propertyType);
    const propTypes = [];
    console.log(propertyType, "first");
    axios
      .get(`${baseUrl}/newproparty/propropartytype`)
      .then((data) => {
        // console.log(data.data, "Data from adding the account");
        // setPropertyData(data.data.data);
        setSelectedProp(propertyType);
        console.log(propertyType, "second");
        const selectedType = Object.keys(data.data.data).find((item) => {
          return data.data.data[item].some(
            (data) => data.propertysub_type === propertyType.propertysub_type
          );
        });
        setPropType(selectedType);
        console.log(selectedType, "third");
        rentalsFormik.setFieldValue("propType", selectedType);
        // console.error("Error:", data.message);
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  };

  const handleBankSelection = (value) => {
    setSelectedBank(value);
    setbankDropdownOpen(true);
  };

  // const toggleRentalDialog = () => {
  //   setRentalDialogOpen((prevState) => !prevState);
  // };

  const toggleAddBankDialog = () => {
    setAddBankDialogOpen((prevState) => !prevState);
  };

  const togglePhotoDialog = () => {
    setPhotoDialogOpen((prevState) => !prevState);
  };

  const togglePhotoresDialog = () => {
    setPhotoresDialogOpen((prevState) => !prevState);
  };

  const handleCloseDialog = () => {
    setAddBankDialogOpen(false);
  };

  const handlePhotoCloseDialog = () => {
    setPhotoDialogOpen(false);
    setPhotoresDialogOpen(false);
  };

  const handleUserSelection = (value) => {
    setSelectedUser(value);
    setuserDropdownOpen(true);
  };

  const handleBadSelection = (value, index) => {
    rentalsFormik.setFieldValue(
      `entries[0].residential[${index}].rental_bed`,
      value
    );
    setSelectedBad(value);
    // setbadDropdownOpen(true);
    // console.log(rentalsFormik.values, "valuessssswwws");
  };

  // const handleBathSelection = (value) => {
  //   setSelectedBath(value);
  //   setBathDropdownOpen(true);
  // };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRentalDialogOpen(false);
  };
  let rentalOwnerFormik = useFormik({
    initialValues: {
      rentalOwner_firstName: "",
      rentalOwner_lastName: "",
      rentalOwner_companyName: "",
      rentalOwner_primaryEmail: "",
      rentalOwner_phoneNumber: "",
      rentalOwner_homeNumber: "",
      rentalOwner_businessNumber: "",
      chooseExistingOwner: false,
    },
    validationSchema: yup.object({
      // rentalOwner_firstName: yup.string().required("First Name is required"),
      // rentalOwner_lastName: yup.string().required("Last Name is required"),
      // rentalOwner_primaryEmail: yup
      //   .string()
      //   .email("Invalid email address")
      //   .required("Email is required"),
      // rentalOwner_phoneNumber: yup
      //   .string()
      //   .required("Phone Number is required"),
    }),
    onSubmit: (values) => {
      // console.log(values, "values");
      setshowRentalOwnerTable(false);
      handleAddrentalOwner();
      handleClose();
    },
  });
  let rentalsFormik = useFormik({
    initialValues: {
      //   Add Rental owner
      rentalOwner_firstName: "",
      rentalOwner_lastName: "",
      rentalOwner_companyName: "",
      rentalOwner_primaryEmail: "",
      rentalOwner_phoneNumber: "",
      rentalOwner_homeNumber: "",
      rentalOwner_businessNumber: "",

      entries: [
        {
          rental_id: "",
          property_type: "",
          // propertysub_type: "",
          rental_adress: "",
          rental_city: "",
          rental_country: "",
          rental_state: "",
          rental_postcode: "",
          rentalOwner_operatingAccount: "",
          rentalOwner_propertyReserve: "",
          staffMember: "",
          //rooms
          //RESIDENTIAL
          residential: [
            {
              rental_bed: "",
              rental_bath: "",
              propertyres_image: [],
              rental_sqft: "",
              rental_units: "",
              rental_unitsAdress: "",
            },
          ],

          //COMMERCIAL
          commercial: [
            {
              rentalcom_sqft: "",
              rentalcom_units: "",
              rentalcom_unitsAdress: "",
              property_image: [],
            },
          ],
        },
      ],
    },
    validationSchema: yup.object({
      // rentalOwner_propertyReserve: yup.string().required("Required"),
      rentalOwner_primaryEmail: yup
        .string()
        .email("Invalid email address")
        .required("Required"),
      rentalOwner_firstName: yup.string().required("Required"),
      rentalOwner_lastName: yup.string().required("Required"),
      rentalOwner_phoneNumber: yup.string().required("Required"),
      entries: yup.array().of(
        yup.object({
          // property_type: yup.string().notOneOf([''], "Please select a property type").required("Required"),
          rental_postcode: yup.string().required("Required"),
          rental_adress: yup.string().required("Required"),
          rental_city: yup.string().required("Required"),
          rental_country: yup.string().required("Required"),
          rental_state: yup.string().required("Required"),
        })
      ),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      // console.log(values, "rentals formik finmmal values");
    },
  });

  const handleRentalownerDelete = () => {
    setSelectedRentalOwnerData([]);
    rentalOwnerFormik.setValues({
      rentalOwner_firstName: "",
      rentalOwner_lastName: "",
      rentalOwner_primaryEmail: "",
      rentalOwner_phoneNumber: "",
      rentalOwner_companyName: "",
      rentalOwner_homeNumber: "",
      rentalOwner_businessNumber: "",
    });

    // console.log("first");
  };

  const [selectedbath, setSelectedbath] = useState("");
  const handleBathSelect = (bath, index) => {
    rentalsFormik.setFieldValue(
      `entries[0].residential[${index}].rental_bath`,
      bath
    );
    // setSelectedbath(bath);
    // setSelectedbath(bath);
  };

  const [selectedOperatingAccount, setSelectedOperatingAccount] = useState("");
  const handleOperatingAccount = (operatingAccount) => {
    setSelectedOperatingAccount(operatingAccount);
    localStorage.setItem("operatingAccount", operatingAccount);
  };
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

  // ==================================================================

  // navigate(`/admin/rentals/rental/${id}/entry/${propertyIndex}`);
  const { id, entryIndex } = useParams();
  // console.log(entryIndex, "entryIndex");
  const [residentialImage, setResidentialImage] = useState([[]]);
  const [commercialImage, setCommercialImage] = useState([[]]);
  const [imgLoader, setImgLoader] = useState(false); // Use camelCase for variable names
  const [loadingImages, setLoadingImages] = useState([]);
  const fileData = async (file, name, index) => {
    //setImgLoader(true);
    const allData = [];
    const axiosRequests = [];

    for (let i = 0; i < file.length; i++) {
      setImgLoader(true);
      const dataArray = new FormData();
      dataArray.append("b_video", file[i]);
      let url = "https://www.sparrowgroups.com/CDN/image_upload.php";

      // Push the Axios request promises into an array
      axiosRequests.push(
        axios
          .post(url, dataArray, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setImgLoader(false);
            const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
            console.log(imagePath, "imagePath");
            allData.push(imagePath);
          })
          .catch((err) => {
            setImgLoader(false);
            // console.log("Error uploading image:", err);
          })
      );
    }

    // Wait for all Axios requests to complete before logging the data
    await Promise.all(axiosRequests);
    if (name === "propertyres_image") {
      rentalsFormik.setFieldValue(
        `entries[0].residential[${index}].propertyres_image`,
        ...rentalsFormik.values.entries[0].residential[index].propertyres_image,
        allData
      );
      if (residentialImage[index]) {
        setResidentialImage([
          ...residentialImage.slice(0, index),
          [...residentialImage[index], ...allData],
          ...residentialImage.slice(index + 1),
        ]);
      } else {
        setResidentialImage([...allData]);
      }
    } else {
      rentalsFormik.setFieldValue(
        `entries[0].commercial[${index}].property_image`,
        ...rentalsFormik.values.entries[0].commercial[index].property_image,
        allData
      );
      if (commercialImage[index]) {
        setCommercialImage([
          ...commercialImage.slice(0, index),
          [...commercialImage[index], ...allData],
          ...commercialImage.slice(index + 1),
        ]);
      } else {
        setCommercialImage([...allData]);
      }
    }
    // console.log(allData, "allData");
    // console.log(residentialImage, "residentialImage");
    // console.log(commercialImage, "commercialImage");
  };

  // console.log(commercialImage, "commercialImage");

  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    // Use history.push to navigate to the PropertiesTable page
    navigate("../propertiesTable");
  };

  const clearSelectedPhoto = (index, image, name) => {
    if (name === "propertyres_image") {
      const filteredImage = residentialImage[index].filter((item) => {
        return item !== image;
      });
      // console.log(filteredImage, "filteredImage");
      // setResidentialImage(filteredImage);
      setResidentialImage([
        ...residentialImage.slice(0, index),
        [...filteredImage],
        ...residentialImage.slice(index + 1),
      ]);
    } else {
      const filteredImage = commercialImage[index].filter((item) => {
        return item !== image;
      });
      // console.log(filteredImage, "filteredImage");
      // setCommercialImage(filteredImage);
      setCommercialImage([
        ...commercialImage.slice(0, index),
        [...filteredImage],
        ...commercialImage.slice(index + 1),
      ]);
    }
  };

  useEffect(() => {
    const selectedPhotoresPreview = document.getElementById(
      "selectedPhotoresPreview"
    );
    // Make an HTTP GET request to your Express API endpoint
    fetch(`${baseUrl}/newproparty/propropartytype`)
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

  useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch(`${baseUrl}/addstaffmember/find_staffmember`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setStaffMemberData(data.data);
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
  // navigate(`/admin/rentals/rental/${id}/entry/${propertyIndex}`);
  // const {id,entryId} = useParams();
  const [unitData, setUnitData] = useState([]);
  const [rentalOwnerData, setRentalOwnerData] = useState([]);
  useEffect(() => {
    // console.log(id, entryIndex, "id && entry Id");
    if (id && entryIndex) {
      axios
        .get(`${baseUrl}/rentals/rentals_summary/${id}`)
        .then((response) => {
          const propertysData = response.data.data;
          // setRentalsData(rentalsData); // Update state with the fetched data
          // console.log(propertysData, "properety data");
          setRentalOwnerData(propertysData);
          // setRentalownerData(propertysData);
          rentalOwnerFormik.setValues({
            rentalOwner_firstName: propertysData.rentalOwner_firstName || "",
            rentalOwner_lastName: propertysData.rentalOwner_lastName || "",
            rentalOwner_primaryEmail:
              propertysData.rentalOwner_primaryEmail || "",
            rentalOwner_phoneNumber:
              propertysData.rentalOwner_phoneNumber || "",
            rentalOwner_companyName:
              propertysData.rentalOwner_companyName || "",
            rentalOwner_homeNumber: propertysData.rentalOwner_homeNumber || "",
            rentalOwner_businessNumber:
              propertysData.rentalOwner_businessNumber || "",
          });
          setSelectedRentalOwnerData({
            firstName: propertysData.rentalOwner_firstName || "",
            lastName: propertysData.rentalOwner_lastName || "",
            phoneNumber: propertysData.rentalOwner_phoneNumber || "",
            // Add other fields you want to display in the table
          });

          const matchedProperty = propertysData.entries.find((entry) => {
            return entry.entryIndex === entryIndex;
          });
          // console.log(matchedProperty, "matchedPropeort");
          // setshowRentalOwnerTable(true);
          // setRentalownerData(propertysData);

          setSelectedProp(propertysData.property_type || "Select");
          setCommercialImage(propertysData.property_image || "");
          setSelectedProp(matchedProperty.property_type || "Select");
          setSelectedbath(matchedProperty.rental_bath || "Select");
          setSelectedBad(matchedProperty.rental_bed || "Select");
          setSelectedBank(
            matchedProperty.rentalOwner_operatingAccount || "Select"
          );
          setCommercialImage(matchedProperty.property_image || "");

          setResidentialImage(matchedProperty.propertyres_image || "");
          setSelectedUser(matchedProperty.staffMember || "Select");
          // rentalsFormik.setValues({
          //   rental_adress: matchedProperty.rental_adress || "",
          //   rental_city: matchedProperty.rental_city || "",
          //   rental_country: matchedProperty.rental_country || "",
          //   rental_state: matchedProperty.rental_state || "",
          //   rental_postcode: matchedProperty.rental_postcode || "",
          //   rentalOwner_firstName: propertysData.rentalOwner_firstName || "",
          //   rentalOwner_lastName: propertysData.rentalOwner_lastName || "",
          //   rentalOwner_companyName:
          //     propertysData.rentalOwner_companyName || "",
          //   rentalOwner_primaryEmail:
          //     propertysData.rentalOwner_primaryEmail || "",
          //   rentalOwner_phoneNumber:
          //     propertysData.rentalOwner_phoneNumber || "",
          //   rentalOwner_homeNumber: propertysData.rentalOwner_homeNumber || "",
          //   rentalOwner_businessNumber:
          //     propertysData.rentalOwner_businessNumber || "",
          //   rentalOwner_propertyReserve:
          //     propertysData.rentalOwner_propertyReserve || "",
          //   rental_sqft: "" || "",
          //   rental_units: matchedProperty.rental_units || "",
          //   rental_unitsAdress: matchedProperty.rental_unitsAdress || "",
          //   rentalcom_soft: matchedProperty.rentalcom_soft || "",
          //   rentalcom_units: matchedProperty.rentalcom_units || "",
          //   rentalcom_unitsAdress: matchedProperty.rentalcom_unitsAdress || "",
          //   property_image: matchedProperty.property_image || "",
          //   propertyres_image: matchedProperty.propertyres_image || "",
          // });
          rentalsFormik.setFieldValue(
            "entries[0].rental_adress",
            matchedProperty.rental_adress || ""
          );
          rentalsFormik.setFieldValue(
            "entries[0].rental_city",
            matchedProperty.rental_city || ""
          );
          rentalsFormik.setFieldValue(
            "entries[0].rental_country",
            matchedProperty.rental_country || ""
          );
          rentalsFormik.setFieldValue(
            "entries[0].rental_state",
            matchedProperty.rental_state || ""
          );
          rentalsFormik.setFieldValue(
            "entries[0].rental_postcode",
            matchedProperty.rental_postcode || ""
          );
          // console.log(rentalsFormik.values, "rental formik values");
          // Now, after setting all the fields and state, call handleAddrentalOwner
          getUnitData(propertysData._id);
        })
        .catch((error) => {
          console.error("Error fetching rentals data:", error);
        });
      // handleAddrentalOwner();
      // console.log(rentalsFormik.values, "rental formik values");
      // console.log(rentalOwnerFormik.values, "rental owner formik values");
    }
  }, [id, entryIndex]);

  const getUnitData = async (id) => {
    await axios
      .get(`${baseUrl}/propertyunit/propertyunit/` + id)
      .then((res) => {
        // setUnitProperty(res.data.data);
        // console.log(res.data.data, "property unit");
        // setPropertyUnit(res.data.data);
        // const matchedUnit = res.data.data.filter(
        //   (item) => item._id ===
        // );
        // console.log(matchedUnit, "matchedUnit");
        // setClickedObject(matchedUnit[0]);
        setUnitData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // console.log(residentialImage, "residentialImage");
  // console.log(propType, "proptype");
  const handleSubmit = async (values) => {
    // console.log(residentialImage, "residentialImage after submit");
    // console.log(commercialImage, "commercialImage after submit");
    // console.log(file, "values");

    const entriesArray = [];
    if (propType === "Residential") {
      const entriesObject = {
        property_type: selectedProp.propertysub_type,
        rental_adress: rentalsFormik.values.entries[0].rental_adress,
        rental_city: rentalsFormik.values.entries[0].rental_city,
        rental_state: rentalsFormik.values.entries[0].rental_state,
        rental_country: rentalsFormik.values.entries[0].rental_country,
        rental_postcode: rentalsFormik.values.entries[0].rental_postcode,
        rental_sqft: rentalsFormik.values.entries[0].rental_soft,
        rentalOwner_operatingAccount: values.rentalOwner_operatingAccount,
        rentalOwner_propertyReserve: values.rentalOwner_propertyReserve,
        staffMember: selectedUser,
        //RESIDENTIAL
        residential: rentalsFormik.values.entries[0].residential,
        // createdAt:moment().format("YYYY-MM-DD"),
      };

      //COMMERCIAL

      entriesArray.push(entriesObject);

      const leaseObject = {
        //   Add Rental owner
        rentalOwner_firstName: rentalOwnerFormik.values.rentalOwner_firstName,
        rentalOwner_lastName: rentalOwnerFormik.values.rentalOwner_lastName,
        rentalOwner_companyName:
          rentalOwnerFormik.values.rentalOwner_companyName,
        rentalOwner_primaryEmail:
          rentalOwnerFormik.values.rentalOwner_primaryEmail,
        rentalOwner_phoneNumber:
          rentalOwnerFormik.values.rentalOwner_phoneNumber,
        rentalOwner_homeNumber: rentalOwnerFormik.values.rentalOwner_homeNumber,
        rentalOwner_businessNumber:
          rentalOwnerFormik.values.rentalOwner_businessNumber,
        entries: entriesArray,
      };
      console.log(leaseObject, "leaseObject");

      const res = await axios.post(`${baseUrl}/rentals/rentals`, leaseObject);
      if (res.data.statusCode === 200) {
        swal("Success!", "Property Added Successfully", "success");
        navigate("/admin/RentalownerTable");
        console.log(res.data.data, "res.data.data after post");
      } else {
        if (res.data.statusCode === 201) {
          swal("Failed!", "Property Name Already Added", "error");
        } else {
          swal("", res.data.message, "error");
        }
      }
      handleResponse(res);
    } else {
      const entriesObject = {
        property_type: selectedProp.propertysub_type,
        rental_adress: rentalsFormik.values.entries[0].rental_adress,
        rental_city: rentalsFormik.values.entries[0].rental_city,
        rental_state: rentalsFormik.values.entries[0].rental_state,
        rental_country: rentalsFormik.values.entries[0].rental_country,
        rental_postcode: rentalsFormik.values.entries[0].rental_postcode,
        rental_sqft: rentalsFormik.values.entries[0].rental_soft,
        rentalOwner_operatingAccount: values.rentalOwner_operatingAccount,
        rentalOwner_propertyReserve: values.rentalOwner_propertyReserve,
        staffMember: selectedUser,
        //RESIDENTIAL
        // residential: rentalsFormik.values.entries[0].residential,
        commercial: rentalsFormik.values.entries[0].commercial,
        // createdAt:moment().format("YYYY-MM-DD"),

        //COMMERCIAL
      };
      entriesArray.push(entriesObject);
      const leaseObject = {
        //   Add Rental owner
        rentalOwner_firstName: rentalOwnerFormik.values.rentalOwner_firstName,
        rentalOwner_lastName: rentalOwnerFormik.values.rentalOwner_lastName,
        rentalOwner_companyName:
          rentalOwnerFormik.values.rentalOwner_companyName,
        rentalOwner_primaryEmail:
          rentalOwnerFormik.values.rentalOwner_primaryEmail,
        rentalOwner_phoneNumber:
          rentalOwnerFormik.values.rentalOwner_phoneNumber,
        rentalOwner_homeNumber: rentalOwnerFormik.values.rentalOwner_homeNumber,
        rentalOwner_businessNumber:
          rentalOwnerFormik.values.rentalOwner_businessNumber,
        entries: entriesArray,
      };
      console.log(leaseObject, "leaseObject");

      const res = await axios.post(`${baseUrl}/rentals/rentals`, leaseObject);
      if (res.data.statusCode === 200) {
        swal("Success!", "Property Added Successfully", "success");
        // navigate("/admin/RentalownerTable");
        console.log(res.data.data, "form response");
        // console.log(res.data.data, "res.data.data after post");
      } else {
        swal("", res.data.message, "error");
      }
      handleResponse(res);
    }
    //      try {
    //   values["property_type"] = selectedProp;
    //   values["rental_bath"] = selectedbath;
    //   values["rental_bed"] = selectedBad;
    //   values["rentalOwner_operatingAccount"] = selectedBank;
    //   values["property_image"] = commercialImage;
    //   values["propertyres_image"] = residentialImage;
    //   values["staffMember"] = selectedUser;
    //   if (id === undefined) {
    //     console.log(values, "values after submit");
    //     const res = await axios.post(
    //       "https://propertymanager.cloudpress.host/api/rentals/rentals",
    //       values
    //     );
    //     handleResponse(res);
    //   } else {
    //     const editUrl = `${baseUrl}/rentals/rentals/${id}`;
    //     const res = await axios.put(editUrl, values);
    //     handleResponse(res);
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   if (error.response) {
    //     console.error("Response Data:", error.response.data);
    //   }
    //   // Handle the error and display an error message to the user if necessary.
    // }
  };

  const editProperty = async (id) => {
    const editUrl = `${baseUrl}/rentals/rental/${id}/entry/${entryIndex}`;
    const entriesArray = [];
    if (propType === "Residential") {
      const entriesObject = {
        property_type: selectedProp.propertysub_type,
        rental_adress: rentalsFormik.values.entries[0].rental_adress,
        rental_city: rentalsFormik.values.entries[0].rental_city,
        rental_state: rentalsFormik.values.entries[0].rental_state,
        rental_country: rentalsFormik.values.entries[0].rental_country,
        rental_postcode: rentalsFormik.values.entries[0].rental_postcode,

        rentalOwner_operatingAccount:
          rentalsFormik.values.entries[0].rentalOwner_operatingAccount,
        rentalOwner_propertyReserve:
          rentalsFormik.values.entries[0].rentalOwner_propertyReserve,
        staffMember: selectedUser,
        //rooms
        //RESIDENTIAL
        residential: unitData,
        //COMMERCIAL
        // commercial: rentalsFormik.values.entries[0].commercial,
      };
      entriesArray.push(entriesObject);

      const leaseObject = {
        //   Add Rental owner
        rentalOwner_firstName: rentalsFormik.values.rentalOwner_firstName
          ? rentalsFormik.values.rentalOwner_firstName
          : rentalOwnerData.rentalOwner_firstName,
        rentalOwner_lastName: rentalsFormik.values.rentalOwner_lastName
          ? rentalsFormik.values.rentalOwner_lastName
          : rentalOwnerData.rentalOwner_lastName,
        rentalOwner_companyName: rentalsFormik.values.rentalOwner_companyName
          ? rentalsFormik.values.rentalOwner_companyName
          : rentalOwnerData.rentalOwner_companyName,
        rentalOwner_primaryEmail: rentalsFormik.values.rentalOwner_primaryEmail
          ? rentalsFormik.values.rentalOwner_primaryEmail
          : rentalOwnerData.rentalOwner_primaryEmail,
        rentalOwner_phoneNumber: rentalsFormik.values.rentalOwner_phoneNumber
          ? rentalsFormik.values.rentalOwner_phoneNumber
          : rentalOwnerData.rentalOwner_phoneNumber,
        rentalOwner_homeNumber: rentalsFormik.values.rentalOwner_homeNumber
          ? rentalsFormik.values.rentalOwner_homeNumber
          : rentalOwnerData.rentalOwner_homeNumber,
        rentalOwner_businessNumber: rentalsFormik.values
          .rentalOwner_businessNumber
          ? rentalsFormik.values.rentalOwner_businessNumber
          : rentalOwnerData.rentalOwner_businessNumber,
        entries: entriesArray,
      };

      // console.log(leaseObject, "updated values");
      await axios
        .put(editUrl, leaseObject)
        .then((response) => {
          // console.log(response, "response1111");
          handleResponse(response);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      const entriesObject = {
        property_type: selectedProp.propertysub_type,
        rental_adress: rentalsFormik.values.entries[0].rental_adress,
        rental_city: rentalsFormik.values.entries[0].rental_city,
        rental_state: rentalsFormik.values.entries[0].rental_state,
        rental_country: rentalsFormik.values.entries[0].rental_country,
        rental_postcode: rentalsFormik.values.entries[0].rental_postcode,

        rentalOwner_operatingAccount:
          rentalsFormik.values.entries[0].rentalOwner_operatingAccount,
        rentalOwner_propertyReserve:
          rentalsFormik.values.entries[0].rentalOwner_propertyReserve,
        staffMember: selectedUser,
        //rooms
        //RESIDENTIAL
        // residential: rentalsFormik.values.entries[0].residential,
        //COMMERCIAL
        commercial: unitData,
      };
      entriesArray.push(entriesObject);

      const leaseObject = {
        //   Add Rental owner
        rentalOwner_firstName: rentalsFormik.values.rentalOwner_firstName
          ? rentalsFormik.values.rentalOwner_firstName
          : rentalOwnerData.rentalOwner_firstName,
        rentalOwner_lastName: rentalsFormik.values.rentalOwner_lastName
          ? rentalsFormik.values.rentalOwner_lastName
          : rentalOwnerData.rentalOwner_lastName,
        rentalOwner_companyName: rentalsFormik.values.rentalOwner_companyName
          ? rentalsFormik.values.rentalOwner_companyName
          : rentalOwnerData.rentalOwner_companyName,
        rentalOwner_primaryEmail: rentalsFormik.values.rentalOwner_primaryEmail
          ? rentalsFormik.values.rentalOwner_primaryEmail
          : rentalOwnerData.rentalOwner_primaryEmail,
        rentalOwner_phoneNumber: rentalsFormik.values.rentalOwner_phoneNumber
          ? rentalsFormik.values.rentalOwner_phoneNumber
          : rentalOwnerData.rentalOwner_phoneNumber,
        rentalOwner_homeNumber: rentalsFormik.values.rentalOwner_homeNumber
          ? rentalsFormik.values.rentalOwner_homeNumber
          : rentalOwnerData.rentalOwner_homeNumber,
        rentalOwner_businessNumber: rentalsFormik.values
          .rentalOwner_businessNumber
          ? rentalsFormik.values.rentalOwner_businessNumber
          : rentalOwnerData.rentalOwner_businessNumber,
        entries: entriesArray,
      };

      // console.log(leaseObject, "updated values");
      await axios
        .put(editUrl, leaseObject)
        .then((response) => {
          // console.log(response, "response1111");
          handleResponse(response);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  function handleResponse(response) {
    // console.log(response, "response");
    if (response.status === 200) {
      navigate("/admin/propertiesTable");
      swal(
        "Success!",
        id && entryIndex ? "Property Updated Successfully" : "Property Added Successfully!",
        "success"
      );
    } 
    if(response.status === 201){
      swal("Failed!",`Property "${rentalsFormik.values.entries[0].rental_adress}" already exists in the system`,"warning")
    }
    else {
      //alert(response.data.message);
    }
  }
  const addCommercialUnit = () => {
    const newUnit = {
      rentalcom_units: "",
      rentalcom_soft: "",
      rentalcom_unitsAdress: "",
      property_image: [],
    };

    rentalsFormik.setValues({
      ...rentalsFormik.values,
      entries: [
        {
          ...rentalsFormik.values.entries[0],
          commercial: [...rentalsFormik.values.entries[0].commercial, newUnit],
        },
      ],
    });
    const commercialUnit = [];
    setCommercialImage([...commercialImage, commercialUnit]);
    // rentalsFormik.values.propertyres_image.push(newUnit)
  };

  const deleteCommercialUnit = (index) => {
    // console.log("delete commercial");
    const updatedCommercialUnits = [
      ...rentalsFormik.values.entries[0].commercial,
    ];
    updatedCommercialUnits.splice(index, 1);
    rentalsFormik.setValues({
      ...rentalsFormik.values,
      entries: [
        {
          ...rentalsFormik.values.entries[0],
          commercial: updatedCommercialUnits,
        },
      ],
    });
  };

  const addResidentialUnits = () => {
    const newUnit = {
      rental_bed: "",
      rental_bath: "",
      propertyres_image: [],
      rental_sqft: "",
      rental_units: "",
      rental_unitsAdress: "",
    };

    rentalsFormik.setValues({
      ...rentalsFormik.values,
      entries: [
        {
          ...rentalsFormik.values.entries[0],
          residential: [
            ...rentalsFormik.values.entries[0].residential,
            newUnit,
          ],
        },
      ],
    });
    const residentialUnit = [];
    setResidentialImage([...residentialImage, residentialUnit]);
  };

  const deleteResidentialUnit = (index) => {
    const updatedResidentialUnits = [
      ...rentalsFormik.values.entries[0].residential,
    ];
    updatedResidentialUnits.splice(index, 1);
    rentalsFormik.setValues({
      ...rentalsFormik.values,
      entries: [
        {
          ...rentalsFormik.values.entries[0],
          residential: updatedResidentialUnits,
        },
      ],
    });
  };

  // console.log(rentalsFormik.values, "commercialUnits");

  return (
    <>
      <RentalHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card
              className="bg-secondary shadow"
              onSubmit={rentalsFormik.handleSubmit}
            >
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {id ? "Edit Property" : "New Property"}
                    </h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    {/* <Button
                        color="primary"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        Settings
                      </Button> */}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form role="form" open={open} onClose={handleClose}>
                  <h6 className="heading-small text-muted mb-4">
                    Property information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            What is the property type?
                          </label>
                          <br />
                          <br />
                          <Dropdown
                            isOpen={prodropdownOpen}
                            toggle={toggle1}
                            disabled={id && entryIndex}
                          >
                            <DropdownToggle caret>
                              {selectedProp && selectedProp.propertysub_type
                                ? selectedProp.propertysub_type
                                : selectedProp && !selectedProp.propertysub_type
                                ? selectedProp
                                : "Select Property Type"}
                            </DropdownToggle>
                            {/* {console.log(propertyData, "property data")} */}
                            <DropdownMenu>
                              {Object.keys(propertyData).map((propertyType) => (
                                <React.Fragment key={propertyType}>
                                  <DropdownItem
                                    header
                                    style={{ color: "blue" }}
                                  >
                                    {propertyType}
                                  </DropdownItem>
                                  {propertyData[propertyType].map((subtype) => (
                                    <DropdownItem
                                      key={subtype.propertysub_type}
                                      onClick={() => {
                                        handlePropSelection(subtype);

                                        // rentalsFormik.setFieldValue(
                                        //   "entries[0].property_type",
                                        //   subtype.propertysub_type
                                        // );
                                      }}
                                    >
                                      {subtype.propertysub_type}
                                    </DropdownItem>
                                  ))}
                                </React.Fragment>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                          {
                            <div>
                              {rentalsFormik.errors.entries &&
                              rentalsFormik.errors?.entries[0]?.property_type &&
                              rentalsFormik.touched?.entries &&
                              rentalsFormik.touched?.entries[0]
                                ?.property_type ? (
                                <div style={{ color: "red" }}>
                                  {
                                    rentalsFormik.errors?.entries[0]
                                      ?.property_type
                                  }
                                </div>
                              ) : null}
                            </div>
                          }
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            What is the street address?
                          </label>
                          <br />
                          <br />
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Address
                            </label>
                            <Input
                              required
                              className="form-control-alternative"
                              id="input-address"
                              placeholder="Address"
                              type="text"
                              name="rental_adress"
                              onBlur={rentalsFormik.handleBlur}
                              onChange={(e) =>
                                rentalsFormik.setFieldValue(
                                  "entries[0].rental_adress",
                                  e.target.value
                                )
                              }
                              value={
                                rentalsFormik.values?.entries[0]?.rental_adress
                              }
                            />
                            {/* {console.log(
                              rentalsFormik.values,
                              "values fsdfkm,"
                            )} */}
                            {
                              <div>
                                {rentalsFormik.errors.entries &&
                                rentalsFormik.errors?.entries[0]
                                  ?.rental_adress &&
                                rentalsFormik.touched?.entries &&
                                rentalsFormik.touched?.entries[0]
                                  ?.rental_adress ? (
                                  <div style={{ color: "red" }}>
                                    {
                                      rentalsFormik.errors?.entries[0]
                                        ?.rental_adress
                                    }
                                  </div>
                                ) : null}
                              </div>
                            }
                          </FormGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            City
                          </label>
                          <Input
                            required
                            className="form-control-alternative"
                            id="input-city"
                            placeholder="New York"
                            type="text"
                            name="rental_city"
                            onBlur={rentalsFormik.handleBlur}
                            onChange={(e) =>
                              rentalsFormik.setFieldValue(
                                "entries[0].rental_city",
                                e.target.value
                              )
                            }
                            value={
                              rentalsFormik.values?.entries[0]?.rental_city
                            }
                          />
                          {
                            <div>
                              {rentalsFormik.errors.entries &&
                              rentalsFormik.errors?.entries[0]?.rental_city &&
                              rentalsFormik.touched?.entries &&
                              rentalsFormik.touched?.entries[0]?.rental_city ? (
                                <div style={{ color: "red" }}>
                                  {
                                    rentalsFormik.errors?.entries[0]
                                      ?.rental_city
                                  }
                                </div>
                              ) : null}
                            </div>
                          }
                        </FormGroup>
                      </Col>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            State
                          </label>
                          <Input
                            required
                            className="form-control-alternative"
                            id="input-country"
                            placeholder="state"
                            type="text"
                            name="rental_state"
                            onBlur={rentalsFormik.handleBlur}
                            onChange={(e) =>
                              rentalsFormik.setFieldValue(
                                "entries[0].rental_state",
                                e.target.value
                              )
                            }
                            value={
                              rentalsFormik.values?.entries[0]?.rental_state
                            }
                          />
                          {
                            <div>
                              {rentalsFormik.errors.entries &&
                              rentalsFormik.errors?.entries[0]?.rental_state &&
                              rentalsFormik.touched?.entries &&
                              rentalsFormik.touched?.entries[0]
                                ?.rental_state ? (
                                <div style={{ color: "red" }}>
                                  {
                                    rentalsFormik.errors?.entries[0]
                                      ?.rental_state
                                  }
                                </div>
                              ) : null}
                            </div>
                          }
                        </FormGroup>
                      </Col>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Country
                          </label>
                          <Input
                            required
                            className="form-control-alternative"
                            id="input-country"
                            placeholder="United States"
                            type="text"
                            name="rental_country"
                            onBlur={rentalsFormik.handleBlur}
                            onChange={(e) =>
                              rentalsFormik.setFieldValue(
                                "entries[0].rental_country",
                                e.target.value
                              )
                            }
                            value={
                              rentalsFormik.values?.entries[0]?.rental_country
                            }
                          />
                          {
                            <div>
                              {rentalsFormik.errors.entries &&
                              rentalsFormik.errors?.entries[0]
                                ?.rental_country &&
                              rentalsFormik.touched?.entries &&
                              rentalsFormik.touched?.entries[0]
                                ?.rental_country ? (
                                <div style={{ color: "red" }}>
                                  {
                                    rentalsFormik.errors?.entries[0]
                                      ?.rental_country
                                  }
                                </div>
                              ) : null}
                            </div>
                          }
                        </FormGroup>
                      </Col>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Postal code
                          </label>
                          <Input
                            required
                            className="form-control-alternative"
                            id="input-postal-code"
                            placeholder="Postal code"
                            type="text"
                            name="rental_postcode"
                            onBlur={rentalsFormik.handleBlur}
                            onChange={(e) =>
                              rentalsFormik.setFieldValue(
                                "entries[0].rental_postcode",
                                e.target.value.toUpperCase()
                              )
                            }
                            value={
                              rentalsFormik.values.entries[0]?.rental_postcode
                            }
                            onInput={(e) => {
                              const inputValue = e.target.value;
                              const sanitizedValue = inputValue.replace(
                                /[^A-Za-z0-9-]/g,
                                ""
                              ); // Allow only alphanumeric characters and hyphen
                              e.target.value = sanitizedValue.toUpperCase();
                            }}
                          />
                          {
                            <div>
                              {rentalsFormik.errors.entries &&
                              rentalsFormik.errors?.entries[0]
                                ?.rental_postcode &&
                              rentalsFormik.touched?.entries &&
                              rentalsFormik.touched?.entries[0]
                                ?.rental_postcode ? (
                                <div style={{ color: "red" }}>
                                  {
                                    rentalsFormik.errors?.entries[0]
                                      ?.rental_postcode
                                  }
                                </div>
                              ) : null}
                            </div>
                          }
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Owner information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Who is the property owner?
                          </label>
                          <br />
                          <br />
                          <label
                            className="label2"
                            style={{ fontSize: "0.7rem" }}
                          >
                            This information wiil be used to help prepare owner
                            drawns and 1099s.
                          </label>
                          <br />
                          <span
                            onClick={setRentalDialogOpen}
                            style={{
                              cursor: "pointer",
                              fontSize: "14px",
                              fontFamily: "monospace",
                              color: "blue",
                            }}
                          >
                            <b style={{ fontSize: "20px" }}>+</b> Add rental
                            owner
                          </span>
                          <Dialog
                            open={isRentalDialogOpen}
                            onClose={handleClose}
                            PaperProps={{ style: dialogPaperStyles }}
                          >
                            <Form onSubmit={rentalOwnerFormik.handleSubmit}>
                              <DialogTitle style={{ background: "#F0F8FF" }}>
                                Add rental owner
                              </DialogTitle>

                              <DialogContent style={{ width: "100%" }}>
                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      paddingTop: "25px",
                                    }}
                                  >
                                    <Checkbox
                                      onChange={handleChange}
                                      style={{ marginRight: "10px" }}
                                      checked={showRentalOwnerTable === true}
                                    />
                                    <label className="form-control-label">
                                      Choose an existing rental owner
                                    </label>
                                  </div>
                                  <br />
                                </div>
                                {showRentalOwnerTable && rentalownerData && (
                                  <div
                                    style={{
                                      maxHeight: "400px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <Input
                                      type="text"
                                      placeholder="Search by first and last name"
                                      value={searchQuery}
                                      onChange={handleSearch}
                                      style={{
                                        marginBottom: "10px",
                                        width: "100%",
                                        padding: "8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                      }}
                                    />
                                    <div
                                      style={{
                                        maxHeight: "calc(400px - 40px)",
                                        overflowY: "auto",
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      <table
                                        style={{
                                          width: "100%",
                                          borderCollapse: "collapse",
                                        }}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              style={{
                                                padding: "15px",
                                              }}
                                            >
                                              RentalOwner Name
                                            </th>
                                            <th
                                              style={{
                                                padding: "15px",
                                              }}
                                            >
                                              Select
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {Array.isArray(rentalownerData) &&
                                            rentalownerData
                                              .filter((rentalOwner) => {
                                                const fullName = `${rentalOwner.rentalOwner_firstName} ${rentalOwner.rentalOwner_lastName}`;
                                                return fullName
                                                  .toLowerCase()
                                                  .includes(
                                                    searchQuery.toLowerCase()
                                                  );
                                              })
                                              .map((rentalOwner, index) => (
                                                <tr
                                                  key={index}
                                                  style={{
                                                    border: "1px solid #ddd",
                                                  }}
                                                >
                                                  {/* {console.log(
                                                  rentalOwner,
                                                  "revsefw"
                                                )} */}
                                                  <td
                                                    style={{
                                                      paddingLeft: "15px",
                                                      paddingTop: "15px",
                                                    }}
                                                  >
                                                    {
                                                      rentalOwner.rentalOwner_firstName
                                                    }
                                                    &nbsp;
                                                    {
                                                      rentalOwner.rentalOwner_lastName
                                                    }
                                                    {`(${rentalOwner.rentalOwner_phoneNumber})`}
                                                  </td>
                                                  <td
                                                    style={{
                                                      paddingLeft: "15px",
                                                      paddingTop: "15px",
                                                    }}
                                                  >
                                                    <Checkbox
                                                      type="checkbox"
                                                      name="rentalOwner"
                                                      id={
                                                        rentalOwner.rentalOwner_phoneNumber
                                                      }
                                                      checked={
                                                        rentalOwner.rentalOwner_phoneNumber ===
                                                        checkedCheckbox
                                                      }
                                                      onChange={(event) => {
                                                        setCheckedCheckbox(
                                                          rentalOwner.rentalOwner_phoneNumber
                                                        );
                                                        // console.log(rentalOwner, "rentalownerData");
                                                        rentalOwnerFormik.setValues(
                                                          {
                                                            rentalOwner_firstName:
                                                              rentalOwner.rentalOwner_firstName,
                                                            rentalOwner_lastName:
                                                              rentalOwner.rentalOwner_lastName,
                                                            rentalOwner_phoneNumber:
                                                              rentalOwner.rentalOwner_phoneNumber,
                                                            rentalOwner_companyName:
                                                              rentalOwner.rentalOwner_companyName,
                                                            rentalOwner_primaryEmail:
                                                              rentalOwner.rentalOwner_primaryEmail,

                                                            rentalOwner_homeNumber:
                                                              rentalOwner.rentalOwner_homeNumber,
                                                            rentalOwner_businessNumber:
                                                              rentalOwner.rentalOwner_businessNumber,
                                                          }
                                                        );
                                                        const rentalOwnerInfo = `${
                                                          rentalOwner.rentalOwner_firstName ||
                                                          ""
                                                        }-${
                                                          rentalOwner.rentalOwner_lastName ||
                                                          ""
                                                        }-${
                                                          rentalOwner.rentalOwner_phoneNumber ||
                                                          ""
                                                        }-${
                                                          rentalOwner.rentalOwner_companyName ||
                                                          ""
                                                        }-${
                                                          rentalOwner.rentalOwner_primaryEmail ||
                                                          ""
                                                        }-${
                                                          rentalOwner.rentalOwner_homeNumber ||
                                                          ""
                                                        }-${
                                                          rentalOwner.rentalOwner_businessNumber ||
                                                          ""
                                                        }`;

                                                        handleCheckboxChange(
                                                          event,
                                                          rentalOwnerInfo,
                                                          rentalOwner.rentalOwner_phoneNumber
                                                        );
                                                      }}
                                                    />
                                                  </td>
                                                </tr>
                                              ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    <br />
                                  </div>
                                )}
                                {!showRentalOwnerTable && (
                                  <div>
                                    <div
                                      className="formInput"
                                      style={{ margin: "10px 10px" }}
                                    >
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-country"
                                      >
                                        Name *
                                      </label>
                                      <br />
                                      <Input
                                        required
                                        id="standard-multiline-static"
                                        className="popinput"
                                        type="text"
                                        placeholder="First Name"
                                        style={{ marginRight: "10px", flex: 1 }}
                                        name="rentalOwner_firstName"
                                        onBlur={rentalOwnerFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalOwnerFormik.setFieldValue(
                                            "rentalOwner_firstName",
                                            e.target.value
                                          );
                                          rentalsFormik.setFieldValue(
                                            "rentalOwner_firstName",
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          rentalOwnerFormik.values
                                            .rentalOwner_firstName
                                        }
                                      />

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_firstName &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_firstName ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_firstName
                                          }
                                        </div>
                                      ) : null}
                                      <br />
                                      <Input
                                        required
                                        id="standard-multiline-static"
                                        className="popinput"
                                        type="text"
                                        placeholder="Last Name"
                                        style={{ flex: 1 }}
                                        name="rentalOwner_lastName"
                                        onBlur={rentalOwnerFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalOwnerFormik.setFieldValue(
                                            "rentalOwner_lastName",
                                            e.target.value
                                          );
                                          rentalsFormik.setFieldValue(
                                            "rentalOwner_lastName",
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          rentalOwnerFormik.values
                                            .rentalOwner_lastName
                                        }
                                      />

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_lastName &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_lastName ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_lastName
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                    <div
                                      className="formInput"
                                      style={{ margin: "30px 10px" }}
                                    >
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-address"
                                      >
                                        Company Name
                                      </label>
                                      <br />
                                      <Input
                                        required
                                        id="standard-multiline-static"
                                        className="popinput"
                                        type="text"
                                        placeholder="L & T Company"
                                        style={{ marginRight: "10px", flex: 1 }}
                                        name="rentalOwner_companyName"
                                        onBlur={rentalOwnerFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalOwnerFormik.setFieldValue(
                                            "rentalOwner_companyName",
                                            e.target.value
                                          );
                                          rentalsFormik.setFieldValue(
                                            "rentalOwner_companyName",
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          rentalOwnerFormik.values
                                            .rentalOwner_companyName
                                        }
                                      />

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_companyName &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_companyName ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_companyName
                                          }
                                        </div>
                                      ) : null}
                                      {/* <Checkbox
                                  onClick={handleChange}
                                  style={{ marginRight: "10px" }}
                                />
                                <span>Company</span> */}
                                    </div>
                                    <div
                                      className="formInput"
                                      style={{ margin: "30px 10px" }}
                                    >
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-address"
                                      >
                                        Primary Email
                                      </label>
                                      <br />
                                      <InputGroup
                                        style={{
                                          marginRight: "10px",
                                          marginTop: "5px",
                                          flex: 1,
                                        }}
                                      >
                                        <Input
                                          required
                                          id="standard-multiline-static"
                                          className="popinput"
                                          type="text"
                                          name="rentalOwner_primaryEmail"
                                          onBlur={rentalOwnerFormik.handleBlur}
                                          onChange={(e) => {
                                            rentalOwnerFormik.setFieldValue(
                                              "rentalOwner_primaryEmail",
                                              e.target.value
                                            );
                                            rentalsFormik.setFieldValue(
                                              "rentalOwner_primaryEmail",
                                              e.target.value
                                            );
                                          }}
                                          value={
                                            rentalOwnerFormik.values
                                              .rentalOwner_primaryEmail
                                          }
                                        />
                                        <InputGroupAddon addonType="prepend">
                                          <span
                                            className="input-group-text"
                                            style={{
                                              paddingBottom: "8px",
                                              paddingTop: "8px",
                                            }}
                                          >
                                            <EmailIcon />
                                          </span>
                                        </InputGroupAddon>
                                      </InputGroup>

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_primaryEmail &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_primaryEmail ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_primaryEmail
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                    <div
                                      className="formInput"
                                      style={{ margin: "30px 10px" }}
                                    >
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-address"
                                      >
                                        Phone Numbers
                                      </label>
                                      <br />
                                      <InputGroup
                                        style={{
                                          marginBottom: "30px",
                                          marginRight: "10px",
                                          marginTop: "5px",
                                          flex: 1,
                                        }}
                                      >
                                        <Input
                                          required
                                          id="standard-multiline-static"
                                          className="popinput"
                                          type="text"
                                          name="rentalOwner_phoneNumber"
                                          onBlur={rentalOwnerFormik.handleBlur}
                                          onChange={(e) => {
                                            rentalOwnerFormik.setFieldValue(
                                              "rentalOwner_phoneNumber",
                                              e.target.value
                                            );
                                            rentalsFormik.setFieldValue(
                                              "rentalOwner_phoneNumber",
                                              e.target.value
                                            );
                                          }}
                                          value={
                                            rentalOwnerFormik.values
                                              .rentalOwner_phoneNumber
                                          }
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                                            e.target.value = numericValue;
                                          }}
                                        />
                                        <InputGroupAddon addonType="prepend">
                                          <span
                                            className="input-group-text"
                                            style={{
                                              paddingBottom: "8px",
                                              paddingTop: "8px",
                                            }}
                                          >
                                            <PhoneIcon />
                                          </span>
                                        </InputGroupAddon>
                                      </InputGroup>

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_phoneNumber &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_phoneNumber ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_phoneNumber
                                          }
                                        </div>
                                      ) : null}
                                      <InputGroup
                                        style={{
                                          marginBottom: "30px",
                                          marginRight: "10px",
                                          flex: 1,
                                        }}
                                      >
                                        <Input
                                          id="standard-multiline-static"
                                          className="popinput"
                                          type="text"
                                          name="rentalOwner_homeNumber"
                                          onBlur={rentalOwnerFormik.handleBlur}
                                          onChange={(e) => {
                                            rentalOwnerFormik.setFieldValue(
                                              "rentalOwner_homeNumber",
                                              e.target.value
                                            );
                                            rentalsFormik.setFieldValue(
                                              "rentalOwner_homeNumber",
                                              e.target.value
                                            );
                                          }}
                                          value={
                                            rentalOwnerFormik.values
                                              .rentalOwner_homeNumber
                                          }
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                                            e.target.value = numericValue;
                                          }}
                                        />
                                        <InputGroupAddon addonType="prepend">
                                          <span
                                            className="input-group-text"
                                            style={{
                                              paddingBottom: "8px",
                                              paddingTop: "8px",
                                            }}
                                          >
                                            <HomeIcon />
                                          </span>
                                        </InputGroupAddon>
                                      </InputGroup>

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_homeNumber &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_homeNumber ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_homeNumber
                                          }
                                        </div>
                                      ) : null}
                                      <InputGroup
                                        style={{
                                          marginBottom: "10px",
                                          marginRight: "10px",
                                          flex: 1,
                                        }}
                                      >
                                        <Input
                                          id="standard-multiline-static"
                                          className="popinput"
                                          type="text"
                                          name="rentalOwner_businessNumber"
                                          onBlur={rentalOwnerFormik.handleBlur}
                                          onChange={(e) => {
                                            rentalOwnerFormik.setFieldValue(
                                              "rentalOwner_businessNumber",
                                              e.target.value
                                            );
                                            rentalsFormik.setFieldValue(
                                              "rentalOwner_businessNumber",
                                              e.target.value
                                            );
                                          }}
                                          value={
                                            rentalOwnerFormik.values
                                              .rentalOwner_businessNumber
                                          }
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                                            e.target.value = numericValue;
                                          }}
                                        />

                                        <InputGroupAddon addonType="prepend">
                                          <span
                                            className="input-group-text"
                                            style={{
                                              paddingBottom: "8px",
                                              paddingTop: "8px",
                                            }}
                                          >
                                            <BusinessIcon />
                                          </span>
                                        </InputGroupAddon>
                                      </InputGroup>

                                      {rentalOwnerFormik.touched
                                        .rentalOwner_businessNumber &&
                                      rentalOwnerFormik.errors
                                        .rentalOwner_businessNumber ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalOwnerFormik.errors
                                              .rentalOwner_businessNumber
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                              <DialogActions>
                                <Button type="submit" color="primary">
                                  Add
                                </Button>
                                <Button onClick={handleClose}>Cancel</Button>
                              </DialogActions>
                            </Form>
                          </Dialog>
                          {Object.keys(selectedRentalOwnerData).length > 0 ? (
                            <div>
                              <h3
                                style={{
                                  marginTop: "2%",
                                }}
                              >
                                Rental owner Information
                              </h3>
                              <table
                                style={{
                                  borderCollapse: "collapse",
                                  width: "100%",
                                  marginTop: "2%",
                                }}
                              >
                                <thead>
                                  <tr style={{ background: "#f2f2f2" }}>
                                    <th
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      First Name
                                    </th>
                                    <th
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      Last Name
                                    </th>
                                    <th
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      Phone Number
                                    </th>
                                    <th
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      {selectedRentalOwnerData.firstName}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      {selectedRentalOwnerData.lastName}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      {selectedRentalOwnerData.phoneNumber}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                      }}
                                    >
                                      <EditIcon
                                        onClick={() => {
                                          setshowRentalOwnerTable(false);
                                          setRentalDialogOpen(true);
                                        }}
                                      />
                                      <DeleteIcon
                                        onClick={() => {
                                          setshowRentalOwnerTable(false);
                                          handleRentalownerDelete();
                                        }}
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  {/* <h6 className="heading-small text-muted mb-4">
                    Bank Account Details
                  </h6> */}
                  <div className="pl-lg-4">
                    {/* <label
                      className="form-control-label"
                      htmlFor="input-property"
                    >
                      What is the property's primary bank account?
                    </label> */}
                    {/* <br />
                    <br /> */}
                    <Row>
                      {/* <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-account"
                          >
                            Operating Account
                          </label>
                          <br />
                          <Dropdown isOpen={bankdropdownOpen} toggle={toggle2}>
                            <DropdownToggle caret style={{ width: "100%" }}>
                              {selectedBank} &nbsp;&nbsp;&nbsp;&nbsp;
                            </DropdownToggle>
                            <DropdownMenu style={{ width: "100%" }}>
                              <DropdownItem
                                onClick={() =>
                                  handleBankSelection("JPMorgan Chase Bank")
                                }
                              >
                                JPMorgan Chase Bank
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  handleBankSelection("Bank of America")
                                }
                              >
                                Bank of America
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  handleBankSelection("Wells Fargo Bank")
                                }
                              >
                                Wells Fargo Bank
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => handleBankSelection("Citibank")}
                              >
                                Citibank
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => handleBankSelection("U.S.Bank")}
                              >
                                U.S.Bank
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  handleBankSelection("Capital One")
                                }
                              >
                                Capital One
                              </DropdownItem>
                              <DropdownItem onClick={toggleAddBankDialog}>
                                Add new bank..
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                          <Dialog
                            open={isAddBankDialogOpen}
                            onClose={handleCloseDialog}
                          >
                            <DialogTitle style={{ background: "#F0F8FF" }}>
                              Add bank account
                            </DialogTitle>
                            <DialogContent
                              style={{ width: "100%", maxWidth: "500px" }}
                            >
                              <div
                                className="formInput"
                                style={{ margin: "10px 10px" }}
                              >
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  Bank Account Name *
                                </label>
                                <br />
                                <Input
                                  className="form-control-alternative"
                                  id="input-accname"
                                  placeholder="e.g. Bank of America 1234"
                                  type="text"
                                />
                              </div>

                              <div
                                className="formInput"
                                style={{ margin: "30px 10px" }}
                              >
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  Account Notes
                                </label>
                                <br />
                                <Input
                                  className="form-control-alternative"
                                  id="input-address"
                                  placeholder="This bank account is used to track 302 Properties"
                                  type="textarea"
                                  style={{ height: "90px" }}
                                />
                              </div>
                              <div
                                className="formInput"
                                style={{ margin: "30px 10px" }}
                              >
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  Account Type
                                </label>
                                <br />
                                <FormGroup check>
                                  <Label
                                    check
                                    style={{
                                      fontSize: "15px",
                                      fontFamily: "sans-serif",
                                    }}
                                  >
                                    <Input type="radio" name="radio1" />{" "}
                                    Checking Account
                                  </Label>
                                </FormGroup>
                                <FormGroup check>
                                  <Label
                                    check
                                    style={{
                                      fontSize: "15px",
                                      fontFamily: "sans-serif",
                                    }}
                                  >
                                    <Input type="radio" name="radio2" /> Savings
                                    Account
                                  </Label>
                                </FormGroup>
                              </div>
                              <div
                                className="formInput"
                                style={{ margin: "10px 10px" }}
                              >
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  Country *
                                </label>
                                <br />
                                <Input
                                  className="form-control-alternative"
                                  id="input-countryt"
                                  placeholder="United States"
                                  type="text"
                                />
                              </div>
                              <div
                                className="formInput"
                                style={{ margin: "30px 10px" }}
                              >
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  Routing Number
                                </label>
                                <br />
                                <Input
                                  className="form-control-alternative"
                                  id="input-routno"
                                  placeholder=""
                                  type="number"
                                />
                              </div>
                              <div
                                className="formInput"
                                style={{ margin: "30px 10px" }}
                              >
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  Account Number
                                </label>
                                <br />
                                <Input
                                  className="form-control-alternative"
                                  id="input-no"
                                  placeholder=""
                                  type="number"
                                />
                              </div>
                              <div
                                className="formInput"
                                style={{ margin: "30px 10px" }}
                              >
                                We stores this information{" "}
                                <b style={{ color: "blue", fontSize: "15px" }}>
                                  Privately
                                </b>{" "}
                                and{" "}
                                <b style={{ color: "blue", fontSize: "15px" }}>
                                  Securely
                                </b>
                                .
                              </div>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleCloseDialog}>
                                Cancel
                              </Button>
                              <Button
                                onClick={handleCloseDialog}
                                color="primary"
                              >
                                Add
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </FormGroup>
                      </Col> */}
                      <br />
                      {/* <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Property Reserve
                          </label>
                          <br />
                          <FormGroup>
                            <Input
                              className="form-control-alternative"
                              id="input-reserve"
                              placeholder="$0.00"
                              type="number"
                              name="rentalOwner_propertyReserve"
                              onBlur={rentalsFormik.handleBlur}
                              onChange={rentalsFormik.handleChange}
                              value={
                                rentalsFormik.values.rentalOwner_propertyReserve
                              }
                            />
                            {rentalsFormik.touched
                              .rentalOwner_propertyReserve &&
                            rentalsFormik.errors.rentalOwner_propertyReserve ? (
                              <div style={{ color: "red" }}>
                                {
                                  rentalsFormik.errors
                                    .rentalOwner_propertyReserve
                                }
                              </div>
                            ) : null}
                          </FormGroup>
                        </FormGroup>
                      </Col> */}
                    </Row>{" "}
                    <br />
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Who will be the primary manager of this property?
                          </label>
                          <br />
                          <br />
                          <label
                            className="label2"
                            style={{ fontSize: "0.7rem" }}
                          >
                            If the staff member has not yet been added as a user
                            in your account,they can be added to the
                            account,then as the manager later through the
                            property's summary details.
                          </label>
                          <br />
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Manager (Optional)
                          </label>
                          <br />
                          <FormGroup>
                            <Dropdown
                              isOpen={userdropdownOpen}
                              toggle={toggle3}
                            >
                              <DropdownToggle caret>
                                {selectedUser ? selectedUser : "Select"}
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem value="">Select</DropdownItem>
                                {StaffMemberData.map((user) => (
                                  <DropdownItem
                                    key={user._id}
                                    onClick={() =>
                                      handleUserSelection(user.staffmember_name)
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
                  </div>

                  <hr className="my-4" />
                  {/* Description */}
                  {propType === "Residential" && (
                    <div className="pl-lg-4">
                      <h6 className="heading-small text-muted mb-4">
                        Residential Unit
                      </h6>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Enter Residential Units
                        </label>
                        <br />
                        <br />
                        {rentalsFormik.values.entries &&
                          rentalsFormik.values.entries[0]?.residential.map(
                            (residential, residentialIndex) => (
                              <div key={residentialIndex}>
                                <Row style={{ position: "relative" }}>
                                  <ClearIcon
                                    style={{
                                      cursor: "pointer",
                                      position: "absolute",
                                      right: "10px",
                                      display: selectedProp.ismultiunit
                                        ? "block"
                                        : "none",
                                      marginBottom: "20px",
                                    }}
                                    onClick={() => {
                                      deleteResidentialUnit(residentialIndex);
                                    }}
                                  />
                                  <Col
                                    lg="3"
                                    style={
                                      selectedProp.ismultiunit
                                        ? {
                                            display: "block",
                                            marginTop: "20px",
                                          }
                                        : { display: "none" }
                                    }
                                  >
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor={`input-unit-${residentialIndex}`}
                                        style={{ paddingTop: "10px" }}
                                      >
                                        Units *
                                      </label>
                                      <Input
                                        required
                                        className="form-control-alternative"
                                        id={`input-unit-${residentialIndex}`}
                                        placeholder="102"
                                        type="text"
                                        name={`entries[0].residential[${residentialIndex}].rental_units`}
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={(e) => {
                                          const value = e.target.value; // Get the entered value

                                          // Allow only alphabetic and numeric characters
                                          const newValue = value.replace(
                                            /[^A-Za-z0-9]/g,
                                            ""
                                          );

                                          rentalsFormik.setFieldValue(
                                            `entries[0].residential[${residentialIndex}].rental_units`,
                                            newValue
                                          );
                                        }}
                                        value={
                                          rentalsFormik.values.entries[0]
                                            .residential[residentialIndex]
                                            .rental_units
                                        }
                                      />
                                      {rentalsFormik.errors.entries &&
                                      rentalsFormik.errors.entries[0]
                                        ?.residential &&
                                      rentalsFormik.errors.entries[0]
                                        .residential[residentialIndex]
                                        ?.rental_units &&
                                      rentalsFormik.touched.entries &&
                                      rentalsFormik.touched.entries[0]
                                        ?.residential &&
                                      rentalsFormik.touched.entries[0]
                                        .residential[residentialIndex]
                                        ?.rental_units ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalsFormik.errors.entries[0]
                                              .residential[residentialIndex]
                                              ?.rental_units
                                          }
                                        </div>
                                      ) : null}
                                    </FormGroup>
                                  </Col>
                                  <Col
                                    lg="4"
                                    style={
                                      selectedProp.ismultiunit
                                        ? { display: "block" }
                                        : { display: "none" }
                                    }
                                  >
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                        style={{ paddingTop: "30px" }}
                                      >
                                        Unit Address *
                                      </label>
                                      <Input
                                        required
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="A12 Bhaskar Enclave, Phase 2 - 102"
                                        type="text"
                                        name={`entries${[
                                          residentialIndex,
                                        ]}.rental_unitsAdress`}
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={(e) =>
                                          rentalsFormik.setFieldValue(
                                            `entries[0].residential[${residentialIndex}].rental_unitsAdress`,
                                            e.target.value
                                          )
                                        }
                                        value={
                                          rentalsFormik.values.entries[0]
                                            .residential[residentialIndex]
                                            .rental_unitsAdress
                                        }
                                      />
                                      {/* {rentalsFormik.touched.rental_unitsAdress &&
                                    rentalsFormik.errors.rental_unitsAdress ? (
                                      <div style={{ color: "red" }}>
                                        {
                                          rentalsFormik.errors
                                            .rental_unitsAdress
                                        }
                                      </div>
                                    ) : null} */}
                                    </FormGroup>
                                  </Col>
                                  <Col lg="3">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                        style={{ paddingTop: "30px" }}
                                      >
                                        SQFT
                                      </label>
                                      <Input
                                        required
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="3000"
                                        type="text"
                                        name={`entries[0].residential[${residentialIndex}].rental_sqft`}
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalsFormik.setFieldValue(
                                            `entries[0].residential[${residentialIndex}].rental_sqft`,
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          rentalsFormik.values.entries[0]
                                            .residential[residentialIndex]
                                            .rental_sqft
                                        }
                                        onInput={(e) => {
                                          const inputValue = e.target.value;
                                          const numericValue =
                                            inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                                          e.target.value = numericValue;
                                        }}
                                      />
                                      {/* {rentalsFormik.touched.rental_soft &&
                                    rentalsFormik.errors.rental_soft ? (
                                      <div style={{ color: "red" }}>
                                        {rentalsFormik.errors.rental_soft}
                                      </div>
                                    ) : null} */}
                                    </FormGroup>
                                  </Col>
                                  <Col lg="8">
                                    <FormGroup>
                                      <br />
                                      <Row
                                        style={{
                                          display: "flex",
                                          flexDirection: "row",
                                        }}
                                      >
                                        <Col md="4">
                                          <FormGroup>
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-unitadd"
                                            >
                                              Bath
                                            </label>
                                            <Autocomplete
                                              className="form-control-alternative"
                                              // id="free-solo-demo"
                                              id="input-unitadd"
                                              freeSolo
                                              size="small"
                                              options={bathArray.map(
                                                (option) => option
                                              )}
                                              onChange={(event, newValue) => {
                                                rentalsFormik.setFieldValue(
                                                  `entries[0].residential[${residentialIndex}].rental_bath`,
                                                  newValue
                                                );
                                              }}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  name={`residential[${residentialIndex}].rental_bath`}
                                                  id={`residential[${residentialIndex}].rental_bath`}
                                                  value={
                                                    rentalsFormik.values
                                                      .entries[0].residential[
                                                      residentialIndex
                                                    ].rental_bath
                                                  }
                                                  // onChange={rentalsFormik.handleChange}
                                                  onChange={(e) => {
                                                    rentalsFormik.setFieldValue(
                                                      `entries[0].residential[${residentialIndex}].rental_bath`,
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              )}
                                            />
                                            {/* {console.log(
                                            rentalsFormik.values.entries[0]
                                              .residential[residentialIndex],
                                            "hiufhbgvwejnkml"
                                          )} */}
                                          </FormGroup>
                                        </Col>
                                        <Col md="4">
                                          <FormGroup>
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-unitadd"
                                            >
                                              Bed
                                            </label>

                                            <Autocomplete
                                              className="form-control-alternative"
                                              // id="free-solo-demo"
                                              id="input-unitadd"
                                              freeSolo
                                              size="small"
                                              options={roomsArray.map(
                                                (option) => option
                                              )}
                                              onChange={(event, newValue) => {
                                                rentalsFormik.setFieldValue(
                                                  `entries[0].residential[${residentialIndex}].rental_bed`,
                                                  newValue
                                                );
                                              }}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  name={`residential[${residentialIndex}].rental_bed`}
                                                  id={`residential[${residentialIndex}].rental_bed`}
                                                  value={
                                                    rentalsFormik.values
                                                      .entries[0].residential[
                                                      residentialIndex
                                                    ].rental_bed
                                                  }
                                                  // onChange={rentalsFormik.handleChange}
                                                  onChange={(e) => {
                                                    rentalsFormik.setFieldValue(
                                                      `entries[0].residential[${residentialIndex}].rental_bed`,
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              )}
                                            />
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                      &nbsp;&nbsp;
                                    </FormGroup>
                                  </Col>
                                  <Col lg="5">
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
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
                                          onClick={togglePhotoresDialog}
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
                                            id={`propertyres_image_${residentialIndex}`}
                                            name={`propertyres_image_${residentialIndex}`}
                                            onChange={(e) => {
                                              const file = [...e.target.files];
                                              fileData(
                                                file,
                                                "propertyres_image",
                                                residentialIndex
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
                                                  residentialImage[
                                                    residentialIndex
                                                  ]
                                                ) {
                                                  setResidentialImage([
                                                    ...residentialImage.slice(
                                                      0,
                                                      residentialIndex
                                                    ),
                                                    [
                                                      ...residentialImage[
                                                        residentialIndex
                                                      ],
                                                      ...allImages,
                                                    ],
                                                    ...residentialImage.slice(
                                                      1 + residentialIndex
                                                    ),
                                                  ]);
                                                } else {
                                                  setResidentialImage([
                                                    ...allImages,
                                                  ]);
                                                }
                                              } else {
                                                setResidentialImage([
                                                  ...residentialImage,
                                                ]);
                                                // )
                                              }
                                            }}
                                          />
                                          <label
                                            htmlFor={`propertyres_image_${residentialIndex}`}
                                          >
                                            <b style={{ fontSize: "20px" }}>
                                              +
                                            </b>{" "}
                                            Add
                                          </label>
                                          {/* <b style={{ fontSize: "20px" }}>+</b> Add */}
                                        </span>
                                      </FormGroup>

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
                                          {residentialImage &&
                                            Array.isArray(
                                              residentialImage[residentialIndex]
                                            ) &&
                                            residentialImage[
                                              residentialIndex
                                            ].map((image, index) => (
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
                                                      residentialIndex,
                                                      image,
                                                      "propertyres_image"
                                                    )
                                                  }
                                                />
                                                {imgLoader &&
                                                  index ===
                                                    residentialImage[
                                                      residentialIndex
                                                    ].length -
                                                      1 && (
                                                    <div className="loader">
                                                      {/* Your loader component goes here */}
                                                    </div>
                                                  )}
                                              </div>
                                            ))}
                                          <OpenImageDialog
                                            open={open}
                                            setOpen={setOpen}
                                            selectedImage={selectedImage}
                                          />
                                        </div>
                                      </FormGroup>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            )
                          )}
                        <Row>
                          <Col>
                            <Button
                              onClick={addResidentialUnits}
                              style={
                                selectedProp.ismultiunit
                                  ? { display: "block" }
                                  : { display: "none" }
                              }
                            >
                              Add another unit
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    </div>
                  )}
                  {/* {console.log(propType, "propType")} */}
                  {propType === "Commercial" && (
                    <div className="pl-lg-4">
                      <h6 className="heading-small text-muted mb-4">
                        Commercial Unit
                      </h6>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Enter Commercial Units
                        </label>
                        <br />
                        <br />
                        {rentalsFormik.values.entries &&
                          rentalsFormik.values.entries[0].commercial.map(
                            (commercialUnit, commercialIndex) => (
                              <div key={commercialIndex}>
                                <Row style={{ position: "relative" }}>
                                  <ClearIcon
                                    style={{
                                      cursor: "pointer",
                                      position: "absolute",
                                      right: "10px",
                                      display: selectedProp.ismultiunit
                                        ? "block"
                                        : "none",
                                    }}
                                    onClick={() => {
                                      deleteCommercialUnit(commercialIndex);
                                    }}
                                  />

                                  <Col
                                    lg="3"
                                    style={
                                      selectedProp.ismultiunit
                                        ? { display: "block" }
                                        : { display: "none" }
                                    }
                                  >
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor={`input-unit-${commercialIndex}`}
                                      >
                                        Units *
                                      </label>
                                      <Input
                                        required
                                        className="form-control-alternative"
                                        id={`input-unit-${commercialIndex}`}
                                        placeholder="102"
                                        type="text"
                                        //name should be dynamic
                                        name={`rentalcom_units${commercialIndex}`}
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalsFormik.setFieldValue(
                                            `entries[0].commercial[${commercialIndex}].rentalcom_units`,
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          rentalsFormik.values.entries[0]
                                            .commercial[commercialIndex]
                                            .rentalcom_units
                                        }
                                      />
                                      {/* {rentalsFormik.touched.rentalcom_units &&
                                      rentalsFormik.errors.rentalcom_units ? (
                                        <div style={{ color: "red" }}>
                                          {rentalsFormik.errors.rentalcom_units}
                                        </div>
                                      ) : null} */}
                                      {rentalsFormik.errors.entries &&
                                      rentalsFormik.errors.entries[0]
                                        ?.commercial &&
                                      rentalsFormik.errors.entries[0]
                                        .commercial[commercialIndex]
                                        ?.rentalcom_units &&
                                      rentalsFormik.touched.entries &&
                                      rentalsFormik.touched.entries[0]
                                        ?.commercial &&
                                      rentalsFormik.touched.entries[0]
                                        .commercial[commercialIndex]
                                        ?.rentalcom_units ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalsFormik.errors.entries[0]
                                              .commercial[commercialIndex]
                                              ?.rentalcom_units
                                          }
                                        </div>
                                      ) : null}
                                    </FormGroup>
                                  </Col>
                                  <Col
                                    lg="4"
                                    style={
                                      selectedProp.ismultiunit
                                        ? { display: "block" }
                                        : { display: "none" }
                                    }
                                  >
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                      >
                                        Unit Address *
                                      </label>
                                      <Input
                                        required
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="A12 Bhaskar Enclave, Phase 2 - 102"
                                        type="text"
                                        name={`rentalcom_unitsAdress${commercialIndex}`}
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalsFormik.setFieldValue(
                                            `entries[0].commercial[${commercialIndex}].rentalcom_unitsAdress`,
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          rentalsFormik.values.entries[0]
                                            .commercial[commercialIndex]
                                            .rentalcom_unitsAdress
                                        }
                                      />
                                      {/* {rentalsFormik.touched
                                        .rentalcom_unitsAdress &&
                                      rentalsFormik.errors
                                        .rentalcom_unitsAdress ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            rentalsFormik.errors
                                              .rentalcom_unitsAdress
                                          }
                                        </div>
                                      ) : null} */}
                                    </FormGroup>
                                  </Col>
                                  <Col lg="2">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-unitadd"
                                      >
                                        SQFT
                                      </label>
                                      <Input
                                        required
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="3000"
                                        type="text"
                                        name={`rentalcom_sqft${commercialIndex}`}
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={(e) => {
                                          rentalsFormik.setFieldValue(
                                            `entries[0].commercial[${commercialIndex}].rentalcom_sqft`,
                                            e.target.value
                                          );
                                        }}
                                        onInput={(e) => {
                                          const inputValue = e.target.value;
                                          const numericValue =
                                            inputValue.replace(/\D/g, "");
                                          e.target.value = numericValue;
                                        }}
                                        value={
                                          rentalsFormik.values.entries[0]
                                            .commercial[commercialIndex]
                                            .rentalcom_sqft
                                        }
                                      />
                                      {/* {rentalsFormik.touched.rentalcom_soft &&
                                      rentalsFormik.errors.rentalcom_soft ? (
                                        <div style={{ color: "red" }}>
                                          {rentalsFormik.errors.rentalcom_soft}
                                        </div>
                                      ) : null} */}
                                    </FormGroup>
                                  </Col>

                                  <Col lg="5">
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
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
                                          onClick={togglePhotoDialog}
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
                                            // name="property_image"
                                            multiple
                                            id={`property_image${commercialIndex}`}
                                            name={`property_image${commercialIndex}`}
                                            onChange={(e) => {
                                              const file = [...e.target.files];
                                              fileData(
                                                file,
                                                "property_image",
                                                commercialIndex
                                              );

                                              if (file) {
                                                const allImages = file.map(
                                                  (file) => {
                                                    return URL.createObjectURL(
                                                      file
                                                    );
                                                  }
                                                );

                                                if (
                                                  commercialImage[
                                                    commercialIndex
                                                  ]
                                                ) {
                                                  setCommercialImage([
                                                    ...commercialImage.slice(
                                                      0,
                                                      commercialIndex
                                                    ),
                                                    [
                                                      ...commercialImage[
                                                        commercialIndex
                                                      ],
                                                      ...allImages,
                                                    ],
                                                    ...commercialImage.slice(
                                                      1 + commercialIndex
                                                    ),
                                                  ]);
                                                } else {
                                                  setCommercialImage([
                                                    ...allImages,
                                                  ]);
                                                }
                                              } else {
                                                setCommercialImage([
                                                  ...commercialImage,
                                                ]);
                                              }
                                            }}
                                          />
                                          <label
                                            htmlFor={`property_image${commercialIndex}`}
                                          >
                                            <b style={{ fontSize: "20px" }}>
                                              +
                                            </b>{" "}
                                            Add
                                          </label>
                                        </span>
                                      </FormGroup>
                                      <FormGroup>
                                        <div
                                          className="mt-3 d-flex"
                                          style={{
                                            justifyContent: "center",
                                            flexWrap: "wrap",
                                          }}
                                        >
                                          {commercialImage &&
                                            Array.isArray(
                                              commercialImage[commercialIndex]
                                            ) &&
                                            commercialImage[
                                              commercialIndex
                                            ].map((image, index) => (
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
                                                      commercialIndex,
                                                      image,
                                                      "property_image"
                                                    )
                                                  }
                                                />
                                                {imgLoader &&
                                                  index ===
                                                    commercialImage[
                                                      commercialIndex
                                                    ].length -
                                                      1 && (
                                                    <div className="loader">
                                                      {/* Your loader component goes here */}
                                                    </div>
                                                  )}
                                              </div>
                                            ))}
                                          <OpenImageDialog
                                            open={open}
                                            setOpen={setOpen}
                                            selectedImage={selectedImage}
                                          />
                                        </div>
                                      </FormGroup>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            )
                          )}
                        <Row>
                          <Col>
                            <Button
                              onClick={addCommercialUnit}
                              style={
                                selectedProp.ismultiunit
                                  ? { display: "block" }
                                  : { display: "none" }
                              }
                            >
                              Add another unit
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    </div>
                  )}
                  <br />
                  <br />

                  {id ? (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: "green", cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        editProperty(id);
                      }}
                    >
                      Update Property
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: "green", cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        rentalsFormik.handleSubmit();
                      }}
                    >
                      Create Property
                    </button>
                  )}
                  <button
                    href="#pablo"
                    onClick={handleCloseButtonClick}
                    className="btn btn-primary"
                    style={{
                      background: "white",
                      color: "black",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Rentals;
