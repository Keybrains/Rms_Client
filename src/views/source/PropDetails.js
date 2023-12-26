import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "components/Headers/Header";
import fone from "../../assets/img/icons/common/property_bg.png";
import {
  Card,
  CardHeader,
  FormGroup,
  Container,
  Row,
  Col,
  Table,
  Button,
  Input,
  Form,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardBody,
} from "reactstrap";
import { CardContent } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
// import * as React from 'react';
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CloseIcon from "@mui/icons-material/Close";

import Cookies from "universal-cookie";
// import { Grid, Modal } from "@mui/material";
import { BedSharp, Clear, Image } from "@mui/icons-material";
import { OpenImageDialog } from "components/OpenImageDialog";
import { useFormik } from "formik";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { Grid, Paper, TextField, Typography } from "@mui/material";
import { getUnit } from "@mui/material/styles/cssUtils";
import swal from "sweetalert";
import { Modal } from "react-bootstrap";
import { RotatingLines } from "react-loader-spinner";
// import "bootstrap/dist/css/bootstrap.min.css";
// import CardActions from "../../../../../rms-y/Rms_client/images";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const PropDetails = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id, entryIndex } = useParams();
  const [propertyDetails, setpropertyDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let navigate = useNavigate();
  const [matchedProperty, setMatchedProperty] = useState({});
  // const [propertyId, setPropertyId] = useState(null);
  const [propertyUnit, setPropertyUnit] = useState([]);
  const [editUnitDialogOpen, setEditUnitDialogOpen] = useState(false);
  const [editListingData, setEditListingData] = useState(false);
  const [RentAdd, setRentAdd] = useState({});
  const [propType, setPropType] = useState("");
  const [selectedProp, setSelectedProp] = useState("");
  const [balance, setBalance] = useState("");

  const [multiUnit, setMultiUnit] = useState(null);
  const [isPhotoresDialogOpen, setPhotoresDialogOpen] = useState(false);
  const [unitImage, setUnitImage] = useState([]);

  const togglePhotoresDialog = () => {
    setPhotoresDialogOpen((prevState) => !prevState);
  };
  console.log(propType, 'proeptype')
  const fileData = async (file, name, index) => {
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
      // rentalsFormik.setFieldValue(
      //   `entries[0].residential[${index}].propertyres_image`,
      //   ...rentalsFormik.values.entries[0].residential[index].propertyres_image,
      //   allData
      // );
      if (unitImage[index]) {
        setUnitImage([
          ...unitImage.slice(0, index),
          [...unitImage[index], ...allData],
          ...unitImage.slice(index + 1),
        ]);

        addUnitFormik.setFieldValue(
          "propertyres_image", [
          ...unitImage.slice(0, index),
          [...unitImage[index], ...allData],
          ...unitImage.slice(index + 1),
        ]
        )

      } else {
        setUnitImage([...allData]);
        // if(propType === "Residential"){
        addUnitFormik.setFieldValue(
          "propertyres_image", [...allData]
        )
        // }
      }
    } else {
      // rentalsFormik.setFieldValue(
      //   `entries[0].commercial[${index}].property_image`,
      //   ...rentalsFormik.values.entries[0].commercial[index].property_image,
      //   allData
      // );
      // if (commercialImage[index]) {
      //   setCommercialImage([
      //     ...commercialImage.slice(0, index),
      //     [...commercialImage[index], ...allData],
      //     ...commercialImage.slice(index + 1),
      //   ]);
      // } else {
      //   setCommercialImage([...allData]);
      // }
    }
    // console.log(allData, "allData");
    // console.log(unitImage, "unitImage");
    // console.log(commercialImage, "commercialImage");
  };

  console.log(propType, "proeptype");
  const clearSelectedPhoto = (index, image, name) => {
    if (name === "propertyres_image") {
      const filteredImage = unitImage.filter((item) => {
        return item.name !== image.name;
      });

      setUnitImage([
        ...unitImage.slice(0, index),
        ...filteredImage,
        ...unitImage.slice(index + 1),
      ]);


      // }

    }
    //  else {
    //   // const filteredImage = commercialImage[index].filter((item) => {
    //     // return item !== image;
    //   });
    // console.log(filteredImage, "filteredImage");
    // setCommercialImage(filteredImage);
    // setCommercialImage([
    //   ...commercialImage.slice(0, index),
    //   [...filteredImage],
    //   ...commercialImage.slice(index + 1),
    // ]);
  };

  const getRentalsData = async (propertyType) => {
    try {
      const response = await axios.get(
        `${baseUrl}/rentals/rentals_summary/${id}`
      );

      setpropertyDetails(response.data.data);
      const rentalId = response.data.data._id;
      getUnitProperty(rentalId);
      const matchedProperty = response.data.data.entries.find(
        (property) => property._id === entryIndex
      );

      setMatchedProperty(matchedProperty);
      setRentAdd(matchedProperty.rental_adress);
      console.log(matchedProperty, `matched property`);
      setLoading(false);
      setPropImageLoader(false);

      const resp = await axios.get(
        `
        ${baseUrl}/newproparty/propropartytype
        `
      );
      console.log(resp, "resp");



      // console.log('setSelectedProp',selectedProp)

      const selectedType = Object.keys(resp.data.data).find((item) => {
        return resp.data.data[item].some(
          (data) => data.propertysub_type === matchedProperty.property_type
          // setSelectedProp
        );
      });
      console.log(selectedType, "selectedType");
      setSelectedProp(matchedProperty.property_type);
      setPropType(selectedType);
      const isMultiUnits = resp.data.data[selectedType].filter((item) => {
        return item.propertysub_type === matchedProperty.property_type;
      });
      console.log(isMultiUnits, "isMultiUnit");
      setMultiUnit(isMultiUnits[0].ismultiunit);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getRentalsData();
    console.log(id);
  }, [id, clickedObject]);

  React.useEffect(() => {
    getGeneralLedgerData();
  }, [matchedProperty])

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [roomDropdown, setRoomDropdown] = useState(false);
  const [bathDropdown, setBathDropdown] = useState(false);
  const [financialDropdown, setFinancialDropdown] = useState(false);

  const toggle1 = () => setRoomDropdown((prevState) => !prevState);
  const toggle2 = () => setBathDropdown((prevState) => !prevState);
  const toggle3 = () => setFinancialDropdown((prevState) => !prevState);
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

  const financialTypeArray = [
    // "Next month",
    "Month to date",
    "Three months to date",
    // "Quarter to date",
    // "Year to date",
    // "Last month",
    // "Last quarter",
    // "Last year",
  ];
  // const openModal = (imageUrl) => {
  //   setSelectedImage(imageUrl);
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };
  // const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("summary");
  const [addUnitDialogOpen, setAddUnitDialogOpen] = useState(false);
  const [clickedObject, setClickedObject] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  // function ImageModal({ imageUrl, closeModal }) {
  //   return (
  //     <div className="image-modal" onClick={closeModal}>
  //       <img src={imageUrl} alt="Opened Image" />
  //     </div>
  //   );
  // }
  const addUnitFormik = useFormik({
    initialValues: {
      unit_number: "",
      market_rent: "",
      size: "",
      address1: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      bed: "",
      baths: "",
      description: "",
      propertyres_image: [],
      property_image: [],
    },

    onSubmit: (values) => {
      console.log(values);
    },
  });
  const [financialType, setFinancialType] = React.useState("");
  const [month, setMonth] = useState([]);
  const [threeMonths, setThreeMonths] = useState([]);
  const [propSummary, setPropSummary] = useState(false);
  const [rentalId, setRentalId] = useState("");
  const [propId, setPropId] = useState("");
  const [addAppliances, setAddAppliances] = useState(false);

  const handleFinancialSelection = (value) => {
    // console.log(value);
    setFinancialType(value);
    todayDate();
    // addUnitFormik.setFieldValue("date", date);
    // addUnitFormik.setFieldValue("date", date);
  };

  useEffect(() => {
    todayDate();
    lastThreeMonths();
  }, []);

  const todayDate = () => {
    const todayDate = moment().format("YYYY-MM-DD");
    const monthNumber = todayDate.substring(5, 7);
    const month = new Date(0, monthNumber - 1).toLocaleString("en-US", {
      month: "long",
    });
    setMonth(month);
  };

  const lastThreeMonths = () => {
    const today = moment();
    const lastThreeMonths = [];
    for (let i = 0; i < 2; i++) {
      const month = today.subtract(1, "month").format("MMMM");
      lastThreeMonths.unshift(month);
    }
    // lastThreeMonths.push(month);
    setThreeMonths(lastThreeMonths);
  };

  const [tenantDetails, setTenantDetails] = useState(true);
  const [myData, setMyData] = useState([]);
  const getStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today >= start && today <= end) {
      return "ACTIVE";
    } else if (today < start) {
      return "FUTURE";
    } else {
      return "-"; // Change this to suit your requirement for other cases
    }
  };

  useEffect(() => {
    getUnitProperty(rentalId, propId);
  }, [rentalId, propId]);

  const getUnitProperty = async (rentalId) => {
    await axios
      .get(`${baseUrl}/propertyunit/propertyunit/` + rentalId)
      .then((res) => {
        // setUnitProperty(res.data.data);
        console.log(res.data.data, "property unit");
        setPropertyUnit(res.data.data);
        const matchedUnit = res.data.data.filter((item) => item._id === propId);
        console.log(matchedUnit, "matchedUnit");
        setClickedObject(matchedUnit[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }

  const handleUnitDetailsEdit = async (id, rentalId) => {
    if (propType === "Residential") {
      const updatedValues = {
        rental_adress: addUnitFormik.values.rental_adress,
        rental_units: addUnitFormik.values.unit_number,
        rental_city: addUnitFormik.values.city,
        rental_state: addUnitFormik.values.state,
        rental_postcode: addUnitFormik.values.zip,
        rental_country: addUnitFormik.values.country,
        propertyres_image: unitImage,
      };
      await axios
        .put(`${baseUrl}/propertyunit/propertyunit/` + id, updatedValues)
        .then((response) => {
          console.log(response.data, "updated data");
          getUnitProperty(rentalId);
          getRentalsData();
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(clickedObject, "clickedObject after update");
    } else {
      const updatedValues = {
        rental_adress: addUnitFormik.values.address,
        rental_units: addUnitFormik.values.unit_number,
        rental_city: addUnitFormik.values.city,
        rental_state: addUnitFormik.values.state,
        rental_postcode: addUnitFormik.values.zip,
        rental_country: addUnitFormik.values.country,
        property_image: unitImage,
      };
      await axios
        .put(`${baseUrl}/propertyunit/propertyunit/` + id, updatedValues)
        .then((response) => {
          console.log(response.data.data, "updated data");
          getUnitProperty(rentalId);
          getRentalsData();
          // setAddUnitDialogOpen(false);
          // setAddUnitDialogOpen(false);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(clickedObject, "clickedObject after update");
    }
  };

  const handleListingEdit = async (id, rentalId) => {
    const updatedValues = {
      description: addUnitFormik.values.description,
      market_rent: addUnitFormik.values.market_rent,
      rental_sqft: addUnitFormik.values.size,
    };

    await axios
      .put(`${baseUrl}/propertyunit/propertyunit/` + id, updatedValues)
      .then((response) => {
        console.log(response.data.data, "updated data");
        getUnitProperty(rentalId);
        getRentalsData();
        // setAddUnitDialogOpen(false);
        // setAddUnitDialogOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(clickedObject, "clickedObject after update");
  };

  const handleDeleteUnit = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this applicants!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${baseUrl}/propertyunit/propertyunit/` + id)
          .then((response) => {
            console.log(response.data.data, "deleted data");
            getRentalsData();
            setPropSummary(false);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        swal("Cancelled", "Your data is safe", "error");
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      rental_adress: RentAdd,
      rentalId: id,
      description: addUnitFormik.values.description,
      market_rent: addUnitFormik.values.market_rent,
      rental_bed: addUnitFormik.values.rooms,
      rental_bath: addUnitFormik.values.baths,
      propertyres_image: addUnitFormik.values.propertyres_image || unitImage,
      rental_sqft: addUnitFormik.values.size,
      rental_units: addUnitFormik.values.unit_number,
      rental_unitsAdress: addUnitFormik.values.address1,
      rentalcom_unitsAdress: addUnitFormik.values.address1,
      rentalcom_sqft: addUnitFormik.values.rentalcom_sqft,
      rentalcom_units: addUnitFormik.values.rentalcom_units,
      rental_country: addUnitFormik.values.country,
      rental_state: addUnitFormik.values.state,
      rental_city: addUnitFormik.values.city,
      rental_postcode: addUnitFormik.values.zip,
      // property_image: addUnitFormik.values.property_image,
      property_image: addUnitFormik.values.property_image || unitImage,
    };
    console.log("formData", formData);
    try {
      const response = await axios.post(
        `${baseUrl}/propertyunit/propertyunit`,
        formData
      );
      if (response.data.statusCode === 200) {
        swal("Success!", "Unit Added Successfully", "success");
        setAddUnitDialogOpen(false);
        setPropertyUnit([...propertyUnit, response.data.data]);
      } else {
        swal("", response.data.message, "error");
      }
    } catch (error) {
      // Handle errors if the request fails
      console.error("Error:", error);
    }
  };

  const [uploadedImage, setUploadedImage] = useState(null);
  const [propImageLoader, setPropImageLoader] = useState(false);
  console.log(uploadedImage, "uploadedImage");

  const [img, setImg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleImageChange = async (event) => {
    setPropImageLoader(true);
    const files = event.target.files;
    const axiosRequests = [];

    const formData = new FormData();
    // for (let i = 0; i < files.length; i++) {
    formData.append(`files`, files[0]);
    // }

    const url = `${baseUrl}/images/upload`; // Use the correct endpoint for multiple files upload
    try {
      const result = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(result.data, "imgs");
    } catch (error) {
      console.error(error);
    }
    setPropImageLoader(false);

    // Wait for all Axios requests to complete before logging the data
    await Promise.all(axiosRequests);
  };

  const filterRentalsBySearch = () => {
    if (!searchQuery) {
      return GeneralLedgerData.flatMap((item) => {
        return item.paymentAndCharges.map((payment) => ({
          paymentAndCharges: payment,
          unit: item.unit,
          unit_id: item.unit_id,
          _id: item._id,
        }));
      });
    }

    const allPaymentAndCharges = GeneralLedgerData.flatMap((item) => {
      return item.paymentAndCharges.map((payment) => ({
        paymentAndCharges: payment,
        unit: item.unit,
        unit_id: item.unit_id,
        _id: item._id,
      }));
    });

    return allPaymentAndCharges.filter((rental) => {
      // const lowerCaseQuery = searchQuery.toLowerCase();
      console.log(searchQuery, "yash", rental);
      return (
        (rental.paymentAndCharges.charges_account &&
          rental.paymentAndCharges.charges_account.includes(
            searchQuery.toLowerCase()
          )) ||
        (rental.paymentAndCharges.account &&
          rental.paymentAndCharges.account
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (rental.paymentAndCharges.type &&
          rental.paymentAndCharges.type
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (rental.paymentAndCharges.charges_memo &&
          rental.paymentAndCharges.charges_memo
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (rental.paymentAndCharges.memo &&
          rental.paymentAndCharges.memo
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (rental.paymentAndCharges.amount &&
          rental.paymentAndCharges.amount
            .toString()
            .includes(searchQuery.toLowerCase()))
      );
    });
  };

  const [GeneralLedgerData, setGeneralLedgerData] = useState([]);
  const [PropertyExpenseData, setPropertyExpenseData] = useState([]);
  const [loader, setLoader] = useState(false);

  const getGeneralLedgerData = async () => {
      setLoader(true);
      if (matchedProperty) {
          try {
              const rental = matchedProperty?.rental_adress;
  
              if (rental && id) {
                  // First API call
                  const urlFinancial = `${baseUrl}/payment_charge/property_financial?rental_adress=${rental}&property_id=${id}`;
                  try {
                      const responseFinancial = await axios.get(urlFinancial);
                      console.log(responseFinancial, "yash");
                      if (responseFinancial.data && responseFinancial.data.data) {
                          const dataFinancial = responseFinancial.data.data[0];
  
                          // Second API call
                          const urlExpense = `${baseUrl}/payment_charge/property_financial/property_expense?rental_adress=${rental}&property_id=${id}`;
                          try {
                              const responseExpense = await axios.get(urlExpense);
                              console.log(responseExpense, "expense");
                              if (responseExpense.data && responseExpense.data.data) {
                                  const dataExpense = responseExpense.data.data[0];
  
                                  // Merge data from both API calls
                                  const combinedData = {
                                    _id: 'mergedId', // Provide a unique identifier for the merged data if needed
                                    properties: { /* ... */ },
                                    unit: dataFinancial.unit.map((financialUnit, index) => ({
                                      ...financialUnit,
                                      paymentAndCharges: financialUnit.paymentAndCharges || [],
                                      property_expense: dataExpense.unit[index]?.property_expense || [],
                                    })),
                                    __v: 0, // Update as needed
                                  };                                                              
  
                                  // Update GeneralLedgerData state with the merged data
                                  setGeneralLedgerData([combinedData]);
                                  console.log(dataFinancial, "Financial Data");
                                  console.log(dataExpense, "Expense Data");

                                  console.log(combinedData,"combine data")
                              } else {
                                  console.error("Unexpected response format:", responseExpense.data);
                              }
                          } catch (error) {
                              console.error("Error fetching expense data:", error);
                          }
                      } else {
                          console.error("Unexpected response format:", responseFinancial.data);
                      }
                  } catch (error) {
                      console.error("Error fetching financial data:", error);
                  }
              } else {
                  console.error("Invalid matchedProperty object:", matchedProperty);
              }
          } catch (error) {
              console.error("Error processing matchedProperty:", error);
          }
      }
      setLoader(false);
  };
  
  // Usage:
  // GeneralLedgerData will contain combined data from both API calls
  
  
  const calculateTotalIncome = (property) => {
    let totalIncome = 0;
  
    // Check if property and unit are defined before iterating
    property?.unit?.forEach((unit) => {
      // Check if paymentAndCharges is defined before iterating
      unit?.paymentAndCharges?.forEach((charge) => {
        totalIncome += charge.amount || 0;
      });
    });
  
    return totalIncome.toFixed(2);
  };
  
  const calculateTotalExpenses = (property) => {
    let totalExpenses = 0;
  
    // Check if property and unit are defined before iterating
    property?.unit?.forEach((unit) => {
      // Check if property_expense is defined before iterating
      unit?.property_expense?.forEach((charge) => {
        totalExpenses += charge.amount || 0;
      });
    });
  
    return totalExpenses.toFixed(2);
  };

const calculateNetIncome = (property) => {
  const totalIncome = calculateTotalIncome(property);
  const totalExpenses = calculateTotalExpenses(property);
  const netIncome = (totalIncome - totalExpenses).toFixed(2);
  return netIncome;
};

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <h1 style={{ color: "white" }}>{matchedProperty?.rental_adress}</h1>
            <h4 style={{ color: "white" }}>{matchedProperty?.property_type}</h4>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              onClick={() => navigate("/admin/propertiesTable")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0"></CardHeader>
              <Col>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab
                        label="Summary"
                        style={{ textTransform: "none" }}
                        value="summary"
                      />
                      <Tab
                        label="Financial"
                        style={{ textTransform: "none" }}
                        value="financial"
                      />
                      <Tab
                        label={`Units (${propertyUnit.length})`}
                        style={{ textTransform: "none" }}
                        value="units"
                      />
                      {/* <Tab
                        label="Task"
                        style={{ textTransform: "none" }}
                        value="task"
                      /> */}
                      {/* <Tab
                        label="Event history"
                        style={{ textTransform: "none" }}
                        value="eventhistory"
                      /> */}
                      {console.log(propertyUnit, "property unit")}
                    </TabList>
                  </Box>

                  <TabPanel value="summary">
                    <div className="main d-flex justify-content-between">
                      <div className="card mb-3 col-8">
                        <div className="row g-0 border-none">
                          {/* <div className="col-md-4">
                            <img
                              src={fone}
                              className="img-fluid rounded-start card-image"
                              alt="..."
                            />
                          </div> */}
                          {!propImageLoader ? (
                            <>
                              <div className="col-md-4 mt-2">
                                <label htmlFor="prop_image">
                                  <img
                                    // src="https://gecbhavnagar.managebuilding.com/manager/client/static-images/photo-sprite-property.png"
                                    src={
                                      matchedProperty?.prop_image
                                        ? matchedProperty?.prop_image
                                        : uploadedImage
                                        ? uploadedImage
                                        : fone
                                    }
                                    className="img-fluid rounded-start card-image"
                                    alt="..."
                                    // width='260px'
                                    // height='18px'
                                    // onClick={handleModalOpen}
                                  />
                                </label>

                                <TextField
                                  id="prop_image"
                                  name="prop_image"
                                  type="file"
                                  inputProps={{
                                    accept: "image/*",
                                    multiple: false,
                                  }}
                                  onChange={handleImageChange}
                                  style={{ display: "none" }}
                                />
                              </div>
                            </>
                          ) : (
                            <div className="col-md-4 mt-2 d-flex justify-content-center">
                              <RotatingLines
                                strokeColor="grey"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="50"
                                visible={propImageLoader}
                              />
                            </div>
                          )}

                          <div className="col-md-8">
                            <div
                              className="card-body mt-1"
                              style={{ padding: "0" }}
                            >
                              <h5 className="">
                                Property details
                                {/* <Link to="/">Edit</Link> */}
                              </h5>
                              <div className="h6" style={{ color: "#767676" }}>
                                ADDRESS
                              </div>
                              <span
                                className="address"
                                style={{ fontSize: "14px" }}
                              >
                                {" "}
                                {matchedProperty?.property_type}
                              </span>
                              <span
                                className="address"
                                style={{ fontSize: "14px" }}
                              >
                                {" "}
                                {matchedProperty?.rental_adress}
                              </span>
                              <span
                                className="address"
                                style={{ fontSize: "14px" }}
                              >
                                {" "}
                                {matchedProperty?.rental_city}
                              </span>
                              <span
                                className="address"
                                style={{ fontSize: "14px" }}
                              >
                                {" "}
                                {matchedProperty?.rental_country}
                              </span>
                              <span
                                className="address"
                                style={{ fontSize: "14px" }}
                              >
                                {" "}
                                {matchedProperty?.rental_postcode}
                              </span>
                              {/* <p className="address">OPERATING ACCOUNT </p> */}
                              {/* <p className="address">3 Industrial Road Boston, MA 02210 <Link to="/">Map it</Link></p> */}
                              {/* <div className="con-main d-flex justify-content-between">
          <div className="con-sec">
          <p>opening acconunt</p>
        <Link to="/">Trust account</Link>
        </div>
        <div className="con-third">
          <p>PROPERTY RESERVE</p>
          <p>$200.00</p>
        </div>
        </div> */}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div className="col-4 mt-4">
                        <Card style={{ background: "#F4F6FF" }}>
                          <CardContent>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  fontWeight: "bold",
                                }}
                                color="text.secondary"
                                gutterBottom
                              >
                                Property Manager:
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  marginLeft: "10px",
                                  fontWeight: "bold",
                                }}
                              >
                              </Typography>
                            </div>
                            <hr
                              style={{
                                marginTop: "2px",
                                marginBottom: "6px",
                              }}
                            />


                            <>
                              <div>
                                <div className="entry-container">
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      marginBottom: "5px",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                      }}
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      No manager assigned
                                    </Typography>
                                  </div>
                                </div>
                             
                              </div>
                           
                            </>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginTop: "10px",
                              }}
                            >
                              <Button
                                color="success"
                                style={{
                                  fontSize: "13px",
                                  background: "white",
                                  color: "green",
                                  "&:hover": {
                                    background: "green",
                                    color: "white",
                                  },
                                }}
                              >
                                Asign a manager
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div> */}
                    </div>
                    <div className="table-responsive d-flex">
                      <Table
                        className="align-items-center table-flush"
                        responsive
                        style={{ width: "100%" }}
                      >
                        {loading ? (
                          <tbody>
                            <tr>
                              <td>Loading Property details...</td>
                            </tr>
                          </tbody>
                        ) : error ? (
                          <tbody>
                            <tr>
                              <td>Error: {error.message}</td>
                            </tr>
                          </tbody>
                        ) : propertyDetails._id ? (
                          //     <>
                          //       <tbody>
                          //         <tr>
                          //           <th
                          //             colSpan="2"
                          //             className="text-primary text-lg"
                          //           >
                          //             Property Details
                          //           </th>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Image
                          //           </td>
                          //           <td>
                          //             <div
                          //               style={{
                          //                 display: "flex",
                          //                 flexWrap: "wrap",
                          //               }}
                          //             >
                          //               {matchedProperty?.propertyres_image &&
                          //                 matchedProperty?.propertyres_image.length >
                          //                   0 && (
                          //                   <div
                          //                     style={{
                          //                       width: "100%", // Expands to full width by default
                          //                     }}
                          //                   >
                          //                     Residential:
                          //                     {matchedProperty?.propertyres_image.map(
                          //                       (propertyres_image, index) => (
                          //                         <img
                          //                           key={index}
                          //                           src={propertyres_image}
                          //                           alt="Property Details"
                          //                           onClick={() => {
                          //                             setSelectedImage(
                          //                               propertyres_image
                          //                             );
                          //                             setOpen(true);
                          //                           }}
                          //                           style={{
                          //                             width: "100px",
                          //                             height: "100px",
                          //                             // objectFit: "cover",
                          //                             margin: "10px",
                          //                             borderRadius: "10px",
                          //                             "@media (max-width: 768px)": {
                          //                               width: "100%", // Full-width on smaller screens
                          //                             },
                          //                           }}
                          //                         />
                          //                       )
                          //                     )}
                          //                     {/* <Modal
                          //                 open={open}
                          //                 onClose={handleClose}
                          //                 aria-labelledby="modal-modal-title"
                          //                 aria-describedby="modal-modal-description"
                          //               >
                          //                 <div
                          //                   style={{
                          //                     position: "absolute",
                          //                     top: "50%",
                          //                     left: "50%",
                          //                     transform: "translate(-50%, -50%)",
                          //                     backgroundColor: "white",
                          //                     border: "2px solid #000",
                          //                     padding: "2rem",
                          //                   }}
                          //                 >
                          //                   <img
                          //                     style={style}
                          //                     src={selectedImage}
                          //                     alt="Image"
                          //                   />
                          //                   <ClearIcon
                          //                     style={{
                          //                       cursor: "pointer",
                          //                       position: "absolute",
                          //                       top: "-99px",
                          //                       right: "-171px",
                          //                     }}
                          //                     onClick={handleClose}
                          //                   />
                          //                 </div>
                          //               </Modal> */}
                          //                     <OpenImageDialog
                          //                       open={open}
                          //                       setOpen={setOpen}
                          //                       selectedImage={selectedImage}
                          //                     />
                          //                   </div>
                          //                 )}
                          //               {matchedProperty?.property_image &&
                          //                 matchedProperty?.property_image.length >
                          //                   0 && (
                          //                   <div
                          //                     style={{
                          //                       width: "100%", // Expands to full width by default
                          //                     }}
                          //                   >
                          //                     Commercial:
                          //                     {matchedProperty?.property_image.map(
                          //                       (property_image, index) => (
                          //                         <img
                          //                           key={index}
                          //                           src={property_image}
                          //                           alt="Property Details"
                          //                           style={{
                          //                             width: "100px",
                          //                             height: "100px",
                          //                             // objectFit: "cover",
                          //                             margin: "10px",
                          //                             borderRadius: "10px",
                          //                             "@media (max-width: 768px)": {
                          //                               width: "100%", // Full-width on smaller screens
                          //                             },
                          //                           }}
                          //                         />
                          //                       )
                          //                     )}
                          //                   </div>
                          //                 )}
                          //             </div>
                          //           </td>
                          //         </tr>

                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Property Type
                          //           </td>
                          //           <td>
                          //             {matchedProperty?.property_type || "N/A"}
                          //           </td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Address
                          //           </td>
                          //           <td>
                          //             {matchedProperty?.rental_adress || "N/A"}
                          //           </td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             City
                          //           </td>
                          //           <td>{matchedProperty.rental_city || "N/A"}</td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Country
                          //           </td>
                          //           <td>
                          //             {matchedProperty.rental_country || "N/A"}
                          //           </td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Postcode
                          //           </td>
                          //           <td>
                          //             {matchedProperty.rental_postcode || "N/A"}
                          //           </td>
                          //         </tr>
                          //       </tbody>

                          //       <tbody>
                          //         <tr>
                          //           <th
                          //             colSpan="2"
                          //             className="text-primary text-lg"
                          //           >
                          //             Rental Owner Details
                          //           </th>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             First Name
                          //           </td>
                          //           <td>
                          //             {propertyDetails.rentalOwner_firstName ||
                          //               "N/A"}
                          //           </td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Last Name
                          //           </td>
                          //           <td>
                          //             {propertyDetails.rentalOwner_lastName ||
                          //               "N/A"}
                          //           </td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Company Name
                          //           </td>
                          //           <td>
                          //             {propertyDetails.rentalOwner_companyName ||
                          //               "N/A"}
                          //           </td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             E-Mail
                          //           </td>
                          //           <td>
                          //             {propertyDetails.rentalOwner_primaryEmail ||
                          //               "N/A"}
                          //           </td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Phone Number
                          //           </td>
                          //           <td>
                          //             {propertyDetails.rentalOwner_phoneNumber ||
                          //               "N/A"}
                          //           </td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Home Number
                          //           </td>
                          //           <td>
                          //             {propertyDetails.rentalOwner_homeNumber ||
                          //               "N/A"}
                          //           </td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Business Number
                          //           </td>
                          //           <td>
                          //             {propertyDetails.rentalOwner_businessNumber ||
                          //               "N/A"}
                          //           </td>
                          //         </tr>
                          //       </tbody>

                          //       {/* <tbody>
                          //   <tr>
                          //     <th colSpan="2" className="text-primary text-lg">
                          //       Account Details
                          //     </th>
                          //   </tr>
                          //   <tr>
                          //     <td className="font-weight-bold text-md">
                          //       Operating Account
                          //     </td>
                          //     <td>
                          //       {propertyDetails.rentalOwner_operatingAccount ||
                          //         "N/A"}
                          //     </td>
                          //   </tr>
                          //   <tr>
                          //     <td className="font-weight-bold text-md">
                          //       Property Reserve
                          //     </td>
                          //     <td>
                          //       {propertyDetails.rentalOwner_propertyReserve ||
                          //         "N/A"}
                          //     </td>
                          //   </tr>
                          // </tbody> */}

                          //       <tbody>
                          //         <tr>
                          //           <th
                          //             colSpan="2"
                          //             className="text-primary text-lg"
                          //           >
                          //             Staff Details
                          //           </th>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Staff Member
                          //           </td>
                          //           <td>{matchedProperty.staffMember || "N/A"}</td>
                          //         </tr>
                          //       </tbody>

                          //       {/* <tbody>
                          //         <tr>
                          //           <th
                          //             colSpan="2"
                          //             className="text-primary text-lg"
                          //           >
                          //             Unit Details
                          //           </th>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Unit
                          //           </td>
                          //           <td>
                          //             {matchedProperty.rental_units ||
                          //               matchedProperty.rentalcom_units ||
                          //               "N/A"}
                          //           </td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Unit Address
                          //           </td>
                          //           <td>
                          //             {matchedProperty.rental_unitsAdress ||
                          //               matchedProperty.rentalcom_unitsAdress ||
                          //               "N/A"}
                          //           </td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Bed
                          //           </td>
                          //           <td>{matchedProperty.rental_bed || "N/A"}</td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             Bath
                          //           </td>
                          //           <td>{matchedProperty.rental_bath || "N/A"}</td>
                          //         </tr>
                          //         <tr>
                          //           <td className="font-weight-bold text-md">
                          //             SQFT
                          //           </td>
                          //           <td>
                          //             {matchedProperty.rental_soft ||
                          //               matchedProperty.rentalcom_soft ||
                          //               "N/A"}
                          //           </td>
                          //         </tr>
                          //       </tbody> */}
                          //     </>
                          <>
                            <div className="table-responsive">
                              <div className="row m-3">
                                <div className="col-12">
                                  <div
                                    className="align-items-center table-flush"
                                    responsive
                                    style={{ width: "100%" }}
                                  >
                                    {loading ? (
                                      <tbody>
                                        <tr>
                                          <td>Loading tenant details...</td>
                                        </tr>
                                      </tbody>
                                    ) : error ? (
                                      <tbody>
                                        <tr>
                                          <td>Error: {error.message}</td>
                                        </tr>
                                      </tbody>
                                    ) : (
                                      <div className="w-100">
                                        <Row
                                          className="w-100 my-3 "
                                          style={{
                                            fontSize: "18px",
                                            textTransform: "capitalize",
                                            color: "#000",
                                            fontWeight: "600",
                                            borderBottom: "1px solid #ddd",
                                          }}
                                        >
                                          <Col>
                                            Rental owners{" "}
                                            {/* <Link to="">Edit</Link>{" "} */}
                                          </Col>
                                        </Row>
                                        <Row
                                          className="mb-1 m-0 p-0"
                                          style={{
                                            fontSize: "12px",
                                            color: "#000",
                                          }}
                                        >
                                          <Table>
                                            <tbody
                                              className="tbbody p-0 m-0"
                                              style={{
                                                borderTopRightRadius: "5px",
                                                borderTopLeftRadius: "5px",
                                                borderBottomLeftRadius: "5px",
                                                borderBottomRightRadius: "5px",
                                              }}
                                            >
                                              <tr className="header">
                                                <th>Name</th>
                                                <th>Company Name</th>
                                                <th>E-Mail</th>
                                                <th>Phone Number</th>
                                                <th>Home Number</th>
                                                <th>Business Numberr</th>
                                                {/* <th>Property</th>
                                                    <th>Type</th>
                                                    <th>Rent</th> */}
                                              </tr>
                                              {myData ? (
                                                <>
                                                  <>
                                                    <tr className="body">
                                                      <td>
                                                        {/* <Link to=""> */}
                                                        {`${
                                                          propertyDetails.rentalOwner_firstName ||
                                                          "N/A"
                                                        } ${
                                                          propertyDetails.rentalOwner_lastName ||
                                                          "N/A"
                                                        }`}

                                                        {/* </Link> */}
                                                      </td>
                                                      <td>
                                                        {propertyDetails.rentalOwner_companyName ||
                                                          "N/A"}
                                                      </td>{" "}
                                                      <td>
                                                        {propertyDetails.rentalOwner_primaryEmail ||
                                                          "N/A"}
                                                      </td>
                                                      <td>
                                                        {propertyDetails.rentalOwner_phoneNumber ||
                                                          "N/A"}
                                                      </td>
                                                      <td>
                                                        {propertyDetails.rentalOwner_homeNumber ||
                                                          "N/A"}
                                                      </td>
                                                      <td>
                                                        {propertyDetails.rentalOwner_businessNumber ||
                                                          "N/A"}
                                                      </td>
                                                      {/* <td>100%</td> */}
                                                    </tr>
                                                    {/* <tr className="body">
                                                      <td>Total</td>
                                                      <td>100%</td>
                                                    </tr> */}
                                                  </>
                                                </>
                                              ) : null}
                                            </tbody>
                                          </Table>
                                        </Row>

                                        <Row
                                          className="w-100 my-3 "
                                          style={{
                                            fontSize: "18px",
                                            textTransform: "capitalize",
                                            color: "#000",
                                            fontWeight: "600",
                                            borderBottom: "1px solid #ddd",
                                          }}
                                        >
                                          <Col>
                                            Staff Details{" "}
                                            {/* <Link to="">Edit</Link>{" "} */}
                                          </Col>
                                        </Row>
                                        <Row
                                          className="mb-1 m-0 p-0"
                                          style={{
                                            fontSize: "12px",
                                            color: "#000",
                                          }}
                                        >
                                          <Table>
                                            <tbody
                                              className="tbbody p-0 m-0"
                                              style={{
                                                borderTopRightRadius: "5px",
                                                borderTopLeftRadius: "5px",
                                                borderBottomLeftRadius: "5px",
                                                borderBottomRightRadius: "5px",
                                              }}
                                            >
                                              <tr className="header">
                                                <th>Staff Member</th>
                                              </tr>
                                              {myData ? (
                                                <>
                                                  <>
                                                    <tr className="body">
                                                      <td>
                                                        {/* <Link to=""> */}
                                                        {`${
                                                          matchedProperty?.staffMember ||
                                                          "No staff member assigned"
                                                        }`}

                                                        {/* </Link> */}
                                                      </td>

                                                      {/* <td>100%</td> */}
                                                    </tr>
                                                    {/* <tr className="body">
                                                      <td>Total</td>
                                                      <td>100%</td>
                                                    </tr> */}
                                                  </>
                                                </>
                                              ) : null}
                                            </tbody>
                                          </Table>
                                        </Row>

                                        {/* <Row
                                          className="w-100 my-3 "
                                          style={{
                                            fontSize: "18px",
                                            textTransform: "capitalize",
                                            color: "#000",
                                            fontWeight: "600",
                                            borderBottom: "1px solid #ddd",
                                          }}
                                        >
                                          <Col>
                                            Listing information{" "}
                                            <Link to="">Edit</Link>{" "}
                                          </Col>
                                        </Row>
                                        <h8 className="dec-head">
                                          DESCRIPTION
                                        </h8>
                                        <p className="des-para">
                                          Three 2000 sqft garage spaces. Easy
                                          access to highways and local roads.
                                        </p>
                                        <h8 className="dec-head">AMENITIES</h8>
                                        <p className="des-para">--</p>
                                        <h8 className="dec-head">
                                          INCLUDED IN RENT
                                        </h8>
                                        <p className="des-para">--</p>
                                        <Row
                                          className="w-100 my-3 "
                                          style={{
                                            fontSize: "18px",
                                            textTransform: "capitalize",
                                            color: "#000",
                                            fontWeight: "600",
                                            borderBottom: "1px solid #ddd",
                                          }}
                                        >
                                          <Col>
                                            Tenant website settings{" "}
                                            <Link to="">Edit</Link>{" "}
                                          </Col>
                                        </Row>
                                        <div className="web-detail d-flex">
                                          <div className="col-6 ">
                                            <h8 className="dec-head">
                                              PAYMENT HISTORY
                                            </h8>
                                            <p className="des-para">
                                              Tenant can view all transactions
                                            </p>
                                          </div>
                                          <div className="col-6 ">
                                            <h8 className="dec-head">
                                              PAYMENT HISTORY
                                            </h8>
                                            <p className="des-para">
                                              Tenant can view all transactions
                                            </p>
                                          </div>
                                        </div>
                                        <div className="col-6 my-3 ">
                                          <h8 className="dec-head">
                                            PAYMENT HISTORY
                                          </h8>
                                          <p className="des-para">
                                            Tenant can view all transactions
                                          </p>
                                        </div>
                                        <Row
                                          className="w-100 my-3 "
                                          style={{
                                            fontSize: "18px",
                                            textTransform: "capitalize",
                                            color: "#000",
                                            fontWeight: "600",
                                            borderBottom: "1px solid #ddd",
                                          }}
                                        >
                                          <Col>
                                            Appliances <Link to="">Edit</Link>{" "}
                                          </Col>
                                        </Row>
                                        <Row
                                          className="mb-1 m-0 p-0"
                                          style={{
                                            fontSize: "12px",
                                            color: "#000",
                                          }}
                                        >
                                          <Table>
                                            <tbody
                                              className="tbbody p-0 m-0"
                                              style={{
                                                borderTopRightRadius: "5px",
                                                borderTopLeftRadius: "5px",
                                                borderBottomLeftRadius: "5px",
                                                borderBottomRightRadius: "5px",
                                              }}
                                            >
                                              {myData ? (
                                                <>
                                                  <>
                                                    <tr className="body">
                                                      <td>Washing machine</td>
                                                      <td>A</td>
                                                      <td>INSTALLED</td>
                                                    </tr>
                                                  </>
                                                </>
                                              ) : null}
                                            </tbody>
                                          </Table>
                                        </Row>
                                        <Row
                                          className="w-100 my-3 "
                                          style={{
                                            fontSize: "18px",
                                            textTransform: "capitalize",
                                            color: "#000",
                                            fontWeight: "600",
                                            borderBottom: "1px solid #ddd",
                                          }}
                                        >
                                          <Col>
                                            Appliances <Link to="">Add</Link>{" "}
                                          </Col>
                                        </Row>
                                        <Row
                                          className="mb-1 m-0 p-0"
                                          style={{
                                            fontSize: "12px",
                                            color: "#000",
                                          }}
                                        >
                                          <Table>
                                            <tbody
                                              className="tbbody p-0 m-0"
                                              style={{
                                                borderTopRightRadius: "5px",
                                                borderTopLeftRadius: "5px",
                                                borderBottomLeftRadius: "5px",
                                                borderBottomRightRadius: "5px",
                                              }}
                                            >
                                              {myData ? (
                                                <>
                                                  <>
                                                    <tr className="body">
                                                      <td>
                                                        Property Manager: Andrew
                                                        Martin
                                                      </td>
                                                      <td>A</td>
                                                      <td>RENTAL</td>
                                                      <td>
                                                        11/18/2023 1:40 AM
                                                      </td>
                                                      <td>Sahil ajmeri</td>
                                                    </tr>
                                                    <tr className="body">
                                                      <td>
                                                        Email:
                                                        andrew@buildium.com
                                                      </td>
                                                      <td></td>
                                                      <td></td>
                                                      <td>INSTALLED</td>
                                                    </tr>
                                                    <tr className="body">
                                                      <td>
                                                        Phone: 555-555-1212
                                                      </td>
                                                      <td></td>
                                                      <td></td>
                                                      <td>INSTALLED</td>
                                                    </tr>
                                                    <tr className="body">
                                                      <td>Fax: 555-555-1212</td>
                                                      <td></td>
                                                      <td></td>
                                                      <td>INSTALLED</td>
                                                    </tr>
                                                  </>
                                                </>
                                              ) : null}
                                            </tbody>
                                          </Table>
                                        </Row>
                                        <Row
                                          className="w-100 my-3 "
                                          style={{
                                            fontSize: "18px",
                                            textTransform: "capitalize",
                                            color: "#000",
                                            fontWeight: "600",
                                            borderBottom: "1px solid #ddd",
                                          }}
                                        >
                                          <Col>
                                            Recent files <Link to="">Add</Link>{" "}
                                          </Col>
                                        </Row>
                                        <Row
                                          className="mb-1 m-0 p-0"
                                          style={{
                                            fontSize: "12px",
                                            color: "#000",
                                          }}
                                        >
                                          <Table>
                                            <tbody
                                              className="tbbody p-0 m-0"
                                              style={{
                                                borderTopRightRadius: "5px",
                                                borderTopLeftRadius: "5px",
                                                borderBottomLeftRadius: "5px",
                                                borderBottomRightRadius: "5px",
                                              }}
                                            >
                                              {myData ? (
                                                <>
                                                  <>
                                                    <tr className="body">
                                                      <td>
                                                        Property Manager: Andrew
                                                        Martin{" "}
                                                        <Link to="">
                                                          Upload your first
                                                          file.
                                                        </Link>
                                                      </td>
                                                    </tr>
                                                  </>
                                                </>
                                              ) : null}
                                            </tbody>
                                          </Table>
                                        </Row> */}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <tbody>
                            <tr>
                              <td>No details found.</td>
                            </tr>
                          </tbody>
                        )}
                      </Table>
                    </div>
                  </TabPanel>

                  <TabPanel value="financial">
                    <>
                      <Col
                        lg="6"
                        className="text-primary text-lg font-weight-bold"
                      >
                        <FormGroup>
                          <Dropdown isOpen={financialDropdown} toggle={toggle3}>
                            <DropdownToggle
                              caret
                              color="primary"
                              style={{
                                background: "white",
                                color: "blue",
                                // marginRight: "10px",
                              }}
                            >
                              {financialType
                                ? financialType
                                : "Month to date" &&
                                  setFinancialType("Month to date")}
                            </DropdownToggle>
                            <DropdownMenu>
                              {financialTypeArray.map((subtype, index) => (
                                <DropdownItem
                                  key={index}
                                  onClick={() =>
                                    handleFinancialSelection(subtype)
                                  }
                                >
                                  {subtype}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </FormGroup> 
                      </Col>

                      {loader ? (
                        <div>Loading...</div>
                      ) : (
                        <>
                      {financialType === "Month to date" && (
                        <Table responsive>
                          <thead>
                            <th>Property account</th>
                            <th>{month} 1 to date</th>
                          </thead>
                          <tbody>
                          <React.Fragment>
                              <tr>
                                <th
                                  style={{
                                    color: "blue",
                                    fontWeight: "bold",
                                    backgroundColor: "#f0f0f0",
                                  }}
                                  colSpan="2"
                                >
                                  Income
                                </th>
                              </tr>
                              {GeneralLedgerData.map((property, index) => (
                                <React.Fragment key={index}>
                                  {property.unit.map((unit, unitIndex) => (
                                    <React.Fragment key={unitIndex}>
                                      {unit.paymentAndCharges && unit.paymentAndCharges.map((charge, chargeIndex) => (
                                        <React.Fragment key={chargeIndex}>
                                          <tr>
                                            <th>{charge.account}</th>
                                            <td>${charge.amount || "0.00"}</td>
                                          </tr>
                                        </React.Fragment>
                                      ))}
                                    </React.Fragment>
                                  ))}
                                    <tr>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Total income
                                </th>
                                <td
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ${calculateTotalIncome(property)}
                                </td>
                              </tr>
                                </React.Fragment>
                              ))}

                              <tr>
                                <th
                                  style={{
                                    color: "blue",
                                    fontWeight: "bold",
                                    backgroundColor: "#f0f0f0",
                                  }}
                                  colSpan="2"
                                >
                                  Expenses
                                </th>
                                <td></td>
                              </tr>
                              {GeneralLedgerData.map((property, index) => (
                                <React.Fragment key={index}>
                                  {property.unit.map((unit, unitIndex) => (
                                    <React.Fragment key={unitIndex}>
                                      {unit.property_expense && unit.property_expense.map((expense, expenseIndex) => (
                                        <React.Fragment key={expenseIndex}>
                                          <tr>
                                            <th>{expense.account}</th>
                                            <td>${expense.amount || "0.00"}</td>
                                          </tr>
                                        </React.Fragment>
                                      ))}
                                    </React.Fragment>
                                  ))}
                                    <tr>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Total expenses
                                </th>
                                <td
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ${calculateTotalExpenses(property)}
                                </td>
                              </tr>
                              <tr>
                                <th
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                    backgroundColor: "#f0f0f0",
                                  }}
                                  //colSpan="2"
                                >
                                  Net income
                                </th>
                                <td
                                  style={{
                                    color: "black",
                                    fontWeight: "bold",
                                    backgroundColor: "#f0f0f0",
                                  }}
                                  //colSpan="2"
                                >
                                  ${calculateNetIncome(property)}
                                </td>
                              </tr>
                                </React.Fragment>
                              ))}
                          </React.Fragment>


                              

                               

                          </tbody>
                        </Table>
                      )}

                          {financialType === "Three months to date" && (
                            <Table responsive>
                              <thead>
                                <th>Property account</th>
                                {threeMonths.map((month, index) => (
                                  <th key={index}>
                                    {month} {moment().format("YYYY")}
                                  </th>
                                ))}
                                <th>{month} 1 to date</th>
                                <th>
                                  Total as of {moment().format("YYYY/MM/DD")}
                                </th>
                              </thead>
                              <tbody>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Income
                                  </th>
                                </tr>
                                <tr>
                                  <th>Application fee income</th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th>Rent income</th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total income
                                  </th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Expenses
                                  </th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th>Landscaping</th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th>Repairs</th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th>Supplies</th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th>Utilities</th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total expenses
                                  </th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Net operating income
                                  </th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Net income
                                  </th>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                  <td>N/A</td>
                                </tr>
                              </tbody>
                            </Table>
                          )}
                        </>
                      )}
                    </>
                  </TabPanel>

                  <TabPanel value="units">
                    {addUnitDialogOpen ? (
                      <>
                        <Form onSubmit={handleSubmit}>
                          <h4 style={{ marginBottom: "20px" }}>
                            What is the unit information?
                          </h4>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  Unit Number *
                                </label>
                                <Input
                                  required
                                  className="form-control-alternative"
                                  id="unit_number"
                                  placeholder="Unit Number"
                                  type="text"
                                  name="unit_number"
                                  value={addUnitFormik.values.unit_number}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  Market Rent *
                                </label>
                                <Input
                                  required
                                  className="form-control-alternative"
                                  id="market_rent"
                                  placeholder="Market Rent"
                                  type="text"
                                  name="market_rent"
                                  value={addUnitFormik.values.market_rent}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  Size (Optional)
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="size"
                                  placeholder="Sq. Ft."
                                  type="text"
                                  name="size"
                                  value={addUnitFormik.values.size}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="10">
                              <hr />
                            </Col>
                          </Row>
                          <h4 style={{ marginBottom: "20px" }}>
                            What is the street address?
                          </h4>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  Address *
                                </label>
                                <Input
                                  required
                                  className="form-control-alternative"
                                  id="address1"
                                  placeholder="Address"
                                  type="text"
                                  name="address1"
                                  value={addUnitFormik.values.address1}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                  style={{ marginBottom: "10px" }}
                                />
                                {/* <Input
                                  className="form-control-alternative"
                                  id="address2"
                                  placeholder="Address"
                                  type="text"
                                  name="address2"
                                  value={addUnitFormik.values.address2}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                  style={{ marginBottom: "10px" }}
                                />
                                <Input
                                  className="form-control-alternative"
                                  id="address3"
                                  placeholder="Address"
                                  type="text"
                                  name="address3"
                                  value={addUnitFormik.values.address3}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                  style={{ marginBottom: "10px" }}
                                /> */}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="2">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  City *
                                </label>
                                <Input
                                  required
                                  className="form-control-alternative"
                                  id="city"
                                  placeholder="City"
                                  type="text"
                                  name="city"
                                  value={addUnitFormik.values.city}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="2">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-country"
                                >
                                  State *
                                </label>
                                <Input
                                  required
                                  className="form-control-alternative"
                                  id="state"
                                  placeholder="State"
                                  type="text"
                                  name="state"
                                  value={addUnitFormik.values.state}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="2">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-country"
                                >
                                  Zip *
                                </label>
                                <Input
                                  required
                                  className="form-control-alternative"
                                  id="zip"
                                  placeholder="Zip"
                                  type="text"
                                  name="zip"
                                  value={addUnitFormik.values.zip}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-country"
                                >
                                  Country *
                                </label>
                                <Input
                                  requi
                                  className="form-control-alternative"
                                  id="country"
                                  placeholder="Country"
                                  type="text"
                                  name="country"
                                  value={addUnitFormik.values.country}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="10">
                              <hr />
                            </Col>
                          </Row>
                          <h4 style={{ marginBottom: "20px" }}>
                            What is the listing information?
                          </h4>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                            style={
                              propType !== "Residential"
                                ? { display: "none" }
                                : { display: "block" }
                            }
                          >
                            Rooms (optional)
                          </label>
                          <Row
                            style={
                              propType !== "Residential"
                                ? { display: "none", marginTop: "10px" }
                                : { marginTop: "10px" }
                            }
                          >
                            <Col lg="2">
                              <FormGroup>
                                <Dropdown
                                  isOpen={roomDropdown}
                                  toggle={toggle1}
                                >
                                  <DropdownToggle caret>
                                    {addUnitFormik.values.rooms
                                      ? addUnitFormik.values.rooms
                                      : "Beds..."}
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    {roomsArray.map((subtype, index) => (
                                      <DropdownItem
                                        key={index}
                                        onClick={() => {
                                          addUnitFormik.setFieldValue(
                                            "rooms",
                                            subtype
                                          );
                                        }}
                                        onChange={addUnitFormik.handleChange}
                                        onBlur={addUnitFormik.handleBlur}
                                        // onClick={() =>
                                        //   handlePropSelection(
                                        //     subtype.propertysub_type
                                        //   )
                                        // }
                                      >
                                        {subtype}
                                      </DropdownItem>
                                    ))}
                                  </DropdownMenu>
                                </Dropdown>
                              </FormGroup>
                            </Col>
                            <Col lg="2">
                              <FormGroup>
                                <Dropdown
                                  isOpen={bathDropdown}
                                  toggle={toggle2}
                                >
                                  <DropdownToggle caret>
                                    {addUnitFormik.values.baths
                                      ? addUnitFormik.values.baths
                                      : "Baths..."}
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    {bathArray.map((subtype, index) => (
                                      <DropdownItem
                                        key={index}
                                        onClick={() => {
                                          addUnitFormik.setFieldValue(
                                            "baths",
                                            subtype
                                          );
                                        }}
                                        onChange={addUnitFormik.handleChange}
                                        onBlur={addUnitFormik.handleBlur}
                                        // onClick={() =>
                                        //   handlePropSelection(
                                        //     subtype.propertysub_type
                                        //   )
                                        // }
                                      >
                                        {subtype}
                                      </DropdownItem>
                                    ))}
                                  </DropdownMenu>
                                </Dropdown>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  Description (optional)
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="description"
                                  placeholder="Description"
                                  type="textarea"
                                  name="description"
                                  value={addUnitFormik.values.description}
                                  onChange={addUnitFormik.handleChange}
                                  onBlur={addUnitFormik.handleBlur}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "10px" }}>
                            <Col lg="2">
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
                                    id={`unit_img`}
                                    name={`unit_img`}
                                    onChange={(e) => {
                                      const file = [...e.target.files];
                                      fileData(file, "propertyres_image", "");
                                      if (file.length > 0) {
                                        const allImages = file.map((file) => {
                                          return URL.createObjectURL(file);
                                        });
                                        // console.log(
                                        //    "",
                                        //   "indexxxxxx"
                                        // );
                                        if (unitImage[""]) {
                                          setUnitImage([
                                            ...unitImage.slice(0, ""),
                                            [...unitImage[""], ...allImages],
                                            ...unitImage.slice(1 + ""),
                                          ]);
                                        } else {
                                          setUnitImage([...allImages]);
                                        }
                                      } else {
                                        setUnitImage([...unitImage]);
                                        // )
                                      }
                                    }}
                                  />
                                  {console.log(unitImage, "unitImage")}
                                  <label htmlFor={`unit_img`}>
                                    <b style={{ fontSize: "20px" }}>+</b> Add
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
                                <div className="d-flex">
                                  {unitImage &&
                                    unitImage.length > 0 &&
                                    unitImage.map((unitImg) => (
                                      <div
                                        key={unitImg}
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
                                            // objectFit: "cover",
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
                                              "",
                                              unitImage,
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
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "10px" }}>
                            <Button
                              className="btn-icon btn-2"
                              color="success"
                              type="submit"
                            >
                              Create Unit
                            </Button>
                            <Button onClick={() => setAddUnitDialogOpen(false)}>
                              Cancel
                            </Button>
                          </Row>
                        </Form>
                      </>
                    ) : !propSummary ? (
                      <div>
                        {/* 3 buttons in right side of table */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginBottom: "10px",
                          }}
                        >
                          {console.log(multiUnit, "multiiiiiiiS ")}
                          <Button
                            className="btn-icon btn-2"
                            color="primary"
                            // style={{ marginRight: "10px" }}
                            style={{
                              background: "white",
                              color: "blue",
                              display: multiUnit ? "block" : "none",
                            }}
                            size="l"
                            onClick={() => {
                              addUnitFormik.setValues({
                                address1:
                                  propertyDetails.entries[0].rental_adress,
                                city: propertyDetails.entries[0].rental_city,
                                state: propertyDetails.entries[0].rental_state,
                                zip: propertyDetails.entries[0].rental_postcode,
                                country:
                                  propertyDetails.entries[0].rental_country,
                              });
                              // console.log(propertyUnit,'pppppprrrrrroooooooo')
                              // setAddUnitDialogOpen(true);
                              setAddUnitDialogOpen(true);
                            }}
                          >
                            <span className="btn-inner--text">Add Unit</span>
                          </Button>
                        </div>
                        <Table
                          className="align-items-center table-flush"
                          responsive
                        >
                          <thead className="thead-light">
                            <tr>
                              <th scope="col">Unit</th>
                              <th scope="col">Address</th>
                              <th scope="col">Tenants</th>
                              {/* <th scope="col">Most Recent Events</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {propertyUnit.map((unit, index) => (
                              <tr
                                key={index}
                                onClick={() => {
                                  setPropSummary(true);
                                  setPropId(unit._id);
                                  setClickedObject(unit);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <td>{unit.rental_units || "N/A"}</td>
                                <td>{unit.rental_adress || "N/A"}</td>
                                <td>
                                  {unit.tenant_firstName == null
                                    ? "-"
                                    : unit.tenant_firstName +
                                      " " +
                                      unit.tenant_lastName}
                                  {/* {unit.tenant_firstName +
                                    " " +
                                    unit.tenant_lastName} */}
                                </td>
                                {/* <td>{"N/A"}</td> */}
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <></>
                      </div>
                    ) : (
                      // <div className="table-responsive">
                      //   <Table
                      //     className="align-items-center table-flush"
                      //     responsive
                      //     style={{ width: "100%" }}
                      //   >
                      <>
                        <Button
                          className="btn-icon btn-2"
                          // color="primary"
                          // style={{ marginRight: "10px" }}
                          style={{
                            background: "white",
                            color: "blue",
                            // marginRight: "10px",
                          }}
                          size="sm"
                          onClick={() => setPropSummary(false)}
                        >
                          <span className="btn-inner--text">Back</span>
                        </Button>
                        <Button
                          className="btn-icon btn-2"
                          // color="primary"
                          style={{
                            background: "white",
                            color: "blue",
                            // marginRight: "10px",
                          }}
                          size="sm"
                          onClick={() => {
                            handleDeleteUnit(clickedObject._id);
                          }}
                        >
                          Delete unit
                        </Button>

                        <Grid container>
                          <Grid container md={9} style={{ display: "flex" }}>
                            {/* <Grid item md={3}>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                }}
                              >
                                {clickedObject.propertyres_image &&
                                  clickedObject.propertyres_image.length >
                                    0 && (
                                    <div
                                      style={{
                                        width: "100%", // Expands to full width by default
                                      }}
                                    >
                                      {clickedObject.propertyres_image.map(
                                        (propertyres_image, index) => (
                                          <img
                                            key={index}
                                            src={propertyres_image}
                                            alt="Property Details"
                                            onClick={() => {
                                              setSelectedImage(
                                                propertyres_image
                                              );
                                              setOpen(true);
                                            }}
                                            style={{
                                              width: "200px",
                                              height: "150px",
                                              // objectFit: "cover",
                                              margin: "10px",
                                              borderRadius: "20px",
                                              "@media (max-width: 768px)": {
                                                width: "100%", // Full-width on smaller screens
                                              },
                                            }}
                                          />
                                        )
                                      )}
                                      <OpenImageDialog
                                        open={open}
                                        setOpen={setOpen}
                                        selectedImage={selectedImage}
                                      />
                                    </div>
                                  )}
                                {clickedObject.property_image &&
                                  clickedObject.property_image.length > 0 && (
                                    <div
                                      style={{
                                        width: "100%", // Expands to full width by default
                                      }}
                                    >
                                      {clickedObject.property_image.map(
                                        (property_image, index) => (
                                          <img
                                            key={index}
                                            src={property_image}
                                            alt="Property Details"
                                            style={{
                                              width: "100px",
                                              height: "100px",
                                              // objectFit: "cover",
                                              margin: "10px",
                                              borderRadius: "10px",
                                              "@media (max-width: 768px)": {
                                                width: "100%", // Full-width on smaller screens
                                              },
                                            }}
                                          />
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                            </Grid> */}
                            <div className="din d-flex">
                              <div className="col-md-4 mt-2">
                                <label htmlFor="unit_image">
                                  <img
                                    // src="https://gecbhavnagar.managebuilding.com/manager/client/static-images/photo-sprite-property.png"
                                    src={
                                      clickedObject &&
                                      clickedObject.property_image.length > 0
                                        ? clickedObject.property_image[0]
                                          ? clickedObject.property_image[0]
                                          : clickedObject.propertyres_image[0]
                                          ? clickedObject.propertyres_image[0]
                                          : fone
                                        : fone
                                    }
                                    className="img-fluid rounded-start card-image"
                                    alt="..."
                                    // width='260px'
                                    // height='18px'
                                    // onClick={handleModalOpen}
                                  />
                                </label>
                                {/* <TextField
                                  id="unit_image"
                                  name="unit_image"
                                  type="file"
                                  inputProps={{
                                    accept: "image/*",
                                    multiple: true,
                                  }}
                                  onChange={handleImageChange}
                                  style={{ display: "none" }}
                                /> */}
                              </div>
                              <Grid
                                item
                                md={8}
                                style={{
                                  width: "100%",
                                  marginLeft: "20px",
                                }}
                              >
                                <div>
                                  {console.log(clickedObject, "clickedObject")}
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontSize: "18px",
                                      textTransform: "capitalize",
                                      color: "#5E72E4",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {clickedObject.rental_unitsAdress}
                                    <span
                                      className="text-sm"
                                      style={{
                                        cursor: "pointer",
                                        color: "black",
                                        marginLeft: "10px",
                                      }}
                                      onClick={() => {
                                        setEditUnitDialogOpen(
                                          !editUnitDialogOpen
                                        );
                                        console.log(
                                          clickedObject,
                                          "clicked object 1438"
                                        );
                                        addUnitFormik.setValues({
                                          unit_number:
                                            clickedObject.rental_units,
                                          address: clickedObject.rental_adress,
                                          city: clickedObject.rental_city,
                                          state: clickedObject.rental_state,
                                          zip: clickedObject.rental_postcode,
                                          country: clickedObject.rental_country,
                                        });
                                      }}
                                    >
                                      {" "}
                                      <Button
                                        size="sm"
                                        style={{
                                          background: "white",
                                          color: "blue",
                                          // marginRight: "10px",
                                        }}
                                        onClick={() => {
                                          setEditUnitDialogOpen(
                                            !editUnitDialogOpen
                                          );
                                        }}
                                      >
                                        Edit
                                      </Button>
                                    </span>
                                    <hr style={{ marginTop: "10px" }} />
                                  </Typography>
                                </div>
                                <span style={{ marginTop: "0px" }}>
                                  ADDRESS
                                  <br />
                                  {clickedObject?.rental_units +
                                    ", " +
                                    clickedObject?.rental_adress +
                                    ", " +
                                    clickedObject?.rental_city || "N/A"}
                                  <br />
                                  {clickedObject?.rental_state +
                                    ", " +
                                    clickedObject?.rental_postcode +
                                    ", " +
                                    clickedObject?.rental_country || "N/A"}
                                </span>
                                {/* i want to put this div to the extreme rigth of main div */}
                              </Grid>
                            </div>

                            <Grid item xs={3}></Grid>
                            <Grid item xs={9}>
                              {editUnitDialogOpen ? (
                                <>
                                  <Row>
                                    <Col md={11}>
                                      <Card style={{ position: "relative" }}>
                                        <CloseIcon
                                          style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "10px",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            setEditUnitDialogOpen(
                                              !editUnitDialogOpen
                                            );
                                          }}
                                        />
                                        <CardBody>
                                          {/* <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText> */}
                                          <form
                                            onSubmit={
                                              addUnitFormik.handleSubmit
                                            }
                                          >
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                              }}
                                            >
                                              <div>
                                                <h5>Unit Number</h5>
                                              </div>
                                              <TextField
                                                type="text"
                                                size="small"
                                                id="unit_number"
                                                name="unit_number"
                                                value={
                                                  addUnitFormik.values
                                                    .unit_number
                                                }
                                                onChange={
                                                  addUnitFormik.handleChange
                                                }
                                                onBlur={
                                                  addUnitFormik.handleBlur
                                                }
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
                                                <h5>Street Address</h5>
                                              </div>
                                              <TextField
                                                type="text"
                                                size="small"
                                                id="address"
                                                name="address"
                                                value={
                                                  addUnitFormik.values.address
                                                }
                                                onChange={
                                                  addUnitFormik.handleChange
                                                }
                                                onBlur={
                                                  addUnitFormik.handleBlur
                                                }
                                              />
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                marginTop: "10px",
                                              }}
                                            >
                                              <div>
                                                <div>
                                                  <h5>City</h5>
                                                </div>
                                                <TextField
                                                  type="text"
                                                  size="small"
                                                  id="city"
                                                  name="city"
                                                  value={
                                                    addUnitFormik.values.city
                                                  }
                                                  onChange={
                                                    addUnitFormik.handleChange
                                                  }
                                                  onBlur={
                                                    addUnitFormik.handleBlur
                                                  }
                                                />
                                              </div>
                                              <div
                                                style={{ marginLeft: "10px" }}
                                              >
                                                <div>
                                                  <h5>State</h5>
                                                </div>
                                                <TextField
                                                  type="text"
                                                  size="small"
                                                  id="state"
                                                  name="state"
                                                  value={
                                                    addUnitFormik.values.state
                                                  }
                                                  onChange={
                                                    addUnitFormik.handleChange
                                                  }
                                                  onBlur={
                                                    addUnitFormik.handleBlur
                                                  }
                                                />
                                              </div>
                                              <div
                                                style={{ marginLeft: "10px" }}
                                              >
                                                <div>
                                                  <h5>Zip</h5>
                                                </div>
                                                <TextField
                                                  type="text"
                                                  size="small"
                                                  id="zip"
                                                  name="zip"
                                                  value={
                                                    addUnitFormik.values.zip
                                                  }
                                                  onChange={
                                                    addUnitFormik.handleChange
                                                  }
                                                  onBlur={
                                                    addUnitFormik.handleBlur
                                                  }
                                                />
                                              </div>
                                            </div>

                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                              }}
                                            >
                                              <div
                                                style={{ marginTop: "10px" }}
                                              >
                                                <h5>Country</h5>
                                              </div>
                                              <TextField
                                                type="text"
                                                size="small"
                                                id="country"
                                                name="country"
                                                value={
                                                  addUnitFormik.values.country
                                                }
                                                onChange={
                                                  addUnitFormik.handleChange
                                                }
                                                onBlur={
                                                  addUnitFormik.handleBlur
                                                }
                                              />
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
                                                      onClick={
                                                        togglePhotoresDialog
                                                      }
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
                                                        id={`unit_img`}
                                                        name={`unit_img`}
                                                        onChange={(e) => {
                                                          const file = [
                                                            ...e.target.files,
                                                          ];
                                                          fileData(
                                                            file,
                                                            "propertyres_image",
                                                            ""
                                                          );
                                                          if (file.length > 0) {
                                                            const allImages =
                                                              file.map(
                                                                (file) => {
                                                                  return URL.createObjectURL(
                                                                    file
                                                                  );
                                                                }
                                                              );
                                                            // console.log(
                                                            //    "",
                                                            //   "indexxxxxx"
                                                            // );
                                                            if (unitImage[""]) {
                                                              setUnitImage([
                                                                ...unitImage.slice(
                                                                  0,
                                                                  ""
                                                                ),
                                                                [
                                                                  ...unitImage[
                                                                    ""
                                                                  ],
                                                                  ...allImages,
                                                                ],
                                                                ...unitImage.slice(
                                                                  1 + ""
                                                                ),
                                                              ]);
                                                            } else {
                                                              setUnitImage([
                                                                ...allImages,
                                                              ]);
                                                            }
                                                          } else {
                                                            setUnitImage([
                                                              ...unitImage,
                                                            ]);
                                                            // )
                                                          }
                                                        }}
                                                      />
                                                      {console.log(
                                                        unitImage,
                                                        "unitImage"
                                                      )}
                                                      <label
                                                        htmlFor={`unit_img`}
                                                      >
                                                        <b
                                                          style={{
                                                            fontSize: "20px",
                                                          }}
                                                        >
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
                                                    <div className="d-flex">
                                                      {unitImage &&
                                                        unitImage.length > 0 &&
                                                        unitImage.map(
                                                          (unitImg, index) => (
                                                            <div
                                                              key={unitImg}
                                                              style={{
                                                                position:
                                                                  "relative",
                                                                width: "100px",
                                                                height: "100px",
                                                                margin: "10px",
                                                                display: "flex",
                                                                flexDirection:
                                                                  "column",
                                                              }}
                                                            >
                                                              <img
                                                                src={unitImg}
                                                                alt=""
                                                                style={{
                                                                  width:
                                                                    "100px",
                                                                  height:
                                                                    "100px",
                                                                  maxHeight:
                                                                    "100%",
                                                                  maxWidth:
                                                                    "100%",
                                                                  borderRadius:
                                                                    "10px",
                                                                  // objectFit: "cover",
                                                                }}
                                                                onClick={() => {
                                                                  setSelectedImage(
                                                                    unitImg
                                                                  );
                                                                  setOpen(true);
                                                                }}
                                                              />
                                                              <ClearIcon
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  alignSelf:
                                                                    "flex-start",
                                                                  position:
                                                                    "absolute",
                                                                  top: "-12px",
                                                                  right:
                                                                    "-12px",
                                                                }}
                                                                onClick={() =>
                                                                  clearSelectedPhoto(
                                                                    index,
                                                                    unitImage,
                                                                    "propertyres_image"
                                                                  )
                                                                }
                                                              />
                                                            </div>
                                                          )
                                                        )}
                                                      <OpenImageDialog
                                                        open={open}
                                                        setOpen={setOpen}
                                                        selectedImage={
                                                          selectedImage
                                                        }
                                                      />
                                                    </div>
                                                  </FormGroup>
                                                </div>
                                              </Col>
                                            </div>

                                            <div style={{ marginTop: "10px" }}>
                                              <Button
                                                color="success"
                                                type="submit"
                                                onClick={() => {
                                                  handleUnitDetailsEdit(
                                                    clickedObject._id,
                                                    clickedObject.rentalId
                                                  );
                                                  // setIsEdit(false);
                                                  setEditUnitDialogOpen(
                                                    !editUnitDialogOpen
                                                  );
                                                }}
                                              >
                                                Save
                                              </Button>
                                              <Button
                                                onClick={() => {
                                                  setEditUnitDialogOpen(
                                                    !editUnitDialogOpen
                                                  );
                                                }}
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </form>
                                        </CardBody>
                                      </Card>
                                    </Col>
                                  </Row>
                                </>
                              ) : null}
                            </Grid>
                            <Grid item xs="12" style={{ marginTop: "20px" }}>
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
                                  <Col>
                                    Listing Information{" "}
                                    <Button
                                      size="sm"
                                      style={{
                                        background: "white",
                                        color: "blue",
                                        marginBottom: "5px",
                                      }}
                                      onClick={() => {
                                        console.log(
                                          clickedObject,
                                          "clickedObject"
                                        );
                                        addUnitFormik.setValues({
                                          market_rent:
                                            clickedObject.market_rent,
                                          size: clickedObject.rental_sqft,
                                          description:
                                            clickedObject.description,
                                        });
                                        setEditListingData(!editListingData);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  </Col>
                                </Row>
                                <Row
                                  className="w-100 mb-1 "
                                  style={{
                                    fontSize: "10px",
                                    textTransform: "uppercase",
                                    color: "#aaa",
                                  }}
                                >
                                  <Col>Market Rent</Col>
                                  <Col>Size</Col>
                                  <Col>Description</Col>
                                  <Col></Col>
                                </Row>
                                {console.log(clickedObject.values, "clduhjik")}
                                <Row
                                  className="w-100 mt-1  mb-5"
                                  style={{
                                    fontSize: "12px",
                                    textTransform: "capitalize",
                                    color: "#000",
                                  }}
                                >
                                  <Col>
                                    {clickedObject.market_rent || "N/A"}
                                  </Col>
                                  <Col>
                                    {clickedObject.rental_sqft || "N/A"}
                                  </Col>
                                  <Col style={{ textTransform: "lowercase" }}>
                                    {clickedObject.description || "N/A"}
                                  </Col>
                                  <Col></Col>
                                </Row>
                              </>
                              {editListingData ? (
                                <Row>
                                  <Col>
                                    <Card style={{ position: "relative" }}>
                                      <CloseIcon
                                        onClick={() => {
                                          setEditListingData(!editListingData);
                                        }}
                                        style={{
                                          position: "absolute",
                                          top: "10px",
                                          right: "10px",
                                          cursor: "pointer",
                                        }}
                                      />
                                      <CardBody>
                                        <form
                                          onSubmit={addUnitFormik.handleSubmit}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              width: "50%",
                                            }}
                                          >
                                            <div>
                                              <h5>Market Rent</h5>
                                            </div>

                                            <TextField
                                              type="number"
                                              size="small"
                                              id="market_rent"
                                              name="market_rent"
                                              value={
                                                addUnitFormik.values.market_rent
                                              }
                                              onChange={
                                                addUnitFormik.handleChange
                                              }
                                              onBlur={addUnitFormik.handleBlur}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              width: "50%",
                                              marginTop: "10px",
                                            }}
                                          >
                                            <div>
                                              <h5>Size</h5>
                                            </div>

                                            <TextField
                                              type="number"
                                              size="small"
                                              id="size"
                                              name="size"
                                              value={addUnitFormik.values.size}
                                              onChange={
                                                addUnitFormik.handleChange
                                              }
                                              onBlur={addUnitFormik.handleBlur}
                                            />
                                          </div>

                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                              marginTop: "10px",
                                            }}
                                          >
                                            <div>
                                              <div>
                                                <h5>Description</h5>
                                              </div>
                                              <Input
                                                type="textarea"
                                                id="description"
                                                name="description"
                                                value={
                                                  addUnitFormik.values
                                                    .description
                                                }
                                                onChange={
                                                  addUnitFormik.handleChange
                                                }
                                                onBlur={
                                                  addUnitFormik.handleBlur
                                                }
                                              />
                                            </div>
                                          </div>

                                          <div style={{ marginTop: "10px" }}>
                                            <Button
                                              color="success"
                                              type="submit"
                                              onClick={() => {
                                                // handleUnitDetailsEdit(
                                                //   clickedObject._id
                                                // );
                                                // // setIsEdit(false);
                                                // setEditUnitDialogOpen(
                                                //   !editUnitDialogOpen
                                                // );
                                                handleListingEdit(
                                                  clickedObject._id,
                                                  clickedObject.rentalId
                                                );

                                                setEditListingData(
                                                  !editListingData
                                                );
                                              }}
                                            >
                                              Save
                                            </Button>
                                            <Button
                                              onClick={() => {
                                                setEditListingData(
                                                  !editListingData
                                                );
                                              }}
                                            >
                                              Cancel
                                            </Button>
                                          </div>
                                        </form>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                </Row>
                              ) : null}

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
                                <Col>Leases</Col>
                              </Row>
                              <Row
                                className="mb-1 m-0 p-0"
                                style={{ fontSize: "12px", color: "#000" }}
                              >
                                <Table responsive>
                                  <tbody
                                    className="tbbody p-0 m-0"
                                    style={{
                                      borderTopRightRadius: "5px",
                                      borderTopLeftRadius: "5px",
                                      borderBottomLeftRadius: "5px",
                                      borderBottomRightRadius: "5px",
                                    }}
                                  >
                                    <tr className="header">
                                      <th>Status</th>
                                      <th>Start - End</th>
                                      <th>Tenant</th>
                                      <th>Type</th>
                                      <th>Rent</th>
                                    </tr>
                                    {console.log(
                                      "clickedObject",
                                      clickedObject
                                    )}
                                    {clickedObject &&
                                    clickedObject.tenant_firstName &&
                                    clickedObject.tenant_lastName ? (
                                      <>
                                        <tr className="body">
                                          <td>
                                            {clickedObject.start_date
                                              ? "Active"
                                              : "Inactive"}
                                          </td>
                                          <td>
                                            {clickedObject.start_date &&
                                            clickedObject.end_date ? (
                                              <>
                                                <Link
                                                  to={`/admin/tenantdetail/${clickedObject._id}`}
                                                  onClick={(e) => {
                                                    // Handle any additional actions onClick if needed
                                                    // console.log(
                                                    //   item._id,
                                                    //   "Tenant Id"
                                                    // );
                                                    // console.log(
                                                    //   item.entries.entryIndex,
                                                    //   "Entry Index"
                                                    // );
                                                  }}
                                                >
                                                  {formatDateWithoutTime(
                                                    clickedObject.start_date
                                                  ) +
                                                    "-" +
                                                    formatDateWithoutTime(
                                                      clickedObject.end_date
                                                    )}
                                                </Link>
                                              </>
                                            ) : (
                                              "N/A"
                                            )}
                                          </td>
                                          <td>
                                            {clickedObject.tenant_firstName &&
                                            clickedObject.tenant_lastName
                                              ? clickedObject.tenant_firstName +
                                                " " +
                                                clickedObject.tenant_lastName
                                              : "N/A"}
                                          </td>
                                          <td>
                                            {clickedObject.lease_type || "N/A"}
                                          </td>
                                          <td>
                                            {clickedObject.amount || "N/A"}
                                          </td>
                                        </tr>
                                      </>
                                    ) : (
                                      <Row>
                                        <Col>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                          >
                                            You don't have any leases for this
                                            unit right now.
                                          </Typography>
                                        </Col>
                                      </Row>
                                    )}
                                  </tbody>
                                </Table>
                              </Row>
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
                                <Col>
                                  Appliances{" "}
                                  <Button
                                    size="sm"
                                    style={{
                                      background: "white",
                                      color: "blue",
                                      marginBottom: "5px",
                                      // marginRight: "10px",
                                    }}
                                    onClick={() => {
                                      setAddAppliances(!addAppliances);
                                    }}
                                  >
                                    Add
                                  </Button>
                                </Col>
                              </Row>
                              {addAppliances ? (
                                <>
                                  <Row>
                                    <Col md={11}>
                                      <Card style={{ position: "relative" }}>
                                        <CloseIcon
                                          style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "10px",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            setAddAppliances(!addAppliances);
                                          }}
                                        />
                                        <CardBody>
                                          <form
                                            onSubmit={
                                              addUnitFormik.handleSubmit
                                            }
                                          >
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
                                                id="appliance_name"
                                                name="appliance_name"
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
                                                <h5>Description</h5>
                                              </div>
                                              <TextField
                                                type="textarea"
                                                size="small"
                                                id="appliance_description"
                                                name="appliance_description"
                                              />
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                marginTop: "10px",
                                              }}
                                            >
                                              <div>
                                                <div>
                                                  <h5>Installed Date</h5>
                                                </div>
                                                <TextField
                                                  type="date"
                                                  size="small"
                                                  id="installed_date"
                                                  name="installed_date"
                                                />
                                              </div>
                                            </div>
                                            <div style={{ marginTop: "10px" }}>
                                              <Button
                                                color="success"
                                                type="submit"
                                                onClick={() => {
                                                  setAddAppliances(
                                                    !addAppliances
                                                  );
                                                }}
                                              >
                                                Save
                                              </Button>
                                              <Button
                                                onClick={() => {
                                                  setAddAppliances(
                                                    !addAppliances
                                                  );
                                                }}
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </form>
                                        </CardBody>
                                      </Card>
                                    </Col>
                                  </Row>
                                </>
                              ) : (
                                <>
                                  {clickedObject.appliances ? (
                                    <>
                                      {clickedObject.appliances.map(
                                        (appliance, index) => {
                                          <Row key={index}>
                                            <Col>{appliance}</Col>
                                          </Row>;
                                        }
                                      )}
                                    </>
                                  ) : (
                                    <Row>
                                      <Col>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                          component="p"
                                        >
                                          You don't have any appliances for this
                                          unit right now.
                                        </Typography>
                                      </Col>
                                    </Row>
                                  )}
                                </>
                              )}
                            </Grid>
                          </Grid>
                          <Grid container md={3}>
                            <Grid item md={12}>
                              <Paper elevation={2}>
                                <Card
                                  style={{
                                    backgroundColor: "lightgrey",
                                  }}
                                >
                                  <CardBody
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      padding: "20px", // Add padding for spacing
                                    }}
                                  >
                                    {/* <span
                                      style={{
                                        fontSize: "14px", // Increase font size
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        marginBottom: "10px", // Add margin for spacing
                                      }}
                                    >
                                      Listing
                                    </span>
                                    <span>{clickedObject.unitCreatedAt}</span>
                                    <span style={{ margin: "5px 0" }}>
                                      $900 available {moment().format("DD/MM/YYYY ")}
                                    </span> */}
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        marginTop: "15px", // Add margin for spacing
                                      }}
                                    >
                                      Lease
                                    </span>
                                    <Button
                                      className="btn"
                                      style={{
                                        marginTop: "5px", // Add margin for spacing
                                      }}
                                      onClick={() => {
                                        // const navigate = useNavigate();
                                        navigate(`/admin/Leaseing`);
                                      }}
                                    >
                                      Add Lease
                                    </Button>
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        marginTop: "15px",
                                      }}
                                    >
                                      Rental Applications
                                    </span>
                                    <Button
                                      size="small"
                                      style={{
                                        marginTop: "5px",
                                      }}
                                      onClick={() => {
                                        navigate(`/admin/Applicants`);
                                      }}
                                    >
                                      Create Applicant
                                    </Button>{" "}
                                  </CardBody>
                                </Card>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* </tbody> */}
                      </>
                      //   </Table>
                      // </div>
                    )}
                  </TabPanel>
                </TabContext>
                {/* <h3 className="mb-0">Summary</h3> */}
              </Col>
            </Card>
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default PropDetails;
