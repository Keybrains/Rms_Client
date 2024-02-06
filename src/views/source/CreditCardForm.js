import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { CardContent, Typography } from "@mui/material";
import {
  Col,
  FormGroup,
  Row,
  Card,
  CardHeader,
  Table,
  Input,
} from "reactstrap";
import * as yup from "yup";
import axios from "axios";
import swal from "sweetalert";
import valid from "card-validator";
import DeleteIcon from "@mui/icons-material/Delete";
import { RotatingLines } from "react-loader-spinner";
import EditIcon from "@mui/icons-material/Edit";
import { values } from "pdf-lib";

function CreditCardForm(props) {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { tenantId, closeModal } = props;
  const [isSubmitting, setSubmitting] = useState(false);
  const [cardLogo, setCardLogo] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCardLogo = async (cardType) => {
    try {
      if (!cardType) {
        throw new Error("Card type is undefined");
      }

      const response = await axios.get(
        `https://logo.clearbit.com/${cardType.toLowerCase()}.com`
      );
      setCardLogo(response.config.url);
    } catch (error) {
      // Handle error (e.g., card type not found)
      console.error("Error fetching card logo:", error);
      setCardLogo(""); // Set to a default logo or leave it empty
    }
  };

  useEffect(() => {
    fetchCardLogo();
  }, []);

  const [customervault, setCustomervault] = useState([]);
  const [cardDetalis, setCardDetails] = useState([]);
  const [isBilling, setIsBilling] = useState(false);
  const [vaultId, setVaultId] = useState(false);

  const getCreditCard = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/creditcard/getCreditCards/${tenantId}`
      );
      setCustomervault(response.data);
      setVaultId(response.data.customer_vault_id);
      getMultipleCustomerVault(response.data.customer_vault_id);

      const hasCustomerVaultId = "customer_vault_id" in response.data;
      if (hasCustomerVaultId) {
        setIsBilling(true);
      } else {
        setIsBilling(false);
      }
    } catch (error) {
      console.error("Error fetching credit card details:", error);
      setIsBilling(false);
    }
  };

  const getMultipleCustomerVault = async (customerVaultIds) => {
    try {
      setPaymentLoader(true);
      if (customerVaultIds.length === 0) {
        setCardDetails([]);
        return;
      }

      const response = await axios.post(
        `${baseUrl}/nmipayment/get-billing-customer-vault`,
        {
          customer_vault_id: customerVaultIds,
        }
      );

      console.log("vaibhav", response.data.data);

      // Check if customer.billing is an array
      const billingData = response.data.data.customer.billing;

      if (Array.isArray(billingData)) {
        const extractedData = billingData.map((item) => ({
          billing_id: item["@attributes"].id,
          cc_number: item.cc_number,
          cc_exp: item.cc_exp,
          cc_type: item.cc_type,
          customer_vault_id: item.customer_vault_id,
        }));

        setPaymentLoader(false);
        setCardDetails(extractedData);
        console.log("objectss", extractedData);
      } else if (billingData) {
        // If there's only one record, create an array with a single item
        const extractedData = [
          {
            billing_id: billingData["@attributes"].id,
            cc_number: billingData.cc_number,
            cc_exp: billingData.cc_exp,
            cc_type: billingData.cc_type,
            customer_vault_id: billingData.customer_vault_id,
          },
        ];

        setPaymentLoader(false);
        setCardDetails(extractedData);
        console.log("objectss", extractedData);
      } else {
        console.error(
          "Invalid response structure - customer.billing is not an array"
        );
        setPaymentLoader(false);
        setCardDetails([]);
      }
    } catch (error) {
      console.error("Error fetching multiple customer vault records:", error);
      setPaymentLoader(false);
    }
  };
  useEffect(() => {
    getCreditCard();
  }, [tenantId]);

  useEffect(() => {
    // Extract customer_vault_id values from cardDetails
    const customerVaultIds =
      customervault?.card_detail?.map((card) => card.billing_id) || [];

    if (customerVaultIds.length > 0) {
      // Call the API to get multiple customer vault records
      getMultipleCustomerVault(customerVaultIds);
    }
  }, [customervault]);

  console.log("isbilling", isBilling);
  // useEffect(() => {
  //   getCreditCard();
  // }, [tenantId]);

  // console.log("sssss",customervault)

  // useEffect(() => {
  //   // Extract customer_vault_id values from cardDetails
  //   const customerVaultIds = customervault?.map(
  //     (card) => card.billing_id
  //   );

  //   if (customerVaultIds.length > 0) {
  //     // Call the API to get multiple customer vault records
  //     getMultipleCustomerVault(customerVaultIds);
  //   }
  // }, [customervault]);

  const paymentSchema = yup.object({
    card_number: yup
      .number()
      .required("Required")
      .typeError("Must be a number")
      .test(
        "is-size-16",
        "Card Number must be 16 digits",
        (val) => val?.toString().length === 16
      ),
    exp_date: yup
      .string()
      .matches(/^(0[1-9]|1[0-2])\/[0-9]{4}$/, "Invalid date format (MM/YYYY)")
      .required("Required"),
    card_type: yup.string(),
    first_name: yup.string().required("Required"),
    last_name: yup.string().required("Required"),
    address1: yup.string(),
    city: yup.string(),
    state: yup.string(),
    zip: yup.string(),
    country: yup.string(),
    phone: yup.string().required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    company: yup.string(),
    address2: yup.string(),
  });

  const validateCardNumber = (cardNumber) => {
    const numberValidation = valid.number(cardNumber);
    return numberValidation.isPotentiallyValid && numberValidation.card;
  };

  function generateRandomNumber(length) {
    let randomNumber = "";
    for (let i = 0; i < length; i++) {
      randomNumber += Math.floor(Math.random() * 9) + 1;
    }
    return randomNumber;
  }

  

  const handleSubmit = async (values) => {
    const isValidCard = validateCardNumber(values.card_number);

    // Example: Generate a random number with length 10
    const random10DigitNumber = generateRandomNumber(10);

    const requestBody = isBilling
      ? {
          first_name: values.first_name,
          last_name: values.last_name,
          ccnumber: values.card_number,
          ccexp: values.exp_date,
          address1: values.address1,
          address2: values.address2,
          city: values.city,
          state: values.state,
          zip: values.zip,
          country: values.country,
          company: values.company,
          phone: values.phone,
          email: values.email,
          customer_vault_id: vaultId,
          billing_id: random10DigitNumber,
        }
      : {
          first_name: values.first_name,
          last_name: values.last_name,
          ccnumber: values.card_number,
          ccexp: values.exp_date,
          address1: values.address1,
          address2: values.address2,
          city: values.city,
          state: values.state,
          zip: values.zip,
          country: values.country,
          company: values.company,
          phone: values.phone,
          email: values.email,
          billing_id: random10DigitNumber,
        };

    if (!isValidCard) {
      swal("Error", "Invalid credit card number", "error");
      return;
    }

    try {
      setSubmitting(true);

      const url = isBilling
        ? `${baseUrl}/nmipayment/create-customer-billing`
        : `${baseUrl}/nmipayment/create-customer-vault`;
      // Call the first API
      const customerVaultResponse = await axios.post(url, requestBody);

      if (customerVaultResponse.data && customerVaultResponse.data.data) {
        // Extract customer_vault_id from the first API response
        const customerVaultId =
          customerVaultResponse.data.data.customer_vault_id;
        const vaultResponse = customerVaultResponse.data.data.response_code;

        // Call the second API using the extracted customer_vault_id
        const creditCardResponse = await axios.post(
          `${baseUrl}/creditcard/addCreditCard`,
          {
            tenant_id: tenantId,
            customer_vault_id: isBilling ? vaultId : customerVaultId,
            response_code: vaultResponse,
            billing_id: random10DigitNumber,
          }
        );

        if (
          (creditCardResponse.status === 200 ||
            creditCardResponse.status === 201) &&
          customerVaultResponse.status === 200
        ) {
          swal("Success", "Card Added Successfully", "success");
          closeModal();
          getCreditCard();
          getMultipleCustomerVault();
        } else {
          swal("Error", creditCardResponse.data.message, "error");
        }
      } else {
        // Handle the case where the response structure is not as expected
        swal(
          "Error",
          "Unexpected response format from create-customer-vault API",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      swal("Error", "Something went wrong!", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCard = async (customerVaultId, billingId) => {
    try {
      // Make parallel requests to delete from your record and NMI
      const [deleteRecordResponse, deleteNMIResponse] = await Promise.all([
        axios.delete(`${baseUrl}/creditcard/deleteCreditCard/${billingId}`),
        axios.post(`${baseUrl}/nmipayment/delete-customer-billing`, {
          customer_vault_id: customerVaultId,
          billing_id: billingId,
        }),
      ]);

      // Check the responses
      if (
        deleteRecordResponse.status === 200 &&
        deleteNMIResponse.status === 200
      ) {
        swal("Success", "Card deleted successfully", "success");
        getCreditCard(); // all vault id get from this function
      } else {
        // Handle errors, show a message, or log the error
        console.error(
          "Delete card failed:",
          deleteRecordResponse.statusText,
          deleteNMIResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error deleting card:", error.message);
    }
  };

  const [paymentLoader, setPaymentLoader] = useState(false);
  const [formValue, setFormValues] = useState({});

  // const handleEditCard = async (id,values) => {
  //   try {
  //     setPaymentLoader(true);
  //     const response = await axios.get(
  //       `${baseUrl}/nmipayment/nmipayments/${id}`
  //     );

  //     if (response.data.statusCode === 200) {
  //       const updatedValues = {
  //         amount: values.amount,
  //         account: values.account,
  //         first_name: values.values.first_name,
  //         last_name: values.values.last_name,
  //       };

  //       const putUrl = `${baseUrl}/nmipayment/updatepayment/${id}`;
  //       const putResponse = await axios.put(putUrl, updatedValues);

  //       if (putResponse.data.statusCode === 200) {
  //         closeModal();
  //         swal("Success", "Payment Updated Successfully", "success");
  //       } else {
  //         swal("Error", putResponse.data.message, "error");
  //         console.error("Server Error:", putResponse.data.message);
  //       }
  //     } else {
  //       swal("Error", response.data.message, "error");
  //       console.error("Error:", response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     if (error.response) {
  //       console.error("Response Data:", error.response.data);
  //     }
  //   } finally {
  //     setPaymentLoader(false);
  //   }
  // };

  const getEditData = async (customerVaultId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/nmipayment/get-customer-vault`,
        {
          customer_vault_id: customerVaultId,
        }
      );

      // Set the form values with the existing card details
      setFormValues({
        card_number: response.data.data.customer.cc_number || "",
        exp_date: response.data.data.customer.cc_exp || "",
        first_name: response.data.data.customer.first_name?.value || "",
        last_name: response.data.data.customer.last_name?.value || "",
        phone: response.data.data.customer.phone?.value || "",
        email: response.data.data.customer.email?.value || "",
        address1: response.data.data.customer.address_1?.value || "",
        city: response.data.data.customer.city?.value || "",
        state: response.data.data.customer.state?.value || "",
        zip: response.data.data.customer.postal_code?.value || "",
        country: response.data.data.customer.country?.value || "",
        company: response.data.data.customer.company?.value || "",
      });
      console.log("vaibhav", response.data.data.customer);

      if (response.status === 200) {
        console.log("object");
      } else {
        // Handle errors, show a message, or log the error
        console.error("card failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error card:", error.message);
    }
  };

  const handleEditCard = async (customerVaultId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/nmipayment/get-customer-vault`,
        {
          customer_vault_id: customerVaultId,
        }
      );

      // Set the form values with the existing card details
      setFormValues({
        card_number: response.data.data.customer.cc_number || "",
        exp_date: response.data.data.customer.cc_exp || "",
        first_name: response.data.data.customer.first_name?.value || "",
        last_name: response.data.data.customer.last_name?.value || "",
        phone: response.data.data.customer.phone?.value || "",
        email: response.data.data.customer.email?.value || "",
        address1: response.data.data.customer.address_1?.value || "",
        city: response.data.data.customer.city?.value || "",
        state: response.data.data.customer.state?.value || "",
        zip: response.data.data.customer.postal_code?.value || "",
        country: response.data.data.customer.country?.value || "",
        company: response.data.data.customer.company?.value || "",
      });

      console.log("vaibhav", formValue);
      // Your form submission logic goes here

      // Perform the update operation
      const updateResponse = await axios.post(
        `${baseUrl}/nmipayment/update-customer-vault`,
        {
          customer_vault_id: customerVaultId,
        }
      );

      if (updateResponse.status === 200) {
        // Fetch the updated records after successful update
        // await Promise.all([
        //   getCreditCard(),
        //   getMultipleCustomerVault()
        // ]);

        swal("Success", "Card updated successfully", "success");
      } else {
        // Handle errors, show a message, or log the error
        console.error("Update card failed:", updateResponse.statusText);
      }
    } catch (error) {
      console.error("Error updating card:", error.message);
    }
  };

  console.log("card details", cardDetalis);

  // Add a state to track the submit button text
  const [submitButtonText, setSubmitButtonText] = useState("Add Card");

  return (
    <div style={{ maxHeight: "530px", overflowY: "auto", overflowX: "hidden" }}>
      <Row>
        {/* Formik Section */}
        <Col xs="12" sm="6">
          <Formik
            initialValues={{
              card_number: "",
              exp_date: "",
              first_name: "",
              last_name: "",
              phone: "",
              email: "",
              address1: "",
              city: "",
              state: "",
              zip: "",
              country: "",
              company: "",
            }}
            validationSchema={paymentSchema}
            onSubmit={(values, { resetForm }) => {
              if (paymentSchema.isValid()) {
                // Rest of your code
                handleSubmit(values);
                resetForm();
              } else {
                console.log("Form not submitted - validation failed");
              }
            }}
          >
            {/* {({ isSubmitting }) => ( */}
            <Form>
              {/* Form Fields */}
              {/* <Row className="mb-0">
              <Col xs="12" sm="12"> */}
              <Row className="mb--2">
                <Col xs="12" sm="6">
                  <FormGroup>
                    <label htmlFor="card_number">Card Number *</label>
                    <Input
                      type="number"
                      id="card_number"
                      placeholder="0000 0000 0000 0000"
                      className="no-spinner"
                      name="card_number"
                      tag={Field}
                      required
                    />
                    <ErrorMessage
                      name="card_number"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </FormGroup>
                </Col>

                <Col xs="12" sm="4">
                  <FormGroup>
                    <label htmlFor="exp_date">Expiration Date *</label>
                    <Input
                      type="text"
                      id="exp_date"
                      name="exp_date"
                      placeholder="MM/YYYY"
                      tag={Field}
                      required
                    />
                    <ErrorMessage
                      name="exp_date"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row className="mb--2">
                <Col xs="12" sm="6">
                  <FormGroup>
                    <label htmlFor="first_name">First Name *</label>
                    <Input
                      type="text"
                      id="first_name"
                      name="first_name"
                      placeholder="Enter first name"
                      tag={Field}
                      required
                    />
                    {/* <ErrorMessage
                        name="first_name"
                        component="div"
                        style={{ color: "red" }}
                      /> */}
                  </FormGroup>
                </Col>
                <Col xs="12" sm="6">
                  <FormGroup>
                    <label htmlFor="last_name">Last Name *</label>
                    <Input
                      type="text"
                      id="last_name"
                      name="last_name"
                      placeholder="Enter last name"
                      tag={Field}
                      required
                    />
                    {/* <ErrorMessage
                        name="last_name"
                        component="div"
                        style={{ color: "red" }}
                      /> */}
                  </FormGroup>
                </Col>
              </Row>

              <Row className="mb--2">
                <Col xs="12" sm="7">
                  <FormGroup>
                    <label htmlFor="email">Email *</label>
                    <Input
                      type="text"
                      id="email"
                      name="email"
                      placeholder="Enter email"
                      tag={Field}
                      required
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </FormGroup>
                </Col>
                <Col xs="12" sm="5">
                  <FormGroup>
                    <label htmlFor="phone">Phone *</label>
                    <Input
                      type="text"
                      id="phone"
                      name="phone"
                      placeholder="Enter phone"
                      tag={Field}
                      required
                    />
                    {/* <ErrorMessage
                        name="phone"
                        component="div"
                        style={{ color: "red" }}
                      /> */}
                  </FormGroup>
                </Col>
              </Row>

              <Row className="mb--2">
                <Col xs="12" sm="10">
                  <FormGroup>
                    <label htmlFor="address1">Address </label>
                    <Input
                      type="textarea"
                      id="address1"
                      name="address1"
                      placeholder="Enter address"
                      tag={Field}
                    />
                    {/* <ErrorMessage
                        name="address1"
                        component="div"
                        style={{ color: "red" }}
                      /> */}
                  </FormGroup>
                </Col>
              </Row>

              <Row className="mb--2">
                <Col xs="12" sm="4">
                  <FormGroup>
                    <label htmlFor="city">City</label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Enter city"
                      tag={Field}
                    />
                    {/* <ErrorMessage
                        name="city"
                        component="div"
                        style={{ color: "red" }}
                      /> */}
                  </FormGroup>
                </Col>
                <Col xs="12" sm="4">
                  <FormGroup>
                    <label htmlFor="state">State</label>
                    <Input
                      type="text"
                      id="state"
                      name="state"
                      placeholder="Enter state"
                      tag={Field}
                    />
                    {/* <ErrorMessage
                        name="state"
                        component="div"
                        style={{ color: "red" }}
                      /> */}
                  </FormGroup>
                </Col>
                <Col xs="12" sm="4">
                  <FormGroup>
                    <label htmlFor="country">Country</label>
                    <Input
                      type="text"
                      id="country"
                      name="country"
                      placeholder="Enter country"
                      tag={Field}
                    />
                    {/* <ErrorMessage
                        name="country"
                        component="div"
                        style={{ color: "red" }}
                      /> */}
                  </FormGroup>
                </Col>
              </Row>

              <Row className="mb--2">
                <Col xs="12" sm="4">
                  <FormGroup>
                    <label htmlFor="zip">Zip</label>
                    <Input
                      type="text"
                      id="zip"
                      name="zip"
                      placeholder="Enter zip"
                      tag={Field}
                    />
                    {/* <ErrorMessage
                        name="zip"
                        component="div"
                        style={{ color: "red" }}
                      /> */}
                  </FormGroup>
                </Col>

                <Col xs="12" sm="7">
                  <FormGroup>
                    <label htmlFor="company">Company</label>
                    <Input
                      type="text"
                      id="company"
                      name="company"
                      placeholder="Enter company"
                      tag={Field}
                    />
                    {/* <ErrorMessage
                        name="company"
                        component="div"
                        style={{ color: "red" }}
                      /> */}
                  </FormGroup>
                </Col>
              </Row>

              {/* Form Buttons */}
              <div
                style={{
                  display: "flex",
                }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    background: "green",
                    cursor: paymentSchema.isValid ? "pointer" : "not-allowed",
                  }}
                  disabled={!paymentSchema.isValid || isSubmitting}
                >
                  {isSubmitting ? "Loading..." : "Add Card"}
                </button>

                <button
                  type="reset"
                  className="btn btn-primary"
                  onClick={closeModal}
                  style={{
                    background: "#fff",
                    cursor: "pointer",
                    color: "#333",
                  }}
                >
                  Cancel
                </button>
              </div>
            </Form>
            {/* )} */}
          </Formik>
        </Col>
        {/* Card Details Section */}
        <Col xs="12" sm="6">
          <Card
            className="mt-1"
            style={{
              background: "#F4F6FF",
              maxWidth: "500px",
              height: "530px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: "bold",
                  fontFamily: "Arial",
                  textTransform: "capitalize",
                  marginRight: "10px",
                }}
                color="text.secondary"
                gutterBottom
              >
                Credit Cards
              </Typography>
              {/* Card Details */}
              {paymentLoader ? (
                <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                  <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="50"
                    visible={paymentLoader}
                  />
                </div>
              ) :  cardDetalis && cardDetalis.length > 0 ? (
                <Table responsive style={{ overflowX: "hidden" }}>
                  <tbody>
                    <tr>
                      <th>Card Number</th>
                      <th>Card Type</th>
                      <th></th>
                    </tr>
                    {cardDetalis.map((item, index) => (
                      <tr key={index} style={{ marginBottom: "10px" }}>
                        <td>
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: "bold",
                              fontStyle: "italic",
                              fontFamily: "Arial",
                              textTransform: "capitalize",
                              marginRight: "10px",
                            }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {item.cc_number}
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            sx={{
                              fontSize: 14,
                              marginRight: "10px",
                            }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {item.cc_type}
                            {item.cc_type && (
                              <img
                                src={`https://logo.clearbit.com/${item.cc_type.toLowerCase()}.com`}
                                alt={`${item.cc_type} Logo`}
                                style={{ width: "40%", marginLeft: "10%" }}
                              />
                            )}
                          </Typography>
                        </td>
                        <td>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <DeleteIcon
                              onClick={() =>
                                handleDeleteCard(
                                  item.customer_vault_id,
                                  item.billing_id
                                )
                              }
                              style={{
                                cursor: "pointer",
                                marginRight: "5px",
                              }}
                            />
                            {/* <EditIcon
                              onClick={() =>
                                getEditData(item.customer_vault_id)
                              }
                              style={{ cursor: "pointer" }}
                            /> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No cards added.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CreditCardForm;
