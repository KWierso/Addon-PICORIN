$("#dialog").dialog({
	closeOnEscape:false,
	draggable: false,
	modal:true,
	minHeight: 250,
	minWidth: 450,
	buttons: {
		"Save Password": function() {
		
		},
		"Close": function() {
			$(this).dialog("close");
		}
	}
})

$("#button_save")
	.button();