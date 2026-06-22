const express = require("express");

/*--------------------------*/

/*** Import Module Routes ***/
const userMasterRoute = require("./user_master.route");
const userUserMasterRoute = require("./user_user_master.route");
const reportRoute = require("./report.route");
const batchRoute = require("./batch.route");
const itemMasterRoute = require("./item_master.route");
const item_location_master = require("./item_location_master.routes");
const item_location_master_img = require("./item_location_master_img.route");
const itemColorRoute = require("./item_color.route");
const itemCategoryRoute = require("./item_category.route");
const sizeMasterRoute = require("./size_master.route");
const familyMasterRoute = require("./family_master.route");
const taxMasterRoute = require("./tax_master.route");
const taxSettingsRoute = require("./taxSettings.route");
const subFamilyMasterRoute = require("./sub_family_master.route");
const itemDepartmentRoute = require("./item_department.route");
const item_column_translation = require("./item_column_translation.routes");
const department_mapping = require("./department_mapping.route");
const family_mapping = require("./family_mapping.routes");
const itemUomRoute = require("./item_uom.route");
const item_visibility = require("./item_visibility.routes");
const brandRoute = require("./brand.route");
const CustomerInfoRoute = require("./customer_info.route");
const SalesmanInfoRoute = require("./salesman_info.route");
const CodeSettingRoute = require("./code_setting.route");
const OrderRoute = require("./order.route");
const OrderStatusRoute = require("./order_status_master.routes");
const OrderTracking = require("./order_tacking.routes");
const orderActionReasonMaster = require("./order_action_reason_master.route");
const orderActionReasonMapping = require("./order_action_reason_mapping.route");
const Payments = require("./payments.route");
const PurchaseOrderRoute = require("./purchase_order.route");
const GrnRoute = require("./grn.route");
const InvoiceRoute = require("./invoice.route");
const InvoiceLogRoute = require("./invoice_log.route");
const dashboardRoute = require("./dashboard.route");
const countryRoute = require("./country.route");
const PortfoliocategoryRoute = require("./portfolio_category.route");
const SupplierRoute = require("./supplier.route");
const ProductMasterRoute = require("./product_master.route");
const CollectionRoute = require("./collection.route");
const CollectionDetailsRoute = require("./collectionDetails.routes");
const PosPaymentRoute = require("./pos_payment.route");
const PaymentTypeRoute = require("./payment_type.route");
const BankRoute = require("./bank.route");
const WarehouseMasterRoute = require("./warehouse_master.route");
const CurrencyRoute = require("./currency.route");
const LocationRoute = require("./location.route");
const CompanyRoute = require("./company.route");
const StateRoute = require("./state.route");
const CityRoute = require("./city.route");

const SettingLandedCostRoute = require("./setting_landed_cost.route");
const roleRoute = require("./roles.route");

const module_masterRoute = require("./module_master.route");
const sub_module_masterRoute = require("./sub_module_master.route");
const function_masterRoute = require("./function_master.route");
const functionMaterMapRoute = require("./function_action_master_map.route");
const actionMasterRoute = require("./action_master.route");
const role_masterRoute = require("./role_master.route");
const role_permission = require("./role_permission.routes");
const userGroupRoute = require("./user_group.route");
const test_route = require("./test.route");
const queue_route = require("./queue.routes");
const currencyDenomination = require("./currencyDenominationMaster.routes");
const register_tbl = require("./register_tbl.routes");

const stock = require("./stock_distribution.routes");
const companyLevelStock = require("./companyLevelStock.routes");
const stockMovement = require("./stockMovement.route");
const vendor = require("./vendor.routes");
const item_price_history = require("./item_price_history.routes");
const customer = require("./customer.routes");
const shipping_address = require("./shippingAddress.routes");
const priceListMaster = require("./priceListMaster.routes"); //this is for set the code for ecom in which price my item will be sell
const priceListItemDetails = require("./priceListItemDetails.routes");
const filterCompItemSetting = require("./filterCompItemSetting.routes");
const prApplySettings = require("./prApply_settings.routes");

// trip
const booking = require("./Trip/routes/booking.routes");
const trainRoutes = require("./Trip/routes/trainRoutes");
const flightRoutes = require("./Trip/routes/flightRoutes");
const hotelRoutes = require("./Trip/routes/hotelRoutes");

// setting routes
const grn_setting = require("./grnSetting.routes");
const system_setting = require("./system_setting.route");

//mohit
const works = require("./work.routes");
const employee = require("./employee.routes");
const personal = require("./personal.routes");
const payroll = require("./payroll.routes");
const documents = require("./employee_documents.routes");
const certification = require("./certification.routes");
const attendance = require("./attendance.routes");
const emp_attendance = require("./emp_attendance.route");
const attendance_payroll = require("./attendance_payroll.route");
const contract = require("./contract.routes");
const ecomBanner = require("./ecomBanner.routes");
const ecomHomeSection = require("./ecom_home_section.route");
const ecomHomeSectionItem = require("./ecom_home_section_item.route");

const email_campaign = require("./email_campaign.route");
const email_contact = require("./email_contact.route");
const email_send = require("./email_send.route");
const email_category = require("./email_category.routes");
const email_campaign_contact = require("./email_campaign_contact.routes");

const phonepe = require("./phonepe.routes");
const razorpay = require("./razorpay.routes");

const video = require("./video.route");
const video_advertiesment = require("./video_advertiesment.routes");

/** ------------ **
Defining Routes
** ------------ **/
const router = new express.Router();

/*** Module Specific Routes ***/

router.use("/", userMasterRoute);
router.use("/test", test_route);
router.use("/module_master", module_masterRoute);
router.use("/sub_module_master", sub_module_masterRoute);
router.use("/function_master", function_masterRoute);
router.use("/function_action_master_map", functionMaterMapRoute);
router.use("/action_master", actionMasterRoute);
router.use("/role_master", role_masterRoute);
router.use("/role_permission", role_permission);

router.use("/item", itemMasterRoute);
router.use("/item_location_master", item_location_master);
router.use("/item_loc_master_img", item_location_master_img);
router.use("/batch", batchRoute);
router.use("/item_color", itemColorRoute);
router.use("/item_category", itemCategoryRoute);
router.use("/item_department", itemDepartmentRoute);
router.use("/department_mapping", department_mapping);
router.use("/item_column_translation", item_column_translation);
router.use("/family_mapping", family_mapping);
router.use("/size_master", sizeMasterRoute);
router.use("/family_master", familyMasterRoute);
router.use("/tax_master", taxMasterRoute);
router.use("/taxSettingsRoute", taxSettingsRoute);
router.use("/sub_family_master", subFamilyMasterRoute);
router.use("/brand", brandRoute);
router.use("/item_uom", itemUomRoute);
router.use("/item_visibility", item_visibility);
router.use("/customer", CustomerInfoRoute);
router.use("/shipping_address", shipping_address);
router.use("/price_list_master", priceListMaster);
router.use("/pr_item_details", priceListItemDetails);
router.use("/filter_by_comp_loc", filterCompItemSetting);
router.use("/pr_apply_settings", prApplySettings);
router.use("/ecomBanner", ecomBanner);
router.use("/ecom-home-section", ecomHomeSection);
router.use("/ecom-home-section-item", ecomHomeSectionItem);
router.use("/salesman", SalesmanInfoRoute);
router.use("/code_setting", CodeSettingRoute);
router.use("/order", OrderRoute);
router.use("/order-status", OrderStatusRoute);
router.use("/order-tracking", OrderTracking);
router.use("/order-action-reason-master", orderActionReasonMaster);
router.use("/order-action-reason-mapping", orderActionReasonMapping);
router.use("/payments", Payments);
router.use("/report", reportRoute);
router.use("/purchase_order", PurchaseOrderRoute);
router.use("/grn", GrnRoute);
router.use("/invoice", InvoiceRoute);
router.use("/invoice_log", InvoiceLogRoute);
router.use("/dashboard", dashboardRoute);
router.use("/country", countryRoute);
router.use("/Portfolio-category", PortfoliocategoryRoute);
router.use("/supplier", SupplierRoute);
router.use("/product_master", ProductMasterRoute);
router.use("/collection", CollectionRoute);
router.use("/collection_details", CollectionDetailsRoute);
router.use("/pos_payment", PosPaymentRoute);
router.use("/payment_type", PaymentTypeRoute);
router.use("/bank", BankRoute);
router.use("/warehouse_master", WarehouseMasterRoute);
router.use("/currency", CurrencyRoute);
router.use("/location", LocationRoute);
router.use("/company", CompanyRoute);
router.use("/state", StateRoute);
router.use("/city", CityRoute);
router.use("/setting_landed_cost", SettingLandedCostRoute);
router.use("/user_user_master", userUserMasterRoute);
router.use("/roles", roleRoute);
router.use("/user_group", userGroupRoute);

router.use("/queue", queue_route);
router.use("/currencyDenomination", currencyDenomination);
router.use("/register_float", register_tbl);

router.use("/stock_distribution", stock);
router.use("/companyLevelStock", companyLevelStock);
router.use("/stock_movement", stockMovement);
router.use("/vendor", vendor);
router.use("/item_price_history", item_price_history);
router.use("/customer", customer);

//settings routes
// setting routes
router.use("/grn_setting", grn_setting);
router.use("/system_setting", system_setting);

// trip

router.use("/booking", booking);
router.use("/trainDetails", trainRoutes);
router.use("/flights", flightRoutes);
router.use("/hotels", hotelRoutes);

//mohit
router.use("/work", works);
router.use("/employee", employee);
router.use("/personal", personal);
router.use("/payroll", payroll);
router.use("/documents", documents);
router.use("/certification", certification);
router.use("/attendance", attendance);
router.use("/emp_attendance", emp_attendance);
router.use("/attendance_payroll", attendance_payroll);
router.use("/contract", contract);

router.use("/email_campaign", email_campaign);
router.use("/email_contact", email_contact);
router.use("/email_send", email_send);
router.use("/email_category", email_category);
router.use("/email_campaign_contact", email_campaign_contact);

router.use("/payment", phonepe);
router.use("/razorpay", razorpay);

router.use("/video", video);
router.use("/video-advertiesment", video_advertiesment);

/*** Export Routrer for import in main application file ***/
module.exports = router;
