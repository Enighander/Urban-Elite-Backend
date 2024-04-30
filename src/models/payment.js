const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  _id: { type: String },
  user_id: { type: String },
  shipment_id: { type: String },
  total_payment: { type: String },
  status_payment: { type: String },
  created_at: { type: String },
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
  } catch (error) {}
};

const insert = async (paymentData) => {
    try {
        
    } catch (error) {

    }
}
