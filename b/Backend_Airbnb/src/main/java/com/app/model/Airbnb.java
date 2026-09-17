package com.app.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Airbnb {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String tag;
	private String title;
	private String location;
	private String country;
	private String state;
	private Integer price;
	private Double rating;
	private Integer reviews;
	private String image;
	private Boolean archived = false;

	@JsonIgnore
	@OneToMany(mappedBy = "airbnb")
	private List<Booking> bookings = new ArrayList<>();

	public Airbnb() {
	}

	public Airbnb(String tag, String title, String location, Integer price, Double rating, Integer reviews, String image) {
		this.tag = tag;
		this.title = title;
		this.location = location;
		this.price = price;
		this.rating = rating;
		this.reviews = reviews;
		this.image = image;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTag() {
		return tag;
	}

	public void setTag(String tag) {
		this.tag = tag;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getLocation() {
		return location;
	}

	public String getCountry() { return country; }
	public void setCountry(String country) { this.country = country; }
	public String getState() { return state; }
	public void setState(String state) { this.state = state; }

	public void setLocation(String location) {
		this.location = location;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}

	public Integer getReviews() {
		return reviews;
	}

	public void setReviews(Integer reviews) {
		this.reviews = reviews;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Boolean getArchived() { return archived; }
	public void setArchived(Boolean archived) { this.archived = archived; }

	public List<Booking> getBookings() {
		return bookings;
	}

	public void setBookings(List<Booking> bookings) {
		this.bookings = bookings;
	}

}
