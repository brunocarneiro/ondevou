package com.plc.site.entity;



import java.io.Serializable;
import java.util.Date;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.powerlogic.jcompany.commons.config.stereotypes.SPlcEntity;
import com.powerlogic.jcompany.domain.validation.PlcUnifiedValidation;
import java.util.List;
import javax.persistence.OneToMany;
import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import org.hibernate.annotations.ForeignKey;

/**
 * @author Bruno Carneiro
 */

@SPlcEntity
@Entity
@Table(name="LUGAR")
@SequenceGenerator(name="SE_LUGAR", sequenceName="SE_LUGAR")
@Access(AccessType.FIELD)

@PlcUnifiedValidation
@NamedQueries({
	@NamedQuery(name="Lugar.queryMan", query="from Lugar"),
	@NamedQuery(name="Lugar.querySel", query="select id as id, nome as nome, endereco.logradouro as endereco_logradouro, endereco.cep as endereco_cep, endereco.numero as endereco_numero, endereco.complemento as endereco_complemento, endereco.bairro as endereco_bairro, endereco.cidade as endereco_cidade, endereco.estado as endereco_estado, resenha as resenha, twitter as twitter, telefone as telefone, urlFoto as urlFoto from Lugar order by nome asc"),
	@NamedQuery(name="Lugar.querySelLookup", query="select id as id, nome as nome, urlFoto as urlFoto from Lugar where id = ? order by id asc")
})
public class Lugar  implements Serializable {

	


	
	@Id 
 	@GeneratedValue(strategy=GenerationType.AUTO, generator = "SE_LUGAR")
	@Column(nullable=false,length=5)
	private Long id;

	@NotNull
	@Size(max = 100)
	@Column
	private String nome;

	@Embedded
	private Endereco endereco;

	@Size(max = 5000)
	@Column
	private String resenha;

	@Size(max = 20)
	@Column
	private String twitter;

	@Size(max = 15)
	@Column
	private String telefone;
	
	//  private TipoLugar tipoLugar;

//  private EstiloLugar estilo;
	
	@Size(max = 2000)
	@Column
	private String urlFoto;
  
	@OneToMany (targetEntity = AgendaDia.class, fetch = FetchType.LAZY, cascade=CascadeType.ALL, mappedBy="lugar")
	@ForeignKey(name="FK_AGENDADIA_LUGAR")
	private List<AgendaDia> agendaDia;

	@Version
	@NotNull
	@Column(length=5)
	private int versao;
	
	@Column(length=11)
	@Temporal(TemporalType.TIMESTAMP)
	private Date dataUltAlteracao = new Date();
	
	@Column
	private String usuarioUltAlteracao = "";
	
	@OneToMany (targetEntity = LugarUsuario.class, fetch = FetchType.LAZY, cascade=CascadeType.ALL, mappedBy="lugar")
	@ForeignKey(name="FK_LUGAR_USUARIO")
    private List<LugarUsuario>  lugarUsuario;
	
	@ManyToOne
	private Usuario proprietario;
	
//  private List<LugarUsuario>  myLugarAvaliado;
//  private List<LugarVisitado>  myLugarVisitado;
//  private List<LugarFavorito>  myLugarFavorito;
//  private List<AgendaDia> myAgendaDia;
//  private List<LugarDesejado>  myLugarDesejado;
	
	@Column
	private String tags;

	public Lugar() {
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

	public Endereco getEndereco() {
		return endereco;
	}

	public void setEndereco(Endereco endereco) {
		this.endereco=endereco;
	}

	public String getResenha() {
		return resenha;
	}

	public void setResenha(String resenha) {
		this.resenha=resenha;
	}

	public String getTwitter() {
		return twitter;
	}

	public void setTwitter(String twitter) {
		this.twitter=twitter;
	}

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone=telefone;
	}

	public String getUrlFoto() {
		return urlFoto;
	}

	public void setUrlFoto(String urlFoto) {
		this.urlFoto=urlFoto;
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

	public List<AgendaDia> getAgendaDia() {
		return agendaDia;
	}

	public void setAgendaDia(List<AgendaDia> agendaDia) {
		this.agendaDia=agendaDia;
	}

	public List<LugarUsuario> getLugarUsuario() {
		return lugarUsuario;
	}

	public void setLugarUsuario(List<LugarUsuario> lugarUsuario) {
		this.lugarUsuario = lugarUsuario;
	}

	public Usuario getProprietario() {
		return proprietario;
	}

	public void setProprietario(Usuario proprietario) {
		this.proprietario = proprietario;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}
	
	
	

	
}