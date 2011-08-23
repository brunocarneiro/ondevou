package com.plc.site.facade;

import java.util.List;

import javax.enterprise.inject.Specializes;

import com.plc.site.model.AppRepository;
import com.powerlogic.jcompany.commons.PlcBaseContextVO;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefaultLiteral;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcFacade;
import com.powerlogic.jcompany.commons.util.cdi.PlcCDIUtil;
import com.powerlogic.jcompany.facade.PlcFacadeImpl;
import com.powerlogic.jcompany.persistence.PlcContextManager;

/**
 * Facade especifico do jsecurity que extende do jcompany e adiciona novos metodos
 * 
 */
@Specializes
@SPlcFacade
public class AppFacadeImpl extends PlcFacadeImpl implements IAppFacade {

	public List findByField(PlcBaseContextVO contexto, Class classe, String namedQuery, String field) {
		PlcContextManager.setContextVO(contexto);
		AppRepository repository = PlcCDIUtil.getInstance().getInstanceByType(AppRepository.class, QPlcDefaultLiteral.INSTANCE);
		return repository.findByField(classe, namedQuery, field);
	}

}
