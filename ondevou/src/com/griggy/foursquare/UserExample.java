package com.griggy.foursquare;

import fi.foyt.foursquare.api.FoursquareApi;
import fi.foyt.foursquare.api.FoursquareApiException;
import fi.foyt.foursquare.api.Result;
import fi.foyt.foursquare.api.entities.CompleteUser;

public class UserExample {
	
	  public static void main(String ... ll) throws FoursquareApiException {
		    // First we need a initialize FoursquareApi. 
		  
		  //Tive que registrar a app no site do FourSquare.A ordem dos dados é clientId, clienteSecret, callbackUrl.
		    FoursquareApi foursquareApi = new FoursquareApi("4BNX2IEMCJ2YJLLJQAZTZKOAD1B05KXDSSNHOGAQ4PCW31XW", "N1GINQDOQ3LRCBGYNK5EL2CZX1KUBIWQFG3MNQXXZUWN4YAV", "http://pwt.powerlogic.com.br/ondevou");
		    
		    // After client has been initialized we can make queries.
		    Result<CompleteUser> result = foursquareApi.user("bj.carneiro@gmail.com");
		    
		    if (result.getMeta().getCode() == 200) {
		      // if query was ok we can finally we do something with the data
		    	System.out.println(result.getResult().getFirstName());
		    } else {
		      // TODO: Proper error handling
		      System.out.println("Error occured: ");
		      System.out.println("  code: " + result.getMeta().getCode());
		      System.out.println("  type: " + result.getMeta().getErrorType());
		      System.out.println("  detail: " + result.getMeta().getErrorDetail()); 
		    }
		  }

}
