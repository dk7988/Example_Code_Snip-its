
var http = require('http');
var url = require('url');
var express = require('express');
var app = express();
var fs = require("fs");
const { time } = require('console');


const DomSun_PP = require('./DomSun_PP_db_conr.js');
const DomSun_bill_scrp = require('./DomSun_scrap_bill_data.js');
const DomSun_PP_bot = new DomSun_PP();
const DomSun_bill_scrpr_bot = new DomSun_bill_scrp();


//code_updated_on="1/1/23" //initial built - get data from PP
code_updated_on="6/17/23" //added fun.s to scrape bill/vote data from clerk.house.gov

 try {
	//DomSun_PP_bot.get_data_from_PP();
	DomSun_bill_scrpr_bot.get_bill_data();
 } catch (error) {
	 console.log(error);
 }
 
var server = app.listen(8082, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("code last updated on \n"+code_updated_on)
	console.log("Example app listening at http://%s:%s", host, port)
	
})
