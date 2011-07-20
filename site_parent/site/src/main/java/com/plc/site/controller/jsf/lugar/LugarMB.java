package com.plc.site.controller.jsf.lugar;

import javax.enterprise.inject.Produces;
import javax.inject.Named;


import com.plc.site.entity.Lugar;
import com.plc.site.controller.jsf.AppMB;

import com.powerlogic.jcompany.commons.annotation.PlcUriIoC;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcMB;
import com.powerlogic.jcompany.controller.jsf.annotations.PlcHandleException;

import com.powerlogic.jcompany.config.collaboration.PlcConfigFormLayout;
import com.powerlogic.jcompany.config.collaboration.PlcConfigCollaboration;


import com.powerlogic.jcompany.config.aggregation.PlcConfigAggregation;

@PlcConfigAggregation(
		entity = com.plc.site.entity.Lugar.class


		,components = {@com.powerlogic.jcompany.config.aggregation.PlcConfigComponent(clazz=com.plc.site.entity.Endereco.class, property="endereco")}
		,details = { 		@com.powerlogic.jcompany.config.aggregation.PlcConfigDetail(clazz = com.plc.site.entity.AgendaDia.class,
								collectionName = "agendaDia", numNew = 4,
								multiplicity = "0..*", onDemand = false),
								
								@com.powerlogic.jcompany.config.aggregation.PlcConfigDetail(clazz = com.plc.site.entity.LugarUsuario.class,
										collectionName = "lugarUsuario", numNew = 4,
										multiplicity = "0..*", onDemand = false)
			

		}
	)
	



@PlcConfigCollaboration (
	formLayout = @PlcConfigFormLayout(dirBase="/WEB-INF/fcls/lugar")
	
)


/**
 * Classe de Controle gerada pelo assistente
 */
 
@SPlcMB
@PlcUriIoC("lugar")
@PlcHandleException
public class LugarMB extends AppMB  {

	private static final long serialVersionUID = 1L;
	
	
     		
	/**
	* Entidade da ação injetado pela CDI
	*/
	@Produces  @Named("lugar")
	public Lugar criaEntidadePlc() {

        if (this.entidadePlc==null) {
              this.entidadePlc = new Lugar();
              this.newEntity();
        }

        return (Lugar)this.entidadePlc;
        
	}	
}
