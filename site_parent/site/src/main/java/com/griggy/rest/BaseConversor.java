package com.griggy.rest;

import java.io.IOException;
import java.io.OutputStream;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import com.griggy.rest.template.QTemplateMap;
import com.powerlogic.jcompany.controller.rest.api.qualifiers.QPlcConversorMediaType;
import com.powerlogic.jcompany.controller.rest.api.stereotypes.SPlcConversor;
import com.powerlogic.jcompany.controller.rest.conversors.simple.PlcJsonConversor;
import com.powerlogic.jcompany.domain.validation.PlcMessage;
import com.powerlogic.jcompany.domain.validation.PlcMessage.Cor;

/**
 *Conversor base para todos os servicos
 *@author Bruno Carneiro
 */

@SPlcConversor
@QPlcConversorMediaType( { "application/json", "*/*" })
public class BaseConversor extends PlcJsonConversor<BaseController<Object, Object>> {
	
	@Inject
	@ApplicationScoped
	@QTemplateMap
	private Map<String, Map> template;

	@Override
	public void writeEntity(BaseController<Object, Object> container, OutputStream outputStream) {
		Map<String, Object> response = new LinkedHashMap<String, Object>();

		response.put("template", template.get(getUcName()));
		response.put("data", container.getEntity());
		response.put("messages", getMessages());
		try {
			writeResponse(outputStream, response);
		} catch (IOException e) {
			writeException(container, outputStream, new PlcMessage(e.getMessage(), Cor.msgVermelhoPlc));
		}
	}
	
	@Override
	public void writeEntityCollection(BaseController<Object, Object> container, OutputStream outputStream) {
		
		Map<String, Object> response = new LinkedHashMap<String, Object>();

		response.put("template", template.get(getUcName()));
		response.put("data", container.getEntityCollection());
		response.put("messages", getMessages());
		try {
			writeResponse(outputStream, response);
		} catch (IOException e) {
			writeException(container, outputStream, new PlcMessage(e.getMessage(), Cor.msgVermelhoPlc));
		}
	}
	

}
