(function($){// Local Scope
	
	setTimeout(function(){
		
		var id = '#{id}';
		var url = '#{url}';
		var propSelPop = '#{propSelPop}';
		var modal = '#{modal}' || 'true';
		var input = id && document.getElementById(id);
		var width = '#{width}' || '600';
		var height = '#{height}' || '500';
		
		var script = "('" + url + "?&amp;modoJanelaPlc=popup','" + id + "'+'#'+'" + propSelPop + "Lookup','','"+width+"','"+height+"','10','10')";
		
		if (modal == 'true') {
			script = 'selecaoModal' + script;
		} else {
			script = 'selecaoPopup' + script;
		}
		
		if (input) {
			jQuery(input).after('<span id="#{id}Sel" title="..." class="ui-state-default plc-botao-agregado bt"'
			+' onkeydown="selecionaPorTecla(event,this);"'
			+' onclick="'+ script +';jQuery.plc.componenteFoco = document.getElementById(\'#{id}\');return false;"'
			+'>...</span>');
		}
	}, 0);
	
})(jQuery);