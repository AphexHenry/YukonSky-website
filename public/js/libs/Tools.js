
// svg color change.
function adaptAllSVG() {
    /*
     * Replace all SVG images with inline SVG
     */
        jQuery('img.svg').each(function(){adaptSVG(this);});
};

function adaptSVG(element)
{
    var $img = jQuery(element);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');
    var imgOnClick = $img.attr('onclick');
    var dataplacement=$img.attr('svgdata-placement');
    var datacontent=$img.attr('svgdata-content');

    jQuery.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass);
        }

        // Add replaced image's classes to the new SVG
        if(typeof datacontent !== 'undefined') {
            $svg = $svg.attr('data-content', datacontent);
        }

        // Add replaced image's classes to the new SVG
        if(typeof dataplacement !== 'undefined') {
            $svg = $svg.attr('data-placement', dataplacement);
        }
        
        // Add replaced image's onclick method to the new SVG
        if(typeof imgOnClick !== 'undefined') {
            $svg = $svg.attr('onclick', imgOnClick);
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');
        
        // Replace image with new SVG
        $img.replaceWith($svg);
    });

}

/* helps generating unique tokens for users and rooms */
function uniqueToken() {
    var s4 = function () {
        return Math.floor(Math.random() * 0x10000).toString(16);
    };
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4();
}

function myRandom(aMin, aMax)
{
	return aMin + (Math.random() * (aMax - aMin));
}

function RandInt(aValue)
{
    return Math.floor(Math.random() * aValue);
}

function myClamp(val, min, max)
{
    return Math.max(min, Math.min(max, val))
}

function fMod(value, limit)
{
    return ((value * 1000) % (limit * 1000)) / 1000.;
}

function GetCosInterpolation(aVal)
{
    return( 1. - (1. + Math.cos(Math.min(1., aVal) * Math.PI)) * 0.5);
}

function isdefined( variable)
{
    return (typeof(variable) == "undefined")?  false: true;
}

function quitFullscreen(element)
{
        if(document.cancelFullScreen) {
                //fonction officielle du w3c
                document.cancelFullScreen();
        } else if(document.webkitCancelFullScreen) {
                //fonction pour Google Chrome
                document.webkitCancelFullScreen();
        } else if(document.mozCancelFullScreen){
                //fonction pour Firefox
                document.mozCancelFullScreen();
        }
}

function enterFullscreen(element) {
    if(element.requestFullScreen) {
            //fonction officielle du w3c
            element.requestFullScreen();
    } else if(element.webkitRequestFullScreen) {
            //fonction pour Google Chrome (on lui passe un argument pour autoriser le plein écran lors d'une pression sur le clavier)
            element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if(element.mozRequestFullScreen){
            //fonction pour Firefox
            element.mozRequestFullScreen();
    } else {
            alert('Votre navigateur ne supporte pas le mode plein écran, il est temps de passer à un plus récent ;)');
    }
};

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbTohsv (r,g,b) {
 var computedH = 0;
 var computedS = 0;
 var computedV = 0;

 //remove spaces from input RGB values, convert to int
 var r = parseInt( (''+r).replace(/\s/g,''),10 ); 
 var g = parseInt( (''+g).replace(/\s/g,''),10 ); 
 var b = parseInt( (''+b).replace(/\s/g,''),10 ); 

 if ( r==null || g==null || b==null ||
     isNaN(r) || isNaN(g)|| isNaN(b) ) {
   alert ('Please enter numeric RGB values!');
   return;
 }
 if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
   alert ('RGB values must be in the range 0 to 255.');
   return;
 }
 r=r/255; g=g/255; b=b/255;
 var minRGB = Math.min(r,Math.min(g,b));
 var maxRGB = Math.max(r,Math.max(g,b));

 // Black-gray-white
 if (minRGB==maxRGB) {
  computedV = minRGB;
  return {h:0,s:0,v:computedV};
 }

 // Colors other than black-gray-white:
 var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
 var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
 computedH = 60*(h - d/(maxRGB - minRGB)) / 360;
 computedS = (maxRGB - minRGB)/maxRGB;
 computedV = maxRGB;
 return {h:computedH,s:computedS,v:computedV};
}

function loadjsfile(filename, callback, isGUI)
{
    var oHead = $('head')[0];

    var fileref=document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", filename);
    fileref.onerror = function(){console.log("wrong file.")};

    oHead.appendChild(fileref);

    fileref.onload = function(){
        setTimeout(callback(isGUI), 200);
    };
}

function getFunctionByName(functionName) {
    return window[functionName];
}

var NAME_USER = "AphexHenry";
var NAME_VISUAL = "Visual2";
