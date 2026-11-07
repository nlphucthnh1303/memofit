const PayOS = require("@payos/node");

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID || "sandbox_client_id",
  process.env.PAYOS_API_KEY || "sandbox_api_key",
  process.env.PAYOS_CHECKSUM_KEY || "sandbox_checksum_key"
);

const createPaymentLink = async ({ orderCode, amount, description, returnUrl, cancelUrl }) => {
  const paymentData = {
    orderCode,
    amount,
    description,
    returnUrl,
    cancelUrl
  };

  return await payos.createPaymentLink(paymentData);
};

const verifyPaymentWebhook = (webhookBody) => {
  return payos.verifyPaymentWebhookData(webhookBody);
};

module.exports = {
  createPaymentLink,
  verifyPaymentWebhook
};
