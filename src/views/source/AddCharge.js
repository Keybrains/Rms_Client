import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
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
import ChargeHeader from "components/Headers/ChargeHeader";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import { Check, CheckBox } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { values } from "pdf-lib";
import Img from "assets/img/theme/team-4-800x800.jpg";
import "jspdf-autotable";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

const AddCharge = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { tenantId, entryIndex } = useParams();
  const { mainId, chargeIndex } = useParams();
  const [id, setId] = useState("");
  const [index, setIndex] = useState("");
  const [file, setFile] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [checkedCheckbox, setCheckedCheckbox] = useState();
  const [prodropdownOpen, setproDropdownOpen] = useState(false);
  const [recdropdownOpen, setrecDropdownOpen] = useState(false);
  const [rentAddress, setRentAddress] = useState([]);
  const [tenantid, setTenantid] = useState("");
  const [tenantentryIndex, setTenantentryindex] = useState("");
  const [printReceipt, setPrintReceipt] = useState(false);

  const toggle1 = () => setproDropdownOpen((prevState) => !prevState);
  const toggle2 = () => setrecDropdownOpen((prevState) => !prevState);

  const [selectedProp, setSelectedProp] = useState("Select Payment Method");
  const handlePropSelection = (propertyType) => {
    setSelectedProp(propertyType);
  };

  const [selectedRec, setSelectedRec] = useState("Select Resident");
  const handleRecieverSelection = (property) => {
    setSelectedRec(`${property.tenant_firstName} ${property.tenant_lastName}`);
    setTenantid(property._id);
    setTenantentryindex(property.entryIndex);
  };

  const generalledgerFormik = useFormik({
    initialValues: {
      date: "",
      rental_adress: "",
      tenant_id: "",
      entryIndex: "",
      charges_amount: "",
      tenant_firstName: "",
      charges_memo: "",
      entries: [
        {
          chargeIndex: "",
          charges_account: "",
          charges_amount: "",
          charges_total_amount: "",
        },
      ],
      charges_attachment: "",
    },
    validationSchema: yup.object({
      date: yup.string().required("Required"),
      charges_amount: yup.string().required("Required"),
      entries: yup.array().of(
        yup.object().shape({
          //   account: yup.string().required("Required"),
          //   balance: yup.number().required("Required"),
          //   amount: yup.number().required("Required"),
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
    navigate(`/admin/rentrolldetail/${tenantId}/${entryIndex}`);
  };

  // const handleSaveButtonClick = () => {
  //   navigate(`/admin/rentrolldetail/${tenantId}/${entryIndex}`);
  // };

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

  useEffect(() => {
    fetchTenantData();
    // Make an HTTP GET request to your Express API endpoint
    fetch(
      `${baseUrl}/tenant/tenant-name/tenant/${rentAddress}`
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
  }, [rentAddress]);

  const handleAccountSelection = (value, index) => {
    //console.log("Selected index:", index);

    const updatedEntries = [...generalledgerFormik.values.entries];
    //console.log("Current entries:", updatedEntries);

    if (updatedEntries[index]) {
      updatedEntries[index].charges_account = value;
      generalledgerFormik.setValues({
        ...generalledgerFormik.values,
        entries: updatedEntries,
      });
    } else {
      console.error(`Invalid index: ${index}`);
    }
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
  const [propertyId, setPropertyId] = useState("");
  const fetchTenantData = async () => {
    fetch(
      `${baseUrl}/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          const tenantData = data.data;
          const rentalAddress = tenantData.entries.rental_adress;
          setSelectedRec(`${tenantData.tenant_firstName} ${tenantData.tenant_lastName}`);
          setTenantid(tenantData._id);
          setPropertyId(tenantData.entries.propertyId);
          // setTenantentryindex(tenantData.entryIndex);
          setRentAddress(rentalAddress);
          generalledgerFormik.setValues({
            ...generalledgerFormik.values,
            rental_adress: rentalAddress,
          });
        }
      });
  };

  useEffect(() => {
    fetch(
      `${baseUrl}/addaccount/find_accountname`
    )
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
  // let totalDebit = 0;
  // let totalCredit = 0;
  // generalledgerFormik.values.entries.forEach((entries) => {
  //   if (entries.balance) {
  //     totalDebit += parseFloat(entries.balance);
  //   }
  //   if (entries.amount) {
  //     totalCredit += parseFloat(entries.amount);
  //   }
  // });
  let charges_total_amount = 0;
  generalledgerFormik.values.entries.forEach((entries) => {
    if (entries.charges_amount) {
      charges_total_amount += parseFloat(entries.charges_amount);
    }
  }); 
  const location = useLocation();
  const state =  location.state && location.state;

  const handleSubmit = async (values) => {
    const arrayOfNames = file.map((item) => item.name);
    const rentalAddress = generalledgerFormik.values.rental_adress;
    values["charges_total_amount"] = charges_total_amount;

    try {
      const updatedValues = {
        date: values.date,
        charges_amount: values.charges_amount,
        tenant_firstName: selectedRec,
        charges_attachment: arrayOfNames,
        rental_adress: rentalAddress,
        tenant_id: tenantid,
        entryIndex: tenantentryIndex,
        charges_memo: values.charges_memo || "Charge",
        entries: generalledgerFormik.values.entries.map((entry) => ({
          charges_account: entry.charges_account,
          charges_amount: parseFloat(entry.charges_amount),
          charges_total_amount: charges_total_amount,
        })),
      };
      //console.log(updatedValues, "updatedValues");
      const response = await axios.post(
        `${baseUrl}/payment/add_charges`,
        updatedValues
      );

      if (response.data.statusCode === 200) {
        swal("Success", "Charges Added Successfully", "success");
        navigate(`/admin/rentrolldetail/${tenantId}/${entryIndex}?source=payment`);
      } else {
        swal("Error", response.data.message, "error");
        console.error("Server Error:", response.data.message);
      }
      console.log(state,'state')
      debugger
      try{
        const chargeObject = {
          properties:{
            rental_adress:rentalAddress || "",
            property_id:propertyId
          },
          unit:[{
            unit:state && state.unit_name,
            unit_id:state && state.unit_id,
            paymentAndCharges:generalledgerFormik.values.entries.map((entry) => ({
                type:"Charge",
                account:entry.charges_account,
                amount:parseFloat(entry.charges_amount),
                rental_adress:rentAddress,
                rent_cycle:"",
                month_year:values.date.slice(5,7)+"-"+values.date.slice(0,4),
                date:values.date,
                memo: values.charges_memo,
                tenant_id:tenantid,
                tenant_firstName:selectedRec,
            })),
            
          }]
        }
        console.log(chargeObject,'chargeObject')
        // debugger
        const url = `${baseUrl}/payment_charge/payment_charge`
        await axios.post(url, chargeObject).then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      }
      catch{

      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  };

  const editCharge = async (mainId, chargeIndex, values) => {
    try {
      const arrayOfNames = file.map((item) => item.name);
      const rentalAddress = generalledgerFormik.values.rental_adress;
      values["charges_total_amount"] = charges_total_amount;

      const updatedValues = {
        tenant_id: id,
        entryIndex: index,
        date: values.date,
        charges_amount: values.charges_amount,
        tenant_firstName: selectedRec,
        charges_attachment: arrayOfNames,
        rental_adress: rentalAddress,
        tenant_id: tenantid,
        entryIndex: tenantentryIndex,
        charges_memo: values.charges_memo,
        entries: generalledgerFormik.values.entries.map((entry) => ({
          charges_account: entry.charges_account,
          charges_amount: parseFloat(entry.charges_amount),
          charges_total_amount: charges_total_amount,
        })),
      };
      //console.log(tenantId, "vaibhav");

      console.log(updatedValues, "updatedValues");

      const putUrl = `${baseUrl}/payment/charges/${mainId}/charge/${chargeIndex}`;
      const response = await axios.put(putUrl, updatedValues);

      if (response.data.statusCode === 200) {
        swal("Success", "Charges Update Successfully", "success");
        navigate(`/admin/rentrolldetail/${id}/${index}`);
        // navigate(`/admin/rentrolldetail/${tenantId}/${entryIndex}`);
        // if (tenantId && entryIndex) {
        //   //console.log(tenantId,'mm')
        //   //console.log(entryIndex,'nn')
        //   navigate(`/admin/rentrolldetail/${tenantId}/${entryIndex}`);
        // }
        // //console.log(`/admin/rentrolldetail/${tenantId}/${entryIndex}`,"fdsfsdfsf")
      } else {
        swal("Error", response.data.message, "error");
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

  const [chargeData, setchargeData] = useState(null);

  useEffect(() => {
    //console.log(mainId, chargeIndex, "mainid && charge Id");
    if (mainId && chargeIndex) {
      axios
        .get(
          `${baseUrl}/payment/charge_summary/${mainId}/charge/${chargeIndex}`
        )
        .then((response) => {
          const chargeData = response.data.data;
          setchargeData(chargeData);
          console.log(chargeData, "chargedata");
          console.log(chargeData.entries, "entries data");
          const formattedDate =
            chargeData && chargeData.date
              ? new Date(chargeData.date).toISOString().split("T")[0]
              : "";
          console.log(formattedDate, "formattedDate");
          const id = chargeData.tenant_id;
          setId(id);
          //console.log(id, "abcd");
          const index = chargeData.entryIndex;
          setIndex(index);
          //console.log(index, "xyz");
          setSelectedRec(chargeData.tenant_firstName || "Select");

          const entriesData = chargeData.entries || [];

          if (Array.isArray(entriesData)) {
            // Handling when entriesData is an array
            generalledgerFormik.setValues({
              charges_amount: chargeData.charges_amount || "",
              date: formattedDate,
              charges_memo: chargeData.charges_memo || "",
              entries: entriesData.map((entry) => ({
                charges_account: entry.charges_account || "",
                charges_amount: entry.charges_amount || "",
                charges_total_amount: entry.charges_total_amount || "",
              })),
            });
          } else {
            // Handling when entriesData is an object
            console.error("entriesData is not an array:", entriesData);
            generalledgerFormik.setValues({
              charges_amount: chargeData.charges_amount || "",
              date: formattedDate,
              charges_memo: chargeData.charges_memo || "",
              // Assuming you want to use the single object received as the only entry
              entries: [
                {
                  charges_account: entriesData.charges_account || "",
                  charges_amount: entriesData.charges_amount || "",
                  charges_total_amount: entriesData.charges_total_amount || "",
                },
              ],
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching vendor data:", error);
        });
    }
  }, [mainId, chargeIndex]);

  return (
    <>
      <ChargeHeader />
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
                    <h3 className="mb-0">
                      {mainId ? "Edit Charge" : "New Charge"}
                    </h3>
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
                    <Col lg="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Amount
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="$0.00"
                          type="text"
                          name="charges_amount"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.charges_amount}
                        />
                        {generalledgerFormik.touched.charges_amount &&
                        generalledgerFormik.errors.charges_amount ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.charges_amount}
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
                          Recieved From
                        </label>
                        <br />
                        <Dropdown isOpen={recdropdownOpen} toggle={toggle2}>
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedRec ? selectedRec : "Select Resident"}
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                              width: "100%",
                              maxHeight: "200px",
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            {propertyData.map((property, index) => (
                              <DropdownItem
                                key={index}
                                onClick={() =>
                                  handleRecieverSelection(property)
                                }
                              >
                                {`${property.tenant_firstName} ${property.tenant_lastName}`}
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
                          placeholder="if left blank, will show 'Payment'"
                          type="text"
                          name="charges_memo"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.charges_memo || "Charge"}
                        />
                        {generalledgerFormik.touched.charges_memo &&
                        generalledgerFormik.errors.charges_memo ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.charges_memo}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Apply Payment to Balances
                        </label>
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
                                <th>Amount</th>
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
                                            {entries.charges_account
                                              ? entries.charges_account
                                              : "Select"}
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
                                              Liability Account
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() =>
                                                handleAccountSelection(
                                                  "Last Month's Rent",
                                                  index
                                                )
                                              }
                                            >
                                              Last Month's Rent
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() =>
                                                handleAccountSelection(
                                                  "Prepayments",
                                                  index
                                                )
                                              }
                                            >
                                              Prepayments
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() =>
                                                handleAccountSelection(
                                                  "Security Deposit Liability",
                                                  index
                                                )
                                              }
                                            >
                                              Security Deposit Liability
                                            </DropdownItem>

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
                                      {/* <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          type="number"
                                          name={`entries[${index}].balance`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={entries.balance}
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
                                        ].balance ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .entries[index].balance
                                            }
                                          </div>
                                        ) : null}
                                      </td> */}
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          style={{ width: "80%" }}
                                          type="text"
                                          name={`entries[${index}].charges_amount`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                                            e.target.value = numericValue;
                                          }}
                                          value={entries.charges_amount}
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
                                        ].charges_amount ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .entries[index].charges_amount
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
                                  {/* <th>{totalDebit.toFixed(2)}</th> */}

                                  <th>{charges_total_amount.toFixed(2)}</th>
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
                  {/* <Row>
                    <Col lg="3">
                      <FormGroup>
                        <Checkbox
                          name="print_receipt"
                          onChange={(e) => setPrintReceipt(e.target.checked)}
                        />
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Print Receipt
                        </label>
                      </FormGroup>
                    </Col>
                  </Row> */}
                  <Row>
                    <Col lg="5">
                      <FormGroup>
                        {/* <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ background: "green", color: "white" }}
                          onClick={(e) => {
                            e.preventDefault();
                            generalledgerFormik.handleSubmit();
                            //console.log(generalledgerFormik.values);
                          }}
                        >
                          {mainId ? "Edit Charge" : "New Charge"}
                        </button> */}
                        {mainId && chargeIndex ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              editCharge(
                                mainId,
                                chargeIndex,
                                generalledgerFormik.values
                              );
                              // handleSaveButtonClick();
                            }}
                          >
                            Edit Charge
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              generalledgerFormik.handleSubmit();
                              //console.log(generalledgerFormik.values);
                            }}
                          >
                            Add Charge
                          </button>
                        )}

                        <Button
                          color="primary"
                          href="#rms"
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

export default AddCharge;
