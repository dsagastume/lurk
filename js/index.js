/*
 * 
 * LURK
 *
 */

var app = {
	SERVER_URL : "http://lurkapp.appspot.com/lurk",
	HIGH_GPS_ACCURACY : true,	// some emulators require true.
	position : null,
	networkState : '',
	timeLastSubmit : 0,
	timeLastPointStore : 0,
	username: null,
	points: [],
	theRole : '',
	theRoles: [],
	theEnemies : '',
	theAllies : '',
	theStatus : null,

	// Application Constructor
	initialize : function() {
		this.initFastClick();

		// initialize app server comunication times
		app.timeLastSubmit = new Date().getTime() - 11000; 
		app.timeLastPointStore = new Date().getTime() - 1000;

		// proceed to app events' binding
		app.bindEvents();
	},
	bindEvents : function() {

		// bind events to buttons
	    $("#startGPS").on("click", function() {
      		app.checkConnection();
		});

		$("#stopGPS").on("click", function() {
			gps.stop();
		});

		$("#changeRoles").on("click", function() {
			$("#lurkStatus").fadeOut("fast", function() {
				$("#roleSelection").fadeIn("fast");
			});
		});

		$("#setRole").on("click", function() {
			app.setRole();
			$("#roleSelection").fadeOut("fast", function() {
				$("#rolesSelection").fadeIn("fast");
			});
		});

		$("#setRoles").on("click", function() {
			app.setAlliesAndEnemies();
			$("#rolesSelection").fadeOut("fast", function() {
				$("#lurkStatus").fadeIn("fast");
			});
		});

		document.addEventListener('deviceready', this.onDeviceReady, true);
	},
	onDeviceReady : function() {
//		navigator.splashscreen.fadeOut();
		console.log("Device ready");

		app.getRoles();

		gps.init();

//		alert(window.localStorage.getItem("theRoles"));

		if ((window.localStorage.getItem("username") != null) && (window.localStorage.getItem("theRoles") != null)) {
			app.username = window.localStorage.getItem("username");
			$("#username").html("username: " + app.username);
			console.log("alles gut");
			app.checkConnection();
			$("#lurkStatus").fadeIn("fast");
		} else if ((window.localStorage.getItem("username") != null) && (window.localStorage.getItem("theRoles") === null)) {
			app.username = window.localStorage.getItem("username");
			$("#username").html("username: " + app.username);
			console.log("you have to select your roles");
			app.checkConnection();
			$("#roleSelection").fadeIn("fast");
		} else {
			$("#username").html("username: getting one...");
			app.newUser();
			$("#roleSelection").fadeIn("fast");
		}
	},
	initFastClick : function() {
		window.addEventListener('load', function() {
			FastClick.attach(document.body);
		}, false);
	},
	checkConnection : function() {
		console.log("Checking connection...");
		app.networkState = navigator.connection.type;

		console.log(app.networkState);

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
		elem.innerHTML = 'Internet: ' + states[app.networkState];
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
	createRoleList : function() {
        $("#role").html("");

        var toHTML = '';

        for (var i = 0; i < app.theRoles.length; i++) {
        	toHTML += 
	        	"<ul>" + 
	        		"<li id='" + app.theRoles[i][0] + "'>" +
	        			"<a>" + app.theRoles[i][1] + "</a>" +
	        		"</li>" +
	        	"</ul>"
        }

        $("#role").html(toHTML);

        $("#role ul li").on("click", function() {
//          console.log("click");
			$("#role ul li").removeClass();
			$(this).addClass("role");
        });
	},
	createRolesList : function() {

        $("#roles").html("");

        var toHTML = "<ul>";



        for (var i = 0; i < app.theRoles.length; i++) {
        	toHTML += 
        		"<li class='neutral' id='" + app.theRoles[i][0] + "'>" +
        			"<a>" + app.theRoles[i][1] + "</a>" +
        		"</li>";
        }

        toHTML += "</ul>";

        $("#roles").html(toHTML);

        $("#roles ul li").on("click", function() {
//          console.log("click");
            var status = $(this).attr("class");
            if (status === "neutral") {
                $(this).removeClass().addClass("ally");
            } else if (status === "ally") {
                $(this).removeClass().addClass("enemy");
            } else {
                $(this).removeClass().addClass("neutral");
            }
        });
	},
	storeRoles : function(roles) {

		/* TODO
		 * difference between first store and update
		 *
		 *
		 */

        console.log(roles);

        if (app.theRoles.length === 0) {

        }

        var roleSearchPosition = 0;

        var role = '';
        var roleEndIndex = 0;

        var roleID = '';
        var roleName = '';

        while (roleSearchPosition < roles.length) {
            roleEndIndex = roles.indexOf(";");
            role = roles.substr(0, (roleEndIndex));

            roleID = role.substr(0, (role.indexOf(":")));
            roleName = role.substr((role.indexOf(":") + 1), role.length);

            roles = roles.substr(roleEndIndex + 1, roles.length);

            roleSearchPosition = roleEndIndex + 1;

            app.theRoles.push([roleID, roleName]);
        }

		app.createRoleList();
		app.createRolesList();

	},
	setUsername : function(username) {
		window.localStorage.setItem("username", username);
		app.username = window.localStorage.getItem("username");
		$("#username").html("username: " + app.username);
	},
	setRole : function() {
		app.theRole = $(".role").attr("id");
	},
	setAlliesAndEnemies : function() {
//		if ($(".enemy").length > 0) {
			app.theEnemies = $(".enemy").map(function() {
				return this.id;
			}).get().join(";");
//		}
		
//		if ($(".ally").length > 0) {
			app.theAllies = $(".ally").map(function() {
				return this.id;
			}).get().join(";");
//		}

		console.log("the allies: " + app.theAllies);
		console.log("the enemies: " + app.theEnemies);

        window.localStorage.setItem("theRoles", JSON.stringify(app.theRoles));

		app.updateUser();

		app.checkConnection();
	},
	playTune : function(status) {

		var path = window.location.pathname;

		path = path.substr(path, path.length - 10);

		console.log(path);

		var aliado1 = new Media(path + "res/sounds/aliado1.mp3",
			function() {
				console.log("Play OK");
			},

			function(err) {
				console.log("Play failed because: " + err.message);
			},

			function(status) {
				console.log(status);
			}
		);

		var enemigo1 = new Media(path + "res/sounds/enemigo1.mp3",
			function() {
				console.log("Play OK");
			},

			function(err) {
				console.log("Play failed because: " + err.message);
			},

			function(status) {
				console.log(status);
			}
		);

		var neutral1 = new Media(path + "res/sounds/neutral1.mp3",
			function() {
				console.log("Play OK");
			},

			function(err) {
				console.log("Play failed because: " + err.message);
			},

			function(status) {
				console.log(status);
			}
		);

		// TODO everything
		if ((status === "1") || (status === "2")) {
			aliado1.play();
		} else if ((status === "3") || (status === "4")) {
			enemigo1.play();
		} else {
			neutral1.play();
		}

	},
	setStatus : function(status) {
		if (app.theStatus === null) {
			app.theStatus = status;
			app.playTune(status);
			app.setMessage(status);
		} 
		else if (app.theStatus != status) {
			app.theStatus = status;
			app.playTune(status);
			app.setMessage(status);			
		}
		console.log("status: " + app.theStatus);
	},
	setMessage : function(status) {

		var message = '';

		$("#statusMessage").fadeOut("fast", function() {
			switch (status) {
				case '1' : 
					message = "Hay un aliado cerca.";
					break;
				case '2' : 
					message = "Hay varios aliados cerca.";
					break;
				case '3' : 
					message = "Hay un enemigo cerca.";
					break;
				case '4' : 
					message = "Hay varios enemigos cerca.";
					break;
				case '5' : 
					message = "Hay aliados y enemigos cerca.";
					break;
				default : 
					message = "No hay nadie cerca.";
					break;
			}

			$("#statusMessage").html(message);

			$("#statusMessage").fadeIn("fast");
		});
	}
};