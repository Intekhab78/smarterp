import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop"; // <-- Add this
import "leaflet/dist/leaflet.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import "./App.css";
import "./assets/css/main.css"; // Adjust the path based on where you placed the CSS file
import NotFound from "./NotFound";
import Header from "./components/Header";
import Nav from "./components/Nav";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import Accounts from "./Pages/Accounts";
import Wishlist from "./Pages/Wishlist";
import Shop from "./Pages/Shop";
import Login from "./Pages/Login";
import Cart from "./Pages/Cart";
import Register from "./Pages/Register";
import ItemList from "./components/ItemList";
import Items from "./components/Items";
import { CartProvider } from "./CartContext/CartContext";
import ProductDetails from "./Pages/ProductDetails";
import ContactUs from "./Pages/ContactUs";
import UserRegistration from "./Pages/UserRegistration";
import Test from "./components/Test";
import PaymentProcessing from "./Pages/PaymentProcessing";
import OrderSuccess from "./Pages/OrderSuccess";
import OrderDetails from "./Pages/OrderDetails";
import DeliveryTracking from "./Pages/DeliveryTracking";
import Invoice from "./utils/invoiceUtils";
import ShopByCategory from "./components/ShopByCategory";
import ShippingAddresses from "./components/ShippingAddress";
import GuestCheckout from "./Pages/GuestCheckout";
import OrderList from "./Pages/OrderList";
import ResetPassword from "./Pages/ResetPassword";
import ProductsList from "./components/ProductsList";
import CustomerDetails from "./components/CustomerDetails";
import UpdatePassword from "./Pages/UpdatePassword";
import Payment from "./Pages/Payment";
import PaymentTest from "./Pages/PaymentTest";
import PrivacyPolicy from "./Policy/PrivacyPolicy";
import Terms from "./Policy/Terms";
import ShippingPolicy from "./Policy/ShippingPolicy";
import ReturnRefund from "./Policy/ReturnRefund";
import SecureShopping from "./Policy/SecureShopping";
import PaymentOptions from "./Policy/PaymentOptions";
import CancelOrder from "./Pages/CancelOrder";
import ReturnOrder from "./Pages/ReturnOrder";
// import ExchangeOrder from "./Pages/ExchangeOrder";
// import CancelledItems from "./Pages/CancelledItems";
import RazorpayPayment from "./components/Payments/RazorpayPayment";
import ExchangeOrder from "./Pages/ExchangeOrder";
import CancelledItems from "./Pages/CancelledItems";
import OrderStatusMailWatcher from "./components/SendOrderStatusMail";
import PayUOrderHandler from "./components/Payments/PayUOrderHandler";
import { AuthProvider } from "./CartContext/AuthContext";
import ProtectedRoute from "./middleware/ProtectedRoute";
import Checkout from "./Pages/Checkout";
import ScanProduct from "./Pages/ScanProduct";
import GenerateQR from "./Pages/GenerateQR";
import ThermalInvoice from "./Pages/ThermalInvoice";
import Debug from "./Pages/Debug";
import GlobalTawkControl from "./hooks/GlobalTawkControl";
import PayuProcessingPOS from "./Pages/PayUOrderHandlerPOS";
import OrderReview from "./Pages/OrderReview";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  // Pages where header + footer must NOT show
  const hideLayoutRoutes = [
    "/payu-processing-pos",
    "/payu-processing",
    "/payment_processing",
    "/thermal-invoice",
    "/scan",
    "/generate-qr",
  ];

  const shouldHideLayout = hideLayoutRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hide Nav */}
      {!shouldHideLayout && <Nav />}

      {/* Content */}
      <div className={!shouldHideLayout ? "pt-20 flex-grow" : "flex-grow"}>
        <Outlet />
      </div>

      {/* Hide Footer */}
      {!shouldHideLayout && <Footer />}
    </div>
  );
};
// const Layout = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Nav />

//       {/* Content wrapper */}
//       <div className="pt-20 flex-grow">
//         <Outlet />
//       </div>

//       <Footer />
//     </div>
//   );
// };

function App() {
  return (
    <Provider store={store}>

      <BrowserRouter>
        <GlobalTawkControl />   {/* 🔥 ADD HERE */}

        <AuthProvider>
          <OrderStatusMailWatcher />
          <ScrollToTop /> {/* <-- Add this */}
          <Routes>
            <Route
              path="/payu-processing-pos"
              element={
                <CartProvider>
                  <PayuProcessingPOS />
                </CartProvider>
              }
            />
            <Route
              path="/payu-processing"
              element={
                <CartProvider>
                  <PayUOrderHandler />
                </CartProvider>
              }
            />
            <Route path="/payment_processing" element={<PaymentProcessing />} />
            <Route path="/scan" element={<ScanProduct />} />
            <Route path="/generate-qr" element={<GenerateQR />} />
            <Route path="/payment-test" element={<PaymentTest />} />
            <Route path="/thermal-invoice" element={<ThermalInvoice />} />
            <Route path="/order-review" element={<OrderReview />} />
            <Route path="/debug" element={<Debug />} />
            <Route
              path="/"
              element={
                <CartProvider>
                  <Layout />
                </CartProvider>
              }
            >
              <Route path="*" element={<NotFound />} />
              <Route index element={<LandingPage />} />
              {/* <Route path="/accounts" element={<Accounts />} />
            <Route path="/wishlist" element={<Wishlist />} /> */}
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop-by-category/:id" element={<ShopByCategory />} />
              <Route path="/shop/quick-links/:id" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/itemlist/:categoryId" element={<ItemList />} />
              <Route path="/items" element={<Items />} />
              <Route path="/items/:id" element={<ProductDetails />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/userregistration" element={<UserRegistration />} />
              <Route path="/test" element={<Test />} />
              <Route path="/order_details/:orderId" element={<OrderDetails />} />
              <Route path="/delivery-tracking" element={<DeliveryTracking />} />
              <Route path="/invoice" element={<Invoice />} />
              {/* <Route path="/shipping-address" element={<ShippingAddresses />} /> */}
              <Route path="/guest-checkout" element={<GuestCheckout />} />
              {/* <Route path="/orders" element={<OrderList />} /> */}
              <Route path="/reset" element={<ResetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/products/:familyId" element={<ProductsList />} />
              {/* <Route path="/customer-details" element={<CustomerDetails />} /> */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/returns-refund" element={<ReturnRefund />} />
              <Route path="/secure-shopping" element={<SecureShopping />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/payment-option" element={<PaymentOptions />} />
              <Route path="/checkout" element={<Checkout />} />
              {/* <Route path="/cancel-order/:id" element={<CancelOrder />} />
            <Route path="/return-order/:id" element={<ReturnOrder />} /> */}
              {/* <Route path="/exchange-order/:id" element={<ExchangeOrder />} /> */}
              {/* <Route
              path="/cancelled-items/:order_number"
              element={<CancelledItems />}
            /> */}

              {/* 🔒 PROTECTED ROUTES */}
              <Route element={<ProtectedRoute />}>
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/orders" element={<OrderList />} />
                <Route path="/customer-details" element={<CustomerDetails />} />
                <Route path="/shipping-address" element={<ShippingAddresses />} />
                <Route path="/cancel-order/:id" element={<CancelOrder />} />
                <Route path="/return-order/:id" element={<ReturnOrder />} />
                <Route path="/exchange-order/:id" element={<ExchangeOrder />} />
                <Route
                  path="/cancelled-items/:order_number"
                  element={<CancelledItems />}
                />
              </Route>

              {/* //payment  */}
              <Route path="/razorpay" element={<RazorpayPayment />} />
              <Route path="/order_success" element={<OrderSuccess />} />
              {/* <Route path="/payu-processing-pos" element={<PayuProcessingPOS />} /> */}
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Provider>

  );
}

export default App;
