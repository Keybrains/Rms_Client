import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from "@material-ui/core/CircularProgress";

const CreatePassword = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  let navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    // Make a request to check the token's expiration status
    fetch(`${baseUrl}/admin/check_token_status/${token}`)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);

        if (data.expired) {
          setTokenExpired(true);
        }
        else{
          setEmail(token);
        }
      })
      .catch((error) => {
        console.error("Error checking token status:", error);
        setIsLoading(false);
      });
  }, [location.search]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else if (!isStrongPassword(newPassword)) {
      setError(
        "Password must be strong. Include uppercase, lowercase, numbers, and special characters."
      );
    } else {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${baseUrl}/admin/reset_password/${email}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: newPassword }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast.success('Password Changed Successfully', {
            position: 'top-center',
            // autoClose: 1000
          })
          console.log("res",data)
          console.log("Navigating to URL:", data.url);
          navigate(data.url);
        } else {
          setError(data.message);
          toast.error('Failed To Change Password', {
            position: 'top-center',
            autoClose: 1000
          })
        }
      } catch (error) {
        setError("An error occurred while changing the password");
      } finally {
        setIsLoading(false); // Set loading state to false after API call completes
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    handleChangePassword();
  };

  const isStrongPassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  return (
    <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
        
          {/* {tokenExpired ? (
            <div className="text-danger">
              The password reset link has expired. Please request a new one.
            </div>
          ) : ( */}
          <div>
          <div className="text-center text-muted mb-4">
            <big>Create Password</big>
          </div>
        
          <Form role="form" onSubmit={handleSubmit}>
            {/* <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                <Input
                  type="email"
                  placeholder="Email"
                  className="form-control"
                  id="inputmail"
                  // value={Mail}
                  onChange={(e) => setEmail(e.target.value)}
                />
                </InputGroup>
              </FormGroup> */}
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="New Password"
                  className="form-control"
                  id="inputPassword4"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <IconButton
                  type="button"
                  style={{ padding: "7px" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <VisibilityIcon />
                </IconButton>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type={showPassword1 ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <IconButton
                  type="button"
                  style={{ padding: "7px" }}
                  onClick={() => setShowPassword1(!showPassword1)}
                >
                  <VisibilityIcon />
                </IconButton>
              </InputGroup>
            </FormGroup>
            {error && <div className="text-danger">{error}</div>}
            <br/>
            <div className="text-center">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                color="primary"
                //onClick={handleChangePassword}
              >
                {isLoading ? <CircularProgress size={24} /> : "Create Password"}
              </Button>
              <Button
                variant="contained"
                size="large"
                color="grey"
                onClick={() => navigate(`/auth/login`)}
              >
                Cancel
              </Button>
            </div>
          </Form>
          </div>
           {/* )} */}
        </CardBody>
      </Card>
      <ToastContainer />
    </Col>
  );
};

export default CreatePassword;
