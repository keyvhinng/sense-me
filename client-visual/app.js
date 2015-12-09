var express = require('express');
var favicon    = require('serve-favicon');
var morgan     = require('morgan');
var path       = require('path');

// Web Server
var port = 4000;
var app = express();

app.use(morgan('dev'));
app.use('/',express.static(path.join(__dirname,'public')));
app.use(favicon(__dirname+'/public/images/ico.ico'));

var server = app.listen(port,'0.0.0.0', function(){
	var host = server.address();
	console.log('server app is running on %s:%s',host.address,host.port);
});
