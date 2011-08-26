package com.plc.site.entity;


import java.io.Serializable;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import com.powerlogic.jcompany.domain.validation.PlcUnifiedValidation;
import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.persistence.Access;
import javax.persistence.Embeddable;
import javax.persistence.AccessType;
import javax.persistence.Transient;

@Embeddable
@Access(AccessType.FIELD)

@PlcUnifiedValidation
@NamedQueries({
	@NamedQuery(name="UsuarioFacebook.querySelLookup", query="select idFacebook as idFacebook from UsuarioFacebook where id = ? order by idFacebook asc")
})
public class UsuarioFacebook  implements Serializable {

	public UsuarioFacebook() {
		
	}
	
	@NotNull
	@Size(max = 1000)
	@Column
	private String accessToken;
	
	@NotNull
	@Size(max = 5)
	@Column
	private String idFacebook;
    
	@NotNull
	@Size(max = 5)
	@Column
	private String firstName;
    
	@NotNull
	@Size(max = 5)
	@Column
	private String lastName;
    
	@NotNull
	@Size(max = 5)
	@Column
	private String emailFacebook;
	
 
	
	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getIdFacebook() {
		return idFacebook;
	}

	public void setIdFacebook(String idFacebook) {
		this.idFacebook=idFacebook;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName=firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName=lastName;
	}

	public String getEmailFacebook() {
		return emailFacebook;
	}

	public void setEmailFacebook(String email) {
		this.emailFacebook=email;
	}
	
	@Override
	public String toString() {
		return getIdFacebook();
	}

	
}
