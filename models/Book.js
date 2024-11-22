const mongoose = require("mongoose");
const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      unique: true,
    },
    image: {
      type: String,
      required: false,
    },
    file: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: false
    },
    downloads: {
      type: Number,
      default: 0
    },
    categories: {
      type: Array,
      required: false
    },
  },
  {timestamps: true}
);
module.exports = mongoose.model("Book", BookSchema);
