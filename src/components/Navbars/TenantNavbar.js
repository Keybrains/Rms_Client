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

const TenantNavbar = (props) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  let [loader, setLoader] = React.useState(true);

  let cookies = new Cookies();
  let Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Tenant ID");
  };
  const { id } = useParams();
  //console.log(id);
  const [vendorDetails, setVendorDetails] = useState({});
  const [rental_adress, setRentalAddress] = useState("");
  const [rental_units, setRentalUnit] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  let navigate = useNavigate();

  let cookie_id = localStorage.getItem("Tenant ID");
  //console.log(cookie_id)

  // const {vendor_name}= useParams();
  // const ENDPOINT = 'http://64.225.8.160:4001/notification/vendornotification/:vendor_name';
  const [notification, setNotification] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationData, setNotificationData] = useState([]);
  const [workData, setWorkData] = useState([]);
  const [rentalAddress, setRentalAddresses] = useState([]);
  const [rentalUnit, setRentalUnits] = useState([]);

  const [selectedProp, setSelectedProp] = useState("Select");

  const handlePropertySelect = (property) => {
    setSelectedProp(property);
  };

  //  Working
  const [tenantNotification, setTenantNotification] = useState([]);
  const tenantNotificationData = async (addresses, units) => {
    try {
      const response = await axios.get(
        `${baseUrl}/notification/tenant/${accessType?.tenant_id}`
      );
      if (response.status === 200) {
        const data = response.data.data;
        console.log('vaibhav', data)
        setTenantNotification(data);
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
    tenantNotificationData();
  }, [accessType?.tenant_id]);

  const readTenantNotification = async (notification_id) => {
    try {
      const response = await axios.put(
        `${baseUrl}/notification/tenant_notification/${notification_id}`
      );
      if (response.status === 200) {
        tenantNotificationData();
        // Process the data as needed
      } else {
        console.error("Response status is not 200");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log(accessType, "accessType")

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/tenant/tenantdashboard"
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
                  <h2 style={{ color: "#263238", marginLeft: "15px" }}>
                    Notifications
                  </h2>
                  <Divider />
                  {tenantNotification.map((data) => {
                    if (data.isTenantread) {
                      return null;
                    } else {
                      const notificationTitle =
                        data.notification_title || "No Title Available";
                      const notificationDetails =
                        data.notification_detail || "No Details Available";
                      const notificationTime = new Date(
                        data.createdAt
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
                                    color="primary"
                                    style={{
                                      background: "#263238",
                                      color: "white",
                                      textTransform: "none",
                                      fontSize: "12px",
                                    }}
                                    // onClick={() =>
                                    //   navigateToDetails(data.notification_type)
                                    // }
                                    onClick={() => {
                                      {
                                        readTenantNotification(
                                          data.notification_id
                                        );

                                        if (data.is_workorder) {
                                          navigate(
                                            `/tenant/Tworkorderdetail/${data.notification_type.workOrder_id}`
                                          );
                                        } else if (data.is_lease) {
                                          navigate(
                                            `/tenant/tenantpropertydetail/${data.notification_type.lease_id}`
                                          );
                                        }
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
                    }
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
                     
                      {`${accessType?.tenant_firstName
                        ?.slice(0, 1)
                        .toUpperCase()}${accessType?.tenant_lastName
                        ?.slice(0, 1)
                        .toUpperCase()}`}
                    
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                    {accessType?.tenant_firstName} {accessType?.tenant_lastName}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome</h6>
                </DropdownItem>
                {/* <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span> 
                </DropdownItem>*/}
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

export default TenantNavbar;
