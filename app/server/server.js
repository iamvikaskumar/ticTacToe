var express = require("express");
var socket = require('socket.io');
var app = express();
var players = ['noughts', 'crosses'];
var currentPlayer = '';
var turn = 'noughts';
var currentData = {
  data: {
    "col-00": "",
    "col-01": "",
    "col-02": "",

    "col-10": "",
    "col-11": "",
    "col-12": "",

    "col-20": "",
    "col-21": "",
    "col-22": ""
  },
  turn: 'noughts',
  winner:""
};
app.get('/', function (req, res) {
  res.send("ok report !!");
});

var server = app.listen(3000, function () {
  console.log('Server Started at 3000....');
});
var io = socket(server);


io.on('connection', function (socket) {

  socket.emit('init', currentData);

  if (io.engine.clientsCount === 1) {
    currentPlayer = 'noughts';
  }
  else if (io.engine.clientsCount === 2) {
    if (currentPlayer === 'noughts') {
      currentPlayer = 'crosses';
    }
    else {
      currentPlayer = 'noughts';
    }
  }

  else {
    currentPlayer = 'spectator';
  }

 
  socket.emit('assignPlayer', currentPlayer);

  socket.on('click', function (data) {
    currentData.data = data.data;
    currentData.turn = data.turn;
    io.emit('update', currentData);
  });

  socket.on('reset', function (data) {
    currentData.data = {
      "col-00": "", "col-01": "", "col-02": "",
      "col-10": "", "col-11": "", "col-12": "",
      "col-20": "", "col-21": "", "col-22": ""
    };
    currentData.winner = "";
    io.emit('update', currentData);
  });
 
  socket.on('gameover', function(data){
    console.log('Winner is ' + data);
    currentData.winner = data;
    io.emit('update', currentData);
  });



  socket.on('disconnect', function (socket) {
    //  console.log(io.engine);
  });
});

