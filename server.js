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
var Message = require('./message');
var discussions = [];

app.post("/salon",function (req,res) {
    let salon = new Salon({
        title : req.body.title
    });
    salon.save(function (err,salon) {
        if(err){
            console.log(err);
            res.json(err);
        }else{
            if(salon){
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
   let message= new Message({
       "username":req.body.username,
       "salon":req.body.salon,
       "message": req.body.message
   });
    message.save(function (err,message) {
        if(err){
            console.log(err);
            res.json(err);
        }else{
            if(message){
                console.log('message created '+ message);
                //res.json(message);
                res.json("good");
            }else{
                console.log(' impossible de creer le message');
                res.json(err);
            }
        }
    });
});

app.get("/messages/:salon",function (req,res) {
    let salon = req.params.salon;
    Message.find({'salon':salon},function (err,messages) {
        if(err) {
            res.json({'not-found':404});
        } else{
            res.json(messagess);
        }
    });

    /*
    let sms = [];
    for(let i=0 ;i<messages.length;i++){
        if(messages[i].salon==salon){
            sms.push(messages[i]);
        }
    }
    res.json(sms);
    */
});


let port = process.env.PORT || 8080;


server.listen(port, function () {
    console.log('Server running at http://127.0.0.1:'+port);
});