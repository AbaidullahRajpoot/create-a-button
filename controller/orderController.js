const { secret } = require("../config/secret");
const stripe = require("stripe")(secret.stripe_key);
const Order = require("../models/Order");
const { orderServices } = require("../services/order.service");
const multer = require('multer');
const upload = multer();

// create-payment-intent
module.exports.paymentIntent = async (req, res) => {
  try {
    const product = req.body;
    const price = Number(product.price);
    const amount = price * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: amount,
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.addOrder = async (req, res) => {
  try {
    const orderItems = Object.assign({}, req.body);
    
    // Parse the cart string into an object
    if (orderItems.cart) {
      orderItems.cart = JSON.parse(orderItems.cart);
    }
    
    // Check if order exists using orderId instead of _id
    if (orderItems.orderId) {
      // Try to find existing order
      const existingOrder = await Order.findOne({ orderId: orderItems.orderId });
      
      if (existingOrder) {
        // Handle image upload for update
        if (req.file) {
          const imageResult = await orderServices.uploadOrderImage(req.file.buffer);
          orderItems.image = {
            url: imageResult.url,
            public_id: imageResult.public_id
          };
        }

        // Update existing order
        const updatedOrder = await Order.findOneAndUpdate(
          { orderId: orderItems.orderId },
          orderItems,
          { new: true }
        );

        return res.status(200).send({
          success: true,
          message: "Order updated successfully",
          order: updatedOrder,
        });
      }
    }

    // If no existing order found or no orderId provided, create new order
    if (req.file) {
      const imageResult = await orderServices.uploadOrderImage(req.file.buffer);
      orderItems.image = {
        url: imageResult.url,
        public_id: imageResult.public_id
      };
    }

    const newOrders = new Order(orderItems);
    const order = await newOrders.save();

    res.status(200).send({
      success: true,
      message: "Order added successfully",
      order: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error adding/updating order",
      error: error.message
    });
  }
};

// get Orders
exports.getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await Order.findById(req.params.id).populate('user');
    res.status(200).json(orderItem);
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// updateOrderStatus
exports.updateOrderStatus = async (req, res) => {
  const newStatus = req.body.status;
  console.log('newStatus', newStatus)
  try {
    await Order.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          status: newStatus,
        },
      }, { new: true })
    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

// get Orders
exports.getOrders = async (req, res, next) => {
  try {
    const orderItems = await Order.find({}).sort({ createdAt: -1 }).populate('user');
    res.status(200).json({
      success: true,
      data: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};