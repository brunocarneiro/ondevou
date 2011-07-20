package com.plc.site.entity;


import java.io.Serializable;
import java.util.List;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.ForeignKey;

import com.powerlogic.jcompany.commons.config.stereotypes.SPlcEntity;
import com.powerlogic.jcompany.domain.validation.PlcUnifiedValidation;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;


/**
 * @author Bruno Carneiro
 */

@SPlcEntity
@Entity
@Table(name="LUGAR_USUARIO")
@SequenceGenerator(name="SE_LUGAR_USUARIO", sequenceName="SE_LUGAR_USUARIO")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@Access(AccessType.FIELD)

@PlcUnifiedValidation
@NamedQueries({
	@NamedQuery(name="LugarUsuario.queryMan", query="from LugarUsuario"),
	@NamedQuery(name="LugarUsuario.querySel", query="select obj.id as id, obj1.id as usuario_id , obj1.nome as usuario_nome, obj2.id as lugar_id , obj2.nome as lugar_nome from LugarUsuario obj left outer join obj.usuario as obj1 left outer join obj.lugar as obj2 order by obj.id asc")
})
public class LugarUsuario  implements Serializable {

	private transient String lugarAuxLookup;


	
	@Id @GeneratedValue(strategy=GenerationType.TABLE)
	@Column(nullable=false,length=5)
	private Long id;


	
	@ManyToOne (targetEntity = Usuario.class, fetch = FetchType.LAZY)
	@ForeignKey(name="FK_LUGARUSUARIO_USUARIO")
	@JoinColumn
	private Usuario usuario;
	
	@ManyToOne (targetEntity = Lugar.class, fetch = FetchType.LAZY)
	@ForeignKey(name="FK_LUGARUSUARIO_LUGAR")
	@JoinColumn
	private Lugar lugar;
	
	@Column
	private Boolean visitado;
	
	@Column
	private Boolean desejado;
	
	@Column
	private Boolean favorito;
	
	@Column(length=3000)
	private String comentario;
	
	@Column(length=3000)
	private String dica;
	
	@Column
	private Integer nota;
	
	@Column
	private Integer preco;
	
	@Column
	private Integer notaAmbiente;
	
	@Column
	private Integer notaAtendimento;
	
	@Column
	private Integer notaComida;
	
	@Column
	private Integer notaBebida;
	
	@Column
	private Integer notaCustoBeneficio;
	
	//por enquanto esta transient, tem que tirar que vai
	//ser as fotos postadas por um usuario
	private transient List<String> fotoLugar;
	
	
	public LugarUsuario() {
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id=id;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario=usuario;
	}

	public Lugar getLugar() {
		return lugar;
	}

	public void setLugar(Lugar lugar) {
		this.lugar=lugar;
	}


	public void setLugarAuxLookup(String lugarAuxLookup) {
		this.lugarAuxLookup=lugarAuxLookup;
	}
	
	@Transient
	private transient String indExcPlc = "N";	

	public void setIndExcPlc(String indExcPlc) {
		this.indExcPlc = indExcPlc;
	}

	public String getIndExcPlc() {
		return indExcPlc;
	}

	public Boolean getVisitado() {
		return visitado;
	}

	public void setVisitado(Boolean visitado) {
		this.visitado = visitado;
	}

	public Boolean getDesejado() {
		return desejado;
	}

	public void setDesejado(Boolean desejado) {
		this.desejado = desejado;
	}

	public Boolean getFavorito() {
		return favorito;
	}

	public void setFavorito(Boolean favorito) {
		this.favorito = favorito;
	}

	public String getComentario() {
		return comentario;
	}

	public void setComentario(String comentario) {
		this.comentario = comentario;
	}

	public String getDica() {
		return dica;
	}

	public void setDica(String dica) {
		this.dica = dica;
	}

	public Integer getNota() {
		return nota;
	}

	public void setNota(Integer nota) {
		this.nota = nota;
	}

	public Integer getPreco() {
		return preco;
	}

	public void setPreco(Integer preco) {
		this.preco = preco;
	}

	public Integer getNotaAmbiente() {
		return notaAmbiente;
	}

	public void setNotaAmbiente(Integer notaAmbiente) {
		this.notaAmbiente = notaAmbiente;
	}

	public Integer getNotaAtendimento() {
		return notaAtendimento;
	}

	public void setNotaAtendimento(Integer notaAtendimento) {
		this.notaAtendimento = notaAtendimento;
	}

	public Integer getNotaComida() {
		return notaComida;
	}

	public void setNotaComida(Integer notaComida) {
		this.notaComida = notaComida;
	}

	public Integer getNotaBebida() {
		return notaBebida;
	}

	public void setNotaBebida(Integer notaBebida) {
		this.notaBebida = notaBebida;
	}

	public Integer getNotaCustoBeneficio() {
		return notaCustoBeneficio;
	}

	public void setNotaCustoBeneficio(Integer notaCustoBeneficio) {
		this.notaCustoBeneficio = notaCustoBeneficio;
	}

	public List<String> getFotoLugar() {
		return fotoLugar;
	}

	public void setFotoLugar(List<String> fotoLugar) {
		this.fotoLugar = fotoLugar;
	}

	public String getLugarAuxLookup() {
		return lugarAuxLookup;
	}
	
	
	

}
