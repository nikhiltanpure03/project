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
		return repository.findAll().stream().filter(listing -> !Boolean.TRUE.equals(listing.getArchived())).toList();
	}

	@Override
	public Airbnb findById(Integer id) {
		return repository.findById(id).filter(listing -> !Boolean.TRUE.equals(listing.getArchived())).orElse(null);
	}

	@Override
	public Booking createBooking(Booking booking) {
		booking.setId(null);
		if (booking.getAccountId() == null) {
			throw new IllegalArgumentException("Please sign in before booking");
		}
		Airbnb listing = repository.findById(booking.getListingId()).orElse(null);
		if (listing == null && booking.getListingData() != null) {
			listing = booking.getListingData();
			listing.setId(null);
			listing = repository.save(listing);
		}
		if (listing == null) {
			throw new IllegalArgumentException("Listing not found: " + booking.getListingId());
		}
		booking.setListingId(listing.getId());
		booking.setAirbnb(listing);
		booking.setListingTitle(listing.getTitle());
		booking.setListingLocation(listing.getLocation());
		booking.setListingState(listing.getState());
		booking.setListingCountry(listing.getCountry());
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
	public List<Booking> findBookingsByAccount(Integer accountId) {
		return bookingRepository.findByAccountId(accountId);
	}

	@Override
	public Account createAccount(Account account) {
		account.setId(null);
		account.setEmail(account.getEmail().trim().toLowerCase());
		if (!accountRepository.findByEmailIgnoreCase(account.getEmail()).isEmpty()) {
			throw new IllegalArgumentException("An account with this email already exists. Please sign in.");
		}
		if (account.getRole() == null || account.getRole().isBlank()) {
			account.setRole("USER");
		}
		account.setCreatedAt(LocalDateTime.now());
		return accountRepository.save(account);
	}

	@Override
	public Account findAccountById(Integer id) {
		return accountRepository.findById(id).orElse(null);
	}

	@Override
	public List<Account> findAllAccounts() {
		return accountRepository.findAll();
	}

	@Override
	public Account authenticate(String email, String password) {
		return accountRepository.findByEmailIgnoreCase(email.trim()).stream()
				.filter(account -> account.getPassword() != null && account.getPassword().equals(password))
				.findFirst()
				.orElse(null);
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
		listing.setArchived(false);
		return repository.save(listing);
	}

	@Override
	public Airbnb update(Integer id, Airbnb listing) {
		return repository.findById(id).map(current -> {
			current.setTag(listing.getTag());
			current.setTitle(listing.getTitle());
			current.setLocation(listing.getLocation());
			current.setCountry(listing.getCountry());
			current.setState(listing.getState());
			current.setPrice(listing.getPrice());
			current.setRating(listing.getRating());
			current.setReviews(listing.getReviews());
			current.setImage(listing.getImage());
			return repository.save(current);
		}).orElse(null);
	}

	@Override
	public boolean delete(Integer id) {
		return repository.findById(id).map(listing -> {
			listing.setArchived(true);
			repository.save(listing);
			return true;
		}).orElse(false);
	}
}
