package com.plc.site.controller.filter;


import java.io.IOException;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.auth.AccessToken;
import twitter4j.auth.RequestToken;

import com.plc.site.commons.AppUserProfileVO;
import com.plc.site.entity.Usuario;
import com.plc.site.entity.UsuarioFacebook;
import com.plc.site.entity.UsuarioTwitter;
import com.plc.site.facade.IAppFacade;
import com.powerlogic.jcompany.commons.PlcBaseContextVO;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefaultLiteral;
import com.powerlogic.jcompany.commons.util.cdi.PlcCDIUtil;



/**
 * The Facebook User Filter ensures that a Facebook client that pertains to the
 * logged in user is available in the session object named
 * "facebook.user.client".
 * 
 * The session ID is stored as "facebook.user.session". It's important to get
 * the session ID only when the application actually needs it. The user has to
 * authorise to give the application a session key.
 * 
 * @author Dave
 */
public class TwitterUserFilter implements Filter {

	private static final Logger logger = LoggerFactory.getLogger(TwitterUserFilter.class);
	
	public void init(FilterConfig filterConfig) throws ServletException {

		 
	}
	
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
		
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        
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
    		filterChain.doFilter(request, response);
    		
    	} else if(appUserProfile.getUsuario().getUsuarioTwitter() != null) { 
    		
    		if(StringUtils.isBlank(appUserProfile.getUsuario().getUsuarioTwitter().getToken()) && StringUtils.isBlank(appUserProfile.getUsuario().getUsuarioTwitter().getTokenSecret()) ) {
    			// Logado no site, mas sem token do Twitter
    			RequestToken requestToken = (RequestToken) req.getSession().getAttribute("requestToken");
    			String verifier = request.getParameter("oauth_verifier");
    			
    			if(requestToken == null && StringUtils.isBlank(verifier)) {
    	            StringBuffer callbackURL = req.getRequestURL();
    	            int index = callbackURL.lastIndexOf("/");
    	            callbackURL.replace(index, callbackURL.length(), "").append("/callback");
    	
    	            try {
						requestToken = twitter.getOAuthRequestToken(callbackURL.toString());
					} catch (TwitterException e) {
						e.printStackTrace();
					}
					
    	            req.getSession().setAttribute("requestToken", requestToken);
    	            res.sendRedirect(requestToken.getAuthenticationURL());
    			} else {
    				
    			}
    			try {

    			    twitter.getOAuthAccessToken(requestToken, verifier);
    			    req.getSession().removeAttribute("requestToken");
    			    token 		= twitter.getOAuthAccessToken().getToken();
    			    accessToken	= twitter.getOAuthAccessToken().getTokenSecret();
    			    
    			} catch (TwitterException e) {
    			    throw new ServletException(e);
    			}
    			
    			saveUserFacebook(appUserProfile, token, accessToken, facade, contextVO);
    			
    			res.sendRedirect(req.getContextPath() + "/");
    			
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
					RequestToken requestToken = (RequestToken) req.getSession().getAttribute("requestToken");
					try {
						//TODO: verificar se necessita mesmo ser o twitter derivado do login...
						twitter = (Twitter) req.getSession().getAttribute("twitter");
						twitter.getOAuthAccessToken(requestToken, verifier);
					} catch (TwitterException e) {
						throw new ServletException(e);
					}
					req.getSession().removeAttribute("requestToken");     
					saveUserFacebook(appUserProfile, token, accessToken, facade, contextVO);
				}
				req.getSession().setAttribute("twitter", twitter);
				res.sendRedirect(req.getContextPath() + "/");
    		}
    	}
        

		filterChain.doFilter(request, response);
    }

	private void saveUserFacebook(AppUserProfileVO appUserProfile, String token, String accessToken, IAppFacade facade, PlcBaseContextVO contextVO) {
		UsuarioFacebook usuarioFacebook = appUserProfile.getUsuario().getUsuarioFacebook();
		
		List<Usuario> listaRetorno = facade.findByField(contextVO, Usuario.class, "querySelFacebook", usuarioFacebook.getIdFacebook());
		Usuario usuario = null;
		if (listaRetorno != null && listaRetorno.size() >= 1) {
			usuario = listaRetorno.get(0); 
		}
		UsuarioTwitter usuarioTwitter = usuario.getUsuarioTwitter();
		
		//TODO: Salvar nome de usuário do facebook...
		usuarioTwitter.setToken(token);
		usuarioTwitter.setTokenSecret(accessToken);
		usuario.getUsuarioTwitter().setToken(token);
		usuario.getUsuarioTwitter().setTokenSecret(accessToken);
		contextVO.setMode(PlcBaseContextVO.Mode.ALTERACAO);
		facade.saveObject(contextVO, usuario);
	}

	public void destroy() {
		// TODO Auto-generated method stub
		
	}
 
    
}