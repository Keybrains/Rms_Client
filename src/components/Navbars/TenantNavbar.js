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


const TenantNavbar = (props) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  let [loader, setLoader] = React.useState(true);

  let cookies = new Cookies();
  let Logout = () => {
    cookies.remove("token");
    cookies.remove("Tenant ID");
  };
  const { id } = useParams();
  //console.log(id);
  const [vendorDetails, setVendorDetails] = useState({});
  const [rental_adress, setRentalAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  let navigate = useNavigate();

  let cookie_id = cookies.get("Tenant ID");
  //console.log(cookie_id)
  
  const getVendorDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/tenant/tenant_summary/${cookie_id}`);
      const entries = response.data.data.entries;
  
      if (entries.length > 0) {
        const rentalAddresses = entries.map(entry => entry.rental_adress).join('-');
        ////console.log(rentalAddresses, "mansi");
        setVendorDetails(response.data.data);
        getRentalData(rentalAddresses);
        //getVendorDetails(rentalAddresses);
      } else {
        console.error("No rental addresses found.");
      }
  
      setLoader(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setLoader(false);
    }
  };

  useEffect(() => {
    getVendorDetails();
    //console.log(id);
  }, [id]);

// const {vendor_name}= useParams();
// const ENDPOINT = 'http://64.225.8.160:4001/notification/vendornotification/:vendor_name';
const [notification, setNotification] = useState('');
const [notificationCount, setNotificationCount] = useState(0);
const [notificationData, setNotificationData] = useState([]);
const [workData, setWorkData] = useState([]);
const [rentalAddress, setRentalAddresses] = useState([]);

const notifyData = [];

const [selectedProp, setSelectedProp] = useState("Select");

const handlePropertySelect = (property) => {
  setSelectedProp(property);
};

const getRentalData = async (addresses) => {
  try {
    const response = await axios.get(`${baseUrl}/notification/tenantnotification/tenant/${addresses}`);
    //console.log(response, "abc");

    if (Array.isArray(response.data.data)) {
      // Filter the notifications with isTenantread set to false
      const unreadNotifications = response.data.data.filter(notification => !notification.isTenantread);

      // Update the state with the filtered unread notifications
      setWorkData((prevData) => [...prevData, ...unreadNotifications]);
      //console.log("unreadNotifications", unreadNotifications)
      setNotificationData((prevNotificationData) => [...prevNotificationData, ...response.data.data]);
      setNotificationCount(unreadNotifications.length);
    } else if (typeof response.data.data === 'object') {
      setWorkData((prevData) => [...prevData, response.data.data]);
      setNotificationData((prevNotificationData) => [...prevNotificationData, response.data.data]);
    } else {
      console.error("Response data is not an array or object:", response.data.data);
    }
  } catch (error) {
    console.error("Error fetching work order data:", error);
  }
};


React.useEffect(() => {
  if (rentalAddress && rentalAddress.length > 0) {
    setLoader(true);
  }
}, [rentalAddress]);

useEffect(() => {
  fetchNotification();
}, [rental_adress]);  

const fetchNotification = async () => {
  // Fetch notification data when rental_adress changes
 
    fetch(`${baseUrl}/notification/tenantnotification/tenant/${rental_adress}`)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
         
        } else {
          throw new Error('Response status is not 200');
        }
      })
      .then((data) => {
        const unreadNotifications = notificationData.filter(notification => !notification.isTenantread);
        setNotificationData(unreadNotifications);
        //console.log("Notification",data.data)
        
        setNotificationCount(unreadNotifications.length)
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error, display a message to the user, or take other appropriate action.
      });
  
};

const unreadNotificationCount = notificationData.filter(notification => !notification.isTenantread).length;

const navigateToDetails = (workorder_id) => {
  // Make a DELETE request to delete the notification
  axios.get(`${baseUrl}/notification/notification/${workorder_id}?role=tenant`)
      .then((response) => {
        if (response.status === 200) {
          const updatedNotificationData = notificationData.map(notification => {
            if (notification.workorder_id === workorder_id) {
              return { ...notification, isTenantread: true };
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
  navigate(`/tenant/tworkorderdetail/${workorder_id}`);
};

// const navigateToDetails = (workorder_id) => {
//   // const propDetailsURL = `/admin/WorkOrderDetails/${tenantId}`;
//   navigate(`/tenant/tworkorderdetail/${workorder_id}`);
//   //console.log(workorder_id);
// };


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
            <FormGroup className="mb-0" onClick={toggleSidebar} style={{ cursor: 'pointer',position: 'relative' }}>
              <NotificationsIcon style={{color:'white',fontSize:'30px'}}/>
              {unreadNotificationCount > 0 && (
              <div className="notification-circle" style={{position: 'absolute',top: '-15px',right: '-20px',background: 'red',borderRadius: '50%',padding: '0.1px 8px'}}>
                <span className="notification-count" style={{color:'white',fontSize:"13px"}}>{unreadNotificationCount}</span>
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
                  <h2 style={{color:'#3B2F2F',marginLeft:'15px'}}>
                    Notifications
                  </h2>
                  <Divider />
                  {notificationData.map((data) => {
                    if(data.isTenantread){
                      return null
                    }
                    else{   
                      const notificationTitle =
                      data.notification_title || 'No Title Available';
                      const notificationDetails =
                      data.notification_details || 'No Details Available';
                      const notificationTime = new Date(data.notification_time).toLocaleString(); 

                    return (
                      <div key={data._id}>
                      <ListItem
                       
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
                              style={{background:'#3B2F2F',color:'white',textTransform: 'none', fontSize: '12px' }}
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
                      <Divider/>
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
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/profile-cover.jpg")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                    {vendorDetails.tenant_firstName} { vendorDetails.tenant_lastName }
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
                <DropdownItem href="#rms" to="/auth/login"  onClick={() => {
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

export default TenantNavbar;
