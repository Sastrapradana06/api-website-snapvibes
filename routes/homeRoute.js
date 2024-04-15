const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('Halaman auth');
});

module.exports = router