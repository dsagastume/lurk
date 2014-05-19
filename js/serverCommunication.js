/*
 * 
 * LURK
 *
 */

app.updateUser = function() {
	$.ajax({
		type: "POST",
        url: app.SERVER_URL+"/updateuser/" + app.username + "/" + app.theRole + "/" + app.theEnemies + "/" + app.theAllies,
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
	console.log("getting new username");
	$.ajax({
		type: "POST",
        url: app.SERVER_URL+"/newuser",
        crossDomain:true,
		timeout : 10000,
		success : function(response) {
			app.serverSuccess(response);
			app.setUsername(response);
			app.checkConnection();
			app.updateUser();
			$("#menu_btn").fadeIn("fast");
		},
		error : function(request, errorType, errorMessage) {
			app.serverError(request, errorType, errorMessage);
		}
	});	
}

app.submitLocation = function() {

	if(app.position != undefined && app.position != null){

		var theTime = new Date().getTime();

		if ((theTime - app.timeLastSubmit) > 10000) {
			app.timeLastSubmit = new Date().getTime();

			console.log("submited point | latitude: " + app.position.coords.latitude + " longitude: " + app.position.coords.longitude);

			app.points.length = 0;

			$.ajax({
				type: "POST",
                url: app.SERVER_URL + "/newpoint/" + app.username + "/" +app.position.coords.latitude + "/" + app.position.coords.longitude,
		        crossDomain:true,
				timeout : 10000,
				success : function(response) {
					app.serverSuccess(response);
					app.setStatus(response);
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
	console.log("server response: " + response);
	console.log("platform: " + device.platform);
};

app.serverError = function(request, errorType, errorMessage) {
	$("#serverResponse").html("Not working...");
    if (app.username != null) {
        app.setStatus("i");
    }
    
	app.checkConnection();
};