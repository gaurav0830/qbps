const express = require("express");
const mongoose = require("mongoose");
const QuestionModel = require("./models/Question");
const SubjectModel = require("./models/SubjectModel"); // Ensure correct path
const Subject = require("./models/Subject");



const app = express();
app.use(express.json()); // Parse JSON request bodies

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins or specify frontend URL
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204); // No content response for preflight requests
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
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    role: { type: String, enum: ["Teacher", "Admin"], default: "Teacher" }, 
});

const SignupModel = mongoose.model("signup", SignupSchema);

// Login API Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (email === "admin@gmail.com" && password === "654413") {
        return res.status(200).json({
            message: "Success",
            user: { name: "Admin", email: "admin@gmail.com" },
        });
    }

    const user = await SignupModel.findOne({ email, password });

    if (!user) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }

    res.status(200).json({ 
        message: "Success", 
        user: { name: user.name, email: user.email } 
    });
});



// Signup API Route
app.post('/Admin/register', async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;

    // Validate input
    if (!name || !email || !password || !confirmPassword || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        // Check if the email already exists
        const existingUser = await SignupModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create a new user
        const signup = await SignupModel.create({ name, email, password, confirmPassword, role });
        res.status(201).json({ message: "User registered successfully", user: signup });
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

// Fetch all users
app.get('/Admin/users', async (req, res) => {
    try {
        const users = await SignupModel.find();
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Update user data
app.put('/Admin/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
        const updatedUser = await SignupModel.findByIdAndUpdate(
            id,
            { name, email, role },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: "Error updating user" });
    }
});

// Delete a user
app.delete('/Admin/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await SignupModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Error deleting user" });
    }
});



// Add Subjects
app.post("/Admin/subjects", async (req, res) => {
    const { className, semester, subjects } = req.body;

    try {
        // Check if the class and semester already exist
        let subjectDoc = await SubjectModel.findOne({ className, semester });

        if (subjectDoc) {
            // If the document exists, add new subjects to the existing array
            subjectDoc.subjects = [...new Set([...subjectDoc.subjects, ...subjects])]; // Avoid duplicates
        } else {
            // If the document doesn't exist, create a new one
            subjectDoc = new SubjectModel({ className, semester, subjects });
        }

        await subjectDoc.save();
        res.status(201).json({ message: "Subjects added successfully!", subjectDoc });
    } catch (err) {
        console.error("Error adding subjects:", err);
        res.status(500).json({ message: "Error adding subjects" });
    }
});



// // **Get all Classes**  
// app.get("/classes", async (req, res) => {
//     try {
//         const classes = await SubjectModel.distinct("className");
//         res.json(classes);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching classes", error });
//     }
// });

// **Get Semesters based on Class**
app.get("/semesters", async (req, res) => {
    const { className } = req.query;

    try {
        if (!className) {
            return res.status(400).json({ message: "className is required" });
        }

        const semesters = await SubjectModel.distinct("semester", { className });

        if (semesters.length === 0) {
            return res.status(404).json({ message: "No semesters found for this class" });
        }

        res.json(semesters);
    } catch (error) {
        res.status(500).json({ message: "Error fetching semesters", error });
    }
});

// **Get Subjects based on Class and Semester**  
app.get("/subjects", async (req, res) => {
    const { className, semester } = req.query;

    try {
        const subjectsData = await SubjectModel.findOne({ className, semester });
        if (!subjectsData) {
            return res.json([]);
        }
        res.json(subjectsData.subjects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subjects", error });
    }
});

app.post("/generate-questions", async (req, res) => {
    try {
        const { examType, internalType,className, semester, subject, questions } = req.body;

        if (!examType || !className || !semester || !subject || !questions || questions.length === 0) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Format questions with additional fields
        const formattedQuestions = questions.map((q) => ({
            question: q.question,
            moduleType: q.moduleType,
            co: q.co,
            po: q.po,
            bl: q.bl,
            marks: q.marks
        }));

        // Save to database
        const newQuestions = new QuestionModel({
            examType,      
            internalType, 
            className,
            semester,
            subject,
            questions: formattedQuestions
        });

        await newQuestions.save();

        res.status(201).json({ message: "Questions saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving questions", error });
    }
});



// Fetch all classes
app.get("/classes", async (req, res) => {
    try {
        const classes = await SubjectModel.distinct("className");
        res.json(classes || []); // Always return an array
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ message: "Error fetching classes", error: error.message });
    }
});



// Get Select Options (Class, Semester, Exam Type, Internal Type)
app.get("/select-options", async (req, res) => {
    try {
        const classes = await QuestionModel.distinct("className");
        const semesters = await QuestionModel.distinct("semester");
        const examTypes = await QuestionModel.distinct("examType");
        const internalTypes = await QuestionModel.distinct("internalType");

        res.json({
            classes,
            semesters,
            examTypes,
            internalTypes,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching select options", error: error.message });
    }
});

app.get("/subject", async (req, res) => {
    const { className, semester } = req.query;

    if (!className || !semester) {
        return res.status(400).json({ message: "Class name and semester are required" });
    }

    try {
        const subjects = await QuestionModel.distinct("subject", { className, semester });
        res.json(subjects || []); // Always return an array
    } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ message: "Error fetching subjects", error: error.message });
    }
});

// Get Modules for Checkbox Selection
app.get("/modules", async (req, res) => {
    const { className, subject } = req.query;

    if (!className || !subject) {
        return res.status(400).json({ message: "Class name and subject are required" });
    }

    try {
        const data = await QuestionModel.findOne({
            className: className.trim(),
            subject: subject.trim()
        });

        console.log("🔍 Data Fetched from DB:", data);

        if (!data || !data.questions || !Array.isArray(data.questions)) {
            console.warn("⚠️ No modules found for:", { className, subject });
            return res.status(404).json({ message: "No modules found" });
        }

        // Extract and filter module types
        const modules = data.questions
            .map((q) => q.moduleType)
            .filter(Boolean);

        const uniqueModules = [...new Set(modules)];

        console.log("✅ Modules Fetched Successfully:", uniqueModules);
        res.json(uniqueModules);
    } catch (error) {
        console.error("❗ Backend Error:", error.message);
        res.status(500).json({
            message: "Server error while fetching modules",
            error: error.message
        });
    }
});



// Generate Randomized Questions
app.post("/generate-question", async (req, res) => {
    console.log("🟠 Request Body Received:", req.body);

    const { examType, className, semester, subject, modules, num2m, num8m, num10m } = req.body;

    if (!examType || !className || !semester || !subject || !Array.isArray(modules) || modules.length === 0) {
        console.error("🚨 Missing Required Fields Details:", { examType, className, semester, subject, modules });
        return res.status(400).json({ message: "Missing required fields or invalid data format" });
    }

    try {
        // Fetch and filter questions
        const questions = await QuestionModel.aggregate([
            { $match: { className: className.trim(), semester: semester.trim(), subject: subject.trim() } },
            { $unwind: "$questions" },
            {
                $match: {
                    "questions.moduleType": { $in: modules.map(m => m.trim()) },
                    "questions.marks": { $in: ["2m", "8m", "10m"] }
                }
            }
        ]);

        const filterQuestions = (type, count) =>
            questions
                .filter(q => q.questions.marks === type)
                .slice(0, parseInt(count) || 0)
                .map(q => ({
                    question: q.questions.question,
                    co: q.questions.co,
                    po: q.questions.po,
                    bl: q.questions.bl,
                    marks: q.questions.marks
                }));

        const result = [
            ...filterQuestions("2m", num2m),
            ...(examType === "internal"
                ? filterQuestions("10m", num10m)
                : filterQuestions("8m", num8m))
        ];

        if (!result.length) {
            return res.status(404).json({ message: "No questions found based on the criteria." });
        }

        res.status(200).json({ questions: result });
    } catch (error) {
        console.error("❗ Error generating questions:", error);
        res.status(500).json({ message: "Error generating questions", error: error.message });
    }
});



// Start Server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});