
var http = require('http');
var url = require('url');
var express = require('express');
var app = express();
var fs = require("fs");
const { time } = require('console');
const MinerSitr = require('./botsitrewelink_plug.js');
const miner_sitr = new MinerSitr('dk7988@live.com','niss@nR34');
code_updated_on="4/25/22"

// var db = require('./db');
// db.test_db();

	



 try {
	miner_sitr.watch_plugs();
 } catch (error) {
	 console.log(error);
	(async() =>{
		await miner_sitr.watch_plugs();
	 })(); 
 }
 
 




// app.get('/path:id', function (req, res) {
// 		var txt = req.url.split("/")[1];
// 		console.log("i see request");
// 		if (!txt == ""){
// 			_Ppath(txt, function (data){
// 				if (data == null){
// 				console.log("nothing was returned from _Ppath");
// 				res.end("hello world");
// 					} else {
// 						res.end(JSON.stringify(data));
// 					}
// 			});
// 		}
// 	})
// var _Ppath = function (choice, cb){
// 	// db.PickPath(choice, function(data){cb(data)});
// 	cb(null)
// }


// app.get('/get_ewelink_plug_names', async function (req, res) {
// 	var rtn_ar = await get_plug_data()
// 	res.end(JSON.stringify(rtn_ar));
// })

app.get('/get_ewelink_plug_names', async function (req, res) {
	var rtn_ar = await miner_sitr.get_plug_data();
	res.end(JSON.stringify(rtn_ar));
})




var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("code laste updated on \n"+code_updated_on)
	console.log("Example app listening at http://%s:%s", host, port)
	
})