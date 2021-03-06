jQuery(document).ready(function(){
	console.log('document is ready');
	var server = 'http://52.27.158.94';
	var dataJson;
	var urlGET = server + ':3030/tweets';
	$.getJSON(urlGET, function(response){
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
		var tweet = dataJson[row_index-2];
		switch($(this).attr('class')){
			case "btn btnUpdate neg":
				tweet.polarity = 0;
				break;
			case "btn btnUpdate neu":
				tweet.polarity = 1;
				break;
			case "btn btnUpdate pos":
				tweet.polarity = 2;
				break;
			default:
				break;
		}
		console.log(tweet);
		urlPUT = server +':3030/tweets/' + tweet.id_str;
		$.ajax({
			type: 'PUT',
			data: tweet,
			dataType: 'JSON',
			url : urlPUT,
		}).done(function(response){
			console.log(response);
			$('#dataTable tr:nth-child('+ row_index +
								') td:nth-child(2) button').css('background-color','');
			$('#dataTable tr:nth-child('+ row_index +
								') td:nth-child(3) button').css('background-color','');
			$('#dataTable tr:nth-child('+ row_index +
								') td:nth-child(4) button').css('background-color','');
      var col_index = tweet.polarity + 2;
      var buttonSelector = '#dataTable tr:nth-child('+ row_index +
          								') td:nth-child('+ col_index +') button';
			$(buttonSelector).css('background-color','#91C8EF');
		});
	});
});
