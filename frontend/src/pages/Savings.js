import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const Savings = () => {
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({ name: "", targetAmount: "", deadline: "" });

    useEffect(() => {
        fetchSavingsGoals();
    }, []);

    const fetchSavingsGoals = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Please log in again.");
                return;
            }

            const response = await axios.get("http://localhost:5001/api/savings", {
                headers: { Authorization: token },
            });

            setSavingsGoals(response.data);
            console.log("Fetched Savings Goals:", response.data);
        } catch (error) {
            console.error("Error fetching savings goals:", error.response?.data || error.message);
        }
    };

    const handleChange = (e) => {
        setNewGoal({ ...newGoal, [e.target.name]: e.target.value });
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
                "http://localhost:5001/api/savings",
                newGoal,
                { headers: { Authorization: token } }
            );

            console.log("Savings Goal Added:", response.data);
            fetchSavingsGoals();
            setNewGoal({ name: "", targetAmount: "", deadline: "" });
        } catch (error) {
            console.error("Error adding savings goal:", error.response?.data || error.message);
        }
    };

    const handleUpdate = async (id, savedAmount) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return console.error("No token found. Please log in again.");

            const response = await axios.put(
                `http://localhost:5001/api/savings/${id}`,
                { savedAmount },
                { headers: { Authorization: token } }
            );

            console.log("Savings Goal Updated:", response.data);
            fetchSavingsGoals();
        } catch (error) {
            console.error("Error updating savings goal:", error.response?.data || error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return console.error("No token found. Please log in again.");

            await axios.delete(`http://localhost:5001/api/savings/${id}`, {
                headers: { Authorization: token },
            });

            console.log("Savings Goal Deleted");
            fetchSavingsGoals();
        } catch (error) {
            console.error("Error deleting savings goal:", error.response?.data || error.message);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Savings Goals</h2>

                {/* Add Savings Goal Form */}
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-4 flex gap-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Goal Name"
                        className="p-2 border rounded flex-1"
                        value={newGoal.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="targetAmount"
                        placeholder="Target Amount"
                        className="p-2 border rounded flex-1"
                        value={newGoal.targetAmount}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="deadline"
                        className="p-2 border rounded flex-1"
                        value={newGoal.deadline}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Goal</button>
                </form>

                {/* Savings Goals List */}
                <ul className="bg-white p-4 rounded shadow-md">
                    {savingsGoals.map((goal) => (
                        <li key={goal._id} className="flex justify-between items-center border-b py-2">
                            <div>
                                <h3 className="font-bold">{goal.name}</h3>
                                <p>Target: ${goal.targetAmount}</p>
                                <p>Saved: ${goal.savedAmount || 0}</p>
                                <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                            </div>

                            {/* Update Progress */}
                            <input
                                type="number"
                                min="0"
                                placeholder="Update Saved Amount"
                                className="p-2 border rounded w-24"
                                onBlur={(e) => handleUpdate(goal._id, Number(e.target.value))}
                            />

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(goal._id)}
                                className="bg-red-500 text-white p-2 rounded"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Savings;
