const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const verifyToken = require('../lib/verifyToken');
const Class = require('../models/Class');

router.post('/', verifyToken, function (req, res) {
  Class.create({ name: req.body.name },
    function (err, classModel) {
      if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
      res.status(httpStatus.OK).send(classModel);
    });
});


router.get('/', verifyToken, function (req, res, next) {
  Class.find({}, function (err, classes) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.OK).send(classes);
  }).sort({ name: 1 });
});

router.get('/:id', function (req, res) {
  Class.findById(req.params.id, function (err, classModel) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    if (!classModel) return res.status(httpStatus.NOT_FOUND).send('Class not found');
    res.status(httpStatus.OK).send(classModel);
  });
});

router.delete('/:id', verifyToken, function (req, res) {
  Class.findByIdAndRemove(req.params.id, function (err, classModel) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.OK).send("Class: " + classModel.name + " was deleted.");
  });
});

router.put('/:id', verifyToken, function (req, res) {
  Class.findByIdAndUpdate(req.params.id, {
    $set: { name: req.body.name }
  }, { new: false }, function (err, user) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.NO_CONTENT).send(user);
  });
});


module.exports = router;
