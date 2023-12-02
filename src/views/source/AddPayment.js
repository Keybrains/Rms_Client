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
import PaymentHeader from "components/Headers/PaymentHeader";
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

const AddPayment = () => {
  const { tenantId, entryIndex } = useParams();
  const { mainId, paymentIndex } = useParams();
  const [id, setId] = useState("");
  const [index, setIndex] = useState("");
  const [file, setFile] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [checkedCheckbox, setCheckedCheckbox] = useState();
  const [prodropdownOpen, setproDropdownOpen] = useState(false);
  const [recdropdownOpen, setrecDropdownOpen] = useState(false);
  const [rentAddress, setRentAddress] = useState([]);
  const [tenantid, setTenantid] = useState(""); // Add this line
  const [tenantentryIndex, setTenantentryindex] = useState(""); // Add this line
  const [printReceipt, setPrintReceipt] = useState(false);

  const toggle1 = () => setproDropdownOpen((prevState) => !prevState);
  const toggle2 = () => setrecDropdownOpen((prevState) => !prevState);

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

  const [selectedProp, setSelectedProp] = useState("Select Payment Method");
  const handlePropSelection = (propertyType) => {
    setSelectedProp(propertyType);
  };

  const [selectedRec, setSelectedRec] = useState("Select Resident");
  const handleRecieverSelection = (property) => {
    setSelectedRec(`${property.tenant_firstName} ${property.tenant_lastName}`);
    setTenantid(property._id); // Set the selected tenant's ID
    setTenantentryindex(property.entryIndex); // Set the selected tenant's entry index
  };
  const navigate = useNavigate();
  const generalledgerFormik = useFormik({
    initialValues: {
      date: "",
      rental_adress: "",
      tenant_id: "",
      entryIndex: "",
      amount: "",
      payment_method: "",
      debitcard_number: "",
      tenant_firstName: "",
      memo: "",
      entries: [
        {
          paymentIndex: "",
          account: "",
          description: "",
          debit: "",
          credit: "",
          dropdownOpen: false,
        },
      ],
      attachment: "",
      total_amount: "",
    },
    validationSchema: yup.object({
      date: yup.string().required("Required"),
      amount: yup.string().required("Required"),
      entries: yup.array().of(
        yup.object().shape({
          account: yup.string().required("Required"),
          balance: yup.number().required("Required"),
          amount: yup.number().required("Required"),
        })
      ),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      //console.log(values, "values");
    },
  });

  const handleCloseButtonClick = () => {
    navigate(`/admin/rentrolldetail/${tenantId}/${entryIndex}`);
  };

  // const handleSavePaymentButtonClick = () => {
  //   navigate(`/admin/rentrolldetail/${tenantId}/${entryIndex}`);
  // };

  useEffect(() => {
    fetchTenantData();
    // Make an HTTP GET request to your Express API endpoint
    fetch(
      `http://localhost:4000/api/tenant/tenant-name/tenant/${rentAddress}`
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
      updatedEntries[index].account = value;
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

  const fetchTenantData = async () => {
    fetch(
      `http://localhost:4000/api/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          const tenantData = data.data;
          const rentalAddress = tenantData.entries.rental_adress;
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
      "http://localhost:4000/api/addaccount/find_accountname"
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
  let total_amount = 0;
  generalledgerFormik.values.entries.forEach((entries) => {
    if (entries.amount) {
      total_amount += parseFloat(entries.amount);
    }
  });
  const handleSubmit = async (values) => {
    const arrayOfNames = file.map((item) => item.name);
    const rentalAddress = generalledgerFormik.values.rental_adress;
    values["total_amount"] = total_amount;

    try {
      const updatedValues = {
        date: values.date,
        amount: values.amount,
        payment_method: selectedProp,
        debitcard_number: values.debitcard_number,
        tenant_firstName: selectedRec,
        attachment: arrayOfNames,
        rental_adress: rentalAddress,
        tenant_id: tenantid,
        entryIndex: tenantentryIndex,

        entries: generalledgerFormik.values.entries.map((entry) => ({
          account: entry.account,
          balance: parseFloat(entry.balance),
          amount: parseFloat(entry.amount),
          total_amount: total_amount,
        })),
      };
      //console.log(updatedValues, "updatedValues");
      const response = await axios.post(
        "http://localhost:4000/api/payment/add_payment", ///http://localhost:4000
        updatedValues
      );

      if (response.data.statusCode === 200) {
        const id = response.data.data._id;
        if (id) {
          const pdfResponse = await axios.get(
            `http://localhost:4000/api/Payment/Payment_summary/${id}`,
            { responseType: "blob" }
          );
          if (pdfResponse.status === 200 && printReceipt) {
            const pdfBlob = pdfResponse.data;
            const pdfData = URL.createObjectURL(pdfBlob);
            const doc = new jsPDF();

            // Set custom styling
            doc.setFont("helvetica");
            doc.setFontSize(12);

            // Add the image
            doc.addImage(Img, "JPEG", 15, 20, 30, 15); // left margin topmargin width hetght

            // Add the payment receipt text
            doc.setFont("helvetica", "bold"); // Set font name and style to bold
            doc.setFontSize(16); // Increase the font size to 16
            doc.text("Payment Receipt", 90, 30);
            doc.setFont("helvetica", "normal"); // Reset font style to normal (optional)
            doc.setFontSize(12); // Reset the font size to its original size (optional)

            doc.setFont("helvetica", "bold"); // Set font name and style to bold for titles
            doc.text("Date:", 15, 60); // Title in bold
            doc.setFont("helvetica", "normal"); // Reset font style to normal for data
            doc.text(updatedValues.date, 28, 60); // Value in normal font

            doc.setFont("helvetica", "bold"); // Set font name and style to bold for titles
            doc.text("Tenant Name:", 15, 70); // Title in bold
            doc.setFont("helvetica", "normal"); // Reset font style to normal for data
            doc.text(selectedRec, 45, 70);

            doc.setFont("helvetica", "bold"); // Set font name and style to bold for titles
            doc.text("Payment Method:", 15, 80); // Title in bold
            doc.setFont("helvetica", "normal"); // Reset font style to normal for data
            doc.text(selectedProp, 52, 80);

            // doc.text("Tenant Name: " + selectedRec, 15, 70); // Title and data in normal font
            // doc.text("Payment Method: " + selectedProp, 15, 80);

            const headers = [
              {
                content: "Account",
                styles: {
                  fillColor: [211, 211, 211],
                  textColor: [255, 255, 255],
                },
              },
              {
                content: "Amount",
                styles: {
                  fillColor: [211, 211, 211],
                  textColor: [255, 255, 255],
                },
              },
            ];

            // Create data array with rows for "Account" and "Amount" values
            const data = updatedValues.entries.map((entry) => [
              entry.account,
              entry.amount,
            ]);

            // Add a separate row for "Total Amount"
            const totalAmount = parseFloat(
              updatedValues.entries[0].total_amount
            );
            data.push([
              { content: "Total Amount", styles: { fontStyle: "bold" } },
              { content: totalAmount, styles: { fontStyle: "bold" } },
            ]);

            const headStyles = {
              lineWidth: 0.01,
              lineColor: [0, 0, 0],
              fillColor: [19, 89, 160],
              textColor: [255, 255, 255],
              fontStyle: "bold",
            };

            doc.autoTable({
              head: [headers],
              body: data,
              startY: 90,
              theme: "striped",
              styles: { fontSize: 12 },
              headers: headStyles,
              margin: { top: 10, left: 10 },
            });

            // Add the table to the PDF

            // Add the PDF content
            doc.addImage(pdfData, "JPEG", 15, 110, 180, 100);

            // Save the PDF with a custom filename
            doc.save(`PaymentReceipt_${id}.pdf`);
          } else {
            if (!printReceipt) {
              swal("Success!", "Payment added successfully", "success");
            } else {
              swal("Error", "Failed to retrieve PDF summary", "error");
            }
          }
        } else {
          swal("Error", "Failed to get 'id' from the response", "error");
        }

        navigate(`/admin/rentrolldetail/${tenantId}/${entryIndex}`); // Navigate to the desired page
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
  const [paymentData, setpaymentData] = useState(null);

  useEffect(() => {
    //console.log(mainId, paymentIndex, "mainid && payment Id");
    if (mainId && paymentIndex) {
      axios
        .get(
          `http://localhost:4000/api/payment/payment_summary/${mainId}/payment/${paymentIndex}`
        )
        .then((response) => {
          const paymentData = response.data.data;
          setpaymentData(paymentData);
          //console.log(paymentData, "paymentData");
          //console.log(paymentData.entries, "entries data");
          const id = paymentData.tenant_id;
          setId(id);
          //console.log(id, "abcd");
          const index = paymentData.entryIndex;
          setIndex(index);
          //console.log(index, "xyz");

          const formattedDate =
            paymentData && paymentData.date
              ? new Date(paymentData.date).toISOString().split("T")[0]
              : "";
          //console.log(formattedDate, "formattedDate");

          setSelectedRec(paymentData.tenant_firstName || "Select");
          setSelectedProp(paymentData.payment_method || "Select");

          const entriesData = paymentData.entries || [];

          if (Array.isArray(entriesData)) {
            // Handling when entriesData is an array
            generalledgerFormik.setValues({
              date: formattedDate,
              amount: paymentData.amount || "",
              memo: paymentData.memo || "",
              entries: entriesData.map((entry) => ({
                account: entry.account || "",
                balance: entry.balance || "",
                amount: entry.amount || "",
                total_amount: entry.total_amount || "",
              })),
            });
          } else if (typeof entriesData === "object") {
            // Handling when entriesData is an object
            console.error("entriesData is not an array:", entriesData);
            // Here, handle the single object scenario, you can convert it to an array or handle it accordingly.
            generalledgerFormik.setValues({
              date: formattedDate,
              amount: paymentData.amount || "",
              memo: paymentData.memo || "",
              entries: [
                {
                  account: entriesData.account || "",
                  balance: entriesData.balance || "",
                  amount: entriesData.amount || "",
                  total_amount: entriesData.total_amount || "",
                },
              ],
            });
          } else {
            console.error("Invalid entriesData format:", entriesData);
            // Handle other unexpected formats here if needed
          }
        })
        .catch((error) => {
          console.error("Error fetching vendor data:", error);
        });
    }
  }, [mainId, paymentIndex]);

  const editpayment = async (mainId, paymentIndex, values) => {
    const arrayOfNames = file.map((item) => item.name);
    const rentalAddress = generalledgerFormik.values.rental_adress;
    values["total_amount"] = total_amount;

    try {
      const updatedValues = {
        date: values.date,
        amount: values.amount,
        payment_method: selectedProp,
        debitcard_number: values.debitcard_number,
        tenant_firstName: selectedRec,
        attachment: arrayOfNames,
        rental_adress: rentalAddress,
        tenant_id: tenantid,
        entryIndex: tenantentryIndex,

        entries: generalledgerFormik.values.entries.map((entry) => ({
          account: entry.account,
          balance: parseFloat(entry.balance),
          amount: parseFloat(entry.amount),
          total_amount: total_amount,
        })),
      };

      //console.log(updatedValues, "updatedValues");

      const putUrl = `http://localhost:4000/api/payment/payments/${mainId}/payment/${paymentIndex}`;
      const response = await axios.put(putUrl, updatedValues);

      if (response.data.statusCode === 200) {
        swal("Success", "Payments Update Successfully", "success");
        navigate(`/admin/rentrolldetail/${id}/${index}`);
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

  return (
    <>
      <PaymentHeader />
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
                    <h3 className="mb-0">New Payment</h3>
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
                          name="amount"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.amount}
                        />
                        {generalledgerFormik.touched.amount &&
                        generalledgerFormik.errors.amount ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.amount}
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
                          Payment Method
                        </label>
                        <br />
                        <Dropdown isOpen={prodropdownOpen} toggle={toggle1}>
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedProp
                              ? selectedProp
                              : "Select Payment Method"}
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                              width: "100%",
                              maxHeight: "200px",
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            <DropdownItem
                              onClick={() => handlePropSelection("Debit Card")}
                            >
                              Debit Card
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handlePropSelection("Cash")}
                            >
                              Cash
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                    <Col sm="4">
                      {selectedProp === "Debit Card" && (
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Debit Card Number
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-unitadd"
                            placeholder="Enter Number"
                            type="text"
                            name="debitcard_number"
                            onBlur={generalledgerFormik.handleBlur}
                            onChange={generalledgerFormik.handleChange}
                            value={generalledgerFormik.values.debitcard_number}
                          />
                          {generalledgerFormik.touched.debitcard_number &&
                          generalledgerFormik.errors.debitcard_number ? (
                            <div style={{ color: "red" }}>
                              {generalledgerFormik.errors.debitcard_number}
                            </div>
                          ) : null}
                        </FormGroup>
                      )}
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
                                <th>Balance</th>
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
                                            {entries.account
                                              ? entries.account
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
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          type="text"
                                          name={`entries[${index}].balance`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={entries.balance}
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
                                        ].balance ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .entries[index].balance
                                            }
                                          </div>
                                        ) : null}
                                      </td>
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          type="text"
                                          name={`entries[${index}].amount`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={entries.amount}
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
                                        ].amount ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .entries[index].amount
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
                                  <th></th>
                                  <th>{total_amount.toFixed(2)}</th>
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

                        <div class="d-flex">
                          <div class="file-upload-wrapper">
                            <input
                              type="file"
                              className="form-control-file d-none"
                              accept="file/*"
                              name="upload_file"
                              id="upload_file"
                              multiple
                              onChange={(e) => fileData(e.target.files)}
                            />
                            <label for="upload_file" class="btn">
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
                  </Row>
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
                          }}
                        >
                          Save Payment
                        </button> */}
                        {mainId && paymentIndex ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              editpayment(
                                mainId,
                                paymentIndex,
                                generalledgerFormik.values
                              );
                            }}
                          >
                            Edit Payment
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              generalledgerFormik.handleSubmit();
                            }}
                          >
                            New Payment
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

export default AddPayment;
