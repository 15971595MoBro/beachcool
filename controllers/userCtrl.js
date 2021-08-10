const Users = require("../models/userModel");
const Payments = require("../models/paymentModel");
const Contacts = require("../models/contactModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendMail = require("./sendMail");

const { google } = require("googleapis");

const { OAuth2 } = google.auth;

// const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const { CLIENT_URL } = process.env;

//Filter , Pagination , Sorting
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString = query
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
    this.query.find(JSON.parse(queryStr));

    return this;
  }
}

const userCtrl = {
  register: async (req, res, next) => {
    try {
      const { name, email, gender, password, cf_password } = req.body;

      const user = await Users.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "That Email Is Exist" });
      }
      if (password.length < 6) {
        return res.status(400).json({ msg: "Password is less than 6 char" });
      }

      if (password !== cf_password) {
        return res.status(400).json({ msg: "Password Doesn't Match" });
      }

      //Password Encryption

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        name,
        email,
        gender,
        password: passwordHash,
        cf_password,
      };

      // const newClient = new Users({
      //   name,
      //   email,
      //   gender,
      //   password: passwordHash,
      //   cf_password,
      // });

      const activation_token = createActivationToken(newUser);

      const url = `${CLIENT_URL}/custom/activate/${activation_token}`;

      sendMail(email, url, "Verify your email address");

      // //Create JWT To Authenticate
      // const accesstoken = createAccessToken({ id: newClient._id });
      // console.log("accesstoken : " + accesstoken);
      // const refreshtoken = createRefreshToken({ id: newClient._id });

      // res.cookie("refreshtoken", refreshtoken, {
      //   httpOnly: true,
      //   path: "/user/refresh_token",
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
      // });

      // res.json({ accesstoken });
      res.json({
        msg: "Register Success! Please activate your email  to start",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;

      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const { name, email, password, gender, cf_password } = user;

      const check = await Users.findOne({ email });
      if (check)
        return res.status(400).json({ msg: "This email already exists." });

      const newUser = new Users({
        name,
        email,
        gender,
        password,
        cf_password,
      });

      await newUser.save();

      // res.json({ msg: "Account has been activated!" });
      //Create JWT To Authenticate
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "This email does not exist." });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Password is Incorrect" });
      }
      // //If login success , create access token and refresh token
      // const accesstoken = createAccessToken({ id: user._id });
      // const refreshtoken = createRefreshToken({ id: user._id });

      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
      });

      // res.json({ accesstoken });
      res.json({ msg: "Login success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res, next) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "LogOut" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) {
        return res.status(400).json({ msg: "Please Login Or Register" });
      }

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(400).json({ msg: "Please Login Or Register" });
        }
        console.log("userId :" + user.id);
        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "This email does not exist." });

      const access_token = createAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/user/reset/${access_token}`;

      sendMail(email, url, "Reset your password");
      res.json({ msg: "Re-send the password, please check your email." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;

      const passwordHash = await bcrypt.hash(password, 12);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      );

      res.json({ msg: "Password successfully changed!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");

      if (!user) {
        return res.status(400).json({ msg: "User Doesnt Exist" });
      }
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) {
        return res.status(400).json({ msg: "User Doesn't Exist" });
      }

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "Added To Cart" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  history: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });

      res.json(history);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateRegister: async (req, res) => {
    try {
      const { password, cf_password } = req.body;

      const passwordHash = await bcrypt.hash(password, 10);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
          cf_password,
          images,
        }
      );

      res.json({ msg: "Update User" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  allUsers: async (req, res) => {
    try {
      const features = new APIfeatures(
        Users.find().select("-password"),
        req.query
      ).filtering();

      const user = await features.query;
      //const user = await Users.find().select("-password");

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  adminUser: async (req, res) => {
    try {
      let { role } = req.body;

      if (role === "user") {
        role = 0;
      } else if (role === "admin") {
        role = 1;
      } else {
        role = "";
      }
      // console.log(req.params.id);

      await Users.findOneAndUpdate({ _id: req.params.id }, { role });
      res.json({ msg: "Update Category" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  payBill: async (req, res) => {
    try {
      const { name, streetaddress, city, phone, buildingnumber, floor, flat } =
        req.body;

      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
          streetaddress,
          city,
          phone,

          buildingnumber,
          floor,
          flat,
        }
      );

      res.json({ msg: "Update User" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "11m",
  });
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
module.exports = userCtrl;
