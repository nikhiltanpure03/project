package com.app.contrller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.app.model.Airbnb;
import com.app.model.Account;
import com.app.model.Booking;
import com.app.service.AirbnbServiceInterface;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class HomeController {

	private final AirbnbServiceInterface service;

	public HomeController(AirbnbServiceInterface service) {
		this.service = service;
	}

	@GetMapping("/start")
	public String home() {
		return "Welcome to the Airbnb API!";
	}

	@GetMapping("/listings")
	public List<Airbnb> getAllListings() {
		return service.findAll();
	}

	@GetMapping("/listings/{id}")
	public ResponseEntity<Airbnb> getListingById(@PathVariable Integer id) {
		Airbnb listing = service.findById(id);
		return listing == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(listing);
	}

	@PostMapping("/bookings")
	public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.createBooking(booking));
	}

	@GetMapping("/bookings")
	public List<Booking> getAllBookings() {
		return service.findAllBookings();
	}

	@GetMapping("/accounts/{id}/bookings")
	public List<Booking> getAccountBookings(@PathVariable Integer id) {
		return service.findBookingsByAccount(id);
	}

	@DeleteMapping("/bookings/{id}")
	public ResponseEntity<Void> deleteBooking(@PathVariable Integer id) {
		return service.deleteBooking(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
	}

	@PostMapping("/accounts")
	public ResponseEntity<Account> createAccount(@RequestBody Account account) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.createAccount(account));
	}

	@GetMapping("/accounts/{id}")
	public ResponseEntity<Account> getAccount(@PathVariable Integer id) {
		Account account = service.findAccountById(id);
		return account == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(account);
	}

	@GetMapping("/accounts")
	public List<Account> getAllAccounts() {
		return service.findAllAccounts();
	}

	@PostMapping("/accounts/login")
	public ResponseEntity<Account> login(@RequestBody Account account) {
		Account authenticated = service.authenticate(account.getEmail(), account.getPassword());
		return authenticated == null ? ResponseEntity.status(HttpStatus.UNAUTHORIZED).build() : ResponseEntity.ok(authenticated);
	}

	@PostMapping("/listings")
	public ResponseEntity<Airbnb> createListing(@RequestBody Airbnb listing) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.save(listing));
	}

	@PutMapping("/listings/{id}")
	public ResponseEntity<Airbnb> updateListing(@PathVariable Integer id, @RequestBody Airbnb listing) {
		Airbnb updated = service.update(id, listing);
		return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
	}

	@DeleteMapping("/listings/{id}")
	public ResponseEntity<Void> deleteListing(@PathVariable Integer id) {
		return service.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<String> handleBadRequest(IllegalArgumentException exception) {
		return ResponseEntity.badRequest().body(exception.getMessage());
	}
}
