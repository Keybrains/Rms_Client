import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { CardContent, Typography } from "@mui/material";
import { Col, FormGroup, Row, Card, CardHeader, Table } from "reactstrap";
import * as yup from "yup";
import axios from "axios";
import swal from "sweetalert";
import valid from "card-validator";

function CreditCardForm(props) {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { tenantId, closeModal } = props;

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
  });

  const validateCardNumber = (cardNumber) => {
    const numberValidation = valid.number(cardNumber);
    return numberValidation.isPotentiallyValid && numberValidation.card;
  };

  const handleSubmit = async (values) => {
    const isValidCard = validateCardNumber(values.card_number);
    const cardType = isValidCard.niceType;

    console.log(isValidCard, "valid");
    console.log(cardType, "cardType");

    if (!isValidCard) {
      swal("Error", "Invalid credit card number", "error");
      return;
    }

    try {
      // Call both APIs in parallel
      const [creditCardResponse, customerVaultResponse] = await Promise.all([
        axios.post(`${baseUrl}/creditcard/addCreditCard`, {
          tenant_id: tenantId,
          card_number: values.card_number,
          exp_date: values.exp_date,
          card_type: cardType,
        }),
        axios.post(`${baseUrl}/nmipayment/create-customer-vault`, {
          first_name: "John",
          last_name: "Doe",
          ccnumber: values.card_number,
          ccexp: values.exp_date,
        }),
      ]);

      console.log("Credit Card Response:", creditCardResponse.data);
      console.log("Customer Vault Response:", customerVaultResponse.data);

      if (
        creditCardResponse.status === 200 &&
        customerVaultResponse.status === 200
      ) {
        swal("Success", "Card Added Successfully", "success");
        //closeModal();
        getCreditCard();
      } else {
        swal("Error", creditCardResponse.data.message, "error");
      }

      // if (customerVaultResponse.data.success) {
      //   swal("Success", "Customer vault created successfully.", "success");
      // } else {
      //   swal("Error","", "error");
      // }
    } catch (error) {
      console.error("Error:", error);
      swal("Error", "Something went wrong!", "error");
    }
  };

  //   const handleSubmit = async (values) => {

  //   const isValidCard = validateCardNumber(values.card_number);
  //   const cardType = isValidCard.niceType;
  //   //fetchCardLogo(cardType);

  //   console.log(isValidCard, "valid");
  //   console.log(cardType, "cardType");

  //   if (!isValidCard) {
  //     swal("Error", "Invalid credit card number", "error");
  //     return;
  //   }

  //   const object = {
  //     tenant_id: tenantId,
  //     card_number: values.card_number,
  //     exp_date: values.exp_date,
  //     card_type: cardType,
  //   };

  //   const response = await axios.post(
  //     `${baseUrl}/creditcard/addCreditCard`,
  //     object
  //   );

  //   swal("Success", response.data.message, "success");
  //   closeModal();
  //   getCreditCard();
  // };

  return (
    <div>
      <Formik
        initialValues={{ card_number: "", exp_date: "" }}
        validationSchema={paymentSchema}
        onSubmit={(values, { resetForm }) => {
          if (paymentSchema.isValid) {
            console.log("Form submitted", values);
            handleSubmit(values);
            resetForm();
          } else {
            console.log("Form not submitted - validation failed");
          }
        }}
      >
        <Form>
          {/* Form Fields */}
          <Row className="mb-3">
            <Col xs="12" sm="12">
              <Row>
                <Col xs="12" sm="6">
                  <FormGroup>
                    <label htmlFor="card_number">Card Number *</label>
                    <Field
                      type="number"
                      id="card_number"
                      placeholder="0000 0000 0000 0000"
                      className="no-spinner"
                      name="card_number"
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
                    <Field
                      type="text"
                      id="exp_date"
                      name="exp_date"
                      placeholder="MM/YYYY"
                    />
                    <ErrorMessage
                      name="exp_date"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Form Buttons */}
          <div
            style={{
              display: "flex",
              marginTop: "10px",
            }}
          >
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                background: "green",
                cursor: paymentSchema.isValid ? "pointer" : "not-allowed",
              }}
              disabled={!paymentSchema.isValid}
            >
              {paymentSchema.isSubmitting ? "Loading..." : "Add Card"}
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

          {/* Card Details Section */}
          <Card className="w-100 mt-3" style={{ background: "#F4F6FF" }}>
            <CardContent>
              {/* Card Details */}
              {/* <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                fontSize: 15,
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
          </div> */}
              {cardDetalis && cardDetalis.length > 0 && (
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
                              style={{ width: "20%", marginLeft:"10%"}}
                            />
                          )}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {/* Add Credit Card Button
        <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
          <Button
            color="primary"
            onClick={() => openCardForm()}
            style={{
              background: "white",
              color: "blue",
              marginRight: "10px",
            }}
          >
            Add Credit Card
          </Button>
        </div> */}
            </CardContent>
          </Card>
        </Form>
      </Formik>
    </div>
  );
}

export default CreditCardForm;
