package com.griggy.rest.foursquare;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.plc.site.commons.AppUserProfileVO;
import com.plc.site.entity.Usuario;
import com.powerlogic.jcompany.commons.PlcBaseContextVO;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefaultLiteral;
import com.powerlogic.jcompany.commons.facade.IPlcFacade;
import com.powerlogic.jcompany.commons.util.cdi.PlcCDIUtil;

/**
 * Verifica se o usuario já possui o token do foursquare. Se sim, é porque ele ja foi alguma vez autenticado e 
 * nao precisa mais.
 * Caso contrario tem que chamar o servlet para a autenticacao.
 * @required Parametro 'id'
 * @author Bruno Carneiro
 *
 */
public class FourSquareVerifyServlet extends HttpServlet{
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		
		IPlcFacade facade = PlcCDIUtil.getInstance().getInstanceByType(IPlcFacade.class, QPlcDefaultLiteral.INSTANCE);
		PlcBaseContextVO contextVO = PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE);
		AppUserProfileVO userProfileVO = PlcCDIUtil.getInstance().getInstanceByType(AppUserProfileVO.class, QPlcDefaultLiteral.INSTANCE);
		
		Usuario u = (Usuario) facade.findObject(contextVO, Usuario.class, userProfileVO.getUsuario().getId())[0];
		
		if(u!=null && StringUtils.isNotEmpty(u.getFoursquareId())){
			resp.getWriter().println("{\"response\":true}");
		}
		else{
			resp.getWriter().println("{\"response\":false}");
		}
	}
	  
}