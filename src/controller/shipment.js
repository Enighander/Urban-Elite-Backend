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
    } = req.body;
    try {
      const shipmentId = uuidv4();
      const createdAt = new Date();
      const pendingStatus = "pending"

      const newShipment = {
        _id: shipmentId,
        cart_id,
        user_id,
        address_id,
        quantity,
        total_price,
        status_order: pendingStatus,
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
  updateShipmentAsPaid: async (req, res) => {
    const shipmentId = req.params.id;
    const {
      quantity,
      total_price,
    } = req.body;
    try {
      const existingShipmentList = await Shipment.selectById(shipmentId);
      if (!existingShipmentList) {
        res.status(404).json({
          success: false,
          message: "error shipment list not found or empty",
        });
      }

      const paidStatus = "paid"
      const createdAt = new Date();

      const sendingShipmentData = {
        quantity,
        total_price,
        status_order: paidStatus,
        created_at: createdAt,
      };
      const updatedShipment = await Shipment.update(sendingShipmentData);
      return res.status(201).json({
        success: true,
        message: "Shipment Status order changed into Paid",
        shipment: updatedShipment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the shipment into as paid",
        error: error.message,
      });
    }
  },
  updateShipmentAsProgressDelivery: async (req, res) => {
    const shipmentId = req.params.id;
    const {
      quantity,
      total_price,
    } = req.body
    try {
      const existingShipmentList = await Shipment.selectById(shipmentId)
      if (!existingShipmentList) {
        res.status(404).json({
          success: false,
          message: "error Shipment list not found or empty"
        })
      }
      const deliveryStatus = "delivery";
      const createdAt = new Date();

      const sendingShipmentData = {
        quantity,
        total_price,
        status_order: deliveryStatus,
        created_at: createdAt,
      }
      const updateShipment = await Shipment.update(sendingShipmentData)
      return res.status(201).json({
        success: true,
        message: "Shipment Status order change into delivery",
        shipment: updateShipment
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the shipment into progress delivery",
        error: error.message,
      });
    }
  },
  updateShipmentAsArrived: async (req, res) => {
    const shipmentId = req.params.id;
    const {
      quantity,
      total_price,
    } = req.body;
    try {
      const existingShipmentList = await Shipment.selectAll(shipmentId);
      if (!existingShipmentList) {
        res.status(404).json({
          success: false,
          message: "error Shipment list not found or empty"
        })
      }

      const deliveryStatus = "Arrived";
      const createdAt = new Date();

      const sendingShipmentData = {
        quantity,
        total_price,
        status_order: deliveryStatus,
        created_at: createdAt,
      }
      const updatedShipment = await Shipment.update(sendingShipmentData);
      return res.status(201).json({
        success: true,
        message: "Shipment Status order changed into Arrived",
        shipment: updatedShipment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the shipment into as paid",
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
