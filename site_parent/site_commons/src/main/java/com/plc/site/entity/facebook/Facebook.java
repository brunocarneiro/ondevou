package com.plc.site.entity.facebook;

import com.visural.common.StringUtil;

public class Facebook {
	
    // get these from your FB Dev App
	private String idKey;
    private String apiKey;
    private String secretKey;

    public Facebook(String idKey, String apiKey, String secretKey) {
		super();
		this.idKey = idKey;
		this.apiKey = apiKey;
		this.secretKey = secretKey;
	}

	// set this to your servlet URL for the authentication servlet/filter
    private static final String redirect_uri = "http://localhost:8080/site/facebook";
    
    /// set this to the list of extended permissions you want
    private static final String[] perms = new String[] {"publish_stream", "email"};


    public String getIdKey() {
        return idKey;
    }

    public String getAPIKey() {
        return apiKey;
    }

    public String getSecretApi() {
        return secretKey;
    }

    public String getLoginRedirectURL() {
        return "https://graph.facebook.com/oauth/authorize?client_id=" + idKey + "&display=page&redirect_uri=" + redirect_uri+"&scope="+StringUtil.delimitObjectsToString(",", perms);
    }

    public String getAuthURL(String authCode) {
        return "https://graph.facebook.com/oauth/access_token?client_id=" + idKey + "&redirect_uri=" + redirect_uri + "&client_secret=" + secretKey + "&code=" + authCode;
    }
}