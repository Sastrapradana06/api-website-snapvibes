// routes/profileRoute.js
const express = require('express');
const { handlePosting, getAllPostingan, getPostinganById, handleLovePostingan, deletePostingan, handlebookmark } = require('../controller/postingController');
const router = express.Router();

router.post('/', handlePosting);
router.post('/love', handleLovePostingan);
router.post('/bookmark', handlebookmark);

router.get('/get-postingan', getAllPostingan);
router.get('/get-postingan/:id', getPostinganById);
router.get('/delete/:id', deletePostingan);


module.exports = router;
