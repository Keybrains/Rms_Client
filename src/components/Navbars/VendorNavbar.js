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
import NotificationsIcon from "@mui/icons-material/Notifications";
import { jwtDecode } from "jwt-decode";
import notify from '../../assets/img/icons/common/notify.svg';

const VendorNavbar = (props) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  let Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Vendor ID");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);

  const [selectedProp, setSelectedProp] = useState("Select");

  const handlePropertySelect = (property) => {
    setSelectedProp(property);
  };

  const [accessType, setAccessType] = useState(null);
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
    if (accessType?.vendor_id) {
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
            className="h4 mb-0 d-none d-lg-inline-block"
            to="/vendor/VendordashBoard"
            style={{ color: "rgba(82, 84, 89, 1)", fontFamily: "Manrope", fontSize: "18px", fontWeight: "400" }}
          >
            Hello {accessType?.vendor_name}, Welcome Back !
            {/* My {props.brandText} */}
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

          <Nav className="align-items-center d-none d-md-flex" navbar style={{
            backgroundColor: "rgba(54, 159, 255, 0.1)",
            borderRadius: "16px",
          }}>
            <UncontrolledDropdown nav>
              <DropdownToggle className="" nav>
                <Media className="align-items-center" style={{ gap: "15px" }}>
                  <Media className="ml-2 d-none d-lg-block" >
                    <span className="avatar avatar-sm " >
                      {/* <img
                      alt="..."
                      src={require("../../assets/img/theme/team-4-800x800.jpg")}
                    /> */}

                      {`${accessType?.vendor_name
                        ?.split(' ').map(word => word.charAt(0)).join('')}`}

                    </span>

                  </Media>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold" style={{ color: "#152B51" }}>
                      {accessType?.vendor_name}
                    </span>
                    <br />
                    <span style={{ color: "#152B51",fontSize:"14px" }}>Vendor</span>
                  </Media>
                  <span style={{ color: "#152B51" }} className="">

                    <i className="fa-solid fa-angle-down"></i>
                  </span>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow w-100" right>
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
