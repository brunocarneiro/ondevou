/*
 * Manter na versão 1.0a2
 */
$( document ).bind( "mobileinit", function( ){
	
	console.log( "mobileinit" );
	
//	$.mobile.addResolutionBreakpoints([1200, 1440]);
	
	// Desabilita o envio de formulario padrao!
	$.mobile.ajaxFormsEnabled = false;
	// Abilita os campos HTML5!
	$.extend( $.mobile.page.prototype.options.degradeInputs, {
		"color": false,
		"date": false,
		"datetime": false,
		"datetime-local": false,
		"email": false,
		"month": false,
		"number": false,
		"range": false,
		"search": false,
		"tel": false,
		"time": false,
		"url": false,
		"week": false
	});
	
	// Criar mecanismo de roteamento do BUS adicionando SANDBOX na execucao de scripts via AJAX.

	$( "[data-role=page]" ).live( "pagebeforecreate", function( event, ui ){
		console.log( "pagebefore-CREATE:" + event.target.id, event, ui );
//		plc.bus.publish( event.target.id + ".initializeForm", message );
		plc.form.initializeForm( event.target );
	});

	$( "[data-role=page]" ).live( "pagecreate", function( event, ui ){
		console.log( "page-CREATE:" + event.target.id, event, ui );
	});

	$( ".ui-page" ).live( "pagebeforeshow", function( event, ui ){
		console.log( "pagebefore-SHOW:" + event.target.id, event, ui );
	});

	$( ".ui-page" ).live( "pageshow", function( event, ui ){
		console.log( "page-SHOW:" + event.target.id, event, ui );
	});

	$( ".ui-page" ).live( "pagehide", function( event, ui ){
		console.log( "page-HIDE:" + event.target.id, event, ui );
	});	
});
