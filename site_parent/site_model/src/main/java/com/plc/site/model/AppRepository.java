package com.plc.site.model;

import java.util.List;

import javax.enterprise.inject.Specializes;
import javax.inject.Inject;

import com.plc.site.persistence.jpa.AppJpaDAO;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefault;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcRepository;
import com.powerlogic.jcompany.model.PlcBaseRepository;

@SPlcRepository
@Specializes
public class AppRepository extends PlcBaseRepository {
	
	@Inject @QPlcDefault
	private AppJpaDAO dao;
	
	public List findByField(Class classe, String namedQuery, String field) {
		return dao.findByField(classe, namedQuery, field);
	}

}
