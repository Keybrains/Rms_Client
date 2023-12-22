import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import Cookies from "universal-cookie";
import swal from "sweetalert";
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
  Table,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
} from "reactstrap";
import AddGenralLedgerHeader from "components/Headers/AddGenralLedgerHeader";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import { jwtDecode } from "jwt-decode";

const AddGeneralLedger = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [selectedProp, setSelectedProp] = useState("Select");
  const handlePropSelection = (propertyType) => {
    setSelectedProp(propertyType);
  };

  const [file, setFile] = useState("");
  const [accountData, setAccountData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [prodropdownOpen, setproDropdownOpen] = useState(false);

  const toggle1 = () => setproDropdownOpen((prevState) => !prevState);

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

  const generalledgerFormik = useFormik({
    initialValues: {
      date: "",
      rental_adress: "",
      memo: "",
      entries: [
        {
          account: "",
          description: "",
          debit: "",
          credit: "",
          dropdownOpen: false,
        },
      ],
      date_range: "",
      attachment: "",
      total_amount: "",
    },
    validationSchema: yup.object({
      entries: yup.array().of(
        yup.object().shape({
          account: yup.string().required("Required"),
          description: yup.string().required("Required"),
          debit: yup.number().required("Required"),
          credit: yup.number().required("Required"),
        })
      ),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      //console.log(values, "values");
    },
  });

  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    navigate("../GeneralLedger");
  };

  const handleAccountSelection = (value, index) => {
    const updatedEntries = [...generalledgerFormik.values.entries];
    updatedEntries[index].account = value;
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      entries: updatedEntries,
    });
  };

  const handleAddRow = () => {
    const newEntry = {
      account: "",
      description: "",
      debit: "",
      credit: "",
      dropdownOpen: false,
    };
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      entries: [...generalledgerFormik.values.entries, newEntry],
    });
  };

  const toggleDropdown = (index) => {
    const updatedEntries = [...generalledgerFormik.values.entries];
    updatedEntries[index].dropdownOpen = !updatedEntries[index].dropdownOpen;
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      entries: updatedEntries,
    });
  };

  const handleRemoveRow = (index) => {
    const updatedEntries = [...generalledgerFormik.values.entries];
    updatedEntries.splice(index, 1); // Remove the entry at the specified index
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      entries: updatedEntries,
    });
  };

  useEffect(() => {
    fetch(`${baseUrl}/rentals/property_onrent`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setPropertyData(data.data);
          //console.log(data.data);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/addaccount/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setAccountData(data.data);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  }, []);

  // Calculate the total debit and credit
  let totalDebit = 0;
  let totalCredit = 0;
  generalledgerFormik.values.entries.forEach((entries) => {
    if (entries.debit) {
      totalDebit += parseFloat(entries.debit);
    }
    if (entries.credit) {
      totalCredit += parseFloat(entries.credit);
    }
  });
  const handleSubmit = async (values) => {
    const arrayOfNames = Array.isArray(file)
      ? file.map((item) => item.name)
      : [];
    try {
      const updatedValues = {
        date: values.date,
        rental_adress: selectedProp,
        attachment: arrayOfNames,
        total_amount: (totalDebit + totalCredit).toFixed(2),
        entries: generalledgerFormik.values.entries.map((entry) => ({
          account: entry.account,
          description: entry.description,
          debit: parseFloat(entry.debit),
          credit: parseFloat(entry.credit),
        })),
      };

      const response = await axios.post(
        `${baseUrl}/ledger/ledger`,
        updatedValues
      );

      if (response.data.statusCode === 200) {
        swal("", response.data.message, "success");
        navigate("/admin/GeneralLedger");
      } else {
        swal("", response.data.message, "error");
        console.error("Server Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  };

  const fileData = (files) => {
    //setImgLoader(true);
    // //console.log(files, "file");
    const filesArray = [...files];

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
  const handleOpenFile = (item) => {
    // //console.log(file,"fike")
    // const fileToOpen = file.filter((file) => {
    //   return file.name === item.name
    // })
    // //console.log(fileToOpen, "fileToOpen");
    //console.log(item, "item");
    const url = URL.createObjectURL(item);
    window.open(url, "_blank");
  };
  return (
    <>
      <AddGenralLedgerHeader />
      <style>
        {`
    .custom-date-picker {
      background-color: white;
    }
  `}
      </style>

      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card
              className="bg-secondary shadow"
              onSubmit={generalledgerFormik.handleSubmit}
            >
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">New General Ledger</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="3000"
                          type="date"
                          name="date"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.date}
                        />
                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            className="form-control-alternative custom-date-picker"
                            name="date"
                            slotProps={{ textField: { size: "small" } }}
                            views={["year", "month", "day"]}
                            id="input-unitadd"
                            placeholder="3000"
                            dateFormat="MM-dd-yyyy"
                            onBlur={generalledgerFormik.handleBlur}
                            selected={generalledgerFormik.values.date} // Use 'selected' prop instead of 'value'
                            onChange={(date) => {
                              generalledgerFormik.setFieldValue("date", date); // Update the Formik field value
                            }}
                          />
                        </LocalizationProvider> */}
                        {generalledgerFormik.touched.date &&
                        generalledgerFormik.errors.date ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.date}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Property
                        </label>
                        <br />
                        <Dropdown isOpen={prodropdownOpen} toggle={toggle1}>
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedProp ? selectedProp : "Select"}
                          </DropdownToggle>
                          {/* <DropdownMenu
                            style={{
                              zIndex: 999,
                              maxHeight: "280px",
                              // overflowX: "hidden",
                              overflowY: "auto",
                              width: "100%",
                            }}
                          >
                            {propertyData?.map((item) => (
                              <DropdownItem
                                key={item._id}
                                onClick={() =>
                                  handlePropSelection(item)
                                }
                              >
                                {item.rental_adress}
                              </DropdownItem>
                            ))}
                          </DropdownMenu> */}
                          <DropdownMenu
                            style={{
                              width: "100%",
                              maxHeight: "200px",
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            {propertyData.map((property) => (
                              <DropdownItem
                                key={property}
                                onClick={() => handlePropSelection(property)}
                              >
                                {property}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Memo
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="if left blank, will show Rent"
                          type="text"
                          name="memo"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.memo}
                        />
                        {generalledgerFormik.touched.memo &&
                        generalledgerFormik.errors.memo ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.memo}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <div className="table-responsive">
                          <Table
                            className="table table-bordered"
                            style={{
                              borderCollapse: "collapse",
                              border: "1px solid #ddd",
                              overflow: "hidden",
                            }}
                          >
                            <thead>
                              <tr>
                                <th>Account</th>
                                <th>Description</th>
                                <th>debit</th>
                                <th>credit</th>
                              </tr>
                            </thead>
                            <tbody>
                              <>
                                {generalledgerFormik.values.entries.map(
                                  (entries, index) => (
                                    <tr key={index}>
                                      <td>
                                        <Dropdown
                                          isOpen={entries.dropdownOpen}
                                          toggle={() => toggleDropdown(index)}
                                        >
                                          <DropdownToggle caret>
                                            {entries.account || "Select"}
                                          </DropdownToggle>
                                          <DropdownMenu
                                            style={{
                                              zIndex: 999,
                                              maxHeight: "200px",
                                              overflowY: "auto",
                                            }}
                                          >
                                            <DropdownItem
                                              header
                                              style={{ color: "blue" }}
                                            >
                                              Income Account
                                            </DropdownItem>
                                            {accountData?.map((item) => (
                                              <DropdownItem
                                                key={item._id}
                                                onClick={() =>
                                                  handleAccountSelection(
                                                    item.account_name,
                                                    index
                                                  )
                                                }
                                              >
                                                {item.account_name}
                                              </DropdownItem>
                                            ))}
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
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={entries.description}
                                        />
                                        {generalledgerFormik.touched.entries &&
                                        generalledgerFormik.touched.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ].description ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .entries[index].description
                                            }
                                          </div>
                                        ) : null}
                                      </td>
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="Debit"
                                          type="text"
                                          name={`entries[${index}].debit`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={entries.debit}
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                                            e.target.value = numericValue;
                                          }}
                                        />
                                        {generalledgerFormik.touched.entries &&
                                        generalledgerFormik.touched.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ].debit ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .entries[index].debit
                                            }
                                          </div>
                                        ) : null}
                                      </td>
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="Credit"
                                          type="text"
                                          name={`entries[${index}].credit`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={entries.credit}
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                                            e.target.value = numericValue;
                                          }}
                                        />
                                        {generalledgerFormik.touched.entries &&
                                        generalledgerFormik.touched.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ].credit ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .entries[index].credit
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
                                  <th>{totalDebit.toFixed(2)}</th>
                                  <th>{totalCredit.toFixed(2)}</th>
                                </tr>
                              </>
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
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Upload Files (Maximum of 10)
                        </label>

                        <div className="d-flex">
                          <div className="file-upload-wrapper">
                            <input
                              type="file"
                              className="form-control-file d-none"
                              accept="file/*"
                              name="upload_file"
                              id="upload_file"
                              multiple
                              onChange={(e) => fileData(e.target.files)}
                            />
                            <label for="upload_file" className="btn">
                              Choose Files
                            </label>

                            {generalledgerFormik.touched.attachment &&
                            generalledgerFormik.errors.attachment ? (
                              <div style={{ color: "red" }}>
                                {generalledgerFormik.errors.attachment}
                              </div>
                            ) : null}
                          </div>

                          <div className="d-flex ">
                            {file.length > 0 &&
                              file?.map((file, index) => (
                                <div
                                  key={index}
                                  style={{
                                    position: "relative",
                                    marginLeft: "50px",
                                  }}
                                >
                                  <p
                                    onClick={() => handleOpenFile(file)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {file?.name?.substr(0, 5)}
                                    {file?.name?.length > 5 ? "..." : null}
                                  </p>
                                  <CloseIcon
                                    style={{
                                      cursor: "pointer",
                                      position: "absolute",
                                      left: "64px",
                                      top: "-2px",
                                    }}
                                    onClick={() => deleteFile(index)}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="5">
                      <FormGroup>
                        <Button
                          type="submit"
                          className="btn btn-primary"
                          style={{ background: "green", color: "white" }}
                          onClick={(e) => {
                            e.preventDefault();
                            generalledgerFormik.handleSubmit();
                          }}
                        >
                          Add General Ledger
                        </Button>
                        <Button
                          color="primary"
                         //  href="#rms"
                          className="btn btn-primary"
                          onClick={handleCloseButtonClick}
                          style={{ background: "white", color: "black" }}
                        >
                          Cancel
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddGeneralLedger;
