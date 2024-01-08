// import React from 'react'
import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { makeStyles } from "@mui/styles";
import { Card, CardBody, Col, Input } from "reactstrap";
// import { Grid } from 'react-loader-spinner';
import { Grid } from "@mui/material";
import { Diversity1Sharp } from "@mui/icons-material";

const useStyles = makeStyles(() => ({
  stepper: {
    // padding: "24px", // Replace with your desired pixel value
  },
  button: {
    marginTop: "8px", // Replace with your desired pixel value
    marginRight: "8px", // Replace with your desired pixel value
  },
}));

const steps = ["About You", "Customize Trial"];

const TrialLogin = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessEmail: "",
    termsAndConditions: false,
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "termsAndConditions" ? checked : value,
    }));
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleCreateTrial = () => {
    // Handle create trial logic here
    setOpenDialog(true);
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card
          className="bg-secondary shadow border-0"
          //   onSubmit={loginFormik.handleSubmit}
        >
          <CardBody className="px-lg-4 py-lg-4">
            <div className="text-center text-muted mb-4">
              <small>Sign up for your free trial account</small>
            </div>
            <div>
              <div>
                {activeStep === 0 && (
                  <div>
                    <Grid container>
                      <Grid item xs={6}>
                        <div
                          className="formInput"
                          style={{ margin: "10px 10px" }}
                        >
                          <Input
                            className="form-control-alternative"
                            id="input-firname"
                            placeholder="First Name"
                            type="text"
                            name="firstName"
                          />
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div
                          className="formInput"
                          style={{ margin: "10px 10px" }}
                        >
                          <Input
                            className="form-control-alternative"
                            id="input-lastname"
                            placeholder="Last Name"
                            type="text"
                            name="lastName"
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div
                          className="formInput"
                          style={{ margin: "10px 10px" }}
                        >
                          <Input
                            className="form-control-alternative"
                            id="input-businessEmail"
                            placeholder="Business Email"
                            type="email"
                            name="businessEmail"
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className="text-center">
                          <Button
                            variant="contained"
                            sx={{ mt: 2, mb: 2, width: "100%" }}
                            onClick={handleNext}
                            className={classes.button}
                          >
                            Create Your Free Trial
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                )}
                {activeStep === 1 && (
                  <div>
                    <Grid container>
                      <Grid item xs={6}>
                        <div
                          className="formInput"
                          style={{ margin: "10px 10px" }}
                        >
                          <Input
                            className="form-control-alternative"
                            id="input-firname"
                            placeholder="First Name"
                            type="text"
                            name="firstName"
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div
                          className="formInput"
                          style={{ margin: "10px 10px" }}
                        >
                          <Input
                            className="form-control-alternative"
                            id="input-lastname"
                            placeholder="Last Name"
                            type="text"
                            name="lastName"
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div
                          className="formInput"
                          style={{ margin: "10px 10px" }}
                        >
                          <Input
                            className="form-control-alternative"
                            id="input-businessEmail"
                            placeholder="Business Email"
                            type="email"
                            name="businessEmail"
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div
                          className="formInput"
                          style={{ margin: "10px 10px" }}
                        >
                          <Input
                            className="form-control-alternative"
                            id="input-companyName"
                            placeholder="Company Name"
                            type="text"
                            name="companyName"
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div
                          className="formInput"
                          style={{ margin: "10px 10px" }}
                        >
                          <Input
                            className="form-control-alternative"
                            id="input-number"
                            placeholder="Phone Number"
                            type="number"
                            name="number"
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div
                          className="formInput"
                          style={{ margin: "10px 10px" }}
                        >
                          <Input
                            className="form-control-alternative"
                            id="input-unitNumber"
                            placeholder="Number of units"
                            type="number"
                            name="unitNumber"
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div
                          className="formInput"
                          style={{ margin: "10px 10px" }}
                        >
                          <Input
                            className="form-control-alternative"
                            id="input-businessEmail"
                            placeholder="Business Email"
                            type="email"
                            name="businessEmail"
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div
                          className="formInput"
                          style={{ margin: "10px 10px" }}
                        >
                          <Input
                            className="form-control-alternative"
                            id="input-password"
                            placeholder="Password"
                            type="password"
                            name="password"
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <Checkbox
                          name="termsAndConditions"
                          checked={formData.termsAndConditions}
                          onChange={handleChange}
                        />
                        I have read and accept 302 Properties terms and
                        conditions
                      </Grid>
                      <Grid item xs={12}>
                        <div className="text-center">
                          <Button
                            variant="contained"
                            sx={{ mt: 2, mb: 2, width: "100%" }}
                            onClick={handleCreateTrial}
                            className={classes.button}
                          >
                            Create Your Free Trial
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                    {/* Add the other 8 fields here */}
                  </div>
                )}
                {/* {activeStep === 2 && (
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCreateTrial}
                      className={classes.button}
                      sx={{width:"100%"}}
                    >
                      Create Your Free Trial
                    </Button>
                    <Button
                      variant="contained"
                      // color="default"
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                  </div>
                )} */}
              </div>
              <Dialog open={openDialog} onClose={handleDialogClose} sx={{ textAlign: "center" }}>
                <DialogTitle>
                    <div className="text-center">
                  <CheckCircleIcon sx={{ color: "green", fontSize: 50 }} />
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="text-center">

                  <p className="text-center"><strong>Your trial account is ready!</strong></p>
                    </div>
                    <div className="text-center" style={{display:"inline-block", width:"60%"}}>
                        <p>
                        Feel free to access the trial account. Once you sign up, we'll start you with a fresh account
                        </p>
                    </div>
                <div className="text-center">
                    <Button onClick={handleDialogClose} variant="contained" color="primary">
                        Get Started
                        </Button>
                </div>
                </DialogContent>
              </Dialog>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Stepper
                activeStep={activeStep}
                className={classes.stepper}
                size="small"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center", // Optional: set a height to center vertically within the viewport
                  width: "70%",
                }}
              >
                {steps.map((label, index) => (
                  <Step
                    key={label}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <StepLabel />
                    </div>
                    <div>
                      <Typography fontSize={9}>{label}</Typography>
                    </div>
                  </Step>
                ))}
              </Stepper>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default TrialLogin;
