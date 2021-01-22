// Start
const fs = require("fs");
const path = require("path");
var express = require('express');
var app = express();
var piREST = require('pi-arest')(app);
var RaspiCam = require('raspicam');

const camera = new RaspiCam({
  mode: "photo",
  width: 300,
  output: "./public/pictures/photo.jpg",
  encoding: "jpg"
});

// Set Raspberry Pi
piREST.set_id('p5dgwt');
piREST.setKey('your_key');
piREST.set_name('pi_cloud');
piREST.set_mode('bcm');

// Variables
piREST.variable("camera", "");

// Connect to cloud.aREST.io
piREST.connect("192.168.2.171");

// Publish data on feed temperature, with value 10, every 5 seconds
setInterval(function () {
  camera.start();

  camera.once("read", function (err, timestamp, filename){
    camera.stop();

    const bmp = fs.readFileSync(path.join("./public/pictures", filename));
    const base64 = new Buffer(bmp).toString("base64");
    piREST.publish("camera", base64);
  });
}, 5000);

// Start server
var server = app.listen(5000, function () {
  console.log('Listening on port %d', server.address().port);
});
