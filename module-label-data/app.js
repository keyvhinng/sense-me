var bodyParser = require('body-parser');
var express    = require('express');
var favicon    = require('serve-favicon');
var fs         = require('fs');
var morgan     = require('morgan');
var mysql      = require('mysql');
var path       = require('path');


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
app.use(favicon(__dirname+'/public/images/ico.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine','ejs');

app.get('/',function(req,res){
	connection.query('SELECT * from training_tweets LIMIT 10',function(err, rows, field){
		if(!err){
			//console.log('The solutions is: ', rows);
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
	var queryString = 'UPDATE training_tweets set polarity=1 WHERE id=' + connection.escape(req.body.id);
	console.log('put received');
	console.log(req.body);
	console.log(req.body.id);
	console.log(req.body.status);
	console.log(queryString);
	connection.query(queryString);
	connection.commit(function(err){
		if(err){
			console.log("ERROR: cannot commit");
		}
	});
	res.send({success: true});
});

var server = app.listen(port,'127.0.0.1', function(){
	var host = server.address();
	console.log('server app is running on %s:%s',host.address,host.port);
});


process.on('SIGINT',function(){
	console.log('closing');
	connection.end();
	process.exit();
});

