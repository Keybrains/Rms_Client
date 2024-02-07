import { React, useState } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, FormLabel, RadioGroup, Radio, FormControlLabel, Checkbox, Grid } from '@mui/material';
import SuperAdminHeader from "../Headers/SuperAdminHeader";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { ToastContainer, toast } from "react-toastify";
import {
    Card,
    CardHeader,
    FormGroup,
    Container,
    Row,
    Col,
    Table,
    Button,
} from "reactstrap";
const AddPlanForm = ({ handleSubmit }) => {

    const [inputFields, setInputFields] = useState([
        {
            features: "",
        },
    ]);

    const addInputField = () => {
        setInputFields([
            ...inputFields,
            {
                features: "",
            },
        ]);
    };
    const removeInputFields = (index) => {
        const rows = [...inputFields];
        rows.splice(index, 1);
        setInputFields(rows);
    };
    const handleFeaturesChange = (index, evnt) => {
        const { name, value } = evnt.target;
        const list = [...inputFields];
        list[index][name] = value;
        setInputFields(list);
    };
    const [showBillingPeriods, setShowBillingPeriods] = useState(false);


    return (
        <div>


            <SuperAdminHeader />
            <Container className="mt--8" fluid>
                <Row>
                    <Col xs="12" sm="6">
                        <FormGroup className="">
                            <h1 style={{ color: "white" }}></h1>
                            <h4 style={{ color: "white" }}></h4>
                        </FormGroup>
                    </Col>
                    <Col className="text-right" xs="12" sm="6">
                        <Button
                            color="primary"
                            //  href="#rms"
                            // onClick={() => navigate(`/${admin}/RentalownerTable`)}
                            size="sm"
                            style={{ background: "white", color: "blue" }}
                        >
                            Back
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Add Plan </h3>
                            </CardHeader>
                            <div className="table-responsive">
                                <div className="m-3">
                                    <Container fluid>
                                        <Row className="mb-3">
                                            <Col>
                                                <Formik
                                                    initialValues={{
                                                        plan_name: '',
                                                        plan_price: '',
                                                        billing_interval: '',
                                                        plan_days: '',
                                                        day_of_month: '',
                                                        billingOption: '',
                                                        plan_periods: '',
                                                        earlyCancellationFee: false,
                                                        changePlan: false,
                                                        cancelMembership: false,
                                                        pauseMembership: false
                                                    }}
                                                    validationSchema={Yup.object().shape({
                                                        plan_name: Yup.string().required('Required'),
                                                        plan_price: Yup.number().required('Required'),
                                                        billing_interval: Yup.string().required('Required'),
                                                        plan_days: Yup.number().when('billing_interval', {
                                                            is: 'Days',
                                                            then: Yup.number().required('Required')
                                                        }),
                                                        day_of_month: Yup.number().when('billing_interval', {
                                                            is: 'Monthly',
                                                            then: Yup.number().required('Required')
                                                        }),
                                                        plan_periods: Yup.number().when('billingOption', {
                                                            is: value => value !== 'autoRenew',
                                                            then: Yup.number().required('Required')
                                                        })
                                                    })}
                                                    onSubmit={(values, { resetForm }) => {
                                                        handleSubmit(values);
                                                        resetForm();
                                                    }}
                                                >
                                                    {({ values, errors, touched, handleBlur, handleChange }) => (
                                                        <Form>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} sm={6}>
                                                                    <TextField
                                                                        type="text"
                                                                        size="small"
                                                                        fullWidth
                                                                        placeholder="Add Plan *"
                                                                        label="Plan Name*"
                                                                        name="plan_name"
                                                                        value={values.plan_name}
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        error={touched.plan_name && !!errors.plan_name}
                                                                        helperText={touched.plan_name && errors.plan_name}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6}>
                                                                    <TextField
                                                                        type="number"
                                                                        size="small"
                                                                        fullWidth
                                                                        placeholder="Add Price *"
                                                                        label="Cost Per Billing Cycle *"
                                                                        name="plan_price"
                                                                        value={values.plan_price}
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        error={touched.plan_price && !!errors.plan_price}
                                                                        helperText={touched.plan_price && errors.plan_price}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6}>
                                                                    <FormControl fullWidth>
                                                                        <InputLabel size="small">Plan Billing Interval</InputLabel>
                                                                        <Select
                                                                            size="small"
                                                                            label="Select Billing-Interval"
                                                                            name="billing_interval"
                                                                            value={values.billing_interval}
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            error={touched.billing_interval && !!errors.billing_interval}
                                                                        >
                                                                            <MenuItem value="">Select</MenuItem>
                                                                            <MenuItem value="Monthly">Monthly</MenuItem>
                                                                            <MenuItem value="Annual">Annual</MenuItem>
                                                                            <MenuItem value="Days">Days</MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                                {values.billing_interval === 'Days' && (
                                                                    <Grid item xs={12} sm={6}>
                                                                        <TextField
                                                                            type="number"
                                                                            size="small"
                                                                            fullWidth
                                                                            placeholder="Add Days *"
                                                                            label="Add Days *"
                                                                            name="plan_days"
                                                                            value={values.plan_days}
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            error={touched.plan_days && !!errors.plan_days}
                                                                            helperText={touched.plan_days && errors.plan_days}
                                                                        />
                                                                    </Grid>
                                                                )}
                                                                {values.billing_interval === 'Monthly' && (
                                                                    <Grid item xs={12} sm={6}>
                                                                        <FormControl fullWidth>
                                                                            <InputLabel size="small">Charge on Day of Month *</InputLabel>
                                                                            <Select
                                                                                size="small"
                                                                                fullWidth
                                                                                label="Charge on Day of Month *"
                                                                                name="day_of_month"
                                                                                value={values.day_of_month}
                                                                                onBlur={handleBlur}
                                                                                onChange={handleChange}
                                                                                error={touched.day_of_month && !!errors.day_of_month}
                                                                            >
                                                                                {[...Array(28).keys()].map(day => (
                                                                                    <MenuItem key={day + 1} value={day + 1}>{day + 1}</MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Grid>
                                                                )}
                                                                <Grid item xs={12}>
                                                                    <FormLabel component="legend">Add Features:</FormLabel>
                                                                    {inputFields.map((data, index) => {
                                                                        const { features } = data;
                                                                        return (
                                                                            <div className="row" key={index}>
                                                                                <div className="col">
                                                                                    <div className="form-group">
                                                                                        <TextField
                                                                                            type="text"
                                                                                            size="small"
                                                                                            fullWidth
                                                                                            onChange={(evnt) =>
                                                                                                handleFeaturesChange(index, evnt)
                                                                                            }
                                                                                            value={features}
                                                                                            name="features"
                                                                                            className="form-control"
                                                                                            placeholder="Features"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="">
                                                                                    {inputFields.length !== 1 ? (
                                                                                        <div
                                                                                            className="mt-2"
                                                                                            style={{ cursor: "pointer" }}
                                                                                            onClick={removeInputFields}
                                                                                        >
                                                                                            ✖️
                                                                                        </div>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    <div className="row">
                                                                        <div className="col-sm-12">
                                                                            <button
                                                                                className="btn btn-outline-primary"
                                                                                sm
                                                                                onClick={addInputField}
                                                                            >
                                                                                Add New
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <FormLabel component="legend">Add Features:</FormLabel>
                                                                    <div className="mt-3">
                                                                        <FormControl component="fieldset">
                                                                            <FormLabel component="legend">
                                                                                Set how many times you wish to charge the
                                                                                customer?
                                                                            </FormLabel>
                                                                            <RadioGroup
                                                                                aria-label="billingOption"
                                                                                name="billingOption"
                                                                                value={values.billingOption}
                                                                                onChange={handleChange}
                                                                            >
                                                                                <FormControlLabel
                                                                                    value="autoRenew"
                                                                                    control={<Radio />}
                                                                                    onChange={() => setShowBillingPeriods(true)}
                                                                                    label={
                                                                                        <span style={{ fontSize: "0.8rem" }}>
                                                                                            Auto renew plan after term expires
                                                                                        </span>
                                                                                    }
                                                                                />
                                                                                <FormControlLabel
                                                                                    value="chargeUntilTerm"
                                                                                    control={<Radio />}
                                                                                    label={
                                                                                        <span style={{ fontSize: "0.8rem" }}>
                                                                                            Charge customers until their term commitment
                                                                                            expires
                                                                                        </span>
                                                                                    }
                                                                                    onChange={() => setShowBillingPeriods(false)}
                                                                                />
                                                                                <FormControlLabel
                                                                                    value="chargeUntilCancellation"
                                                                                    control={<Radio />}
                                                                                    onChange={() => setShowBillingPeriods(false)}
                                                                                    label={
                                                                                        <span style={{ fontSize: "0.8rem" }}>
                                                                                            Charge customers until cancellation, no term
                                                                                            commitment
                                                                                        </span>
                                                                                    }
                                                                                />
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <FormLabel component="legend"> Additional Options:</FormLabel>
                                                                    <div className=" mt-3 ">
                                                                        <FormControl component="fieldset">
                                                                           
                                                                          
                                                                                <FormControlLabel
                                                                                    control={
                                                                                        <Checkbox
                                                                                            checked={values.earlyCancellationFee}
                                                                                            onChange={handleChange}
                                                                                            name="earlyCancellationFee"
                                                                                        />
                                                                                    }
                                                                                    label={
                                                                                        <span style={{ fontSize: "0.8rem" }}>
                                                                                            Set early membership cancellation fee
                                                                                        </span>
                                                                                    }
                                                                                />
                                                                                <FormControlLabel
                                                                                    control={
                                                                                        <Checkbox
                                                                                            checked={values.changePlan}
                                                                                            onChange={handleChange}
                                                                                            name="changePlan"
                                                                                        />
                                                                                    }
                                                                                    label={
                                                                                        <span style={{ fontSize: "0.8rem" }}>
                                                                                            Allow member to change plan
                                                                                        </span>
                                                                                    }
                                                                                />
                                                                                <FormControlLabel
                                                                                    control={
                                                                                        <Checkbox
                                                                                            checked={values.cancelMembership}
                                                                                            onChange={handleChange}
                                                                                            name="cancelMembership"
                                                                                        />
                                                                                    }
                                                                                    label={
                                                                                        <span style={{ fontSize: "0.8rem" }}>
                                                                                            Allow member to cancel billing/membership
                                                                                        </span>
                                                                                    }
                                                                                />
                                                                                <FormControlLabel
                                                                                    control={
                                                                                        <Checkbox
                                                                                            checked={values.pauseMembership}
                                                                                            onChange={handleChange}
                                                                                            name="pauseMembership"
                                                                                        />
                                                                                    }
                                                                                    label={
                                                                                        <span style={{ fontSize: "0.8rem" }}>
                                                                                            Allow member to pause billing/membership
                                                                                        </span>
                                                                                    }
                                                                                />
                                                                           
                                                                        </FormControl>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    {/* <FormLabel component="legend">Add Features:</FormLabel> */}
                                                                    <Button
                                                                        className="mt-3"
                                                                        type="submit"
                                                                        variant="success"
                                                                    >
                                                                        Add Plan
                                                                    </Button>
                                                                    <Button
                                                                        className="mt-3"
                                                                        type=""
                                                                        variant=""
                                                                        // onClick={() => setModalShowForPopupForm(false)}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            </div>
                        </Card>
                    </div>
                </Row>
                <br />
                <br />
            </Container>
        </div>
    );

};


export default AddPlanForm;
