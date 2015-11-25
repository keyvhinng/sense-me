jQuery(document).ready(function(){

	console.log('document is ready');
	
	var dataJson;

	/*
	$.getJSON('http://localhost:3030/tweets', function(response){
		//console.log(response);

		//var button = $('<button>negativo</button>');
		dataJson = response.data;
		$.each(response.data,function(key,val){
			var $tr = $('<tr>').append(
				$('<td>').text(val.text),
				$('<td>').append($("<button class='btn btnUpdate neg'>negativo</button>")),
				$('<td>').append($("<button class='btn btnUpdate neu'>neutro</button>")),
				$('<td>').append($("<button class='btn btnUpdate pos'>positivo</button>"))
			).appendTo('#dataTable');
		});
	});

	//UPDATE
	$(document).on('click','.btnUpdate',function(){
		var row_index = $(this).parent().parent().index() + 1;
		console.log($(this).attr('class'));
		var tweet = dataJson[row_index-2];
		switch($(this).attr('class')){
			case "btn btnUpdate neg":
				console.log("0");
				tweet.polarity = 0;
				break;
			case "btn btnUpdate neu":
				console.log("1");
				tweet.polarity = 1;
				break;
			case "btn btnUpdate pos":
				console.log("2");
				tweet.polarity = 2;
				break;
			default:
				break;
		}
		var col_index = tweet.polarity + 2;
		console.log(tweet);
		urlPUT = 'http://localhost:3030/tweets/' + tweet.id_str;
		$.ajax({
			type: 'PUT',
			data: tweet,
			dataType: 'JSON', 
			url : urlPUT,
		}).done(function(response){
			var buttonSelector = '#dataTable tr:nth-child('+ row_index +
								') td:nth-child('+ col_index +') button';
			console.log(response);
			
			$('#dataTable tr:nth-child('+ row_index +
								') td:nth-child(2) button').css('background-color','');
			$('#dataTable tr:nth-child('+ row_index +
								') td:nth-child(3) button').css('background-color','');
			$('#dataTable tr:nth-child('+ row_index +
								') td:nth-child(4) button').css('background-color','');
			$(buttonSelector).css('background-color','#91C8EF');
		});
	});
	*/
});