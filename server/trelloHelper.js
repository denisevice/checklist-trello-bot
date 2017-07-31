/**
 * Created by lje on 31/07/2017.
 */
var Promise = require('bluebird')


module.exports = {
    getListIdFromListName: function (trello, boardId, listName) {
        return new Promise(function (resolve, reject) {
            if (boardId === undefined) return reject('boardId not found')
            var listId;

            trello.get("/1/boards/" + boardId + "/lists/", function (err, lists) {
                if (err) return reject(err)

                lists.forEach(function (list) {
                    if (list.name == listName)
                        listId = list.id
                    
                })
                console.log('resolve getListId')
                resolve(listId)
            })

        })
    },


    getCardIdFromCardName: function (trello, listId, cardName) {
        return new Promise(function (resolve, reject) {
            if (listId === undefined) return reject('list not found')
            var cardId;

            trello.get("/1/lists/" + listId + "/cards/", function (err, cards) {
                cards.forEach(function (card) {
                    if (card.name == cardName)
                        cardId = card.id
                })
                if (cardId === undefined)
                    return reject("card " + cardName + " not found in list " + listId)
                resolve(cardId)
            })
        })
    },


    getChecklistsList: function (trello, cardId) {
        return new Promise(function (resolve, reject) {
            trello.get("/1/cards/" + cardId + "/checklists", function (err, checklists) {
                if (err)
                    return reject(err)
                resolve(checklists)

            })

        })
    }

}