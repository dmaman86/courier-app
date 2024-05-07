package com.david.maman.errorserver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.errorserver.models.entity.ErrorLog;

public interface ErrorLogRepository extends JpaRepository<ErrorLog, Long>{

}
