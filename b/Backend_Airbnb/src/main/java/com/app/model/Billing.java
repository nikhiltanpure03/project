package com.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Billing {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String guestName;
	private String guestType;
	private String mobileNumber;
	private String idProofType;
	private String idProofNumber;
	private Integer guests;

	public Billing() {
	}

	public Integer getId() { return id; }
	public void setId(Integer id) { this.id = id; }
	public String getGuestName() { return guestName; }
	public void setGuestName(String guestName) { this.guestName = guestName; }
	public String getGuestType() { return guestType; }
	public void setGuestType(String guestType) { this.guestType = guestType; }
	public String getMobileNumber() { return mobileNumber; }
	public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
	public String getIdProofType() { return idProofType; }
	public void setIdProofType(String idProofType) { this.idProofType = idProofType; }
	public String getIdProofNumber() { return idProofNumber; }
	public void setIdProofNumber(String idProofNumber) { this.idProofNumber = idProofNumber; }
	public Integer getGuests() { return guests; }
	public void setGuests(Integer guests) { this.guests = guests; }
}
