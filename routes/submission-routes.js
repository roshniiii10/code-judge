const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middlewares/isLoggedIn');
const { submitCode } = require('../controllers/submission-controller');

router.post('/submit', isLoggedIn, submitCode);

module.exports = router;