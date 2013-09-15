
var socket  = io.connect();

socket.on('messageDB', function (data) {
	data = StringUtils.strdecode(data);
	AddVideoFromDB(data[0].list);
});

socket.on('send:code', function (data) {
  data = StringUtils.strdecode(data);

  for(var i = 0; i < data.length; i++)
  {
    if(data[i].isGUI)
    {
      sAnimationLoader.Load(data[i]);
    }
  }
});

function GetAnimations()
{
	var object = {user:NAME_USER};
  	socket.emit('get:Code', object);
}