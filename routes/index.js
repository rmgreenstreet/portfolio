const express = require('express');
const router = express.Router();
const { getLandingPage, postContact } = require('../controllers');
const { asyncErrorHandler } = require('../middleware');

/* GET home page. */
router.get('/', asyncErrorHandler(getLandingPage));

//post new project
router.post('/contact', asyncErrorHandler(postContact));

module.exports = router;