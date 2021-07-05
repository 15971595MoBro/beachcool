const router = require("express").Router();
const contactCtrl = require("../controllers/contactCtrl");

router
  .route("/contactus")
  .get(contactCtrl.getContact)
  .post(contactCtrl.createContact);
router.post("/sellus", contactCtrl.createSell);
router.get("/getsell", contactCtrl.getSell);
// router.route("/sellus").get(contactCtrl.getSell).post(contactCtrl.createSell);

module.exports = router;
