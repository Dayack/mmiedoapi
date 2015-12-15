var express = require('express');
var auth = require('../authentication');

module.exports = function() {

	var app = express();
	//routes
	app.get('/', function(req,res) {
		res.send("hello world");
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

	//add public static directory
	app.use(express.static('public'));
	return app;
};
