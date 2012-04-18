/*The Low Level Module (XPCOM)*/
var {Cu, Cc, Ci} = require("chrome");

/*The UI Module*/
var panel 	= require("panel");
var widget 	= require("widget");
var tabs	= require("tabs");
var pageMod	= require("page-mod");

/*The Storage Module*/
var ss 		= require("simple-storage");

/*The Data Module*/
var data	= require("self").data;

/*The Properties Needed*/
var isBeingFiltered = true;

/*Login Information Popup*/
if(ss.storage.identificationInformation == null) {
	tabs.open({
		url: data.url("pages/html/firstLogin.html"),
		onReady: function onReady(tab) {
			var worker = tab.attach({
				contentScriptFile: [data.url("jquery-ui/js/jquery-1.7.1.min.js"),
									data.url("jquery-ui/js/jquery-ui-1.8.18.custom.min.js"),
									data.url("pages/js/firstLogin.js")],
				contentScriptWhen: "ready"
			})
		}
	})
}

/*Main Panel*/
var mainPanel =
	panel.Panel ({
		width: 200,
		height: 165,
		contentURL: data.url("pages/html/mainPanel.html"),
		contentScriptFile: [data.url("jquery-ui/js/jquery-1.7.1.min.js"),
                            data.url("jquery-ui/js/jquery-ui-1.8.18.custom.min.js"),
                            data.url("pages/js/mainPanel.js")],
		contentScriptWhen: "ready"
	});

/*Widget on the right bottom side*/
var theWidget = 
	widget.Widget({
		id: "picorin-widget",
		label: "Personal Internet Content Filtering",
		contentURL: "http://www.mozilla.org/favicon.ico",
		panel: mainPanel
	});

	
/*The Events/

/*Filter Toggle Button*/
mainPanel.port.on("toggleFilter", function(toggleCondition) {
	if(toggleCondition == "Off")
		isBeingFiltered = false;
	else
		isBeingFiltered = true;
	
	if(isBeingFiltered) {
		pageMod.PageMod ({
			include: ["http://*", "https://*"],
			contentScriptWhen: "ready",
			contentScript:  'document.body.style.display = "block"; document.body.innerHTML = ' +
							'"<h1>this page has been eaten</h1>";' ,
			contentStyle: "body {display: none; background-color: #FFCCFF!important}"
		});
	}
});

/*Black List Button onClick*/
mainPanel.port.on("blackPage", function() {
	tabs.open({
		url:data.url("pages/html/blackPage.html"),
		onReady: function onReady(tab) {
			var worker = tab.attach({
				contentScriptFile: [data.url("jquery-ui/js/jquery-1.7.1.min.js"),
                            data.url("jquery-ui/js/jquery-ui-1.8.18.custom.min.js"),
                            data.url("pages/js/blackPage.js")],
				contentScriptWhen: "ready"
			})
		}
	})
	
	theWidget.panel.hide();
});

/*White List Button onClick*/
mainPanel.port.on("whitePage", function() {
	tabs.open({
		url:data.url("pages/html/whitePage.html"),
		onReady: function onReady(tab) {
			var worker = tab.attach({
				contentScriptFile: [data.url("jquery-ui/js/jquery-1.7.1.min.js"),
                            data.url("jquery-ui/js/jquery-ui-1.8.18.custom.min.js"),
                            data.url("pages/js/whitePage.js")],
				contentScriptWhen: "ready"
			})
		}
	})
	
	theWidget.panel.hide();
});