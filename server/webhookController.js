/**
 * Created by lje on 31/07/2017.
 */
const Trello = require('node-trello');
const Promise = require('bluebird');
const templateUseCase = require('./templateUseCase');

module.exports = {
    
     allWebhooks : function(req, res){


         res.setHeader('Content-Type', 'text')
         if (req.body.action === undefined) {
             res.end()
             return
         }
         if (checkDisableWebhook(req, res))
             return;
         var type = req.body.action.display.translationKey;
         //console.log(req.body.action)
         
         const trello = new Trello('910aeb0b23c2e63299f8fb460f9bda36', req.query.token);
         const webhookAction = req.body.action;

         if (type == "action_move_card_from_list_to_list" || type == "action_create_card" || type == "action_add_attachment_to_card") {
             console.log('-------------------------')
             console.log('type handle : ', type)
             templateUseCase.handleCreateUpdateCard(trello, webhookAction, req.query.templateBoardId, req.query.templateListName)

         }
         res.end()


    }

}


function deleteWebhook(res) {
    console.log('Refused webhook')
    res.status(410);
    res.end();
    return true;
}

function checkDisableWebhook(req, res) {
    var action = req.body.action;
    if (action.type == "disablePlugin" && action.data.plugin.url == "https://" + req.headers.host + "/manifest.json")
        return deleteWebhook(res)
    return false

}

