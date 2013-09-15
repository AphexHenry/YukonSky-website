
/*
	Poster component
*/
var Poster = function () {
	this.el = document.createElement('img');
	this.loaded = false;
};

Poster.prototype.load = function (src, callback, errorCallback) {
	this.loaded = false;
	var that = this;
	this.el.setAttribute('src', src);
	this.el.onerror = function(){
		errorCallback();
	}
	this.el.onload = function (e) {
		this.loaded = true;
		if (callback) callback();
	};
};

Poster.prototype.isLoaded = function()
{
	return this.loaded;
}

Poster.prototype.getElement = function () {
	return this.el;
};

/*
	Video Component
*/
var Video = function () {
	this.loaded = false;
	this.duration = 'test';
	this.src = document.createElement('source');
	this.src.setAttribute('type', 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
	this.el = document.createElement('video');
	this.el.appendChild(this.src);
	this.el.style.display = "none";
	this.positionStart = 0.; // minimum position in the video for the loop.
	this.positionEnd = 1.;	// maximum position in the video for the loop.
	this.shuffle = false;
	this.shuffleTimer = 0.;
	this.backNForth = false;
	return this;
}

/*
	set the min and max position (from 0 to 1).
*/
Video.prototype.setBounds = function(aMin, aMax)
{
	this.positionStart = aMin;
	this.positionEnd = aMax;
}

Video.prototype.rewind = function()
{
	if(this.isLoaded())
	{
		this.el.currentTime = 0;
	}
}

Video.prototype.setSpeed = function(aSpeed)
{
	this.el.playbackRate = aSpeed;
}


Video.prototype.setVolume = function(aVolume)
{
	this.el.volume = aVolume;
}

Video.prototype.setShuffle = function(aValue)
{
	this.shuffle = aValue;
}

Video.prototype.load = function (src, callback) {
	this.el.style.display = "";
	var that = this;
	var duration = 0;

	var loadedData = function (e) {
		duration = that.el.duration;
		logger.log('loadeddata duration: ' + duration);
	};
	var canplaythrough = function (e) {
		logger.log('canplaythrough');
		that.loaded = true;
		that.duration = that.el.duration;
		callback(null, {duration: duration});
		removeEventListeners();
	};
	var error = function (e) {
		removeEventListeners();
		callback('error', null);
	};
	var addEventListeners = function () {
		$(that.el).bind('loadeddata', loadedData);
		$(that.el).bind('canplaythrough', canplaythrough);
		$(that.el).bind('error', error);
	};
	var removeEventListeners = function () {
		$(that.el).unbind('loadeddata', loadedData);
		$(that.el).unbind('canplaythrough', canplaythrough);
		$(that.el).unbind('error', error);
	};
	addEventListeners();

	this.el.setAttribute('src', src);
};

Video.prototype.setLoop = function(aLoop)
{
	this.el.loop = aLoop;
}

Video.prototype.setBackForth = function(aValue)
{
	this.backNForth = aValue;
}

Video.prototype.isPlaying = function()
{
	return !this.el.paused;
}

Video.prototype.play = function (callback) {
	var that = this;
	var ended = function (e) {
		removeEventListeners();
		if (callback) callback(null, 'ended');
	};
	var stalled = function (e) {
		// if (callback) callback('stalled');
	};
	var addEventListeners = function () {
		$(that.el).bind('ended', ended);
		$(that.el).bind('stalled', stalled);
	};
	var removeEventListeners = function () {
		$(that.el).unbind('ended', ended);
		$(that.el).unbind('stalled', stalled);
	};
	addEventListeners();

	this.el.play();
};

Video.prototype.update = function(aDelta)
{
	if(this.el.playbackRate < 0.)
	{
		this.el.currentTime += 1. * aDelta * this.el.playbackRate;
	}

	if((this.el.currentTime >= this.positionEnd * this.el.duration * 0.98) && this.el.playbackRate > 0)
	{
		if(this.backNForth)
		{
			this.el.playbackRate = -Math.abs(this.el.playbackRate);
		}
		else if(this.el.loop || this.shuffle)
		{
			this.el.currentTime = this.positionStart * this.el.duration;
		}
	}
	else if((this.el.currentTime <= this.positionStart * this.el.duration * 0.98) && this.el.playbackRate < 0)
	{
		if(this.backNForth)
		{
			this.el.playbackRate = Math.abs(this.el.playbackRate);
		}
		else if(this.el.loop || this.shuffle)
		{
			this.el.currentTime = this.positionEnd * this.el.duration;
		}
	}

	if(this.shuffle)
	{
		this.shuffleTimer -= 0.03;
		if(this.shuffleTimer < 0)
		{
			this.shuffleTimer = Math.random() + 0.1;
			this.el.currentTime = this.positionStart + (this.positionEnd - this.positionStart) * Math.random();
		}
	}
}

Video.prototype.stop = function () {
	this.el.pause();
}

Video.prototype.isLoaded = function () {
	return this.loaded;
}

Video.prototype.getDuration = function () {
	return this.duration;
}

Video.prototype.setClass = function(value) {
	value = value ? value : '';
	this.el.setAttribute('class', value);
}

Video.prototype.show = function () {
	this.el.setAttribute('class', 'video-js show');
}

Video.prototype.hide = function () {
	this.el.setAttribute('class', 'video-js hide');
}

Video.prototype.scaleUp = function () {
	this.el.setAttribute('class', 'video-js show large');
}

Video.prototype.scaleDown = function () {
	this.el.setAttribute('class', 'video-js show');
}

Video.prototype.getElement = function () {
	return this.el;
};

/*
	Vine Component: contains a poster and a video element.
*/
var VineComponent = function () {
	this.data = {};
	this.position = '';
	this.poster = new Poster();
	this.video = new Video();
	this.el = document.createElement('div');
	this.el.appendChild(this.poster.getElement());
	this.el.appendChild(this.video.getElement());
	this.el.component = this;
	this.setVine();
	this.el.onclick=function()
	{
		console.log(this.component);
		if($(this).hasClass('show'))
		{
			this.component.stopVideo();
		}
		else
		{
			jQuery('.vine.show').each(function()
				{
					this.component.stopVideo()
				});
			this.component.setVolume(0);
			this.component.loadVideo();
			this.component.togglePlay();
			this.component.show();
		}
	};

	this.el.getComponent = function(){return this.component;};

	return this;
};

/*
	Update components, only called when in the mixer.
*/
VineComponent.prototype.update = function(aDelta)
{
	this.video.update(aDelta);
}

/*
	set the min and max position of the video element (from 0 to 1).
*/
VineComponent.prototype.setVideoBounds = function(aMin, aMax)
{
	this.video.setBounds(aMin, aMax);
}

/*
	Sets the in the component.
*/
VineComponent.prototype.setData = function (data) {
	this.data = data;
};

/*
	Set class container to fit into the stage.
*/
VineComponent.prototype.setBig = function()
{
	$(this.el.parentNode).removeClass("span1");
	$(this.el.parentNode).addClass("span3");
}

/*
	Set class container to fit into the pick panel.
*/
VineComponent.prototype.setSmall = function()
{
	$(this.el.parentNode).removeClass("span3");
	$(this.el.parentNode).addClass("span1");
}

VineComponent.prototype.setVideoSource = function(aSrc)
{
	this.data.stream = aSrc;
}

VineComponent.prototype.setPosition = function () {
	this.position = DOMUtils.getPosition(this.el);
}
 
/*
	Loads the poster image for this component.
	Assumes the component data property is set.
*/
VineComponent.prototype.loadPoster = function (callback) {
	var that = this;
	this.poster.load(this.data.image, function() {
		that.idle();
		if (callback) callback();
	}, function(){/*that.loadVideo(function(er){if (er =="error"){that.destroySelf()}});*/});
};

VineComponent.prototype.createPoster = function () {
	this.poster = new Poster(0, 0);
	this.el.appendChild(this.poster.getElement());
}

VineComponent.prototype.destroyPoster = function () {
	$(this.el).children().filter('img').each(function() {
		$(this).remove();
    delete(this);
  });
  this.poster  = null;
}

/*
	Loads the video stream for this component.
	Returns the duration of the video in seconds in the callback.
*/
VineComponent.prototype.loadVideo = function (callback) {
	var that = this;
	if (this.video.isLoaded() && this.video.el.src == this.data.stream) {
		logger.log('video already loaded');
		if(isdefined(callback))
		{
			callback(null, 'loaded');
		}
		return;
	}
	this.video.load(this.data.stream, function (err, res) {
		if (err) {
			callback(err);
			return;
		}
		that.destroyPoster();
		logger.log(that.video);
		if (isdefined(callback)) callback(null, res);
	});
};

VineComponent.prototype.playVideo = function (callback) {
	var that = this;
	this.video.play(function(err, res) {
		if (err) {
			logger.log(err);
			if(isdefined(callback))
			{
				callback(err, res);
			}
			return;
		}
		that.scaleDown();
		if(isdefined(callback))
		{
			callback(null, res);
		}
	});
};

VineComponent.prototype.setShuffleVideo = function(aValue)
{
	this.video.setShuffle(aValue);
}

VineComponent.prototype.setBackForthVideo = function(aValue)
{
	this.video.setBackForth(aValue);
}

VineComponent.prototype.stopVideo = function (callback) {
	this.scaleDown();
	this.video.stop();
};

VineComponent.prototype.setVideoSpeed = function(aSpeed)
{
	this.video.setSpeed(aSpeed);
}

VineComponent.prototype.setVolume = function(aVolume)
{
	this.video.setVolume(aVolume);
}

VineComponent.prototype.togglePlay = function () {
	if(this.video.isPlaying())
	{
		this.stopVideo();
	}
	else
	{
		this.playVideo();
	}
};

VineComponent.prototype.setLoop = function (aLoop)
{
	this.video.setLoop(aLoop);
}

VineComponent.prototype.rewindVideo = function () {
	this.video.rewind();
};

VineComponent.prototype.createVideo = function () {
	this.video = new Video(0, 0);
	this.el.appendChild(this.video.getElement());
};

VineComponent.prototype.destroyVideo = function () {
	$(this.el).children().filter('video').each(function() {
    this.pause();
    delete this.el.component;
    $(this).remove();
    delete(this);
  });
  this.video = null;
};

VineComponent.prototype.destroySelf = function()
{
	// need to destroy also the container.
	this.el.parentNode.parentNode.removeChild(this.el.parentNode);
}

VineComponent.prototype.show = function () {
	this.el.setAttribute('class', 'vine show');
}

VineComponent.prototype.setVine = function () {
	this.el.setAttribute('class', 'vine');
}

VineComponent.prototype.idle = function () {
	this.el.setAttribute('class', 'vine idle');
}

VineComponent.prototype.scaleDown = function () {
	this.idle();
	this.video.scaleDown();
}

VineComponent.prototype.getDuration = function () {
	return this.video.getDuration();
}

VineComponent.prototype.getElement = function () {
	return this.el;
};

VineComponent.prototype.getData = function () {
	return this.data;
};

VineComponent.prototype.getVideoSpeed = function () 
{
	return this.video.el.playbackRate;
}

VineComponent.prototype.getVideoBounds = function () 
{
	return {min:this.video.positionStart, max:this.video.positionEnd};
}

VineComponent.prototype.getVideoLoop = function () 
{
	return this.video.el.loop;
}

VineComponent.prototype.getVideoBackNForth = function () 
{
	return this.video.backNForth;
}

VineComponent.prototype.getVideoShuffle = function () 
{
	return this.video.shuffle;
}

VineComponent.prototype.getFrame = function () 
{
	if ( this.video.isLoaded())
	{
		return this.video.el;
	}
	else if(this.poster.isLoaded())
	{
		return this.poster.getElement();
	}
	else
	{
		return null;
	}
};