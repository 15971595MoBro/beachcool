const ManualPayments = require("../models/manualPaymentModel");
const Users = require("../models/userModel");
const Products = require("../models/productModel");
const NotificatiomMail = require("./notificationMail");
const manualpaymentCtrl = {
  getManualPayments: async (req, res) => {
    try {
      const manualpayments = await ManualPayments.find({ ready: false });
      res.json(manualpayments);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getReadyOrder: async (req, res) => {
    try {
      const manualpayments = await ManualPayments.find({
        ready: true,
        delivered: false,
      });
      res.json(manualpayments);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getDeliveredOrder: async (req, res) => {
    try {
      const manualpayments = await ManualPayments.find({
        ready: true,
        delivered: true,
        complete: false,
      });
      res.json(manualpayments);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getCompletedOrder: async (req, res) => {
    try {
      const manualpayments = await ManualPayments.find({
        ready: true,
        delivered: true,
        complete: true,
      });
      res.json(manualpayments);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  manualhistory: async (req, res) => {
    try {
      const manualhistory = await ManualPayments.find({ user_id: req.user.id });

      res.json(manualhistory);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  manualPayment: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("name email");
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      const { cart, streetaddress, city, phone, buildingnumber, floor, flat } =
        req.body;
      const { _id, name, email } = user;

      const newManualPayment = new ManualPayments({
        user_id: _id,
        name,
        email,
        cart,
        streetaddress,
        city,
        phone,
        buildingnumber,
        floor,
        flat,
      });
      cart.filter((item) => {
        return sold(item._id, item.quantity, item.sold, item.stock);
      });

      console.log(cart);

      NotificatiomMail(email, cart, "I Need Some Product");

      await newManualPayment.save();
      res.json({ msg: "Payment Success" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateManualPayment: async (req, res) => {
    try {
      await ManualPayments.findOneAndUpdate(
        { _id: req.params.id },
        { delivered: true }
      );

      res.json({ msg: "Product Is Delivered" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateReadyPayment: async (req, res) => {
    try {
      await ManualPayments.findOneAndUpdate(
        { _id: req.params.id },
        { ready: true }
      );

      res.json({ msg: "Product Is Ready For Delivered" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCompletePayment: async (req, res) => {
    try {
      await ManualPayments.findOneAndUpdate(
        { _id: req.params.id },
        { complete: true }
      );

      res.json({ msg: "Product Is Ready For Delivered" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateManualMethod: async (req, res) => {
    try {
      await ManualPayments.findOneAndUpdate(
        { user_id: req.params.id },
        { methodpay: "manual" }
      ).sort({ _id: -1 });

      res.json({ msg: "Product Is Delivered" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateVisaMethod: async (req, res) => {
    try {
      await ManualPayments.findOneAndUpdate(
        { user_id: req.params.id },
        { methodpay: "visa" }
      ).sort({ _id: -1 });

      res.json({ msg: "Product Is Delivered" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const sold = async (id, quantity, oldSold, instock) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      sold: quantity + oldSold,
      stock: instock - quantity,
    }
  );
};

module.exports = manualpaymentCtrl;
