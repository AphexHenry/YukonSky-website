function TempoManager()
{
	this.lastTick = Date.now() / 1000;
	this.tempoAverage = 100;
	this.periodAverage = 60. / this.tempoAverage;

	this.timer = 0;
}

TempoManager.prototype.Tick = function()
{
	var now = Date.now() / 1000;
	var thisPeriod = now - this.lastTick;
	this.lastTick = now;
	this.periodAverage = 0.5 * thisPeriod + 0.5 * this.periodAverage;
	this.tempoAverage = 60. / this.periodAverage;

	this.timer = 0.;

	this.ShareTick();
}

TempoManager.prototype.GetTempo = function()
{
	return this.tempoAverage;
}

TempoManager.prototype.ShareTick = function()
{

}

TempoManager.prototype.Update = function(aTimeInterval)
{
	this.timer += aTimeInterval;
	if(this.timer >= this.periodAverage)
	{
		this.timer -= this.periodAverage;
		this.ShareTick();
	}
}

