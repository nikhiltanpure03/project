package com.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.model.Account;

@Repository
public interface AccountRepositoryInterface extends JpaRepository<Account, Integer> {
	List<Account> findByEmailIgnoreCase(String email);
}
