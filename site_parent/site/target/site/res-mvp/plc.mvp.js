
var plc = {
	contextPath: '/epc'
};

// plcGeral existe apenas para compatibilizar com APIs de JS antigas.
var plcGeral = {
	contextPath: plc.contextPath
};

plc.util = {
	
	urlParams: function( url ) {
		var object = null;
		var params = url;
		var index = params.indexOf( '#' );
		if ( index != -1 ) {
			params = params.substring( 0, index );
		}
		index = params.indexOf( '?' );
		if ( index != -1 ) {
			params = params.substring( index + 1 );
			params = $.trim( params );
			if ( params ) {
				params = params.split( /&(?!amp;)/ );
				for ( var p in params ) {
					var param = params[p];
					if ( param ) {
						// se for uma string no formato "a=b"
						// regex -> (param[1])=(param[2])
						param = /([^=]+)(?:=(.*))?/.exec( param );
						if (param) {
							if ( !object ) {
								object = {};
							}
							object[ param[1] ] = param[2] || '';
						}
					}
				}
			}
		}
		return object || null;
	}
	
	,urlObject: function( url, parseHashTo ) {
		var resource = url;
		var params = null;
		var hash = null;
		// procura pela HASH.
		var index = url.indexOf( '#' );
		if ( index != -1 ) {
			resource = url.substring( 0, index );
			hash = url.substring( index + 1 );
		}
		index = resource.indexOf( '?' );
		if ( index != -1 ) {
			resource = resource.substring( 0, index );
			params = this.urlParams( url );
		}
		if ( hash && parseHashTo === true ) {
			hash = this.urlObject( hash, parseHashTo );
		}
		return {
			resource: resource
			,params: params
			,hash: hash
		};
	}
};

plc.message = function( type, msg, clear, classMsg, classIcon, container ) {
	// funcao que adiciona uma mensagem.
	var appendMessage = function( $msg, icon, msg ){
		var text = $.trim( msg );
		if ( text ) {
			$msg.append( "<span class=\"ico "+ icon +"\"></span>" ).append( "<p>"+ text +"</p>" );
		}
	};
	// Monta as classes CSS de tipo e icone.
	if ( typeof type == "object" ) {
		// espera objetos de configuracao.
		// shift de argumentos.
		container = classIcon;
		classIcon = classMsg;
		classMsg = clear;
		clear = msg;
		for (var t in type) {
			plc.message( t, type[t], clear, (classMsg && classMsg[t] ? classMsg[t] : false), (classIcon && classIcon[t] ? classIcon[t] : false), container || false );
		}
		return;
	}
	if ( typeof type == "string" ) {
		classMsg = classMsg || ( "plc-msg-" + type );
		classIcon = classIcon || ( "i-plc-msg-" + type );
	} else {
		type = !!type;
	}
	// Possibilita forçar o container de mensagens.
	// Se nao informar, procura pelos divs de plc-msg-* dentro do #plc-mensagem
	// Itera em todas os DIVS containers de mensagens.
	jQuery( container || "#plc-mensagem" ).children( "div" ).each(function( ){
		var $msg = $( this );
		// mensagem(false) limpa as mensagens.
		if ( type === false ) {
			$msg.empty( ).hide( );
		} else {
			if ( $msg.hasClass( classMsg ) ) {
				// mensagem(type, false) some com as mensagens especificas.
				if ( msg === false ) {
					$msg.empty( );
				} else if ( msg !== true ) {
					// mensagem(type, "msg", false) não limpa mensagens anteriores.
					if ( clear !== false ) {
						$msg.empty( ).hide( );
					}
					// Uma unica mensagem.
					if ( typeof msg == "string" ) {
						appendMessage( $msg, classIcon, msg );
					} else {
						// Uma colecao de mensagens.
						for (var m in msg) {
							appendMessage( $msg, classIcon, msg[m] );
						}
					}
				}
			}
		}
		// verifica se mensagens foram adicionadas.
		if ( $msg.find( "p" ).length > 0 ) {
			$msg.show();
		} else {
			$msg.hide( );
		}
	});
};

plc.form = {};

// Wrapper do PageBus!
plc.bus = {
	
	publish: function( ) {
		PageBus.publish.apply(PageBus, arguments);
	}
	
	,subscribe: function( ) {
		if ( arguments.length == 2 ) {
			return PageBus.subscribe.call( PageBus, arguments[0], null, arguments[1], null );
		} else {
			return PageBus.subscribe.apply( PageBus, arguments );
		}
	}
	
	,unsubscribe: function( ) {
		PageBus.unsubscribe.apply( PageBus, arguments );
	}
	
	// TODO: adicionar mecanismo de desregistrar os listeners.
};

plc.form.util = {
	/* Injeta a propriedade no formato nome_subnome_subsubnome ou nome.subnome.subsubnome no objeto informado
	 * 
	 * foo_0 -> obj[foo] = [ valor ];
	 * foo_bar -> obj[foo] = { bar: valor };
	 * foo.0.bar -> obj[foo] = [ { bar: valor } ];
	 * foo.bar.xyz -> obj[foo] = { bar: { xyz: valor } };
	 */
	setValue: function( obj, prop, value ){
		// caso passe um objeto jquery.
		if ( $.isFunction( prop.attr ) ) {
			if ( !value ) {
				value = prop.val( );
			}
			prop = prop.attr( "name" );
		}
		// pega o padrao de nome (parent_resto...)
		var names = /(?:([^_|\.]+)[_|\.])?(.+)/.exec( prop );
		if ( names ) {
			var parent = names[ 1 ], field = names[ 2 ];
			// se nao possui parent quer dizer que acabou a 
			if ( parent ) {
				// ainda nao tem a propriedade, entao cria.
				if ( !obj[parent] ) {
					obj[parent] = /\d+[_|\.|$]/.test( field ) ? [] : {};
				}
				this.setValue( obj[parent], field, value );
			} else {
				obj[field] = value;
			}
		}
	}
	/* Transforma um objeto jquery, ou uma string de parametros,
	 * em um objeto, seguindo a convencao de nomeclatura dos campos de formulario.
	 * 
	 * {
	 *     form: {
	 *         nome: "foo",
	 *         endereco: {
	 *             rua: "bar"
	 *         }
	 *     }
	 * }
	 * em
	 * {
	 *     "form_nome": "foo",
	 *     "form_endereco_rua": "bar"
	 *     ...ou...
	 *     "form.nome": "foo",
	 *     "form.endereco.rua": "bar"
	 * }
	 */
	,toObject: function( source, destination ){
		
		var object = destination || {};
		
		if ( typeof source == "string" ) {
			source = $.trim( source );
			// parametros a=b&... ou {JSON} ?
			if ( source.length > 1 && source.charAt( 0 ) == '{' && source.charAt( source.length - 1 ) == '}' ) {
				source = $.parseJSON( source );
			} else {
				source = this.urlParams( source );
			}
		}
		
		if ( typeof source == "object" ) {
			if ( typeof source.tagName != "undefined" ) {
				source = $( source );
			}
			// possivel form jquery.
			if ( typeof source.serializeArray == "function" ) {
				// jQuery serialize.
				var serialized = source.serializeArray( );
				for ( var i in serialized ) {
					this.setValue( object, serialized[i].name, serialized[i].value );
				}
			} else {
				// source eh um hash.
				for ( var name in source ) {
					this.setValue( object, name, source[name] );
				}
			}
		}
		
		return object;
	}
	/* Transforma um objeto, em um objeto na convencao de nomeclatura dos campos de formulario.
	 * 
	 * 
	 * {
	 *     form: {
	 *         nome: "foo",
	 *         endereco: {
	 *             rua: "bar"
	 *         }
	 *     }
	 * }
	 * em
	 * {
	 *     "form_nome": "foo",
	 *     "form_endereco_rua": "bar"
	 *     ...ou...
	 *     "form.nome": "foo",
	 *     "form.endereco.rua": "bar"
	 * }
	 */
	,toElements: function( object, elements, parent ){
		
		if ( !elements ) {
			elements = {};
		}
		
		if ( object && $.type( object ) == "object" ) {
			if ( object.nodeType ) {
				object = $( object );
			}
			// possivel form jquery.
			if ( $.isFunction( object.serializeArray ) ) {
				// jQuery serialize.
				var serialized = object.serializeArray( );
				for ( var i in serialized ) {
					elements[ serialized[i].name ] = serialized[i].value;
				}
			} else {
				for ( var key in object ) {
					var name = ( parent ? parent + "_" : "" ) + key;
					var value = object[ key ];
					var type = $.type( value );
					if ( type == "array" ) {
						elements[name] = value.length;
						this.toElements( value, elements, name );
					} else if ( type == "object" ) {
						this.toElements( value, elements, name );
					} else {
						elements[name] = value;
					}
				}
			}
		}
		return elements;
	}
};

plc.form.controller = {

	init: function( ){
		plc.bus.publish( "plc.form.controller.init", $( "form" ) );
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
	,updateForm: function( $form, data ){
		// obtem o ultimo bind do form.
		var bind = data ? plc.form.util.toElements( data ) : $form.data( "bind" );
		// itera sobre todos os elementos para setar os valores no form.
		for ( var name in bind ) {
			var $item = $form.find( "[name='" + name + "']" );
			if ( $item.length > 0 && name.indexOf("indExcPlc") == -1 ) {
				$item.val( bind[name] );
			}
		}
		// seta no form o bind atualizado.
		$form.data( "bind", bind );
	}
	
	,updateNavigationControls: function( $form , action , result ){
	
		var page = result[ "plcPage" ];
		var total = result[ "plcTotalRecords" ];
		var records = result[ "plcViewRecords" ];
		
		if (page == null || total == null || records == null) {
			$form.find( "[data-navigation=navigator]" ).addClass("navigator");
			return;
		} else {
			$form.find( "[data-navigation=navigator]" ).removeClass("navigator");
		}
			
		var totalPages = ((total % records) == 0) ? total / records : (Math.floor(total / records) + 1);
		var pageRecordsIni = ((((page - 1) * records) + 1) < total) ? (((page - 1) * records) + 1) : total;
		var pageRecordsFin = ((page * records) < total) ? (page * records) : total;
	
		var label = pageRecordsIni + " a " + pageRecordsFin + " de " + total;
	
		//setando valores nos campos de controle
		$form.find( "#" + action + "_plcPage" ).attr("value", page);
		$form.find( "#" + action + "_plcTotalRecords" ).attr("value", total);
		$form.find( "#" + action + "_plcViewRecords" ).attr("value", records);
	
	
		// setando classes 
		$form.find( "[data-navigation=first]" ).removeClass( (page <= 1) ? 'first' : 'first-bw' ).addClass( (page <= 1) ? 'first-bw' : 'first' );
//		$form.find( "[data-navigation=first]" ).attr("disabled" ,  (page <= 1) ? 'disabled' : '' );
		$form.find( "[data-navigation=previous]" ).removeClass( (page <= 1) ? 'previous' : 'previous-bw' ).addClass( (page <= 1) ? 'previous-bw' : 'previous' );
//		$form.find( "[data-navigation=previous]" ).attr("disabled" , (page <= 1) ? 'disabled' : '' );
		$form.find( "[data-navigation=next]" ).removeClass( (page == totalPages) ? 'next' : 'next-bw' ).addClass( (page == totalPages) ? 'next-bw' : 'next' );
//		$form.find( "[data-navigation=next]" ).attr("disabled" , (page <= 1) ? 'disabled' : '' );
		$form.find( "[data-navigation=last]" ).removeClass( (page == totalPages) ? 'last' : 'last-bw' ).addClass( (page == totalPages) ? 'last-bw' : 'last' );
//		$form.find( "[data-navigation=last]" ).attr("disabled" , (page <= 1) ? 'disabled' : '' );
		$form.find( "[data-navigation=label]" ).text(label);	
	} 
	
	,updateCollections: function( ){
		// recria os itens que são do tipo collection.
		$form.find( "[data-collection]" ).each(function( ){
			var $item = $( this );
			var type = $item.data( "collection" );
			var size = bind[ type ];
			if ( size && size > 0 ) {
				plc.form.controller.collectionInsert( type, $( this ), size );
			}
		});
	}
	
	/**
	 * Pega os valores dos items e preenche o vinculado
	 */
	,updateAggregate: function( $form , item , aggregationData ){
		for ( var name in aggregationData ) {
			$form.find("[name=" + name + "]").val( aggregationData[name] );
		}
	}
	
	/**
	 * Limpa o form
	 */
	,clear: function ( message ) {
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
	,addMessage: function (mapaMensagens, tipo, mensagem ) {
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
	,getMessages: function (mapaMensagens)	{
	
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
	,getValueObject: function ( nome , objeto ) {
		
		var arrayNome = nome.split("_");
		if (objeto[ arrayNome[0] ] != null && typeof objeto[ arrayNome[0] ] == "object") {
			return plc.form.controller.getValueObject( nome.replace(  arrayNome[0] + "_" , "" ), objeto[ arrayNome[0] ] );
		} else {
			return objeto[ arrayNome[0] ];
		}	
	}	
	
	/**
	 * Recupera os lookups do form
	 */
	,updateLookups: function ( $form )	{
		
		var lookupIDs = [];
		var lookupItems = [];
		
		$( "[data-lookup]", $form ).each(function( ){
			var lookup = $.trim( $( this ).data( "lookup" ) );
			if ( lookup && lookupIDs.indexOf( lookup ) == -1 ) {
				lookupIDs.push( lookup );
			}
			lookupItems.push( this );
		});
		
		if ( lookupIDs.length > 0 ) {
			$.ajax({
				type: 'GET'
				,url: plc.contextPath + "/soa/service/lookup(" + lookupIDs.join( "," ) + ")"
				,success: function( result ){
					// Parse da resposta
			//		result = $.parseJSON( result );
					// obtem o bind do formulário.
					var bind = $form.data( "bind" );
					// Itera sobre cada elemento do form preenchendo os lookups.
					$( lookupItems ).each(function( ){
						// pegando o objeto select.
						var $item = $( this );
						// limpando os options.
						if ( $item.is('select') ) {
							$item.find("option[value!='']").remove( );
						}
						// Obtem a lista de objetos lookup.
						var lookup = result.lookup[ $item.data( "lookup" ) ];
						if ( lookup ) {
							for ( var i in lookup ) {
								var item = lookup[ i ];
								var id = item.id || item.lookup;
								var text = item.lookup || item.name || item.id;
								$item.append("<option value='" + id + "' data-value='" + id + "'>" + text + "</option>");
							}
							if ( bind ) {
								$item.val( bind[ this.name ] );
							}
						}
					});	
				}
				,error: function( result ){
					alert("Erro ao recuperar Lookups.");
				}	
			});
		}	
	}
	/**
	 * Inicializa o formulário recuperando registros e lookups necessários
	 */
	,init: function ( )	{
		this.updateLookups( $("form") );
	}
	
	,retrieve: function ( $form ) {
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
	
};

plc.form.action = {
	
	init: function( ){
		$( "button[value]" ).live( "click", plc.form.action._handler );
	//	$( "select[data-args]" ).live( "change", plc.form.action._handler );
		$( "a[href^=#]" ).live( "click", plc.form.action._handler );
		$( "input:button[data-args]" ).live( "click", plc.form.action._handler );
	}
	
	,_handler: function( event ){
		// evita que o browser execute o comportamento do click.
		event.preventDefault( );
		// executa a acao no !
		return plc.form.action.execute( this );
	}
	
	,execute: function( target, argsOverride ){
		var $target = $( target );
		// Complementa os argumentos.
		var args = argsOverride || this.getArgs( $target );
		// Procura pelo form que o botao aciona.
		var $form = this.getForm( $target, args );
		// Procura pela action que vai ser disparada.
		var action = this.getAction( $target, $form, args );
		// Procura pelo tipo de acao.
		var type = this.getType( $target, args );
		// Procura pelos dados usados no argumento.
		var data = this.getData( $target, $form, args );
		// Dispara a acao no form.
		var event = "form." + type + "." + action;
		var message = {
			type: type
			,action: action
			// FIXME: Mecanismo de recuperacao de ID
			,id: data.id || $form.data( "id" )
			,data: data
			,args: args
			,$form: $form
			,$target: $target
			,done: null
			,fail: null
		};
		
		console.log( "[plc.form.controller] Event", event, message );
		
		plc.bus.publish( event, message );
	}
	
	,getArgs: function( $el ) {
		// Obtem por argumentos na notacao de Objeto JS.
		var args = $el.data( "args" );
		if ( args && $.type( "string" ) ) {
			try {
				eval( "args={" + args + "}" );
				$el.data( "args", args );
			} catch (e) {
				// TODO: Erro ao obter args?
				args = null;
			}
		}
		return args || {};
	}
	
	,getForm: function( $el, args ) {
		// args override form.
		var $form = args && args.form;
		if ( $form ) {
			return $( "form[name="+ $form +"]" );
		}
		if ( $el ) {
			if ( $el.is( "button" ) || $el.is( "input:button" ) ) {
				var $form = $el.attr( "form" );
				if ( $form ) {
					$form = $( $form );
				}
			}
			$form = ( $form && $form.length ) ? $form : $el.closest( "form" );
		} else {
			$form = $( "form:first" );
		}
		return $form;
	}
	
	,getAction: function( $el, $form, args ) {
		// args override action.
		var action = args && args.action;
		if ( action ) {
			return action;
		}
		if ( $el ) {
			if ( $el.is( "button" ) || $el.is( "input:button" ) ) {
				action = $el.attr( "formaction" );
			}
		}
		return action || $form.attr( "action" );
	}
	
	,getType: function( $el, args ) {
		// args override type.
		var type = args && args.type;
		if ( type ) {
			return type;
		}
		if ( $el ) {
			if ( $el.is( "button" ) || $el.is( "input:button" ) ) {
				type = $el.val( );
			} else if ( $el.is( "a" ) ) {
				var href = $el.attr( "href" );
				if ( href && href.length > 0 && href.charAt( 0 ) == "#" ) {
					type = href.substring( 1 );
				}
			}
		}
		return type || '';
	}
	
	,getData: function( $el, $form, args ) {
		// TODO: melhorar override de DATA.
		var data = args && args.data;
		data = plc.form.util.toObject( data || $form );
		return data;
	}
}

plc.form.events = {
	
	init: function( ){
		plc.bus.subscribe( "form.*.*", this, this._handler );
	}
	
	,_handler: function( type, message ) {
	
		var types = type.split(".");
		var handler = this[ types[1] ];
		if ( handler ) {
			console.log( "[plc.form.events] Event", type, message );
			handler.call( this, types[2], message );
		} else {
			console.log( "[plc.form.events] Event \"" + type + "\" unresolved.", message );
		}
	}
	
	,"open": function ( action, event ){
		plc.bus.publish( "service.retrieve." + action, {
			id: event.id
			,data: event.data
			,done: function( response ){
				plc.form.controller.updateForm( event.$form, response );
			}
			,fail: function( ){
				alert( "Erro ao tentar recuperar registro." );
			}
		});
	}
	
	,"new": function ( action, event ){
		plc.bus.publish( "service.retrieve." + action, {
			id: ""
			,data: event.data
			,done: function( response ){
				event.$form[0].reset();
				plc.form.controller.updateForm( event.$form, response );
			}
			,fail: function( ){
				alert( "Erro ao tentar criar registro." );
			}
		});
	}
	
	,"save": function ( action, event ){
		plc.bus.publish( "service.save." + action, {
			id: event.id
			,data: event.data
			,done: function( response ){
				plc.form.controller.updateForm( event.$form, response );
				alert( "Registro gravado com sucesso." );
			}
			,fail: function( ) {
				alert( "Erro ao tentar gravar registro." );
			}
		});
	}
	
	,"delete": function ( action, event ){
		
		if ( confirm( "Confirmar exclus&atilde;o do registro?" ) ) {
			
			plc.bus.publish( "service.delete." + action, {
				id: event.id
				,data: event.data
				,done: function( response ){
					console.log( action + ".done", response );
					alert( "Registro excluido com sucesso." );
				}
				,fail: function( ) {
					alert( "Erro ao tentar excluir registro." );
				}
			});
		}
		
	}
	
	,"list": function ( action , event ) {
		
		plc.bus.publish("service.list." + action, {
			data: plc.form.util.toElements(event.data)
			,done: function( response ){
				var data = response[ action ];
				// apenas se ouver dados, atualiza a pagina, caso contrario deve mostrar uma mensagem.
				if ( data ) {
					//recuperando lista 
					var $list = $( ".plc-table", event.$form );
					//pegando objeto para clonar
					var $template = $list.find( ".plc-table-template" );
					//removendo as linhas de buscas anteriores
					$list.find( ".plc-table-selection" ).remove( );
					//iterando nas linhas de objetos
					for (var i = 0; i < data.length; i++ ) {
						var item = data[i];
						// Cria o clone do Template.
						if ((i + 1) % 2) {
							var $clone = $template.clone( ).removeClass( "plc-table-template" ).addClass( "plc-table-selection" );
						} else {
							var $clone = $template.clone( ).removeClass( "plc-table-template" ).addClass( "plc-table-selection shadow" );
						}
						//iterando nos objetos outputs e preenchendo
						$clone.find( "[data-id]" ).each(function( ) {
							var $elemento = $( this );
							//pegando o nome da propriedade
							var propriedade = $elemento.data( "id" ).replace( action + "_", "" );
							var valor = plc.form.controller.getValueObject( propriedade, item );
							if ($elemento.is("img")) {
								$elemento.attr( "src", valor );
							} else if ($elemento.is("a")) {
								$elemento.attr( "href", valor );	
							} else {
								$( this ).text( valor  );	
							}
						});
				
						//ponto de extensão "CLONAR ANTES"
						console.log("Extension Poins >> Clonar Antes");
						plc.bus.publish( "form.list.beforeclone." + action, {  item: item , clone: $clone  });
						
						//adicionando o clone na tabela.
						$clone.appendTo( $list );
					}
					//atualizando os controles de navegação
					plc.form.controller.updateNavigationControls( event.$form , action , response );
				}
				
				
				
			}
		});


	}
	
	,"list-first": function ( action , event ) {
		var elemento = event.$form.find( "#" + action + "_plcPage" );
		var value =  parseInt(elemento.attr("value"));
		if (value == 1) 
			return;
		elemento.attr("value", 1);		
		//re-serializando o form
		event.data = plc.form.util.toObject( event.$form );
		plc.form.events.list ( action , event );
	}
	
	,"list-previous": function ( action , event ) {
		var elemento = event.$form.find( "#" + action + "_plcPage" );		
		var value = parseInt(elemento.attr("value")) - 1;
		if (value < 1)
			return;
		elemento.attr("value", value);
		//re-serializando o form
		event.data = plc.form.util.toObject( event.$form );
		plc.form.events.list ( action , event );
	}

	,"list-next": function ( action , event ) {
		var total = parseInt(event.$form.find( "#" + action + "_plcTotalRecords" ).attr("value"));
		var records = parseInt(event.$form.find( "#" + action + "_plcViewRecords" ).attr("value"));
		var totalPages = ((total % records) == 0) ? total / records : (Math.floor(total / records) + 1);
		var elemento = event.$form.find( "#" + action + "_plcPage" );
		var value = parseInt(elemento.attr("value")) + 1;
		if (value > totalPages)
			return;
		elemento.attr("value", value);
		//re-serializando o form
		event.data = plc.form.util.toObject( event.$form );
		plc.form.events.list ( action , event );
	}
	
	,"list-last": function ( action , event ) {
		var total = parseInt(event.$form.find( "#" + action + "_plcTotalRecords" ).attr("value"));
		var records = parseInt(event.$form.find( "#" + action + "_plcViewRecords" ).attr("value"));
		var totalPages = ((total % records) == 0) ? total / records : (Math.floor(total / records) + 1);	
		var elemento = event.$form.find( "#" + action + "_plcPage" );
		var value = parseInt(elemento.attr("value")) + 1;
		if (value > totalPages)
			return;
		elemento.attr("value", totalPages);
		//re-serializando o form
		event.data = plc.form.util.toObject( event.$form );
		plc.form.events.list ( action , event );
	}
	
	,"list-view": function ( action , event ) {
		plc.form.events.list ( action , event );
	}
	
};

plc.service = {
	
	init: function( ){
		plc.bus.subscribe( "service.*.*", this, this._handler );
	}
	
	,_handler: function( type, message ) {
		var types = type.split(".");
		var handler = this[ types[1] ];
		if ( handler ) {
			console.log( "[plc.service.events] Event", type, message );
			handler.call( this, types[2], message );
		} else {
			console.log( "[plc.service.events] Event \"" + type + "\" unresolved.", message );
		}
	}
	
	,"list": function( action, message ){
		this._ajax( action, "GET", null, message.data, message.done, message.fail );
	}
	
	,"retrieve": function( action, message ){
		this._ajax( action, "GET", message.id || "", message.data, message.done, message.fail );
	}
	
	,"save": function( action, message ){
		if ( message.id ) {
			this.update( action, message );
		} else {
			this.insert( action, message );
		}
	}
	
	,"update": function( action, message ){
		this._ajax( action, "PUT", message.id || "", message.data && $.toJSON( message.data ), message.done, message.fail );
	}
	
	,"insert": function( action, message ){
		this._ajax( action, "POST", null, message.data && $.toJSON( message.data ), message.done, message.fail );
	}
	
	,"delete": function( action, message ){
		this._ajax( action, "DELETE", message.id || "", message.data && $.toJSON( message.data ), message.done, message.fail );
	}
	
	,_checkResponse: function( response ){
		if ( response && response.indexOf("j_security_check") != -1 ) {
			window.location.replace( plc.contextPath );
			return false;
		}
		return true;
	}
	
	,_ajax: function( action, type, id, data, done, fail ) {
		
		var config = {
			type: type
			,url: plc.contextPath + "/soa/service/" + action + ( id == null ? "" : "(" + id + ")" )
			,data: data || null
			,dataType: "text"
			,context: this
			,success: function( response ){
				console.log( "[plc.service.ajax] Done", response );
				if ( this._checkResponse( response ) && done ) {
					var jsonResponse = $.parseJSON( response );
					plc.message(jsonResponse.messages || false);
					done( jsonResponse );
				}
			}
			,error: function( xhr ){
				console.log( "[plc.service.ajax] Fail", xhr.responseText );
				if ( this._checkResponse( xhr.responseText ) && fail ) {
					fail( xhr.responseText ? $.parseJSON( xhr.responseText ) : false );
				}
			}
		};
		
		console.log("[plc.service.ajax] Before", {
			action: action
			,type: type
			,id: id
			,data: data
			,done: done
			,fail: fail
		}, config);
		
		$.ajax( config );
	}
};

// Inicializa os componentes.
$(function( ){
	plc.service.init( );
	plc.form.action.init( );
	plc.form.events.init( );
	plc.form.controller.init( );
	
	var params = plc.util.urlParams( location.href );
	var id = params && params.id;
	if ( !id ) {
		id = $( "form" ).data("id");
	}
	if ( id ) {
		if (id == "*") {
			plc.bus.publish("form.list." + $("form").attr("action"), {id: id, $form: $("form") });
		} else {
			$("form").data( "id", id );
			plc.bus.publish("form.open." + $("form").attr("action"), {id: id, $form: $("form") });
		}	
	}
});
