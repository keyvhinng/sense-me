var http       = require('http');
var mysql      = require('mysql');
var fs         = require('fs');
var path       = require('path');
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



//WEBSERVER
var testMode = false;
var port = 3030;

var app = express();
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');

app.get('/',function(req,res){
	connection.query('SELECT * from training_tweets LIMIT 10',function(err, rows, field){
		if(!err){
			console.log('The solutions is: ', rows);
			res.render('index',{
				data : rows
			});
		}else{
			console.log('Error while performing Query.');
			console.log(err);
			res.send({success: false})
		}
	});
});

app.put('/tweets/:id',function(req,res){
	connection.query('UPDATE training_tweets set polarity=1 WHERE id=667093069179801600');
});

var server = app.listen(port,'0.0.0.0', function(){
	var host = server.address();
	console.log('server app is running on %s:%s',host.address,host.port);
});


process.on('SIGINT',function(){
	console.log('closing');
	connection.end();
	process.exit();
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



