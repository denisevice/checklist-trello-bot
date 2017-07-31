/**
 * Created by lje on 31/07/2017.
 */
const Promise = require('bluebird');
const trelloHelper = require('./trelloHelper');
const _ = require('underscore')


module.exports = {

    handleCreateUpdateCard: function (trello, webhookAction, templateBoardId, templateListId) {
        
        handleGlobalBoardAction(trello, webhookAction, templateBoardId, templateListId)
            .then(function () {
                handleSingleCardAction(trello, webhookAction)
            })
    }
}

function handleSingleCardAction(trello, webhookAction) {
    //checks if a card has a link pointing to a board, if so look for template lists
    console.log('single card')

    const data = webhookAction.data
    const card = data.card
    const destBoardName = data.board.name
    return getAttachmentURLs(trello, card)
        .then(function (urls) {
            return getBoardIdFromURLs(urls)

        }).then(function (boardId) {
        
            return trelloHelper.getListIdFromListName(trello, boardId, destBoardName)

        }).then(function (sourceListId) {
            return syncChecklistFromBoard(trello, webhookAction, sourceListId)

        })
        .catch(function (err) {
            console.log(err)
        })

}


function handleGlobalBoardAction(trello, webhookAction, templateBoardId, templateListName) {

    const data = webhookAction.data


    const destCardId = data.card.id
    const sourceListName = templateListName == '' ? data.board.name : templateListName
    templateBoardId = templateBoardId == '' ? data.board.id : templateBoardId
    
    return trelloHelper.getListIdFromListName(trello, templateBoardId, sourceListName)

        .then(function (sourceListId) {
            return syncChecklistFromBoard(trello, webhookAction, sourceListId)

        })

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

        .then(function (sourceCardId) {
            return Promise.all([
                trelloHelper.getChecklistsList(trello, sourceCardId),
                trelloHelper.getChecklistsList(trello, destCardId)
            ])
        })

        .spread(function (sourceChecklistsList, destChecklistsList) {
            var destChecklistsNames = _.pluck(destChecklistsList, 'name')
            sourceChecklistsList.forEach(function (checklist) {
                if (destChecklistsNames.indexOf(checklist.name) === -1)
                    copyChecklist(trello, checklist.id, data.card.id)
            })

        })

        .catch(function (e) {
            console.log(e)
        })


}


function copyChecklist(trello, idChecklistSource, destCard) {
    console.log("Copying ", idChecklistSource, "to ", destCard)

    return new Promise(function (resolve, reject) {
        trello.post("/1/checklists/", {
            idChecklistSource: idChecklistSource,
            idCard: destCard,
            pos: 'top'
        }, function (err) {
            if (err) return reject(err)
            resolve();
        })

    })
}


function getBoardIdFromURLs(urls) {
    var re = new RegExp("https://trello.com/b/(.*?)/")

    for (var url of urls) {
        var board = re.exec(url)
        if (board !== null)
            return board[1]
    }
}

function getAttachmentURLs(trello, card) {

    return new Promise(function (resolve, reject) {
        trello.get("/1/cards/" + card.id + "/attachments", {fields: 'url'}, function (err, attachments) {
            if (err) return reject(err)
            resolve(_.pluck(attachments, 'url'))
        })
    })

}
    
