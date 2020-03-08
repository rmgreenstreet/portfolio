const express = require('express');
const router = express.Router();
const { getLandingPage, postContact } = require('../controllers');
const { asyncErrorHandler, postLimiter } = require('../middleware');



/* GET home page. */
router.get('/', asyncErrorHandler(getLandingPage));

//post new project
router.post('/contact', postLimiter, asyncErrorHandler(postContact));

module.exports = router;