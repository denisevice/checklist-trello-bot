/* global TrelloPowerUp */
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();


var textP = document.getElementById('text');

t.render(function(){
  
  t.get('board', 'shared', "auth")
  .then(function(auth){
    textP.innerHTML = "<b>Checklist Bot</b> is active and using the account of <b>"+auth.member.fullName+"</b><br>Only this account can change the settings";
  })
    

  .then(function(){
    t.sizeTo('#content')
    .done();
  })
        
  });

