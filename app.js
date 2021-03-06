
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const User = require('./models/user');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const app = express();
if (process.env.NODE_ENV !== 'production'){ require('dotenv').config(); }

//connect to database
// mongoose.connect(process.env.DATABASE_URL,{
// 	useNewUrlParser:true, 
// 	useUnifiedTopology:true,
//   useFindAndModify: false,
//   useCreateIndex:true
// }).then(() => {
// 	console.log('Connected to Mongo DB')
// }).catch(err => {
// 	console.log('error: ',err.message)
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
var expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 6) // 6 hours
app.use(expressSession({
  secret:"chickory chick",
  resave:false,
  saveUninitialized:false,
  name: 'sessionId',
  secure:true,
  httpOnly:true,
  expires: expiryDate
  }));
app.use(passport.initialize());
app.use(passport.session());
app.disable('x-powered-by');
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	// res.locals.error = req.flash("error");
	// res.locals.success = req.flash("success");
	next();
});

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//set local variables middleware
app.use(function (req,res,next) {
	//set default page title if one is not specified
	res.locals.title='Robert Greenstreet';
	//set success flash message
	res.locals.success = req.session.success || "";
	//delete flash message after sending it to the page so it doesn't show again
	delete req.session.success;
	//set error flash message
	res.locals.error = req.session.error || "";
	//delete flash message after sending it to the page so it doesn't show again
	delete req.session.error;
	//continue on to the next function in the middlware/route chain
	next();
});

//mount routes
app.use('/', indexRouter);
// app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//set up server
let port = process.env.PORT;
if (port == null || port == "" || typeof port === 'undefined') {
  port = 8080;
}

app.listen(port, () => {
	console.log(`Server has started, listening on port ${port}`);
});

module.exports = app;
