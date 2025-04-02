const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },  // Example: Food, Rent, Entertainment
    limit: { type: Number, required: true },  // Monthly budget limit
    month: { type: Number, required: true },  // 1 - 12 (Jan - Dec)
    year: { type: Number, required: true }    // Example: 2025
}, { timestamps: true });

module.exports = mongoose.model("Budget", BudgetSchema);
