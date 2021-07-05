const router = require("express").Router();
const manualpaymentCtrl = require("../controllers/manualpaymentCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/manualpayment")
  .get(auth, manualpaymentCtrl.getManualPayments)
  .post(auth, manualpaymentCtrl.manualPayment);

router
  .route("/readyorder")
  .get(auth, authAdmin, manualpaymentCtrl.getReadyOrder);

router
  .route("/deliveredorder")
  .get(auth, authAdmin, manualpaymentCtrl.getDeliveredOrder);

router
  .route("/completedorder")
  .get(auth, authAdmin, manualpaymentCtrl.getCompletedOrder);

router.get("/manualhistory", auth, manualpaymentCtrl.manualhistory);
router.put(
  "/updatemanualpay/:id",
  auth,
  authAdmin,
  manualpaymentCtrl.updateManualPayment
);

router.put(
  "/updatereadypay/:id",
  auth,
  authAdmin,
  manualpaymentCtrl.updateReadyPayment
);

router.put(
  "/updatecomplatepay/:id",
  auth,
  authAdmin,
  manualpaymentCtrl.updateCompletePayment
);

router.put("/methodmanualpay/:id", auth, manualpaymentCtrl.updateManualMethod);

router.put("/methodvisapay/:id", auth, manualpaymentCtrl.updateVisaMethod);

module.exports = router;
