'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);

var _ = require('lodash');
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

var mongoose = require('mongoose');
mongoose.connect('mongodb://aurnws:aurnws@ds157288.mlab.com:57288/aurnws',options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var Salon = require('./salon');
var discussions = [];

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

io.on('connection', function (socket) {
    socket.on("subscribe",function (user) {
        user.socket = socket.id;
        discussions.push(user);
        socket.emit('good', {code: 200});
    });
});


let port = process.env.PORT || 8080;


server.listen(port, function () {
    console.log('Server running at http://127.0.0.1:'+port);
});