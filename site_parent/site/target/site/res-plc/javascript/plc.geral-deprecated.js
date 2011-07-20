//plc.geral.util.js

/**
 * Função para esconder / mostrar qualquer elemento da tela que contenha um id
 * @param idObj Objeto para esconder / mostrar [String,OB]
 * @param visibilidade Define se o objeto vai ser escondido ou mostrado [Boolean,OB] {true|false}
 * @TODO Alterar para chamar getElementoStyle()
 */
function setVisible(idObj, visibilidade) {
	var obj = eval("document.all['"+idObj+"']");
	if (obj) { obj.style.visibility = visibilidade; }
}

function abrirArquivo(info){
	var arquivo = info.substr(info.indexOf(';', 0)+1);
	var path = info.substr(0, info.indexOf(';', 0));

	var win = window.open(path, 'downloadArquivo', '');
	win.location = path + '&filename=' + '/' + arquivo;
}

function stringPrimeiraMaiuscula(str){
	return str.substring(0,1).toUpperCase() + str.substring(1,str.length);
}

var images = new Array();
function regImg(nome, src, alt) {
	this.nome = nome;
	this.src  = src;
	this.alt  = alt;
}

function getImagem(nome) {
	for(i = 0; i < images.length; i++) {
		if(images[i].nome == nome)
			return images[i];
	}
	return false;
}

function getImagemById(id) {
	return document.images[id];
}

function alteraImagem(id, src, alt) {
	var img = getImagemById(id);
	if(img) {
		img.src = src;
		img.alt = alt;
	}
}

function alteraImagems(id, src, alt) {
	if(document.images){
		for(i=0; i<document.images.length; i++) {
			if(document.images[i] && document.images[i].id == id) {
				if(document.images[i].src)
					document.images[i].src = src;
				if(document.images[i].alt)
					document.images[i].alt = alt;
			}
		}
	}
}

function getDocumento(){
	return (document.compatMode && document.compatMode!="BackCompat") ? document.documentElement : document.body
}

function posicionaElemento(elementoID, posX, posY, incremental){
	var crossElementoStyle = getElementoStyle(elementoID);
	incremental = incremental != "" || typeof incremental != "undefined" ? incremental : false;
	var crossElementoStyle = getElementoStyle(elementoID);
	if(posX && posX != "" && typeof posX != "undefined")
		crossElementoStyle.top = incremental ? getVarGlobal("topo"+elementoID) + parseInt(posX) : parseInt(posX) ;
		if(posY && posY != "" && typeof posY != "undefined")
			crossElementoStyle.left = incremental ? getVarGlobal("esquerda"+elementoID) + parseInt(posY) : parseInt(posY);
}

function posicionaElementoPor(elementoID, posX, posY){
	var crossElementoStyle = getElementoStyle(elementoID);
	if(getVarGlobal("esquerda"+elementoID) == null)
		setVarGlobal("esquerda"+elementoID,parseInt(crossElementoStyle.left));
	if(getVarGlobal("topo"+elementoID) == null)
		setVarGlobal("topo"+elementoID,parseInt(crossElementoStyle.top));

	posicionaElemento(elementoID, posX, posY, true);
}

function redimensionaElemento(elementoID, wa, ha, incremental){

	incremental = incremental != "" || typeof incremental != "undefined" ? incremental : false;
	var crossElementoStyle = getElementoStyle(elementoID);
	if(wa && wa != "" && typeof wa != "undefined")
		crossElementoStyle.width = incremental ? getVarGlobal("largura"+elementoID) + wa : wa;
		if(ha && ha != "" && typeof ha != "undefined")
			crossElementoStyle.height = incremental ? getVarGlobal("altura"+elementoID) + ha : ha;
}

function redimensionaElementoPor(elementoID, wa, ha){
	var crossElementoStyle = getElementoStyle(elementoID);
	if(getVarGlobal("altura"+elementoID) == null)
		setVarGlobal("altura"+elementoID,parseInt(crossElementoStyle.height));
	if(getVarGlobal("largura"+elementoID) == null)
		setVarGlobal("largura"+elementoID,parseInt(crossElementoStyle.width));

	redimensionaElemento(elementoID, wa, ha,true);
}

function marcaSelecao(linha, evt){
	if(evt.type == "mouseover")
		alteraClasse('OBJETO', linha, 'CLASSE', 'campoComErro');
	else
		alteraClasse('OBJETO', linha, 'CLASSE', 'campoComErro','INICIAL');
	if(getVarGlobal("trSelecao") != null){	
		alteraClasse('OBJETO', getVarGlobal("trSelecao"), 'CLASSE', 'campoComErro','INICIAL');
		setVarGlobal("trSelecao", null)
	}	
}

var conteudo_textarea = "";
function garanteTamanhoMaximo(campo, tamanhoMaximo){	
	num_caracteres = campo.value.length;
	if (num_caracteres > tamanhoMaximo){
		campo.value = conteudo_textarea;
	}else{
		conteudo_textarea = campo.value;
	}
}

function converteMaiuscula(evt, campo){
	var key = getKeyCode(evt);
	if(key != 37 && key != 39 && (plcGeral.alfabeticoPattern.test(campo.value) || plcGeral.numericoPattern.test(campo.value)))
		campo.value = campo.value.toUpperCase();
}

function converteMinuscula(evt, campo){
	var key = getKeyCode(evt);
	if(key != 37 && key != 39 && (plcGeral.alfabeticoPattern.test(campo.value) || plcGeral.numericoPattern.test(campo.value)))
		campo.value = campo.value.toLowerCase();
}

if (typeof String.prototype.trim == "undefined") {
	String.prototype.trim = function( text ){
		return text == null ? "" : text.toString().replace( /^[\s]+/, "" ).replace( /[\s]+$/, "" );
	}
}

/*Disparar pesquisa para RSS*/
function pesquisaParaRSS(){
	var url = getRootDocument().location.href;
	// Verifica evento
	if (url.indexOf("evento=y")>-1){
		// Não faz nada
	} else {
		url = url + "?evento=y";	
	}
	// Verifica formato
	if (url.indexOf("formato=RSS")>-1){
		// Não faz nada
	} else {
		url = url + "&formato=RSS";
	}
	submeteUrl(url);
}

//plc.geral.event.js

/**
 * Função para executar outras funções no onload da p?gina
 * @variable campoFocus Vari?vel que identifica campo a ser posicionado
 * @variable interval Utilizada para intervalos de tempo [Object]
 * @see moverFoco
 * @see setUpOnFocusHandlers
 * @see gravaResolucaoVideo
 * @see gerarImpressaoInteligente
 * @see executarFuncaoOnLoad
 */
function iniciarPagina() {
	moverFoco(); //Move foco automaticamente
	setUpOnFocusHandlers(); //Configura evento onfocus automaticamente //?
	gravaResolucaoVideo(); // Grava resolucao de video para uso no jcpmonitor.
	if(typeof getParametroUrl("impIntel") != "undefined" &&	getParametroUrl("impIntel").toLowerCase() == "s"){
		gerarImpressaoInteligente(); //Executa impressao inteligente
	}
	executarFuncaoOnLoad(); //Executa funções configuradas para onload da p?gina
	mantemAbaSelecionada();
}

function setFuncaoOnLoad(decFunction) {
	if (this.cacheFunction == null) {this.cacheFunction = new Array();}
	this.cacheFunction[this.cacheFunction.length] = decFunction;
}

function executarFuncaoOnLoad() {

	if(this.cacheFunction != null) {
		var i=0;
		while(i < this.cacheFunction.length){
			try{
				eval(this.cacheFunction[i]);
			}catch(e){
				alert("Erro ao executar funcao no onload. Funcao executada: "+this.cacheFunction[i]);
			}
			i++;
		}
	}
}

/*--------------------------------------------------------------*\
jCompany 2.7.2 - Inibe evento onclick
\*--------------------------------------------------------------*/
function inibeOnClick (evt) {
	return false;
}

//plc.geral.impressao.js
function gerarCamposProtegidos(){
	var tag 	= "";
	var tags 	= document.getElementsByTagName("INPUT");
	for(t = 0; t < tags.length; t++){
		tag = tags[t];
		if(tag.type == "reset"){
			tag.disabled = true;
		} else if (tag.type == "checkbox"){
			tag.disabled = true;
		} else if (tag.type == "password"){
			tag.disabled = true;
		} else if (tag.type != "radio" && tag.type != "hidden" && tag.type != "button" && tag.type != "password" && tag.type != "submit"){
			tag.disabled = true;
		}
	}

	tags = document.getElementsByTagName("BUTTON");
	for(t = 0; t < tags.length; t++){
		tag = tags[t];
		if (tag.parentNode.id!="barraAcoes" && tag.id!='rodape:desconecta'){
			tag.disabled = true;
		}
	}
	tags = document.getElementsByTagName("TEXTAREA");
	for(t = 0; t < tags.length; t++){
		tag = tags[t];
		tag.disabled = true;
	}
	tags = document.getElementsByTagName("PASSWORD");
	for(t = 0; t < tags.length; t++){
		tag = tags[t];
		tag.disabled = true;
	}
	tags = document.getElementsByTagName("SELECT");
	for(t = 0; t < tags.length; t++){
		tag = tags[t];
		tag.disabled = true;
	}

	tags = document.getElementsByTagName("SPAN");
	for(t = 0; t < tags.length; t++){
		tag = tags[t];
		if(tag.className == "bt"){
			tag.style.display = 'none';
		}
	}
}



function substituirCampoPorLabel(tag){
	var tagSpan = "";
	var paiTag = tag.parentNode;
	if(paiTag){
		if(tag.type == "select-multiple"){
			for(s = 0; s < tag.options.length; s++){
				tagSpan = document.createElement("SPAN");
				if(tag.options[s].selected)
					tagSpan.style.backgroundColor = "yellow";
				tagSpan.innerHTML = tag.options[s].text+"<br>";
				paiTag.appendChild(tagSpan);
			}
		}else{
			tagSpan = document.createElement("SPAN");
			if(tag.type == "select-one")
				tagSpan.innerHTML = tag.options[tag.selectedIndex].text;
			else
				tagSpan.innerHTML = tag.value+"&nbsp;";
			paiTag.appendChild(tagSpan);
		}
		tag.style.display = 'none';
	}
}

//plc.geral.popup.js

/**
 * Comuta paineis entre visiveis e invisiveis
 * @since jCompany 3.03
 * @param ajuda Objeto que representa a janela de ajuda [String,OB]
 * @see showFormSelect
 */
function janelaPainel(painel) {
	if (painel.style.visibility =='hidden') {
		painel.style.visibility = 'visible';
		hideFormSelect();
	} else {
		painel.style.visibility = 'hidden';
		showFormSelect();
	}
}

/**
 * Função para abrir um janela do tipo POP-UP em uma mesma instancia passada
 * Chamada: <br><dd><code>&lt;a href='#' onclick='janela("url_janela","alvo"); return false;'&gt;</code>
 * @param url Endere?o para abertura da janela
 * @param wa Largura da janela. [String, OP]
 * @param ha Altura da janela. [String, OP]
 * @param props Propriedades da janela. Informar no lugar de <I>wa</I> e <I>ha</I> que devem ser informados como "" [String, OP]
 */
function janelaComAlvo(url,alvo,wa,ha,props,max) {
	return janela(url,wa,ha,props,alvo,max);
}
/**
 * Função para abrir um janela do tipo POP-UP redimensionada para tamanho m?ximo da resolução
 * Chamada: <br><dd><code>&lt;a href='#' onclick='janela("url_janela","alvo","props"); return false;'&gt;</code>
 * @param url Endere?o para abertura da janela [String]
 * @param alvo Inst?ncia para abertura. [String]
 * @param props Propriedades da janela. Informar no lugar de <I>wa</I> e <I>ha</I> que devem ser informados como "" [String, OP]
 */
function janelaMaximizada(url,w,h,alvo,props) {
	return janela(url,w,h,props,alvo,"S");
}

/**
 * JCompany: Devolve os valores selecionados em uma janela de seleção popup.
 * Os par?metros devem ser passados para este função aos pares e na seguinte ordem: nome e valor do
 * atributo.
 * @author: Claudia Seara - Powerlogic 2003 (c)
 */
function devolveSelecao() {
	//Compatibilização
	if(arguments.length == 1)
		devolveSelecaoPopup(arguments[0])
		else
		{
			// Verifica se o n?mero de argumentos ? par
			if ((arguments.length % 2) != 0 ) {
				alert("ERRO! \n\nFunção: devolveSelecao(). \n\nErro: A quantidade de parametros passados para esta função n?o ? um n?mero par." );
				return;
			}

			// Monta os vetores de nome e valor para os atributos selecionados
			var nome = new Array();
			var valor = new Array();
			var j = 0;

			for(var i = 0; i < arguments.length;) {
				nome[j] = arguments[i++];
				valor[j++] = arguments[i++];
			}

			if (typeof dialogOpener != 'undefined') {
				dialogOpener.focaElementoInformado();
				dialogOpener.recebeSelecao(nome, valor);
				dialogClose();
			} else {
				window.opener.focaElementoInformado();
				// Passa os vetores para a janela que acionou a janela de seleção
				window.opener.recebeSelecao(nome, valor);
				// Fecha a janela de seleção
				window.close();
			}
		}
}

/**
 * JCompany: Recebe os valores selecionados em uma janela de seleção popup e procura por atributos
 * do mesmo nome no form corrente. Caso encontre, atribui o valor selecionado ao atributo do form.
 * @author: Claudia Seara - Powerlogic 2003 (c)
 */
function recebeSelecao() {
	//Compatibilização
	if(arguments.length == 1)
		recebeSelecaoPopup(arguments[0])
		else
		{
			// Recebe os vetores de nome e valor dos atributos selecionados
			var nome 	= arguments[0];
			var valor 	= arguments[1];

			// Procura no form corrente por atributos de mesmo nome. Se achar, atribui o valor passado
			// do atributo ao atributo de mesmo nome no form.
			for(var j = 0; j < nome.length; j++) {
				for(var i = 0; i < getForm().length; i++) {

					if (getForm().elements[i].name == nome[j]) {
						getForm().elements[i].value = valor[j];
						break;
					}
				}
			}
			eval("executarEventoAplicacao('TESTAR_NIVEL')");
		}
}

function selecaoPopup(url, listaCampos, separador, larg, alt, posX, posY, alvo, delimPropsPlc) {
	camposRetorno = registrarCamposRetorno(listaCampos, "nome,id", separador);
	if (camposRetorno) {
		camposRetorno.delimPropsPlc = delimPropsPlc;
	}
	var janelaRetornada = janela(url,larg,alt,"",alvo,"",posX, posY);
	return janelaRetornada;
}

/**
 * Função para abrir um janela do tipo POP-UP em modo modal
 * Chamada: <br><dd><code>&lt;a href='#' onclick='janela("url_janela","alvo"); return false;'&gt;</code>
 * @variable modalWin Objeto que representa instancia da janela modal
 * @param url Endereço para abertura da janela [String]
 * @param alvo Instância para abertura. [String]
 */
var modalWin = new Object();
modalWin.returnValue = false;
function janelaModal(url,wa,ha,props,alvo) {

	if(modalWin.returnValue) {
		modalWin.returnValue = false;
		return true
	} else if (!modalWin.win || (modalWin.win && modalWin.win.closed)) {
		modalWin.win = janela(url,wa,ha,props,alvo);
		modalWin.modalFocus = true;
		modalWin.win.focus();
		window.onfocus = checkModal;
		return false;
	} else {
		checkModal();
		return false;
	}
}
/**
 * Força o focus em janela model
 * @variable modalWin Objeto que representa instancia da janela modal
 */
function checkModal() {
	if(modalWin.modalFocus) {
		if (modalWin.win && !modalWin.win.closed)
			modalWin.win.focus();
	}else
		window.focus();
}
/**
 * Configura retorno da janela modal
 * @variable value Valor de retorno
 */
function setReturnValue(value) {
	window.onfocus 		= window.focus;
	modalWin.modalFocus 	= false;
	modalWin.returnValue = value;
	modalWin.win.close();
	modalWin.win = null;
}


/* Funções abaixo feitos para seleção multipla */
var arrayCamposRetorno = new Array();
var posicaoDetalhe = 0;
function selecaoPopupMulti(url, listaCampos, separador, larg, alt, posX, posY, alvo){

	//corpo:formulario:(\\w*):(\\d*):(\\w*)
	//corpo:formulario:(\\w*):(\\d*):(\\w*)#(\\w*)
	//(\w*)corpo:formulario:(\w*):(\d*):(\w*)#(\w*)
	var padrao = new RegExp ("(\\w*)corpo:formulario:(\\w*):(\\d*):(\\w*)#(\\w*)");
	var array = padrao.exec(listaCampos);

	posicaoDetalhe = parseInt(array[3]);
	var count = 0;

	while (true){
		array = padrao.exec(listaCampos);
		if (array == null)
			break;

		var obj = new Object ();
		var expresao = array[0];
		obj.prefix = array[1]
		                   obj.detalhe = array[2];
		obj.campoDetalhe = array[4];
		obj.varSubstituto = array[5];
		arrayCamposRetorno[count] = obj;
		listaCampos = listaCampos.replace(expresao,"");

		count++;
	}

	janela(url,larg,alt,"",alvo,"",posX, posY);
}
/** 
 * Em caso de recuperacão Multipla, guardar na variavel as linhas selecionadas
 * 
 * TODO - homologar um novo padrão de multipla selecao
 */
var valorSelMulti = new Array();
function guardaSelecaoMultiJSF(valores, tagLinha, detalhe){

	var expr = new RegExp ("corpo:formulario:"+detalhe+":([0-9]*):linhaSel");
	var padroes = expr.exec (tagLinha.id);

	var existeEmArray = false;

	for (var i=0; i<valorSelMulti.length; i++){
		var arrayObj = valorSelMulti[i];
		if (arrayObj.valor == valores){
			existeEmArray = true;		
		}
	}

	if (!existeEmArray){
		var obj = new Object();
		obj.indice = padroes[1];
		obj.valor = valores;

		valorSelMulti[valorSelMulti.length] = obj;
	}
}

function retornarMultiSelJSF (detalhe){
	var devolveSelecao = new Array();
	var count = 0;
	for(var i=0; i<valorSelMulti.length; i++){
		var obj = valorSelMulti[i];
		var idIndExcPlc = "corpo:formulario:"+detalhe+":" + obj.indice + ":indMultiSelPlc";
		var tagIndExcPlc = getRootDocument().getElementById(idIndExcPlc);
		if (typeof tagIndExcPlc != "undefined" && tagIndExcPlc.checked){
			tagIndExcPlc.checked = false;
			var valor = obj.valor;
			devolveSelecao [count] = valor;
			count++;
		}
	}
	opener.devolveSelecaoMultipla (devolveSelecao); 
	window.close();
}

function devolveSelecaoMultipla (devolveSelecaoMulti){
	for (var j=0; j<arrayCamposRetorno.length; j++){
		var count = 0;
		for (var i=0; i<devolveSelecaoMulti.length; i++){
			var devolveSelecao = devolveSelecaoMulti[i];
			var campos = devolveSelecao.split(",");
			for (var t=0; t<campos.length; t++){
				var campoValor = campos[t].split("#");
				var nomeCampo = campoValor[0];
				var valor = campoValor[1];
				var obj = arrayCamposRetorno[j];
				if (nomeCampo == obj.varSubstituto){
					var posicaoTag = posicaoDetalhe + count;

					var idTag = obj.prefix + "corpo:formulario:" + obj.detalhe + ":" + posicaoTag.toString() + ":" + obj.campoDetalhe;
					var tag = getElementoPorId (idTag);
					if (tag != null && typeof tag != "undefined"){
						tag.value = valor;
					}	
				}

			}
			count++;
		}
	}
}

//plc.geral.tabs.js

/*jcompany 5.0 - Comuta de aba automaticamente.*/
function comutaAba(posicaoAba,nomeCampo) {
	trocaAba(posicaoAba,'def.tab.automatico_'+posicaoAba,'def.tab.automatico_'+posicaoAba);
	setTimeout('window.focus()',40);
	var comandoFoco = "setFocus('"+nomeCampo+"')";
	setTimeout(comandoFoco,50);

}

//plc.geral.form.js

/**
 * Função para envia mensagem de confirmação para  exclusão de registro e dispara
 * botão associado é exclusão
 * @param acao Ação que determina botão de exclusão a ser disparado [String]
 * @see disparaBotaoAcao
 */
function confirmaExclusao(acao) {
	// TODO - internacionalizar	
	if (confirm('Confirma a Exclusão do Registro?'))
		disparaBotaoAcao(acao);
}

var msgExclusaoDetalhe;
function enviaAlertaExclusaoDetalhe(){

	var usaAlertaExclusaoDetalhe = getCampo("corpo:formulario:alertaExclusaoDetalhePlc");
	if (usaAlertaExclusaoDetalhe != undefined && usaAlertaExclusaoDetalhe.value=='S'){
		var campo = getCampo("corpo:formulario:indExcDetPlc");
		if (campo && campo.value!=''){
			return confirm(msgExclusaoDetalhe);
		}
	}
	return true;
}


/**
 * Função dispara clique em um botão da pagina conforme acao passada.<b>
 * Se for passado tambem o parametro id o botão clicado deve ter este valor declarado
 * @param acao Ação que determina botão de exclusão a ser disparado [String, OB]
 * @param id Identificador do botão a ser disparado [String, OP]
 * @return disparou Retorna true se botão foi disparado ou false caso contr?rio
 */
function disparaBotaoAcao(acao, id) {
	if (id == "" || ""+id == "undefined") {
		id = "botao_menu";
	}
	var numElements;
	var elementValue;
	var disparou = false;
	var form = getForm(form);
	var elements;
	if(form.elements[id].length) {
		elements = form.elements[id];
	} else {
		elements = form.elements;
	}
	if (form) {
		numElements = elements.length;
		if (numElements > 0) {
			for (i=0; i < numElements; i++) {
				elementValue = elements[i].value;
				if (elementValue == acao) {
					elements[i].click();
					i =numElements;
					disparou = true;
				}
			}
		}
	} else if (eval(form.elements[acao])) {
		form.elements[acao].click();
	}
	return disparou;
}

/*Função para testar se campo permite foco.*/
function permiteFocus(nomeCampo){

	var campo = getCampo(nomeCampo);
	if(campo && 
			((campo.getAttribute("inibeFoco") != 'S' &&
					campo.className.indexOf("inibeFoco") < 0) ||
					(typeof campo.getAttribute("id")!= 'undefined' && campo.getAttribute("id") != null &&
							campo.getAttribute("id").indexOf(":inibeFoco")>-1)) &&
							!campo.readOnly && !campo.disabled){
		if((campo.type=="text" ||
				campo.type=="password" ||
				campo.type=="file" ||
				campo.type=="textarea") &&
				campo.type != "hidden" &&
				campo.value == ""){
			return true;	
		} else if ((campo.type == "select-one" ||
				campo.type == "select-multiple") &&
				campo.options.length > 0 &&
				campo.options.selectedIndex <= 0){
			return true;
		}
	}
	return false;
}

function focarCampoDetalhe(nomeDetalhe, campoFoco, numDetalhes){
	try {
		for(var d = 0; d < numDetalhes; d++){
			var campoDetalhe = campoFoco.indexOf("[0]") > -1 ? campoFoco.replace("[0]","["+d+"]") : 
				nomeDetalhe+"["+d+"]."+campoFoco;
			if(permiteFocus(campoDetalhe)){
				setCampoFocus(campoDetalhe);
				break;
			}	
		}
	}
	catch(e) {}
}

function setFocoDetalhe(){
	var idPortlet 	= getVarGlobal("idPortlet");
	var campoFoco 	= getVarGlobal("campoFoco_"+idPortlet);
	focarCampoDetalhe(idPortlet, campoFoco,parseInt(getVarGlobal("numDetalhes_"+idPortlet)))
}

/**
 * Pega valor de campo de formulário quando usando apache trinidad para renderizar.
 * Para pegar de itens pegar o indice com '#{plcItensStatus.index}'
 */
function getValorJsf(field, indice, detalhe)  {
	if (indice != null) {
		field = "corpo:formulario:"+detalhe+":"+indice+":"+field;
	} else {
		field = "corpo:formulario:"+field;     
	}
	return retornaValorCampo(field);
}
/**
 * Pega setar valor em campo de formulário quando usando apache trinidad para renderizar.
 * Para setar de itens pegar o indice com '#{plcItensStatus.index}'
 */
function setValorJsf(field, indice, detalhe, valor)  {
	if (indice != null) {
//		Assume iteracao 
		field = "corpo:formulario:"+detalhe+":"+indice+":"+field;
	} else {
		field = "corpo:formulario:"+field;     
	}
	return set(field,valor);
}
/**
 * Pega uma referencia a campo de formulário quando usando apache trinidad para renderizar.
 * Para pegar de itens pegar o indice com '#{plcItensStatus.index}'
 */
function getObjetoJsf(field, indice, detalhe)  {
	if (indice != null) {
//		Assume iteracao 
		field = "corpo:formulario:"+detalhe+":"+indice+":"+field;
	} else {
		field = "corpo:formulario:"+field;     
	}
	return getCampo(field);
}


function manterMarcaExc(val, frm){
	frm 		= getForm(frm);
	if(frm) {
		var EL	= frm.elements;
		for (var i = 0; i < EL.length; i++) {
			var e = EL[i];
			if ((e.name.indexOf("indExcPlc") >= 0) && (e.type == 'checkbox')) {
				if(e.checked || e.value == "S") {	e.click(); e.click();}
				else
					setClasse(e, "TR", "");
			}
		}
	}
}

function checarTodos(CT, CBID, nomeChk, frm){
	frm  		= getForm(frm);
	CT   		= getCheckTodos(CT, frm);
	CBID 		= getCheckExc(CBID, frm);
	nomeChk 	= getNomeChk(nomeChk);
	for (var i = 0; i < CBID.length; i++) {
		var e=CBID[i];
		if ((e.name.indexOf(nomeChk) >= 0) && (e.type=='checkbox')) {
			e.checked = CT.checked;
			testarChekbox(e);
		}
	}
}

/**********************************************************
Formatar a data digitada
--------------------------------------------
Função:     formataData(Campo,Prox,tammax,teclapres)
--------------------------------------------

=> Campo =  Tipo: String
        Nome do campo de data
=> prox  =  Tipo: String
        Nome do pr?ximo campo
=> tammax = Tipo: int [8]
        Tamanho m?ximo permitido
=> teclapres =  Tipo: event [event]
        O evento disparado para chamar a função
        (tecla pressionada, por exemplo)

<Chamar no ONKEYPRESS do campo>

Exemplo:    formataData('fldData',event);

Obs.: A data digitada aparecer? no formato: dd/mm/aaaa

 **********************************************************/
function formataData(campo,evt) {
	formataDataComMascara(campo,evt,"dd/MM/yyyy");		
}

function formataDataComMascara(campo,evt,mascara) {

	if (mascara != "dd/MM/yyyy" && mascara != "MM/yyyy" && mascara != "MM/yy" & mascara != "dd/MM/yy")
		alert('Máscara inválida. Informe uma de [dd/MM/yyyy] [MM/yyyy] [MM/yy] [dd/MM/yy]');

	if(NavYes)
		var tecla = evt.which;
	else
		var tecla = evt.keyCode;

	vr = retornaValorCampo(campo);
	vr = vr.replace( ".", "" );
	vr = vr.replace( "/", "" );
	vr = vr.replace( "/", "" );
	vr = vr.replace( "/", "" );
	tam = vr.length +1;
	if ( tecla != 9 && tecla != 8 && tecla != 0 )
	{
		if (mascara=="dd/MM/yyyy" || mascara=="dd/MM/yy") {
			if ( tam ==2 && vr>'3')
				vr = '';
			else if ( tam ==3 && vr>'31')
				vr = vr.substr( 0, 1 );
			else {
				if ( tam > 2 && tam < 5 )
					vr = vr.substr( 0, 2 ) + '/' + vr.substr(2, tam );
				if ( mascara=="dd/MM/yyyy" && tam >= 5 && tam <= 10 )
					vr = vr.substr( 0, 2 ) + '/' + vr.substr( 2, 2 ) + '/' + vr.substr( 4, 3 );
				if ( mascara=="dd/MM/yy" && tam >= 5 && tam <= 8 )
					vr = vr.substr( 0, 2 ) + '/' + vr.substr( 2, 2 ) + '/' + vr.substr( 2, 3 ); 
			}
		} else if (mascara=="MM/yyyy") {
			if ( tam ==2 && vr>'1')
				vr = '';
			if ( tam ==3 && vr>'12')
				vr = vr.substr( 0, 1 );
			else if ( tam > 2) {
				vr = vr.substr( 0, 2 ) + '/' + vr.substr(2, 3 );
			}
		} else if (mascara=="MM/yy") {
			if ( tam ==2 && vr>'1')
				vr = '';
			if ( tam ==3 && vr>'12')
				vr = vr.substr( 0, 1 );	
			else if ( tam > 2)
				vr = vr.substr( 0, 2 ) + '/' + vr.substr(2, 1 );
		}
		setValorCampo(campo, vr);
		return false;
	}
}

function atualizaCriterio(nomeCampo, valorReplace, valorNovo, separador, form) {
	atualizaValorCampo(nomeCampo, valorReplace, valorNovo, separador, form);
	setValorCampo(nomeCampo, valorNovo, separador, form);
	setValorCampo(nomeCampo, ordenaCriterio (nomeCampo, retornaValorCampo(nomeCampo), separador));
}

var ordem = new Array();
function ordenaCriterio (campo, listaCampos, separador) {
	listaOrdenada = "";
	for (i = 0; i < ordem.length; i++) {
		if(ordem[i] != "undefined" && listaCampos.indexOf(ordem[i]+" ") >= 0) {
			var criterio = getCriterioOrdenacao(ordem[i]);
			if (criterio != ""){
				if(listaOrdenada != "")
					listaOrdenada += separador;
				listaOrdenada += ordem[i]+" "+getCriterioOrdenacao(ordem[i]);
			}
		}
	}
	return listaOrdenada;
}

function atualizaCriterioOrdenacao(chave) {
	var criterio = getVarGlobal(chave);
	if(criterio == "desc")
		setVarGlobal(chave, "");
	else if (criterio == "asc")
		setVarGlobal(chave, "desc");
	else if (criterio == null || criterio == "") {
		setVarGlobal(chave, "asc");
		criterio = "asc";
	}
	return getVarGlobal(chave);
}

function getCriterioOrdenacao(chave) {
	var criterio = getVarGlobal(chave);
//	Alterado porque n?o retornava sem critório (branco)
//	if (criterio == null || criterio == "" || ""+criterio == "undefined") {
	if (criterio == null || typeof criterio == "undefined") {
		criterio = "asc";
	}
	return criterio;
}

function setCriterioOrdenacao(chave, criterio) {
	setVarGlobal(chave,criterio);
}

function mantemEstadoCriterio(listaCampos, chave, separador) {
	var campos = listaCampos.split(separador);
	for (k=0; k < campos.length; k++) {
		var dadosCampo = campos[k].split(" ");
		if(dadosCampo[0] == chave){
			setCriterioOrdenacao(dadosCampo[0],dadosCampo[1]);
			substituirImagems(dadosCampo[0]);
			break;
		}
	}
}

function montaCriterioNovo(campo, alias) {
	var criterio = atualizaCriterioOrdenacao(campo);
	if(criterio == null || criterio == "" || ""+criterio == "undefined")
		return "";
	else
		return campo+" "+criterio;
}

function substituirImagem(campo) {
	var criterio = getCriterioOrdenacao(campo);
	var imgArray = getImagem(criterio);
	alteraImagem("IMAGEM_"+campo, imgArray.src, imgArray.alt);
}

function substituirImagems(campo) {
	var criterio = getCriterioOrdenacao(campo);
	var imgArray = getImagem(criterio);
	alteraImagems("IMAGEM_"+campo, imgArray.src, imgArray.alt);
}

//Contrutor Validacao
function PlcValida(){}

var plcValida = new PlcValida();

PlcValida.prototype.validacaoVerificarRegras = function(){
	if(!validacaoExecutar()){
		return false;
	}
	return true;
}

function validacaoExecutar(){
	var validou = true;
	for(var i = 0; i < arrayValidacaoCampos.length; i++){
		try{
			if(!eval("plcValida.regra_"+arrayValidacaoCampos[i].formatoCampo.toLowerCase()+"(arrayValidacaoCampos[i])"))
				validou = false;
		}catch(ex){
			if(plcLog.logGetDescExcecao(ex) == "Object doesn't support this property or method")
				plcLog.logAdicionaErroCampo("EXCECAO","ALERTA DE ERRO: Formato '"+arrayValidacaoCampos[i].formatoCampo+"' invalido para o campo '"+arrayValidacaoCampos[i].nomeCampo+"'");
			else {
				plcLog.logAdicionaErro(plcLog.montaMsgExcecao(ex));
			}
			return false;
		}
	}
	return validou;
}

PlcValida.prototype.regra_numerico = function (objCampo){
	var valCampo = get(objCampo.nomeCampo);
	if(valCampo != "" && !plcGeral.numericoPattern.test(valCampo)){
		//plcLog.logAdicionaErroCampo(objCampo.nomeCampo,objCampo.msgErro);
		return false;
	}
	return true;	
}

PlcValida.prototype.regra_alfabetico= function (objCampo){
	var valCampo = get(objCampo.nomeCampo);
	if(valCampo != "" && !plcGeral.alfabeticoPattern.test(valCampo)){
		//plcLog.logAdicionaErroCampo(objCampo.nomeCampo,objCampo.msgErro);
		return false;
	}
	return true;	
}

PlcValida.prototype.regra_data= function (objCampo){
	var valCampo = get(objCampo.nomeCampo);
	if(valCampo != "" && !plcGeral.dataPattern.test(valCampo)){
		plcLog.logAdicionaErroCampo(objCampo.nomeCampo,objCampo.msgErro);
		return false;
	}
	return true;	
}

PlcValida.prototype.regra_datahora= function (objCampo){
	var valCampo = get(objCampo.nomeCampo);
	if(valCampo != "" && !plcGeral.datahoraPattern.test(valCampo)){
		plcLog.logAdicionaErroCampo(objCampo.nomeCampo,objCampo.msgErro);
		return false;
	}
	return true;	
}

PlcValida.prototype.regra_obrigatorio= function (objCampo){

	var valCampo = get(objCampo.nomeCampo);
	//alert('obj='+objCampo.nomeCampo+' valor campo='+valCampo);
	var considera = true;
	if (objCampo && objCampo.nomeCampo.indexOf("].")>-1) {
		// Pega valor da coluna flag para a cole?ao corrente
		var fimDet = objCampo.nomeCampo.indexOf("].")+2;
		var prefixoDet = objCampo.nomeCampo.substring(0,fimDet);
		var fimSubDet = objCampo.nomeCampo.indexOf("].",fimDet+1);
		//	alert('fimSubDet'+fimSubDet+ ' para '+objCampo.nomeCampo);
		var prefixoSubDet='';
		if (fimSubDet>-1) {
			var iniSubDet = objCampo.nomeCampo.indexOf("[",fimDet+1);
			prefixoSubDet=objCampo.nomeCampo.substring(fimDet,iniSubDet+1);
			//	alert('achou um subdet='+prefixoSubDet);
			fimSubDet = fimSubDet+2;
			fimDet = fimSubDet;
		}
		var prefixoTotal = objCampo.nomeCampo.substring(0,fimDet);
//		alert('prefixo total='+prefixoTotal+' pref det='+prefixoDet+' pref subdet='+prefixoSubDet);
		var colunaFlag = prefixoTotal + pegaFlagDesprezar(prefixoDet,prefixoSubDet);
		//	alert('colunaFlagNome='+colunaFlag+' valor='+get(colunaFlag));
		considera = get(colunaFlag) != '';
	}
	if (considera && valCampo.trim() == ""){
		plcLog.logAdicionaErroCampo(objCampo.nomeCampo,"OBRIGATORIO" );
		return false;
	}
	return true;	
}

//Recupera primeiro e ultimo detalhe de uma lista
function getCamposDetalhes(nomeCampo, nomeLista){

	var ultimoDetalhe = null;
	var primeiroDetalhe = null;
	var nomeCampoAux = nomeCampo;
	var posPonto = nomeCampoAux.indexOf(".");
	if(posPonto > -1){
		nomeLista = nomeCampoAux.substring(0,posPonto);
		nomeCampo = nomeCampoAux.substring(posPonto+1);
	}
	var cont = 0;
	do{
		var campo = getCampo(nomeLista+"["+cont+"]."+nomeCampo);
		if(campo){
			ultimoDetalhe = campo;
			if(primeiroDetalhe == null)
				primeiroDetalhe = ultimoDetalhe;
		}else{
			cont = -1;
			break;	
		} 
		cont++;
	}while(getCampo(nomeLista+"["+cont+"]."+nomeCampo) && cont > 0)
		var retorno = new Object();
	retorno.primeiro = primeiroDetalhe;
	retorno.ultimo = ultimoDetalhe;
	return retorno;
}

/*Simula o click em um link de seleção*/
function clicarListaSelecao(){
	if(getVarGlobal("trSelecao") != null){
		dispararEvento(getVarGlobal("trSelecao"), "onclick")
	}
}

function CheckNumerico(campo,tammax,teclapres) {
	var teclaChar = String.fromCharCode(getKeyCode(teclapres));

	// retirando caracteres especiais	
	var caracteresEspeciais = new Array("!","@","#","$","%","^","&","*","(",")",
			"_","-","+","=","{","}","|","[","]","\\",
			"\"",":",";","'","<",">","?","/");
	for (var i = 0;i<caracteresEspeciais.length; i++){
		if (campo.value.indexOf (caracteresEspeciais[i]) > -1){
			campo.value = campo.value.replace(caracteresEspeciais[i], "");
		}	
	}
	if (teclaChar != 0) {
		if (("0123456789").indexOf(teclaChar) > -1)
			return;
		else{
			while (campo.value.indexOf(teclaChar) > -1 || campo.value.indexOf(teclaChar.toLowerCase()) > -1){
				campo.value = campo.value.replace(teclaChar, "");
				campo.value = campo.value.replace(teclaChar.toLowerCase(), "");
			}
		}
	}
	return true;
}

function FormataValor(campo,tammax,teclapres,prec) {
	//pegar tecla e definir valor de virgula
	var tecla = teclapres.keyCode;
	var virgula = ',';

	//pegar valor do campo atual e remover todas virgulas, pontos, barras etc...
	vr = campo.value;
	vr = vr.replace( "/", "" );
	vr = vr.replace( "/", "" );
	vr = vr.replace( ",", "" );
	vr = vr.replace( ".", "" );
	vr = vr.replace( ".", "" );
	vr = vr.replace( ".", "" );
	vr = vr.replace( ".", "" );

	//se precisao for 0 definir virgula como inexistente para n?o aparecer
	if (prec==0)
		virgula='';

	//antes de checar tamanho do campo remover 0s da frente do campo
	for (k=0;k<prec;k++) {
		if (vr.substr(0,1) == '0')
			vr=vr.substr(1,prec+1);
	}

	//pegar tamanho dos valores j? limpos
	tam = vr.length;
	//se tamanho for zero n?o fazer nada
	if (tam==0)
		return

		//se teclas apertadas forem numericas, backspace, del etc.... entrar em if
		if (!tecla || tecla==8 || tecla==46 || ((tecla <= 57 && tecla >= 48) || (tecla <=105 && tecla >= 96))) {
			//if para campos de valores fracionais ate 0,999
			if ( tam <= prec + 1) {
				campo.value = '0' + virgula;
				for (k=1;k<=prec-tam;k++) {	
					campo.value += '0' ;
				}	
				campo.value+=vr;
			}

			//if para campos com valores at? 999,999
			if ( (tam > prec) && (tam <= prec + 3) ) {
				campo.value = vr.substr(0,tam-prec) + virgula + vr.substr(tam-prec,prec+1); 
			}

			//if para campos com valores at? 999.999,999
			if ( (tam > prec + 3) && (tam <= prec + 6) ) {
				campo.value = vr.substr(0, tam-(prec+3)) + '.' + vr.substr(tam-(prec+3), 3) + virgula + vr.substr(tam-prec, prec+1) ; 
			}

			//if para campos com valores at? 999.999.999,999
			if ( (tam > prec + 6) && (tam <= prec + 9) ){
				campo.value = vr.substr(0, tam-(prec+6) ) + '.' + vr.substr(tam-(prec+6), 3) + '.' + vr.substr(tam-(prec+3),3 ) + virgula + vr.substr(tam-prec, prec+1); 
			}

			//if para campos com valores at? 999.999.999.999,999
			if ( (tam > prec + 9) && (tam <= prec + 12) ) {
				campo.value = vr.substr(0, tam-(prec+9)) + '.' + vr.substr(tam-(prec+9), 3) + '.' + vr.substr(tam-(prec+6), 3) + '.' + vr.substr(tam-(prec+3), 3) + virgula + vr.substr(tam-prec,prec+1) ; 
			}

			//if para campos com valores at? 999.999.999.999.999,999
			if ( (tam > prec + 12) && (tam <= prec + 15) ) {
				campo.value = vr.substr(0, tam-(prec+12)) + '.' + vr.substr(tam-(prec+12), 3) + '.' + vr.substr(tam-(prec+9), 3) + '.' + vr.substr(tam-(prec+6), 3) + '.' + vr.substr(tam-(prec+3), 3) + virgula + vr.substr(tam-prec,prec+1) ; 
			}

//			if ( (tam >= 15) && (tam <= 17) ){
//			campo.value = vr.substr( 0, tam - 14 ) + '.' + vr.substr( tam - 14, 3 ) + '.' + vr.substr( tam - 11, 3 ) + '.' + vr.substr( tam - 8, 3 ) + '.' + vr.substr( tam - 5, 3 ) + virgula + vr.substr( tam - 2, tam ) ;}

		}

	return;
}

/*Javascript para recuperacao automatica de registro com chaveNatural.*/
var valorChave;
var campoChave;
var contemCampo;

function autoRecuperacaoChaveNatural (campo, nomeCampo, numeroCampos){
	if (valorChave == null || valorChave == "")
		valorChave = new Array ();
	if (campoChave == null || campoChave == "")
		campoChave = new Array ();

	if (contemCampo == null || contemCampo == "")
		contemCampo = new Array ();

	if (campo.value != ""){

		if (!contemCampoId(nomeCampo)){
			campoChave [campoChave.length] = nomeCampo;
			valorChave [valorChave.length] = campo.value;
			contemCampo [contemCampo.length] = nomeCampo;
		} else {
			trocaValor (nomeCampo, campo.value);
		}

	} else {
		retiraCampo (nomeCampo);
	}

	if (campoChave.length == numeroCampos)	
		recuperandoChaveNatural();
}

function trocaValor (nomeCampo, valor){

	for (var i = 0; i <campoChave.length; i++){
		if (campoChave[i] == nomeCampo)	{
			valorChave[i] = valor;			
			break;	
		}
	}	

}

function retiraCampo (nomeCampo) {
	var novoContemCampo = new Array ();
	var novoCampoChave = new Array ();
	var novoValorChave = new Array ();

	for (var i = 0;i<contemCampo.length;i++){
		if (contemCampo[i] != nomeCampo){
			novoContemCampo [novoContemCampo.length] = contemCampo[i];
			novoCampoChave[novoCampoChave.length] = campoChave[i];
			novoValorChave[novoValorChave.length] = valorChave[i];
		}
	}

	contemCampo = novoContemCampo;
	campoChave = novoCampoChave;
	valorChave = novoValorChave;
}

function contemCampoId (idCampo){

	for (var i = 0; i<contemCampo.length; i++){
		if (contemCampo[i] == idCampo)
			return true;	
	}	
	return false;
}

function recuperandoChaveNatural() {
	var url = getRootDocument().location.pathname+'?evento=y';
	for (var i = 0;i<campoChave.length;i++){									
		url = url + '&' + campoChave[i] + '=' +valorChave[i];
	}
	submeteUrl(url);
}

/*Disparar botao de visualizar documento, se estiver visivel.*/
function visualizaFormulario() {
	if (getRootDocument().getElementById('corpo:formulario:botaoAcaoVisualizaDocumento')!=null) {
		dispararEvento(getRootDocument().getElementById('corpo:formulario:botaoAcaoVisualizaDocumento'),'onclick');
	}
}

/*Limpar vinculado e suas propriedades.*/
function limparVinculado(botao, propriedades) {
	var campos = propriedades.split(",");
	for (i = 0; i < campos.length; i++) {
		var campo = document.getElementById(campos[i]);
		campo.value = "";
		if (campos[i].indexOf("lookup_") != -1) {
			var id = campos[i].replace("lookup_", "") + "Limpar";
			ocultaLimparVinculado(id, true);
		}
	}
	ocultaLimparVinculado(botao.id, true);
}
/**
 * Mostra ou Esconde botão Limpar Vinculado.
 */
function mostraOcultaLimparVinculado(id) {
	var botao = document.getElementById(id);
	if (botao != null && botao != undefined) {
		if (botao.style.display == '') {
			botao.style.display = 'none';
		}else {
			botao.style.display = '';
		}
		alterouVinculado = false;
		idVinculadoAlterado = "";
	}
}

function ocultaLimparVinculado(id, limparReferencia) {
	var botao = document.getElementById(id);
	if (botao != null && botao != undefined) {
		botao.style.display = 'none';
		if (limparReferencia) {
			limparReferenciaVinculado();
		}
	}
}

function redirecionaPesquisa(campos) {
	var campo = campos.tokenize(",", " ", true);
	var url = "?";
	//adicionando parâmetros da url, inclusive evento=y
	var parametros = window.location.search.substring(1);
	if (parametros != undefined && parametros != "")
		parametros = "&" + parametros;
	var separador = "&seppesqrestful=s";
	if (parametros!= undefined){
		if (parametros.indexOf(separador) != -1){
			var indiceSeparador = parametros.indexOf(separador);
			parametros = parametros.substring(0, indiceSeparador);
		}
		if(parametros.indexOf('evento=y') == -1)
			url = url +"evento=y";
		url = url + parametros + separador;
	}
	for(var i=0; i<campo.length; i++) {
		elemento = document.getElementById("corpo:formulario:"+campo[i]);

		if (elemento==null) {
			continue;
		} else	if (elemento.type=='select-one')	{
			var indice = elemento.selectedIndex;
			if (indice>0) {
				//url=url+"&"+campo[i]+"="+escape(elemento.options[indice].getAttribute('chPlc'));
				valorIndice = parseInt(elemento.options[indice].value)+1;
				url=url+"&"+campo[i]+"="+escape(valorIndice);
			}
		} else if (elemento.tagName=='SPAN') {
			var indice = 0;
			while(document.getElementById("corpo:formulario:"+campo[i]+":_"+indice) != undefined ) {
				if (document.getElementById("corpo:formulario:"+campo[i]+":_"+indice).checked) {
					url=url+"&"+campo[i]+"="+escape(document.getElementById("corpo:formulario:"+campo[i]+":_"+indice).getAttribute('chPlc'));	
				} 
				indice = indice +1;
			}

		} else if (elemento.type=='checkbox') {

			if (elemento.checked) {
				url=url+"&"+campo[i]+"=true";	
			} 

		} else if (elemento!= undefined &&  
				elemento.value!='' && 
				elemento.value!=undefined) {

			url=url+"&"+campo[i]+"="+escape(elemento.value);
		}
	}

	var urlAtual = getRootDocument().location.href;
	if (urlAtual.indexOf("modoJanelaPlc")>-1){
		// Padrão para pegar valor de modoJanelaPlc
		// modoJanelaPlc=([a-zA-Z]*)
		var padrao = new RegExp ("modoJanelaPlc=([a-zA-Z]*)")
		var modoJanela = padrao.exec(urlAtual);
		url=url+"&modoJanelaPlc="+modoJanela[1];
	}

	document.location=url;
	return false;		
}

function mascararCep(campo, evt){
	var elemento = document.getElementsByName("cep"); 
	if(NavYes)
		var tecla = evt.which;
	else
		var tecla = evt.keyCode;
	var vr = campo.value;
	tam = vr.length;

	if ((((tecla) > 95) && ((tecla) < 106)) ||(((tecla) > 47) && ((tecla) < 58))) {
		if(elemento != null)
		{

			if (tam == 5){
				campo.value = vr.substr(0, 5 ) + '-' + vr.substr(5 );
			}
		}
	}
}
function mascararCnpjCpf(campo, evt, tipoDePessoa){
	if(NavYes)
		var tecla = evt.which;
	else
		var tecla = evt.keyCode;
	var vr = campo.value;
	tam = vr.length;
	if ((((tecla) > 95) && ((tecla) < 106)) ||(((tecla) > 47) && ((tecla) < 58))) {
		if(tipoDePessoa == 0 || tipoDePessoa == 2){
			if (tam == 3){
				campo.value = vr.substr(0, 3 ) + '.' + vr.substr(3 );
			}
			if (tam == 7){
				campo.value = vr.substr(0, 7 ) + '.' + vr.substr(7 );
			}
			if (tam == 11){
				campo.value = vr.substr(0, 11 ) + '-' + vr.substr(11 );
			}
			if (tam == 14 || tam == 15){
				campo.value = vr.substr(0, 14 );
				//return validacpf(campo.value);
			}
		}
		if(tipoDePessoa == 1){
			if (tam == 2){
				campo.value = vr.substr(0, 2 ) + '.' + vr.substr(2 );
			}
			if (tam == 6){
				campo.value = vr.substr(0, 6 ) + '.' + vr.substr(6 );
			}
			if (tam == 10){
				campo.value = vr.substr(0, 10 ) + '/' + vr.substr(10 );
			}
			if (tam == 15){
				campo.value = vr.substr(0, 15 ) + '-' + vr.substr(15 );
			}
			if (tam == 18){
				//validacnpj(campo.value);
			}
		}
	}
}

function validarCep(campo, evt){
	var elemento = document.getElementsByName("cep"); 
	var vr = campo.value;
	tam = vr.length;
	if(elemento != null){
		if(tam !=9){
			alert("CEP inv\u00E1lido. \nFORMATO CORRETO: 99999-999");
			campo.value = "";
		}
	}
}

jQuery(function(){
	if (jQuery('#corpo\\:formulario\\:botaoAcaoGravar').length > 0){
		removeMascaraCampo('#corpo\\:formulario\\:botaoAcaoGravar','#corpo\\:formulario');
	}
});

/*Remover máscara de um campo*/
function removeMascaraCampo (botaoGravar, prefixoElementos){
	jQuery(botaoGravar).mousedown(function(){
		var elements = jQuery(prefixoElementos).attr('elements');
		jQuery.each(elements, function(){
			if (typeof jQuery(this).data('jcompany-submit-unmask') == 'function') {
				jQuery(this).val(jQuery(this).data('jcompany-submit-unmask').call(this));
			}
		});
	});
}

//Reverte configurações de layout para campos focados no evento onbluir
function reverteDestaqueCampoFocado(evt){
	destacaCampoFocado(evt);
}
//L?gica de destaque autom?tico de campos focados
function destacaCampoFocado(evt){
	if(ExpYes){
		evt = window.event;
		obj = evt.srcElement;
	}	
	else{	
		obj = evt.target;
		if(obj.type == 'checkbox' || obj.type == 'radio')
			obj = obj.parentNode;
	}	
	with (obj){
		try	{
			if(evt.type == 'focus' || typeof oldClassName == "undefined" || oldClassName == null){
				if(className != "adicionaBorda"){
					oldClassName = className;
					if(obj.type && type.indexOf("select") > -1)
						jQuery(obj).addClass("adicionaFundo");
					else	
						jQuery(obj).addClass("adicionaBorda");
				}	
			}else {
				className = oldClassName;
				oldClassName = null;
			}
		}catch(e){}
	}
	if(	evt.type == 'focus')
		eventoTrataonfocus(evt, obj);
	else if (	evt.type == 'blur')
		eventoTrataonblur(evt, obj);
}

//plc.geral.navigation.js

//Navega proxima aba
function tabFolderNavegaProx(evt){
	tabFolderNavegaAutomatico(evt,1)
}
//Navega aba anterior
function tabFolderNavegaAnte(evt){
	tabFolderNavegaAutomatico(evt,-1)
}
//L?gicas gen?ricas na navegação autom?tica de tab folder
function tabFolderNavegaAutomatico(evt,nav){

	if(tabFolderNavegaInibe(evt, nav))
		return;
	if (typeof tabSelecionada != 'undefined') 
		tabFolderNavegaTrocaAba(nav)
}

//L?gicas gen?ricas para troca de aba na navegação autom?tica de tab folder
function tabFolderNavegaTrocaAba(nav){
	var nomeAbaAtual	= tabSelecionada.substring(0,tabSelecionada.indexOf("_"));
	var numAbaAtual	= tabSelecionada.substring(tabSelecionada.indexOf("_")+1);
	var numNavAba	= (parseInt(numAbaAtual) + parseInt(nav));
	if(numNavAba < 0) 
		numNavAba = 0;
	if(numNavAba < layers.length){
		trocaAba(numNavAba,nomeAbaAtual +"_"+numNavAba,nomeAbaAtual +"_"+numNavAba );
		tabFolderFocaCampo(numNavAba)		
	}
}

//Verifica se tecla pressionada permite navegação autom?tica em tab folder
function tabFolderNavegaInibe(evt, nav){
	var key = 0;
	if (ExpYes){
		evt = window.event;
		key = evt.keyCode
	}else{
		key = evt.which;
	}	
	return key != 9 || (nav == -1 && !evt.shiftKey) || (nav == 1 && evt.shiftKey);	
}

var tabFolderCamposIda 			= "";
var tabFolderCamposVolta 		= "";
var tabFolderCamposFoco 		= null;
function setTabFolderCamposIda(campos){
	tabFolderCamposIda = campos;
}
function setTabFolderCamposVolta(campos){
	tabFolderCamposVolta = campos;
}
function setTabFolderCamposFoco(campos){
	tabFolderCamposFoco = campos.split(",");
}

//Configura eventos onkeydown para marcar campo focado para l?gicas de navegação em tab folder via onblur
function configuraEventosTabFolder(){
	var camposIda 		= tabFolderCamposIda.split(",");
	var camposVolta 	= tabFolderCamposVolta.split(",");
	var cacheCamposIda	= new Array();
	var cacheCamposVolta= new Array();
	var campo		= null;
	var detalhes		= null;
	//Configura campos ida
	for(ci = 0; ci < camposIda.length; ci++){
		campo = null;
		/*if(camposIda[ci] && camposIda[ci].indexOf(".") > -1){
				detalhes = getCamposDetalhes(camposIda[ci]);
				campo = detalhes.ultimo;
			}	
			else*/
		campo = getCampo(camposIda[ci]);
		if(campo && campo != null){
			setUpOnEventoTagCampoNome (campo.tagName, "onkeydown", "tabFolderNavegaProx", campo.name);
			cacheCamposIda.push(campo);
		}
	}
	setVarGlobal("cacheCamposIda",cacheCamposIda);
	//Configura campos volta
	for(cv = 0; cv < camposVolta.length; cv++){
		campo = null;
		campo = getCampo(camposVolta[cv]);
		if(campo && campo != null){
			setUpOnEventoTagCampoNome (campo.tagName, "onkeydown", "tabFolderNavegaAnte", campo.name)
			cacheCamposVolta.push(campo);
		}
	}
	setVarGlobal("cacheCamposVolta",cacheCamposVolta);	
}

//plc.geral.navigation.js

//Executa navegação autom?tica com pressionamento de seta para cima
function navegaSetaParaCima(){
//	Verificar se inibe navegação
	if(navegaSetaInibe())
		return;
//	Navegação no menu de sistema
	if(plcGeral.MENU_ATIVO){
		menuSistemaNavSetaParaCima();
		return;
	}	
//	Verifica se linha de seleção foi selecionada para navegação
	if(getVarGlobal("trSelecao") == null)
		return;
	var numLinha = "undefined";
	var padrao = new RegExp("corpo\\:(\\w+)\\:(\\d+)\\:(\\w+)");
	if (getVarGlobal ("trSelecaoIdIter") == null){
		var primeiraLinha = new RegExp("corpo\\:(\\w+)\\:0:(\\w+)");
		if (primeiraLinha.exec(document.documentElement.innerHTML) != null){
//			Registrar tokens da primeira linha
			var padraoPrimeiraLinha = primeiraLinha.exec(document.documentElement.innerHTML);
			setVarGlobal("trSelecaoIdIter", padraoPrimeiraLinha[1]);
			setVarGlobal("trSelecaoLinhaSel", padraoPrimeiraLinha[2]);
		}
	}
	var linhaSelecao = getVarGlobal("trSelecao");
	if (linhaSelecao != null && linhaSelecao != "undefined"){
		var recebePadrao = padrao.exec(linhaSelecao.id);
		numLinha = recebePadrao[2];
	} else {
		numLinha = -1;
		/*getVarGlobal("trSelecao") == null || getVarGlobal("trSelecao") == "undefined" ? -1 : getVarGlobal("trSelecao").id
.substring(21,getVarGlobal("trSelecao").id.lastIndexOf(":linhaSel"));*/
	}
	navegaListaSelecao(parseInt(numLinha)-1);
}
//Executa navegação autom?tica com pressionamento de seta para baixo
function navegaSetaParaBaixo(){

//	Verificar se inibe navegação
	if(navegaSetaInibe())
		return;
//	Navegação no menu de sistema
	if(plcGeral.MENU_ATIVO){
		menuSistemaNavSetaParaBaixo();
		return;
	}
//	Abrir janela popup
	if(navegaSetaPopup())
		return;
	var evt = getVarGlobal("event");
	if(typeof evt != "undefined"){
		var elemento = ""; 
		try{
			elemento = plcEvento.getEventoElemento(evt);
		}catch(e){}	
		if(elemento && elemento.id == "LINK_INTELIGENTE")
			dispararEvento(elemento, "onclick");
	}	

	var numLinha = "undefined";
	var padrao = new RegExp("corpo\\:(\\w+)\\:(\\d+)\\:(\\w+)");
	if (getVarGlobal ("trSelecaoIdIter") == null){
		var primeiraLinha = new RegExp("corpo\\:(\\w+)\\:0:(\\w+)");
		if (primeiraLinha.exec(document.documentElement.innerHTML) != null){
//			Registrar tokens da primeira linha
			var padraoPrimeiraLinha = primeiraLinha.exec(document.documentElement.innerHTML);
			setVarGlobal("trSelecaoIdIter", padraoPrimeiraLinha[1]);
			setVarGlobal("trSelecaoLinhaSel", padraoPrimeiraLinha[2]);
		}
	}
	var linhaSelecao = getVarGlobal("trSelecao");
	if (linhaSelecao != null && linhaSelecao != "undefined"){
		var recebePadrao = padrao.exec(linhaSelecao.id);
		numLinha = recebePadrao[2];
	} else {
		numLinha = -1;
		/*getVarGlobal("trSelecao") == null || getVarGlobal("trSelecao") == "undefined" ? -1 : getVarGlobal("trSelecao").id
.substring(21,getVarGlobal("trSelecao").id.lastIndexOf(":linhaSel"));*/
	}
	navegaListaSelecao(parseInt(numLinha)+1);
}	

function navegaSetaParaDireita(){
//	var evt = getVarGlobal("event");
	tabFolderNavegaSetaDireita()		
}
function navegaSetaParaEsquerda(){
//	var evt = getVarGlobal("event");
	tabFolderNavegaSetaEsquerda()
}

//Funções para navegação espec?ficas em tabfolder para extensão no cliente
//PlcNavegacao.prototype.tabFolderNavegaSetaDireitaEspecifico = function() {}
//PlcNavegacao.prototype.tabFolderNavegaSetaEsquerda = function() {}

function tabFolderNavegaSetaDireita(){
	tabFolderNavegaTrocaAba(1)
}
function tabFolderNavegaSetaEsquerda(){
	tabFolderNavegaTrocaAba(-1)
}

function navegaSetaInibe(){

	var evt = getVarGlobal("event");
	var elemento = null;
	if(typeof evt != "undefined"){ 
		try{
			elemento = plcEvento.getEventoElemento(evt);
		}catch(e){}	
		if(elemento && elemento.type && (elemento.type.indexOf("select") >= 0 || elemento.type == 'textarea'))
			return true;
	}	
	return false;	
}	

var idElementoPopupPlc = "";
function setIdElementoPopupPlc(id){
	idElementoPopupPlc = id;
}
function getIdElementoPopupPlc(){
	return idElementoPopupPlc;
}

function navegaSetaPopup(){

 	var evt = getVarGlobal("event");
	if(getElementoPorId(getIdElementoPopupPlc()+"SelPop")){
		setNavSetaFocoPlc(true);
		setVarGlobal("campoPopupPlc", getElementoPorId(getIdElementoPopupPlc()+"SelPop"));
		setIdElementoPopupPlc("");
		setTimeout("navegaSetaAbrePopup()", 10);
		return true;
	}	
	setIdElementoPopupPlc("");
	return false;	
}	

function navegaSetaAbrePopup(campoPopupPlc){
	if(typeof campoPopupPlc == "undefined"){
		campoPopupPlc = getVarGlobal("campoPopupPlc");
		setVarGlobal("campoPopupPlc", null);
	}	
	if(ExpYes)	
		dispararEvento(campoPopupPlc, "onclick")		
	else{
		campoPopupPlc = campoPopupPlc.getAttribute("onclick");
		if(campoPopupPlc.indexOf("return") > -1)
			campoPopupPlc = campoPopupPlc.substring(0, campoPopupPlc.indexOf("return")) 
		eval(campoPopupPlc);
	}
}

function navegaListaSelecao(linha){
	if(typeof linha == "undefined")
		linha = 0;
	var trSelecao = "undefined";
	var trSelecaoIdIter = getVarGlobal("trSelecaoIdIter");
	var trSelecaoLinhaSel = getVarGlobal("trSelecaoLinhaSel");
	trSelecao = getElementoPorId('corpo:formulario:'+trSelecaoIdIter+':'+linha+':'+trSelecaoLinhaSel);
	var evt = plcEvento.getEventoAtual();
	var evtAux = evt;	
	//Marcar linha atual
	if(trSelecao){	
		if(!evtAux || typeof evtAux.type == "undefined"){
			evtAux = new Object()
			evtAux.type = "mouseover";	
		}		
		marcaSelecao(trSelecao, evtAux);
		evtAux = evt;
		var trTagOut =	 getVarGlobal("trSelecao");
		//Desmarcar linha anterior
		if(trTagOut != null){
			if(!evtAux || typeof evtAux.type == "undefined"){
				evtAux = new	 Object()
				evtAux.type = "mouseout";
			}		
		 	marcaSelecao(trTagOut, evtAux);
		 }	
		setVarGlobal("trSelecao", trSelecao)
	 }
}	

function executarEnter(){
	if(plcGeral.MENU_ATIVO)
		menuSistemaClicar();
	else	
		clicarListaSelecao();
}

var numMenu = null;
var numItem = null;
var numSubItem = null;
function menuSistemaNavega(nMenu, nItem, nSubItem){

	//Temporizador para fechar menu
	if(CloseTmr)
		clearTimeout(CloseTmr);
	CloseTmr = setTimeout('menuSistemaFechar()',DissapearDelay * 2)
	numMenu = parseInt(nMenu);
	numItem = typeof nItem != "undefined" ? parseInt(nItem) : null;
	numSubItem = typeof nSubItem != "undefined" ? parseInt(nSubItem) : null;
	var sufixMenu = numItem != null ? numMenu +"_"+ numItem : numMenu; 
	sufixMenu = numSubItem != null ? numMenu +"_"+ numItem +"_"+ numSubItem : sufixMenu; 
	var menuObj = getElementoPorId("Menu"+sufixMenu);
	if(menuObj){
		setNavSetaFocoPlc(true);
		if((""+sufixMenu).indexOf("_") < 0)
			dispararEvento(menuObj, "onclick");
		else
			dispararEvento(menuObj, "onmouseover");
		setVarGlobal("menuObj", menuObj);
	}
}

function menuSistemaFechar(){
	Init(FrstCntnr);
	IniFlg=0;
	AfterCloseAll();
	ShwFlg=0
}

function menuSistemaClicar(){
	var menuObj = getVarGlobal("menuObj");
	dispararEvento(menuObj, "onclick");
}

function menuSistemaNavSetaParaCima(){
	if(plcGeral.MENU_ATIVO){
		if(numSubItem == null)	
			menuSistemaNavega(numMenu,numItem - 1)
		else	
			menuSistemaNavega(numMenu,numItem, numSubItem - 1)
	}
}
function menuSistemaNavSetaParaBaixo(){
	if(plcGeral.MENU_ATIVO){
		if(numSubItem == null)	
			menuSistemaNavega(numMenu,numItem + 1)
		else	
			menuSistemaNavega(numMenu,numItem, numSubItem + 1)
	}
}

function menuSistemaNavSetaParaDireita(){
	if(plcGeral.MENU_ATIVO){
		if(numSubItem == null)	
			menuSistemaNavega(numMenu,numItem, 1)
	}
}
function menuSistemaNavSetaParaEsquerda(){
	if(plcGeral.MENU_ATIVO){
		if(numSubItem != null)	
			menuSistemaNavega(numMenu,numItem)
	}
}

//Função para foco em campo auxiliar
function setNavSetaFocoPlc(focar){

	if(focar && getElementoPorId("navSetaFocoPlc:inibeFoco"))
		getElementoPorId("navSetaFocoPlc:inibeFoco").focus();
	else{
		if(getVarGlobal("campoFocadoPlc"))
			getVarGlobal("campoFocadoPlc").focus();
	}	
}

/**
 * Seleciona um link inteligente pela tecla 40 (seta para baixo)
 */ 
function selecionaLinkInteligentePorTecla(event,objeto) {
	if (getEvento(event).keyCode==40 && objeto) 
		submeteUrl(objeto.href);
}

//plc.geral.integration.js

/**
* Grava resolução de v?deo do cliente no cookie.
* Essa informação ? utilizada pelo jcpmonitor.
*/
function gravaResolucaoVideo() {
	document.cookie='resolucaoPlc='+screen.width+'x'+screen.height+';';
}
