package com.griggy.rest;

import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.QueryParam;

import com.plc.site.entity.Usuario;
import com.powerlogic.jcompany.commons.PlcException;
import com.powerlogic.jcompany.controller.rest.api.qualifiers.QPlcControllerName;
import com.powerlogic.jcompany.controller.rest.api.qualifiers.QPlcControllerQualifier;
import com.powerlogic.jcompany.controller.rest.api.stereotypes.SPlcController;

import fi.foyt.foursquare.api.FoursquareApi;
import fi.foyt.foursquare.api.FoursquareApiException;
import fi.foyt.foursquare.api.Result;
import fi.foyt.foursquare.api.entities.CompleteUser;

@SPlcController
@QPlcControllerName("api")
@QPlcControllerQualifier("foursquare")
public class FourSquareController<Checkin, I> extends BaseController<Checkin, I> {

	private Long id;
	
	public void retrieve(I identificadorEntidade) {
		
		setEntity(null);
		
	}
	
	@Override
	public void retrieveCollection() {
		
//		Object[] usuarios = getFacade().findObject(getContext(), Usuario.class, id);
//		if(usuarios.length>1){
//			Usuario usuario = (Usuario) usuarios[0];
//			String foursquareId = usuario.getFoursquareId();
//			FoursquareApi foursquareApi = new FoursquareApi("4BNX2IEMCJ2YJLLJQAZTZKOAD1B05KXDSSNHOGAQ4PCW31XW", "N1GINQDOQ3LRCBGYNK5EL2CZX1KUBIWQFG3MNQXXZUWN4YAV", "http://localhost:8080/site/foursquare/checkins");
//			try {
//				foursquareApi.authenticateCode(foursquareId);
//				Result<CompleteUser> result = foursquareApi.user("self");
//				
//				List<Checkin> checkins = (List<Checkin>) Arrays.asList(result.getResult().getCheckins().getItems());
//				setEntityCollection(checkins);
//			} catch (FoursquareApiException e) {
//				throw new PlcException(e);
//			}
//		}
	}

	public Long getId() {
		return id;
	}

	@Inject @QueryParam("id")
	public void setId(Long id) {
		this.id = id;
	}
	
}
