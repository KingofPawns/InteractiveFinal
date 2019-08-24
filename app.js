const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const port = 3000;
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + "/public"));

app.listen(port, function(){
    console.log("Express listening on port " + port);
});

app.get('/', function(rec, res){
    res.render("index");
});

app.get('/register', function(req, res){
    res.render("register");
});

app.get('/login', function(req, res){
    res.render("login");
})

app.post('/login', function(req, res){
    res.render("index");
})