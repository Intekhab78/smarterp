const orderStatusTemplate = ({
  customerName,
  orderId,
  productName,
  quantity,
  orderStatus,
  trackingNumber,
  courierCompany,
  trackingUrl,
}) => {
  console.log("hello Ashish", customerName);

  return `
    <h3>Hello ${customerName},</h3>

    <p>Your order status has been updated.</p>

    <table border="1" cellpadding="8" cellspacing="0">
      <tr><td><strong>Order ID</strong></td><td>${orderId}</td></tr>
      <tr><td><strong>Status</strong></td><td>${orderStatus}</td></tr>
    </table>

    ${
      trackingNumber
        ? `
      <h4>Tracking Information</h4>
      <p><strong>Courier:</strong> ${courierCompany}</p>
      <p><strong>Tracking No:</strong> ${trackingNumber}</p>
      <p><a href="${trackingUrl}">Track your order</a></p>
    `
        : ""
    }

    <p>Thank you for shopping with us.</p>
    <p><strong>MyStore Team</strong></p>
  `;
};

module.exports = orderStatusTemplate;
