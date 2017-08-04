/**
 * Created by lje on 03/08/2017.
 */
const trelloHelper = require('../trelloHelper');

module.exports = {
    checked :(trello, webhookData, args) => {
        console.log("check", args[0]);
        const checkItem = webhookData.checkItem;
        const cardId = webhookData.card.id;

        if (checkItem.state === 'incomplete')
            return;

        const listName = args[0].trim();
        const pos = args[1];

        console.log('args ', args)
        return trelloHelper.moveCardFromCommand(trello, cardId, webhookData.board.id, listName, pos);


    }
}




