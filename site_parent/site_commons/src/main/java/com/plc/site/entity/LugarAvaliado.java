package com.plc.site.entity;


import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.powerlogic.jcompany.commons.config.stereotypes.SPlcEntity;
import com.powerlogic.jcompany.domain.validation.PlcUnifiedValidation;

/**
 * @author Bruno Carneiro
 */

@SPlcEntity
@Entity
@DiscriminatorValue("A")
@Access(AccessType.FIELD)
@PlcUnifiedValidation

public class LugarAvaliado extends LugarUsuario{

	
	@NotNull
	@Column(length=2)
	private Integer valorNota;
	
	@NotNull
	@Size(max = 5000)
	@Column
	private String comentario;

	public LugarAvaliado() {
	}
	
	public Integer getValorNota() {
		return valorNota;
	}

	public void setValorNota(Integer valorNota) {
		this.valorNota=valorNota;
	}

	public String getComentario() {
		return comentario;
	}

	public void setComentario(String comentario) {
		this.comentario=comentario;
	}

	@Override
	public String toString() {
		return getComentario();
	}

}