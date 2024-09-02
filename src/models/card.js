const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  _id: { type: String },
  userId: { type: String },
  username: { type: String },
  bank: { type: String },
  card_holder: { type: String },
  expiry_date: { type: String },
  card_number: { type: String },
  cvc: { type: String },
});

const CreditCard = mongoose.model("CreditCard", cardSchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortOrder = sort === "asc" ? 1 : -1;
  const sortField = sortby || "_id";
  try {
    const cardData = await CreditCard.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(offset);
    return cardData;
  } catch (error) {
    throw new Error("Error retrieving card list: " + error.message);
  }
};

const selectById = async (_id) => {
  try {
    const selectId = await CreditCard.findById({ _id });
    return selectId;
  } catch (error) {
    throw new Error("error selecting card by ID: " + error.message);
  }
};

const selectByUserId = async (userId) => {
  try {
    const selectUserId = await CreditCard.findOne({ userId });
    return selectUserId;
  } catch (error) {
    throw new Error("error selecting card by userId: " + error.message);
  }
};

const create = async (cardData) => {
  try {
    const newCreditCard = await CreditCard.create(cardData);
    return newCreditCard;
  } catch (error) {
    throw new Error("error creating card by ID: " + error.message);
  }
};

const update = async (cardData) => {
  try {
    const updateCreditCard = await CreditCard.updateOne(cardData);
    return updateCreditCard;
  } catch (error) {
    throw new Error("error updating card by ID: " + error.message);
  }
};

const deleteData = async (_id) => {
  try {
    const deleteCreditCard = await CreditCard.deleteOne({ _id });
    return deleteCreditCard;
  } catch (error) {
    throw new Error("Error delete card data: " + error.message);
  }
};

const deleteAllCreditCard = async (_id) => {
  try {
    const result = await CreditCard.deleteMany({ _id });
    return result;
  } catch (error) {
    throw new Error("Error delete card data: " + error.message);
  }
};

module.exports = {
  CreditCard,
  selectAll,
  selectById,
  selectByUserId,
  create,
  update,
  deleteData,
  deleteAllCreditCard,
};
