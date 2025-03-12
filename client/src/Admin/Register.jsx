import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Teacher"); // State for role
    const [error, setError] = useState(""); // State for error messages
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate password and confirm password
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Clear any previous errors
        setError("");

        // Make the API request
        axios
            .post("http://localhost:3001/Admin/register", { name, email, password, confirmPassword, role })
            .then((result) => {
                console.log(result);
                if (result.status === 201 || result.status === 200) {
                    alert("✅ Registration successful!");
                    navigate("/Admin/register"); // Redirect after successful registration
                } else {
                    alert("❗ Something went wrong. Please try again.");
                } 
            })
            .catch((error) => {
                console.log(error);
                setError("Registration failed. Please try again."); // Display error message
            });
    };

    return (
        <div className="flex">
            <Sidebar /> {/* Remove userName if not needed */}
            <div className="flex-1 ml-64">
                <Navbar />
                <main className="p-3 px-6">
                    <div className="flex items-center max-h-screen bg-gray-100 rounded shadow-lg border-2 border-gray-800">
                        <div className="bg-transparent p-8 w-full">
                            <h2 className="text-2xl font-bold text-left mb-6">Register</h2>
                            {error && ( // Display error message if exists
                                <div className="mb-4 text-red-600 text-center">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                            Enter Name:
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                            Email Address:
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                            Enter Password:
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                                            Confirm Password:
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
                                        Select Role:
                                    </label>
                                    <select
                                        id="role"
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                    >
                                        <option value="Teacher">Teacher</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full max-w-sm bg-green-600 font-semibold shadow-md text-white py-2 rounded-md hover:bg-transparent hover:border-2 hover:border-green-600 hover:text-green-600 transition duration-200"
                                >
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Register;