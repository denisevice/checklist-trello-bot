/**
 * Created by lje on 31/07/2017.
 */
const Promise = require('bluebird');
const trelloHelper = require('./trelloHelper');
const request = require('request');

module.exports = {
    handleItemChecked: function (trello, webhookAction) {
        const webhookData = webhookAction.data;
        const checkItem = webhookData.checkItem;
        const cardId = webhookData.card.id;
        
        if (checkItem.state === 'incomplete')
            return;


        const checkItemName = checkItem.name;
        const begin = checkItemName.indexOf('->')+2;
        const argBegin = checkItemName.indexOf('(', begin);
        const argEnd = checkItemName.lastIndexOf(')');
        const args = checkItemName.substr(argBegin+1, argEnd-argBegin-1).trim().split(',');
        const func = checkItemName.substr(begin, argBegin-begin).trim();
      
        console.log('fn', func, 'args', args);

        switch (func) {
            case "list":
                execList(trello, webhookData, args);
                break;
            case "link":
                execLink(args);
                break;
            case "board":
                execBoard(trello, webhookData, args);
              break;
              

        }


    }
}

function execLink(url) {
    const re = new RegExp('\"(.*)\"');
    url = re.exec(url)[1];
    console.log('execLink', url);
    request(url, function (error, response, body) {
        console.log(error ? error : "no error, read ", Object.keys(body).length, "bytes");
    });
}


function moveCardFromCommand(trello, cardId, boardId, listName){
  
    console.log("found boardId", boardId);
    trelloHelper.getListIdFromListName(trello, boardId, listName)
        .then(function (list) {
            return trelloHelper.moveCard(trello, cardId, list, boardId)
    })

  
}

function execList(trello, webhookData, args) {
    console.log("execList", args[0]);
    const checkItem = webhookData.checkItem;
    const cardId = webhookData.card.id;

    if (checkItem.state === 'incomplete')
        return;
    
    const listName = args[0].trim();
  console.log('args ', args)
    return moveCardFromCommand(trello, cardId, webhookData.board.id, listName);


}

function execBoard(trello, webhookData, args) {
    console.log("execBoard", args);
    const checkItem = webhookData.checkItem;
    const cardId = webhookData.card.id;

    if (checkItem.state === 'incomplete')
        return;
    
    const listName = args[1].trim();
    const boardName = args[0].trim();

  
    return trelloHelper.getBoardIdFromBoardName(trello, boardName)
    .then(function(boardId){
    return moveCardFromCommand(trello, cardId, boardId, listName);

    })
  
}