
var StringUtils = {
	strdecode: function ( data ) {
    return JSON.parse( decodeURIComponent( escape ( data ) ) );
 	}
}
var DOMUtils = {
	 getPosition: function (el) {
		var origin = '';
		var rect = el.getBoundingClientRect();
		var hCenter = window.innerWidth  * 0.5;
		var vCenter = window.innerHeight * 0.5;
		origin += rect.top  < vCenter ? 't' : 'b';
		origin += rect.left < hCenter ? 'l' : 'r';
		return origin;
	}
}

function isdefined( variable)
{
    return (typeof(variable) == "undefined")?  false: true;
}