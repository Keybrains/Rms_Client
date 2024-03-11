import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Button,
} from "reactstrap";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { jwtDecode } from "jwt-decode";

const StaffNavbar = (props) => {
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
  let cookies = new Cookies();
  let Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Agent ID");
  };

  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationData, setNotificationData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  //console.log(id);
  const [vendorDetails, setVendorDetails] = useState({});
  const [staffmember_name, setVendorname] = useState("");
  //console.log(staffmember_name)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();

  let cookie_id = localStorage.getItem("Staff ID");
  //console.log(cookie_id)

  const [selectedProp, setSelectedProp] = useState("Select");

  const handlePropertySelect = (property) => {
    setSelectedProp(property);
  };

  const getVendorDetails = async () => {
    if (cookie_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/addstaffmember/staffmember_summary/${cookie_id}`
        );
        //console.log(response.data.data)
        setVendorDetails(response.data.data);
        setVendorname(response.data.data.staffmember_name);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vendor details:", error);
        setError(error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNotification();
  }, [staffmember_name]);

  const fetchNotification = async () => {
    fetch(`${baseUrl}/notification/staffnotification/${staffmember_name}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          const unreadNotifications = data.data.filter(
            (notification) => !notification.isStaffread
          );
          setNotificationData(unreadNotifications);
          setNotificationCount(unreadNotifications.length);
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
    //console.log(id);
  }, [id]);


  const [staffMemberNotification, setStaffMemberNotification] = useState([]);
  const staffmemberNotificationData = async (addresses, units) => {
    if (accessType?.staffmember_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/notification/staff/${accessType.staffmember_id}`
        );
        if (response.status === 200) {
          const data = response.data.data;
          setStaffMemberNotification(data);
          // Process the data as needed
        } else {
          console.error("Response status is not 200");
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle the error, display a message to the user, or take other appropriate action.
      }
    }
  };

  useEffect(() => {
    staffmemberNotificationData();
  }, [accessType]);

  const readStaffmemberNotification = async (notification_id) => {
    try {
      const response = await axios.put(
        `${baseUrl}/notification/staff_notification/${notification_id}`
      );
      if (response.status === 200) {
        staffmemberNotificationData();
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
            to="/staff/StaffdashBoard"
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
                  <h2 style={{ color: "#033E3E", marginLeft: "15px" }}>
                    Notifications
                  </h2>
                  <Divider />
                  {staffMemberNotification?.map((data) => {
                    const notificationTitle =
                      data?.notification_title || "No Title Available";
                    const notificationDetails =
                      data?.notification_detail || "No Details Available";
                    const notificationTime = new Date(
                      data?.createdAt
                    ).toLocaleString();

                    return (
                      <div
                        key={data._id}
                        style={{ backgroundColor: "#abccba" }}
                      >
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
                                  //color="primary"
                                  style={{
                                    background: "#033E3E",
                                    color: "white",
                                    textTransform: "none",
                                    fontSize: "12px",
                                  }}
                                  onClick={() => {
                                    readStaffmemberNotification(
                                      data?.notification_id
                                    );
                                    if (data.is_workorder) {
                                      navigate(
                                        `/staff/staffworkdetails/${data?.notification_type?.workorder_id}`
                                      );
                                    } else if (data.is_lease) {
                                      navigate(
                                        `/staff/staffpropertydetail/${data?.rental_id}`
                                      );
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
                {/* Other sidebar content goes here */}
              </div>
            </Drawer>
          </Nav>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">

                  <span className="avatar avatar-sm rounded-circle">
                    {/* <img
                      alt="..."
                      src={require("../../assets/img/theme/team-4-800x800.jpg")}
                    /> */}

                    {`${accessType?.staffmember_name
                      ?.split(' ').map(word => word.charAt(0)).join('')}`}

                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {accessType?.staffmember_name}

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

export default StaffNavbar;
