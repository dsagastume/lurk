/*
 * 
 * LURK
 *
 */

app.updateUser = function() {
	$.ajax({
		type: "POST",
        url: app.SERVER_URL+"/updateuser/" + app.username + "/" + app.theRole + "/" + app.theEnemies + ";/" + app.theAllies + ";",
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

app.getRoles = function() {
	$.ajax({
		type: "GET",
        url: app.SERVER_URL+"/getroles",
        crossDomain:true,
		timeout : 10000,
		success : function(response) {
			app.serverSuccess(response);
			app.storeRoles(response);
		},
		error : function(request, errorType, errorMessage) {
			app.serverError(request, errorType, errorMessage);
		}
	});		
}

app.newUser = function() {
	$.ajax({
		type: "POST",
        url: app.SERVER_URL+"/newuser",
        crossDomain:true,
		timeout : 10000,
		success : function(response) {
			window.localStorage.setItem("username", response);

			app.username = window.localStorage.getItem("username");

			$("#username").html("username: " + app.username);

			app.serverSuccess(response);
//			app.getRoles();

		},
		error : function(request, errorType, errorMessage) {
			app.serverError(request, errorType, errorMessage);
		}
	});	
}

app.submitToServer = function() {

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
			app.timeLastSubmit = new Date().getTime();

			var latitudeAverage = app.getLatitudeAverage();
			var longitudeAverage = app.getLongitudeAverage();

			console.log(latitudeAverage + " " + longitudeAverage + " points length: " + app.points.length);

			app.points.length = 0;

			$.ajax({
				type: "POST",
                url: app.SERVER_URL + "/newpoint/" + app.username + "/" +app.position.coords.latitude + "/" + app.position.coords.longitude/*+ data*/,
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
		}		
	}
	else{
		console.log("Nothing to submit.");
	}
};

app.serverSuccess = function(response) {
	$("#serverResponse").html(response);
	console.log(response);
//	console.log("submitting to server");
};

app.serverError = function(request, errorType, errorMessage) {
	$("#serverResponse").html("Not working...");
	app.checkConnection();
};