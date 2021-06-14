const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const verifyToken = require('../lib/verifyToken');
const Student = require('../models/Student');
const ClassSemester = require('../models/ClassSemester');

router.post('/', verifyToken, async function (req, res) {
    // check if number is already assigned to another class
    Student.findOne({ number: req.body.number }, async function (error, foundStudent) {
        if (error) {
            const message = `Server error: ${error.message}`
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ auth: false, error: message });
        }
        if (foundStudent) {
            // Validation failed
            const message = `A student with the number '${req.body.number}' already exists.`
            return res.status(httpStatus.BAD_REQUEST).send({ message });
        }

        // Create student
        const student = { ...req.body };
        const newStudent = await Student.create(student);
        await ClassSemester.updateMany({ '_id': newStudent.semesterClasses }, { $push: { students: newStudent._id } })
        res.status(httpStatus.OK).send(student);
    });
});

router.get('/', verifyToken, function (req, res, next) {
    Student.find({}, function (err, students) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send(students);
    }).sort({ name: 1 });
});

router.get('/:id', function (req, res) {
    Student.findById(req.params.id, function (err, student) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        if (!student) return res.status(httpStatus.NOT_FOUND).send('Student not found');
        res.status(httpStatus.OK).send(student);
    });
});

router.delete('/:id', verifyToken, function (req, res) {
    Student.findByIdAndRemove(req.params.id, function (err, student) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send({ result: "Student: " + student.name + " was deleted." });
    });
});

router.put('/:id', verifyToken, function (req, res) {
    Student.findByIdAndUpdate(req.params.id, {
        $set: { ...req.body }
    }, { new: false }, function (err, user) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.NO_CONTENT).send(user);
    });
});


module.exports = router;
