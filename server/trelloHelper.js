/**
 * Created by lje on 31/07/2017.
 */
var Promise = require('bluebird')


module.exports = {
    getListIdFromListName: (trello, boardId, listName) => {
        return new Promise((resolve, reject) => {
            if (boardId === undefined) return reject('boardId not found')
            var listId;

            trello.get("/1/boards/" + boardId + "/lists/", function (err, lists) {
                if (err) return reject(err)

                lists.forEach(list => {
                  if (list.name == listName)
                    listId = list.id        
                })
                console.log('resolve getListId')
                resolve(listId)
            })

        })
    },


    getCardIdFromCardName: (trello, listId, cardName) => {
        return new Promise((resolve, reject) => {
            if (listId === undefined) return reject('list not found')
            var cardId;

            trello.get("/1/lists/" + listId + "/cards/", function (err, cards) {
                cards.forEach(card => {
                    if (card.name == cardName)
                        cardId = card.id
                })
                if (cardId === undefined)
                    return reject("card " + cardName + " not found in list " + listId)
                resolve(cardId)
            })
        })
    },


    getChecklistsList: (trello, cardId) => {
        return new Promise((resolve, reject) => {
            trello.get("/1/cards/" + cardId + "/checklists", function (err, checklists) {
                if (err)
                    return reject(err)
                resolve(checklists)

            })

        })
    },


    getBoardIdFromBoardName : (trello, boardName) => {
        console.log("Getting board id", boardName)

        return new Promise((resolve, reject) => {
            trello.get("/1/search", {query : boardName, modelTypes : 'boards', board_fields : 'id'}, function(err, data){
                if(err) return reject(err);
                if(data.boards[0] === undefined) return reject('not found');
              
                resolve(data.boards[0].id)
            })

        })
    },

  moveCard : (trello, idCardSource, idListDest, idBoardDest, pos) => {
    console.log("Moving ", idCardSource, "to list ", idListDest, " board ", idBoardDest)
      
    pos = pos ? pos : "bottom";
    return new Promise((resolve, reject) => {
        if(idCardSource === undefined || idListDest === undefined || idBoardDest === undefined) 
          return reject('not found');
      
        trello.put("/1/cards/"+idCardSource, { idList : idListDest, idBoard : idBoardDest, pos : pos }, function(err){
            if(err) return reject(err);
            resolve()
        })

    })
  },
  
  
  archiveCard : (trello, cardId, closed) => {
    var closed = closed === undefined ? true : closed;
    console.log(closed ? "archiving" : "sending back", cardId)

    return new Promise((resolve, reject) => {
        trello.put("/1/cards/"+cardId, {closed : closed}, function(err){
            if(err) return reject(err);
            resolve();
        })

    })  
  },

 addLabel : (trello, cardId, color, text) => {
  console.log("add label for", cardId, color, text)
  
  return new Promise((resolve, reject) => {
      trello.post("/1/cards/"+cardId+'/labels', {color : color, name : text ? text : ""}, function(err){
          if(err) return reject(err);
          resolve();
      })

  })
},

getLabels : (trello, cardId) => {
  return new Promise((resolve, reject) => {
      trello.get("/1/cards/"+cardId, {fields : 'labels'}, function(err, data){
          if(err) return reject(err);
          resolve(data);
      })
  })
}, 

deleteLabel : (trello, cardId, labelId) => {
    return new Promise((resolve, reject) => {
      trello.del("/1/cards/"+cardId+'/idLabels/'+labelId, function(err, data){
          if(err) return reject(err);
          resolve(data);
      })
  })
},
  
  
saveWebhook : (trello, model, url) => {
  
  return getMyWebhooks (trello, model, url.substr(0, url.indexOf('/', 8)))
  .then(webhooks => {
    var p = [];
    webhooks.forEach(webhook => p.push(deleteWebhook(trello, webhook)));
    return Promise.all(p)
    
  })
  .then(() => {
    createWebhook(trello, model, url);
    
  })
  
},
  
getBoardsList : (trello) => {
  return new Promise((resolve, reject) => {
    trello.get("/1/members/me/boards", {fields : 'name, id'}, (err, boards) => {
        console.log("list boards", err, boards);
        return (err) ? reject(err) : resolve(boards);
    })
  });
  
},
  
getListsFromBoard : (trello, boardId) => {
  return new Promise((resolve, reject) => {
    trello.get("/1/boards/"+boardId+"/lists/", {fields : 'name, id'}, (err, lists) => {
        console.log("list lists", err, lists);
        return (err) ? reject(err) : resolve(lists);
    })
  }); 
  
}

} //module exports



function createWebhook(trello, model, url){
    trello.post("/1/webhooks", {
      'idModel': model, 
      'description' : "Checkbox Template", 
      'callbackURL' : url  
    }, (err) => (err ? err : "webhook created"));
}

function deleteWebhook(trello, webhook){
    console.log("deleting webhook", webhook.id)
    return new Promise((resolve) => {
      trello.del("/1/webhooks/"+webhook.id, () => resolve())
    })
}

function getMyWebhooks (trello, model, url) {
    return new Promise(function(resolve){
      trello.get("/1/tokens/"+trello.token+"/webhooks", (err, webhooks) => {
        webhooks = webhooks.filter(webhook => {
          return (webhook.idModel == model && webhook.callbackURL.substr(0, url.length) == url)
        })
                
        resolve(webhooks)
      })
    })
}