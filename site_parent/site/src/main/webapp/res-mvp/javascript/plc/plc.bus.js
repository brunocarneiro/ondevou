// Wrapper do PageBus!
plc.bus = (function(){

	var publish = function( type ) {
		PageBus.publish.apply(PageBus, arguments);
	};
	var subscribe = function( ) {
		if ( arguments.length == 2 ) {
			return PageBus.subscribe.call( PageBus, arguments[0], null, arguments[1] );
		} else {
			return PageBus.subscribe.apply( PageBus, arguments );
		}
	};
	var unsubscribe = function( ) {
		PageBus.unsubscribe.apply( PageBus, arguments );
	};

	return {
		// OpenAjax pattern.
		publish: publish
		,subscribe: subscribe
		,unsubscribe: unsubscribe
		// jQuery pattern.
		,trigger: publish
		,on: subscribe
		,off: unsubscribe
	};

})();
