import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import {
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import LogoutIcon from "@mui/icons-material/Logout";
// import * as React from 'react';
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
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
import MailIcon from "@mui/icons-material/Mail";

const PropDetails = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_URL;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");
  const { rentla_id } = useParams();
  const { id, entryIndex } = useParams();
  const [propertyDetails, setpropertyDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let navigate = useNavigate();
  const [matchedProperty, setMatchedProperty] = useState({});
  // const [propertyId, setPropertyId] = useState(null);
  const [propertyUnit, setPropertyUnit] = useState([]);
  const [editListingData, setEditListingData] = useState(false);
  const [RentAdd, setRentAdd] = useState({});
  const [propType, setPropType] = useState("");
  const [selectedProp, setSelectedProp] = useState("");
  // const [balance, setBalance] = useState("");

  const [multiUnit, setMultiUnit] = useState(null);
  const [isPhotoresDialogOpen, setPhotoresDialogOpen] = useState(false);
  const [unitImage, setUnitImage] = useState([]);

  const togglePhotoresDialog = () => {
    setPhotoresDialogOpen((prevState) => !prevState);
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [unitImageLoader, setUnitImageLoader] = useState(false);
  const fileData = (e, type) => {
    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...e.target.files,
    ]);

    const newFiles = [
      ...unitImage,
      ...Array.from(e.target.files).map((file) => URL.createObjectURL(file)),
    ];

    setUnitImage(newFiles);
  };

  console.log(propType, "proeptype");
  const clearSelectedPhoto = (index, name) => {
    if (name === "propertyres_image") {
      const filteredImage = unitImage.filter((item, i) => i !== index);

      const filteredImage2 = selectedFiles.filter((item, i) => i !== index);
      setSelectedFiles(filteredImage2);
      setUnitImage(filteredImage);
    }
  };
  const getRentalsData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/rentals/rentals_summary/${rentla_id}`
      );

      setpropertyDetails(response.data.data);
      const rentalId = response.data.data._id;
      getUnitProperty(rentalId);
      const matchedProperty = response.data.data.entries.find(
        (property) => property._id === entryIndex
      );

      setMatchedProperty(matchedProperty);
      getTasks(matchedProperty.rental_adress);
      setRentAdd(matchedProperty.rental_adress);
      console.log(matchedProperty, `matched property`);
      setLoading(false);
      setPropImageLoader(false);
      setUnitImageLoader(false);

      const resp = await axios.get(
        `
        ${baseUrl}/newproparty/propropartytype
        `
      );

      const selectedType = Object.keys(resp.data.data).find((item) => {
        return resp.data.data[item].some(
          (data) => data.propertysub_type === matchedProperty.property_type
          // setSelectedProp
        );
      });
      setSelectedProp(matchedProperty.property_type);

      setPropType(selectedType);
      const isMultiUnits = resp.data.data[selectedType].filter((item) => {
        return item.propertysub_type === matchedProperty.property_type;
      });
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
  }, [matchedProperty]);

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
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
    "All",
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
  const [openEdite, setOpenEdite] = useState("");
  const closeModal = () => {
    setOpenEdite(false);
  };
  const [propId, setPropId] = useState("");
  console.log(propId, "propertyId");
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
    getUnitProperty(propId);
  }, [propId]);

  const getUnitProperty = async (propId) => {
    await axios
      .get(`${baseUrl}/propertyunit/propertyunits/${entryIndex}`)
      .then((res) => {
        // setUnitProperty(res.data.data);
        console.log(entryIndex, "mina-----------");
        console.log(res.data.data, "property unit");
        setPropertyUnit(res.data.data);
        const matchedUnit = res.data.data.filter((item) => item._id === propId);
        console.log(matchedUnit, "matchedUnit");
        setClickedObject(matchedUnit[0]);
        const propertyresImage = matchedUnit[0].propertyres_image || [];
        const propertyImage = matchedUnit[0].property_image || [];

        // Check for the first non-empty value among propertyres_image and property_image
        const firstNonEmptyImage =
          propertyresImage.length > 0
            ? propertyresImage
            : propertyImage.length > 0
            ? propertyImage
            : [];
        setUnitImage(firstNonEmptyImage);
        setSelectedFiles(firstNonEmptyImage);
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
    if (Array.isArray(selectedFiles)) {
      for (const [index, files] of selectedFiles.entries()) {
        if (files instanceof File) {
          const imageData = new FormData();
          imageData.append(`files`, files);

          const url = `${imageUrl}/images/upload`;

          try {
            const result = await axios.post(url, imageData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            selectedFiles[index] = result.data.files[0].url;
          } catch (error) {
            console.error(error);
          }
        } else {
          console.log(selectedFiles, "imgs");
        }
      }
    }
    if (propType === "Residential") {
      const updatedValues = {
        rental_unitsAdress: addUnitFormik.values.address1,
        rental_units: addUnitFormik.values.unit_number,
        rental_city: addUnitFormik.values.city,
        rental_state: addUnitFormik.values.state,
        rental_postcode: addUnitFormik.values.zip,
        rental_country: addUnitFormik.values.country,
        propertyres_image: selectedFiles,
      };
      await axios
        .put(`${baseUrl}/propertyunit/propertyunit/` + id, updatedValues)
        .then((response) => {
          console.log(response.data, "updated data");
          getUnitProperty(id);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(clickedObject, "clickedObject after update");
    } else {
      const updatedValues = {
        rental_unitsAdress: addUnitFormik.values.address1,
        rental_units: addUnitFormik.values.unit_number,
        rental_city: addUnitFormik.values.city,
        rental_state: addUnitFormik.values.state,
        rental_postcode: addUnitFormik.values.zip,
        rental_country: addUnitFormik.values.country,
        property_image: selectedFiles,
      };
      await axios
        .put(`${baseUrl}/propertyunit/propertyunit/` + id, updatedValues)
        .then((response) => {
          console.log(response.data.data, "updated data");
          getUnitProperty(id);

          // setAddUnitDialogOpen(false);
          // setAddUnitDialogOpen(false);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(clickedObject, "clickedObject after update");
    }
  };

  const [tasks, setTasks] = useState([]);
  const getTasks = async (rentalAddress) => {
    await axios
      .get(`${baseUrl}/workorder/workorder/${rentalAddress}`)
      .then((res) => {
        console.log(res, "tasks");
        setTasks(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
        getUnitProperty(id);
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

    const imageData = new FormData();
    for (let index = 0; index < selectedFiles.length; index++) {
      const element = selectedFiles[index];
      imageData.append(`files`, element);
    }

    const url = `${imageUrl}/images/upload`; // Use the correct endpoint for multiple files upload
    var image;
    try {
      const result = await axios.post(url, imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(result, "imgs");
      image = {
        prop_image: result.data.files.map((data, index) => {
          return data.url;
        }),
      };
    } catch (error) {
      console.error(error);
    }

    const formData = {
      rental_adress: RentAdd,
      rentalId: id,
      description: addUnitFormik.values.description,
      market_rent: addUnitFormik.values.market_rent,
      rental_bed: addUnitFormik.values.rooms,
      rental_bath: addUnitFormik.values.baths,
      propertyres_image: propType === "Residential" ? [image.prop_image] : "",
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
      property_image: propType === "Residential" ? "" : [image.prop_image],
    };
    try {
      const response = await axios.post(
        `${baseUrl}/propertyunit/propertyunit`,
        formData
      );
      if (response.data.statusCode === 200) {
        swal("Success!", "Unit Added Successfully", "success");
        setAddUnitDialogOpen(false);
        setPropertyUnit([...propertyUnit, response.data.data]);
        console.log(response.data.data);
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
    formData.append(`files`, files[0]);
    const url = `${imageUrl}/images/upload`; // Use the correct endpoint for multiple files upload
    var image;
    try {
      const result = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(result, "imgs");
      image = {
        prop_image: result.data.files[0].url,
      };
    } catch (error) {
      console.error(error, "imgs");
    }
    axios
      .put(`${baseUrl}/rentals/proparty_image/${id}/${entryIndex}`, image)
      .then((response) => {
        console.log(response.data, "updated data");
        getRentalsData();
      })
      .catch((err) => {
        console.log(err);
      });
    setPropImageLoader(false);
  };

  // const filterRentalsBySearch = () => {
  //   if (!searchQuery) {
  //     return GeneralLedgerData.flatMap((item) => {
  //       return item.paymentAndCharges.map((payment) => ({
  //         paymentAndCharges: payment,
  //         unit: item.unit,
  //         unit_id: item.unit_id,
  //         _id: item._id,
  //       }));
  //     });
  //   }

  //   const allPaymentAndCharges = GeneralLedgerData.flatMap((item) => {
  //     return item.paymentAndCharges.map((payment) => ({
  //       paymentAndCharges: payment,
  //       unit: item.unit,
  //       unit_id: item.unit_id,
  //       _id: item._id,
  //     }));
  //   });

  //   return allPaymentAndCharges.filter((rental) => {
  //     // const lowerCaseQuery = searchQuery.toLowerCase();
  //     return (
  //       (rental.paymentAndCharges.charges_account &&
  //         rental.paymentAndCharges.charges_account.includes(
  //           searchQuery.toLowerCase()
  //         )) ||
  //       (rental.paymentAndCharges.account &&
  //         rental.paymentAndCharges.account
  //           .toLowerCase()
  //           .includes(searchQuery.toLowerCase())) ||
  //       (rental.paymentAndCharges.type &&
  //         rental.paymentAndCharges.type
  //           .toLowerCase()
  //           .includes(searchQuery.toLowerCase())) ||
  //       (rental.paymentAndCharges.charges_memo &&
  //         rental.paymentAndCharges.charges_memo
  //           .toLowerCase()
  //           .includes(searchQuery.toLowerCase())) ||
  //       (rental.paymentAndCharges.memo &&
  //         rental.paymentAndCharges.memo
  //           .toLowerCase()
  //           .includes(searchQuery.toLowerCase())) ||
  //       (rental.paymentAndCharges.amount &&
  //         rental.paymentAndCharges.amount
  //           .toString()
  //           .includes(searchQuery.toLowerCase()))
  //     );
  //   });
  // };

  const [GeneralLedgerData, setGeneralLedgerData] = useState([]);
  const [loader, setLoader] = useState(false);

  const getGeneralLedgerData = async () => {
    setLoader(true);

    if (matchedProperty) {
      try {
        const rental = matchedProperty?.rental_adress;
        if (rental && id) {
          // First API call
          const urlFinancial = `${baseUrl}/payment_charge/property_financial?rental_adress=${rental}&property_id=${id}`;

          let dataFinancial;
          try {
            const responseFinancial = await axios.get(urlFinancial);

            if (responseFinancial.data && responseFinancial.data.data) {
              dataFinancial = responseFinancial.data.data[0] || [{ unit: [] }];
            } else {
              console.error(
                "Unexpected response format:",
                responseFinancial.data
              );
            }
          } catch (error) {
            console.error("Error fetching financial data:", error);
          }

          // Second API call
          const urlExpense = `${baseUrl}/payment_charge/property_financial/property_expense?rental_adress=${rental}&property_id=${id}`;

          let dataExpense;
          try {
            const responseExpense = await axios.get(urlExpense);

            if (responseExpense.data && responseExpense.data.data) {
              dataExpense = responseExpense.data.data[0];
            } else {
              console.error(
                "Unexpected response format:",
                responseExpense.data
              );
            }
          } catch (error) {
            console.error("Error fetching expense data:", error);
          }

          // Merge data from both API calls
          const combinedData = {
            _id: "mergedId", // Provide a unique identifier for the merged data if needed
            properties: {},
            unit: [],
            __v: 0,
          };

          if (dataFinancial && dataFinancial.unit) {
            combinedData.unit = dataFinancial.unit.map(
              (financialUnit, index) => {
                const combinedUnit = {
                  ...financialUnit,
                  paymentAndCharges: financialUnit.paymentAndCharges || [],
                  property_expense: [],
                };

                if (
                  dataExpense &&
                  dataExpense.unit &&
                  dataExpense.unit[index]
                ) {
                  combinedUnit.property_expense =
                    dataExpense.unit[index].property_expense || [];
                }

                return combinedUnit;
              }
            );
          } else if (dataExpense && dataExpense.unit) {
            combinedData.unit = dataExpense.unit.map((expenseUnit) => ({
              paymentAndCharges: [],
              property_expense: expenseUnit.property_expense || [],
            }));
          }

          setGeneralLedgerData([combinedData]);
        } else {
          console.error("Invalid matchedProperty object:", matchedProperty);
        }
      } catch (error) {
        console.error("Error processing matchedProperty:", error);
      }
    }
    setLoader(false);
  };

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

  const monthWiseData = {};

  GeneralLedgerData.forEach((property) => {
    property.unit.forEach((unit) => {
      if (unit.paymentAndCharges) {
        unit.paymentAndCharges.forEach((charge) => {
          const chargeDate = moment(charge.date);
          const chargeMonth = chargeDate.format("MMMM");

          if (!monthWiseData[chargeMonth]) {
            monthWiseData[chargeMonth] = [];
          }

          // Add charge data to the corresponding month
          monthWiseData[chargeMonth].push({
            account: charge.account,
            amount: charge.amount || "0.00",
          });
        });
      }
    });
  });

  const monthWiseData2 = {};

  GeneralLedgerData.forEach((property) => {
    property.unit.forEach((unit) => {
      if (unit.property_expense) {
        unit.property_expense.forEach((charge) => {
          const chargeDate = moment(charge.date);
          const chargeMonth = chargeDate.format("MMMM");

          if (!monthWiseData2[chargeMonth]) {
            monthWiseData2[chargeMonth] = [];
          }

          // Add charge data to the corresponding month
          monthWiseData2[chargeMonth].push({
            account: charge.account,
            amount: charge.amount || "0.00",
          });
        });
      }
    });
  });

  const totals = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  };

  const totals2 = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  };

  // Iterate over the data to calculate totals
  threeMonths.forEach((months, index) => {
    if (monthWiseData[months]) {
      monthWiseData[months].forEach((data) => {
        totals[index] += data.amount || 0;
      });
    }
  });

  if (monthWiseData[month]) {
    monthWiseData[month].forEach((data) => {
      totals[2] += data.amount || 0;
    });
  }

  threeMonths.forEach((months, index) => {
    if (monthWiseData2[months]) {
      monthWiseData2[months].forEach((data) => {
        totals2[index] += data.amount || 0;
      });
    }
  });

  if (monthWiseData2[month]) {
    monthWiseData2[month].forEach((data) => {
      totals2[2] += data.amount || 0;
    });
  }

  const totalIncome = monthWiseData[month]?.reduce(
    (total, data) => total + parseFloat(data.amount || 0),
    0
  );

  // Calculate total expenses
  const totalExpenses = monthWiseData2[month]?.reduce(
    (total, data) => total + parseFloat(data.amount || 0),
    0
  );

  // Calculate net income
  const netIncome = totalIncome - totalExpenses || 0;
  const [showModal, setShowModal] = useState(false);
  const [moveOutDate, setMoveOutDate] = useState("");
  const [noticeGivenDate, setNoticeGivenDate] = useState("");
  const [rentaldata, setRentaldata] = useState([]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleMoveOutClick = () => {
    setShowModal(true);
  };

  const handleMoveout = (id, index) => {
    if (moveOutDate && noticeGivenDate) {
      const updatedApplicant = {
        moveout_date: moveOutDate,
        moveout_notice_given_date: noticeGivenDate,
        end_date: moveOutDate,
      };

      axios
        .put(`${baseUrl}/tenant/moveout/${id}/${index}`, updatedApplicant)
        .then((res) => {
          console.log(res, "res");
          if (res.data.statusCode === 200) {
            swal("Success!", "Move-out Successfully", "success");
            handleModalClose();
            tenantsData();
          }
        })
        .catch((err) => {
          swal("Error", "An error occurred while Move-out", "error");
          console.error(err);
        });
    } else {
      swal(
        "Error",
        "NOTICE GIVEN DATE && MOVE-OUT DATE must be required",
        "error"
      );
    }
  };

  const tenantsData = async () => {
    // Construct the API URL
    setLoading(true);
    let apiUrl;
    apiUrl = `${baseUrl}/tenant/tenant-detail/tenants/${matchedProperty.rental_adress}`;

    try {
      // Fetch tenant data
      const response = await axios.get(apiUrl);
      const tenantData = response.data.data;
      setTimeout(() => {
        setRentaldata(tenantData);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    tenantsData();
  }, [matchedProperty]);

  const openEditeTab = (event, unit) => {
    event.stopPropagation();
    setOpenEdite(true);
    setPropId(unit._id);
    getUnitProperty(unit._id);
    setClickedObject(unit);
    addUnitFormik.setValues({
      unit_number: unit?.rental_units,
      address1: unit?.rental_unitsAdress,
      city: unit?.rental_city,
      state: unit?.rental_state,
      zip: unit?.rental_postcode,
      country: unit?.rental_country,
    });
  };

  useEffect(() => {
    if (source) {
      setValue(source);
    } else {
      setValue("summary");
    }
  }, [source]);

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
                    {console.log(propertyUnit, "propertyUnnot")}
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
                        label={`Units (${propertyUnit?.length})`}
                        style={{ textTransform: "none" }}
                        value="units"
                      />
                      <Tab
                        label="Task"
                        style={{ textTransform: "none" }}
                        value="task"
                      />
                      <Tab
                        label={`Tenant (${
                          Array.isArray(rentaldata) ? rentaldata?.length : 0
                        })`}
                        style={{ textTransform: "none" }}
                        value="Tenant"
                      />
                    </TabList>
                  </Box>

                  <TabPanel value="summary">
                    <div className="main d-flex justify-content-between">
                      <div className="card mb-3 col-8">
                        <div className="row g-0 border-none">
                          {!propImageLoader ? (
                            <>
                              <div className="col-md-4 mt-2">
                                <label
                                  htmlFor="prop_image"
                                  style={{
                                    width: "260px",
                                    height: "180px",
                                  }}
                                >
                                  <img
                                    src={
                                      matchedProperty.prop_image
                                        ? matchedProperty.prop_image
                                        : fone
                                    }
                                    className="img-fluid rounded-start card-image"
                                    alt={"..."}
                                    style={{
                                      width: "260px",
                                      aspectRatio: "3/2",
                                      objectFit: "contain",
                                    }}
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
                              <h5 className="">Property details</h5>
                              <div className="h6" style={{ color: "#767676" }}>
                                ADDRESS
                              </div>
                              <span
                                className="address"
                                style={{ fontSize: "14px" }}
                              >
                                {" "}
                                {matchedProperty?.property_type
                                  ? matchedProperty?.property_type + ","
                                  : ""}
                              </span>
                              <span
                                className="address"
                                style={{ fontSize: "14px" }}
                              >
                                {" "}
                                {matchedProperty?.rental_adress
                                  ? matchedProperty?.rental_adress + ","
                                  : ""}
                              </span>
                              <br />
                              <span
                                className="address"
                                style={{ fontSize: "14px" }}
                              >
                                {" "}
                                {matchedProperty?.rental_city
                                  ? matchedProperty?.rental_city + ","
                                  : ""}
                              </span>
                              <span
                                className="address"
                                style={{ fontSize: "14px" }}
                              >
                                {" "}
                                {matchedProperty?.rental_state
                                  ? matchedProperty?.rental_state + ","
                                  : ""}
                              </span>
                              <br />
                              <span
                                className="address"
                                style={{ fontSize: "14px" }}
                              >
                                {" "}
                                {matchedProperty?.rental_country
                                  ? matchedProperty?.rental_country + ","
                                  : ""}
                              </span>
                              <span
                                className="address"
                                style={{ fontSize: "14px" }}
                              >
                                {" "}
                                {matchedProperty?.rental_postcode
                                  ? matchedProperty?.rental_postcode
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
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
                        ) : propertyDetails ? (
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
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : error ? (
                          <tbody>
                            <tr>
                              <td>Error: {error.message}</td>
                            </tr>
                          </tbody>
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
                          {financialType === "All" && (
                            <Table responsive>
                              <thead>
                                <th>Property account</th>
                                <th>Amount</th>
                                <th>Date</th>
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
                                      colSpan="3"
                                    >
                                      Income
                                    </th>
                                  </tr>
                                  {GeneralLedgerData.map((property, index) => (
                                    <React.Fragment key={index}>
                                      {property.unit.map((unit, unitIndex) => (
                                        <React.Fragment key={unitIndex}>
                                          {unit.paymentAndCharges &&
                                            unit.paymentAndCharges
                                              .sort(
                                                (a, b) =>
                                                  new Date(b.date) -
                                                  new Date(a.date)
                                              )
                                              .map((charge, chargeIndex) => (
                                                <React.Fragment
                                                  key={chargeIndex}
                                                >
                                                  <tr>
                                                    <th>{charge.account}</th>
                                                    <td>
                                                      ${charge.amount || "0.00"}
                                                    </td>
                                                    <td>{charge.date}</td>
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
                                      colSpan="3"
                                    >
                                      Expenses
                                    </th>
                                    <td></td>
                                  </tr>
                                  {GeneralLedgerData.map((property, index) => (
                                    <React.Fragment key={index}>
                                      {property.unit.map((unit, unitIndex) => (
                                        <React.Fragment key={unitIndex}>
                                          {unit.property_expense &&
                                            unit.property_expense
                                              .sort(
                                                (a, b) =>
                                                  new Date(b.date) -
                                                  new Date(a.date)
                                              )
                                              .map((expense, expenseIndex) => (
                                                <React.Fragment
                                                  key={expenseIndex}
                                                >
                                                  <tr>
                                                    <th>{expense.account}</th>
                                                    <td>
                                                      $
                                                      {expense.amount || "0.00"}
                                                    </td>
                                                    <td>{expense.date}</td>
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
                                          colSpan="2"
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
                                  {monthWiseData[month] &&
                                    monthWiseData[month].map((data, index) => (
                                      <React.Fragment key={index}>
                                        <tr>
                                          <th>{data.account}</th>
                                          <td>${data.amount || "0.00"}</td>
                                        </tr>
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
                                    <th
                                      style={{
                                        color: "black",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      ${(totalIncome || 0).toFixed(2)}
                                    </th>
                                  </tr>
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
                                  {monthWiseData2[month] &&
                                    monthWiseData2[month].map((data, index) => (
                                      <React.Fragment key={index}>
                                        <tr>
                                          <th>{data.account}</th>
                                          <td>${data.amount || "0.00"}</td>
                                        </tr>
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
                                    <th
                                      style={{
                                        color: "black",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      ${(totalExpenses || 0).toFixed(2)}
                                    </th>
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
                                    <th
                                      style={{
                                        color: "black",
                                        fontWeight: "bold",
                                        backgroundColor: "#f0f0f0",
                                      }}
                                      //colSpan="2"
                                    >
                                      {netIncome >= 0
                                        ? `$${netIncome.toFixed(2)}`
                                        : `$(${Math.abs(netIncome || 0).toFixed(
                                            2
                                          )})`}
                                    </th>
                                  </tr>
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
                              </thead>
                              <tbody>
                                <tr>
                                  <th
                                    style={{
                                      color: "blue",
                                      fontWeight: "bold",
                                      backgroundColor: "#f0f0f0",
                                    }}
                                    colSpan={4}
                                  >
                                    Income
                                  </th>
                                </tr>
                                {threeMonths.map((months, index) => (
                                  <tr key={index}>
                                    {monthWiseData[months] &&
                                      monthWiseData[months].map((data) => (
                                        <>
                                          <th>{data.account}</th>
                                          <td>
                                            {index === 0 ? data.amount : "-"}
                                          </td>
                                          <td>
                                            {index === 1 ? data.amount : "-"}
                                          </td>
                                          <td>
                                            {index === 2 ? data.amount : "-"}
                                          </td>
                                        </>
                                      ))}
                                  </tr>
                                ))}
                                {monthWiseData[month] &&
                                  monthWiseData[month].map((data, index) => (
                                    <tr key={index}>
                                      <th>{data.account}</th>
                                      <td>{"-"}</td>
                                      <td>{"-"}</td>
                                      <td>{data.amount || "-"}</td>
                                    </tr>
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
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    ${totals[0].toFixed(2)}
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    ${totals[1].toFixed(2)}
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    ${totals[2].toFixed(2)}
                                  </th>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "blue",
                                      fontWeight: "bold",
                                      backgroundColor: "#f0f0f0",
                                    }}
                                    colSpan={4}
                                  >
                                    Expenses
                                  </th>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr>
                                {threeMonths.map((months, index) => (
                                  <tr key={index}>
                                    {monthWiseData2[months] &&
                                      monthWiseData2[months].map((data) => (
                                        <>
                                          <th>{data.account}</th>
                                          <td>
                                            {index === 0 ? data.amount : "-"}
                                          </td>
                                          <td>
                                            {index === 1 ? data.amount : "-"}
                                          </td>
                                          <td>
                                            {index === 2 ? data.amount : "-"}
                                          </td>
                                        </>
                                      ))}
                                  </tr>
                                ))}
                                {monthWiseData2[month] &&
                                  monthWiseData2[month].map((data, index) => (
                                    <tr key={index}>
                                      <th>{data.account}</th>
                                      <td>{"-"}</td>
                                      <td>{"-"}</td>
                                      <td>{data.amount || "-"}</td>
                                    </tr>
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
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    ${totals2[0].toFixed(2)}
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    ${totals2[1].toFixed(2)}
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    ${totals2[2].toFixed(2)}
                                  </th>
                                </tr>
                                <tr>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                      backgroundColor: "#f0f0f0",
                                    }}
                                  >
                                    Net income
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                      backgroundColor: "#f0f0f0",
                                    }}
                                  >
                                    $
                                    {totals[0] - totals2[0] >= 0
                                      ? (totals[0] - totals2[0]).toFixed(2)
                                      : `(${
                                          -1 *
                                          (totals[0] - totals2[0]).toFixed(2)
                                        })`}
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                      backgroundColor: "#f0f0f0",
                                    }}
                                  >
                                    $
                                    {totals[1] - totals2[1] >= 0
                                      ? (totals[1] - totals2[1]).toFixed(2)
                                      : `(${
                                          -1 *
                                          (totals[1] - totals2[1]).toFixed(2)
                                        })`}
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                      backgroundColor: "#f0f0f0",
                                    }}
                                  >
                                    $
                                    {totals[2] - totals2[2] >= 0
                                      ? (totals[2] - totals2[2]).toFixed(2)
                                      : `(${
                                          -1 *
                                          (totals[2] - totals2[2]).toFixed(2)
                                        })`}
                                  </th>
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
                                    onChange={(e) => fileData(e)}
                                  />
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
                                    unitImage.map((unitImg, index) => (
                                      <div
                                        key={index} // Use a unique identifier, such as index or image URL
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
                                  propertyDetails.entries[0].rental_unitsAdress,
                                city: propertyDetails.entries[0].rental_city,
                                state: propertyDetails.entries[0].rental_state,
                                zip: propertyDetails.entries[0].rental_postcode,
                                country:
                                  propertyDetails.entries[0].rental_country,
                              });
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
                              <th scope="col">Action</th>
                              {/* <th scope="col">Most Recent Events</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {propertyUnit &&
                              propertyUnit.length > 0 &&
                              propertyUnit.map((unit, index) => (
                                <tr
                                  key={index}
                                  onClick={() => {
                                    setPropSummary(true);
                                    setPropId(unit._id);
                                    setClickedObject(unit);
                                  }}
                                  style={{ cursor: "pointer" }}
                                  className="w-100"
                                >
                                  <td>{unit.rental_units || "N/A"}</td>
                                  <td>{unit.rental_adress || "N/A"}</td>
                                  <td>
                                    {unit.tenant_firstName == null
                                      ? "-"
                                      : unit.tenant_firstName +
                                        " " +
                                        unit.tenant_lastName}
                                  </td>
                                  <td onClick={(e) => openEditeTab(e, unit)}>
                                    <EditIcon />
                                  </td>
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
                            handleDeleteUnit(clickedObject?._id);
                          }}
                        >
                          Delete unit
                        </Button>

                        <Grid container>
                          <Grid container md={9} style={{ display: "flex" }}>
                            <div className="din d-flex justify-content-between">
                              <div className="col-md-4 mt-2">
                                <label htmlFor="unit_image">
                                  {unitImageLoader ? (
                                    <>
                                      <RotatingLines
                                        strokeColor="grey"
                                        strokeWidth="5"
                                        animationDuration="0.75"
                                        width="50"
                                        visible={true}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={
                                          clickedObject &&
                                          clickedObject?.propertyres_image[0]
                                            ? clickedObject
                                                ?.propertyres_image[0]
                                            : clickedObject?.property_image[0]
                                            ? clickedObject?.property_image[0]
                                            : fone
                                        }
                                        className="img-fluid rounded-start card-image"
                                        alt="..."
                                        width="400px"
                                        height="400px"
                                      />
                                    </>
                                  )}
                                </label>
                              </div>
                              <Grid
                                item
                                md={8}
                                style={{
                                  width: "100%",
                                  marginLeft: "20px",
                                }}
                              >
                                {clickedObject?.rental_units ? (
                                  <div className="d-flex align-self-end">
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        fontSize: "18px",
                                        textTransform: "capitalize",
                                        color: "#5E72E4",
                                        fontWeight: "600",
                                      }}
                                    >
                                      <div>{clickedObject?.rental_units}</div>
                                      <hr
                                        style={{
                                          marginTop: "10px",
                                          width: "calc(100% - 100px)",
                                        }}
                                      />
                                    </Typography>
                                  </div>
                                ) : (
                                  ""
                                )}
                                <span style={{ marginTop: "0px" }}>
                                  ADDRESS
                                  <br />
                                  {clickedObject?.rental_units
                                    ? clickedObject?.rental_units + ", "
                                    : ""}
                                  {clickedObject?.rental_adress
                                    ? clickedObject?.rental_adress + ", "
                                    : ""}
                                  <br />
                                  {clickedObject?.rental_city
                                    ? clickedObject?.rental_city + ", "
                                    : ""}
                                  {clickedObject?.rental_state
                                    ? clickedObject?.rental_state + ", "
                                    : ""}
                                  <br />
                                  {clickedObject?.rental_country
                                    ? clickedObject?.rental_country + ", "
                                    : ""}
                                  {clickedObject?.rental_postcode
                                    ? clickedObject?.rental_postcode
                                    : ""}
                                </span>
                                {/* i want to put this div to the extreme rigth of main div */}
                              </Grid>
                            </div>

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
                                            clickedObject?.market_rent,
                                          size: clickedObject?.rental_sqft,
                                          description:
                                            clickedObject?.description,
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
                                <Row
                                  className="w-100 mt-1  mb-5"
                                  style={{
                                    fontSize: "12px",
                                    textTransform: "capitalize",
                                    color: "#000",
                                  }}
                                >
                                  <Col>
                                    {clickedObject?.market_rent || "N/A"}
                                  </Col>
                                  <Col>
                                    {clickedObject?.rental_sqft || "N/A"}
                                  </Col>
                                  <Col style={{ textTransform: "lowercase" }}>
                                    {clickedObject?.description || "N/A"}
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
                                                addUnitFormik.values
                                                  ?.market_rent
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
                                                //   clickedObject?._id
                                                // );
                                                // // setIsEdit(false);
                                                // setEditUnitDialogOpen(
                                                //   !editUnitDialogOpen
                                                // );
                                                handleListingEdit(
                                                  clickedObject?._id,
                                                  clickedObject?.rentalId
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
                                    clickedObject?.tenant_firstName &&
                                    clickedObject?.tenant_lastName ? (
                                      <>
                                        <tr className="body">
                                          <td>
                                            {clickedObject?.start_date
                                              ? "Active"
                                              : "Inactive"}
                                          </td>
                                          <td>
                                            {clickedObject?.start_date &&
                                            clickedObject?.end_date ? (
                                              <>
                                                <Link
                                                  to={`/admin/tenantdetail/${clickedObject?._id}`}
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
                                                    clickedObject?.start_date
                                                  ) +
                                                    "-" +
                                                    formatDateWithoutTime(
                                                      clickedObject?.end_date
                                                    )}
                                                </Link>
                                              </>
                                            ) : (
                                              "N/A"
                                            )}
                                          </td>
                                          <td>
                                            {clickedObject?.tenant_firstName &&
                                            clickedObject?.tenant_lastName
                                              ? clickedObject?.tenant_firstName +
                                                " " +
                                                clickedObject?.tenant_lastName
                                              : "N/A"}
                                          </td>
                                          <td>
                                            {clickedObject?.lease_type || "N/A"}
                                          </td>
                                          <td>
                                            {clickedObject?.amount || "N/A"}
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
                                  {clickedObject?.appliances ? (
                                    <>
                                      {clickedObject?.appliances.map(
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
                                    <span>{clickedObject?.unitCreatedAt}</span>
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
                  <TabPanel value="task">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: "10px",
                      }}
                    >
                      <Button
                        className="btn-icon btn-2"
                        color="primary"
                        style={{
                          background: "white",
                          color: "blue",
                        }}
                        size="l"
                        onClick={() => {
                          navigate(`/admin/addworkorder/addtask/${entryIndex}`);
                        }}
                      >
                        <span className="btn-inner--text">Add Task</span>
                      </Button>
                    </div>
                    <Table
                      className="align-items-center table-flush"
                      responsive
                    >
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">Task</th>
                          <th scope="col">Category</th>
                          <th scope="col">Assigned To</th>
                          <th scope="col">Status</th>
                          <th scope="col">Due Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks && tasks.length > 0 ? (
                          tasks.map((task, index) => (
                            <tr
                              onClick={() => {
                                navigate(
                                  `/admin/workorderdetail/${task.workorder_id}`
                                );
                              }}
                            >
                              <td>{task.work_subject}</td>
                              <td>{task.work_category}</td>
                              <td>{task.staffmember_name}</td>
                              <td>{task.status}</td>
                              <td>{task.due_date}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No tasks found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </TabPanel>
                  <TabPanel value="Tenant">
                    <Row>
                      <Col>
                        {Array.isArray(rentaldata) ? (
                          <Grid container spacing={2}>
                            {rentaldata.map((tenant, index) => (
                              <Grid item xs={12} sm={5} key={index}>
                                {tenant.entries.map((entry) => (
                                  <Box
                                    key={index}
                                    border="1px solid #ccc"
                                    borderRadius="8px"
                                    padding="16px"
                                    maxWidth="700px"
                                    margin="20px"
                                  >
                                    {!entry.moveout_notice_given_date ? (
                                      <div
                                        className="d-flex justify-content-end h5"
                                        onClick={handleMoveOutClick}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <LogoutIcon fontSize="small" /> Move out
                                      </div>
                                    ) : (
                                      <div
                                        className="d-flex justify-content-end h5"
                                        // style={{ cursor: "pointer" }}
                                      >
                                        <DoneIcon fontSize="small" /> Moved Out
                                      </div>
                                    )}

                                    <Modal
                                      show={showModal}
                                      onHide={handleModalClose}
                                    >
                                      <Modal.Header>
                                        <Modal.Title>
                                          Move out tenants
                                        </Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>
                                        <div>
                                          Select tenants to move out. If
                                          everyone is moving, the lease will end
                                          on the last move-out date. If some
                                          tenants are staying, you’ll need to
                                          renew the lease. Note: Renters
                                          insurance policies will be permanently
                                          deleted upon move-out.
                                        </div>
                                        <hr />
                                        <React.Fragment>
                                          <Table striped bordered responsive>
                                            <thead>
                                              <tr>
                                                <th>Address / Unit</th>
                                                <th>LEASE TYPE</th>
                                                <th>START - END</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr>
                                                <td>
                                                  {entry.rental_adress
                                                    ? entry.rental_adress
                                                    : ""}{" "}
                                                  {entry.rental_units
                                                    ? entry.rental_units
                                                    : ""}
                                                </td>
                                                <td>Fixed</td>
                                                <td>
                                                  {entry.start_date
                                                    ? entry.start_date
                                                    : ""}{" "}
                                                  {entry.end_date
                                                    ? entry.end_date
                                                    : ""}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </Table>
                                          <Table striped bordered responsive>
                                            <thead>
                                              <tr>
                                                <th>TENANT</th>
                                                <th>NOTICE GIVEN DATE</th>
                                                <th>MOVE-OUT DATE</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr>
                                                <td>
                                                  {tenant.tenant_firstName +
                                                    " "}{" "}
                                                  {tenant.tenant_lastName}
                                                </td>
                                                <td>
                                                  <div className="col">
                                                    <input
                                                      type="date"
                                                      className="form-control"
                                                      placeholder="Notice Given Date"
                                                      value={noticeGivenDate}
                                                      onChange={(e) =>
                                                        setNoticeGivenDate(
                                                          e.target.value
                                                        )
                                                      }
                                                      required
                                                    />
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className="col">
                                                    <input
                                                      type="date"
                                                      className="form-control"
                                                      placeholder="Move-out Date"
                                                      value={moveOutDate}
                                                      onChange={(e) =>
                                                        setMoveOutDate(
                                                          e.target.value
                                                        )
                                                      }
                                                      required
                                                    />
                                                  </div>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </Table>
                                        </React.Fragment>
                                      </Modal.Body>
                                      <Modal.Footer>
                                        <Button
                                          style={{ backgroundColor: "#008000" }}
                                          onClick={() =>
                                            handleMoveout(
                                              tenant._id,
                                              entry.entryIndex
                                            )
                                          }
                                        >
                                          Move out
                                        </Button>
                                        <Button
                                          style={{ backgroundColor: "#ffffff" }}
                                          onClick={handleModalClose}
                                        >
                                          Close
                                        </Button>
                                      </Modal.Footer>
                                    </Modal>

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

                                      <Col lg="7">
                                        <div
                                          style={{
                                            color: "blue",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {tenant.tenant_firstName || "N/A"}{" "}
                                          {tenant.tenant_lastName || "N/A"}
                                          <br></br>
                                          {entry.rental_adress}
                                          {entry.rental_units !== "" &&
                                          entry.rental_units !== undefined
                                            ? ` - ${entry.rental_units}`
                                            : null}
                                        </div>

                                        <div>
                                          {" "}
                                          {formatDateWithoutTime(
                                            entry.start_date
                                          ) || "N/A"}{" "}
                                          to{" "}
                                          {formatDateWithoutTime(
                                            entry.end_date
                                          ) || "N/A"}
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
                                            <MailIcon />
                                          </Typography>
                                          {tenant.tenant_email || "N/A"}
                                        </div>
                                        <div
                                          style={
                                            entry.moveout_notice_given_date
                                              ? {
                                                  // display:"block",
                                                  display: "flex",
                                                  flexDirection: "row",
                                                  marginTop: "10px",
                                                }
                                              : {
                                                  display: "none",
                                                }
                                          }
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              // fontSize: "7px",
                                              color: "black",
                                            }}
                                          >
                                            Notice date:
                                          </Typography>
                                          {entry.moveout_notice_given_date ||
                                            "N/A"}
                                        </div>
                                        <div
                                          style={
                                            entry.moveout_date
                                              ? {
                                                  // display:"block",
                                                  display: "flex",
                                                  flexDirection: "row",
                                                  marginTop: "10px",
                                                }
                                              : {
                                                  display: "none",
                                                }
                                          }
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              // fontSize: "7px",
                                              color: "black",
                                            }}
                                          >
                                            Move out:
                                          </Typography>
                                          {entry.moveout_date || "N/A"}
                                        </div>
                                      </Col>
                                    </Row>
                                  </Box>
                                ))}
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <h3>No data available....</h3>
                        )}
                      </Col>
                    </Row>
                    <Row></Row>
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
      <Dialog open={openEdite} onClose={closeModal}>
        <DialogTitle>Edit Unit Details</DialogTitle>
        <CloseIcon
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
          }}
          onClick={() => {
            setOpenEdite(!openEdite);
          }}
        />
        <Row>
          <Col md={11}>
            <Card style={{ position: "relative" }}>
              {clickedObject?.rental_units ? (
                <>
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
                      value={addUnitFormik.values.unit_number}
                      onChange={addUnitFormik.handleChange}
                      onBlur={addUnitFormik.handleBlur}
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
                      id="address1"
                      name="address1"
                      value={addUnitFormik.values.address1}
                      onChange={addUnitFormik.handleChange}
                      onBlur={addUnitFormik.handleBlur}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
              <CardBody>
                <form onSubmit={addUnitFormik.handleSubmit}>
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
                        value={addUnitFormik.values.city}
                        onChange={addUnitFormik.handleChange}
                        onBlur={addUnitFormik.handleBlur}
                      />
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <div>
                        <h5>State</h5>
                      </div>
                      <TextField
                        type="text"
                        size="small"
                        id="state"
                        name="state"
                        value={addUnitFormik.values.state}
                        onChange={addUnitFormik.handleChange}
                        onBlur={addUnitFormik.handleBlur}
                      />
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <div>
                        <h5>Zip</h5>
                      </div>
                      <TextField
                        type="text"
                        size="small"
                        id="zip"
                        name="zip"
                        value={addUnitFormik.values.zip}
                        onChange={addUnitFormik.handleChange}
                        onBlur={addUnitFormik.handleBlur}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ marginTop: "10px" }}>
                      <h5>Country</h5>
                    </div>
                    <TextField
                      type="text"
                      size="small"
                      id="country"
                      name="country"
                      value={addUnitFormik.values.country}
                      onChange={addUnitFormik.handleChange}
                      onBlur={addUnitFormik.handleBlur}
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
                                fileData(e);
                              }}
                            />
                            <label htmlFor={`unit_img`}>
                              <b
                                style={{
                                  fontSize: "20px",
                                }}
                              >
                                +
                              </b>{" "}
                              Add
                            </label>
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
                              unitImage.map((unitImg, index) => (
                                <div
                                  key={index} // Use a unique identifier, such as index or image URL
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
                          clickedObject?._id,
                          clickedObject?.rentalId
                        );
                        // setIsEdit(false);
                        // setOpenEdite(!openEdite);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setOpenEdite(!openEdite);
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
      </Dialog>
    </>
  );
};

export default PropDetails;
