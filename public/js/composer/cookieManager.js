
function CookieManager()
{

}

CookieManager.prototype.set = function(c_name, aID) 
{
	var exdays = 1;
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(aID) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;

};

CookieManager.prototype.get = function(c_name)
{
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1)
	  {
	  c_start = c_value.indexOf(c_name + "=");
	  }
	if (c_start == -1)
	  {
	  c_value = null;
	  }
	else
	  {
	  c_start = c_value.indexOf("=", c_start) + 1;
	  var c_end = c_value.indexOf(";", c_start);
	  if (c_end == -1)
	  {
	c_end = c_value.length;
	}
	c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}

CookieManager.prototype.check = function(aName, aDefault)
{
	var lID=this.get(aName);
	if (lID!=null && lID!="")
	{
		return lID;
	}
	else 
	{
		lID = aDefault;
		this.set(aName, lID);
		return lID;
	}
}