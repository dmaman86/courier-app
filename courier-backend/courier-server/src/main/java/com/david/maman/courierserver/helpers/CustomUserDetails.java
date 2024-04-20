package com.david.maman.courierserver.helpers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.david.maman.courierserver.models.entities.Role;
import com.david.maman.courierserver.models.entities.User;

public class CustomUserDetails extends User implements UserDetails{

    private Long id;
    private String username;
    private String password;
    Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user){
        this.id = user.getId();
        this.username = user.getEmail();
        this.password = user.getPassword();
        List<GrantedAuthority> auths = new ArrayList<>();

        for(Role role : user.getRoles()){
            auths.add(new SimpleGrantedAuthority(role.getName()));
        }
        this.authorities = auths;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getUsername() {
        return username;
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

    @Override
    public Long getId(){
        return id;
    }

    @Override
    public void setId(Long id){
        this.id = id;
    }

    @Override
    public String toString() {
        return "CustomUserDetails [id=" + id + ", username=" + username + ", password=" + password + ", authorities="
                + authorities + "]";
    }
    
}
