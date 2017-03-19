var express 	= require('express')
 ,	mysql 		= require('mysql')
 ,	bodyParser 	= require('body-parser')
 ,	http 		= require('http')
 ,	app 		= express();

app.set('port', process.env.PORT || 8080);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

app.use('/', router);


http.createServer(app).listen(app.get('port'), function(){
  console.log("I'm alive on port " + app.get('port'));
});