package com.app.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Transient;

@Entity
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private Integer listingId;
	private String listingTitle;
	private LocalDate checkIn;
	private LocalDate checkOut;
	private LocalDateTime createdAt;
	private String status;

	@Transient
	@JsonProperty(value = "listing", access = JsonProperty.Access.WRITE_ONLY)
	private Airbnb listingData;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "airbnb_id", nullable = false)
	private Airbnb airbnb;

	@OneToOne(cascade = CascadeType.ALL)
	private Billing billing;

	@OneToOne(cascade = CascadeType.ALL)
	private Payment payment;

	public Booking() {
	}

	public Integer getId() { return id; }
	public void setId(Integer id) { this.id = id; }
	public Integer getListingId() { return listingId; }
	public void setListingId(Integer listingId) { this.listingId = listingId; }
	public String getListingTitle() { return listingTitle; }
	public void setListingTitle(String listingTitle) { this.listingTitle = listingTitle; }
	public LocalDate getCheckIn() { return checkIn; }
	public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }
	public LocalDate getCheckOut() { return checkOut; }
	public void setCheckOut(LocalDate checkOut) { this.checkOut = checkOut; }
	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
	public String getStatus() { return status; }
	public void setStatus(String status) { this.status = status; }
	public Airbnb getListingData() { return listingData; }
	public void setListingData(Airbnb listingData) { this.listingData = listingData; }
	public Airbnb getAirbnb() { return airbnb; }
	public void setAirbnb(Airbnb airbnb) { this.airbnb = airbnb; }
	public Billing getBilling() { return billing; }
	public void setBilling(Billing billing) { this.billing = billing; }
	public Payment getPayment() { return payment; }
	public void setPayment(Payment payment) { this.payment = payment; }
}
