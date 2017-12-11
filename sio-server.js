var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app).listen(8080);
var io = require("socket.io")(server);

app.use(express.static("./public"));

io.on('error', function (error) {

    console.error(error);

});

io.on("connection", function(socket){

    socket.on("transcript", function(data){

        socket.broadcast.emit("transcript", data)

    });

    socket.on("interim", function(data){

        socket.broadcast.emit("interim", data)

    });

    console.log(socket.id);
});

console.log("Server Online...");