import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import {
  Link,
  NavLink as NavLinkRRD,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";
import routes from "routes";
import "./style.css";
import Key from "../../assets/icons/AdminSidebar/Key.svg";
import DownArrow from "../../assets/icons/AdminSidebar/DownArrow.svg";
import Thumb from "../../assets/icons/AdminSidebar/Thumb.svg";
import Maintenance from "../../assets/icons/AdminSidebar/Maintenance.svg";

const Sidebar = ({ logo, isCollapse, toggleCollapse }) => {
  const location = useLocation();
  const { admin } = useParams();
  const createLinks = () => {
    const filteredRoutes = routes.filter(
      (prop) =>
        (prop.name === "Dashboard" ||
          prop.name === "Property Type" ||
          prop.name === "Staff Member") &&
        prop.layout === "/admin"
    );
    return filteredRoutes.map((prop, key) => {
      const path = prop.layout === "/" + admin ? "/" + admin : "/" + admin;
      const isActive = location.pathname === path + prop.path;
      return (
        <NavItem key={key}>
          <NavLink
            to={path + prop.path}
            tag={NavLinkRRD}
            style={{ justifyContent: isCollapse && "center" }}
            className="d-flex align-items-center"
          >
            <span
              style={{
                marginRight: !isCollapse && "20px",
                marginLeft: !isCollapse && "10px",
              }}
            >
              {isActive ? (
                <img src={prop.icon2} width={20} />
              ) : (
                <img src={prop.icon} width={20} />
              )}
            </span>
            {!isCollapse && <>{prop.name}</>}
          </NavLink>
        </NavItem>
      );
    });
  };

  const [isRentalDropdownOpen, setIsRentalDropdownOpen] = useState(false);
  const toggleRentalDropdown = () => {
    setIsRentalDropdownOpen(!isRentalDropdownOpen);
  };

  const filteredRentalRoutes = routes.filter(
    (prop) =>
      (prop.name === "Property Table" ||
        prop.name === "Rentalowner Table" ||
        prop.name === "Tenants Table") &&
      prop.layout === "/admin"
  );

  const [isLeasingDropdownOpen, setIsLeasingDropdownOpen] = useState(false);
  const toggleLeasingDropdown = () => {
    setIsLeasingDropdownOpen(!isLeasingDropdownOpen);
  };

  const filteredLeasingRoutes = routes.filter(
    (prop) =>
      (prop.name === "Rent Roll" || prop.name === "Applicants") &&
      prop.layout === "/admin"
  );

  const [isMaintenanceDropdownOpen, setIsMaintenanceDropdownOpen] =
    useState(false);
  const toggleMaintenanceDropdown = () => {
    setIsMaintenanceDropdownOpen(!isMaintenanceDropdownOpen);
  };

  const filteredMaintenanceRoutes = routes.filter(
    (prop) =>
      (prop.name === "Vendor" || prop.name === "Work Order") &&
      prop.layout === "/admin"
  );

  return (
    <>
      <div className={!isCollapse ? "sidebar" : "sidebar-active"}>
        <Nav vertical>
          <Link
            to="/admin/index"
            style={{
              marginTop: "40px",
              marginBottom: "30px",
              justifyContent: isCollapse && "center",
              padding: "15px",
            }}
          >
            {isCollapse ? (
              <img src={logo.imgSrc2} width={60} />
            ) : (
              <img src={logo.imgSrc} width={250} />
            )}
          </Link>
          <div>
            {createLinks()}
            <div
              style={{
                justifyContent: isCollapse && "center",
                cursor: "pointer",
              }}
              className="d-flex align-items-center nav-link"
            >
              <Dropdown
                isOpen={isRentalDropdownOpen}
                toggle={toggleRentalDropdown}
              >
                <DropdownToggle
                  tag="span"
                  data-toggle="dropdown"
                  aria-expanded={isRentalDropdownOpen}
                  style={{
                    display: "flex",
                    justifyContent: isCollapse && "center",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: "500",
                    minWidth: !isCollapse ? "270px" : "64px",
                  }}
                >
                  <Row className="w-100 d-flex justify-content-between">
                    <Col>
                      <span
                        style={{
                          marginRight: !isCollapse && "20px",
                          marginLeft: !isCollapse && "10px",
                          fontSize: "16px",
                          fontWeight: "400",
                        }}
                      >
                        <img src={Key} width={20} alt="Key icon" />
                      </span>
                      {!isCollapse && <>{"Rental"}</>}
                    </Col>
                    <Col lg="1" className="d-flex justify-content-end">
                      {!isCollapse && (
                        <img src={DownArrow} width={20} alt="Down arrow icon" />
                      )}
                    </Col>
                  </Row>
                </DropdownToggle>

                <DropdownMenu>
                  {filteredRentalRoutes.map((prop, key) => {
                    const path =
                      prop.layout === "/" + admin ? "/" + admin : "/" + admin;
                    const isActive = location.pathname === path + prop.path;
                    return (
                      <DropdownItem header className="text-dark" key={key}>
                        <NavItem onClick={() => setIsRentalDropdownOpen(false)}>
                          <NavLink
                            to={path + prop.path}
                            tag={NavLinkRRD}
                            style={{ justifyContent: isCollapse && "center" }}
                            className="d-flex my-nav-links align-items-center"
                          >
                            {prop.name?.split(" ")[0]}
                          </NavLink>
                        </NavItem>
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div
              style={{
                justifyContent: isCollapse && "center",
                cursor: "pointer",
              }}
              className="d-flex align-items-center nav-link"
            >
              <Dropdown
                isOpen={isLeasingDropdownOpen}
                toggle={toggleLeasingDropdown}
              >
                <DropdownToggle
                  tag="span"
                  data-toggle="dropdown"
                  aria-expanded={isLeasingDropdownOpen}
                  style={{
                    display: "flex",
                    justifyContent: isCollapse && "center",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: "500",
                    minWidth: !isCollapse ? "270px" : "64px",
                  }}
                >
                  <Row className="w-100 d-flex justify-content-between">
                    <Col>
                      <span
                        style={{
                          marginRight: !isCollapse && "20px",
                          marginLeft: !isCollapse && "10px",
                          fontSize: "16px",
                          fontWeight: "400",
                        }}
                      >
                        <img src={Thumb} width={20} alt="Thumb icon" />
                      </span>
                      {!isCollapse && <>{"Leasing"}</>}
                    </Col>
                    <Col lg="1" className="d-flex justify-content-end">
                      {!isCollapse && (
                        <img src={DownArrow} width={20} alt="Down arrow icon" />
                      )}
                    </Col>
                  </Row>
                </DropdownToggle>

                <DropdownMenu>
                  {filteredLeasingRoutes.map((prop, key) => {
                    const path =
                      prop.layout === "/" + admin ? "/" + admin : "/" + admin;
                    const isActive = location.pathname === path + prop.path;
                    return (
                      <DropdownItem header className="text-dark" key={key}>
                        <NavItem
                          onClick={() => setIsLeasingDropdownOpen(false)}
                        >
                          <NavLink
                            to={path + prop.path}
                            tag={NavLinkRRD}
                            style={{ justifyContent: isCollapse && "center" }}
                            className="d-flex my-nav-links align-items-center"
                          >
                            {prop.name}
                          </NavLink>
                        </NavItem>
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div
              style={{
                justifyContent: isCollapse && "center",
                cursor: "pointer",
              }}
              className="d-flex align-items-center nav-link"
            >
              <Dropdown
                isOpen={isMaintenanceDropdownOpen}
                toggle={toggleMaintenanceDropdown}
              >
                <DropdownToggle
                  tag="span"
                  data-toggle="dropdown"
                  aria-expanded={isMaintenanceDropdownOpen}
                  style={{
                    display: "flex",
                    justifyContent: isCollapse && "center",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: "500",
                    minWidth: !isCollapse ? "270px" : "64px",
                  }}
                >
                  <Row className="w-100 d-flex justify-content-between">
                    <Col>
                      <span
                        style={{
                          marginRight: !isCollapse && "20px",
                          marginLeft: !isCollapse && "10px",
                          fontSize: "16px",
                          fontWeight: "400",
                        }}
                      >
                        <img
                          src={Maintenance}
                          width={20}
                          alt="Maintenance icon"
                        />
                      </span>
                      {!isCollapse && <>{"Maintenance"}</>}
                    </Col>
                    <Col lg="1" className="d-flex justify-content-end">
                      {!isCollapse && (
                        <img src={DownArrow} width={20} alt="Down arrow icon" />
                      )}
                    </Col>
                  </Row>
                </DropdownToggle>

                <DropdownMenu>
                  {filteredMaintenanceRoutes.map((prop, key) => {
                    const path =
                      prop.layout === "/" + admin ? "/" + admin : "/" + admin;
                    const isActive = location.pathname === path + prop.path;
                    return (
                      <DropdownItem header className="text-dark" key={key}>
                        <NavItem
                          onClick={() => setIsMaintenanceDropdownOpen(false)}
                        >
                          <NavLink
                            to={path + prop.path}
                            tag={NavLinkRRD}
                            style={{ justifyContent: isCollapse && "center" }}
                            className="d-flex my-nav-links align-items-center"
                          >
                            {prop.name}
                          </NavLink>
                        </NavItem>
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </Nav>
        <span
          className={isCollapse ? "collapse-btn-active" : "collapse-btn"}
          onClick={(e) => {
            toggleCollapse();
          }}
        >
          {isCollapse ? (
            <FontAwesomeIcon icon={faArrowRight} />
          ) : (
            <FontAwesomeIcon icon={faArrowLeft} />
          )}
        </span>
      </div>
    </>
  );
};

export default Sidebar;
