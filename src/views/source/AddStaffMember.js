import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
} from "reactstrap";

import { useState } from "react";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import AddStaffMemberHeader from "components/Headers/AddStaffMemberHeader";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddStaffMember = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id, admin } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);

  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    navigate("../StaffMember");
  };

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const StaffMemberFormik = useFormik({
    initialValues: {
      staffmember_name: "",
      staffmember_designation: "",
      staffmember_phoneNumber: "",
      staffmember_email: "",
      staffmember_password: "",
    },
    validationSchema: yup.object({
      staffmember_name: yup.string().required("Required"),
      staffmember_designation: yup.string().required("Required"),
      staffmember_phoneNumber: yup.number().required("Required"),
      staffmember_email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      staffmember_password: yup
        .string()
        .required("No Password Provided")
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
        ),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const [staffMamberData, setstaffMamberData] = useState(null);

  // Fetch vendor data if editing an existing vendor
  React.useEffect(() => {
    if (id) {
      axios
        .get(`${baseUrl}/staffmember/staff/member/${id}`)
        .then((response) => {
          const staffMamberdata = response.data.data;
          setstaffMamberData(staffMamberData);
          //console.log(staffMamberdata);

          StaffMemberFormik.setValues({
            staffmember_name: staffMamberdata?.staffmember_name || "",
            staffmember_designation:
              staffMamberdata?.staffmember_designation || "",
            staffmember_phoneNumber:
              staffMamberdata?.staffmember_phoneNumber || "",
            staffmember_email: staffMamberdata?.staffmember_email || "",
            staffmember_password: staffMamberdata?.staffmember_password || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching vendor data:", error);
        });
    }
  }, [id]);

  async function handleSubmit(values) {
    setSubmitLoader(true);
    const object = {
      admin_id: accessType?.admin_id,
      staffmember_name: values?.staffmember_name,
      staffmember_designation: values?.staffmember_designation,
      staffmember_phoneNumber: values?.staffmember_phoneNumber,
      staffmember_email: values?.staffmember_email,
      staffmember_password: values?.staffmember_password,
    };
    try {
      if (id === undefined) {
        const res = await axios.post(
          `${baseUrl}/staffmember/staff_member`,
          object
        );
        console.log(object, "yash", res)
        if (res.data.statusCode === 200) {
          handleResponse(res);
        } else if (res.data.statusCode === 201) {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      } else {
        const editUrl = `${baseUrl}/staffmember/staff_member/${id}`;
        const res = await axios.put(editUrl, object);
        if (res.data.statusCode === 200) {
          handleResponse(res);
        } else if (res.data.statusCode === 400) {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    } finally {
      setSubmitLoader(false);
    }
  }

  function handleResponse(response) {
    const successMessage = id
      ? "Staff  updated successfully"
      : "Staff  added successfully";
    const errorMessage = response.data.message;

    if (response.data.statusCode === 200) {
      // Show success toast
      toast.success(successMessage, {
        position: "top-center",
        autoClose: 1000,
        onClose: () => navigate(`/${admin}/StaffMember`),
      });
    } else {
      // Show an error toast
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 1000,
      });
    }
  }

  return (
    <>
      {/* <AddStaffMemberHeader /> */}
      {/* Page content */}
      <Container className="" fluid style={{ marginTop: "4rem", height: "100vh" }}>
        <Col xs="12" lg="12" sm="6">
          {/* <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Type</h1>
            </FormGroup> */}
          <CardHeader
            className=" mt-3 mx-2"
            style={{
              backgroundColor: "#152B51",
              borderRadius: "10px",
              boxShadow: " 0px 4px 4px 0px #00000040 ",
            }}
          >
            <h2
              className=""
              style={{
                color: "#ffffff",
                fontFamily: "Poppins",
                fontWeight: "500",
                fontSize: "26px",
              }}
            >
              {id ? "Edit Staff Member" : "Add Staff Member"}

            </h2>
          </CardHeader>
        </Col>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-white shadow mt-3 mx-4" style={{ boxShadow: "0px 4px 4px 0px #00000040", border: "1px solid #324567" }}
              onSubmit={StaffMemberFormik.handleSubmit}
            >
              {/* <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0" style={{ fontSize: "18px", fontWeight: "600", fontFamily: "Poppins", color: "#152B51" }}>

                    </h3>
                  </Col>
                </Row>
              </CardHeader> */}
              <CardBody>
                <Form>
                  <div className="">
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-member"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Staff Member Name *
                          </label>
                          <Input
                            style={{
                              boxShadow: " 0px 4px 4px 0px #00000040 ",
                              borderRadius: "6px",
                              width: "60%",
                            }}
                            className="form-control-alternative"
                            id="input-staffmember-name"
                            placeholder="Enter staff member name here..."
                            type="text"
                            name="staffmember_name"
                            //name="nput-staffmember-name"
                            onBlur={StaffMemberFormik.handleBlur}
                            onChange={(e) => {
                              // Update the state or Formik values with the new input value
                              StaffMemberFormik.handleChange(e);
                            }}
                            value={StaffMemberFormik.values.staffmember_name}
                          />
                          {StaffMemberFormik.touched.staffmember_name &&
                            StaffMemberFormik.errors.staffmember_name ? (
                            <div style={{ color: "red" }}>
                              {StaffMemberFormik.errors.staffmember_name}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>
                  {/* <hr className="my-2" /> */}
                  <div className="">
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Designation
                          </label>
                          <Input
                            style={{
                              boxShadow: " 0px 4px 4px 0px #00000040 ",
                              borderRadius: "6px",
                              width: "60%",
                            }}
                            className="form-control-alternative"
                            id="input-staffmember-desg"
                            placeholder="Manager"
                            type="text"
                            name="staffmember_designation"
                            onBlur={StaffMemberFormik.handleBlur}
                            onChange={StaffMemberFormik.handleChange}
                            value={
                              StaffMemberFormik.values.staffmember_designation
                            }
                          />
                          {StaffMemberFormik.touched.staffmember_designation &&
                            StaffMemberFormik.errors.staffmember_designation ? (
                            <div style={{ color: "red" }}>
                              {StaffMemberFormik.errors.staffmember_designation}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>
                  {/* <hr className="my-2" /> */}
                  <div className="">
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Phone Number *
                          </label>
                          <Input
                            style={{
                              boxShadow: " 0px 4px 4px 0px #00000040 ",
                              borderRadius: "6px",
                              width: "60%",
                            }}
                            className="form-control-alternative"
                            id="staffmember_phoneNumber"
                            placeholder="Enter phone number here..."
                            type="text"
                            name="staffmember_phoneNumber"
                            onBlur={StaffMemberFormik.handleBlur}
                            onChange={StaffMemberFormik.handleChange}
                            value={
                              StaffMemberFormik.values.staffmember_phoneNumber
                            }
                            onInput={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(
                                /\D/g,
                                ""
                              ); // Remove non-numeric characters
                              e.target.value = numericValue;
                            }}
                          />
                          {StaffMemberFormik.touched.staffmember_phoneNumber &&
                            StaffMemberFormik.errors.staffmember_phoneNumber ? (
                            <div style={{ color: "red" }}>
                              {StaffMemberFormik.errors.staffmember_phoneNumber}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Email *
                          </label>
                          <Input
                            style={{
                              boxShadow: " 0px 4px 4px 0px #00000040 ",
                              borderRadius: "6px",
                              width: "60%",
                            }}
                            className="form-control-alternative"
                            id="staffmember_email"
                            placeholder="Enter email here..."
                            type="email"
                            name="staffmember_email"
                            onBlur={StaffMemberFormik.handleBlur}
                            onChange={StaffMemberFormik.handleChange}
                            value={StaffMemberFormik.values.staffmember_email.toLowerCase()}
                          />
                          {StaffMemberFormik.touched.staffmember_email &&
                            StaffMemberFormik.errors.staffmember_email ? (
                            <div style={{ color: "red" }}>
                              {StaffMemberFormik.errors.staffmember_email}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>
                  {/* <hr className="my-4" /> */}
                  <div className="">
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                            style={{
                              // marginBottom: "10px",
                              fontWeight: "500",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              color: "#8A95A8",
                            }}
                          >
                            Password *
                          </label>
                          <div style={{ display: "flex" }}>
                            <Input
                              style={{
                                boxShadow: " 0px 4px 4px 0px #00000040 ",
                                borderRadius: "6px",
                                width: "60%",
                              }}
                              className="form-control-alternative"
                              id="staffmember_password"
                              placeholder="Enter password here..."
                              name="staffmember_password"
                              type={showPassword ? "text" : "password"}
                              onBlur={StaffMemberFormik.handleBlur}
                              onChange={StaffMemberFormik.handleChange}
                              value={
                                StaffMemberFormik.values.staffmember_password
                              }
                            />
                            <Button
                              type="button"
                              style={{ padding: "7px", marginLeft: "5px" }}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {<VisibilityIcon />}
                            </Button>
                          </div>
                          {StaffMemberFormik.touched.staffmember_password &&
                            StaffMemberFormik.errors.staffmember_password ? (
                            <div style={{ color: "red" }}>
                              {StaffMemberFormik.errors.staffmember_password}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>

                  <Row >
                    {submitLoader ? (
                      <Button
                        type="submit"
                        className="btn ml-3"
                        style={{ background: "#152B51", color: "white" }}
                        disabled
                      >
                        Loading...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="ml-3"
                        style={{ background: "#152B51", color: "white", fontFamily: "Poppins", fontWeight: "400", fontSize: "14px", cursor: "pointer" }}
                        disabled={!StaffMemberFormik.isValid}
                      >
                        {id ? "Update Staff Member" : "Add Staff Member"}
                      </Button>
                    )}
                    <Button
                      // color="primary"
                      //  href="#rms"
                      className="btn "
                      onClick={handleCloseButtonClick}
                      size="small"
                      style={{ background: "white", color: "#152B51" }}

                    >
                      Cancel
                    </Button>
                    {/* Conditional message */}
                    {!StaffMemberFormik.isValid && (
                      <div style={{ color: "red", marginTop: "10px" }}>
                        Please fill in all fields correctly.
                      </div>
                    )}
                  </Row>
                </Form>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
};

export default AddStaffMember;
