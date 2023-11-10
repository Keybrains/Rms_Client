import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import AgentNavbar from "components/Navbars/AgentNavbar";
import AgentSidebar from "components/Sidebar/AgentSidebar";
import routes from "routes.js";


const Agent = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/agent") {
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
    <>
      <AgentSidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/agent/AgentdashBoard",
          imgSrc: require("../assets/img/brand/rms.jpeg"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AgentNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/agent/AgentdashBoard" replace />} />
        </Routes>
        <Container fluid>
          {/* <AdminFooter /> */}
        </Container>
      </div>
    </>
  );
};

export default Agent;
