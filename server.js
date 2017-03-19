//Set Modules
var express 	= require("express")
,	mysql   	= require("mysql") //set database
, 	bodyParser  = require("body-parser")
, 	rest 		= require("./controller/book")
, 	app  		= express();

function SERVER(){
	var self = this;
    self.connectMysql();
}

//Configure connection string/database context
SERVER.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        port     : '9090',
        user     : 'root',
        password : '01610715',
        database : 'books',
        debug    :  false
    });

     //create connection pool - If there's an error stop getting connection else create connection pool
     pool.getConnection(function(error,connection){
        if(error) {
          self.stop(error);
        } else {
          self.configureExpress(connection);
        }
    });
}

//Configure Middleware - Express 
SERVER.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/', router);
    var rest_router = new rest(router,connection);
    self.startServer();
}

//Set the listening port/Http set port
SERVER.prototype.startServer = function() {
      app.listen(8008,function(){
          console.log("Connection Successful, Listening to port 8008");
      });
}

//If there's a connection error, release connection
SERVER.prototype.stop = function(error) {
    console.log("ISSUE WITH MYSQL \n" + error);
    process.exit(1);
}

new SERVER();
