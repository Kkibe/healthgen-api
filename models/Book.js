const mongoose = require("mongoose");
const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true
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