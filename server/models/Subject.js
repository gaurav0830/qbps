const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    className: String,
    subject: String
});

module.exports = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
