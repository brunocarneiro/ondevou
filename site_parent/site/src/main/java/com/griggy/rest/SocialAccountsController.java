package com.griggy.rest;

import com.plc.site.entity.Usuario;
import com.powerlogic.jcompany.controller.rest.api.qualifiers.QPlcControllerName;
import com.powerlogic.jcompany.controller.rest.api.qualifiers.QPlcControllerQualifier;
import com.powerlogic.jcompany.controller.rest.api.stereotypes.SPlcController;

@SPlcController
@QPlcControllerName("api")
@QPlcControllerQualifier("socialaccounts")
public class SocialAccountsController<E, I> extends BaseController<E, I> {
	
	public void retrieve(I identificadorEntidade) {
		Usuario u = (Usuario) getFacade().findObject(getContext(), Usuario.class, identificadorEntidade)[0];
		setEntity((E) u);
	};

}
