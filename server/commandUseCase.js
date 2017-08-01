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
        


        const checkItemName = checkItem.name;
        const begin = checkItemName.indexOf('->')+2;
        const argBegin = checkItemName.indexOf('(', begin);
        const argEnd = checkItemName.lastIndexOf(')');
        var args = checkItemName.substr(argBegin+1, argEnd-argBegin-1).split(',');
        args = args.map(e => e.trim());
        
        const func = checkItemName.substr(begin, argBegin-begin).trim();
      
        console.log('fn', func, 'args', args);
      
        if (checkItem.state === 'incomplete'){
            switch (func) {
              case "list":
                  //execList(trello, webhookData, args);
                  break;
              case "link":
                  //execLink(args);
                  break;
              case "board":
                  //execBoard(trello, webhookData, args);
                break;
              case "label":
                  execRemoveLabel(trello, webhookData, args);
                break;
              case "archive":
                  execUnarchive(trello, webhookData);
          }
        }
      
        else{

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
              case "label":
                  execLabel(trello, webhookData, args);
                break;
              case "archive":
                  execArchive(trello, webhookData);


          }
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


function moveCardFromCommand(trello, cardId, boardId, listName, pos){
  
    console.log("found boardId", boardId);
    trelloHelper.getListIdFromListName(trello, boardId, listName)
    .then(function (list) {
            return trelloHelper.moveCard(trello, cardId, list, boardId, pos)
    }).catch(e => console.log(e))
}



function execList(trello, webhookData, args) {
    console.log("execList", args[0]);
    const checkItem = webhookData.checkItem;
    const cardId = webhookData.card.id;

    if (checkItem.state === 'incomplete')
        return;
    
    const listName = args[0].trim();
    const pos = args[1];

  console.log('args ', args)
    return moveCardFromCommand(trello, cardId, webhookData.board.id, listName, pos);


}

function execBoard(trello, webhookData, args) {
    console.log("execBoard", args);
    const checkItem = webhookData.checkItem;
    const cardId = webhookData.card.id;

    if (checkItem.state === 'incomplete')
        return;
    
    const listName = args[1];
    const boardName = args[0];
    const pos = args[2];

  
    return trelloHelper.getBoardIdFromBoardName(trello, boardName)
      .then(boardId => moveCardFromCommand(trello, cardId, boardId, listName, pos));

  
}


function execLabel(trello, webhookData, args){
  const cardId = webhookData.card.id;
  const labelColor = args[0];
  const labelName = args[1];
  
  return trelloHelper.addLabel(trello, cardId, labelColor, labelName);
  
}

function execArchive(trello, webhookData){
  const cardId = webhookData.card.id;
  
  return trelloHelper.archiveCard(trello, cardId, true);
}

function execUnarchive(trello, webhookData){
  const cardId = webhookData.card.id;
  
  return trelloHelper.archiveCard(trello, cardId, false);
}

function execRemoveLabel(trello, webhookData, args){
    const cardId = webhookData.card.id;
    const labelColor = args[0];
    const labelName = args[1];
  
  
    trelloHelper.getLabels(trello, cardId).then(function(data){
      const labels = data.labels;
      for (var label of labels){
          if(labelColor === label.color)
            if((labelName !== undefined && labelName == label.name) || labelName === undefined)
              return trelloHelper.deleteLabel(trello, cardId, label.id)
      }
    })
}


