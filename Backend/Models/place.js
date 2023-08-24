const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String, required: true },
  location: {
    lng: { type: Number, required: true },
    lat: { type: Number, required: true },
  },
  creatorId: { type: mongoose.Types.ObjectId, requried: true, ref: "User" },
});

module.exports = mongoose.model("Place", placeSchema);
