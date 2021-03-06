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
 * Created by lje on 31/07/2017.
 */
const Trello = require('node-trello');
const Promise = require('bluebird');
const templateUseCase = require('./templateUseCase');
const commandUseCase = require('./commandUseCase');
const trelloHelper = require('./trelloHelper');

module.exports = {
    
     allWebhooks : (req, res) => {

         res.setHeader('Content-Type', 'text')
         if (req.body.action === undefined) { //first Trello webhook call
             res.end();
             return;
         }
       
         if (checkDisableWebhook(req, res))
             return;
       
       
         var type = req.body.action.display.translationKey;
         //console.log(req.body.action)
        
         if(req.query.token === undefined) return;
         const trello = new Trello(process.env.APIKEY, req.query.token);
       
         const webhookAction = req.body.action;

         if (type === "action_move_card_from_list_to_list" || type === "action_create_card" || type === "action_add_attachment_to_card") {
             console.log('-------------------------')
             console.log('type handle : ', type)
             templateUseCase.handleCreateUpdateCard(trello, webhookAction, req.query.templateBoardId, req.query.templateListId)
         }
         else if (type === "action_completed_checkitem" || type === "action_marked_checkitem_incomplete"){
             console.log('-------------------------');
             console.log('type handle : ', type);
             commandUseCase.handleItemChecked(trello, webhookAction);

         }

         //else if action_marked_checkitem_incomplete
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
    if (action.type === "disablePlugin" && action.data.plugin.url === "https://" + req.headers.host + "/manifest.json")
        return deleteWebhook(res)
    return false

}

