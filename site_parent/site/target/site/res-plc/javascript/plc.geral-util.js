
function configurarEventoOnKeyDown(){
	if (ExpYes) {
		document.onkeydown = function(evt) {PlcLog_logEvent(evt);}
	} else {
		document.onkeydown   = function(evt){PlcLog_logEvent(evt);}
	}
}

/** ---------------------------------------------------------------------- *\
  Function    : setVarGlobal
  Description : set a variable with a global scope
  Usage       : setVarGlobal(varName, value);
  Arguments   : varName - name of the global variable to set
                value - value of the global variable to set
\* ---------------------------------------------------------------------- */
function setVarGlobal(nome, valor) {
   if (this.cache == null) {this.cache = new Object();}
   this.cache[nome] = valor;
}

/** ---------------------------------------------------------------------- *\
  Function    : getGlobalVar
  Description : get a variable in a global scope
  Usage       : value = getGlobalVar(varName);
  Arguments   : varName - name of the global variable to get
                value - value of the global variable to get
\* ---------------------------------------------------------------------- */
function getVarGlobal(nome, valor) {
   if (this.cache == null) {
     return null;
   } else {
     return this.cache[nome];
   }
}

function focaElementoInformado (){
	if (jQuery.plc.componenteFoco){
		jQuery.plc.componenteFoco.focus();
	}
}

/*Submeter (GET) a URL informada, na mesma instancia.*/
function submeteUrl(url) {
	document.location.href=url;
}

/* Concatenar dois valores com o separados informado */
function concatenar(oldValue, newValue, separator,doisLados) {
	var valRetorno = oldValue;
	if(newValue != "") {
		if(oldValue == "") {
			if (doisLados)
				valRetorno = separator+newValue+separator;
			 else
				valRetorno = newValue;
		} else if (doisLados) {
			if (oldValue.indexOf(separator+newValue+separator) == -1)
				valRetorno = oldValue + newValue+separator;
		} else if (oldValue.indexOf(newValue) == -1)
			valRetorno = oldValue + separator + newValue;
	}
	return valRetorno;
}

/*Adiciona uma classe ao elemento*/
//TODO Implementar em jQuery
function setClasse(E, tag, classe) {
	var Etag = E.tagName;
	while (Etag != tag) {
		if(ExpYes)
			E = E.parentElement;
		else
			E = E.parentNode;
		Etag = E.tagName;
	}
	E.className = classe;
	E.marcado 	= true;
}

/*Verifica se um keycode esta inserido em um array de keycodes*/
function validaKeyArray(keycode, keyArray){
	var achou = false;
	if(keyArray != null){
		for(var i = 0; i < keyArray.length; i++){
			if(keyArray[i] == keycode){
				achou = true;
				break;
			}
		}
		return achou;
	} else {
		return true;
	}
}

/*Substitui uma String por outra*/
function replaceString(exp, str, repl){
	return new String(str).replace(exp,repl);
}

/*Retorna um elemento dado seu ID*/
//TODO Implementar em jQuery
function getElementoPorId(elementoID){
	var crossElemento = null;
	if(document.getElementById && document.getElementById(elementoID))
		crossElemento = document.getElementById(elementoID)
	else if (elementoID){
		if(document.all && eval("document.all['"+elementoID+"']"))
			crossElemento = eval("document.all['"+elementoID+"']");
		else if (eval("document['"+elementoID+"']"))
			return eval("document['"+elementoID+"']");
	}
	return crossElemento;
}

/*Retorno estilo de um elemento dado seu ID*/
//TODO Implementar em jQuery
function getElementoStyle(elementoID){

	var crossElemento = getElementoPorId(elementoID);
	var crossElementoStyle = "";
	if(crossElemento){
		if (document.all||document.getElementById)
			crossElementoStyle =  eval(crossElemento.style);
		else if (document.layers)
			crossElementoStyle =  crossElemento;
	}
	return crossElementoStyle;
}

/*Altera classes dos objetos*/
//TODO Implementar em jQuery
 function alteraClasse () {
	if(arguments && arguments.length > 0) {
		this.ID 		= "";
		this.CAMPO		= "";
		this.TIPO		= "";
		this.CLASSE		= "";
		this.OBJETO		= "";
		this.INICIAL	= false;
		this.NOVACLASSE	= false;

		for(i = 0; i < arguments.length; i++) {
			if(arguments[i] == "ID")
				this.ID = arguments[++i];
			else if (arguments[i] == "CAMPO")
				this.CAMPO = arguments[++i];
			else if (arguments[i] == "TIPO")
				this.TIPO = arguments[++i];
			else if (arguments[i] == "CLASSE")
				this.CLASSE = arguments[++i];
			else if (arguments[i] == "OBJETO")
				this.OBJETO = arguments[++i];
			else if (arguments[i] == "NOVACLASSE")
				this.NOVACLASSE = true;
			else if (arguments[i] == "INICIAL")
				this.INICIAL = true;
		}
	}

	var elements = "";
	if(this.ID != ""){
		elements = getElementoPorId(this.ID);
	} else if (this.OBJETO != ""){
		elements = this.OBJETO;
		elements = new Array(elements);
	} else if (this.CAMPO){
		elements = getForm().elements[this.CAMPO];
		elements = new Array(elements);
	}
  	if(elements) {
		for (var e = 0; e < elements.length; e++) {
			if (elements[e]) {
				if(this.NOVACLASSE){
					if(elements[e].type=="radio" && NavYes){
						elements[e].parentNode.className = this.CLASSE;
					}
					else{
						elements[e].className = this.CLASSE;
					}
				}
				else if (this.INICIAL){
					var exp = this.CLASSE;
					if(elements[e].type=="radio" && NavYes){
						elements[e].parentNode.className = this.CLASSE;
					}
					else{
						elements[e].className = elements[e].className.replace(exp,"");
					}
				}
				else{
					if(elements[e].type=="radio" && NavYes){
						elements[e].parentNode.className = this.CLASSE;
					}
					else{
						elements[e].className = elements[e].className +" "+ this.CLASSE;
					}
				}
			}
		}
	}
}

/*Recuperar valor de um parametros da url*/
function getParametroUrl ( parametro, queryString) {
	queryString = (typeof queryString == "undefined" && queryString != "") ? getQueryString() : queryString;
	if(queryString.indexOf(parametro+"=") >= 0){
		queryString = queryString.lastIndexOf("#") >= 0 ? queryString.substring(0,queryString.lastIndexOf("#")) : queryString;
 		var arrayParametros	= queryString.split("&");
		for(i = 0; i < arrayParametros.length; i++){
			if(arrayParametros[i].indexOf(parametro+"=") >= 0){
				return (arrayParametros[i].substring(arrayParametros[i].indexOf("=")+1,arrayParametros[i].length));
			}
		}
	}
}

/*Recuperar todos os parametros da url*/
function getQueryString(){
	return document.location.search;
}

/*Avaliar o atributo de um elemento para uma condicao preestabelecida*/
function plcEval(elemento, atributo, condicao){
	if(atributo == "name"){
		return eval("\"" + elemento.name + "\"" + condicao);
	}
	return false;
}


/*******************************************************************/
/***                                                             ***/
/***   Tokenizer.js - JavaScript String Tokenizer Function       ***/
/***                                                             ***/
/***   Version   : 0.2                                           ***/
/***   Date      : 01.05.2005                                    ***/
/***   Copyright : 2005 Adrian Zentner                           ***/
/***   Website   : http://www.adrian.zentner.name/               ***/
/***                                                             ***/
/***   This library is free software. It can be freely used as   ***/
/***   long as this this copyright notice is not removed.        ***/
/***                                                             ***/
/*******************************************************************/
String.prototype.tokenize = function tokenize(){
     var input             = "";
     var separator         = " ";
     var trim              = "";
     var ignoreEmptyTokens = true;

     try {
       String(this.toLowerCase());
     }
     catch(e) {
       window.alert("Tokenizer Usage: string myTokens[] = myString.tokenize(string separator, string trim, boolean ignoreEmptyTokens);");
       return;
     }

     if(typeof(this) != "undefined"){
    	 input = String(this);
     }
     if(typeof(tokenize.arguments[0]) != "undefined"){
    	 separator = String(tokenize.arguments[0]);
     }
     if(typeof(tokenize.arguments[1]) != "undefined"){
    	 trim = String(tokenize.arguments[1]);
     }
     if(typeof(tokenize.arguments[2]) != "undefined"){
    	 if(!tokenize.arguments[2]){
    		 ignoreEmptyTokens = false;
    	 }
     }
     var array = input.split(separator);
     if(trim){
    	 for(var i=0; i<array.length; i++){
    		 while(array[i].slice(0, trim.length) == trim){
    			 array[i] = array[i].slice(trim.length);
    		 }
    		 while(array[i].slice(array[i].length-trim.length) == trim){
    			 array[i] = array[i].slice(0, array[i].length-trim.length);
    		 }
    	 }
     }
     var token = new Array();
     if(ignoreEmptyTokens){
    	 for(var i=0; i<array.length; i++){
    		 if(array[i] != ""){
    			 token.push(array[i]);
    		 }
    	 }
     }else{
    	 token = array;
     }

     return token;
}

/*Retrair/expandir um subdetalhe*/
function retraiExpandeSubdetalhe (componente, subdetalhe){
	if (jQuery(componente).hasClass('iMinimizar')){
		jQuery(componente).removeClass('iMinimizar').addClass('iMaximizar');
		jQuery('#corpo\\:formulario\\:novoComponente\\:' + subdetalhe ).hide();
		jQuery('#corpo\\:formulario\\:fieldset\\:' + subdetalhe + ' > *').not('legend').hide()
	} else {
		jQuery(componente).removeClass('iMaximizar').addClass('iMinimizar');
		jQuery('#corpo\\:formulario\\:novoComponente\\:' + subdetalhe ).show(); 
		jQuery('#corpo\\:formulario\\:fieldset\\:' + subdetalhe + ' > *').not('legend').show();
	}
}

//Recupera dados da url.
function extractURLParams(url){
	var u = url || window.location.href;
	var h = {};
	var i = u.indexOf('?');
	// url?querystring
	if (i != -1) {
		u = u.substring(i + 1);
		// desconsidera &amp; no split
		u = u.split(/&(?!amp;)/);
		// Gera um hash com os parametros.
		for(i = 0; i < u.length; i++){
			var p = u[i];
			var j = p.indexOf('=');
			if (j != -1) {
				h[p.substring(0, j)] = unescape(p.substring(j + 1).replace(/&amp;/gi, '&'));
			} else if (p) {
				h[p] = '';
			}
		}
	}
	return h;
}

//Recebe os parametros de URL GET e seta os seus valores em campos na tela de acordo com o prefixo do form.
function setURLParamIntoForm(formPrefix){
	var params = document.location.search.split("&");
	for(var cont=0; cont<params.length; cont++){
	    var paramsSep = params[cont].split("=");
	    if(document.getElementById(formPrefix+paramsSep[0])){
	        document.getElementById(formPrefix+paramsSep[0]).value=paramsSep[1];
	    }
	}
}

function funcaoHome() {
	window.location.replace( plcGeral.contextPath );
}

function funcaoDesconectar() {
	jQuery('#corpo\\:formulario\\:plc-acao-desconecta0, #plc-acao-desconecta1').get(0).click();
}

function executarExclusao(botaoID, alertaExcluir, alertaExcluirDetalhe){
	if(get('corpo:formulario:indExcDetPlc') == ''){
		alteraClasse('CLASSE','campoComErro')
		regMensagem(botaoID, "CONFIRMACAO", alertaExcluir);
	}else{
		var ids	= separaListaTermos(get('corpo:indEcorpo:formucorpo:formulario:lc'),'#');
		alteraClasse('CLASSE','campoComErro','ID',ids[i],'INICIAL');
		regMensagem(botaoID,"CONFIRMACAO",alertaExcluirDetalhe);
	}
	if(!enviarMensagem(botaoID)){
		alteraClasse('CLASSE','campoComErro','INICIAL');
		return false;
	}
	return true;
}