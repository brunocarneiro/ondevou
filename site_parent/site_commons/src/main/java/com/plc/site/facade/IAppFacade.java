package com.plc.site.facade;

import java.util.List;

import com.powerlogic.jcompany.commons.PlcBaseContextVO;
import com.powerlogic.jcompany.commons.PlcException;
import com.powerlogic.jcompany.commons.facade.IPlcFacade;


public interface IAppFacade extends IPlcFacade {
	
	
	/**
     * Efetua a busca genérica, com base na classe e campo repassados 
     * 
     * @param classe
     * @param namedQuery
     * @param field
     * 
     * @throws PlcException
     */	
	public List findByField(PlcBaseContextVO contexto, Class classe, String namedQuery, String field);
	
	

}
