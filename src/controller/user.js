const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const authHelper = require("../helper/auth.js");
const nodemailer = require("../helper/nodemailer.js");

const registerUserSchema = Joi.object({
  username: Joi.string()
    .min(6)
    .max(30)
    .required()
    .regex(/^[a-zA-Z ]+$/)
    .messages({
      "string.pattern.base":
        "username can only contain alphanumberic characters and spaces",
      "string.min": "Username should have a minimum of 6 characters",
      "string.max": "Username was more than 30 characters",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Optionally, you can specify to disallow top-level domains (TLDs) to avoid common fake email formats
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
    }),
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(6).max(30).required().messages({
    "string.min": "Username should have a minimum of 6 characters",
    "string.max": "Username was more than 30 characters",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Optionally, you can specify to disallow top-level domains (TLDs) to avoid common fake email formats
    .required()
    .messages({
      "string.email": "Please enter a correct email format",
      "any.required": "Email is required",
    }),
  phone_number: Joi.string()
    .min(10)
    .max(12)
    .pattern(/^[0-9]+$/)
    .messages({
      "string.min": "Phone number should have a minimum of 10 digits",
      "string.max": "Phone number should have a maximum of 12 digits",
      "string.pattern.base": "Phone number should only contain digits",
    }),
  full_name: Joi.string()
    .regex(/^[a-zA-Z ]+$/)
    .messages({
      "string.pattern.base":
        "Fullname can only contain alphabetic characters and spaces",
    }),
  user_image: Joi.string(),
  date_of_birth: Joi.string(),
});

const updateUserPasswordSchema = Joi.object({
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

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Optionally, you can specify to disallow top-level domains (TLDs) to avoid common fake email formats
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
    }),
});

const userController = {
  getAllUser: async (req, res) => {
    try {
      const { limit = 10, offset = 0, sort = "asc", sortby = "id" } = req.query;
      const users = await User.selectAll({ limit, offset, sort, sortby });
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving users",
        error: error.message,
      });
    }
  },
  getUser: async (req, res) => {
    const username = req.params.username;
    try {
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "error User not found",
        });
      }
      res.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET user by ID",
        error: error.message,
      });
    }
  },
  searchUser: async (req, res) => {
    
  },
  registerUser: async (req, res, next) => {
    const { username, email, password } = req.body;
    const { error } = registerUserSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
    try {
      const existingUser = await User.findByEmail(email);
      const existingUsername = await User.findByUsername(username);
      if (existingUser) {
        return res.status(403).json({
          success: false,
          message: "Email is already used. please try again",
        });
      } else if (existingUsername) {
        return res.status(403).json({
          success: false,
          message: "Username is already used. please try again",
        });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const userId = uuidv4();

      const newUser = {
        _id: userId,
        username,
        email,
        passwordHash,
        role: "user",
      };
      const createdUser = await User.insert(newUser);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: createdUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the account",
        error: error.message,
      });
    }
  },
  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const lowercaseEmail = email.toLowerCase();

      const user = await User.findByEmail(lowercaseEmail);
      const isValidPassword = bcrypt.compareSync(password, user.passwordHash);

      if (!user) {
        return res.status(403).json({
          success: false,
          error: "Invalid email or password. Please try again",
        });
      } else if (!isValidPassword) {
        return res.status(403).json({
          success: false,
          error: "Invalid email or password. please try again",
        });
      }

      const {
        passwordHash,
        full_name,
        user_image,
        user_address,
        phone_number,
        date_of_birth,
        product_for_sale,
        user_rating,
        ...userData
      } = user.toObject();

      const payload = {
        email: userData.email,
        role: userData.role,
      };
      userData.token = authHelper.generateToken(payload);
      userData.refreshToken = authHelper.generateRefreshToken(payload);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: userData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while login the account",
        error: error.message,
      });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "Error user not found, please sign up",
        });
      }

      const { error } = forgotPasswordSchema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({
          success: false,
          error: errorMessage,
        });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const updatedUser = await User.findOneAndUpdate(email, passwordHash);

      const sanitizedUser = { ...updatedUser.toObject() };
      delete sanitizedUser.passwordHash;

      return res.status(201).json({
        success: true,
        message: "user password update successfully",
        user: sanitizedUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the password",
        error: error.message,
      });
    }
  },
  forgotPasswordSendingByEmail: async (req, res) => {
    const { email } = req.body;
    try {
      const existingUser = await User.findByEmail(email);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found. Please sign up.",
        });
      }

      const password = authHelper.generateRandomPassword();

      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(password, saltRounds);

      await User.updatePassword(existingUser._id, newPasswordHash);

      await nodemailer.sendPasswordResetEmail(existingUser.email, password);

      return res.status(200).json({
        success: true,
        message: "New password sent to your email. Please check your inbox.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing the request.",
        error: error.message,
      });
    }
  },
  updatePassword: async (req, res, next) => {
    const userId = req.params.id;
    const { password } = req.body;

    try {

      const { error } = updateUserPasswordSchema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({
          success: false,
          error: errorMessage,
        });
      }

      const existingUser = await User.selectById(userId);
      if (!existingUser) {
        res.status(404).json({
          success: false,
          message: "error user not found",
        });
      }
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const sendingUserPassword = {
        passwordHash,
      };

      const updatedPassword = await User.update(sendingUserPassword);

      return res.status(201).json({
        success: true,
        message: "user password update successfully",
        user: updatedPassword,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the password",
        error: error.message,
      });
    }
  },
  updateUser: async (req, res, next) => {
    const userId = req.params.id;
    const {
      username,
      email,
      full_name,
      user_image,
      phone_number,
      date_of_birth
    } = req.body;
    try {
      const existingUser = await User.selectById(userId);
      if (!existingUser) {
        res.status(404).json({
          success: false,
          message: "error user not found",
        });
      }
      const { error } = updateUserSchema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({
          success: false,
          error: errorMessage,
        });
      }
      const sendingUserData = {
        username,
        email,
        full_name,
        user_image,
        phone_number,
        date_of_birth,
      };
      const updatedUser = await User.update(sendingUserData);
      return res.status(201).json({
        success: true,
        message: "User Updated Successfully",
        user: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the account",
        error: error.message,
      });
    }
  },
  deleteUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const deactivatedUser = await User.deleteUser(userId);
      return res.status(201).json({
        success: true,
        message: "User Deactivated account successfully",
        user: deactivatedUser,
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

module.exports = userController;
