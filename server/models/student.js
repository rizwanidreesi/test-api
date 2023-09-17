const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      
    },
    lastName: {
      type: String,
      
    },
    age: {
      type: Number,
      default: 0,
     
    },
    picture: {
      type: String,
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);


