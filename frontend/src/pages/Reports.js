import { useState, useEffect } from "react";
import axios from "axios";
import ReportChart from "../components/ReportChart";

const Reports = () => {
    const [chartData, setChartData] = useState(null);
    const [reportType, setReportType] = useState("monthly"); // "monthly" or "yearly"
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Default: current month
    const [year, setYear] = useState(new Date().getFullYear()); // Default: current year

    useEffect(() => {
        fetchReports();
    }, [reportType, month, year]);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Please log in again.");
                return;
            }

            const url =
                reportType === "monthly"
                    ? `http://localhost:5001/api/reports/monthly/${month}/${year}`
                    : `http://localhost:5001/api/reports/yearly/${year}`;

            const response = await axios.get(url, {
                headers: { Authorization: token },
            });

            console.log("Fetched Report:", response.data);

            // Chart Data Setup
            setChartData({
                labels: ["Income", "Expenses", "Balance"],
                datasets: [
                    {
                        label: `${reportType === "monthly" ? `Monthly` : `Yearly`} Financial Report`,
                        data: [response.data.income, response.data.expenses, response.data.balance],
                        backgroundColor: ["#4caf50", "#f44336", "#2196f3"], // Green for income, Red for expenses, Blue for balance
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching reports:", error.response?.data || error.message);
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-xl font-bold mb-4">Financial Reports</h2>

            {/* Report Type Selection */}
            <div className="flex gap-4 mb-4">
                <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="p-2 border rounded">
                    <option value="monthly">Monthly Report</option>
                    <option value="yearly">Yearly Report</option>
                </select>

                {reportType === "monthly" && (
                    <>
                        {/* Month Dropdown */}
                        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="p-2 border rounded">
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* Year Dropdown */}
                <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="p-2 border rounded">
                    {Array.from({ length: 5 }, (_, i) => {
                        const currentYear = new Date().getFullYear();
                        return (
                            <option key={currentYear - i} value={currentYear - i}>
                                {currentYear - i}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Chart Display */}
            {chartData ? <ReportChart chartData={chartData} chartType="bar" /> : <p>Loading chart...</p>}
        </div>
    );
};

export default Reports;
