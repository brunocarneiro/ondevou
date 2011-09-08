package com.plc.site.entity;


import java.io.Serializable;
import java.util.Date;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import com.powerlogic.jcompany.domain.validation.PlcUnifiedValidation;
import javax.persistence.ManyToOne;
import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.persistence.TemporalType;
import javax.persistence.Id;
import javax.persistence.Version;
import javax.persistence.GenerationType;
import org.hibernate.annotations.ForeignKey;
import javax.persistence.Temporal;
import javax.validation.constraints.Size;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.GeneratedValue;
import javax.persistence.Access;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.AccessType;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcEntity;
import com.powerlogic.jcompany.config.domain.PlcReference;

import javax.persistence.Entity;
import javax.persistence.Transient;

/**
 * @author Bruno Carneiro
 */

@SPlcEntity
@Entity
@Table(name="AMIZADE")
@SequenceGenerator(name="SE_AMIZADE", sequenceName="SE_AMIZADE")
@Access(AccessType.FIELD)

@PlcUnifiedValidation
@NamedQueries({
	@NamedQuery(name="Amizade.querySel", query="select a.id as id, a.usuario2 as usuario2, a.usuario1 as usuario1 from Amizade a"),
	@NamedQuery(name="Amizade.querySelLookup", query="select a.id as id, a.usuario2 as usuario2, a.usuario1 as usuario1 from Amizade a where id = ? order by id asc")
})
public class Amizade  implements Serializable {

	
	@Id 
 	@GeneratedValue(strategy=GenerationType.AUTO, generator = "SE_AMIZADE")
	@Column(nullable=false,length=5)
	private Long id;
	
	@Version
	@NotNull
	@Column(length=5)
	private int versao;
	
	@NotNull
	@Column(length=11)
	@Temporal(TemporalType.TIMESTAMP)
	private Date dataUltAlteracao = new Date();
	
	@NotNull
	@Size(max = 5)
	@Column
	private String usuarioUltAlteracao = "";
	
	@ManyToOne (targetEntity = Usuario.class, fetch = FetchType.LAZY)
	@ForeignKey(name="FK_AMIZADE_USUARIO1")
	@JoinColumn
	private Usuario usuario1;
    
    @PlcReference
	@ManyToOne (targetEntity = Usuario.class, fetch = FetchType.LAZY)
	@ForeignKey(name="FK_AMIZADE_USUARIO2")
	@JoinColumn
	private Usuario usuario2;

	public Amizade() {
	}
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id=id;
	}

	public Usuario getUsuario1() {
		return usuario1;
	}

	public void setUsuario1(Usuario usuario1) {
		this.usuario1=usuario1;
	}

	public Usuario getUsuario2() {
		return usuario2;
	}

	public void setUsuario2(Usuario usuario2) {
		this.usuario2=usuario2;
	}

	public int getVersao() {
		return versao;
	}

	public void setVersao(int versao) {
		this.versao=versao;
	}

	public Date getDataUltAlteracao() {
		return dataUltAlteracao;
	}

	public void setDataUltAlteracao(Date dataUltAlteracao) {
		this.dataUltAlteracao=dataUltAlteracao;
	}

	public String getUsuarioUltAlteracao() {
		return usuarioUltAlteracao;
	}

	public void setUsuarioUltAlteracao(String usuarioUltAlteracao) {
		this.usuarioUltAlteracao=usuarioUltAlteracao;
	}

	@Override
	public String toString() {
		return getUsuario1().toString();
	}

	@Transient
	private transient String indExcPlc = "N";	

	public void setIndExcPlc(String indExcPlc) {
		this.indExcPlc = indExcPlc;
	}

	public String getIndExcPlc() {
		return indExcPlc;
	}

}