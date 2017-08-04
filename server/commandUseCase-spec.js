/**
 * Created by lje on 03/08/2017.
 */

const chai = require('chai');
const should = chai.should();

const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
chai.use(chaiAsPromised);
const sinon = require('sinon');



describe('commandUseCase', () => {
    describe('handleItemChecked', () => {

        describe('should call list', () => {
            it('list checked', () => {

                // Given
                const webhookAction = getWebhookAction('command -> list(List)', true);
                const listCommandMock = sinon.mock(require('./commands/listCommand'));
                listCommandMock.expects("checked").once().withArgs({}, webhookAction.data, ['List']);
                const commandUseCase = proxyquire('./commandUseCase', { './commands/listCommand' : listCommandMock })

                // When
                commandUseCase.handleItemChecked({}, webhookAction)

                // Then
                listCommandMock.verify()

            });
        });


        describe('should call label', () => {
            it('label checked', () => {

                // Given
                const webhookAction = getWebhookAction('command -> label(color, name)', true);
                const checkedStub = sinon.stub().withArgs({}, webhookAction.data, ['color', 'name']).returns({});

                // When
                const labelCommandStub = { 'unchecked' : sinon.stub().throws('unchecked'), 'checked' : checkedStub };

                // Then
                const commandUseCase = proxyquire('./commandUseCase', { './commands/labelCommand' : labelCommandStub })
                commandUseCase.handleItemChecked({}, webhookAction)

            });

            it('label unchecked', () => {

                // Given
                const webhookAction = getWebhookAction('command -> label(color, name)', false);
                const uncheckedStub = sinon.stub().withArgs({}, webhookAction.data, ['color', 'name']).returns({});

                // When
                const labelCommandStub = { 'unchecked' : uncheckedStub, 'checked' : sinon.stub().throws() };

                // Then
                const commandUseCase = proxyquire('./commandUseCase', { './commands/labelCommand' : labelCommandStub })
                commandUseCase.handleItemChecked({}, webhookAction)

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
