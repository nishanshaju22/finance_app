import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded mb-2" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded mb-4" onChange={handleChange} />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
                <p className="mt-4 text-center">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></p>
            </form>
        </div>
    );
};

export default Login;
