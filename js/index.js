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
	visible : [], // for the back button

	// Application Constructor
	initialize : function() {
		this.initFastClick();

		// initialize app server comunication times
		app.timeLastSubmit = new Date().getTime();
		app.timeLastPointStore = new Date().getTime() - 1000;

		// proceed to app events' binding
		app.bindEvents();
	},
	bindEvents : function() {

		// bind events to buttons

/*
	    $("#startGPS").on("click", function() {
      		app.checkConnection();
		});

		$("#stopGPS").on("click", function() {
			gps.stop();
		});
*/
		$("#menu_btn").on("click", function() {
			if ($("#menu").hasClass("menu_visible")) {
				$("#menu").css("display", "none").removeClass("menu_visible");
			}
			else {
				$("#menu").css("display", "block").addClass("menu_visible");
			}
		})

		$("#home_btn").on("click", function() {
			$(".visible").fadeOut("fast", function() {
				console.log($(this).attr("id"));
				app.visible.push($(this).attr("id"));
				$("#home_section").fadeIn("fast").addClass("visible");
				$("#menu").css("display", "none").removeClass("menu_visible");
			}).removeClass("visible");
		});
	
		$("#info_btn").on("click", function() {
			$(".visible").fadeOut("fast", function() {
				console.log($(this).attr("id"));
				app.visible.push($(this).attr("id"));
				$("#info_section").fadeIn("fast").addClass("visible");
				$("#menu").css("display", "none").removeClass("menu_visible");
			}).removeClass("visible");
		});

		$("#roles_btn").on("click", function() {
			$(".visible").fadeOut("fast", function() {
				console.log($(this).attr("id"));
				app.visible.push($(this).attr("id"));
				$("#role_section").fadeIn("fast").addClass("visible");
				$("#menu").css("display", "none").removeClass("menu_visible");
			}).removeClass("visible");
		});

		$("#role_set_btn").on("click", function() {
			app.setRole();
			$(".visible").fadeOut("fast", function() {
				console.log($(this).attr("id"));
				app.visible.push($(this).attr("id"));
				$("#roles_section").fadeIn("fast").addClass("visible");
			}).removeClass("visible");
		});

		$("#roles_set_btn").on("click", function() {
			app.setAlliesAndEnemies();
			$(".visible").fadeOut("fast", function() {
				$("#home_section").fadeIn("fast").addClass("visible");
			}).removeClass("visible");
		});

		document.addEventListener('deviceready', this.onDeviceReady, true);
	},
	onBackButton : function(e) {
		e.preventDefault();
		if ($("#menu").hasClass("menu_visible")) {
			$("#menu").css("display", "none").removeClass("menu_visible");
		} else {
			$(".visible").fadeOut("fast", function() {
				var toShow = app.visible.pop();
				$("#" + toShow).fadeIn("fast");
			});
		}
	},
	onDeviceReady : function() {
//		navigator.splashscreen.fadeOut();

		console.log("Device ready");

		app.getRoles();

//		alert(window.localStorage.getItem("theRoles"));

		if ((window.localStorage.getItem("username") != null) && (window.localStorage.getItem("theRoles") != null)) {
			app.username = window.localStorage.getItem("username");
			$("#username").html("username: " + app.username);
			console.log("alles gut");
			app.checkConnection();
			$("#home_section").fadeIn("fast", function() {
				console.log($(this).attr("id"));
				app.visible.push($(this).attr("id"));
				console.log("showing home");
			}).addClass("visible");
		} else if ((window.localStorage.getItem("username") != null) && (window.localStorage.getItem("theRoles") === null)) {
			app.username = window.localStorage.getItem("username");
			$("#username").html("username: " + app.username);
			console.log("you have to select your roles");
			app.checkConnection();
			$("#role_section").fadeIn("fast", function() {
				console.log($(this).attr("id"));
				app.visible.push($(this).attr("id"));
			}).addClass("visible");
		} else {
			$("#username").html("username: getting one...");
			app.newUser();
			$("#role_section").fadeIn("fast").addClass("visible");
		}

		document.addEventListener("backbutton", this.onBackButton, true);

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

        $("#role_list").html(toHTML);

        $("#role_list ul li").on("click", function() {
//          console.log("click");
			$("#role_list ul li").removeClass();
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

        $("#roles_list").html(toHTML);

        $("#roles_list ul li").on("click", function() {
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

//		app.checkConnection();
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