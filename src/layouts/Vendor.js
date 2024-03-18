import VendorNavbar from "components/Navbars/VendorNavbar";
import VendorSidebar from "components/Sidebar/VendorSidebar";
import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";

import { Container } from "reactstrap";

// import AdminNavbar from "components/Navbars/AdminNavbar.js";
// import AdminFooter from "components/Footers/AdminFooter.js";
// import TenantSidebar from "components/Sidebar/TenantSidebar";
// import TenantNavbar from "components/Navbars/TenantNavbar";

import routes from "routes.js";

const Vendor = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/vendor") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
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
    <>
      <VendorSidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/vendor/VendordashBoard",
          imgSrc: require("../assets/img/icons/common/site-logo-1 5.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <VendorNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/vendor/VendordashBoard" replace />} />
        </Routes>
        <Container fluid>
          {/* <AdminFooter /> */}
        </Container>
      </div>
    </>
  );
};

export default Vendor;
