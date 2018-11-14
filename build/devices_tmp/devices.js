var Devices = {};
var Values = {};

Limits = {
	'luminocity' : 600,
	'temperature' : 28,
	'humidity' : 50,
	'pressure' : 900
};

var Buildings = {
	'security' : {
		'luminocity' : ["807b859020000407"],
		'temperature' : ["807b85902000051c"]
	},
	'power' : {
		'luminocity' : ["807b85902000035f"],
		'temperature' : ["807b85902000045f"]
	},
	'transport' : {
		'luminocity' : ["807b85902000040e"],
		'temperature' : ["807b859020000518"]
	},
	'skynet' : {
		'luminocity' : ["807b859020000520"],
		'temperature' : ["807b85902000051a"]
	},
	'robots' : {
		'luminocity' : ["807b85902000021c"],
		'temperature' : ["807b859020000409"]
	},
}
/* EXAMPLE:
var Buildings = {
	'security' : {
		'luminocity' : ["807b85902000050b", "807b85902000040e"],
		'temperature' : ["807b85902000051c", "807b859020000518"]
	},
	'robots' : {
		'luminocity' : ["807b85902000021c", "807b85902000035f"],
		'temperature' : ["807b859020000409", "807b85902000045f"]
	}
}
*/

