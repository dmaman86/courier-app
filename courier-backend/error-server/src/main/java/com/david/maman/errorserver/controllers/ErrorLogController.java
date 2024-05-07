package com.david.maman.errorserver.controllers;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.david.maman.errorserver.models.entity.ErrorLog;
import com.david.maman.errorserver.repositories.ErrorLogRepository;

@RestController
@RequestMapping("/api/errors")
public class ErrorLogController {

    private static final Logger logger = LoggerFactory.getLogger(ErrorLogController.class);

    @Autowired
    private ErrorLogRepository errorLogRepository;

    @PostMapping("/error-logs")
    public ResponseEntity<?> logError(@RequestBody ErrorLog errorLog){
        
        errorLog.setTimestamp(LocalDateTime.now());
        logger.info("Error Log: {}", errorLog.toString());
        errorLogRepository.save(errorLog);
        return ResponseEntity.ok().build();
    }
}
