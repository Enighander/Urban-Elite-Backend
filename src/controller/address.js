const Address = require("../models/address.js");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const addressSchema = Joi.object({
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
  recipient_name: Joi.string()
    .required()
    .regex(/^[a-zA-Z ]+$/)
    .messages({
      "string.pattern.base":
        "Recipient name can only contain alphabetic characters and spaces",
    }),
  address: Joi.string().required(),
  phone_number: Joi.string()
    .required()
    .min(10)
    .max(12)
    .pattern(/^[0-9]+$/)
    .messages({
      "string.min": "Phone number should have a minimum of 10 digits",
      "string.max": "Phone number should have a maximum of 12 digits",
      "string.pattern.base": "Phone number should only contain digits",
    }),
  postal_code: Joi.string()
    .required()
    .length(5)
    .regex(/^\d{5}$/)
    .messages({
      "string.length": "Postal code should have exactly 5 digits",
      "string.pattern.base": "Postal code should only contain digits",
    }),
  city: Joi.string()
    .required()
    .regex(/^[a-zA-Z ]+$/)
    .messages({
      "string.pattern.base":
        "City can only contain alphabetic characters and spaces",
    }),
});

const addressController = {
  getAllAddress: async (req, res) => {
    try {
      const { limit = 10, offset = 0, sort = "asc", sortby = "id" } = req.query;
      const address = await Address.selectAll({ limit, offset, sort, sortby });
      res.status(200).json({ success: true, address });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving users",
        error: error.message,
      });
    }
  },
  getAddressByUsername: async (req, res) => {
    const username = req.params.username;
    try {
      const existingAddress = await Address.selectByUsername(username);
      if (!existingAddress) {
        return res.status(404).json({
          success: false,
          message: "error Address not found or Address data are empty",
        });
      }
      return res.status(200).json({
        success: true,
        address: existingAddress,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "error GET address by Username",
        error: error.message,
      });
    }
  },
  getAddressById: async (req, res) => {
    const addressId = req.params.id;
    try {
      const existingAddress = await Address.selectById(addressId);
      if (!existingAddress) {
        return res.status(404).json({
          success: false,
          message: "error Address not found or Address data are empty",
        });
      }
      return res.status(200).json({
        success: true,
        address: existingAddress,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "error GET address by ID",
        error: error.message,
      });
    }
  },
  createAddress: async (req, res) => {
    const {
      username,
      recipient_name,
      address,
      phone_number,
      postal_code,
      city,
    } = req.body;
    try {
      const { error } = addressSchema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({
          success: false,
          error: errorMessage,
        });
      }
      const addressId = uuidv4();
      const newAddress = {
        _id: addressId,
        username,
        recipient_name,
        address,
        phone_number,
        postal_code,
        city,
      };

      const createdAddress = await Address.insert(newAddress);
      return res.status(201).json({
        success: true,
        message: "create Address successfully",
        user: createdAddress,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error create Address",
        error: error.message,
      });
    }
  },
  updateAddressByUsername: async (req, res) => {
    const username = req.params.username;
    const {recipient_name, address, phone, postal_code, city} = req.body;
    try {
      const existingAddress = await Address.selectByUsername(username);
      if (!existingAddress) {
        res.status(404).json({
          success: false,
          message: "error Address not found or Address data are empty",
        });
      }
      const { error } = addressSchema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({
          success: false,
          error: errorMessage,
        });
      }

      const sendingAddressData = {
        recipient_name,
        address,
        phone,
        postal_code,
        city,
      };
      const updatedAddress = await Address.updateByUsername(sendingAddressData);
      return res.status(201).json({
        success: true,
        message: "Address Updated Succsessfully",
        user: updatedAddress,
      });
    } catch (error) {

    }
  },
  updateAddressById: async (req, res) => {
    const addressId = req.params.id;
    const { recipient_name, address, phone, postal_code, city } = req.body;
    try {
      const existingAddress = await Address.selectById(addressId);
      if (!existingAddress) {
        res.status(404).json({
          success: false,
          message: "error Address not found or Address data are empty",
        });
      }

      const { error } = addressSchema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({
          success: false,
          error: errorMessage,
        });
      }

      const sendingAddressData = {
        recipient_name,
        address,
        phone,
        postal_code,
        city,
      };
      const updatedAddress = await Address.updateById(sendingAddressData);
      return res.status(201).json({
        success: true,
        message: "Address Updated Succsessfully",
        user: updatedAddress,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the address",
        error: error.message,
      });
    }
  },
  deleteAddress: async (req, res) => {
    const addressId = req.params.id;
    try {
      const deleteAddress = await Address.deleteAddress(addressId);
      return res.status(201).json({
        success: true,
        message: "User Address deleted successfully",
        user: deleteAddress,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while delete the address data",
        error: error.message,
      });
    }
  },
};

module.exports = addressController;
