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

import com.plc.site.commons.AppUserProfileVO;
import com.plc.site.facade.IAppFacade;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefaultLiteral;
import com.powerlogic.jcompany.commons.util.cdi.PlcCDIUtil;

import java.io.IOException;

public class CallbackServlet extends HttpServlet {
    private static final long serialVersionUID = 1657390011452788111L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
    	AppUserProfileVO appUserProfile = PlcCDIUtil.getInstance().getInstanceByType(AppUserProfileVO.class, QPlcDefaultLiteral.INSTANCE);
    	
        String token 		= appUserProfile.getUsuario().getTwitter();
        String accessToken	= appUserProfile.getUsuario().getTwitterId();
        
        Twitter twitter = null;
        
        if(twitter == null){
        	// token - tokenSecret
        	IAppFacade facade = PlcCDIUtil.getInstance().getInstanceByType(IAppFacade.class, QPlcDefaultLiteral.INSTANCE);
        	
        	twitter = new TwitterFactory().getInstance();
        	try {
				twitter.setOAuthAccessToken(new AccessToken(token, accessToken));
			} catch (Exception e1) {
				e1.printStackTrace();
			}
        	
        	if(!twitter.getAuthorization().isEnabled()) {
            	String verifier = request.getParameter("oauth_verifier");
            	RequestToken requestToken = (RequestToken) request.getSession().getAttribute("requestToken");
            	try {
            		twitter.getOAuthAccessToken(requestToken, verifier);
            	} catch (TwitterException e) {
            		throw new ServletException(e);
            	}
            	request.getSession().removeAttribute("requestToken");        		
        	}
        	response.sendRedirect(request.getContextPath() + "/");
        }
    }
}

/*
Twitter twitter = (Twitter) request.getSession().getAttribute("twitter");
RequestToken requestToken = (RequestToken) request.getSession().getAttribute("requestToken");
String verifier = request.getParameter("oauth_verifier");
try {
    twitter.getOAuthAccessToken(requestToken, verifier);
    request.getSession().removeAttribute("requestToken");
} catch (TwitterException e) {
    throw new ServletException(e);
}
response.sendRedirect(request.getContextPath() + "/");
*/