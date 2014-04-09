/*
 * 
 * LURK
 *
 */

var app = {
	SERVER_URL : "http://lurkapp.appspot.com/lurk",
	HIGH_GPS_ACCURACY : true,	// some emulators require true.

	position : null,
	deviceId : 0,
	passcode : 0,
	timeLastSubmit : 0,
	timeLastPointStore : 0,
	username: null,

	points: [],

	username : '',

	// Application Constructor
	initialize : function() {
		this.initFastClick();

//		app.bindEvents();

		app.timeLastSubmit = new Date().getTime() - 10000; 
		app.timeLastPointStore = new Date().getTime() - 350; 

		app.username = window.localStorage.getItem("username");

		$("#username").html("username: " + app.username);

		if (app.username === '') {
			alert("there is no username");
			app.newUser();
		} else {
//			app.username = window.localStorage.getItem("username");
      		app.checkConnection();
		}

	    $("#startGPS").bind("tap", function() {
      		app.checkConnection();
		});

		$("#stopGPS").bind("tap", function() {
			gps.stop();
			console.log("Stop!");
		});
	},
	bindEvents : function() {
//		document.addEventListener('deviceready', this.onDeviceReady, true);
	},
	onDeviceReady : function() {
//		navigator.splashscreen.hide();
//		alert("Device ready");
//		app.checkConnection();
	},
	initFastClick : function() {
		window.addEventListener('load', function() {
			FastClick.attach(document.body);
		}, false);
	},
	checkConnection : function() {
		console.log("Checking connection...");
		var networkState = navigator.connection.type;

		networkState = navigator.connection.type;
//			alert(networkState);
		var states = {};
		states[Connection.UNKNOWN] = 'Unknown';
		states[Connection.ETHERNET] = 'Ethernet';
		states[Connection.WIFI] = 'WiFi';
		states[Connection.CELL_2G] = 'Cell 2G';
		states[Connection.CELL_3G] = 'Cell 3G';
		states[Connection.CELL_4G] = 'Cell 4G';
		states[Connection.CELL] = 'Cell';
		states[Connection.NONE] = 'No';

		elem = document.getElementById('connectionInfo');
		elem.innerHTML = 'Internet: ' + states[networkState];
		gps.init();
	},
	
	getLatitudeAverage : function() {
		var latitudeSum = 0;
		for (var i = 0; i < app.points.length; i++) {
			latitudeSum += app.points[i].latitude;
		}

		var latitudeAverage = latitudeSum / app.points.length;

		return latitudeAverage.toFixed(8);
	},
	getLongitudeAverage : function() {
		var longitudeSum = 0;
		for (var i = 0; i < app.points.length; i++) {
			longitudeSum += app.points[i].longitude;
		}

		var longitudeAverage = longitudeSum / app.points.length;

		return longitudeAverage.toFixed(8);
	},
	setPoint : function(point) {
		app.points.push(point);
	},
	playTune : function(status) {
		// TODO everything
	}
};
