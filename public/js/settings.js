/* global TrelloPowerUp */


var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var templateBoardSelect = document.getElementById('templateBoardSelect');
var templateListSelect = document.getElementById('templateListSelect');
const APIKey = "910aeb0b23c2e63299f8fb460f9bda36";
const trelloAPI = "https://api.trello.com";
const optionAutomatic = document.createElement("option");
      optionAutomatic.text = "Auto";
      optionAutomatic.value = "-1";
        //optionAutomatic.value = board.id;

var authDiv = document.getElementById('auth');
var saveBtn = document.getElementById('save');
var disableBtn = document.getElementById('disable');

t.render(() => {


  return Promise.all([
    t.get('board', 'shared', 'template'),
    t.board('id').get('id'),
  ])
  .spread(function(template, boardId){
    t.get('board', 'private', 'token').get('token').then(token => {
      setBoardOptions(token, boardId, template.boardId).then(() => setListOptions(token, template.listId));
    })
    if(template){
     // templateBoardId_input.value = template.boardId;
      templateListSelect.value = template.listName
    }
  })
  .then(() => t.sizeTo('#content'))
});




function setBoardOptions(token, boardId, selected){
  selected = selected === undefined ? -1 : selected;
  var length = templateBoardSelect.options.length;
  for (var i = 0; i < length; i++) {
    templateBoardSelect.options[i] = null;
  }
  
  return getBoardsList(token).then(boards => {
    var boardsSorted = [];
    boardsSorted['Auto'] = [];
    boardsSorted['Auto'].push({ id : -1, name : "Auto (current board)" })
    
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


function clean(){
  console.log('clean')
  t.remove('board', 'shared', 'auth')
}


function setListOptions(token, selected){
  selected = selected === undefined ? -1 : selected;
  
  templateListSelect.innerHTML = "";
  
  const boardId = templateBoardSelect.value;
  return ((boardId == -1) ? t.board('id').get('id') : Promise.resolve(boardId))
  .then((boardId) => {
      optionAutomatic.selected = (selected === undefined);

      getListsList(token, boardId).then((lists) => {
        lists.push({id : -1, name : "Auto (current board name)"});
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


templateBoardSelect.addEventListener('change', e => {
  t.get('board', 'private', 'token').get('token').then(token => setListOptions(token));
  
});


disableBtn.addEventListener('click', e => {
  t.board('id').get('id')
  .then(function(boardId){
    window.open("https://" + window.location.hostname + "/auth?model="+boardId+"#deauth")
  })
})


saveBtn.addEventListener('click', e => {
  e.preventDefault();

  return t.set('board', 'shared', 'template', {
    boardId : templateBoardSelect.value,
    listId : templateListSelect.value 
  })
  
  .then(() => {
    return Promise.all([
      t.board('id').get('id'),
      t.get('board', 'shared', 'template'),
      t.get('board', 'private', 'token').get('token')
    ])
      
  })
  
  .spread((model, template, token) => {
    console.log(model, template, token)
    fetch("https://" + window.location.hostname + "/save"
                + "?template_board_id=" + ((template.boardId == -1) ? "" : template.boardId)
                + "&template_list_id=" + ((template.listId == -1) ? "" : template.listId)
                + "&model=" + model
                + "&token=" + token
                );
    
    t.sizeTo('#content')
    
  });

});