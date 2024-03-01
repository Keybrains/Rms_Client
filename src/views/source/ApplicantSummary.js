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
  Table,
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
  const imageUrl = process.env.REACT_APP_IMAGE_POST_URL;
  const imageGetUrl = process.env.REACT_APP_IMAGE_GET_URL;
  const { id, admin } = useParams();
  const navigate = useNavigate();

  const [accessType, setAccessType] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prevState) => !prevState);

  const [loader, setLoader] = useState(false);
  const [applicantData, setApplicantData] = useState({});
  const [applicantLeaseData, setApplicantLeaseData] = useState({});
  const [applicantCheckListData, setApplicantCheckListData] = useState([]);
  const [applicantNotesData, setApplicantNotesData] = useState([]);

  const fetchApplicantData = async () => {
    setLoader(true);
    try {
      const url = `${baseUrl}/applicant/applicant_summary/${id}`;
      const res = await axios.get(url);
      setApplicantData(res.data.data[0]);
      setApplicantLeaseData(res.data.data[0].lease_data);
      setApplicantCheckListData(res.data.data[0].applicant_checkedChecklist);
      setApplicantNotesData(res.data.data[0].applicant_NotesAndFile);
    } catch (error) {
      console.error("Error: ", error.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchApplicantData();
  }, [id]);

  const dropdownList = ["Approved", "Rejected"];
  const [selectedStatus, setSelectedStatus] = useState("");
  const handleStatus = (item) => {
    setSelectedStatus(item);
  };

  const [value, setValue] = useState("Summary");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [newItem, setNewItem] = useState("");
  const handleChecklistChange = async (event, item) => {
    try {
      const updatedItems = event.target.checked
        ? [...applicantCheckListData, item]
        : applicantCheckListData.filter((checkedItem) => checkedItem !== item);

      const apiUrl = `${baseUrl}/applicant/applicant/${id}`;
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
      setApplicantCheckListData(responseData.data.applicant_checkedChecklist);
      fetchApplicantData();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddItem = async () => {
    if (newItem.trim() !== "") {
      const updatedChecklistItems = applicantCheckListData
        ? [...applicantCheckListData, newItem]
        : [newItem];
      setApplicantCheckListData(updatedChecklistItems);

      const updatedApplicant = {
        ...applicantData,
        applicant_checklist: applicantData.applicant_checklist
          ? [...applicantData.applicant_checklist, newItem]
          : [newItem],
      };

      axios
        .put(`${baseUrl}/applicant/applicant/${id}/checklist`, updatedApplicant)
        .then(() => {
          fetchApplicantData();
        })
        .catch((err) => {
          console.error(err);
        });
      setNewItem("");
    }
  };

  const handleRemoveItem = async (itemToRemove) => {
    const updatedChecklist = applicantCheckListData.filter(
      (item) => item !== itemToRemove
    );
    setApplicantCheckListData(updatedChecklist);

    const updatedApplicant = {
      ...applicantData,
      applicant_checklist: applicantData.applicant_checklist.filter(
        (item) => item !== itemToRemove
      ),
    };

    axios
      .put(`${baseUrl}/applicant/applicant/${id}/checklist`, updatedApplicant)
      .then(() => {
        fetchApplicantData();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const [isChecklistVisible, setChecklistVisible] = useState(false);
  const toggleChecklist = () => {
    setChecklistVisible(!isChecklistVisible);
  };

  const [isAttachFile, setIsAttachFile] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newFile, setNewFile] = useState({});
  const openFileInBrowser = (fileURL) => {
    if (typeof fileURL === "string") {
      window.open(`${imageGetUrl}/${fileURL}`, "_blank");
    } else {
      const url = URL.createObjectURL(fileURL);
      window.open(url, "_blank");
    }
  };

  const handleAttachFile = () => {
    setIsAttachFile(true);
    setNewNote("");
    setNewFile({});
  };

  const hadlenotesandfile = async () => {
    // setLoader(true);
    try {
      var image;
      if (newFile !== null) {
        try {
          const form = new FormData();
          form.append("files", newFile);

          const res = await axios.post(`${imageUrl}/images/upload`, form);

          if (res && res.data && res.data.files && res.data.files.length > 0) {
            image = res.data.files[0].filename;
          } else {
            console.error("Unexpected response format:", res);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }

      const formData = {
        applicant_notes: newNote,
        applicant_file: image,
      };

      const url = `${baseUrl}/applicant/applicant/note_attachment/${id}`;
      const response = await axios.put(url, formData);
      if (response.data) {
        console.log(response.data, "response.data");
        setIsAttachFile(false);
        fetchApplicantData();
      }
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      // setLoader(false);
    }
  };

  const [moveinLoader, setMoveinLoader] = useState(false);
  const handleClearRow = async (notes) => {
    // setLoader(true);
    try {
      const url = `${baseUrl}/applicant/applicant/note_attachment/${id}/${notes._id}`;
      const res = await axios.delete(url);

      console.log(res.data);
      toast.success("Document deleted successfully", {
        position: "top-center",
      });

      fetchApplicantData();
    } catch (err) {
      console.log(err);
    } finally {
      // setLoader(false);
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

  const handleMoveIn = () => {
    setMoveinLoader(true);
    try {
      navigate(
        `/${admin}/RentRollLeaseing/${applicantLeaseData?.lease_id}/${id}`
      );
    } catch (error) {
      console.error("Error: ", error.message);
    } finally {
      setMoveinLoader(false);
    }
  };

  return (
    <>
      <Header title="ApplicantSummary" />
      <Container className="mt--9" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              {loader ? (
                <tbody className="d-flex flex-direction-column justify-content-left align-items-left">
                  <tr>
                    <div className="p-5 m-5"></div>
                  </tr>
                </tbody>
              ) : (
                <>
                  <h1 style={{ color: "white" }}>
                    Applicant:{" "}
                    {applicantData?.applicant_firstName &&
                    applicantData?.applicant_lastName
                      ? `${applicantData.applicant_firstName} ${applicantData.applicant_lastName}`
                      : "Unknown"}
                  </h1>

                  <h4 style={{ color: "white" }}>
                    {applicantLeaseData?.rental_adress &&
                      `${applicantLeaseData?.rental_adress} ${
                        applicantLeaseData?.rental_unit
                          ? " - " + applicantLeaseData?.rental_unit
                          : ""
                      }`}
                  </h4>
                </>
              )}
            </FormGroup>
          </Col>
          <Col className="text-right">
            <Button
              color="primary"
              onClick={() => navigate("/" + admin + "/Applicants")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <br />
        <Card elevation={2}>
          {loader ? (
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
                <Dropdown isOpen={isOpen} toggle={toggle}>
                  <DropdownToggle caret style={{ width: "100%" }}>
                    {applicantData &&
                    applicantData.applicant_status &&
                    applicantData?.applicant_status[0]?.status
                      ? applicantData?.applicant_status[0]?.status
                      : selectedStatus
                      ? selectedStatus
                      : "Select"}
                  </DropdownToggle>
                  <DropdownMenu style={{ width: "100%" }} name="rent_cycle">
                    {dropdownList.map((item, index) => {
                      return (
                        <DropdownItem
                          key={index}
                          onClick={() => {
                            handleStatus(item);
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
                  loading={moveinLoader}
                  style={{
                    marginLeft: "10px",
                    display:
                      applicantData?.applicant_status?.length === 0 &&
                      selectedStatus !== "Approved"
                        ? "none"
                        : "block",
                  }}
                  color="success"
                  onClick={() => {
                    handleMoveIn();
                  }}
                  disabled={applicantData && applicantData.isMovedin === true}
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
                        {/* <Tab
                          label="Application"
                          value="Application"
                          style={{ textTransform: "none" }}
                        />
                        <Tab
                          label="Approved"
                          value="Approved"
                          style={{ textTransform: "none" }}
                        />
                        <Tab
                          label="Rejected"
                          value="Rejected"
                          style={{ textTransform: "none" }}
                        /> */}
                      </TabList>
                    </Box>

                    <TabPanel value="Summary">
                      <Row>
                        <Col>
                          <Grid container spacing={3}>
                            <Grid item xs={9}  md={9}>
                              <div>
                                <div>
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
                                    checked={applicantCheckListData?.includes(
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
                                    checked={applicantCheckListData?.includes(
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
                                    checked={applicantCheckListData?.includes(
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
                                    checked={applicantCheckListData?.includes(
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
                                    checked={applicantCheckListData?.includes(
                                      "LandlordVerification"
                                    )}
                                  />{" "}
                                  Landlord verification <br />
                                </div>

                                <Box display="flex" flexDirection="column">
                                  {applicantData?.applicant_checklist?.map(
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
                                                fontWeight: "bold",
                                              }}
                                              type="checkbox"
                                              value={item}
                                              color="success"
                                              onChange={(e) =>
                                                handleChecklistChange(e, item)
                                              }
                                              checked={applicantCheckListData?.includes(
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
                                          color: "green",
                                          border: "2px solid green",
                                          borderRadius: "5px",
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
                                          color: "red",
                                          border: "2px solid red",
                                          borderRadius: "5px",
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

                              {/* Attach note or file section */}
                              <div className="mt-5">
                                <div>
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
                                    <Col>Notes and Files</Col>
                                  </Row>
                                </div>
                                <div className="mt-2">
                                  {isAttachFile ? (
                                    <Card
                                      style={{
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
                                            multiple={false}
                                            onChange={(e) => {
                                              setNewFile(e.target.files[0]);
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
                                              {newFile?.name}
                                            </p>
                                          )}
                                        </div>

                                        <div className="mt-3">
                                          <Button
                                            color="success"
                                            onClick={() => {
                                              hadlenotesandfile();
                                            }}
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
                                      Attach Note/File
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {applicantNotesData?.length > 0 && (
                                <>
                                  <Row
                                    className="w-100 mb-3 mt-3"
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
                                  {applicantNotesData?.map((data, index) => (
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
                                        {data.applicant_notes && (
                                          <p>{data.applicant_notes}</p>
                                        )}
                                      </Col>
                                      <Col>
                                        {data.applicant_file && (
                                          <div
                                            style={{
                                              display: "flex",
                                            }}
                                          >
                                            <p
                                              onClick={() =>
                                                openFileInBrowser(
                                                  data.applicant_file
                                                )
                                              }
                                            >
                                              <FileOpenIcon />
                                              {data.applicant_file}
                                            </p>
                                          </div>
                                        )}
                                      </Col>
                                      <Col>
                                        <ClearIcon
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            handleClearRow(data);
                                          }}
                                        >
                                          Clear
                                        </ClearIcon>
                                      </Col>
                                    </Row>
                                  ))}
                                </>
                              )}

                              {/* <>
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

                                {applicantData?.applicant_status?.map(
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
                              </> */}
                            </Grid>

                            <Grid item xs={12} md={3} lg="4" xl="3">
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
                                      {applicantData?.applicant_firstName +
                                        " " +
                                        applicantData?.applicant_lastName}
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
                                      {applicantData?.applicant_homeNumber ||
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
                                      {applicantData?.applicant_businessNumber ||
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
                                      {applicantData?.applicant_phoneNumber ||
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
                                      {applicantData?.applicant_email || "N/A"}
                                    </Typography>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>
                        </Col>
                      </Row>
                    </TabPanel>

                    {/* working but all data is not get */}
                    {/* <TabPanel value="Application">
                      <Row style={{ backgroundColor: "" }}>
                        <Col>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Box>
                                {isApplicantDataEmpty ? (
                                  <section className="">
                                    <div className="row d-flex ">
                                      <div>
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
                                        <h2
                                          style={{
                                            fontSize: "22px",
                                            textTransform: "capitalize",
                                            color: "#5e72e4",
                                            fontWeight: "600",
                                          }}
                                        >
                                          Rental history
                                        </h2>
                                        <Link
                                          to={`/${admin}/applicant-form/${id}`}
                                          target="_blank"
                                          className="btn btn-secondary ml-sm-3 mt-3 mt-sm-0 mb-2"
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
                                          border: "1px solid #ddd",
                                          marginTop: "5px",
                                        }}
                                      />
                                      <Table
                                        className="align-items-center table-flush"
                                        responsive
                                        style={{ width: "100%" }}
                                      >
                                        <div className="">
                                          <Row
                                            className=" mb-1"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "uppercase",
                                              color: "#aaa",
                                              width: "100%",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              APPLICANT NAME
                                            </Col>
                                            <Col lg="3" md="3">
                                              APPLICANT SOCIAL SECURITY NUMBER
                                            </Col>
                                            <Col lg="3" md="3">
                                              APPLICANT BIRTH DATE
                                            </Col>
                                            <Col lg="3" md="3">
                                              APPLICANT CURRENT ADDRESS
                                            </Col>
                                          </Row>
                                          <Row
                                            className="w-100 mt-1 mb-5"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "capitalize",
                                              color: "#000",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              {`${
                                                applicantData?.applicant_firstName
                                                  ? applicantData?.applicant_firstName
                                                  : ""
                                              } ${
                                                applicantData?.applicant_lastName
                                                  ? applicantData?.applicant_lastName
                                                  : ""
                                              }`}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.applicant_socialSecurityNumber
                                                ? applicantData?.applicant_socialSecurityNumber
                                                : ""}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.applicant_dob
                                                ? applicantData?.applicant_dob
                                                : ""}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {`${
                                                applicantData?.applicant_country
                                                  ? applicantData?.applicant_country +
                                                    ", "
                                                  : ""
                                              } ${
                                                applicantData?.applicant_adress
                                                  ? applicantData?.applicant_adress +
                                                    ", "
                                                  : ""
                                              } ${
                                                applicantData?.applicant_city
                                                  ? applicantData?.applicant_city +
                                                    ", "
                                                  : ""
                                              } ${
                                                applicantData?.applicant_state
                                                  ? applicantData?.applicant_state +
                                                    ", "
                                                  : ""
                                              } ${
                                                applicantData?.applicant_zipcode
                                                  ? applicantData?.applicant_zipcode
                                                  : ""
                                              }`}
                                            </Col>
                                          </Row>
                                          <Row
                                            className=" mb-1"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "uppercase",
                                              color: "#aaa",
                                              width: "100%",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              APPLICANT EMAIL
                                            </Col>
                                            <Col lg="3" md="3">
                                              APPLICANT PHONE
                                            </Col>
                                          </Row>
                                          <Row
                                            className="w-100 mt-1 mb-5"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "capitalize",
                                              color: "#000",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              {applicantData?.applicant_email
                                                ? applicantData?.applicant_email
                                                : ""}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.applicant_phoneNumber
                                                ? applicantData?.applicant_phoneNumber
                                                : ""}
                                            </Col>
                                          </Row>
                                        </div>
                                      </Table>
                                    </div>

                                    <div className="applicant-info mt-3">
                                      <h2
                                        style={{
                                          fontSize: "22px",
                                          textTransform: "capitalize",
                                          color: "#5e72e4",
                                          fontWeight: "600",
                                        }}
                                      >
                                        Applicant Information
                                      </h2>
                                      <hr
                                        style={{
                                          border: "1px solid #ddd",
                                          marginTop: "5px",
                                        }}
                                      />
                                      <Table
                                        className="align-items-center table-flush"
                                        responsive
                                        style={{ width: "100%" }}
                                      >
                                        <div className="">
                                          <Row
                                            className=" mb-1"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "uppercase",
                                              color: "#aaa",
                                              width: "100%",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              RENTAL ADDRESS
                                            </Col>
                                            <Col lg="3" md="3">
                                              RENTAL DATES
                                            </Col>
                                            <Col lg="3" md="3">
                                              MONTHLY RENT
                                            </Col>
                                            <Col lg="3" md="3">
                                              REASON FOR LEAVING
                                            </Col>
                                          </Row>
                                          <Row
                                            className="w-100 mt-1 mb-5"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "capitalize",
                                              color: "#000",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              {" "}
                                              {`${
                                                applicantData?.rental_country
                                                  ? applicantData?.rental_country +
                                                    ", "
                                                  : ""
                                              } ${
                                                applicantData?.rental_adress
                                                  ? applicantData?.rental_adress +
                                                    ", "
                                                  : ""
                                              } ${
                                                applicantData?.rental_city
                                                  ? applicantData?.rental_city +
                                                    ", "
                                                  : ""
                                              } ${
                                                applicantData?.rental_state
                                                  ? applicantData?.rental_state +
                                                    ", "
                                                  : ""
                                              } ${
                                                applicantData?.rental_zipcode
                                                  ? applicantData?.rental_zipcode
                                                  : ""
                                              }`}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {`${
                                                applicantData?.rental_data_from
                                                  ? applicantData?.rental_data_from +
                                                    "to "
                                                  : ""
                                              } ${
                                                applicantData?.rental_date_to
                                                  ? applicantData?.rental_date_to
                                                  : ""
                                              }`}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.rental_monthlyRent
                                                ? applicantData?.rental_monthlyRent
                                                : ""}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.rental_resaonForLeaving
                                                ? applicantData?.rental_resaonForLeaving
                                                : ""}
                                            </Col>
                                          </Row>
                                          <Row
                                            className=" mb-1"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "uppercase",
                                              color: "#aaa",
                                              width: "100%",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              RENTAL OWNER NAME
                                            </Col>
                                            <Col lg="3" md="3">
                                              RENTAL OWNER PHONE NUMBER
                                            </Col>
                                            <Col lg="3" md="3">
                                              RENTAL OWNER EMAIL
                                            </Col>
                                          </Row>
                                          {console.log(applicantData)}
                                          <Row
                                            className="w-100 mt-1 mb-5"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "capitalize",
                                              color: "#000",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              {`${
                                                applicantData?.rental_landlord_firstName
                                                  ? applicantData?.rental_landlord_firstName
                                                  : ""
                                              } ${
                                                applicantData?.rental_landlord_lasttName
                                                  ? applicantData?.rental_landlord_lasttName
                                                  : ""
                                              }`}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.rental_landlord_phoneNumber
                                                ? applicantData?.rental_landlord_phoneNumber
                                                : ""}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.rental_landlord_email
                                                ? applicantData?.rental_landlord_email
                                                : ""}
                                            </Col>
                                          </Row>
                                        </div>
                                      </Table>
                                    </div>

                                    <div className="applicant-info mt-3">
                                      <h2
                                        style={{
                                          fontSize: "22px",
                                          textTransform: "capitalize",
                                          color: "#5e72e4",
                                          fontWeight: "600",
                                        }}
                                      >
                                        Emergency Contact Information
                                      </h2>
                                      <hr
                                        style={{
                                          border: "1px solid #ddd",
                                          marginTop: "5px",
                                        }}
                                      />
                                      <Table
                                        className="align-items-center table-flush"
                                        responsive
                                        style={{ width: "100%" }}
                                      >
                                        <div className="">
                                          <Row
                                            className=" mb-1"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "uppercase",
                                              color: "#aaa",
                                              width: "100%",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              EMERGENCY CONTACT NAME
                                            </Col>
                                            <Col lg="3" md="3">
                                              EMERGENCY CONTACT RELATIONSHIP
                                            </Col>
                                            <Col lg="3" md="3">
                                              EMERGENCY CONTACT EMAIL
                                            </Col>
                                            <Col lg="3" md="3">
                                              EMERGENCY CONTACT PHONE
                                            </Col>
                                          </Row>
                                          <Row
                                            className="w-100 mt-1 mb-5"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "capitalize",
                                              color: "#000",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              {`${
                                                applicantData?.applicant_emergencyContact_firstName
                                                  ? applicantData?.applicant_emergencyContact_firstName
                                                  : ""
                                              } ${
                                                applicantData?.applicant_emergencyContact_lasttName
                                                  ? applicantData?.applicant_emergencyContact_lasttName
                                                  : ""
                                              }`}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.applicant_emergencyContact_relationship
                                                ? applicantData?.applicant_emergencyContact_relationship
                                                : ""}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.applicant_emergencyContact_email
                                                ? applicantData?.applicant_emergencyContact_email
                                                : ""}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.applicant_emergencyContact_phone
                                                ? applicantData?.applicant_emergencyContact_phone
                                                : ""}
                                            </Col>
                                          </Row>
                                        </div>
                                      </Table>
                                    </div>
                                    <div className="applicant-info mt-3">
                                      <h2
                                        style={{
                                          fontSize: "22px",
                                          textTransform: "capitalize",
                                          color: "#5e72e4",
                                          fontWeight: "600",
                                        }}
                                      >
                                        Employment
                                      </h2>
                                      <hr
                                        style={{
                                          border: "1px solid #ddd",
                                          marginTop: "5px",
                                        }}
                                      />

                                      <Table
                                        className="align-items-center table-flush"
                                        responsive
                                        style={{ width: "100%" }}
                                      >
                                        <div className="">
                                          <Row
                                            className=" mb-1"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "uppercase",
                                              color: "#aaa",
                                              width: "100%",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              EMPLOYER NAME
                                            </Col>
                                            <Col lg="3" md="3">
                                              EMPLOYER ADDRESS
                                            </Col>
                                            <Col lg="3" md="3">
                                              EMPLOYER PHONE NUMBER
                                            </Col>
                                            <Col lg="3" md="3">
                                              EMPLOYER EMAIL
                                            </Col>
                                          </Row>
                                          <Row
                                            className="w-100 mt-1 mb-5"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "capitalize",
                                              color: "#000",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              {" "}
                                              {applicantData?.employment_name
                                                ? applicantData?.employment_name
                                                : ""}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {`${
                                                applicantData?.employment_country
                                                  ? applicantData?.employment_country +
                                                    ", "
                                                  : ""
                                              } ${
                                                applicantData?.employment_adress
                                                  ? applicantData?.employment_adress +
                                                    ", "
                                                  : ""
                                              } ${
                                                applicantData?.employment_city
                                                  ? applicantData?.employment_city +
                                                    ", "
                                                  : ""
                                              } ${
                                                applicantData?.employment_state
                                                  ? applicantData?.employment_state +
                                                    ", "
                                                  : ""
                                              } ${
                                                applicantData?.employment_zipcode
                                                  ? applicantData?.employment_zipcode
                                                  : ""
                                              }`}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.employment_phoneNumber
                                                ? applicantData?.employment_phoneNumber
                                                : ""}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.employment_email
                                                ? applicantData?.employment_email
                                                : ""}
                                            </Col>
                                          </Row>
                                          <Row
                                            className=" mb-1"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "uppercase",
                                              color: "#aaa",
                                              width: "100%",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              POSITION HELD
                                            </Col>
                                            <Col lg="3" md="3">
                                              EMPLOYMENT DATES
                                            </Col>
                                            <Col lg="3" md="3">
                                              MONTHLY GROSS SALARY
                                            </Col>
                                            <Col lg="3" md="3">
                                              SUPERVISOR NAME
                                            </Col>
                                          </Row>
                                          <Row
                                            className="w-100 mt-1 mb-5"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "capitalize",
                                              color: "#000",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              {applicantData?.employment_position
                                                ? applicantData?.employment_position
                                                : ""}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {`${
                                                applicantData?.employment_date_from
                                                  ? applicantData?.employment_date_from +
                                                    "to "
                                                  : ""
                                              } ${
                                                applicantData?.employment_date_to
                                                  ? applicantData?.employment_date_to
                                                  : ""
                                              }`}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {applicantData?.employment_monthlyGrossSalary
                                                ? applicantData?.employment_monthlyGrossSalary
                                                : ""}
                                            </Col>
                                            <Col lg="3" md="3">
                                              {`${
                                                applicantData?.employment_supervisor_first
                                                  ? applicantData?.employment_supervisor_first
                                                  : ""
                                              } ${" "} ${
                                                applicantData?.employment_supervisor_last
                                                  ? applicantData?.employment_supervisor_last
                                                  : ""
                                              }`}
                                            </Col>
                                          </Row>
                                          <Row
                                            className=" mb-1"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "uppercase",
                                              color: "#aaa",
                                              width: "100%",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              SUPERVISOR TITLE
                                            </Col>
                                          </Row>
                                          <Row
                                            className="w-100 mt-1 mb-5"
                                            style={{
                                              fontSize: "14px",
                                              textTransform: "capitalize",
                                              color: "#000",
                                            }}
                                          >
                                            <Col lg="3" md="3">
                                              {applicantData?.employment_supervisor_title
                                                ? applicantData?.employment_supervisor_title
                                                : ""}
                                            </Col>
                                          </Row>
                                        </div>
                                      </Table>
                                    </div>
                                  </>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </Col>
                      </Row>
                    </TabPanel> */}

                    {/* <TabPanel value="Approved">
                      <CardHeader className="border-0">
                        
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
                            <Grid container spacing={2}>
                              {rentaldata.map((tenant, index) => (
                                <Grid
                                  item
                                  xs={12}
                                  sm={6}
                                  // key={index}
                                >
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
                                          {tenant.applicant_firstName || "N/A"}{" "}
                                          {tenant.applicant_lastName || "N/A"}
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
                                          {tenant.applicant_phoneNumber || "N/A"}
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
                                          {tenant.lease_data.rental_adress || "N/A"}
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
                                          Approved
                                        </div>
                                      </Col>
                                    </Row>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Col>
                        )}
                      </Row>
                    </TabPanel> */}

                    {/* <TabPanel value="Rejected">
                      <CardHeader className="border-0">
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
                            <Grid container spacing={2}>
                              {rentaldata.map((tenant, index) => (
                                <Grid
                                  item
                                  xs={12}
                                  sm={6}
                                  // key={index}
                                >
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
                                          {tenant.applicant_firstName || "N/A"}{" "}
                                          {tenant.applicant_lastName|| "N/A"}
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
                                          {tenant.applicant_phoneNumber || "N/A"}
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
                                          {tenant.lease_data.rental_adress || "N/A"}
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
                                          Rejected
                                        </div>
                                      </Col>
                                    </Row>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Col>
                        )}
                      </Row>
                    </TabPanel> */}
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
