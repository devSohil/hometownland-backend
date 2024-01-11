const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  count: {
    type: Number,
  },
});

const Count = mongoose.model("Count", CounterSchema);

module.exports = Count;
