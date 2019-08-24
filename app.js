const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const port = 3000;
const app = express();
const Schema = mongoose.Schema;

mongoose.connect('mongodb+srv://Admin:1234@webfinal-k4s0e.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }).
  catch(error => console.log(error));

var UserSchema = new Schema({
  Username: String,
  Password: String,
  IsManager: Boolean,
  IsActive: Boolean,
  Email: String,
  QuestionAnswerId: Number
}, { collection: 'Users' });

var User = mongoose.model('User', UserSchema);

var QuestionAnswerSchema = new Schema({
Question1: Number,
Question2: Number,
Question3: Number,
AnswerId : Number
}, { collection: 'QuestionAnswers' });

var Question = mongoose.model('Question', QuestionAnswerSchema);



app.set('view engine', 'pug');
app.use(express.static(__dirname + "/public"));

app.listen(port, function(){
    console.log("Express listening on port " + port);
});

app.get('/', function(rec, res){
    res.render("index");
});

app.post('/', function(req, res){
    var user= User({
        Username: req.body,
        Password: String,
        IsManager: Boolean,
        IsActive: Boolean,
        Email: String,
        QuestionAnswerId: Number
      });
  
    res.render("index");
});

app.get('/register', function(rec, res){
    res.render("register");
});