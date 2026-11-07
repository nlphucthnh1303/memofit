const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { createPaymentLink, verifyPaymentWebhook } = require("../services/payos.service");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const { planType, amount, description } = req.body;
    const userId = req.user.id;
    const orderCode = Number(String(Date.now()).slice(-6));

    const paymentLinkRes = await createPaymentLink({
      orderCode,
      amount: amount || 99000,
      description: description || `Memofit ${planType || "Pro"}`,
      returnUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment/success`,
      cancelUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment/cancel`
    });

    await prisma.subscription_orders.create({
      data: {
        user_id: userId,
        order_code: BigInt(orderCode),
        plan_type: planType || "MONTHLY",
        amount: amount || 99000,
        status: "PENDING",
        payos_payment_link_id: paymentLinkRes.paymentLinkId
      }
    });

    res.json({
      status: "success",
      data: paymentLinkRes,
      message: "Tạo link thanh toán thành công"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error_code: "PAYMENT_CREATION_FAILED",
      message: error.message
    });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    const webhookData = verifyPaymentWebhook(req.body);

    if (webhookData && webhookData.code === "00") {
      const orderCode = BigInt(webhookData.orderCode);

      const order = await prisma.subscription_orders.findUnique({
        where: { order_code: orderCode }
      });

      if (order) {
        await prisma.subscription_orders.update({
          where: { order_code: orderCode },
          data: {
            status: "PAID",
            paid_at: new Date()
          }
        });

        await prisma.users.update({
          where: { id: order.user_id },
          data: {
            role: "PRO_USER"
          }
        });
      }
    }

    res.json({
      status: "success",
      message: "Webhook processed"
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
});

module.exports = router;
