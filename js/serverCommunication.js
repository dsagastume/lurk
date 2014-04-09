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

app.newUser = function() {
	$.ajax({
		type: "POST",
        url: app.SERVER_URL+"/newuser",
        crossDomain:true,
		timeout : 10000,
		success : function(response) {
			window.localStorage.setItem("username", response);
			app.serverSuccess(response);
			app.initialize();
		},
		error : function(request, errorType, errorMessage) {
			app.serverError(request, errorType, errorMessage);
		}
	});	
}

app.submitToServer = function() {
//	var userPasscode = document.getElementById('userPasscode').value;
//	var numOfUsers = document.getElementById('numOfUsers').value;
//	numOfUsers = (numOfUsers == "") ? 1 : numOfUsers;

	if(app.position!=undefined && app.position!=null){

		var theTime = new Date().getTime();

		if ((theTime - app.timeLastPointStore) > 349) {
			app.timeLastPointStore = new Date().getTime();
			var point = {
				"latitude" : app.position.coords.latitude,
				"longitude" : app.position.coords.longitude
			}
			app.setPoint(point);

//			console.log("point added");
//			console.log(point);
		}
		else if ((theTime - app.timeLastSubmit) > 9000) {
//		if ((theTime - app.timeLastSubmit) > 100000) {
			app.timeLastSubmit = new Date().getTime();

			var latitudeAverage = app.getLatitudeAverage();
			var longitudeAverage = app.getLongitudeAverage();

			console.log(latitudeAverage + " " + longitudeAverage + " points length: " + app.points.length);

			app.points.length = 0;

//			app.checkConnection();

			$.ajax({
				type: "POST",
                url: app.SERVER_URL+"/newpoint/" + app.username + "/"+app.position.coords.latitude+"/"+app.position.coords.longitude/*+ data*/,
		        crossDomain:true,
				timeout : 10000,
				success : function(response) {
					app.serverSuccess(response);
				},
				error : function(request, errorType, errorMessage) {
					app.serverError(request, errorType, errorMessage);
				}
			});

		} 
		else {
//			console.log('too soon');
			// Too Soon: commented out because not useful for user and confusing.
			// var serverError = document.getElementById('serverResponse');
			// serverError.innerHTML = "Too soon: "+app.getReadableTime( new Date())
			// ;
		}		
	}
	else{
	navigator.notification
					.alert(
							"No position available to submit.", null,
							"99 Red Beacons Tracker");
	}
};

app.serverSuccess = function(response) {
	$("#serverResponse").html(response);

//				console.log(response);
				console.log("submitting to server");


	/*
	var responseObj = jQuery.parseJSON(response);
	var serverResponse = document.getElementById('serverResponse');
	serverResponse.innerHTML = "auto-submit: " + responseObj.message + ": "
			+ app.getReadableTime(new Date());

	
	if (responseObj.message == "not authorized") {
		if (app.forcedSubmit) {
			app.forcedSubmit = false;
			navigator.notification
					.alert(
							"This passcode is not authorized. Try again or contact Britta. Your device id is: "
									+ app.deviceId, null,
							"99 Red Beacons Tracker");
		}
		$(serverResponse).removeClass("success");
		$(serverResponse).addClass("fail");
	} else {
		if (app.forcedSubmit) {
			navigator.notification.alert("Success. Thank you!", null,
					"99 Red Beacons Tracker");
			app.forcedSubmit = false;
		}
		$(serverResponse).removeClass("fail");
		$(serverResponse).addClass("success");

		// Show or hide num of users option
		if (responseObj.advanced > 0) {
			document.getElementById("numUsersContainer").style.display = "block";
		} else {
			document.getElementById("numUsersContainer").style.display = "none";
		}
	}
	*/

};


app.serverError = function(request, errorType, errorMessage) {
	var serverError = document.getElementById('serverResponse');
	serverError.innerHTML = "Not working..."
	app.checkConnection();
};

/*
app.serverError = function(request, errorType, errorMessage) {
	var serverError = document.getElementById('serverResponse');
	$(serverError).removeClass("success");
	$(serverError).addClass("fail");
	serverError.innerHTML = "Error: " + errorMessage + " "
			+ app.getReadableTime(new Date());
	if (app.forcedSubmit) {
		navigator.notification.alert(
				"Error, please check your internet connection", null,
				"99 Red Beacons Tracker");
		app.forcedSubmit = false;
	}
};
*/