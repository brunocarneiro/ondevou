/*
Copyright (c) 2007-2009, Yusuke Yamamoto
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the Yusuke Yamamoto nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY Yusuke Yamamoto ``AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Yusuke Yamamoto BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
package com.plc.site.controller.servlet;

import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.auth.AccessToken;
import twitter4j.auth.RequestToken;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.plc.site.commons.AppUserProfileVO;
import com.plc.site.entity.Usuario;
import com.plc.site.entity.UsuarioFacebook;
import com.plc.site.entity.UsuarioTwitter;
import com.plc.site.facade.IAppFacade;
import com.powerlogic.jcompany.commons.PlcBaseContextVO;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefaultLiteral;
import com.powerlogic.jcompany.commons.util.cdi.PlcCDIUtil;

import java.io.IOException;
import java.util.List;

public class CallbackServlet extends HttpServlet {
	
    private static final long serialVersionUID = 1657390011452788111L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    	// Busca pelo profile na sessão
    	AppUserProfileVO appUserProfile = PlcCDIUtil.getInstance().getInstanceByType(AppUserProfileVO.class, QPlcDefaultLiteral.INSTANCE);
    	
    	// Token e AccessToken utilizados para cumunicação
    	String token = "";
    	String accessToken = "";
    	
    	IAppFacade facade = PlcCDIUtil.getInstance().getInstanceByType(IAppFacade.class, QPlcDefaultLiteral.INSTANCE);
    	PlcBaseContextVO contextVO = PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE);
    	
    	// Instancia do Twitter com as informações da Aplicação
    	Twitter twitter = new TwitterFactory().getInstance();
    	
    	// Verifica se o Usuário do Profile já tem acesso ao Twitter

    	// Caso não tenha, ele faz o OAuth para autenticar e autorizar 
    	
    	if(appUserProfile.getUsuario() == null) {
    		// Não está logado
    		
    	} else if(appUserProfile.getUsuario().getUsuarioTwitter() != null) { 
    		
    		if(StringUtils.isBlank(appUserProfile.getUsuario().getUsuarioTwitter().getToken()) && StringUtils.isBlank(appUserProfile.getUsuario().getUsuarioTwitter().getTokenSecret()) ) {
    			// Logado no site, mas sem token do Twitter
    			RequestToken requestToken = (RequestToken) request.getSession().getAttribute("requestToken");
    			String verifier = request.getParameter("oauth_verifier");
    			try {

    			    twitter.getOAuthAccessToken(requestToken, verifier);
    			    request.getSession().removeAttribute("requestToken");
    			    token 		= twitter.getOAuthAccessToken().getToken();
    			    accessToken	= twitter.getOAuthAccessToken().getTokenSecret();
    			    
    			} catch (TwitterException e) {
    			    throw new ServletException(e);
    			}
    			
    			saveUserFacebook(appUserProfile, token, accessToken, facade, contextVO);
    			
    		} else {
    			// Logado no site e com token para acesso...
    			token 		= appUserProfile.getUsuario().getUsuarioTwitter().getToken();
    			accessToken	= appUserProfile.getUsuario().getUsuarioTwitter().getTokenSecret();
				try {
					System.out.println("");
					twitter.setOAuthAccessToken(new AccessToken(token, accessToken));
				} catch (Exception e1) {
					e1.printStackTrace();
				}
				
				if(!twitter.getAuthorization().isEnabled()) {
					// Logado no site mas com token para acesso inválido...
					String verifier = request.getParameter("oauth_verifier");
					RequestToken requestToken = (RequestToken) request.getSession().getAttribute("requestToken");
					try {
						//TODO: verificar se necessita mesmo ser o twitter derivado do login...
						twitter = (Twitter) request.getSession().getAttribute("twitter");
						twitter.getOAuthAccessToken(requestToken, verifier);
					} catch (TwitterException e) {
						throw new ServletException(e);
					}
					request.getSession().removeAttribute("requestToken");     
					saveUserFacebook(appUserProfile, token, accessToken, facade, contextVO);
				}
				request.getSession().setAttribute("twitter", twitter);
				response.sendRedirect(request.getContextPath() + "/");
    		}
    	}
        
        
        
    }

	private void saveUserFacebook(AppUserProfileVO appUserProfile, String token, String accessToken, IAppFacade facade, PlcBaseContextVO contextVO) {
		UsuarioFacebook usuarioFacebook = appUserProfile.getUsuario().getUsuarioFacebook();
		
		List<Usuario> listaRetorno = facade.findByField(contextVO, Usuario.class, "querySelFacebook", usuarioFacebook.getIdFacebook());
		Usuario usuario = null;
		if (listaRetorno != null && listaRetorno.size() >= 1) {
			usuario = listaRetorno.get(0); 
		}
		UsuarioTwitter usuarioTwitter = usuario.getUsuarioTwitter();
		
		usuarioTwitter.setToken(token);
		usuarioTwitter.setTokenSecret(accessToken);
		usuario.getUsuarioTwitter().setToken(token);
		usuario.getUsuarioTwitter().setTokenSecret(accessToken);
		contextVO.setMode(PlcBaseContextVO.Mode.ALTERACAO);
		facade.saveObject(contextVO, usuario);
	}
}
