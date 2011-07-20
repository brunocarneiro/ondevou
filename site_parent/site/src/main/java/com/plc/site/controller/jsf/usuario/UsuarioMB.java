package com.plc.site.controller.jsf.usuario;

import javax.enterprise.inject.Produces;
import javax.inject.Named;


import com.plc.site.entity.Usuario;
import com.plc.site.controller.jsf.AppMB;

import com.powerlogic.jcompany.commons.annotation.PlcUriIoC;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcMB;
import com.powerlogic.jcompany.controller.jsf.annotations.PlcHandleException;

import com.powerlogic.jcompany.config.collaboration.PlcConfigFormLayout;
import com.powerlogic.jcompany.config.collaboration.PlcConfigCollaboration;


import com.powerlogic.jcompany.config.aggregation.PlcConfigAggregation;
import com.powerlogic.jcompany.config.aggregation.PlcConfigPagedDetail;

@PlcConfigAggregation(
		entity = com.plc.site.entity.Usuario.class


		,components = {@com.powerlogic.jcompany.config.aggregation.PlcConfigComponent(clazz=com.plc.site.entity.Endereco.class, property="endereco")}
		,details = { 		
		@com.powerlogic.jcompany.config.aggregation.PlcConfigDetail(clazz = com.plc.site.entity.Amizade.class,
								collectionName = "amizades", numNew = 4,
								multiplicity = "0..*", onDemand = false)
			
			,
		@com.powerlogic.jcompany.config.aggregation.PlcConfigDetail(clazz = com.plc.site.entity.AgendaDia.class,
								collectionName = "agendaDia", numNew = 4,
								multiplicity = "0..*", onDemand = false)
			
			,
		@com.powerlogic.jcompany.config.aggregation.PlcConfigDetail(clazz = com.plc.site.entity.LugarUsuario.class,
								collectionName = "lugarUsuario", numNew = 1,
								multiplicity = "0..*", onDemand = false)
			

		}
	)
	


@PlcConfigCollaboration (
	formLayout = @PlcConfigFormLayout(dirBase="/WEB-INF/fcls/usuario")
	
)


/**
 * Classe de Controle gerada pelo assistente
 */
 
@SPlcMB
@PlcUriIoC("usuario")
@PlcHandleException
public class UsuarioMB extends AppMB  {

	private static final long serialVersionUID = 1L;
	
	
     		
	/**
	* Entidade da ação injetado pela CDI
	*/
	@Produces  @Named("usuario")
	public Usuario criaEntidadePlc() {

        if (this.entidadePlc==null) {
              this.entidadePlc = new Usuario();
              this.newEntity();
        }

        return (Usuario)this.entidadePlc;
        
	}	
}
