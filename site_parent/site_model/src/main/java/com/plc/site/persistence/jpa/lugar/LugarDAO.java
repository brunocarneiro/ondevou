package com.plc.site.persistence.jpa.lugar;

import com.plc.site.persistence.jpa.AppJpaDAO;
import com.plc.site.entity.Lugar;
import com.powerlogic.jcompany.persistence.jpa.PlcQueryParameter;

import java.util.List;

import com.powerlogic.jcompany.persistence.jpa.PlcQuery;
import com.powerlogic.jcompany.persistence.jpa.PlcQueryLineAmount;
import com.powerlogic.jcompany.persistence.jpa.PlcQueryOrderBy;
import com.powerlogic.jcompany.persistence.jpa.PlcQueryFirstLine;
import com.powerlogic.jcompany.commons.annotation.PlcAggregationDAOIoC;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcDataAccessObject;
import com.powerlogic.jcompany.persistence.jpa.PlcQueryService;

/**
 * Classe de Persistência gerada pelo assistente
 */

@PlcAggregationDAOIoC(Lugar.class)
@SPlcDataAccessObject
@PlcQueryService
public class LugarDAO extends AppJpaDAO  {

	@PlcQuery("querySel")
	public native List<Lugar> findList(
			@PlcQueryOrderBy String dynamicOrderByPlc,
			@PlcQueryFirstLine Integer primeiraLinhaPlc, 
			@PlcQueryLineAmount Integer numeroLinhasPlc,		   
			
			@PlcQueryParameter(name="id", expression="id = :id") Long id,
			@PlcQueryParameter(name="nome", expression="nome like '%' || :nome ") String nome,
			@PlcQueryParameter(name="twitter", expression="twitter like '%' || :twitter ") String twitter
	);

	@PlcQuery("querySel")
	public native Long findCount(
			
			@PlcQueryParameter(name="id", expression="id = :id") Long id,
			@PlcQueryParameter(name="nome", expression="nome like '%' || :nome ") String nome,
			@PlcQueryParameter(name="twitter", expression="twitter like '%' || :twitter ") String twitter
	);
	
}
