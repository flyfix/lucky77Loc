var express = require('express')
var appController = require('./controllers/appController')
var bodyParser = require('body-parser')

var router = express.Router()
router.use(appController.middleware)

// support parsing of application/x-www-form-urlencoded post data
router.use(bodyParser.urlencoded({ extended: true }))
// support parsing of application/json type post data
router.use(bodyParser.json())



router.route('/addAlarm')
  .get(appController.addAlarm)

  router.route('/lastCords')
  .get(appController.getLastCords)

router.route('/allalarms')
  .get(appController.getAllAlarms)

router.route('/alarmsForWrist')
  .get(appController.getAlarmForReceiver)

router.route('/alarmsemergency')
  .get(appController.getEmergencyAlarms);

router.route('/devices')
  .get(appController.getDevicesList)

  router.route('/alarmscomplete')
  .get(appController.completeAlarm);


module.exports = router
