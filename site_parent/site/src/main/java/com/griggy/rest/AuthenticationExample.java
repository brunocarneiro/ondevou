package com.griggy.rest;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fi.foyt.foursquare.api.FoursquareApi;
import fi.foyt.foursquare.api.FoursquareApiException;
import fi.foyt.foursquare.api.Result;
import fi.foyt.foursquare.api.entities.CompleteUser;

public class AuthenticationExample extends HttpServlet{
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		FoursquareApi foursquareApi = new FoursquareApi("4BNX2IEMCJ2YJLLJQAZTZKOAD1B05KXDSSNHOGAQ4PCW31XW", "N1GINQDOQ3LRCBGYNK5EL2CZX1KUBIWQFG3MNQXXZUWN4YAV", "http://localhost:8080/ondevou/foursquare");
		try {
			String code = req.getParameter("code");
			if (code == null) {
				// First we need to redirect our user to authentication page.
				resp.sendRedirect(foursquareApi.getAuthenticationUrl());
			} else {

				try {
					// finally we need to authenticate that authorization code
					foursquareApi.authenticateCode(code);
					Result<CompleteUser> result = foursquareApi.user("self");
					
					resp.getWriter().println("<html>Usuario: "+result.getResult().getFirstName()+
							"<br><img src='"+result.getResult().getPhoto()+"'/></html>");
					
					// ... and voilà we have a authenticated Foursquare client
				} catch (FoursquareApiException e) {
					// TODO: Error handling
				}
			}

		} catch (IOException e) {
			// TODO: Error handling
		}
	}

	  
//	  public void handleCallback(HttpServletRequest request, HttpServletResponse response) {
//	    // After user has logged in and confirmed that our program may access user's Foursquare account
//	    // Foursquare redirects user back to callback url. 
//		FoursquareApi foursquareApi = new FoursquareApi("4BNX2IEMCJ2YJLLJQAZTZKOAD1B05KXDSSNHOGAQ4PCW31XW", "N1GINQDOQ3LRCBGYNK5EL2CZX1KUBIWQFG3MNQXXZUWN4YAV", "http://localhost:8080/ondevou/foursquare");
//	    // Callback url contains authorization code 
//	    String code = request.getParameter("code");
//	    try {
//	      // finally we need to authenticate that authorization code 
//	      foursquareApi.authenticateCode(code);
//	      foursquareApi.user("self");
//	      // ... and voilà we have a authenticated Foursquare client
//	    } catch (FoursquareApiException e) {
//	     // TODO: Error handling
//	    }
//	  }
	  
	}