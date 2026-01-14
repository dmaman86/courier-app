package com.courier.errorservice.objects.entity;


import com.courier.errorservice.objects.enums.ErrorSeverity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "error_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String timestamp;
  private int status;
  private String error;
  private String message;
  private String exception;
  private String path;

  @Enumerated(EnumType.STRING)
  private ErrorSeverity severity;
}
