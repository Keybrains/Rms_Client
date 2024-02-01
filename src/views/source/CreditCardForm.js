import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Col, FormGroup, Row } from "reactstrap";
import * as yup from "yup";
import axios from "axios";
import swal from "sweetalert";

function CreditCardForm(props) {
  const { tenantId, closeModal, getCreditCard } = props;

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
  });

  const handleSubmit = async (values) => {
    const object = {
      tenant_id: tenantId,
      card_number: values.card_number,
      exp_date: values.exp_date,
    };
    const response = await axios.post(
      "http://localhost:4000/api/creditcard/addCreditCard",
      object
    );
    swal("Success", response.data.message, "success");
    closeModal();
    getCreditCard();
  };

  return (
    <div>
      <Formik
        initialValues={{ card_number: "", exp_date: "" }}
        validationSchema={paymentSchema}
        onSubmit={(values, { resetForm }) => {
          if (paymentSchema.isValid) {
            handleSubmit(values);
            resetForm();
          }
        }}
      >
        <Form>
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
        </Form>
      </Formik>
    </div>
  );
}

export default CreditCardForm;
