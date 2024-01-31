// reactstrap components
import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Typography, colors } from "@mui/material";
import swal from "sweetalert";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ResetPassword = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let navigate = useNavigate();
  let cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(false);




  return (
    <>
    
   
      <Col lg="5" md="7">
        <Card
          className="bg-secondary shadow border-0"

        >
          <CardBody className="px-lg-5 py-lg-5">
            
            <div className="text-center text-muted mb-4">
              <small>Change password</small>
            </div>
            <Form role="form">
              <FormGroup>
                <label className="form-control-label" htmlFor="New Password">
                  New password
                </label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="standard-adornment-password"
                    autoComplete="new-password"
                    name="password"
                    placeholder="Password"


                  />


                </InputGroup>

              </FormGroup>
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="Confirm new password"
                >
                  Confirm new password
                </label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="standard-adornment-password"
                    autoComplete="new-password"
                    name="password"
                    placeholder="Password"
                 

                  />

                </InputGroup>

              </FormGroup>

              <div className="text-center">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  color="primary"
                >
                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Change password"
                  )}
                </Button>
              </div>
              <br />
            </Form>
          </CardBody>
        </Card>
      </Col>
     
    

    </>
  );
};

export default ResetPassword;
