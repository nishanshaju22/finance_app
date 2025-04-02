require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const reportRoutes = require("./routes/reportRoutes");
const savingsRoutes = require("./routes/savingsRoutes");


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
    res.send("Financial Management API is running...");
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Use Routes
app.use("/api/auth", authRoutes);

// Use Routes
app.use("/api/transactions", transactionRoutes);

// Use Routes
app.use("/api/budgets", budgetRoutes);

// Use Routes
app.use("/api/reports", reportRoutes);

// Use Routes
app.use("/api/savings", savingsRoutes);
