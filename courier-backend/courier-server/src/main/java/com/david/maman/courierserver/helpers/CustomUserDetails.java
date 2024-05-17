package com.david.maman.courierserver.helpers;


import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.david.maman.courierserver.models.entities.User;

public class CustomUserDetails implements UserDetails{

    private User user;
    private String password;
    Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user, String password){
        this.user = user;
        this.password = password;
        this.authorities = user.getRoles().stream()
                                .map(role -> new SimpleGrantedAuthority(role.getName()))
                                .collect(Collectors.toList());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public String getPassword(){
        return password;
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

    public User getUser(){
        return user;
    }

    @Override
    public String toString() {
        return "CustomUserDetails [user=" + user + ", authorities=" + authorities + "]";
    }
    
}
