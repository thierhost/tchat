'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);

var _ = require('lodash');
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

var mongoose = require('mongoose');
mongoose.connect('mongodb://aurnws:aurnws@ds157288.mlab.com:57288/aurnws',options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var Salon = require('./salon');
var discussions = [];
var messages = [];

app.post("/salon",function (req,res) {
    let salon = new Salon({
        title : req.body.title
    });
    salon.save(function (err,user) {
        if(err){
            console.log(err);
            res.json(err);
        }else{
            if(user){
                console.log('salon created '+ salon);
                res.json(salon);
            }else{
                console.log(' impossible de creer le salon');
                res.json(err);
            }
        }
    });
});
app.get("/salon",function (req,res) {
    Salon.find(function (err,salons) {
        if(err) {
            res.json({'not-found':404});
        } else{
            res.json(salons);
        }
    });
});

app.post("/subscribe",function (req,res) {
    let discussion = {
        "username":req.body.username,
        "salon":req.body.salon
    };
    discussions.push(discussion);
    res.json("good");
});

app.post("/messages",function (req,res) {
   let message= {
       "username":req.body.username,
       "salon":req.body.salon,
       "message": req.body.message
   };
   messages.push(message);
   res.json("good");
});

app.get("/messages/:salon",function (req,res) {
    let salon = req.params.salon;
    let sms = [];
    for(let i=0 ;i<messages.length;i++){
        if(messages[i].salon==salon){
            sms.push(messages[i]);
        }
    }
    res.json(sms);
});


let port = process.env.PORT || 8080;


server.listen(port, function () {
    console.log('Server running at http://127.0.0.1:'+port);
});