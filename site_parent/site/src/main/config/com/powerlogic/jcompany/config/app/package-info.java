/* ************************* META-DADOS GLOBAIS DA APLICA��O ******************************
  ********************** Configura��es padr�o para toda a aplica��o *************************
  ************ Obs: configura��es corporativas devem estar no n�vel anterior,****************
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
