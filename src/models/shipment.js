const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  _id: { type: String },
  cart_id: { type: String },
  user_id: { type: String },
  address_id: { type: String },
  quantity: { type: String },
  total_price: { type: String },
  status_order: { type: String },
  created_at: { type: Date },
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortOrder = sort === "asc" ? 1 : -1;
  const sortField = sortby || "_id";
  try {
    const shipmentData = await Shipment.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(offset);
    return shipmentData;
  } catch (error) {
    throw new Error("Error retrieving shipment list: " + error.message);
  }
};

const selectById = async (_id) => {
  try {
    const selectId = await Shipment.findById({ _id });
    return selectId;
  } catch (error) {
    throw new Error("error selecting shipment by ID: " + error.message);
  }
};

const insert = async (shipmentData) => {
  try {
    const newShipment = await Shipment.create(shipmentData);
    return newShipment;
  } catch (error) {
    throw new Error("Error input shipment data: " + error.message);
  }
};

const update = async (shipmentData) => {
  try {
    const updateShipment = await Shipment.updateOne(shipmentData);
    return updateShipment;
  } catch (error) {
    throw new Error("Error update shipment data: " + error.message);
  }
};

const deleteData = async (shipmentData) => {
  try {
    const deleteShipment = await Shipment.deleteOne(shipmentData);
    return deleteShipment;
  } catch (error) {
    throw new Error("Error delete shipment data: " + error.message);
  }
};

const deleteAllShipment = async () => {
  try {
    const result = await Shipment.deleteMany({});
    return result;
  } catch (error) {
    throw new Error ("Error deleteing all Data shipment: " + error.message)
  }
}

module.exports = {
  Shipment,
  selectAll,
  selectById,
  insert,
  update,
  deleteData,
  deleteAllShipment
  
};
