const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

exports.createTransaction = async (orderId, totalPrice, products, user) => {
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: totalPrice,
    },
    item_details: products.map((product) => ({
      id: product.productId,
      price: product.price,
      quantity: product.quantity,
      name: product.product_name,
    })),
    customer_details: {
      first_name: user.username,
      email: user.email,
    },
    enabled_payments: [
      "credit_card",
      "cimb_clicks",
      "bca_klikbca",
      "bca_klikpay",
      "bri_epay",
      "echannel",
      "permata_va",
      "bca_va",
      "bni_va",
      "bri_va",
      "cimb_va",
      "other_va",
      "gopay",
      "indomaret",
      "danamon_online",
      "akulaku",
      "shopeepay",
      "kredivo",
      "uob_ezpay",
      "other_qris",
    ],
  };
  try {
    const transaction = await snap.createTransaction(parameter);
    return transaction;
  } catch (error) {
    console.error("Error creating Midtrans transaction:", error);
    throw new Error("Failed to create transaction");
  }
};
