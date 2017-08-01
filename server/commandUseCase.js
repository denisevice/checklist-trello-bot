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
    .then(function(boardId){
    return moveCardFromCommand(trello, cardId, boardId, listName, pos);

    })
  
}


function execLabel(trello, webhookData, args){
  const cardId = webhookData.card.id;
  const labelColor = args[0];
  const labelName = args[1];
  return addLabel(trello, cardId, labelColor, labelName);
  
}

function execArchive(trello, webhookData){
  const cardId = webhookData.card.id;
  return archiveCard(trello, cardId, true);

}

function execUnarchive(trello, webhookData){
  const cardId = webhookData.card.id;
  return archiveCard(trello, cardId, false);
}

function execRemoveLabel(trello, webhookData, args){
    const cardId = webhookData.card.id;
    const labelColor = args[0];
    const labelName = args[1];
  
  
    getLabels(trello, cardId).then(function(data){
      const labels = data.labels;
      for (var label of labels){
          if(labelColor === label.color)
            if((labelName !== undefined && labelName == label.name) || labelName === undefined)
              return deleteLabel(trello, cardId, label.id)
      }
  })
}


function archiveCard(trello, cardId, closed){
  var closed = closed === undefined ? true : closed;
  console.log(closed ? "archiving" : "sending back", cardId)
  return new Promise(function(resolve, reject){
      trello.put("/1/cards/"+cardId, {closed : closed}, function(err){
          if(err) return reject(err);
          resolve();
      })

  })  
}

function addLabel(trello, cardId, color, text){
  console.log("add label for", cardId, color, text)
  return new Promise(function(resolve, reject){
      trello.post("/1/cards/"+cardId+'/labels', {color : color, name : text ? text : ""}, function(err){
          if(err) return reject(err);
          resolve();
      })

  })
}

function getLabels(trello, cardId){
  return new Promise(function(resolve, reject){
      trello.get("/1/cards/"+cardId, {fields : 'labels'}, function(err, data){
          if(err) return reject(err);
          resolve(data);
      })

  })
}

function deleteLabel(trello, cardId, labelId){
    return new Promise(function(resolve, reject){
      trello.del("/1/cards/"+cardId+'/idLabels/'+labelId, function(err, data){
          if(err) return reject(err);
          resolve(data);
      })

  })
}