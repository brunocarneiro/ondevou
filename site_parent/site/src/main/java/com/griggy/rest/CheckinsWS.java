package com.griggy.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.enterprise.util.AnnotationLiteral;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.plc.site.entity.Endereco;
import com.plc.site.entity.Lugar;
import com.plc.site.entity.LugarUsuario;
import com.plc.site.entity.Usuario;
import com.powerlogic.jcompany.commons.PlcBaseContextVO;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefaultLiteral;
import com.powerlogic.jcompany.commons.facade.IPlcFacade;
import com.powerlogic.jcompany.commons.util.cdi.PlcCDIUtil;
import com.powerlogic.jcompany.controller.rest.api.qualifiers.QPlcConversorMediaType;
import com.powerlogic.jcompany.controller.rest.conversors.IPlcRestRendererUtil;
import com.powerlogic.jcompany.controller.rest.conversors.PlcJsonRestRenderUtil;

import fi.foyt.foursquare.api.FoursquareApi;
import fi.foyt.foursquare.api.FoursquareApiException;
import fi.foyt.foursquare.api.Result;
import fi.foyt.foursquare.api.entities.Checkin;
import fi.foyt.foursquare.api.entities.CompleteUser;
import fi.foyt.foursquare.api.entities.Location;
import fi.foyt.foursquare.api.io.DefaultIOHandler;

public class CheckinsWS extends HttpServlet{
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		IPlcFacade facade = PlcCDIUtil.getInstance().getInstanceByType(IPlcFacade.class, QPlcDefaultLiteral.INSTANCE);
		PlcBaseContextVO contextVO = PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE);
		Usuario u;
		if(req.getSession().getAttribute("usuario")==null)
			u = (Usuario) facade.findObject(contextVO, Usuario.class, new Long((String)req.getParameter("id")))[0];
		else
			u = (Usuario) req.getSession().getAttribute("usuario");
		
		FoursquareApi foursquareApi = new FoursquareApi("4BNX2IEMCJ2YJLLJQAZTZKOAD1B05KXDSSNHOGAQ4PCW31XW", "N1GINQDOQ3LRCBGYNK5EL2CZX1KUBIWQFG3MNQXXZUWN4YAV", "http://localhost:8080/site/foursquare/checkins", u.getFoursquareId(), new DefaultIOHandler());
		try {
			// finally we need to authenticate that authorization code
			Checkin[] checkins = foursquareApi.usersCheckins("self", 5000, null, null, null).getResult().getItems();
			List<Lugar> lugares = new ArrayList<Lugar>();
			for(Checkin checkin : checkins){
				Lugar l = new Lugar();
				Endereco e = new Endereco();
				if(checkin.getVenue()!=null){
					Location location = checkin.getVenue().getLocation();
					e.setLogradouro(location.getAddress());
					e.setCidade(location.getCity());
					e.setEstado(location.getState());
					e.setCep(location.getPostalCode());
					e.setLatitude(location.getLat());
					e.setLongitude(location.getLng());
					
					l.setEndereco(e);
					l.setNome(checkin.getVenue().getName());
					//l.setUrlFoto(checkin.getPhotos().getItems()[0].getUrl());
					l.setVersao(0);
					lugares.add(l);
				}
			}
			facade.saveTabular(PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE), Lugar.class,lugares);
			List<LugarUsuario> lugaresUsuarios = new ArrayList<LugarUsuario>();
			for(Lugar l : lugares){
				LugarUsuario lugarUsuario = new LugarUsuario();
				lugarUsuario.setLugar(l);
				lugarUsuario.setUsuario(u);
				lugaresUsuarios.add(lugarUsuario);
			}
			facade.saveTabular(PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE), LugarUsuario.class,lugaresUsuarios);
			//String responseJSON =JSONArray.fromObject(result.getResult().getCheckins().getItems()).toString();
			//resp.getWriter().write("{\"places\" : "+responseJSON + "}");
			
			// ... and voilà we have a authenticated Foursquare client
		} catch (Exception e) {
			System.out.println();
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