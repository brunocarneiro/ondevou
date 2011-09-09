package com.griggy.rest.controller.service;

import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.enterprise.inject.Specializes;
import javax.inject.Inject;
import javax.persistence.Embeddable;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.ObjectUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.powerlogic.jcompany.commons.annotation.PlcPrimaryKey;
import com.powerlogic.jcompany.commons.config.metamodel.PlcEntityInstance;
import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefault;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcUtil;
import com.powerlogic.jcompany.commons.util.metamodel.PlcMetamodelUtil;
import com.powerlogic.jcompany.controller.rest.conversors.PlcJsonRestRenderUtil;
import com.powerlogic.jcompany.controller.rest.projection.PlcProjection;
import com.powerlogic.jcompany.controller.rest.projection.PlcProjectionProperty;
import com.powerlogic.jcompany.controller.util.PlcI18nUtil;

/**
 * Sobrescrita para diminuir a profundidade do JSON.
 * @author Bruno Carneiro
 *
 */
@SPlcUtil
@Specializes
public class AppJsonRestRenderUtil extends PlcJsonRestRenderUtil {
	
	/**
	 * Nivel default de hierarquia utilizado na serializacao de objetos.
	 */
	private static final int DEFAULT_DEEP = 4;

	/**
	 * Formatação Simples de Data.
	 */
	private static SimpleDateFormat sdfDateTime = new SimpleDateFormat("dd/MM/yyyy HH:mm");

	@Inject
	protected Logger log;

	@Inject
	@QPlcDefault
	private PlcI18nUtil i18nUtil;

	@Inject
	private PlcProjection projection;

	@Inject
	@QPlcDefault
	protected PlcMetamodelUtil metamodelUtil;

	private Deque<String> propertyDeque = new LinkedList<String>();

	/**
	 * Concatena a propriedade especificada, de todos os objetos na lista, em
	 * uma string no formato: "valor1|valor2|..."
	 */
	public String createTextOutputWithPipes(List<?> lista, String propriedade) throws IllegalAccessException, InvocationTargetException, NoSuchMethodException {
		if (lista != null && !lista.isEmpty()) {
			StringBuilder out = new StringBuilder();
			PlcPrimaryKey chavePrimaria = lista.get(0).getClass().getAnnotation(PlcPrimaryKey.class);
			boolean isChaveNatura = chavePrimaria != null;
			for (Object vo : lista) {
				PlcEntityInstance<?> entityInstance = metamodelUtil.createEntityInstance(vo);
				if (!isChaveNatura) {
					out.append((String) PropertyUtils.getProperty(vo, propriedade) + "|" + entityInstance.getId() + getLineBreakString());
				} else {
					Object idNaturalDinamico = entityInstance.getIdNaturalDinamico();

					out.append((String) PropertyUtils.getProperty(vo, propriedade));

					String[] propriedades = chavePrimaria.propriedades();
					for (String upProp : propriedades) {
						Object property = PropertyUtils.getProperty(idNaturalDinamico, upProp);
						out.append("|").append(property != null ? property.toString() : " ");
					}
					out.append(getLineBreakString());
				}
			}
			return out.toString();
		}
		return StringUtils.EMPTY;
	}

	/**
	 * @see #buildString(StringBuilder, Object)
	 */
	public String createString(Object valor) {
		StringBuilder out = new StringBuilder();
		buildString(out, valor);
		return out.toString();
	}

	/**
	 * @see #buildString(StringBuilder, Object)
	 */
	public void createString(StringBuilder out, Object valor) {
		buildString(out, valor);
	}

	/**
	 * Escreve um valor como String ("valor").
	 * 
	 * @param out
	 *            Buffer para escrita.
	 * @param valor
	 *            Valor que deve ser escrito como String.
	 */
	public void buildString(StringBuilder out, Object valor) {
		String string = null;
		if (valor != null) {
			try{
				if (valor instanceof CharSequence) {
					string = valor.toString();
				} else if (valor instanceof Date) {
					string = sdfDateTime.format((Date) valor);
				} else if (valor instanceof Calendar) {
					string = sdfDateTime.format(((Calendar) valor).getTime());
				} else if (valor instanceof Map<?, ?> || valor instanceof Collection<?>) {
					string = null;
				} else if (valor instanceof BigDecimal) {
					string = valor.toString().replace(".", ",");
				} else {
					string = valor.toString().replace("'", "\'");
				}
			}catch(Exception e) {
				string="";
			}
		}
		// Faz scape do valor.
		if (string == null) {
			out.append(getNullString());
		} else {
			out.append(getQuotesString());
			if (string.length() > 0) {
				out.append(StringEscapeUtils.escapeJava(string));
			}
			out.append(getQuotesString());
		}
	}

	/**
	 * @see #buildCollection(StringBuilder, Collection, int)
	 */
	public String createCollection(Collection<? extends Object> colecao) {
		StringBuilder out = new StringBuilder();
		buildCollection(out, colecao, DEFAULT_DEEP);
		return out.toString();
	}

	/**
	 * @see #buildCollection(StringBuilder, Collection, int)
	 */
	public void createCollection(StringBuilder out, Collection<?> colecao) {
		buildCollection(out, colecao, DEFAULT_DEEP);
	}

	/**
	 * @see #buildCollection(StringBuilder, Collection, int)
	 */
	public void createCollection(StringBuilder out, Collection<?> colecao, int nivel) {
		buildCollection(out, colecao, nivel);
	}

	/**
	 * Serializa um coleção do tipo PlcEntityInstance no formato de um Array
	 * 
	 * @param str
	 *            StringBuilder onde sera serializado Objeto.
	 * @param collection
	 *            Colecao que deve ser serializado.
	 * 
	 * @see #buildObject(StringBuilder, Object, int)
	 */
	protected void buildCollection(StringBuilder out, Collection<?> collection, int deep) {
		openCollection(out);
		try{
			for (Object obj : collection) {
				addItem(out, obj, deep);
			}
		}
		catch(Exception ex){
			log.warn("Erro ao serializar a colecao. Provavel que esteja mapeada como LAZY. Ignorando a colecao.");
		}
		finally{
			closeCollection(out);
		}
	}

	/**
	 * @see #buildObject(StringBuilder, Object, int)
	 */
	public String createObject(Object objeto) {
		StringBuilder out = new StringBuilder();
		out.append(getOpenDocumentString());
		buildObject(out, objeto, DEFAULT_DEEP);
		out.append(getCloseDocumentString());
		return out.toString();
	}

	/**
	 * @see #buildObject(StringBuilder, Object, int)
	 */
	public void createObject(StringBuilder out, Object objeto) {
		buildObject(out, objeto, DEFAULT_DEEP);
	}

	/**
	 * @see #buildObject(StringBuilder, Object, int)
	 */
	public void createObject(StringBuilder out, Object objeto, int nivel) {
		buildObject(out, objeto, nivel);
	}

	/**
	 * Serializa um objeto no formato HTML
	 * 
	 * <code>{ lookup: "{@link PlcEntityInstance#toString()}", propriedade: valor, ... }</code>
	 * 
	 * @param str
	 *            StringBuilder onde sera serializado Objeto.
	 * @param obj
	 *            Objeto que deve ser serializado.
	 * @param selectItems
	 */
	protected void buildObject(StringBuilder out, Object obj, int deep) {
		if (deep < 1 || obj == null) {
			buildString(out, obj);
		} else if (isSimpleType(obj.getClass())) {
			buildString(out, obj);
		} else if (obj.getClass().isEnum()) {
			buildEnum(out, (Enum<?>) obj, deep);
		} else if (obj instanceof Map<?, ?>) {
			buildMap(out, (Map<?, ?>) obj, deep);
		} else if (obj instanceof Collection<?>) {
			buildCollection(out, (Collection<?>) obj, deep);
		} else {
			openObject(out);
			// Checa se for uma entidade.
			boolean isEntity = isEntity(obj);
			// Propriedade Lookup defaul para todas as entidades.
			if (isEntity) {
				addProperty(out, obj, "lookup", ObjectUtils.toString(obj), deep);
			}

			// Projeta todas as propriedades do POJO.
			for (PlcProjectionProperty property : getPropertyDescriptors(obj)) {
				// Entidades possuem atributos adicionais.
				if (isEntity && handleExtraProperty(property, out, obj, deep)) {
					continue;
				}
				// Ignora propriedades nao pertencentes ao dominio.
				if (!isValidProperty(obj, isEntity, property.toString())) {
					continue;
				}
				// Obtem o valor via GET!
				Object value = null;
				try {
					value = PropertyUtils.getProperty(obj, property.toString());
				} catch (Exception e) {
					log.warn("Erro ao serializar o objeto.");
				}
				if (isEntity && ("idNatural".equalsIgnoreCase(property.toString()) || isEntity(value) || isComponent(value))) {
					// propriedades de componentes devem ter o mesmo nivel do
					// Objeto atual.
					addProperty(out, obj, property.toString(), value, deep + 1);
				} else {
					addProperty(out, obj, property.toString(), value, deep);
				}
			}
			
			if (isEntity) {
				PlcEntityInstance<?> entityInstance = metamodelUtil.createEntityInstance(obj);
				addProperty(out, obj, "idAux", entityInstance.getIdAux(), deep);
				addProperty(out, obj, "linkEdicaoPlc", entityInstance.getLinkEdicaoPlc(), deep);
			}

			closeObject(out);
		}
	}

	private boolean handleExtraProperty(PlcProjectionProperty property, StringBuilder out, Object obj, int deep) {
		String name = property.getName();
		if (name != null && (name.equals("idAux") || name.equals("linkEdicaoPlc") || name.contains(".idAux") || name.contains(".linkEdicaoPlc"))) {
			return true;
		} else {
			return false;
		}
	}

	private List<PlcProjectionProperty> getPropertyDescriptors(Object obj) {
		List<PlcProjectionProperty> pdList = new ArrayList<PlcProjectionProperty>();
		for (PropertyDescriptor pd : PropertyUtils.getPropertyDescriptors(obj.getClass())) {
			pdList.add(new PlcProjectionProperty(null, pd.getName()));
		}
		return pdList;
	}

	/**
	 * @see #buildMap(StringBuilder, Map, int)
	 */
	public String createMapJ(Map<?, ?> map) {
		StringBuilder out = new StringBuilder();
		buildMap(out, map, DEFAULT_DEEP);
		return out.toString();
	}

	/**
	 * @see #buildMap(StringBuilder, Map, int)
	 */
	public void createMap(StringBuilder out, Map<?, ?> map) {
		buildMap(out, map, DEFAULT_DEEP);
	}

	/**
	 * @see #buildMap(StringBuilder, Map, int)
	 */
	public void createMap(StringBuilder out, Map<?, ?> map, int nivel) {
		buildMap(out, map, nivel);
	}

	/**
	 * Serializa um objeto do tipo Map <code>{ propriedade: valor, ... }</code>
	 */
	public void buildMap(StringBuilder out, Map<?, ?> map, int deep) {
		openObject(out);
		for (Entry<?, ?> entry : map.entrySet()) {
			addProperty(out, map, entry.getKey().toString(), entry.getValue(), deep);
		}
		closeObject(out);
	}

	public void buildEnum(StringBuilder out, Enum<?> e, int deep) {

		String msgPrefixo = StringUtils.uncapitalize(e.getDeclaringClass().getSimpleName()).concat(".");
		openObject(out);
		addProperty(out, e, "id", e.name(), deep);
		addProperty(out, e, "lookup", i18nUtil.getMessage(msgPrefixo.concat(e.name())), deep);
		closeObject(out);
	}

	/**
	 * @return true se o objeto especificado, for uma entidade.
	 * @see PlcMetamodelUtil
	 */
	protected boolean isEntity(Object obj) {
		return obj != null && metamodelUtil.isEntityClass(obj.getClass());
	}

	/**
	 * @return true se o objeto especificado, for uma componente.
	 */
	protected boolean isComponent(Object obj) {
		return obj != null && obj.getClass().isAnnotationPresent(Embeddable.class);
	}

	/**
	 * Verifica se um Objeto ï¿½ de um tipo Java Bï¿½sico (String, Numeros,
	 * Datas, Priomitivos e Enums).
	 */
	protected boolean isSimpleType(Class<?> type) {
		if (CharSequence.class.isAssignableFrom(type)) {
			return true;
		} else if (Date.class.isAssignableFrom(type)) {
			return true;
		} else if (Calendar.class.isAssignableFrom(type)) {
			return true;
		} else if (Number.class.isAssignableFrom(type)) {
			return true;
		} else if (Boolean.class.isAssignableFrom(type)) {
			return true;
		} else if (type.isPrimitive()) {
			return true;
		}
		return false;
	}

	/**
	 * Verifica se é uma propriedade válida.
	 * 
	 * @see #buildObject(StringBuilder, Object, int)
	 */
	protected boolean isValidProperty(Object obj, boolean isEntity, String name) {
		if (PropertyUtils.isReadable(obj, name)) {
			if ("class".equalsIgnoreCase(name)) {
				return false;
			} else if (isEntity) {
				if ("idNaturalDinamico".equalsIgnoreCase(name) || "arquivoAnexado".equalsIgnoreCase(name) || "nomePropriedadePlc".equalsIgnoreCase(name) || "agregadosLazyPlc".equalsIgnoreCase(name) || "propsChaveNaturalPlc".equalsIgnoreCase(name) || "propsIdPlc".equalsIgnoreCase(name)) {
					return false;
				}
			}
			return true;
		}
		return false;
	}

	/**
	 * Serializa uma propriedade no formato desejado.
	 * 
	 * @param out
	 *            Buffer para escrita.
	 * @param obj
	 *            Objeto que possui a propriedade
	 * @param name
	 *            Nome da propriedade.
	 * @param value
	 *            Valor da propriedade.
	 * @param deep
	 *            Nivel de escrita hierarquico.
	 * 
	 * @see #buildObject(StringBuilder, Object, int)
	 * @see #buildMap(StringBuilder, Map, int)
	 * @see #buildProperty(StringBuilder, Object, int)
	 */
	protected void addProperty(StringBuilder out, Object obj, String name, Object value, int deep) {
		propertyDeque.addLast(name);
		if (isProjectable()) {
			buidProperty(out, name, value, deep);
		}
		propertyDeque.removeLast();
	}

	/**
	 * @param out
	 *            Buffer para escrita.
	 * @param name
	 *            Nome da propriedade.
	 * @param value
	 *            Valor da propriedade.
	 * @param deep
	 *            Nivel de escrita hierarquico.
	 */
	protected void buidProperty(StringBuilder out, String name, Object value, int deep) {
		buildString(out, name);
		out.append(getOpenPropertyString());
		buildObject(out, value, deep - 1);
		out.append(getClosePropertyString());
	}

	/**
	 * Adiciona um item de uma colecao.
	 * 
	 * @see #buildCollection(StringBuilder, Collection, int)
	 */
	protected void addItem(StringBuilder out, Object obj, int deep) {
		buildItem(out, obj, deep);
	}

	/**
	 * Adiciona um item de uma colecao.
	 * 
	 * @see #buildCollection(StringBuilder, Collection, int)
	 */
	private void buildItem(StringBuilder out, Object obj, int deep) {
		out.append(getOpenItemString());
		buildObject(out, obj, deep - 1);
		out.append(getCloseItemString());
	}

	/**
	 * Abre uma colecao.
	 * 
	 * @see #buildCollection(StringBuilder, Collection, int)
	 */
	protected void openCollection(StringBuilder out) {
		out.append(getOpenCollectionString());
	}

	/**
	 * Fecha uma colecao.
	 * 
	 * @see #buildCollection(StringBuilder, Collection, int)
	 */
	protected void closeCollection(StringBuilder out) {
		// remove a ultima virgula, para nao dar erro de sintaxe [a,b,c,].
		fixLast(out);
		out.append(getCloseCollectionString());
	}

	/**
	 * Abre um objeto .
	 * 
	 * @see #buildObject(StringBuilder, Object, int)
	 */
	protected void openObject(StringBuilder out) {
		out.append(getOpenObjectString());
	}

	/**
	 * Fecha um objeto .
	 * 
	 * @see #buildObject(StringBuilder, Object, int)
	 */
	protected void closeObject(StringBuilder out) {
		// remove a ultima virgula, para nao dar erro de sintaxe {a:v,b:v,c:v,}.
		fixLast(out);
		out.append(getCloseObjectString());
	}

	/**
	 * Verifica se a propriedade da entidade é projetável, ou seja, se existe
	 * ela como parametro na opcao $select na url. Se não é escrito a opção
	 * $select, todas os atributos serao exibidos.
	 * 
	 * @return se a propriedade é projetável
	 */
	protected boolean isProjectable() {
		// Lista com atributos de select.
		PlcProjection projection = getProjection();
		// pilha completa do nome atual recursivamente.
		String propertyPath = getPropertyPath();
		// Não possui select específico.
		if (projection.getProperties().isEmpty()) {
			return true;
		}
		// Verifica se a propriedade esta no namespace alias.
		if (StringUtils.isNotEmpty(projection.getAlias()) && !projection.getAlias().equals(getPropertyDeque().getFirst())) {
			return true;
		}
		// Verifica se a propriedade deve ser projetada.
		String alias = StringUtils.isNotEmpty(projection.getAlias()) ? projection.getAlias().concat(".") : "";
		for (PlcProjectionProperty p : projection.getProperties()) {
			String property = alias + p;
			if (propertyPath.startsWith(property + ".") || property.startsWith(propertyPath + ".") || propertyPath.equals(property)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @return Propriedades aninhadas na
	 *         {@linkplain #addProperty(StringBuilder, Object, String, Object, int)
	 *         construção} de objetos aninhados.
	 * @see #addProperty(StringBuilder, Object, String, Object, int)
	 */
	protected Deque<String> getPropertyDeque() {
		return propertyDeque;
	}

	/**
	 * @return Aninhamento de propriedades concatenados com "."
	 * 
	 * @see #getPropertyDeque()
	 */
	protected String getPropertyPath() {
		return StringUtils.join(propertyDeque, ".");
	}

	/**
	 * @return Nome da propriedade corrente, adicionada na fila de propriedades.
	 * 
	 * @see #getPropertyDeque()
	 */
	protected String getPropertyName() {
		return getPropertyDeque().isEmpty() ? null : getPropertyDeque().getLast();
	}

	/**
	 * @return Tamanho da lista de propriedade aninhadas.
	 * 
	 * @see #getPropertyDeque()
	 */
	protected int getPropertyDeep() {
		return getPropertyDeque().size();
	}

	public PlcProjection getProjection() {
		return projection;
	}

	public void setProjection(PlcProjection projection) {
		this.projection = projection;
	}

	public PlcMetamodelUtil getMetamodelUtil() {
		return metamodelUtil;
	}

	public void setMetamodelUtil(PlcMetamodelUtil metamodelUtil) {
		this.metamodelUtil = metamodelUtil;
	}
	
	
	@Override
	public String getOpenItemString() {
		return "";
	}

	@Override
	public String getCloseItemString() {
		return ",";
	}

	@Override
	public String getOpenCollectionString() {
		return "[";
	}

	@Override
	public String getCloseCollectionString() {
		return "]";
	}

	@Override
	public String getOpenObjectString() {
		return "{";
	}

	@Override
	public String getCloseObjectString() {
		return "}";
	}

	@Override
	public String getNullString() {
		return "null";
	}

	@Override
	public String getLineBreakString() {
		return "\n";
	}

	@Override
	public String getQuotesString() {
		return "\"";
	}


	@Override
	public String getOpenPropertyString() {
		return ":";
	}

	@Override
	public String getClosePropertyString() {
		return ",";
	}


	@Override
	public String getOpenDocumentString() {
		return "";
	}

	@Override
	public String getCloseDocumentString() {
		return "";
	}

	@Override
	protected void fixLast(StringBuilder out) {
		// Fim do objeto, Limpa a ultima virgula.
		if (out.charAt(out.length() - 1) == ',') {
			out.setLength(out.length() - 1);
		}
	}

}
