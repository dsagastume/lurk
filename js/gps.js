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
			timeout : 20000,
			maximumAge : 1000
		};
		gps.GPSWatchId = navigator.geolocation.watchPosition(gps.onSuccess,
				gps.onError, gpsOptions);

		console.log("Start GPS");
//		alert("Start");
	},
	stop : function() {
		navigator.geolocation.clearWatch(gps.GPSWatchId);
//		gps.GPSWatchId = null;
//		navigator.geolocation.stop;
		gps.gpsErrorCount = 0;
		console.log("Stop GPS");
	},
	onSuccess : function(position) {
		// reset error counter
		gpsErrorCount = 0;

		app.position = position;

        if (app.username != null) {
            app.submitLocation();            
        }

		$("#latitude").html("Latitude: " + position.coords.latitude);
		$("#longitude").html("Longitude: " + position.coords.longitude);
	},
	onError : function(error) {
		gps.gpsErrorCount++;
        
        alert(error.code);
        
        if (error.code === 1) {
            app.setStatus("g");
        }

        gps.stop();
        gps.start();
        console.log("HIGH_GPS_ACCURACY: " + app.HIGH_GPS_ACCURACY);
        
		if (gps.gpsErrorCount > 3) {
			// Restart GPS listener, fixes most issues.
/*
			if (app.HIGH_GPS_ACCURACY === true) {
				app.HIGH_GPS_ACCURACY = false;
			} else {
				app.HIGH_GPS_ACCURACY = true;
			}
*/
//			app.setStatus("x");
		}
	}
};
