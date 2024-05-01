const Shipment = require("../models/shipment.js");
const { v4: uuidv4 } = require("uuid");

const shipmentController = {
  getAllShipment: async (req, res) => {
    try {
      const { limit = 10, offset = 0, sort = "asc", sortby = "id" } = req.query;
      const shipmentData = await Shipment.selectAll({
        limit,
        offset,
        sort,
        sortby,
      });
      res.status(200).json({ success: true, shipmentData });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving shipment list",
        error: error.message,
      });
    }
  },
  getShipmentById: async (req, res) => {
    const shipmentID = req.params.id;
    try {
      const shipmentList = await Shipment.selectById(shipmentID);
      if (!shipmentList) {
        return res.status(404).json({
          success: false,
          message: "error shipment list not found or empty",
        });
      }
      res.status(200).json({
        success: true,
        shipment: shipmentList,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET shipment by ID",
        error: error.message,
      });
    }
  },
  createShipment: async (req, res) => {
    const {
      cart_id,
      user_id,
      address_id,
      quantity,
      total_price,
      status_order,
    } = req.body;
    try {
      const shipmentId = uuidv4();
      const createdAt = new Date();

      const newShipment = {
        _id: shipmentId,
        cart_id,
        user_id,
        address_id,
        quantity,
        total_price,
        status_order,
        created_at: createdAt,
      };
      const createShipment = await Shipment.insert(newShipment);
      return res.status(201).json({
        success: true,
        message: "create shipment successfully",
        shipment: createShipment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error create shipment",
        error: error.message,
      });
    }
  },
  updateShipment: async (req, res) => {
    const shipmentId = req.params.id;
    const {
      cart_id,
      user_id,
      address_id,
      quantity,
      total_price,
      status_order,
      created_at,
    } = req.body;
    try {
      const existingShipmentList = await Shipment.selectById(shipmentId);
      if (!existingShipmentList) {
        res.status(404).json({
          success: false,
          message: "error shipment list not found or empty",
        });
      }
      const sendingShipmentData = {
        cart_id,
        user_id,
        address_id,
        quantity,
        total_price,
        status_order,
        created_at,
      };
      const updatedShipment = await Shipment.update(sendingShipmentData);
      return res.status(201).json({
        success: true,
        message: "Cart list Updated Successfully",
        shipment: updatedShipment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the shipment",
        error: error.message,
      });
    }
  },
  deleteShipment: async (req, res) => {
    const shipmentId = req.params.id;
    try {
      const deleteShipment = await Shipment.deleteData(shipmentId);
      return res.status(201).json({
        success: true,
        message: "User remove data shipment successfully",
        shipment: deleteShipment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while delete the data shipment",
        error: error.message,
      });
    }
  },
  deleteAllShipment: async (req, res) => {
    try {
      await Shipment.deleteAllShipment();
      res.status(200).json({
        success: true,
        message: "All Shipments deleted successfully"
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occured while delete all data shipment"
      })
    }
  }
};

module.exports = shipmentController;
