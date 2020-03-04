var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/dashboard');
});

router.post('/', function(req, res, next) {
  res.render('users/dashboard');
});

router.get('/register', function(req, res, next) {
  res.render('users/register');
});

router.post('/register', function(req, res, next) {
  res.render('users/dashboard');
});

router.get('/login', function(req, res, next) {
  res.render('users/login');
});

router.post('/login', function(req, res, next) {
  res.render('users/dashboard');
});

module.exports = router;
