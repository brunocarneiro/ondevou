package com.griggy.rest.foursquare;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;

import net.sf.json.JSONArray;

import org.jboss.resteasy.annotations.cache.NoCache;

import com.plc.site.entity.Endereco;
import com.plc.site.entity.Lugar;
import com.plc.site.entity.LugarUsuario;
import com.plc.site.entity.Usuario;
import com.powerlogic.jcompany.commons.PlcBaseContextVO;
import com.powerlogic.jcompany.commons.PlcBaseContextVO.Mode;
import com.powerlogic.jcompany.commons.PlcException;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefaultLiteral;
import com.powerlogic.jcompany.commons.facade.IPlcFacade;
import com.powerlogic.jcompany.commons.util.cdi.PlcCDIUtil;

import fi.foyt.foursquare.api.FoursquareApi;
import fi.foyt.foursquare.api.entities.Checkin;
import fi.foyt.foursquare.api.entities.Location;
import fi.foyt.foursquare.api.io.DefaultIOHandler;

/**
 * @author Bruno Carneiro
 */

@Path("/foursquare")
public class FourSquareImportRest{
	
	@GET
	@Path("/import")
	@NoCache
	public String doGet(@Context HttpServletRequest req, @Context HttpServletResponse resp, @QueryParam("id") String idUsuario ) {
		Usuario u = getUsuario(idUsuario);
		List<Lugar> lugares = getLugares(req, u);
		
		return "{\"lugares\":"+JSONArray.fromObject(lugares).toString()+"}";
		
	}


	protected Usuario getUsuario(String idUsuario) {
		IPlcFacade facade = PlcCDIUtil.getInstance().getInstanceByType(IPlcFacade.class, QPlcDefaultLiteral.INSTANCE);
		PlcBaseContextVO contextVO = PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE);
		contextVO.setApiQuerySel("querySelFourSquare");
		Usuario u;
		
		u = (Usuario) facade.findObject(contextVO, Usuario.class, new Long((String)idUsuario))[0];
		return u;
	}


	/**
	 * Grava os locais - LugarUsuario
	 * @param selectedPlaces
	 * @param idUsuario
	 */
	@POST
	@Path("/selectedPlaces")
	public void selectPlaces(@FormParam("selectedPlaces") String selectedPlaces,  @FormParam("id") String idUsuario) {
		try{
			IPlcFacade facade = PlcCDIUtil.getInstance().getInstanceByType(IPlcFacade.class, QPlcDefaultLiteral.INSTANCE);
			JSONArray array = JSONArray.fromObject(selectedPlaces);
			List<Lugar> lugares = JSONArray.toList(array, Lugar.class);
			Usuario u = getUsuario(idUsuario);
			u.setFourSquareLastDate(new Date());
			facade.saveTabular(PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE), Lugar.class,lugares);
			List<LugarUsuario> lugaresUsuarios = new ArrayList<LugarUsuario>();
			for(Lugar l : lugares){
				LugarUsuario lugarUsuario = new LugarUsuario();
				lugarUsuario.setLugar(l);
				lugarUsuario.setUsuario(u);
				lugaresUsuarios.add(lugarUsuario);
			}
			facade.saveTabular(PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE), LugarUsuario.class,lugaresUsuarios);
			PlcBaseContextVO context = PlcCDIUtil.getInstance().getInstanceByType(PlcBaseContextVO.class, QPlcDefaultLiteral.INSTANCE);
			context.setMode(Mode.ALTERACAO);
			facade.saveObject(context, u);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	

	public List<Lugar> getLugares(HttpServletRequest req, Usuario u){
		if(req.getSession().getAttribute("selectedPlaces")!=null){
			return (List<Lugar>) req.getSession().getAttribute("selectedPlaces");
		}
		try{
			FoursquareApi foursquareApi = new FoursquareApi("4BNX2IEMCJ2YJLLJQAZTZKOAD1B05KXDSSNHOGAQ4PCW31XW", "N1GINQDOQ3LRCBGYNK5EL2CZX1KUBIWQFG3MNQXXZUWN4YAV", "http://localhost:8080/site/foursquare/checkins", u.getFoursquareId(), new DefaultIOHandler());
			Long time=null;
			if(u.getFourSquareLastDate()!=null)
				time=u.getFourSquareLastDate().getTime()/1000;
			
			//recupera a partir da ultima data de atualizacao
			Checkin[] checkins = foursquareApi.usersCheckins("self", null, null, time, null).getResult().getItems();
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
					l.setFourSquareId(checkin.getVenue().getId());
					lugares.add(l);
				}
			}
			req.getSession().setAttribute("lugares", lugares);
			return lugares;
		}
		catch(Exception e){
			throw new PlcException(e);
		}
	}
}