
/* Configura��es de vari�veis */
var NNav 		= ((navigator.appName == "Netscape"));
var AgntUsr	= navigator.userAgent.toLowerCase();
var AppVer	= navigator.appVersion.toLowerCase();
var DomYes	= document.getElementById ? 1:0;
var NavYes	= AgntUsr.indexOf('mozilla') != -1 && AgntUsr.indexOf('compatible') == -1 ? 1:0;
var ExpYes	= AgntUsr.indexOf('msie') != -1 ? 1:0;
var Opr		= AgntUsr.indexOf('opera')!= -1 ? 1:0;
var alterouVinculado 	= false;
var idVinculadoAlterado = "";

//Construtor para objeto PlcGeral
function PlcGeral(){}
//Vari�vel de instancia do objeto PlcGeral
var plcGeral = new PlcGeral();
plcGeral.exibeAlertaAlteracao = true;
//Configura context path dinamicamento no objeto plcGeral
if (typeof setContextPath == 'function') setContextPath();
/** Fun��o para permitir utiliza��o do evento onload por diversos scripts */
PlcGeral.prototype.eventOnLoad = function(){}
/** Vari�vel que contem o contexto da aplica��o */
PlcGeral.prototype.contextPath = "";
/** Mensagem de erro para obrigat�rios */
PlcGeral.prototype.obrigatorioMsg = "";
/** Express�o regular para valores alfab�ticos (sem n�meros) */
PlcGeral.prototype.alfabeticoPattern = /^[^0-9]+$/;
/** Express�o regular para valores num�ricos */
PlcGeral.prototype.numericoPattern =  /\d/;
/** Express�o regular para valores monetarios */
PlcGeral.prototype.currencyPattern =  /[][,]{1}\d{2}/;
/** Express�o regular para data */
PlcGeral.prototype.dataPattern =  /\d{2}\/\d{2}\/\d{4}/;
/** Express�o regular para data/hora */
PlcGeral.prototype.datahoraPattern =  /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/;
//Indica se menu de sistema est? ativo para navega��o via setas
PlcGeral.prototype.MENU_ATIVO = false;

/** Fun��o que  executada apos devolu��o de sele��o popup */
//TODO Mover para arquivo plc.geral.popup.js
PlcGeral.prototype.aposDevolveSelecaoPopup = function() {
	if (alterouVinculado) {
		mostraLimparVinculado(idVinculadoAlterado + "Limpar");
	}
};

/**
* Fun��o utilizada para exporta��o de Registros da Pesquisa.
* Esta fun��o abre uma Janela e faz a requisi��o no servidor para montar a exporta��o de acordo com o 'formato' escolhido.
*
* Chama o Servlet de exporta��o 'PlcExportaJsfcaoServlet' que recupera da Conversa��o a lista de registros da sele��o, 
* evitando refazer a pesquisa.
* @autor Pedro Henrique 
*/	
//TODO Mover para arquivo plc.geral.form.js
PlcGeral.prototype.exportaPopup = function(contextoAplicacao,plcURLComBarra,isRequestJSF){

	var campoExportaPlc 	= getCampo("exportaPlc");
	var parentForm 			= getForm();
	var metodo				= 'post'; 

	var win 		= janela("");
	var action 		= "";
	var	conteudo  	= '<html><body> <form name="inicialForm" method="post" action="'+ contextoAplicacao +  plcURLComBarra ;
	//metodo = 'get'; caso queira utilizar get 
	/**
	* Com JSF chama o Servlet de exporta��o 'PlcExportaJsfcaoServlet' que recupera da Conversa��o a lista de registros da sele��o, 
	* evitando refazer a pesquisa.
	*/
	if (isRequestJSF == 'S'){
		var conversationIdPlc = getCampo('corpo:formulario:conversationIdPlc');
	 	action = contextoAplicacao + '/exportacaojsf">';
	 	if (typeof conversationIdPlc != "undefined")
			action +=  ' <input type="hidden" name="conversationIdPlc" value="' + conversationIdPlc.value +'" id="conversationIdPlc" >';
		action +=  ' <input type="hidden" name="action" value="' + plcURLComBarra +'" id="action" >';
	 	if (typeof campoExportaPlc != "undefined")
			action +=  ' <input type="hidden" name="fmtPlc" value="' + campoExportaPlc.value +'" id="fmtPlc" >';
	} 
	// montando o conte�do da p�gina
	var	conteudo  	= '<html><body> <form name="inicialForm" method="' +metodo+ '" action="'+ action + '</form> </body></html>';
	win.document.write(conteudo);
	var theForm 			= getForm();  
	theForm.style.display 	= 'none';
	theForm.submit();
	// Voltando com a sele��o do campo de exporta��o para a primeira Op��o  [Exportar para ...]
	if(campoExportaPlc) {campoExportaPlc.selectedIndex = 0;}
}

//TODO Mover para arquivo plc.geral.form.js
PlcGeral.prototype.formSubmit = function(action,evento){
	// N�o retirar o timeout porque deve esperar a fun��o TrocaAba ser executada
	setTimeout("document.getElementById('corpo:formulario:botaoAcaoRecuperaPorDemanda').click()",100);
}


/* DEPRACATED*/
//TODO Remover ap�s acertos javascript.
function iniciarPagina() {}
