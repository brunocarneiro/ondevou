$(function(){
	$("#opinion").click(function(){$(getOpinionTemplate()).dialog({modal:true, height:500, width:600, create:
		function(event,ui){
			$(" #notaAmbiente input").rating();
			$(" #notaAtendimento input").rating();
			$(" #notaComida input").rating();
			$(" #notaBebida input").rating();
			$(" #notaCustoBeneficio input").rating();
		}
	})});
	$("#opinion").button();
	
	
});


function getOpinionTemplate(){
	var html='';
	$.ajax({url:'http://localhost:8080/site/opiniao.html',async: false, success: function(data){
		html=data;
	}});
	return html;
	
}