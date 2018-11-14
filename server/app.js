var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var slides = [{
    name: 'slide1',
    url: 'https://images.pexels.com/photos/910154/pexels-photo-910154.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
}, {
    name: 'slide2',
    url: 'https://images.pexels.com/photos/1581687/pexels-photo-1581687.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
}, {
    name: 'slide3',
    url: 'https://images.pexels.com/photos/1582215/pexels-photo-1582215.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
}]

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

var index = 0
io.on('connection', function(socket) {
    console.log('a user connected');

    io.emit('load slide', slides[index])

    socket.on('next', function() {
        if ((index + 1) > (slides.length - 1)) {
            index = 0
        } else {
            index += 1;
        }
        io.emit('load slide', slides[index])
    });
    socket.on('previous', function() {
        if ((index - 1) < 0) {
            index = (slides.length - 1)
        } else {
            index -= 1;
        }
        io.emit('load slide', slides[index])
    });


    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

http.listen(3000, function() {
    console.log('http listening on port:3000');
});

module.exports = app;