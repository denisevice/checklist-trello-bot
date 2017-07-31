/**
 * Created by lje on 31/07/2017.
 */
// server.js
// where your node app starts

var compression = require('compression');
var cors = require('cors');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var Trello = require('node-trello');
var Promise = require('bluebird')

var _ = require('underscore')
// compress our client side content before sending it over the wire
app.use(compression());

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: 'https://trello.com' }));
app.use( bodyParser.json() );
app.use(express.static('public'));



app.engine('.html', require('ejs').renderFile);
app.get("/auth", function(req, res){

    res.render("auth.html", { webhookModel : req.query.model });
});


var t

app.all("/webhooks", function(req, res) {

    res.setHeader('Content-Type', 'text')
    if(req.body.action === undefined) {
        res.end()
        return
    }

    var type = req.body.action.type


    //console.log(req.body)
    if(type == "updateCheckItemStateOnCard")
        handleItemChecked(req)
    //else console.log('type :', type)
    res.end()



})











