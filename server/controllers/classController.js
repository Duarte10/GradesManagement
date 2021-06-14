const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const verifyToken = require('../lib/verifyToken');
const Class = require('../models/Class');
const ClassSemester = require('../models/ClassSemester');
const Course = require('../models/Course');

router.post('/', verifyToken, async function (req, res) {
  // check if code is already assigned to another class
  Class.findOne({ code: req.body.code }, async function (error, classFound) {
    if (error) {
      const message = `Server error: ${error.message}`
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ auth: false, error: message });
    }
    if (classFound) {
      // Validation failed
      const message = `A class with the code '${req.body.code}' already exists.`
      return res.status(httpStatus.BAD_REQUEST).send({ message });
    }

    const { semesters } = req.body;
    if (semesters && semesters.length) {
      const createdSemesters = await ClassSemester.create(semesters);
      // Store the ids in the class document
      req.body.semesters = createdSemesters.map(s => s.id);
    }
    // Create class
    Class.create({ ...req.body },
      function (err, classModel) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: `Server error: ${err.message}` });
        res.status(httpStatus.OK).send(classModel);
      });
  });
});

router.get('/', verifyToken, function (req, res, next) {
  Class.find({}, function (err, classes) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.OK).send(classes);
  }).sort({ name: 1 });
});

router.get('/:id', async function (req, res) {
  Class.findById(req.params.id, async function (err, classModel) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    if (!classModel) return res.status(httpStatus.NOT_FOUND).send('Class not found');

    // Load the semesters
    if (classModel.semesters && classModel.semesters.length) {
      let semestersDetailed = [];
      for (let i = 0; i < classModel.semesters.length; i++) {
        let semester = await ClassSemester.findById(classModel.semesters[i]);
        // load the semester course
        semester.course = await Course.findById(semester.course);
        semestersDetailed.push(semester);
      }
      classModel.semesters = semestersDetailed;
    }
    res.status(httpStatus.OK).send(classModel);
  });
});

router.delete('/:id', verifyToken, function (req, res) {
  Class.findByIdAndRemove(req.params.id, function (err, classModel) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.OK).send({ result: "Class: " + classModel.name + " was deleted." });
  });
});

router.put('/:id', verifyToken, async function (req, res) {
  // Update semesters
  const { semesters, deletedSemesters } = req.body;
  let semestersIds = [];
  if (semesters && semesters.length) {
    for (let i = 0; i < semesters.length; i++) {
      const semester = semesters[i];
      if (semester.id) {
        semestersIds.push(semester.id);
      } else {
        let createdSemester = await ClassSemester.create(semester);
        semestersIds.push(createdSemester.id);
      }
    }
  }

  if (deletedSemesters && deletedSemesters.length) {
    await ClassSemester.deleteMany({
      _id: {
        $in: deletedSemesters
      }
    });
  }

  req.body.semesters = semestersIds;
  Class.findByIdAndUpdate(req.params.id, {
    $set: { ...req.body }
  }, { new: false }, function (err, classModel) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.NO_CONTENT).send(classModel);
  });
});


module.exports = router;
