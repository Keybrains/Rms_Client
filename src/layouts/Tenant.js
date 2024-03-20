import React, { useEffect, useRef, useState } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import routes from "routes.js";
import TenantSidebar from "components/Sidebar/TenantSidebar";
import TenantNavbar from "components/Navbars/TenantNavbar";

const Tenant = (props) => {
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
      if (prop.layout === "/tenant") {
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
      <TenantSidebar
        routes={routes}
        logo={{
          innerLink: "/tenant/tenantdashboard",
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
      >
        <TenantNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to={`/tenant/tenantdashboard`} replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Tenant;
