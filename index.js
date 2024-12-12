require("dotenv").config();
const express = require("express");
const cors = require("cors");

// internal
const ConnectDb = require("./config/db");
const globalErrorHandler = require("./middleware/global-error-handler");
const { secret } = require("./config/secret");
const categoryRoutes = require("./routes/categoryRoutes");
const productsRoutes = require("./routes/productRoute");
const couponRoutes = require("./routes/couponRoute");
const userRoute = require("./routes/userRoute");
const orderRouter = require("./routes/orderRoute");
const userOrderRoute = require("./routes/userOrderRoute");
const cloudinaryRoutes = require("./routes/cloudinaryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const brandRoutes = require("./routes/brandRoutes");

const app = express();

// middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');  // Temporarily allow all origins for debugging
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors({
  origin: '*',  // Temporarily allow all origins for debugging
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Connect to database
ConnectDb();

// Routes
app.use("/api/products", productsRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/user", userRoute);
app.use("/api/order", orderRouter);
app.use("/api/user-order", userOrderRoute);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (req, res) => res.send("Apps worked successfully"));

const PORT = process.env.PORT || 5000;

// Global error handler
app.use(globalErrorHandler);

// Handle not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
