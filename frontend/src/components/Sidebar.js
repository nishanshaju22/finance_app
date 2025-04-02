import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="w-64 bg-blue-900 text-white min-h-screen p-4">
            <h2 className="text-2xl font-bold mb-4">Finance App</h2>
            <ul className="space-y-3">
                <li><Link to="/dashboard" className="block py-2 px-4 hover:bg-blue-700 rounded">Dashboard</Link></li>
                <li><Link to="/transactions" className="block py-2 px-4 hover:bg-blue-700 rounded">Transactions</Link></li>
                <li><Link to="/budget" className="block py-2 px-4 hover:bg-blue-700 rounded">Budget</Link></li>
                <li><Link to="/savings" className="block py-2 px-4 hover:bg-blue-700 rounded">Savings</Link></li>
                <li><Link to="/reports" className="block py-2 px-4 hover:bg-blue-700 rounded">Reports</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
