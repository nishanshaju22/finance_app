import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const Budget = () => {
    const [budget, setBudget] = useState({ category: "", limit: "", month: "", year: "" });
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. Please log in again.");
                return;
            }

            const response = await axios.get("http://localhost:5001/api/budgets", {
                headers: { 'Authorization': token }
            });

            setBudgets(response.data);
            console.log("Fetched Budgets:", response.data);
        } catch (error) {
            console.error("Error fetching budgets:", error.response?.data || error.message);
        }
    };

    const handleChange = (e) => {
        setBudget({ ...budget, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. Please log in again.");
                return;
            }

            const response = await axios.post(
                "http://localhost:5001/api/budgets",
                budget,
                {
                    headers: { 'Authorization': token }
                }
            );

            console.log("Budget Added:", response.data);
            fetchBudgets();
        } catch (error) {
            console.error("Error adding budget:", error.response?.data || error.message);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Budgeting</h2>
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-4 flex flex-wrap gap-2">
                    <input type="text" name="category" placeholder="Category" className="p-2 border rounded" onChange={handleChange} required />
                    <input type="number" name="limit" placeholder="Budget Limit" className="p-2 border rounded" onChange={handleChange} required />

                    {/* Month Dropdown */}
                    <select name="month" className="p-2 border rounded" onChange={handleChange} required>
                        <option value="">Select Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
                        ))}
                    </select>

                    {/* Year Dropdown */}
                    <select name="year" className="p-2 border rounded" onChange={handleChange} required>
                        <option value="">Select Year</option>
                        {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return <option key={year} value={year}>{year}</option>;
                        })}
                    </select>

                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Set Budget</button>
                </form>

                <ul className="bg-white p-4 rounded shadow-md">
                    {budgets.map((b) => (
                        <li key={b._id} className="flex justify-between border-b py-2">
                            <span>{b.category} - ${b.limit} ({b.month}/{b.year})</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Budget;
