var express = require('express');
var auth = require('../authentication');
var weekcsv = require('../csv-week');

var bodyParser = require('body-parser');
module.exports = function() {

	var app = express();

	app.use(bodyParser.urlencoded({ extended: false }));
	//routes
	app.get('/', function(req,res) {
		res.send("hello world");
	});

	app.get('/week/',function(req,res) {
		weekcsv.convertCsv();
		res.send("OK");
	});
	app.get('/graph/:graphname',function(req,res) {
		res.send('Page for'+req.params.graphname + 'with option' + req.query.option);
	});

	app.get('/login/:user/:password',function(req,res) {
		res.send(auth.login(req.params.user,req.params.password));
	});
	app.get('/categories/:user',function(req,res) {
		res.send(auth.getCategories(req.params.user));
	});
	app.post('/test',function(req,res) {
		console.log(req.query);
		console.log(req.body);
		console.log("POST RECEIVED AT "+ new Date());
		res.json(req.body);
		res.send(req.body);
	})

	//add public static directory
	app.use(express.static('public'));
	return app;
};
