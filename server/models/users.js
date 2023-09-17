const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
   {
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [40, "Name must be less than 40 characters"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false,
      },
      role: {
        type: String,
        enum: ["superAdmin", "admin", "staff","user"],
        default: "user",
      },
   }
  );
  
  module.exports = mongoose.model("Users", userSchema);