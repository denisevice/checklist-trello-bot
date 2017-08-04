/**
 * Created by lje on 03/08/2017.
 */
const trelloHelper = require('../trelloHelper');


module.exports = {

    checked: (trello, webhookData, args) => {
        const cardId = webhookData.card.id;
        const labelColor = args[0];
        const labelName = args[1];

        return trelloHelper.addLabel(trello, cardId, labelColor, labelName);

    },


    unchecked: (trello, webhookData, args) => {
        const cardId = webhookData.card.id;
        const labelColor = args[0];
        const labelName = args[1];


        trelloHelper.getLabels(trello, cardId).then(function (data) {
            const labels = data.labels;
            for (var label of labels) {
                if (labelColor === label.color)
                    if ((labelName !== undefined && labelName == label.name) || labelName === undefined)
                        return trelloHelper.deleteLabel(trello, cardId, label.id)
            }
        })
    }

};