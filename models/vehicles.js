const mongoose = require('mongoose');
const upload = require('mongoose-file');

const VehicleSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  myimage: {
    type: String,
    required: true
  }
});

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports = Vehicle;
