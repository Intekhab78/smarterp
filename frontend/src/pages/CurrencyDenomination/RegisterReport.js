import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { IoMdMore } from "react-icons/io";
import { ToastMassage } from "toast";
import { axios_get, axios_post } from "../../axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import constantApi from "constantApi";

function RegisterReport() {
  const [loading, setLoading] = useState(true);
  const [floatData, setFloatData] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [cashierDetails, setCashierDetails] = useState({});
  const [compines, setCompines] = useState([]);
  const [userCompany, setUserCompany] = useState(null);

  const navigate = useNavigate();
  const menuRef = useRef(null);

  const fetchFloatData = async () => {
    try {
      const response = await axios.get(
        `${constantApi.baseUrl}/register_float/list`
      );
      //   console.log("repsonde form the float data is --", response.data);

      if (response.data.status) {
        setFloatData(response.data.data);
      }
    } catch (err) {
      ToastMassage("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };
  const visibleFloatData =
    cashierDetails?.role_id !== 35
      ? floatData.filter((entry) => entry.open_by_id === cashierDetails.id)
      : floatData;

  const [collectionData, setCollectionData] = useState([]);

  const fetchCollectionDetails = async () => {
    try {
      const response = await axios.get(
        `${constantApi.baseUrl}/collection_details/list`
      );

      if (response.data.status) {
        const allCollectionData = response.data.data;
        setCollectionData(allCollectionData);
        const filtered = filterCollectionByRegisterId(allCollectionData, 4);
      } else {
        ToastMassage("❌ No collection data found", "error");
      }
    } catch (error) {
      console.error("❌ Error fetching collection details:", error);
      ToastMassage("❌ Failed to fetch collection details", "error");
    }
  };

  const filterCollectionByRegisterId = (collectionData, registerId) => {
    if (!Array.isArray(collectionData)) return [];

    return collectionData.filter(
      (item) => item.registerHeader?.id === registerId
    );
  };

  useEffect(() => {
    fetchFloatData();
    fetchCollectionDetails();
  }, []);

  const handleEdit = (entry) => {
    console.log("Edit", entry);
    setOpenMenu(null);
  };

  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem("user_data"));
    setCashierDetails(user_data);
  }, []);
  console.log("cashierDetails", cashierDetails);

  useEffect(() => {
    const fetchcompanyList = async () => {
      const response = await axios_post(true, "company/com_list");
      if (response?.status) {
        setCompines(response.data);
      }
    };
    fetchcompanyList();
  }, []);

  useEffect(() => {
    if (cashierDetails?.company_id && compines.length > 0) {
      const matched = compines.find(
        (company) => String(company.id) === String(cashierDetails.company_id)
      );
      setUserCompany(matched);
    }
  }, [cashierDetails, compines]);

  const handleCloseConfirm = async (entry) => {
    const user = JSON.parse(localStorage.getItem("user_data"));
    const openedBy = entry.open_by; // adjust this if it's an ID or object
    setOpenMenu(null);

    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/register_float/registerSettingList`
      );
      if (res?.data?.status) {
        const mode = res.data.mode;

        if (mode === "cashierwise" && openedBy !== user.firstname) {
          ToastMassage(
            "❌ Only the cashier who opened this register can close it.",
            "error"
          );
          return;
        }

        // ✅ Allow navigation if daywise or same cashier
        navigate("/closeReport", { state: { entry } });
      } else {
        ToastMassage("⚠️ Failed to check register mode", "error");
        setOpenMenu(null);
      }
    } catch (error) {
      console.error("Error fetching mode:", error);
      ToastMassage("❌ Server error while checking permissions", "error");
      setOpenMenu(null);
    }
  };

  const fetchandFilterInvoiceDetailsById = async (registerId) => {
    console.log("registerId", registerId);
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/invoice/by_register_id`,
        {
          register_tbl_hdr_id: registerId,
        }
      );
      //   console.log("✅ Response for invoices by register ID:", response.data);
      if (response.data.status) {
        return response.data.data.records; // return only the records array
      } else {
        console.warn("⚠️ No invoice data found for Register ID:", registerId);
        return [];
      }
    } catch (error) {
      console.error("❌ Error fetching invoice data by register ID:", error);
      return [];
    }
  };
  const fetchRegisterDetailsById = async (registerId) => {
    try {
      const response = await axios.get(
        `${constantApi.baseUrl}/register_float/details/${registerId}`
      );
      if (response.data.status) {
        return response.data.data;
      } else {
        console.warn("No register details found for ID:", registerId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching register details:", error);
      return null;
    }
  };

  const buildRegisterSummary = async (registerId, collectionData) => {
    const filtered = filterCollectionByRegisterId(collectionData, registerId);
    const registerData = await fetchRegisterDetailsById(registerId);
    const invoices = await fetchandFilterInvoiceDetailsById(registerId);

    const hdr = registerData?.hdr || {};
    const floatAmount = hdr.float_amount || 0;
    const openBy = hdr.open_by || "Not Available";
    const date = hdr.date || "N/A";
    const time = hdr.time || "N/A";

    const totalCollectionAmount = filtered.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    const returnAmount = 0;

    const paymentSummary = {
      cash: 0,
      credit_card: 0,
      visa: 0,
      master: 0,
      maestro: 0,
      coupon: 0,
      gift_card: 0,
      gift_voucher: 0,
    };

    filtered.forEach((item) => {
      const mode = item.payment_mode?.toLowerCase().replace(/\s+/g, "_");
      if (paymentSummary.hasOwnProperty(mode)) {
        paymentSummary[mode] += parseFloat(item.amount || 0);
      }
    });

    return {
      summaryData: {
        registerOpenAmount: floatAmount,
        salesAmount: totalCollectionAmount,
        tax: 0.0,
        returnAmount,
        paymentModes: {
          totalCash: paymentSummary.cash,
          creditCard: paymentSummary.credit_card,
          gift_card: paymentSummary.gift_card,
          visa: paymentSummary.visa,
          master: paymentSummary.master,
          maestro: paymentSummary.maestro,
        },
        otherPayments: {
          coupons: paymentSummary.coupon,
          gift_voucher: paymentSummary.gift_voucher,
          //   giftCard: paymentSummary["gift card"] || 0,
        },
      },
      invoices,
      date,
      time,
      openBy,
      userCompany,
      paymentSummary,
    };
  };

  const handleView = async (registerId) => {
    console.log("View", registerId);
    setOpenMenu(null);
    const { summaryData } = await buildRegisterSummary(
      registerId,
      collectionData
    );

    console.log("Summary Data:", summaryData);
  };

  const handleViewCollection = async (registerId) => {
    setOpenMenu(null);

    const {
      summaryData,
      invoices,
      date,
      time,
      openBy,
      userCompany,
      paymentSummary,
    } = await buildRegisterSummary(registerId, collectionData);
    console.log("Summary Data:", summaryData);

    const invoiceTableRows = invoices.length
      ? invoices
          .map(
            (inv) => `
      <tr>
        <td>${inv.invoice_number || "N/A"}</td>
        <td>${inv.invoice_type || "N/A"}</td>
        <td>${inv.register_tbl_hdr_id || "-"}</td>
        <td>${inv.total_gross || "0.00"}</td>
        <td>${((parseFloat(inv.total_gross) || 0) * 0.05).toFixed(2)}</td>
        <td>${inv.grand_total || "0.00"}</td>
      </tr>`
          )
          .join("")
      : `<tr><td colspan="4">No invoice data</td></tr>`;

    const htmlContent = `
    <html>
      <head>
        <title>Receipt for Register ID ${registerId}</title>
        <style>
          body {
            font-family: monospace;
            padding: 20px;
            background: #fff;
            text-align: center;
          }
          .receipt {
            max-width: 600px;
            margin: auto;
            border: 1px dashed #aaa;
            padding: 20px;
          }
          .section {
            margin: 16px 0;
            border-top: 1px dashed #ddd;
            padding-top: 10px;
          }
          .bold {
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 4px;
            font-size: 14px;
          }
          th {
            background-color: #f0f0f0;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="bold">${userCompany?.compdesc || "Company Name"}</div>
          <div>${date} ${time}</div>
          <div>Cashier: ${openBy}</div>

          <div class="section bold">Invoice Summary</div>
          <table>
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Type</th>
                <th>Register ID</th>
                <th>Total Gross</th>
                <th>VAT 5%</th>
                <th>Grand Total</th>
              </tr>
            </thead>
            <tbody>${invoiceTableRows}</tbody>
          </table>

          <div class="section">
            <div>Register Open Amt :  ${summaryData.registerOpenAmount}</div>
            <div>Sales Amount :  ${summaryData.salesAmount}</div>
            <div>Tax :  ${summaryData.tax}</div>
            <div>Return Amount :  ${summaryData.returnAmount}</div>
          </div>

          <div class="section bold">Payment Modes</div>
          <div>Total Cash :  ${paymentSummary.cash}</div>
          <div>Credit Card :  ${paymentSummary.credit_card}</div>
          <div>Gift Card :  ${paymentSummary.gift_card}</div>
          <div>Visa :  ${paymentSummary.visa}</div>
          <div>Master :  ${paymentSummary.master}</div>
          <div>Maestro :  ${paymentSummary.maestro}</div>

          <div class="section bold">Other Payments</div>
          <div>Coupons :  ${paymentSummary.coupon}</div>
          <div>Vouchers :  ${paymentSummary.gift_voucher}</div>

          <div class="section">Thank you!</div>
        </div>
      </body>
    </html>`;

    const newTab = window.open();
    newTab.document.write(htmlContent);
    newTab.document.close();
  };

  const handleDelete = (entry) => {
    console.log("Delete", entry);
    setOpenMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // setIsMenuOpen(false);
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        // <div className="p-4 overflow-x-auto">
        <div className="p-4 overflow-x-auto overflow-visible relative z-0">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            POS Cash Float Report
          </h2>
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-x-auto border rounded-md">
              <table className="min-w-[1200px] text-xs border border-gray-200 shadow-sm rounded-md">
                <thead className="bg-gray-100 text-[11px] uppercase">
                  <tr>
                    <th className="border px-2 py-2 text-left">ID</th>
                    <th className="border px-2 py-2 text-left">Currency</th>
                    <th className="border px-2 py-2 text-left">Date</th>
                    <th className="border px-2 py-2 text-left">Time</th>
                    <th className="border px-2 py-2 text-left">Open By</th>
                    <th className="border px-2 py-2 text-left">Open By Id</th>
                    <th className="border px-2 py-2 text-left">Status</th>
                    <th className="border px-2 py-2 text-left">Float Amt</th>
                    <th className="border px-2 py-2 text-left">Close By</th>
                    <th className="border px-2 py-2 text-left">Closed Date</th>
                    <th className="border px-2 py-2 text-left">Closed Time</th>
                    <th className="border px-2 py-2 text-left">Over Short</th>
                    <th className="border px-2 py-2 text-left">reason</th>
                    <th className="border px-2 py-2 text-left">Approve By</th>
                    <th className="border px-2 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleFloatData.map((entry, index) => {
                    const isMenuOpen = openMenu === index;
                    return (
                      <tr
                        key={entry.id}
                        className={`hover:bg-gray-50 transition-colors duration-100 ${
                          entry.status?.toLowerCase() === "open"
                            ? "bg-green-100"
                            : "bg-white"
                        }`}
                      >
                        <td className="border px-2 py-1">{entry.id}</td>
                        <td className="border px-2 py-1">{entry.currency}</td>
                        <td className="border px-2 py-1">{entry.date}</td>
                        <td className="border px-2 py-1">{entry.time}</td>
                        <td className="border px-2 py-1">{entry.open_by}</td>
                        <td className="border px-2 py-1">{entry.open_by_id}</td>
                        <td className="border px-2 py-1 capitalize">
                          {entry.status}
                        </td>
                        <td className="border px-2 py-1">
                          {entry.float_amount}
                        </td>
                        <td className="border px-2 py-1">
                          {entry.close_by || "-"}
                        </td>
                        <td className="border px-2 py-1">
                          {entry.close_date || "-"}
                        </td>
                        <td className="border px-2 py-1">
                          {entry.close_time || "-"}
                        </td>
                        <td className="border px-2 py-1">
                          {entry.over_short || "-"}
                        </td>
                        <td className="border px-2 py-1">
                          {entry.reason || "-"}
                        </td>
                        <td className="border px-2 py-1">
                          {entry.approve_by || "-"}
                        </td>

                        {/* Action cell with dropdown */}
                        <td className="border px-2 py-1">
                          <div className="relative inline-block w-full">
                            <div
                              className="cursor-pointer text-xl text-gray-600"
                              onClick={() =>
                                setOpenMenu(isMenuOpen ? null : index)
                              }
                            >
                              <IoMdMore />
                            </div>

                            {isMenuOpen && (
                              <div className="absolute -left-20 top-full mt-1 w-28 bg-white border border-gray-200 shadow-md rounded-md text-[12px] z-50">
                                <ul className="py-1">
                                  <li
                                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                      handleViewCollection(entry.id)
                                    }
                                  >
                                    View Reg
                                  </li>
                                  <li
                                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleCloseConfirm(entry)}
                                  >
                                    Close
                                  </li>
                                  <li
                                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleView(entry.id)}
                                  >
                                    View
                                  </li>
                                  {/* <li
                                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleEdit(entry)}
                                  >
                                    Edit
                                  </li> */}
                                  {/* {entry.status == "close " && (
                                <li
                                  className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleCloseConfirm(entry)}
                                >
                                  Close
                                </li>
                              )} */}

                                  {/* <li
                                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-red-500"
                                    onClick={() => handleDelete(entry)}
                                  >
                                    Delete
                                  </li> */}
                                </ul>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default RegisterReport;
