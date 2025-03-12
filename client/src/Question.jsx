import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const QuestionGenerator = () => {
    const [options, setOptions] = useState({});
    const [modules, setModules] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedModules, setSelectedModules] = useState([]);
    const [examType, setExamType] = useState("");
    const [num2m, setNum2m] = useState(0);
    const [num8m, setNum8m] = useState(0);
    const [num10m, setNum10m] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [userName, setUserName] = useState(location.state?.userName || "");

    // Fetch Select Options
    useEffect(() => {
        fetch("http://localhost:3001/select-options")
            .then((res) => res.json())
            .then((data) => setOptions(data))
            .catch((error) => console.error("❗ Error fetching options:", error));
    }, []);

    // Fetch Subjects
    useEffect(() => {
        if (selectedClass && selectedSemester) {
            fetch(`http://localhost:3001/subject?className=${selectedClass}&semester=${selectedSemester}`)
                .then((res) => res.json())
                .then((data) => {
                    setSelectedSubject("");
                    setOptions((prevOptions) => ({ ...prevOptions, subjects: data }));
                })
                .catch((error) => console.error("❗ Error fetching subjects:", error));
        }
    }, [selectedClass, selectedSemester]);

    // Fetch Modules
    useEffect(() => {
        if (selectedClass && selectedSubject) {
            fetch(`http://localhost:3001/modules?className=${encodeURIComponent(selectedClass)}&subject=${encodeURIComponent(selectedSubject)}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("🟩 Modules Data:", data);  // Check data structure
                    setModules(Array.isArray(data) ? data : []);
                })
                .catch((error) => console.error("❗ Error fetching modules:", error));
        }
    }, [selectedClass, selectedSubject]);
    

    // Handle Question Generation
    const handleGenerateQuestions = async () => {
        const requestBody = {
            examType,
            className: selectedClass,
            semester: selectedSemester,
            subject: selectedSubject,
            modules: selectedModules,
            num2m: Number(num2m),
            num8m: Number(num8m),
            num10m: Number(num10m),
        };
    
        try {
            const response = await fetch("http://localhost:3001/generate-question", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("🟩 API Response:", data);
    
            const extractedQuestions = data.questions || [];
    
            if (extractedQuestions.length) {
                setQuestions(extractedQuestions);
                alert(`Successfully generated ${extractedQuestions.length} questions!`);
            } else {
                alert("No questions found for the selected criteria.");
                setQuestions([]);
            }
        } catch (error) {
            console.error("❗ Error generating questions:", error);
            alert("Error generating questions. Please try again.");
        }
    };
    

    return (
        <div className="flex">
            <Sidebar userName={userName} />
            <div className="flex-1 ml-64">
                <Navbar className="ml-4"/>
                <main className="p-6 border-2 border-gray-800 m-6 rounded-lg">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Question Paper Generator</h1>

                        {/* Select Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="border-2 border-gray-800 p-2 rounded-lg">
                                <option value="">Select Class</option>
                                {options.classes && options.classes.map((className, idx) => (
                                    <option key={idx} value={className}>{className}</option>
                                ))}
                            </select>

                            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="border-2 border-gray-800 p-2 rounded-lg">
                                <option value="">Select Semester</option>
                                {options.semesters && options.semesters.map((semester, idx) => (
                                    <option key={idx} value={semester}>{semester}</option>
                                ))}
                            </select>

                            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="border-2 border-gray-800 p-2 rounded-lg">
                                <option value="">Select Subject</option>
                                {options.subjects && options.subjects.map((subject, idx) => (
                                    <option key={idx} value={subject}>{subject}</option>
                                ))}
                            </select>

                            <select value={examType} onChange={(e) => setExamType(e.target.value)} className="border-2 border-gray-800 p-2 rounded-lg">
                                <option value="">Select Exam Type</option>
                                <option value="semester">Semester</option>
                                <option value="internal">Internal</option>
                            </select>
                        </div>

                        {/* Modules Checkboxes */}
                        <div className="mt-4">
                            <h2 className="text-lg font-bold">Select Modules:</h2>
                            {modules.map((module) => (
                                <label key={module.id || module} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={module}
                                        checked={selectedModules.includes(module)}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setSelectedModules((prev) =>
                                                isChecked ? [...prev, module] : prev.filter((m) => m !== module)
                                            );
                                        }}
                                        className="w-4 h-4 text-green-600 border-gray-300 mr-2 font-semibold rounded-lg focus:ring-green-500 bg-green-600"
                                    />
                                    {module}
                                </label>
                            ))}

                        </div>

                        {/* Input Fields for Question Counts */}
                        <div className="mt-4">
                            <label>Number of 2m Questions:</label>
                            <input
                                type="number"
                                value={num2m}
                                onChange={(e) => setNum2m(e.target.value)}
                                className="border-2 border-gray-800 rounded-lg ml-2 p-1 px-2 mr-4"
                            />

                            {examType === "semester" && (
                                <>
                                    <label>Number of 8m Questions:</label>
                                    <input
                                        type="number"
                                        value={num8m}
                                        onChange={(e) => setNum8m(e.target.value)}
                                        className="border-2 border-gray-800 rounded-lg ml-2 p-1 px-2"
                                    />
                                </>
                            )}

                            {examType === "internal" && (
                                <>
                                    <label>Number of 10m Questions:</label>
                                    <input
                                        type="number"
                                        value={num10m}
                                        onChange={(e) => setNum10m(e.target.value)}
                                        className="border-2 border-gray-800 rounded-lg ml-2 p-1 px-2"
                                    />
                                </>
                            )}
                        </div>

                        {/* Generate Button */}
                        <button
                            className="bg-transparent text-green-500 border-2 border-green-600 px-4 py-2 mt-4 rounded hover:bg-green-600 hover:text-white"
                            onClick={handleGenerateQuestions}
                        >
                            Generate Questions
                        </button>

                        {/* Display Questions */}
                        <div className="mt-6">
                            <h2 className="text-lg font-bold mb-2">Generated Questions:</h2>
                            {questions.length > 0 ? (
                                <div className="flex flex-col gap-2 border-2 border-gray-800 p-4">
                                    <div className="flex items-center justify-center"> 
                                        <div className="text-center">
                                            <h1 className="font-bold">ST JOSEPH ENGINERING COLLEGE,MANAGLORE</h1>
                                            <p>An Autonomous Institution</p>
                                        </div>
                                    </div>
                                    <hr className="border-1 border-gray-800 w-full"/>
                                    <div className="flex items-center justify-left">
                                        <p>USN:</p>
                                        <table className="border-2 border-gray-800">
                                            <tr>
                                                <td className="p-2 border-2 border-gray-800"></td>
                                                <td className="p-2 border-2 border-gray-800"></td>
                                                <td className="p-2 border-2 border-gray-800"></td>
                                                <td className="p-2 border-2 border-gray-800"></td>
                                                <td className="p-2 border-2 border-gray-800"></td>
                                                <td className="p-2 border-2 border-gray-800"></td>
                                                <td className="p-2 border-2 border-gray-800"></td>
                                                <td className="p-2 border-2 border-gray-800"></td>
                                                <td className="p-2 border-2 border-gray-800"></td>
                                                <td className="p-2 border-2 border-gray-800"></td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-left">
                                            <p>Duration:<span className="font-bold">90 Minutes</span></p>
                                            <p className="ml-96">Maximum Marks:<span className="font-bold">50</span></p>
                                        </div>
                                        <div className="flex items-center justify-left">
                                            <p>Date:<span className="font-bold">12/03/2025</span></p>
                                            <p className="ml-96 px-6">Faculty Name:<span className="font-bold">Faculty</span></p>
                                        </div>
                                        <div className="flex items-center justify-left">
                                            <p>Time:<span className="font-bold">9:30 am to 11:00 am</span></p>
                                            <p className="ml-80 px-5 ">Course Code:<span className="font-bold">23Mc305C</span></p>
                                        </div>
                                        <div className="flex items-center justify-left">
                                            <p>Semester:<span className="font-bold">III MCA</span></p>
                                            <p className="ml-96 px-6">Test:<span className="font-bold">Internal Test</span></p>
                                        </div>
                                        <h1 className="text-center mt-2 font-bold">Subject Name</h1>
                                    </div>
                                <table className="w-full border-collapse border-2 border-gray-800">
                                    
                                    <tbody>
                                        <tr className="border-2 border-gray-800">
                                            <td colSpan="4">
                                                <p className="px-1">Note:</p>
                                                <ol className="list-decimal px-8" >
                                                    <li> Part-A is Mnadatory</li>
                                                    <li> Answer any two full question from Part-B choosing at least one fron each module</li>
                                                </ol>
                                            </td>
                                        </tr>
                                        <tr className="border-2 border-gray-800">
                                            <th className="border-2 border-gray-800 px-4 py-2">Q.No</th>
                                            <th className="border-2 border-gray-800 px-4 py-2">Question</th>
                                            <th className="border-2 border-gray-800 px-4 py-2">CO</th>
                                            <th className="border-2 border-gray-800 px-4 py-2">PO</th>
                                            <th className="border px-4 py-2">BL</th>
                                            <th className="border-2 border-gray-800 px-4 py-2">Marks</th>
                                        </tr>
                                        {questions.map((q, idx) => (
                                            <tr key={idx} className="text-center">
                                                <td className="border-2 border-gray-800 px-4 py-2">{idx + 1}</td>
                                                <td className="border-2 border-gray-800 px-4 py-2 text-left">{q.question || "❗ Missing Question"}</td>
                                                <td className="border-2 border-gray-800 px-4 py-2">{q.co || "-"}</td>
                                                <td className="border-2 border-gray-800 px-4 py-2">{q.po || "-"}</td>
                                                <td className="border-2 border-gray-800 px-4 py-2">{q.bl || "-"}</td>
                                                <td className="border-2 border-gray-800 px-4 py-2">{q.marks || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            ) : (
                                <p className="text-red-500">No questions generated yet.</p>
                            )}
                        </div>
        
                    </div>
                </main>
            </div>
        </div>
    );
};

export default QuestionGenerator;
