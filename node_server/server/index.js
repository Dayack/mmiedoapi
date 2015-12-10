var express = require('express');

module.exports = function() {

	var app = express();
	//routes
	app.get('/', function(req,res) {
		res.send("hello world");
	});

	app.get('/graph/:graphname',function(req,res) {
		res.send('Page for'+req.params.graphname + 'with option' + req.query.option);
	})

	//add public static directory
	app.use(express.static('public'));
	return app;
};
