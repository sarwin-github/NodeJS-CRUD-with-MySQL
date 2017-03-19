var mysql = require("mysql");

function bookRouter(router,connection){
	//this will create a var similiar to an interface that will handle routes
	//restRouter can use restRouter.handleRoutes
	var self = this;
    self.handleRoutes(router,connection);
}

bookRouter.prototype.handleRoutes = ((router,connection) => {
	var self = this;
	router.get("/hello", (request, response) => {
			response.json({"Message": "Testing Route !"});
	});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Use HTTPGET - get all books
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	var getAllBooks = ((request,response) => {
	 	//SELECT * FROM BOOK_TABLE
        var query = "SELECT * FROM ??";
        var table = ["book"];
        query = mysql.format(query,table);
        connection.query(query, (error,books) => {
        	//connection.release(); release connection or close connection
            if(error) {
                response.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                response.json({ success: true, "Message" : "Successfully Fetched All Books", "List of Books" : books});
        }});
    });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Use HTTPGET - Get book by ID
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	var getBookByID = ((request,response) => {
			//SELECT * FROM BOOK_TABLE WHERE BOOK_FIELD = PARAMETER/query string
			var query = "SELECT * FROM ?? WHERE ??=?";
			var table = ["book", "id", request.params.id];
			query = mysql.format(query,table);

			connection.query(query, (error, book) => {
				if(error) {
                	response.json({"Error" : true, "Message" : "Error executing MySQL query"});
            	} else {
               	 	response.json({ success: true, "Message" : "Successfully Fetched a Book by ID", "Book Result" : book});	
			}});
	});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Use HTTPPOST - Create a new book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    var createBook = ((request,response) => {
    	//INSERT INTO TABLE_SET(BOOKS FIELDS) VALUES (BOOK FIELDS VALUE)
        var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";

        //table name follow by fields
        var table = ["book" , "BookName","AuthorName", "Price", 
        				request.body.BookName, 
        				request.body.AuthorName, 
        				request.body.Price];

        query = mysql.format(query,table);

        connection.query(query, (error,books) => {
            if(error) {
                response.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                response.json({ success: true, "Message" : "Book have been Added !"});
        }});
    });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Use HTTPPUT - Update a book based on its query string id
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
    var updateBookByID = ((request,response) => {
        //UPDATE BOOK_TABLE SET BOOK FIELD 1 = VALUE, BOOK FIELD 2 = VALUE  WHERE BOOK_FIELD = PARAMETER/query string
        var query = "UPDATE ?? SET ??=?, ??=?, ??=? WHERE ?? = ?";
        var table = ["book", 
            "BookName", request.body.BookName, 
            "AuthorName", request.body.AuthorName, 
            "Price", request.body.Price, 
            "id", request.params.id ];
        query = mysql.format(query, table); 

        connection.query(query, (error, book) => {
            if(error) {
                response.json({"Error": true, "Message" : "Error executing MySQL query"});
            } else {
                response.json({ success: true, "Message" : "Book with with this id:" + request.params.id + " have been updated"});
        }});       
    });
    
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Use HTTPDELETE - Delete a book based on its query string id
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
    var deleteBook = ((request,response) => {
            //DELETE FROM BOOK_TABLE WHERE BOOK_FIELD = PARAMETER/query string 
            var query = "DELETE from ?? WHERE ??=?";
            var table = ["book", "id", request.params.id];
            query = mysql.format(query,table);
            connection.query(query,(error, book) => {
                if(error) {
                    response.json({"Error" : true, "Message" : "Error executing MySQL query"});
                } else {
                    response.json({ success: true, "Message" : "The book with this id:" + request.params.id + " has been deleted"});
        }});
    });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Book Routes
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
    router.get("/books", getAllBooks);
    router.get("/books/:id", getBookByID);
    router.post("/books/create", createBook);
    router.put("/books/update/:id", updateBookByID);
    router.delete("/books/delete/:id", deleteBook); 
});

module.exports = bookRouter;