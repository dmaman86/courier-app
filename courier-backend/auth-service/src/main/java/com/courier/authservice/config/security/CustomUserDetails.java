package com.courier.authservice.config.security;

import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.courier.authservice.objects.dto.UserDto;
import com.courier.authservice.objects.entity.UserCredential;

public class CustomUserDetails implements UserDetails {

  private Long id;
  private String fullName;
  private String email;
  private String phoneNumber;
  private String password;
  private Collection<? extends GrantedAuthority> authorities;
  private boolean enabled;

  public CustomUserDetails(UserDto userDto, UserCredential userCredential) {
    this.id = userDto.getId();
    this.fullName = userDto.getFullName();
    this.email = userDto.getEmail();
    this.phoneNumber = userDto.getPhoneNumber();
    this.password = userCredential.getPassword();
    this.authorities =
        userDto.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority(role.getName()))
            .collect(Collectors.toList());
    this.enabled = userCredential.isEnabled();
  }

  public CustomUserDetails(
      Long id,
      String fullName,
      String email,
      String phoneNumber,
      Collection<? extends GrantedAuthority> authorities) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.authorities = authorities;
    this.password = null;
    this.enabled = true;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return enabled;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return enabled;
  }

  public Long getId() {
    return id;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public String getFullName() {
    return fullName;
  }

  @Override
  public String toString() {
    return "CustomUserDetails{"
        + "id="
        + id
        + ", fullName='"
        + fullName
        + '\''
        + ", email='"
        + email
        + '\''
        + ", phoneNumber='"
        + phoneNumber
        + '\''
        + ", roles="
        + authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList())
        + ", enabled="
        + enabled
        + '}';
  }
}

// public class CustomUserDetails implements UserDetails {
//
//   private UserDto user;
//   private String password;
//   private boolean enabled;
//
//   public CustomUserDetails(UserDto user, UserCredential userCredential) {
//     this.user = user;
//     this.password = userCredential.getPassword();
//     this.enabled = userCredential.isEnabled();
//   }
//
//   public CustomUserDetails(UserDto user) {
//     this.user = user;
//     this.password = null;
//     this.enabled = true;
//   }
//
//   @Override
//   public Collection<? extends GrantedAuthority> getAuthorities() {
//     return user.getRoles().stream()
//         .map(role -> new SimpleGrantedAuthority(role.getName()))
//         .collect(Collectors.toList());
//   }
//
//   @Override
//   public String getPassword() {
//     return password;
//   }
//
//   @Override
//   public String getUsername() {
//     return user.getEmail();
//   }
//
//   @Override
//   public boolean isAccountNonExpired() {
//     return true;
//   }
//
//   @Override
//   public boolean isAccountNonLocked() {
//     return enabled;
//   }
//
//   @Override
//   public boolean isCredentialsNonExpired() {
//     return true;
//   }
//
//   @Override
//   public boolean isEnabled() {
//     return enabled;
//   }
//
//   public UserDto getUser() {
//     return user;
//   }
//
//   public Long getId() {
//     return user.getId();
//   }
//
//   public String getPhoneNumber() {
//     return user.getPhoneNumber();
//   }
//
//   public String getFullName() {
//     return user.getFullName();
//   }
//
//   @Override
//   public String toString() {
//     return "CustomUserDetails{" +
//            "id=" + user.getId() +
//            ", fullName='" + user.getFullName() + '\'' +
//            ", email='" + user.getEmail() + '\'' +
//            ", phoneNumber='" + user.getPhoneNumber() + '\'' +
//            ", roles=" +
// user.getRoles().stream().map(RoleDto::getName).collect(Collectors.toList()) +
//            ", enabled=" + enabled +
//            '}';
//   }
// }
