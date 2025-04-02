import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [financialSummary, setFinancialSummary] = useState({
        income: 0,
        expenses: 0,
        balance: 0
    });

    // Fetch financial summary data
    useEffect(() => {
        const fetchFinancialSummary = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found. Please log in again.");
                    return;
                }

                const response = await axios.get("http://localhost:5001/api/reports/financial-summary", {
                    headers: {
                        Authorization: token,
                    },
                });

                setFinancialSummary({
                    income: response.data.income,
                    expenses: response.data.expenses,
                    balance: response.data.balance,
                });
            } catch (error) {
                console.error("Error fetching financial summary:", error.response?.data || error.message);
            }
        };

        fetchFinancialSummary();
    }, []);

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex">
                <Sidebar />

                <div className="flex-1 m-2 bg-white p-6 shadow-md">
                    <div className="flex justify-between items-center bg-white p-4 shadow-md">
                        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
                        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
                            Logout
                        </button>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-2">Financial Overview</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-green-200 rounded shadow-md text-center">
                                <h3 className="text-lg font-semibold">Income</h3>
                                <p className="text-2xl">${financialSummary.income.toFixed(2)}</p>
                            </div>
                            <div className="p-4 bg-red-200 rounded shadow-md text-center">
                                <h3 className="text-lg font-semibold">Expenses</h3>
                                <p className="text-2xl">${financialSummary.expenses.toFixed(2)}</p>
                            </div>
                            <div className="p-4 bg-blue-200 rounded shadow-md text-center">
                                <h3 className="text-lg font-semibold">Balance</h3>
                                <p className="text-2xl">${financialSummary.balance.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
