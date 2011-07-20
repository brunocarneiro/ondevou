$( "form" ).live( "submit", function( event, ui ){

	
});


plc.Service = function(logica){
	this.logica = logica;
};

plc.Service.prototype = {
	pesquisar: function(args){
		var logica = this.logica;
		$.ajax({
			type: 'GET'
			,url: '/'+ app.nome +'/soa/service/bus.'+ logica
			//,data: $.toJSON({args:args})
			,success: function(r){
				// Parser JSON!
				var json = $.parseJSON(r);
				// Dispara o evento de mensagens.
				if (json.mensagens && json.mensagens.length > 0) {
					plc.Bus.evento('plc.dados.'+logica+'.pesquisar.mensagens', (json.mensagens || []));
				}
				// Dispara o evento de sucesso.
				plc.Bus.evento('plc.dados.'+logica+'.pesquisar.sucesso', (json.resultado || []));
			}
		});
	}
	,gravar: function(obj){
		var logica = this.logica;
		if (usuario.id) {
			$.ajax({
				type: 'PUT'
				,url: '/'+ app.nome +'/soa/service/bus.'+logica+'(' + obj.id + ')'
				,data: $.toJSON(obj)
				,success: function(r){
					// Parser JSON!
					var json = $.parseJSON(r);
					// Dispara o evento de mensagens.
					if (json.mensagens && json.mensagens.length > 0) {
						plc.Bus.evento('plc.dados.'+logica+'.gravar.mensagens', (json.mensagens || []));
					}
					// Dispara o evento de sucesso.
					plc.Bus.evento('plc.dados.'+logica+'.gravar.sucesso', (json.resultado || []));
				}
			});
		} else {
			$.ajax({
				type: 'POST'
				,url: '/'+ app.nome +'/soa/service/bus.'+logica
				,data: $.toJSON(usuario)
				,success: function(r){
					// Parser JSON!
					var json = $.parseJSON(r);
					// Dispara o evento de mensagens.
					if (json.mensagens && json.mensagens.length > 0) {
						plc.Bus.evento('plc.dados.'+logica+'.gravar.mensagens', (json.mensagens || []));
					}
					// Dispara o evento de sucesso.
					plc.Bus.evento('plc.dados.'+logica+'.gravar.sucesso', (json.resultado || []));
				}
			});
		}
	}
	,excluir: function(obj){
		var logica = this.logica;
		if (obj.id) {
			$.ajax({
				type: 'DELETE'
				,url: '/'+ app.nome +'/soa/service/bus.'+logica+'(' + obj.id + ')'
				,data: $.toJSON(obj)
				,success: function(r){
					// Parser JSON!
					var json = $.parseJSON(r);
					// Dispara o evento de mensagens.
					if (json.mensagens && json.mensagens.length > 0) {
						plc.Bus.evento('plc.dados.'+logica+'.gravar.mensagens', (json.mensagens || []));
					}
					// Dispara o evento de sucesso.
					plc.Bus.evento('plc.dados.'+logica+'.excluir.sucesso', (json.resultado || []));
				}
			});
		}
	}
};

plc.Bus.escutar('plc.dados.*.*', function(t, obj){
	// extrai o evento especifico do repositorio.
	var evento = t.replace('plc.dados.', '').split('.');
	// dispara o servico.
	if (evento.length == 2) {
		var service = new plc.Service(evento[0]);
		if (service[evento[1]]) {
			service[evento[1]].call(service, obj);
		}
	}
});
