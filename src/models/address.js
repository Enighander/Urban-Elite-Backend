const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  _id: { type: String },
  username: { type: String },
  recipient_name: { type: String },
  address: { type: String },
  phone_number: { type: String },
  postal_code: { type: String },
  city: { type: String },
  user_id: { type: String },
});

const Address = mongoose.model("Address", addressSchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortOrder = sort === "asc" ? 1 : -1;
  const sortField = sortby || "_id";
  try {
    const address = await Address.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(offset);
    return address;
  } catch (error) {
    throw new Error("Error retrieving user: " + error.message);
  }
};

const selectById = async (_id) => {
  try {
    const selectId = await Address.findOne({ _id });
    return selectId;
  } catch (error) {
    throw new Error("error Selecting Address By ID: " + error.message);
  }
};

const selectByUsername = async (username) => {
  try {
    const selectUsername = await Address.findOne({ username });
    return selectUsername;
  } catch (error) {
    throw new Error("error Selecting Address By Username: " + error.message);
  }
};

const insert = async (addressData) => {
  try {
    const newAddress = await Address.create(addressData);
    return newAddress;
  } catch (error) {
    throw new Error("Error creating address: " + error.message);
  }
};

const updateById = async (addressData) => {
  try {
    const updateAddress = await Address.updateOne(addressData);
    return updateAddress;
  } catch (error) {
    throw new Error("Error update Address data: " + error.message);
  }
};

const updateByUsername = async (addressData) => {
  try {
    const updateAddress = await Address.updateOne(addressData);
    return updateAddress;
  } catch (error) {
    throw new Error("Error update Address data: " + error.message);
  }
};

const deleteAddress = async (_id) => {
  try {
    const deleteAddress = await Address.deleteOne({ _id });
    return deleteAddress;
  } catch (error) {
    throw new Error("Error Delete address data: " + error.message);
  }
};

module.exports = {
  Address,
  selectAll,
  selectById,
  selectByUsername,
  insert,
  updateById,
  updateByUsername,
  deleteAddress,
};
