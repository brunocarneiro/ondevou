package com.plc.site.entity;

import java.util.Date;
import java.io.Serializable;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import com.powerlogic.jcompany.domain.validation.PlcUnifiedValidation;
import javax.persistence.ManyToOne;
import javax.persistence.Column;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;
import javax.persistence.TemporalType;
import javax.persistence.Id;
import javax.persistence.Version;
import javax.persistence.GenerationType;
import org.hibernate.annotations.ForeignKey;
import javax.persistence.Temporal;
import javax.validation.constraints.Size;
import javax.persistence.JoinColumn;
import javax.persistence.FetchType;
import com.powerlogic.jcompany.config.domain.PlcReference;
import javax.persistence.GeneratedValue;
import javax.persistence.Access;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.AccessType;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcEntity;
import javax.persistence.Entity;
import javax.persistence.Transient;
import javax.persistence.MappedSuperclass;

/**
 * @author Bruno Carneiro
 */

@SPlcEntity
@Entity
@Table(name="AGENDA_DIA")
@SequenceGenerator(name="SE_AGENDA_DIA", sequenceName="SE_AGENDA_DIA")
@Access(AccessType.FIELD)

@PlcUnifiedValidation
@NamedQueries({
	@NamedQuery(name="AgendaDia.querySelLookup", query="select id as id, data as data from AgendaDia where id = ? order by id asc")
})
public class AgendaDia  implements Serializable {

	private transient String usuarioAuxLookup;


	private transient String lugarAuxLookup;


	
	@Id 
 	@GeneratedValue(strategy=GenerationType.AUTO, generator = "SE_AGENDA_DIA")
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
	
	@ManyToOne (targetEntity = Lugar.class, fetch = FetchType.LAZY)
	@ForeignKey(name="FK_AGENDADIA_LUGAR")
	@JoinColumn
	private Lugar lugar;
	
	@ManyToOne (targetEntity = Usuario.class, fetch = FetchType.LAZY)
	@ForeignKey(name="FK_AGENDADIA_USUARIO")
	@JoinColumn
	private Usuario usuario;

	@Future
	@Column(length=11)
	@PlcReference(testDuplicity=true)
	@Temporal(TemporalType.TIMESTAMP)
	private Date data;

	public AgendaDia() {
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id=id;
	}

	public Date getData() {
		return data;
	}

	public void setData(Date data) {
		this.data=data;
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

	public Lugar getLugar() {
		return lugar;
	}

	public void setLugar(Lugar lugar) {
		this.lugar=lugar;
	}

	@Override
	public String toString() {
		return getData().toString();
	}

	@Transient
	private transient String indExcPlc = "N";	

	public void setIndExcPlc(String indExcPlc) {
		this.indExcPlc = indExcPlc;
	}

	public String getIndExcPlc() {
		return indExcPlc;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario=usuario;
	}


	public void setLugarAuxLookup(String lugarAuxLookup) {
		this.lugarAuxLookup=lugarAuxLookup;
	}


	public void setUsuarioAuxLookup(String usuarioAuxLookup) {
		this.usuarioAuxLookup=usuarioAuxLookup;
	}

}