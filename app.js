require("dotenv").config;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Bulletin = require("./util/bulletinboard");


app.set("view engine", "ejs");
app.use(express.static("assets"));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

function renderBoard(res) {
	Bulletin.getAll()
		.then(function(messages) {
			res.render("board",{
			messages: messages
		});
	});
}

app.get("/", function(req, res) {
	renderBoard(res);
});

app.post("/", function(req, res) {
	if (req.body.title === "") {
		res.redirect('/error?message=You%20Need%20Both%20Items%20To%20Post');
		return;
}
	else if (req.body.body === "") {
		res.redirect('/error?message=You%20Need%20Both%20Items%20To%20Post');
		return;
}

	Bulletin.add([req.body.title, req.body.body])
		.then(function() {
			renderBoard(res, "Saved " + req.body.title);
		});
});


app.get("/form", function (req, res) {
	res.render("form", {
		title: req.body.title,
		body: req.body.body,
	});
});

app.get("/error", function(req, res) {
	res.render("error");
});


const port = process.env.PORT || 4000;

app.listen(port, function() {
	console.log("Listening at http://localhost:" + port);
});
