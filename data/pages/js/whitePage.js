$("#btnAddWhitelist")
    .button()
    .click(function(event){
        event.stopPropagation();
        event.preventDefault();

        //self.port.emit("openWhitelist");
    });