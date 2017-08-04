/**
 * Created by lje on 03/08/2017.
 */


const chai = require('chai');
const should = chai.should();
const parser = require('./parser');


describe('parser', () => {


    it('should return en empty array', () => {
        // Given
        const commands = 'command => something -> sdfsd';

        // When
        const parsedCommands = parser.parse(commands);

        // Then
        parsedCommands.should.deep.equal([]);

    })

    it('should trim arguments', () => {
        // Given
        const commands = 'command -> func1 (  arg )';

        // When
        const parsedCommands = parser.parse(commands);

        // Then
        parsedCommands.should.deep.equal([ { func : 'func1', args : ['arg'] } ]);

    })


    it('should return a list of commands', () => {
        // Given
        const commands = 'command -> func1( arg1 , arg2 ) -> func2( arg3) -> func3()';

        // When
        const parsedCommands = parser.parse(commands);

        // Then
        parsedCommands.should.deep.equal([
            { func : 'func1', args : ['arg1', 'arg2'] },
            { func : 'func2', args : ['arg3'] },
            { func : 'func3', args : [''] }
        ]);

    })



});