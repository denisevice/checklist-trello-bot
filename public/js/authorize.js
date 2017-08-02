/* global TrelloPowerUp */


var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();
var auth = document.getElementById('auth');


t.render(() => t.sizeTo('#content'));

function done(err, token){
  if(err){
    t.closePopup();
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



auth.addEventListener('click', function(e){
  return t.board('id').get('id')
    .then(model => {
      window.open("https://" + window.location.hostname + "/auth", '_blank')
      t.sizeTo('#content')

    });
});