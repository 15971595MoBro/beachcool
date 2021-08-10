const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/register", userCtrl.register);

router.post("/activation", userCtrl.activateEmail);

router.post("/login", userCtrl.login);

router.get("/logout", userCtrl.logout);

router.get("/refresh_token", userCtrl.refreshToken);

router.post("/forgot", userCtrl.forgotPassword);

router.post("/reset", auth, userCtrl.resetPassword);

router.get("/infor", auth, userCtrl.getUser);

router.patch("/addcart", auth, userCtrl.addCart);

router.get("/history", auth, userCtrl.history);

router.put("/updateRegister", auth, userCtrl.updateRegister);

router.get("/allusers", auth, authAdmin, userCtrl.allUsers);

router.put("/adminuser/:id", auth, userCtrl.adminUser);

router.put("/paybill/:id", auth, userCtrl.payBill);

module.exports = router;
