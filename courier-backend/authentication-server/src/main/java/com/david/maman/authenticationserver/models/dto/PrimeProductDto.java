package com.david.maman.authenticationserver.models.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PrimeProductDto {

    private String product;
    private String phiProduct;
}
