const express = require('express'),
	fs = require('fs'),
	http = require('http'),
	favicon = require('serve-favicon');

const port = 80;
const nlchar = process.platform == "win32" ? '\r\n' : '\n';

var app = express(port);
var appArgs = process.argv;
app.set('view engine', 'jade');
app.set('views', __dirname + "/public/jade");
app.use("/public", express.static(__dirname + "/public"));
app.use(favicon(__dirname + '/public/icons/favicon.ico'));
app.listen(port, function(){
	console.log("Server started at port " + port);
});


app.route('/').get(function(req, res){
	res.render("main", {"sliderImages": getSliderImages(), "night": isNight()});
	res.end();
});


function isNight()
{
	if(appArgs[2] && (appArgs[2].trim() === "true" || appArgs[2].trim() === "1"))
		return true;

	else if(appArgs[2] && (appArgs[2].trim() === "false" || appArgs[2].trim() === "0"))
		return false;

	else
		{
	
			if(((new Date).getHours() + 3) >= 19 || ((new Date).getHours() + 3) <= 7)
				return true;
	
			else
				return false;
		}
}

function getSliderImages()
{
	var out = [];
	var i = 0;

	fs.readdirSync("public/pictures/slider").forEach(function(file){
		if(file != ".DS_Store")
			{
				out.push({number: i, name: "/public/pictures/slider/" + file});
				i++;
			}
	});

	return out;
}