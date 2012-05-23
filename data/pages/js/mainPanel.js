console.log("panel says hi");

$("#button_toggle")
    .button()
    .click(function(event) {
        event.stopPropagation();
        event.preventDefault();
        
        if($(this).val() == "On") {
            $(this).val("Off");
			self.port.emit("toggleFilter", "Off");
        }
        else {
            $(this).val("On");
			self.port.emit("toggleFilter", "On");
        }
    });

$("#button_blacklist")
    .button()
    .click(function(event){
        self.port.emit("blackPage");
    });

$("#button_whitelist")
    .button()
    .click(function(event) {
        self.port.emit("whitePage");
    });