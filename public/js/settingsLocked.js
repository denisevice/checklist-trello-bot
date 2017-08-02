/* global TrelloPowerUp */
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();


var textP = document.getElementById('text');

t.render(function(){
  Promise.all([
      t.get('board', 'shared', "auth"),
      t.get('board', 'shared', 'template') 
  ])

    .spread( (auth, template) => {
    textP.innerHTML = "<b>Checklist Bot</b> is active and using the account of <b>"+auth.member.fullName+"</b><br>Only this account can change the settings<hr>"
                      +"Template Board: <b>" + template.boardName + "</b>"
                      +"<br>Template List: <b>" + template.listName + "</b>" ;
    
    ;
  })
    

  .then(function(){
    t.sizeTo('#content')
    .done();
  })
        
  });

