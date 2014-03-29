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
var app = {
	SERVER_URL : "http://lurkapp.appspot.com/lurk",
	HIGH_GPS_ACCURACY : false,	// some emulators require true.

	position : null,
	deviceId : 0,
	passcode : 0,
	timeLastSubmit : 0,
	forcedSubmit : false, // set if user explicitly presses submit button.
							// Used to determine if we show alert boxes.

	// Application Constructor
	initialize : function() {
		alert("initialize");
		this.bindEvents();
//		this.initFastClick();
//		this.initUserId();
//		this.initPasscode();
//		this.initView();
		app.timeLastSubmit = (new Date().getTime() / 1000) - 60; 
	},
	bindEvents : function() {
		//navigator.notification.alert("Here we go", false);
		alert("Bind!");
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady : function() {
//		navigator.splashscreen.hide();
		alert("Device ready");
		app.checkConnection();
		gps.init();
	},
	checkConnection : function() {
		alert("checkConnection");
		var networkState = navigator.connection.type;

		alert("networkState");

		var states = {};
		states[Connection.UNKNOWN] = 'Unknown';
		states[Connection.ETHERNET] = 'Ethernet';
		states[Connection.WIFI] = 'WiFi';
		states[Connection.CELL_2G] = 'Cell 2G';
		states[Connection.CELL_3G] = 'Cell 3G';
		states[Connection.CELL_4G] = 'Cell 4G';
		states[Connection.CELL] = 'Cell';
		states[Connection.NONE] = 'No';

		elem = document.getElementById('#connectionInfo');

		elem.innerHTML = "Internet: almost...";
		/*
		if (networkState == Connection.NONE) {
			this.failElement(elem);
		} else {
			this.succeedElement(elem);
		}
		*/
		elem.innerHTML = 'Internet: ' + states[networkState];
	},
	/*
	getReadableTime : function(time) {
		var hours = time.getHours();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12;

		return (hours + ':' + app.padZero(time.getMinutes()) + ':'
				+ app.padZero(time.getSeconds()) + ' ' + ampm);
	},
	padZero : function(num) {
		return (num < 10 ? '0' + num : num);
	},
	*/
	/*
	succeedElement : function(elem) {
		elem.removeClass("fail");
		elem.addClass("success");
	},
	failElement : function(elem) {
		elem.removeClass("success");
		elem.addClass("fail");
	}
	*/
};

/*

$(function() {
	$("#userPasscode").focusout(
			function() {
				var permanentStorage = window.localStorage;
				permanentStorage.setItem("passcode", $("#userPasscode").val());
				this.passcode = $("#userPasscode").val();
				if ($("#userPasscode").val() !== ""
						&& $('#settingsPage #enterPasswordInstruction').is(
								":visible")) {
					$('#settingsPage #enterPasswordInstruction').hide();
				}
			});

	$("#submit-passcode").click(function() {
		app.forcedSubmit = true; // forces pop-up
		app.submitToServer();
	});

	$(document).delegate('.ui-navbar a', 'click', function() {
		$(this).addClass('ui-btn-active');
		$('.content_div').hide();
		$('#' + $(this).attr('data-href')).show();
	});


});
*/