package com.courier.resourceservice.objects.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "offices")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Office {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  @Builder.Default private boolean enabled = true;

  @CreationTimestamp private LocalDateTime createdAt;

  @UpdateTimestamp private LocalDateTime updatedAt;

  private LocalDateTime disabledAt;

  @OneToMany(mappedBy = "office", cascade = CascadeType.ALL)
  @ToString.Exclude
  private List<Branch> branches;

  @OneToMany(mappedBy = "office", cascade = CascadeType.ALL)
  @ToString.Exclude
  private List<Contact> contacts;
}
