Profiles.kovalchuk = {
	// DefaultBroker = "192.168.97.1",
	DefaultBroker : "iot.games",

	Limits : {
		'luminocity' : 5000,
		'temperature' : 28,
		'humidity' : 70,
		'pressure' : 900
	},

	Buildings : {
		'Москва' : {
			'luminocity' : ["807b859020000408"],
			'temperature' : ["807b85902000036a"],
			'humidity' : ["807b85902000051c"]
		},
		'Нью-Йорк' : {
			'luminocity' : ["807b859020000401"],
			'temperature' : ["807b85902000035b"],
			'humidity' : ["807b859020000407"]
		},
		'Владивосток' : {
			'luminocity' : ["807b859020000570"],
			'temperature' : ["807b859020000518"],
			'humidity' : ["807b85902000050a"]
		},
		'Бужумбура' : {
			'luminocity' : ["807b85902000035f"],
			'temperature' : ["807b85902000040c"],
			'humidity' : ["807b859020000406"]
		},
	}
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

