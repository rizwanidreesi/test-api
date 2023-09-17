// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// const Student = require('./models/student')

const app = express();
const PORT = 3000;

app.use(cors({origin: 'http://localhost:5173'}));
app.use(express.json()); // Parse JSON requests
// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB

mongoose.connect("mongodb://127.0.0.1:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const studentRoutes = require("./routes/studentRoutes");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, 'uploads'));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

app.use("/api/students", studentRoutes);

// ********************************************************************
// Define a schema and model for Student
// const studentSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   age: Number,
// });

// const Student = mongoose.model('Student', studentSchema);

// Create a new student
// app.post('/api/students', async (req, res) => {
//   try {
//     const { firstName, lastName, age } = req.body;
//     const newStudent = new Student({
//       firstName,
//       lastName,
//       age,
//     });

//     await newStudent.save();
//     res.status(201).json(newStudent);
//   } catch (error) {
//     console.error('Error creating student:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
