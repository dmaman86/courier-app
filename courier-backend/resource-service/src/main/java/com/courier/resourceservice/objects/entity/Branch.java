package com.courier.resourceservice.objects.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "branches")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Branch {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String city;
  private String address;

  @Builder.Default private boolean enabled = true;

  @CreationTimestamp private LocalDateTime createdAt;

  @UpdateTimestamp private LocalDateTime updatedAt;

  private LocalDateTime disabledAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_office", nullable = false)
  private Office office;

  @ManyToMany(mappedBy = "branches")
  @ToString.Exclude
  private List<Contact> contacts;
}
