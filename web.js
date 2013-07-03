/* Import libraries */
var http = require('http');
var express = require('express');
var route = require('./controllers/route');

/* Create express app */
var app = express();

/* Run the app on port 8888 */
app.listen(process.env.PORT || 5000);
console.log('Running ... ');

/* Setup Express to serve static files */
app.use(express.static(__dirname + '/public/views'));

/* To parse POST requests */
app.use(express.bodyParser());

/* To handle Cookies */
app.use(express.cookieParser());
app.use(app.router);	

/* Compress using gzip */
app.use(express.compress());

/* Set view engine to jade */
app.set('view engine', 'jade');

/* Set the location of the view files (.jade) */
app.set('views', __dirname + '/public/views');

/* Routes */

/* GET requests */
app.get('/', route.index);
app.get('/favicon.ico', route.favicon);

/* POST request */
app.post('/add', route.save);
app.post('/remove', route.remove);

app.get("*", route.panic);