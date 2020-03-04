const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('getting home page');
  res.render('index', { title: 'Robert Greenstreet - Home' });
});

module.exports = router;