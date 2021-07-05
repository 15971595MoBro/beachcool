const Products = require("../models/productModel");

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
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();
      const products = await features.query;

      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        stock,
        color,
        liter,
        description,
        content,
        images,
        imagessubone,
        imagessubtwo,
        imagessubthree,
        category,
      } = req.body;

      if (!images) {
        return res.status(400).json({ msg: "No Image Upload" });
      }

      const product = await Products.findOne({ product_id });
      if (product) {
        return res.status(400).json({ msg: "This Product Exist" });
      }

      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        stock,
        color,
        liter,
        description,
        content,
        images,
        imagessubone,
        imagessubtwo,
        imagessubthree,
        category,
      });

      await newProduct.save();

      res.json({ msg: "Created A Product" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      console.log(req.params.id);
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "Delete A Product" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        stock,
        color,
        liter,
        description,
        content,
        images,
        imagessubone,
        imagessubtwo,
        imagessubthree,
        category,
      } = req.body;
      if (!images) {
        return res.status(400).json({ msg: "No Image Upload" });
      }

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          product_id,
          title: title.toLowerCase(),
          price,
          stock,
          color,
          liter,
          description,
          content,
          images,
          imagessubone,
          imagessubtwo,
          imagessubthree,
          category,
        }
      );
      res.json({ msg: "Update A Product" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductsRed: async (req, res) => {
    try {
      const productred = await Products.find({ color: "red" });

      res.json(productred);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductsBlue: async (req, res) => {
    try {
      const productblue = await Products.find({ color: "blue" });

      res.json(productblue);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductsBlack: async (req, res) => {
    try {
      const productblack = await Products.find({ color: "black" });

      res.json(productblack);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductsDarkBlue: async (req, res) => {
    try {
      const productdarkblue = await Products.find({ color: "darkblue" });

      res.json(productdarkblue);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductsGray: async (req, res) => {
    try {
      const productdarkblue = await Products.find({ color: "gray" });

      res.json(productdarkblue);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductsPurple: async (req, res) => {
    try {
      const productdarkblue = await Products.find({ color: "purple" });

      res.json(productdarkblue);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductsFuchsia: async (req, res) => {
    try {
      const productfuchsia = await Products.find({ color: "fuchsia" });

      res.json(productfuchsia);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productCtrl;
