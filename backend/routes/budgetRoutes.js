const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Set a budget for a category
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { category, limit, month, year } = req.body;

        let budget = await Budget.findOne({ user: req.user, category, month, year });
        if (budget) {
            return res.status(400).json({ message: "Budget already set for this category" });
        }

        budget = new Budget({ user: req.user, category, limit, month, year });
        await budget.save();

        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all budgets for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update a budget
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { limit } = req.body;
        const budget = await Budget.findById(req.params.id);

        if (!budget) return res.status(404).json({ message: "Budget not found" });
        if (budget.user.toString() !== req.user) return res.status(401).json({ message: "Unauthorized" });

        budget.limit = limit || budget.limit;
        await budget.save();

        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a budget
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) return res.status(404).json({ message: "Budget not found" });
        if (budget.user.toString() !== req.user) return res.status(401).json({ message: "Unauthorized" });

        await budget.remove();
        res.json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Check if user exceeded budget for a category
router.get("/check/:category/:month/:year", authMiddleware, async (req, res) => {
    try {
        const { category, month, year } = req.params;

        const budget = await Budget.findOne({ user: req.user, category, month, year });
        if (!budget) return res.status(404).json({ message: "No budget set for this category" });

        const totalSpent = await Transaction.aggregate([
            { $match: { user: req.user, category, type: "expense", date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const spentAmount = totalSpent.length > 0 ? totalSpent[0].total : 0;
        const exceeded = spentAmount > budget.limit;

        res.json({ budget, spentAmount, exceeded });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
