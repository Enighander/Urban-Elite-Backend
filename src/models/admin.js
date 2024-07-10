const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  _id: { type: String },
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String },
});

adminSchema.pre("save", async function (next) {
  try {
    if (this.isModified("passwordHash")) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(this.passwordHash, saltRounds);
      this.passwordHash = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.model("Admin", adminSchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortOrder = sort === "asc" ? 1 : -1;
  const sortField = sortby || "_id";
  try {
    const admins = await Admin.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(offset);
    return admins;
  } catch (error) {
    throw new Error("Error retrieving admin: " + error.message);
  }
};

const create = async (adminData) => {
  try {
    const newAdmin = await Admin.create(adminData);
    return newAdmin;
  } catch (error) {
    throw new Error("Error create newAdmin data: " + error.message);
  }
};

const selectById = async (_id) => {
  try {
    const selectAdminId = await Admin.findById({ _id });
    return selectAdminId;
  } catch (error) {
    throw new Error("Error selecting Admin ID: " + error.message);
  }
};

const findByUsername = async (username) => {
  try {
    const findUsername = await Admin.findOne({ username });
    return findUsername;
  } catch (error) {
    throw new Error("ERROR finding Admin: " + error.message);
  }
};

const update = async (adminData) => {
  try {
    const updateAdmin = await Admin.updateOne(adminData);
    return updateAdmin;
  } catch (error) {
    throw new Error("Error updating Admin ID: " + error.message);
  }
};

const deleteAdmin = async (_id) => {
  try {
    const deleteAdmin = await Admin.deleteOne({ _id });
    return deleteAdmin;
  } catch (error) {
    throw new Error("Error deleting admin data: " + error.message);
  }
};

module.exports = {
  Admin,
  selectAll,
  create,
  selectById,
  findByUsername,
  update,
  deleteAdmin,
};
