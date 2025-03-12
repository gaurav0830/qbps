import React, { useEffect, useState } from "react";
import { FaTachometerAlt, FaUsers, FaCog, FaUser, FaSignOutAlt, FaFileAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
// Import the Modal

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
        window.location.href = "/"; // Redirect to login after logout
    };

    return (
        <div className="fixed left-0 top-0 h-full w-64 m-3 rounded-lg bg-gray-200 p-6 shadow-lg flex flex-col border-2 border-gray-900">
            <h2 className="text-black text-2xl font-bold mb-6">QPGS</h2>
            <nav className="flex flex-col space-y-4 mb-auto ">
                <Link to="/Admin/dashboard" className="flex items-center text-black hover:text-gray-500 transition duration-200">
                    <FaTachometerAlt className="mr-3" />
                    Dashboard
                </Link>
                <Link to="/Admin/register" className="flex items-center text-black hover:text-gray-500 transition duration-200">
                    <FaFileAlt className="mr-3"/>
                    Add Users
                </Link>
                
                <Link to="/Admin/users" className="flex items-center text-black hover:text-gray-500 transition duration-200">
                    <FaUsers className="mr-3" />
                    Display Users
                </Link>
                <Link to="/Admin/subjects" className="flex items-center text-black hover:text-gray-500 transition duration-200">
                    <FaPlus className="mr-3" />
                    Add Subjects
                </Link>

                {/* ✅ "Generate Question" Button */}
                
            </nav>

            <div className="mt-auto">
                {user ? (
                    <>
                        <div className="flex items-center text-black mb-2">
                            <FaUser className="mr-2" />
                            <span>{user.name || "User"}</span>
                        </div>
                        <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-400 transition duration-200">
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </button>
                    </>
                ) : (
                    <p className="text-black">Loading...</p>
                )}
            </div>

            {/* ✅ Render Modal when isModalOpen is true */}
            {isModalOpen && <QuestionModal closeModal={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Sidebar;
