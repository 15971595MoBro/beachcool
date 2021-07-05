const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    cf_password: {
      type: String,
      required: true,
    },
    streetaddress: {
      type: String,
      required: true,
      default: " ",
    },
    city: {
      type: String,
      required: true,
      default: " ",
    },
    phone: {
      type: String,
      required: true,
      default: " ",
    },
    buildingnumber: {
      type: String,
      required: true,
      default: " ",
    },
    floor: {
      type: String,
      required: true,
      default: " ",
    },
    flat: {
      type: String,
      required: true,
      default: " ",
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
