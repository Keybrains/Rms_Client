/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import "../../assets/css/argon-dashboard-react.min.css";
import "../../assets/css/argon-dashboard-react.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

const Profile = () => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [accessType, setAccessType] = useState(null);
  const [loader, setLoader] = useState(false);
  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getUserProfile = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        `${baseUrl}/admin/admin_profile/${accessType.admin_id}`
      );
      setUserProfile(res.data.data);
    } catch (error) {
      console.error("Error occurred while calling API:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (accessType?.admin_id) {
      getUserProfile();
    }
  }, [accessType]);

  return (
    <>
      <UserHeader />

      <Container className="mt--7" fluid>
        {loader ? (
          <Row>
            <Col>
              <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={loader}
                />
              </div>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <div
                      style={{
                        backgroundColor: "#ccc",
                        borderRadius: "50%",
                        padding: "20px",
                        width: "90px",
                        fontSize: "30px",
                      }}
                    >
                      {`${userProfile?.first_name
                        ?.slice(0, 1)
                        .toUpperCase()}${userProfile?.last_name
                        ?.slice(0, 1)
                        .toUpperCase()}`}
                    </div>

                    <div className="mt-3">
                      <h4>
                        {userProfile?.first_name}&nbsp;{userProfile?.last_name}
                      </h4>
                      <p>{userProfile?.email}</p>
                      <p>{userProfile?.phone_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              First name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={userProfile?.first_name} // Use fetched data
                              id="input-first-name"
                              placeholder="First name"
                              type="text"
                              disabled
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Last name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={userProfile?.last_name} // Use fetched data
                              id="input-last-name"
                              placeholder="Last name"
                              type="text"
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={userProfile?.email} // Use fetched data
                              id="input-email"
                              placeholder="Email"
                              type="text"
                              disabled
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Created Date
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={userProfile?.createdAt} // Use fetched data
                              id="input-last-name"
                              placeholder="Last name"
                              type="text"
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-Compnay-Name"
                            >
                              Compnay Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={userProfile?.company_name} // Use fetched data
                              id="input-Compnay-Name"
                              placeholder="Compnay Name"
                              type="text"
                              disabled
                            />
                          </FormGroup>
                        </Col>

                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Phone Number
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={userProfile?.phone_number} // Use fetched data
                              id="input-first-name"
                              placeholder="First name"
                              type="text"
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-Compnay-Name"
                            >
                              Start Date
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={userProfile?.trial?.start_date} // Use fetched data
                              id="input-Compnay-Name"
                              placeholder="Compnay Name"
                              type="text"
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Profile;
