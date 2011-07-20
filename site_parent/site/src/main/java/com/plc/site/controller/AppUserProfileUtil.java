/* Jaguar-jCompany Developer Suite. Powerlogic 2010-2014. Please read licensing information or contact Powerlogic 
 * for more information or contribute with this project: suporte@powerlogic.com.br - www.powerlogic.com.br        */ 
package com.plc.site.controller;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.plc.site.commons.AppUserProfileVO;
import com.powerlogic.jcompany.commons.PlcBaseUserProfileVO;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefault;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcUtil;
import com.powerlogic.jcompany.controller.util.PlcBaseUserProfileUtil;

/**
 * site . Implementar aqui l�gicas de perfil do usu�rio da aplica��o (user profiling)
 */
@SPlcUtil
@QPlcDefault
public class AppUserProfileUtil extends PlcBaseUserProfileUtil {
	
	/**
	 * jCompany 6.0: L�gicas de Inicializa��o de Perfil de Usuario
	 * Recebe a requisi��o, o perfil do usu�rio preenchido no ancestral e 
	 * a interface para chamada da persist�ncia.
	 *
	 * Preencher o objeto de Perfil com informa��es espec�ficas, especializando-o
	 * se necess�rio.
	 */
	@Override
	public PlcBaseUserProfileVO registrySpecificProfile(HttpServletRequest request,
			 HttpServletResponse response, PlcBaseUserProfileVO plcPerfilVO) throws Exception {
	
		// Importante transformar o valor de String para Object
		Map<String,Object> m = new HashMap<String,Object>();

		AppUserProfileVO appUsuarioPerfilVO = (AppUserProfileVO) plcPerfilVO;

		// Deve estar ao final da montagem do Map
		appUsuarioPerfilVO.getPlcVerticalSecurity().putAll(m);
		// se usu�rio for Administrador Geral, adicionar essa role no perfil
		if(request.isUserInRole("Administrador Geral Plc")) {
			List<String> grupos = new ArrayList<String>(1);
			grupos.add("Administrador Geral");
			plcPerfilVO.setGroups(grupos);
		}

		// Retorna objeto modificado
		return plcPerfilVO;

		}
}
