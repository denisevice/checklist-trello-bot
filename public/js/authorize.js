/* global TrelloPowerUp */


var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();



var authNode = document.getElementById('authNode');

t.render(() => t.sizeTo('#content'));

function done(token){
  console.log('token', token)
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
  });  
}



authNode.addEventListener('click', function(e){
  return t.board('id').get('id')
    .then(model => {
      window.open("https://" + window.location.hostname + "/auth", '_blank')
      t.sizeTo('#content')
    });
});