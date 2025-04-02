import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const Transactions = () => {
    const [transactions, setTransactions ] = useState([]);
    const [formData, setFormData] = useState({ type: "income", category: "", amount: "", date: "" });
    
    useEffect(() => {
        fetchTransactions();
    }, []);
    
    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                console.error("No token found. Please log in again.");
                return;
            }
    
            const response = await axios.get("http://localhost:5001/api/transactions", {
                headers: { 'Authorization': token }
            });
    
            setTransactions(response.data);
            console.log(response.data);  // Log the transactions data
        } catch (error) {
            console.error("Error fetching transactions:", error.response?.data || error.message);
        }
    };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                console.error("No token found. Please log in again.");
                return;
            }
        
            const response = await axios.post("http://localhost:5001/api/transactions", 
                formData,
                {
                    headers: { 'Authorization': token }
                }
            );
    
            console.log("Transaction Added:", response.data);
        } catch (error) {
            console.error("Error adding transaction:", error.response?.data || error.message);
        }
    
        fetchTransactions();
    };
    

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                console.error("No token found. Please log in again.");
                return;
            }
    
            const response = await axios.delete(`http://localhost:5001/api/transactions/${id}`, {
                headers: { 'Authorization': token }
            });
    
            console.log("Transaction Deleted:", response.data);
    
            fetchTransactions();
        } catch (error) {
            console.error("Error deleting transaction:", error.response?.data || error.message);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Transactions</h2>
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-4">
                    <select name="type" className="p-2 border rounded mr-2" onChange={handleChange}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <input type="text" name="category" placeholder="Category" className="p-2 border rounded mr-2" onChange={handleChange} />
                    <input type="number" name="amount" placeholder="Amount" className="p-2 border rounded mr-2" onChange={handleChange} />
                    <input type="date" name="date" className="p-2 border rounded mr-2" onChange={handleChange} />
                    <button type="submit" className="bg-green-500 text-white p-2 rounded">Add</button>
                </form>

                <ul className="bg-white p-4 rounded shadow-md">
                    {transactions.map((tx) => (
                        <li key={tx._id} className="flex justify-between border-b py-2">
                            <span>{tx.category} - ${tx.amount} ({tx.type})</span>
                            <button onClick={() => handleDelete(tx._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Transactions;
