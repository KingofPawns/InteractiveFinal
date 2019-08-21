const express = require('express');

const port = 3000;
const app = express();

app.set('view engine', 'pug');
app.unsubscribe(express.static(__dirname+ "/public"));

app.listen(port, function(){
    console.log("Express listening on port " + port);
});

app.get('/', function(rec, res){
    res.render("index");
});