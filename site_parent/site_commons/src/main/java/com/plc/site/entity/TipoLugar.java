package com.plc.site.entity;


import java.io.Serializable;
import java.util.Date;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import com.powerlogic.jcompany.domain.validation.PlcUnifiedValidation;
import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.persistence.TemporalType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.Version;
import javax.validation.constraints.Size;
import javax.persistence.GenerationType;
import javax.persistence.GeneratedValue;
import javax.persistence.Access;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.AccessType;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcEntity;
import javax.persistence.Entity;

/**
 * @author Bruno Carneiro
 */

@SPlcEntity
@Entity
@Table(name="TIPO_LUGAR")
@SequenceGenerator(name="SE_TIPO_LUGAR", sequenceName="SE_TIPO_LUGAR")
@Access(AccessType.FIELD)

@PlcUnifiedValidation
@NamedQueries({
	@NamedQuery(name="TipoLugar.querySelLookup", query="select id as id, nome as nome from TipoLugar where id = ? order by id asc")
})
public class TipoLugar  implements Serializable {

	
	@Id 
 	@GeneratedValue(strategy=GenerationType.AUTO, generator = "SE_TIPO_LUGAR")
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


	
	@NotNull
	@Size(max = 40)
	@Column
	private String nome;
	
	@Size(max = 500)
	@Column
	private String descricao;
	
	
	
	public TipoLugar() {
	}
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id=id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome=nome;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao=descricao;
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
		return getNome();
	}

}
