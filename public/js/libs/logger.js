
var logger = {
	debug: false,
	log: function (message) {
		if (logger.debug)	console.log(message);
	}
};