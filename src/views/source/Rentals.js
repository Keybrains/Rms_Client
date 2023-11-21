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

const Rentals = () => {
  const [prodropdownOpen, setproDropdownOpen] = React.useState(false);
  const [bankdropdownOpen, setbankDropdownOpen] = React.useState(false);
  const [userdropdownOpen, setuserDropdownOpen] = React.useState(false);
  const [baddropdownOpen, setbadDropdownOpen] = React.useState(false);
  const [bathdropdownOpen, setBathDropdownOpen] = React.useState(false);

  const [isAddBankDialogOpen, setAddBankDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [isRentalDialogOpen, setRentalDialogOpen] = useState(false);
  const [isPhotoresDialogOpen, setPhotoresDialogOpen] = useState(false);

  const [propertyData, setPropertyData] = useState([]);
  const [rentalownerData, setRentalownerData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [StaffMemberData, setStaffMemberData] = useState([]);
  const [selectedProp, setSelectedProp] = useState("Select");
  const [selectedBank, setSelectedBank] = useState("Select");
  const [selectedBad, setSelectedBad] = useState("");
  const [open, setOpen] = React.useState(false);
  // const [uploadedImage, setUploadedImage] = useState(null);
  // const [selectedPhoto, setSelectedPhoto] = useState(null);

  // const [selectedCategory, setSelectedCategory] = useState("");
  // const [selectedSubtype, setSelectedSubtype] = useState("");

  const toggle1 = () => setproDropdownOpen((prevState) => !prevState);
  const toggle2 = () => setbankDropdownOpen((prevState) => !prevState);
  const toggle3 = () => setuserDropdownOpen((prevState) => !prevState);
  const toggle4 = () => setbadDropdownOpen((prevState) => !prevState);
  const toggle5 = () => setBathDropdownOpen((prevState) => !prevState);

  const [openImage, setOpenImage] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [rentalsData, setRentalsData] = useState(null);
  const [selectedRentalOwnerData, setSelectedRentalOwnerData] = useState([]);
  console.log(selectedRentalOwnerData, "selectedRentalOwnerData");
  const [selectedrentalOwners, setSelectedrentalOwners] = useState([]);
  const [showRentalOwnerTable, setshowRentalOwnerTable] = useState(false);
  const [checkedCheckbox, setCheckedCheckbox] = useState();

  const handleChange = () => {
    setshowRentalOwnerTable(!showRentalOwnerTable);
  };
  const [file, setFile] = useState("");

  useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch("http://localhost:4000/api/rentals/rentals")
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setRentalownerData(data.data);
          // console.log("here is my data", data.data);
        } else {
          // Handle error
          // console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  }, []);

  const handleCheckboxChange = (event, rentalOwnerInfo, phoneNumber) => {
    if (checkedCheckbox === phoneNumber) {
      // If the checkbox is already checked, uncheck it
      setCheckedCheckbox(null);
    } else {
      // Otherwise, check the checkbox
      setCheckedCheckbox(phoneNumber);
    }

    // Toggle the selected rentalOwners in the state when their checkboxes are clicked
    if (event.target.checked) {
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
        firstName: rentalsFormik.values.rentalOwner_firstName,
        lastName: rentalsFormik.values.rentalOwner_lastName,
        phoneNumber: rentalsFormik.values.rentalOwner_phoneNumber,
      };
      setSelectedRentalOwnerData(newrentalOwnerDetails);
      if (!id) {
        swal("Success!", "New rentalOwner added successfully", "success");
      }
    } else {
      setSelectedrentalOwners([]);
      const selectedrentalOwner = selectedrentalOwners[0];
      console.log(selectedrentalOwners, "selectedrentalOwners");
      const rentalOwnerParts = selectedrentalOwner.split(" ");
      rentalsFormik.setFieldValue(
        "rentalOwner_firstName",
        rentalOwnerParts[0] || ""
      );
      rentalsFormik.setFieldValue(
        "rentalOwner_lastName",
        rentalOwnerParts[1] || ""
      );
      rentalsFormik.setFieldValue(
        "rentalOwner_companyName",
        rentalOwnerParts[2] || ""
      );
      rentalsFormik.setFieldValue(
        "rentalOwner_primaryEmail",
        rentalOwnerParts[3] || ""
      );
      rentalsFormik.setFieldValue(
        "rentalOwner_phoneNumber",
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
        phoneNumber: rentalOwnerParts[4],
      };
      setSelectedRentalOwnerData(rentalOwnerDetails);
      console.log(rentalOwnerParts);
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
    // const propTypes=[];
    axios
      .get(
        "http://localhost:4000/api/newproparty/propropartytype"
      )
      .then((data) => {
        console.log(data.data, "Data from adding the account");
        // setPropertyData(data.data.data);
        setSelectedProp(propertyType);
        const selectedType = Object.keys(data.data.data).find((item) => {
          return data.data.data[item].some(
            (data) => data.propertysub_type === propertyType
          );
        });
        setPropType(selectedType);
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

  const handleBadSelection = (value) => {
    setSelectedBad(value);
    // setbadDropdownOpen(true);
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

  const handleRentalownerDelete = () => {
    setSelectedRentalOwnerData([]);
    rentalsFormik.setValues({
      rentalOwner_firstName: "",
      rentalOwner_lastName: "",
      rentalOwner_primaryEmail: "",
      rentalOwner_phoneNumber: "",
      rentalOwner_companyName: "",
      rentalOwner_homeNumber: "",
      rentalOwner_businessNumber: "",
    });

    console.log("first");
  };

  const [selectedbath, setSelectedbath] = useState("");
  const handleBathSelect = (bath) => {
    setSelectedbath(bath);
  };

  const [selectedOperatingAccount, setSelectedOperatingAccount] = useState("");
  const handleOperatingAccount = (operatingAccount) => {
    setSelectedOperatingAccount(operatingAccount);
    localStorage.setItem("operatingAccount", operatingAccount);
  };

  let cookies = new Cookies();
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
        "http://localhost:4000/api/register/auth",
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

  // ==================================================================

  // navigate(`/admin/rentals/rental/${id}/entry/${propertyIndex}`);
  const { id, entryIndex } = useParams();
  console.log(entryIndex, "entryIndex");
  const [residentialImage, setResidentialImage] = useState([]);
  const [commercialImage, setCommercialImage] = useState([]);

  const fileData = async (file, name) => {
    //setImgLoader(true);
    const allData = [];
    const axiosRequests = [];

    for (let i = 0; i < file.length; i++) {
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
            //setImgLoader(false);
            const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
            console.log(imagePath, "imagePath");
            allData.push(imagePath);
          })
          .catch((err) => {
            //setImgLoader(false);
            console.log("Error uploading image:", err);
          })
      );
    }

    // Wait for all Axios requests to complete before logging the data
    await Promise.all(axiosRequests);
    if (name === "propertyres_image") {
      setResidentialImage([...residentialImage, ...allData]);
    } else {
      setCommercialImage([...commercialImage, ...allData]);
    }
    // console.log(allData, "allData");
    console.log(residentialImage, "residentialImage");
    console.log(commercialImage, "commercialImage");
  };

  // const fileData = async (file, name) => {
  //   const allData = [];
  //   const axiosRequests = [];

  //   for (let i = 0; i < file.length; i++) {
  //     const dataArray = new FormData();
  //     dataArray.append('file', file[i]);

  //     // Update the URL to point to your Express API
  //     let url = 'http://localhost:4000/api/uploadfile';

  //     axiosRequests.push(
  //       axios
  //         .post(url, dataArray, {
  //           headers: {
  //             'Content-Type': 'multipart/form-data',
  //           },
  //         })
  //         .then((res) => {
  //           console.log('Response Object:', res);
  //           const imagePath = res.data.filePath;
  //           console.log('Image Path:', imagePath);

  //           // Add the image path to your frontend state
  //           allData.push(imagePath);
  //         })
  //         .catch((err) => {
  //           console.log('Error uploading image:', err);
  //         })
  //     );
  //   }

  //   await Promise.all(axiosRequests);

  //   if (name === 'propertyres_image') {
  //     setResidentialImage([...residentialImage, ...allData]);
  //   } else {
  //     setCommercialImage([...commercialImage, ...allData]);
  //   }
  //   console.log(residentialImage, 'residentialImage');
  //   console.log(commercialImage, 'commercialImage');
  // };

  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    // Use history.push to navigate to the PropertiesTable page
    navigate("../propertiesTable");
  };

  // const handleSubmit = async (values) => {
  //   console.log(values, "values");
  //   try {
  //     values["property_type"] = selectedProp;
  //     values['rental_bath'] = selectedbath;
  //     values['rental_bed'] = selectedBad;
  //     values['rentalOwner_operatingAccount']=selectedBank;
  //     values["property_image"] = image;
  //     values["propertyres_image"] = image;
  //     values['staffMember'] =  selectedUser;

  //     const res = await axios.post(
  //       "http://localhost:4000/api/rentals/rentals",
  //       values
  //     );

  //     if (res.data.statusCode === 200) {
  //       navigate("/admin/propertiesTable");
  //       swal("Success!","Property Added Successfully","success");
  //     } else {
  //       alert(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const clearSelectedPhoto = (image, name) => {
    // const selectedPhotoPreview = document.getElementById(
    //   "selectedPhotoPreview"
    // );

    // selectedPhotoPreview.src = "";

    // const fileInput = document.getElementById("fileInput");
    // if (fileInput) {
    //   fileInput.value = "";
    // }
    if (name === "propertyres_image") {
      const filteredImage = residentialImage.filter((item) => {
        return item !== image;
      });
      setResidentialImage(filteredImage);
    } else {
      const filteredImage = commercialImage.filter((item) => {
        return item !== image;
      });
      setCommercialImage(filteredImage);
    }
  };

  const clearSelectedPhotores = () => {
    const selectedPhotoresPreview1 = document.getElementById(
      "selectedPhotoPreview1"
    );

    selectedPhotoresPreview1.src = "";
    const fileInput = document.getElementById("fileInput");
    //console.log(selectedPhotoresPreview1, "this is fileinput")

    if (fileInput) {
      fileInput.value = "";
    }
  };

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
          rental_adress: "",
          rental_city: "",
          rental_country: "",
          rental_postcode: "",
          rentalOwner_operatingAccount: "",
          rentalOwner_propertyReserve: "",
          staffMember: "",
          //rooms
          //RESIDENTIAL
          rental_bed: "",
          rental_bath: "",
          propertyres_image: [],

          rental_soft: "",
          rental_units: "",
          rental_unitsAdress: "",

          //COMMERCIAL
          rentalcom_soft: "",
          rentalcom_units: "",
          rentalcom_unitsAdress: "",
          property_image: [],
        },
      ],
    },
    validationSchema: yup.object({
      rental_adress: yup.string().required("Required"),
      //rental_units: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      console.log(values, "rentals formik finmmal values");
    },
  });

  useEffect(() => {
    const selectedPhotoresPreview = document.getElementById(
      "selectedPhotoresPreview"
    );
    // Make an HTTP GET request to your Express API endpoint
    fetch(
      "http://localhost:4000/api/newproparty/propropartytype"
    )
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
    fetch(
      "http://localhost:4000/api/addstaffmember/find_staffmember"
    )
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

  useEffect(() => {
    console.log(id, entryIndex, "id && entry Id");
    if (id && entryIndex) {
      axios
        .get(
          `http://localhost:4000/api/rentals/rentals_summary/${id}`
        )
        .then((response) => {
          const propertysData = response.data.data;
          // setRentalsData(rentalsData); // Update state with the fetched data
          console.log(propertysData, "properety data");
          setRentalownerData(propertysData);
          // setRentalownerData(propertysData);

          setSelectedRentalOwnerData({
            firstName: propertysData.rentalOwner_firstName || "",
            lastName: propertysData.rentalOwner_lastName || "",
            phoneNumber: propertysData.rentalOwner_phoneNumber || "",
            // Add other fields you want to display in the table
          });
          const matchedProperty = propertysData.entries.find((entry) => {
            return entry.entryIndex === entryIndex;
          });
          console.log(matchedProperty, "matchedPropeort");
          // setshowRentalOwnerTable(true);
          // setRentalownerData(propertysData);

          handlePropSelection(matchedProperty.property_type);
          setSelectedProp(matchedProperty.property_type || "Select");
          setSelectedbath(matchedProperty.rental_bath || "Select");
          setSelectedBad(matchedProperty.rental_bed || "Select");
          setSelectedBank(
            matchedProperty.rentalOwner_operatingAccount || "Select"
          );
          setCommercialImage(matchedProperty.property_image || "");
          setResidentialImage(matchedProperty.propertyres_image || "");
          setSelectedUser(matchedProperty.staffMember || "Select");
          rentalsFormik.setValues({
            rental_adress: matchedProperty.rental_adress || "",
            rental_city: matchedProperty.rental_city || "",
            rental_country: matchedProperty.rental_country || "",
            rental_postcode: matchedProperty.rental_postcode || "",
            rentalOwner_firstName:
              propertysData.rentalOwner_firstName || "hello",
            rentalOwner_lastName: propertysData.rentalOwner_lastName || "",
            rentalOwner_companyName:
              propertysData.rentalOwner_companyName || "",
            rentalOwner_primaryEmail:
              propertysData.rentalOwner_primaryEmail || "",
            rentalOwner_phoneNumber:
              propertysData.rentalOwner_phoneNumber || "",
            rentalOwner_homeNumber: propertysData.rentalOwner_homeNumber || "",
            rentalOwner_businessNumber:
              propertysData.rentalOwner_businessNumber || "",
            rentalOwner_propertyReserve:
              propertysData.rentalOwner_propertyReserve || "",
            rental_soft: matchedProperty.rental_soft || "",
            rental_units: matchedProperty.rental_units || "",
            rental_unitsAdress: matchedProperty.rental_unitsAdress || "",
            rentalcom_soft: matchedProperty.rentalcom_soft || "",
            rentalcom_units: matchedProperty.rentalcom_units || "",
            rentalcom_unitsAdress: matchedProperty.rentalcom_unitsAdress || "",
            property_image: matchedProperty.property_image || "",
            propertyres_image: matchedProperty.propertyres_image || "",
          });

          // Now, after setting all the fields and state, call handleAddrentalOwner
        })
        .catch((error) => {
          console.error("Error fetching rentals data:", error);
        });
      handleAddrentalOwner();
    }
  }, [id, entryIndex]);
  console.log(residentialImage, "residentialImage");

  const handleSubmit = async (values) => {
    console.log(residentialImage, "residentialImage after submit");
    console.log(commercialImage, "commercialImage after submit");
    console.log(file, "values");

    const entriesArray = [];

    const entriesObject = {
      property_type: selectedProp,
      rental_adress: values.rental_adress,
      rental_city: values.rental_city,
      rental_country: values.rental_country,
      rental_postcode: values.rental_postcode,

      rentalOwner_operatingAccount: values.rentalOwner_operatingAccount,
      rentalOwner_propertyReserve: values.rentalOwner_propertyReserve,
      staffMember: selectedUser,
      //rooms
      //RESIDENTIAL
      rental_bed: selectedBad,
      rental_bath: selectedBad,
      propertyres_image: commercialImage,

      rental_soft: values.rental_soft,
      rental_units: values.rental_units,
      rental_unitsAdress: values.rental_unitsAdress,

      //COMMERCIAL
      rentalcom_soft: values.rentalcom_soft,
      rentalcom_units: values.rentalcom_units,
      rentalcom_unitsAdress: values.rentalcom_unitsAdress,
      property_image: residentialImage,
    };

    entriesArray.push(entriesObject);

    const leaseObject = {
      //   Add Rental owner
      rentalOwner_firstName: values.rentalOwner_firstName,
      rentalOwner_lastName: values.rentalOwner_lastName,
      rentalOwner_companyName: values.rentalOwner_companyName,
      rentalOwner_primaryEmail: values.rentalOwner_primaryEmail,
      rentalOwner_phoneNumber: values.rentalOwner_phoneNumber,
      rentalOwner_homeNumber: values.rentalOwner_homeNumber,
      rentalOwner_businessNumber: values.rentalOwner_businessNumber,
      entries: entriesArray,
    };
    try {
      const res = await axios.get(
        "http://localhost:4000/api/rentals/rentals"
      );
      if (res.data.statusCode === 200) {
        console.log(res.data.data, "allRentalOwner");

        const allRentalOwner = res.data.data;
        const filteredData = allRentalOwner.find((item) => {
          return (
            item.rentalOwner_firstName ===
              rentalsFormik.values.rentalOwner_firstName &&
            item.rentalOwner_lastName ===
              rentalsFormik.values.rentalOwner_lastName &&
            item.rentalOwner_primaryEmail ===
              rentalsFormik.values.rentalOwner_primaryEmail
          );
        });

        if (filteredData) {
          const putObject = {
            entries: leaseObject.entries,
          };
          const rentalOwnerId = filteredData._id;
          console.log(rentalOwnerId, "rentalOwnerId");
          console.log(putObject, "putObject");
          axios
            .put(
              `http://localhost:4000/api/rentals/rental/${rentalOwnerId}`,
              putObject
            )
            .then((res) => {
              console.log(res, "res");
              swal("Success!", "Property Added Successfully", "success");
              navigate("/admin/propertiestable");
            })
            .catch((err) => {
              console.log(err, "err");
            });
        } else {
          if (id === undefined) {
            console.log(leaseObject, "leaseObject");
            const res = await axios.post(
              "http://localhost:4000/api/rentals/rentals",
              leaseObject
            );
            if (res.data.statusCode === 200) {
              swal("Success!", "Property Added Successfully", "success");
              navigate("/admin/RentalownerTable");
            } else {
              swal("", res.data.message, "error");
            }
            handleResponse(res);
          } else {
          }
        }
      } else {
        swal("", res.data.message, "error");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
    // try {
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
    //       "http://localhost:4000/api/rentals/rentals",
    //       values
    //     );
    //     handleResponse(res);
    //   } else {
    //     const editUrl = `http://localhost:4000/api/rentals/rentals/${id}`;
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
    const editUrl = `http://localhost:4000/api/rentals/rental/${id}/entry/${entryIndex}`;
    const entriesArray = [];

    const entriesObject = {
      property_type: selectedProp,
      rental_adress: rentalsFormik.values.rental_adress,
      rental_city: rentalsFormik.values.rental_city,
      rental_country: rentalsFormik.values.rental_country,
      rental_postcode: rentalsFormik.values.rental_postcode,

      rentalOwner_operatingAccount:
        rentalsFormik.values.rentalOwner_operatingAccount,
      rentalOwner_propertyReserve:
        rentalsFormik.values.rentalOwner_propertyReserve,
      staffMember: selectedUser,
      //rooms
      //RESIDENTIAL
      rental_bed: selectedBad,
      rental_bath: selectedBad,
      propertyres_image: commercialImage,

      rental_soft: rentalsFormik.values.rental_soft,
      rental_units: rentalsFormik.values.rental_units,
      rental_unitsAdress: rentalsFormik.values.rental_unitsAdress,

      //COMMERCIAL
      rentalcom_soft: rentalsFormik.values.rentalcom_soft,
      rentalcom_units: rentalsFormik.values.rentalcom_units,
      rentalcom_unitsAdress: rentalsFormik.values.rentalcom_unitsAdress,
      property_image: residentialImage,
    };
    entriesArray.push(entriesObject);

    const leaseObject = {
      //   Add Rental owner
      rentalOwner_firstName: rentalsFormik.values.rentalOwner_firstName,
      rentalOwner_lastName: rentalsFormik.values.rentalOwner_lastName,
      rentalOwner_companyName: rentalsFormik.values.rentalOwner_companyName,
      rentalOwner_primaryEmail: rentalsFormik.values.rentalOwner_primaryEmail,
      rentalOwner_phoneNumber: rentalsFormik.values.rentalOwner_phoneNumber,
      rentalOwner_homeNumber: rentalsFormik.values.rentalOwner_homeNumber,
      rentalOwner_businessNumber:
        rentalsFormik.values.rentalOwner_businessNumber,
      entries: entriesArray,
    };

    console.log(leaseObject, "updated values");
    await axios
      .put(editUrl, leaseObject)
      .then((response) => {
        console.log(response, "response1111");
        handleResponse(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  function handleResponse(response) {
    console.log(response, "response");
    if (response.status === 200) {
      navigate("/admin/propertiesTable");
      swal(
        "Success!",
        id ? "property updated successfully" : "property added successfully!",
        "success"
      );
    } else {
      alert(response.data.message);
    }
  }

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
                          <Dropdown isOpen={prodropdownOpen} toggle={toggle1}>
                            <DropdownToggle caret>
                              {selectedProp
                                ? selectedProp
                                : "Select Property Type"}
                            </DropdownToggle>
                            {console.log(propertyData, "property data")}
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
                                      onClick={() =>
                                        handlePropSelection(
                                          subtype.propertysub_type
                                        )
                                      }
                                    >
                                      {subtype.propertysub_type}
                                    </DropdownItem>
                                  ))}
                                </React.Fragment>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
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
                              className="form-control-alternative"
                              id="input-address"
                              placeholder="Address"
                              type="text"
                              name="rental_adress"
                              onBlur={rentalsFormik.handleBlur}
                              onChange={rentalsFormik.handleChange}
                              value={rentalsFormik.values.rental_adress}
                            />
                            {rentalsFormik.touched.rental_adress &&
                            rentalsFormik.errors.rental_adress ? (
                              <div style={{ color: "red" }}>
                                {rentalsFormik.errors.rental_adress}
                              </div>
                            ) : null}
                          </FormGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            City
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-city"
                            placeholder="New York"
                            type="text"
                            name="rental_city"
                            onBlur={rentalsFormik.handleBlur}
                            onChange={rentalsFormik.handleChange}
                            value={rentalsFormik.values.rental_city}
                          />
                          {rentalsFormik.touched.rental_city &&
                          rentalsFormik.errors.rental_city ? (
                            <div style={{ color: "red" }}>
                              {rentalsFormik.errors.rental_city}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Country
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-country"
                            placeholder="United States"
                            type="text"
                            name="rental_country"
                            onBlur={rentalsFormik.handleBlur}
                            onChange={rentalsFormik.handleChange}
                            value={rentalsFormik.values.rental_country}
                          />
                          {rentalsFormik.touched.rental_country &&
                          rentalsFormik.errors.rental_country ? (
                            <div style={{ color: "red" }}>
                              {rentalsFormik.errors.rental_country}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Postal code
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-postal-code"
                            placeholder="Postal code"
                            type="text"
                            name="rental_postcode"
                            onBlur={rentalsFormik.handleBlur}
                            onChange={rentalsFormik.handleChange}
                            value={rentalsFormik.values.rental_postcode}
                            onInput={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(
                                /\D/g,
                                ""
                              ); // Remove non-numeric characters
                              e.target.value = numericValue;
                            }}
                          />
                          {rentalsFormik.touched.rental_postcode &&
                          rentalsFormik.errors.rental_postcode ? (
                            <div style={{ color: "red" }}>
                              {rentalsFormik.errors.rental_postcode}
                            </div>
                          ) : null}
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
                                <div className="RentalOwnerTable">
                                  <table
                                    style={{
                                      width: "100%",
                                      borderCollapse: "collapse",
                                      border: "1px solid #ddd",
                                    }}
                                  >
                                    <thead>
                                      <tr>
                                        <th>RentalOwner Name</th>
                                        <th>Select</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Array.isArray(rentalownerData) &&
                                        rentalownerData?.map(
                                          (rentalOwner, index) => (
                                            <tr
                                              key={index}
                                              style={{
                                                border: "1px solid #ddd",
                                              }}
                                            >
                                              {console.log(
                                                rentalOwner,
                                                "revsefw"
                                              )}
                                              <td>
                                                {
                                                  rentalOwner.rentalOwner_firstName
                                                }
                                                &nbsp;
                                                {
                                                  rentalOwner.rentalOwner_lastName
                                                }
                                              </td>
                                              <td>
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
                                                    const rentalOwnerInfo = `${
                                                      rentalOwner.rentalOwner_firstName ||
                                                      ""
                                                    } ${
                                                      rentalOwner.rentalOwner_lastName ||
                                                      ""
                                                    } ${
                                                      rentalOwner.rentalOwner_companyName ||
                                                      ""
                                                    } ${
                                                      rentalOwner.rentalOwner_primaryEmail ||
                                                      ""
                                                    } ${
                                                      rentalOwner.rentalOwner_phoneNumber ||
                                                      ""
                                                    } ${
                                                      rentalOwner.rentalOwner_homeNumber ||
                                                      ""
                                                    } ${
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
                                          )
                                        )}
                                    </tbody>
                                  </table>
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
                                      id="standard-multiline-static"
                                      className="popinput"
                                      type="text"
                                      placeholder="First Name"
                                      style={{ marginRight: "10px", flex: 1 }}
                                      name="rentalOwner_firstName"
                                      onBlur={rentalsFormik.handleBlur}
                                      onChange={rentalsFormik.handleChange}
                                      value={
                                        rentalsFormik.values
                                          .rentalOwner_firstName
                                      }
                                    />

                                    {rentalsFormik.touched
                                      .rentalOwner_firstName &&
                                    rentalsFormik.errors
                                      .rentalOwner_firstName ? (
                                      <div style={{ color: "red" }}>
                                        {
                                          rentalsFormik.errors
                                            .rentalOwner_firstName
                                        }
                                      </div>
                                    ) : null}
                                    <br />
                                    <Input
                                      id="standard-multiline-static"
                                      className="popinput"
                                      type="text"
                                      placeholder="Last Name"
                                      style={{ flex: 1 }}
                                      name="rentalOwner_lastName"
                                      onBlur={rentalsFormik.handleBlur}
                                      onChange={rentalsFormik.handleChange}
                                      value={
                                        rentalsFormik.values
                                          .rentalOwner_lastName
                                      }
                                    />

                                    {rentalsFormik.touched
                                      .rentalOwner_lastName &&
                                    rentalsFormik.errors
                                      .rentalOwner_lastName ? (
                                      <div style={{ color: "red" }}>
                                        {
                                          rentalsFormik.errors
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
                                      id="standard-multiline-static"
                                      className="popinput"
                                      type="text"
                                      placeholder="L & T Company"
                                      style={{ marginRight: "10px", flex: 1 }}
                                      name="rentalOwner_companyName"
                                      onBlur={rentalsFormik.handleBlur}
                                      onChange={rentalsFormik.handleChange}
                                      value={
                                        rentalsFormik.values
                                          .rentalOwner_companyName
                                      }
                                    />

                                    {rentalsFormik.touched
                                      .rentalOwner_companyName &&
                                    rentalsFormik.errors
                                      .rentalOwner_companyName ? (
                                      <div style={{ color: "red" }}>
                                        {
                                          rentalsFormik.errors
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
                                        id="standard-multiline-static"
                                        className="popinput"
                                        type="text"
                                        name="rentalOwner_primaryEmail"
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={rentalsFormik.handleChange}
                                        value={
                                          rentalsFormik.values
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

                                    {rentalsFormik.touched
                                      .rentalOwner_primaryEmail &&
                                    rentalsFormik.errors
                                      .rentalOwner_primaryEmail ? (
                                      <div style={{ color: "red" }}>
                                        {
                                          rentalsFormik.errors
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
                                        id="standard-multiline-static"
                                        className="popinput"
                                        type="text"
                                        name="rentalOwner_phoneNumber"
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={rentalsFormik.handleChange}
                                        value={
                                          rentalsFormik.values
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

                                    {rentalsFormik.touched
                                      .rentalOwner_phoneNumber &&
                                    rentalsFormik.errors
                                      .rentalOwner_phoneNumber ? (
                                      <div style={{ color: "red" }}>
                                        {
                                          rentalsFormik.errors
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
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={rentalsFormik.handleChange}
                                        value={
                                          rentalsFormik.values
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

                                    {rentalsFormik.touched
                                      .rentalOwner_homeNumber &&
                                    rentalsFormik.errors
                                      .rentalOwner_homeNumber ? (
                                      <div style={{ color: "red" }}>
                                        {
                                          rentalsFormik.errors
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
                                        onBlur={rentalsFormik.handleBlur}
                                        onChange={rentalsFormik.handleChange}
                                        value={
                                          rentalsFormik.values
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

                                    {rentalsFormik.touched
                                      .rentalOwner_businessNumber &&
                                    rentalsFormik.errors
                                      .rentalOwner_businessNumber ? (
                                      <div style={{ color: "red" }}>
                                        {
                                          rentalsFormik.errors
                                            .rentalOwner_businessNumber
                                        }
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                            <DialogActions>
                              <Button
                                type="submit"
                                onClick={() => {
                                  setshowRentalOwnerTable(false);
                                  handleAddrentalOwner();
                                  handleClose();
                                }}
                                color="primary"
                              >
                                Add
                              </Button>
                              <Button onClick={handleClose}>Cancel</Button>
                            </DialogActions>
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
                        <Row>
                          <Col lg="2">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-city"
                              >
                                Units *
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-unit"
                                placeholder="102"
                                type="text"
                                name="rental_units"
                                onBlur={rentalsFormik.handleBlur}
                                onChange={rentalsFormik.handleChange}
                                value={rentalsFormik.values.rental_units}
                                onInput={(e) => {
                                  const inputValue = e.target.value;
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ""
                                  ); // Remove non-numeric characters
                                  e.target.value = numericValue;
                                }}
                              />
                              {rentalsFormik.touched.rental_units &&
                              rentalsFormik.errors.rental_units ? (
                                <div style={{ color: "red" }}>
                                  {rentalsFormik.errors.rental_units}
                                </div>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-unitadd"
                              >
                                Unit Address *
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-unitadd"
                                placeholder="A12 Bhaskar Enclave, Phase 2 - 102"
                                type="text"
                                name="rental_unitsAdress"
                                onBlur={rentalsFormik.handleBlur}
                                onChange={rentalsFormik.handleChange}
                                value={rentalsFormik.values.rental_unitsAdress}
                              />
                              {rentalsFormik.touched.rental_unitsAdress &&
                              rentalsFormik.errors.rental_unitsAdress ? (
                                <div style={{ color: "red" }}>
                                  {rentalsFormik.errors.rental_unitsAdress}
                                </div>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col lg="4.5">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-country"
                              >
                                Rooms
                              </label>
                              <br />
                              <div style={{ display: "flex" }}>
                                <Dropdown
                                  isOpen={baddropdownOpen}
                                  toggle={toggle4}
                                >
                                  <DropdownToggle
                                    caret
                                    style={{ width: "100%" }}
                                  >
                                    {selectedBad
                                      ? selectedBad
                                      : setSelectedBad("5 Bed")}{" "}
                                    &nbsp;&nbsp;
                                  </DropdownToggle>
                                  <DropdownMenu style={{ width: "200px" }}>
                                    <DropdownItem
                                      onClick={() =>
                                        handleBadSelection("2 Bed")
                                      }
                                    >
                                      2 Bed
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() =>
                                        handleBadSelection("3 Bed")
                                      }
                                    >
                                      3 Bed
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() =>
                                        handleBadSelection("4 Bed")
                                      }
                                    >
                                      4 Bed
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() =>
                                        handleBadSelection("5 Bed")
                                      }
                                    >
                                      5 Bed
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() =>
                                        handleBadSelection("6 Bed")
                                      }
                                    >
                                      6 Bed
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() =>
                                        handleBadSelection("7 Bed")
                                      }
                                    >
                                      7 Bed
                                    </DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
                                &nbsp;
                                <Dropdown
                                  isOpen={bathdropdownOpen}
                                  toggle={toggle5}
                                >
                                  <DropdownToggle
                                    caret
                                    style={{ width: "100%" }}
                                  >
                                    {selectedbath
                                      ? selectedbath
                                      : setSelectedbath("5 Bath")}{" "}
                                    &nbsp;&nbsp;
                                  </DropdownToggle>
                                  <DropdownMenu style={{ width: "200px" }}>
                                    <DropdownItem
                                      onClick={() => handleBathSelect("2 Bath")}
                                    >
                                      2 Bath
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => handleBathSelect("3 Bath")}
                                    >
                                      3 Bath
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => handleBathSelect("4 Bath")}
                                    >
                                      4 Bath
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => handleBathSelect("5 Bath")}
                                    >
                                      5 Bath
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => handleBathSelect("6 Bath")}
                                    >
                                      6 Bath
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => handleBathSelect("7 Bath")}
                                    >
                                      7 Bath
                                    </DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
                              </div>
                              &nbsp;&nbsp;
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
                                className="form-control-alternative"
                                id="input-unitadd"
                                placeholder="3000"
                                type="text"
                                name="rental_soft"
                                onBlur={rentalsFormik.handleBlur}
                                onChange={rentalsFormik.handleChange}
                                value={rentalsFormik.values.rental_soft}
                                onInput={(e) => {
                                  const inputValue = e.target.value;
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ""
                                  ); // Remove non-numeric characters
                                  e.target.value = numericValue;
                                }}
                              />
                              {rentalsFormik.touched.rental_soft &&
                              rentalsFormik.errors.rental_soft ? (
                                <div style={{ color: "red" }}>
                                  {rentalsFormik.errors.rental_soft}
                                </div>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col lg="2">
                            <FormGroup>
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
                                  id="propertyres_image"
                                  name="propertyres_image"
                                  onChange={(e) => {
                                    const file = [...e.target.files];
                                    fileData(file, "propertyres_image");

                                    if (file.length > 0) {
                                      const allImages = file.map((file) => {
                                        return URL.createObjectURL(file);
                                      });
                                      setResidentialImage([
                                        ...residentialImage,
                                        ...allImages,
                                      ]);
                                    } else {
                                      // selectedPhotoPreview1.src = "";
                                      // rentalsFormik.setFieldValue(
                                      //   "propertyres_image",""
                                      setResidentialImage([
                                        ...residentialImage,
                                      ]);
                                      // )
                                    }
                                  }}
                                />
                                <label htmlFor="propertyres_image">
                                  <b style={{ fontSize: "20px" }}>+</b> Add
                                </label>
                                {/* <b style={{ fontSize: "20px" }}>+</b> Add */}
                              </span>
                            </FormGroup>
                            {/* <FormGroup>
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
                          > <br/>
                            <b style={{ fontSize: "20px" }}>+</b> Add 
                            
                          </span>
                          {rentalsFormik.values.propertyres_image && (
                            <span
                              onClick={clearSelectedPhotores}
                              style={{
                                cursor: "pointer",
                                fontSize: "15px",
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                color: "black",
                              }}
                            >
                              <ClearIcon />
                            </span>
                          )}

                          <div className="mt-3">
                          {selectedPhoto && (
                            <img
                              id="selectedPhotoresPreview"
                              src={selectedPhoto}
                              alt=""
                              style={{ maxWidth: "150px", maxHeight: "150px" }}
                            />
                          )}
                          </div>
                          <Dialog open={isPhotoresDialogOpen} onClose={handlePhotoCloseDialog}>
                            <DialogTitle style={{ background: "#F0F8FF" }}>
                              Add Photo
                            </DialogTitle>
                            <DialogContent
                              style={{ width: "100%", maxWidth: "500px" }}
                            >
                              <div
                                className="formInput"
                                style={{ margin: "5rem 5rem" ,size:'100%'}}
                              >
                                
                                
                                <br />
                                <div className="mb-3 mt-3">
                                  <label className="d-block">Select Image</label>
                                  <input
                                  type="file"
                                  className="form-control-file d-block"
                                  accept="image/*"
                                  name="propertyres_image"
                                  // onChange={handleFileInputChange}

                                  onChange={(e) => {
                                    const file = e.target.files[0];

                                    // Update property_image field in Formik
                                    rentalsFormik.setFieldValue("propertyres_image", file);

                                    // Update the selected photo preview
                                    const selectedPhotoPreview1 = document.getElementById("selectedPhotoPreview1");
                                    if (file) {
                                      const imageUrl = URL.createObjectURL(file);
                                      selectedPhotoPreview1.src = imageUrl;
                                    } else {
                                      selectedPhotoPreview1.src = "";
                                    }
                                  }}
                                />
                                </div>
                                
                              </div>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handlePhotoCloseDialog}>Cancel</Button>
                              <Button onClick={handlePhotoCloseDialog} color="primary">Add</Button>
                            </DialogActions>
                          </Dialog>
                          </FormGroup> */}
                          </Col>

                          <div
                            className="mt-3 d-flex"
                            style={{
                              justifyContent: "center",
                              flexWrap: "wrap", // Allow images to wrap to the next row
                            }}
                          >
                            {residentialImage &&
                              residentialImage.length > 0 &&
                              residentialImage.map((residentialImage) => (
                                <div
                                  key={residentialImage}
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
                                    src={residentialImage}
                                    alt=""
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      maxHeight: "100%",
                                      maxWidth: "100%",
                                      borderRadius: "10px",
                                      // objectFit: "cover",
                                    }}
                                    onClick={() => {
                                      setSelectedImage(residentialImage);
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
                                        residentialImage,
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
                        </Row>
                      </FormGroup>
                    </div>
                  )}
                  {console.log(propType, "propType")}
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
                        <Row>
                          <Col lg="2">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-city"
                              >
                                Units *
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-unit"
                                placeholder="102"
                                type="number"
                                name="rentalcom_units"
                                onBlur={rentalsFormik.handleBlur}
                                onChange={rentalsFormik.handleChange}
                                value={rentalsFormik.values.rentalcom_units}
                              />
                              {rentalsFormik.touched.rentalcom_units &&
                              rentalsFormik.errors.rentalcom_units ? (
                                <div style={{ color: "red" }}>
                                  {rentalsFormik.errors.rentalcom_units}
                                </div>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-unitadd"
                              >
                                Unit Address *
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-unitadd"
                                placeholder="A12 Bhaskar Enclave, Phase 2 - 102"
                                type="text"
                                name="rentalcom_unitsAdress"
                                onBlur={rentalsFormik.handleBlur}
                                onChange={rentalsFormik.handleChange}
                                value={
                                  rentalsFormik.values.rentalcom_unitsAdress
                                }
                              />
                              {rentalsFormik.touched.rentalcom_unitsAdress &&
                              rentalsFormik.errors.rentalcom_unitsAdress ? (
                                <div style={{ color: "red" }}>
                                  {rentalsFormik.errors.rentalcom_unitsAdress}
                                </div>
                              ) : null}
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
                                className="form-control-alternative"
                                id="input-unitadd"
                                placeholder="3000"
                                type="number"
                                name="rentalcom_soft"
                                onBlur={rentalsFormik.handleBlur}
                                onChange={rentalsFormik.handleChange}
                                value={rentalsFormik.values.rentalcom_soft}
                              />
                              {rentalsFormik.touched.rentalcom_soft &&
                              rentalsFormik.errors.rentalcom_soft ? (
                                <div style={{ color: "red" }}>
                                  {rentalsFormik.errors.rentalcom_soft}
                                </div>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col lg="4"></Col>
                          <Col lg="2">
                            <FormGroup>
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
                                  name="property_image"
                                  multiple
                                  id="property_image"
                                  onChange={(e) => {
                                    const file = [...e.target.files];
                                    fileData(file, "property_image");

                                    if (file) {
                                      const allImages = file.map((file) => {
                                        return URL.createObjectURL(file);
                                      });

                                      setCommercialImage([
                                        ...commercialImage,
                                        ...allImages,
                                      ]);
                                    } else {
                                      setCommercialImage([...commercialImage]);
                                    }
                                  }}
                                />
                                <label htmlFor="property_image">
                                  <b style={{ fontSize: "20px" }}>+</b> Add
                                </label>
                              </span>
                            </FormGroup>
                          </Col>

                          <div
                            className="mt-3 d-flex"
                            style={{
                              justifyContent: "center",
                              flexWrap: "wrap", // Allow images to wrap to the next row
                            }}
                          >
                            {commercialImage &&
                              commercialImage.length > 0 &&
                              commercialImage.map((commercialImage) => (
                                <div
                                  key={commercialImage}
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
                                    src={commercialImage}
                                    alt=""
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      maxHeight: "100%",
                                      maxWidth: "100%",
                                      borderRadius: "10px",

                                      // objectFit: "cover",
                                    }}
                                    onClick={() => {
                                      setSelectedImage(commercialImage);
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
                                        commercialImage,
                                        "property_image"
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
