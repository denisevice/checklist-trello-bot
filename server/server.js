/*
 ** Checklist Bot Power-Up - https://github.com/louisjeck/checklist-trello-bot
 ** Adds automation
 **
 ** Credits:
 ** Louis Jeckel <https://github.com/louisjeck>
 ** Christophe Durand <https://github.com/Cmbdurand>
 **
 ** Powered by OCTO Technology, 34 avenue de l'Opéra, 75002 Paris, France
 ** www.octo.com
 **
 */

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

app.all("/webhooks", webhookController.allWebhooks);






// listen for requests 
var listener = app.listen(process.env.PORT, function () {
  console.info(`Node Version: ${process.version}`);
  console.log('Checklist Bot by Octo Power-Up Server listening on port ' + listener.address().port);
});

