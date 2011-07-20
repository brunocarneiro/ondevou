/* ****************************** META-DADOS COMUNS DA APLICAÇÃO ****************************
  ********************** Defaults de Valores de Declaração Global ****************************
  ************** Deve ser empacotado em todas as camadas - WAR e JARs EJBs, quando remotos ***
  *******************************************************************************************/

@PlcConfigSuffixClass(entity="Entity",repository="Repository")

@PlcConfigPackage (entity=".entity.", application="com.plc.site")

package com.powerlogic.jcompany.config.commons.app;

import com.powerlogic.jcompany.config.application.PlcConfigPackage;
import com.powerlogic.jcompany.config.application.PlcConfigSuffixClass;
