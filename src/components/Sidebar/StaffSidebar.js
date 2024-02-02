import React, { useEffect, useState } from 'react';
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { PropTypes } from "prop-types";
import Cookies from "universal-cookie";
import { useNavigate,  useParams } from "react-router-dom";
import axios from "axios";
import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

const StaffSidebar = (props) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [collapseOpen, setCollapseOpen] = useState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationData, setNotificationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendorDetails, setVendorDetails] = useState({});
  const [staffmember_name, setVendorname] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []); 

  const notificationIconStyle = {
    display: isMobile ? 'block' : 'none', 
    cursor: 'pointer',
    position: 'relative',
    marginRight: '-60px'
  };


  
  let navigate = useNavigate();

  let cookies = new Cookies();
  let Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Staff ID");
    // localStorage.removeItem("name");
    // localStorage.removeItem("id");
    // navigate("/login");
  };

  const { id } = useParams();
  //console.log(id);
  let cookie_id = localStorage.getItem("Staff ID");
  //console.log(cookie_id)

  const toggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };

  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const handlePropertySelect = (property) => {
    setSelectedProp(property);
  };

  const [selectedProp, setSelectedProp] = useState("Select");
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getVendorDetails = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/addstaffmember/staffmember_summary/${cookie_id}`
      );
      //console.log(response.data.data)
      setVendorDetails(response.data.data);
      setVendorname(response.data.data.staffmember_name)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      setError(error);
      setLoading(false);
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
          const unreadNotifications = data.data.filter(notification => !notification.isStaffread);
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


  
  const navigateToDetails = (workorder_id) => {
    axios.get(`${baseUrl}/notification/notification/${workorder_id}?role=staff`)
      .then((response) => {
          if (response.status === 200) {
            const updatedNotificationData = notificationData.map(notification => {
              if (notification.workorder_id === workorder_id) {
                return { ...notification, isStaffread: true };
              }
              return notification;
            });
            setNotificationData(updatedNotificationData);
            setNotificationCount(updatedNotificationData.length);
            fetchNotification();
           //console.log(`Notification with workorder_id ${workorder_id} deleted successfully.`);
        } else {
          console.error(`Failed to mark notification with workorder_id ${workorder_id} as read.`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  
    // Continue with navigating to the details page
    navigate(`/staff/staffworkdetails/${workorder_id}`);
  };

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    const filteredRoutes = routes.filter(
      (prop) => prop.path === "/StaffdashBoard" || prop.path === "/staffprofile" || prop.path === "/staffproperty" || prop.path === "/staffworktable"
    );
    return filteredRoutes.map((prop, key) => {
      return (
        <NavItem key={key}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
          >
            <i className={prop.icon} />
            {prop.name}
          </NavLink>
        </NavItem>
      );
    });
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}

          <FormGroup className="mb-0" style={notificationIconStyle} onClick={toggleSidebar}>
             <NotificationsIcon style={{color:'black',fontSize:'30px'}}/>
              {notificationCount > 0 && (
              <div className="notification-circle" style={{position: 'absolute',top: '-15px',right: '-20px',background: 'red',borderRadius: '50%',padding: '0.1px 8px'}}>
                <span className="notification-count" style={{color:'white',fontSize:"13px"}}>{notificationCount}</span>
              </div>
               )}
          </FormGroup>

          <Nav className="align-items-center d-none d-md-flex" navbar>
            
            <Drawer anchor="right" open={isSidebarOpen} onClose={toggleSidebar}>
              <div
                role="presentation"
                onClick={toggleSidebar}
                onKeyDown={toggleSidebar}
              >
                <List style={{ width: '250px' }}>
                  <h2 style={{color:'#033E3E',marginLeft:'15px'}}>
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
                             
                              style={{ background:'#033E3E',color:'white',textTransform: 'none', fontSize: '12px' }}
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
                  })}
                  
                </List>
                
                <Divider />
                
              </div>
            </Drawer>

          </Nav>

        {/* User */}
        <Nav className="align-items-center d-md-none">
          {/* <UncontrolledDropdown nav>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-bell-55" />
            </DropdownToggle>
            <DropdownMenu
              aria-labelledby="navbar-default_dropdown_1"
              className="dropdown-menu-arrow"
              right
            >
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Another action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Something else here</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> */}
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={require("../../assets/img/theme/team-4-800x800.jpg")}
                  />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>
              {/* <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem> */}
              {/* <DropdownItem to="/admin/user-profile" tag={Link}>
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
              </DropdownItem> */}
              <DropdownItem divider />
              <DropdownItem
              //  href="#rms" 
              to="/auth/login"  
              onClick={() => {
              Logout();
            }} tag={Link} >
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}

              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          {/* <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="search"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <span className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form> */}
          {/* Navigation */}
          <Nav navbar>{createLinks(routes)}</Nav>
          {/* <UncontrolledDropdown nav>
            <DropdownToggle nav caret>
              <i className="ni ni-pin-3 text-orange" /> Rentals
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem to="/admin/propertiesTable" tag={Link}>
                Properties
              </DropdownItem>
              <DropdownItem to="/admin/RentRoll" tag={Link}>
                Rent Roll
              </DropdownItem>
              <DropdownItem to="/admin/TenantsTable" tag={Link}>
                Tenants
              </DropdownItem>
              <DropdownItem to="/admin/RentalownerTable" tag={Link}>
                Rental Owners
              </DropdownItem>
              <DropdownItem to="/admin/OutstandingBalance" tag={Link}>
                Outstanding Balances
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> */}
          
          {/* <Nav navbar>
          <UncontrolledDropdown nav>
            <DropdownToggle nav caret>
              <i className="ni ni-pin-3 text-orange" /> Leasing
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem to="/admin/Listings" tag={Link} >
                Listings
              </DropdownItem>
              <DropdownItem to="/admin/Applicants" tag={Link} >
                Applicants
              </DropdownItem>
              <DropdownItem >
                Draft Leases
              </DropdownItem>
              <DropdownItem >
                Lease Renewals
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          </Nav> */}
            
          {/* Divider */}
          {/* <hr className="my-3" /> */}
          {/* Heading */}
          {/* <h6 className="navbar-heading text-muted">Documentation</h6> */}
          {/* Navigation */}
          {/* <Nav className="mb-md-3" navbar>
            <NavItem>
              <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/overview?ref=adr-admin-sidebar">
                <i className="ni ni-spaceship" />
                Getting started
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/colors?ref=adr-admin-sidebar">
                <i className="ni ni-palette" />
                Foundation
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/alerts?ref=adr-admin-sidebar">
                <i className="ni ni-ui-04" />
                Components
              </NavLink>
            </NavItem>
          </Nav> */}
          {/* <Nav className="mb-md-3" navbar>
            <NavItem className="active-pro active">
              <NavLink href="https://www.creative-tim.com/product/argon-dashboard-pro-react?ref=adr-admin-sidebar">
                <i className="ni ni-spaceship" />
                Upgrade to PRO
              </NavLink>
            </NavItem>
          </Nav> */}
        </Collapse>
      </Container>
    </Navbar>
  );
};

StaffSidebar.defaultProps = {
  routes: [{}],
};

StaffSidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default StaffSidebar;
