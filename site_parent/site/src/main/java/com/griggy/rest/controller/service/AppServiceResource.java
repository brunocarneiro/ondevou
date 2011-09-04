package com.griggy.rest.controller.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.annotations.cache.NoCache;

import com.plc.site.commons.AppUserProfileVO;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefaultLiteral;
import com.powerlogic.jcompany.commons.util.cdi.PlcCDIUtil;
import com.powerlogic.jcompany.controller.rest.api.controller.IPlcController;
import com.powerlogic.jcompany.controller.rest.api.conversor.IPlcConversor;
import com.powerlogic.jcompany.controller.rest.service.PlcServiceResource;
import com.powerlogic.jcompany.controller.rest.service.PlcServiceConstants.PATH_PARAM;

@Path("/service")
public class AppServiceResource extends PlcServiceResource {
	
	@GET
	@Path("/{" + PATH_PARAM.CONTROLLER_NAME + ":" + NAME_PATTERN + "}/self")
	@NoCache
	@SuppressWarnings("unchecked")
	@Override
	public <E, I> Response retrieveResource() {
		
		IPlcController<E, I> controller = getController();

		IPlcConversor<IPlcController<E, I>> conversor = getConversor();

		conversor.readEntity(controller, null);

		AppUserProfileVO appUserProfile = PlcCDIUtil.getInstance().getInstanceByType(AppUserProfileVO.class, QPlcDefaultLiteral.INSTANCE);

		controller.retrieve((I) appUserProfile.getUsuario().getId());

		return getResponse(controller);
	}
	

}
