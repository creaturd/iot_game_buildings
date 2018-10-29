var Devices = {};
var Values = {};

Limits = {
	'luminocity' : 2000,
	'temperature' : 28,
	'humidity' : 50,
	'pressure' : 900
};

var Buildings = {
	'security' : {
		'luminocity' : ["807b859020000407", "807b859020000408"],
		'temperature' : ["807b859020000404", "807b85902000040c"]
	},
	'robots' : {
		'luminocity' : ["807b85902000021c", "807b85902000049d"],
		'temperature' : ["807b859020000409", "807b859020000518"]
	},
	'power' : {
		'luminocity' : ["807b85902000035f", "807b85902000050b"],
		'temperature' : ["807b85902000051d", "807b85902000051c"]
	},
	'skynet' : {
		'luminocity' : ["807b85902000040e", "807b859020000520"],
		'temperature' : ["807b85902000051a", "807b85902000045f"]
	},
	'transport' : {
		'luminocity' : ["807b859020000406", "807b85902000035b"],
		'temperature' : ["807b85902000050a", "807b85902000036a"]
	}
}

