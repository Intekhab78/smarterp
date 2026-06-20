import { useLocation } from "react-router-dom";
import useHideTawk from "../hooks/useHideTawk";

export default function GlobalTawkControl() {
  const location = useLocation();

  const hideRoutes = [
    "/scan",
    "/generate-qr",
    "/payment-test",
    "/thermal-invoice",
    "/payu-processing-pos",
    "/order-review",
  ];

  const shouldHide = hideRoutes.includes(location.pathname);

  useHideTawk(shouldHide);

  return null;
}
