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
  Popover,
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
import moment from "moment";
import { OverlayTrigger } from "react-bootstrap";

const AddPayment = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { tenantId, entryIndex } = useParams();
  const { paymentId } = useParams();
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
  // const [limitedValue,setLimitedValue]=useState(null);

  const toggle1 = () => setproDropdownOpen((prevState) => !prevState);
  const toggle2 = () => setrecDropdownOpen((prevState) => !prevState);

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  const location = useLocation();
  const state = location.state && location.state;
  const paymentState = state;

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
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
  const [property, setProperty] = useState(null);

  // console.log(generalledgerFormik.values,'sdfyggvbhjnkml')
  const handleRecieverSelection = (property) => {
    // setProperty(property);
    console.log(property, "property");
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
      creditcard_number: "",
      expiration_date: "",
      cvv: "",
      tenant_firstName: "",
      memo: "",
      entries: [
        {
          paymentIndex: "",
          account: "",
          amount: "",
          balance: "",
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
          // balance: yup.number().required("Required"),
          amount: yup.number().required("Required"),
        })
      ),
    }),
    onSubmit: (values) => {
      if (Number(generalledgerFormik.values.amount) === Number(total_amount)) {
        handleSubmit(values);
      }
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
    fetch(`${baseUrl}/tenant/tenant-name/tenant/${rentAddress}`)
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

  const toggleDropdownForFormik = (index) => {
    formikForAnotherData.setValues((prevValues) => {
      const updatedEntries = [...prevValues.entries];
      if (updatedEntries[index]) {
        updatedEntries[index].dropdownOpen =
          !updatedEntries[index].dropdownOpen;
      }
      return { ...prevValues, entries: updatedEntries };
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

  const handleRemoveRow2 = (index) => {
    const updatedEntries = [...formikForAnotherData.values.entries];
    updatedEntries.splice(index, 1); // Remove the entry at the specified index
    formikForAnotherData.setValues({
      ...formikForAnotherData.values,
      entries: updatedEntries,
    });
  };

  const [tenantData, setTenantData] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  // const [propertyData, setPropertyData] = useState([]);
  const fetchTenantData = async () => {
    fetch(`${baseUrl}/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          const tenantDatas = data.data;
          setTenantData(tenantDatas);
          const rentalAddress = tenantDatas.entries.rental_adress;
          // console.log(tenantDatas.entries.property_id, "propertyId");
          setSelectedRec(
            `${tenantDatas.tenant_firstName} ${tenantDatas.tenant_lastName}`
          );
          setTenantid(tenantDatas._id);
          getAllCharges(tenantDatas._id);
          setPropertyId(tenantDatas.entries.property_id);
          setRentAddress(rentalAddress);
          generalledgerFormik.setValues({
            ...generalledgerFormik.values,
            rental_adress: rentalAddress,
          });
        }
      });
  };

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

  if (generalledgerFormik.values.values) {
  }
  // console.log(property,'proeprty')
  const [loader, setLoader] = useState(false);

  const formatExpirationDate = (date) => {
    // Assuming date is in the format "MM/YYYY"
    const [month, year] = date.split("/");
    return `${month}${year}`;
  };

  const handleSubmit = async (values) => {
    setLoader(true);

    if (Array.isArray(generalledgerFormik.values.attachment)) {
      for (const [
        index,
        files,
      ] of generalledgerFormik.values.attachment.entries()) {
        if (files.upload_file instanceof File) {
          console.log(files.upload_file, "myfile");

          const imageData = new FormData();
          imageData.append(`files`, files.upload_file);

          const url = `${baseUrl}/images/upload`;

          try {
            const result = await axios.post(url, imageData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            console.log(result, "imgs");

            // Update the original array with the uploaded file URL
            generalledgerFormik.values.attachment[index].upload_file =
              result.data.files[0].url;
          } catch (error) {
            console.error(error);
          }
        } else {
          console.log(files.upload_file, "myfile2");
        }
      }
    } else {
      console.error("Attachment is not an array");
      // Handle the case where attachment is not an array
    }
    const rentalAddress = generalledgerFormik.values.rental_adress;
    values["total_amount"] = total_amount;

    const updatedValues = {
      date: values.date,
      amount: values.amount,
      payment_method: selectedProp,
      cvv: values.cvv,
      expiration_date: values.expiration_date,
      creditcard_number: values.creditcard_number,
      tenant_firstName: selectedRec,
      attachment: generalledgerFormik.values.attachment,
      rental_adress: rentalAddress,
      tenant_id: tenantid,
      entryIndex: tenantentryIndex,
      memo: values.memo || "Payment",

      entries: [
        ...generalledgerFormik.values.entries.map((entry) => ({
          account: entry.account,
          amount: parseFloat(entry.amount),
          total_amount: total_amount,
        })),
        ...formikForAnotherData.values.entries.map((entry) => ({
          account: entry.account,
          amount: parseFloat(entry.amount),
          total_amount: total_amount,
        })),
      ],
    };
    try {
      const response = await axios.post(
        `${baseUrl}/payment/add_payment`,
        updatedValues
      );

      if (response.data.statusCode === 200) {
        if (selectedProp === "Credit Card") {
          try {
            const url = `${baseUrl}/nmipayment/purchase`;
            console.log(url, "nmi api -----------");
            const postObject = {
              first_name: tenantData.tenant_firstName,
              last_name: tenantData.tenant_lastName,
              email_name: tenantData.tenant_email,
              card_number: generalledgerFormik.values.creditcard_number,
              amount: values.amount,
              expiration_date: formatExpirationDate(values.expiration_date),
              cvv: values.cvv,
              tenantId: tenantData._id,
              propertyId: tenantData?.entries?.property_id,
              unitId: tenantData?.entries?.unit_id,
            };

            const response = await axios.post(url, {
              paymentDetails: postObject,
            });
            if (response.data && response.data.statusCode === 100) {
              console.log(response.data, "response.data");
            } else {
              console.error("Unexpected response format:", response.data);
              swal("", response.data.message, "error");
            }
          } catch (error) {
            console.log(error);
          }
        }

        const id = response.data.data._id;
        if (id) {
          const pdfResponse = await axios.get(
            `${baseUrl}/Payment/Payment_summary/${id}`,
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

        navigate(
          `/admin/rentrolldetail/${tenantId}/${entryIndex}?source=payment`
        ); // Navigate to the desired page
      } else {
        swal("Error", response.data.message, "error");
        console.error("Server Error:", response.data.message);
      }
      try {
        const paymentObject = {
          properties: {
            rental_adress: rentalAddress,
            property_id: propertyId,
          },
          unit: [
            {
              unit: (state && state.unit_name) || "",
              unit_id: (state && state.unit_id) || "",

              paymentAndCharges: [
                ...generalledgerFormik.values.entries.map((entry) => ({
                  type: "Payment",
                  account: entry.account,
                  amount: parseFloat(entry.amount),
                  rental_adress: rentAddress,
                  rent_cycle: "",
                  month_year:
                    values.date.slice(5, 7) + "-" + values.date.slice(0, 4),
                  date: values.date,
                  memo: values.charges_memo,
                  tenant_id: tenantid,
                  charges_attachment: generalledgerFormik.values.attachment,
                  tenant_firstName: selectedRec,
                })),
                ...formikForAnotherData.values.entries
                  .filter((entry) => parseFloat(entry.amount) !== 0) // Filter out entries with amount 0
                  .map((entry) => ({
                    type: "Payment",
                    account: entry.account,
                    amount: parseFloat(entry.amount),
                    rental_adress: rentAddress,
                    rent_cycle: "",
                    month_year:
                      values.date.slice(5, 7) + "-" + values.date.slice(0, 4),
                    date: values.date,
                    memo: values.charges_memo,
                    charges_attachment: generalledgerFormik.values.attachment,
                    tenant_id: tenantid,
                    tenant_firstName: selectedRec,
                  })),
              ],
            },
          ],
        };
        const url = `${baseUrl}/payment_charge/payment_charge`;
        await axios
          .post(url, paymentObject)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.error("Error:", error);
        if (error.response) {
          console.error("Response Data:", error.response.data);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
    setLoader(false);
  };

  const fileData = (files) => {
    //setImgLoader(true);
    // console.log(files, "file");
    const filesArray = [...files];

    if (filesArray.length <= 10 && file.length === 0) {
      const finalArray = [];
      // i want to loop and create object
      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: localStorage.getItem("user_id"),
          file_name: filesArray[i].name,
        };
        // Do something with the object... push it to final array
        finalArray.push(object);
      }
      setFile([...finalArray]);
      generalledgerFormik.setFieldValue("attachment", [...finalArray]);
    } else if (
      file.length >= 0 &&
      file.length <= 10 &&
      filesArray.length + file.length > 10
    ) {
      setFile([...file]);
      generalledgerFormik.setFieldValue("attachment", [...file]);
    } else {
      const finalArray = [];

      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: localStorage.getItem("user_id"),
          file_name: filesArray[i].name,
        };
        // Do something with the object... push it to final array
        finalArray.push(object);
      }
      setFile([...file, ...finalArray]);

      generalledgerFormik.setFieldValue("attachment", [...file, ...finalArray]);
    }
  };

  const deleteFile = (index) => {
    const newFile = [...file];
    newFile.splice(index, 1);
    setFile(newFile);
    generalledgerFormik.setFieldValue("attachment", newFile);
  };

  const handleOpenFile = (item) => {
    if (typeof item !== "string") {
      const url = URL.createObjectURL(item);
      window.open(url, "_blank");
    }
    // console.log(item, "item");
    else {
      window.open(item, "_blank");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/payment_charge/get_entry/${paymentId}`
        );
        if (response.data.statusCode === 200) {
          setFile(response.data.data.charges_attachment);
          generalledgerFormik.setValues({
            date: response.data.data.date,
            amount: response.data.data.amount,
            charges_attachment: response.data.data.charges_attachment,
            memo: response.data.data.memo,
            entries: [
              {
                account: response.data.data.account || "",
                amount: response.data.data.amount || "",
                balance: response.data.data.amount || "",
              },
            ],
          });
        } else {
          console.error("Error:", response.data.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchData();
  }, [paymentId]);

  const editpayment = async (id, values) => {
    const arrayOfNames = file.map((item) => item.name);
    const attachmentEntries =
      generalledgerFormik?.values?.attachment?.entries() || [];

    for (const [index, files] of attachmentEntries) {
      if (files.upload_file instanceof File) {
        console.log(files.upload_file, "myfile");

        const imageData = new FormData();
        imageData.append(`files`, files.upload_file);

        const url = `${baseUrl}/images/upload`;

        try {
          const result = await axios.post(url, imageData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log(result, "imgs");

          // Update the original array with the uploaded file URL
          generalledgerFormik.values.attachment[index].upload_file =
            result.data.files[0].url;
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log(files.upload_file, "myfile");
      }
    }
    const rentalAddress = generalledgerFormik.values.rental_adress;
    values["total_amount"] = total_amount;

    try {
      const updatedValues = {
        date: values.date,
        amount: values.amount,
        payment_method: selectedProp,
        debitcard_number: values.debitcard_number,
        tenant_firstName: selectedRec,
        attachment: generalledgerFormik.values.attachment,
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

      const putUrl = `${baseUrl}/payment_charge/edit_entry/${id}`;
      const response = await axios.put(putUrl, updatedValues);

      if (response.data.statusCode === 200) {
        swal("Success", "Payments Update Successfully", "success");
        navigate(`/admin/rentrolldetail/${tenantid}/${"01"}`);
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

  const formikForAnotherData = useFormik({
    initialValues: {
      entries: {
        account: "",
        balance: 0,
        amount: 0,
      }, // Assuming entries is the name of your array
    },
    // Other Formik configurations and validation functions as needed
  });

  console.log(tenantid, "tenantid");
  const getAllCharges = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/payment_charge/financial_unit?rental_adress=${state.rental_adress}&property_id=${state.property_id}&unit=${state.unit_name}&tenant_id=${tenantId}`
      );
      if (response.data.statusCode === 200) {
        const allPaymentAndCharges = response.data.data.flatMap((item) =>
          item.unit.map((innerItem) => innerItem.paymentAndCharges)
        );
        const chargeData = allPaymentAndCharges[0].filter(
          (item) => item.type === "Charge"
        );
        const paymentData = allPaymentAndCharges[0].filter(
          (item) => item.type === "Payment"
        );
        const separatedChargeData = {};
        const separatedPaymentData = {};

        // Iterate over the chargeData and organize it based on charge_type
        chargeData.forEach((item) => {
          const { account } = item;
          if (!separatedChargeData[account]) {
            // If the array for charge_type doesn't exist, create it
            separatedChargeData[account] = [item];
          } else {
            // If the array for charge_type already exists, push the item to it
            separatedChargeData[account].push(item);
          }
        });
        paymentData.forEach((item) => {
          const { account } = item;
          if (!separatedPaymentData[account]) {
            // If the array for charge_type doesn't exist, create it
            separatedPaymentData[account] = [item];
          } else {
            // If the array for charge_type already exists, push the item to it
            separatedPaymentData[account].push(item);
          }
        });
        const combinedData = {};
        Object.keys(separatedChargeData).forEach((account) => {
          combinedData[account] = [
            ...(separatedChargeData[account] || []),
            ...(separatedPaymentData[account] || []),
          ];
        });
        const netAmounts = {};
        Object.keys(combinedData).forEach((account) => {
          netAmounts[account] = combinedData[account].reduce((total, entry) => {
            if (entry.type === "Payment") {
              return total + entry.amount;
            } else if (entry.type === "Charge") {
              return total - entry.amount;
            }
            return total;
          }, 0);
        });

        formikForAnotherData.setValues({
          entries: Object.keys(netAmounts)
            .filter((account) => netAmounts[account] < 0) // Filter out negative amounts
            .map((account) => ({
              account,
              balance: netAmounts[account],
              amount: 0,
            })),
        });
      } else {
        console.error("Server Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  };

  useEffect(() => {
    getAllCharges();
  }, []);

  const totalamount = () => {
    let amount = 0; // Initialize amount to 0
    generalledgerFormik.values.entries.forEach((entries) => {
      if (entries.amount) {
        amount += parseFloat(entries.amount);
      }
    });
    if (formikForAnotherData.values.entries.length > 0) {
      formikForAnotherData.values.entries.forEach((entries) => {
        if (entries.amount) {
          amount += parseFloat(entries.amount);
        }
      });
    }
    return amount;
  };

  let total_amount = totalamount();

  const amount = generalledgerFormik?.values?.amount;
  const difference =
    amount !== undefined && total_amount !== undefined
      ? Math.abs(amount - total_amount).toFixed(2)
      : 0; // Default value if amount or total_amount is undefined

  const popoverContent = (
    <Popover id="popover-content">
      <Popover.Content>
        The payment's amount must match the total applied to balance. The
        difference is {difference}
      </Popover.Content>
    </Popover>
  );

  const [oneTimeCharges, setOneTimeCharges] = useState([]);
  const [RecAccountNames, setRecAccountNames] = useState([]);

  const fetchingRecAccountNames = async () => {
    fetch(`${baseUrl}/recurringAcc/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setRecAccountNames(data.data);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  };

  const fetchingOneTimeCharges = async () => {
    fetch(`${baseUrl}/onetimecharge/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setOneTimeCharges(data.data);
        } else {
          console.error("Error:", data.message);
        }
      });
  };

  useEffect(() => {
    fetchingRecAccountNames();
    fetchingOneTimeCharges();
  }, []);

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
                    <h3 className="mb-0">
                      {paymentId ? "Edit Payment" : "New Payment"}
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
                              onClick={() => handlePropSelection("Credit Card")}
                            >
                              Credit Card
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
                    <Col sm="12">
                      {selectedProp === "Credit Card" ? (
                        <>
                          <Row>
                            <Col sm="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Amount *
                                </label>
                                <Input
                                  type="text"
                                  id="amount"
                                  placeholder="Enter amount"
                                  name="amount"
                                  onBlur={generalledgerFormik.handleBlur}
                                  onWheel={(e) => e.preventDefault()}
                                  onKeyDown={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      //event.preventDefault();
                                    }
                                  }}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );
                                    generalledgerFormik.values.amount =
                                      numericValue;
                                    generalledgerFormik.handleChange({
                                      target: {
                                        name: "amount",
                                        value: numericValue,
                                      },
                                    });
                                  }}
                                  //-onChange={generalledgerFormik.handleChange}
                                  value={generalledgerFormik.values.amount}
                                  required
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Card Number *
                                </label>
                                <InputGroup>
                                  <Input
                                    type="number"
                                    id="creditcard_number"
                                    placeholder="0000 0000 0000 0000"
                                    name="creditcard_number"
                                    value={
                                      generalledgerFormik.values
                                        .creditcard_number
                                    }
                                    onBlur={generalledgerFormik.handleBlur}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const numericValue = inputValue.replace(
                                        /\D/g,
                                        ""
                                      ); // Remove non-numeric characters
                                      const limitValue = numericValue.slice(
                                        0,
                                        16
                                      ); // Limit to 12 digits
                                      // setLimitedValue(limitValue);
                                      // const formattedValue = formatCardNumber(limitValue);
                                      // e.target.value = formattedValue;
                                      // generalledgerFormik.handleChange(e);
                                      generalledgerFormik.setFieldValue(
                                        "creditcard_number",
                                        limitValue
                                      );
                                    }}
                                    required
                                  />
                                </InputGroup>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm="2">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Expiration Date *
                                </label>
                                <Input
                                  type="text"
                                  id="expiration_date"
                                  name="expiration_date"
                                  onBlur={generalledgerFormik.handleBlur}
                                  onChange={generalledgerFormik.handleChange}
                                  value={
                                    generalledgerFormik.values.expiration_date
                                  }
                                  placeholder="MM/YYYY"
                                  required
                                  onInput={(e) => {
                                    let inputValue = e.target.value;

                                    // Remove non-numeric characters
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );

                                    // Format the date as "MM/YYYY"
                                    if (numericValue.length > 2) {
                                      const month = numericValue.substring(
                                        0,
                                        2
                                      );
                                      const year = numericValue.substring(2, 6);
                                      e.target.value = `${month}/${year}`;
                                    } else {
                                      e.target.value = numericValue;
                                    }

                                    // Update the Formik values as strings
                                    generalledgerFormik.setFieldValue(
                                      "expiration_date",
                                      e.target.value
                                    );
                                  }}

                                  // onInput={(e) => {
                                  //   let inputValue = e.target.value;

                                  //   // Remove non-numeric characters
                                  //   const numericValue = inputValue.replace(
                                  //     /\D/g,
                                  //     ""
                                  //   );

                                  //   // Set the input value to the sanitized value (numeric only)
                                  //   e.target.value = numericValue;

                                  //   // Format the date as "MM/YYYY"
                                  //   if (numericValue.length > 2) {
                                  //     const month = numericValue.substring(
                                  //       0,
                                  //       2
                                  //     );
                                  //     const year = numericValue.substring(2, 6);
                                  //     e.target.value = `${month}/${year}`;
                                  //   }
                                  // }}
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="2">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Cvv *
                                </label>
                                <Input
                                  type="number"
                                  id="cvv"
                                  placeholder="XXX"
                                  name="cvv"
                                  onBlur={generalledgerFormik.handleBlur}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (/^\d{0,3}$/.test(inputValue)) {
                                      // Only allow up to 3 digits
                                      generalledgerFormik.handleChange(e);
                                    }
                                  }}
                                  value={generalledgerFormik.values.cvv}
                                  maxLength={3}
                                  required
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </>
                      ) : (
                        <>
                          <Row>
                            <Col sm="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Amount *
                                </label>
                                <Input
                                  type="text"
                                  id="amount"
                                  placeholder="Enter amount"
                                  name="amount"
                                  onBlur={generalledgerFormik.handleBlur}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );
                                    generalledgerFormik.values.amount =
                                      numericValue;
                                    generalledgerFormik.handleChange({
                                      target: {
                                        name: "amount",
                                        value: numericValue,
                                      },
                                    });
                                  }}
                                  value={generalledgerFormik.values.amount}
                                  onWheel={(e) => e.preventDefault()} // Disable scroll wheel
                                  inputMode="numeric"
                                  required
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </>
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
                              {formikForAnotherData.values.entries.length > 0
                                ? formikForAnotherData.values.entries.map(
                                    (entries, index) => (
                                      <>
                                        <tr key={index}>
                                          <td>
                                            <Dropdown
                                              isOpen={
                                                entries && entries.dropdownOpen
                                              }
                                              toggle={() =>
                                                toggleDropdownForFormik(index)
                                              }
                                            >
                                              <DropdownToggle caret>
                                                {entries.account
                                                  ? entries.account
                                                  : "Select"}
                                              </DropdownToggle>
                                            </Dropdown>
                                          </td>
                                          <td>
                                            <Input
                                              className="form-control-alternative"
                                              id="input-unitadd"
                                              placeholder="$0.00"
                                              type="text"
                                              name={`entries[${index}].balance`}
                                              value={
                                                Math.abs(entries.balance) -
                                                entries.amount
                                              }
                                              readOnly
                                              onWheel={(e) =>
                                                e.preventDefault()
                                              }
                                              inputMode="numeric"
                                            />
                                          </td>
                                          <td>
                                            <Input
                                              className="form-control-alternative"
                                              id="input-unitadd"
                                              placeholder="$0.00"
                                              type="text"
                                              name={`entries[${index}].amount`}
                                              onBlur={
                                                formikForAnotherData.handleBlur
                                              }
                                              // only input number
                                              onKeyDown={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                  event.preventDefault();
                                                }
                                              }}
                                              onChange={
                                                formikForAnotherData.handleChange
                                              }
                                              value={entries.amount}
                                            />
                                          </td>
                                          <td style={{ border: "none" }}>
                                            <ClearIcon
                                              type="button"
                                              style={{
                                                cursor: "pointer",
                                                padding: 0,
                                              }}
                                              onClick={() =>
                                                handleRemoveRow2(index)
                                              }
                                            >
                                              Remove
                                            </ClearIcon>
                                          </td>
                                        </tr>
                                      </>
                                    )
                                  )
                                : null}
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
                                            {RecAccountNames ? (
                                              <>
                                                <DropdownItem
                                                  header
                                                  style={{ color: "blue" }}
                                                >
                                                  Reccuring Charges
                                                </DropdownItem>
                                                {RecAccountNames?.map(
                                                  (item) => (
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
                                                  )
                                                )}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                            {oneTimeCharges ? (
                                              <>
                                                <DropdownItem
                                                  header
                                                  style={{ color: "blue" }}
                                                >
                                                  One Time Charges
                                                </DropdownItem>
                                                {oneTimeCharges?.map((item) => (
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
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </DropdownMenu>
                                        </Dropdown>
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
                                        ].account ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .entries[index].account
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
                                          name={`entries[${index}].balance`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={entries.amount}
                                          readOnly
                                        />
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
                                          // only input number
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
                                  <th
                                    style={{
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    {Number(
                                      generalledgerFormik.values.amount
                                    ) !== Number(total_amount) ? (
                                      <OverlayTrigger
                                        trigger="click"
                                        placement="top"
                                        overlay={popoverContent}
                                      >
                                        <span
                                          style={{
                                            cursor: "pointer",
                                            color: "red",
                                          }}
                                        >
                                          The payment's amount must match the
                                          total applied to balance. The
                                          difference is $
                                          {Math.abs(
                                            generalledgerFormik.values.amount -
                                              total_amount
                                          ).toFixed(2)}
                                        </span>
                                      </OverlayTrigger>
                                    ) : null}
                                  </th>
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
                                    onClick={() =>
                                      handleOpenFile(
                                        file?.upload_file
                                          ? file?.upload_file
                                          : file?.name?.upload_file
                                      )
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    {file?.name?.file_name?.substr(0, 5) ||
                                      file?.file_name?.substr(0, 5)}
                                    {file?.name?.file_name?.length > 5
                                      ? "..."
                                      : null || file?.file_name?.length > 5
                                      ? "..."
                                      : null}
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
                        {loader ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                              background: "green",
                              cursor: "not-allowed",
                            }}
                            disabled
                          >
                            Loading...
                          </button>
                        ) : paymentId ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              editpayment(
                                paymentId,
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

export default AddPayment;
