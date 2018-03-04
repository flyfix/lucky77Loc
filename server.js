const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var cord = require('./entities/cord')
var appService = require('./services/appService')

var cordArray = [];
var device1= "31364719343730393F0430";
var device2= "3136471734373039330380";
var counter = 0;
var isSaving = false;

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(msg.toString());
  if(isSaving === false) {
  counter = counter + 1;
  if(counter % 3 == 0) {
    var array = msg.toString().split(',');
    if(array.length === 8) {
      var date = array[0];
      var beaconId = array[1];
      var x = array[2];
      var y = array[3];
      var z = array[4];
      var a = new cord.Cord(beaconId,date,x,y,z);
      cordArray.push(a);
        console.log(cordArray.length);
      if(cordArray.length >= 8) {
        isSaving = true;
        var arrayCopy = cordArray;
        cordArray = [];
        console.log("Saving to db cords array");
        appService.insertCords(arrayCopy,function(err,result) {
          isSaving = false;
          console.log("saved",result);
        });
      }
      console.log(cordArray.length);
    }

  }
  }
 
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(10001);
// server listening 0.0.0.0:41234