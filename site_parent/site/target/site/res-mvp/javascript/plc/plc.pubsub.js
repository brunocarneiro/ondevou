/**
 * Arquivo geral de funções para manipulação de eventos no form.
 * @author Adolfo Júnior
 * @author Mauren Ginaldo Souza
 * @version 1.0
 * @since nov/2010 jCompany 6.0
 * 
 */
// Enhancement dos botoes de formulario!
// Dispara ao click de qualquer botao existente na pagina que tenha um value definido.
$( "form" ).live( "submit", function( event ){
	return false;
});
$( "button[value]" ).live( "click", function( event ){
	// dispara a acao do botao no Bus!
	var $form = $( "form", $.mobile.activePage );
	// dispara a acao do botao no Bus!
	var $id = $form.find( "input[name$=_id]" );
	// acao que o formulario esta configurado para disparar.
	var action = $form.attr( "action" );
	// Se nao tiver Action no form, usa o nome da da pagina!
	if ( !action || action == "#" ) {
		action = plc.form.getActionURL( );
	}
	// acao do botao clicado.
	var value = this.value;
	// procura por argumentos no formato JSON.
	var args = $( this ).data( "args" );
	if ( args ) {
		try {
			eval( "args=" + args );
		} catch (e) {
			// TODO: Disparar mensagem de erro?
			args = null;
		}
	}
	// Serializa o formulario em modo json.
	var data = plc.form.toObject( $form );
	// seta o ID.
	plc.form.setObject( data, $id );
	// Mensagem no formato JSON.
	var message = {
		id: $id.val( )
		,action: action
		,value: value
		,data: data
		,args: (args || {})
	};
	// dispara o evento serializado.
	console.log( "PUBLISH -> " + action + "." + value, message );
	// Dispara o evento do bus!
	plc.bus.publish( action + "." + value, message );
	
	return false;
});


/**
 * Faz a chama da para a gravação
 */
plc.bus.subscribe( "*.grava", function( type, message ){
	var id = message.id;
	var url = plc.contextPath + "/soa/service/" + message.action;
	var tipo = "POST";
	if (id) {
		url += "(" + id + ")";
		tipo = "PUT";
	}	
	$.ajax({
		type: tipo
		,url: url
		,data: $.toJSON( message.data )
		,success: function( result ) {
			result = $.parseJSON( result );
			// apenas se ouver dados, atualiza a pagina, caso contrario deve mostrar uma mensagem.
			if ( result[message.action] ) {
				plc.form.updateForm( result );
				mapaMensagens = plc.form.addMessage(mapaMensagens = {}, "sucesso", "Registro gravado com sucesso!" );
				setTimeout(function(){	plc.bus.publish( type + ".mensagemModal", plc.form.getMessages(mapaMensagens) ); }, 0);
			} else {
				// FIXME: deve ter vindo mensagens na resposta.
				// aguarda a pagina ser criada.
				mapaMensagens = plc.form.addMessage(mapaMensagens = {}, "sucesso", "Erro ao gravar registro!" );
				plc.bus.publish( type + ".mensagemTopo", plc.form.getMessages(mapaMensagens) );
			}
		}
		,error: function( ){
			mapaMensagens = plc.form.addMessage(mapaMensagens = {}, "erro", "Erro ao gravar objeto!" );
			setTimeout(function(){	plc.bus.publish( type + ".mensagemTopo", plc.form.getMessages(mapaMensagens) ); }, 0);
		}
	});
});


/**
 * Faz a chamada para gravação de um caso de uso tabular
 */
plc.bus.subscribe( "*.gravaTabular", function( type, message ){

	$.ajax({
		type: 'POST'
		,url: plc.contextPath + "/soa/service/" + message.action
		,data: $.toJSON( message.data )
		,success: function( result ) {
			// chama o recarrega
			plc.bus.publish( message.action + ".recarrega", message );
			mapaMensagens = plc.form.addMessage(mapaMensagens = {}, "sucesso", "Registro(s) gravado(s) com sucesso!" );
			setTimeout(function(){	plc.bus.publish( type + ".mensagemModal", plc.form.getMessages(mapaMensagens) ); }, 0);
		}
		,error: function( ){
			mapaMensagens = plc.form.addMessage(mapaMensagens = {}, "erro", "Erro ao gravar registro(s)!" );
			setTimeout(function(){	plc.bus.publish( type + ".mensagemTopo", plc.form.getMessages(mapaMensagens) ); }, 0);
		}
	});
});


/**
 * Faz a chama da para a pesquisa
 */
plc.bus.subscribe( "*.pesquisa", function( type, message ){
	
	$.ajax({
		type: 'GET'
			,url: plc.contextPath + "/soa/service/" + message.action
			// FIXME: Adicionar parametros na pesquisa.
			,data:  plc.form.toElements( message.data )
			,success: function( result ){
		// faz o parser do json retornado.
		result = $.parseJSON( result );
		// itera sobre os itens, montando o HTML.
		var data = result[ message.action ];
		// apenas se ouver dados, atualiza a pagina, caso contrario deve mostrar uma mensagem.
		if ( data ) {
			//recuperando lista ul li
			var $list = $( ".plc-tabela", $.mobile.activePage );
			//pegando objeto para clonar
			var $template = $list.find( ".plc-tabela-template" );
			//removendo os li's de buscas anteriores
			$list.find( ".plc-tabela-selecao" ).remove( );
			//iterando nas linhas de objetos
			// FIXME... verificar refresh do componente listview
			for (var i = 0; i < data.length; i++ ) {
				var item = data[i];
				// Cria o clone do Template.
				var $clone = $template.clone( ).removeClass( "plc-tabela-template" ).addClass( "plc-tabela-selecao" );
				// Adiciona a funcao que abre.
				var $link = $clone.find( "a" );
				$link.data( "href", $link.attr( "href" ) );
				$link.data( "id", item.id );
				$link.data( "item", item );
				$link.attr( "href", "#" );
				$link.click(function( ){
					var callback = $("form", $.mobile.activePage).data("callback");
					if (callback) {
						callback( plc.form.toElements($( this ).data( "item" ) ));	
					} else {
						plc.bus.publish( message.action + ".abre", {
							url: $( this ).data( "href" )
							,id: $( this ).data( "id" )
						});
					}
				});
				//iterando nos objetos outputs e preenchendo
				$clone.find( "span[data-id]" ).each(function( ) {
					//pegando o nome da propriedade
					var propriedade = $( this ).data( "id" ).replace( message.action + "_", "" );
					$( this ).text( plc.form.getValueObject( propriedade, item ) );
				});
				//adicionando o clone na tabela.
				$clone.appendTo( $list );
			}
		}
	}
	,error: function( ){
		console.log( "SERVICE: erro ao pesquisar!" );
		mapaMensagens = plc.form.addMessage(mapaMensagens = {}, "erro", "Erro ao processar pesquisa!" );
		setTimeout(function(){	plc.bus.publish( type + ".mensagemTopo", plc.form.getMessages(mapaMensagens) ); }, 0);
	}
	});
});

/**
 * Faz a chamada para a pesquisa
 */
plc.bus.subscribe( "*.recarrega", function( type, message ){
	
	$.ajax({
		type: 'GET'
		,url: plc.contextPath + "/soa/service/" + message.action
		,success: function( result ){
			// faz o parser do json retornado.
			result = $.parseJSON( result );
			// itera sobre os itens, montando o HTML.
			plc.form.updateForm( result );
		}
		,error: function( ){
			console.log( "SERVICE: erro ao pesquisar!" );
			mapaMensagens = plc.form.addMessage(mapaMensagens = {}, "erro", "Erro ao processar pesquisa!" );
			setTimeout(function(){	plc.bus.publish( type + ".mensagemTopo", plc.form.getMessages(mapaMensagens) ); }, 0);
		}
	});
});

/**
 * Abre o objeto da pesquisa para edição
 */
plc.bus.subscribe( "*.abre", function( type, message ){

	var action = plc.form.getActionURL( message.url );
	console.log(message.id);
	$.ajax({
		type: 'GET'
		,url: plc.contextPath + "/soa/service/" + action + "(" + message.id + ")"
		,success: function( result ){
			result = $.parseJSON( result );
			// apenas se ouver dados, atualiza a pagina, caso contrario deve mostrar uma mensagem.
			if ( result[action] ) {
				console.log( "ABRE: " + message.url, result[action] );
				// prepara o evento para quando recarregar o form.
				var liveId = $( "[data-role=page]" ).live( "pagecreate", function( event, ui ){
					plc.form.updateForm( result, event.target );
					$( liveId ).die( );
				});
				// Chama a nova pagina!
				$.mobile.changePage( { url: message.url }, false, false, true );
			} else {
				// FIXME: deve ter vindo mensagens na resposta.
			}
		}
		,error: function( ){
			console.log( "SERVICE: erro ao pesquisar!" );
		}
	});
});

/**
 * Abre o objeto da pesquisa para edição
 */
plc.bus.subscribe( "*.vinculado", function( type, message ){

	var destino = message.args.url;
	if (destino.indexOf("/") == -1) {
		// Pega o id da url atual
		destino = $.mobile.activePage.attr( "id" );
		//altera o final da url atual para a url de destino
		destino = destino.replace(destino.substring(destino.lastIndexOf("/") +1, destino.length), message.args.url);
	}
	var $activePage = $.mobile.activePage;
	var $argsVinvulado =  message.args.vinculado;
	var liveId = $( "[data-role=page]" ).live( "pagecreate", function( event, ui ){
		//plc.form.updateForm( result, event.target );
		$("form", event.target).data("callback", function ( items ) {
			$.mobile.changePage( $activePage , false, false, false );
			plc.form.updateVinculado( $activePage, items, $argsVinvulado );
		});
		$( liveId ).die( );
	});
	$.mobile.changePage( { url: destino }, false, false, false );

});



/**
 * Prepara o formulário de manutenção para inclusão de novo
 */
plc.bus.subscribe( "*.novo", function( type, message ){
	var $page = $( $.mobile.activePage );
	// ID da pagina eh a propria URL!
	var url = $page.attr( "id" );
	var action = plc.form.getActionURL( url );
	//faz uma requisição rest fazia somente para criar uma entidade
	$.ajax({
		type: 'GET'
		,url: plc.contextPath + "/soa/service/" + action + "()"
		,success: function( result ){
			result = $.parseJSON( result );
			console.log( "ABRE: " + message.url, result[action] );
			// prepara o evento para quando recarregar o form.
			var liveId = $( "[data-role=page]" ).live( "pagecreate", function( event, ui ){
				plc.form.updateForm( result, event.target );
				$( liveId ).die( );
			});
			// Chama a nova pagina!
			$.mobile.changePage( { url: url }, false, false, true );
		}
		,error: function( ){
			console.log( "SERVICE: erro ao pesquisar!" );
		}
	});	
});

/**
 * Muda de URL. Caso a url destino não contenha '/', pega o path da pagina atual e adiciona
 */
plc.bus.subscribe( "*.navega", function( type, message ){
	var destino = message.args.url;
	if (destino.indexOf("/") == -1) {
		// Pega o id da url atual
		destino = $.mobile.activePage.attr( "id" );
		//altera o final da url atual para a url de destino
		destino = destino.replace(destino.substring(destino.lastIndexOf("/") +1, destino.length), message.args.url);
	}	
	
	var action = plc.form.getActionURL( message.url );
	//faz uma requisição rest fazia somente para criar uma entidade
	$.ajax({
		type: 'GET'
		,url: plc.contextPath + "/soa/service/" + action + "()"
		,success: function( result ){
			result = $.parseJSON( result );
			// prepara o evento para quando recarregar o form.
			var liveId = $( "[data-role=page]" ).live( "pagecreate", function( event, ui ){
				plc.form.updateForm( result, event.target );
				$( liveId ).die( );
			});
			$.mobile.changePage( { url: destino }, false, false, true );
		}
		,error: function( ){
			console.log( "SERVICE: erro ao pesquisar!" );
		}
	});
	
	
	
	
	
//	setTimeout(function(){	plc.form.recuperaLookups( ); }, 0);
	$.mobile.changePage( { url: destino }, false, false, true );
//	setTimeout(function(){	plc.form.atualizaLookups( ); }, 0);
	//limpando o form
//	plc.form.clear( message );
	//buscando os lookups
});

/**
 * Limpa o form de pesquisa
 */
plc.bus.subscribe( "*.limpa", function( type, message ){
	// Workaround pois nao tem refresh em campos ainda, por isso recarrega!
//	var $page = $( $.mobile.activePage );
	// ID da pagina eh a propria URL!
//	var url = $page.attr( "id" );
	// Chama a nova pagina!
//	$.mobile.changePage( { url: url }, false, false, false );
	//recuperando lista ul li
	var $list = $( ".plc-tabela", $.mobile.activePage );
	//removendo os li's de buscas anteriores
	$list.find( ".plc-tabela-selecao" ).remove( );
	//limpando o form
	plc.form.clear( message );
});

/**
 * Esclui o registro
 */
plc.bus.subscribe( "*.exclui", function( type, message ){

	var id = message.id;

	if ( id ) {
		if ( !confirm( "Excluir registro " + id ) ) {
			return;
		}
		$.ajax({
			type: "DELETE"
			,url: plc.contextPath + "/soa/service/" + message.action + "(" + id + ")"
			,data: $.toJSON( message.data )
			,success: function( result ){
				// faz o parser do json retornado.
				result = $.parseJSON( result );
				// itera sobre os itens, montando o HTML.
				var data = result[ message.action ];
				// apenas se ouver dados, atualiza a pagina, caso contrario deve mostrar uma mensagem.
			//	console.log( "SERVICE: Excluido!", data );
				mapaMensagens = plc.form.addMessage(mapaMensagens = {}, "sucesso", "Registro excluido com sucesso!" );
				setTimeout(function(){	plc.bus.publish( type + ".mensagemModal", plc.form.getMessages(mapaMensagens) ); }, 0);
				// TODO: Mensagem de item excluido com sucesso.
				plc.bus.publish( message.action + ".novo" );
			}
			,error: function( ){
			//	console.log( "SERVICE: erro ao Excluir!" );
				mapaMensagens = plc.form.addMessage(mapaMensagens = {}, "erro", "Erro ao excluir registro!" );
				setTimeout(function(){	plc.bus.publish( type + ".mensagemTopo", plc.form.getMessages(mapaMensagens) ); }, 0);

			}
		});
	} else {
		alert( "Item nao selecionado" );
	}
});

/**
 * Exive mensagem no formato modal
 */
plc.bus.subscribe( "*.novo.*", function( type, message ){
	var types = type.split( "." );
	plc.form.collectionInsert( types[2] );
});

/**
 * Exibe mensagem no topo da tela
 */
plc.bus.subscribe( "*.*.mensagemTopo", function( type, message ){
	//se já existir erro sendo mostrado, não mostra nada
	if ($("div .plc-msg", $.mobile.activepage ).length == 0) {
		$("[data-role='content']", $.mobile.activePage).prepend(message);		
	}	
});	

/**
 * Exive mensagem no formato modal
 */
plc.bus.subscribe( "*.*.mensagemModal", function( type, message ){
	//verifica se tinha erro sendo mostrado e limpa
	if ($("div .plc-msg", $.mobile.activepage ).length != 0) {
		$("div .plc-msg", $.mobile.activepage ).remove();		
	}	
	$("<div class='ui-loader ui-overlay-shadow ui-body-b ui-corner-all' style='width: 300px;'>" + message + "</div>")
	.css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
	.appendTo("body").delay(2500)
	.fadeOut(400, function(){
		$(this).remove();
	});
});
