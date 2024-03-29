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
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { jwtDecode } from "jwt-decode";
import notify from "../../assets/icons/notify.svg";

const AdminNavbar = (props) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  let navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  const [notificationData, setNotificationData] = useState([]);
  let Logout = () => {
    localStorage.removeItem("token");
  };
  const { admin } = useParams();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [selectedProp, setSelectedProp] = useState("Select");

  const handlePropertySelect = (property) => {
    setSelectedProp(property);
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
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  };

  const navigateToDetails = (workorder_id) => {
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
          setNotificationCount(updatedNotificationData.length);
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

    navigate(`/admin/addworkorder/${workorder_id}`);
  };

  const [accessType, setAccessType] = useState({});

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const [plan, setPlan] = useState("");
  const getPlan = async () => {
    if (accessType?.admin_id) {
      try {
        const res = await axios.get(
          `${baseUrl}/purchase/plan-purchase/${accessType?.admin_id}`
        );
        if (res.data.statusCode === 200) {
          setPlan(res.data.data);
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    getPlan();
  }, [accessType?.admin_id]);

  return (
    <>
      <Navbar
        className="navbar-top navbar-dark px-5"
        expand="md"
        id="navbar-main"
      >
        <Link
          className="h4 d-none d-lg-inline-block"
          to={"/" + admin + "/index"}
          style={{
            color: "rgba(82, 84, 89, 1)",
            fontFamily: "Manrope",
            fontSize: "18px",
            fontWeight: "400",
          }}
        >
          Hello {accessType?.first_name + " " + accessType?.last_name}, Welcome
          Back!
        </Link>
        <Form className="navbar-search navbar-search-dark form-inline mr-5 mt-3 d-none d-md-flex ml-lg-auto">
          <Row className="d-flex align-items-center">
            <div className="p-0 mx-5 mb-0">
              <Button
                color="primary"
                onClick={() =>
                  plan?.plan_detail?.plan_name &&
                  plan?.plan_detail?.plan_name !== "Free Plan"
                    ? navigate("/" + admin + "/Purchaseplandetail")
                    : navigate("/" + admin + "/Plans")
                }
                size="sm"
                style={{
                  background: "#152B51",
                  color: "#fff",
                  fontSize: "16px",
                  fontFamily: "Poppins",
                  fontWeight: "500",
                }}
                className="p-2"
              >
                {plan?.plan_detail?.plan_name &&
                plan?.plan_detail?.plan_name !== "Free Plan"
                  ? plan?.plan_detail?.plan_name
                  : "Buy Now"}
              </Button>
            </div>
            <FormGroup
              className="mb-1 mr-3"
              onClick={toggleSidebar}
              style={{ cursor: "pointer", position: "relative" }}
            >
              {notificationCount === 0 ? (
                <i className="far fa-bell" style={{ fontSize: "30px" }}></i>
              ) : (
                <img src={notify} width={30} height={30} />
              )}
            </FormGroup>
            <UncontrolledDropdown
              className="mb-0 ml-1 mr-0"
              style={{ border: "none", background: "none", boxShadow: "none" }}
            >
              <DropdownToggle
                style={{
                  border: "none",
                  background: "rgba(54, 159, 255, 0.1)",

                  boxShadow: "none",
                }}
              >
                <Media className="align-items-center">
                  <span
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "#152B51",
                      
                      color: "#fff",
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      fontWeight: "500",
                    }}
                  >
                    {`${accessType?.first_name
                      ?.slice(0, 1)
                      .toUpperCase()}${accessType?.last_name
                      ?.slice(0, 1)
                      .toUpperCase()}`}
                  </span>
                  <Media className="ml-3 d-none d-lg-block d-flex justify-content-start">
                    <span
                      className="mb-0 font-weight-bold text-dark"
                      style={{
                        fontSize: "14px",
                        fontFamily: "Manrope",
                      }}
                    >
                      {accessType.first_name} {accessType.last_name}
                    </span>
                    <br />
                    <span
                      className="mb-0 ml-0 font-weight-bold"
                      style={{
                        fontSize: "10px",
                        fontFamily: "Manrope",
                        color: "#152B51",
                      }}
                    >
                      Property Manager
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
              <DropdownMenu className="dropdown-menu-arrow" right>
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
                <DropdownItem
                  style={{
                    fontSize: "14px",
                    color: "#000",
                    marginLeft: "35px",
                  }}
                  className="text-overflow m-0"
                  onClick={() => navigate("/" + admin + "/user-profile")}
                >
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem
                  style={{
                    fontSize: "14px",
                    color: "#000",
                    marginLeft: "35px",
                  }}
                  className="text-overflow m-0"
                  onClick={() => navigate("/" + admin + "/settings")}
                >
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
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
          </Row>
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

        {/* <Nav
          className="align-items-end d-none d-md-flex"
          navbar
          style={{
            backgroundColor: "rgba(54, 159, 255, 0.1)",
            borderRadius: "16px",
          }}
        >
          <UncontrolledDropdown nav>
            <DropdownToggle className="py-2 px-4" nav>
              <Media className="align-items-center">
                <span
                  className="d-flex justify-content-center align-items-center p-1"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "rgba(82, 84, 89, 1)",
                    borderRadius: "12px",
                  }}
                >
                  {`${accessType?.first_name
                    ?.slice(0, 1)
                    .toUpperCase()}${accessType?.last_name
                    ?.slice(0, 1)
                    .toUpperCase()}`}
                </span>
                <Media className="ml-2 d-none d-lg-block mx-1">
                  <span
                    className="mb-0 font-weight-bold text-dark"
                    style={{
                      fontSize: "14px",
                      fontFamily: "Manrope",
                    }}
                  >
                    {accessType.first_name} {accessType.last_name}
                  </span>
                  <br />
                  <span
                    className="mb-0 font-weight-bold"
                    style={{
                      fontSize: "12px",
                      fontFamily: "Manrope",
                      color: "rgba(54, 159, 255, 1)",
                    }}
                  >
                    Admin
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
            <DropdownMenu className="dropdown-menu-arrow" right>
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
              <DropdownItem
                style={{
                  fontSize: "14px",
                  color: "#000",
                  marginLeft: "35px",
                }}
                className="text-overflow m-0"
                onClick={() => navigate("/" + admin + "/user-profile")}
              >
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
              <DropdownItem
                style={{
                  fontSize: "14px",
                  color: "#000",
                  marginLeft: "35px",
                }}
                className="text-overflow m-0"
                onClick={() => navigate("/" + admin + "/settings")}
              >
                <i className="ni ni-settings-gear-65" />
                <span>Settings</span>
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
        </Nav> */}
      </Navbar>
    </>
  );
};

export default AdminNavbar;
