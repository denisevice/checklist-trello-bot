/**
 * Created by lje on 04/08/2017.
 */

const trelloHelper = require('../trelloHelper');

module.exports = {

    checked: (trello, webhookData, args) => {
        console.log("execBoard", args);
        const checkItem = webhookData.checkItem;
        const cardId = webhookData.card.id;

        if (checkItem.state === 'incomplete')
            return;

        const listName = args[1];
        const boardName = args[0];
        const pos = args[2];


        return trelloHelper.getBoardIdFromBoardName(trello, boardName)
            .then(boardId => trelloHelper.moveCardFromCommand(trello, cardId, boardId, listName, pos));


    }

}
