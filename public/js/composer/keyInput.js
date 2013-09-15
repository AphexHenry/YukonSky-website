
function KeyInput()
{
	var that = this;
	  document.addEventListener('keydown', function(event) 
	  {
	      switch(event.keyCode)
	      {
	      	case  37:	   // left
	      		that.FadeBalance(0);
	      		break;
	        case  39:      // right
	        	that.FadeBalance(1);
	        	break;
	        case  49:      // 1
	        	that.TriggerFavoriteVideo(0);
	        	break;
	        case  50:      // 2
	        	that.TriggerFavoriteVideo(1);
	        	break;
	        case  51:      // 3
	        	that.TriggerFavoriteVideo(2);
	        	break;
	        case  52:      // 4
	        	that.TriggerFavoriteVideo(3);
	        	break;
	        case  53:      // 5
	        	that.TriggerFavoriteVideo(4);
	        	break;
	       	case  54:      // 6
	        	that.TriggerFavoriteVideo(5);
	        	break;
	        case  55:      // 7
	        	that.TriggerFavoriteVideo(6);
	        	break;
	        case  55:      // 8
	        	that.TriggerFavoriteVideo(7);
	        	break;
	        case  56:      // 9
	        	that.TriggerFavoriteVideo(8);
	        	break;
	        case  48:      // 0
	        	that.TriggerFavoriteVideo(9);
	        	break;        		        	
	      }
	  });
}

KeyInput.prototype.TriggerFavoriteVideo = function(aIndex)
{
	var lChildren = $('#favorite').children();
	var element = lChildren[Math.min(aIndex, lChildren.length - 2)];
	var lSide;
	if(!isdefined(element.children[0]))
	{
		return;
	}
	if(sLastSideFilledLeft)
	{
		lSide = $('#b-side');
	}
	else
	{
		lSide = $('#a-side');	
	}
	sLastSideFilledLeft = !sLastSideFilledLeft;
	$(lSide).append($(element).detach());
	sideReceive(element.children[0].component, lSide[0]);
}

KeyInput.prototype.FadeBalance = function(aValue)
{
	this.balanceInit = parseFloat(sVideoComposer.getBalance());
	this.balanceEnd = aValue;
	this.ratioBalance = 0.;
}

KeyInput.prototype.update = function(aTimeInterval)
{
	if(this.ratioBalance < 1)
  	{
  		this.ratioBalance += aTimeInterval * 2.;
  		if(this.ratioBalance > 1)
  		{
  			this.ratioBalance = 1;
  		}
  		var balanceCurrent = this.balanceInit + this.ratioBalance * ( this.balanceEnd - this.balanceInit );
  		$("#mixerIn").slider().slider('setValue', balanceCurrent);
  		sVideoComposer.fadeTo(balanceCurrent, 0.);
    	sCommunicationManager.syncBalance();
  	}
}