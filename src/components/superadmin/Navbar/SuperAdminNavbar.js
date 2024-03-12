import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
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
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { makeStyles } from "@mui/styles";
import { jwtDecode } from "jwt-decode";

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
          console.log(" response.data.data", response.data.data);
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
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup
              className="mb-0"
              onClick={toggleSidebar}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <NotificationsIcon style={{ color: "white", fontSize: "30px" }} />
              {notificationCount > 0 && (
                <div
                  className="notification-circle"
                  style={{
                    position: "absolute",
                    top: "-15px",
                    right: "-20px",
                    background: "red",
                    borderRadius: "50%",
                    padding: "0.1px 8px",
                  }}
                >
                  <span
                    className="notification-count"
                    style={{ color: "white", fontSize: "13px" }}
                  >
                    {notificationCount}
                  </span>
                </div>
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
                          {/* <ListItemText
                          primary={notificationTitle}
                          secondary={notificationTime}
                        />
                        <ListItemText
                          primary={notificationDetails}
                          secondary="Notification Details"
                        /> */}
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
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../../assets/img/theme/team-4-800x800.jpg")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      Super Admin
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome</h6>
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem
                  //  href="#rms"
                  to="/auth/login"
                  onClick={() => {
                    Logout();
                  }}
                  tag={Link}
                >
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default SuperAdminNavbar;
