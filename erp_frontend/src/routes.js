/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/
// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Uservansal from "pages/uservansal/index";
import Customer from "pages/customer";
import ItemBrandMst from "pages/itemBrandMst";
import ItemFamMst from "pages/ItemFamMst";
import Item from "pages/item";
import Itemcate from "pages/itemcate";
import Itemcolor from "pages/itemcolor";
import ItemDeptMst from "pages/itemDeptMst";
import Sizemaster from "pages/sizemaster";
import Supplier from "pages/supplier";
import Salesman from "pages/salesman";
import Journey_Plans from "pages/journey_plans";
import Promotion from "pages/promotion";
import Pricing from "pages/pricing";
import Discount from "pages/discount";
import Rebate from "pages/rebate";
import Listing_Fee from "pages/listing_fee";
import Shelf_Rent from "pages/shelf_rent";
import Orders from "pages/orders";
import Purchase_order from "pages/purchaseorder";
import Delivery from "pages/delivery";
import ItemSFamMst from "pages/ItemSFamMst";
import Payment from "pages/payment";
// import Pos from "pages/pos";
import Pos from "pages/pos/Pos";
import Pos1 from "pages/pos/Pos1";
import Invoice from "pages/invoice";
import Table from "pages/invoice/table";
import Credit_Notes from "pages/credit_notes";
import Debit_Notes from "pages/debit_notes";
import Collection from "pages/collections";
import Route_item_group from "pages/route_item_group";
import Portfolio_Management from "pages/portfolio_management";
import Salesman_load from "pages/salesman_load";
import Load_Request from "pages/load_request";
import Salesman_Unload from "pages/salesman_unload";
import Van_To_Van_Transfer from "pages/van_to_van_transfer";
import Goods_Receipt_Notes from "pages/grn";
import Cashier_Reciept from "pages/cashier_reciept";
import PDC from "pages/pdc";
import Session_Endorsement from "pages/session_endorsement";
import Sales_Target from "pages/sales_target";
import Target_Commission from "pages/target_commission";
import Expense from "pages/expense";
// import Master from "pages/master";
import User_Roles from "pages/master/users_roles";
import Change_Password from "pages/master/change_password";
import Master_Data_Download from "pages/master/master_data_download";
import Custom_Fields from "pages/master/preferences/custom_fields";
import General_Settings from "pages/master/preferences/general_settings";
import Workflow_Rules from "pages/master/preferences/workflow_rules";
import Templates from "pages/master/preferences/templates";
import Activity_Profile from "pages/master/preferences/activity_profile";
import Theme from "pages/master/preferences/theme";
import Portal from "pages/master/preferences/portal";
import Bank from "pages/master/bank";
import Taxes from "pages/master/taxes";
import Reason from "pages/master/reason";
import Currency from "pages/master/currency";
import State from "pages/master/state";
import CountrLLLLLLy from "pages/master/country";
import City from "pages/master/city";
import Warehouse from "pages/warehouse";
import Location from "pages/location";

import Comapany from "pages/comapany";
import Country from "pages/master/location/country";
import Region from "pages/master/location/region_master";
import Branch_Depot from "pages/master/location/branch_master";
import VanMaster from "pages/master/location/van_master";
import RouteMaster from "pages/master/location/route_master";
import Outlet_product from "pages/master/customer_setting/outlet_product_code";
import Credit_Limits from "pages/master/customer_setting/credit_limits";
import ItemGroup from "pages/master/item_setting/item_group";
import ItemUOM from "pages/master/item_setting/uom";
import ItemVariant from "pages/master/item_setting/variant";
import ItemClass from "pages/master/item_setting/class";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Forget from "layouts/authentication/forget-password";

//Add new page routes
import Addnew from "pages/customer/add_new";

import Add_Item from "pages/item/add_item";
import Add_ItemSFamMst from "pages/ItemSFamMst/add_ItemSFamMst";
import Add_ItemBrandMst from "pages/itemBrandMst/add_ItemBrandMst";

import Add_Itemcate from "pages/itemcate/add_itemcate";
import Add_ItemFamDep from "pages/ItemFamMst/add_ItemFamMst";
import Add_Itemcolor from "pages/itemcolor/add_itemcolor";
import Add_Itemdepart from "pages/itemDeptMst/add_ItemDeptMst";
import Add_Sizemaster from "pages/sizemaster/add_size";
import Add_Setting from "pages/setting/add_setting";
import Add_supplier from "pages/supplier/add_supplier";
import Add_Journey_plans from "pages/journey_plans/add_journey_plans";
import Add_Salesman from "pages/salesman/add_salesman";
import Add_Promotion from "pages/promotion/add_promotion";
import Add_Pricing from "pages/pricing/add_pricing";
import Add_Discount from "pages/discount/add_discount";
import Add_Rebate from "pages/rebate/add_rebate";
import Add_Orders from "pages/orders/add_orders";
import Add_Po from "pages/purchaseorder/add_po";
import Add_Delivery from "pages/delivery/add_delivery";
import Add_Invoice from "pages/invoice/add_invoice";
import Add_Credit_Notes from "pages/credit_notes/add_credit_notes";
import Add_Debit_Notes from "pages/debit_notes/add_debit_notes";
import Add_Salesman_load from "pages/salesman_load/add_salesman_load";
import Add_load_Request from "pages/load_request/add_load_request";
import AddBank from "pages/master/bank/add_bank";
import AddTax from "pages/master/taxes/add_tax";
import AddReason from "pages/master/reason/add_reason";
// import AddCurrency from "pages/master/currency/add_currency";
import AddState from "pages/master/state/add_state";
import Addcountry from "pages/master/country/add_ country";
import AddCity from "pages/master/city/add_city";
import AddWarehouse from "pages/warehouse/add_warehouse";
import AddLocation from "pages/location/add_location";

import AddComapany from "pages/comapany/add_comapany";
import AddCountry from "pages/master/location/country/add_country";
import AddRegion from "pages/master/location/region_master/add_region";
import AddBranch from "pages/master/location/branch_master/add_branch_master";
import AddVanMaster from "pages/master/location/van_master/add_van_master";
import AddRoute from "pages/master/location/route_master/add_route";
import AddOutlet_product from "pages/master/customer_setting/outlet_product_code/add_outlet_product_code";
import AddItemGroup from "pages/master/item_setting/item_group/add_item_group";
import AddItemUOM from "pages/master/item_setting/uom/add_uom";
import AddListing_Fee from "pages/listing_fee/add_listing_fee";
import AddShelf_rent from "pages/shelf_rent/add_shelf_rent";
import Invite_user from "pages/master/users_roles/invite_user.js";
import Add_GRN from "pages/grn/add_grn";
import Add_Collections from "pages/collections/add_collections";
import AddRoute_item_group from "pages/route_item_group/add_route_item_group";
import AddPortfolio_management from "pages/portfolio_management/add_portfolio_management";
import Add_Cashier_Reciept from "pages/cashier_reciept/add_cashier_reciept";
import Add_PDC from "pages/pdc/add_pdc";
import Add_Uservansal from "pages/uservansal/add_uservansal/index";
import Add_Target_Commission from "pages/target_commission/add_target_commission";
import Add_Expense from "pages/expense/add_expense";
import AddRole from "pages/master/users_roles/roles/new_role";
import Add_VanToVan_Transfer from "pages/van_to_van_transfer/add_vantovan_transfer";
import Add_JDE_Config from "pages/master/jde_config/add_jde_config";
import Add_Createtable from "pages/createtable";
import Add_Payments from "pages/payment/add_payment";
import Add_Role from "pages/Role/add_role";

// @mui icons
import Icon from "@mui/material/Icon";

//Edit pages route
import Edit_Payments from "pages/payment/edit_payment";

import EditNew from "pages/customer/edit_new";
import EditItemBrandMst from "pages/itemBrandMst/edit_ItemBrandMst";
import EditItemFm from "pages/ItemFamMst/edit_ItemFamMst";
import Edit_Item from "pages/item/edit_item";
import Edit_itemDeptMst from "pages/itemDeptMst/edit_ItemDeptMst";
import Edit_itemcate from "pages/itemcate/edit_itemcate";
import Edit_Itemcolor from "pages/itemcolor/edit_itemcolor";
import Edit_Sizemaster from "pages/sizemaster/edit_size";
import Edit_Setting from "pages/setting/edit_setting";
import Edit_supplier from "pages/supplier/edit_supplier";
import Edit_Salesman from "pages/salesman/edit_salesman";
import Edit_Journey_plans from "pages/journey_plans/edit_journey_plans";
import Edit_Promotion from "pages/promotion/edit_promotion";
import Edit_Pricing from "pages/pricing/edit_pricing";
import Edit_Discount from "pages/discount/edit_discount";
import Edit_Orders from "pages/orders/edit_orders";
import Edit_Po from "pages/purchaseorder/edit_po";

import Generate_Invoice from "pages/orders/generate_invoice";
import Generate_Invoice_po from "pages/purchaseorder/generate_invoice-po";
import Edit_Role from "pages/Role/edit_role";

import User from "pages/User";
import Setting from "pages/setting";
import Role from "pages/Role";
import Report from "pages/reports";
import Items from "pages/Items";

import Edit_Delivery from "pages/delivery/edit_delivery";
import Edit_Invoice from "pages/invoice/edit_invoice";
import Edit_invoice from "pages/invoice/edit_invoice/Edit_invoice";
import Edit_ItemSFamMst from "pages/ItemSFamMst/edit_ItemSFamMst";

import Edit_Credit_Notes from "pages/credit_notes/edit_credit_notes";
import Edit_Debit_Notes from "pages/debit_notes/edit_debit_notes";
import EditRoute_item_group from "pages/route_item_group/edit_route_item_group";
import EditPortfolio_management from "pages/portfolio_management/edit_portfolio_management";
import Edit_load_Request from "pages/load_request/edit_load_request";
import Edit_GRN from "pages/grn/edit_grn";
import Edit_PDC from "pages/pdc/edit_pdc";
import Edit_Uservansal from "pages/uservansal/edit_uservansal/index";
import Edit_Target_Commission from "pages/target_commission/edit_target_commission";
import EditTax from "pages/master/taxes/edit_tax";
import EditReason from "pages/master/reason/edit_reason";
import EditBank from "pages/master/bank/edit_bank";
// import EditCurrency from "pages/master/currency/edit_currency";
import EditState from "pages/master/state/edit_state";
import EditCountryLLL from "pages/master/country/edit_country";
import EditCity from "pages/master/city/edit_city";
import EditWarehouse from "pages/warehouse/edit_warehouse";
import Editlocation from "pages/location/edit_location";
import Editcomapany from "pages/comapany/edit_comapany";
import EditCountry from "pages/master/location/country/edit_country";
import EditRegion from "pages/master/location/region_master/edit_region";
import EditBranch from "pages/master/location/branch_master/edit_branch_master";
import EditVanMaster from "pages/master/location/van_master/edit_van_master";
import EditRoute from "pages/master/location/route_master/edit_route";
import EditOutlet_product from "pages/master/customer_setting/outlet_product_code/edit_outlet_product_code";
import EditItemGroup from "pages/master/item_setting/item_group/edit_item_group";
import EditItemUOM from "pages/master/item_setting/uom/edit_uom";
import Item_Batch from "pages/master/item_batch";
import JDE_Config from "pages/master/jde_config";
import Edit_VanToVan_Transfer from "pages/van_to_van_transfer/edit_vantovan_transfer";
import Edit_JDE_Config from "pages/master/jde_config/edit_jde_config";
import Add_Activity from "pages/master/preferences/activity_profile/add_activity";
import Add_Workflow from "pages/master/preferences/workflow_rules/add_workflow";

//view
import View_Orders from "pages/orders/view_orders";
import View_Items from "pages/item/view_items";
import View_itemDeptMst from "pages/itemDeptMst/view_itemDepMst";
import View_Orders_po from "pages/purchaseorder/view_orders_po";
import View_ItemBrandMst from "pages/itemBrandMst/view_ItemBrandMst";
import View_Salesman from "pages/salesman/view_salesman";
import View_ItemUOM from "pages/master/item_setting/uom/view_uom";
import View_Tax from "pages/master/taxes/view_tax";
import View_supplier from "pages/supplier/view_supplier";
import View_New from "pages/customer/view_new";
import View_Role from "pages/Role/view_role";
import View_ItemSFamMst from "pages/ItemSFamMst/view_ItemSFamMst";
import View_itemcate from "pages/itemcate/view_itemcate";
import View_Itemcolor from "pages/itemcolor/view_itemcolor";
import View_ItemFm from "pages/ItemFamMst/view_ItemFamMst";
import View_Sizemaster from "pages/sizemaster/view_size";
import View_Setting from "pages/setting/view_setting";
import View_Invoice from "pages/invoice/view_invoice";
import View_GRN from "pages/grn/view_grn";
import View_Payments from "pages/payment/view_payment";
import View_Uservansal from "pages/uservansal/view_uservansal";
// import View_Currency from "pages/master/currency/view_currency";
import View_State from "pages/master/state/view_state";
import View_Country from "pages/master/country/view_country";
import View_City from "pages/master/city/view_city";
import View_Warehouse from "pages/warehouse/view_warehouse";
import View_location from "pages/location/view_location";
import View_comapany from "pages/comapany/view_comapany";

import Module_Masters from "./adminPages/ModuleMaster/Module_Masters";
import Add_Module_Master from "./adminPages/ModuleMaster/Add_Module_Master";
import Edit_Module_Master from "./adminPages/ModuleMaster/Edit_Module_Master";
import View_Module_Master from "./adminPages/ModuleMaster/View_Module_Master";

import Sub_Module_Masters from "./adminPages/Sub_ModuleMaster/Sub_Module_Master";
import Add_Sub_Module_Master from "./adminPages/Sub_ModuleMaster/Add_Sub_Module_Master";
import Edit_Sub_Module_Master from "./adminPages/Sub_ModuleMaster/Edit_Sub_Module_Master";
import View_Sub_Module_Master from "./adminPages/Sub_ModuleMaster/View_Sub_Module_Master";

import Function_Master from "./adminPages/FunctionMaster/Function_Master";
import Add_Function_Master from "./adminPages/FunctionMaster/Add_Function_Master";
import Edit_Function_Master from "./adminPages/FunctionMaster/Edit_Function_Master";
import View_Function_Master from "./adminPages/FunctionMaster/View_Function_Master";

import Add_Role_Master from "./adminPages/UserRole/Add_Role_Master";
import Role_Master from "./adminPages/UserRole/Role_Master";
import Edit_Role_Master from "./adminPages/UserRole/Edit_Role_Master";
import View_Role_Master from "./adminPages/UserRole/View_Role_Master";
import UserRole from "./adminPages/UserRole/UserRole";
import Addextracost from "./pages/grn/add_logistic_cost/Addextracost";
// import AddGrn from "./pages/grn/add_grn/AddGrn";
// import AddGrn2 from "./pages/grn/add_grn/AddGrn2";
import CashFloatSetup from "pages/CurrencyDenomination/CashFloatSetup";
import CurrencyDenominationForm from "pages/CurrencyDenomination/CurrencyDenominationForm";
import FloatDetails from "pages/CurrencyDenomination/FloatDetails";
import ManagePOS_CashFloat from "pages/CurrencyDenomination/ManagePOS_CashFloat";
import RegisterReport from "pages/CurrencyDenomination/RegisterReport";
import CloseReport from "pages/CurrencyDenomination/CloseReport";
// import RegisterSetting from "./pages/";
import StockDistributor from "pages/stock_distribution/StockDistributor";
import ItemLocationMaster from "pages/item_location_master/ItemLocationMaster";
import Stockupload from "pages/stock_distribution/Stockupload";
import ZebraBarcodePrinter from "pages/item/ZebraBarcodePrinter";
import Test from "pages/pos/Test";
import SettingsPage from "pages/Pos_setting/SettingsPage";
import ViewItemLocationMaster from "pages/item_location_master/ViewItemLocationMaster";
import EditItemLocationMaster from "pages/item_location_master/EditItemLocationMaster";
import TaxSettingsForm from "pages/tax/TaxSettingsForm";
import Tax_setting_list from "pages/tax/Tax_setting_list";
import Stock_movement_report from "pages/Stock_movement/Stock_movement_report";

import Rtv from "pages/RTV/Rtv";
import Rtv_grn from "pages/grn/rtv_grn/Rtv_grn";
import AddVendor from "pages/Vendor/AddVendor";
import VendorList from "pages/Vendor/VendorList";
import EditVendor from "pages/Vendor/EditVendor";
import ViewVendor from "pages/Vendor/ViewVendor";
import ReportPage from "pages/reports/ReportPage";
import OrderReport from "pages/reports/OrderReport";

import Emp_dashboard from "pages/Employee_Dashboard/Emp_dashboard";
import DepartmentMaster from "pages/Employee_Dashboard/DepartmentMaster";
import EmployeeList from "pages/Employee_Dashboard/Employee";
import Leave_Master from "pages/Employee_Dashboard/Leave/LeaveMasterPage";
import Jtspdf from "pages/Employee_Dashboard/test/jtspdf";
import New_Employee from "pages/Employee_Dashboard/New_Employee";
import Emp_Attendance from "pages/Employee_Dashboard/New_Attendance";
import View_Attendance from "pages/Employee_Dashboard/Attendance";
import New_Contract from "pages/Employee_Dashboard/Contract";
import View_Contract from "pages/Employee_Dashboard/View_Contract";
import Edit_Contract from "pages/Employee_Dashboard/Edit_Contract";
import Employee_Map from "pages/Employee_Dashboard/Employee_map";
import BatchesList from "pages/batches/BatchesList";
import PayrollScreen from "pages/Employee_Dashboard/Payroll_Screen/PayrollScreen";
import ManagerPage from "pages/Employee_Dashboard/Payroll_Screen/ManagerPage";
import EmployeeRoleRedirect from "EmployeeRoleRedirect";
import PriceListMaster from "pages/price_list_master/PriceListMaster";
import PriceListMasterView from "pages/price_list_master/PriceListMasterView";
import PriceListMasterEdit from "pages/price_list_master/PriceListMasterEdit";
import AddPriceListMaster from "pages/price_list_master/AddPriceListMaster";
import Price_list_master_detail from "pages/price_list_master/Price_list_master_details";
import Ecom_setting from "pages/Ecom_setting/Ecom_setting";
import ItemWiseStockReport from "pages/Stock_movement/ItemWiseStockReport";
import EcomOrders from "pages/Ecom_setting/EcomOrder";
import BannerManager from "pages/Ecom_setting/BannerManager";
import ImageUpload from "pages/item_location_master/ImageUpload";

import ProtectedRoute from "./pages/ProtectedRoute";
import RolePermissionManager from "pages/Role/RolePermissionManager";
import ItemVisibilityPermission from "pages/Ecom_setting/ItemVisibilityPermission";
import Visibility_Setting from "pages/Ecom_setting/Visibility_Setting";
import Ecom_Payments from "pages/Ecom_setting/Ecom_Payments";
import Ecom_order_details from "pages/Ecom_setting/Ecom_order_details";
import Email_dashboard from "pages/email/Email_dashboard";
import Order_status_master from "pages/order_status_master/Order_status_master";
import ReasonMaster from "pages/order_action_reason/ReasonMaster";
import ReasonMapping from "pages/order_action_reason/ReasonMapping";
import PhonePay from "pages/Ecom_setting/PhonePay";
import PayrollProcess from "pages/Employee_Dashboard/Payroll_Screen/PayrollProcess";
import PayslipsAndReports from "pages/Employee_Dashboard/Payroll_Screen/PayslipsAndReports";
import HrPayrollSettings from "pages/Employee_Dashboard/Payroll_Screen/HrPayrollSettings";
import EarningsCalculation from "pages/Employee_Dashboard/Payroll_Screen/EarningsCalculation";
import Deductions from "pages/Employee_Dashboard/Payroll_Screen/Deductions";
import SalaryRegister from "pages/Employee_Dashboard/Payroll_Screen/SalaryRegister";
import Payslip from "pages/Employee_Dashboard/Payroll_Screen/PaySlip";
import PayUPayment from "pages/Ecom_setting/PayUPayment";
import EmailContacts from "pages/email/EmailContacts";
import EmailContactsList from "pages/email/EmailContactsList";
import EmailCategoryManager from "pages/email/EmailCategoryManager";
import EmailCampaign from "pages/email/EmailCampaign";
import EmailCampaignList from "pages/email/EmailCampaignList";
import SendEmail from "pages/email/SendEmail";
import CampaignReport from "pages/email/CampaignReport";
import AssignContactsToCampaign from "pages/email/AssignContactsToCampaign";
import StoreClient from "pages/video/StoreClient";
import VideoAdvertisementPage from "pages/video/VideoAdvertisementPage";
import AdminAdMonitor from "pages/video/AdminAdMonitor";
import PrintBarcode from "pages/item_location_master/PrintBarcode";
import Barcodes from "pages/item_location_master/Barcodes";
import UserAttendancePage from "pages/Employee_Dashboard/user_attendance/UserAttendancePage";
import NewLeave from "pages/Employee_Dashboard/ApplyLeaveModal";
import Emp_Position from "pages/Employee_Dashboard/Department_Master/Dep_Position";
import Emp_Family from "pages/Employee_Dashboard/Department_Master/Dep_Family";
import Emp_Sub_Family from "pages/Employee_Dashboard/Department_Master/Sub_Dep_Family";
import StockUpdate from "pages/grn/stockAdjustmentForm/StockUpdatePage";

// import RegisterSetting from "pages/Pos_setting/RegisterSetting";

export const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    // component: (
    //   <ProtectedRoute permission="dashboard">
    //     <Dashboard />
    //   </ProtectedRoute>
    // ),
    category: "Dashboard",
  },

  {
    type: "collapse",
    name: "POS",
    key: "pos",
    icon: <Icon fontSize="small">payment</Icon>,
    route: "/pos",
    component: <Pos1 />,
    category: "POS",
  },

  {
    type: "collapse",
    name: "Master",
    key: "master",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      {
        name: "Company",
        key: "comapany",
        icon: <Icon fontSize="small">apartment</Icon>,
        route: "/company",
        component: <Comapany />,
      },
      {
        name: "location",
        key: "location",
        icon: <Icon fontSize="small">view_in_ar</Icon>,
        route: "/location",
        component: <Location />,
      },

      {
        name: "Item",
        key: "item",
        icon: <Icon fontSize="small">Item</Icon>,
        route: "/item",
        // component: <Item />,
        component: (
          <ProtectedRoute permission="item">
            <Item />
          </ProtectedRoute>
        ),
      },
      {
        name: "Country",
        key: "country",
        icon: <Icon fontSize="small">public</Icon>,
        route: "/country",
        component: <CountrLLLLLLy />,
      },
      {
        name: "State",
        key: "state",
        icon: <Icon fontSize="small">public</Icon>,
        route: "/state",
        component: <State />,
      },
      {
        name: "City",
        key: "city",
        icon: <Icon fontSize="small">public</Icon>,
        route: "/city",
        component: <City />,
      },
      {
        name: "Currency",
        key: "currency",
        icon: <Icon fontSize="small">attach_money</Icon>,
        route: "/currency",
        component: <Currency />,
      },
      {
        name: "Order Status Master",
        key: "Order_status_master",
        icon: <Icon fontSize="small">O</Icon>,
        route: "/order-status-master",
        component: <Order_status_master />,
      },
      {
        name: "Reason Master",
        key: "ReasonMaster",
        icon: <Icon fontSize="small">R</Icon>,
        route: "/reasonmaster",
        component: <ReasonMaster />,
      },
      {
        name: "UOM",
        key: "item-uom",
        icon: <Icon fontSize="small">balance</Icon>,
        route: "/item-uom",
        component: <ItemUOM />,
      },

      {
        name: "Tax ",
        key: "tax",
        icon: <Icon fontSize="small">percent</Icon>,
        route: "/tax",
        component: <Taxes />,
      },
    ],
  },

  {
    type: "collapse",
    name: "Modules",
    key: "modules",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      {
        name: "Module Master",
        key: "module",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/module_masters",
        component: <Module_Masters />,
      },
      {
        name: "Sub Module Master",
        key: "sub module",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/sub_module_master",
        component: <Sub_Module_Masters />,
      },
      {
        name: "Function Master",
        key: "function module",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/function_master",
        component: <Function_Master />,
      },
    ],
  },

  {
    type: "collapse",
    name: "User Management",
    key: "user management",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      //Role Master
      {
        name: "Role Master",
        key: "role module",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/role_master",
        component: <Role_Master />,
      },
      //user Role

      {
        name: "User Role",
        key: "user Role",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/userrole",
        component: <UserRole />,
      },
      {
        name: "User JERP",
        key: "uservansal",
        icon: <Icon fontSize="small">person</Icon>,
        route: "/uservansal",
        component: <Uservansal />,
      },
      {
        name: "Employee",
        key: "salesman",
        icon: <Icon fontSize="small">cases</Icon>,
        route: "/salesman",
        component: <Salesman />,
      },
      {
        name: "Role Permission",
        key: "roleMaster",
        icon: <Icon fontSize="small">cases</Icon>,
        route: "/roleMaster",
        component: <RolePermissionManager />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Purchase",
    key: "purchase",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      //Role Master
      {
        name: "Vendor",
        key: "vendor",
        icon: <Icon fontSize="small">view_week</Icon>,
        route: "/vendor",
        component: <VendorList />,
      },
      {
        name: "Purchase Order",
        key: "purchaseorder",
        icon: <Icon fontSize="small">receipt</Icon>,
        route: "/purchaseorder",
        component: <Purchase_order />,
      },
      {
        name: "GRN",
        key: "grn",
        icon: <Icon fontSize="small">sticky_note_2</Icon>,
        route: "/grn",
        component: <Goods_Receipt_Notes />,
      },
      {
        name: "Reports",
        key: "reports",
        icon: <Icon fontSize="small">sticky_note_2</Icon>,
        // route: "/grn",
        // component: <Goods_Receipt_Notes />,
      },
    ],
  },

  {
    type: "collapse",
    name: "Sales",
    key: "sales",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      {
        name: "Customer",
        key: "customer",
        icon: <Icon fontSize="small">person</Icon>,
        route: "/customer",
        component: <Customer />,
      },
      {
        name: "Order",
        key: "order",
        icon: <Icon fontSize="small">shopping_cart</Icon>,
        route: "/order",
        component: <Orders />,
      },

      {
        name: "Invoice",
        key: "invoice",
        icon: <Icon fontSize="small">text_snippet</Icon>,
        route: "/invoice",
        component: <Invoice />,
      },
      {
        name: "Reports",
        key: "reports",
        icon: <Icon fontSize="small">sticky_note_2</Icon>,
        // route: "/grn",
        // component: <Goods_Receipt_Notes />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Inventory",
    key: "inventry",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      {
        name: "Item Master Location",
        key: "itemlocationmaster",
        icon: <Icon fontSize="small">Item</Icon>,
        route: "/itemlocationmaster",
        component: <ItemLocationMaster />,
      },
      {
        name: "Warehouse",
        key: "warehouse",
        icon: <Icon fontSize="small">foundation</Icon>,
        route: "/warehouse",
        component: <Warehouse />,
      },

      //Stock Upload
      {
        name: "Stock Upload",
        key: "Stockupload",
        icon: <Icon fontSize="small">view_in_ar</Icon>,
        route: "/Stockupload",
        component: <Stockupload />,
      },
      //Stock movement
      {
        name: "Stock Movement",
        key: "Stockmovement",
        icon: <Icon fontSize="small">view_in_ar</Icon>,
        route: "/Stockmovement",
        component: <Stock_movement_report />,
      },
      //Stock movement
      {
        name: "Batches",
        key: "batcheslist",
        icon: <Icon fontSize="small">view_in_ar</Icon>,
        route: "/batcheslist",
        component: <BatchesList />,
      },
      {
        name: "Stock Update",
        key: "stockpudate",
        icon: <Icon fontSize="small">view_in_ar</Icon>,
        route: "/stockupdate",
        component: <StockUpdate />,
      },
    ],
  },

  {
    type: "collapse",
    name: "Item Hierarchy",
    key: "item hierarchy",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      {
        name: "Item Department",
        key: "itemDeptMst",
        icon: <Icon fontSize="small">foundation</Icon>,
        route: "/itemDeptMst",
        component: <ItemDeptMst />,
      },
      {
        name: "Family ",
        key: "ItemFamMst",
        icon: <Icon fontSize="small">local_shipping</Icon>,
        route: "/ItemFamMst",
        component: <ItemFamMst />,
      },

      {
        name: "Sub Family ",
        key: "ItemSFamMst",
        icon: <Icon fontSize="small">person</Icon>,
        route: "/ItemSFamMst",
        component: <ItemSFamMst />,
      },
      {
        name: "Brand ",
        key: "itemBrandMst",
        icon: <Icon fontSize="small">foundation</Icon>,
        route: "/itemBrandMst",
        component: <ItemBrandMst />,
      },

      {
        name: "Size ",
        key: "sizemaster",
        icon: <Icon fontSize="small">event_available</Icon>,
        route: "/sizemaster",
        component: <Sizemaster />,
      },
      {
        name: "Item Color",
        key: "itemcolor",
        icon: <Icon fontSize="small">shopping_bag</Icon>,
        route: "/itemcolor",
        component: <Itemcolor />,
      },

      {
        name: "Item Category",
        key: "itemcate",
        icon: <Icon fontSize="small">text_snippet</Icon>,
        route: "/itemcate",
        component: <Itemcate />,
      },
    ],
  },

  {
    type: "collapse",
    name: "HR & Payroll",
    key: "hr",
    icon: <Icon fontSize="small">HR</Icon>,
    collapse: [
      {
        name: "Leave",
        key: "Leave_Master",
        icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
        route: "/leaves",
        component: <Leave_Master />,
      },

      {
        name: "Department",
        key: "DepartmentMaster",
        icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
        route: "/departments",
        component: <DepartmentMaster />,
      },
      {
        name: "Employees",
        key: "employee_department",
        icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
        route: "/employee",
        component: <EmployeeList />,
      },
      // {
      //   name: "Employees",
      //   key: "employee_department",
      //   icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
      //   route: "/employee",
      //   component: <EmployeeList />,
      // },

      // {
      //     key: "UserAttendancePage",
      //     name: "User Attendance Page",
      //     route: "/user/attendancepage",
      //     component: <UserAttendancePage />,
      //   },

      {
        name: "User Attendance Page",
        key: "UserAttendancePage",
        icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
        route: "/user/attendancepage",
        component: <UserAttendancePage />,
      },

      {
        name: "Pendig Approval",
        key: "managerpage",
        icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
        route: "/managerpage",
        component: <ManagerPage />,
      },
      {
        name: "Attendance",
        key: "payrollscreen",
        icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
        route: "/payrollscreen",
        component: <PayrollScreen />,
      },
      {
        name: "HR Payroll Settings",
        key: "HrPayrollSettings",
        icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
        route: "/hrpayrollsettings",
        component: <HrPayrollSettings />,
      },
      {
        name: "Payroll Process",
        key: "Payroll_process",
        icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
        route: "/payrollprocess",
        component: <PayrollProcess />,
      },
      // {
      //   name: "Payroll Process",
      //   key: "Payroll_process",
      //   icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
      //   route: "/payslipsandreports",
      //   component: <PayslipsAndReports />,
      // },

      // {
      //   name: "Department Family",
      //   key: "employee_fammst_List",
      //   icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
      //   route: "/emp_fm_list",
      //   component: <Empfm_list />,
      // },

      // {
      //   name: "Dept Sub Family",
      //   key: "employee_sub_fammst_list",
      //   icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
      //   route: "/emp_subfm_list",
      //   component: <Emp_sub_fm_list />,
      // },
    ],
  },
  {
    type: "collapse",
    name: "Setting",
    key: "setting",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      {
        name: "ERP Setting",
        key: "RegisterSetting",
        icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
        route: "/registersetting",
        component: <SettingsPage />,
      },
      {
        name: "ECom Setting",
        key: "EcomSettingE",
        icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
        route: "/ecom_setting",
        component: <Ecom_setting />,
      },

      {
        name: "Tax Setting",
        key: "tax_seeting",
        icon: <Icon fontSize="small">percent</Icon>,
        route: "/tax_setting_list",
        component: <Tax_setting_list />,
      },
      {
        name: "Currency Denomination",
        key: "CurrencyDenomination",
        icon: <Icon fontSize="small">security</Icon>, // report-related icon
        route: "/CurrencyDenomination",
        component: <CurrencyDenominationForm />,
      },
    ],
  },

  // Marketting Here

  // {
  //   type: "collapse",
  //   name: "MARKETING",
  //   key: "Marketing",
  //   icon: <Icon fontSize="small">M</Icon>,
  //   collapse: [
  //     {
  //       name: "Email Dashboard",
  //       key: "email_dashboard",
  //       icon: <Icon fontSize="small">E</Icon>, // Setting-related icon
  //       route: "/email_dashboard",
  //       component: <Email_dashboard />,
  //     },

  //     {
  //       key: "VideoAdvertisementPage",
  //       name: "Video Advertisemen",
  //       icon: <Icon fontSize="small">V</Icon>, // Setting-related icon
  //       route: "/videoadvertisementpage",
  //       component: <VideoAdvertisementPage />,
  //     },
  //     {
  //       key: "AdminAdMonitor",
  //       name: "AdminAdMonitor",
  //       icon: <Icon fontSize="small">V</Icon>, // Setting-related icon
  //       route: "/admin-ad-monitor",
  //       component: <AdminAdMonitor />,
  //     },
  //   ],
  // },

  {
    key: "EmailContacts",
    name: "Email Contacts",
    route: "/add/email/contacts",
    component: <EmailContacts />,
  },
  {
    key: "AssignContactsToCampaign",
    name: "Assign Contacts Campaign",
    route: "/campaigns/assign",
    component: <AssignContactsToCampaign />,
  },
  {
    key: "EmailContactsList",
    name: "Email Contacts List",
    route: "/email/contacts/list",
    component: <EmailContactsList />,
  },
  {
    key: "EmailCategoryManager",
    name: "Email Category Manager",
    route: "/email/categories",
    component: <EmailCategoryManager />,
  },
  {
    key: "EmailCampaign",
    name: "Email Campaign",
    route: "/campaigns/create",
    component: <EmailCampaign />,
  },
  {
    key: "EmailCampaignList",
    name: "Email Campaign List",
    route: "/campaigns",
    component: <EmailCampaignList />,
  },
  {
    key: "SendEmail",
    name: "Send Email",
    route: "/emails/send",
    component: <SendEmail />,
  },
  {
    key: "CampaignReport",
    name: "Campaign Report",
    route: "/reports/delivery",
    component: <CampaignReport />,
  },
  {
    key: "StoreClient",
    name: "Store Client",
    route: "/adds",
    component: <StoreClient />,
    layout: "plain", // 👈 IMPORTANT
  },

  {
    type: "collapse",
    name: "ECOM",
    key: "Ecom",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      {
        name: "ECom Setting",
        key: "EcomSetting",
        icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
        route: "/ecom_setting",
        component: <Ecom_setting />,
      },

      {
        name: "Ecom Order",
        key: "EcomOrder",
        icon: <Icon fontSize="small">percent</Icon>,
        route: "/Ecom_order",
        component: <EcomOrders />,
      },
      {
        name: "Ecom Payments",
        key: "EcomPayments",
        icon: <Icon fontSize="small">P</Icon>,
        route: "/ecom-payments",
        component: <Ecom_Payments />,
      },

      {
        name: "Price List Master",
        key: "Pricelist",
        icon: <Icon fontSize="small">view_in_ar</Icon>,
        route: "/pricelistmaster",
        component: <PriceListMaster />,
      },

      {
        name: "Banner Manager",
        key: "Banner Manager",
        icon: <Icon fontSize="small">B</Icon>,
        route: "/banner_manager",
        component: <BannerManager />,
      },
      {
        name: "Visibility Setting",
        key: "Visibility_Setting",
        icon: <Icon fontSize="small">V</Icon>,
        route: "/visibility_setting",
        component: <Visibility_Setting />,
      },
      // {
      //   name: "Phone Pay",
      //   key: "PhonePay",
      //   icon: <Icon fontSize="small">P</Icon>,
      //   route: "/phonepay",
      //   component: <PhonePay />,
      // },
      {
        name: "PayU Payment",
        key: "PayUPayment",
        icon: <Icon fontSize="small">P</Icon>,
        route: "/payUpayment",
        component: <PayUPayment />,
      },
    ],
  },

  {
    type: "collapse",
    name: "Accounts",
    key: "accounts",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      {
        name: "Payment",
        key: "payment",
        icon: <Icon fontSize="small">payment</Icon>,
        route: "/payment",
        component: <Payment />,
      },
    ],
  },

  {
    type: "collapse",
    name: "Other",
    key: "other",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      {
        name: "Payment",
        key: "payment",
        icon: <Icon fontSize="small">payment</Icon>,
        route: "/payment",
        component: <Payment />,
      },
      {
        name: "Create Table",
        key: "createtable",
        icon: <Icon fontSize="small">contacts</Icon>,
        route: "/createtable",
        component: <Add_Createtable />,
      },
      {
        name: "Report",
        key: "report",
        icon: <Icon fontSize="small">security</Icon>, // report-related icon
        route: "/report",
        component: <ReportPage />,
      },

      {
        name: "Role",
        key: "role",
        icon: <Icon fontSize="small">security</Icon>, // Role-related icon
        route: "/role",
        component: <Role />,
      },

      {
        name: "Setting",
        key: "setting",
        icon: <Icon fontSize="small">settings</Icon>, // Settings-related icon
        route: "/setting",
        component: <Setting />,
      },
      {
        name: "RTV",
        key: "Reutrntovendor",
        icon: <Icon fontSize="small">Report</Icon>, // report-related icon
        route: "/Reutrntovendor",
        component: <Rtv />,
      },
      {
        name: "Register Report",
        key: "RegisterReport",
        icon: <Icon fontSize="small">Report</Icon>, // report-related icon
        route: "/registerreport",
        component: <RegisterReport />,
      },
    ],
  },
  // from here completed
  // {
  //   type: "collapse",
  //   name: "POS",
  //   key: "pos",
  //   icon: <Icon fontSize="small">payment</Icon>,
  //   route: "/ManagePOS_CashFloat",
  //   component: <ManagePOS_CashFloat />,
  //   category: "POS",
  // },

  //Stock Distribution
  // {
  //   type: "collapse",
  //   name: "Stock Distribution",
  //   key: "stock",
  //   icon: <Icon fontSize="small">view_in_ar</Icon>,
  //   route: "/stock_distribution",
  //   component: <StockDistributor />,
  //   category: "Stock",
  // },
  //Module Master

  {
    name: "Order Reason Mapping",
    key: "ReasonMapping",
    // icon: <Icon fontSize="small">P</Icon>,
    route: "/ecom-order-reason-mapping",
    component: <ReasonMapping />,
  },
  {
    name: "Ecom Order Details",
    key: "EcomOrderDetails",
    // icon: <Icon fontSize="small">P</Icon>,
    route: "/ecom-order-details/:id",
    component: <Ecom_order_details />,
  },

  {
    key: "PriceListMaster",
    name: "Price List Details",
    route: "/price_list_master_detail",
    component: <Price_list_master_detail />,
  },
  {
    key: "PriceListMaster",
    name: "Add Price List",
    route: "/add_price_list_master",
    component: <AddPriceListMaster />,
  },
  {
    key: "PriceListMaster",
    name: "Edit Price List",
    route: "/price_list_master_edit/:id",
    component: <PriceListMasterEdit />,
  },
  {
    key: "PriceListMaster",
    name: "View Price List",
    route: "/price_list_master_view/:id",
    component: <PriceListMasterView />,
  },
  {
    key: "module",
    name: "Add Module",
    route: "/add_module_master",
    component: <Add_Module_Master />,
  },
  {
    key: "module",
    name: "Edit Module",
    route: "/edit_module_master",
    component: <Edit_Module_Master />,
  },
  {
    key: "module",
    name: "View Module",
    route: "/view_module_master/:id",
    component: <View_Module_Master />,
  },

  //sub_Module_Master

  {
    key: "module",
    name: "Add Sub Module",
    route: "/add_sub_module_master",
    component: <Add_Sub_Module_Master />,
  },
  {
    key: "module",
    name: "Edit Sub Module",
    route: "/edit_sub_module_master",
    component: <Edit_Sub_Module_Master />,
  },
  {
    key: "module",
    name: "View Sub Module",
    route: "/view_sub_module_master/:id",
    component: <View_Sub_Module_Master />,
  },

  {
    key: "module",
    name: "Add Function",
    route: "/add_function_master",
    component: <Add_Function_Master />,
  },
  {
    key: "module",
    name: "Edit Function",

    route: "/edit_function_master",
    component: <Edit_Function_Master />,
  },
  {
    key: "module",
    name: "View Function",
    route: "/view_function_master/:id",
    component: <View_Function_Master />,
  },

  {
    key: "module",
    name: "Add Role",
    route: "/add_role_master",
    component: <Add_Role_Master />,
  },
  {
    key: "module",
    name: "Edit Role",
    route: "/edit_role_master",
    component: <Edit_Role_Master />,
  },
  {
    key: "module",
    name: "View Role",
    route: "/view_role_master/:id",
    component: <View_Role_Master />,
  },
  // {
  //   key: "module",
  //   route: "/test",
  //   component: <Test />,
  // },
  // {
  //   key: "module",
  //   route: "/view_function_master",
  //   component: <View_Function_Master />,
  // },

  // {
  //   type: "collapse",
  //   name: "Customer",
  //   key: "customer",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/customer",
  //   component: <Customer />,
  // },

  // {
  //   type: "collapse",
  //   name: "Users & Roles",
  //   key: "users",
  //   icon: <Icon fontSize="small">group</Icon>,
  //   route: "/users",
  //   component: <User_Roles />,
  // },

  // {
  //   type: "collapse",
  //   name: "Master Data Download",
  //   key: "master-download",
  //   icon: <Icon fontSize="small">download</Icon>,
  //   route: "/master-download",
  //   component: <Master_Data_Download />,
  // },
  // {
  //   type: "collapse",
  //   name: "Custom Fields",
  //   key: "custom-fields",
  //   // icon: <Icon fontSize="small">person</Icon>,
  //   route: "/custom-fields",
  //   component: <Custom_Fields />,
  // },
  // {
  //   type: "collapse",
  //   name: "General Settings",
  //   key: "general-range",
  //   // icon: <Icon fontSize="small">person</Icon>,
  //   route: "/general-range",
  //   component: <General_Settings />,
  // },
  // {
  //   type: "collapse",
  //   name: "Work Flow Approval",
  //   key: "work-flow",
  //   // icon: <Icon fontSize="small">person</Icon>,
  //   route: "/work-flow",
  //   component: <Workflow_Rules />,
  // },
  // {
  //   type: "collapse",
  //   name: "Templates",
  //   key: "templates",
  //   // icon: <Icon fontSize="small">person</Icon>,
  //   route: "/templates",
  //   component: <Templates />,
  // },
  // {
  //   type: "collapse",
  //   name: "Activity Profile",
  //   key: "activity-profile",
  //   // icon: <Icon fontSize="small">person</Icon>,
  //   route: "/activity-profile",
  //   component: <Activity_Profile />,
  // },
  // {
  //   type: "collapse",
  //   name: "Theme",
  //   key: "theme",
  //   // icon: <Icon fontSize="small">person</Icon>,
  //   route: "/theme",
  //   component: <Theme />,
  // },
  // {
  //   type: "collapse",
  //   name: "Portal",
  //   key: "clientport",
  //   // icon: <Icon fontSize="small">person</Icon>,
  //   route: "/clientport",
  //   component: <Portal />,
  // },
  // {
  //   type: "collapse",
  //   name: "Reason",
  //   key: "reason",
  //   icon: <Icon fontSize="small">foundation</Icon>,
  //   route: "/reason",
  //   component: <Reason />,
  // },
  // {
  //   type: "collapse",
  //   name: "Bank",
  //   key: "bank",
  //   icon: <Icon fontSize="small">account_balance</Icon>,
  //   route: "/bank",
  //   component: <Bank />,
  // },
  // {
  //   type: "collapse",
  //   name: "Currency",
  //   key: "currency",
  //   icon: <Icon fontSize="small">attach_money</Icon>,
  //   route: "/currency",
  //   component: <Currency />,
  //   category: "Master",
  // },

  // {
  //   type: "collapse",
  //   name: "Item Batch",
  //   key: "item-batch",
  //   icon: <Icon fontSize="small">view_in_ar</Icon>,
  //   route: "/item-batch",
  //   component: <Item_Batch />,
  // },
  // {
  //   type: "collapse",
  //   name: "JDE Config",
  //   key: "jd-version-config",
  //   icon: <Icon fontSize="small">view_in_ar</Icon>,
  //   route: "/jd-version-config",
  //   component: <JDE_Config />,
  // },
  // {
  //   type: "collapse",
  //   name: "Country",
  //   key: "country",
  //   icon: <Icon fontSize="small">public</Icon>,
  //   route: "/country",
  //   component: <Country />,
  // },
  // {
  //   type: "collapse",
  //   name: "Region",
  //   key: "region",
  //   icon: <Icon fontSize="small">signpost</Icon>,
  //   route: "/region",
  //   component: <Region />,
  // },
  // {
  //   type: "collapse",
  //   name: "Branch/Depot",
  //   key: "depot",
  //   icon: <Icon fontSize="small">foundation</Icon>,
  //   route: "/depot",
  //   component: <Branch_Depot />,
  // },
  // {
  //   type: "collapse",
  //   name: "VanMaster",
  //   key: "van",
  //   icon: <Icon fontSize="small">foundation</Icon>,
  //   route: "/van",
  //   component: <VanMaster />,
  // },
  // {
  //   type: "collapse",
  //   name: "Route",
  //   key: "route",
  //   icon: <Icon fontSize="small">map</Icon>,
  //   route: "/route",
  //   component: <RouteMaster />,
  // },
  // {
  //   type: "collapse",
  //   name: "Credit Limits",
  //   key: "credit-limits",
  //   icon: <Icon fontSize="small">credit_card</Icon>,
  //   route: "/credit-limits",
  //   component: <Credit_Limits />,
  // },
  // {
  //   type: "collapse",
  //   name: "Outlet Product Code",
  //   key: "outlet-product-code",
  //   icon: <Icon fontSize="small">description</Icon>,
  //   route: "/outlet-product-code",
  //   component: <Outlet_product />,
  // },
  // {
  //   type: "collapse",
  //   name: "Item Group",
  //   key: "item-group",
  //   icon: <Icon fontSize="small">add_box</Icon>,
  //   route: "/item-group",
  //   component: <ItemGroup />,
  // },

  // {
  //   type: "collapse",
  //   name: "Variant",
  //   key: "variant",
  //   icon: <Icon fontSize="small">view_week</Icon>,
  //   route: "/variant",
  //   component: <ItemVariant />,
  // },
  // {
  //   type: "collapse",
  //   name: "Class",
  //   key: "class",
  //   icon: <Icon fontSize="small">group</Icon>,
  //   route: "/class",
  //   component: <ItemClass />,
  // },
  // // {
  // //   type: "collapse",
  // //   name: "Master",
  // //   key: "master",
  // //   route: "/master",
  // //   component: <Master />,
  // // },

  // {
  //   key: "PrintBarcode",
  //   name: "PrintBarcode",
  //   route: "/print/barcode",
  //   component: <Barcodes />,
  // },
  {
    key: "PrintBarcode",
    name: "PrintBarcode",
    route: "/print/barcode",
    component: <PrintBarcode />,
  },

  {
    key: "view-items",
    name: "View Item Location Master",
    route: "/itemlocmaster/view/:id",
    component: <ViewItemLocationMaster />,
  },
  {
    key: "edit-items",
    name: "Edit Item Location Master",
    route: "/itemlocmaster/edit/:id",
    component: <EditItemLocationMaster />,
  },
  {
    key: "Image-Uplaod-items",
    name: "Image Upload",
    route: "/itemlocmaster/image/:id",
    component: <ImageUpload />,
  },

  // {
  //   type: "collapse",
  //   name: "Item Family Department",
  //   key: "ItemFamDep",
  //   icon: <Icon fontSize="small">cases</Icon>,
  //   route: "/ItemFamDep",
  //   component: <Add_ItemFamDep />,
  // },

  // {
  //   type: "collapse",
  //   name: "Journey Plans",
  //   key: "Journey Plans",
  //   icon: <Icon fontSize="small">layers</Icon>,
  //   route: "/journey-plan",
  //   component: <Journey_Plans />,
  // },
  // {
  //   type: "collapse",
  //   name: "Promotion",
  //   key: "promotion",
  //   icon: <Icon fontSize="small">redeem</Icon>,
  //   route: "/promotion",
  //   component: <Promotion />,
  // },
  // {
  //   type: "collapse",
  //   name: "Pricing",
  //   key: "pricing",
  //   icon: <Icon fontSize="small">attach_money</Icon>,
  //   route: "/pricing",
  //   component: <Pricing />,
  // },
  // {
  //   type: "collapse",
  //   name: "Discount",
  //   key: "discount",
  //   icon: <Icon fontSize="small">percent</Icon>,
  //   route: "/discount",
  //   component: <Discount />,
  // },
  // {
  //   type: "collapse",
  //   name: "Rebate",
  //   key: "rebate",
  //   icon: <Icon fontSize="small">card_membership</Icon>,
  //   route: "/rebate",
  //   component: <Rebate />,
  // },
  // {
  //   type: "collapse",
  //   name: "Listing Fee",
  //   key: "listing-fee",
  //   icon: <Icon fontSize="small">card_membership</Icon>,
  //   route: "/listing-fee",
  //   component: <Listing_Fee />,
  // },
  // {
  //   type: "collapse",
  //   name: "Shelf Rent",
  //   key: "shelf-rent",
  //   icon: <Icon fontSize="small">card_membership</Icon>,
  //   route: "/shelf-rent",
  //   component: <Shelf_Rent />,
  // },

  // {
  //   type: "collapse",
  //   name: "Tax Setting",
  //   key: "tax_seeting",
  //   icon: <Icon fontSize="small">percent</Icon>,
  //   route: "/tax_setting",
  //   component: <TaxSettingsForm />,
  //   category: "Master",
  // },
  {
    key: "add-tax",
    name: "Tax Settings Form",
    route: "/master/tax_settings",
    component: <TaxSettingsForm />,
  },

  {
    key: "vendor",
    name: "Add Vendor",
    route: "/vendors/add",
    component: <AddVendor />,
  },
  {
    key: "vendor",
    name: "Edit Vendor",
    route: "/vendors/edit/:id",
    component: <EditVendor />,
  },
  {
    key: "vendor",
    name: "View Vendor",
    route: "/vendors/view/:id",
    component: <ViewVendor />,
  },

  // {
  //   type: "collapse",
  //   name: "User",
  //   key: "User",
  //   icon: <Icon fontSize="small">person</Icon>, // User-related icon
  //   route: "/user",
  //   component: <User />,
  // },

  // {
  //   type: "collapse",
  //   name: "Item",
  //   key: "item",
  //   icon: <Icon fontSize="small">shopping_bag</Icon>,
  //   route: "/item",
  //   component: <Item />,
  // },

  // {
  //   type: "collapse",
  //   name: "Delivery",
  //   key: "delivery",
  //   icon: <Icon fontSize="small">local_shipping</Icon>,
  //   route: "/delivery",
  //   component: <Delivery />,
  // },

  // {
  //   type: "collapse",
  //   name: "Table",
  //   key: "Table",
  //   icon: <Icon fontSize="small">text_snippet</Icon>,
  //   route: "/table",
  //   component: <Table />,
  // },
  // {
  //   type: "collapse",
  //   name: "Credit Note",
  //   key: "credit-note",
  //   icon: <Icon fontSize="small">credit_card</Icon>,
  //   route: "/credit-note",
  //   component: <Credit_Notes />,
  // },
  // {
  //   type: "collapse",
  //   name: "Debit Note",
  //   key: "debit-note",
  //   icon: <Icon fontSize="small">credit_card</Icon>,
  //   route: "/debit-note",
  //   component: <Debit_Notes />,
  // },
  // {
  //   type: "collapse",
  //   name: "Collection",
  //   key: "collection",
  //   icon: <Icon fontSize="small">event_available</Icon>,
  //   route: "/collection",
  //   component: <Collection />,
  // },
  // {
  //   type: "collapse",
  //   name: "Route Item Grouping",
  //   key: "route-item-group",
  //   icon: <Icon fontSize="small">layers</Icon>,
  //   route: "/route-item-group",
  //   component: <Route_item_group />,
  // },
  // {
  //   type: "collapse",
  //   name: "Portfolio",
  //   key: "portfolio-management",
  //   icon: <Icon fontSize="small">contacts</Icon>,
  //   route: "/portfolio-management",
  //   component: <Portfolio_Management />,
  //   category: "Master",
  // },

  // {
  //   type: "collapse",
  //   name: "Salesman Load",
  //   key: "salesman-load",
  //   icon: <Icon fontSize="small">local_shipping</Icon>,
  //   route: "/salesman-load",
  //   component: <Salesman_load />,
  // },
  // {
  //   type: "collapse",
  //   name: "Load Request",
  //   key: "load-request",
  //   icon: <Icon fontSize="small">local_shipping</Icon>,
  //   route: "/load-request",
  //   component: <Load_Request />,
  // },
  // {
  //   type: "collapse",
  //   name: "Salesman Unload",
  //   key: "salesman-unload",
  //   icon: <Icon fontSize="small">local_shipping</Icon>,
  //   route: "/salesman-unload",
  //   component: <Salesman_Unload />,
  // },
  // {
  //   type: "collapse",
  //   name: "Van to Van Transfer",
  //   key: "van-to-van-transfer",
  //   icon: <Icon fontSize="small">local_shipping</Icon>,
  //   route: "/van-to-van-transfer",
  //   component: <Van_To_Van_Transfer />,
  // },

  // {
  //   type: "collapse",
  //   name: "Report",
  //   key: "report",
  //   icon: <Icon fontSize="small">security</Icon>, // report-related icon
  //   route: "/report",
  //   component: <Report />,
  //   category: "Report",
  // },

  {
    key: "module",
    name: "Order Report",
    route: "/order-report",
    component: <OrderReport />,
  },

  // {
  //   type: "collapse",
  //   name: "POS",
  //   key: "pos",
  //   icon: <Icon fontSize="small">payment</Icon>,
  //   route: "/pos",
  //   component: <Pos />,
  //   category: "POS",
  // },
  // {
  //   type: "collapse",
  //   name: "POS",
  //   key: "pos",
  //   icon: <Icon fontSize="small">payment</Icon>,
  //   route: "/pos",
  //   component: <Pos />,
  //   category: "POS",
  // },

  // {
  //   type: "collapse",
  //   name: "Cashier Reciept",
  //   key: "cashier-reciept",
  //   icon: <Icon fontSize="small">text_snippet</Icon>,
  //   route: "/cashier-reciept",
  //   component: <Cashier_Reciept />,
  // },
  // {
  //   type: "collapse",
  //   name: "PDC",
  //   key: "pdc",
  //   icon: <Icon fontSize="small">edit_note</Icon>,
  //   route: "/pdc",
  //   component: <PDC />,
  // },
  // {
  //   type: "collapse",
  //   name: "Session Endorsement",
  //   key: "session",
  //   icon: <Icon fontSize="small">thumb_up_off_alt</Icon>,
  //   route: "/session",
  //   component: <Session_Endorsement />,
  // },
  // {
  //   type: "collapse",
  //   name: "Sales Target",
  //   key: "sales-target",
  //   icon: <Icon fontSize="small">crisis_alert</Icon>,
  //   route: "/sales-target",
  //   component: <Sales_Target />,
  // },
  // {
  //   type: "collapse",
  //   name: "Target Commission",
  //   key: "target-comission",
  //   icon: <Icon fontSize="small">crisis_alert</Icon>,
  //   route: "/target-comission",
  //   component: <Target_Commission />,
  // },
  // {
  //   type: "collapse",
  //   name: "Expense",
  //   key: "expense",
  //   icon: <Icon fontSize="small">money</Icon>,
  //   route: "/expense",
  //   component: <Expense />,
  // },
  // {
  //   type: "collapse",
  //   name: "Reports",
  //   key: "reports",
  //   icon: <Icon fontSize="small">text_snippet</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  {
    // type: "collapse",
    // name: "Sign In",
    key: "sign-in",
    name: "Sign In",
    // icon: <Icon fontSize="small">login</Icon>,
    route: "/auth/login",
    component: <SignIn />,
  },
  {
    // type: "collapse",
    // name: "Sign Up",
    key: "sign-up",
    name: "Sign Up",
    // icon: <Icon fontSize="small">assignment</Icon>,
    route: "/auth/signup",
    component: <SignUp />,
  },
  {
    route: "/auth/forget",
    name: "Forgot",
    component: <Forget />,
  },

  //Add new pages route
  {
    key: "add-new",
    name: "Add New Customer",
    route: "/master/customer",
    component: <Addnew />,
  },
  //////////////////////////
  {
    key: "Payslip",
    name: "Payslip",
    route: "/payslip",
    component: <Payslip />,
  },
  {
    key: "SalaryRegister",
    name: "Salary Register",
    route: "/salary-register",
    component: <SalaryRegister />,
  },
  {
    key: "Emp_dashboard",
    name: "Emp Dashboard",
    route: "/employee",
    component: <Emp_dashboard />,
  },

  {
    key: "leave",
    name: "New Leave",
    route: "/new-leave",
    component: <NewLeave />,
  },
  {
    key: "earnings-Calculation",
    name: "Earnings Calculation",
    route: "/payroll/earnings-calculation",
    component: <EarningsCalculation />,
  },
  {
    key: "deductions",
    name: "Deductions",
    route: "/payroll/deductions",
    component: <Deductions />,
  },
  // {
  //   key: "add-bank",
  //   route: "/master/bank",
  //   component: <AddBank />,
  // },
  {
    key: "add-tax",
    name: "Add Tax",
    route: "/master/tax",
    component: <AddTax />,
  },
  // {
  //   key: "add-reason",
  //   route: "/master/reason",
  //   component: <AddReason />,
  // },
  // {
  //   key: "add-currency",
  //   route: "/master/currency",
  //   component: <AddCurrency />,
  // },
  {
    key: "add-state",
    name: "Add State",
    route: "/master/state",
    component: <AddState />,
  },
  {
    key: "add-country",
    name: "Add Country",
    route: "/master/country",
    component: <Addcountry />,
  },
  {
    key: "add-city",
    name: "Add City",
    route: "/master/city",
    component: <AddCity />,
  },
  {
    key: "add-warehouse",
    name: "Add Warehouse",
    route: "/master/warehouse",
    component: <AddWarehouse />,
  },
  {
    key: "add-location",
    name: "Add Location",
    route: "/master/location",
    component: <AddLocation />,
  },
  {
    key: "add-comapany",
    name: "Add Comapany",
    route: "/master/company",
    component: <AddComapany />,
  },
  // {
  //   key: "add-country",
  //   route: "/master/country",
  //   component: <AddCountry />,
  // },
  // {
  //   key: "add-region",
  //   route: "/master/region",
  //   component: <AddRegion />,
  // },
  // {
  //   key: "add-branch",
  //   route: "/master/branch",
  //   component: <AddBranch />,
  // },
  // {
  //   key: "add-van",
  //   route: "/master/van",
  //   component: <AddVanMaster />,
  // },
  // {
  //   key: "add-route",
  //   route: "/master/route",
  //   component: <AddRoute />,
  // },
  // {
  //   key: "add-outlet-product",
  //   route: "/master/outlet-product",
  //   component: <AddOutlet_product />,
  // },
  // {
  //   key: "add-item-group",
  //   route: "/master/item-group",
  //   component: <AddItemGroup />,
  // },
  {
    key: "add-item-uom",
    name: "Add Item UOM",
    route: "/master/item-uom",
    component: <AddItemUOM />,
  },
  // {
  //   key: "add-listing-fee",
  //   route: "/master/listing-fee",
  //   component: <AddListing_Fee />,
  // },
  // {
  //   key: "add-shelf-rent",
  //   route: "/master/shelf-rent",
  //   component: <AddShelf_rent />,
  // },
  // {
  //   key: "add-invite-user",
  //   route: "/master/users",
  //   component: <Invite_user />,
  // },
  // {
  //   key: "route-item-group",
  //   route: "/master/route-item-group",
  //   component: <AddRoute_item_group />,
  // },
  {
    key: "portfolio",
    name: "Add Portfolio Management",
    route: "/master/portfolio-management",
    component: <AddPortfolio_management />,
  },
  // {
  //   key: "expense",
  //   route: "/master/expense",
  //   component: <Add_Expense />,
  // },
  // {
  //   key: "target-comission",
  //   route: "/master/target-comission",
  //   component: <Add_Target_Commission />,
  // },
  {
    key: "item",
    name: "Add Item",
    route: "/master/item",
    component: <Add_Item />,
  },
  {
    key: "Zebra Barcode",
    name: "Zebra Barcode Printer",

    route: "/item/barcodeprinter/:id",
    component: <ZebraBarcodePrinter />,
  },

  {
    key: "ItemFamMst",
    name: "Add ItemFamDep",

    route: "/master/ItemFamMst",
    component: <Add_ItemFamDep />,
  },
  {
    key: "itemcate",
    name: "Add Itemcate",

    route: "/master/itemcate",
    component: <Add_Itemcate />,
  },
  {
    key: "itemcolor",
    name: "Add Itemcolor",

    route: "/master/itemcolor",
    component: <Add_Itemcolor />,
  },
  {
    key: "itemdepart",
    name: "Add Itemdepart",

    route: "/master/ItemDeptMst",
    component: <Add_Itemdepart />,
  },
  {
    key: "sizemaster",
    name: "Add Sizemaster",

    route: "/master/sizemaster",
    component: <Add_Sizemaster />,
  },
  {
    key: "setting",
    name: "Add Setting",

    route: "/master/setting",
    component: <Add_Setting />,
  },
  {
    key: "change-password",
    name: "Change Password",

    route: "/change-password",
    component: <Change_Password />,
  },
  {
    key: "supplier",
    name: "Add Supplier",

    route: "/master/supplier",
    component: <Add_supplier />,
  },

  // {
  //   key: "journey-plan",
  //   route: "/master/journey-plan/add",
  //   component: <Add_Journey_plans />,
  // },
  {
    key: "salesman",
    name: "Add Salesman",

    route: "/master/salesman",
    component: <Add_Salesman />,
  },
  {
    key: "salesman",
    name: "Cash Float Setup",

    route: "/master/cashfloat",
    component: <CashFloatSetup />,
  },
  {
    key: "payment",
    name: "Payment",

    route: "/payment",
    component: <Payment />,
  },
  {
    key: "add-payment",
    name: "Add Payments",

    route: "/master/payment",
    component: <Add_Payments />,
  },
  {
    key: "add-role",
    name: "Add Role",

    route: "/master/role",
    component: <Add_Role />,
  },
  // {
  //   key: "promotion",
  //   route: "/master/promotion",
  //   component: <Add_Promotion />,
  // },
  // {
  //   key: "pricing",
  //   route: "/master/pricing",
  //   component: <Add_Pricing />,
  // },
  // {
  //   key: "discount",
  //   route: "/master/discount",
  //   component: <Add_Discount />,
  // },
  // {
  //   key: "rebate",
  //   route: "/master/rebate/add",
  //   component: <Add_Rebate />,
  // },
  // {
  //   key: "salesman-load",
  //   route: "/master/salesman-load/add",
  //   component: <Add_Salesman_load />,
  // },
  // {
  //   key: "load-request",
  //   route: "/master/load-request/add",
  //   component: <Add_load_Request />,
  // },
  // {
  //   key: "pdc",
  //   route: "/master/pdc/add",
  //   component: <Add_PDC />,
  // },
  // {
  //   key: "collection",
  //   route: "/master/collection/add",
  //   component: <Add_Collections />,
  // },

  {
    key: "grn",
    name: "Add GRN",

    route: "/master/grn/add",
    component: <Add_GRN />,
  },
  {
    key: "view-grn",
    name: "Add Extra Cost",

    route: "/grn/addcost/:id",
    component: <Addextracost />,
  },

  // {
  //   key: "cashier-reciept",
  //   route: "/master/cashier-reciept/add",
  //   component: <Add_Cashier_Reciept />,
  // },
  // {
  //   key: "credit-note",
  //   route: "/master/credit-note/add",
  //   component: <Add_Credit_Notes />,
  // },
  {
    key: "invoice",
    name: "Add Invoice",
    route: "/master/invoice/add",
    component: <Add_Invoice />,
  },
  {
    key: "delivery",
    name: "Add Delivery",
    route: "/master/delivery/add",
    component: <Add_Delivery />,
  },
  {
    key: "order",
    name: "Add Orders",

    route: "/master/order/add",
    component: <Add_Orders />,
  },
  {
    key: "purchaseorder",
    name: "Add Po",

    route: "/master/purchaseorder/add",
    component: <Add_Po />,
  },
  {
    key: "debit-note",
    name: "Add Debit Notes",

    route: "/master/debit-note/add",
    component: <Add_Debit_Notes />,
  },
  {
    key: "add-role",
    name: "Add Role",

    route: "/master/role",
    component: <AddRole />,
  },
  {
    key: "add-itemBrandMst",
    name: "Add Item Brand Mst",

    route: "/master/itemBrandMst",
    component: <Add_ItemBrandMst />,
  },
  {
    key: "ItemSFamMst",
    name: "Edit Item SFam Mst",

    route: "/ItemSFamMst/edit/:id",
    component: <Edit_ItemSFamMst />,
  },
  {
    key: "edit-payment",
    name: "Edit Payments",

    route: "/payment/edit/:id",
    component: <Edit_Payments />,
  },
  {
    key: "ItemSFamMst",
    name: "Add Ite SFam Mst",

    route: "/master/ItemSFamMst",
    component: <Add_ItemSFamMst />,
  },
  {
    key: "add-uservansal",
    name: "Add Uservansal",

    route: "/master/uservansal",
    component: <Add_Uservansal />,
  },

  {
    key: "add-workflow",
    name: "Add Workflow",

    route: "/master/workflow",
    component: <Add_Workflow />,
  },
  {
    key: "add-activity-profile",
    name: "Add Activity",

    route: "/master/add-activity-profile",
    component: <Add_Activity />,
  },

  {
    key: "van-to-van-transfer",
    name: "Add VanToVan Transfer",

    route: "/master/van-to-van-transfer/add",
    component: <Add_VanToVan_Transfer />,
  },

  {
    key: "add-jd-version-config",
    name: "Add JDE Config",

    route: "/master/jd-version-config",
    component: <Add_JDE_Config />,
  },

  //Edit files route
  {
    key: "edit-customer",
    name: "Edit Customer",

    route: "/customer/edit/:id",
    component: <EditNew />,
  },
  {
    key: "edit-itemBrandMst",
    name: "Edit Item Brand Mst",

    route: "/itemBrandMst/edit/:id",
    component: <EditItemBrandMst />,
  },
  {
    key: "edit-item",
    name: "Edit Item",

    route: "/item/edit/:id",
    component: <Edit_Item />,
  },

  {
    key: "edit-itemDeptMst",
    name: "Edit Item Dept Mst",

    route: "/itemDeptMst/edit/:id",
    component: <Edit_itemDeptMst />,
  },
  {
    key: "edit-itemcolor",
    name: "Edit Item Color",

    route: "/itemcolor/edit/:id",
    component: <Edit_Itemcolor />,
  },
  {
    key: "edit-itemcate",
    name: "Edit Itemcate",

    route: "/itemcate/edit/:id",
    component: <Edit_itemcate />,
  },
  {
    key: "edit-sizemaster",
    name: "Edit Sizemaster",

    route: "/sizemaster/edit/:id",
    component: <Edit_Sizemaster />,
  },
  {
    key: "edit-setting",
    name: "Edit Setting",

    route: "/setting/edit/:id",
    component: <Edit_Setting />,
  },
  {
    key: "edit-supplier",
    name: "Edit Supplier",

    route: "/supplier/edit/:id",
    component: <Edit_supplier />,
  },
  {
    key: "edit-ItemFamMst",
    name: "Edit Item Fm",

    route: "/ItemFamMst/edit/:id",
    component: <EditItemFm />,
  },
  {
    key: "edit-salesman",
    name: "Edit Salesman",

    route: "/salesman/edit/:id",
    component: <Edit_Salesman />,
  },
  {
    key: "edit-journey-plans",
    name: "Edit Journey Plans",

    route: "/journey-plans/edit/:id",
    component: <Edit_Journey_plans />,
  },
  {
    key: "sdsdsd",
    name: "Table",

    route: "/table/:id",
    component: <Table />,
  },
  {
    key: "edit-promotion",
    name: "Edit Promotion",
    route: "/promotion/edit/:id",
    component: <Edit_Promotion />,
  },
  {
    key: "edit-promotion",
    name: "Edit Invoice",
    route: "/invoice/edit/:id",
    component: <Edit_Invoice />,
  },
  {
    key: "edit-promotion",
    name: "Edit Invoice (Alt)",
    route: "/invoice/edit_invoice/:id",
    component: <Edit_invoice />,
  },
  {
    key: "edit-pricing",
    name: "Edit Pricing",
    route: "/pricing/edit/:id",
    component: <Edit_Pricing />,
  },
  {
    key: "edit-discount",
    name: "Edit Discount",
    route: "/discount/edit/:id",
    component: <Edit_Discount />,
  },
  {
    key: "edit-order",
    name: "Edit Order",
    route: "/order/edit/:id",
    component: <Edit_Orders />,
  },
  {
    key: "edit-purchaseorder",
    name: "Edit Purchase Order",
    route: "/purchaseorder/edit/:id",
    component: <Edit_Po />,
  },
  {
    key: "edit-role",
    name: "Edit Role",
    route: "/role/edit/:id",
    component: <Edit_Role />,
  },
  {
    key: "view-order",
    name: "View Order",
    route: "/order/view/:id",
    component: <View_Orders />,
  },
  {
    key: "view-items",
    name: "Item Master",
    route: "/item/view/:id",
    component: <View_Items />,
  },
  {
    key: "view-itemDeptMst",
    name: "View Item Department",
    route: "/itemDeptMst/view/:id",
    component: <View_itemDeptMst />,
  },
  {
    key: "view-itemBrandMst",
    name: "View Item Brand",
    route: "/itemBrandMst/view/:id",
    component: <View_ItemBrandMst />,
  },
  {
    key: "view-salesman",
    name: "View Salesman",
    route: "/salesman/view/:id",
    component: <View_Salesman />,
  },
  {
    key: "view-salesman",
    name: "View Item UOM",
    route: "/master/item-uom/view/:id",
    component: <View_ItemUOM />,
  },

  {
    key: "view-tax",
    name: "View Tax",
    route: "/master/tax/view/:id",
    component: <View_Tax />,
  },

  {
    key: "view-supplier",
    name: "View Supplier",
    route: "/supplier/view/:id",
    component: <View_supplier />,
  },
  {
    key: "view-customer",
    name: "View Customer",
    route: "/customer/view/:id",
    component: <View_New />,
  },

  {
    key: "view-Role",
    name: "View Role",
    route: "/role/view/:id",
    component: <View_Role />,
  },
  {
    key: "ItemSFamMst",
    name: "View Item Sub Family",
    route: "/ItemSFamMst/view/:id",
    component: <View_ItemSFamMst />,
  },
  {
    key: "view-itemcate",
    name: "View Item Category",
    route: "/itemcate/view/:id",
    component: <View_itemcate />,
  },
  {
    key: "view-itemcolor",
    name: "View Item Color",
    route: "/itemcolor/view/:id",
    component: <View_Itemcolor />,
  },
  {
    key: "view-ItemFamMst",
    name: "View Item Family",
    route: "/ItemFamMst/view/:id",
    component: <View_ItemFm />,
  },
  {
    key: "view-sizemaster",
    name: "View Size Master",
    route: "/sizemaster/view/:id",
    component: <View_Sizemaster />,
  },
  {
    key: "view-setting",
    name: "View Settings",
    route: "/setting/view/:id",
    component: <View_Setting />,
  },
  {
    key: "view-invoice",
    name: "View Invoice",
    route: "/invoice/view/:id",
    component: <View_Invoice />,
  },
  {
    key: "view-grn",
    name: "View GRN",
    route: "/grn/view/:id",
    component: <View_GRN />,
  },
  {
    key: "view-payment",
    name: "View Payment",
    route: "/payment/view/:id",
    component: <View_Payments />,
  },
  {
    key: "view-uservansal",
    name: "View Uservansal",
    route: "/uservansal/view/:id",
    component: <View_Uservansal />,
  },
  // {
  //   key: "view-currency",
  //   route: "master/currency/view/:id",
  //   component: <View_Currency />,
  // },
  {
    key: "view-state",
    name: "View State",

    route: "master/state/view/:id",
    component: <View_State />,
  },
  {
    key: "view-country",
    name: "View Country",

    route: "master/country/view/:id",
    component: <View_Country />,
  },
  {
    key: "view-city",
    name: "View City",

    route: "master/city/view/:id",
    component: <View_City />,
  },
  {
    key: "view-warehouse",
    name: "View Warehouse",

    route: "master/warehouse/view/:id",
    component: <View_Warehouse />,
  },
  {
    key: "view-location",
    name: "View location",

    route: "master/location/view/:id",
    component: <View_location />,
  },
  {
    key: "view-comapany",
    name: "View Comapany",
    route: "master/company/view/:id",
    component: <View_comapany />,
  },
  {
    key: "view-purchaseorder",
    name: "View Purchase Order",
    route: "/purchaseorder/view/:id",
    component: <View_Orders_po />,
  },
  {
    key: "generate-invoice",
    name: "Generate Invoice",
    route: "/order/generate_invoice/:id",
    component: <Generate_Invoice />,
  },
  {
    key: "generate-invoice-po",
    name: "Generate PO Invoice",
    route: "/purchaseorder/generate_invoice-po/:id",
    component: <Generate_Invoice_po />,
  },
  {
    key: "edit-delivery",
    name: "Edit Delivery",
    route: "/delivery/edit/:id",
    component: <Edit_Delivery />,
  },
  {
    key: "edit-credit-note",
    name: "Edit Credit Notes",
    route: "/credit-note/edit/:id",
    component: <Edit_Credit_Notes />,
  },
  {
    key: "edit-debit-note",
    name: "Edit Debit Notes",
    route: "/debit-note/edit/:id",
    component: <Edit_Debit_Notes />,
  },
  {
    key: "edit-route-item-group",
    name: "Edit Route Item Group",
    route: "/route-item-group/edit/:id",
    component: <EditRoute_item_group />,
  },
  {
    key: "edit-portfolio",
    name: "Edit Portfolio Management",
    route: "/portfolio/edit/:id",
    component: <EditPortfolio_management />,
  },
  {
    key: "edit-load-request",
    name: "Edit Load Request",
    route: "/load-request/edit/:id",
    component: <Edit_load_Request />,
  },
  {
    key: "edit-grn",
    name: "Edit GRN",
    route: "/grn/edit/:id",
    component: <Edit_GRN />,
  },
  {
    key: "edit-grn",
    name: "RTV Grn",
    route: "/grn/rtv/:id",
    component: <Rtv_grn />,
  },
  {
    key: "edit-pdc",
    name: "Edit PDC",
    route: "/pdc/edit/:id",
    component: <Edit_PDC />,
  },
  {
    key: "edit-uservansal",
    name: "Edit Uservansal",
    route: "/uservansal/edit/:id",
    component: <Edit_Uservansal />,
  },
  {
    key: "edit-target",
    name: "Edit Target Commission",
    route: "/target/edit",
    component: <Edit_Target_Commission />,
  },
  {
    key: "edit-tax",
    name: "Edit Tax",
    route: "/master/tax/edit/:id",
    component: <EditTax />,
  },
  {
    key: "edit-reason",
    name: "Edit Reason",
    route: "/master/reason/edit/:id",
    component: <EditReason />,
  },
  {
    key: "edit-bank",
    name: "Edit Bank",
    route: "/master/bank/edit/:id",
    component: <EditBank />,
  },
  // {
  //   key: "edit-currency",
  //   route: "/master/currency/edit/:id",
  //   component: <EditCurrency />,
  // },
  {
    key: "edit-city",
    name: "Edit City",
    route: "/master/city/edit/:id",
    component: <EditCity />,
  },
  // {
  //   key: "edit-ItemFamMst",
  //   route: "/master/itemFamMst/edit/:id",
  //   component: <EditCurrency />,
  // },
  {
    key: "edit-State",
    name: "Edit State",
    route: "/master/state/edit/:id",
    component: <EditState />,
  },
  {
    key: "edit-country",
    name: "Edit Country",
    route: "/master/country/edit/:id",
    component: <EditCountryLLL />,
  },
  {
    key: "edit-warehouse",
    name: "Edit Warehouse",
    route: "/master/warehouse/edit/:id",
    component: <EditWarehouse />,
  },
  {
    key: "edit-location",
    name: "Edit Location",
    route: "/master/location/edit/:id",
    component: <Editlocation />,
  },
  {
    key: "edit-comapany",
    name: "Edit Comapany",
    route: "/master/company/edit/:id",
    component: <Editcomapany />,
  },

  {
    key: "edit-country",
    name: "Edit Country",
    route: "/master/country/edit/:id",
    component: <EditCountry />,
  },
  {
    key: "edit-region",
    name: "Edit Region",
    route: "/master/region/edit/:id",
    component: <EditRegion />,
  },
  {
    key: "edit-branch",
    name: "Edit Branch",
    route: "/master/branch/edit/:id",
    component: <EditBranch />,
  },
  {
    key: "module",
    route: "/emp-position",
    component: <Emp_Position />,
  },
  {
    key: "module",
    route: "/employeefamily",
    component: <Emp_Family />,
  },

  {
    key: "module",
    route: "/employeesubfamily",
    component: <Emp_Sub_Family />,
  },
  {
    key: "edit-van",
    name: "Edit Van Master",
    route: "/master/van/edit/:id",
    component: <EditVanMaster />,
  },
  {
    key: "edit-route",
    name: "Edit Route",
    route: "/master/route/edit/:id",
    component: <EditRoute />,
  },
  {
    key: "edit-outlet",
    name: "Edit Outlet Product",
    route: "/master/outlet/edit",
    component: <EditOutlet_product />,
  },
  {
    key: "edit-item-group",
    name: "Edit Item Group",

    route: "/master/item-group/edit/:id",
    component: <EditItemGroup />,
  },
  {
    key: "edit-item-uom",
    name: "Edit Item UOM",

    route: "/master/item-uom/edit/:id",
    component: <EditItemUOM />,
  },
  {
    key: "edit-van-to-van-transfer",
    name: "Edit VanToVan Transfer",

    route: "/van-to-van-transfer/edit/:id",
    component: <Edit_VanToVan_Transfer />,
  },
  {
    key: "edit-jd-version-config",
    name: "Edit JDE Config",

    route: "/master/jd-config",
    component: <Edit_JDE_Config />,
  },

  {
    key: "floatdetails",
    name: "Float Details",

    route: "/master/floatDetails",
    component: <FloatDetails />,
  },

  // {
  //   type: "collapse",
  //   name: "Currency Denomination",
  //   key: "Currency_Denomination",
  //   icon: <Icon fontSize="small">security</Icon>, // report-related icon
  //   route: "/CurrencyDenomination",
  //   component: <CurrencyDenominationForm />,
  //   category: "CurrencyDenomination",
  // },

  {
    key: "salesman",
    name: "Close Report",

    route: "/closeReport",
    component: <CloseReport />,
  },
  {
    key: "salesman",
    name: "Cash Float Setup",

    route: "/master/cashfloat",
    component: <CashFloatSetup />,
  },
  {
    key: "CurrencyDenominationDetails",
    name: "Float Details",
    route: "/master/floatDetails",
    component: <FloatDetails />,
  },

  //employee dash board
  // {
  //   type: "collapse",
  //   name: "Employee Department",
  //   key: "employee_department",
  //   icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
  //   route: "/employee",
  //   component: <EmployeeList />,
  //   category: "employee_department",
  // },

  {
    key: "EmpDepartment",
    name: "Emp Departments",
    route: "/employee_dept/:id",
    component: <Emp_dashboard />,
  },

  // {
  //   key: "Departments",
  //   name: "Departments",
  //   route: "/departments",
  //   component: <DepartmentMaster />,
  // },

  //  {
  //   key: "module",
  //   route: "/employeefamily",
  //   component: <Emp_Family />,
  // },

  //  {
  //   key: "module",
  //   route: "/employeesubfamily",
  //   component: <Emp_Sub_Family />,
  // },

  // {
  //   type: "collapse",
  //   name: "Employee Family Mst",
  //   key: "employee_fammst",
  //   icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
  //   route: "/employeesubfamily",
  //   component: <Emp_Sub_Family />,
  //   category: "employee_sub_fammst",
  // },

  // {
  //   type: "collapse",
  //   name: "Employee Sub Family Mst",
  //   key: "employee_sub_fammst",
  //   icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
  //   route: "/employeefamily",
  //   component: <Emp_Family />,
  //   category: "employee_fammst",
  // },

  // {
  //   key: "module",
  //   route: "/employees",
  //   component: <EmployeeList />,
  // },

  // {
  //   key: "module",
  //   route: "/pdf",
  //   component: <Jtspdf />,
  // },

  {
    key: "EmpDetails",
    name: "Emp Details",

    route: "/employee_details/:emp_id",
    component: <Emp_dashboard />,
  },

  {
    key: "DepartmentMaster",
    name: "Department Master",

    route: "/departments",
    component: <DepartmentMaster />,
  },

  //  {
  //   key: "module",
  //   route: "/employeefamily",
  //   component: <Emp_Family />,
  // },

  //  {
  //   key: "module",
  //   route: "/employeesubfamily",
  //   component: <Emp_Sub_Family />,
  // },
  {
    key: "itemwisestkmvmnt",
    name: "Item Wise Stock Report",
    route: "/itemwise_stockmvmnt",
    component: <ItemWiseStockReport />,
  },

  {
    key: "EmployeeList",
    name: "Employee List",
    route: "/employees",
    component: <EmployeeList />,
  },

  {
    key: "pdf",
    name: "PDF",
    route: "/pdf",
    component: <Jtspdf />,
  },

  {
    key: "NewEmployee",
    name: "New Employee",
    route: "/new_employee",
    component: <New_Employee />,
  },

  {
    key: "Attendance",
    name: "Attendance",
    route: "/emp_attendance",
    component: <Emp_Attendance />,
  },

  {
    key: "ViewAttendance",
    name: "View Attendance",
    route: "/view_attendance",
    component: <View_Attendance />,
  },

  {
    key: "NewContract",
    name: "New Contract",

    route: "/new_contract",
    component: <New_Contract />,
  },

  {
    key: "ViewContract",
    name: "View Contract",

    route: "/view_contract",
    component: <View_Contract />,
  },

  {
    key: "EditContract",
    name: "Edit Contract",

    route: "/edit_contract/:emp_id",
    component: <Edit_Contract />,
  },

  {
    key: "EmployeeMap",
    name: "Employee Map",
    route: "/employee_map/",
    component: <Employee_Map />,
  },
];
// this is original routes user  commented for the attendace work
export const routesUser1 = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    category: "Dashboard",
  },

  {
    type: "collapse",
    name: "Purchase",
    key: "purchase",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      //Role Master
      {
        name: "Vendor",
        key: "vendor",
        icon: <Icon fontSize="small">view_week</Icon>,
        route: "/vendor",
        component: <VendorList />,
      },
      {
        name: "Purchase Order",
        key: "purchaseorder",
        icon: <Icon fontSize="small">receipt</Icon>,
        route: "/purchaseorder",
        component: <Purchase_order />,
      },
      {
        name: "GRN",
        key: "grn",
        icon: <Icon fontSize="small">sticky_note_2</Icon>,
        route: "/grn",
        component: <Goods_Receipt_Notes />,
      },
      {
        name: "Reports",
        key: "reports",
        icon: <Icon fontSize="small">sticky_note_2</Icon>,
        route: "/report",
        component: <ReportPage />,
      },
    ],
  },

  {
    type: "collapse",
    name: "Sales",
    key: "sales",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      {
        name: "Customer",
        key: "customer",
        icon: <Icon fontSize="small">person</Icon>,
        route: "/customer",
        component: <Customer />,
      },
      {
        name: "Order",
        key: "order",
        icon: <Icon fontSize="small">shopping_cart</Icon>,
        route: "/order",
        component: <Orders />,
      },

      {
        name: "Invoice",
        key: "invoice",
        icon: <Icon fontSize="small">text_snippet</Icon>,
        route: "/invoice",
        component: <Invoice />,
      },
      {
        name: "Reports",
        key: "reports",
        icon: <Icon fontSize="small">sticky_note_2</Icon>,
        route: "/report",
        component: <ReportPage />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Inventory",
    key: "inventry",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      {
        name: "Item Master Location",
        key: "itemlocationmaster",
        icon: <Icon fontSize="small">Item</Icon>,
        route: "/itemlocationmaster",
        component: <ItemLocationMaster />,
      },
      {
        name: "Warehouse",
        key: "warehouse",
        icon: <Icon fontSize="small">foundation</Icon>,
        route: "/warehouse",
        component: <Warehouse />,
      },

      //Stock Upload
      {
        name: "Stock Upload",
        key: "Stockupload",
        icon: <Icon fontSize="small">view_in_ar</Icon>,
        route: "/Stockupload",
        component: <Stockupload />,
      },
      //Stock movement
      {
        name: "Stock Movement",
        key: "Stockmovement",
        icon: <Icon fontSize="small">view_in_ar</Icon>,
        route: "/Stockmovement",
        component: <Stock_movement_report />,
      },
    ],
  },

  {
    // type: "collapse",
    // name: "Sign In",
    key: "sign-in",
    // icon: <Icon fontSize="small">login</Icon>,
    route: "/auth/login",
    component: <SignIn />,
  },
  {
    // type: "collapse",
    // name: "Sign Up",
    key: "sign-up",
    // icon: <Icon fontSize="small">assignment</Icon>,
    route: "/auth/signup",
    component: <SignUp />,
  },
  {
    route: "/auth/forget",
    component: <Forget />,
  },

  //Add new pages route
  {
    key: "add-new",
    route: "/master/customer",
    component: <Addnew />,
  },
  {
    key: "portfolio",
    route: "/master/portfolio-management",
    component: <AddPortfolio_management />,
  },

  {
    key: "order",
    route: "/master/order/add",
    component: <Add_Orders />,
  },

  //Edit files route
  {
    key: "edit-customer",
    route: "/customer/edit/:id",
    component: <EditNew />,
  },

  {
    key: "edit-order",
    route: "/order/edit/:id",
    component: <Edit_Orders />,
  },
  {
    key: "view-order",
    route: "/order/view/:id",
    component: <View_Orders />,
  },
  {
    key: "generate-invoice",
    route: "/order/generate_invoice/:id",
    component: <Generate_Invoice />,
  },
  {
    key: "edit-portfolio",
    route: "/portfolio/edit/:id",
    component: <EditPortfolio_management />,
  },

  //ashish yadav updation
  {
    key: "module",
    route: "/view_module_master/:id",
    component: <View_Module_Master />,
  },
  {
    key: "module",
    route: "/view_sub_module_master/:id",
    component: <View_Sub_Module_Master />,
  },
  {
    key: "module",
    route: "/view_function_master/:id",
    component: <View_Function_Master />,
  },
  {
    key: "module",
    route: "/view_role_master/:id",
    component: <View_Role_Master />,
  },
  {
    key: "vendor",
    route: "/vendors/add",
    component: <AddVendor />,
  },
  {
    key: "vendor",
    route: "/vendors/edit/:id",
    component: <EditVendor />,
  },
  {
    key: "vendor",
    route: "/vendors/view/:id",
    component: <ViewVendor />,
  },
  {
    key: "purchaseorder",
    route: "/master/purchaseorder/add",
    component: <Add_Po />,
  },
  {
    key: "view-purchaseorder",
    route: "/purchaseorder/view/:id",
    component: <View_Orders_po />,
  },
  {
    key: "edit-purchaseorder",
    route: "/purchaseorder/edit/:id",
    component: <Edit_Po />,
  },
  {
    key: "generate-invoice-po",
    route: "/purchaseorder/generate_invoice-po/:id",
    component: <Generate_Invoice_po />,
  },
  {
    key: "grn",
    route: "/master/grn/add",
    component: <Add_GRN />,
  },
  {
    key: "view-grn",
    route: "/grn/addcost/:id",
    component: <Addextracost />,
  },
  {
    key: "view-grn",
    route: "/grn/view/:id",
    component: <View_GRN />,
  },
  {
    key: "edit-grn",
    route: "/grn/edit/:id",
    component: <Edit_GRN />,
  },
  {
    key: "edit-grn",
    route: "/grn/rtv/:id",
    component: <Rtv_grn />,
  },
  {
    key: "view-customer",
    route: "/customer/view/:id",
    component: <View_New />,
  },
  {
    key: "invoice",
    route: "/master/invoice/add",
    component: <Add_Invoice />,
  },
  {
    key: "view-invoice",
    route: "/invoice/view/:id",
    component: <View_Invoice />,
  },
  {
    key: "edit-promotion",
    route: "/invoice/edit_invoice/:id",
    component: <Edit_invoice />,
  },
  {
    key: "add-payment",
    route: "/master/payment",
    component: <Add_Payments />,
  },
  {
    key: "item",
    route: "/master/item",
    component: <Add_Item />,
  },
  {
    key: "view-items",
    route: "/itemlocmaster/view/:id",
    component: <ViewItemLocationMaster />,
  },
  {
    key: "view-items",
    route: "/itemlocmaster/edit/:id",
    component: <EditItemLocationMaster />,
  },
  {
    key: "add-warehouse",
    route: "/master/warehouse",
    component: <AddWarehouse />,
  },
  {
    key: "edit-warehouse",
    route: "/master/warehouse/edit/:id",
    component: <EditWarehouse />,
  },
  {
    key: "view-warehouse",
    route: "master/warehouse/view/:id",
    component: <View_Warehouse />,
  },
  {
    type: "collapse",
    name: "HR & Payroll",
    key: "hr",
    icon: <Icon fontSize="small">receipt</Icon>,
    collapse: [
      // {
      //   name: "Payroll Screen",
      //   key: "payrollscreen",
      //   icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
      //   route: "/payrollscreen",
      //   component: <PayrollScreen />,
      // },
      // {
      //   name: "Manager Page",
      //   key: "managerpage",
      //   icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
      //   route: "/managerpage",
      //   component: <ManagerPage />,
      // },
      // {
      //   name: "Employees",
      //   key: "employee_department",
      //   icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
      //   route: "/employee",
      //   component: <EmployeeList />,
      // },
      {
        name: "Employees",
        key: "employee_department",
        route: "/employee",
        component: <EmployeeRoleRedirect />,
      },

      {
        key: "module",
        route: "/employee_details/:emp_id",
        component: <Emp_dashboard />,
      },
    ],
  },
];

// export const routesUser = [
//   {
//     name: "Employees",
//     key: "employee_department",
//     route: "/employee",
//     component: <EmployeeRoleRedirect />,
//   },

//   {
//     key: "module",
//     route: "/employee_details/:emp_id",
//     component: <Emp_dashboard />,
//   },

//   {
//     // type: "collapse",
//     // name: "Sign In",
//     key: "sign-in",
//     // icon: <Icon fontSize="small">login</Icon>,
//     route: "/auth/login",
//     component: <SignIn />,
//   },
//   {
//     key: "sign-up",
//     route: "/auth/signup",
//     component: <SignUp />,
//   },
//   {
//     route: "/auth/forget",
//     component: <Forget />,
//   },
// ];
// export const routesPOS = [
//   {
//     type: "collapse",
//     name: "POS",
//     key: "pos",
//     icon: <Icon fontSize="small">payment</Icon>,
//     route: "/pos",
//     component: <Pos1 />,
//     category: "POS",
//   },
//   // {
//   //   key: "item",
//   //   route: "/master/item",
//   //   component: <Add_Item />,
//   // },

//   {
//     // type: "collapse",
//     // name: "Sign In",
//     key: "sign-in",
//     // icon: <Icon fontSize="small">login</Icon>,
//     route: "/auth/login",
//     component: <SignIn />,
//   },
//   {
//     // type: "collapse",
//     // name: "Sign Up",
//     key: "sign-up",
//     // icon: <Icon fontSize="small">assignment</Icon>,
//     route: "/auth/signup",
//     component: <SignUp />,
//   },
//   {
//     route: "/auth/forget",
//     component: <Forget />,
//   },
// ];
// export const routesManager = [
//   {
//     type: "collapse",
//     name: "Dashboard",
//     key: "dashboard",
//     icon: <Icon fontSize="small">dashboard</Icon>,
//     route: "/dashboard",
//     component: <Dashboard />,
//     category: "Dashboard",
//   },
//   {
//     type: "collapse",
//     name: "HR & Payroll",
//     key: "hr",
//     icon: <Icon fontSize="small">receipt</Icon>,
//     collapse: [
//       {
//         name: "Payroll Screen",
//         key: "payrollscreen",
//         icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
//         route: "/payrollscreen",
//         component: <PayrollScreen />,
//       },
//       {
//         name: "Manager Page",
//         key: "managerpage",
//         icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
//         route: "/managerpage",
//         component: <ManagerPage />,
//       },
//       {
//         name: "Employees",
//         key: "employee_department",
//         icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
//         route: "/employee",
//         component: <EmployeeList />,
//       },

//       // {
//       //   name: "Department Family",
//       //   key: "employee_fammst_List",
//       //   icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
//       //   route: "/emp_fm_list",
//       //   component: <Empfm_list />,
//       // },

//       // {
//       //   name: "Dept Sub Family",
//       //   key: "employee_sub_fammst_list",
//       //   icon: <Icon fontSize="small">security</Icon>, // Setting-related icon
//       //   route: "/emp_subfm_list",
//       //   component: <Emp_sub_fm_list />,
//       // },
//     ],
//   },

//   {
//     // type: "collapse",
//     // name: "Sign In",
//     key: "sign-in",
//     // icon: <Icon fontSize="small">login</Icon>,
//     route: "/auth/login",
//     component: <SignIn />,
//   },
//   {
//     // type: "collapse",
//     // name: "Sign Up",
//     key: "sign-up",
//     // icon: <Icon fontSize="small">assignment</Icon>,
//     route: "/auth/signup",
//     component: <SignUp />,
//   },
//   {
//     route: "/auth/forget",
//     component: <Forget />,
//   },
// ];
