const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  _id: { type: String },
  bank_name: { type: String },
  card_holder: {type: String},
  expiration: {type: String},
  card_number: {type: String},
});

const Payment = mongoose.model("Payment", paymentSchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortOrder = sort === "asc" ? 1 : -1;
  const sortField = sortby || "_id";
  try {
    const paymentData = await Payment.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(offset);
    return paymentData;
  } catch (error) {
    throw new Error("Error retrieving payment list: " + error.message);
  }
};

const selectById = async (_id) => {
  try {
    const selectId = await Payment.findById({ _id });
    return selectId;
  } catch (error) {
    throw new Error("error selecting payment by ID: " + error.message);
  }
};

const insert = async (paymentData) => {
  try {
    const newPayment = await Payment.create(paymentData);
    return newPayment;
  } catch (error) {
    throw new Error("error creating payment by ID: " + error.message);
  }
};

const update = async (paymentData) => {
  try {
    const updatePayment = await Payment.updateOne(paymentData);
    return updatePayment;
  } catch (error) {
    throw new Error("error updating payment by ID: " + error.message);
  }
};

const deleteData = async (paymentData) => {
  try {
    const deletePayment = await Payment.deleteOne(paymentData);
    return deletePayment;
  } catch (error) {
    throw new Error("Error delete payment data: " + error.message);
  }
};

const deleteAllPayment = async (paymentData) => {
  try {
    const result = await Payment.deleteMany(paymentData);
    return result;
  } catch (error) {
    throw new Error("Error delete payment data: " + error.message);
  }
};

module.exports = {
  Payment,
  selectAll,
  selectById,
  insert,
  update,
  deleteData,
  deleteAllPayment
};
