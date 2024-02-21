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

// import socketIOClient from 'socket.io-client';

const VendorNavbar = (props) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  let cookies = new Cookies();
  let Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Vendor ID");
  };
  const { id } = useParams();
  // console.log(id);
  const [vendorDetails, setVendorDetails] = useState({});
  const [vendor_name, setVendorname] = useState("");
  // console.log(vendor_name);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();

  let cookie_id = localStorage.getItem("Vendor ID");
  // console.log(cookie_id);

  const getVendorDetails = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/vendor/vendor_summary/${cookie_id}`
      );
      // console.log(response.data.data);
      setVendorDetails(response.data.data);
      setVendorname(response.data.data.vendor_name);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      setError(error);
      setLoading(false);
    }
  };

  const [notification, setNotification] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationData, setNotificationData] = useState([]);

  // console.log("Vendor Name:", vendor_name);

  const [selectedProp, setSelectedProp] = useState("Select");

  const handlePropertySelect = (property) => {
    setSelectedProp(property);
  };

  useEffect(() => {
    fetchNotification();
  }, [vendor_name]);

  const fetchNotification = async () => {
    fetch(`${baseUrl}/notification/vendornotification/${vendor_name}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          // Filter the notifications with isVendorread set to false
          const unreadNotifications = data.data.filter(
            (notification) => !notification.isVendorread
          );
          setNotificationData(unreadNotifications);
          setNotificationCount(unreadNotifications.length);
          // console.log("Unread Notifications", unreadNotifications);
          // console.log("vendor", vendor_name);
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  };
  useEffect(() => {
    getVendorDetails();
    // console.log(id);
  }, [id]);

  const [accessType, setAccessType] = useState(null);
  console.log(accessType, "accessType");
  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const [vendorNotification, setVendorNotificationData] = useState([]);
  const vendorNotificationData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/notification/vendor/${accessType?.vendor_id}`
      );
      if (response.status === 200) {
        const data = response.data.data;
        setVendorNotificationData(data);
        // Process the data as needed
      } else {
        console.error("Response status is not 200");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error, display a message to the user, or take other appropriate action.
    }
  };

  useEffect(() => {
    vendorNotificationData();
  }, [accessType]);

  const readStaffmemberNotification = async (notification_id) => {
    try {
      const response = await axios.put(
        `${baseUrl}/notification/vendor_notification/${notification_id}`
      );
      if (response.status === 200) {
        vendorNotificationData();
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
        <Container
          fluid
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/vendor/VendordashBoard"
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
                  <h2 style={{ color: "#36013F", marginLeft: "15px" }}>
                    Notifications
                  </h2>
                  <Divider />
                  {vendorNotification.map((data) => {
                    const notificationTitle =
                      data.notification_title || "No Title Available";
                    const notificationDetails =
                      data.notification_detail || "No Details Available";
                    const notificationTime = new Date(
                      data.createdAt
                    ).toLocaleString();

                    return (
                      <div key={data._id}>
                        <ListItem onClick={() => handlePropertySelect(data)}>
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
                                    background: "#36013F",
                                    color: "white",
                                    textTransform: "none",
                                    fontSize: "12px",
                                  }}
                                  onClick={() => {
                                    readStaffmemberNotification(
                                      data?.notification_id
                                    );
                                    navigate(
                                      `/vendor/vendorworkdetail/${data?.notification_type?.workorder_id}`
                                    );
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
                {/* Other sidebar content goes here */}
              </div>
            </Drawer>
          </Nav>

          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {vendorDetails.vendor_name}
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

export default VendorNavbar;
