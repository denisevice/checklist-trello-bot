// server.js
// where your node app starts

var compression = require('compression');
var cors = require('cors');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var webhookController = require('./webhookController');

// compress our client side content before sending it over the wire
app.use(compression());

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: 'https://trello.com' }));
app.use( bodyParser.json() );
app.use(express.static('public'));



app.engine('.html', require('ejs').renderFile);
app.get("/auth", function(req, res){
    
    res.render("auth.html", { templateBoardId: req.query.template_board_id, templateListName: req.query.template_list_name, webhookModel : req.query.model });
});

app.all("/webhooks", webhookController.allWebhooks);



// listen for requests 
var listener = app.listen(process.env.PORT, function () {
  console.info(`Node Version: ${process.version}`);
  console.log('Checklist Bot by Octo Power-Up Server listening on port ' + listener.address().port);
});



