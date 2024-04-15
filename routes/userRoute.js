const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/', userController.getUser);
router.get('/get/:nama_pengguna', userController.getUserByNamaPengguna);
router.get('/pengguna/:nama_pengguna', userController.getUserIncludeNamaPengguna);
router.get('/:id', userController.getUserById);

router.post('/edit-user', userController.editUser);
router.post('/ikuti', userController.handleIkutiUser);

module.exports = router