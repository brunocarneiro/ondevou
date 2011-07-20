
/*Função mover o foco automaticamente*/
function moverFoco(){
	if (getCampoFocus() == "") {
		setTimeout("testaCampos()", 20)
	} else {
		setTimeout("setFocus(getCampoFocus(), getCampoFocusSelecionar())", 20);
	}
}

/*Função para posicionar foco em campo especifico*/
var campoFocus = "";
var campoFocusSelecionar = false;
function setCampoFocus(nomeCampo, selecionar){
	this.campoFocus = nomeCampo;
	setCampoFocusSelecionar(selecionar);	
}

function getCampoFocus(){
	return this.campoFocus;
}

function setCampoFocusSelecionar(selecionar){
	if(selecionar && typeof selecionar != "undefined" && selecionar != "")
		this.campoFocusSelecionar = true;
}

function getCampoFocusSelecionar(){
	this.campoFocusSelecionar
}

/**
 * Função que retorna o objeto window correto da janela atual, para evitar problemas com IFrame PPR.
 * Implementado por Bruno Grossi - 29/03/2007
 */
function getRootWindow() {
	return "_pprIFrame" != window.name ? window : window.parent;
}

/**
 * Função que retorna o document da janela atual, para evitar problemas com IFrame PPR.
 * Implementado por Bruno Grossi - 29/03/2007
 */
function getRootDocument() {
	return getRootWindow().document;
}

/**
 * Função para retornar um objeto que representa um form da página
 * @param form Nome do form, caso não seja o form padrão. [String,OP]
 * @see getVarGlobal
 * @return form Objeto form [Object]
 */
function getForm(form){
	var sessForm = getVarGlobal("form");
	// Se houver um opener recupera o form deste
	var parentForm = "";
	if(opener && form != null){
		try {
			if( opener.getVarGlobal("parentForm") != "" && opener.getVarGlobal("parentForm") != 0 &&
				opener.getVarGlobal("parentForm") != null && opener.getVarGlobal("parentForm") != "undefined" )
				return opener.getVarGlobal("parentForm"); 
		} catch(ex) {
			// Erro de permissão caso a window opener, esteja em outro domínio.
		}
	}	
	if(form != "" && form != 0 && ""+form != "undefined" && form != null)
		form = eval("getRootDocument().forms['"+form+"']");
	else if (sessForm != "" && sessForm != 0 && ""+sessForm != "undefined" && ""+sessForm != "null")
		form = eval("getRootDocument().forms['"+sessForm+"']");
	else
		form = eval("getRootDocument().forms[0]");
	return form;
}

/**
 * Função para retornar um objeto que representa um campo da página
 * @param campo Nome do campo que se quer recuperar. [String, OB]
 * @param form Nome do form, caso não seja o form padrão. [String,OP]
 * @see getForm
 * @return campo Objeto campo [Object]
 */
function getCampo(campo, form) {
	form = getForm(form);
	if(form) { campo = form.elements[campo]; }
	return campo;
}

/**
* Função para colocar foco no primeiro campo válido da página.
* Apos o onload da página a função procura nos campos da página um campo válido para focar
* @see setFocus
*/
function testaCampos(){
	if (getCampoFocus() != '') {
		return;
	}
	var numForms = getRootDocument().forms.length;
	var primeiroCampo = "";
	var campoFocado	= null;
	if (getVarGlobal("trSelecao") != null) {
		return;
	}
	if (getRootDocument().location.hash && getRootDocument().location.hash != null && getRootDocument().location.hash.indexOf("#") > -1) {
		return;
	}
	for(var i = 0, numElements = 0; i < numForms; i++) {
		numElements = getRootDocument().forms[i].elements.length;
		for(j=0; j < numElements; j++) {
			   if (getRootDocument().forms[i].elements[j].getAttribute("inibeFoco") != 'S' && 
			    !(getRootDocument().forms[i].elements[j].className.indexOf("inibeFoco") > -1)){
					if (getRootDocument().forms[i].elements[j].getAttribute("id") != null && !(getRootDocument().forms[i].elements[j].getAttribute("id").indexOf(":inibeFoco") > -1)
						&& !(getRootDocument().forms[i].elements[j].getAttribute("id").indexOf("inibeFoco_") > -1)){
						if((getRootDocument().forms[i].elements[j].type=="text" ||
							getRootDocument().forms[i].elements[j].type=="password" ||
							getRootDocument().forms[i].elements[j].type=="file" ||
							getRootDocument().forms[i].elements[j].type=="textarea") &&
							getRootDocument().forms[i].elements[j].type != "hidden" &&
							!getRootDocument().forms[i].elements[j].readOnly &&
							!getRootDocument().forms[i].elements[j].disabled){
							if(getRootDocument().forms[i].elements[j].value == ""){
								campoFocado = getRootDocument().forms[i].elements[j];
								primeiroCampo = getRootDocument().forms[i].elements[j];
								i = numForms;
								j = numElements;
							} else if (primeiroCampo == "" && getRootDocument().forms[i].elements[j].type != "hidden" &&
							!getRootDocument().forms[i].elements[j].readOnly && !getRootDocument().forms[i].elements[j].disabled)
								primeiroCampo = getRootDocument().forms[i].elements[j];
						} else if (getRootDocument().forms[i].elements[j].type == "radio"){
							//setFocus(document.forms[i].elements[j].name);
						} else if ((getRootDocument().forms[i].elements[j].type == "select-one" ||
							getRootDocument().forms[i].elements[j].type == "select-multiple") &&
							getRootDocument().forms[i].elements[j].options.length > 0 &&
							getRootDocument().forms[i].elements[j].options.selectedIndex <= 0 &&
							!getRootDocument().forms[i].elements[j].readOnly &&
							!getRootDocument().forms[i].elements[j].disabled){
							try {
								primeiroCampo = "";
								getRootDocument().forms[i].elements[j].focus();
								getRootDocument().forms[i].elements[j].options[0].selected = true;
								campoFocado = getRootDocument().forms[i].elements[j];
							}catch (e){}
							i = numForms;
							j = numElements;
						} else if (primeiroCampo == "" && typeof getRootDocument().forms[i].elements[j].type != 'undefined' &&
							getRootDocument().forms[i].elements[j].type != "button" &&
							getRootDocument().forms[i].elements[j].type != "submit" &&
							getRootDocument().forms[i].elements[j].type != "hidden" &&
							getRootDocument().forms[i].elements[j].type != "radio" &&
							getRootDocument().forms[i].elements[j].type != "checkbox" &&
							!getRootDocument().forms[i].elements[j].readOnly &&
							!getRootDocument().forms[i].elements[j].disabled)
								primeiroCampo = getRootDocument().forms[i].elements[j];
					}
			}
		}
	}
	if (primeiroCampo != "") {
		setFocus(primeiroCampo.name, true);
		campoFocado = primeiroCampo;
	}
	setVarGlobal("campoFocadoPlc", campoFocado);	
}

/**
* Funções para associar ação a um botão ao pressionar a telca ENTER
* @param acao Ação a ser associada ao botão
* @variable botaoAcaoEnter Armazena a ação associada ao botão
*/
var botaoAcaoEnter = "";
function setBotaoAcaoEnter(acao) { 
	botaoAcaoEnter = acao; 
}

/**
* Funções para registro de botães que respondem a eventos
* @param nomeBotao Nome do botão que atenderá ao evento
* @param evento Evento associado ao botão
* @variable botaoArray Array que contém dados do evento/botão
* @see regBotao
*/
var botaoArray = new Array();
function regBotaoEvento(nomeBotao, evento) {
	botaoArray[botaoArray.length] = new regBotaoEvt(nomeBotao, evento);
}

/**
* Funções que guarda dados do evento/botão no array
* @param nomeBotao Nome do botão que atenderá ao evento
* @param evento Evento associado ao botão
*/
function regBotaoEvt(nomeBotao, evento) {
		this.nomeBotao	= nomeBotao;
		this.evento 	= evento;
}

/**
* Funções que recupera o botão associado ao evento
* @param nomeBotao Nome do botão que atenderá ao evento
* @param evento Evento associado ao botão
* @variable botaoArray Array que contém dados do evento/botão
* @return Retorna nome do botão ou valor "FALSE" se botão não encontrado
*/
function getBotaoArray(evento) {	
	for(i = 0; i < botaoArray.length; i++) {
		if(botaoArray[i].evento == evento)
			return botaoArray[i].nomeBotao;
	}
	return "FALSE";
}

/**
* Função que seleciona o botão associado é função da tecla
* @param acao Ação a qual o botão está associado
* @return botao Objeto Button representando o botão associado a ação
*/
function selBotao(acao, form) {
	var numElements;
	var form = getForm(form);
	var elementValue;
	var retorno = false;
	var botao = null;

	if (document.forms && document.forms.length > 0) {
		if (typeof form != "undefined" && typeof form.elements["evento"] != "undefined") {
			numElements = form.elements["evento"].length;
			if (typeof numElements != "undefined"){
				for(i=0; i < numElements; i++) {
					elementValue = form.elements["evento"][i].value;
					if(elementValue == acao && form.elements["evento"][i].id != "RECUPERACAO_AUTOMATICA")
					{
						botao = eval(form.elements["evento"][i]);
						i = numElements;
					}
				}
			} else if (typeof form.elements["evento"] != "undefined"){
				elementValue = form.elements["evento"].value;
				if(elementValue == acao && form.elements["evento"].id != "RECUPERACAO_AUTOMATICA")
					botao = eval(form.elements["evento"]);
			} 
		} else if (eval(form.elements[acao]))
			botao = eval(form.elements[acao]);
		// acerto para encontrar os botoes do trinidad
		else if (document.getElementById('corpo:formulario:'+acao)) 
			botao = document.getElementById('corpo:formulario:'+acao);
	}
	return botao;
}

/**
* Funções para simular um clique no botão informado
* @param botao Nome do botão que será clicado
*/
function disparaBotao(botao){
	if(botao)
		botao.click();
}

/**
* Funções para associar ação a um botão
* @param acao Ação a ser associada ao botão
* @variable botaoAcao Armazena a ação associada ao botão
*/
var botaoAcao = "";
function setBotaoAcao(acao){ 
	botaoAcao = acao; 
}

/*Setar o valor para o campo informado.*/
function set(nomeCampo, valor, separador, form) {
	setValorCampo(nomeCampo, valor, separador, form);
}

/*Setar o valor para o campo informado.*/
function setValorCampo(nomeCampo, valor, separador, form) {
	nomeCampo = padronizaNomeCampoFormulario(nomeCampo);
	var campo = getCampo(nomeCampo,form);
	if(campo) {
		if(arguments[2])
			campo.value = concatenar(retornaValorCampo(nomeCampo), valor, separador);
		else
			campo.value = valor;
		return true;
	}
	return false;
}

/*Inserir um valor em um campo.*/
//TODO Ver utilização de setValorCampo
function insereValorCampo(field,value,form) {
	var campo = "";
	if(form == "" || form == 0 || ""+form == "undefined")
		campo = eval("getForm().elements['"+field+"']");
	else
		campo = eval("getForm('"+form+"').elements['"+field+"']");
	if(campo) {
		if (campo.type == "select-one")	{	
			for(i = 0; i < campo.options.length; i++) {
				if(campo.options[i].value == value) {
					campo.options[i].selected = true;
					i = campo.options.length;
				}
			}
		} else {
			campo.value = value;
		}
	}
}

/**
* Padroniza o nome do campo, conforme padrão de nomes de campos do jCompany.  
* Ex: corpo:formulario:nomeCampo
*/
function padronizaNomeCampoFormulario(nomeCampo){
	if(nomeCampo){
		var temCorpo = nomeCampo.search('corpo:')== 0;
		var temFormulario = nomeCampo.search('corpo:formulario:')== 0;
		if (temCorpo){
			if (! temFormulario)
				nomeCampo = 'corpo:formulario:' + nomeCampo.substring(6,nomeCampo.length);
		}
	}
	return nomeCampo; 
}

/*Atualizar o valor do campo informado*/
function atualizaValorCampo(nomeCampo, valorReplace, valorNovo, separador, form) {
	var campo 	= getCampo(nomeCampo,form);
	var valor 	= "";
	var exp 	= "";
	var sepAux	= "";
	if (valorNovo == "") {sepAux = "";}
	else {sepAux = separador;}
	if(campo) {
		valor = campo.value;
		if(valor.indexOf(separador) < 0) {
			try{
				exp = new RegExp(valorReplace);
				if(valor != "")
					valor = replaceString(exp, valor, valorNovo);
			}catch(e){
				alert("Erro ao criar expressao regular para:\n"+ valorReplace);
			}
		}else {
			try{
				exp = new RegExp(valorReplace+"\\"+separador);
				valor = replaceString(exp, valor, valorNovo+sepAux);
			}catch(e){
				alert("Erro ao criar expressao regular para:\n"+ valorReplace+"\\"+separador);
			}
			try{
				exp = new RegExp("\\"+separador+valorReplace);
				valor = replaceString(exp, valor, sepAux+valorNovo);
			}catch(e){
				alert("Erro ao criar expressao regular para:\n"+ "\\"+separador+valorReplace);
			}
		}
		campo.value = valor;
		return true;
	}
	return false;
}

/*Focar automaticamento o campo informado.*/
var botao;
function setFocus(nomeCampo, selecionar){

	campoFocus = "";
	var campo 	= getCampo(nomeCampo);

	if(campo){
		setCampoFocus(nomeCampo);
		try{
			if((campo.type == "text" || campo.type=="password" || campo.type=="textarea" || campo.type=="file") &&
					campo.type != "hidden"  && !campo.readOnly && !campo.disabled){
				campo.focus();
				if(selecionar)
					selecionarCampo(campo.name);
			}
			else if ((campo.type == "select-one" || campo.type == "select-multiple") &&
					campo.options.length > 0 && campo.options.selectedIndex <= 0 && !campo.disabled){

				campo.focus();
				campo.options[0].selected = true;
			}
			/*else if (campo.length && campo[0].type == "radio"){
				var checado = false;
				for(i = 0; i < campo.length; i++){
					if(campo[i].checked)
						checado = true;
					alert(campo[i].checked)
				}
				if(!checado)
					campo[0].checked = true;
			}*/
		}catch(e){}
	}
}

/*Selecionar o conteúdo do campo informado.*/
function selecionarCampo(nomeCampo){

	var campo 	= getCampo(nomeCampo);

	if(campo) {
		try{
			if((campo.type == "text" || campo.type=="password" || campo.type=="textarea" || campo.type=="file") &&
					campo.type != "hidden"  && !campo.readOnly && !campo.disabled){
				campo.select();
			}
			else if ((campo.type == "select-one" || campo.type == "select-multiple") &&
					campo.options.length > 0 && campo.options.selectedIndex <= 0 && !campo.disabled) {
				campo.focus();
				campo.selected = true;
			}
		}catch(e){}
	}
}

/*Retornar o valor do campo informado.*/
function get(field, form)  {
	return retornaValorCampo(field, form);
}

/*Retornar o valor do campo informado.*/
function retornaValorCampo(field, form) {

	field = padronizaNomeCampoFormulario(field);

	var campo = "";
	if(form == "" || form == 0 || ""+form == "undefined"){
		if(getRootDocument().forms && getForm() && getForm().elements)
			campo = eval("getForm().elements['"+field+"']");
	}
	else
		campo = eval("getForm('"+form+"').elements['"+field+"']");

	if(campo) {
//		HACK para retira a mascara do valor.
		if (jQuery) {
			var jCompanySubmitUnmask = jQuery(campo).data('jcompany-submit-unmask');
			if (typeof jCompanySubmitUnmask == 'function') {
				return jCompanySubmitUnmask.call() || "";
			}
		}
//		Acerto para resolver problemas de campos duplicados incluídos pela
//		geração via plugin
//		Alterado: 16/12/2005
		if(campo.length > 0 && campo[0]){
			if(	campo[0].type == "text" || campo[0].type == "hidden" || campo[0].type == "textarea"  ||
					campo[0].type == "file" || campo[0].type == "password")
				campo = campo[0];
		}
		if(	campo.type == "text" || campo.type == "hidden" || campo.type == "textarea" ||
				campo.type == "file" || campo.type == "password") {
			return campo.value;
		} else if (campo.type == "checkbox") {
			if(campo.checked)
				return campo.value;
			else{
				if(getVarGlobal("uncheck_"+campo.name))
					return getVarGlobal("uncheck_"+campo.name);
				else
					return "N";
			}
		} else if (campo.type == "select-one") {
			return campo.options[campo.selectedIndex].value;
		} else if (campo.type == "select-multiple") {
			var valSelect = new Object();
			for(i = 0; i < campo.length; i++){
				if(campo.options[i].selected){
					valSelect[valSelect.length] = campo.options[i].value;
				}
			}
			return valSelect;
		} else if (campo.type == "radio") {
			if(campo.checked)
				return campo.value;
		} else /*if (typeof campo.type == "undefined")*/ {
			for(var i = 0; i < campo.length; i++){
				if(campo[i].checked){
					return campo[i].value;
				}
			}
		}
	}

	return "";
}

/*Função para diferenciar linha para exclusão em lógicas tabulares*/
function marcarExclusaoDetalhe(chave, checkbox, evt){

	if(!checkbox.checked){
		var campo = getCampo("corpo:formulario:indExcDetPlc");
		if(campo){
			campo.value = campo.value.replace('#'+chave+"#","#");
			if (campo.value=='#') {
				campo.value='';
			}
		}
	}
	else
		set("corpo:formulario:indExcDetPlc", concatenar(get("corpo:formulario:indExcDetPlc"), chave, "#",true));
}

/*Executar ações ao marcar exclusão da linha.*/
function marcarExclusao(checkbox, evt) {
	marcarExclusaoDetalhe(checkbox.name, checkbox, evt)
	checarUm(checkbox);
}

/*Executar ações ao marcar checkbox da linha de exclusão*/
function checarUm(CB, CT, nomeChk, CBID, frm) {
	frm  		= getForm(frm);
	CT	  		= getCheckTodos(CT, frm);
	CBID 		= getCheckExc(CBID, frm);
	nomeChk 	= getNomeChk(nomeChk);
	testarChekbox(CB);
	var TB=TO=0;
	for (var i=0;i < CBID.length;i++) {
		var e = CBID[i];
		if ((e.name && e.name.indexOf(nomeChk) >= 0) && (e.type=='checkbox')) {
			TO++;
			if (e.checked)	TB++;
		}
	}
	CT.checked=(TO==TB)?true:false;
}

/*Testar marcação checkbox da linha de exclusão e diferenciar linha.*/
function testarChekbox(CHK) {
	var tag = "TR";
	if (CHK.checked) setClasse(CHK, tag, "campoComErro plc-linha-destaque");
	else setClasse(CHK, tag, "");
}

/*Recuperar campo checkbox que marca todos os checkboxes de exclusão.*/
function getCheckTodos(CT, frm) {
	if(""+CT != "undefined" && CT != "") 	return CT;
	else if (frm.cbTodos)
		return frm.cbTodos;
	else
		return frm;
}

/*Recuperar campo checkbox de exclusão clicado*/
function getCheckExc(CBID, frm) {
	if(""+CBID != "undefined" && CBID != "") {
		if(frm.CBID)
			return frm.CBID;
	}
	return frm.elements;
}

/*Recuperar nome do campo checkbox de exclusão clicado*/
function getNomeChk(nomeChk) {
	if(""+nomeChk != "undefined" && nomeChk != "")
			return nomeChk;
	return "indExcPlc";
}

/*Retorno nome do campo detalhe pelo nome do campo simples.*/
function getDetalhePeloCampo (nomeCampo){
	if (nomeCampo.indexOf("corpo:formulario:") > -1){

		var padraoDetalhe = new RegExp ("corpo:formulario:(\\w+):(\\d+):(\\w+)");
		var padraoSubDetalhe = new RegExp ("corpo:formulario:(\\w+):(\\d+):(\\w+):(\\d+):(\\w+)");
		if (padraoSubDetalhe.exec(nomeCampo) != null){
			var grupos = padraoSubDetalhe.exec(nomeCampo);
			var nomeCampoSubDetalhe = grupos[1]+"["+grupos[2]+"]."+grupos[3];
			return nomeCampoSubDetalhe;
		} else if (padraoDetalhe.exec(nomeCampo) != null) {
			var grupos = padraoDetalhe.exec(nomeCampo);
			var nomeCampoDetalhe = grupos[1];
			return nomeCampoDetalhe;
		} else {
			return "";
		}
	} else {
		var padraoDetalhe = new RegExp ("corpo:(\\w+):(\\d+):(\\w+)");
		var padraoSubDetalhe = new RegExp ("corpo:(\\w+):(\\d+):(\\w+):(\\d+):(\\w+)");
		if (padraoSubDetalhe.exec(nomeCampo) != null){
			var grupos = padraoSubDetalhe.exec(nomeCampo);
			var nomeCampoSubDetalhe = grupos[1]+"["+grupos[2]+"]."+grupos[3];
			return nomeCampoSubDetalhe;
		} else if (padraoDetalhe.exec(nomeCampo) != null) {
			var grupos = padraoDetalhe.exec(nomeCampo);
			var nomeCampoDetalhe = grupos[1];
			return nomeCampoDetalhe;
		} else {
			return "";
		}
	}
}

/*jCompany 2.7.2 - Verifica se ha alteração em algum campo para enviar alerta.*/
var msgAlteracao;
function enviaAlertaAlteracao (evt) {
	if(!disparouBotao  && !inibeAlertaAlteracaoPadrao(this) && !plcGeral.inibeAlertaAlteracao(this) && plcGeral.exibeAlertaAlteracao){
		if(confirm(msgAlteracao)){
			setAlertaAlteracao();
		}else
			return false;
	}
	return eventoTrataonclick(evt, this);
}

/*jCompany 2.7.2 - Função para sobreposição em caso de regras para inibição de alerta de alteração.*/
PlcGeral.prototype.inibeAlertaAlteracao = function (objeto) {return false;}
function inibeAlertaAlteracaoPadrao(objeto){

	if(getAlertaAlteracao() != "S")
		return true;
	var inibeAlertaAtributo = false;
	var inibeAlertaBotao 	= false;
	try{
		inibeAlertaAtributo = !( typeof objeto != "undefined" && (typeof objeto.id != "undefined" && objeto.id.indexOf("EXIBE_ALERTA_ALTERACAO") > -1));								
	}catch(e){}
	var ehNovoDetalhe = objeto != undefined && objeto.id != undefined && objeto.id.indexOf("botaoAcaoNovo") > -1  && !get('detCorrPlc') == "";
	if(getAlertaAlteracao() == "S"){
		inibeAlertaBotao = 
		(objeto.value == getBotaoArray('EXCLUIR') ||
		objeto.value == getBotaoArray('GRAVAR') || 
		objeto.value == getBotaoArray('INCLUIR_DET') || 
		objeto.value == getBotaoArray('IMPRIMIR') || 
		objeto.value == getBotaoArray('ASSISTENTE_INICIALIZA') ||
		objeto.value == getBotaoArray('ASSISTENTE_ANTERIOR') ||
		objeto.value == getBotaoArray('ASSISTENTE_CANCELA') ||
		objeto.value == getBotaoArray('ASSISTENTE_PROXIMO') ||
		objeto.value == getBotaoArray('REFRESH') ||
		objeto.value == getBotaoArray('REFRESH_CACHE') ||
		objeto.value == getBotaoArray('VIS_DOCUMENTO') ||
		objeto.value == getBotaoArray('EDT_DOCUMENTO') ||
		objeto.value == getBotaoArray('ARQ_ANEXADO') ||
		(objeto.value == getBotaoArray('INCLUIR') && get('detCorrPlc') != "")
		);
	}
	return inibeAlertaAtributo || inibeAlertaBotao || ehNovoDetalhe;
}

/*Configurar a utilização de alerta de alteração.*/
function setAlertaAlteracao(evt, alerta){
	set("corpo:formulario:alertaAlteracaoPlc",alerta != "" ? "S" : "");
	return eventoTrataonchange(evt, this);
}

/*Recuperar utilização de alerta de alteração.*/
function getAlertaAlteracao(){
	return get("corpo:formulario:alertaAlteracaoPlc");
}

/*Recuperar campos de entrada com seus respectivos valores em um array.*/
function getCamposEntrada (strTest, atributo, operador, f) {

	var condicao = 	(typeof strTest != "undefined" &&
					typeof atributo != "undefined" &&
					typeof operador != "undefined") ?
					operador == "indexOf" ?
					".indexOf('"+strTest+"') >= 0" :
					operador+strTest : "";
	var arrayCamposEntrada = new Array();
	var form = f || getForm();
	if(form){
		var formElements = form.elements;
		//
		for(e = 0; e < formElements.length; e++ ){
			//
	        if(condicao == "" || plcEval(formElements[e], atributo, condicao)){
	        	arrayCamposEntrada[arrayCamposEntrada.length] = formElements[e];
	        }
        }
	}
	return arrayCamposEntrada;
}

function limparReferenciaVinculado() {
	alterouVinculado = false;
	idVinculadoAlterado = "";
}

function mostraLimparVinculado(id) {
	var botao = document.getElementById(id);
	if (botao != null && botao != undefined) {
		botao.style.display = '';
		limparReferenciaVinculado();
	}
}

/*Desmarca lista de seleção quando campo de argumento é focado*/
function desmarcaListaSelecao(){
	if(getVarGlobal("trSelecao") != null){	
		alteraClasse('OBJETO', getVarGlobal("trSelecao"), 'CLASSE', 'campoComErro','INICIAL');
		setVarGlobal("trSelecao", null)
	}
}

var flagDesprezarA = new Array();
function pegaFlagDesprezar(chaveDet,chaveSubDet) {
   for(var i = 0; i < flagDesprezarA.length; i++){
		if ((chaveDet.indexOf(flagDesprezarA[i].componente)>-1 && chaveSubDet=='') ||
			(chaveSubDet!='' && flagDesprezarA[i].componente.indexOf(chaveSubDet)>-1)) {
			return flagDesprezarA[i].flagDesprezar;
		}
	}
	return '';
}


/**
* Escreve marca de obrigatorio ao final do campo.
*/
function escrevePlcAfter(tags,nameClass,alt,src) {
	var ts = tags.length;
	for (var i = 0; i < ts; ++i) {
		var tag = tags[i];
		if (tag.className.indexOf('AFReadOnly') < 1) {
			if (tag.className.indexOf(nameClass) > -1) {
				var $tag = jQuery(tag);
				if (!$tag.hasClass('plc-obrigatorio')) {
					var $parent = $tag.parent();
					$tag.detach();
					$tag.addClass('plc-obrigatorio');
					var $table = jQuery('<table><tr><td/><td/></tr></table>');
					$table.find('td:eq(0)').append($tag);
					$table.find('td:eq(1)').append('<span class="plc-img-obrigatorio"><img id="'+ tag.childNodes[0].id +'_icone" src="'+src+'"style="float:left; border:0" title="'+alt+'" /></span>');
					$parent.append($table);
				}
			}
        }
    }
}

//Função que registra os campos de retorno no array
//Array para conter os campos para lógicas de retorno de valores
var camposRetorno = new Array();
function getCampoRetornoById(id) {
	for(i = 0; i < camposRetorno.length; i++) {
		if(camposRetorno[i].id == id)
			return camposRetorno[i].nome;
	}
	return "";
}

/****************************************************************
Bloqueia digitação de caracter não permitido pelo tipo
------------------------------------------------
Função:		validaCaracter(campo, evt, tipo)
------------------------------------------------

=> campo  =	Tipo: String
		Nome do campo atual
=> tipo   =	Tipo: String
		Tipo do valor no campo [D=Data; V=Valor ; H=Hora]
=> evt    =	[event]
		O evento disparado para chamar a função
		(tecla pressionada, por exemplo)

<Chamar no ONKEYDOWN do campo testando seu retorno>

Exemplo:	return validaCaracter('fldCPF',event, "V");

****************************************************************/
function validaCaracter(campo, evt, tipo) {
	//Contribuição Dionatan Almeida
   var key;
   var keychar;
	key = getKeyCode(evt);	
   /**
   * Cdigos de teclas do teclado numérico
	de 96 a 105 =  0 - 9
        106 = *
        107 = +
        109 = -
        110 = ,
        111 = /
        194 = .
      */

   // array das setas
   var keyseta = new Array(37,39);

   // array dos numeros + setas
   var keynum = new Array(96,97,98,99,100,101,102,103,104,105,37,39);

   // array de data + numeros
   var keynumD = new Array(96,97,98,99,100,101,102,103,104,105,39,111);

   // array dos numeros
   var keydigit = new Array(96,97,98,99,100,101,102,103,104,105);

   keychar = String.fromCharCode(key);

   var ehValido = false;

   if ((key==null) || (key==0) || (key==8) || (key==9)|| (key==27) ||
		(key==46))
        ehValido = true;
   else if (tipo=="V" && ((("0123456789").indexOf(keychar) > -1) ||
		validaKeyArray(key,keynum)))
   		ehValido = true;
   else if (tipo=="D" && ((("/0123456789").indexOf(keychar) > -1) ||
		validaKeyArray(key,keynumD)))
	    ehValido = true;
   else if (tipo=="DT" && (((" :/0123456789").indexOf(keychar) > -1) ||
		validaKeyArray(key,keynumD)))
	    ehValido = true;
   else if (tipo=="H" && (((":0123456789").indexOf(keychar) > -1) ||
		validaKeyArray(key,keynum)))
   		ehValido = true;
   else if (tipo=="A" && (("0123456789").indexOf(keychar) == -1 || 
   			validaKeyArray(key,keyseta)))
		ehValido = true;
	if (!ehValido && campo != null) {
		while (campo.value.indexOf(keychar) > -1 || campo.value.indexOf(keychar.toLowerCase()) > -1){
				campo.value = campo.value.replace(keychar, "");
				campo.value = campo.value.replace(keychar.toLowerCase(), "");
		}
	}	
	//Adaptação para Internet Explorer, visto que, no Internet Explorer, o keychar não chega corretamente para os símbolos abaixo. 
	// TODO ver como melhorar, pois no internet explorer continua aceitando / e : por causa de Data
	/* 
	231 - ç
	6   - š
	252 - ü
	219 - Ž
	180 - ŽŽ
	199 - Ç
	220 - Ü 
	*/
	var caracteresEspeciais = new Array(String.fromCharCode(231),
										String.fromCharCode(6),
										String.fromCharCode(252),
										String.fromCharCode(219),
										String.fromCharCode(180),
										String.fromCharCode(199),
										String.fromCharCode(220),
										"!","@","#","$","%","^","&","*","(",")",
										"_","-","+","=","{","}","|","[","]","\\",
										"\"",":",";","'","<",">","?",",",";","`","~");
	for (var i=0;i<caracteresEspeciais.length;i++){
		var caracter = caracteresEspeciais[i];
		if (campo.value.indexOf(caracter) > -1){
			campo.value = campo.value.replace(caracter, "");
		}
	}
   return ehValido;
}

var arrayValidacaoCampos 	= new Array();
function validacaoCampo (argumentos){
	this.nomeCampo 		= argumentos[0];	
	this.formatoCampo 	= argumentos[1];
	this.msgErro		= argumentos[2];
	this.PARAM_0	= "";
	this.PARAM_1	= "";
	this.PARAM_2	= "";
	this.PARAM_3	= "";

	for(i = 3; i < argumentos.length; i++) {
		if(argumentos[i] == "PARAM_0")
			this.PARAM_0 = argumentos[++i];
		if(argumentos[i] == "PARAM_1")
			this.PARAM_1 = argumentos[++i];
		if(argumentos[i] == "PARAM_2")
			this.PARAM_2 = argumentos[++i];
		if(argumentos[i] == "PARAM_3")
			this.PARAM_3 = argumentos[++i];
	}
	this.msgErro = this.msgErro.replace("{0}", this.PARAM_0);
	this.msgErro = this.msgErro.replace("{1}", this.PARAM_1);
	this.msgErro = this.msgErro.replace("{2}", this.PARAM_2);
	this.msgErro = this.msgErro.replace("{3}", this.PARAM_3);
}

function validacaoCriaCampo(){
	arrayValidacaoCampos[arrayValidacaoCampos.length] = new validacaoCampo(arguments);
}