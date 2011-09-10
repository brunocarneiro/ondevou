package com.griggy.rest.foursquare;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.plc.site.commons.AppUserProfileVO;
import com.plc.site.entity.Usuario;
import com.powerlogic.jcompany.commons.PlcBaseContextVO;
import com.powerlogic.jcompany.commons.PlcBaseContextVO.Mode;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefaultLiteral;
import com.powerlogic.jcompany.commons.facade.IPlcFacade;
import com.powerlogic.jcompany.commons.util.cdi.PlcCDIUtil;

import fi.foyt.foursquare.api.FoursquareApi;

/**
 * Autentica um usuario e salva o OAuthToken na entidade.
 * @author Bruno Carneiro
 *
 */
public class FourSquareAuthenticationServlet extends HttpServlet{
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		IPlcFacade facade = PlcCDIUtil.getInstance().getInstanceByType(IPlcFacade.class, QPlcDefaultLiteral.INSTANCE);
		PlcBaseContextVO contextVO = PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE);
		Usuario u;
		//TODO COLOCAR ISSO EM APPLICATION SCOPE
		FoursquareApi foursquareApi = new FoursquareApi("4BNX2IEMCJ2YJLLJQAZTZKOAD1B05KXDSSNHOGAQ4PCW31XW", "N1GINQDOQ3LRCBGYNK5EL2CZX1KUBIWQFG3MNQXXZUWN4YAV", "http://localhost:8080/site/foursquare/auth");
		try {
			String code = req.getParameter("code");
			if (code == null) {
				AppUserProfileVO userProfile = PlcCDIUtil.getInstance().getInstanceByType(AppUserProfileVO.class, QPlcDefaultLiteral.INSTANCE);
				u = userProfile.getUsuario();
				req.getSession().setAttribute("usuario", u);
				// First we need to redirect our user to authentication page.
				resp.sendRedirect(foursquareApi.getAuthenticationUrl());
			} else {
				u=(Usuario) req.getSession().getAttribute("usuario");
				// finally we need to authenticate that authorization code
				foursquareApi.authenticateCode(code);
				// ... and voilà we have a authenticated Foursquare client
				
				//Obtendo o token oauth para ser salvo e nao precisar chamar de novo.
				u.setFoursquareId(foursquareApi.getOAuthToken());
				//TODO BRUNO deve recuperar pela queryselLookup, sem puxar detalhes, nao carece
				u.setLugarUsuario(null);
				u.setAmizade(null);
				u.setAgendaDia(null);
				u.setUsuarioUltAlteracao("app_foursquare_integration");
				contextVO.setMode(Mode.ALTERACAO);
				facade.saveObject(contextVO, u);
				resp.sendRedirect("http://localhost:8080/site/#foursquare");
				//TODO IGOR Utilizar usuario da sessao
			}

		} catch (Exception e) {
			resp.getWriter().println("{\"response\":\"false\",\"message\":\""+e.getMessage()+"\"}");
		}
	}
	  
}