var mysql = require('mysql');

module.exports.printPlainText = ((request, response) => {
	 response.json({message:"Testing Routes"});
});