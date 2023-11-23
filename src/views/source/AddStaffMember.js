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
import swal from "sweetalert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Cookies from "universal-cookie";

const AddStaffMember = () => {
  const { id } = useParams();
  const [prodropdownOpen, setproDropdownOpen] = React.useState(false);

  const [selectedProp, setSelectedProp] = useState("Select");

  const toggle = () => setproDropdownOpen((prevState) => !prevState);

  const [open, setOpen] = React.useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // const handlePropSelection = (value) => {
  //   setSelectedProp(value);
  //   setproDropdownOpen(true);
  // };
  const handleChange = (e) => {
    // setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    navigate("../StaffMember");
  };

  // const handleSubmit = async (values) => {
  //   console.log(values, "values");
  //   try {
  //     // values["property_type"] = selectedProperty;
  //     const res = await axios.post(
  //       "https://propertymanager.cloudpress.host/api/addstaffmember/addstaffmember",
  //       values
  //     );

  //     if (res.data.statusCode === 200) {
  //       navigate("/admin/StaffMember");
  //       swal("Success!", "Staff Member added successfully!", "success");
  //       console.log(`Staffmember: ${values.staffmember_name}`);
  //     } else {
  //       alert(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  // };

  let cookies = new Cookies();
  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let authConfig = {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
          token: cookies.get("token"),
        },
      };
      // auth post method
      let res = await axios.post(
        "https://propertymanager.cloudpress.host/api/register/auth",
        { purpose: "validate access" },
        authConfig
      );
      if (res.data.statusCode !== 200) {
        // cookies.remove("token");
        navigate("/auth/login");
      }
    } else {
      navigate("/auth/login");
    }
  };

  React.useEffect(() => {
    chackAuth();
  }, [cookies.get("token")]);

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
      staffmember_password: yup
        .string()
        // .required("No Password Provided")
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
        ),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      console.log(values, "values");
    },
  });

  // const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  // const handleClose = () => {
  //     setOpen(false);
  //   };
  const [staffMamberData, setstaffMamberData] = useState(null);

  // Fetch vendor data if editing an existing vendor
  React.useEffect(() => {
    if (id) {
      axios
        .get(`https://propertymanager.cloudpress.host/api/addstaffmember/staffmember_summary/${id}`)
        .then((response) => {
          const staffMamberdata = response.data.data;
          setstaffMamberData(staffMamberData);
          console.log(staffMamberdata);

          StaffMemberFormik.setValues({
            staffmember_name: staffMamberdata.staffmember_name || "",
            staffmember_designation:
              staffMamberdata.staffmember_designation || "",
            staffmember_phoneNumber:
              staffMamberdata.staffmember_phoneNumber || "",
            staffmember_email: staffMamberdata.staffmember_email || "",
            staffmember_password: staffMamberdata.staffmember_password || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching vendor data:", error);
        });
    }
  }, [id]);

  async function handleSubmit(values) {
    try {
      if (id === undefined) {
        const res = await axios.post(
          "https://propertymanager.cloudpress.host/api/addstaffmember/addstaffmember",
          values
        );
        handleResponse(res);
      } else {
        const editUrl = `https://propertymanager.cloudpress.host/api/addstaffmember/staffmember/${id}`;
        const res = await axios.put(editUrl, values);
        handleResponse(res);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
      // Handle the error and display an error message to the user if necessary.
    }
  }

  function handleResponse(response) {
    if (response.status === 200) {
      navigate("/admin/StaffMember");
      swal(
        "Success!",
        id
          ? "Staff Member updated successfully"
          : "Staff Member added successfully!",
        "success"
      );
    } else {
      alert(response.data.message);
    }
  }

  return (
    <>
      <AddStaffMemberHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card
              className="bg-secondary shadow"
              onSubmit={StaffMemberFormik.handleSubmit}
            >
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {id ? "Edit Staff Member" : "New Staf Member"}
                    </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-member"
                          >
                           Staff Member Name *
                          </label>
                          <br />
                          <br />
                          <Input
                            className="form-control-alternative"
                            id="input-staffmember-name"
                            placeholder="John William"
                            type="text"
                            name="staffmember_name"
                            //name="nput-staffmember-name"
                            onBlur={StaffMemberFormik.handleBlur}
                            onChange={(e) => {
                              // Update the state or Formik values with the new input value
                              StaffMemberFormik.handleChange(e);
                            }}
                            value={StaffMemberFormik.values.staffmember_name}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>
                  <hr className="my-4" />
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Designation
                          </label>
                          <br />
                          <br />
                          <Input
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
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>
                  <hr className="my-4" />
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Phone Number *
                          </label>
                          <br />
                          <br />
                          <Input
                            className="form-control-alternative"
                            id="staffmember_phoneNumber"
                            placeholder="Phone Number"
                            type="text"
                            name="staffmember_phoneNumber"
                            onBlur={StaffMemberFormik.handleBlur}
                            onChange={StaffMemberFormik.handleChange}
                            value={
                              StaffMemberFormik.values.staffmember_phoneNumber
                            }
                            required
                            onInput={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(
                                /\D/g,
                                ""
                              ); // Remove non-numeric characters
                              e.target.value = numericValue;
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>
                  <hr className="my-4" />
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Email *
                          </label>
                          <br />
                          <br />
                          <Input
                            className="form-control-alternative"
                            id="staffmember_email"
                            placeholder="Email"
                            type="text"
                            name="staffmember_email"
                            onBlur={StaffMemberFormik.handleBlur}
                            onChange={StaffMemberFormik.handleChange}
                            value={StaffMemberFormik.values.staffmember_email}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                  </div>
                  <hr className="my-4" />
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-desg"
                          >
                            Password:
                          </label>
                          <br />
                          <br />
                          <div style={{ display: "flex" }}>
                            <Input
                              className="form-control-alternative"
                              id="staffmember_password"
                              placeholder="Password"
                              name="staffmember_password"
                              type={showPassword ? "text" : "password"}
                              onBlur={StaffMemberFormik.handleBlur}
                              onChange={StaffMemberFormik.handleChange}
                              value={
                                StaffMemberFormik.values.staffmember_password
                              }
                              required
                            />
                            <Button
                              type="button"
                              style={{ padding: "7px" }}
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
                  <button
                    type="submit"
                    className="btn btn-primary ml-4"
                    style={{ background: "green" }}
                  >
                    {id ? "Update Staff Member" : "Add Staff Member"}
                  </button>
                  <button
                    color="primary"
                    href="#rms"
                    className="btn btn-primary"
                    onClick={handleCloseButtonClick}
                    size="sm"
                    style={{ background: "white", color: "black" }}
                  >
                    Cancel
                  </button>
                </Form>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddStaffMember;
