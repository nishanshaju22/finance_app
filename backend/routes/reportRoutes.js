const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Get Monthly Report
router.get("/monthly/:month/:year", authMiddleware, async (req, res) => {
    try {
        const { month, year } = req.params;

        const startDate = new Date(year, month - 1, 1);  // First day of the month
        const endDate = new Date(year, month, 1);        // First day of next month (exclusive)

        const transactions = await Transaction.aggregate([
            {
                $match: {
                    user: req.user,
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        let income = 0, expenses = 0;
        transactions.forEach(t => {
            if (t._id === "income") income = t.total;
            if (t._id === "expense") expenses = t.total;
        });

        res.json({ month, year, income, expenses, balance: income - expenses });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get Yearly Report
router.get("/yearly/:year", authMiddleware, async (req, res) => {
    try {
        const { year } = req.params;

        const startDate = new Date(year, 0, 1);   // January 1st of the year
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // December 31st, 23:59:59

        const transactions = await Transaction.aggregate([
            {
                $match: {
                    user: req.user,
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        let income = 0, expenses = 0;
        transactions.forEach(t => {
            if (t._id === "income") income = t.total;
            if (t._id === "expense") expenses = t.total;
        });

        res.json({ year, income, expenses, balance: income - expenses });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Backend - Add an endpoint for financial summary
router.get("/financial-summary", authMiddleware, async (req, res) => {
    try {
        const userId = req.user;

        const transactions = await Transaction.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    income: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                        }
                    },
                    expenses: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                        }
                    }
                }
            }
        ]);

        const income = transactions[0]?.income || 0;
        const expenses = transactions[0]?.expenses || 0;
        const balance = income - expenses;

        res.json({ income, expenses, balance });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



module.exports = router;
