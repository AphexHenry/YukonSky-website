
function StyleManager()
{
  $(".square").each(resize);

  $(".fit").each(fitElement);
}


function fitElement() 
{
    $(this).css("height", window.innerHeight);
    $(this).css("width", window.innerWidth);
    $(this).css("top", 0);
    $(this).css("left", 0);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
}

function resize() 
{
    $(this).css("height", $(this).width());
}