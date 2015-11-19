jQuery(document).ready(function(){
	$("#btnSave").on('click',function(){
		console.log("btn was clicked");
		var tweet = {
			'id' : 10,
			'status' : 'new status 0'			
		};
		$.ajax({
			type: 'PUT',
			data: tweet,
			dataType: 'JSON', 
			url : '/tweets/3',
		}).done(function(response){
			console.log(response);
		});
	});
});