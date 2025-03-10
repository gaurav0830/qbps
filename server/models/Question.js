const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    examType: String,
    internalType: String,
    semester: String,
    className: String,
    subject: String,
    questions: [
        {
            question: String,
            moduleType: String, // Module Type for each question
            co: String,
            po: String,
            bl: String,
            marks: String,
        },
    ],
});

const QuestionModel = mongoose.model("Question", QuestionSchema);
module.exports = QuestionModel;