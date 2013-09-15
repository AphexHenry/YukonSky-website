
function CommunicationManager()
{

}

CommunicationManager.prototype.syncButton = function(aName) 
{
	rtcManager.sendStuffP2P("/button " + aName);
}

CommunicationManager.prototype.syncSlider = function(aName, aValue)
{
	rtcManager.sendStuffP2P("/slider " + aName + " " + aValue);
}

CommunicationManager.prototype.syncColor = function(aName, aValue)
{
	rtcManager.sendStuffP2P("/color " + aName + " " + aValue);
}