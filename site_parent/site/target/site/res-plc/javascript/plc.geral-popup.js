
/**
* Função para abrir um janela do tipo POP-UP
* Chamada: <br><dd><code>&lt;a href='#' onclick='janela("url_janela","width","height","props"); return false;'&gt;</code>
* @param url Endere?o para abertura da janela
* @param wa Largura da janela. [String, OP]
* @param ha Altura da janela. [String, OP]
* @param props Propriedades da janela. Informar no lugar de <I>wa</I> e <I>ha</I> que devem ser informados como "" [String, OP]
* @param alvo Inst?ncia para abertura. [String]
* @param max Indica que a janela deve abrir maximizada. [String]
* @param posX posição x onde a janela deve ser criada. [String, OP]
* @param posY posição y onde a janela deve ser criada. [String, OP]
*/
function janela(url,wa,ha,props,alvo,max,posX,posY) {
	var w = 720;
	var h = 350;
	var t = "";
	var p = "";
	var win;

	if ( alvo == null || alvo == "" ){
		alvo = "plcPopup";
	}
	if (arguments[1] && arguments[1] != "" && arguments[1] != "0") //Largura
		w = wa;
	if (arguments[2] && arguments[2] != "" && arguments[2] != "0") //Altura
		h = ha;
	p = "resizable=yes,scrollbars=yes,width="+w+",height="+h;
	if (arguments[3] && arguments[3] != "") //Propriedades
		p = props;
	if (arguments[4] && arguments[4] != "") //Alvo
		t = alvo;

	win = window.open(url,t,p);

	if (arguments[5] && arguments[5] != "" && arguments[5] != "N") //Redimensiona
	{
		//Retirar ap?s resolver problema de privil?gios para Mozilla
		if(!NavYes)
			redimensiona(win);
	} else if (url.indexOf("http") == -1 && (props == "" || ""+props == "undefined")) {
		var posCentro = getPosicaoCentro(w,h,posX, posY);
		try{
			win.moveTo(posCentro.moveCentroX,posCentro.moveCentroY);
		} catch(e) {
		}
	}

	return win;
}

/**
* Função que recupera o correto posicionamento central para uma janela popup
* @param w Largura da janela. [String, OB]
* @param h Altura da janela. [String, OB]
* @param posX posição x onde a janela deve ser criada. [String, OP]
* @param posY posição y onde a janela deve ser criada. [String, OP]
* @return posicaoCentro Objeto com os valores para posicionamento da janela [Object]
*/
function getPosicaoCentro(w,h,posX, posY){

	var moveCentroX 	= 0;
	var moveCentroY 	= 0;

	if( (posX && posX != "") || (posY && posY != "") ) {
		if(posX && posX != "")
			moveCentroX = posX;
		if(posY && posY != "")
			moveCentroY = posY;
	}
	else {
		//Centralizar janela popup
		if(NavYes) {
			moveCentroX 	= window.screenX + ((window.outerWidth - w) / 2);
			moveCentroY 	= window.screenY + ((window.outerHeight - h) / 2);
			//netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			//netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserWrite");
		} else {
			moveCentroX = (screen.availWidth/2);
			moveCentroX = moveCentroX - (w/2);
			moveCentroY = (screen.availHeight/2);
			moveCentroY = moveCentroY - (h/2);
		}
	}

	var posicaoCentro = new Object(moveCentroX, moveCentroY);
	posicaoCentro.moveCentroX 	= moveCentroX;
	posicaoCentro.moveCentroY 	= moveCentroY;
	return posicaoCentro;
}

/**
* Função redimensionar janela para ocupar toda a tela do browser
* @variable win Instancia de uma janela para redimensionamento
* @variable NNav Vari?vel que identifica navegador [String,SYS]
*/
function redimensiona(win) {
	if(NNav) {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserWrite");
		if (win.outerHeight < screen.availHeight || win.outerWidth < screen.availWidth) {
			win.outerHeight = screen.availHeight;
			win.outerWidth = screen.availWidth;
		}
	} else {
		win.resizeTo(screen.availWidth,screen.availHeight);
	}
	win.moveTo(0,0);
}

/**
* JCompany: Devolve os valores selecionados em uma janela de seleção popup.
* Os par?metros devem ser passados para este função aos pares e na seguinte ordem: nome e valor do
* atributo.
* @see recebeSelecao
* @author: Rodrigo Magno - Powerlogic 2003 (c)
*/
function devolveSelecaoPopup(listaValores) {
	// caso seja um Dialog Modal!
	if (typeof dialogOpener != 'undefined') {
		dialogOpener.focaElementoInformado();
		dialogOpener.recebeSelecaoPopup(listaValores);
		dialogClose();
	} else {
		opener.focaElementoInformado();
		opener.recebeSelecaoPopup(listaValores);
		window.close();
	}
}

var devolveSelecao = devolveSelecaoPopup;
var devolveSelecaoModal = devolveSelecaoPopup;

/**
* Devolve a seleção popup com uma possível customização para devolver vários campos
*  Alterado por: Geraldo Matos
*/
function recebeSelecaoPopup(listaValores){
	var campo		= "";
	var nome		= "";
	var idRetorno 	= "";
	var id 			= "";
	var separador	= "";
	// Adicao do delimitador de retorno, em caso dos valores terem ',' contido no valor.
	var retornoArray = registrarCamposRetorno (listaValores , "id,valor", "#", camposRetorno.delimPropsPlc);

	for(i = 0; i < retornoArray.length; i++) {
		idRetorno	= retornoArray[i].id;
		valRetorno	= unescape(retornoArray[i].valor);
		//valRetorno	= retornoArray[i].valor;
		for(j = 0; j < camposRetorno.length; j++) {
			nome		= unescape(camposRetorno[j].nome);
			id			= camposRetorno[j].id;
			separador	= camposRetorno[j].separador;
			if(nome == idRetorno || idRetorno == id) {
				if(setValorCampo(nome, valRetorno, separador)){
					//Marca flag de alteração de dados
					setAlertaAlteracao();
					//
					if (idVinculadoAlterado == "") {
						alterouVinculado = true;
						idVinculadoAlterado = nome;
					}
					if (i > 1) {
						if (nome.indexOf("lookup_") != -1 && valRetorno == "") {
							ocultaLimparVinculado(nome.replace("lookup_", "") + "Limpar", false);
						}
					}
					break;
				}
			}
		}
		plcGeral.aposDevolveSelecaoPopup();
		eval("executarEventoAplicacao('TESTAR_NIVEL')");
	}
}

/*Executar a seleção de dados em janela popup modal*/
function selecaoModal(url, listaCampos, separador, larg, alt, posX, posY, alvo, delimPropsPlc) {
	// Registra os campos de retorno, no escopo da janela que pediu o Modal Window!
	window.camposRetorno = registrarCamposRetorno(listaCampos, "nome,id", separador);
	if (window.camposRetorno) {
		window.camposRetorno.delimPropsPlc = delimPropsPlc;
	}
	// Cria a Janela Modal!
	var dialog = jQuery.plc.janelaModal({
		title: 'Sele&ccedil;&atilde;o'
		,url: url.replace('modal','popup')
	});
}

/*Registrar campos que receberão dados da seleção popup e seus respectivos IDs*/
function registrarCamposRetorno (listaRetorno, props, separador, delimitador) {
	var termosRetorno	= listaRetorno.split(delimitador || ",");
	var propsCampo 		= props.split(",");
	var propsRetorno;
	var arrayRetorno 	= new Array();
	var separadorCampos = listaRetorno.indexOf("#") >= 0 ? "#" : "=";
	for( i = 0; i < termosRetorno.length; i++) {
		propsRetorno 	= termosRetorno[i].split(separadorCampos);
		if (propsRetorno.length > 2) {
			propsRetorno = [propsRetorno[0], termosRetorno[i].substring(termosRetorno[i].indexOf(separadorCampos) + 1)];
		}
		arrayRetorno[i] = new regProps(propsCampo, propsRetorno, separador);
	}
	return arrayRetorno;
}

/*Registra os campos para retorno seleção popup genericamente*/
function regProps(propsCampo, propsRetorno, separador) {
	for(j = 0; j < propsCampo.length; j++)
		eval("this."+propsCampo[j]+" = '"+escape(propsRetorno[j])+"'");
	this.separador = separador;
}

/*Selecionar um agregado pela tecla 40 (seta para baixo).*/ 
function selecionaPorTecla(event,objeto) {
	var idObjeto = objeto.id;
	var botaoSelecao = idObjeto +"Sel";
	if (botaoSelecao.indexOf("lookup_") > -1)
		botaoSelecao = botaoSelecao.replace("lookup_", "");
	if (getEvento(event).keyCode==40) {
		dispararEvento(getElementoPorId(botaoSelecao),'onclick');
		if (idObjeto.indexOf ("lookup_") < 0){
			idObjeto = "lookup_" + idObjeto;	
			getElementoPorId(idObjeto).focus();
		} else {
			getElementoPorId(idObjeto).focus();
		}
	}
}

/**
 * Função para retornar multiplos valores.<b>
 * adiciona o valor no campo registrado para a chave idsPlc e descPlc
 * no idsPlc ser? adicionado os valos do campo com id idsPlc da página de seleção
 * no descPlc ser? adicionado os valos do campo com id descPlc da página de seleção
 */
function retornarMultiSel() {
	var checks 	= getCampo("indExcPlc");	//checkbox
	var idsPlc 	= getCampo("idsPlc");	// ids de todas as linhas
	var descPlc = getCampo("descPlc");	// descrição de todas as linhas

	//se encontrou o objeto
	if(checks){
		if(!checks.length){	//se for apenas 1 check, o javascript trava n?o como array e sim como apenas umc campo
			if (checks.checked){
				opener.setValorCampo(opener.getCampoRetornoById('idsPlc'),idsPlc.value,",");
				opener.setValorCampo(opener.getCampoRetornoById('descPlc'),descPlc.value,"\n");
			}
		}

		//para cada check marcado, seta o valor nos campos. n?o adiciona valores repetidos
		for (var i = 0; i < checks.length; i++){
			var e = checks[i];
			if (e.checked){
				opener.setValorCampo(opener.getCampoRetornoById('idsPlc'),idsPlc[i].value,",");
				opener.setValorCampo(opener.getCampoRetornoById('descPlc'),descPlc[i].value,"\n");
			}
		}

		window.close();
	}
}
