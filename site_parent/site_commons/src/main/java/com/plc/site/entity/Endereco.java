package com.plc.site.entity;


import java.io.Serializable;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import com.powerlogic.jcompany.domain.validation.PlcUnifiedValidation;
import javax.persistence.Column;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.persistence.Access;
import javax.persistence.Embeddable;
import javax.persistence.AccessType;

/**
 * @author Bruno Carneiro
 */

@Embeddable
@Access(AccessType.FIELD)

@PlcUnifiedValidation
@NamedQueries({
	@NamedQuery(name="Endereco.querySelLookup", query="select logradouro as logradouro from Endereco where id = ? order by logradouro asc")
})
public class Endereco  implements Serializable {
	
	
	@NotNull
	@Size(max = 100)
	@Column
	private String logradouro;
	
	@NotNull
	@Size(max = 8)
	@Column
	@Digits(fraction = 0, integer = 8)
	private String cep;
	
	@NotNull
	@Size(max = 7)
	@Column
	private String numero;
	
	@NotNull
	@Size(max = 7)
	@Column
	private String complemento;
	
	@NotNull
	@Size(max = 40)
	@Column
	private String bairro;
	
	@NotNull
	@Size(max = 40)
	@Column
	private String cidade;
	
	@NotNull
	@Size(max = 40)
	@Column
	private String estado;
	
	@Column
	private Double longitude;
	
	@Column
	private Double latitude;
	

	public Endereco() {
	}
	public String getLogradouro() {
		return logradouro;
	}

	public void setLogradouro(String logradouro) {
		this.logradouro=logradouro;
	}

	public String getCep() {
		return cep;
	}

	public void setCep(String cep) {
		this.cep=cep;
	}

	public String getNumero() {
		return numero;
	}

	public void setNumero(String numero) {
		this.numero=numero;
	}

	public String getComplemento() {
		return complemento;
	}

	public void setComplemento(String complemento) {
		this.complemento=complemento;
	}

	public String getBairro() {
		return bairro;
	}

	public void setBairro(String bairro) {
		this.bairro=bairro;
	}

	public String getCidade() {
		return cidade;
	}

	public void setCidade(String cidade) {
		this.cidade=cidade;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado=estado;
	}

	@Override
	public String toString() {
		return getLogradouro();
	}
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	
	
}
