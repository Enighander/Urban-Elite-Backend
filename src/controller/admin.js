const { v4: uuidv4 } = require("uuid");
const Admin = require("../models/admin.js");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const authHelper = require("../helper/auth.js");

const registerAdminSchema = Joi.object({
  username: Joi.string()
    .min(6)
    .max(30)
    .required()
    .regex(/^[a-zA-Z0-9 ]+$/)
    .messages({
      "string.pattern.base":
        "admin can only contain alphanumberic characters and spaces",
      "string.min": "admin should have a minimum of 6 characters",
      "string.max": "admin was more than 30 characters",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a correct email format",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .regex(/^(?=.*[a-z\d])[a-z\d]{10,}$/)
    .min(10)
    .max(25)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least Alphanumberic at least one",
      "string.min": "Password should have a minimum of 10 characters",
      "string.max": "Password was more than 25 characters",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Password must match",
    "any.required": "Confirm password is required",
  }),
});

const updateAdminPasswordSchema = Joi.object({
  password: Joi.string()
    .regex(/^(?=.*[a-z\d])[a-z\d]{10,}$/)
    .min(10)
    .max(25)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least Alphanumberic at least one",
    }),
});

const adminController = {
  getAllAdmin: async (req, res) => {
    try {
      const { limit = 10, offset = 0, sort = "asc", sortby = "id" } = req.query;
      const admins = await Admin.selectAll({ limit, offset, sort, sortby });
      res.status(200).json({ success: true, admins });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving admins",
        error: error.message,
      });
    }
  },
  getAdmin: async (req, res) => {
    const adminId = req.params.id;
    try {
      const admin = await Admin.selectById(adminId);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "error Admin not found",
        });
      }
      res.status(200).json({
        success: true,
        admin: admin,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET admin by ID",
        error: error.message,
      });
    }
  },
  registerAdmin: async (req, res) => {
    const { username, email, password } = req.body;
    const { error } = registerAdminSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
    try {
      const existingEmail = await Admin.findByEmail(email);
      const existingUsername = await Admin.findByUsername(username);
      if (existingEmail) {
        return res.status(403).json({
          success: false,
          message: "admin email is already used. please try again",
        });
      } else if (existingUsername) {
        return res.status(403).json({
          success: false,
          message: "admin username account is already used. please try again",
        });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const adminId = uuidv4();

      const newAdmin = {
        _id: adminId,
        username,
        email,
        passwordHash,
        role: "admin",
      };
      const createdAdmin = await Admin.create(newAdmin);
      return res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        admin: createdAdmin,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the admin account",
        error: error.message,
      });
    }
  },
  loginAdmin: async (req, res, next) => {
    try {
      const { identifier, password } = req.body;
      const admin = await Admin.findByIdentifier(identifier);
      if (!admin) {
        return res.status(403).json({
          success: false,
          error: "Invalid admin account or password. Please try again",
        });
      }

      const isValidPassword = bcrypt.compareSync(password, admin.passwordHash);

      if (!isValidPassword) {
        return res.status(403).json({
          success: false,
          error: "Invalid admin account or password. please try again",
        });
      }

      const { _id, username, email, role } = admin.toObject();
      const payload = { id: _id, email, role };
      const adminData = {
        _id,
        username,
        email,
        role,
        token: authHelper.generateToken(payload),
        refreshToken: authHelper.generateRefreshToken(payload),
      };

      return res.status(200).json({
        success: true,
        message: "Login successful",
        admin: adminData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while logging in the account",
        error: error.message,
      });
    }
  },
  updateAdminPassword: async (req, res) => {
    const adminId = req.params.id;
    const { password } = req.body;

    try {
      const { error } = updateAdminPasswordSchema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({
          success: false,
          error: errorMessage,
        });
      }

      const existingUserAdmin = await Admin.selectById(adminId);
      if (!existingUserAdmin) {
        res.status(404).json({
          success: false,
          message: "error admin not found please login",
        });
      }
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const sendingAdminPassword = {
        passwordHash,
      };

      const updatedPassword = await Admin.update(sendingAdminPassword);
      return res.status(201).json({
        success: true,
        message: "admin password updated successfully",
        admin: updatedPassword,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the password",
        error: error.message,
      });
    }
  },
  deleteAdmin: async (req, res) => {
    const adminId = req.params.id;
    try {
      const deleteAdmin = await Admin.deleteAdmin(adminId);
      return res.status(201).json({
        success: true,
        message: "admin deactivated account successfully",
        admin: deleteAdmin,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while deactivated the account",
        error: error.message,
      });
    }
  },
};

module.exports = adminController;
