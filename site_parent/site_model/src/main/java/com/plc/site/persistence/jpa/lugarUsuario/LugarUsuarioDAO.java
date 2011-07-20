package com.plc.site.persistence.jpa.lugarUsuario;

import com.plc.site.persistence.jpa.AppJpaDAO;
import com.plc.site.entity.LugarUsuario;
import com.powerlogic.jcompany.persistence.jpa.PlcQueryParameter;
import com.plc.site.entity.Usuario;
import com.plc.site.entity.Lugar;

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

@PlcAggregationDAOIoC(LugarUsuario.class)
@SPlcDataAccessObject
@PlcQueryService
public class LugarUsuarioDAO extends AppJpaDAO  {

	@PlcQuery("querySel")
	public native List<LugarUsuario> findList(
			@PlcQueryOrderBy String dynamicOrderByPlc,
			@PlcQueryFirstLine Integer primeiraLinhaPlc, 
			@PlcQueryLineAmount Integer numeroLinhasPlc,		   
			
			@PlcQueryParameter(name="id", expression="obj.id = :id") Long id,
			@PlcQueryParameter(name="usuario", expression="obj1 = :usuario") Usuario usuario,
			@PlcQueryParameter(name="lugar", expression="obj2 = :lugar") Lugar lugar
	);

	@PlcQuery("querySel")
	public native Long findCount(
			
			@PlcQueryParameter(name="id", expression="obj.id = :id") Long id,
			@PlcQueryParameter(name="usuario", expression="obj1 = :usuario") Usuario usuario,
			@PlcQueryParameter(name="lugar", expression="obj2 = :lugar") Lugar lugar
	);
	
}
