

function rtcManager()
{
    this.selfEasyrtcid = "";
    this.otherSessionID;
}

function addToConversation(who, content) 
{
    console.log("data received = " + content + " from " + who);
    try
    {
        control.Parse(content);    
    }
    catch(err)
    {
        
    }
}

rtcManager.prototype.connect = function(aChannel)
{
    var that = this;

    function loginSuccess(easyRTCId) 
    {
      rtcManager.selfEasyrtcid = easyRTCId;
    }

    function loginFailure(message) 
    {
      that.showError("LOGIN-FAILURE", message);
    }

    function loggedInListener (data) {
        that.otherSessionID = data;
    }

    easyRTC.setDataListener(addToConversation);
    easyRTC.setLoggedInListener(loggedInListener);
    easyRTC.connect("im", loginSuccess, loginFailure);
}

rtcManager.prototype.sendStuffP2P = function(text) 
{  
    if(!isdefined(this.otherSessionID))
        return;
    
    for(var i in this.otherSessionID) 
    {  
        easyRTC.sendDataWS(i, text);
        addToConversation("Me", text);
    }
}

rtcManager = new rtcManager();