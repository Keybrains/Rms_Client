// import VendorNavbar from "components/Navbars/VendorNavbar";
// import VendorSidebar from "components/Sidebar/VendorSidebar";
import StaffNavbar from "components/Navbars/StaffNavbar";
import StaffSidebar from "components/Sidebar/StaffSidebar";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import routes from "routes.js";

const Staff = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();

  const [isCollapse, setIsCollapse] = useState(window.innerWidth <= 768);
  const toggleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/staff") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <div style={{ backgroundColor: "#fff", height: "100%" }}>
      <StaffSidebar
        routes={routes}
        logo={{
          innerLink: "/staff/StaffdashBoard",
          imgSrc: require("../assets/icons/site-logo_saas.png"),
          imgSrc2: require("../assets/icons/site-logo-1 7.png"),
          imgAlt: "...",
        }}
        isCollapse={isCollapse}
        setIsCollapse={setIsCollapse}
        toggleCollapse={toggleCollapse}
      />
      <div
        className={!isCollapse ? `content` : `content-active`}
        ref={mainContent}
        style={{ height: "100vh" }}
      >
        <StaffNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route
            path="*"
            element={<Navigate to={`/staff/StaffdashBoard`} replace />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Staff;
