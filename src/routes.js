import Index from "views/Index copy";
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
import Plans from "views/source/Plans";
import Planpurches from "views/source/Planpurches";
import OutstandingBalance from "views/source/OutstandingBalance";
import TenantDetailPage from "views/source/TenantDetailPage";
import RentRollDetail from "views/source/RentRollDetail";
import RentalOwnerDetail from "views/source/RentalOwnerDetail";
import OutstandDetails from "views/source/OutstandDetails";
import PropDetails from "views/source/PropDetails";
import RentRollLeaseing from "views/source/RentRollLeaseing";
import TenantDashBoard from "views/source/TenantDashBoard copy";
import TenantProfile from "views/source/TenantProfile";
import TenantProperty from "views/source/TenantProperty";
import AddAgent from "views/source/AddAgent";
import Agent from "views/source/Agent";
import AgentdashBoard from "views/source/AgentdashBoard";
import StaffDashBoard from "views/source/StaffDashBoard (1)";
import VendorDashBoard from "views/source/VendorDashBoard (1)";
import VendorProfile from "views/source/VendorProfile";
import TenantWork from "views/source/TenantWork";
import TAddWork from "views/source/TAddWork";
import Workorder from "views/source/Workorder";
import AddWorkorder from "views/source/AddWorkorder";
import StaffProfile from "views/source/StaffProfile";
import StaffPropertyDashboard from "views/source/StaffPropertyDashboard";
import StaffPropertyDetail from "views/source/StaffPropertyDetail";
import AgentProfile from "views/source/AgentProfile";
import VendorWorkTable from "views/source/VendorWorkTable";
import StaffWorkTable from "views/source/StaffWorkTable copy";
import VendoeWorkTable from "views/source/VendorWorkTable";
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
import Changepassword from "views/source/Changepassword";
import Forgetmail from "views/source/forgetmail";
import TrialLogin from "views/source/TrialLogin";
import DemoPayment from "views/source/DemoPayment";
import SurchargeForm from "views/source/Surcharge";
import SurchargeTable from "views/source/SurchargeTable";
import Settings from "views/source/Settings";
import TenantAddPayment from "views/source/TenantAddPayment";
import Purchaseplan from "views/source/purchaseplandetail";

// ==========================  Super Admin ===================================================

import SuperAdminDashBoard from "../src/components/superadmin/Dashboard/DashBoard copy";
import SuperAdminPlanList from "components/superadmin/Plan/PlanList copy";
import SuperAdminAddplan from "components/superadmin/Plan/Addplan copy";
import SuperAdminAdmin from "components/superadmin/Admin/Admin copy";
import SuperAdminPropertyType from "components/superadmin/Admin/PropertyType";
import SuperAdminStaffMember from "components/superadmin/Admin/StaffMember";
import SuperAdminProperties from "components/superadmin/Admin/Properties";
import SuperAdminRentalOwner from "components/superadmin/Admin/RentalOwner";
import SuperAdminTenat from "components/superadmin/Admin/Tenant";
import SuperAdminUnit from "components/superadmin/Admin/Unit";
import SuperAdminLease from "components/superadmin/Admin/Leasing";
import SuperAdminVendor from "components/superadmin/Admin/Vendor";
import SuperAdminEmailForm from "components/superadmin/Email/EmailForm";
import SuperAdminEmailTable from "components/superadmin/Email/EmailTable";
import ResetPassword from "views/source/Resetpassword";

//  ====================== admin sidebar icons ======================
import Dashboard from "./assets/icons/AdminSidebar/dashboard.svg";
import Dashboard2 from "./assets/icons/AdminSidebar/dashboard2.svg";
import Property from "./assets/icons/AdminSidebar/Property.svg";
import Property2 from "./assets/icons/AdminSidebar/Property2.svg";
import Staffmember from "./assets/icons/AdminSidebar/Staffmember.svg";
import Staffmember2 from "./assets/icons/AdminSidebar/Staffmember2.svg";

import Plan from "./assets/icons/Plans.svg";
import Plan2 from "./assets/icons/Plans2.svg";
import Admin from "./assets/icons/Admin.svg";
import admin2 from "./assets/icons/admin2.svg";
import Financial from "./assets/icons/Financial.svg";
import Financial2 from "./assets/icons/Financial2.svg";
import Work from "./assets/icons/Work.svg";
import Work2 from "./assets/icons/Work Light.svg";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: Dashboard,
    icon2: Dashboard2,
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
    path: "/Plans",
    component: <Plans />,
    layout: "/admin",
  },
  {
    path: "/Purchaseplandetail",
    component: <Purchaseplan />,
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
    path: "/settings",
    name: "Settings",
    icon: "ni ni-settings-gear-65 text-yellow",
    component: <Settings />,
    layout: "/admin",
  },
  {
    path: "/propertiesTable",
    name: "Property Table",
    icon: "ni ni-bullet-list-67 text-red",
    component: <PropertiesTable />,
    layout: "/admin",
  },
  {
    name: "Rentalowner Table",
    path: "/RentalownerTable",
    component: <RentalownerTable />,
    layout: "/admin",
  },
  {
    name: "Tenants Table",
    path: "/TenantsTable",
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
    path: "/Leaseing/:tenant_id",
    name: "Leaseing",
    icon: "ni ni-home-3 text-orange",
    component: <Leaseing />,
    layout: "/admin",
  },
  {
    path: "/PropertyType",
    name: "Property Type",
    icon: Property,
    icon2: Property2,
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
    name: "Add Staff Member",
    component: <AddStaffMember />,
    layout: "/admin",
  },
  {
    path: "/StaffMember",
    name: "Staff Member",
    icon: Staffmember,
    icon2: Staffmember2,
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
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/:admin/:roll/login",
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
    path: "/Resetpassword",
    name: "Reset password",
    component: <ResetPassword />,
    layout: "/auth",
  },
  {
    path: "/RentRoll",
    name: "Rent Roll",
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
    name: "Applicants",
    icon: "ni ni-home-3 text-orange",
    component: <Applicants />,
    layout: "/admin",
  },
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
    path: "/rentrolldetail/:lease_id",
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
    path: "/PropDetails/:rental_id",
    name: "Prop Details",
    component: <PropDetails />,
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
    path: "/RentRollLeaseing?data",
    name: "Rent Roll Leaseing",
    icon: "ni ni-home-3 text-orange",
    component: <RentRollLeaseing />,
    layout: "/admin",
  },
  {
    path: "/RentRollLeaseing/:lease_id/:applicant_id",
    name: "Rent Roll Leaseing",
    icon: "ni ni-home-3 text-orange",
    component: <RentRollLeaseing />,
    layout: "/admin",
  },
  {
    path: "/RentRollLeaseing/:lease_id",
    name: "Rent Roll Leaseing",
    icon: "ni ni-home-3 text-orange",
    component: <RentRollLeaseing />,
    layout: "/admin",
  },
  {
    path: "/tenantdashboard",
    name: "DashBoard",
    icon: Dashboard,
    icon2: Dashboard2,
    component: <TenantDashBoard />,
    layout: "/tenant",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: Admin,
    icon2: admin2,
    component: <TenantProfile />,
    layout: "/tenant",
  },
  {
    path: "/tenantproperty",
    name: "Property",
    icon: Property,
    icon2: Property2,
    component: <TenantProperty />,
    layout: "/tenant",
  },
  {
    path: "/tenantFinancial",
    name: "Financial",
    icon: Financial,
    icon2: Financial2,
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
    icon: Dashboard,
    icon2: Dashboard2,
    component: <StaffDashBoard />,
    layout: "/staff",
  },
  {
    path: "/VendordashBoard",
    name: "DashBoard",
    icon: Dashboard,
    icon2: Dashboard2,
    component: <VendorDashBoard />,
    layout: "/vendor",
  },
  {
    path: "/vendorprofile",
    name: "Profile",
    icon: Admin,
    icon2: admin2,
    component: <VendorProfile />,
    layout: "/vendor",
  },
  {
    path: "/tenantwork",
    name: "Work Order",
    icon: Work,
    icon2: Work2,
    component: <TenantWork />,
    layout: "/tenant",
  },
  {
    path: "/tenantwork?status",
    name: "Work Order",
    icon: Work,
    icon2: Work2,
    component: <TenantWork />,
    layout: "/tenant",
  },
  {
    path: "/taddwork",
    name: "Work Order",
    icon: Work,
    icon2: Work2,
    component: <TAddWork />,
    layout: "/tenant",
  },
  {
    path: "/addworkorder",
    component: <AddWorkorder />,
    layout: "/admin",
  },
  {
    path: "/staffprofile",
    name: "Profile",
    icon: Admin,
    icon2: admin2,
    component: <StaffProfile />,
    layout: "/staff",
  },
  {
    path: "/staffproperty",
    name: "Property",
    icon: Property,
    icon2: Property2,
    component: <StaffPropertyDashboard />,
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
    icon: Work,
    icon2: Work2,
    component: <VendorWorkTable />,
    layout: "/vendor",
  },
  {
    path: "/staffpropertydetail/:rental_id",
    name: "Property",
    component: <StaffPropertyDetail />,
    layout: "/staff",
  },
  {
    path: "/staffworktable",
    name: "Work Order",
    icon: Work,
    icon2: Work2,
    component: <StaffWorkTable />,
    layout: "/staff",
  },
  {
    path: "/staffworktable?status",
    name: "Work Order",
    icon: Work,
    icon2: Work2,
    component: <StaffWorkTable />,
    layout: "/staff",
  },
  {
    path: "/vendorworktable?status",
    name: "Work Order",
    icon: Work,
    icon2: Work2,
    component: <VendoeWorkTable />,
    layout: "/vendor",
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
    path: "/Workorder",
    name: "Work Order",
    component: <Workorder />,
    layout: "/admin",
  },
  {
    path: "/addvendor/:vendor_id",
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
    path: "/rentals/:rental_id",
    name: "Add Property",
    icon: "ni ni-pin-3 text-orange",
    component: <Rentals />,
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
    name: "Add Staff Member",
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
    path: "/AddStaffMember/:id",
    name: "Add Staff Member",
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
    path: "/vendorworkdetail/:workorder_id",
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
    path: "/tenantdetail/:tenantId/:entryIndex",
    name: "Tenant Detail",
    component: <TenantDetailPage />,
    layout: "/admin",
  },
  {
    path: "/tenantpropertydetail/:lease_id",
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
    path: "/AddPayment/:lease_id",
    component: <AddPayment />,
    layout: "/admin",
  },
  {
    path: "/AddPayment/:lease_id/:payment_id",
    component: <AddPayment />,
    layout: "/admin",
  },
  {
    path: "/AddCharge/:lease_id",
    component: <AddCharge />,
    layout: "/admin",
  },
  {
    path: "/AddCharge/:lease_id/:charge_id",
    component: <AddCharge />,
    layout: "/admin",
  },
  {
    path: "/TenantPayment",
    component: <TenantAddPayment />,
    layout: "/tenant",
  },
  {
    path: "/TenantPayment/:payment_id",
    component: <TenantAddPayment />,
    layout: "/tenant",
  },
  {
    path: "/trial-login",
    component: <TrialLogin />,
    layout: "/trial",
  },
  {
    path: "/add_surcharge",
    component: <SurchargeForm />,
    layout: "/admin",
  },
  {
    path: "/add_surcharge/:surcharge_id",
    component: <SurchargeForm />,
    layout: "/admin",
  },
  {
    path: "/surcharge",
    component: <SurchargeTable />,
    layout: "/admin",
  },

  // ==========================  Super Admin ===================================================

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    icon2: Dashboard2,
    component: <SuperAdminDashBoard />,
    layout: "/superadmin",
  },

  {
    path: "/plans",
    name: "Plans",
    icon: Plan,
    icon2: Plan2,
    component: <SuperAdminPlanList />,
    layout: "/superadmin",
  },
  {
    path: "/addplan",
    name: "Addplans",
    component: <SuperAdminAddplan />,
    layout: "/superadmin",
  },
  {
    path: "/addplan/:id",
    name: "Addplans",
    component: <SuperAdminAddplan />,
    layout: "/superadmin",
  },
  {
    path: "/Planpurchases",
    name: "Purchase Plan",
    component: <Planpurches />,
    layout: "/admin",
  },
  {
    path: "/admin",
    name: "Admin",
    icon: Admin,
    icon2: admin2,
    component: <SuperAdminAdmin />,
    layout: "/superadmin",
  },
  {
    path: "/propertytype/:admin_id",
    name: "Add Property Type",
    icon: "ni ni-pin-3 text-orange",
    component: <SuperAdminPropertyType />,
    layout: "/superadmin",
  },
  {
    path: "/staffmember/:admin_id",
    name: "Staff-Member",
    icon: "ni ni-pin-3 text-orange",
    component: <SuperAdminStaffMember />,
    layout: "/superadmin",
  },
  {
    path: "/properties/:admin_id",
    name: "Properties",
    icon: "ni ni-pin-3 text-orange",
    component: <SuperAdminProperties />,
    layout: "/superadmin",
  },
  {
    path: "/rental-owner/:admin_id",
    name: "Properties",
    icon: "ni ni-pin-3 text-orange",
    component: <SuperAdminRentalOwner />,
    layout: "/superadmin",
  },
  {
    path: "/tenant/:admin_id",
    name: "Tenant",
    icon: "ni ni-pin-3 text-orange",
    component: <SuperAdminTenat />,
    layout: "/superadmin",
  },
  {
    path: "/unit/:admin_id",
    name: "Unit",
    icon: "ni ni-pin-3 text-orange",
    component: <SuperAdminUnit />,
    layout: "/superadmin",
  },
  {
    path: "/lease/:admin_id",
    name: "Unit",
    icon: "ni ni-pin-3 text-orange",
    component: <SuperAdminLease />,
    layout: "/superadmin",
  },
  {
    path: "/vendor/:admin_id",
    name: "Vendor",
    icon: "ni ni-pin-3 text-orange",
    component: <SuperAdminVendor />,
    layout: "/superadmin",
  },
  {
    path: "/addemail",
    name: "Email Form",
    icon: "ni ni-pin-3 text-orange",
    component: <SuperAdminEmailForm />,
    layout: "/superadmin",
  },
  {
    path: "/email",
    name: "Email Table",
    icon: "ni ni-pin-3 text-orange",
    component: <SuperAdminEmailTable />,
    layout: "/superadmin",
  },
];

export default routes;
