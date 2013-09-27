
// /**
//  * Module dependencies.
//  */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , helpers = require('./lib/helpers.js')
  , sio     = require('socket.io')         // web socket external module
  , winston = require('winston')           // logging module
  , vineDB = require('./model/VineDB.js')
  , monitorLib = require('./lib/monitorServer.js');

  // rtc Local includes
  easyrtcCfg  = require('./config');          // All server configuration (global)
var g       = require('./lib/rtc/general');     // General helper functions
var c       = require('./lib/rtc/connection');  // easyRTC connection functions

var app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
  
  //var vineModel = new vineDB();

// Logging Setup
g.logInit();                                // Initialize logging settings
var logServer   = winston.loggers.get('easyRtcServer');
var logApi      = winston.loggers.get('easyRtcApi');
var logExpress  = winston.loggers.get('express');
var logSocketIo = winston.loggers.get('socketIo');

var EventEmitter = require('events').EventEmitter
  , ee = new EventEmitter();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('channel', process.env.PORT ? 'vineVJ' : 'vineVJ');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure('production', function() {
  io.enable('browser client etag');
  io.set('log level', 1);
  io.set('transports', ["xhr-polling", "flashsocket", "json-polling"]);
  io.set('polling duration', 10);
});

app.post('/file-upload', function(req, res) {
  var lobject = JSON.parse( req.body.file );
  console.log(lobject);
  var img = lobject.image;
  // strip off the data: url prefix to get just the base64-encoded bytes
  var data = img.replace(/^data:image\/\w+;base64,/, "");
  var base64Image = new Buffer(data, 'base64');
  sCurrentIndex++;
  fs.writeFile('public/images/'+sCurrentIndex + '.jpg', base64Image, function(err) {});
  res.render('login');
});

// Start either the HTTP or HTTPS web service
logServer.info('Starting easyRTC Server (v' + easyrtcCfg.easyRtcVersion +')', { label: 'easyRtcServer'});
if (easyrtcCfg.sslEnable) {  // Start SSL Server (https://)
    var https = require('https');
    var sslOptions = {
        key:  fs.readFileSync(easyrtcCfg.sslKeyFile),
        cert: fs.readFileSync(easyrtcCfg.sslCertFile)
    };

    var server = https.createServer(sslOptions, app).listen(easyrtcCfg.sslPort);

    logServer.info('HTTPS (SSL) Server started on port: ' + easyrtcCfg.sslPort, { label: 'easyRtcServer'});

    // Optionally listen in on an http port and forward requests to secure port
    if (easyrtcCfg.sslForwardFromHttp) {
        var forwardingServer = express();
        forwardingServer.all('*', function(req, res) {
            return res.redirect("https://" + req.host + (easyrtcCfg.sslPort==443 ? '' :':' + easyrtcCfg.sslPort) + req.url);
        });
        forwardingServer.listen(easyrtcCfg.httpPort);
    }    
} else {    // Start HTTP server (http://)
    var server = http.createServer(app).listen(easyrtcCfg.httpPort);
    logServer.info('HTTP Server started on port: ' + easyrtcCfg.httpPort, { label: 'easyRtcServer'});
}

// Start socket server
var io = sio.listen(server, {
        'logger': {
            debug: function(message){ logSocketIo.debug(message, { label: 'socket.io'}); },
            info:  function(message){ logSocketIo.info( message, { label: 'socket.io'}); },
            warn:  function(message){ logSocketIo.warn( message, { label: 'socket.io'}); },
            error: function(message){ logSocketIo.error(message, { label: 'socket.io'}); }
        },
        'browser client minification': true,
        'browser client etag': true,
        'browser client gzip': true
});
logServer.info('Socket Server started', { label: 'easyRtcServer'});

// Start experimental STUN server (if enabled)
if (easyrtcCfg.experimentalStunServerEnable) {
    g.experimentalStunServer();
}

// Shared variable to hold server and socket information.
easyrtc = {
    serverStartTime: Date.now(),
    connections: {}
};

// Upon a socket connection, a socket is created for the life of the connection
io.sockets.on('connection', function (socket) {
    logServer.debug('easyRTC: Socket [' + socket.id + '] connected with application: [' + easyrtcCfg.defaultApplicationName + ']', { label: 'easyrtc', easyrtcid:connectionEasyRtcId, applicationName:easyrtcCfg.defaultApplicationName});
    var connectionEasyRtcId = socket.id;
    c.onSocketConnection(io, socket, connectionEasyRtcId);

    // Incoming messages: Custom message. Allows applications to send socket messages to other connected users.
    socket.on('message', function(msg) {
        logServer.debug('easyRTC: Socket [' + socket.id + '] message received', { label: 'easyrtc', easyrtcid:connectionEasyRtcId, applicationName: easyrtc.connections[connectionEasyRtcId].applicationName, data:msg});
        c.onSocketMessage(io, socket, connectionEasyRtcId, msg);
    });

    // Incoming easyRTC commands: Used to forward webRTC negotiation details and manage server settings.
    var easyrtccmdHandler = function(msg) {
        logServer.debug('easyRTC: Socket [' + socket.id + '] command received', { label: 'easyrtc', easyrtcid:connectionEasyRtcId, data:msg});
        c.onEasyRtcCmd(io, socket, connectionEasyRtcId, msg);
    };
    socket.on('easyrtcCmd', easyrtccmdHandler);
    socket.on('easyRTCcmd', easyrtccmdHandler);
    
    // Upon a socket disconnecting (either directed or via time-out)
    socket.on('disconnect', function(data) {
        logServer.debug('easyRTC: Socket [' + socket.id + '] disconnected', { label: 'easyrtc', easyrtcid:connectionEasyRtcId});
        c.onSocketDisconnect(io, socket, connectionEasyRtcId);
    });

    // socket.on('get:GUI', function(aData)
    // {   
    //     fs.readdir("public/js/users/" + aData.user + "/", function(err, data){
    //       if(err)
    //       {
    //         console.log("error looking in directoriess" + err);
    //       }
    //       else
    //       {
    //         var list = [];
    //         for(var i = 0; i < data.length; i++)
    //         {
    //           list.push({user:aData.user, visual:data[i], file:"GUI.js"});
    //         }
    //         socket.emit('send:GUI', JSON.stringify(list));
    //       }
    //     });
        
    // });


    socket.on('save:code', function(aData)
    {   
      fs.writeFile("public/js/users/" + aData.user + "/" + aData.name + "/visual.js", aData.code, function(err) {
        if(err) {
            console.log(err);
        } else {
            socket.emit('CodeSaved');
            console.log("The file was saved!");
        }
    });
    });

    socket.on('save:GUI', function(aData)
    {   
      fs.writeFile("public/js/users/" + aData.user + "/" + aData.name + "/GUI.js", aData.code, function(err) {
        if(err) {
            console.log(err);
        } else {
            socket.emit('GUISaved');
            console.log("The file was saved!");
        }
     });
    });
});

// Checks to see if there is a newer version of easyRTC available
// if (easyrtcCfg.updateCheckEnable) {
//     g.updateCheck(http);
// }
var sCurrentIndex = 0;
function checkCurrentImageIndex()
{
  var dirContent = fs.readdirSync("public/images/");
  var lCurrentIndex = 0;
  console.log(dirContent);
  for(var i = 0; i < dirContent.length; i++ )
  {
    lCurrentIndex = parseFloat(dirContent[i].substring(0, dirContent[i].length - 4));
    
    if(isNaN(lCurrentIndex))
    {
      continue;
    }

    sCurrentIndex = Math.max(lCurrentIndex, sCurrentIndex);
  }
}

checkCurrentImageIndex();

app.post('/login', function(req, res) {
  console.log("login");
  console.log(req.body);
  // res.send('You sent the name "' + req.body.name + '".');
});

app.get('/', function(req, res) {
  res.render('login');
});

app.get('/composer', function(req, res) {
  res.render('composer');
});

app.get('/display', function(req, res) {
  res.render('display');
});

app.get('/editor', function(req, res) {
  res.render('editor');
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
