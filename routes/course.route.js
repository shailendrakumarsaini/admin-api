const express = require('express');
const router = express.Router();
const CourseCtrl = require('../controllers/course.controller');

router.get('/', CourseCtrl.findDocuments);
router.get('/:id', CourseCtrl.findDocumentById);
router.post('/', CourseCtrl.createDocument);


module.exports = router;