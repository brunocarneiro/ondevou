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
	
	//escrevendo o rating
	$("input[type=radio]",".notaGeral").each(function(){
		for(i=1;i<6;i++){
			if(this.value==i){continue;}
			if(this.value>i)
				$(this).parent().prepend('<input name="'+$(this).attr('name')+'" type="radio" value="'+(this.value-i)+'" />');
			else
				$(this).parent().append('<input name="'+$(this).attr('name')+'" type="radio" value="'+i+'" />');
		}
	});
	
	$("input[type=radio]",".notaGeral").rating();
	
	$("#newPlaceDialog").click(function(){$(getLugarTemplate()).dialog({modal:true, height:500, width:600});});
	
	$("#endereco").live("change",function(){
		
		top.frames[0].pesquisaEndereco($("#endereco").val(),function(){});
	});
	
	$("#cadastrar").live("click",function(){
		top.frames[0].pesquisaEndereco($("#endereco").val(),function(bool, address_components, location){
			//setting address data
			jQuery("#numero").val(address_components[0].long_name);
			jQuery("#address").val(address_components[1].long_name);
			jQuery("#bairro").val(address_components[2].long_name);
			jQuery("#cidade").val(address_components[3].long_name);
			jQuery("#estado").val(address_components[4].long_name);
			jQuery("#cep").val(address_components[6].long_name);
			jQuery("#latitude").val(location.La);
			jQuery("#longitude").val(location.Ka);
			
			//if place exists
			if(bool){
				//save the place
				jQuery.ajax(
						{
							 url:'http://localhost:8080/site/soa/service/api.lugar',
							 data:form2json(jQuery("#lugar")),
							 type:'POST',
							 dataType:'json',
							 success: function(data){
								 if(data.messages["erro"])
									 jQuery("#msg").append(data.messages["erro"]);
								 if(data.messages["sucesso"]){
									 alert(data.messages["sucesso"])
									 jQuery("#msg").append(data.messages["sucesso"]);
									 if(data.messages["sucesso"].length>0){
										 //fechando a janela
										 jQuery(getOpinionTemplate()).dialog().close();
									 }
								 }
							 }
						});
			}
			else
				alert("erro");
		});
	});
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
	+'</span><span class="overlay"></span></span><strong class="name">{{nome}}</strong></a> <a rel="nofollow" class="plays" href=""><span dir="ltr">(609&nbsp;opiniões)</span></a>'
	+'<a href="" class="playbutton ">'
	+'<img width="13" height="13" src="" alt="Tocar" class="transparent_png play_icon">'
	+'</a><a class="remove" title="" href=""><img width="13" height="13" src="" class="transparent_png dismiss_dark_icon"></a></li>{{/lugar}}{{/data}}</ul>';
}


function getLugarTemplate(){
	var html='';
	$.ajax({url:'http://localhost:8080/site/novoLugar.html',async: false, success: function(data){
		html=data;
	}});
	return html;
	
}