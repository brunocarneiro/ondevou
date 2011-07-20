/* ************************* META-DADOS GLOBAIS DA APLICAÇÃO ******************************
  ********************** Configurações padrão para toda a aplicação *************************
  ************ Obs: configurações corporativas devem estar no nível anterior,****************
  ************              preferencialmente na camada Bridge               ****************
  *******************************************************************************************/


@PlcConfigApplication(
	definition=@PlcConfigApplicationDefinition(name="site",acronym="site",version=1,release=0),
	classesDiscreteDomain={com.plc.site.entity.EstadoCivil.class,com.plc.site.entity.Sexo.class,com.plc.site.entity.OrientacaoSexual.class},
	classesLookup={}
)


package com.powerlogic.jcompany.config.app;

import com.powerlogic.jcompany.config.application.PlcConfigApplication;
import com.powerlogic.jcompany.config.application.PlcConfigApplicationDefinition;
