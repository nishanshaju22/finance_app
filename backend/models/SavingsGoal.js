const mongoose = require("mongoose");

const SavingsGoalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // Example: Buy a Car, Vacation
    targetAmount: { type: Number, required: true },
    savedAmount: { type: Number, default: 0 },
    deadline: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("SavingsGoal", SavingsGoalSchema);
