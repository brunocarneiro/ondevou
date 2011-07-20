package com.plc.site.persistence.jpa.usuario;

import com.plc.site.persistence.jpa.AppJpaDAO;
import com.plc.site.entity.Usuario;
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

@PlcAggregationDAOIoC(Usuario.class)
@SPlcDataAccessObject
@PlcQueryService
public class UsuarioDAO extends AppJpaDAO  {

	@PlcQuery("querySel")
	public native List<Usuario> findList(
			@PlcQueryOrderBy String dynamicOrderByPlc,
			@PlcQueryFirstLine Integer primeiraLinhaPlc, 
			@PlcQueryLineAmount Integer numeroLinhasPlc,		   
			
			@PlcQueryParameter(name="id", expression="id = :id") Long id,
			@PlcQueryParameter(name="nome", expression="nome like '%' || :nome ") String nome,
			@PlcQueryParameter(name="sobrenome", expression="sobrenome like '%' || :sobrenome ") String sobrenome,
			@PlcQueryParameter(name="email", expression="email like '%' || :email ") String email,
			@PlcQueryParameter(name="senha", expression="senha like '%' || :senha ") String senha,
			@PlcQueryParameter(name="twitter", expression="twitter like '%' || :twitter ") String twitter
	);

	@PlcQuery("querySel")
	public native Long findCount(
			
			@PlcQueryParameter(name="id", expression="id = :id") Long id,
			@PlcQueryParameter(name="nome", expression="nome like '%' || :nome ") String nome,
			@PlcQueryParameter(name="sobrenome", expression="sobrenome like '%' || :sobrenome ") String sobrenome,
			@PlcQueryParameter(name="email", expression="email like '%' || :email ") String email,
			@PlcQueryParameter(name="senha", expression="senha like '%' || :senha ") String senha,
			@PlcQueryParameter(name="twitter", expression="twitter like '%' || :twitter ") String twitter
	);
	
}
