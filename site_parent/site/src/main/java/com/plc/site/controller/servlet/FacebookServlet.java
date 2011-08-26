package com.plc.site.controller.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.inject.Inject;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.plc.site.commons.AppUserProfileVO;
import com.plc.site.facade.IFacebookFacade;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefaultLiteral;
import com.powerlogic.jcompany.commons.util.cdi.PlcCDIUtil;
import com.restfb.DefaultFacebookClient;
import com.restfb.FacebookClient;

public class FacebookServlet extends HttpServlet {

	@Inject
	IFacebookFacade facade;
	
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		imprimirDados(response);
	}
	
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		imprimirDados(response);
	}

	
	private void imprimirDados(HttpServletResponse response) throws IOException {
		
		AppUserProfileVO appUserProfile = PlcCDIUtil.getInstance().getInstanceByType(AppUserProfileVO.class, QPlcDefaultLiteral.INSTANCE);
		FacebookClient facebookClient = new DefaultFacebookClient(appUserProfile.getUsuario().getUsuarioFacebook().getAccessToken());

		// HTML
	    response.setContentType("text/html");  
	    PrintWriter out = response.getWriter();  
		out.println("<HTML>");  
		out.println("<BODY>");  
		out.println("<H1>Dados Facebook para Aonde Vou!!!!!!</h1>");  
		  
		
		facade.fetchSingleObject(facebookClient, out);
		
		facade.fetchMultipleObjet(facebookClient, out);
		
		facade.fetchConnections(facebookClient, out);
		
		facade.searching(facebookClient, out);

		facade.executeFQLQueries(facebookClient, out);

		facade.metadataManyCalls(facebookClient, out);
		
		facade.passingParameters(facebookClient, out);
		
		facade.selectingSpecificFields(facebookClient, out);
		
		//facade.fetchInsights(facebookClient, out);
		
		//facade.dataAsJSONObject(facebookClient, out);

		//facade.publishingSimpleMessage(facebookClient, out);
		
		//facade.publishingImage(facebookClient, out);		
		
		//facade.publishingCheckIn(facebookClient, out);
		
		//facade.deleteObject(facebookClient, out);		
		
		
		// The Batch API is great if you have multiple operations you'd like to
		// perform in one server trip. Let's build a batch with three GET requests and
		// one POST request here:

		//facade.batchRequest(facebookClient, out);
		
		//facade.includingBinaryAttachment(facebookClient);
		
	     out.println("</body>");  
	     out.println("</html>");
	}
	
	public void destroy() {

	}
	
}