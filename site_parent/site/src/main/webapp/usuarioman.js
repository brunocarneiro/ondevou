/**
 * Ao iniciar a pagina
 * @author Bruno Carneiro
 */
$(document).ready(function(){

	aoClicarAba("visitado");
	aoClicarAba("favorito");
	aoClicarAba("avaliado");
	aoClicarAba("desejado");
	aoClicarAba("agenda");
	
});

function aoClicarAba(nomeAba){
	$("#"+nomeAba).click(function(){
		
		$.ajax({url:'http://localhost:8080/site/soa/service/api.lugarUsuario?usuario='+getParam('id')+'&'+nomeAba+'=1',
			dataType:'json',
			success: function(result){
					$('.libraryItems').html("");
					parseado=Mustache.to_html(getTemplate(), result).replace(/^\s*/mg, '');
					$('.libraryItems').html(parseado);
					//trocando a selecao da aba
					$('#libraryNavigation li.current').removeClass('current');
					$("#"+nomeAba).parent().addClass('current');
				}
			}
		);
	});
}

function getTemplate(){
	return '<ul class=" libraryItems artistsLarge">{{#data}}{{#lugar}}<li id="r6_1053512" class=" first"><a href="lugar?id="><span class="pictureFrame"><span class="image">'
	+'<img width="126" height="126" src="" alt="">'
	+'</span><span class="overlay"></span></span><strong class="name">{{nome}}</strong></a> <a rel="nofollow" class="plays" href=""><span dir="ltr">(609&nbsp;opini�es)</span></a>'
	+'<a href="" class="playbutton ">'
	+'<img width="13" height="13" src="" alt="Tocar" class="transparent_png play_icon">'
	+'</a><a class="remove" title="" href=""><img width="13" height="13" src="" class="transparent_png dismiss_dark_icon"></a></li>{{/lugar}}{{/data}}</ul>';
}