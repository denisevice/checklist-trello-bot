/**
 * Created by lje on 03/08/2017.
 */

const chai = require('chai');
const should = chai.should();

const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
chai.use(chaiAsPromised);
const sinon = require('sinon');


const listCommandMock = sinon.mock(require('./commands/listCommand')),
    labelCommandMock = sinon.mock(require('./commands/labelCommand')),
    boardCommandMock = sinon.mock(require('./commands/boardCommand')),
    archiveCommandMock = sinon.mock(require('./commands/archiveCommand'))



describe('commandUseCase', () => {

    describe('handleItemChecked', () => {

        beforeEach(function() {
            listCommandMock.restore();
            listCommandMock.expects("checked").never();

            labelCommandMock.restore();
            labelCommandMock.expects("checked").never();
            labelCommandMock.expects("unchecked").never();

            boardCommandMock.restore();
            boardCommandMock.expects("checked").never();

            archiveCommandMock.restore();
            archiveCommandMock.expects("checked").never();
            archiveCommandMock.expects("unchecked").never();
        })

        var verifyAllCommandMocks = function() {
            listCommandMock.verify();
            labelCommandMock.verify();
            boardCommandMock.verify();
            archiveCommandMock.verify();
        }

        var proxyquireCommands = function() {
            return proxyquire('./commandUseCase', {
                './commands/listCommand' : listCommandMock,
                './commands/labelCommand' : labelCommandMock,
                './commands/boardCommand' : boardCommandMock,
                './commands/archiveCommand' : archiveCommandMock,
            })
        }

        describe('should call list', () => {
            it('list checked', () => {

                // Given
                const webhookAction = getWebhookAction('command -> list(List)', true);
                listCommandMock.expects("checked").once().withArgs({}, webhookAction.data, ['List']);

                // When
                proxyquireCommands().handleItemChecked({}, webhookAction)

                // Then
                verifyAllCommandMocks();

            });
        });


        describe('should call label', () => {
            it('label checked', () => {

                // Given
                const webhookAction = getWebhookAction('command -> label(color, name)', true);
                labelCommandMock.expects("checked").once().withArgs({}, webhookAction.data, ['color', 'name']);

                // When
                proxyquireCommands().handleItemChecked({}, webhookAction)

                // Then
                verifyAllCommandMocks();

            });

            it('label unchecked', () => {

                // Given
                const webhookAction = getWebhookAction('command -> label(color, name)', false);
                labelCommandMock.expects("unchecked").once().withArgs({}, webhookAction.data, ['color', 'name']);

                // When
                proxyquireCommands().handleItemChecked({}, webhookAction)

                // Then
                verifyAllCommandMocks();

            });
        });



    });
});








var getWebhookAction = function(command, state){
    return {
        data : {
            checkItem : {
                name : command,
                state : (state ? 'complete' : 'incomplete')
            },
            card : {
                id : 1
            }
        }
    };
}
