// *** main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var session = require('express-session');


// *** routes *** //
var routes = require('./routes/index.js');


// *** express instance *** //
var app = express();
app.use(session({secret: "Shh, its a secret!"}));
app.use('/userHome', checkAuth);

// *** view engine *** //
var swig = new swig.Swig();

app.set('view engine', 'ejs');


// *** static directory *** //
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

app.use('/scripts', express.static(__dirname + '/node_modules/webix/'));
// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));


// *** main routes *** //
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


function checkAuth (req, res, next) {
  if(req.session.loggedInUser){
    res.render('index.ejs', { title: 'Express' });
  }else{
    res.redirect('/')
  }
}

module.exports = app;
