
var ajaxUsa = true;

/*-----------------------------------------------------*\

   	  FUNçõeS PARA MANIPULAção DE REQUEST VIA AJAX
\*-----------------------------------------------------*/
//Contrutor Ajax
function PlcAjax(){}
var plcAjax = new PlcAjax();
//Constante para que indica que o request via AJAX foi completado
PlcAjax.prototype.REQUEST_COMPLETO = 4;

//Constante para que indica que h? uma requisição AJAX em andamento
PlcAjax.prototype.AJAX_ATIVO = false;

//Indica se a aplicação utiliza barra de progresso no tratamento
PlcAjax.prototype.ajaxUsaBarraProgresso = true;

//Habilita a barra de progresso. Default false
PlcAjax.prototype.ajaxEscondeBarraProgresso = function (){
	plcAjax.ajaxUsaBarraProgresso = false;
}
//Indica se a requisição ? para camadas diferentes da camada padr?o jCompany
PlcAjax.prototype.ajaxEspecifico = false;

//Indica se a requesição espec?fica utiliza barra de progresso. Default = true
PlcAjax.prototype.ajaxEspecificoBarraProgresso = true;

//Indica qual evento est? executando atualmente a requisição Ajax
PlcAjax.prototype.ajaxEventoAtual = "";

//Guarda objeto Event
PlcAjax.prototype.ajaxEvent;

//Indica tipo de encoding utilizado para retorno dos dados pelo Ajax
PlcAjax.prototype.ajaxCharset = "UTF-8";

//Indica que o m?todo GET deve ser executado com endereço absoluto
PlcAjax.prototype.ajaxUrlBase = new Object();

//Indica uma ?rea espec?fica para atualização
PlcAjax.prototype.ajaxCamadaEspecifica = "";

//Indica se foi realizada uma chamada ao ajax do Apache Trinidad
PlcAjax.prototype.ajaxTrinidadCalled = false;

PlcAjax.prototype.cachedScripts = new Array();

//Habilita m?todo GET com endereço absoluto
PlcAjax.prototype.ajaxSetUrlBase = function (actionBase, urlBase){
	plcAjax.ajaxUrlBase[actionBase] = urlBase;
}
/**
* Executa chamada POST Ajax para URL específica
*/
PlcAjax.prototype.ajaxPost = function (URL, especifico, usaBarra, evento, form){
	if(especifico)
		plcAjax.ajaxHabilitaEspecifico(usaBarra);	
	plcAjax.ajaxSubmit("POST", evento, URL, form);
};
/**
* Executa chamada POST Ajax para método específico e URL específica e área específica
*/
PlcAjax.prototype.ajaxPostEspecificoArea = function (URL, usaBarra, evento, area, form){
	plcAjax.ajaxCamadaEspecifica = area;
	plcAjax.ajaxPost(URL, true, usaBarra, evento, form);
};
/**
* Executa chamada GET Ajax para método específico e URL específica e área específica
*/
PlcAjax.prototype.ajaxGetEspecificoArea = function (URL, usaBarra, evento, area){
	plcAjax.ajaxCamadaEspecifica = area;
	plcAjax.ajaxGet(URL, true, usaBarra, evento);
};

/**
* Executa chamada GET Ajax para URL específica
*/
PlcAjax.prototype.ajaxGet = function (URL, especifico, usaBarra, evento){
	if(especifico)
		plcAjax.ajaxHabilitaEspecifico(usaBarra);	
	plcAjax.ajaxSubmit("GET", evento, URL);
};

/**
* Executa chamada Ajax para método específico e URL específica
*/
PlcAjax.prototype.ajaxSubmitSimples = function (metodo, URL, especifico, usaBarra, evento, form){
	if(metodo.toUpperCase() == "GET")
		plcAjax.ajaxGet(URL, especifico, usaBarra, evento, form);
	else if (metodo.toUpperCase() == "POST")
		plcAjax.ajaxPost(URL, especifico, usaBarra, evento, form);
};

/**
* Executa chamada Ajax para método específico e URL atual
*/
PlcAjax.prototype.ajaxSubmitDireto = function (metodo, evento, especifico, usaBarra, form){
	if(metodo.toUpperCase() == "GET")
		plcAjax.ajaxGet("", especifico, usaBarra, evento, form);
	else if (metodo.toUpperCase() == "POST")
		plcAjax.ajaxPost("", especifico, usaBarra, evento, form);
};

//Função para configuração de submit espec?fico com Ajax
PlcAjax.prototype.ajaxSubmitEspecifico = function(metodo,evento,usaBarra) {
	plcAjax.ajaxHabilitaEspecifico(usaBarra);
	plcAjax.ajaxSubmit(metodo,evento);
};

/**
 * Executa chamada Ajax para m?todo espec?fico e URL espec?fica e ?rea espec?fica
 */
PlcAjax.prototype.ajaxSubmitEspecificoCamada = function (metodo,evento,usaBarra, camada){
	plcAjax.ajaxCamadaEspecifica = camada;
	plcAjax.ajaxSubmitEspecifico(metodo, evento, usaBarra);
};
//Habilita ajax especifico. Default false
PlcAjax.prototype.ajaxHabilitaEspecifico = function (usaBarraProgresso){
	plcAjax.ajaxEspecifico 			= true;
	if(!usaBarraProgresso || usaBarraProgresso == "")
		plcAjax.ajaxEspecificoBarraProgresso 	= usaBarraProgresso;
}

//Objeto que representa camadas AJAX da aplicação
//Caso a camada de dados n?o seja informada, assume a camadaAtualização com padr?o
PlcAjax.prototype.ajaxCamada = function (camadaAtualizacao, camadaDados){
	this.camadaAtualizacao 	= camadaAtualizacao;
	if(typeof camadaDados != "undefined" && camadaDados != "")
		this.camadaDados 	= camadaDados;
	else
		this.camadaDados 	= camadaAtualizacao;
}

//Cria camadas de atualização via AJAX
PlcAjax.prototype.arrayCamadaAjax;
//Camadas por ID: retorna a posição no arrayCamadaAjax
PlcAjax.prototype.arrayCamadaAjaxPorId;
PlcAjax.prototype.ajaxCriaCamada 	= function (camadaAtualizacao, camadaDados){
	if(plcAjax.arrayCamadaAjax == null)
		plcAjax.arrayCamadaAjax = new Array();
	if(plcAjax.arrayCamadaAjaxPorId == null)
		plcAjax.arrayCamadaAjaxPorId = new Object();
	if (!plcAjax.arrayCamadaAjaxPorId[camadaAtualizacao]) { //Evita criar camada que j? existe.
		var camada = new plcAjax.ajaxCamada(camadaAtualizacao,camadaDados);
		plcAjax.arrayCamadaAjaxPorId[camadaAtualizacao] = plcAjax.arrayCamadaAjax.length;
		plcAjax.arrayCamadaAjax[plcAjax.arrayCamadaAjax.length] = camada;
	}
}

PlcAjax.prototype.cacheFunctionAjax = new Array();
//Guarda funções para serem executadas ap?s submit Ajax
PlcAjax.prototype.setFuncaoAposAjax = function (decFunction) {
   if (this.cacheFunctionAjax == null) {this.cacheFunctionAjax = new Array();}
   this.cacheFunctionAjax[this.cacheFunctionAjax.length] = decFunction;
}

//Executa funções ap?s submit Ajax
PlcAjax.prototype.ajaxExecutaFuncaoAposSubmit = function () {
	if(this.cacheFunctionAjax != null) {
		for(i = 0; i < this.cacheFunctionAjax.length; i++){
			try{
				eval(this.cacheFunctionAjax[i]);
			}catch(e){
			}	
		}	
	}
}
//Recupera objeto de request para utilização AJAX
PlcAjax.prototype.ajaxGetRequest = function (){

	var ajaxhttp = false;
	//Default
	if(window.XMLHttpRequest) {
		try {
			ajaxhttp = new XMLHttpRequest();
	    } catch(e) {
	    	alert("Objeto AJAX inexistente");
			ajaxhttp = false;
	    }
	// IE/Windows ActiveX version
	} else if (window.ActiveXObject) {
	   	try {
	    	ajaxhttp = new ActiveXObject("Msxml2.XMLHTTP");
	  	} catch(e) {
	    	try {
	      		ajaxhttp = new ActiveXObject("Microsoft.XMLHTTP");
	    	} catch(e) {
	    		alert("Erro ao utilizar Ajax. Controles ActiveX podem estar desabilitados. Habilite-os para utilizar Ajax\n"+
						"Acesse 'Tools/Internet Options/Security. Selecione 'Internet' ou 'Intranet', clique 'Custom Level'\n"+
						"Marque 'Enable' para o item 'Initialize and script ActiveX controls no marked as safe'");
	      		ajaxhttp = false;
	    	}
		}
	}
	return ajaxhttp;
}

/**
 * Realiza submit via request AJAX
 * @variable metodo M?todo utilizado no request [String,Ob] {GET,POST}
 * @variable evento Evento jCompany a ser enviado no request [String,Ob]
 * @variable url Url chamado no request [String,Ob]
 * @variable form Nome do formul?rio que cont?m os dados de entrada para request [String,Op]
 * @variable actionBase Action enviado no request. Necess?rio quando a chamada utilizar url absoluta [String,Op]
 * @see getForm
 * @see get
 * @see disparaBotao
 */
PlcAjax.prototype.ajaxSubmit = function (metodo, evento, url, form, actionBase){

	var paramPost 	= "";
	var contentType	= "";
	var charset		= "";
	var form 		= getForm(form);

	//Criação do objeto xmlhttprequest
	var ajaxhttp 	= plcAjax.ajaxGetRequest();

	//Definição de content type
	if(ExpYes && form)
		contentType = form.encoding;
	else
		contentType = "application/x-www-form-urlencoded";

	//Definição de encoding
	if(plcAjax.ajaxCharset != "")
		charset = plcAjax.ajaxCharset;

	//Definição de url para request
    if (form && (url == "" || typeof url == "undefined"))
    	url = form.action;
    if (url == "")
    	url = location.href;

	if(plcAjax.ajaxUrlBase[actionBase]){
		url = plcAjax.ajaxUrlBase[actionBase] + url;
	}

	if(ajaxhttp){
		//Definição do m?todo de request
		metodo = metodo != "" && typeof metodo != "undefined" ? metodo : "POST";

		//Testa se foi informado o argumento id_Arg para l?gica de recuperação autom?tica via id
		var id_Arg = get("id_Arg");
		if(id_Arg != "" && typeof id_Arg != "undefined"){
			var botao = getElementoPorId("RECUPERACAO_AUTOMATICA");
			//disparaBotao(selBotao(evento));
			disparaBotao(botao);
			return;
		}

		//Definição de evento para request
		if(evento != ""){
			if(metodo == "GET"){
					url =+ "?evento="+escape(evento);
			}
			if(metodo == "POST"){
				plcAjax.antesAjaxComplementaPost();
				paramPost += "evento="+escape(evento)+"&";
				paramPost += plcAjax.ajaxMontaPost(form);
			}
		}
		//
		//Executa ação antes de enviar submit
		if(!plcAjax.AJAX_ATIVO && plcAjax.antesAjaxSubmit() && (plcAjax.ajaxEventoAtual == "" || plcAjax.ajaxEventoAtual == window.event.type)){

			if(ExpYes) {
				if (window.event != null)
					plcAjax.ajaxEventoAtual = window.event.type;
			}else{
				if(document.captureEvents(Event.ONCHANGE))
					plcAjax.ajaxEventoAtual = document.captureEvents(Event.ONCHANGE).type;
			}

			//Aborta submit anterior n?o completado
			ajaxhttp.abort()
			//Abrir thread para request
			ajaxhttp.open(metodo,url,true);
			//Configuração encoding do request
	   		ajaxhttp.setRequestHeader("Content-Type", contentType);
			//Configuração encoding do request
			if(charset != "")
		   		ajaxhttp.setRequestHeader("charset", charset);
			//Definir função para tratamento do retorno do request
			ajaxhttp.onreadystatechange = function(){
				if(ajaxhttp.readyState == plcAjax.REQUEST_COMPLETO){
					plcAjax.ajaxResponse(ajaxhttp.responseText);
				}
			}

			if(plcAjax.ajaxUsaBarraProgresso && plcAjax.ajaxEspecificoBarraProgresso)
				iniciarBarraProgresso();
			plcAjax.AJAX_ATIVO = true;
			ajaxhttp.send(paramPost);
		}else{
		}
	}
}

//Monta par?metros do request AJAX quando submissão for via m?todo POST
PlcAjax.prototype.ajaxMontaPost = function (form) //?
{

	var arrayCampos = getCamposEntrada ('','','',form);
	var strPost = "";

	if (arrayCampos && arrayCampos.length > 0){
		var i = 0;
		while(i < arrayCampos.length){
			var valCampo = encodeURIComponent(get(arrayCampos[i].name, form ? form.name : null));
				strPost += arrayCampos[i].name+"=" + valCampo +"&";
			i++;
		}
	}
	return strPost;
}
//Recebe e trata a resposta do request AJAX
PlcAjax.prototype.ajaxResponse = function(ajaxResponse) {
	try{
		//
		if(plcAjax.ajaxEspecifico && plcAjax.arrayCamadaAjax && plcAjax.arrayCamadaAjax.length > 0){
			//Mostra camada Ajax espec?fica

			var numCamadas = plcAjax.arrayCamadaAjax.length;
			for(j = 0; j < numCamadas; j++){
				if (plcAjax.ajaxCamadaEspecifica=="" || plcAjax.ajaxCamadaEspecifica==plcAjax.arrayCamadaAjax[j].camadaAtualizacao) {
					var ajaxCamada	= plcAjax.ajaxPreparaCamada(ajaxResponse, "\<"+plcAjax.arrayCamadaAjax[j].camadaDados+"\>", "\<\/"+plcAjax.arrayCamadaAjax[j].camadaDados+"\>");
					plcAjax.ajaxMostraCamada(ajaxCamada, plcAjax.arrayCamadaAjax[j].camadaAtualizacao);
				}
			}
		}else{
			//Camada Ajax padr?o jCompany
			var ajaxCamada	= plcAjax.ajaxPreparaCamada(ajaxResponse, "\<AJAX\>", "\<\/AJAX\>");
			plcAjax.ajaxMostraCamada(ajaxCamada, "AJAX");
		}

		//Monta conteudo especifico
		if(plcAjax.ajaxUsaBarraProgresso && plcAjax.ajaxEspecificoBarraProgresso)
			pararBarraProgresso();
		plcAjax.aposAjaxSubmit();
		plcAjax.ajaxMantemTabAgil();

		if (!plcAjax.ajaxEspecifico){
			moverFoco();
			executarFuncaoOnLoad();
		}

		//
		plcAjax.ajaxExecutaFuncaoAposSubmit();

		//NAO RETIRAR PORQUE TRATA EDIção DE CAMPOS
		plcAjax.ajaxInicializarEstado();

	}catch(ex){
		if(plcAjax.ajaxUsaBarraProgresso && plcAjax.ajaxEspecificoBarraProgresso)
			pararBarraProgresso();
		plcAjax.ajaxInicializarEstado();
		alert(ex);
	}

}
PlcAjax.prototype.ajaxInicializarEstado = function(){

	//Limpar vari?veis para camada espec?fica
	plcAjax.ajaxEspecifico = false;
	plcAjax.ajaxEspecificoBarraProgresso = true;

	//Configurar Ajax inativo
	plcAjax.AJAX_ATIVO = false;

	//Limpa cache de funções
	plcAjax.cacheFunctionAjax = new Array();

	//Limpa refer?ncia ao evento Ajax
	plcAjax.ajaxEventoAtual = "";
	//Limpa ?rea espec?fica de atualização
	plcAjax.ajaxCamadaEspecifica = "";

}
//Prepara a camada AJAX para atualização
PlcAjax.prototype.ajaxPreparaCamada = function (ajaxResponse, tagIni, tagFim){

	var ajaxCamada = "";
	if(ajaxResponse){
		var posIni = ajaxResponse.indexOf(tagIni);
		var posFim = ajaxResponse.indexOf(tagFim);
		ajaxCamada = ajaxResponse.substring( posIni, posFim);
	}

	return ajaxCamada;
}
//Atualiza a camada AJAX no elemento correspondente
PlcAjax.prototype.ajaxMostraCamada= function (ajaxConteudo, elementoID){

	var elementoAtualizacao = getElementoPorId(elementoID);
	if(elementoAtualizacao != null){
		elementoAtualizacao.innerHTML = ajaxConteudo;
		plcAjax.executaScriptsInternos(elementoAtualizacao);
	}
}
PlcAjax.prototype.executaScriptsInternos = function (elemento) {

	for(var i=0; i< plcAjax.cachedScripts.length; i++){
		tag = plcAjax.cachedScripts[i];
		if (tag.text && tag.text!='' && (tag.getAttribute("avaliar")=='S' || 
					(typeof tag.getAttribute("id") != 'undefined' && tag.getAttribute("id") != null && tag.getAttribute("id").indexOf('avaliar:')>-1))) {
			window.eval(plcAjax.cachedScripts[i].text);
		}
	}
	
	var tags = elemento.getElementsByTagName("SCRIPT");
	for(t = 0; t < tags.length; t++){
		tag = tags[t];
		if (tag.text && tag.text!='' && (tag.getAttribute("avaliar")=='S' || 
			(typeof tag.getAttribute("id") != 'undefined' && tag.getAttribute("id") != null && tag.getAttribute("id").indexOf('avaliar:')>-1))) {
				window.eval(tag.text);
		}
	}
	
}
//Função para configuração de submit espec?fico com Ajax
PlcAjax.prototype.ajaxSubmitEspecifico = function(metodo,evento,usaBarra) {
	plcAjax.ajaxHabilitaEspecifico(usaBarra);
	plcAjax.ajaxSubmit(metodo,evento);
}
/**
 * Executa chamada Ajax para m?todo espec?fico e URL espec?fica e ?rea espec?fica
 */
PlcAjax.prototype.ajaxSubmitEspecificoCamada = function (metodo,evento,usaBarra, camada){
	plcAjax.ajaxCamadaEspecifica = camada;
	plcAjax.ajaxSubmitEspecifico(metodo, evento, usaBarra);
}
//Func?o chamada ap?s submit Ajax para manter situação de tab folder ?gil
PlcAjax.prototype.ajaxMantemTabAgil = function () {
	mantemAbaSelecionada();
}
//Implementação de ações antes de enviar o submit
PlcAjax.prototype.antesAjaxSubmit = function (){ return true;}
//Implementação de ações ap?s retorno submit
PlcAjax.prototype.aposAjaxSubmit = function (){}
//Implementação de ações para complemento do post antes do submit
PlcAjax.prototype.antesAjaxComplementaPost = function (){ }

/**
* Função que limpara os Títulos após o novo utilizando AJAX
* @autor Geraldo Matos, Pedro Neves
*/
function verificarAlteracaoTitulos() {

	var tituloJanela = document.getElementById("inputTituloPagina");
	if (tituloJanela){
		document.title = tituloJanela.value;
		var arrayDivs = document.getElementsByTagName("div");
		for (j = 0; j < arrayDivs.length; j++) {
			if (arrayDivs[j].className == "tituloPagina") {
				arrayDivs[j].innerHTML = tituloJanela.value;
				break;
			}
		}
	}
}

//fixado problema de mensagens ajax.
function handleJsfAjaxEvents(){

	jQuery(function(){
		
		function ajaxError(type) {
			jQuery.plc.mensagem(false);
			if (type == 'login') {
				jQuery.plc.mensagem('advertencia', 'Sua sess&atilde;o expirou. Para reconectar clique <a href="' + plcGeral.contextPath + '">aqui</a>', true, null, 'iOnline');
			} else if (type == '403') {
				jQuery.plc.mensagem('erro','Sem permiss&atilde;o para realizar este comando.');
			} else {
				jQuery.plc.mensagem('erro', 'Erro ao processar resposta.');
			}
		}
		
		if (!TrPage.prototype._unsafe_getDomToBeUpdated) {
			TrPage.prototype._unsafe_getDomToBeUpdated = TrPage.prototype._getDomToBeUpdated;
			TrPage.prototype._getDomToBeUpdated = function (status, responseXML) {
				if (status < 200 || status >= 300) {
					return null;
				}
				// BUG quando responseXML eh null!
				if (responseXML) {
					return TrPage.prototype._unsafe_getDomToBeUpdated.apply(this, arguments);
				}
				return null;
			}
		}
		
		if (!TrPage.prototype._unsafe_requestStatusChanged) {
			
			TrPage.prototype._unsafe_requestStatusChanged = TrPage.prototype._requestStatusChanged;
			TrPage.prototype._requestStatusChanged = function (requestEvent) {

				var error = false;

				if (requestEvent.getStatus() == TrXMLRequestEvent.STATUS_COMPLETE) {

					var statusCode = requestEvent.getResponseStatusCode();
					if (statusCode >= 200 && statusCode < 300) {
						if (requestEvent.isPprResponse()) {

							var responseDocument = requestEvent.getResponseXML();

							if (responseDocument != null) {
								var $error = jQuery( "error", responseDocument );
								if( $error.length > 0){
									error = new String($error.attr("status"));
								} else if (requestEvent.getResponseText().indexOf('j_security_check') != -1){
									error = 'login';
								}
							} else {
								if (requestEvent.getResponseText().indexOf('j_security_check') != -1){
									error = 'login';
								} else {
									error = true;
								}
							}
						}
					}
					if (error !== false) {
						_pprStopBlocking(window);
						ajaxError(error);
					} else {
						return TrPage.prototype._unsafe_requestStatusChanged.apply(this, arguments);
					}
				}
			}
		}
	});
}


function autoRecuperacaoVinculado(vinculado, propRecupera){
	if (ajaxUsa != "false") {
		
		//adicionado listener para executar os scripts com 'avaliar'. Importante para autocomplete e riaUsa.
		PlcAjax.ajaxTrinidadCalled=true;
		TrPage.getInstance().addDomReplaceListener(

			function (oldDom, newDom) {
				 if(PlcAjax.ajaxTrinidadCalled){
					plcAjax.executaScriptsInternos(document);PlcAjax.ajaxTrinidadCalled=false;
				 }
			});
		TrPage._autoSubmit('corpo:formulario', vinculado, window.event, 1, {partialVinculado: vinculado});
		setTimeout (function () { jQuery(getRootDocument().getElementById("lookup_" + vinculado)).focus(); }, 200);
		setTimeout (function () { jQuery(getRootDocument().getElementById("lookup_" + vinculado)).select(); }, 200);
	} else {
		submitForm('corpo:formulario', 1, {source:vinculado});
	}
}
