const express = require("express");
const router = express.Router();
const User = require("../models/user");
const UserCtrl = require("../controllers/user");
const auth = require('../config/auth');

router.get('/', UserCtrl.findDocument );
router.get('/:id', UserCtrl.findDocumentById );
router.post('/', UserCtrl.createDocument );
router.patch('/:id', UserCtrl.updateDocument );
router.delete('/:id', UserCtrl.deleteDocument );
router.post('/login', UserCtrl.login );
router.post('/logout', auth, UserCtrl.logout);
router.post('/logoutall', auth, UserCtrl.logoutall);

// router.get('/', async (req, res)=>{
//     try {
//         const result = await User.find();
//         res.status(200).send(result);
//     } catch (error) {
//        res.status(400).send(error); 
//     }
// });

// router.post('/', async (req, res)=>{
//     try {
//         const result = await User(req.body).save();
//         res.status(201).send(result);
//     } catch (error) {
//        res.status(400).send(error); 
//     }
// });

// router.patch('/:id', async (req, res)=>{
//     try {
//         const result = await User.findByIdAndUpdate({ _id : req.params.id }, req.body, { new: true });
//         res.status(200).send(result);
//     } catch (error) {
//        res.status(400).send(error); 
//     }
// });

// router.delete('/:id', async (req, res)=>{
//     try {
//         const result = await User.findByIdAndDelete({ _id : req.params.id });
//         res.status(200).send(result);
//     } catch (error) {
//        res.status(400).send(error); 
//     }
// });

module.exports = router;