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
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.set('view engine','ejs');

app.get('/tweets',function(req,res){
	connection.query('SELECT * from training_tweets where polarity is NULL LIMIT 10',function(err, rows, field){
		if(!err){
			res.send({success: true, data : rows})
		}else{
			console.log('Error while performing Query.');
			console.log(err);
			res.send({success: false})
		}
	});
});

app.put('/tweets/:id',function(req,res){
	var queryString = 'UPDATE training_tweets set polarity=' + connection.escape(req.body.polarity)
						+' WHERE id_str=' + connection.escape(req.body.id_str);
	console.log('-----------------------------');
	console.log('put received');
	console.log(req.body.id_str);
	console.log(req.body.text);
	connection.query(queryString);
	connection.commit(function(err){
		if(err){
			console.log("ERROR: cannot commit");
		}
	});
	res.send({success: true});
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

