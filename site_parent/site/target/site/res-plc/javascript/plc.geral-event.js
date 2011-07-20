
//Função para teste dos eventos da aplicação
function executarEventoAplicacao(acao) {
	var retorno = true;
	var i = 0;
	if(acao == "") acao = botaoAcao;
	while(i < evtArray.length) {
		if(evtArray[i].evento == acao) {
			if(evtArray[i].tipoAcao == "MENSAGEM") {
				retorno = enviarMensagem(evtArray[i].evento);
				break;
			} else if (evtArray[i].tipoAcao == "TESTE") {
				if (!eval(evtArray[i].funcao)) {
					retorno = enviarMensagem(evtArray[i].evento);
					break;
				}
			} else if (evtArray[i].tipoAcao == "FUNCAO") {
				retorno = eval(evtArray[i].funcao);
				break;
			}
		}
		i++;
	}
	return retorno;
}

/************************************************************************
 * 			LÓGICAS PARA REGISTRO E EXECUção DE EVENTOS GENÉRICOS
 *
 * Registrar eventos da aplicação
 * FORMATO: 	regEvento ("Evento","Ação Executada","Funcao Associada ? Ação");
 * AC?ES:		TESTE:		Executa alguma função (deve-se informar uma função para teste)
 *				MENSAGEM:	Envia uma mensagem
 *
 * EVENTOS:  Evento podem ser padr?es (definidos pelas ações dos bot?es de ação) ou definidos
 *				pelo programador.
 * Ex.:
 *		Evento 'Gravar':  ocorre quando o usuário executa gravação de algum registro
 *		Evento 'TESTAR':  deve ser executado pela chamada da função "executarEventoAplicacao(<evento>)"
 *
 ************************************************************************/

//Array que guarda eventos da aplicação
var evtArray = new Array();
//Funções para registro de eventos
function regEvento(evento, tipoAcao, funcao) {
	evtArray[evtArray.length] = new regEvt(evento, tipoAcao, funcao);
}

function regEvt(evento, tipoAcao, funcao) {
	this.evento 	= evento;
	this.tipoAcao 	= tipoAcao;
	this.funcao 	= funcao;
}

/************************************************************************
 * 		L?GICAS PARA REGISTRO E ENVIO DE MENSAGENS DE ALERTA GEN?RICAS
 *
 * Registrar mensagens alertas da aplicação
 * FORMATO: regMensagem ("Evento","Tipo Mensagem","Texto Mensagem");
 * EVENTO:  Deve ser um dos eventos registrados acima
 * TIPOS:	  CONFIRMACAO:	Mostra janela para confirmação
 *  		  ALERTA:		Envia mensagem de alerta. (Retorna true)
 *  		  ALERTA_ERRO:	Envia mensagem de alerta. (Retorna false)
 *
 ************************************************************************/
function regMensagem(evento, tipo, msg) {
	if (this.msgArray == null) {this.msgArray = new Object();}
	this.msgArray[evento] = new regMsg(evento, tipo, msg);
}

function regMsg(evento, tipo, msg) {
	this.evento	= evento;
	this.tipo 	= tipo;
	this.msg	= msg;
}

function getMsgArray(evento) {
	return this.msgArray[evento];
}

function enviarMensagem(evento) {
	auxArray = getMsgArray(evento);
	if (auxArray != null) {
		if(auxArray.tipo == "CONFIRMACAO")
			return confirm(auxArray.msg);
		else if (auxArray.tipo == "ALERTA")
			alert(auxArray.msg);
		else if (auxArray.tipo == "ALERTA_ERRO") {
			alert(auxArray.msg);
			return false;
		}
	}
	return true;
}

/**
 * Funções para capturar tecla pressionada e executar ação associada é tecla
 * @param nomeBotao Nome do botão que atender? ao evento
 * @param evento Evento associado ao botão
 * @variable disparouBotao Indicador de botão disparado
 * @variable disparouEnter Indicador de tecla ENTER pressionada
 * @variable interval Intervalo de tempo utilizado para execução de ação<br> associada ? tecla ENTER
 * 
 * @see testaEventoFuncoes
 * @see executarAcaoFuncoes
 * @see executarEventoAplicacao
 * @see selBotao
 * @see getBotaoArray
 * @see disparaBotao
 */
var disparouBotao = false;
var disparouEnter = false;
var interval;
function executarAcaoFuncoes(evt) {
	clearInterval(interval);
	var elementoOrigem;
	if(evt){
		if (NavYes) {
			elementoOrigem = evt.target;
		} else {
			elementoOrigem = evt.srcElement;
		}
	}
	var acao = "";
	var botaoAcaoAux = botaoAcao;
	botaoAcao = "";
	if (botaoAcaoAux == "") {
		acao = testaEventoFuncoes(evt);
	} else {
		acao = botaoAcaoAux;
	}
	if(acao == "TAB" || acao == "ERRO" || acao == "ESCAPE")
		return true;
	if(acao == "ENTER" && botaoAcaoEnter != "") {
		if(elementoOrigem.type != "textarea") {
			botaoAcao = botaoAcaoEnter;
			if(getVarGlobal("trSelecao") == null && !plcGeral.MENU_ATIVO)
				interval = setInterval("executarAcaoFuncoes()",100);
			return false;
		}
	}

	if(!disparouBotao && !executarEventoAplicacao(acao))
		return false;
	else
		disparouBotao = false;
	var botao = eval(selBotao(acao));
	if(botao != null) {
		disparouBotao = true;
		disparaBotao(botao);
	}else {return true;}
}

/**
 * Funções para devolver botão associado a tecla pressionada
 * @param evt Objeto Event
 * @param evento Evento associado ao botão
 * @see getBotaoArray
 * @return getBotaoArray Retorna o resultado da chamada da função
 */
function testaEventoFuncoes(evt) {
	var key;
	var keychar;
	var keycharAtalho;
	key = getKeyCode(evt);
	keychar = String.fromCharCode(key);

	keycharAtalho = traduzTeclaAtalho(getAtalho(keychar));
	keycharAtalho = keycharAtalho == "" ? keychar : keycharAtalho;

	if ((key==null) || (key==0) || (key==8) || (key==9))
		return "ERRO";
	else if ((key==13))
		return "ENTER";
	else if ((key == 9))
		return "TAB";
	else if ((key == 27))
		return "ESCAPE";
	else if (key == 117 || key == 118 || key == 119 || key == 120 || key == 121 || key == 123)
		return getBotaoArray(traduzTeclaAcao(traduzTeclaAtalho(keycharAtalho)));
}

/*Recuperar keycode da teclar pressionada*/
function getKeyCode(evt){
	var key;
	if (ExpYes)
		key = evt.keyCode;
	else
		key = evt.which;
	return key;
}

/**
 * Traduz teclas de atalho. 
 * Se for informado o nome da tecla retorno caracter associado.
 * Se for informado o caracter associado retorno nome da tecla
 * @param tecla Nome ou caracter que representa a tecla de atalho [String,OB]
 * return Tecla de atalho traduziada
 */
function traduzTeclaAtalho(tecla){
	if(tecla == "F7")
		return "v";
	else if (tecla == "F8")
		return "w";
	else if (tecla == "F9")
		return "x";
	else if (tecla == "F6")
		return "u";
	else if (tecla == "F10")
		return "y";
	else if (tecla == "F12")
		return "{";
	else if (tecla == "F2")
		return "q";
	else if (tecla == "v")
		return "F7";
	else if (tecla == "w")
		return "F8";
	else if (tecla == "x")
		return "F9";
	else if (tecla == "u")
		return "F6";
	else if (tecla == "y")
		return "F10";
	else if (tecla == "{")
		return "F12";
	else if (tecla == "q")
		return "F2";
	else
		return "";		
}

/*Traduzir tecla clicada para ação correspondente*/
function traduzTeclaAcao(tecla){
	if(tecla == "F7")
		return "INCLUIR";
	else if (tecla == "F8")
		return "ABRIR";
	else if (tecla == "F9")
		return "PESQUISAR";
	else if (tecla == "F10")
		return "GRAVAR";
	else if (tecla == "F12")
		return "IMPRIMIR";
}

/**
 * Redefine uma tecla de atalho de evento para outra tecla.
 * Caso não haja redefinição para a nova tecla utilizada configura mensagem
 * de alerta para tecla redefinida
 * @see setAtalho
 * @see getAtalho
 */
//TODO Configurar redefinição de teclas de atalho no web.xml
function redefinirTeclaAtalho(teclaDe, teclaPara){
	setAtalho(traduzTeclaAtalho(teclaPara), teclaDe);
	if(typeof getAtalho(traduzTeclaAtalho(teclaDe)) == "undefined"){
		setAtalho(traduzTeclaAtalho(teclaDe), "REDEFINIDA#"+teclaPara);
	}
}

/**
 * Define uma tecla de atalho para uma evento novo
 * @param novaTecla Nome da tecla de atalho [String,OB]
 * @param labelBotao Label do botão associado ? nova tecla de atalho [String,OB]
 * @param evento Evento associado ? nova tecla. Utilizado para tecla inteligentes [String,OB]
 * @see setAtalho
 * @see regBotaoEvento
 */
//TODO Configurar tecla de atalho
function definirTeclaAtalho(novaTecla, labelBotao, evento){
	setAtalho(novaTecla, evento);
	regBotaoEvento(labelBotao,evento);
}

/*Configurar teclas de atalho*/
function setAtalho(atalho, funcao){
	if (this.objetoAtalho == null) {this.objetoAtalho = new Object();}
	this.objetoAtalho[atalho.toUpperCase()] = funcao;
}

/*Recuperar tecla de atalho*/
function getAtalho(atalho){
	if(this.objetoAtalho && atalho != null && typeof atalho != "undefined")
		return this.objetoAtalho[atalho.toUpperCase()];
	return null;	
}

/*Executar função associada à teclas de atalho*/
function executarAtalho(evt){
	if (evt == null) {
		return;
	}
	var ctrlKey = evt.ctrlKey ? "CTRL" : "";
	var altKey = evt.altKey ? "#ALT" : "";
	var shiftKey = evt.shiftKey ? "#SHIFT" : "";
	var keyChar = evt.keyCode && keyCodePermitido(evt.keyCode) ? "#"+String.fromCharCode(evt.keyCode).toUpperCase() : ""; // ascii order of key pressed
	//Tratar acao enter
	if(evt.keyCode == 13){
		return eval(getAtalho("#ENTER"));
	}
	var funcao 		= "";
	var atalho = (ctrlKey+altKey+shiftKey+keyChar).toUpperCase();
	var cancelaEvento = false;
	try{
		setVarGlobal("event", evt);
		cancelaEvento = eval(getAtalho(atalho));
	}catch(e){
		alert("Erro ao executar atalho. Funcao: "+getAtalho(atalho));
	}
	if(cancelaEvento){
		if( evt.stopPropagation ) 
			evt.stopPropagation(); 
		evt.cancelBubble = true;
		return false;
	}
}

//Construtor para objeto PlcEvento
function PlcEvento (){}
//Variável de instancia do objeto PlcEvento
var plcEvento = new PlcEvento();

/*Guardar objeto do foco para facilitar criação de novos detalhes.*/
function trataOnFocus (evt) {
	// Pega nome do detalhe, se campo contiver, ou esvazia o "detCorrPlc"
	var nomeDetalhe = getDetalhePeloCampo(this.name);
	jQuery('#detCorrPlc').val(nomeDetalhe);
	if (this.oldOnFocus && this.oldOnFocus != trataOnFocus){
		this.oldOnFocus(evt);
	}
}

/*Recuperar o elemento associado ao evento ocorrido*/
PlcEvento.prototype.getEventoElemento = function(evento){
	var elemento = null;
	if(ExpYes){
		if(evento.srcElement)
			elemento = evento.srcElement;
	}else{
		if(evento.target)
			elemento = evento.target;
	}
	return elemento
}

/*Recuperar o evento ocorrido*/
PlcEvento.prototype.getEventoAtual = function(evento){
	if(ExpYes && window.event)
		return window.event.type;
	else if (NavYes && evento && Event){
		if(evento.toUpperCase() == "ONCHANGE" && document.captureEvents(Event.ONCHANGE))
			return document.captureEvents(Event.ONCHANGE);
		if(evento.toUpperCase() == "ONCLICK" && document.captureEvents(Event.ONCLICK))
			return document.captureEvents(Event.ONCLICK);
		if(evento.toUpperCase() == "ONKEYDOWN" && document.captureEvents(Event.ONKEYDOWN))
			return document.captureEvents(Event.ONKEYDOWN);
	}
}

/*jCompany 2.5. Acrescentar evento onFocus para logica de registro do objeto.*/
//TODO Ver possibilidade de adequar a novo modelo de eventos
function setUpOnFocusHandlers () {
	if(getRootDocument().forms) {
		for (var f = 0; f < getRootDocument().forms.length; f++) {
			if(getRootDocument().forms[f].elements) {
				for (var e = 0; e < getRootDocument().forms[f].elements.length; e++) {
					if (getRootDocument().forms[f].elements[e] &&
							(getRootDocument().forms[f].elements[e].type == 'text'
									|| getRootDocument().forms[f].elements[e].type == 'textarea'
										|| getRootDocument().forms[f].elements[e].type == 'select-one'
											|| getRootDocument().forms[f].elements[e].type == 'select-multiple'
												|| getRootDocument().forms[f].elements[e].type == 'password'
													|| getRootDocument().forms[f].elements[e].type == 'checkbox'
														|| getRootDocument().forms[f].elements[e].type == 'radio'
															|| getRootDocument().forms[f].elements[e].type == 'file'
																|| getRootDocument().forms[f].elements[e].type == 'fileupload')) {
						if (typeof getRootDocument().forms[f].elements[e].oldOnFocus == "undefined"){
							getRootDocument().forms[f].elements[e].oldOnFocus = getRootDocument().forms[f].elements[e].onfocus;
							getRootDocument().forms[f].elements[e].onfocus = trataOnFocus;
						}
					}
				}
			}
		}
	}
}

/*Desmarca item da lista de seleção pois foi focado campo de argumento.*/
PlcEvento.prototype.trataEventoJcp = function (evt) {
	desmarcaListaSelecao();
	return true;
};

/*jCompany 2.7.2 - Tratar evento onclick genericamente.*/
PlcEvento.prototype.eventoTrataClick = function (evt) {return true;};
function eventoTrataonclick(evt, objeto){
	var retClick = true;
	if(typeof objeto == "undefined")
		objeto = this;
	if(plcEvento.eventoTrataClick(evt)){
		if (objeto.oldonclick)
			retClick = objeto.oldonclick(evt);
		if(retClick)
			retClick = plcEvento.trataEventoJcp(evt);
	}else
		return false;
	return retClick;
}

/*jCompany 2.7.2 - Tratar evento onchange genericamente.*/
PlcEvento.prototype.eventoTrataChange = function (evt) {return true;};
function eventoTrataonchange(evt, objeto){

	if(typeof evt == "undefined")
		evt = plcEvento.getEventoAtual('ONCHANGE')
		var retChange = true;
	if(typeof objeto == "undefined")
		objeto = this;
	if(plcEvento.eventoTrataChange(evt)){
		if (objeto.oldonchange)
			retChange = objeto.oldonchange(evt);
		if(retChange)
			retChange = plcEvento.trataEventoJcp(evt);
	}else
		return false;
	return retChange;
}

/*jCompany 3.0 - Tratar evento onfocus genericamente.*/
PlcEvento.prototype.eventoTrataFocus = function (evt) {return true;};
function eventoTrataonfocus(evt, objeto){
	var retFocus = true;
	if(typeof objeto == "undefined")
		objeto = this;
	if(plcEvento.eventoTrataFocus(evt)){
		if (objeto.oldonfocus)
			retFocus = objeto.oldonfocus(evt);
		if(retFocus)
			retFocus = plcEvento.trataEventoJcp(evt);
	}else
		return false;
	return retFocus;
}

/*jCompany 3.0 - Tratar evento onblur genericamente.*/
PlcEvento.prototype.eventoTrataBlur = function (evt) {return true;};
function eventoTrataonblur(evt, objeto){
	var retBlur = true;
	if(typeof objeto == "undefined")
		objeto = this;
	if(plcEvento.eventoTrataBlur(evt)){
		if (objeto.oldonblur)
			retBlur = objeto.oldonblur(evt);
		if(retBlur)
			retBlur = plcEvento.trataEventoJcp(evt);
	}else
		return false;
	return retBlur;
}

/*Configurar um evento para um elemento informado*/
function setUpOnEventoElemento (idElemento, evento, funcao) {
	setUpEventos ("", idElemento, evento, funcao,"");
}

/*Configurar um evento para todas os elementos da tag informada*/
function setUpOnEventoTag (tag, evento, funcao) {
	if( ExpYes && ( funcao == 'destacaCampoFocado' || funcao == 'reverteDestaqueCampoFocado') ){ 
		return ; 
	}
	setUpEventos (tag, "", evento, funcao,"");
}

/*Configurar um evento para um elemento informado da tag informada*/
function setUpOnEventoTagCampoNome (tag, evento, funcao, nome) {
	setUpEventos (tag, "", evento, funcao, nome);
}

/*Configurar eventos genericamente*/
function setUpEventos (tag, idElemento, evento, funcao, nome) {

	var tags;
	var tipo = "";
	var elementos;
	if(typeof tag != "undefined" && tag != ""){
		var posTipo = tag.indexOf("#")
		if(posTipo >= 0){
			tags = getRootDocument().getElementsByTagName(tag.substring(0,posTipo));
			tipo = tag.substring(posTipo+1)
		}else
			tags = getRootDocument().getElementsByTagName(tag);
	} else if (typeof nome != "undefined" && nome != ""){
		tags = new Array();
		tags[tags.length] = getCampo(nome);
	} else if (typeof idElemento != "undefined" && idElemento != "")
		elementos = getElementoPorId(idElemento);

	if(tags) {
		for (var t = 0; t < tags.length; t++) {
			var umaTag = tags[t];
			if(umaTag && ((tipo == "" || umaTag.type == tipo) && 
					(nome == "" || umaTag.name == nome))) {
				if(eval("umaTag."+funcao) != funcao )
					eval("umaTag.old"+evento.toLowerCase()+" = umaTag."+evento.toLowerCase());
				if(typeof funcao != "undefined" && funcao != ""){
					eval("umaTag."+funcao+"='"+funcao+"'");
					eval("umaTag."+evento.toLowerCase()+" = "+funcao);
				}
				else
					eval("umaTag."+evento.toLowerCase()+" = eventoTrata"+evento.toLowerCase());
			}
		}
	}
	if(elementos) {
		var elementoAnterior = elementos;
		if(!elementos.length){
			elementos = new Array();
			elementos[elementos.length] = elementoAnterior
		}
		if (!ExpYes && evento.substring(0,2)=="on") {
			evento = evento.substring(2);
		}
		for (e = 0; e < elementos.length; e++) {
			var umElemento = elementos[e];
			if(umElemento){
				if(eval("umElemento."+funcao) != funcao )
					eval("umElemento.old"+evento.toLowerCase()+" = umElemento."+evento.toLowerCase());
				if(typeof funcao != "undefined" && funcao != ""){
					if(ExpYes)
						eval("umElemento."+evento.toLowerCase()+" = "+funcao);
					else
						eval("umElemento.addEventListener('"+evento.toLowerCase()+"',"+funcao+",false)");
				}
				else{
					if(ExpYes)
						eval("umElemento."+evento.toLowerCase()+" = eventoTrata"+evento.toLowerCase());	
					else
						eval("umElemento.addEventListener('"+evento.toLowerCase()+"','eventoTrata"+evento.toLowerCase()+",false)");
				}
			}
		}
	}
}

PlcLog_logEvent = function (evt){
	var retornoEvento = executarAtalho(evt);
	try { 
		if(getRootDocument() && getRootDocument() != null){
			getRootDocument().focus(); 
		}
	}catch(e){}
	return (retornoEvento ? retornoEvento : true);	
}

/*Configurar evento onkeydow para ações da página*/
//TODO Mover para arquivo plc.geral.config
configurarEventoOnKeyDown()

/*Verificar se é keycode do evento épermitido.*/
function keyCodePermitido(keyCode){
	return keyCodeSeta(keyCode) || (keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122);
}

/*Verificar se é keycode do evento pressionamento seta é permitido.*/
function keyCodeSeta(keyCode){
	return keyCode == 40 || keyCode == 38 || keyCode == 39 || keyCode == 37;
}

/*Devolver um evento (tecla clicada, por exemplo), cross-browser.*/
function getEvento(evt) {
	if (ExpYes) {
		return window.event;
	} else {
		return evt;
	}
}

/*Disparar um evento de um elemento.*/
function dispararEvento(elemento, evento){
	evento = evento.toLowerCase();
	if(ExpYes){
		var evObj = document.createEventObject();
		elemento.fireEvent(evento, evObj);
	}
	else{
		var evObj = document.createEvent('MouseEvents');
		evObj.initMouseEvent( evento.replace("on",""), true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
		elemento.dispatchEvent(evObj);
	}		
}

/*Configurar eventos da página*/
function configuraEventos(){
	setUpOnEventoTag ('INPUT', 'onchange', 'setAlertaAlteracao');
	setUpOnEventoTag ('TEXTAREA', 'onchange', 'setAlertaAlteracao');
	setUpOnEventoTag ('SELECT', 'onchange', 'setAlertaAlteracao');
	setUpOnEventoTag ('A', 'onclick', 'enviaAlertaAlteracao');
	setUpOnEventoTag ('INPUT#button', 'onclick', 'enviaAlertaAlteracao');
	setUpOnEventoTag ('button', 'onclick', 'enviaAlertaAlteracao');
	//setUpOnEventoElemento ('botao_menu', 'onclick', 'enviaAlertaAlteracao');
}
