
$(document).ready(function(){

  var p = document.getElementById('p');
  var status = document.getElementById('status')
  

  
  
  var authenticationSuccess = function() { 
    console.log('Successful authentication'); 
    p.innerHTML += "Trello authentication : OK<br>"
    //closeTab();
    if(window.location.hash.substr(0,7) == "#deauth"){
      window.opener.clean()
      closeTab();
    }
      
    else{
      window.opener.done(false, Trello.token());
      closeTab();

    }

      //createWebhooks();

  };
  
  
  var authenticationFailure = function() { 
    window.opener.done(true);
    console.log('Failed authentication'); 
  };

function closeTab(){
  setTimeout(function(){
      close();

  }, 500)
}


  
  
  Trello.authorize({
    type: 'redirect',
    name: 'Trello Template',
    scope: {
      read: 'allowRead',
      write: 'allowWrite' },
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
  });
  
  })