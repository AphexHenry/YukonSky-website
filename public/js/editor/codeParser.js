function CodeParser()
{
	this.constructorString = "function Visual() {}";

	this.prototypeStringStart = "Visual.prototype.";
	this.prototypeStringEnd = " = function() {";
	this.prototypeSetup = "Setup";
	this.codeList = [];
	var that = this;
	$('#saveButton').click(function(){
		that.Save();
	});
}

CodeParser.prototype.Parse = function(aData) 
{
	$('#code').empty();
	this.SetupFunction(aData.Setup, "Setup");
	this.SetupFunction(aData.SetupScene, "SetupScene");
	this.SetupFunction(aData.SetupScene, "SetupCamera");
	this.SetupFunction(aData.Update, "Update");

};

CodeParser.prototype.SetupFunction = function(aObject, aName)
{
	var codeSetup = this.GetCodeFunction(aObject);
	var $lSubBase = $('#code');
	var $lBase = $('<div class="blockCode"></div>');
	var $lBaseContent = $('<div></div>');
	$lSubBase.append($lBase);
	var lChecked = "";
	classText = "";
	var isDefault = !isdefined(codeSetup);
	if(!isDefault)
	{
		lChecked = "checked";
	}
	else
	{
		codeSetup = "";
		classText="muted"
	}

	var $lSwitch = $('<div class="make-switch switch-small mySwitch" data-on-label="custom" data-off-label="default"><input type="checkbox"' + lChecked + '></div>')
	$lBase.append($lSwitch);
	$lSwitch.bootstrapSwitch();
	var lNameObj = 'code' + aName;
	if(aName == "Update")
	{
		$lBase.append('<hr><p class = '+ classText +'>' + aName + '(aDelta) <br> {</p>');	
	}
	else
	{
		$lBase.append('<hr><p class = '+ classText +'>' + aName + '( ) <br> {</p>');	
	}
	
	$lBase.append($lBaseContent);
	var codeMirror = CodeMirror($lBaseContent[0], {
    value: codeSetup,
    mode:  "javascript",
    viewportMargin: Infinity,
    lineNumbers: false,
    readOnly:isDefault
	});
	
	this.codeList.push({code:codeMirror, name:aName, switch:$lSwitch});

	$lBase.append('<h5>}</h5>');
	if(isDefault)
	{
		$lBaseContent.slideUp();
	}

	$($lSwitch).on('switch-change', function (e, data) {
     var lvalue = data.value;
     if(lvalue)
     {
     	$lBaseContent.slideDown();
     	this.codeList[i].code.options.readOnly = false;
     }
     else
     {
		$lBaseContent.slideUp();
		this.codeList[i].code.options.readOnly = true;
     }
	});
}

CodeParser.prototype.GetCodeFunction = function(aObject) 
{
	if(!isdefined(aObject))
	{
		return;
	}

	var lString = aObject.toString();
	var indexStart = lString.indexOf("{");
	var indexEnd = lString.lastIndexOf("}");

	if(indexStart >= 0 && indexEnd >= 0)
	{
		return lString.substring(indexStart + 1, indexEnd);
	}
	else
	{
		return "";
	}
}

CodeParser.prototype.Save = function() 
{
	this.SaveCode();
	this.SaveGUI();
}

CodeParser.prototype.SaveCode = function()
{
	var codeStr;
	var lVal;
	var fileString = "function Visual() {} \n";
	for(i in this.codeList)
	{
		lVal = this.codeList[i].switch.bootstrapSwitch('status');
		if(lVal)
		{
			codeStr = this.codeList[i].code.getValue();
			if(codeStr.length > 100000)
				return;

			if(this.codeList[i].name == "Update")
			{
				fileString += "\nVisual.prototype." + this.codeList[i].name + " = function(aDelta) {";	
			}
			else
			{
				fileString += "\nVisual.prototype." + this.codeList[i].name + " = function() {";
			}
			fileString += codeStr;
			fileString += " }\n";
		}
	}

	SaveCode(fileString);
}

CodeParser.prototype.SaveGUI = function()
{
	var lGUIString = "function GUI(){\nthis.ListControl = [];\n";
	var GUIChildren = $('.lined');
	for(var i = 0;  i < GUIChildren.length; i++)
	{
		var lElGUI = GUIChildren[i].GUI;
		switch(lElGUI.type)
		{
			case "color":
				lGUIString += "this.ListControl.push({type:'color'";
				lGUIString += ", name:'" + lElGUI.name.val() + "'";
				lGUIString += ", value:'" + lElGUI.value.val() + "'";
				lGUIString += "});\n";
				break;
			case "number":
				lGUIString += "this.ListControl.push({type:'number'";
				lGUIString += ", name:'" + lElGUI.name.val() + "'";
				lGUIString += ", value:'" + lElGUI.value.val() + "'";
				lGUIString += ", min:'" + lElGUI.min.val() + "'";
				lGUIString += ", max:'" + lElGUI.max.val() + "'";
				lGUIString += "});\n";
				break;
			default:
				break;
		}
	}
	lGUIString += '}';
	SaveGUI(lGUIString);
}