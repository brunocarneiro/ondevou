(function($){// Local Scope
	
	function applyAutogrow(){
		var area = '#{id}' && document.getElementById('#{id}');
		if (area) {			
			jQuery(area).autogrow({
				maxHeight: parseInt('#{tamanhoMaximo}') || 3,
				lineHeight: 16
			});
		}
	}
	setTimeout(function(){jQuery(applyAutogrow)}, 50);
	
})(jQuery);