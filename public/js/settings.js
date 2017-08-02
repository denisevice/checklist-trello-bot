/* global TrelloPowerUp */


var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var templateBoardSelect = document.getElementById('templateBoardSelect');
var templateListSelect = document.getElementById('templateListSelect');

const trelloAPI = "https://api.trello.com";


var saveBtn = document.getElementById('save');
var disableBtn = document.getElementById('disable');

t.render(() => {
  
  t.get('board', 'private', 'token')
  .then(token => {
    if(token === undefined) {
      return t.popup({
            title: 'Authorize Checklist Template',
            url: './authorize.html', // this page doesn't exist in this project but is just a normal page like settings.html
            height: 250,
      });
    }
    else return;
  })
  .then(() => {
  
    return Promise.all([
      t.get('board', 'shared', 'template'),
      t.board('id').get('id'),
    ])

    .spread(function(template, boardId){

      t.get('board', 'private', 'token')
        .then(token => {
        if(token === undefined) return;
          setBoardOptions(token.token, template)
            .then(() => setListOptions(token.token, template));
        }); 
    })

    .then(() => t.sizeTo('#content'))
  })
});




function setBoardOptions(token, template){
  const selected = template === undefined ? "" : template.boardId;
  var length = templateBoardSelect.options.length;
  for (var i = 0; i < length; i++) {
    templateBoardSelect.options[i] = null;
  }
  
  return getBoardsList(token).then(boards => {
    var boardsSorted = [];
    boardsSorted['Auto'] = [];
    boardsSorted['Auto'].push({ id : "", name : "Auto (current board)" })
    
    boards.forEach(board => {

      const ogName = board.organization === undefined ? "Personnal" : board.organization.displayName;
      if (boardsSorted[ogName] === undefined) boardsSorted[ogName] = [];
      boardsSorted[ogName].push(board);
    });


    
    Object.keys(boardsSorted).forEach(organizationName => {
      var optGroup = document.createElement("optgroup");
      optGroup.label = organizationName;
      templateBoardSelect.add(optGroup);
      boardsSorted[organizationName].forEach(board => {    
        var option = document.createElement("option");
        option.text = board.name;
        option.value = board.id;
        option.selected = (board.id == selected);
        optGroup.appendChild(option);
      
      })
        
    })
    return;
  })

}


function setListOptions(token, template){
  const selected = template === undefined ? "" : template.listId;
  
  templateListSelect.innerHTML = "";
  
  const boardId = templateBoardSelect.value;
  return ((boardId == "") ? t.board('id').get('id') : Promise.resolve(boardId))
  .then((boardId) => {

      getListsList(token, boardId).then((lists) => {
        lists.push({id : "", name : "Auto (current board name)"});
        lists.forEach((list) => {
          var option = document.createElement("option");
          option.text = list.name;
          option.value = list.id;
          option.selected = (list.id == selected)
          templateListSelect.appendChild(option);
       }) 
    });
  })
}




function encodeParams (params){
  var esc = encodeURIComponent;
  return Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
}



function getBoardsList(token){
  const params = encodeParams({
    key : APIKey,
    token : token,
    fields : 'name',
    organization : 'true',
    organization_fields : 'displayName'   
  })
  return fetch(trelloAPI+'/1/members/me/boards?'+params)
  .then(response => (response.json()))

}



function getListsList(token, boardId){
  const params = encodeParams({
    key : APIKey,
    token : token,
    fields : 'name',  
  })
  return fetch(trelloAPI+'/1/boards/'+boardId+'/lists?'+params)
  .then(response => (response.json()))
}

function createWebhook(token, model, template){
  return cleanWebooks(token, model).then(() => {
    const params = encodeParams({
      token : token,
      key : APIKey,
      idModel : model,
      callbackURL : "https://" + window.location.hostname + "/webhooks"
                              + "?templateBoardId=" + template.boardId
                              + "&templateListId=" + template.listId
                              + "&token=" + token

    }) 
    return fetch(trelloAPI+'/1/webhooks?'+params, {method : 'POST'}).then(response => response.json());
  })
}





function getMyWebhooks(token, model){
  const params = encodeParams({
    token : token,
    key : APIKey,
  })
  
  const url = window.location.hostname;
  
  return fetch(trelloAPI + "/1/tokens/" + token + "/webhooks?" + params)
    .then(resp => resp.json())
  
    .then(webhooks => {

      webhooks = webhooks.filter(webhook => {
        return (webhook.idModel == model && webhook.callbackURL.substr(8, url.length) == url);
      })
      return webhooks
    })  
  


}


function cleanWebooks(token, model){
  
  return getMyWebhooks(token, model)
    .then(webhooks => {
        var p = [];
        webhooks.forEach(webhook => p.push(deleteWebhook(token, webhook)));
        return Promise.all(p)
    })
  
}


function deleteWebhook(token, webhook){
  const params = encodeParams({
    token : token,
    key : APIKey,
  });
  
  return fetch(trelloAPI+'/1/webhooks/' + webhook.id + '?' + params, {method : 'DELETE'})
    .then(response => response.json());
}





templateBoardSelect.addEventListener('change', e => {
  t.get('board', 'private', 'token').get('token').then(token => setListOptions(token));
  
});



disableBtn.addEventListener('click', e => {
  
  Promise.all([
    t.board('id').get('id'),
    t.get('board', 'private', 'token').get('token')   
  ])
  
  .spread((boardId, token) => cleanWebooks(token, boardId))
  
  .then(() => {
    return Promise.all([
      t.remove('board', 'shared', ['auth', 'template']),
      t.remove('board', 'private', 'token')
    ])
  })
  .then(() => t.closePopup());

})


saveBtn.addEventListener('click', e => {
  return t.set('board', 'shared', 'template', {
    boardId : templateBoardSelect.value,
    listId : templateListSelect.value,
    boardName : templateBoardSelect.options[ templateBoardSelect.selectedIndex ].text,
    listName : templateListSelect.options[ templateListSelect.selectedIndex ].text
  })
  
  .then(() => {
    return Promise.all([
      t.board('id').get('id'),
      t.get('board', 'shared', 'template'),
      t.get('board', 'private', 'token').get('token')
    ])   
  })
  
  .spread((model, template, token) => {
    
    createWebhook(token, model, template).then(() => t.closePopup());   
  });

});