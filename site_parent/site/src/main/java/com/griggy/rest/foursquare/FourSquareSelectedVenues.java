package com.griggy.rest.foursquare;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ConversationScoped;

import com.plc.site.entity.Lugar;

@ConversationScoped
public class FourSquareSelectedVenues implements Serializable {

	private List<Lugar> lugares;
	
	@PostConstruct
	public void init() {
		lugares=new ArrayList<Lugar>();
	}

	public List<Lugar> getLugares() {
		return lugares;
	}

	public void setLugares(List<Lugar> lugares) {
		this.lugares = lugares;
	}
	
	
	
}
