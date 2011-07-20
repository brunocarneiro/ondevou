jQuery(function(){
	setTimeout(function(){
		
		var url = '#{url}';
		var input = '#{id}' && document.getElementById('#{id}');
		var inputLookup = '#{idLookup}' && document.getElementById('#{idLookup}');
		var minChars = parseInt('#{tamanhoMinimo}' || '3');
		var max = parseInt('#{tamanhoLista}' || '10');
		
		if (inputLookup) {
			inputLookup = jQuery(inputLookup);
			inputLookup.autocomplete(url, {
				width :260,
				selectFirst :false,
				minChars: minChars,
				max: max
			});
			if (input) {
				inputLookup.result(function(event, data, formatted) {
					if (data) {
						jQuery(input).val(data[1]);
					}
				});
			}
		}
	}, 200);
});
