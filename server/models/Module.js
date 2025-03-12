const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
    className: String,
    subject: String,
    modules: [String]
});

module.exports = mongoose.models.Module || mongoose.model("Module", moduleSchema);
