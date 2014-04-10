/*
 * 
 * LURK
 *
 */

var gps = {
	GPSWatchId : null,
	gpsErrorCount : 0,

	init : function() {
		gps.start();
	},
	start : function() {
		var gpsOptions = {
			enableHighAccuracy : app.HIGH_GPS_ACCURACY,
			timeout : 5000,
			maximumAge : 500
		};
		gps.GPSWatchId = navigator.geolocation.watchPosition(gps.onSuccess,
				gps.onError, gpsOptions);

		console.log("Start GPS");
//		alert("Start");
	},
	stop : function() {
		navigator.geolocation.clearWatch(gps.GPSWatchId);
		gps.GPSWatchId = null;
//		navigator.geolocation.stop;
		gps.gpsErrorCount = 0;
		console.log("Stop GPS");
	},
	onSuccess : function(position) {
		// reset error counter
		gpsErrorCount = 0;

		app.position = position;
		app.submitToServer();

		$("#locationInfo").html(
			"Latitude: " + position.coords.latitude + "<br/>" + 
			"Longitude: " + position.coords.longitude + "<br/>"
		);
	},
	onError : function(error) {
		gps.gpsErrorCount++;

		if (gps.gpsErrorCount > 3) {
			// Restart GPS listener, fixes most issues.
			gps.stop();
			gps.start();
		}
	}
};
