const Contact = require("../models/contactModel");

const contactCtrl = {
  getContact: async (req, res) => {
    try {
      const contact = await Contact.find({ role: 1 });
      res.json(contact);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createContact: async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;

      const newContact = new Contact({
        name,
        email,
        phone,
        message,
        role: "1",
      });

      await newContact.save();

      res.json({ msg: "Created A Contact" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getSell: async (req, res) => {
    try {
      const sell = await Contact.find({ role: 0 });
      res.json(sell);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createSell: async (req, res) => {
    try {
      const { name, email, phone, business, message } = req.body;

      const newContact = new Contact({
        name,
        email,
        phone,
        message,
        business,
        role: "0",
      });

      await newContact.save();

      res.json({ msg: "Created A Sell" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = contactCtrl;
