package com.app.service;

import java.util.List;

import com.app.model.Airbnb;
import com.app.model.Account;
import com.app.model.Booking;

public interface AirbnbServiceInterface {

	public List<Airbnb> findAll();

	public Airbnb findById(Integer id);

	public Booking createBooking(Booking booking);

	public List<Booking> findAllBookings();

	public Account createAccount(Account account);

	public Account findAccountById(Integer id);

	public Account authenticate(String email, String password);

	public boolean deleteBooking(Integer id);

	public Airbnb save(Airbnb listing);

	public Airbnb update(Integer id, Airbnb listing);

	public boolean delete(Integer id);

}
