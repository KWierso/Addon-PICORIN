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
var self	= require("self");
var data	= self.data;

/*The Password Module*/
var pass	= require("passwords");

/*The Properties Needed*/
var uname = "picorin";				//Username for the password module
var isBeingFiltered = true;			//Triggering the bayes filtering on / off
var filterBayesian = null;			//The page-mod handler for bayesian filtering

/*The Storage which is being used*/
if(!ss.storage.identificationInformation)
	ss.storage.identificationInformation = null;
	
if(!ss.storage.websiteBlacklisted)
	ss.storage.websiteBlacklisted = [];
	
if(!ss.storage.websiteWhitelisted)
	ss.storage.websiteWhitelisted = [];

/*Main Panel*/
var mainPanel =
	panel.Panel ({
		width: 200,
		height: 165,
		contentURL: data.url("pages/html/mainPanel.html"),
		contentScriptFile: [data.url("jquery-ui/js/jquery.min.js"),
                            data.url("jquery-ui/js/jquery-ui.min.js"),
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
  console.log("panel toggleFilter");
	if(toggleCondition == "Off")
		isBeingFiltered = false;
	else
		isBeingFiltered = true;
	
	if(isBeingFiltered) {
		filterBayesian = pageMod.PageMod ({
			include: ["http://*", "https://*"],
			contentScriptWhen: "ready",
			contentScript:  'document.body.style.display = "block"; document.body.innerHTML = ' +
							'"<h1>this page has been eaten</h1>";' ,
			contentStyle: "body {display: none; background-color: #FFCCFF!important}"
		});
	}
	else {
		if(filterBayesian != null) {
			filterBayesian.destroy();
		}
	}
});

/*Black List Button onClick*/
var openBlackPage = function() {
  console.log("panel blackPage");
	tabs.open({
		url:data.url("pages/html/blackPage.html"),
		onReady: function onReady(tab) {
			var worker = tab.attach({
				contentScriptFile: [data.url("jquery-ui/js/jquery.min.js"),
                            data.url("jquery-ui/js/jquery-ui.min.js"),
                            data.url("pages/js/blackPage.js")],
				contentScriptWhen: "ready"
			})
		}
	})
}

mainPanel.port.on("blackPage", function() {
  openBlackPage();
	theWidget.panel.hide();
});

/*White List Button onClick*/
var openWhitePage = function() {
  console.log("panel whitePage");
	tabs.open({
		url:data.url("pages/html/whitePage.html"),
		onReady: function onReady(tab) {
			var worker = tab.attach({
				contentScriptFile: [data.url("jquery-ui/js/jquery.min.js"),
                            data.url("jquery-ui/js/jquery-ui.min.js"),
                            data.url("pages/js/whitePage.js")],
				contentScriptWhen: "ready"
			})
		}
	})
}

mainPanel.port.on("whitePage", function() {
  openWhitePage();
	theWidget.panel.hide();
});

/*Login Information Popup*/
if(ss.storage.identificationInformation == null) {
  console.log("login popup");
	var firstLoginMod = 
		pageMod.PageMod({
			include: data.url('pages/html/firstLogin.html'),
			contentScriptWhen: "ready",
			contentScriptFile: [data.url("jquery-ui/js/jquery.min.js"),
								data.url("jquery-ui/js/jquery-ui.min.js"),
								data.url("pages/js/firstLogin.js")],
			onAttach: function(worker) {
        console.log("pm attached");
				worker.port.on("storeUserInformation", function(upass) {
					pass.store({
						realm: "User Information",
						username: uname,
						password: upass,
						onComplete: function(credentials) {
              console.log("password stored");
							worker.port.emit("successStoreInformation");
              openBlackPage();
						}
					});
					
					/*-------------------------------------------------
					Used for debugging password
					
					pass.search({
						username: uname,
						onComplete: function onComplete(credentials) {
							credentials.forEach(function(credential) {
								console.log(credential.username);
								console.log(credential.password);
							});
						}
					})
					-------------------------------------------------*/
					
					ss.storage.identificationInformation = 1;
				});
				
				worker.port.on("blankPage", function() {
					tabs.activeTab.url = "about:blank";
          console.log("page mod blankPage");
				});
			}
		});
  console.log("opening login page");
	tabs.activeTab.url = data.url('pages/html/firstLogin.html');
	
	/*----------------------------------------------------------------------
	Open new tabs (old way)
	
	tabs.open({
		url: data.url("pages/html/firstLogin.html"),
		inNewWindow:false,
		onReady: function onReady(tab) {
			var worker = tab.attach({
				contentScriptFile: [data.url("jquery-ui/js/jquery.min.js"),
									data.url("jquery-ui/js/jquery-ui.min.js"),
									data.url("pages/js/firstLogin.js")],
				contentScriptWhen: "ready"
			})
		}
	})
	----------------------------------------------------------------------*/
}
