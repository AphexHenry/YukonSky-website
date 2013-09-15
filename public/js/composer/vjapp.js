  
/*
  Quick sketch of an UI for a VJ application.
  TODO: refactor, refactor, refactor...
*/
var sCommunicationManager = new CommunicationManager();
var sCookieManager = new CookieManager();
var sURLHash;
var sTempo = 100;
var sLastTempoPush = 0;
var sColorPicker;
var sAnimationLoader = new AnimationLoader();
var $sBaseGUISpec;

$(function () {
  $sBaseGUISpec = $('#elementTableSpec');
  var mKeyInput = new KeyInput();

  $('.btn-primary').click(function(ev) {
      $('.btn-primary').removeClass('active');
      syncButton(ev);
    });

  var lRequestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = lRequestAnimationFrame;

  var sLastUpdate = 0;
  function animate() 
  {
    var lThisTime = new Date().getTime() / 1000.;
    var timeElapsed = lThisTime - sLastUpdate;
    sLastUpdate = lThisTime;
    mKeyInput.update(timeElapsed);
    sAnimationLoader.Update(timeElapsed);
    window.requestAnimationFrame( animate );
  }

  animate();

  sURLHash = sCookieManager.check("name", "uniqueToken");

  rtcManager.connect(sURLHash);

  GlobalGUI();

  GetAnimations();

  function UpdateCode()
  {
    var children = $sBaseGUISpec.children();
    EmptyGUIContainer();
    GetAnimations();
  }

  control.AddButton('UpdateGUI', UpdateCode);

}());

function EmptyGUIContainer()
{
  $sBaseGUISpec.empty();
  $('#listVisualButtons').empty();
  sAnimationLoader.reset();
}

function AddYourButtons(aGUIObj)
{
    var button = $('<button type="button" class="btn btn-default" onclick="sAnimationLoader.LoadGUIIndex(this.GUI.index)">' + aGUIObj.GUI.name + '</button>')
  $('#listVisualButtons').append(button);
  button[0].GUI = aGUIObj;
}

function AddColor(aName, value, aId)
{
  var lContainer = $("<div class='NewEl form-item'></div>");
  lContainer.append( "<h4>" + aName + "</h4>" );
  var newPickerDiv = $("<div id='picker'></div>")
  $sBaseGUISpec.append(lContainer);
  lContainer.append("<span class='span2 NewEl'>");
  lContainer.append(newPickerDiv);
  var lPicker = $.farbtastic($(newPickerDiv), colorPickerChange, aId);
  lPicker.setColor(value);
}

function AddSlider(aName, value, aMin, aMax, aGlobal, id)
{
  if(!isdefined(aMin))
  {
      aMin = 0.;
  }

  if(!isdefined(aMax))
  {
      aMax = 1.;
  }

  var $lBase = $("<div class='NewEl'> </div>");
  $lBase.append("<h4>" + aName + "</h4><span class='span2 NewEl'></span>");
  
  var $lSlider = $('<input class="mySlider span3" type="text" name="' + id + '" value="0" data-slider-min="' + aMin +'" data-slider-max="' + aMax + '" data-slider-step="0.01" data-slider-value="0" data-slider-orientation="horizontal" data-slider-id="leftSpeedS" data-slider-selection="before" data-slider-tooltip="hide"></input>');
  $lBase.append($lSlider);

  if(isdefined(aGlobal) && aGlobal)
  {
    $('#elementTable').append($lBase);
  }
  else
  {
    $sBaseGUISpec.append($lBase);
  }

  $lSlider.slider('setValue', value);
  $lSlider.on('slide', function(ev){
    sCommunicationManager.syncSlider(ev.currentTarget.name, ev.value);
  });
}

function AddButton(aName, aId, aGlobal)
{
  var $lBase = $("<div class='NewEl'> </div>");
  var $lButton = $('<button type="button" name="'+ aId + '" class="btn">' + aName + '</button>');
  if(isdefined(aGlobal) && aGlobal)
  {
    $('#elementTable').append($lBase);
  }
  else
  {
    $sBaseGUISpec.append($lBase);
  }
  $lBase.append($lButton);
  $lButton.click(syncButton);
}

function colorPickerChange(ev)
{
  sCommunicationManager.syncColor(ev.name, ev.color);
  console.log("color change: " + ev.color);
}

function syncButton(ev)
{
  sCommunicationManager.syncButton(ev.currentTarget.name);
}

