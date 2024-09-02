const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  _id: { type: String },
  amount: { type: String },
  currency: { type: String },
  metadata: {
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortPayment = sort === "asc" ? 1 : -1;
  const sortField = sortby || "_id";
  try {
    const PaymentData = await Payment.find()
      .sort({ [sortField]: sortPayment })
      .limit(limit)
      .skip(offset);
    return PaymentData;
  } catch (error) {
    throw new Error("Error retrieving Payment list: " + error.message);
  }
};

const selectById = async (_id) => {
  try {
    const selectId = await Payment.findById({ _id });
    return selectId;
  } catch (error) {
    throw new Error("error selecting Payment by ID: " + error.message);
  }
};

const insert = async (PaymentData) => {
  try {
    const newPayment = await Payment.create(PaymentData);
    return newPayment;
  } catch (error) {
    throw new Error("Error input Payment data: " + error.message);
  }
};

const update = async (PaymentData) => {
  try {
    const updatePayment = await Payment.updateOne(PaymentData);
    return updatePayment;
  } catch (error) {
    throw new Error("Error update Payment data: " + error.message);
  }
};

const deleteData = async (PaymentData) => {
  try {
    const deletePayment = await Payment.deleteOne(PaymentData);
    return deletePayment;
  } catch (error) {
    throw new Error("Error delete Payment data: " + error.message);
  }
};

const deleteAllPayment = async () => {
  try {
    const result = await Payment.deleteMany({});
    return result;
  } catch (error) {
    throw new Error("Error deleting all Data Payment: " + error.message);
  }
};

module.exports = {
  Payment,
  selectAll,
  selectById,
  insert,
  update,
  deleteData,
  deleteAllPayment,
};
