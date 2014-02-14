var express = require('express');
var path = require('path');
var fs = require('fs');
var BrewProvider = require('./brewprovider').BrewProvider;

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost';

var app = express();

app.configure(function() {
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.logger("short"));
	app.use(express.session({ secret: 'some thing' }));
	app.use(app.router);
});

var host = "";

var validUsers = ['sportngin']

var brewProvider = new BrewProvider('mongodb://heroku_app19435220:l3pc0d6d0aceg7k9hnref2kdav@ds053858.mongolab.com:53858/heroku_app19435220');

app.get('/validLogin', function(req, res){	
	if(req.user == undefined){
		res.cookie('username', '');		
	}else{	
		res.cookie('username', req.user.id);		
	}
	res.redirect('/');
});

app.post('/brews', function(req, res){
	if(validUsers.indexOf(req.body.username) >= 0){
		brewProvider.save({
	        type: req.param('type'),
	        name: req.param('name'),
	        brewDate: req.param('brewDate'),
	        statusID: parseInt(req.param('statusID')),
	        statusName: req.param('statusName'),
	        tapNumber: parseInt(req.param('tapNumber'))
	    }, function( error, docs) {
	    	if (!error) res.json({'result': 'success'});
	        else res.send(401, {'result': 'error'});
	    });
	}
	else res.send(401, {'result': 'error'});
});

app.put('/brews/:id', function(req, res){
	if(validUsers.indexOf(req.body.username) >= 0){
		console.log(req.param('_id'));
		console.log(req.param('name'));
		brewProvider.updateById(req.param('_id'), {
	        type: req.param('type'),
	        name: req.param('name'),
	        brewDate: req.param('brewDate'),
	        statusID: parseInt(req.param('statusID')),
	        statusName: req.param('statusName'),
	        tapNumber: parseInt(req.param('tapNumber'))
	    }, function( error, docs) {
	    	if (!error) res.json({'result': 'success'});
	        else res.send(401, {'result': 'error'});
	    });
	} else res.send(401, {'result': 'error'});
});

app.delete('/brews/:id', function(req, res){
	//if(validUsers.indexOf(req.body.username) >= 0){
		brewProvider.deleteById(req.params.id, function(error,docs){
	    	if (!error) res.json({'result': 'success'});
		    else res.send(401, {'result': 'error'});
		});
	//} else res.send(401, {'result': 'error'});
});

app.get('/brews', function(req, res){
    brewProvider.findAll( function(error,docs){
    	if (!error) res.json(docs);
	    else res.json({});
	});
});

app.get('/brews/:id', function(req, res){
     brewProvider.findById(req.params.id, function(error,docs){
    	if (!error) res.json(docs);
	    else res.json({});
	});
});

app.get('/', function(req, res){
     res.sendfile(__dirname + '/public/html/onTap.html');
});

app.get('/onTap', function(req, res){
    res.sendfile(__dirname + '/public/html/onTap.html');
});

app.get('/firebase', function(req, res){
    res.sendfile(__dirname + '/public/html/firebase.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	if(process.argv.length < 3){
		 console.log("Not enough parameters   usage: node server.js [host]");
		 process.exit(code=0);
	}else{
		 host = process.argv[2];
		 console.log("server started on " + host + ":" + port);
	}
});