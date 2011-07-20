package com.plc.site.controller.jsf.lugarUsuario;

import javax.enterprise.inject.Produces;
import javax.inject.Named;


import com.plc.site.entity.LugarUsuario;
import com.plc.site.controller.jsf.AppMB;

import com.powerlogic.jcompany.commons.annotation.PlcUriIoC;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcMB;
import com.powerlogic.jcompany.controller.jsf.annotations.PlcHandleException;

import com.powerlogic.jcompany.config.collaboration.PlcConfigFormLayout;
import com.powerlogic.jcompany.config.collaboration.PlcConfigCollaboration;



import com.powerlogic.jcompany.config.aggregation.PlcConfigAggregation;

@PlcConfigAggregation(
		entity = com.plc.site.entity.LugarUsuario.class
		
	)
	



@PlcConfigCollaboration (
	formLayout = @PlcConfigFormLayout(dirBase="/WEB-INF/fcls/lugarUsuario")
	
)


/**
 * Classe de Controle gerada pelo assistente
 */
 
@SPlcMB
@PlcUriIoC("lugarUsuario")
@PlcHandleException
public class LugarUsuarioMB extends AppMB  {

	private static final long serialVersionUID = 1L;
	
	
     		
	/**
	* Entidade da ação injetado pela CDI
	*/
	@Produces  @Named("lugarUsuario")
	public LugarUsuario criaEntidadePlc() {

        if (this.entidadePlc==null) {
              this.entidadePlc = new LugarUsuario();
              this.newEntity();
        }

        return (LugarUsuario)this.entidadePlc;
        
	}	
}
