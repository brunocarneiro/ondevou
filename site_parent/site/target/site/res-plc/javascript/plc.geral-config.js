
/* Configurações de variáveis */
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
//Variável de instancia do objeto PlcGeral
var plcGeral = new PlcGeral();
plcGeral.exibeAlertaAlteracao = true;
//Configura context path dinamicamento no objeto plcGeral
if (typeof setContextPath == 'function') setContextPath();
/** Função para permitir utilização do evento onload por diversos scripts */
PlcGeral.prototype.eventOnLoad = function(){}
/** Variável que contem o contexto da aplicação */
PlcGeral.prototype.contextPath = "";
/** Mensagem de erro para obrigatórios */
PlcGeral.prototype.obrigatorioMsg = "";
/** Expressão regular para valores alfabéticos (sem números) */
PlcGeral.prototype.alfabeticoPattern = /^[^0-9]+$/;
/** Expressão regular para valores numéricos */
PlcGeral.prototype.numericoPattern =  /\d/;
/** Expressão regular para valores monetarios */
PlcGeral.prototype.currencyPattern =  /[][,]{1}\d{2}/;
/** Expressão regular para data */
PlcGeral.prototype.dataPattern =  /\d{2}\/\d{2}\/\d{4}/;
/** Expressão regular para data/hora */
PlcGeral.prototype.datahoraPattern =  /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/;
//Indica se menu de sistema est? ativo para navegação via setas
PlcGeral.prototype.MENU_ATIVO = false;

/** Função que  executada apos devolução de seleção popup */
//TODO Mover para arquivo plc.geral.popup.js
PlcGeral.prototype.aposDevolveSelecaoPopup = function() {
	if (alterouVinculado) {
		mostraLimparVinculado(idVinculadoAlterado + "Limpar");
	}
};

/**
* Função utilizada para exportação de Registros da Pesquisa.
* Esta função abre uma Janela e faz a requisição no servidor para montar a exportação de acordo com o 'formato' escolhido.
*
* Chama o Servlet de exportação 'PlcExportaJsfcaoServlet' que recupera da Conversação a lista de registros da seleção, 
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
	* Com JSF chama o Servlet de exportação 'PlcExportaJsfcaoServlet' que recupera da Conversação a lista de registros da seleção, 
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
	// montando o conteúdo da página
	var	conteudo  	= '<html><body> <form name="inicialForm" method="' +metodo+ '" action="'+ action + '</form> </body></html>';
	win.document.write(conteudo);
	var theForm 			= getForm();  
	theForm.style.display 	= 'none';
	theForm.submit();
	// Voltando com a seleção do campo de exportação para a primeira Opção  [Exportar para ...]
	if(campoExportaPlc) {campoExportaPlc.selectedIndex = 0;}
}

//TODO Mover para arquivo plc.geral.form.js
PlcGeral.prototype.formSubmit = function(action,evento){
	// Não retirar o timeout porque deve esperar a função TrocaAba ser executada
	setTimeout("document.getElementById('corpo:formulario:botaoAcaoRecuperaPorDemanda').click()",100);
}


/* DEPRACATED*/
//TODO Remover após acertos javascript.
function iniciarPagina() {}
