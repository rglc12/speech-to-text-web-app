var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app).listen(3000);
var io = require("socket.io")(server);

app.use(express.static("./public"));

io.on("connection", function(socket){

    socket.on("transcript", function(final_transcript){

       socket.broadcast.emit("transcipt", final_transcript)

    });

});

console.log("starting...");