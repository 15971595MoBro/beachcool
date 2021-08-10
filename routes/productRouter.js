const router = require("express").Router();
const productCtrl = require("../controllers/productCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/products")
  .get(productCtrl.getProducts)
  .post(productCtrl.createProduct);

router
  .route("/products/:id")
  .put(productCtrl.updateProduct)
  .delete(productCtrl.deleteProduct);

router.patch("/detail/:id", productCtrl.reviews);

router.route("/productred").get(productCtrl.getProductsRed);

router.route("/productblue").get(productCtrl.getProductsBlue);

router.route("/productblack").get(productCtrl.getProductsBlack);

router.route("/productdarkblue").get(productCtrl.getProductsDarkBlue);

router.route("/productgray").get(productCtrl.getProductsGray);

router.route("/productpurple").get(productCtrl.getProductsPurple);

router.route("/productfuchsia").get(productCtrl.getProductsFuchsia);

module.exports = router;
