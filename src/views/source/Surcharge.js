import React, { useState, useEffect } from 'react';
import { FormGroup, Input, Button, Row, Col } from 'reactstrap'; // Assuming you're using Reactstrap
import { useFormik } from 'formik';
import swal from 'sweetalert';

function SurchargeForm(props) {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { closeModal } = props;
  const [isSubmitting, setSubmitting] = useState(false);
  const id = "65c2286de41c9056bb233a85";

  // Initialize Formik form
  const surchargeFormik = useFormik({
    initialValues: {
      surcharge_percent: '', 
    },
    onSubmit: async (values) => {
      try {
        setSubmitting(true); 
        const response = await fetch(`${baseUrl}/surcharge/surcharge/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        if (!response.ok) {
          throw new Error('Failed to update data');
        }
        swal('Success!','Surcharge Added Successfully','success');
        closeModal(); 
      } catch (error) {
        console.error('Error updating data:', error);
      } finally {
        setSubmitting(false); // Set submitting state back to false
      }
    },
  });

      // Fetch data from the API
      const fetchData = async () => {
        try {
          const response = await fetch(`${baseUrl}/surcharge/surcharge/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const data = await response.json();
          // Set form values with fetched data
          surchargeFormik.setValues({
            surcharge_percent: data.data.surcharge_percent,
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div style={{ maxHeight: "530px", overflowY: "auto", overflowX: "hidden" }}>
      <form onSubmit={surchargeFormik.handleSubmit}>
        <div>
          <Row>
            <Col md="6">
              <FormGroup>
                <label className="form-control-label" htmlFor="input-property">
                  Percentage *
                </label>
                <Input
                  type="text"
                  id="surcharge_percent"
                  placeholder="Enter Percentage"
                  name="surcharge_percent"
                  onBlur={surchargeFormik.handleBlur}
                  onChange={surchargeFormik.handleChange}
                  value={surchargeFormik.values.surcharge_percent}
                />
                {surchargeFormik.touched.surcharge_percent && 
                  surchargeFormik.errors.surcharge_percent ? (
                  <div style={{ color: "red", marginBottom: "10px" }}>
                    {surchargeFormik.errors.surcharge_percent}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md='6'>
              {isSubmitting ? (
                <Button disabled color="success" type="submit">
                  Loading
                </Button>
              ) : (
                <Button color="success" type="submit">
                  Save
                </Button>
              )}
              <Button onClick={closeModal}>Cancel</Button>
            </Col>
          </Row>
        </div>
      </form>
    </div>
  );
}

export default SurchargeForm;
