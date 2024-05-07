package com.david.maman.authenticationserver.services;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.david.maman.authenticationserver.models.entities.ErrorLog;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ErrorLogService {

    private final WebClient webClient;

    public void reportError(ErrorLog errorLog) {
        webClient.post()
                 .uri("/error-logs")
                 .bodyValue(errorLog)
                 .retrieve()
                 .bodyToMono(Void.class)
                 .subscribe();
    }

}
