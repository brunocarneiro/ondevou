package com.plc.site.controller.filter;


import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.plc.site.entity.Usuario;
import com.plc.site.entity.UsuarioFacebook;
import com.plc.site.entity.facebook.Facebook;
import com.powerlogic.jcompany.commons.PlcBaseContextVO;
import com.powerlogic.jcompany.commons.PlcBaseContextVO.Mode;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefaultLiteral;
import com.powerlogic.jcompany.commons.facade.IPlcFacade;
import com.powerlogic.jcompany.commons.util.cdi.PlcCDIUtil;
import com.visural.common.IOUtil;
import com.visural.common.StringUtil;



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
public class FacebookUserFilter implements Filter {

	private static final Logger logger = LoggerFactory.getLogger(FacebookUserFilter.class);
	
	private String idKey;
	
	private String apiKey;

	private String secretKey;

	public void init(FilterConfig filterConfig) throws ServletException {

		idKey = filterConfig.getServletContext().getInitParameter("idKey");
		
		apiKey = filterConfig.getServletContext().getInitParameter("apiKey");

		secretKey = filterConfig.getServletContext().getInitParameter("secretApi");
		
		if (idKey == null || apiKey == null || secretKey == null) {
			throw new ServletException("Cannot initialise Facebook User Filter because the facebook_api_key or facebook_secret context init params have not been set. Check that they're there in your servlet context descriptor.");
		} else {
			logger.info("Using facebook API key: " + apiKey);
		}
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
		
        HttpServletRequest req = (HttpServletRequest) request;
        
        HttpServletResponse res = (HttpServletResponse) response;
        
		IPlcFacade facade = PlcCDIUtil.getInstance().getInstanceByType(IPlcFacade.class, QPlcDefaultLiteral.INSTANCE);
		PlcBaseContextVO contextVO = PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE);
		Usuario usuario;
		
        boolean logar = false;
        
        String code = req.getParameter("code");
        
        if (StringUtil.isNotBlankStr(code)) {
        	
        	usuario = (Usuario) req.getSession().getAttribute("usuario");
        	
        	Facebook facebook = new Facebook(idKey, apiKey, secretKey);
            String authURL = facebook.getAuthURL(code);
            URL url = new URL(authURL);
            try {
                String result = readURL(url);
                String accessToken = null;
                Integer expires = null;
                String[] pairs = result.split("&");
                for (String pair : pairs) {
                    String[] kv = pair.split("=");
                    if (kv.length != 2) {
                        throw new RuntimeException("Unexpected auth response");
                    } else {
                        if (kv[0].equals("access_token")) {
                            accessToken = kv[1];
                        }
                        if (kv[0].equals("expires")) {
                            expires = Integer.valueOf(kv[1]);
                        }
                    }
                }
                if (accessToken != null) {
                	usuario.setFacebookId(accessToken);
                	usuario.setUsuarioUltAlteracao("app_facebook_integration");
    				contextVO.setMode(Mode.ALTERACAO);
    				
                	authFacebookLogin(usuario, accessToken);

                	facade.saveObject(contextVO, usuario);
                	req.getSession().setAttribute("usuario", usuario);
                    
                    res.sendRedirect("http://localhost:8080/site/facebook.html");
                } else {
                    throw new RuntimeException("Access token and expires not found");
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
        	
        	if(req.getSession().getAttribute("usuario") == null){
        		
        		long id = 14;
        		usuario = (Usuario) facade.findObject(contextVO, Usuario.class, id)[0];
        		req.getSession().setAttribute("usuario", usuario);
        		
        		if(StringUtils.isBlank(usuario.getFacebookId()) || validaAccessToken(usuario.getFacebookId()) ) {
        			Facebook facebook = new Facebook(idKey, apiKey, secretKey);
        			res.sendRedirect(facebook.getLoginRedirectURL());
        		} else {
        			filterChain.doFilter(request, response);
        		}
        		
        	} else {
        		filterChain.doFilter(request, response);
        	}
        }
    }

    private String readURL(URL url) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        InputStream is = url.openStream();
        int r;
        while ((r = is.read()) != -1) {
            baos.write(r);
        }
        return new String(baos.toByteArray());
    }

	public void destroy() {

	}
	
	private boolean validaAccessToken(String accessToken) {
		
		return false;
	}

    private void authFacebookLogin(Usuario usuario, String accessToken) {
    	
        try {
            JSONObject resp = new JSONObject(IOUtil.urlToString(new URL("https://graph.facebook.com/me?access_token=" + accessToken)));

            UsuarioFacebook usuarioFacebook = usuario.getUsuarioFacebook();
            if(usuarioFacebook == null) {
            	usuarioFacebook = new UsuarioFacebook();
            }
            //usuarioFacebook.setIdFacebook(resp.getString("id"));
            usuarioFacebook.setFirstName(resp.getString("first_name"));
            usuarioFacebook.setLastName(resp.getString("last_name"));
            usuarioFacebook.setEmailFacebook(resp.getString("email"));

        } catch (Throwable ex) {
            throw new RuntimeException("failed login", ex);
        }
    }
    
}