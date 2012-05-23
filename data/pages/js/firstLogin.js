$("#dialog")
	.dialog({
		closeOnEscape:false,
		draggable: true,
		resizeable: false,
		modal:true,
		minHeight: 250,
		minWidth: 450,
		buttons: {
			"Save Password": function() {
				try {
					if( $("input:[name=upass1]").val() != $("input:[name=upass2]").val())
						throw "Password value is not same !";
					else if( $("input:[name=upass1]").val().length < 6 )
						throw "Password must be 6 digits or higher !";
				
					self.port.emit("storeUserInformation", $("input:[name=upass1]").val());
				}
				catch(err) {
					alert(err);
				}
			}
		},
		open: function() { 
			$(".ui-dialog-titlebar-close").hide(); 
		}
	})
	
self.port.on("successStoreInformation", function() {
	alert("Thank you for setting the password !");
	$("#dialog").dialog("close");
	
	self.port.emit("blankPage");
});