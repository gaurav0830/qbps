const SignupSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String
});
const SignupModel = mongoose.model("signup", SignupSchema);
