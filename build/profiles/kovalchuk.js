Profiles.kovalchuk = {
	// DefaultBroker = "192.168.97.1",
	DefaultBroker : "iot.games",

	WinLevel: 2,

	Limits : {
		'luminocity' : 1500,
		'temperature' : 30,
		'humidity' : 50,
		'pressure' : 1
	},

	Buildings : {
		'Калининград' : {
			'luminocity' : ["807b859020000408"],
			'temperature' : ["807b85902000036a"],
			'humidity' : ["807b85902000051c"],
			'pressure' : ["807b85902000050b"],
		},

		'Москва' : {
			'luminocity' : ["807b85902000035f"],
			'temperature' : ["807b85902000040c"],
			'humidity' : ["807b859020000406"],
			'pressure' : ["807b85902000040e"],
		},
		'Новосибирск' : {
			'luminocity' : ["807b859020000401"],
			'temperature' : ["807b85902000035b"],
			'humidity' : ["807b859020000407"],
			'pressure' : ["807b85902000049d"],
		},
		'Владивосток' : {
			'luminocity' : ["807b859020000570"],
			'temperature' : ["807b859020000518"],
			'humidity' : ["807b85902000050a"],
			'pressure' : ["807b859020000239"],
		},
/*		'robots' : {
			'luminocity' : ["807b85902000051d"],
			'temperature' : ["807b859020000570"]
		},
*/
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

