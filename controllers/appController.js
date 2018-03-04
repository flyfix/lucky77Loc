var express = require('../node_modules/express')
var alarm = require('../entities/alarm')
var cord = require('../entities/cord')
var device = require('../entities/device')
var formidable = require('../node_modules/formidable')
var appService = require('../services/appService')
var cordsUdpService = require('../services/cordsUdpService')

var app = express()

module.exports = {
  middleware: function (req, res, next) {
    console.log(req.method, req.url)
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');
    next()
  },

completeAlarm : function(req,res) {
  console.log(req.query)
  var alarmId = req.query.alarmId;
  if (alarmId === undefined) {
    res.status(400).end()
    return
  }

  appService.completeAlarm (alarmId,  function (err, data) {
    if (err !== null) {
      if (err.code === 409) {
        res.status(409).send(err)
        return
      }else {
        res.status(500).send(err)
        return
      }
    }
  res.status(200);
  res.send(JSON.stringify("Completed alarm")).end()
})
},

  addAlarm : function (req, res) {
    var message = req.query.message
    var timeWhenShow = req.query.timeWhenShow;
    var creatorWristId = req.query.creatorWristId
    var receiverWristId = req.query.receiverWristId

    if (message == undefined || creatorWristId == undefined || timeWhenShow == undefined || receiverWristId == undefined  ) {
      res.status(400).end('Incorrect parameters')
      return
    }
    var newAlarm = new alarm.Alarm(undefined,message,timeWhenShow,new Date().toLocaleString(),creatorWristId,receiverWristId,false);
    appService.addAlarm(newAlarm, function (err, data) {
      if (err !== null) {
        if (err.code === 409) {
          res.status(409).send(err)
          return
        }else {
          res.status(500).send(err)
          return
        }
      }
      res.status(201);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data.insertedId)).end()
    })
  },

  getAllAlarms: function (req, res) {
 
    appService.getAllAlarms(function (err, data) {
      if (err !== null) {
        res.status(500, err).end()
        return
      }
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data)).end()
    })
  },

  getAlarmForReceiver: function (req, res) {
    var wristId = req.query.wristId;
    if (wristId === undefined) {
      res.status(400).end()
      return
    }
    appService.getAllAlarms(function (err, data) {
      if (err !== null) {
        res.status(500, err).end()
        return
      }

      data =data.filter(function(alarm) {
        return alarm.receiverWristId === wristId;
      })


      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data)).end()
    })
  },

  getEmergencyAlarms: function (req, res) {
    console.log("insideEmergency");
    appService.getAllAlarms(function (err, data) {
      if (err !== null) {
        res.status(500, err).end()
        return
      }
      data =data.filter(function(alarm) {
        return alarm.receiverWristId === null;
      })
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data)).end()
    })
  },

  getLastCords: function (req, res) {
    var deviceId = req.query.deviceId;
    if (deviceId === undefined) {
      res.status(400).end()
      return
    }

    var x = Math.round( (Math.random() * 12) + 1,3);
    var y = Math.round( (Math.random() * 12) + 1,3);
    var z = Math.round( (Math.random() * 12) + 1,3);

    var data = new cord.Cord(deviceId,'2018-03-03 11:03:48',1.200,0.800,5.200);
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data)).end()
  },

  getDevicesList: function (req, res) {
    var device1 = new device.Device("31364719343730393F0430","wrist1Id","Sleepwalker-Token");
    var device2 = new device.Device("3136471734373039330380","wrist2Id","RobberDockor-Token")
    var devices = [device1,device2];

    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(devices)).end()
    return;
  },


  get: function (req, res) {
    var id = req.params.id
    if (id === undefined) {
      res.status(400).end()
      return
    }

    cordsService.get(id, function (err, data) {
      if (err !== null) {
        res.status(500, err).end()
        return
      }
      if (data == undefined) {
        res.status(404).end()
        return
      }
      // To moze byc problem ale nie wiem dlaczego niedziala 
      // res.writeHead(200, {'Content-Type': 'application/json'})
      res.send(data).end()
    })
  }
}
