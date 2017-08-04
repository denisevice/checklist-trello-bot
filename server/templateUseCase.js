/*
 ** Check Bot Power-Up - https://github.com/louisjeck/checklist-trello-bot
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
const Promise = require('bluebird');
const trelloHelper = require('./trelloHelper');
const _ = require('underscore')


module.exports = {
    handleCreateUpdateCard: (trello, webhookAction, templateBoardId, templateListId) => {
        
        handleGlobalBoardAction(trello, webhookAction, templateBoardId, templateListId)
        .then(() => handleSingleCardAction(trello, webhookAction))
    }
}

function handleSingleCardAction(trello, webhookAction) {
    //checks if a card has a link pointing to a board, if so look for template lists
    console.log('single card')

    const data = webhookAction.data
    const card = data.card
    const destBoardName = data.board.name
    return getAttachmentURLs(trello, card)
      .then(urls => getBoardIdFromURLs(urls))
      .then(boardId => trelloHelper.getListIdFromListName(trello, boardId, destBoardName))
      .then(sourceListId => syncChecklistFromBoard(trello, webhookAction, sourceListId))

      .catch(err => console.log(err))

}


function handleGlobalBoardAction(trello, webhookAction, templateBoardId, templateListId) {
    console.log("handle", templateBoardId, templateListId)
    const data = webhookAction.data

    templateBoardId = templateBoardId == '' ? data.board.id : templateBoardId
    const sourceListIdPromise = templateListId == '' ? 
          trelloHelper.getListIdFromListName(trello, templateBoardId, data.board.name) : Promise.resolve(templateListId);
    
    return sourceListIdPromise
      .then(sourceListId => syncChecklistFromBoard(trello, webhookAction, sourceListId))

}


function syncChecklistFromBoard(trello, webhookAction, sourceListId) {
    var data = webhookAction.data
    var destCardId = data.card.id

    if (typeof(data.list) !== 'undefined')
        var destListName = data.list.name

    else if (webhookAction.type == 'updateCard' && typeof(data.listAfter) !== 'undefined')
        var destListName = data.listAfter.name

    else {
        console.error("List name not found")
        return;
    }


    return trelloHelper.getCardIdFromCardName(trello, sourceListId, destListName)

        .then(sourceCardId => {
            return Promise.all([
                trelloHelper.getChecklistsList(trello, sourceCardId),
                trelloHelper.getChecklistsList(trello, destCardId)
            ])
        })

        .spread((sourceChecklistsList, destChecklistsList) => {
            var destChecklistsNames = _.pluck(destChecklistsList, 'name')
            
            sourceChecklistsList.forEach(checklist => {
                if (destChecklistsNames.indexOf(checklist.name) === -1)
                    copyChecklist(trello, checklist.id, data.card.id)
            })
        })
 
        .catch(e => console.log(e))


}


function copyChecklist(trello, idChecklistSource, destCard) {
    console.log("Copying ", idChecklistSource, "to ", destCard)

    return new Promise((resolve, reject) => {
        trello.post("/1/checklists/", 
            {
              idChecklistSource: idChecklistSource,
              idCard: destCard,
              pos: 'top'
            }, 
            err => (err ? reject(err) : resolve())
        );

    })
}


function getBoardIdFromURLs(urls) {
    var re = new RegExp("https://trello.com/b/(.*?)/")

    for (var url of urls) {
        var board = re.exec(url);
        if (board !== null)
            return board[1];
    }
}

function getAttachmentURLs(trello, card) {

    return new Promise((resolve, reject) => {
        trello.get("/1/cards/" + card.id + "/attachments", 
                   {fields: 'url'}, 
                   (err, attachments) => (err) ? reject(err) : resolve(_.pluck(attachments, 'url'))
        );
    })

}
    
