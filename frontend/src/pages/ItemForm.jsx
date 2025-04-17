// models/TravelStore.js
const mongoose = require('mongoose');

const TravelStoreSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true
  },
  dateShop: {
    type: Date,
    default: Date.now
  },
  idShop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  dateCreated: {
    type: Date,
    default: Date.now
  },
  dateUpdate: {
    type: Date,
    default: Date.now
  }
});

TravelStoreSchema.pre('save', function(next) {
  this.dateUpdate = Date.now();
  next();
});

module.exports = mongoose.model('TravelStore', TravelStoreSchema);