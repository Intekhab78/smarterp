import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import constantApi from "../constantApi";
import { generatePosReceiptPDF } from "../utils/posReceiptPdf";

export default function OrderReview() {
  const [order, setOrder] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const orderNumberParam = query.get("order_number");
  const orderIdParam = query.get("order_id");
  const invoiceNumberParam = query.get("invoice_number");

  const normalizeOrderFromApi = (orderData) => {
    if (!orderData) return null;

    const details = Array.isArray(orderData.order_details)
      ? orderData.order_details
      : [];

    const items = details.map((row) => {
      const qty = Number(row.item_qty || row.qty || row.quantity || 1);
      const rawTotal = Number(
        row.item_grand_total ||
        row.grand_total ||
        row.total ||
        row.item_total ||
        0
      );
      const discountAmount = Number(
        row.item_discount ||
        row.discount ||
        row.discount_amount ||
        row.item_discount_amount ||
        0
      );
      const taxAmount = Number(
        row.tax_amount ||
        row.item_tax ||
        row.tax ||
        row.tax_total ||
        0
      );
      let unitPrice = Number(
        row.item_price ||
        row.item_rate ||
        row.price ||
        row.rate ||
        0
      );
      if (!unitPrice && qty > 0) {
        const base = rawTotal ? rawTotal - taxAmount + discountAmount : 0;
        unitPrice = base / qty;
      }
      const lineBase = unitPrice * qty;
      const taxable = Number(
        row.taxable_total ||
        row.taxable_amount ||
        (lineBase - discountAmount)
      );
      const total = rawTotal || taxable + taxAmount;
      return {
        name:
          row.item_name ||
          row.itemLocationModel?.item_name ||
          row.item?.item_name ||
          row.item_id ||
          "Item",
        upc:
          row.upc ||
          row.item_upc ||
          row.item_code ||
          row.item_barcode ||
          row.barcode ||
          row.sku ||
          row.itemLocationModel?.upc ||
          row.itemLocationModel?.item_upc ||
          row.itemLocationModel?.item_code ||
          "-",
        quantity: qty,
        price: unitPrice,
        total,
        discount: discountAmount,
        taxable,
        tax_amount: taxAmount,
      };
    });

    const itemsTotal = items.reduce((sum, it) => sum + Number(it.total || 0), 0);
    const itemsTax = items.reduce((sum, it) => sum + Number(it.tax_amount || 0), 0);
    const itemsDiscount = items.reduce(
      (sum, it) => sum + Number(it.discount || 0),
      0
    );
    const itemsTaxable = items.reduce(
      (sum, it) => sum + Number(it.taxable || 0),
      0
    );

    const apiTotal = Number(orderData.grand_total || orderData.total || 0);
    const apiTax = Number(orderData.tax_total || orderData.tax || 0);
    const apiSubtotal = Number(orderData.taxable_total || orderData.sub_total || 0);
    const apiDiscount = Number(
      orderData.discount_total ||
      orderData.discount ||
      orderData.total_discount ||
      0
    );

    const total = apiTotal > 0 ? apiTotal : itemsTotal;
    const taxTotal = apiTax > 0 ? apiTax : itemsTax;
    const subtotal = apiSubtotal > 0 ? apiSubtotal : itemsTaxable;
    const discountTotal = apiDiscount > 0 ? apiDiscount : itemsDiscount;

    const customerDetails = orderData.customer_details || {};
    const customerName =
      `${customerDetails.first_name || ""} ${customerDetails.last_name || ""}`.trim();

    return {
      ...orderData,
      items,
      total,
      tax_total: taxTotal,
      sub_total: subtotal,
      discount_total: discountTotal,
      taxable_total: subtotal,
      cgst: Number(orderData.cgst ?? taxTotal / 2),
      sgst: Number(orderData.sgst ?? taxTotal / 2),
      customer:
        customerName || orderData.customer
          ? {
            name: customerName || orderData.customer?.name || "Walk-in Customer",
            email: customerDetails.email || orderData.customer?.email,
            phone: customerDetails.phone || orderData.customer?.phone,
          }
          : orderData.customer,
      created_at: orderData.created_at || orderData.order_date,
      invoice_no:
        orderData.invoice?.invoice_number ||
        orderData.invoice_number ||
        orderData.invoice_no,
    };
  };

  const normalizeInvoiceToReceipt = (invoiceData) => {
    if (!invoiceData) return null;

    const details = Array.isArray(invoiceData.invoice_details)
      ? invoiceData.invoice_details
      : [];

    const filteredDetails = details.filter((item) => {
      if (!invoiceData.company_id || !invoiceData.location_id) return true;
      return (
        item?.itemLocationModel?.company_id === invoiceData.company_id &&
        item?.itemLocationModel?.location_id === invoiceData.location_id
      );
    });

    const items = filteredDetails.map((item) => {
      const qty = Number(item.item_qty || 1);
      const price = Number(item.item_price || 0);
      const unitTax = Number(item.item_vat || item.tax_amount || 0);
      const tax = unitTax * qty;
      const discount = Number(item.item_discount || item.discount || 0);
      const taxable = price * qty - discount;
      const total =
        Number(item.item_total_net || item.total_net || item.item_grand_total) ||
        taxable + tax;

      return {
        name:
          item.itemLocationModel?.item_name ||
          item.item_name ||
          item.item_id ||
          "Item",
        upc:
          item.itemLocationModel?.upc ||
          item.itemLocationModel?.item_code ||
          item.item_code ||
          item.upc ||
          item.barcode ||
          "-",
        quantity: qty,
        price,
        discount,
        taxable,
        tax_amount: tax,
        total,
      };
    });

    const itemsTaxable = items.reduce((sum, it) => sum + Number(it.taxable || 0), 0);
    const itemsTax = items.reduce((sum, it) => sum + Number(it.tax_amount || 0), 0);
    const itemsDiscount = items.reduce((sum, it) => sum + Number(it.discount || 0), 0);
    const itemsTotal = items.reduce((sum, it) => sum + Number(it.total || 0), 0);

    const taxableTotal = Number(invoiceData.taxable_total || invoiceData.sub_total || itemsTaxable);
    const taxTotal = Number(invoiceData.tax_total || invoiceData.vat_total || itemsTax);
    const discountTotal = Number(invoiceData.discount_total || itemsDiscount);
    const grandTotal = Number(invoiceData.grand_total || invoiceData.total || itemsTotal);

    return {
      ...invoiceData,
      items,
      taxable_total: taxableTotal,
      tax_total: taxTotal,
      discount_total: discountTotal,
      total: grandTotal,
      cgst: Number(invoiceData.cgst ?? taxTotal / 2),
      sgst: Number(invoiceData.sgst ?? taxTotal / 2),
      created_at: invoiceData.created_at,
      invoice_no: invoiceData.invoice_number,
      order_number: invoiceData?.orderModel?.order_number || invoiceData?.order_number,
      customer: invoiceData?.customerModel
        ? {
          name: invoiceData.customerModel.customer_name || invoiceData.customerModel.name,
          email: invoiceData.customerModel.email,
          phone: invoiceData.customerModel.phone,
        }
        : invoiceData?.customer || null,
    };
  };

  /* LOAD ORDER FROM API */
  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      setLoading(true);
      setError("");

      const saved = JSON.parse(localStorage.getItem("SuccessOrder"));
      const fallbackOrder = saved?.data || saved || null;

      if (!orderIdParam && !orderNumberParam && !invoiceNumberParam) {
        if (fallbackOrder) {
          if (active) setOrder(fallbackOrder);
          if (active) setLoading(false);
          return;
        }
        if (active) {
          setError("Order number missing.");
          setLoading(false);
        }
        return;
      }

      try {
        let normalizedOrder = null;

        if (orderIdParam || orderNumberParam) {
          const res = await axios.post(
            `${constantApi.baseUrl}/order/ecommerce_orders/details`,
            orderIdParam ? { order_id: orderIdParam } : { order_number: orderNumberParam }
          );

          if (res.data?.status && res.data?.data) {
            normalizedOrder = normalizeOrderFromApi(res.data.data);
          }
        }

        let invoiceData = null;
        if (invoiceNumberParam) {
          const invRes = await axios.post(`${constantApi.baseUrl}/invoice/details`, {
            invoice_number: invoiceNumberParam,
          });
          if (invRes.data?.status && invRes.data?.data) {
            invoiceData = invRes.data.data;
          }
        }

        const normalizedInvoice = normalizeInvoiceToReceipt(invoiceData);
        const finalOrder = normalizedInvoice || normalizedOrder;

        if (finalOrder) {
          if (active) setOrder(finalOrder);
        } else {
          throw new Error("Order not found");
        }
      } catch (err) {
        console.error("Order fetch error:", err);
        if (fallbackOrder) {
          if (active) setOrder(fallbackOrder);
        } else if (active) {
          setError("Order not found.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [orderIdParam, orderNumberParam, invoiceNumberParam]);

  /* LOAD COMPANY */
  useEffect(() => {
    const fetchCompany = async () => {
      if (!order?.company_id) return;
      try {
        const res = await axios.post(
          `${constantApi.baseUrl}/company/details`,
          { id: order.company_id }
        );
        if (res.data?.status) {
          setCompanyData(res.data.data);
        }
      } catch (err) {
        console.error("Company fetch error:", err);
      }
    };
    fetchCompany();
  }, [order?.company_id]);

  const handlePrint = () => {
    if (!order) return;
    const afterPrint = () => {
      localStorage.removeItem("SuccessOrder");
      navigate("/scan", { replace: true });
    };

    generatePosReceiptPDF(order, companyData, {
      action: "print",
      onAfterPrint: afterPrint,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto p-5 text-center">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || "No matching order found."}
          </p>
          <button
            onClick={() => navigate("/scan")}
            className="px-4 py-2 !bg-blue-600 !text-white rounded"
          >
            Back to Scan
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  /* SAFE HELPERS */
  const safe = (val) => (val ? val : "-");
  const money = (val) => Number(val || 0).toFixed(2);

  const items = order?.items || [];
  const itemsSubtotal = items.reduce(
    (sum, it) =>
      sum +
      Number(it.price || 0) * Number(it.quantity || 0) -
      Number(it.discount || 0),
    0
  );
  const itemsTax = items.reduce(
    (sum, it) => sum + Number(it.tax_amount || 0),
    0
  );
  const itemsTotal = items.reduce(
    (sum, it) => sum + Number(it.total || 0),
    0
  );
  const subtotal = Number(order?.taxable_total || order?.sub_total || itemsSubtotal);
  const taxTotal = Number(
    order?.tax_total || itemsTax || Math.max(0, itemsTotal - itemsSubtotal)
  );
  const discount = Number(
    order?.discount_total ||
    items.reduce((sum, it) => sum + Number(it.discount || 0), 0)
  );
  const grandTotal = Number(
    order?.total || itemsTotal || subtotal + taxTotal - discount
  );

  const cgst = Number(order?.cgst ?? taxTotal / 2);
  const sgst = Number(order?.sgst ?? taxTotal / 2);

  const gstPercent =
    subtotal > 0 ? ((taxTotal / subtotal) * 100).toFixed(2) : "0.00";

  const cgstPercent = (gstPercent / 2).toFixed(2);
  const sgstPercent = (gstPercent / 2).toFixed(2);

  const displayOrderNumber =
    orderNumberParam ||
    order?.order_number ||
    order?.order_no ||
    order?.id ||
    "-";

  const displayInvoiceNumber =
    invoiceNumberParam ||
    order?.invoice_no ||
    order?.invoice_number ||
    "-";

  return (
    <div className="min-h-screen bg-[#f7f2e9] text-slate-900 font-sans relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-amber-200/60 via-rose-200/50 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-200/60 via-sky-200/40 to-transparent blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between no-print">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">
              Order Review
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold font-display">
              Receipt & Summary
            </h1>
            <p className="text-sm text-slate-600">
              Order <span className="font-semibold">{displayOrderNumber}</span> � Invoice{" "}
              <span className="font-semibold">{displayInvoiceNumber}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3 no-print">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-full !bg-gradient-to-r !from-emerald-600 !to-emerald-500 text-white shadow-md shadow-emerald-300/40 transition hover:-translate-y-0.5"
            >
              Print PDF
            </button>
            <button
              onClick={() => generatePosReceiptPDF(order, companyData, { action: "download" })}
              className="px-5 py-2.5 rounded-full !bg-gradient-to-r !from-sky-600 !to-indigo-500 !text-white shadow-md shadow-sky-300/40 transition hover:-translate-y-0.5"
            >
              Download PDF
            </button>
            <button
              onClick={() => navigate("/scan", { replace: true })}
              className="px-5 py-2.5 rounded-full !bg-white/80 !text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5"
            >
              Back to Scan
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-white/80 backdrop-blur rounded-2xl border border-white/70 shadow-xl p-6 animate-pop no-print">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                  Order Overview
                </p>
                <h2 className="text-xl font-semibold font-display mt-1">
                  {safe(companyData?.compdesc || companyData?.name || "Store")}
                </h2>
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <p>{safe(companyData?.company_address?.[0]?.address1 || companyData?.address)}</p>
                  <p>Contact: {safe(companyData?.company_address?.[0]?.contact_no || companyData?.phone)}</p>
                  <p>Email: {safe(companyData?.company_address?.[0]?.email || companyData?.email)}</p>
                  <p>GSTIN: {safe(companyData?.ctaxnumber || companyData?.gst)}</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                Confirmed
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm text-slate-700">
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Customer
                </p>
                <p className="mt-2 font-semibold text-slate-800">
                  {safe(order?.customer?.name)}
                </p>
                <p className="text-xs text-slate-500">
                  {safe(order?.customer?.phone)}
                </p>
                <p className="text-xs text-slate-500">
                  {safe(order?.customer?.email)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Date & Cashier
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {order?.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : "-"}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Cashier: <span className="font-semibold">{safe(order?.cashier_name)}</span>
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                  Items
                </h3>
                <span className="text-xs text-slate-500">{items.length} items</span>
              </div>
              <div className="overflow-visible rounded-xl border border-slate-100 bg-white/70 p-3">
                {items.length > 0 ? (
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between gap-3 border-b border-dashed border-slate-200 pb-2 last:border-b-0 last:pb-0"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {safe(item?.name)}
                          </p>
                          {item?.upc && item?.upc !== "-" && (
                            <p className="text-xs text-slate-500">UPC: {safe(item?.upc)}</p>
                          )}
                          <p className="text-xs text-slate-500">Qty: {safe(item?.quantity)}</p>
                        </div>
                        <div className="text-right text-sm text-slate-700">
                          <p className="font-semibold">{money(item?.total)}</p>
                          <p className="text-xs text-slate-500">Total {money(item?.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center">No items found.</p>
                )}
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{money(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Tax</span>
                <span className="font-semibold">{money(taxTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Discount</span>
                <span className="font-semibold">{money(discount)}</span>
              </div>
              <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-100 via-rose-100 to-emerald-100 px-4 py-3 flex justify-between items-center">
                <span className="font-semibold text-slate-700">Grand Total</span>
                <span className="text-lg font-semibold text-slate-900">
                  Rs. {money(grandTotal)}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 text-xs text-slate-600">
              <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-center">
                <p className="uppercase tracking-widest text-slate-400">CGST</p>
                <p className="font-semibold">{cgstPercent}% � {money(cgst)}</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-center">
                <p className="uppercase tracking-widest text-slate-400">SGST</p>
                <p className="font-semibold">{sgstPercent}% � {money(sgst)}</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-center">
                <p className="uppercase tracking-widest text-slate-400">Items</p>
                <p className="font-semibold">{items.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur rounded-2xl border border-white/70 shadow-xl p-5 animate-pop pop-delay-1 receipt-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold font-display">Receipt Preview</h3>
              {/* <span className="text-xs uppercase tracking-widest text-slate-400">
                58mm
              </span> */}
            </div>
            <div className="mt-4 flex justify-center">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-inner p-4 receipt-shell">
                <div
                  id="receipt"
                  className="bg-white text-[13px] font-mono p-2 mx-auto print-area"
                  style={{ width: "58mm" }}
                >
                  {/* GRID WIDTHS */}
                  <style>{`
            .receipt-grid {
              display: grid;
              grid-template-columns: 40% 15% 10% 15% 20%;
              column-gap: 2px;
            }
          `}</style>
                  {/* HEADER */}
                  <div className="text-center">
                    <p className="font-bold text-[13px]">
                      {safe(companyData?.compdesc || companyData?.name || "-")}
                    </p>
                    <p>{safe(companyData?.company_address?.[0]?.address1 || companyData?.address)}</p>
                    <p>Contact: {safe(companyData?.company_address?.[0]?.contact_no || companyData?.phone)}</p>
                    <p>Email: {safe(companyData?.company_address?.[0]?.email || companyData?.email)}</p>
                    <p>GSTIN: {safe(companyData?.ctaxnumber || companyData?.gst)}</p>
                  </div>

                  <div className="border-t border-dashed my-2" />

                  <p className="text-center font-bold">TAX INVOICE</p>

                  <div className="border-t border-dashed my-2" />

                  <p>INV No : {safe(displayInvoiceNumber)}</p>
                  <p>
                    Date : {order?.created_at ? new Date(order.created_at).toLocaleString() : "-"}
                  </p>
                  <p>Cashier : {safe(order?.cashier_name)}</p>

                  <div className="border-t border-dashed my-2" />

                  <p>Customer : {safe(order?.customer?.name)}</p>

                  <div className="border-t border-dashed my-2" />

                  {/* TABLE HEADER */}
                  <div className="receipt-grid font-bold text-[12px]">
                    <span>Item / UPC</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Disc</span>
                    <span className="text-right">Total</span>
                  </div>

                  <div className="border-t border-dashed my-1" />

                  {/* ITEMS */}
                  {items.length > 0 ? (
                    items.map((item, i) => (
                      <div key={i} className="mb-1">
                        <div className="receipt-grid text-[12px]">
                          <span>
                            {safe(item?.name)}
                            {item?.upc && item?.upc !== "-" && (
                              <>
                                <br />
                                <span className="text-[11px]">UPC: {safe(item?.upc)}</span>
                              </>
                            )}
                          </span>
                          <span className="text-right">
                            {money(item?.price)}
                          </span>
                          <span className="text-right">
                            {safe(item?.quantity)}
                          </span>
                          <span className="text-right">
                            {money(item?.discount)}
                          </span>
                          <span className="text-right">
                            {money(item?.total)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center">-</p>
                  )}

                  <div className="border-t border-dashed my-2" />

                  {/* TOTAL SECTION */}
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Tax</span>
                    <span>{money(taxTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Discount</span>
                    <span>{money(discount)}</span>
                  </div>

                  <div className="border-t border-dashed my-2" />

                  <div className="flex justify-between font-bold text-[12px]">
                    <span>Grand Total</span>
                    <span>Rs. {money(grandTotal)}</span>
                  </div>

                  <div className="border-t border-dashed my-2" />

                  {/* TAX SUMMARY */}
                  <p className="text-center font-bold">Tax Summary</p>

                  <div className="grid grid-cols-5 text-[11px] font-bold mt-1">
                    <span>Taxable</span>
                    <span className="text-right">CGST%</span>
                    <span className="text-right">Amt</span>
                    <span className="text-right">SGST%</span>
                    <span className="text-right">Amt</span>
                  </div>

                  <div className="grid grid-cols-5 text-[11px]">
                    <span>{money(subtotal)}</span>
                    <span className="text-right">{cgstPercent}%</span>
                    <span className="text-right">{money(cgst)}</span>
                    <span className="text-right">{sgstPercent}%</span>
                    <span className="text-right">{money(sgst)}</span>
                  </div>

                  <div className="border-t border-dashed my-2" />

                  <p className="text-center">Thank you for shopping!</p>

                  <div className="border-t border-dashed my-2" />

                  <p className="text-center text-[10px]">
                    Goods once sold will not be taken back.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL + PRINT STYLE */}
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Space+Grotesk:wght@400;500;600&display=swap");

        .font-display {
          font-family: "Fraunces", serif;
        }
        .font-sans {
          font-family: "Space Grotesk", sans-serif;
        }
        .animate-pop {
          animation: popIn 0.6s ease both;
        }
        .pop-delay-1 {
          animation-delay: 0.12s;
        }
        @keyframes popIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media print {
          @page {
            size: 68mm 200mm;
            margin: 0;
          }
          html, body {
            width: 68mm;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }
          body {
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
          #receipt {
            width: 68mm;
          }
          .print-area {
            box-shadow: none !important;
            margin: 0 !important;
          }
          .receipt-card {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .receipt-card > div:first-child {
            display: none !important;
          }
          .receipt-shell {
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}















