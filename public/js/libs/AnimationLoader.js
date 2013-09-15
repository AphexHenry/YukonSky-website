
var sGUIs = [];
var sVisuals = [];
var sIdGUISelected = 0;
var sIdGUISelectedPrev = -1;

function AnimationLoader()
{
	this.animationToLoad = [];
	this.animationIndex = 0;
	this.animationIndexLast = -1;
}

AnimationLoader.prototype.Load = function(array)
{
	this.animationToLoad = this.animationToLoad.concat(array);
	this.Update();
}

AnimationLoader.prototype.Update = function(aTimeInterval)
{
	if(this.animationIndex >= this.animationToLoad.length)
	{
		if(sIdGUISelected != sIdGUISelectedPrev)
		{
			if(sGUIs.length > sIdGUISelected)
			{
				this.LoadGUI(sGUIs[sIdGUISelected]);
				if(sVisuals.length > sIdGUISelected)
				{
					try 
					{
				        codeParser.Parse(sVisuals[sIdGUISelected].Visual);
				    }
				    catch(err) 
				    {
				        // Handle error(s) here
				    }
				}
				sIdGUISelectedPrev = sIdGUISelected;
			}
		}
		return;
	}

	var that = this;
	if(this.animationIndex != this.animationIndexLast)
	{
		this.animationIndexLast = this.animationIndex;
		var lFileId = this.animationToLoad[this.animationIndex].user + "/" + this.animationToLoad[this.animationIndex].visual + "/" +this.animationToLoad[this.animationIndex].file;
		loadjsfile("js/users/" + lFileId, function(aIsGUI){
			if(aIsGUI)
			{
				that.GUILoaded();
			}
			else
			{
				that.AnimationLoaded();
			}
			that.animationIndex++;
		}, this.animationToLoad[this.animationIndex].file == 'GUI.js');
	}
}

AnimationLoader.prototype.GetCurrentFileID = function()
{
	return this.animationToLoad[this.animationIndex].user + this.animationToLoad[this.animationIndex].visual;
}

AnimationLoader.prototype.reset = function()
{
	sGUIs = [];
	sIdGUISelectedPrev = -1;
}

AnimationLoader.prototype.LoadGUIIndex = function(aIndex)
{
	sIdGUISelected = aIndex;
}

AnimationLoader.prototype.LoadGUI = function(aGUI)
{
	$sBaseGUISpec.empty();

	var controlList = aGUI.GUI.ListControl;
	for(var i = 0; i < controlList.length; i++)
	{
		var lId = aGUI.id;
		switch(controlList[i].type)
		{
			case 'color':
			AddColor(controlList[i].name, controlList[i].value, lId)
			break;
			case 'slider':
			case 'number':
			case 'float':
			AddSlider(controlList[i].name, controlList[i].value, controlList[i].min, controlList[i].max, false, lId + controlList[i].name)
			break;
		}
	}
}

AnimationLoader.prototype.GUILoaded = function()
{
	var thisGUI = new GUI();
	var lGUIObj = {GUI:thisGUI, id:this.GetCurrentFileID(), index:sGUIs.length};
	sGUIs.push(lGUIObj);
	try 
	{
        AddYourButtons(lGUIObj);
    }
    catch(err) 
    {
        // Handle error(s) here
    }
}

AnimationLoader.prototype.AnimationLoaded = function()
{	
	var lVisualObj = {Visual:new Visual(), id:this.GetCurrentFileID(), index:sVisuals.length};
	sVisuals.push(lVisualObj);
	try 
	{
        ManageAnimationLoaded(this.GetCurrentFileID());
    }
    catch(err) 
    {
        // Handle error(s) here
    }
}