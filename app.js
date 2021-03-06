var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var policyRouter = require('./routes/policy');
// var singleRouter = require('./routes/single');

var app = express();
app.use(compression())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/policy', policyRouter);
// app.use('/single', singleRouter);

/*
  router kullanilmadigi icin bu sekilde sayfa aciliyor
*/
app.get('/single/', (req, res, next) => {
  res.render('single', {
    article_id: "makale yok"
  });
});

app.get('/single/:article_id', (req, res, next) => {
  res.render('single', {
    article_id: req.params.article_id
  });
});

/*
  router kullanilmadigi icin bu sekilde sayfa aciliyor
*/
app.get('/category/', (req, res, next) => {
  res.render('category', {});
});

app.get('/category/:category_name', (req, res, next) => {
  res.render('category', {
    category_name: req.params.category_name
  });
});

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

module.exports = app;
