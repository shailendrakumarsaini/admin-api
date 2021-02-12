const express = require('express');
const router = express.Router();
const CourseCtrl = require('../controllers/course.controller');

router.get('/', CourseCtrl.findDocument);


module.exports = router;