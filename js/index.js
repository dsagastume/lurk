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
	theRole : '',
	theRoles: [],
	theEnemies : '',
	theAllies : '',

	// Application Constructor
	initialize : function() {
		this.initFastClick();

		app.timeLastSubmit = new Date().getTime() - 10000; 
		app.timeLastPointStore = new Date().getTime() - 350; 

		app.username = window.localStorage.getItem("username");

		$("#username").html("username: " + app.username);

		if (app.username != null) {
			console.log("alles gut");
			app.bindEvents();
			app.getRoles();
		} else {
			$("#username").html("username: getting one...");
			app.newUser();
		}

	    $("#startGPS").on("click", function() {
      		app.checkConnection();
		});

		$("#stopGPS").on("click", function() {
			gps.stop();
		});

		$("#updateUser").on("click", function() {
			app.setRoleAlliesAndEnemies();
		});
	},
	bindEvents : function() {
		document.addEventListener('deviceready', this.onDeviceReady, true);
	},
	onDeviceReady : function() {
//		navigator.splashscreen.hide();
		console.log("Device ready");
		app.checkConnection();
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
	createRoleList : function() {
        var toHTML = '';

        for (var i = 0; i < app.theRoles.length; i++) {
        	toHTML += 
	        	"<ul>" + 
	        		"<li id='" + app.theRoles[i][0] + "'>" +
	        			"<p>" + app.theRoles[i][1] + "</p>" +
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
	storeRole : function(role) {
		app.theRole = role;
	},
	storeRoles : function(roles) {
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

            console.log(roles);

            roleSearchPosition = roleEndIndex + 1;

            app.theRoles.push([roleID, roleName]);
        }

		app.createRoleList();
		app.createRolesList();

	},
	createRolesList : function() {
        var toHTML = '';

        for (var i = 0; i < app.theRoles.length; i++) {
        	toHTML += 
	        	"<ul>" + 
	        		"<li class='neutral' id='" + app.theRoles[i][0] + "'>" +
	        			"<p>" + app.theRoles[i][1] + "</p>" +
	        		"</li>" +
	        	"</ul>"
        }

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
	setRoleAlliesAndEnemies : function() {

		app.theRole = $(".role").attr("id");

		if ($(".enemy").length > 0) {
			app.theEnemies = $(".enemy").map(function() {
				return this.id;
			}).get().join(";");
		}
		
		if ($(".ally").length > 0) {
			app.theAllies = $(".ally").map(function() {
				return this.id;
			}).get().join(";");
		}


		console.log("the allies: " + app.theAllies);

		app.updateUser();
	},
	playTune : function(status) {
		// TODO everything
	}
};
