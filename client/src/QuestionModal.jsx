import React, { useState } from "react";
import { FaTimes,FaTrash } from "react-icons/fa";
const QuestionModal = ({ closeModal }) => {
    const [examType, setExamType] = useState(""); // Internal / Semester
    const [internalType, setInternalType] = useState(""); // Internal 1 / Internal 2
    const [semester, setSemester] = useState("");
    const [className, setClassName] = useState("");
    const [subject, setSubject] = useState(""); // Subject selection
    const [questions, setQuestions] = useState([{ question: "", moduleType: "", co: "", po: "", bl: "", marks: "" }]);

    // Subjects based on Semester & Class
    const subjects = {
        "1_MCAI": ["CFOS", "Discrete Maths", "Web Development"],
        "2_MCAI": ["AI", "Machine Learning", "DSA"],
        "3_MCAII": ["AWT", "NO SQL", "Computer Networks"],
        "4_MCAII": ["IOT", "C# .NET"],
    };

    // Module Types
    const moduleTypes = ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"];

    // Add a new question dynamically
    const addQuestion = () => {
        setQuestions([...questions, { question: "", moduleType: "", co: "", po: "", bl: "", marks: "" }]);
    };

    // Delete a question
    const deleteQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        } else {
            alert("At least one question is required!");
        }
    };

    // Handle input changes dynamically
    const handleInputChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!examType || !semester || !className || !subject || (examType === "internal" && !internalType)) {
            alert("Please fill in all required fields!");
            return;
        }

        const requestData = { examType, semester, className, internalType, subject, questions };

        try {
            const response = await fetch("http://localhost:3001/generate-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            if (!response.ok) {
                alert(data.message || "Error generating questions");
            } else {
                alert("Questions saved successfully!");
                closeModal(); // Close modal after successful submission
            }
        } catch (error) {
            console.error("Error submitting questions:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 relative">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-2 m-2 right-2 border-2 border-red-500 text-white text-xs px-2 py-1 rounded "
                >
                    <FaTimes style={{ fontSize: '24px', color: 'red' }} />
                </button>

                <h2 className="text-xl font-semibold mb-4">Generate Questions</h2>

                {/* Select Exam Type */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Exam Type:</label>
                    <select
                        value={examType}
                        onChange={(e) => {
                            setExamType(e.target.value);
                            setInternalType(""); // Reset internal type if switching to Semester
                        }}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Exam Type</option>
                        <option value="internal">Internal</option>
                        <option value="semester">Semester</option>
                    </select>
                </div>

                {/* Show Internal 1 / Internal 2 Select Only if Internal is Chosen */}
                {examType === "internal" && (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Internal Type:</label>
                        <select value={internalType} onChange={(e) => setInternalType(e.target.value)} className="w-full p-2 border rounded">
                            <option value="">Select Internal</option>
                            <option value="internal1">Internal 1</option>
                            <option value="internal2">Internal 2</option>
                        </select>
                    </div>
                )}

                {/* Select Semester & Class */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Semester:</label>
                    <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full p-2 border rounded">
                        <option value="">Choose Semester</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                    </select>

                    <label className="block text-gray-700 font-semibold mt-2">Class:</label>
                    <select value={className} onChange={(e) => setClassName(e.target.value)} className="w-full p-2 border rounded">
                        <option value="">Choose Class</option>
                        <option value="MCAI">MCA I</option>
                        <option value="MCAII">MCA II</option>
                    </select>
                </div>

                {/* Select Subject based on Semester & Class */}
                {semester && className && subjects[`${semester}_${className}`] && (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Subject:</label>
                        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-2 border rounded">
                            <option value="">Choose Subject</option>
                            {subjects[`${semester}_${className}`].map((sub, idx) => (
                                <option key={idx} value={sub}>
                                    {sub}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Dynamic Question Inputs */}
                {questions.map((q, index) => (
                    <div key={index} className="mb-4 border p-3 rounded bg-gray-50 relative">
                        <button
                            onClick={() => deleteQuestion(index)}
                            className="absolute top-2 right-2 border-2 border-red-500 text-white text-xs px-1 py-1 mx-1 rounded "
                        >
                            <FaTrash style={{ fontSize: '14px', color: 'red', cursor: 'pointer' }} />
                        </button>

                        {/* Module Type (Select Box) */}
                        <label className="block text-gray-700 font-semibold">Module Type:</label>
                        <select
                            value={q.moduleType}
                            onChange={(e) => handleInputChange(index, "moduleType", e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Module Type</option>
                            {moduleTypes.map((module, idx) => (
                                <option key={idx} value={module}>
                                    {module}
                                </option>
                            ))}
                        </select>

                        {/* Question */}
                        <label className="block text-gray-700 font-semibold">Question:</label>
                        <input
                            type="text"
                            value={q.question}
                            onChange={(e) => handleInputChange(index, "question", e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter question"
                        />

                        {/* CO, PO, BL, Marks */}
                        <label className="block text-gray-700 font-semibold">CO:</label>
                        <input
                            type="text"
                            value={q.co}
                            onChange={(e) => handleInputChange(index, "co", e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter CO"
                        />

                        <label className="block text-gray-700 font-semibold">PO:</label>
                        <input
                            type="text"
                            value={q.po}
                            onChange={(e) => handleInputChange(index, "po", e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter PO"
                        />

                        <label className="block text-gray-700 font-semibold">BL:</label>
                        <input
                            type="text"
                            value={q.bl}
                            onChange={(e) => handleInputChange(index, "bl", e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter BL"
                        />

                        <label className="block text-gray-700 font-semibold">Marks:</label>
                        <select
                            value={q.marks}
                            onChange={(e) => handleInputChange(index, "marks", e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Marks</option>
                            {examType === "internal" ? (
                                <>
                                    <option value="2m">2m</option>
                                    <option value="10m">10m</option>
                                </>
                            ) : (
                                <>
                                    <option value="2m">2m</option>
                                    <option value="8m">8m</option>
                                </>
                            )}
                        </select>
                    </div>
                ))}

                {/* Add Question Button */}
                <button onClick={addQuestion} className="border-2 border-green-500 font-semibold  text-green-500 px-4 py-2 rounded hover:bg-green-600 hover:text-white duration-300 transition w-full mt-4">
                    Add Question
                </button>

                {/* Submit Button */}
                <button onClick={handleSubmit} className=" bg-gray-800 text-white font-semibold px-4 py-2 rounded hover:border-2 hover:bg-transparent hover:border-gray-800 transition duration-300 hover:text-gray-800 w-full mt-4">
                    Generate
                </button>
            </div>
        </div>
    );
};

export default QuestionModal;