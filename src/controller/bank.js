const Bank = require("../models/bank.js");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../middlewares/cloudinary/cloudinary.js");
const path = require("path");
const BankController = {
  getAllOrder: async (req, res) => {
    try {
      const {
        limit = 10,
        offset = 0,
        sort = "asc",
        sortby = "bank",
      } = req.query;
      const banks = await Bank.selectAll({ limit, offset, sort, sortby });
      res.status(200).json({ success: true, banks });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving all banks data",
        error: error.message,
      });
    }
  },
  createBanks: async (req, res) => {
    const bankId = uuidv4();
    const { bank } = req.body;
    try {
      let logo = "";
      if (req.file && req.file.filename) {
        const imagePath = path.join("UrbanElite", "Banks", req.file.filename);
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: imagePath.replace(/\\/g, "/"),
          overwrite: true,
        });
        logo = result.secure_url;
      }
      const newBank = {
        _id: bankId,
        bank,
        logo,
      };
      const createBank = await Bank.create(newBank);
      return res.status(201).json({
        success: true,
        message: "add bank successfully",
        bank: createBank,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error create bank",
        error: error.message,
      });
    }
  },
  deleteBank: async (req, res) => {
    const bankId = req.params.id;
    try {
      await Bank.deleteBank(bankId);
      res.status(200).json({
        success: true,
        message: "bank deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting bank",
        error: error.message,
      });
    }
  },
  deleteAllBanks: async (req, res) => {
    try {
      await Bank.deleteAll();
      res.status(200).json({
        success: true,
        message: "All bank deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting bank",
        error: error.message,
      });
    }
  },
};

module.exports = BankController;
