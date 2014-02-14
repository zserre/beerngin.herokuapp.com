var mongo = require('mongodb');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var brewDB;

BrewProvider = function(uri) {
 mongo.Db.connect(uri, function (err, db) {
    brewDB = db;
  });
};


//getCollection
BrewProvider.prototype.getCollection= function(callback) {
  brewDB.collection('brews', function(error, brew_collection) {
    if( error ) callback(error);
    else callback(null, brew_collection);
  });
};

//findAll
BrewProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, brew_collection) {
      if( error ) callback(error)
      else {
        brew_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//deleteById
BrewProvider.prototype.deleteById = function(id, callback) {
    this.getCollection(function(error, brew_collection) {
      if( error ) callback(error)
      else {
        brew_collection.remove({_id: brew_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//findById
BrewProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, brew_collection) {
      if( error ) callback(error)
      else {
        brew_collection.findOne({_id: brew_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//updateById
BrewProvider.prototype.updateById = function(id, brews, callback) {
    this.getCollection(function(error, brew_collection) {
      
      if( error ) callback(error)
      else {
        brews._id = brew_collection.db.bson_serializer.ObjectID.createFromHexString(id);
        brew_collection.save(
            brews, 
            function(err, records) {
              console.log(err);
              console.log(records);
              callback(null, brews);
            });
      }
    });
};

//save
BrewProvider.prototype.save = function(brews, callback) {
    this.getCollection(function(error, brew_collection) {
      
      if( error ) callback(error)
      else {
        if( typeof(brews.length)=="undefined")
          brews = [brews];

        for( var i =0;i< brews.length;i++ ) {
          brew = brews[i];
        }
        brew_collection.insert(brews, function(err, records) {
          console.log(err);
          console.log(records);
          callback(null, brews);
        });
      }
    });
};

exports.BrewProvider = BrewProvider;