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
	sound : null,
	path : "",
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

		$("#menu_btn").on("click", function() {
			if ($("#menu").hasClass("menu_visible")) {
				$("#menu").css("display", "none").removeClass("menu_visible");
			}
			else {
				$("#menu").css("display", "block").addClass("menu_visible");
			}
		})

/* ========================= menu buttons begin ========================= */

		$("#home_btn").on("click", function() {
			$(".visible").fadeOut("fast", function() {
				app.visible.push($(this).attr("id"));
				$("#home_section").fadeIn("fast").addClass("visible");
				$("#menu").css("display", "none").removeClass("menu_visible");
			}).removeClass("visible");
		});
	
		$("#info_btn").on("click", function() {
			$(".visible").fadeOut("fast", function() {
				app.visible.push($(this).attr("id"));
				$("#info_section").fadeIn("fast").addClass("visible");
				$("#menu").css("display", "none").removeClass("menu_visible");
			}).removeClass("visible");
		});

		$("#role_btn").on("click", function() {
			$(".visible").fadeOut("fast", function() {
				app.visible.push($(this).attr("id"));
				$("#role_section").fadeIn("fast").addClass("visible");
				$("#menu").css("display", "none").removeClass("menu_visible");
			}).removeClass("visible");
		});

		$("#roles_btn").on("click", function() {
			$(".visible").fadeOut("fast", function() {
				app.visible.push($(this).attr("id"));
				$("#roles_section").fadeIn("fast").addClass("visible");
				$("#menu").css("display", "none").removeClass("menu_visible");
			}).removeClass("visible");
		});

/* ========================== menu buttons end ========================== */

		document.addEventListener('deviceready', this.onDeviceReady, true);
	},
	onBackButton : function(e) {
		e.preventDefault();
		if ($("#menu").hasClass("menu_visible")) {
			$("#menu").css("display", "none").removeClass("menu_visible");
		}
		else if (app.visible.length > 0) {
			$(".visible").fadeOut("fast", function() {
				var toShow = app.visible.pop();
				$("#" + toShow).fadeIn("fast").addClass("visible");
			}).removeClass("visible");
		} 
		else {
			navigator.app.exitApp();
		}
	},
	onDeviceReady : function() {

		console.log("Device ready");

		app.path = window.location.pathname;

		app.path = app.path.substr(app.path, app.path.length - 10);

		app.getRoles();

		app.username = window.localStorage.getItem("username");
		app.theRole = window.localStorage.getItem("role");

		app.theAllies = window.localStorage.getItem("allies");
		app.theEnemies = window.localStorage.getItem("enemies");

		$("#theAllies").html("the allies: " + app.theAllies);
		$("#theEnemies").html("the enemies: " + app.theEnemies);

		if (window.localStorage.getItem("username") != null) {
			$("#username").html("username: " + app.username);
			$("#theRole").html("role: " + app.theRole);
			console.log("alles gut");
			app.checkConnection();
			$("#home_section").fadeIn("fast", function() {
				console.log($(this).attr("id"));
				console.log("showing home");
			}).addClass("visible");
		} else {
			$("#username").html("username: getting one...");
			$("#role_section").fadeIn("fast").addClass("visible");
		}

		$("#role_set_btn").on("click", function() {
			app.setRole();
			if (app.username != null) {
				$(".visible").fadeOut("fast", function() {
					app.visible.push($(this).attr("id"));
					$("#home_section").fadeIn("fast").addClass("visible");
				}).removeClass("visible");
				app.updateUser();
			}
			else {
				$(".visible").fadeOut("fast", function() {
					app.visible.push($(this).attr("id"));
					$("#roles_section").fadeIn("fast").addClass("visible");
				}).removeClass("visible");
			}
		});

		$("#roles_set_btn").on("click", function() {
			app.setAlliesAndEnemies();
			$(".visible").fadeOut("fast", function() {
				app.visible.push($(this).attr("id"));
				$("#home_section").fadeIn("fast").addClass("visible");
			}).removeClass("visible");
			if (app.username != null) {
				app.updateUser();
			}
			else {
				app.newUser();
			}
		});

		document.addEventListener("backbutton", app.onBackButton, true);

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
	        		"<li data-id='" + app.theRoles[i][0] + "'>" +
	        			"<a>" + app.theRoles[i][1] + "</a>" +
	        		"</li>" +
	        	"</ul>"
        }

        $("#role_list").html(toHTML);

        $("#role_list ul li").on("click", function() {
        	$("#role_set_btn").fadeIn("fast");
			$("#role_list ul li").removeClass();
			$(this).addClass("role");
        });
	},
	createRolesList : function() {

        $("#roles").html("");

        var toHTML = "<ul>";

        for (var i = 0; i < app.theRoles.length; i++) {
        	toHTML += 
        		"<li class='neutral' data-id='" + app.theRoles[i][0] + "'>" +
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

        console.log("roles: " + roles);

        var role = '';
        var roleEndIndex = 0;

        var roleID = '';
        var roleName = '';

        while (roles.length > 0) {
            roleEndIndex = roles.indexOf(";");

            role = roles.substr(0, (roleEndIndex));

            roleID = role.substr(0, (role.indexOf(":")));

            roleName = role.substr((role.indexOf(":") + 1), role.length);

            roles = roles.substr(roleEndIndex + 1, roles.lastIndexOf(";"));

            app.theRoles.push([roleID, roleName]);
        }

        window.localStorage.setItem("theRoles", JSON.stringify(app.theRoles));
        console.log("stored roles: " + window.localStorage.getItem("theRoles"));

		app.createRoleList();
		app.createRolesList();

	},
	setUsername : function(username) {
		window.localStorage.setItem("username", username);
		app.username = window.localStorage.getItem("username");
		$("#username").html("username: " + app.username);
	},
	setRole : function() {
		app.theRole = $(".role").attr("data-id");
		window.localStorage.setItem("role", app.theRole);
		$("#theRole").html(app.theRole);
	},
	setAlliesAndEnemies : function() {
		app.theEnemies = $(".enemy").map(function() {
			return $(this).attr("data-id");
		}).get().join(";");
		
		window.localStorage.setItem("enemies", app.theEnemies);

		app.theAllies = $(".ally").map(function() {
			return $(this).attr("data-id");
		}).get().join(";");

		window.localStorage.setItem("allies", app.theAllies);

		console.log("the allies: " + app.theAllies);
		console.log("the enemies: " + app.theEnemies);
		$("#theAllies").html("the allies: " + app.theAllies);
		$("#theEnemies").html("the enemies: " + app.theEnemies);

	},
	playTune : function(status) {

		console.log(app.path);

		// TODO everything

//		app.sound.stop();
//		app.sound.release();


		if ((status === "1") || (status === "2")) {
			app.sound = new Media(app.path + "res/sounds/aliado1.mp3",
				function() {
					console.log("Play OK");
					app.sound.play();
				},

				function(err) {
					console.log("Play failed because: " + err.message);
				},

				function(status) {
					console.log(status);
				}
			);
			app.sound.play();
		} else if ((status === "3") || (status === "4")) {
			app.sound = new Media(app.path + "res/sounds/enemigo1.mp3",
				function() {
					console.log("Play OK");
					app.sound.play();
				},

				function(err) {
					console.log("Play failed because: " + err.message);
				},

				function(status) {
					console.log(status);
				}
			);
			app.sound.play();
		} else {
			app.sound = new Media(app.path + "res/sounds/neutral1.mp3",
				function() {
					console.log("Play OK");
					app.sound.play();
				},

				function(err) {
					console.log("Play failed because: " + err.message);
				},

				function(status) {
					console.log(status);
				}
			);
			app.sound.play();
		}

	},
	setStatus : function(status) {
		if ((app.theStatus === null) || (app.theStatus != status)) {
			app.theStatus = status;
			app.playTune(status);
			app.setMessage(status);
		} 
		console.log("status: " + app.theStatus);
	},
	setMessage : function(status) {

		var message = '';

		$("#status").fadeOut("slow", function() {
			switch (status) {
				case '1' : 
					$("#status_image").removeClass().addClass("ally_bean");
					message = "hay un aliado cerca";
					break;
				case '2' : 
					message = "hay varios aliados cerca";
					$("#status_image").removeClass().addClass("ally_bean");
					break;
				case '3' : 
					message = "hay un enemigo cerca";
					$("#status_image").removeClass().addClass("enemy_bean");
					break;
				case '4' : 
					$("#status_image").removeClass().addClass("enemy_bean");
					message = "hay varios enemigos cerca";
					break;
				case '5' : 
					$("#status_image").removeClass().addClass("neutral_bean");
					message = "hay aliados y enemigos cerca";
					break;
				default : 
					$("#status_image").removeClass().addClass("neutral_bean");
					message = "no hay nadie cerca";
					break;
			}

			$("#statusMessage").html(message);

			$("#status").fadeIn("slow");
		});
	}
};