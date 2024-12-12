const express = require("express");
const multer = require('multer');
const upload = multer();

const {
  paymentIntent,
  addOrder,
  getSingleOrder,
  updateOrderStatus,
  getOrders,
} = require("../controller/orderController");

// router
const router = express.Router();

// get orders
router.get("/orders", getOrders);
// add a create payment intent
router.post("/create-payment-intent", paymentIntent);
router.post("/addOrder", upload.single('image'), addOrder);
// single order
router.get("/:id", getSingleOrder);

// update status
router.patch("/update-status/:id", updateOrderStatus);

module.exports = router;
