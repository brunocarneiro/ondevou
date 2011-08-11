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
    
    // set this to the list of extended permissions you want
    
    //TODO: colocar por demanda ou liberar tudo???
    private static final String[] perms = new String[] {   
													    	"publish_stream", 
													    	"create_event", 
													    	"rsvp_event", 
													    	"sms", 
													    	"offline_access", 
													        "manage_pages", 
													        "email", 
													        "read_insights", 
													        "read_stream", 
													        "read_mailbox", 
													        "ads_management", 
													        "xmpp_login", 
													        "user_about_me", 
													        "user_activities", 
													        "user_birthday", 
													        "user_education_history", 
													        "user_events", 
													        "user_groups", 
													        "user_hometown", 
													        "user_interests", 
													        "user_likes", 
													        "user_location", 
													        "user_notes", 
													        "user_online_presence", 
													        "user_photo_video_tags", 
													        "user_photos", 
													        "user_relationships", 
													        "user_religion_politics", 
													        "user_status", 
													        "user_videos", 
													        "user_website", 
													        "user_work_history", 
													        "email,publish_stream", 
													        "offline_access", 
													        "read_stream"
    													};
    
    

    
    

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