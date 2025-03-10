const express = require("express");
const mongoose = require("mongoose");
const QuestionModel = require("./models/Question");

const app = express();
app.use(express.json()); // Parse JSON request bodies

// Enable CORS with specific options
app.use((req, res, next)=> {
    console.log()
    res.header("Access-Control-Allow-Origin", req.headers.origin)
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true")
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // No content for preflight requests
    }
    next();
});

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/qpgs-signup", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Define Signup Schema & Model
const SignupSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
});
const SignupModel = mongoose.model("signup", SignupSchema);

// Login API Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await SignupModel.findOne({ email, password });

    if (!user) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Set CORS headers explicitly
    res.json({ message: "Success", user: { name: user.name, email: user.email } });
});

// Signup API Route
app.post('/Admin/register', async (req, res) => {
    try {
        const signup = await SignupModel.create(req.body);
        res.json(signup);
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Error saving user" });
    }
});

// Fetch Question Papers
app.get("/get-question-papers", async (req, res) => {
    try {
        const papers = await QuestionModel.find(); // Use QuestionModel
        res.json(papers);
    } catch (error) {
        console.error("Error fetching question papers:", error);
        res.status(500).json({ message: "Error fetching question papers" });
    }
});


// Start Server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});