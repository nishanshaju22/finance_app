const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Create a new transaction (Income/Expense)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { type, category, amount, description } = req.body;
        
        // Ensure valid type
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({ message: "Invalid transaction type" });
        }

        const transaction = new Transaction({
            user: req.user,
            type,
            category,
            amount,
            description
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get all transactions for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update a transaction
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        if (transaction.user.toString() !== req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { type, category, amount, description } = req.body;
        transaction.type = type || transaction.type;
        transaction.category = category || transaction.category;
        transaction.amount = amount || transaction.amount;
        transaction.description = description || transaction.description;

        await transaction.save();
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a transaction
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        if (transaction.user.toString() !== req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
