package com.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String currency;
	private Integer nightlyPrice;
	private Integer subtotal;
	private Integer serviceFee;
	private Integer taxes;
	private Integer totalPaid;
	private String cardLastFour;
	private String status;

	public Payment() {
	}

	public Integer getId() { return id; }
	public void setId(Integer id) { this.id = id; }
	public String getCurrency() { return currency; }
	public void setCurrency(String currency) { this.currency = currency; }
	public Integer getNightlyPrice() { return nightlyPrice; }
	public void setNightlyPrice(Integer nightlyPrice) { this.nightlyPrice = nightlyPrice; }
	public Integer getSubtotal() { return subtotal; }
	public void setSubtotal(Integer subtotal) { this.subtotal = subtotal; }
	public Integer getServiceFee() { return serviceFee; }
	public void setServiceFee(Integer serviceFee) { this.serviceFee = serviceFee; }
	public Integer getTaxes() { return taxes; }
	public void setTaxes(Integer taxes) { this.taxes = taxes; }
	public Integer getTotalPaid() { return totalPaid; }
	public void setTotalPaid(Integer totalPaid) { this.totalPaid = totalPaid; }
	public String getCardLastFour() { return cardLastFour; }
	public void setCardLastFour(String cardLastFour) { this.cardLastFour = cardLastFour; }
	public String getStatus() { return status; }
	public void setStatus(String status) { this.status = status; }
}
