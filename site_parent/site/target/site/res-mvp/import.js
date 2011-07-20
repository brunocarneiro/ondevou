/*
 * Namespace "plc".
 */
var plc = {
	/*
	 * URI da raiz da aplica��o.
	 */
	contextPath: "/"
	/*
	 * Inclui um script, utiliza document.write(), por isso ap�s o carregamento da p�gina, este mecanismo n�o deve ser chamado.
	 */
	,writeScript: function( path ){
		document.write( ["<script type=\"text/javascript\" src=\"",this.contextPath,path,"\"","\"></","script>"].join( "" ) );
	}
	/*
	 * Inclui um link css, utiliza document.write(), por isso ap�s o carregamento da p�gina, este mecanismo n�o deve ser chamado.
	 */
	,writeLink: function( path ){
		document.write( ["<link rel=\"stylesheet\" href=\"",this.contextPath,path,"\"","\"></","link>"].join( "" ) );
	}
}

// Fix para console n�o inicializado
if ( typeof console == "undefined" ) {
	console = { log: function( ){} };
}

// Path da aplica��o.
plc.contextPath = "/epc";

// JS que contem todos os JS e CSS que devem ser carregados.

//Inclui os arquivos CSS!
//plc.writeLink( "/res/plc/css/plc.geral.css" );
//plc.writeLink( "/res/plc/css/icones.css" );

// Inclui os Arquivos JS!
plc.writeScript( "/res-mvp/jquery/jquery-1.5.js" );
plc.writeScript( "/res-mvp/jquery/jquery.json-2.2.js" );
plc.writeScript( "/res-mvp/pagebus/pagebus.js" );
plc.writeScript( "/res-mvp/plc/plc.bus.js" );
plc.writeScript( "/res-mvp/plc/plc.form.js" );
plc.writeScript( "/res-mvp/plc/plc.pubsub.js" );
