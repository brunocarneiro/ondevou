
jQuery.plc = {
	/*
	 * Transforma um Form em um Objeto.
	 * @param form Seletor jQuery, ou DOM do formulário.
	 * @param preffix Prefixo presente nos elementos do formulário, que deve ser descartado.
	 * 
	 * O Prefixo é comum em JSF. 
	 */
	uriParam:'?evento=y',
	componentesDef:null
	,componenteFoco:null
	,formAtual:null
	,form2json: function(form, preffix){
		var $form = (form && jQuery(form)) || null;
		if ($form) {
			if ($form.is('form')) {
				var elements = $form.attr('elements');
				if (elements && elements.length) {
					var data = {};
					jQuery.each(elements, function(){
						var $it = jQuery(this);
						var name = $it.attr('name');
						
						if (preffix && name && name.indexOf(preffix) == 0) {
							name = name.substring(preffix.length);
						}
						if (name) {
							var value = $it.val();
							var type = $it.attr('type');
							if ((type == 'checkbox' || type == 'radio') && $it.attr('checked') != true) {
								return;
							}
							if (value) {
								if (typeof data[name] != 'undefined') {
									if (data[name].constructor!= Array) {
										data[name]=[data[name], value];
									} else {
										data[name].push(value);
									}
								} else {
									//concatenando nome e valor para criar uma URI a ser inserida no linkPermanente.
									jQuery.plc.uriParam=jQuery.plc.uriParam+"&"+name+"="+value;
									data[name] = value;
								}
							}
						}
					});
					return data;
				}
			}
		}
		return null;
	}
	/*
	 * Faz requisição de componentes via ajax 
	 * @param url Faz requisicão de uma url especifica. Caso vazio, utiliza url do form
	 * @param Evento a ser executado
	 * @param componentes Um array com os componentes que serão recuperados. Ex.: ['plc.jsps.geralMensagemPlc', 'def.corpo.ancestral.tab'] 
	 * @param form Um seletor para o form
	 */
	,partialAjaxSubmit: function (url, evento, componentes, form) {
		if (form && (url == "" || typeof url == "undefined" || url == null)){
	    	url = jQuery(form).attr('action');
		}
	    if (url == ""){
	    	url = location.href;
		}
	    if (evento)
	    	url = url + '?evento=' + evento;
		for ( var i = 0; i < componentes.length; i++) {
			url = url + "&plcDef=" + componentes[i];
		} 
		jQuery.plc.componentesDef = componentes;
		jQuery.plc.formAtual = form;
	    jQuery.post(url, jQuery(form).serialize(), function (t){
	    	for ( var i = 0; i < jQuery.plc.componentesDef.length; i++) {

				var	componente = jQuery.plc.componentesDef[i];
	    		if (jQuery("span[class=" + componente + "]").length > 0){
	    			if (jQuery(t).filter("span[class=" + componente + "]").length > 0){
	    				var atualizar = jQuery(t).filter("span[class=" + componente + "]").html();
	    				jQuery("span[class=" + componente + "]").html(atualizar);
		    		}
					if (jQuery(t).find("span[class=" + componente + "]").length > 0){
	    				var atualizar = jQuery(t).find("span[class=" + componente + "]").html();
	    				jQuery("span[class=" + componente + "]").html(atualizar);
		    		}
	    		}
			}
	    	mantemAbaSelecionada ();
	    });
	}
	/*
	 * Cria uma nova Janela Dialog do jQuery UI.
	 * Recebe um objeto de configuração, que deve ter como parâmetro, a url e o tamanho da janela.
	 * {
	 * 	url: '...'
	 *  ,width: ...
	 *  ,height: ...
	 * }
	 * @param Objeto de configuração com URL.
	 * @return Retorna o Objeto jQuery Dialog.
	 */
	,janelaModal: function(c, dialogOpener){
		// Possibilita recursividade!
		if (window.parent && window.parent != window) {
			var funcaoModal = window.parent.jQuery && window.parent.jQuery.plc && window.parent.jQuery.plc.janelaModal;
			if (funcaoModal)
				return window.parent.jQuery.plc.janelaModal(c, (dialogOpener || window));
		}
		var defaultWidth = 720, defaultHeight = 480;
		//verificando se já existe uma janela modal
		var janelas = jQuery('div[id^=plc-modal]');
		if (jQuery('div[id^=plc-modal]').length == 0) {
			id_modal = 'plc-modal';
		} else if (janelas.length > 0) {
			var id_modal = /(\d)/.exec(jQuery('div[id^=plc-modal]')[janelas.length -1].id);
			if (id_modal) {
				id_modal = 'plc-modal' + (parseInt(id_modal[0]) + 1);	
			} else {
				id_modal = 'plc-modal2';	
			}
		}	

		// Cria o jQuery UI Dialog com iFrame!
		var dialog = jQuery(
			'<div id="' + id_modal + '"'+
			'title="'+ (c.title||'') +'" '+
				'style="padding: 0px; margin: 0px; width: '+(c.width || defaultWidth)+'px; height: '+(c.height || defaultHeight)+'px; display: block;"'+
			'>'+
				'<iframe src="#" style="display: none; width: 99%; height: 99%; border: none;"></iframe>'+
			'</div>'
		);
		
		dialog.dialog({
			modal: true
			,width: (c.width || defaultWidth)
			,height: (c.height || defaultHeight)
			//,hide: 'slide'
			,open: function(){
				if (c.onopen){
					c.onopen(c, dialogOpener);
				}
				dialog.children('iframe').attr('src',c.url).show();
			}
			,dragStart: function(){
				if (c.ondragstart){
					c.ondragstart(c, dialogOpener);
				}
				dialog.children('iframe').hide();
			}
			,resizeStart: function(){
				if (c.onresizestart){
					c.onresizestart(c, dialogOpener);
				}
				dialog.children('iframe').hide();
			}
			,dragStop: function(){
				if (c.ondragstop){
					c.ondragstop(c, dialogOpener);
				}
				dialog.children('iframe').show();
			}
			,resizeStop: function(){
				if (c.onresizestop){
					c.onresizestop(c, dialogOpener);
				}
				dialog.children('iframe').show();
			}
			,beforeClose: function(){
				if (c.onbeforeclose){
					c.onbeforeclose(c, dialogOpener);
				}
				dialog.children('iframe').hide();
			}
			,close: function(){
				dialog.children('iframe').remove();
				if (c.onclosed){
					c.onclosed(c, dialogOpener);
				}
				dialog.dialog('destroy');
			}
		});
		// Injeta no iFrame o dialogOpener, e a funcao dialogClose!
		dialog.children('iframe').bind('load', function(){
			var iWindow = jQuery(this).attr('contentWindow');
			iWindow.dialogOpener = dialogOpener || window;
			iWindow.dialogClose = function(){
				dialog.dialog('close');
				dialog.children('iframe').unbind('load');
			};
		});
		return dialog;
	}
	,applyToString: function(o){
		function toString(){
			return this.lookup || '';
		}
		if (o && o.hasOwnProperty('lookup') && o.toString !== toString) {
			o.toString = toString;
			for (i in o) {
				if (o[i] && o[i].hasOwnProperty('lookup')) {
					jQuery.plc.applyToString(o[i]);
				}
			}
		}	
	}
	/*
	 * Transforma um Form em um Objeto.
	 * @param form Seletor jQuery, ou DOM do formulário.
	 * @param preffix Prefixo presente nos elementos do formulário, que deve ser descartado.
	 * 
	 * O Prefixo é comum em JSF. 
	 */
	,criaSelecaoJqGrid: function(idGrid, idNavegacao, configuracaoGrid){
		
		idGrid = document.getElementById(idGrid);
		idNavegacao = document.getElementById(idNavegacao);
		
		var actionForm = function(){
			var action = jQuery('#corpo\\:formulario').attr('action');
			var index = action.indexOf('?');
			return (index != -1 ? action.substring(0, index) : action);
		};
		var modoJanelaPlc = configuracaoGrid.modoJanelaPlc || '';
		var nomeLogica = configuracaoGrid.nomeLogica || '';
		var evento = configuracaoGrid.evento ||getParametroUrl('evento')||'';
		var propAgregada = configuracaoGrid.propAgregada || nomeLogica;
		var urlPesquisa = (configuracaoGrid.urlPesquisa || (plcGeral.contextPath + '/soa/service/grid.' + nomeLogica));
		var urlParams = extractURLParams();
		var fwPlc = urlParams.fwPlc;
		if (!fwPlc) {
			fwPlc = actionForm();
			if (fwPlc.indexOf('/') != -1) {
				fwPlc = fwPlc.substring(fwPlc.lastIndexOf('/') + 1);
			}
		}
		var seletorBotaoPesquisar = (modoJanelaPlc == 'modal' ? '#modal\\:formulario\\:botaoAcaoPesquisar' : '#corpo\\:formulario\\:botaoAcaoPesquisar');
		var seletorFormulario = (modoJanelaPlc == 'modal' ? '#modal\\:formulario' : '#corpo\\:formulario');
		var prefixoFormulario = (modoJanelaPlc == 'modal' ? 'modal:formulario:' : 'corpo:formulario:');
		var dadosPesquisa = {};
		var aoSelecionarLinha = null;
		var urlEdicao = function(){
			if (configuracaoGrid.urlEdicao) {
				return configuracaoGrid.urlEdicao;
			} else {
				//se termina com 'con', significa que e uma consulta
				if(nomeLogica.lastIndexOf('con')==nomeLogica.length-3){
					var actionForm = actionForm();
					var index=actionForm.indexOf(plcGeral.contextPath)+plcGeral.contextPath.length;
					actionForm=actionForm.substring(index);
				} else {
					return '/f/t/' + consultardepartamentocon + 'man'
				}
			}
			return actionForm;
			
		};
		var getDadosPesquisa = function(id) {
			var data = null;
			if (dadosPesquisa) {
				jQuery.each(dadosPesquisa, function(){
					if (this.id == id) {
						data = this;
						return false;
					}
				});
			}
			return data;
		};
		var pesquisaAjax = function(postData){
			// evitar cliques repetidos no botao
			jQuery(seletorBotaoPesquisar).attr("disabled",true);
			//alterando ponteiro do mouse
			jQuery(seletorBotaoPesquisar).css("cursor","wait");
			//exibindo icone ajax
			jQuery.plc.partialLoading();
			var params = [];
			jQuery.each(postData, function(k, v){
				params.push(escape(k)+'='+escape(v));
			});
			jQuery.ajax({
				url: urlPesquisa
				,type: "GET"
				,data: params.join('&')
				,dataType: "json"
				,success: function(data){
					//limpando msgs antigas
					jQuery.plc.mensagem(false);
					//habilitando o botao de pesquisa
					jQuery(seletorBotaoPesquisar).removeAttr("disabled");
					//alterando ponteiro do mouse
					jQuery(seletorBotaoPesquisar).css("cursor","pointer");
					// ocultando icone ajax
					jQuery.plc.partialLoading(false);
					if (!data) {
						jQuery.plc.mensagem("erro", "Erro ao processar pesquisa.", false);
						return;
					} else if (typeof data == "string") {
						jQuery.plc.mensagem("erro", data, false);
						return;
					}
					else if(data.messages){
						jQuery.plc.mensagem(data.messages, false);
					}

					else {
						jQuery.plc.mensagem(false);
					}
					dadosPesquisa = (data && data.rows) || [];
					// Em caso de chave natural, o objeto não tem ID, e o Grid precisa do ID para identificar a linha
					jQuery.each(dadosPesquisa, function(i, row){
						jQuery.plc.applyToString(row);
						if (row.id == null && row.idNatural) {
							row.id = i;
						}
					});
					var jqGrid = jQuery(idGrid).get(0);
					if (jqGrid && data) {
						jqGrid.addJSONData(data);
						if (data.records == 0) {
							jQuery.plc.mensagem("erro", "Nenhum registro que atende aos crit&eacute;rios informados foi encontrado!", false);
						} 
					}
					jQuery(idGrid).find('tr.jqgrow:odd').addClass('linhapar');
					jQuery(idGrid).find('tr.jqgrow:even').addClass('linhaimpar');
				}
				,error: function(){
					//habilitando o botao de pesquisa
					jQuery(seletorBotaoPesquisar).removeAttr("disabled");
					//alterando ponteiro do mouse
					jQuery(seletorBotaoPesquisar).css("cursor","pointer");
					// ocultando icone ajax
					jQuery.plc.partialLoading(false);

					jQuery.plc.mensagem("erro", "Erro ao processar pesquisa.", false);
				}
			});
		};
		var pesquisar = function(){ 
			var formData = jQuery.plc.form2json(seletorFormulario, prefixoFormulario);
			jQuery(idGrid).setPostData(formData);
			jQuery(idGrid).setGridParam({
				page: 1
				,datatype: pesquisaAjax
			});
			jQuery(idGrid).trigger("reloadGrid");
			//alterando o valor do link permanente.
			jQuery("#linkPermanente").removeAttr("href").attr('href',''+actionForm()+jQuery.plc.uriParam);
		};
		if (configuracaoGrid.aoSelecionar){
			aoSelecionarLinha = function(id){
				configuracaoGrid.aoSelecionar(id, getDadosPesquisa(id));
			};
		} else {
			aoSelecionarLinha = function(id){
				var data = getDadosPesquisa(id);
				if (!data) {
					return;
				}
				if (modoJanelaPlc == 'modal' || modoJanelaPlc == 'popup') {
					var values = [];
					for (var n in data) {
						values.push(n + '#' + data[n]);
					}
					values.push(propAgregada + '#' + data['idAux']);
					values.push(propAgregada + 'Lookup#' + data['lookup']);
					if (typeof data['idNatural']!= "undefined") {
						for (var n in data['idNatural']) {
							values.push(n + '#' + data['idNatural'][n]);
						}
					}	 
					values = values.join(',');
					devolveSelecao(values);
				} else {
					var redirect = urlEdicao();
					// Extrai os parametros da URL
					var params = extractURLParams(redirect);
					// Extrai os parametros da edicao.
					if (data.linkEdicaoPlc) {
						$.extend(params, extractURLParams('?' + data.linkEdicaoPlc));
					} else {
						params.chPlc = id;
					}
					// Adiciona o fwPlc, caso nao tenha sido informado.
					if (fwPlc && !params.fwPlc) {
						params.fwPlc = fwPlc;
					}
					// Gera a URL final com os parametros.
					params = $.param(params);
					// gera a URL final
					jQuery.plc.parcialAjaxCorpo( redirect + (params ? '?' + params : '') );
				}
			};
		}
		// Pesquisa não intrusiva!
		jQuery(seletorBotaoPesquisar).removeAttr("onclick").click(pesquisar);
		var larg; 
		if (NavYes) { 
			larg= 0.965; 
		} else 	{
			larg = 0.965;
		}
		var defaultJqGrid = {        
                jsonReader: {repeatitems: false}
				,datatype: "local"
                ,page: 1
                ,rowNum: 10
                ,pager: jQuery(idNavegacao)
                ,width: jQuery(idGrid).parent().width() * larg
                ,height: 240
                ,scrollrows : true
                ,viewrecords: true
                ,sortorder: "asc"
                ,multiselect: false
                ,onSelectRow: aoSelecionarLinha
        }
		if (evento == 'y' || evento == 'Y' || evento == 'z' || evento == 'Z') {
			//se vai entrar pesquisando, verificar os parametros para ser preenchidos como argumento.
			setURLParamIntoForm(prefixoFormulario);
			defaultJqGrid.postData = jQuery.plc.form2json(seletorFormulario, prefixoFormulario);
			jQuery("#linkPermanente").attr('href', actionForm() + jQuery.plc.uriParam);
			defaultJqGrid.datatype = pesquisaAjax;
		}
		 var jqGrid = jQuery.extend({}, defaultJqGrid, configuracaoGrid.jqGrid);
		 if (jqGrid.rowNum && !jqGrid.hasOwnProperty('rowList')) {
                jqGrid.rowList = [jqGrid.rowNum, jqGrid.rowNum*2, jqGrid.rowNum*3]
        }
         jQuery(idGrid)
         .jqGrid(jqGrid)
		.navGrid(idNavegacao, {
			search: false
			,add: false
			,edit: false
			,del: false
		});
		jQuery(window).bind('resize', function() { jQuery(idGrid).setGridWidth(jQuery(window).width() * larg); });
	}
	,dadosTreeView: {
	}
	,criaTreeView: function(options){
		if (!options) {
			options = {};
		}
		var id = options.id || 'plc-treeview';
		var element = document.getElementById(id);
		if (!element) {
			element = jQuery('<table id="plc-treeview" cellpadding="0" cellspacing="0"></table>').prependTo('#div-treeview').get(0);
		}
		var logica = options.logica || null;
		var dados = {};
		if (logica) {
			if (!jQuery.plc.dadosTreeView.hasOwnProperty(logica)) {
				jQuery.plc.dadosTreeView[logica] = {};
			}
			dados = jQuery.plc.dadosTreeView[logica];
		}
		var urlEdicao = options.urlEdicao || null;
		var aoSelecionar = null;
		var recuperaObjetos = function(parent, level, data){
			var tree = jQuery(document.getElementById(id));
			if (tree.length > 0 && data && data.rows) {
				// Injeta nos dados omplementares para arvore.
				if (data.rows.length > 0) {
					jQuery.each(data.rows, function(){
						// Atualiza os dados carregados!
						jQuery.plc.applyToString(this);
						dados[this.id] = jQuery.extend(this, {
							level: level + 1
							,parent: parent
							,isLeaf: false
							,expanded: false
						});
					});
					if (dados[parent]) {
						dados[parent].expanded = true;
					}
					tree[0].addJSONData(data);
				}
			}
		}
		if (options.aoSelecionar){
			aoSelecionar = function(id){
				options.aoSelecionar(id, dados[id]);
			};
		} else {
			aoSelecionar = function(id){
				var objeto = dados[id];
				if (!objeto) {
					return;
				}
				var urlRedirect = urlEdicao;
				if (urlRedirect.indexOf('?') == -1) {
					urlRedirect += '?';
				}
				urlRedirect += (objeto.linkEdicaoPlc || ('chPlc=' + id));

				jQuery.plc.parcialAjaxCorpo(urlRedirect);
			};
		}
		var defaultOptions = {
				colNames: ['', (options.titulo || '')]
				,colModel: [{
					name: 'id',
					index: 'id',
					width: 1,
					hidden: true,
					sortable: false
				},{
					name: 'lookup',
					index: 'lookup',
					width: 300,
					hidden: false,
					sortable: false
				}]
				,treeGrid: true
				,treeGridModel: 'adjacency'
				,ExpandColumn: 'lookup'
				,ExpandColClick: true
				,jsonReader: {repeatitems: false}
				/*,treeIcons:{
					plus:'ui-icon-folder-collapsed'
					,minus:'ui-icon-folder-open'
					,leaf:'ui-icon-tag'
				}*/
				,multiselect: false
				,onSelectRow: aoSelecionar
				,datatype: function(postData){
					var level = (postData.n_level >= 0 ? postData.n_level : -1);
					var parent = (postData.nodeid || null);
					jQuery.ajax({
						type: 'GET'
						,url: plcGeral.contextPath + '/soa/service/treeview.' + logica
						,data: postData
						,dataType: 'json'
						,success: function(data){
							recuperaObjetos(parent, level, data);
						}
					});
				}
			};
		jQuery(function(){
			if (element) {
				jQuery(element).jqGrid(jQuery.extend(defaultOptions, (options.jqGrid || {})));
			}
		});
	}
	,trocaConteudoParcial: function(selector, html, beginComment, endComment){		
		var begin = html.indexOf(beginComment);
		if (begin != -1) {
			var end = html.indexOf(endComment, begin);
			if (end != -1) {
				var content = jQuery(selector);
				if (content.length > 0) {					
					jQuery.plc.cacheScripts(html.substring(begin, end + endComment.length));
					content.empty().html(html.substring(begin, end + endComment.length));
					
				}
			}
		}
	}

	,cacheScripts: function(html,selector){
		var $parsed = jQuery(html);
		var cachedScripts = new Array();
		$parsed.each(
			function(value){
				if(this && this.tagName && this.tagName.indexOf('SCRIPT')>=0){
					plcAjax.cachedScripts[plcAjax.cachedScripts.length]=this;
				}
			}
		);
	}


	,partialLoading: function(active) {
		if (active === false) {
			jQuery('#partial-loading').remove();
		} else {
			var el = jQuery('#partial-loading');
			if (el.length == 0) {
				var el = jQuery('<div id="partial-loading" class="partial-loading"/>');
				if (jQuery('#barraAcoes').length != 0) {
					jQuery('#barraAcoes').append(el);
				} else if (jQuery('#plc-corpo-acao').length != 0) {
					jQuery('#plc-corpo-acao').append(el);
				} else {
					jQuery('body').append(el);
				}
			} else {
				el.show();
			}
		}
	} 
	,parcialAjaxCorpo: function(url){
		// Trata URLs
		if (url.indexOf('http') != 0 && url.indexOf(plcGeral.contextPath) != 0) {
			url = plcGeral.contextPath + url;
		}
		jQuery.plc.partialLoading();
		// Faz a requisição GET via Ajax para atualizar o Corpo da Página.
		jQuery.ajax({
			url: url
			,type: "GET"
			,cache: false
			,success: function(html){
				if (html.indexOf('action="j_security_check"') != -1) {
					location.href = plcGeral.contextPath;
				} else {
					jQuery.plc.trocaConteudoParcial('#plc-topo', html, '<!-- #inicio-ajax-plc-topo# -->', '<!-- #fim-ajax-plc-topo# -->');
					jQuery.plc.trocaConteudoParcial('#plc-corpo', html, '<!-- #inicio-ajax-plc-corpo# -->', '<!-- #fim-ajax-plc-corpo# -->');
				}
			}
			,error: function(xhr){
				var error = (/<title>\s*erro\w*\s*(\d*)\s*<\/title>/gi).exec(xhr.responseText);
				error = error ? jQuery.trim(error[1]) : "500";
				location.href = plcGeral.contextPath + "/res-plc/erros/erro" + error + ".html";
			}
			,complete: function(){
				jQuery.plc.partialLoading(false);
			}
		});
	}
	/*
	 * Exibe mensagem no cabeçalho da aplicação. Se a mensagem que for enviada for nula, o cabeçalho será limpado
	 */
	,mensagem: function( type, msg, clear, classMsg, classIcon, container ) {
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
				this.mensagem( t, type[t], clear, (classMsg && classMsg[t] ? classMsg[t] : false), (classIcon && classIcon[t] ? classIcon[t] : false), container || false );
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
				$msg.fadeIn( "slow" );
			} else {
				$msg.hide( );
			}
		});
	}

	,acao: function(nomeAcao, argAcao){
		if (nomeAcao) jQuery(document).trigger(nomeAcao, (argAcao || {}));
	}
	/*
	 * Defini uma tecla de atalho, correspondendo a alguma ação do jCompany.
	 */
	,hotkey: function( hotkey, acao ) {
		
		//unbind no botao
		if(typeof(acao) == "function") {
			jQuery(document).bind('keydown', hotkey,function (evt){acao(); return false; });
		} else {
			jQuery(document).bind('keydown', hotkey,function (evt){eval(selBotao(acao)).click(); return false; });
		}
	}	
}