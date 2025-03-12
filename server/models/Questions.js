const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    className: String,
    subject: String,
    examType: String,
    internalType: String,
    moduleType: String,
    question: String,
    marks: String
});

module.exports = mongoose.models.Question || mongoose.model("Question", questionSchema);
