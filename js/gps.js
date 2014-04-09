/*
 * David Rust-Smith & Nick Breen - August 2013
 *
 * Apache 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. 
 */

var gps = {
	GPSWatchId : null,
	gpsErrorCount : 0,

	init : function() {
//		gps.initToggleListener();
		gps.start();
	},
	/*
	initToggleListener : function() {
		$('#locationToggle').bind("change", function(event, ui) {
			if (this.value == "true") {
				gps.start();
			} else {
				gps.stop();
			}
		});
	},
	*/
	start : function() {
		var gpsOptions = {
			enableHighAccuracy : app.HIGH_GPS_ACCURACY,
			timeout : 5000,
			maximumAge : 500
		};
		gps.GPSWatchId = navigator.geolocation.watchPosition(gps.onSuccess,
				gps.onError, gpsOptions);

		console.log("start");
//		alert("Start");
	},
	stop : function() {
		navigator.geolocation.clearWatch(gps.GPSWatchId);
		gps.GPSWatchId = null;
//		navigator.geolocation.stop;
		gps.gpsErrorCount = 0;
	},
	onSuccess : function(position) {
		// reset error counter
		gpsErrorCount = 0;

//		alert("Success!");

		app.position = position;
		app.submitToServer();

		elem = document.getElementById('locationInfo');
//		this.successElement(elem);

/*
		elem.innerHTML = ('Latitude: ' + position.coords.latitude.toFixed(6)
				+ '<br/>' + 'Longitude: '
				+ position.coords.longitude.toFixed(6) + '<br/>');
*/

		elem.innerHTML = ('Latitude: ' + position.coords.latitude
				+ '<br/>' + 'Longitude: '
				+ position.coords.longitude + '<br/>');

//				+ 'Last Update: ' + app.getReadableTime(position.timestamp));
	},
	onError : function(error) {
		gps.gpsErrorCount++;

		if (gps.gpsErrorCount > 3) {
			/*
			elem = document.getElementById('locationInfo');
			$(elem).removeClass("success");
			$(elem).addClass("fail");
			elem.innerHTML = ('There is an error, restarting GPS. '
					+ app.getReadableTime(new Date()) + "<br/> message:" + error.message);
			console.log('error with GPS: error.code: ' + error.code
					+ ' Message: ' + error.message);
*/
			// Restart GPS listener, fixes most issues.
			gps.stop();
			gps.start();
		}
	}
};
