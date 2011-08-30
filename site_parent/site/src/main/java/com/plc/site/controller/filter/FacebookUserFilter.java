package com.plc.site.controller.filter;


import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.InvalidKeyException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.plc.site.commons.AppUserProfileVO;
import com.plc.site.controller.AppHttpClientUtil;
import com.plc.site.entity.EstadoCivil;
import com.plc.site.entity.OrientacaoSexual;
import com.plc.site.entity.Sexo;
import com.plc.site.entity.Usuario;
import com.plc.site.entity.UsuarioFacebook;
import com.plc.site.entity.facebook.Facebook;
import com.plc.site.facade.IAppFacade;
import com.powerlogic.jcompany.commons.PlcBaseContextVO;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefaultLiteral;
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
        AppUserProfileVO appUserProfile = PlcCDIUtil.getInstance().getInstanceByType(AppUserProfileVO.class, QPlcDefaultLiteral.INSTANCE);
        String signedRequest = getSignedRequest(req);
        String code = req.getParameter("code");

        if(appUserProfile == null || (appUserProfile != null && !appUserProfile.isValid())) {
			if (StringUtil.isNotBlankStr(code)) {
	            try {
	            	String accessToken = recuperarAccessToken(code);
	                if (accessToken != null) {
	                	Boolean validFacebookUser = false;
	                	Boolean validSystemUser = false;
	                	try {
	                		validFacebookUser = criaUsuarioFacebook(appUserProfile, accessToken);
	                		validSystemUser = criaUsuarioAplicacao(appUserProfile, signedRequest);
						} catch (Exception e) {
							e.printStackTrace();
						}
						if(!validFacebookUser) {
							res.sendRedirect("http://localhost:8080/site/f/inicial.xhtml");
						} else {
							if(validFacebookUser && !validSystemUser) {
								res.sendRedirect("http://localhost:8080/site/cadastro.html");
							} else {
								AppHttpClientUtil httpClientUtil = PlcCDIUtil.getInstance().getInstanceByType(AppHttpClientUtil.class, QPlcDefaultLiteral.INSTANCE);
								httpClientUtil.setUrlApp("http://localhost:8080/site/");
								httpClientUtil.doLogin("usuario", "senha");
								
								res.sendRedirect("http://localhost:8080/site/#usuario?id=" + appUserProfile.getUsuario().getId());
							}
						}
	                    
	                } else {
	                    throw new RuntimeException("Access token and expires not found");
	                }
	            } catch (IOException e) {
	                throw new RuntimeException(e);
	            }
	                	
		
			} else if(StringUtil.isNotBlankStr(signedRequest)) {
				try {
					criaUsuarioAplicacao(appUserProfile, signedRequest);
				} catch (Exception e) {
					e.printStackTrace();
				}
			} else {
				if(req.getParameter("paginaLogin") != null && req.getParameter("paginaLogin").equals("true")) {
					//TODO COLOCAR ISSO EM APPLICATION SCOPE
					Facebook facebook = new Facebook(idKey, apiKey, secretKey);
					res.sendRedirect(facebook.getLoginRedirectURL());					
				} else {
					res.sendRedirect("http://localhost:8080/site/f/inicial.xhtml");	
				}
			}
			
		} else {
			filterChain.doFilter(request, response);
        }
    }

	private String recuperarAccessToken(String code) throws MalformedURLException, IOException {
		Facebook facebook = new Facebook(idKey, apiKey, secretKey);
		String authURL = facebook.getAuthURL(code);
		URL url = new URL(authURL);
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
		return accessToken;
	}

	private String getSignedRequest(HttpServletRequest req) {
		String signedRequest = null;
		String cryptSignedRequest = req.getParameter("signed_request");
        if(cryptSignedRequest == null) {
            return null;
        }
        try {
			signedRequest = validateSignature(cryptSignedRequest, secretKey);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		return signedRequest;
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
	
	private String validateSignature(String cryptSignedRequest, String appSecret) throws Exception {

		if (cryptSignedRequest == null) {
			throw new Exception("Invalid signature.");
		}
		
		String[] parts = cryptSignedRequest.split("\\.");
		
		if (parts.length != 2) {
			throw new Exception("Invalid signature.");
		}
		
		String encSig = parts[0];
		String encPayload = parts[1];

		Base64 decoder = new Base64(true);
		String decodificada = new String(decoder.decode(encPayload));

		try {
			Mac mac = Mac.getInstance("HMACSHA256");
			mac.init(new SecretKeySpec(appSecret.getBytes(), mac.getAlgorithm()));
			byte[] calcSig = mac.doFinal(encPayload.getBytes());
			if (Arrays.equals(decoder.decode(encSig), calcSig)) {
				return decodificada;
			} else {
				return null;
			}
		} catch (InvalidKeyException e) {
			throw new Exception("Failed to perform crypt operation.", e);
		}
	}
	
	private Boolean criaUsuarioFacebook(AppUserProfileVO appUserProfile, String accessToken) throws Exception {
		
    	Usuario usuario = null;
    	UsuarioFacebook usuarioFacebook = null;
    	
		//Buscar Usuario no Banco com o accessToken passado.
		IAppFacade facade = PlcCDIUtil.getInstance().getInstanceByType(IAppFacade.class, QPlcDefaultLiteral.INSTANCE);
		PlcBaseContextVO contextVO = PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE);
		
		List<Usuario> listaRetorno = facade.findByField(contextVO, Usuario.class, "querySelAccessToken",accessToken);
		
		if (listaRetorno != null && listaRetorno.size() >= 1) {
			usuario = listaRetorno.get(0); 
		}
		
		//Se existir, utilizar esse usuário
		
		if (usuario == null) {
			if(accessToken != null) {
				usuario = new Usuario();
				usuarioFacebook = new UsuarioFacebook();
				// TODO: Deixar a url dentro do FacebookUtil em ApplicationScope
				JSONObject resp = new JSONObject(IOUtil.urlToString(new URL("https://graph.facebook.com/me?access_token=" + accessToken)));
				usuarioFacebook.setAccessToken(accessToken);
				usuarioFacebook.setIdFacebook(resp.getString("id"));
				usuarioFacebook.setFirstName(resp.getString("first_name"));
				usuarioFacebook.setLastName(resp.getString("last_name"));
				usuarioFacebook.setEmailFacebook(resp.getString("email"));
				usuario.setUsuarioFacebook(usuarioFacebook);
				appUserProfile.setUsuario(usuario);
				return true;
			} else {
				return false;
			}
			
		} else {
			appUserProfile.setUsuario(usuario);
			return true;
		}
		
		
	}
	
    private Boolean criaUsuarioAplicacao(AppUserProfileVO appUserProfile, String signedRequest) throws Exception {
    	
    	Usuario usuario = appUserProfile.getUsuario();
    	UsuarioFacebook usuarioFacebook = null;

    	JSONObject payloadObject = null;
    	if(StringUtil.isNotBlankStr(signedRequest)) {
			try {
				payloadObject = new JSONObject(signedRequest);
			}
			catch (JSONException e) {
				System.out.println("ERROR: Unable to perform JSON decode");
				return false;
			}
		}
    	
    	
    	IAppFacade facade = PlcCDIUtil.getInstance().getInstanceByType(IAppFacade.class, QPlcDefaultLiteral.INSTANCE);
		
		PlcBaseContextVO contextVO = PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE);
		
		if(usuario.getUsuarioFacebook() == null) {
			return false;
		} else{
			usuarioFacebook = usuario.getUsuarioFacebook();
		}
		
		if(usuario.getId() == null) {
			//busca os dados do usuario do facebook
			List<Usuario> listaRetorno = facade.findByField(contextVO, Usuario.class, "querySelFacebook", usuarioFacebook.getIdFacebook());
			if (listaRetorno != null && listaRetorno.size() >= 1) {
				usuario = listaRetorno.get(0); 
			}
		}

		if (usuario == null) {
			
			if(usuarioFacebook != null) {
				
				// Dados Formulário Especifico
	            String facebookId = "" + payloadObject.get("user_id"); //Retrieve user ID
	            String oauthToken = "" + payloadObject.get("oauth_token"); //Retrieve oauth token
	            JSONObject registration = new JSONObject(payloadObject.get("registration").toString()); 
	            String password = "" + registration.get("password");
	            String twitter = "" + registration.get("twitter"); 
	            String birthday = "" + registration.get("birthday");
	            String sexo = null;
	            //alterar a busca para recuperar o usuário com o id do usuarioFacebook
	            //se não existir, é o primeiro login, deve ser criado o usuario geral
	            usuario = new Usuario();
	            
	            usuario.setNome(usuarioFacebook.getFirstName());
	            usuario.setSobrenome(usuarioFacebook.getLastName());
	            usuario.setEmail(usuarioFacebook.getEmailFacebook());
	            usuario.setSenha(password);
	            usuario.setTwitter(twitter);
	            usuario.setUrlFoto("");
	            usuario.setDataNascimento(new Date(birthday));
	            usuario.setSexo(Sexo.M);
	            usuario.setOrientacaoSexual(OrientacaoSexual.H);
	            usuario.setUsuarioFacebook(usuarioFacebook);
	            usuario.setEstadoCivil(EstadoCivil.S);
	            appUserProfile.setValid(true);
	            
	            usuario.setUsuarioUltAlteracao("app_facebook_integration");
	            facade.saveObject(contextVO, usuario);
			}
            
		} else {
			// atualiza usuario no profile
			appUserProfile.setValid(true);
			appUserProfile.setUsuario(usuario);
		}
		
		return true;
    	
    }
 
    
}