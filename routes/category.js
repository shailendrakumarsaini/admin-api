const express = require('express');
const router = express.Router();
const CategoryCtrl = require('../controllers/category');

router.get('/', CategoryCtrl.findDocument);
router.get('/:id', CategoryCtrl.findDocumentById);
router.post('/', CategoryCtrl.createDocument);
router.patch('/:id', CategoryCtrl.updateDocument);
router.delete('/:id', CategoryCtrl.deleteDocument);

module.exports = router;