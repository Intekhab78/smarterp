import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import constantApi from "../constantApi";

export default function ThermalInvoice() {
    const [order, setOrder] = useState(null);
    const [companyData, setCompanyData] = useState(null);
    const navigate = useNavigate();

    /* LOAD ORDER */
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("SuccessOrder"));
        if (!saved) {
            navigate("/scan");
            return;
        }
        setOrder(saved?.data || saved);
    }, [navigate]);

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

    /* AUTO PRINT */
    useEffect(() => {
        if (!order) return;

        const timer = setTimeout(() => window.print(), 500);

        window.onafterprint = () => {
            localStorage.removeItem("SuccessOrder");
            navigate("/scan", { replace: true });
        };

        return () => {
            clearTimeout(timer);
            window.onafterprint = null;
        };
    }, [order, navigate]);

    if (!order) return null;

    /* SAFE HELPERS */
    const safe = (val) => (val ? val : "-");
    const money = (val) => Number(val || 0).toFixed(2);

    const items = order?.items || [];
    const subtotal = Number(order?.sub_total || 0);
    const taxTotal = Number(order?.tax_total || 0);
    const discount = Number(order?.discount_total || 0);
    const grandTotal = Number(order?.total || subtotal + taxTotal);

    const cgst = Number(order?.cgst ?? taxTotal / 2);
    const sgst = Number(order?.sgst ?? taxTotal / 2);

    const gstPercent =
        subtotal > 0 ? ((taxTotal / subtotal) * 100).toFixed(2) : "0.00";

    const cgstPercent = (gstPercent / 2).toFixed(2);
    const sgstPercent = (gstPercent / 2).toFixed(2);

    return (
        <div className="flex justify-center bg-gray-200 min-h-screen p-3">
            <div
                id="receipt"
                className="bg-white text-[11px] font-mono p-2"
                style={{ width: "58mm" }}
            >
                {/* HEADER */}
                <div className="text-center">
                    <p className="font-bold text-[13px]">
                        {safe(companyData?.compdesc)}
                    </p>
                    <p>{safe(companyData?.company_address?.[0]?.address1)}</p>
                    <p>Contact: {safe(companyData?.company_address?.[0]?.contact_no)}</p>
                    <p>Email: {safe(companyData?.company_address?.[0]?.email)}</p>
                    <p>GSTIN: {safe(companyData?.ctaxnumber)}</p>
                </div>

                <div className="border-t border-dashed my-2" />

                <p className="text-center font-bold">TAX INVOICE</p>

                <div className="border-t border-dashed my-2" />

                <p>INV No : {safe(order?.invoice_no || order?.id)}</p>
                <p>Date : {safe(new Date(order?.created_at).toLocaleString())}</p>
                <p>Cashier : {safe(order?.cashier_name)}</p>

                <div className="border-t border-dashed my-2" />

                <p>Customer : {safe(order?.customer?.name)}</p>

                <div className="border-t border-dashed my-2" />

                {/* TABLE HEADER */}
                <div className="grid grid-cols-5 font-bold">
                    <span className="col-span-2">Item</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Total</span>
                </div>

                <div className="border-t border-dashed my-1" />

                {/* ITEMS */}
                {items.length > 0 ? (
                    items.map((item, i) => (
                        <div key={i} className="mb-1">
                            <div className="grid grid-cols-5">
                                <span className="col-span-2">
                                    {safe(item?.name)}
                                </span>
                                <span className="text-right">
                                    {money(item?.price)}
                                </span>
                                <span className="text-right">
                                    {safe(item?.quantity)}
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
                    <span>Item Discount</span>
                    <span>{money(discount)}</span>
                </div>

                <div className="flex justify-between">
                    <span>CGST ({cgstPercent}%)</span>
                    <span>{money(cgst)}</span>
                </div>

                <div className="flex justify-between">
                    <span>SGST ({sgstPercent}%)</span>
                    <span>{money(sgst)}</span>
                </div>

                <div className="border-t border-dashed my-2" />

                <div className="flex justify-between font-bold text-[12px]">
                    <span>Grand Total</span>
                    <span>₹ {money(grandTotal)}</span>
                </div>

                <div className="border-t border-dashed my-2" />

                {/* TAX SUMMARY */}
                <p className="text-center font-bold">Tax Summary</p>

                <div className="grid grid-cols-5 text-[10px] font-bold mt-1">
                    <span>Taxable</span>
                    <span className="text-right">CGST%</span>
                    <span className="text-right">Amt</span>
                    <span className="text-right">SGST%</span>
                    <span className="text-right">Amt</span>
                </div>

                <div className="grid grid-cols-5 text-[10px]">
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

            {/* PRINT STYLE */}
            <style>{`
                @media print {
                    body {
                        margin: 0;
                    }
                    #receipt {
                        width: 58mm;
                    }
                }
            `}</style>
        </div>
    );
}