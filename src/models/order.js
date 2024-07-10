const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  _id: { type: String },
  cart_id: { type: String },
  username: { type: String },
  address_id: { type: String },
  item_id: {type: String},
  quantity: { type: String },
  total_price: { type: String },
  status_order: { type: String },
  created_at: { type: Date },
});

const Order = mongoose.model("Order", OrderSchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortOrder = sort === "asc" ? 1 : -1;
  const sortField = sortby || "_id";
  try {
    const OrderData = await Order.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(offset);
    return OrderData;
  } catch (error) {
    throw new Error("Error retrieving Order list: " + error.message);
  }
};

const selectById = async (_id) => {
  try {
    const selectId = await Order.findById({ _id });
    return selectId;
  } catch (error) {
    throw new Error("error selecting Order by ID: " + error.message);
  }
};

const insert = async (OrderData) => {
  try {
    const newOrder = await Order.create(OrderData);
    return newOrder;
  } catch (error) {
    throw new Error("Error input Order data: " + error.message);
  }
};

const update = async (OrderData) => {
  try {
    const updateOrder = await Order.updateOne(OrderData);
    return updateOrder;
  } catch (error) {
    throw new Error("Error update Order data: " + error.message);
  }
};

const deleteData = async (OrderData) => {
  try {
    const deleteOrder = await Order.deleteOne(OrderData);
    return deleteOrder;
  } catch (error) {
    throw new Error("Error delete Order data: " + error.message);
  }
};

const deleteAllOrder = async () => {
  try {
    const result = await Order.deleteMany({});
    return result;
  } catch (error) {
    throw new Error("Error deleteing all Data Order: " + error.message);
  }
};

module.exports = {
  Order,
  selectAll,
  selectById,
  insert,
  update,
  deleteData,
  deleteAllOrder,
};
