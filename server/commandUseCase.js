/*
 ** Check Bot Power-Up - https://github.com/louisjeck/checklist-trello-bot
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

const request = require('request');
const parser = require('./parser');
const listCommand = require('./commands/listCommand'),
    labelCommand = require('./commands/labelCommand'),
    boardCommand = require('./commands/boardCommand'),
    archiveCommand = require('./commands/archiveCommand')
;

module.exports = {
    handleItemChecked: function (trello, webhookAction) {
        const webhookData = webhookAction.data;
        const checkItem = webhookData.checkItem;
        const checkItemName = checkItem.name;

        const parsedCommands = parser.parse(checkItemName);

        parsedCommands.forEach((parsedCommand) => {


            if (checkItem.state === 'incomplete') {
                switch (parsedCommand.func) {
                    case "label":
                        labelCommand.unchecked(trello, webhookData, parsedCommand.args);
                        break;
                    case "archive":
                        archiveCommand.unchecked(trello, webhookData);
                }
            }

            else {

                switch (parsedCommand.func) {
                    case "list":
                        listCommand.checked(trello, webhookData, parsedCommand.args);
                        break;
                    case "link":
                        execLink(parsedCommand.args);
                        break;
                    case "board":
                        boardCommand.checked(trello, webhookData, parsedCommand.args);
                        break;
                    case "label":
                        labelCommand.checked(trello, webhookData, parsedCommand.args);
                        break;
                    case "archive":
                        archiveCommand.checked(trello, webhookData);
                        break;

                }
            }


        }) //endForEach
    }
} //module exports


function execLink(url) {
    const re = new RegExp('\"(.*)\"');
    url = re.exec(url)[1];
    console.log('execLink', url);
    request(url, function (error, response, body) {
        console.log(error ? error : "no error, read ", Object.keys(body).length, "bytes");
    });
}







