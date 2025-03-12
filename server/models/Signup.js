const SignupSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
    role: { type: String, enum: ["Teacher", "Admin"], default: "Teacher" }
});
const SignupModel = mongoose.model("signup", SignupSchema);
