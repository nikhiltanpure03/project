package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.model.Billing;

@Repository
public interface BillingRepositoryInterface extends JpaRepository<Billing, Integer> {
}
