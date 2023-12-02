import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios"; // Import axios here
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
} from "reactstrap";
import { useEffect, useState } from "react";

const AgentNavbar = (props) => {
  let cookies = new Cookies();
  let cookie_id = cookies.get("Agent ID");
  //console.log(cookie_id);
  let Logout = () => {
    cookies.remove("token");
    cookies.remove("Agent ID");
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendorDetails, setVendorDetails] = useState({});
  const getVendorDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/addagent/agent_summary/${cookie_id}`
      );
      setVendorDetails(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getVendorDetails();
    //console.log(cookie_id);
  }, [cookie_id]);

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/agent/AgentdashBoard"
          >
            {props.brandText}
          </Link>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto"></Form>
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
                    <span className="mb-0 text-sm font-weight-bold">{vendorDetails.agent_name}</span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome</h6>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem
                  href="#rms"
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

export default AgentNavbar;
