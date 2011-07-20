/**
 * Arquivo geral de funções para manipulação de eventos no form.
 * @author Adolfo Júnior
 * @author Mauren Ginaldo Souza
 * @version 1.0
 * @since nov/2010 jCompany 6.0
 */
plc.form = {

	/**
	 * Injeta a propriedade no formato nome_subnome_subsubnome no objeto informado
	 * 
	 * foo_0 -> obj[foo] = [ valor ];
	 * foo_bar -> obj[foo] = { bar: valor };
	 * foo_0_bar -> obj[foo] = [ { bar: valor } ];
	 * foo_bar_xyz -> obj[foo] = { bar: { xyz: valor } };
	 */
	setObject: function( obj, prop, value ){
		// caso passe um objeto jquery.
		if ( typeof prop.attr == "function" ) {
			if ( !value ) {
				value = prop.val( );
			}
			prop = prop.attr( "name" );
		}
		// pega o padrao de nome (parent_resto...)
		var names = /(?:([^_|\.]+)[_|\.])?(.+)/.exec( prop );
		if ( names ) {
			var parent = names[1], field = names[2];
			// se nao possui parent quer dizer que acabou a 
			if (parent) {
				// ainda nao tem a propriedade, entao cria.
				if (!obj[parent]) {
					obj[parent] = /\d+[_|\.|$]/.test( field ) ? [] : {};
				}
				this.setObject( obj[parent], field, value );
			} else {
				obj[field] = value;
			}
		}
	}

	/**
	 * Transforma um objeto jquery, ou uma string de parametros,
	 * em um objeto, seguindo a convencao de nomeclatura dos campos de formulario.
	 * 
	 * {
	 *  form: {
	 *   nome: "foo",
	 *   endereco: {
	 *    rua: "bar"
	 *   }
	 *  }
	 * }
	 * em
	 * {
	 *  form_nome: "foo",
	 *  form_endereco_rua: "bar"
	 * }
	 */
	,toObject: function( form ){
		var object = {};
		// possivel objeto jquery.
		if ( typeof form == "object" ) {
			// possivel form no DOM.
			if ( typeof form.elements != "undefined" ) {
				form = $( form );
			}
			// Procura o formulario.
			if ( typeof form.is == "function" ) {
				 if ( !form.is("form") ) {
					 form = form.find( "form:first" );
				 }
				 // jQuery serialize.
				 form = form.serialize( ).split( "&" );
			}
		}
		// itera na lista para montar o objeto.
		for (var i in form) {
			var name = null, value = null;
			// se for uma string no formato "a=b"
			var param = /([^=]+)=(.*)/.exec( form[i] );//(p[1])=(p[2])
			if (param) {
				name = param[1];
				value = param[2];
			} else {
				// se for um objeto {a: b}
				name = i;
				value = form[i];
			}
			if ( name && value ) {// achou e not-empty
				this.setObject( object, name, value );
			}
		}
		return object;
	}

	/*
	 * Transforma um objeto, em um objeto na convencao de nomeclatura dos campos de formulario.
	 * 
	 * {
	 *  form: {
	 *   nome: "foo",
	 *   endereco: {
	 *    rua: "bar"
	 *   }
	 *  }
	 * }
	 * em
	 * {
	 *  form_nome: "foo",
	 *  form_endereco_rua: "bar"
	 * }
	 */
	,toElements: function( object, elements, parent ){
		if (!elements) {
			elements = {};
		}
		for ( var key in object ) {
			var name = (parent ? parent + "_" : "") + key;
			var value = object[key];
			if ($.isArray(value)) {
				elements[name] = value.length;
				this.toElements( value, elements, name );
			} else if ( typeof value == "object" ) {
				this.toElements( value, elements, name );
			} else {
				elements[name] = value;
			}
		}
		return elements;
	}
	
	,getActionURL: function( url ){
		url = url || location.href;
		var action = url.match( /\/?(\w+).html$/ );
		if ( action ) {
			action = action[1].toLowerCase( );
		}
		return action;
	}
	
	,collectionInsert: function( collectionName, $collection, size ){
		
		if (!$collection) {
			$collection = $( "form", $.mobile.activePage ).find( "[data-collection='" + collectionName +"']");
		}

		if (size > 0) {
			$collection.find( ".plc-template-item" ).remove( );
		}

		var $template = $collection.find( ".plc-template" );
		

		for (var i = 0; i < (size || 1); i++ ) {
			var $item = $template.clone( ).removeClass( "plc-template" ).addClass( "plc-template-item" );
			var items = $collection.find( ".plc-template-item" ).length;
			var html = $item.html( ).replace( /\#\{p\}/g, items + 1 ).replace( /\#\{i\}/g, items );
			$item.html( html ).appendTo( $collection );
		}
	}
	
	/**
	 * Pega os valores do rest e popula o form
	 */
	,updateForm: function( object, page ){
		// Obtem o form da pagina carregada.
		var $form = $( "form", page || $.mobile.activePage );
		console.log( "UPDATE-FORM ", object, $form );
		// adiciona o evento que vai ser chamado apenas uma vez para carregar o html da pagina.
		var elements = this.toElements( object );
		// armazena no form o objeto atual. 
		$form.data( "elements", elements );
		// Adiciona os collections antes.
		$form.find("[data-collection]").each(function(){
			var collection = $( this ).data( "collection" );
			var length = elements[ collection ];
			if (length && length > 0) {
				plc.form.collectionInsert( collection, $( this ), length );
			}
		});
		// itera sobre todos os elementos para setar os valores no form.
		for ( var e in elements ) {
			var $element = $form.find( "[name='" + e + "']" );
			if ( $element.length > 0 && e.indexOf("indExcPlc") == -1) {
				// TODO: tratar os tipos de de elementos como checkbox e radio.
				if ( $element.is("select") ) {
					//verifica se é combo de entidades e enums
					if ( $element.find( "option[data-value]" ).length ) {
						if (elements[e]) {
							//verifica se retornou numero
							if (parseFloat(elements[e]) > 0) {
								$element.find( "option[data-value=" + elements[e] + "]" ).attr( "selected", "selected" );
							} else {
								$element.find("option:contains('"+ elements[e] +"')").attr( "selected", "selected" );	
							}
						}
						continue;
					//verifica se é combo sim/não
					} else if ($element.attr("data-role") == "slider") {
						$element.find("option[value='" + elements[e] + "']").attr( "selected", "selected" );
						continue;
					}	
				}
				$element.val( elements[e] );
			}
		}
		// dispara atualizacao de lookup.
		plc.form.recuperaLookups( page );
	}

	/**
	 * Pega os valores dos items e preenche o vinculado
	 */
	,updateVinculado: function( page , item , argVinculado ){
		var $form = $("form" , page);
		for (var e in argVinculado) {
			$form.find("[name=" + e + "]").attr("value", item[argVinculado[e]]);
		}
	}
	
	
	/**
	 * Limpa o form
	 */
	, clear: function ( message ) {
		$( "form", $.mobile.activePage ).find( "[name^='" + message.action + "_']" ).each(function( ) {
			$( this ).val( "" );
			//teste select
			 if ( $( this ).is( "select" ) ) {
				  //teste se é sim/não
				 if ( $( this ).attr( "data-role" ) == "slider" ) {
				 	$( this ).find( "option[value='false']" ).attr( "selected", "selected" );
				 } else {	
					 $( this ).selectmenu("refresh");
				 }	 
			 }	 
		});
		//setando select sim/não para false
		//$("form", $.mobile.activePage ).find("option[value='false']").attr( "selected", "selected" );
	}
	
	/**
	 * Adiciona mensagem no mapa de mensagens
	 */
	, addMessage: function (mapaMensagens, tipo, mensagem ) {
		if (mapaMensagens[tipo] == null) {
			var vetorMensagens = [];	
		} else {	
			vetorMensagens = mapaMensagens[tipo];
		}	
		vetorMensagens[vetorMensagens.length] = mensagem;
		mapaMensagens[tipo] = vetorMensagens;
		return mapaMensagens;
	} 
	
	/**
	 * Pega o mapa de mensagens e retorna o html resultante
	 */
	, getMessages: function (mapaMensagens)	{
	
		var mensagem = "";
	
		var getClasseMensagem = function(tipo, nivel) {
			if (tipo == "sucesso") {
				return (nivel == 'div' ? 'plc-msg-sucesso' : 'iAlertaSucesso');
			} else if (tipo == "advertencia") {
				return (nivel == 'div' ? 'plc-msg-advertencia' : 'iAlertaAdvertencia');
			} else if (tipo == "erro") {
				return (nivel == 'div' ? 'plc-msg-erro' : 'iAlertaErro');
			}	
		};
	
		for (var tipo in mapaMensagens) {
			mensagem = mensagem + "<div class='ui-corner-all plc-msg " + getClasseMensagem(tipo,'div') + "' ><ul>";
			var mensagens =  mapaMensagens[tipo];
			for (var m in mensagens) {
				mensagem = mensagem + "<li class='icoLi'><span class='ico " +  getClasseMensagem(tipo,'span') + "'/>" + mensagens[m] + "</li>";
			}
			mensagem = mensagem + "</ul></div>";
		}
		return mensagem;
	}	
	
	/**
	 * Itera recursivamente em um objeto json e recupera valor
	 */
	, getValueObject: function ( nome , objeto ) {
		
		var arrayNome = nome.split("_");
		if (objeto[ arrayNome[0] ] != null && typeof objeto[ arrayNome[0] ] == "object") {
			return plc.form.getValueObject( nome.replace(  arrayNome[0] + "_" , "" ), objeto[ arrayNome[0] ] );
		} else {
			return objeto[ arrayNome[0] ];
		}	
	}	
	
	/**
	 * Recupera os lookups do form
	 */
	, recuperaLookups: function ( $page )	{
		
		if (!$page) {
			$page = $( $.mobile.activePage );
		}	
		
		var $form = $( "form", $page );
		
		var lookups = [];
		
		$( "[data-lookup]", $form ).each(function( ){
			lookups.push( $(this).attr("data-lookup") );
		});
		
//		console.log("recuperaLookups(" + lookups.length + ")");
//		console.log(lookups.length > 0);
		
		if (lookups.length > 0) {
			$.ajax({
				type: 'GET'
				,url: plc.contextPath + "/soa/service/lookup(" + lookups.join(",") + ")"
				,success: function( result ){
					
//					console.log( "LOOKUPS-RECUPERADO" );
				
					resultado = $.parseJSON( result );
					
					resultado = resultado.lookup;
					
					var lookup, lista, objeto, id, nome, opcao;
					
					var data = $form.data( "elements" );
					
					$( "[data-lookup]", $form ).each(function( ){
						//pegando o objeto select
						var $it = $(this);
						// limpando os options
						$it.find("option[value!='']").remove();
						lookup = $it.attr( "data-lookup" );
						lista = resultado[ lookup ];
						
						for (var posicao in lista) {
							objeto = lista[ posicao ];
							id = objeto["id"] || objeto["codigo"] || objeto["lookup"];
							nome = objeto["lookup"];
							opcao = "<option value='" + id + "' data-value='" + id + "'>" + nome + "</option>";
							$it.append("<option value='" + id + "' data-value='" + id + "'>" + nome + "</option>");
						}
						if (data) {
							$it.val( data[ this.name ] );
						}
						$it.selectmenu( "refresh" );
					});	
				}
				,error: function( result ){
					alert("erro");
				}	
			});
		}	
	}
	/**
	 * Refresh nos lookups do form
	 */
	, atualizaLookups: function ( )	{
		
		var $page = $( $.mobile.activePage );
		var $form = $( "form", $page );
		var lookups = [];
			$("[data-lookup]", $form ).each(function( ) {
//			console.log($(this).attr("id"));	
			$(this).selectmenu('refresh');
		});	
	}		
	/**
	 * Inicializa o formulário recuperando registros e lookups necessários
	 */
	, initializeForm: function ( page )	{
		plc.form.recuperaLookups( page );
		//verificando se é tabular
		if (page.id.indexOf("Tab.") > -1) {
			//recuperar registros
			plc.form.recuperaRegistros( page );
		}
	}	
	
	, recuperaRegistros: function ( page ) {
		// dispara a acao do botao no Bus!
		var $form = $( "form", page );
		// acao que o formulario esta configurado para disparar.
		var action = $form.attr( "action" );
		$.ajax({
			type: 'GET'
			,url: plc.contextPath + "/soa/service/" + action
			,success: function( result ){
				// faz o parser do json retornado.
				result = $.parseJSON( result );
				// itera sobre os itens, montando o HTML.
				plc.form.updateForm( result, page );
			}
			,error: function( ){
				console.log( "SERVICE: erro ao pesquisar!" );
				mapaMensagens = plc.form.addMessage(mapaMensagens = {}, "erro", "Erro ao processar pesquisa!" );
				setTimeout(function(){	plc.bus.publish( action + ".mensagemTopo", plc.form.getMessages(mapaMensagens) ); }, 0);
			}
		});
		
	}
		
}
