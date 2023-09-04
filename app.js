var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var policyRouter = require('./routes/policy');
var sitemapRouter = require('./routes/sitemap');
var sitemap2Router = require('./routes/sitemap2');
// var singleRouter = require('./routes/single');

function redirectWwwTraffic(req, res, next) {
  if (req.headers.host.slice(0, 4) === "www.") {
    var newHost = req.headers.host.slice(4);
    return res.redirect(301, req.protocol + "://" + newHost + req.originalUrl);
  }
  next();
}

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

app.enable('trust proxy')
app.use((req, res, next) => {
    req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
})

app.use(redirectWwwTraffic);
app.get('*', function(req, res, next){ 
  if (req.headers.host.slice(0, 6) === "lugat."){
    req.url = '/lugat' + req.url; //append some text yourself
  }
  next(); 
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/policy', policyRouter);
app.use('/sitemap.xml', sitemapRouter);
app.use('/sitemap', sitemap2Router);
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

app.get('/lugat/:article_id', (req, res, next) => {
  res.render('lugat', {
    article_id: req.params.article_id
  });
});

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
