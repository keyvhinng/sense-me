var http       = require('http');
var mysql      = require('mysql');
var fs         = require('fs');
var express    = require('express');
var morgan     = require('morgan');

//DATABASE
var connection = mysql.createConnection({
	host    : 'localhost',
	user    : 'root',
	password: 'root',
	database: 'visum'
});
connection.connect();

connection.query('SELECT * from training_tweets LIMIT 4',function(err, rows, field){
	if(!err)
		console.log('The solutions is: ', rows);
	else
		console.log('Error while performing Query.');
});

//WEBSERVER
var testMode = false;
var port = 3030;
var app = express();
app.use(morgan('dev'));


app.get('/',function(req,res){
	var data = '<h1>Tweets para entrenamiento</h1><h2>Apreciamos su contribucion</h2>';
	res.writeHead(200,{
		'Content-type': 'text/html'
	});
	res.end(data);
});

app.listen(port,'0.0.0.0', function(){
	console.log('server app is running at localhost: '.concat(port));
});

/*
app.use(function(req,res){
	var data = JSON.stringify(req.headers);
	res.writeHead(200,{
		'Content-type': 'text/plain'
	});
	res.end(data);
});
*/


connection.end();
