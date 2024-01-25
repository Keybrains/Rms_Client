import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { CardContent, Typography } from "@mui/material";
import { Col, FormGroup, Row, Card, CardHeader, Table, Input } from "reactstrap";
import * as yup from "yup";
import axios from "axios";
import swal from "sweetalert";
import valid from "card-validator";

function CreditCardForm(props) {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { tenantId, closeModal } = props;
  const [isSubmitting, setSubmitting] = useState(false);
  const [cardLogo, setCardLogo] = useState("");

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

  const [cardDetalis, setCardDetails] = useState([]);
  const getCreditCard = async () => {
    const response = await axios.get(
      `${baseUrl}/creditcard/getCreditCard/${tenantId}`
    );
    setCardDetails(response.data);
    //fetchCardLogo(response.data.card_type);
    console.log(response.data, "yashu");
  };

  useEffect(() => {
    getCreditCard();
  }, [tenantId]);

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

  const handleSubmit = async (values) => {
    console.log("Form submitted", values);
    const isValidCard = validateCardNumber(values.card_number);
    const cardType = isValidCard.niceType;
    console.log("isValidCard:", isValidCard);
  
    if (!isValidCard) {
      swal("Error", "Invalid credit card number", "error");
      return;
    }
  
    try {
      setSubmitting(true);
      // Call the first API
      const customerVaultResponse = await axios.post(`${baseUrl}/nmipayment/create-customer-vault`, {
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
        phone: values.phone,
        email: values.email,
      });
  
      if (customerVaultResponse.data && customerVaultResponse.data.data) {
        // Extract customer_vault_id from the first API response
        const customerVaultId = customerVaultResponse.data.data.customer_vault_id;
        const vaultResponse = customerVaultResponse.data.data.response_code;
  
        // Call the second API using the extracted customer_vault_id
        const creditCardResponse = await axios.post(`${baseUrl}/creditcard/addCreditCard`, {
          tenant_id: tenantId,
          card_number: values.card_number,
          exp_date: values.exp_date,
          card_type: cardType,
          customer_vault_id: customerVaultId,
          response_code: vaultResponse,
        });
  
        console.log("Credit Card Response:", creditCardResponse.data);
        console.log("Customer Vault Response:", customerVaultResponse.data);
  
        if (
          creditCardResponse.status === 200 &&
          customerVaultResponse.status === 200
        ) {
          swal("Success", "Card Added Successfully", "success");
          closeModal();
          getCreditCard();
        } else {
          swal("Error", creditCardResponse.data.message, "error");
        }
      } else {
        // Handle the case where the response structure is not as expected
        swal("Error", "Unexpected response format from create-customer-vault API", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      swal("Error", "Something went wrong!", "error");
    } finally {
      setSubmitting(false); 
    }
  };

  return (
    <div style={{ maxHeight: '530px',  overflowY: 'auto', overflowX:'hidden' }}>
      <Row>
        {/* Formik Section */}
        <Col xs="12" sm="7">
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
                      {/* <ErrorMessage
                        name="card_number"
                        component="div"
                        style={{ color: "red" }}
                      /> */}
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
                      {/* <ErrorMessage
                        name="exp_date"
                        component="div"
                        style={{ color: "red" }}
                      /> */}
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
                      {/* <ErrorMessage
                        name="email"
                        component="div"
                        style={{ color: "red" }}
                      /> */}
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
  
                {/* <Row className="mb-3">
                  <Col xs="12" sm="6">
                    <FormGroup>
                      <label htmlFor="fax">Fax</label>
                      <Input
                        type="text"
                        id="fax"
                        name="fax"
                        placeholder="Enter fax"
                        tag={Field}
                      />
                      <ErrorMessage
                        name="fax"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
   */}
            
              {/* </Col>
            </Row> */}
  
            {/* Form Buttons */}
            <div
              style={{
                display: "flex"
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
       <Col xs="12" sm="5">
       <Card className="mt-1" style={{ background: "#F4F6FF",maxWidth:'350px', height:'530px', overflowY:'auto'}}>
        
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
                {cardDetalis && cardDetalis.length > 0 ? (
                  <Table responsive>
                    <tbody>
                      <tr>
                        <th>Card Number</th>
                        <th>Card Type</th>
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
                              {item.card_number.slice(0, 4) +
                                "*".repeat(8) +
                                item.card_number.slice(-4)}
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
                              {item.card_type}
                              {item.card_type && (
                                <img
                                  src={`https://logo.clearbit.com/${item.card_type.toLowerCase()}.com`}
                                  alt={`${item.card_type} Logo`}
                                  style={{ width: "40%", marginLeft: "10%" }}
                                />
                              )}
                            </Typography>
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
