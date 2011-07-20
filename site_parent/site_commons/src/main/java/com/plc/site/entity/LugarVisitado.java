package com.plc.site.entity;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

import com.powerlogic.jcompany.commons.config.stereotypes.SPlcEntity;
import com.powerlogic.jcompany.domain.validation.PlcUnifiedValidation;


/**
 * @author Bruno Carneiro
 */

@SPlcEntity
@Entity
@DiscriminatorValue("V")
@Access(AccessType.FIELD)
@PlcUnifiedValidation

public class LugarVisitado extends LugarUsuario {


}