
var FR = true;

var onloadMain = function() {
  // Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}
  

  // Setup the dnd listeners.
  var dropZone = document.getElementById('dropzone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);

  if(FR)
  {
    $(".enCapt").addClass("hidden");
    $("#localisation").html("<h4> En /<strong> Fr </strong></h4>")
  }

  function handleFileSelect(evt) 
  {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0; i < 1; i++) 
    {
      var f = files[i];
      var reader = new FileReader();
      reader.date = f.lastModifiedDate;

      // Closure to capture the file information.
      reader.onload = (function(theFile) 
      {
        return function(e) 
        {
          // Render thumbnail.
          var lPreviewHidden = $('#previewHidden');
          var date = this.date;//.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate();
          lPreviewHidden.load(function(){
            sImageEditor.init(this, date);
          });
          lPreviewHidden.attr('src', e.target.result);

          $('#textdrag').css('display', 'none');
          $('#sendButton').removeClass('hidden');
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);

    }
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  function animate() {
      sImageEditor.draw();
      requestAnimationFrame( animate );
  }

  animate();

}

function toggleLocalisation()
{
  FR = !FR;
  if(FR)
  {
    $(".enCapt").addClass("hidden");
    $(".frCapt").removeClass("hidden");
    $("#localisation").html("<h4> En /<strong> Fr </strong></h4>")
  }
  else
  {
    $(".frCapt").addClass("hidden");
    $(".enCapt").removeClass("hidden");
    $("#localisation").html("<h4><strong> En </strong>/ Fr </h4>")
  }
}

function FlyClicked()
{
  window.location.href = "/fly";
}

window.onload = onloadMain;
