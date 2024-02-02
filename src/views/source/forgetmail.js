import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  Label,
} from "reactstrap";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ClearIcon } from "@mui/x-date-pickers";
import axios from "axios";

const Forgetmail = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract the token from the URL
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    // Decode the token to get the email
    const decodedEmail = decodeURIComponent(token);

    // Set the email state
    setEmail(decodedEmail);
  }, [location.search]);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else if (!isStrongPassword(newPassword)) {
      setError("Password must be strong. Include uppercase, lowercase, numbers, and special characters.");
    } else {
      try {
        setIsLoading(true)
        const response = await fetch(
          `${baseUrl}/tenant/reset_password/${email}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tenant_password: newPassword }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast.success('Password Changed Successfully!', {
            position: 'top-center',
          })
          navigate(`/auth/login`)
        } else {
          setError(data.message);
          toast.error('Failed To Change Password', {
            position: 'top-center',
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
    handleSendMail();
  };

  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const [mail, setMail] = useState("");

  const handleSendMail = async () => {
    setIsLoading(true);
    try {
      const data = {
        tenant_email: mail
      }
      const res = await axios.post("http://192.168.1.13:4000/api/tenant/passwordmail", data);
      if (res) {
        toast.success('Mail Sent Successfully', {
          position: 'top-center',
        })
        navigate(`/auth/login`)
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-4 py-lg-4">
          {/* <div className="forms"> */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Forget Your Password?</h3>
          </div>
          <div className="text-left text-muted mb-4">
            <p style={{ fontSize: '14px' }}>Enter your email address below, and we'll send you a link to reset your password.</p>
          </div>
          <Form role="form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="mail" style={{ fontSize: '13px' }}>Email Address</Label>
              <InputGroup className="input-group-alternative"
                style={{ border: '1px solid black' }}
              >
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type='email'
                  placeholder="Email Address"
                  className="form-control"
                  id="mail"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  required
                />
              </InputGroup>
            </FormGroup>
            <div className="text-left">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                color="primary"
              >
                {isLoading ? <CircularProgress size={24} /> : "Submit"}
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
        </CardBody>
      </Card>
      <ToastContainer />
    </Col>
  );
};

export default Forgetmail;
