import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
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
  Col
} from "reactstrap";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { makeStyles } from '@mui/styles';

const AdminNavbar = (props) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  let navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  const [notificationData, setNotificationData] = useState([]);
  //console.log("Rental Address", rental_adress);
  const notifyData = [];

  let cookies = new Cookies();
  let Logout = () => {
    cookies.remove("token");
    cookies.remove("Tenant ID");
    // localStorage.removeItem("name");
    // localStorage.removeItem("id");
    // navigate("/login");
  };
  const { workorder_id } = useParams();
  //console.log("workid:",workorder_id);
  const [vendorDetails, setVendorDetails] = useState({});
  const [rental_adress, setRentalAddress] = useState("");
  //console.log(rental_adress)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [selectedProp, setSelectedProp] = useState("Select");

  const handlePropertySelect = (property) => {
    setSelectedProp(property);
  };

  let cookie_id = cookies.get("Tenant ID");
  //console.log(cookie_id)

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    fetch(`${baseUrl}/notification/notification`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          const unreadNotifications = data.data.filter(notification => !notification.isAdminread);
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

  const navigateToDetails = (workorder_id) => {
    // Make a DELETE request to delete the notification
    axios.get(`${baseUrl}/notification/notification/${workorder_id}?role=admin `)
      .then((response) => {
        if (response.status === 200) {
          const updatedNotificationData = notificationData.map(notification => {
            if (notification.workorder_id === workorder_id) {
              return { ...notification, isAdminread: true };
            }
            return notification;
          });
          setNotificationData(updatedNotificationData);
          //console.log("updatedNotificationData", updatedNotificationData)
          setNotificationCount(updatedNotificationData.length);
          //console.log(`Notification with workorder_id ${workorder_id} marked as read.`);
          fetchNotification();

        } else {
          console.error(`Failed to delete notification with workorder_id ${workorder_id}.`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });


    // Continue with navigating to the details page
    navigate(`/admin/addworkorder/${workorder_id}`);
  };

  // useEffect(() =>{
  //   navigateToDetails();
  // },[workorder_id]);

  // const navigateToDetails = (workorder_id) => {
  //   // const propDetailsURL = `/admin/WorkOrderDetails/${tenantId}`;
  //   navigate(`/admin/workorderdetail/${workorder_id}`);
  //   //console.log(workorder_id);
  // };

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
            <FormGroup className="mb-0" onClick={toggleSidebar} style={{ cursor: 'pointer', position: 'relative' }}>
              <NotificationsIcon style={{ color: 'white', fontSize: '30px' }} />
              {notificationCount > 0 && (
                <div className="notification-circle" style={{ position: 'absolute', top: '-15px', right: '-20px', background: 'red', borderRadius: '50%', padding: '0.1px 8px' }}>
                  <span className="notification-count" style={{ color: 'white', fontSize: "13px" }}>{notificationCount}</span>
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
                <List style={{ width: '350px' }}>
                  <h2 style={{ color: 'blue', marginLeft: '15px' }}>
                    Notifications
                  </h2>
                  <Divider />
                  {notificationData.map((data) => {
                    const notificationTitle =
                      data.notification_title || 'No Title Available';
                    const notificationDetails =
                      data.notification_details || 'No Details Available';
                    const notificationTime = new Date(data.notification_time).toLocaleString();

                    return (
                      <div key={data._id}>
                        <ListItem

                          style={{ cursor: 'pointer' }}
                          onClick={() => handlePropertySelect(data)}
                        >
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
                                  style={{ textTransform: 'none', fontSize: '12px' }}
                                  onClick={() => navigateToDetails(data.workorder_id)}
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
                      src={require("../../assets/img/theme/team-4-800x800.jpg")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      Admin
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
                  to="/auth/login" onClick={() => {
                    Logout();
                  }} tag={Link} >

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

export default AdminNavbar;
