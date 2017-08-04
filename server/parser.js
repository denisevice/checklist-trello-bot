/**
 * Created by lje on 03/08/2017.
 */
const Promise = require('bluebird');
const trelloHelper = require('./trelloHelper');
const request = require('request');

module.exports = {

    parse : (command) => {

        const parts = command.split('->')
            .slice(1)
            .map(e => e.trim());


        var parsedCommands = [];
        parts.forEach(part => {
            const argBegin = part.indexOf('(');
            const argEnd = part.lastIndexOf(')');
            const args = part.substr(argBegin + 1, argEnd - argBegin - 1)
                .split(',')
                .map(e => e.trim());

            const func = part.substr(0, argBegin).trim();

            if(func !== "")
                parsedCommands.push({func : func, args : args})
        });
        return parsedCommands;



    }


}