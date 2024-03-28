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
import notify from "../../assets/icons/notify.svg";

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

  let Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Tenant ID");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  let navigate = useNavigate();
  const [selectedProp, setSelectedProp] = useState("Select");

  const handlePropertySelect = (property) => {
    setSelectedProp(property);
  };

  //  Working
  const [tenantNotification, setTenantNotification] = useState([]);
  const tenantNotificationData = async () => {
    if (accessType?.tenant_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/notification/${accessType?.tenant_id}`
        );
        if (response.status === 200) {
          const data = response.data.data;
          setTenantNotification(data);
        } else {
          console.error("Response status is not 200");
        }
      } catch (error) {
        console.error("Error:", error);
      }
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
          to="/tenant/tenantdashboard"
          style={{
            color: "rgba(82, 84, 89, 1)",
            fontFamily: "Manrope",
            fontSize: "18px",
            fontWeight: "400",
          }}
        >
          Hello
          {accessType?.tenant_firstName + " " + accessType?.tenant_lastName},
          Welcome Back!
        </Link>
        <Form className="navbar-search navbar-search-dark form-inline mr-5 d-none d-md-flex ml-lg-auto">
          <FormGroup
            className="mb-0"
            onClick={toggleSidebar}
            style={{ cursor: "pointer", position: "relative" }}
          >
            {tenantNotification?.length === 0 ? (
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
                <Divider />
                <div >
                <h2 style={{ color: "#fff",borderTopLeftRadius:"7px",borderBottomLeftRadius:"10px", marginLeft: "15px", backgroundColor: "#152B51", borderRadius: "10px, 0px, 0px, 10px", fontFamily: "Poppins", fontWeight: "600",marginTop:"-9px",padding:"18px" ,marginLeft:"0",}}>
                  Notifications
                </h2>
                </div>
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
                      >
                        <ListItem onClick={() => handlePropertySelect(data)}>
                          <div>
                            <h4
                             style={{
                              color: "#152B51",
                             fontSize: "20px",
                             fontFamily: "Poppins",
                             fontWeight: "600",
                           }}>{notificationTitle}</h4>
                            <p                            
                            style={{
                              color: "#C2C3CF",
                              fontSize: "16px",
                              fontFamily: "Poppins",
                              fontWeight: "400",
                            }}>{notificationDetails}</p>
                            <Row>
                              <Col lg="8">
                                <p style={{
                                color: "#152B51",
                                fontSize: "14px",
                                fontFamily: "Poppins",
                                fontWeight: "500",
                              }}>{notificationTime}</p>
                              </Col>
                              <Col>
                                <Button
                                  variant="contained"
                                  // color="primary"
                                  style={{
                                    background: "#152B51",
                                    color: "white",
                                    textTransform: "none",
                                    fontSize: "12px",
                                    fontFamily: "Poppins",
                                    fontWeight: "500",
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
                                      } else {
                                        navigate(`/tenant/tenantFinancial`);
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

        <Nav
          className="align-items-center d-none d-md-flex"
          navbar
        >
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
                    backgroundColor: "rgba(21, 43, 81, 1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                >   
                  {`${accessType?.tenant_firstName
                    ?.slice(0, 1)
                    .toUpperCase()}${accessType?.tenant_lastName
                    ?.slice(0, 1)
                    .toUpperCase()}`}
                </span>
                <Media className="ml-3 d-none d-lg-flex flex-column mx-1">
                  <span
                    className="mb-0 font-weight-bold text-dark"
                    style={{
                      fontSize: "14px",
                      fontFamily: "Manrope",
                    }}
                  >
                    {accessType?.tenant_firstName} {accessType?.tenant_lastName}
                  </span>
                  <span
                    className="mb-0 font-weight-bold"
                    style={{
                      fontSize: "12px",
                      fontFamily: "Manrope",
                      color: "rgba(21, 43, 81, 1)",

                    }}
                  >
                    Tenant
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
                className="text-overflow m-0"
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
      </Navbar>
    </>
  );
};

export default TenantNavbar;
