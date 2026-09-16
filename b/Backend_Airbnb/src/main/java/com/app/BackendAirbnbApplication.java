package com.app;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.app.model.Airbnb;
import com.app.repository.AirbnbRepositoryInterface;

@SpringBootApplication
public class BackendAirbnbApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendAirbnbApplication.class, args);
		System.out.println("Backend Airbnb Application is running...");
	}
}
