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

app.use(session({ secret: "none", resave: false, saveUninitialized: true }));

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
    question1: String,
    question2: String,
    question3: String,
    AnswerId: Number
}, { collection: 'QuestionAnswers' });

var Question = mongoose.model('Questions', QuestionAnswerSchema);



app.set('view engine', 'pug');
app.use(express.static(__dirname + "/public"));

app.listen(port, function () {
    console.log("Express listening on port " + port);
});

app.get('/', function (req, res) {
    var mycount = null;
    User.find().count(function (err, count) { mycount = count });
    console.log(mycount);
    renderIndex(req, res);
});

async function renderIndex(req, res) {
    try {
        var q = Question.find().exec(function (error, questions) {
            //console.log(questions);
            var Question1 = [0, 0, 0, 0];
            var Question2 = [0, 0, 0, 0];
            var Question3 = [0, 0, 0, 0];
            for (var i = 0; i < questions.length; i++) {
                if (questions[i].question1 == "red") {
                    Question1[0]++;
                } else if (questions[i].question1 == "green") {
                    Question1[1]++;
                } else if (questions[i].question1 == "blue") {
                    Question1[2]++;
                } else {
                    Question1[3]++;
                }

                if (questions[i].question2 == "fighter") {
                    Question2[0]++;
                } else if (questions[i].question2 == "wizard") {
                    Question2[1]++;
                } else if (questions[i].question2 == "cleric") {
                    Question2[2]++;
                } else {
                    Question2[3]++;
                }

                if (questions[i].question3 == "one") {
                    Question3[0]++;
                } else if (questions[i].question3 == "two") {
                    Question3[1]++;
                } else if (questions[i].question3 == "three") {
                    Question3[2]++;
                } else {
                    Question3[3]++;
                }
            }
            var QuestionTotal = Question1[0] + Question1[1] + Question1[2] + Question1[3];
            var model = {

                QuestionTotal: QuestionTotal,

                red: ((Question1[0] * 1.00) / QuestionTotal) * 100,
                green: ((Question1[1] * 1.00) / QuestionTotal) * 100,
                blue: ((Question1[2] * 1.00) / QuestionTotal) * 100,
                yellow: ((Question1[3] * 1.00) / QuestionTotal) * 100,

                fighter: ((Question2[0] * 1.00) / QuestionTotal) * 100,
                wizard: ((Question2[1] * 1.00) / QuestionTotal) * 100,
                cleric: ((Question2[2] * 1.00) / QuestionTotal) * 100,
                rogue: ((Question2[3] * 1.00) / QuestionTotal) * 100,

                one: ((Question3[0] * 1.00) / QuestionTotal) * 100,
                two: ((Question3[1] * 1.00) / QuestionTotal) * 100,
                three: ((Question3[2] * 1.00) / QuestionTotal) * 100,
                four: ((Question3[3] * 1.00) / QuestionTotal) * 100,
            }
            //console.log(model.yellow);
            req.session.model = model;
            res.render("index", { session: req.session });
        });
    } catch (err) {
        console.log(err);
    }
}

app.get('/register', function (req, res) {
    const model = {
        postRoute: "/register",
        methodType: "POST",
        header: "Sign Up!",
        user: {},
        answers: {
            Question1: {
                red: "active",
            },
            Question2: {
                fighter: "active"
            },
            Question3: {
                one: "active"
            },
        },
        session: req.session
    }
    res.render("register", model);
});

app.post('/register', function (req, res) {
    //console.log(req.body);
    User.find().count(function (err, UserCount) {
        // console.log("UserCount")
        // console.log(UserCount);
        if (typeof UserCount !== 'number') {
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
            QuestionAnswerId: UserCount + 1
        });
        Question.find().count(function (err, QuestionCount) {
            if (typeof QuestionCount !== 'number') {
                QuestionCount = 0;
            }
            var question = new Question({
                question1: req.body.colors,
                question2: req.body.archetypes,
                question3: req.body.number,
                AnswerId: QuestionCount + 1
            });
            question.save();
            user.save();
            renderIndex(req, res);
        });
    });

    //res.render("index", { session: req.session });
});

app.get('/login', function (req, res) {
    console.log("login");
    res.render("login", { session: req.session });
});

app.get('/logout', function (req, res) {
    console.log("hello");
    req.session.destroy(function (req, res) { });
    res.render("logout", { session: req.session });
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var login = User.findOne({ Username: username }).exec(function (error, user) {
        // console.log(password);
        // console.log(user.Password);
        // console.log(bcrypt.compareSync(password,user.Password));
        // console.log(user);
        if (!user) {
            console.log("1");
            var noUserError = new Error("No user found with username: " + username);
            noUserError.status = 401;
            res.render("login", { session: req.session });
        }
        else if (!bcrypt.compareSync(password, user.Password)) {
            console.log("2");
            var passwordError = new Error("Incorrect password");
            passwordError = 401;
            res.render("login", { session: req.session });

        }
        else {
            console.log("3");
            req.session.user = user;
            req.session.user.Password = password;
            //res.render("index", { session: req.session });
            renderIndex(req, res);
        }
    });

    // if ((typeof login) === Error) {
    //     console.log(login);
    // }
    // else {
    //     console.log(login);
    // }

});

app.get('/user', function (req, res) {
    var q = Question.findOne({ AnswerId: req.session.user.QuestionAnswerId }).exec(function (error, questions) {
        const model = {
            postRoute: "/user",
            methodType: "POST",
            header: "My Account",
            user: req.session.user,
            answers: {
                Question1: {},
                Question2: {},
                Question3: {}
            },
            session: req.session
        }
        model.answers.Question1[questions.question1] = "active";
        model.answers.Question2[questions.question2] = "active";
        model.answers.Question3[questions.question3] = "active";
        //console.log(model.answers);
        res.render("register", model);
    })
});

app.post('/user', function (req, res) {
    User.findOne({Username: req.session.user.Username}).exec(function (error, user) {
        user.Username = req.body.username;
        user.Password = bcrypt.hashSync(req.body.password);
        user.Age = req.body.age;
        user.Email = req.body.email;
        User.findOneAndUpdate({Username: req.session.user.Username}, user, function (error, doc){

        });
        req.session.user = user;

        Question.findOne({ AnswerId: req.session.user.QuestionAnswerId }).exec(function (error, questions) {
            questions.question1 = req.body.colors;
            questions.question2 = req.body.archetypes;
            questions.question3 = req.body.number;

            Question.findOneAndUpdate({ AnswerId: req.session.user.QuestionAnswerId }, questions, function (error, doc){

            });

            renderIndex(req, res);
        })
    })  
});

app.get('/admin', function (req, res) {
    
    UserList(res, req);
})

app.get('/suspend/:username', function (req, res) {


    UserList(res);
})

app.get('/activate/:username', function (req, res) {


    UserList(res);
})

function UserList(res, req) {
    var users = User.find().exec(function (err, results) {
        var model = {
            users: results,
            session: req.session
        }
        res.render("admin", model);
    });
}

// for parsing application/json
app.use(bodyParser.json());


