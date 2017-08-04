/**
 * Created by lje on 04/08/2017.
 */

const trelloHelper = require('../trelloHelper');


module.exports = {
    checked: (trello, webhookData) => {
        const cardId = webhookData.card.id;

        return trelloHelper.archiveCard(trello, cardId, true);
    },

    unchecked: (trello, webhookData) => {
        const cardId = webhookData.card.id;

        return trelloHelper.archiveCard(trello, cardId, false);
    }


};