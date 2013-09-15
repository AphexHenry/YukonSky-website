
var Db = require('mongodb').Db
	, Connection = require('mongodb').Connection
	, format = require('util').format;

var VineDB = function (callback) {
	var self = this;
	Db.connect("mongodb://tangible:Nosotro5.@ds029328.mongolab.com:29328/af_vinevj-baptiste", function (err, db) {
		self.collection = db.collection('vines');
		if (callback) callback();
	});
};

VineDB.prototype.add = function (data, callback) {
	console.log(data.name + " added in the db")
	console.log(data);
	this.collection.update({name:data.name}, data, { upsert: true }, function (err, docs) {
		if (callback) callback(docs);
	});
};

VineDB.prototype.getTag = function (tag, callback) {
	console.log("get tag " + tag)
	this.collection.find({name:tag}).toArray( function (err, res) {
		console.log("log result ");
		console.log(res);
		if (callback) callback(res);
	});
};

VineDB.prototype.findAll = function (callback) {
	this.collection.find().toArray( function (err, docs) {
		if (callback) callback(docs);	
	});
};

module.exports = VineDB;