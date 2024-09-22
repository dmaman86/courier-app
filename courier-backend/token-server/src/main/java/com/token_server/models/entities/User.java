package com.token_server.models.entities;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private Long id;
    private String name;
    private String lastName;
    private String email;
    private String phone;
    private Boolean isActive;
    private Set<Role> roles;

}
