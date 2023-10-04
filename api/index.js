require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
var cors = require('cors');

const { sendError, sendResponse } = require("./funcUtils");



//initiating app
app = express();

//to log the requests to the server
app.use(morgan('combined'));

//for case sensitive routing
app.set("case sensitive routing", true);

//to parse the data in the request
app.use(express.json({limit: "5MB"}));

app.use(express.urlencoded({extended: true }));



//port and host (localhost)
API_BIND_ADDR = "0.0.0.0";
API_PORT = 1337;


// allowing cors to do local things //TODO: please remove cors() middleware when setting up production
app.use("/api", cors(), require("./routes/generator"));


//defaults
app.use((req, res) => {
	throw { err_message: "Route not found!", err_code: 404 };
});

app.use((err, req, res, next) => {
	if (err instanceof SyntaxError) return sendError(res, "JSON parse error!", 400);
	else return sendError(res, err.err_message || err, err.err_code);
});





//listening app on the bindded address and port and initiating the lobby
app.listen(API_PORT, API_BIND_ADDR, () => {
	console.log(`Server running on ${API_BIND_ADDR}:${API_PORT} `);
});


