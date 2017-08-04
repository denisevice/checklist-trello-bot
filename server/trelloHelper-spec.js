/**
 * Created by lje on 20/07/2017.
 */


const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinon = require('sinon');

const trelloHelper = require('./trelloHelper');



describe('trelloHelper', () => {
    describe('getListIdFromListName', () => {

        it('should reject if trello returns error', () => {
            // Given
            const trello = {
                get : (args, callback) => {
                    callback('error', null);
                }
            }
            // When
            const result = trelloHelper.getListIdFromListName(trello, 1, 'listName');
            // Then
            return result.should.be.rejectedWith('error');
        })



        it('should reject when list not found', () => {
            // Given
            const trello = {
                get : (args, callback) => {
                    callback(null, []);
                }
            }
            // When
            const result = trelloHelper.getListIdFromListName(trello, 1, 'listName');
            // Then
            return result.should.be.rejectedWith('not found');
        })


        it('should resolve with list id', () => {

            // Given
            const trello = {
                get : (args, callback) => {
                    callback(null, [
                        {
                            id : 1,
                            name : 'listName'
                        }
                    ]);
                }
            }

            // When
            const result = trelloHelper.getListIdFromListName(trello, 1, 'listName');
            // Then
            return result.should.eventually.equal(1);
        })


        it('should resolve with the right list id', () => {

            // Given
            const trello = {
                get : (args, callback) => {

                    callback(null, [
                        {
                            id : 1,
                            name : 'listName'
                        },
                        {
                            id : 2,
                            name : 'listName2'
                        }
                    ]);
                }
            }
            // When
            const result = trelloHelper.getListIdFromListName(trello, 1, 'listName');
            // Then
            return result.should.eventually.equal(1);
        })


    }) // Describe getListIdFromListName







    describe('getCardIdFromCardName', () => {

        it('should reject if trello returns error', () => {
            // Given
            const trello = {
                get : (args, callback) => {
                    callback('error', null);
                }
            }
            // When
            const result = trelloHelper.getCardIdFromCardName(trello, 1, 'cardName');
            // Then
            return result.should.be.rejectedWith('error');
        })



        it('should reject when card not found', () => {
            // Given
            const trello = {
                get : (args, callback) => {
                    callback(null, []);
                }
            }
            // When
            const result = trelloHelper.getCardIdFromCardName(trello, 1, 'cardName');
            // Then
            return result.should.be.rejectedWith('not found');
        })


        it('should resolve with card id', () => {

            // Given
            const trello = {
                get : (args, callback) => {

                    callback(null, [
                        {
                            id : 1,
                            name : 'cardName'
                        }
                    ]);
                }
            }

            // When
            const result = trelloHelper.getCardIdFromCardName(trello, 1, 'cardName');
            // Then
            return result.should.eventually.equal(1);
        })


        it('should resolve with the right card id', () => {

            // Given
            const trello = {
                get : (args, callback) => {

                    callback(null, [
                        {
                            id : 1,
                            name : 'cardName'
                        },
                        {
                            id : 2,
                            name : 'cardName2'
                        }
                    ]);
                }
            }

            // When
            const result = trelloHelper.getCardIdFromCardName(trello, 1, 'cardName');

            // Then
            return result.should.eventually.equal(1);
        })


    }) // Describe getCardIdFromCardName


})