const express = require('express');
const { subscribe } = require('../controller/subscribeController');
const router = express.Router();

router.post('/subscribe', subscribe);

module.exports = router;
