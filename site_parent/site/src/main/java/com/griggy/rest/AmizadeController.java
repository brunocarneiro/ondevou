package com.griggy.rest;

import java.util.List;

import com.plc.site.entity.Amizade;
import com.plc.site.entity.Usuario;
import com.powerlogic.jcompany.controller.rest.api.qualifiers.QPlcControllerName;
import com.powerlogic.jcompany.controller.rest.api.qualifiers.QPlcControllerQualifier;
import com.powerlogic.jcompany.controller.rest.api.stereotypes.SPlcController;

@SPlcController
@QPlcControllerName("api")
@QPlcControllerQualifier("amizade")
public class AmizadeController<E, I> extends BaseController<E, I> {
	
	public void retrieve(I identificadorEntidade) {
		Amizade arg = new Amizade();
		Usuario u = new Usuario();
		u.setId((Long) identificadorEntidade);
		arg.setUsuario1(u);
		List<Usuario> us = (List<Usuario>) getFacade().findList(getContext(), arg, null, 0, 50);
		setEntity((E) us);
	};

}
