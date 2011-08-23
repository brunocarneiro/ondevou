/* Jaguar-jCompany Developer Suite. Powerlogic 2010-2014. Please read licensing information or contact Powerlogic 
 * for more information or contribute with this project: suporte@powerlogic.com.br - www.powerlogic.com.br        */ 
package com.plc.site.persistence.jpa;

import java.util.List;

import javax.enterprise.inject.Specializes;

import com.powerlogic.jcompany.commons.PlcException;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcDataAccessObject;
import com.powerlogic.jcompany.persistence.jpa.PlcBaseJpaDAO;

@SPlcDataAccessObject
@Specializes
public class AppJpaDAO extends PlcBaseJpaDAO {

	/**
	 * Recupera uma lista de objetos conforme o campo informado.
	 * 
	 * @param login
	 * @return
	 * @throws PlcException
	 */
	public List findByField(Class classe, String namedQuery, String field) {
		
		String query = anotacaoPersistenceUtil.getNamedQueryByName(classe, namedQuery).query();
		
		List listaRetorno = apiCreateQuery(classe, query).setParameter(1, field).getResultList();
		
		// Garante que colecoes participantes da lógica principal, mesmo se estiverem Lazy, são carregadas
		// antes do 'detached'
		for (Object object : listaRetorno) {
			if(object != null) {
				findCompleteGraph(object);
			}
		}
		
		return listaRetorno;
	}

}
