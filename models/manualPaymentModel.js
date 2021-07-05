const mongoose = require("mongoose");

const manualPaymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    streetaddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    cart: {
      type: Array,
      default: [],
    },
    phone: {
      type: String,
      required: true,
    },
    buildingnumber: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
    flat: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    ready: {
      type: Boolean,
      default: false,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    methodpay: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ManualPayments", manualPaymentSchema);
