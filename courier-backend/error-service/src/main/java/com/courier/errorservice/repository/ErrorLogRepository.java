package com.courier.errorservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.courier.errorservice.objects.entity.ErrorLog;

public interface ErrorLogRepository extends JpaRepository<ErrorLog, Long> {}
