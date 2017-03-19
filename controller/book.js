var mysql = require("mysql");

function bookRouter(router,connection)
{
	//this will create a var similiar to an interface that will handle routes
	//restRouter can use restRouter.handleRoutes
	var self = this;
    self.handleRoutes(router,connection);
}

bookRouter.prototype.handleRoutes = (router,connection) => {
	var self = this;
	router.get("/hello", (request, response) => {
			response.json({"Message": "Testing Route !"});
	});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Use HTTPGET - get all books
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	router.get("/books", (request,response) => {
	 	//SELECT * FROM BOOK_TABLE
        var query = "SELECT * FROM ??";
        var table = ["book"];
        query = mysql.format(query,table);
        connection.query(query, (error,rows) => {
        	//connection.release(); release connection or close connection
            if(error) {
                response.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                response.json({"Error" : false, "Message" : "Success", "List of Books" : rows});
        }});
    });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Use HTTPGET - Get book by ID
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	router.get("/books/:id", (request,response) => {
			//SELECT * FROM BOOK_TABLE WHERE BOOK_FIELD = PARAMETER/query string
			var query = "SELECT * FROM ?? WHERE ??=?";
			var table = ["book", "id", request.params.id];
			query = mysql.format(query,table);

			connection.query(query, (error, rows) => {
				if(error) {
                	response.json({"Error" : true, "Message" : "Error executing MySQL query"});
            	} else {
               	 	response.json({"Error" : false, "Message" : "Success", "Book Result" : rows});	
			}});
		});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Use HTTPPOST - Create a new book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    router.post("/books/create", (request,response) => {
    	//INSERT INTO TABLE_SET(BOOKS FIELDS) VALUES (BOOK FIELDS VALUE)
        var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";

        //table name follow by fields
        var table = ["book" , "BookName","AuthorName", "Price", 
        				request.body.BookName, 
        				request.body.AuthorName, 
        				request.body.Price];

        query = mysql.format(query,table);

        connection.query(query, (error,rows) => {
            if(error) {
                response.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                response.json({"Error" : false, "Message" : "Book have been Added !"});
        }});
    });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Use HTTPPUT - Update a book based on its query string id
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
    router.put("/books/update/:id", (request,response) => {
        //UPDATE BOOK_TABLE SET BOOK FIELD 1 = VALUE, BOOK FIELD 2 = VALUE  WHERE BOOK_FIELD = PARAMETER/query string
        var query = "UPDATE ?? SET ??=?, ??=?, ??=? WHERE ?? = ?";
        var table = ["book", 
            "BookName", request.body.BookName, 
            "AuthorName", request.body.AuthorName, 
            "Price", request.body.Price, 
            "id", request.params.id ];
        query = mysql.format(query, table); 

        connection.query(query, (error, rows) => {
            if(error) {
                response.json({"Error": true, "Message" : "Error executing MySQL query"});
            } else {
                response.json({"Error": false, "Message" : "Book with id:" + request.params.id + " have been updated"});
        }});       
    });
    
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Use HTTPDELETE - Delete a book based on its query string id
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
    router.delete("/books/delete/:id", (request,response) => {
            //DELETE FROM BOOK_TABLE WHERE BOOK_FIELD = PARAMETER/query string 
            var query = "DELETE from ?? WHERE ??=?";
            var table = ["book", "id", request.params.id];
            query = mysql.format(query,table);
            connection.query(query,(error, rows) => {
                if(error) {
                    response.json({"Error" : true, "Message" : "Error executing MySQL query"});
                } else {
                    response.json({"Error" : false, "Message" : "The book that has id:" + request.params.id + " has been deleted"});
        }});
    });
}

module.exports = bookRouter;