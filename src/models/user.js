const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  _id: { type: String },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  full_name: { type: String },
  sex: { type: String },
  user_image: { type: String },
  user_address: { type: String },
  phone_number: { type: String },
  date_of_birth: { type: String },
  product_for_sale: { type: String },
  user_rating: { type: String },
  role: { type: String },
});

const User = mongoose.model("User", userSchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortOrder = sort === "asc" ? 1 : -1;
  const sortField = sortby || "_id";
  try {
    const users = await User.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(offset);
    return users;
  } catch (error) {
    throw new Error("Error retrieving user: " + error.message);
  }
};

const selectById = async (_id) => {
  try {
    const selectUserId = await User.findById({ _id });
    return selectUserId;
  } catch (error) {
    throw new Error("error Selecting User ID: " + error.message);
  }
};

const create = async (userData) => {
  try {
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    throw new Error("Error create newUser data: " + error.message);
  }
};


const update = async (filter, updateData) => {
  try {
    const updateUser = await User.findOneAndUpdate(filter, updateData, {new: true}); 
    return updateUser;
  } catch (error) {
    throw new Error("Error updating user data: " + error.message);
  }
};

const findById = async (_id) => {
  try {
    const findingId = await User.findOne({ _id });
    return findingId;
  } catch (error) {
    throw new Error("Error finding userId: " + error.message);
  }
};

const findByEmail = async (email) => {
  try {
    const findingEmail = await User.findOne({ email });
    return findingEmail;
  } catch (error) {
    throw new Error("Error finding Email: " + error.message);
  }
};

const findByUsername = async (username) => {
  try {
    const findUsername = await User.findOne({ username });
    return findUsername;
  } catch (error) {
    throw new Error("ERROR finding username: " + error.message);
  }
};

const findOneAndUpdate = async (email, newPasswordHash) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { passwordHash: newPasswordHash },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error("Error updating user password: " + error.message);
  }
};

const updatePasswordByGenerate = async (userId, newPasswordHash) => {
  try {
    const updateUserPassword = await User.findByIdAndUpdate(
      userId,
      { passwordHash: newPasswordHash },
      { new: true }
    );
    return updateUserPassword;
  } catch (error) {
    throw new Error("Error Update user password: " + error.message);
  }
};

const updateNewPassword = async (userData) => {
  try {
    const updateUser = await User.updateOne(
      { _id: userData.id },
      { passwordHash: userData.passwordHash }
    );
    return updateUser;
  } catch (error) {
    throw new Error("Error Update user data: " + error.message);
  }
};

const deleteUser = async (_id) => {
  try {
    const deleteUser = await User.deleteOne({ _id });
    return deleteUser;
  } catch (error) {
    throw new Error("Error Delete user data: " + error.message);
  }
};

module.exports = {
  User,
  selectAll,
  selectById,
  updateNewPassword,
  updatePasswordByGenerate,
  update,
  create,
  findById,
  findByEmail,
  findByUsername,
  findOneAndUpdate,
  deleteUser,
};
