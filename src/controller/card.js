const CreditCard = require("../models/card.js");
const { encrypt } = require("../helper/encryption.js");
const { v4: uuidv4 } = require("uuid");

const cardController = {
  getAllCreditCard: async (req, res) => {
    try {
      const { limit = 10, offset = 0, sort = "asc", sortby = "id" } = req.query;
      const cardData = await CreditCard.selectAll({
        limit,
        offset,
        sort,
        sortby,
      });
      res.status(200).json({ success: true, cardData });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving card list",
        error: error.message,
      });
    }
  },
  getCreditCardById: async (req, res) => {
    const cardId = req.params.id;
    try {
      const userCard = await CreditCard.selectById(cardId);
      if (!userCard) {
        return res.status(404).json({
          success: false,
          message: "error card list not found or empty",
        });
      }
      res.status(200).json({
        success: true,
        card: userCard,
      });
    } catch (error) {
      res.return(500).json({
        success: false,
        message: "error GER card by ID",
        error: error.message,
      });
    }
  },
  getCreditCardByUserID: async (req, res) => {
    const userId = req.params.userId;
    try {
      const cartList = await CreditCard.selectByUserId(userId);
      if (!cartList) {
        return res.status(404).json({
          success: false,
          message: "error card list not found or empty",
        });
      }
      res.status(200).json({
        success: true,
        card: cartList,
      });
    } catch (error) {
      res.return(500).json({
        success: false,
        message: "error GER card by ID",
        error: error.message,
      });
    }
  },
  createCreditCard: async (req, res) => {
    const {
      userId,
      username,
      bank,
      card_holder,
      expiration,
      expiry_date,
      cvc,
    } = req.body;
    try {
      const cardId = uuidv4();
      const encryptedCVC = encrypt(cvc);
      const newCreditCard = {
        _id: cardId,
        userId,
        username,
        bank,
        card_holder,
        expiration,
        expiry_date,
        cvc: encryptedCVC.encryptedData,
        iv: encryptedCVC.iv,
      };
      const createCreditCard = await CreditCard.create(newCreditCard);
      return res.status(201).json({
        success: true,
        message: "create card successfully",
        card: createCreditCard,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error create card",
        error: error.message,
      });
    }
  },
  updateCreditCard: async (req, res) => {
    const cardId = req.params.id;
    const { card_holder, expiration, cvv, card_number, bank_name } = req.body;
    try {
      const existingCreditCardData = await CreditCard.selectById(cardId);
      if (!existingCreditCardData) {
        res.status(404).json({
          success: false,
          message: "error card list not found or empty",
        });
      }
      const sendingCreditCardData = {
        card_holder,
        expiration,
        card_number,
        bank_name,
      };
      const updatedCreditCard = await CreditCard.update(sendingCreditCardData);
      return res.status(201).json({
        success: true,
        message: "CreditCard data updated successfully",
        card: updatedCreditCard,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An erroR occurred while updating the card",
        error: error.message,
      });
    }
  },
  deleteCreditCard: async (req, res) => {
    const cardId = req.params.id;
    try {
      const deleteCreditCard = await CreditCard.deleteData(cardId);
      return res.status(201).json({
        success: true,
        message: "CreditCard data deleted successfully",
        card: deleteCreditCard,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while delete CreditCard data",
        error: error.message,
      });
    }
  },
  deleteAllCreditCard: async (req, res) => {
    try {
      await CreditCard.deleteAllCreditCard();
      res.status(200).json({
        success: true,
        message: "All CreditCard deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while delete all data card",
      });
    }
  },
};

module.exports = cardController;
