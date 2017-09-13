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

    joinCard : (trello, cardId, boardId, member) => {
        data = {trello: trello, cardId: cardId, boardId: boardId, member: member, memberIds: []};
        getMemberId(data)
            .then(data => getOrganizationMemberIds(data))
            .then(data => joinCardMemberIds(data))
    },

    leaveCard : (trello, cardId, boardId, member) => {
        data = {trello: trello, cardId: cardId, boardId: boardId, member: member, memberIds: []};
        getMemberId(data)
            .then(data => getOrganizationMemberIds(data))
            .then(data => leaveCardMemberIds(data))
    },

    joinAttachedBoards : (trello, cardId, boardId, member) => {
        data = {trello: trello, cardId: cardId, boardId: boardId, member: member, memberIds: []};
        getMemberId(data)
            .then(data => getOrganizationMemberIds(data))
            .then(data => getCardAttachments(data))
            .then(data => joinAttachmentsMemberId(data))
            .then(data => joinBoardMemberIds(data))
    },

    leaveAttachedBoards : (trello, cardId, boardId, member) => {
        data = {trello: trello, cardId: cardId, boardId: boardId, member: member, memberIds: []};
        getMemberId(data)
            .then(data => getOrganizationMemberIds(data))
            .then(data => getCardAttachments(data))
            .then(data => joinAttachmentsMemberId(data))
            .then(data => leaveBoardMemberIds(data))
    },

    joinBoard : (trello, cardId, boardId, member) => {
        data = {trello: trello, cardId: cardId, boardId: boardId, member: member, memberIds: []};
        getMemberId(data)
            .then(data => getOrganizationMemberIds(data))
            .then(data => joinBoardMemberIds(data))
    },

    leaveBoard : (trello, cardId, boardId, member) => {
        data = {trello: trello, cardId: cardId, boardId: boardId, member: member, memberIds: []};
        getMemberId(data)
            .then(data => getOrganizationMemberIds(data))
            .then (data => leaveBoardMemberIds(data))
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


} //module exports


function getMemberId(data) {

    console.log("*** getMemberId with member: ", data.member);
    return new Promise((resolve, reject) => {
        data.trello.get("/1/members/" + data.member, {fields: "id,username"}, function (err, res) {
            if (err) {
                // return reject(err.message);
            } else {
                data.memberIds.push({id: res.id, username: res.username});
            }
            resolve(data);
        })
    })
}

function getOrganizationMemberIds(data) {

    console.log("*** getOrganizationMemberIds with member: ", data.member);
    return new Promise((resolve, reject) => {
        data.trello.get("/1/organizations/" + data.member +"/members/", {fields: "id,username"}, function (err, res) {
            if (err) {
                // return reject(err.message);
            } else {
                data.memberIds = data.memberIds.concat(res);
            }
            resolve(data);
        })
    })
}

function joinCardMemberId(data) {

    return new Promise((resolve, reject) => {
        data.trello.post("/1/cards/" + data.cardId + "/members", {value: data.memberId}, function (err, res) {
            if (err) {
                console.log("--- cannot add member to CardId: ", data.cardId, " memberId: ", data.memberId, " >> ", err.message);
                // return reject(err.message);
            } else {
                console.log("*** added member to CardId: ", data.cardId, " memberId: ", data.memberId);
            }
            resolve(data);
        })
    })
}

function joinCardMemberIds(data) {

    console.log("*** joinCardMemberIds with carId: ", data.cardId);
    var params = data.memberIds.map(member => { return {trello: data.trello, cardId: data.cardId, memberId: member.id}});
    return new Promise.all(params.map(joinCardMemberId))
}

function leaveCardMemberId(data) {

    console.log("*** leaveCard with carId: ", data.cardId, " memberId: ", data.memberId);
    return new Promise((resolve, reject) => {
        data.trello.del("/1/cards/"+data.cardId+"/idMembers/"+data.memberId, function(err, res){
            if (err) {
                console.log("--- cannot remove member to CardId: ", data.cardId, " memberId: ", data.memberId, " >> ", err.message);
                // return reject(err.message);
            } else {
                console.log("*** removed member to CardId: ", data.cardId, " memberId: ", data.memberId);
            }
            resolve(data);
        })
    })
}

function leaveCardMemberIds(data) {

    console.log("*** leaveCardMemberIds with carId: ", data.cardId);
    var params = data.memberIds.map(member => { return {trello: data.trello, cardId: data.cardId, memberId: member.id}});
    return new Promise.all(params.map(leaveCardMemberId))
}


function joinAttachmentsMemberId(data) {

    console.log("*** joinAttachmentsMemberId with list ", JSON.stringify(data.list));
    return new Promise((resolve, reject) => {
        var boardId;
        data.list.forEach(attachment => {
            boardId = getBoardIdFromURL(attachment.url);
        })
        console.log('*** resolved boardId: ' + boardId, " memberId: ", data.memberId);
        data.boardId = boardId;
        resolve(data)
    })
}

function joinBoardMemberId(data) {

    console.log("*** adding member to BoardId: ", data.boardId, " memberId: ", data.memberId);

    return new Promise((resolve, reject) => {
        data.trello.put("/1/boards/"+data.boardId+"/members/"+data.memberId, {idMember: data.memberId, type:"normal"}, function(err, res){
            if (err) {
                console.log("--- cannot add member to BoardId: ", data.boardId, " memberId: ", data.memberId, " >> ", err.message);
                // return reject(err.message);
            } else {
                console.log("*** added member to BoardId: ", data.boardId, " memberId: ", data.memberId);
            }
            resolve(data);
        })
    })
}

function joinBoardMemberIds(data) {

    console.log("*** joinBoardMemberIds with boardId: ", data.boardId);
    var params = data.memberIds.map(member => { return {trello: data.trello, boardId: data.boardId, memberId: member.id}});
    return new Promise.all(params.map(joinBoardMemberId))
}


function leaveBoardMemberId(data) {

    console.log("*** leaving member to BoardId: ", data.boardId, " memberId: ", data.memberId);
    return new Promise((resolve, reject) => {
        data.trello.del("/1/boards/"+data.boardId+"/members/"+data.memberId, function(err, res){
            if (err) {
                console.log("--- cannot remove member to BoardId: ", data.boardId, " memberId: ", data.memberId, " >> ", err.message);
                // return reject(err.message);
            } else {
                console.log("*** removed member to BoardId: ", data.boardId, " memberId: ", data.memberId);
            }
            resolve(data);
        })
    })
}

function leaveBoardMemberIds(data) {

    console.log("*** leaveBoardMemberIds with boardId: ", data.boardId);
    var params = data.memberIds.map(member => { return {trello: data.trello, boardId: data.boardId, memberId: member.id}});
    return new Promise.all(params.map(leaveBoardMemberId))
}


function getCardAttachments(data) {

    console.log("*** getCardAttachements with carId: ", data.cardId);
    return new Promise((resolve, reject) => {
        data.trello.get("/1/cards/" + data.cardId + "/attachments", {fields: 'url'}, function (err, list) {
            if (err) return reject(err);
            data.list = list;
            resolve(data)
        })
    })
}


function getBoardIdFromURL(url) {
    var re = new RegExp("https:\/\/trello.com\/b\/(.*?)\/")
    var board = re.exec(url);
    if (board !== null) return board[1];

    var re = new RegExp("https:\/\/trello.com\/b\/(.*?)$")
    var board = re.exec(url);
    if (board !== null) return board[1];}


