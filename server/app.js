var app = require('express')();
var http = require('http').Server(app);
const io = require('socket.io')(http)

io.on('connection', function(socket) {
  let position = 0

  io.emit('button', {
    position: 0
  })

  socket.on('button', function(data) {
    io.emit('button', {
      position: data.position
    })
  })
  

})

http.listen(3000, function () {
  console.log('listening on *:3000');
});