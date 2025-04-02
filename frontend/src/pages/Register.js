import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
    const { register } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        register(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Register</h2>
                <input type="text" name="name" placeholder="Name" className="w-full p-2 border rounded mb-2" onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded mb-2" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded mb-4" onChange={handleChange} />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Register</button>
                <p className="mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
            </form>
        </div>
    );
};

export default Register;
