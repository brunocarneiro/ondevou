$(function(){
	$("#opinion").click(function(){$(getOpinionTemplate()).dialog({modal:true, height:500, width:600, create:
		function(event,ui){
			$("input[type=radio]").rating();
		}
	})});
	$("#opinion").button();
	
	$("#enviarOpiniao").live("click",function(){
		$.ajax(
				{
					 url:'http://localhost:8080/site/soa/service/api.lugarUsuario',
					 data:form2json($("#lugarUsuario")),
					 type:'POST',
					 dataType:'json',
					 success: function(data){
						 if(data.messages["erro"])
							 $("#msg").append(data.messages["erro"]);
						 if(data.messages["sucesso"]){
							 alert(data.messages["sucesso"])
							 $("#msg").append(data.messages["sucesso"]);
							 if(data.messages["sucesso"].length>0){
								 //fechando a janela
								 $(getOpinionTemplate()).dialog().close();
							 }
						 }
					 }
				});
	});
});


function getOpinionTemplate(){
	var html='';
	$.ajax({url:'http://localhost:8080/site/opiniao.html',async: false, success: function(data){
		html=data;
	}});
	return html;
	
}