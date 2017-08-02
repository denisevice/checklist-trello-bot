/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;


// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
    // NOTE about asynchronous responses
    // If you need to make an asynchronous request or action before you can reply to Trello
    // you can return a Promise (bluebird promises are included at TrelloPowerUp.Promise)
    // The Promise should resolve to the object type that is expected to be returned


    'authorization-status': function (t) {
        return Promise.all([
            t.board('id').get('id'),
            t.get('board', 'shared', 'auth'),
          ])
          .spread(function (boardId, auth) {
            if(auth !== undefined && boardId == auth.boardId) //check board id to check if board has been copied
              return { authorized: true }
            return { authorized: false };

          })
        
    },
  
    'show-authorization': function (t, options) {
        // return what to do when a user clicks the 'Authorize Account' link
        // from the Power-Up gear icon which shows when 'authorization-status'
        // returns { authorized: false }
        // in this case we would open a popup
        return t.popup({
            title: 'Authorize Checklist Template',
            url: './authorize.html', // this page doesn't exist in this project but is just a normal page like settings.html
            height: 250,
        });
    },
  
    'show-settings': function (t, options) {
        // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
        // what should Trello show. We highly recommend the popup in this case as
        // it is the least disruptive, and fits in well with the rest of Trello's UX
      
      return Promise.all([
        t.get('board', 'shared', 'auth').get('member').get('id'),
        t.member('id').get('id')
        ])
        .spread(function(memberStoredId, memberId){
          if(memberStoredId == memberId)
            return t.popup({
              title: 'Settings',
              url: './settings.html',
              height: 250, 
            });

            return t.popup({
              title: 'Settings',
              url: './settingsLocked.html',
              height: 250, 
          });
      })
    }
})


console.log('Loaded by: ' + document.referrer);
  
