
const express = require('express');
const multer = require('multer');
const path = require('path');
const studentRouter = express.Router();
const fs = require('fs');

const Student = require('../models/student')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });


//  Create Students with picture
studentRouter.post('/create', upload.single('picture'), async (req, res) => {
  try {
    const { firstName, lastName, age } = req.body;
    const picture = req.file ? req.file.filename : null; // Get the uploaded file name

    const newStudent = new Student({
      firstName,
      lastName,
      age,
      picture,
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get All Students ****************************************************
studentRouter.get('/all', async (req, res) => {
  try {
    // Retrieve student data from MongoDB
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// update student ************************************************************************
studentRouter.put('/byId/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, age } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(id, {
      firstName,
      age,
    }, { new: true });

    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// get single student by id: ************************************************************************

studentRouter.get('/byId/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete by ID
studentRouter.delete('/byId/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    await Student.findByIdAndDelete(studentId);
    res.sendStatus(204); // No content
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload a picture for a student *******************************************************************
studentRouter.post('/:id/picture', upload.single('picture'), async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);

    // Delete previous picture if it exists
    if (student.picture) {
      const previousPicturePath = path.join(__dirname, 'uploads', student.picture);
      fs.unlinkSync(previousPicturePath);
    }

    student.picture = req.file.filename;
    await student.save();

    res.json({ fileName: req.file.filename });
  } catch (error) {
    console.error('Error uploading picture:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update student by ID ***********************************************************************
studentRouter.put('/update/:id', upload.single('picture'), async (req, res) => {
  try {
    const { firstName, lastName, age } = req.body;
    const studentId = req.params.id;

    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Delete the old picture if a new picture is uploaded
    if (req.file) {
      const oldPicturePath = path.join(__dirname, '../uploads', student.picture);
      fs.unlinkSync(oldPicturePath);
      student.picture = req.file.filename;
    }

    student.firstName = firstName;
    student.lastName = lastName;
    student.age = age;

    await student.save();
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = studentRouter;
