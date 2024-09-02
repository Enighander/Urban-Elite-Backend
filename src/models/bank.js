const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  _id: { type: String },
  bank: { type: String },
  logo: { type: String },
});

const Bank = mongoose.model("Bank", bankSchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortBank = sort === "asc" ? 1 : -1;
  const sortField = sortby || "bank";
  try {
    const bank = await Bank.find()
      .sort({ [sortField]: sortBank })
      .limit(limit)
      .skip(offset);
    return bank;
  } catch (error) {
    throw new Error("Error retrieving banks data: " + error.message);
  }
};
const create = async (bankData) => {
  try {
    const newBank = await Bank.create(bankData);
    return newBank;
  } catch (error) {
    throw new Error("Error create Bank data: " + error.message);
  }
};

const deleteBank = async (_id) => {
  try {
    const deleteBank = await Bank.deleteOne({ _id });
    return deleteBank;
  } catch (error) {
    throw new Error("Error Delete Data Bank: " + error.message);
  }
};

const deleteAll = async () => {
  try {
    const deleteAllBanks = await Bank.deleteMany();
    return deleteAllBanks;
  } catch (error) {
    throw new Error("Error Delete all Data Bank:" + error.message);
  }
};

module.exports = {
  Bank,
  selectAll,
  create,
  deleteBank,
  deleteAll,
};
