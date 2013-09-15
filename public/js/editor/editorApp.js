
var sURLHash = "uniqueToken";
rtcManager.connect(sURLHash);
var sCommunicationManager = new CommunicationManager();
var sAnimationLoader = new AnimationLoader();
var $sBaseGUISpec = $('#GUIBase');

function animate() 
{
  sAnimationLoader.Update();
  window.requestAnimationFrame( animate );
}

animate();

$('#CodeGUISwitch').on('switch-change', function (e, data) 
{
	$('#GUI').removeClass('unactive');
	$('#code').removeClass('unactive');
	if(!data.value)
	{
		$('#code').addClass('unactive');
	}
	else
	{
		$('#GUI').addClass('unactive');
	}
});

function AddYourButtons(aGUIObj)
{
    var button = $('<li><a>' + aGUIObj.GUI.name + '</a></li>')
    button.click(function(){
      $('#myModal').modal()
      sAnimationLoader.LoadGUIIndex(this.GUI.index);
    })
    var $anchor = $('#AnimationsAnchor');
    $anchor.append(button);
    button[0].GUI = aGUIObj;
}

function ManageAnimationLoaded(aUser, aVisual)
{
  
}

function AddSlider(aName, value, aMin, aMax, isGlobal, id)
{
  if(!isdefined(aMin))
  {
      aMin = 0.;
  }

  if(!isdefined(aMax))
  {
      aMax = 1.;
  }

  var $lRealBase = $("<div class='newEl lined'></div>");
  var $lBaseNum = $("<div class='row'> </div>");
  var $lBaseText = $("<div class='row'> </div>");
  $lRealBase.append('<button type="button" class="btn btn-danger removeButton" onclick="removeInput(this)">remove</button>')
  $lRealBase.append($lBaseText);
  $lRealBase.append($lBaseNum);
  $sBaseGUISpec.append($lRealBase);

  // $lSlider.slider('setValue', value);
  $lBaseText.append('<h4>number input');

  var lInputNameContainer = $('<div class="input-group col-2"></div>')
  $lBaseNum.append(lInputNameContainer);
  var $inputName = $('<input type="text" class="form-control col-1" value="' + aName + '">');
  lInputNameContainer.append($('<span class="input-group-addon">name</span>'));
  lInputNameContainer.append($inputName);
  // $lBaseNum.append($('<div class="input-group col-2"><span class="input-group-addon">name</span><input type="text" class="form-control col-1" value="' + aName + '"></div>'))

  var $codeCopy = $('<input title="get value" class="codeCopyText col-4" onClick="this.select();" type="text" readonly value="' + 'control.GetNumber(' + "'"  + aName + "'" + ')"></input><br>');
  var $lcodeCopyBlock = $('<div class="CodeCopy row col-4">');
  $lcodeCopyBlock.append('<h4>Access in your code:</h4>');
  $lcodeCopyBlock.append($codeCopy);
  $lBaseNum.append($lcodeCopyBlock);
  $inputName[0].oninput = function() {
    $codeCopy.val('control.GetNumber(' + "'"  + $inputName.val() + "'" + ')');
  };

  var $lValue = appendNumberInputTo($lBaseNum, value, "value");
  var $lMin = appendNumberInputTo($lBaseNum, aMin, "min");
  var $lMax = appendNumberInputTo($lBaseNum, aMax, "max");

  $lRealBase[0].GUI = {type:'number', value:$lValue, min:$lMin, max:$lMax, name:$inputName, id:$inputName};
}

function appendNumberInputTo(ajQEl, value, aName)
{
  var $lBase = $('<div class="input-group col-2"></div>');
  $lBase.append('<span class="input-group-addon">' + aName + '</span>');
  $lInput = $('<input type="number" class="form-control col-1" step="0.1" value="' + value + '">');
  $lBase.append($lInput);
  ajQEl.append($lBase);
  return $lInput;
}

function removeInput(that)
{
  var root = $(that).parent('.lined');
  root.remove();
  // $('#GUI').remove(root);
}

function AddButton(aName, aId)
{
  var $lButton = $('<button type="button" name="'+ aId + '" class="btn">' + aName + '</button> <br>');
  $sBaseGUISpec.append($lButton);
}

function AddColor(aName, value, aId)
{
  // add colored box.
  var $indicator = $('<input type="text" id="color" name="color" value="' + value + '" > defaultValue </input>');
  function colorPickerChange(ev)
  {
    $indicator.css('background-color', ev.color);
    $indicator.val(ev.color);
  }

  //  input line.
  var $lBaseNum = $("<div class='NewEl lined'> </div>");
  $lBaseNum.append('<button type="button" class="btn btn-danger removeButton" onclick="removeInput(this)">remove</button>');
  $sBaseGUISpec.append( $lBaseNum );
   $($lBaseNum).append( "<h4>color input</h4>" );
  var lContainer = $("<div class='row NewEl form-item'></div>");
  var newPickerDiv = $("<div id='picker' class='col-3'></div>");
  $lBaseNum.append(lContainer);

  var lInputNameContainer = $('<div class="input-group col-2"></div>')
  lContainer.append(lInputNameContainer);
  var $inputName = $('<input type="text" class="form-control col-1" value="' + aName + '">');
  lInputNameContainer.append($('<span class="input-group-addon">name</span>'));
  lInputNameContainer.append($inputName);
  lContainer.append($indicator);
  lContainer.append(newPickerDiv);
  var $codeCopy = $('<input title="get hex value (' + "'#0f0f0f')" + '" class="codeCopyText col-4" onClick="this.select();" type="text" readonly value="' + 'control.GetColor(' + "'"  + aName + "'" + ')"></input><br>');
  var $codeCopy2 = $('<input title="get rgb value (' + "{r:1, g:0.4, b:0.1})" + '" class="codeCopyText col-4" type="text" onClick="this.select();"  readonly value="' + 'control.GetColorRGB(' + "'"  + aName + "'" + ')"></input><br>');
  var $codeCopy3 = $('<input class="codeCopyText col-4" type="text" onClick="this.select();"  readonly value="' + 'control.GetColorHSV(' + "'"  + aName + "'" + ')"></input><br>');
  var $lcodeCopyBlock = $('<div class="CodeCopy row col-4">');
  $lcodeCopyBlock.append('<h4>Access in your code:</h4>');
  $lcodeCopyBlock.append($codeCopy);
  $lcodeCopyBlock.append($codeCopy2);
  $lcodeCopyBlock.append($codeCopy3);
  lContainer.append($lcodeCopyBlock);
  $inputName[0].oninput = function() {
    $codeCopy.val('control.GetColor(' + "'"  + $inputName.val() + "'" + ')')
    $codeCopy2.val('control.GetColorRGB(' + "'"  + $inputName.val() + "'" + ')')
    $codeCopy3.val('control.GetColorHSV(' + "'"  + $inputName.val() + "'" + ')')

  };
  var lPicker = $.farbtastic($(newPickerDiv), colorPickerChange, aId);
  lPicker.setColor(value);

  $lBaseNum[0].GUI = {type:'color', value:$indicator, name:$inputName, id:$inputName};
}

function AddDefaultNumber()
{
  AddSlider("name", 0, 0, 1, false, "display name");
}

function AddDefaultColor()
{
  AddColor("name", '#ffffff', 'name')
}

