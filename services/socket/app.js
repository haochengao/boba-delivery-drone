const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mavlink = require('mavlink');
const net = require('net');
const mav_parser = new mavlink(0,0);
const port = process.env.PORT || 5008;
const index = require("./routes/index");
const mav_port = new net.Socket()
mav_port.connect("15002", "0.0.0.0");
const app = express();
app.use(cors());
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origins: "*"
    }
});

mav_parser.on('ready', function () {

    mav_port.on('data', function (data) {
        mav_parser.parse(data);
    });

    // mav_parser.on("message", function(message) {
    //     console.log(message);
    // })

    mav_parser.on("GLOBAL_POSITION_INT", function(message, fields) {
        io.emit("location", {
            lat: fields.lat,
            lng: fields.lon,
            alt: fields.alt,
        })
    })
});


server.listen(port, () => console.log(`Listening on port ${port}`));