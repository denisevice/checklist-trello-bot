/* global TrelloPowerUp */


var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();
var authNode = document.getElementById('authNode');


t.render(() => t.sizeTo('#content'));

function done(err, token){
  if(err){

    return;
  }
  t.set('board', 'private', 'token', {token : token});

  Promise.all([
    t.board('id').get('id'),
    t.member('fullName', 'id')
  ])
  .spread(function(boardId, member){
    t.set('board', 'shared', 'auth', {
         member : member,
         boardId : boardId
    });  
  })
  .then(() => 
        t.popup({
            title: 'Settings',
            url: './settings.html',
            height: 250, 
        }));
  
}



authNode.addEventListener('click', function(e){
  return t.board('id').get('id')
    .then(model => {
      window.open("https://" + window.location.hostname + "/auth", '_blank')
      t.sizeTo('#content')

    });
});