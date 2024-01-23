import Index from "views/Index.js";
import Profile from "views/source/Profile.js";
import Rentals from "views/source/Rentals.js";
import PropertiesTable from "views/source/PropertiesTable";
import Leaseing from "views/source/Leaseing.js";
import TenantsTable from "views/source/TenantsTable.js";
import PropertyType from "views/source/PropertyType";
import AddPropertyType from "views/source/AddPropertyType";
import AddStaffMember from "views/source/AddStaffMember";
import StaffMember from "views/source/StaffMember";
import Rentalowner from "views/source/Rentalowner";
import Login from "views/source/Login";
import RentalownerTable from "views/source/RentalownerTable";
import Listings from "views/source/Listings";
import Applicants from "views/source/Applicants";
import RentRoll from "views/source/RentRoll";
// import SumProperties from "views/source/SumProperties";
import OutstandingBalance from "views/source/OutstandingBalance";
import TenantDetailPage from "views/source/TenantDetailPage";
import RentRollDetail from "views/source/RentRollDetail";
import RentalOwnerDetail from "views/source/RentalOwnerDetail";
import OutstandDetails from "views/source/OutstandDetails";
import PropDetails from "views/source/PropDetails";
import RentRollLeaseing from "views/source/RentRollLeaseing";
import TenantDashBoard from "views/source/TenantDashBoard";
import TenantProfile from "views/source/TenantProfile";
import TenantProperty from "views/source/TenantProperty";
import AddAgent from "views/source/AddAgent";
import Agent from "views/source/Agent";
import AgentdashBoard from "views/source/AgentdashBoard";
import StaffDashBoard from "views/source/StaffDashBoard";
import VendorDashBoard from "views/source/VendorDashBoard";
import VendorProfile from "views/source/VendorProfile";
import VenorWorkOrder from "views/source/VenorWorkOrder";
import TenantWork from "views/source/TenantWork";
import TAddWork from "views/source/TAddWork";
import Workorder from "views/source/Workorder";
import AddWorkorder from "views/source/AddWorkorder";
import StaffProfile from "views/source/StaffProfile";
import AgentProfile from "views/source/AgentProfile";
import VendorWorkTable from "views/source/VendorWorkTable";
import StaffWorkTable from "views/source/StaffWorkTable";
import StaffWorkOrder from "views/source/StaffWorkorder";
import Vendor from "views/source/Vendor";
import AddVendor from "views/source/AddVendor";
import GeneralLedger from "views/source/GeneralLedger";
import TWorkOrderDetails from "views/source/Tworkorderdetail";
import AddGeneralLedger from "views/source/AddGeneralLedger";
import WorkOrderDetails from "views/source/WorkOrderDetails";
import VendorWorkDetail from "views/source/VendorWorkDetail";
import StaffWorkDetails from "views/source/StaffWorkDetails";
import VendorAddWork from "views/source/VendorAddWork";
import ApplicantSummary from "views/source/ApplicantSummary";
import TenantPropertyDetail from "views/source/TenantPropertyDetail";
import Payment from "views/source/Payment";
import AddPayment from "views/source/AddPayment";
import AddCharge from "views/source/AddCharge";
import TenantFinancial from "views/source/TenantFinancial";
import ApplicantForm from "views/source/ApplicantForm";
import Changepassword from "views/source/Changepassword";
import Forgetmail from "views/source/forgetmail";
import TrialLogin from "views/source/TrialLogin";
import DemoPayment from "views/source/DemoPayment";

// ==========================  Super Admin ===================================================

import SuperAdminDashBoard from "../src/components/superadmin/Dashboard/DashBoard";
import SuperAdminPlanList from "components/superadmin/Plan/PlanList";
import PropDetails2 from "views/source/PropDetails2";
import Rentals2 from "views/source/Rentals2";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/rentals",
    name: "Add Property",
    icon: "ni ni-pin-3 text-orange",
    component: <Rentals />,
    layout: "/admin",
  },
  {
    path: "/rentals2",
    name: "Add Property",
    icon: "ni ni-pin-3 text-orange",
    component: <Rentals2 />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/propertiesTable",
    name: "Property table",
    icon: "ni ni-bullet-list-67 text-red",
    component: <PropertiesTable />,
    layout: "/admin",
  },
  {
    path: "/TenantsTable",
    name: "Tenants",
    icon: "ni ni-bullet-list-67 text-red",
    component: <TenantsTable />,
    layout: "/admin",
  },
  {
    path: "/Leaseing",
    name: "Leaseing",
    icon: "ni ni-home-3 text-orange",
    component: <Leaseing />,
    layout: "/admin",
  },
  {
    path: "/Leaseing/:id",
    name: "Leaseing",
    icon: "ni ni-home-3 text-orange",
    component: <Leaseing />,
    layout: "/admin",
  },
  {
    path: "/PropertyType",
    name: "Add Property Type",
    icon: "ni ni-building",
    component: <PropertyType />,
    layout: "/admin",
  },
  {
    path: "/AddPropertyType",
    name: "Add Property",
    component: <AddPropertyType />,
    layout: "/admin",
  },
  {
    path: "/AddStaffMember",
    name: "Staff Member",
    component: <AddStaffMember />,
    layout: "/admin",
  },
  {
    path: "/StaffMember",
    name: "Add Staff Member",
    icon: "ni ni-badge text-green",
    component: <StaffMember />,
    layout: "/admin",
  },
  {
    path: "/Rentalowner",
    component: <Rentalowner />,
    layout: "/admin",
  },
  {
    path: "/Rentalowner/:id",

    component: <Rentalowner />,
    layout: "/admin",
  },
  {
    path: "/RentalownerTable",

    component: <RentalownerTable />,
    layout: "/admin",
  },

  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/changepassword",
    name: "Change Password",
    component: <Changepassword />,
    layout: "/auth",
  },
  {
    path: "/forgetpassword",
    name: "Forget Password",
    component: <Forgetmail />,
    layout: "/auth",
  },

  {
    path: "/RentRoll",
    name: "RentRoll",
    icon: "ni ni-home-3 text-orange",
    component: <RentRoll />,
    layout: "/admin",
  },
  {
    path: "/Payment",
    name: "Payment",
    icon: "ni ni-home-3 text-orange",
    component: <DemoPayment />,
    layout: "/admin",
  },

  {
    path: "/Listings",
    name: "listings",
    icon: "ni ni-home-3 text-orange",
    component: <Listings />,
    layout: "/admin",
  },
  {
    path: "/Applicants",
    name: "applicants",
    icon: "ni ni-home-3 text-orange",
    component: <Applicants />,
    layout: "/admin",
  },

  // {
  //   path: "/SumProperties",
  //   name: "SumProperties",
  //   component: <SumProperties />,
  //   layout: "/admin",
  // },

  {
    path: "/OutstandingBalance",

    component: <OutstandingBalance />,
    layout: "/admin",
  },

  {
    path: "/tenantdetail/:id",
    name: "Tenant Detail",
    component: <TenantDetailPage />,
    layout: "/admin",
  },

  {
    path: "/rentrolldetail/:tenantId/:entryIndex",
    name: "Rent Roll Detail",
    component: <RentRollDetail />,
    layout: "/admin",
  },
  {
    path: "/rentalownerdetail/:id",
    name: "Rental owner Detail",
    component: <RentalOwnerDetail />,
    layout: "/admin",
  },

  {
    path: "/PropDetails/:id",
    name: "Prop Details",
    component: <PropDetails />,
    layout: "/admin",
  },
  {
    path: "/PropDetails2/:rentla_id",
    name: "Prop Details",
    component: <PropDetails2 />,
    layout: "/admin",
  },
  {
    path: "/OutstandDetails/:id",
    name: "OutstandDetails",
    component: <OutstandDetails />,
    layout: "/admin",
  },
  {
    path: "/RentRollLeaseing",
    name: "Rent Roll Leaseing",
    icon: "ni ni-home-3 text-orange",
    component: <RentRollLeaseing />,
    layout: "/admin",
  },
  {
    path: "/RentRollLeaseing/:id",
    name: "Rent Roll Leaseing",
    icon: "ni ni-home-3 text-orange",
    component: <RentRollLeaseing />,
    layout: "/admin",
  },
  {
    path: "/tenantdashboard",
    name: "DashBoard",
    icon: "ni ni-tv-2 text-primary",
    component: <TenantDashBoard />,
    layout: "/tenant",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <TenantProfile />,
    layout: "/tenant",
  },
  {
    path: "/tenantproperty",
    name: "Property",
    icon: "ni ni-pin-3 text-orange",
    component: <TenantProperty />,
    layout: "/tenant",
  },
  {
    path: "/tenantFinancial",
    name: "Financial",
    icon: "ni ni-money-coins text-purple",
    component: <TenantFinancial />,
    layout: "/tenant",
  },

  {
    path: "/Agent",
    name: "Add Agent",
    icon: "ni ni-single-02 text-blue",
    component: <Agent />,
    layout: "/admin",
  },
  {
    path: "/AddAgent",
    icon: "ni ni-single-02 text-green",
    component: <AddAgent />,
    layout: "/admin",
  },

  {
    path: "/AgentdashBoard",
    name: "DashBoard",
    icon: "ni ni-tv-2 text-primary",
    component: <AgentdashBoard />,
    layout: "/agent",
  },

  {
    path: "/StaffdashBoard",
    name: "DashBoard",
    icon: "ni ni-tv-2 text-primary",
    component: <StaffDashBoard />,
    layout: "/staff",
  },
  {
    path: "/VendordashBoard",
    name: "DashBoard",
    icon: "ni ni-tv-2 text-primary",
    component: <VendorDashBoard />,
    layout: "/vendor",
  },
  {
    path: "/vendorprofile",
    name: "Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <VendorProfile />,
    layout: "/vendor",
  },
  {
    path: "/vendorworkorder",
    name: "Work Order",
    icon: "ni ni-badge text-green",
    component: <VenorWorkOrder />,
    layout: "/vendor",
  },
  {
    path: "/tenantwork",
    name: "Work Order",
    icon: "ni ni-badge text-green",
    component: <TenantWork />,
    layout: "/tenant",
  },
  {
    path: "/taddwork",
    name: "Work Order",
    icon: "ni ni-badge text-green",
    component: <TAddWork />,
    layout: "/tenant",
  },
  {
    path: "/Workorder",
    name: "Work Order",
    component: <Workorder />,
    layout: "/admin",
  },
  {
    path: "/addworkorder",
    component: <AddWorkorder />,
    layout: "/admin",
  },

  {
    path: "/staffprofile",
    name: "Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <StaffProfile />,
    layout: "/staff",
  },
  {
    path: "/agentprofile",
    name: "Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <AgentProfile />,
    layout: "/agent",
  },
  {
    path: "/vendorworktable",
    name: "Work Order",
    icon: "ni ni-badge text-green",
    component: <VendorWorkTable />,
    layout: "/vendor",
  },

  {
    path: "/staffworkorder/:id",
    name: "Work Order",
    icon: "ni ni-badge text-green",
    component: <StaffWorkOrder />,
    layout: "/staff",
  },

  {
    path: "/staffworktable",
    name: "Work Order",
    icon: "ni ni-badge text-green",
    component: <StaffWorkTable />,
    layout: "/staff",
  },

  {
    path: "/addvendor",
    component: <AddVendor />,
    layout: "/admin",
  },
  {
    path: "/vendor",
    name: "Vendor",
    component: <Vendor />,
    layout: "/admin",
  },
  {
    path: "/addvendor/:id",
    component: <AddVendor />,
    layout: "/admin",
  },
  {
    path: "/addworkorder/:id",
    component: <AddWorkorder />,
    layout: "/admin",
  },
  {
    path: "/addworkorder/addtask/:rental_id",
    component: <AddWorkorder />,
    layout: "/admin",
  },

  {
    path: "/rentals/:id/:entryIndex",
    name: "Add Property",
    icon: "ni ni-pin-3 text-orange",
    component: <Rentals />,
    layout: "/admin",
  },
  {
    path: "/rentals/:rental_id",
    name: "Add Property",
    icon: "ni ni-pin-3 text-orange",
    component: <Rentals />,
    layout: "/admin",
  },
  {
    path: "/rentals2/:rental_id",
    name: "Add Property",
    icon: "ni ni-pin-3 text-orange",
    component: <Rentals2 />,
    layout: "/admin",
  },
  {
    path: "/GeneralLedger",
    name: "General Ledger",
    icon: "ni ni-single-02 text-black",
    component: <GeneralLedger />,
    layout: "/admin",
  },

  {
    path: "/AddPropertyType/:id",
    name: "Add Property",
    component: <AddPropertyType />,
    layout: "/admin",
  },
  {
    path: "/AddStaffMember/:id",
    name: "Staff Member",
    component: <AddStaffMember />,
    layout: "/admin",
  },
  {
    path: "/AddAgent/:id",
    icon: "ni ni-single-02 text-green",
    component: <AddAgent />,
    layout: "/admin",
  },

  {
    path: "/GeneralLedger",
    name: "General Ledger",
    icon: "ni ni-single-02 text-black",
    component: <GeneralLedger />,
    layout: "/admin",
  },

  {
    path: "/AddPropertyType/:id",
    name: "Add Property",
    component: <AddPropertyType />,
    layout: "/admin",
  },
  {
    path: "/AddStaffMember/:id",
    name: "Staff Member",
    component: <AddStaffMember />,
    layout: "/admin",
  },
  {
    path: "/AddAgent/:id",
    icon: "ni ni-single-02 text-green",
    component: <AddAgent />,
    layout: "/admin",
  },
  {
    path: "/addgeneralledger",
    component: <AddGeneralLedger />,
    layout: "/admin",
  },
  {
    path: "/tworkorderdetail/:id",
    name: "Work Order Detail",
    component: <TWorkOrderDetails />,
    layout: "/tenant",
  },
  // {
  //   path: "/workorderdetail/:id",
  //   name: "Work Order Detail",
  //   component: <WorkOrderDetails/>,
  //   layout: "/admin"
  // },
  {
    path: "/workorderdetail/:workorder_id",
    name: "Work Order Detail",
    component: <WorkOrderDetails />,
    layout: "/admin",
  },
  {
    path: "/staffworkdetails/:workorder_id",
    name: "Work Order Detail",
    component: <StaffWorkDetails />,
    layout: "/staff",
  },
  {
    path: "/tworkorderdetail/:id",
    name: "Work Order Detail",
    component: <TWorkOrderDetails />,
    layout: "/tenant",
  },
  {
    path: "/vendorworkdetail/:id",
    name: "Work Order",
    icon: "ni ni-badge text-green",
    component: <VendorWorkDetail />,
    layout: "/vendor",
  },
  {
    path: "/vendoraddwork/:id",
    component: <VendorAddWork />,
    layout: "/vendor",
  },
  {
    path: "/Applicants/:id",
    name: "applicants",
    icon: "ni ni-home-3 text-orange",
    component: <ApplicantSummary />,
    layout: "/admin",
  },
  {
    path: "/Leaseing/:id/:entryIndex",
    name: "Leaseing",
    icon: "ni ni-home-3 text-orange",
    component: <Leaseing />,
    layout: "/admin",
  },
  {
    path: "/PropDetails/:id/:entryIndex",
    name: "Prop Details",
    component: <PropDetails />,
    layout: "/admin",
  },

  {
    path: "/tenantdetail/:tenantId/:entryIndex",
    name: "Tenant Detail",
    component: <TenantDetailPage />,
    layout: "/admin",
  },
  {
    path: "/tenantpropertydetail/:rental_adress",
    name: "Tenant Property Detail",
    component: <TenantPropertyDetail />,
    layout: "/tenant",
  },

  {
    path: "/Payment",
    component: <Payment />,
    layout: "/admin",
  },
  {
    path: "/AddPayment",
    component: <AddPayment />,
    layout: "/admin",
  },

  {
    path: "/RentRollLeaseing/:id/:entryIndex",
    name: "Rent Roll Leaseing",
    icon: "ni ni-home-3 text-orange",
    component: <RentRollLeaseing />,
    layout: "/admin",
  },
  {
    path: "/AddPayment/:tenantId/:entryIndex",
    component: <AddPayment />,
    layout: "/admin",
  },
  {
    path: "/AddCharge/:tenantId/:entryIndex",
    component: <AddCharge />,
    layout: "/admin",
  },
  {
    path: "/AddPayment/:paymentId",
    component: <AddPayment />,
    layout: "/admin",
  },
  {
    path: "/AddCharge/:chargeId",
    component: <AddCharge />,
    layout: "/admin",
  },
  {
    path: "/applicant-form/:id",
    component: <ApplicantForm />,
    layout: "/admin",
  },
  {
    path: "/trial-login",
    component: <TrialLogin />,
    layout: "/trial",
  },

  // ==========================  Super Admin ===================================================

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <SuperAdminDashBoard />,
    layout: "/superadmin",
  },

  {
    path: "/plans",
    name: "Plans",
    icon: "ni ni-pin-3 text-orange",
    component: <SuperAdminPlanList />,
    layout: "/superadmin",
  },
];

export default routes;
