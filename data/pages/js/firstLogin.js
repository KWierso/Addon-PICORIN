$("#dialog").dialog({
	closeOnEscape:false,
	draggable: false,
	modal:true,
	minHeight: 250,
	minWidth: 450,
	buttons: {
		"Save Password": function() {
			self.port.emit("storeUserInformation", $("input:[name=uname]").val(), $("input:[name=upass1]").val());
		}
	},
	open: function() { 
		$(".ui-dialog-titlebar-close").hide(); 
	}
})