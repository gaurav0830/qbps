const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
    className: { type: String, required: true },
    semester: { type: String, required: true },
    subjects: { type: [String], required: true }
});

const SubjectModel = mongoose.model("Subject", SubjectSchema);

module.exports = SubjectModel;
