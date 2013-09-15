
var socket  = io.connect();
var codeParser = new CodeParser();

socket.on('send:code', function (data) {
  data = StringUtils.strdecode(data);
  sAnimationLoader.Load(data);
});

function GetCode()
{
	var object = {user:NAME_USER};
  socket.emit('get:Code', object);
}

function SaveCode(aCode)
{
	var object = {user:NAME_USER, name:NAME_VISUAL, code:aCode};
  	socket.emit('save:code', object);
}

function SaveGUI(aCode)
{
  var object = {user:NAME_USER, name:NAME_VISUAL, code:aCode};
    socket.emit('save:GUI', object);
}

socket.on('CodeSaved', function(){
	sCommunicationManager.syncButton('UpdateCode');
});

socket.on('GUISaved', function(){
  sCommunicationManager.syncButton('UpdateGUI');
});

GetCode();