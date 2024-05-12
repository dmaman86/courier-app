package com.david.maman.courierserver.exceptions;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;


@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class PublicKeyNotAvailableException extends RuntimeException{

    public PublicKeyNotAvailableException(String message){
        super(message);
    }

}
