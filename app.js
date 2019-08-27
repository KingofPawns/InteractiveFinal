const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const port = 3000;
const app = express();
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const conn = mongoose.connection;
var session = require('express-session');

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(upload.array());

app.use(session({secret: "none", resave: false, saveUninitialized: true}));

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

app.get('/', function (req, res) {
    res.render("index",{session:req.session});
});

app.get('/register', function (req, res) {
    const model = {
        postRoute: "/register",
        header: "Sign Up!",
        user: {},
        answers: {
            question1: {
                red: "active",
            },
            question2: {
                fighter: "active"
            },
            question3: {
                one: "active"
            },
        },
        session:req.session
    }
    res.render("register", model);
});

app.post('/register', function (req, res) {
    console.log(req.body);
    var UserCount = User.find().count();
    if (UserCount != 'number') {
        UserCount = 0;
    }
    var hash = bcrypt.hashSync(req.body.password);
    var user = new User({
        Username: req.body.username,
        Password: hash,
        Age: req.body.age,
        IsManager: false,
        IsActive: true,
        Email: req.body.email,
        QuestionAnswerId: UserCount + 1,
    });
    user.save();
    res.render("index",{session:req.session});
});

app.get('/login', function (req, res) {
    res.render("login",{session:req.session});
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var login = User.findOne({ Username: username }).exec(function (error, user) {
        console.log(password);
        console.log(user.Password);
        console.log(bcrypt.compareSync(password,user.Password));
        console.log(user);
        if (!user) {
            console.log("1");
            var noUserError = new Error("No user found with username: " + username);
            noUserError.status = 401;
            res.render("/login",{session:req.session});
        }
        else if (!bcrypt.compareSync(password,user.Password)) {
            console.log("2");
            var passwordError = new Error("Incorrect password");
            passwordError = 401;
            res.render("/login",{session:req.session});
            
        }
        else {
            console.log("3");
            req.session.user = user;
            res.render("index",{session:req.session});
        }
    });

    if ((typeof login) === Error) {
        console.log(login);
    }
    else {
        console.log(login);
    }
    
});

app.get('/user', function (req, res) {
    //Get User info
});

app.put('/user', function (req, res) {

});



