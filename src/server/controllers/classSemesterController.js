const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const verifyToken = require('../lib/verifyToken');
const ClassSemester = require('../models/ClassSemester');

router.post('/', verifyToken, async function (req, res) {
    const classSemester = await ClassSemester.create(...req.body);
    res.status(httpStatus.OK).send(classSemester);
});

router.get('/', verifyToken, function (req, res, next) {
    ClassSemester.find({}, function (err, classSemesters) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send(classSemesters);
    }).sort({ name: 1 });
});

router.get('/:id', function (req, res) {
    ClassSemester.findById(req.params.id, function (err, classSemester) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        if (!classSemester) return res.status(httpStatus.NOT_FOUND).send('Class Semester not found');
        res.status(httpStatus.OK).send(classSemester);
    });
});

router.delete('/:id', verifyToken, function (req, res) {
    ClassSemester.findByIdAndRemove(req.params.id, function (err, classSemester) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send({ result: "Class Semester: " + classSemester.year + " - " + classSemester.semester + " was deleted." });
    });
});

router.put('/:id', verifyToken, function (req, res) {
    ClassSemester.findByIdAndUpdate(req.params.id, {
        $set: { ...req.body }
    }, { new: false }, function (err, classSemester) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);


        res.status(httpStatus.NO_CONTENT).send(classSemester);
    });


});


module.exports = router;
