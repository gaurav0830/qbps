const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    className: String,
    semester: String,
    subjects: [String]
});

module.exports = mongoose.models.Class || mongoose.model("Class", classSchema);
