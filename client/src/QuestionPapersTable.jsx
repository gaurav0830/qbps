import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf"; // Import jsPDF
import { FaDownload } from "react-icons/fa";


const QuestionPapersTable = () => {
    const [questionPapers, setQuestionPapers] = useState([]);
    const location = useLocation();
    const [userName, setUserName] = useState(location.state?.userName || "");

    // Fetch data from the backend
    useEffect(() => {
        const fetchQuestionPapers = async () => {
            try {
                const response = await fetch("http://localhost:3001/get-question-papers");
                const data = await response.json();
                setQuestionPapers(data);
            } catch (error) {
                console.error("Error fetching question papers:", error);
            }
        };

        fetchQuestionPapers();
    }, []);

    // Function to handle PDF download
    const handleDownload = (paper) => {
        const doc = new jsPDF();

        // Add subject, exam type, internal type, semester, and class
        doc.setFontSize(16);
        doc.text(`Subject: ${paper.subject}`, 10, 20);
        doc.text(`Exam Type: ${paper.examType}`, 10, 30);
        if (paper.examType === "internal") {
            doc.text(`Internal Type: ${paper.internalType}`, 10, 40);
        }
        doc.text(`Semester: ${paper.semester}`, 10, 50);
        doc.text(`Class: ${paper.className}`, 10, 60);

        // Add questions
        let yOffset = 70; // Starting Y position for questions
        doc.setFontSize(12);
        paper.questions.forEach((q, index) => {
            doc.text(`Q${index + 1}: ${q.question}`, 10, yOffset);
            doc.text(`Module Type: ${q.moduleType}`, 10, yOffset + 10);
            doc.text(`CO: ${q.co}, PO: ${q.po}, BL: ${q.bl}, Marks: ${q.marks}`, 10, yOffset + 20);
            yOffset += 30; // Increase Y offset for the next question
        });

        // Save the PDF
        doc.save(`${paper.subject}_${paper.examType}_${paper.internalType || ""}.pdf`);
    };

    return (
        <div className="flex">
            <Sidebar userName={userName} />
            <div className="flex-1 ml-64 p-4">
                <Navbar className="ml-4" />
                <main className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Question Papers</h2>
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">SL No</th>
                                <th className="py-2 px-4 border">Class</th>
                                <th className="py-2 px-4 border">Semester</th>
                                <th className="py-2 px-4 border">Subject</th>
                                <th className="py-2 px-4 border">Exam Type</th>
                                {questionPapers.some((paper) => paper.examType === "internal") && (
                                    <th className="py-2 px-4 border">Internal Type</th>
                                )}
                                <th className="py-2 px-4 border">Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionPapers.map((paper, index) => (
                                <tr key={paper._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border">{index + 1}</td>
                                    <td className="py-2 px-4 border">{paper.className}</td>
                                    <td className="py-2 px-4 border">{paper.semester}</td>
                                    <td className="py-2 px-4 border">{paper.subject}</td>
                                    <td className="py-2 px-4 border">{paper.examType}</td>
                                    {paper.examType === "internal" ? (
                                        <td className="py-2 px-4 border">{paper.internalType}</td>
                                    ) : (
                                        <td className="py-2 px-4 border">-</td> // Show "-" when it's not an internal exam
                                    )}
                                    <td className="py-2 px-4 border flex justify-center items-center">
                                        <button
                                            onClick={() => handleDownload(paper)}
                                            className="border-2 border-green-800 text-white  px-3 py-2 rounded "
                                        >
                                            <FaDownload className="text-green-800 text-lg" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    );
};

export default QuestionPapersTable;