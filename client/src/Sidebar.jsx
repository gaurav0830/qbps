import React, { useEffect, useState } from "react";
import { FaTachometerAlt, FaUsers, FaCog, FaUser, FaSignOutAlt, FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import QuestionModal from "./QuestionModal"; // Import the Modal

const Sidebar = () => {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/login"; // Redirect to login after logout
    };

    return (
        <div className="fixed left-0 top-0 h-full w-64 m-3 rounded-lg bg-gray-900 p-6 shadow-lg flex flex-col">
            <h2 className="text-white text-2xl font-semibold mb-6">QPGS</h2>
            <nav className="flex flex-col space-y-4 mb-auto">
                <Link to="/home" className="flex items-center text-white hover:text-indigo-400 transition duration-200">
                    <FaTachometerAlt className="mr-3" />
                    Dashboard
                </Link>
                <Link to="/question" className="flex items-center text-white hover:text-indigo-400 transition duration-200">
                    <FaFileAlt className="mr-3"/>
                    Question
                </Link>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center text-white hover:text-indigo-400 transition duration-200 mt-4"
                >
                    <FaFileAlt className="mr-3" />
                    Generate Question
                </button>
                <Link to="/questionpapers" className="flex items-center text-white hover:text-indigo-400 transition duration-200">
                    <FaUsers className="mr-3" />
                    Download QPaper
                </Link>
                

                {/* ✅ "Generate Question" Button */}
                
            </nav>

            <div className="mt-auto">
                {user ? (
                    <>
                        <div className="flex items-center text-white mb-2">
                            <FaUser className="mr-2" />
                            <span>{user.name || "User"}</span>
                        </div>
                        <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-400 transition duration-200">
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </button>
                    </>
                ) : (
                    <p className="text-white">Loading...</p>
                )}
            </div>

            {/* ✅ Render Modal when isModalOpen is true */}
            {isModalOpen && <QuestionModal closeModal={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Sidebar;
