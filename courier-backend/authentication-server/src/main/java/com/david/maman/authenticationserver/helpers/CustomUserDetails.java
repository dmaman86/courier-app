package com.david.maman.authenticationserver.helpers;

import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.david.maman.authenticationserver.models.entities.UserCredentials;

public class CustomUserDetails implements UserDetails{
    
    private UserCredentials credentials;
    Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(UserCredentials credentials){
        this.credentials = credentials;
        this.authorities = credentials.getUser().getRoles().stream()
                                .map(role -> new SimpleGrantedAuthority(role.getName()))
                                .collect(Collectors.toList());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getUsername() {
        return credentials.getUser().getEmail();
    }

    @Override
    public String getPassword(){
        return credentials.getPassword();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public UserCredentials getCredentials(){
        return credentials;
    }

    @Override
    public String toString() {
        return "CustomUserDetails [credentials=" + credentials + ", authorities=" + authorities + "]";
    }

    
}
