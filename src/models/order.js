const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  _id: { type: String },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      product_name: { type: String, required: true },
      image_product: { type: String },
      quantity: { type: Number, required: true },
      color: { type: String },
      size: { type: String },
      price: { type: Number, required: true },
    },
  ],
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed","expired"],
    default: "pending",
  },
  recipient_name: { type: String },
  address: { type: String },
  phone_number: { type: String },
  postal_code: { type: String },
  city: { type: String },
  totalPrice: { type: Number },
  created_at: { type: Date, default: Date.now },
  midtransToken: { type: String }
});

const Order = mongoose.model("Order", orderSchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortOrder = sort === "asc" ? 1 : -1;
  const sortField = sortby || "_id";
  try {
    const order = await Order.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(offset);
    return order;
  } catch (error) {
    throw new Error("Error retrieving orders: " + error.message);
  }
};

const selectById = async (_id) => {
  try {
    const selectOrderId = await Order.findById({ _id });
    return selectOrderId;
  } catch (error) {
    throw new Error("Error Selecting Order ID:" + error.message);
  }
};

const findById = async (_id) => {
  try {
    const findingById = await Order.findOne({ _id });
    return findingById;
  } catch (error) {
    throw new Error("Error finding orderId: " + error.message);
  }
};

const findByUserId = async (userId) => {
  try {
    const findingByUserId = await Order.find({ userId });
    return findingByUserId;
  } catch (error) {
    throw new Error("Error finding order by Username: " + error.message);
  }
};

const findByIdAndUpdate = async (orderId, paymentStatus) => {
  try {
    const updateStatusPayment = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true }
    );
    return updateStatusPayment;
  } catch (error) {
    throw new Error("Error finding order By " + error.message);
  }
};

const findByUsername = async (username) => {
  try {
    const findingByUsername = await Order.findOne({ username });
    return findingByUsername;
  } catch (error) {
    throw new Error("Error finding order Username: " + error.message);
  }
};

const createOrder = async (orderData) => {
  try {
    const newOrder = await Order.create(orderData);
    return newOrder;
  } catch (error) {
    throw new Error("Error create newUser data:" + error.message);
  }
};

const deleteOrder = async (_id) => {
  try {
    const deleteOrder = await Order.deleteOne({ _id });
    return deleteOrder;
  } catch (error) {
    throw new Error("Error Delete Order Data: " + error.message);
  }
};

const deleteAllOrder = async () => {
  try {
    const result = await Order.deleteMany({});
    return result;
  } catch (error) {
    throw new Error("Error deleting all orders" + error.message);
  }
};

module.exports = {
  Order,
  selectAll,
  selectById,
  createOrder,
  findById,
  findByIdAndUpdate,
  findByUserId,
  findByUsername,
  deleteOrder,
  deleteAllOrder,
};
