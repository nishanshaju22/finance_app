import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
        }
    }, []);

    const login = async (credentials) => {
        try {
            const { data } = await axios.post("http://localhost:5001/api/auth/login", credentials);
            localStorage.removeItem("token");
            localStorage.setItem("token", data.token);
            setUser(jwtDecode(data.token));
            navigate("/dashboard");
        } catch (error) {
            alert("Invalid login credentials");
        }
    };

    const register = async (credentials) => {
        await axios.post("http://localhost:5001/api/auth/register", credentials);
        navigate("/login");
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
