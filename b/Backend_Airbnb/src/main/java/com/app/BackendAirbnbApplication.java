package com.app;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.app.model.Airbnb;
import com.app.model.Account;
import com.app.repository.AirbnbRepositoryInterface;
import com.app.repository.AccountRepositoryInterface;

@SpringBootApplication
public class BackendAirbnbApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendAirbnbApplication.class, args);
		System.out.println("Backend Airbnb Application is running...");
	}

	@Bean
	CommandLineRunner createPermanentAdmin(AccountRepositoryInterface accounts) {
		return args -> {
			if (accounts.findByEmailIgnoreCase("admin@airbnb.com").isEmpty()) {
				Account account = new Account();
				account.setName("Airbnb Administrator");
				account.setEmail("admin@airbnb.com");
				account.setPassword("admin123");
				account.setRole("ADMIN");
				account.setCreatedAt(java.time.LocalDateTime.now());
				accounts.save(account);
			}
		};
	}
}
