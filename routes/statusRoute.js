const express = require('express');
const router = express.Router();
const {createStatus, getAllStatus, getStatusByUserId, deleteOldStatus, deleteStatusById} = require('../controller/statusController')


router.post('/create', createStatus);

router.get('/get', getAllStatus);
router.get('/get/:user_id', getStatusByUserId);
router.get('/delete', deleteOldStatus);
router.get('/delete/:id', deleteStatusById);

module.exports = router