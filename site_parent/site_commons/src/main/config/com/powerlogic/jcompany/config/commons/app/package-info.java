/* ****************************** META-DADOS COMUNS DA APLICA��O ****************************
  ********************** Defaults de Valores de Declara��o Global ****************************
  ************** Deve ser empacotado em todas as camadas - WAR e JARs EJBs, quando remotos ***
  *******************************************************************************************/

@PlcConfigSuffixClass(entity="Entity",repository="Repository")

@PlcConfigPackage (entity=".entity.", application="com.plc.site")

package com.powerlogic.jcompany.config.commons.app;

import com.powerlogic.jcompany.config.application.PlcConfigPackage;
import com.powerlogic.jcompany.config.application.PlcConfigSuffixClass;
