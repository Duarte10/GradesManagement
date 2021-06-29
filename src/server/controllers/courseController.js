const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const verifyToken = require('../lib/verifyToken');
const Course = require('../models/Course');

router.post('/', verifyToken, async function (req, res) {
    // check if name is already assigned to another class
    Course.findOne({ name: req.body.name }, async function (error, classFound) {
        if (error) {
            const message = `Server error: ${error.message}`
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ auth: false, error: message });
        }
        if (classFound) {
            // Validation failed
            const message = `A course with the name '${req.body.name}' already exists.`
            return res.status(httpStatus.BAD_REQUEST).send({ message });
        }

        // Create class
        Course.create({ ...req.body },
            function (err, course) {
                if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: `Server error: ${err.message}` });
                res.status(httpStatus.OK).send(course);
            });
    });
});

router.get('/', verifyToken, function (req, res, next) {
    Course.find({}, function (err, courses) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send(courses);
    }).sort({ name: 1 });
});

router.get('/:id', async function (req, res) {
    Course.findById(req.params.id, async function (err, course) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        if (!course) return res.status(httpStatus.NOT_FOUND).send('Class not found');
        res.status(httpStatus.OK).send(course);
    });
});

router.delete('/:id', verifyToken, function (req, res) {
    Course.findByIdAndRemove(req.params.id, function (err, course) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send({ result: "Course: " + course.name + " was deleted." });
    });
});

router.put('/:id', verifyToken, async function (req, res) {
    Course.findByIdAndUpdate(req.params.id, {
        $set: { ...req.body }
    }, { new: false }, function (err, course) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.NO_CONTENT).send(course);
    });
});


module.exports = router;
