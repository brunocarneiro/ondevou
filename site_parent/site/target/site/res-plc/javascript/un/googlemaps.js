/*Exemplo:
 * 
 * @param mapa Id do Elemento HTML que o Mapa deve ser inserido.
 * @param latitude Campo que representa a latitude.
 * @param longitude Campo que representa a longitude.
 * @param campos Lista de campos que compoem o endereço.
 * 
 * riaUsa="googlemaps(campos='corpo:formulario:endereco_logradouro,corpo:formulario:endereco_numero,corpo:formulario:endereco_bairro,corpo:formulario:endereco_cidade')"
 */
jQuery(function(){
	
	var mapa 	= document.getElementById('#{mapa}' || 'google-maps');
	var width 	= '#{width}' 	|| '600';
	var height 	= '#{height}' 	|| '400';
	var campos 	= null;
	
	if (mapa) {
		var html = '<button class="botao_menu ui-state-default plc-botao" style="display: block">Pesquisar Google Maps</button>';
		html += '<iframe src="'+ plcGeral.contextPath +'/res-plc/javascript/un/googlemaps.html" width="'+ width +'" height="'+ height +'" style="display: block"></iframe>';
		jQuery(mapa).html(html);
	} else {
		return;
	}
	
	function getCamposPesquisa(){
		if (campos == null) {
			// Busca os campos que compoem o endereço separados por |
			campos = [];
			jQuery.each('#{campos}'.split(','), function(i, campoId){
				var campo = document.getElementById(campoId);
				if (campo) {
					campos.push(campo);
				}
			});
		}
		return campos;
	}
	
	function pesquisaEndereco(endereco) {
		
		var mapWindow = jQuery(mapa).children('iframe')[0].contentWindow;
		mapWindow.mapWidth = width;
		mapWindow.mapHeight = height;
		mapWindow.mapClose = function(){
			jQuery(mapa).children('iframe').hide();
		};
		
		if (mapWindow.pesquisaEndereco) {
			mapWindow.pesquisaEndereco(endereco, function(ok){
				if (ok == true) {
					jQuery(mapa).children('iframe').show();
				} else {
					jQuery(mapa).children('iframe').hide();
					alert("Não foi possivel encontrar o endereço.");
				}
			});
		} else {
			alert('Problemas ao efetuar a pesquisa.');
		}
	}
	
	jQuery(mapa).children('button').click(function(){
		
		var endereco = [];
		
		jQuery.each(getCamposPesquisa(), function(){
			var it = jQuery(this);
			var val = it.val();
			if (val) {
				if (it.is('select')) {
					val = it.find('option:selected').text();
				}
				endereco.push(val);
			}
		});
		
		pesquisaEndereco(endereco.join(', '));
		
		return false;
	});
});