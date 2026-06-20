export const normalizeReceiptFromApi = (mode, api) => {
  if (!api) return null;
  console.log("api is means json  data", api);
  console.log("Mode is means data", mode);

  const details = api.invoice_details || [];

  const totals = details.reduce(
    (acc, d) => {
      const sign = Number(d.is_free) === 3 ? -1 : 1; // 🔥 RETURN = NEGATIVE

      const qty = Number(d.item_qty || 0);
      const price = Number(d.item_gross || d.item_price || 0);
      const gross = qty * price;

      const discountValue = Number(d.item_discount_amount || 0);
      const discountType = (d.discounttype || "").toLowerCase();

      let itemDiscount = 0;

      if (discountType === "percentage") {
        itemDiscount = (gross * discountValue) / 100;
      } else {
        itemDiscount = discountValue;
      }

      const globalDiscount = Number(d.doc_discount || 0);
      const net = Number(d.item_net || 0);
      const grand = Number(d.item_grand_total || 0);
      const tax = grand - net;

      acc.totalBeforeDiscount += gross * sign;
      acc.itemDiscount += itemDiscount * sign;
      acc.globalDiscount += globalDiscount * sign;
      acc.netTotal += net * sign;
      acc.taxAmount += tax * sign;
      acc.grandTotal += grand * sign;

      return acc;
    },
    {
      totalBeforeDiscount: 0,
      itemDiscount: 0,
      globalDiscount: 0,
      netTotal: 0,
      taxAmount: 0,
      grandTotal: 0,
    },
  );

  // ===================================================
  // ✅ ITEMS (CRITICAL FIXES HERE)
  // ===================================================

  const saleItems = [];
  const returnItems = [];

  (api.invoice_details || []).forEach((d) => {
    const isReturn = Number(d.is_free) === 3;
    const sign = isReturn ? -1 : 1;

    const itemObj = {
      id: d.id,
      itemName: d.itemLocationModel?.item_name,
      itemupc: d.itemLocationModel?.itemupc,
      price: Number(d.item_price || d.rate || 0),
      qty: Number(d.item_qty || 0) * sign,
      isReturn,
      item_tax: Number(d.itemLocationModel?.item_tax || 0),
      discountTotalItem: Number(d.item_discount_amount || 0) * sign,
      globalDiscountItem: Number(d.doc_discount || 0) * sign,
      total_with_exclusive_tax: Number(d.item_net || 0) * sign,
    };

    if (isReturn) {
      returnItems.push(itemObj);
    } else {
      saleItems.push(itemObj);
    }
  });

  const items = [...returnItems, ...saleItems];

  // =========================
  // ✅ PAYMENTS
  // =========================
  console.log("payments details is", api.payment_method_details);

  const payments = (api.payment_method_details || [])
    .filter((p) => {
      const modeLower = (p.payment_mode || "").toLowerCase();

      // ❌ Remove exchange internal rows
      if (modeLower === "exchange") return false;

      // ❌ Remove zero amount rows
      // if (Number(p.amount || 0) <= 0) return false;

      return true;
    })
    .map((p) => ({
      method: p.payment_mode,
      amount: Number(p.amount || 0),
      cardType: p.card_type || "",
      authCode: p.auth_code || "",
    }));

  const round = (n) => Number((n || 0).toFixed(2));

  const taxMap = {};

  details.forEach((d) => {
    const sign = Number(d.is_free) === 3 ? -1 : 1;

    const net = Number(d.item_net || 0) * sign;
    const grand = Number(d.item_grand_total || 0) * sign;

    const taxRate = Number(
      d.itemLocationModel?.tax_master_1?.taxcal || d.item_vat || 0,
    );

    const taxAmount = grand - net;

    if (taxRate > 0) {
      if (!taxMap[taxRate]) {
        taxMap[taxRate] = {
          taxable: 0,
          taxAmount: 0,
        };
      }

      taxMap[taxRate].taxable += net;
      taxMap[taxRate].taxAmount += taxAmount;
    }
  });

  const taxSummaryRows = Object.entries(taxMap).map(([rate, values]) => [
    Number(rate),
    {
      taxable: round(values.taxable),
      cgstAmt: round(values.taxAmount / 2),
      sgstAmt: round(values.taxAmount / 2),
    },
  ]);

  return {
    mode,
    items,
    invoiceNumber: api.invoice_number, // 👈 ADD THIS
    taxSummaryRows, // 👈 ADD THIS
    totals,
    payments,
    raw: api,
  };
};
