package com.griggy.rest;

import com.powerlogic.jcompany.controller.rest.api.qualifiers.QPlcControllerName;
import com.powerlogic.jcompany.controller.rest.api.qualifiers.QPlcControllerQualifier;
import com.powerlogic.jcompany.controller.rest.api.stereotypes.SPlcController;
import com.powerlogic.jcompany.controller.rest.controllers.PlcBaseDynamicController;


@SPlcController
@QPlcControllerName("api")
@QPlcControllerQualifier("*")
public class BaseController<E, I> extends PlcBaseDynamicController<E, I> {

	
}
