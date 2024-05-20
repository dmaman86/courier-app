package com.david.maman.authenticationserver.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCredentialsPassword {
    private String email;
    private String phone;
    private String passwordOne;
    private String passwordTwo;
}
