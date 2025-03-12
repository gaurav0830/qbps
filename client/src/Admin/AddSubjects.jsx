import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AddSubjects = () => {
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [newSubjects, setNewSubjects] = useState("");
    const [userName, setUserName] = useState(location.state?.userName || ""); 

    // Define semesters based on selected class
    const semesterOptions = {
        "MCA I": ["Semester 1", "Semester 2"],
        "MCA II": ["Semester 3", "Semester 4"],
    };

    // Handle Adding Subjects
    const addSubjects = () => {
        if (!selectedClass || !selectedSemester || !newSubjects) {
            alert("Please fill all fields!");
            return;
        }

        const subjectsArray = newSubjects.split(",").map((s) => s.trim());

        axios
            .post("http://localhost:3001/Admin/subjects", {
                className: selectedClass,
                semester: selectedSemester,
                subjects: subjectsArray,
            })
            .then(() => {
                alert("Subjects added successfully!");
                setNewSubjects("");
            })
            .catch((err) => alert(err.response?.data?.message || "Error adding subjects"));
    };

    return (
        <div className="flex">
            <Sidebar userName={userName} />
                <div className="flex-1 ml-64">
                    <Navbar className="ml-4"/>
                    <main className="p-6 py-3">
                    <div className="p-6 bg-gray-200 border-2 border-gray-800 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Select Class & Semester</h2>

                        {/* Class Selection */}
                        <label className="block mb-2 font-semibold">Select Class:</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => {
                                setSelectedClass(e.target.value);
                                setSelectedSemester(""); // Reset semester when class changes
                            }}
                            className="border-2 border-gray-800 rounded-md p-2  mb-4 w-full"
                        >
                            <option value="">-- Select Class --</option>
                            <option value="MCA I">MCA I</option>
                            <option value="MCA II">MCA II</option>
                        </select>

                        {/* Semester Selection (only relevant semesters shown) */}
                        <label className="block mb-2 font-semibold">Select Semester:</label>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className=" p-2  mb-4 w-full border-2 border-gray-800 rounded-md"
                            disabled={!selectedClass} // Disable if no class is selected
                        >
                            <option value="">-- Select Semester --</option>
                            {selectedClass &&
                                semesterOptions[selectedClass].map((sem) => (
                                    <option key={sem} value={sem}>
                                        {sem}
                                    </option>
                                ))}
                        </select>

                        {/* Add New Subjects */}
                        <div className="mt-4">
                            <label className="block mb-2 font-semibold">Add New Subjects:</label>
                            <textarea
                                type="text"
                                cols="10"
                                rows="5"
                                value={newSubjects}
                                placeholder="Enter New subjects (Comma seperated )"
                                onChange={(e) => setNewSubjects(e.target.value)}
                                className=" p-2 rounded-md border-2 border-gray-800 w-full"
                            />
                            <button
                                onClick={addSubjects}
                                className="bg-green-500 font-semibold hover:bg-green-600 cursor-pointer mt-4 text-white px-4 py-2 rounded mt-2"
                                disabled={!selectedClass || !selectedSemester} // Disable if class/semester is not selected
                            >
                                Add Subjects
                            </button>
                        </div>
                    </div>
             </main>
        </div>
    </div>
    );
};

export default AddSubjects;