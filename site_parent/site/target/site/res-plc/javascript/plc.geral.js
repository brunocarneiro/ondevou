/*
 * Namespace plc.
 */
if (typeof plc == "undefined") {
	plc = {};
}

/*
 * Classe que faz o carregamento dos dados de segurança, e possui metodos de verificação de recursos.
 */
plc.Security = function(){
}

/*
 * Key dos dados de segurança armazenados em sessionStorage.
 */
plc.Security.SESSION_STORAGE_KEY = "plc.security.data";

/*
 * Prototypo da classe plc.Security
 */
plc.Security.prototype = {
	
	securityData: null
	
	,getSecurityData: function( avoidSessionStore ) {
		// Caso ainda não tenha dados, recupera do sessionStorage.
		if ( !this.securityData ) {
			// verifica se o Browser suporta sessionStorage.
			if ( avoidSessionStore !== true && typeof sessionStorage != "undefined" && sessionStorage.length > 0 ) {
				// recupera o dado armazenado no sessionStorage.
				var sessionData = sessionStorage.getItem( plc.Security.SESSION_STORAGE_KEY );
				// o dado esta no formato STRING. faz o parser para JSON.
				if ( sessionData ) {
					this.setSecurityData( sessionData, true /* avoidSessionStore */ );
				}
			}
		}
		return this.securityData;
	}
	
	,setSecurityData: function( data, avoidSessionStore ) {
		
		data = jQuery.trim( data );
		
		if ( data && data.charAt(0) == '{' && data.charAt(data.length - 1) == '}' ) {
			if ( typeof sessionStorage != "undefined" && avoidSessionStore !== true ) {
				// recupera o dado armazenado no sessionStorage.
				sessionStorage.setItem( plc.Security.SESSION_STORAGE_KEY, data );
			}
			this.securityData = jQuery.parseJSON( data ).security || null;
		} else {
			this.securityData = null;
		}
		// cria os filtros de URL.
		if ( this.securityData ) {
			this.createPathsAndFilters( );
		}
	}
	
	,getCurrentSession: function(){
		return jQuery.cookie("JSESSIONID");
	}
	
	,load: function( callback ){
		// recupera os dados e a sessão atual.
		var securityData = this.getSecurityData();
		var currentSession = this.getCurrentSession();
		// TODO: Checar dados do sessionStore
		// faz a checagem se a sessão do usuário não mudou.
		if ( securityData && securityData.session == currentSession ) {
			if ( typeof callback == "function" ) {
				callback( this );
			}
		} else {
			// dispara a função ajax que recupera os dados.
			jQuery.ajax({
				url: plcGeral.contextPath + "/soa/service/security"
				,type: "GET"
				,dataType: "text"
				,context: this
				,success: function( text ) {
					this.setSecurityData( text );
				}
				,error: function( text ) {
					// em caso de erro, não recupera a sessão novamente, mas não persiste os dados!
					this.securityData = { session: currentSession };
				}
				,complete: function( ) {
					if ( typeof callback == "function" ) {
						callback( this );
					}
				}
			});
		}
	}
	
	,getSegments: function( url ) {
		var index = url.indexOf( plcGeral.contextPath );
		if ( index != -1 ) {
			url = url.substring( index + plcGeral.contextPath.length );
		}
		var path = [];
		var split = url.split("/");
		for ( var i = 0; i < split.length; i++ ) {
			var p = $.trim( split[i] );
			if ( p ) {
				path.push( p );
			}
		}
		return path;
	}
	
	,createPathsAndFilters: function( ){
		var resources = this.securityData.resources;
		// uri tratados.
		var paths = null;
		var filters = null;
		// extrai dos recursos, as URLs que são filtros ou fixas.
		for ( var uri in resources ) {
			var path = this.getSegments( uri );
			if ( uri.indexOf("*") != -1 ) {
				if ( !filters ) {
					filters = {};
				}
				// Trata o coringa do Filter!
				for ( var p = 0; p < path.length; p++ ) {
					var ps = path[p];
					if ( ps != '*' && ps.indexOf('*') != -1 ) {
						path[p] = new RegExp( ps.replace(/\*/g, '.*') );
					}
				}
				filters[ uri ] = path;
			} else {
				if ( !paths ) {
					paths = {};
				}
				paths[ path.join("/") ] = uri;
			}
		}
		// adiciona caminhos e filtros.
		this.securityData.paths = paths;
		this.securityData.filters = filters;
	}
	
	,matchFilter: function( filter, path ) {
		for ( var f = 0, p = 0; f < filter.length && p < path.length; f++, p++ ) {
			var fs = filter[f], ps = path[p];
			if ( fs == '*' ) {
				break;
			} else if ( fs == ps ) {
				continue;
			} else if ( fs.test && fs.test( ps ) ) {
				continue;
			}
			return false;
		}
		return true;
	}
	
	,findPath: function( url ) {
		var path = this.getSegments( url );
		if ( this.securityData && this.securityData.paths ) {
			// Busca pelas URLS até achar um nivel que permita.
			var resource = this.securityData.paths[ path.join("/") ];
			if ( resource ) {
				return this.securityData.resources[ resource ];
			} else {
				resource = this.securityData.paths[ path.join("f/n/") ];
				if ( resource ) {
					return this.securityData.resources[ resource ];
				}
			}
		}
		return null;
	}
	
	,findFilter: function( url ) {
		var path = this.getSegments( url );
		if ( this.securityData && this.securityData.filters ) {
			// Busca pelas URLS até achar um nivel que permita.
			var filters = this.securityData.filters;
			for ( var f in filters ) {
				if ( this.matchFilter( filters[f], path ) ) {
					return this.securityData.resources[ f ];
				}
			}
		}
		return null;
	}
	
	,findResource: function( url ) {
		var resource = this.findPath( url );
		if ( resource == null ) {
			resource = this.findFilter( url );
		}
		return resource;
	}
	
	,findEvents: function(url) {
		var resource = this.findResource(url);
		return resource && resource.events ? resource.events : null;
	}
	
	,isValidUrl: function(url) {
		var resource = this.findResource(url);
		if (resource == false || resource == 'false') {
			return false;
		}
		return true;
	}
	
	,isValidTab: function(url, tab) {
		return this.isValidEvent( url, 'aba#' + tab );
	}
	
	,isValidEvent: function(url, event) {
		var events = this.findEvents(url);
		if (events && events.indexOf(event) != -1) {
			return false;
		}
		return true;
	}
};

/*
 * Utiliza uma instância unica para a pagina, para checagem de segurança.
 */
plc.Security.load = function( callback ) {
	var instance = this.instance;
	if (!instance) {
		this.instance = instance = new this();
	}
	instance.load( callback );
}
