import React, { useEffect, useState } from "react";
import { NavLink as NavLinkRRD, Link, useParams } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { PropTypes } from "prop-types";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Drawer from "@mui/material/Drawer";
// import Button from '@mui/material/Button';
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
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

const SuperAdminSidebar = (props) => {
  const { admin } = useParams();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationData, setNotificationData] = useState([]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const notificationIconStyle = {
    display: isMobile ? "block" : "none",
    cursor: "pointer",
    position: "relative",
    marginRight: "-60px",
  };

  let navigate = useNavigate();
  let cookies = new Cookies();
  let Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Tenant ID");
    // localStorage.removeItem("name");
    // localStorage.removeItem("id");
    // navigate("/login");
  };

  const [collapseOpen, setCollapseOpen] = useState(false);

  const toggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  // // toggles collapse between opened and closed (true/false)
  // const toggleCollapse = () => {
  //   setCollapseOpen((data) => !data);
  // };

  const handlePropertySelect = (property) => {
    setSelectedProp(property);
  };

  const [selectedProp, setSelectedProp] = useState("Select");
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    fetch(`${baseUrl}/notification/notification`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          const unreadNotifications = data.data.filter(
            (notification) => !notification.isAdminread
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

  const navigateToDetails = (workorder_id) => {
    // Make a DELETE request to delete the notification
    axios
      .get(`${baseUrl}/notification/notification/${workorder_id}?role=admin `)
      .then((response) => {
        if (response.status === 200) {
          const updatedNotificationData = notificationData.map(
            (notification) => {
              if (notification.workorder_id === workorder_id) {
                return { ...notification, isAdminread: true };
              }
              return notification;
            }
          );
          setNotificationData(updatedNotificationData);
          //console.log("updatedNotificationData", updatedNotificationData)
          setNotificationCount(updatedNotificationData.length);
          //console.log(`Notification with workorder_id ${workorder_id} marked as read.`);
          fetchNotification();
        } else {
          console.error(
            `Failed to delete notification with workorder_id ${workorder_id}.`
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Continue with navigating to the details pagenavigate(`/admin/addworkorder/${id}`);
    navigate(`/${admin}/addworkorder/${workorder_id}`);
  };
  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    const filteredRoutes = routes.filter(
      (prop) =>
        (
          prop.name === "Plans" ||
          prop.path === "/superadmin-dashboard" ||
          prop.name === "Admin" ||
          prop.name === "Staff-Member") &&
        prop.layout === "/superadmin"
      // prop.name === "Add Agent"
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
        {/* User */}

        <FormGroup
          className="mb-0"
          style={notificationIconStyle}
          onClick={toggleSidebar}
        >
          <NotificationsIcon style={{ color: "black", fontSize: "30px" }} />
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

        <Nav className="align-items-center d-none d-md-flex" navbar>
          <Drawer anchor="right" open={isSidebarOpen} onClose={toggleSidebar}>
            <div
              role="presentation"
              onClick={toggleSidebar}
              onKeyDown={toggleSidebar}
            >
              <List style={{ width: "250px" }}>
                <h2 style={{ color: "blue", marginLeft: "15px" }}>
                  Notifications
                </h2>
                <Divider />
                {notificationData.map((data) => {
                  const notificationTitle =
                    data.notification_title || "No Title Available";
                  const notificationDetails =
                    data.notification_details || "No Details Available";
                  const notificationTime = new Date(
                    data.notification_time
                  ).toLocaleString();

                  return (
                    <div key={data._id}>
                      <ListItem
                        style={{ cursor: "pointer" }}
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
                                style={{
                                  textTransform: "none",
                                  fontSize: "12px",
                                }}
                                onClick={() =>
                                  navigateToDetails(data.workorder_id)
                                }
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
          <Nav navbar>{createLinks(routes)}</Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

SuperAdminSidebar.defaultProps = {
  routes: [{}],
};

SuperAdminSidebar.propTypes = {
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

export default SuperAdminSidebar;
