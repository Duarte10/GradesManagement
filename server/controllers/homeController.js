const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const verifyToken = require('../lib/verifyToken');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Course = require('../models/Course');

router.get('/', verifyToken, async function (req, res, next) {
    const courseCount = await Course.countDocuments();
    const classCount = await Class.countDocuments();
    const studentCount = await Student.countDocuments();
    res.status(httpStatus.OK).send({
        totalCourses: courseCount,
        totalClasses: classCount,
        totalStudents: studentCount
    })
});


module.exports = router;
