const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const port = 3000;
const app = express();
const Schema = mongoose.Schema;
const conn = mongoose.connection;


mongoose.connect('mongodb+srv://Admin:1234@webfinal-k4s0e.mongodb.net/WebFinal?retryWrites=true&w=majority', { useNewUrlParser: true }).
    catch(error => console.log(error));

var UserSchema = new Schema({
    Username: String,
    Password: String,
    Age: String,
    IsManager: Boolean,
    IsActive: Boolean,
    Email: String,
    QuestionAnswerId: Number
}, { collection: 'Users' });

var User = mongoose.model('Users', UserSchema);

var QuestionAnswerSchema = new Schema({
    Question1: Number,
    Question2: Number,
    Question3: Number,
    AnswerId: Number
}, { collection: 'QuestionAnswers' });

var Question = mongoose.model('Question', QuestionAnswerSchema);



app.set('view engine', 'pug');
app.use(express.static(__dirname + "/public"));

app.listen(port, function () {
    console.log("Express listening on port " + port);
});

app.get('/', function (rec, res) {
    res.render("index");
});

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());

app.post('/register', function (req, res) {
    console.log(req.body);
    var user = new User({
        Username: req.body.username,
        Password: req.body.password,
        Age: req.body.age,
        IsManager: false,
        IsActive: true,
        Email: req.body.email,
        QuestionAnswerId: 1,
    });
    user.save();
    res.render("index");
});

app.get('/register', function (rec, res) {
    res.render("register");
});