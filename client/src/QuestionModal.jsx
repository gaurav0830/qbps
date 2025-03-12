import React, { useState,useEffect } from "react";
import { FaTimes,FaTrash } from "react-icons/fa";
const QuestionModal = ({ closeModal }) => {
    const [examType, setExamType] = useState("");
    const [internalType, setInternalType] = useState("");
    const [semester, setSemester] = useState("");
    const [className, setClassName] = useState("");
    const [subject, setSubject] = useState("");
    const [questions, setQuestions] = useState([{ question: "", moduleType: "", co: "", po: "", bl: "", marks: "" }]);

    const [classes, setClasses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // **Fetch Classes**
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch("http://localhost:3001/classes");
                const data = await response.json();
                setClasses(data);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };
        fetchClasses();
    }, []);

    // **Fetch Semesters when Class is Selected**
    useEffect(() => {
        if (className) {
            const fetchSemesters = async () => {
                try {
                    const response = await fetch(`http://localhost:3001/semesters?className=${className}`);

                    if (!response.ok) {
                        console.error(`Error: ${response.status} ${response.statusText}`);
                        return;
                    }

                    const data = await response.json();
                    setSemester(""); // Reset semester
                    setSubjects([]); // Reset subjects
                    setSemesters(data);
                } catch (error) {
                    console.error("Error fetching semesters:", error);
                }
            };
            fetchSemesters();
        }
    }, [className]);

    // **Fetch Subjects when Class & Semester are Selected**
    useEffect(() => {
        if (className && semester) {
            const fetchSubjects = async () => {
                try {
                    const response = await fetch(`http://localhost:3001/subjects?className=${className}&semester=${semester}`);
                    const data = await response.json();
                    setSubjects(data);
                } catch (error) {
                    console.error("Error fetching subjects:", error);
                }
            };
            fetchSubjects();
        }
    }, [className, semester]);


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
                closeModal();
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

                {/* Select Class */}
                <div className="mb-4">
                    <label className="block font-semibold">Class:</label>
                    <select value={className} onChange={(e) => setClassName(e.target.value)} className="w-full p-2 border rounded">
                        <option value="">Choose Class</option>
                        {classes.map((cls, idx) => (
                            <option key={idx} value={cls}>{cls}</option>
                        ))}
                    </select>
                </div>

                {/* Select Semester (Dynamic Based on Class) */}
                {semesters.length > 0 && (
                    <div className="mb-4">
                        <label className="block font-semibold">Semester:</label>
                        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full p-2 border rounded">
                            <option value="">Choose Semester</option>
                            {semesters.map((sem, idx) => (
                                <option key={idx} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Select Subject (Dynamic Based on Class & Semester) */}
                {subjects.length > 0 && (
                    <div className="mb-4">
                        <label className="block font-semibold">Subject:</label>
                        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-2 border rounded">
                            <option value="">Choose Subject</option>
                            {subjects.map((sub, idx) => (
                                <option key={idx} value={sub}>{sub}</option>
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