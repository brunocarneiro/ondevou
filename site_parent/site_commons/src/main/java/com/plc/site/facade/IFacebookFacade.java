/*  																													
	    			       Jaguar-jCompany Developer Suite.																		
			    		        Powerlogic 2010-2014.
			    		    
		Please read licensing information in your installation directory.Contact Powerlogic for more 
		information or contribute with this project: suporte@powerlogic.com.br - www.powerlogic.com.br																								
 */ 
package com.plc.site.facade;

import java.io.PrintWriter;

import com.restfb.FacebookClient;


public interface IFacebookFacade {


	public void includingBinaryAttachment(FacebookClient facebookClient);

	public void batchRequest(FacebookClient facebookClient, PrintWriter out);
	
	public void deleteObject(FacebookClient facebookClient, PrintWriter out);

	public void publishingCheckIn(FacebookClient facebookClient, PrintWriter out);

	public void publishingImage(FacebookClient facebookClient, PrintWriter out);

	public void publishingSimpleMessage(FacebookClient facebookClient, PrintWriter out);

	public void dataAsJSONObject(FacebookClient facebookClient, PrintWriter out);
	
	public void selectingSpecificFields(FacebookClient facebookClient, PrintWriter out);
	
	public void passingParameters(FacebookClient facebookClient, PrintWriter out);

	public void metadataManyCalls(FacebookClient facebookClient, PrintWriter out);

	public void executeFQLQueries(FacebookClient facebookClient, PrintWriter out);

	public void fetchInsights(FacebookClient facebookClient, PrintWriter out);

	public void searching(FacebookClient facebookClient, PrintWriter out);
	
	public void fetchConnections(FacebookClient facebookClient, PrintWriter out);

	public void fetchMultipleObjet(FacebookClient facebookClient, PrintWriter out);

	public void fetchSingleObject(FacebookClient facebookClient, PrintWriter out);
	
}
