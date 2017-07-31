/**
 * Created by lje on 31/07/2017.
 */
const Promise = require('bluebird');
const trelloHelper = require('./trelloHelper');
const request = require('request');

module.exports = {
    handleItemChecked: function (trello, webhookAction) {

        const checkItem = webhookAction.checkItem;
        const cardId = webhookAction.card.id;
        const webhookData = webhookAction.data;
        if (checkItem.state === 'incomplete')
            return;



        const re = new RegExp(">(.*)\\((.*)\\)");
        const res = re.exec(checkItem.name);
        const fn = res[1].trim();
        const args = res[2];
        console.log('fn', fn, 'args', args);

        switch (fn) {
            case "list":
                execList(trello, webhookData, args);
                break;
            case "link":
                execLink(args);
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


function execList(trello, webhookData, args) {
    console.log("execList", args);
    const checkItem = webhookData.checkItem;
    const cardId = webhookData.card.id;


    if (checkItem.state === 'incomplete')
        return;
    //find a better regexp
    const re1 = new RegExp("\"(.*?)\",\"(.*?)\"");
    const re2 = new RegExp("\"(.*?)\"");

    const res1 = re1.exec(checkItem.name);

    const res2 = re2.exec(checkItem.name);

    if (res1 === null && res2 === null)
        return;

    const listName = res1 ? res1[1].trim() : res2[1].trim();

    return (res1 ? trelloHelper.getBoardIdFromBoardName(trello, res1[2].trim()) : Promise.resolve(webhookData.board.id))
        .then(function (boardId) {
            console.log("found boardId", boardId);
            trelloHelper.getListIdFromListName(trello, boardId, listName)
                .then(function (list) {
                    return trelloHelper.moveCard(trello, cardId, list, boardId)
                })
        })

}
