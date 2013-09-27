var sImageEditor = new ImageEditor();

function ImageEditor()
{
  this.mImage;
  this.mSize = 400;
  this.mPositionInit = {x:0, y:0};
  this.mPosition = {x:0, y:0};
  this.needToUpdate = false;
  this.year = 2013;
  this.month = 03;
  this.day = 13;
  this.hour = 13;


  that = this;
  $('#scaleSlider').slider().on('slide', function(ev){
    that.mSize = $(this).val();
    that.needToUpdate = true;
  });

  $('#cloudiness').slider().on('slide', function(ev){
    that.objectToSend.weather.cloudiness = $(this).val();
  });

  $('#daynight').slider().on('slide', function(ev){
    that.objectToSend.weather.daynight = $(this).val();
  });


  $('#precipitation').slider().on('slide', function(ev){
    that.objectToSend.weather.precipitation = $(this).val();
  });

  // $('input[type="checkbox"]').checkbox();

  this.state = 0;
  this.objectToSend = {weather:{cloudiness:0, daynight:0, precipitation:0}, visible:{}};
}

ImageEditor.prototype.init = function(aImage, aDate)
{
  that = this;
  this.date = aDate;
  this.objectToSend.date = this.date;
  this.year = aDate.getFullYear();
  this.month = aDate.getMonth();
  this.day = aDate.getDate();
  this.hour = aDate.getHours();
  this.mImage = aImage;

  var lpreview = $('#preview');
  lpreview.addClass('editImage');
  lpreview.attr('width', '400px');
  lpreview.attr('height', '400px');

  this.needToUpdate = true;

  lpreview[0].addEventListener('mousedown', mouseDown, false);

  window.addEventListener('mouseup', mouseUp, false);

  var positionInit;
  function mouseUp()
  {
      window.removeEventListener('mousemove', divMove, true);
  }

  function mouseDown(e){
    event.preventDefault();
    window.addEventListener('mousemove', divMove, true);

    positionInit = {x:e.clientX, y:e.clientY};
    that.mPositionInit = {x:that.mPosition.x, y:that.mPosition.y};
  }

  function divMove(e){
    event.preventDefault();
    if(that.state == 0)
    {
      that.mPosition.x = that.mPositionInit.x + e.clientX - positionInit.x;
      that.mPosition.y = that.mPositionInit.y + e.clientY - positionInit.y;
      that.needToUpdate = true;
    }
  }

   $('#edit').removeClass('hidden');

    $('#sendButton').click(function()
    {
      that.nextState();
    })

}

ImageEditor.prototype.nextState = function()
{
  this.state++;
  switch(this.state)
  {
    case 1:
      $('#edit').addClass('hidden');
      $('#preview').removeClass('editImage');
      $('#setTime').removeClass('hidden');
      $('#previewMask').removeClass('hidden');
      var ldatePicker = $('<div id="datepicker" data-date="' + this.day + '-' + this.month + '-' + this.year + '" data-date-format="dd-mm-yyyy"></div>');
      var lTimePicker = $('<div class="input-append bootstrap-timepicker"><input id="timepicker" type="text" class="input-small"><span class="add-on"><i class="icon-time"></i></span></div>');

      $('#setTime').append(ldatePicker);
      $('#setTime').append(lTimePicker);

      var test = ldatePicker.datepicker();
      $('#timepicker').timepicker();
      var hour = this.hour;
      var AMPM = 'AM'
      if(this.hour > 12)
      {
        hour -= 12;
      }
      if(this.hour >= 12)
      {
        AMPM = 'PM'
      }

      $('#timepicker').timepicker('setTime', hour + ':00 ' +  AMPM).on('changeTime.timepicker', function(e) {
        console.log('The time is ' + e.time.value);
        console.log('The hour is ' + e.time.hours);
        var hours = e.time.meridian == 'PM' ? e.time.hours + 12 : e.time.hours;
        hours = hours % 24;
        that.objectToSend.date.setHours(hours);
        that.objectToSend.date.setMinutes(e.time.minutes);
      });
      break;
    case 2:
      var timePicker = $('#timepicker');
      var datePicker = $('#datepicker');
      this.objectToSend.date.setDate(datePicker[0].data.date.getDate());
      this.objectToSend.date.setMonth(datePicker[0].data.date.getMonth());
      this.objectToSend.date.setFullYear(datePicker[0].data.date.getFullYear())
      $('#setTime').addClass('hidden');
      $('#setWeather').removeClass('hidden');
      break;
    case 3:
      this.objectToSend.visible.aurora = $('#aurora')[0].checked;
      this.objectToSend.visible.bird = $('#bird')[0].checked;
      this.objectToSend.visible.moon = $('#moon')[0].checked;
      this.objectToSend.visible.sun = $('#sun')[0].checked;
      var canvasInput = $('#canvasInput')[0];
      canvasInput.value = JSON.stringify(this.objectToSend);
      canvasInput.form.submit();
      break;
  }
}

ImageEditor.prototype.draw = function()
{
  if(!this.needToUpdate)
    return;

  this.needToUpdate = false;

  var lpreview = $('#preview');
  var previewContext = lpreview[0].getContext('2d');

  var imageRatio = this.mImage.width / this.mImage.height;
  var lSize = this.mSize;
  var sizeX, sizeY;
  var clampValX, clampValY;
  if(imageRatio > 1.)
  {
    lSize = this.mSize;
    sizeX = lSize * imageRatio;
    sizeY = lSize;
  }
  else
  {
    lSize = this.mSize;
    sizeX = lSize;
    sizeY  = lSize / imageRatio;
  }

  var clampValX = sizeX - 400;
  var clampValY = sizeY - 400;

  this.mPosition.x = Math.max(Math.min(0, this.mPosition.x), -clampValX);
  this.mPosition.y = Math.max(Math.min(0, this.mPosition.y), -clampValY);
  previewContext.drawImage(this.mImage,this.mPosition.x, this.mPosition.y, sizeX, sizeY );
  //previewContext.drawImage(this.mImage, this.mPosition.x, this.mPosition.y, this.mSize, this.mSize, 0, 0, 400, 400);
  
  var previewURL = lpreview[0].toDataURL("image/jpeg");
  this.objectToSend.image = previewURL;
}



