
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";


import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import PropertyType from "views/source/PropertyType";
import AddPropertyType from "views/source/AddPropertyType";
import Tenant from "layouts/Tenant";
import Agent from "layouts/Agent";
import Staff from "layouts/Staff";
import Vendor from "layouts/Vendor";
import Trial from "layouts/Trial";
// import SumProperties from "views/source/SumProperties";=


// ==========================  Super Admin =================================================== 
import SuperAdmin from "../src/components/superadmin/layouts/SuperAdmin"
import NotFound from "views/source/404NotFound";
import AuthCheckAdmin from "views/source/AuthCheckAdmin";

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/:admin/*" element={<AdminLayout />} />
      <Route path="/" element={<Navigate to="/authentication" replace />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/tenant/*" element={<Tenant />} />
      <Route path="/agent/*" element={<Agent/>} />
      <Route path="/staff/*" element={<Staff/>} />
      <Route path="/vendor/*" element={<Vendor/>} />
      <Route path="/trial/*" element={<Trial/>} />
      {/* <Route path="/" exact component={PropertyType} /> */}
      <Route path="/AddPropertyType" exact component={AddPropertyType} />
      {/* <Route path="/SumProperties/:id" exact component={SumProperties} /> */}

      {/* ==========================  Super Admin =================================================== */}
      <Route path="/superadmin/*" element={<SuperAdmin />} />
      <Route path="/:admin/404" element={<NotFound />} />
      <Route path="/authentication" element={<AuthCheckAdmin />} />

    </Routes> 
  </BrowserRouter>
);


