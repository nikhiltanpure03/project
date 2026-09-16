package com.app.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.model.Airbnb;
import com.app.model.Account;
import com.app.model.Booking;
import com.app.repository.AccountRepositoryInterface;
import com.app.repository.AirbnbRepositoryInterface;
import com.app.repository.BookingRepositoryInterface;

@Service
public class AirbnbServiceImplements implements AirbnbServiceInterface {

	@Autowired
	private AirbnbRepositoryInterface repository;

	@Autowired
	private BookingRepositoryInterface bookingRepository;

	@Autowired
	private AccountRepositoryInterface accountRepository;

	@Override
	public List<Airbnb> findAll() {
		return repository.findAll();
	}

	@Override
	public Airbnb findById(Integer id) {
		return repository.findById(id).orElse(null);
	}

	@Override
	public Booking createBooking(Booking booking) {
		booking.setId(null);
		Airbnb listing = repository.findById(booking.getListingId())
				.orElseThrow(() -> new IllegalArgumentException("Listing not found: " + booking.getListingId()));
		booking.setAirbnb(listing);
		booking.setListingTitle(listing.getTitle());
		booking.setCreatedAt(LocalDateTime.now());
		booking.setStatus("CONFIRMED");
		if (booking.getPayment() != null) {
			booking.getPayment().setStatus("PAID");
		}
		return bookingRepository.save(booking);
	}

	@Override
	public List<Booking> findAllBookings() {
		return bookingRepository.findAll();
	}

	@Override
	public Account createAccount(Account account) {
		account.setId(null);
		account.setCreatedAt(LocalDateTime.now());
		return accountRepository.save(account);
	}

	@Override
	public Account findAccountById(Integer id) {
		return accountRepository.findById(id).orElse(null);
	}

	@Override
	public Account authenticate(String email, String password) {
		Account account = accountRepository.findByEmail(email);
		return account != null && account.getPassword().equals(password) ? account : null;
	}

	@Override
	public boolean deleteBooking(Integer id) {
		if (!bookingRepository.existsById(id)) {
			return false;
		}
		bookingRepository.deleteById(id);
		return true;
	}

	@Override
	public Airbnb save(Airbnb listing) {
		listing.setId(null);
		return repository.save(listing);
	}

	@Override
	public Airbnb update(Integer id, Airbnb listing) {
		return repository.findById(id).map(current -> {
			current.setTag(listing.getTag());
			current.setTitle(listing.getTitle());
			current.setLocation(listing.getLocation());
			current.setPrice(listing.getPrice());
			current.setRating(listing.getRating());
			current.setReviews(listing.getReviews());
			current.setImage(listing.getImage());
			return repository.save(current);
		}).orElse(null);
	}

	@Override
	public boolean delete(Integer id) {
		if (!repository.existsById(id)) {
			return false;
		}
		repository.deleteById(id);
		return true;
	}
}
