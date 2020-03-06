const express = require('express');
const router = express.Router();
const { getLandingPage, postContact } = require('../controllers')

/* GET home page. */
router.get('/', getLandingPage);

//post new project
router.post('/contact', postContact)

module.exports = router;