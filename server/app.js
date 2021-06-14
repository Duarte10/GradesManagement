require('rootpath')();
const express = require('express');
const app = express();
require('./db');
const httpStatus = require('./lib/httpStatus')
const bodyParser = require('body-parser')
const cors = require('cors');

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());

app.get('/api/v1', function (req, res) {
  res.status(httpStatus.OK).send('API v1 running');
});

const userController = require('controllers/userController');
app.use('/api/v1/users', userController);

const authController = require('controllers/authController');
app.use('/api/v1/authentication', authController);

const classController = require('controllers/classController');
app.use('/api/v1/class', classController);

const studentController = require('controllers/studentController');
app.use('/api/v1/student', studentController);

const classSemesterController = require('controllers/classSemesterController');
app.use('/api/v1/class-semester', classSemesterController);

const courseController = require('controllers/courseController');
app.use('/api/v1/course', courseController);

module.exports = app;
