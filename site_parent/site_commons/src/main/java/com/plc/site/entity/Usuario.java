package com.plc.site.entity;

import java.util.Date;
import java.io.Serializable;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import com.powerlogic.jcompany.domain.validation.PlcUnifiedValidation;
import javax.persistence.EnumType;
import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.persistence.TemporalType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.Transient;
import javax.persistence.Version;
import javax.persistence.Embedded;
import javax.validation.constraints.Size;
import javax.persistence.GenerationType;
import javax.persistence.GeneratedValue;
import javax.persistence.Access;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.AccessType;
import com.powerlogic.jcompany.commons.config.stereotypes.SPlcEntity;
import javax.persistence.Entity;
import java.util.List;
import javax.persistence.OneToMany;
import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import org.hibernate.annotations.ForeignKey;
import org.hibernate.validator.constraints.Email;

/**
 * @author Bruno Carneiro
 */

@SPlcEntity
@Entity
@Table(name="USUARIO")
@SequenceGenerator(name="SE_USUARIO", sequenceName="SE_USUARIO")
@Access(AccessType.FIELD)

@PlcUnifiedValidation
@NamedQueries({
	@NamedQuery(name="Usuario.queryMan", query="from Usuario"),
	@NamedQuery(name="Usuario.querySel", query="select id as id, nome as nome, sobrenome as sobrenome, email as email, senha as senha, twitter as twitter, urlFoto as urlFoto, endereco.logradouro as endereco_logradouro, endereco.cep as endereco_cep, endereco.numero as endereco_numero, endereco.complemento as endereco_complemento, endereco.bairro as endereco_bairro, endereco.cidade as endereco_cidade, endereco.estado as endereco_estado, estadoCivil as estadoCivil, dataNascimento as dataNascimento, sexo as sexo, orientacaoSexual as orientacaoSexual, profissao as profissao from Usuario order by nome asc"),
	@NamedQuery(name="Usuario.querySelLookup", query="select id as id, nome as nome from Usuario where id = ? order by id asc")
})
public class Usuario  implements Serializable {



	
	@Id 
 	@GeneratedValue(strategy=GenerationType.AUTO, generator = "SE_USUARIO")
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
	@Size(max = 100)
	@Column
	private String nome;

  
	@NotNull
	@Size(max = 100)
	@Column
	private String sobrenome;

  
	@NotNull
	@Size(max = 255)
	@Column
	@Email
	private String email;

  
	@NotNull
	@Size(max = 100)
	@Column
	private String senha;

  
	@NotNull
	@Size(max = 30)
	@Column
	private String twitter;

  
	@NotNull
	@Size(max = 2000)
	@Column
	private String urlFoto;

  
	@Embedded
	private Endereco endereco;

  
	@Enumerated(EnumType.STRING)
	@NotNull
	@Column(length=1)
	private EstadoCivil estadoCivil;

  
	@NotNull
	@Column(length=11)
	@Temporal(TemporalType.TIMESTAMP)
	private Date dataNascimento;

  
	@Enumerated(EnumType.STRING)
	@NotNull
	@Column(length=1)
	private Sexo sexo;

  
	@Enumerated(EnumType.STRING)
	@NotNull
	@Column(length=1)
	private OrientacaoSexual orientacaoSexual;

  
	@NotNull
	@Size(max = 5)
	@Column
	private String profissao;
	
	@OneToMany (targetEntity = AgendaDia.class, fetch = FetchType.LAZY, cascade=CascadeType.ALL, mappedBy="usuario")
	@ForeignKey(name="FK_AGENDADIA_USUARIO")
	private List<AgendaDia> agendaDia;
	
	@OneToMany (targetEntity = Amizade.class, fetch = FetchType.EAGER, cascade=CascadeType.ALL, mappedBy="usuario1")
	@ForeignKey(name="FK_AMIZADE_USUARIO1")
	private List<Amizade> amizades;

	@OneToMany (targetEntity = LugarUsuario.class, fetch = FetchType.LAZY, cascade=CascadeType.ALL, mappedBy="usuario")
	@ForeignKey(name="FK_LUGAR_USUARIO")
    private List<LugarUsuario>  lugarUsuario;

	@Transient
    private List<LugarVisitado>  lugaresVisitados;
   
	@Transient
    private List<LugarFavorito>  lugaresFavoritos;
  
	@Transient
    private List<LugarDesejado> lugaresDesejados;

	public Usuario() {
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

	public String getSobrenome() {
		return sobrenome;
	}

	public void setSobrenome(String sobrenome) {
		this.sobrenome=sobrenome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email=email;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha=senha;
	}

	public String getTwitter() {
		return twitter;
	}

	public void setTwitter(String twitter) {
		this.twitter=twitter;
	}

	public String getUrlFoto() {
		return urlFoto;
	}

	public void setUrlFoto(String urlFoto) {
		this.urlFoto=urlFoto;
	}

	public Endereco getEndereco() {
		return endereco;
	}

	public void setEndereco(Endereco endereco) {
		this.endereco=endereco;
	}

	public EstadoCivil getEstadoCivil() {
		return estadoCivil;
	}

	public void setEstadoCivil(EstadoCivil estadoCivil) {
		this.estadoCivil=estadoCivil;
	}

	public Date getDataNascimento() {
		return dataNascimento;
	}

	public void setDataNascimento(Date dataNascimento) {
		this.dataNascimento=dataNascimento;
	}

	public Sexo getSexo() {
		return sexo;
	}

	public void setSexo(Sexo sexo) {
		this.sexo=sexo;
	}

	public OrientacaoSexual getOrientacaoSexual() {
		return orientacaoSexual;
	}

	public void setOrientacaoSexual(OrientacaoSexual orientacaoSexual) {
		this.orientacaoSexual=orientacaoSexual;
	}

	public String getProfissao() {
		return profissao;
	}

	public void setProfissao(String profissao) {
		this.profissao=profissao;
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

	public List<Amizade> getAmizade() {
		return amizades;
	}

	public void setAmizade(List<Amizade> amizade) {
		this.amizades=amizade;
	}

	public List<AgendaDia> getAgendaDia() {
		return agendaDia;
	}

	public void setAgendaDia(List<AgendaDia> agendaDia) {
		this.agendaDia=agendaDia;
	}

	public List<Amizade> getAmizades() {
		return amizades;
	}

	public void setAmizades(List<Amizade> amizades) {
		this.amizades = amizades;
	}

	public List<LugarUsuario> getLugarUsuario() {
		return lugarUsuario;
	}

	public void setLugarUsuario(List<LugarUsuario> lugarUsuario) {
		this.lugarUsuario = lugarUsuario;
	}

	public List<LugarVisitado> getLugaresVisitados() {
		return lugaresVisitados;
	}

	public void setLugaresVisitados(List<LugarVisitado> lugaresVisitados) {
		this.lugaresVisitados = lugaresVisitados;
	}

	public List<LugarFavorito> getLugaresFavoritos() {
		return lugaresFavoritos;
	}

	public void setLugaresFavoritos(List<LugarFavorito> lugaresFavoritos) {
		this.lugaresFavoritos = lugaresFavoritos;
	}

	public List<LugarDesejado> getLugaresDesejados() {
		return lugaresDesejados;
	}

	public void setLugaresDesejados(List<LugarDesejado> lugaresDesejados) {
		this.lugaresDesejados = lugaresDesejados;
	}
	
	

}