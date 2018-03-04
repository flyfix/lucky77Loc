var {ObjectId} = require('mongodb'); 

var _connectionString = 'mongodb://team77:team777@ds155218.mlab.com:55218/team77'
var mongoClient = require('mongodb').MongoClient

function connect (callback) {
  mongoClient.connect(_connectionString, function (err, db) {
    callback(err, db)
  })
}

function insertDocument (db, collectionName, data, callback) {
  db.collection(collectionName).insertOne(data, function (err, result) {
    callback(err, result)
  })
}

function insertCords (db, data, callback) {
  db.collection("cords").insert(data, function (err, result) {
    callback(err, result)
  })
}

function deleteDocument (db, collectionName, data, callback) {
  db.collection(collectionName).deleteOne(data, function (err, result) {
    callback(err, result)
  })
}

function findDocument (db, collectionName, value, column, callback) {
  console.log(column, value)
  db.collection(collectionName).findOne({username: value}, function (err, data) {
    callback(err, data)
  })
}


function completeAlarm(db,idToComplete,callback) {
  // var myquery = { _id: ObjectID(idToComplete) };
  // var newvalues = { $set: {completed: true} };
  db.collection('alarms').update({'_id':ObjectId(idToComplete)}, {$set: {completed : true}}, {w:1}, function(err, result){
    callback(err,result);
  });
  // db.collection("alarms").updateOne(myquery, newvalues, function(err, result) {
  //   callback(err,result);
  // });
}

function getAll (db, collectionName, callback) {
  db.collection(collectionName).find().toArray(function (err, data) {
    callback(err, data)
  })
}

module.exports = {
  addAlarm: function (data, callback) {
    connect(function (err, db) {
      if (err !== null) {
        db.close()
        callback(err)
        return
      }
        insertDocument(db, 'alarms', data, function (err, result) {
          db.close()
          callback(err, result)
        })
      })
  },
  insertCords: function (data, callback) {
    connect(function (err, db) {
      if (err !== null) {
        db.close()
        callback(err)
        return
      }
        insertCords(db, data, function (err, result) {
          db.close()
          callback(err, result)
        })
      })
  },

  delete: function (id, callback) {
    connect(function (err, db) {
      if (err !== null) {
        db.close()
        callback(err)
        return
      }
      deleteDocument(db, 'users', id, function (err, result) {
        db.close()
        callback(err, result)
      })
    })
  },
  completeAlarm: function (id, callback) {
    connect(function (err, db) {
      if (err !== null) {
        db.close()
        callback(err)
        return
      }
      completeAlarm(db, id, function (err, result) {
        db.close()
        callback(err, result)
      })
    })
  },

  getAllAlarms: function (callback) {
    connect(function (err, db) {
      if (err !== null) {
        db.close()
        callback(err)
        return
      }
      getAll(db, 'alarms', function (err, result) {
        db.close()
        callback(err, result)
      })
    })
  }

}
