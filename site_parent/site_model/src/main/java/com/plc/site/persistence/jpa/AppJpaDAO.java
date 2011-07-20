/* Jaguar-jCompany Developer Suite. Powerlogic 2010-2014. Please read licensing information or contact Powerlogic 
 * for more information or contribute with this project: suporte@powerlogic.com.br - www.powerlogic.com.br        */ 
package com.plc.site.persistence.jpa;

import javax.enterprise.inject.Specializes;

import com.powerlogic.jcompany.commons.config.stereotypes.SPlcDataAccessObject;
import com.powerlogic.jcompany.persistence.jpa.PlcBaseJpaDAO;

@SPlcDataAccessObject
@Specializes
public class AppJpaDAO extends PlcBaseJpaDAO {

}
