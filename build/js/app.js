//************ SETTINGS **************
var WinLevel = 1;
var WinnerCount = 0;
StageIndexMax = 8;
DevTypeCount = 4;
var ResetLevelIfNotContinuous = false;

var mqtt = {
	host: "localhost",
	port: 1884,
	client: "Display"
};

//************************************

var Winners = [];
var Active = false;
var Connected = false;

Client = undefined;



function init() {
	$("body").keydown(function(event) {
		if (event.which == 84 && event.shiftKey && event.ctrlKey) {
			event.preventDefault();
			if (!Connected) return;
			console.log("Test mode!");
			$("#test").show();
			test();
		} else if (event.which == 32 && Active === false) {
			event.preventDefault();
			if (!Connected) return;
			$("#start").fadeOut(1500);
			$("#cloud0,#cloud1,#cloud2,#container2").fadeIn(1500);
			Active = true;	
		}
	});

	for (var group in Buildings) {
		Values[group] = {};
		for(var devtype in Buildings[group]) {
			Values[group][devtype] = { value:0, level: 0, win: false} ;
			var euis = Buildings[group][devtype];
			for(var i in euis) {
				var eui = euis[i];
				Devices[eui] = { eui: eui, type: devtype, group: group };
			}
		}
	}
	
	var cont = $("#container2");
	for (var group in Buildings) {
		var g = $("<div>").addClass("group").attr("id","group_"+group);	
		var place = $("<div>").addClass("place").attr("id","place_"+group);
		var img = $("<img>").attr("id", "house_"+group).attr("src", "img/house/0/0.png").addClass("house");
		g.append(place);
		g.append(img);
		g.append($("<p>").text(group));
		
		var bg = $("<div>").addClass("bargroup").attr("id","bg_"+group);
		


		for (var devtype in Buildings[group]) {
			var euis = Buildings[group][devtype];
			var euis_str = euis.join(', ');
			var id = group+'_'+devtype;
			var barcol = $("<div>").addClass("barcol").attr("id",id);
			var bar = $("<div>").addClass("bar").attr("device",devtype);
			for (var l = WinLevel; l > 0; l--) {
				bar.append($("<div>").addClass("barcell").addClass("bc_"+l));
			}
			var icon = $("<img>").addClass("icon").attr("src","img/icons/dev/"+devtype+".png").attr("title", euis_str);
			barcol.append(bar);
			barcol.append(icon);	
			bg.append(barcol);
			
		}
		g.append(bg);
		cont.append(g);
	}

	
}

function blinkIcon(eui) {
	var device = Devices[eui];
	var id = device.group + '_' + device.type;
	$("#"+id+" img.icon").addClass("iconq").addClass("con");
	setTimeout(function(){
		$("#"+id+" img.icon").removeClass("iconq")
	},500);
}

function updateUI(groups) {
	var GroupCount = Object.keys(Buildings).length;
	for (var group in groups) {
		var DevTypeCount = Object.keys(Buildings[group]).length;
		if (groups[group].stage >= DevTypeCount && Winners[group] === undefined) {
			WinnerCount++;
			Winners[group] = WinnerCount;
			$("#place_"+group).text(Winners[group]).addClass("p"+WinnerCount);
			$("#bg_"+group).hide();

			if (WinnerCount >= GroupCount) {
				$("#cloud0").fadeOut(2000).animate({top:"-35%"}, 2000);
				$("#cloud1").animate({left:"-100%"}, 2500);
				$("#cloud2").animate({left:"100%"}, 2500);
				$("#sun").animate({top:"40px"}, 1500);
			}
		}
		var imgIndex = Math.round(StageIndexMax * (groups[group].stage / DevTypeCount));
		$("#house_"+group).attr("src", "img/house/0/"+imgIndex+".png");

		for (var type in groups[group].devTypes) {
			var id = group + '_' + type;
			if (groups[group].devTypes[type].level >= WinLevel) {
				$("#"+id).addClass("barfull");
			} else if (groups[group].devTypes[type].level == 0) {
				$("#"+id+" div").removeClass("full");
			} else {	
				$("#"+id+" div.bc_"+groups[group].devTypes[type].level).addClass("full");
			}
		}
		
	}
}

function update() {
	var groups = [];
	for (var group in Buildings) {
		groups[group] = {stage:0, devTypes:{}};
		for (type in Buildings[group]) {
			groups[group].devTypes[type] = Values[group][type]; 
			if (Values[group][type].win === true) groups[group].stage++;
		}
	}
	updateUI(groups);
}

var testTimer = undefined;
function test() {
	function stop() {
		clearInterval(testTimer);
		testTimer = undefined;
	}
	function boom() {
		var euis = Object.keys(Devices);
		var count = euis.length;
		var index = 0	


		for (key in Devices) {
			var group = Devices[key].group;
			var type = Devices[key].type;	
			if (Values[group][type].win === true) index++;
		}
		
		if (index >= count) {
			return stop();
		}

		var group;
		var type;
		do {
			index = Math.floor(Math.random() * count);
			group = Devices[euis[index]].group;
			type = Devices[euis[index]].type;	
		} while (Values[group][type].win);

		var topic = "devices/lora/server";
		var dev = Devices[euis[index]];
		var msg = {data:{},status:{devEUI:dev.eui}};
		msg.data[dev.type] = Math.floor(Math.random()*Limits[dev.type]*0.4+Limits[dev.type]*0.9);

		Client.publish(topic, JSON.stringify(msg));
	}
	if (testTimer) {
		return stop();
	}
	testTimer = setInterval(boom, 1000);
}
function onError() {
	console.warn("Connection error!");
	if (!Active) $("#start").hide();
	$("#error").show();
}
function onConnected() {
	console.log("connected");
	if (!Active) $("#start").show();
	$("#error").hide();
	Connected = true;
	Client.subscribe("devices/lora/#");
};

function onConnectionLost(responseObject) {
	console.warn("Disconnected!");
	if (!Active) $("#start").hide();
	$("#error").show();
	Connected = false;
	if (responseObject.errorCode !== 0) {

	}
};
function onMessageArrived(message) {
   	var str = message.payloadString;
	var obj = undefined;
	var eui = "";
	console.log(str);

	if (Active === false) return;

	try {
		obj = JSON.parse(str);
		if (obj.data == undefined || obj.status == undefined) return;
		eui = obj.status.devEUI.toLowerCase();
		blinkIcon(eui);
	}
    	catch (e) {
		console.error("Not a valid JSON: " + str);
		return;
    	}

		
	try {
		if (Devices[eui].win == true) return;
	}
    	catch (e) {
		console.error("EUI is not registered: " + eui);
		return;
    	}
			
		

	var type = Devices[eui].type;
	var group = Devices[eui].group;
	var value = obj.data[type];

	if (value >= Limits[type]) {
		if (Values[group][type].value >= Limits[type] || ResetLevelIfNotContinuous === false) {
			Values[group][type].level++;
			
			if (Values[group][type].level >= WinLevel) {
				Values[group][type].win = true;
				console.log("Group `" + group + '` has done '+ type);
			}
		} else if (ResetLevelIfNotContinuous === true) {
			Values[group][type].level = 1;
		}
	}

	Values[group][type].value = value;

	try {
		update();
	} catch (e) {
		console.log(e);
	}
	
    	if (obj.data !== undefined) {

    	}

};

function connect(host) {
	var h = typeof host === "undefined" ? mqtt.host : host;
	console.log("Connecting to "+ h);
	Client = new Paho.MQTT.Client(h, mqtt.port, mqtt.client);
	Client.onConnectionLost = onConnectionLost;
	Client.onMessageArrived = onMessageArrived;
	Client.connect({
		onSuccess: onConnected,
		onFailure: onError
	});
}

$(document).ready(function(){
	init();
	
	if (mqtt.host == "localhost") {
		host = prompt("MQTT Broker address", "192.168.97.1");
		connect(host);
	} else {
		connect();
	}
	
});


/*
mosquitto_pub -h localhost -t "devices/lora/server" -m "{\"data\": {\"luminosity\": 1300,\"Address\": \"C\"},\"status\":{\"devEUI\": \"807b85902000040a\",\"rssi\": 0,\"temperature\": 0,\"battery\": 0,\"date\":\"2017-02-21T13:02:21.147555Z\"}}"
*/
