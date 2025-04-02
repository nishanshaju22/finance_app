const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const SavingsGoal = require("../models/SavingsGoal");

const router = express.Router();

// Set a savings goal
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, targetAmount, deadline } = req.body;

        const savingsGoal = new SavingsGoal({ user: req.user, name, targetAmount, deadline });
        await savingsGoal.save();

        res.status(201).json(savingsGoal);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get all savings goals for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const savingsGoals = await SavingsGoal.find({ user: req.user });
        res.json(savingsGoals);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update savings progress
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { savedAmount } = req.body;
        const savingsGoal = await SavingsGoal.findById(req.params.id);

        if (!savingsGoal) return res.status(404).json({ message: "Savings goal not found" });
        if (savingsGoal.user.toString() !== req.user) return res.status(401).json({ message: "Unauthorized" });

        savingsGoal.savedAmount = savedAmount || savingsGoal.savedAmount;
        await savingsGoal.save();

        res.json(savingsGoal);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a savings goal
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const savingsGoal = await SavingsGoal.findById(req.params.id);

        if (!savingsGoal) return res.status(404).json({ message: "Savings goal not found" });
        if (savingsGoal.user.toString() !== req.user) return res.status(401).json({ message: "Unauthorized" });

        await savingsGoal.deleteOne();
        res.json({ message: "Savings goal deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
