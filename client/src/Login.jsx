import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); 

    try {
        const response = await axios.post("http://localhost:3001/login", {
            email,
            password
        });

        const data = response.data;

        if (response.status === 200) {
            localStorage.setItem("user", JSON.stringify(data.user)); // Save user data
            alert(data.message);

            if (email === "admin@gmail.com" && password === "654413") {
                navigate("/Admin/dashboard");
            } else {
                navigate("/home");
            }
        }
    } catch (error) {
        setError(
            error.response?.data?.message || "An error occurred. Please try again."
        );
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#606c88] to-[#3f4c6b] via-[#4d5a77] bg-[26deg]">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Sign In</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email address
            </label>
            <input
              type="email"
              className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Enter Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 mt-5 border-2 border-[#3f4c6b] text-[#3f4c6b] 
            text-base rounded-md shadow-sm bg-transparent hover:bg-[#3f4c6b] 
            hover:text-slate-100 font-bold transition duration-150 ease-in-out`}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
