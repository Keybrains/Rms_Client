import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  Navbar,
  Nav,
  Container,
  Media,
  FormGroup,
  Row,
  Col,
} from "reactstrap";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { jwtDecode } from "jwt-decode";
import notify from "../../../assets/icons/notify.svg";

const SuperAdminNavbar = (props) => {
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  let navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  let Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Superadmin ID");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [superAdminNotification, setsuperAdminNotification] = useState([]);
  const superAdminNotificationData = async (addresses, units) => {
    if (accessType?.superadmin_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/notification/superadmin/${accessType?.superadmin_id}`
        );
        if (response.status === 200) {
          const data = response.data.data;
          console.log(" response.data.data", data.length);
          setNotificationCount(response.data.data.length);
          setsuperAdminNotification(data);
        } else {
          console.error("Response status is not 200");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    superAdminNotificationData();
  }, [accessType?.superadmin_id]);

  const readSuperAdminNotification = async (notification_id) => {
    try {
      const response = await axios.put(
        `${baseUrl}/notification/superadmin_notification/${notification_id}`
      );
      if (response.status === 200) {
        superAdminNotificationData();
        // Process the data as needed
      } else {
        console.error("Response status is not 200");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar
        className="navbar-top navbar-dark px-5 pt-5"
        expand="md"
        id="navbar-main"
      >
        <Link
          className="h4 mb-0 d-none d-lg-inline-block"
          to="/"
          style={{
            color: "rgba(82, 84, 89, 1)",
            fontFamily: "Manrope",
            fontSize: "18px",
            fontWeight: "400",
          }}
        >
          Hello {accessType?.first_name + " " + accessType?.last_name}, Welcome
          Back!
        </Link>
        <Form className="navbar-search navbar-search-dark form-inline mr-5 d-none d-md-flex ml-lg-auto">
          <FormGroup
            className="mb-0"
            onClick={toggleSidebar}
            style={{ cursor: "pointer", position: "relative" }}
          >
            {notificationCount === 0 ? (
              <i className="far fa-bell" style={{ fontSize: "30px" }}></i>
            ) : (
              <img src={notify} width={30} height={30} />
            )}
          </FormGroup>
        </Form>

        <Nav className="align-items-center d-none d-md-flex" navbar>
          <Drawer anchor="right" open={isSidebarOpen} onClose={toggleSidebar}>
            <div
              role="presentation"
              onClick={toggleSidebar}
              onKeyDown={toggleSidebar}
            >
              <List style={{ width: "350px" }}>
                <h2 style={{ color: "blue", marginLeft: "15px" }}>
                  Notifications
                </h2>
                <Divider />
                {superAdminNotification.map((data) => {
                  const notificationTitle =
                    data.notification_title || "No Title Available";
                  const notificationDetails =
                    data.notification_detail || "No Details Available";
                  const notificationTime = new Date(
                    data.createdAt
                  ).toLocaleString();
                  return (
                    <div key={data._id}>
                      <ListItem style={{ cursor: "pointer" }}>
                        <div>
                          <h4>{notificationTitle}</h4>
                          <p>{notificationDetails}</p>
                          <Row>
                            <Col lg="8">
                              <p>{notificationTime}</p>
                            </Col>
                            <Col>
                              <Button
                                variant="contained"
                                color="primary"
                                style={{
                                  textTransform: "none",
                                  fontSize: "12px",
                                }}
                                onClick={() => {
                                  {
                                    readSuperAdminNotification(
                                      data.notification_id
                                    );

                                    navigate(`/superadmin/plans`);
                                  }
                                }}
                              >
                                View
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </ListItem>
                      <Divider />
                    </div>
                  );
                })}
              </List>
              <Divider />
            </div>
          </Drawer>
        </Nav>

        <Nav className="align-items-center d-none d-md-flex" navbar>
          <UncontrolledDropdown
            style={{
              border: "none",
              background: "none",
              boxShadow: "none",
            }}
          >
            <DropdownToggle
              className="px-4"
              style={{
                border: "none",
                background: "rgba(54, 159, 255, 0.1)",
                boxShadow: "none",
              }}
            >
              <Media className="align-items-center">
                <span
                  className="d-flex justify-content-center align-items-center p-1"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "rgba(82, 84, 89, 1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                >
                  {`${accessType?.first_name
                    ?.slice(0, 1)
                    .toUpperCase()}${accessType?.last_name
                    ?.slice(0, 1)
                    .toUpperCase()}`}
                </span>
                <Media className="ml-2 d-none d-lg-block mx-1">
                  <span
                    className="mb-0 font-weight-bold text-dark"
                    style={{
                      fontSize: "14px",
                      fontFamily: "Manrope",
                    }}
                  >
                    {accessType?.first_name + " " + accessType?.last_name}
                  </span>
                  <br />
                  <span
                    className="mb-0 font-weight-bold"
                    style={{
                      fontSize: "12px",
                      fontFamily: "Manrope",
                      color: "rgba(54, 159, 255, 1)",
                    }}
                  >
                    Super Admin
                  </span>
                </Media>
                <span
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    fontSize: "20px",
                    color: "#000",
                    marginLeft: "35px",
                  }}
                >
                  <i class="fa-solid fa-angle-down"></i>
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow w-100" right>
              <DropdownItem className="noti-title w-100" header tag="div">
                <h6
                  className="text-overflow m-0"
                  style={{
                    fontSize: "14px",
                    color: "#000",
                    marginLeft: "35px",
                  }}
                >
                  Welcome
                </h6>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                style={{
                  fontSize: "14px",
                  color: "#000",
                  marginLeft: "35px",
                }}
                to="/auth/login"
                onClick={() => {
                  Logout();
                }}
                tag={Link}
                className="text-overflow m-0"
              >
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Navbar>
    </>
  );
};

export default SuperAdminNavbar;
